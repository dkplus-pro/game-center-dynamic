package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"game-center-dynamic/server/internal/model"
	"game-center-dynamic/server/internal/repo"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PageService contains business logic for pages.
type PageService struct {
	pageRepo *repo.PageRepo
	gameRepo *repo.GameRepo
}

// NewPageService creates a new PageService.
func NewPageService(pageRepo *repo.PageRepo, gameRepo *repo.GameRepo) *PageService {
	return &PageService{pageRepo: pageRepo, gameRepo: gameRepo}
}

// ListPages returns all non-archived pages.
func (s *PageService) ListPages() ([]model.Page, error) {
	return s.pageRepo.List()
}

// GetPage returns a page by slug. If resolve is true, component dataSource
// references are resolved and embedded into the components.
func (s *PageService) GetPage(slug string, resolve bool) (map[string]interface{}, error) {
	page, err := s.pageRepo.GetBySlug(slug)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("page not found: %s", slug)
		}
		return nil, err
	}

	result := map[string]interface{}{
		"id":        page.ID,
		"name":      page.Name,
		"slug":      page.Slug,
		"status":    page.Status,
		"version":   page.Version,
		"createdAt": page.CreatedAt,
		"updatedAt": page.UpdatedAt,
	}

	if resolve {
		components, err := s.pageRepo.GetComponents(page.ID)
		if err != nil || len(components) == 0 {
			result["components"] = []interface{}{}
			return result, nil
		}

		// Parse the latest component version
		var compList []map[string]interface{}
		if err := json.Unmarshal([]byte(components[0].Components), &compList); err != nil {
			result["components"] = []interface{}{}
			return result, nil
		}

		// Resolve each component's dataSource
		resolved, err := s.resolveComponents(compList)
		if err != nil {
			return nil, err
		}
		result["components"] = resolved
	} else {
		result["components"] = []interface{}{}
	}

	return result, nil
}

func (s *PageService) resolveComponents(components []map[string]interface{}) ([]map[string]interface{}, error) {
	for i, comp := range components {
		props, ok := comp["props"].(map[string]interface{})
		if !ok {
			continue
		}

		dataSource, ok := props["dataSource"].(map[string]interface{})
		if !ok {
			continue
		}

		dsType, _ := dataSource["type"].(string)
		switch dsType {
		case "filter":
			tags, _ := dataSource["tags"].(string)
			sortBy, _ := dataSource["sortBy"].(string)
			limit := 10
			if l, ok := dataSource["limit"].(float64); ok {
				limit = int(l)
			}
			games, err := s.gameRepo.List(tags, sortBy, limit)
			if err != nil {
				return nil, fmt.Errorf("resolve filter: %w", err)
			}
			components[i]["resolvedData"] = gameListToMaps(games)

		case "manual":
			idsRaw, ok := dataSource["ids"].([]interface{})
			if !ok {
				continue
			}
			ids := make([]string, len(idsRaw))
			for j, id := range idsRaw {
				ids[j] = fmt.Sprint(id)
			}
			games, err := s.gameRepo.BatchGet(ids)
			if err != nil {
				return nil, fmt.Errorf("resolve manual: %w", err)
			}
			components[i]["resolvedData"] = gameListToMaps(games)
		}
	}
	return components, nil
}

// CreatePage creates a new page with the given name and slug.
func (s *PageService) CreatePage(name, slug string) (*model.Page, error) {
	now := time.Now().UnixMilli()
	page := &model.Page{
		ID:        uuid.New().String(),
		Name:      name,
		Slug:      slug,
		Status:    "draft",
		Version:   1,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := s.pageRepo.Create(page); err != nil {
		return nil, err
	}

	// Create empty component version
	comp := &model.PageComponent{
		ID:         uuid.New().String(),
		PageID:     page.ID,
		Version:    1,
		Components: "[]",
		CreatedAt:  now,
	}
	if err := s.pageRepo.CreateComponent(comp); err != nil {
		return nil, err
	}

	return page, nil
}

// UpdatePage updates an existing page.
func (s *PageService) UpdatePage(input model.Page) (*model.Page, error) {
	existing, err := s.pageRepo.GetByID(input.ID)
	if err != nil {
		return nil, err
	}

	existing.Name = input.Name
	existing.Slug = input.Slug
	existing.UpdatedAt = time.Now().UnixMilli()

	// If components are provided, create a new component version
	if input.ID != "" {
		components, err := s.pageRepo.GetComponents(input.ID)
		if err == nil && len(components) > 0 {
			existing.Version = components[0].Version + 1
		}
	}

	if err := s.pageRepo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

// PublishPage sets the page status to "published".
func (s *PageService) PublishPage(pageID string) error {
	page, err := s.pageRepo.GetByID(pageID)
	if err != nil {
		return err
	}
	page.Status = "published"
	page.UpdatedAt = time.Now().UnixMilli()
	return s.pageRepo.Update(page)
}

// DeletePage soft-deletes a page by setting its status to "archived".
func (s *PageService) DeletePage(pageID string) error {
	return s.pageRepo.SoftDelete(pageID)
}

// gameListToMaps converts a slice of Game models to a slice of maps for JSON serialization.
func gameListToMaps(games []model.Game) []map[string]interface{} {
	result := make([]map[string]interface{}, len(games))
	for i, g := range games {
		var tags []string
		json.Unmarshal([]byte(g.Tags), &tags)
		result[i] = map[string]interface{}{
			"id":          g.ID,
			"name":        g.Name,
			"icon":        g.Icon,
			"description": g.Description,
			"tags":        tags,
			"rating":      g.Rating,
			"category":    g.Category,
			"createdAt":   g.CreatedAt,
			"updatedAt":   g.UpdatedAt,
		}
	}
	return result
}