package repo

import (
	"strings"

	"game-center-dynamic/server/internal/model"

	"gorm.io/gorm"
)

// GameRepo handles database operations for games.
type GameRepo struct {
	db *gorm.DB
}

// NewGameRepo creates a new GameRepo.
func NewGameRepo(db *gorm.DB) *GameRepo {
	return &GameRepo{db: db}
}

// List returns games, optionally filtered by tags, sorted, and limited.
// tags is a comma-separated string; games matching ANY tag are returned.
func (r *GameRepo) List(tags string, sortBy string, limit int) ([]model.Game, error) {
	query := r.db.Model(&model.Game{})

	if tags != "" {
		tagList := strings.Split(tags, ",")
		conditions := make([]string, 0, len(tagList))
		args := make([]interface{}, 0, len(tagList))
		for _, t := range tagList {
			t = strings.TrimSpace(t)
			if t == "" {
				continue
			}
			conditions = append(conditions, "tags LIKE ?")
			args = append(args, "%\""+t+"\"%")
		}
		if len(conditions) > 0 {
			query = query.Where(strings.Join(conditions, " OR "), args...)
		}
	}

	switch sortBy {
	case "rating":
		query = query.Order("rating DESC")
	case "name":
		query = query.Order("name ASC")
	default:
		query = query.Order("created_at DESC")
	}

	if limit > 0 {
		query = query.Limit(limit)
	}

	var games []model.Game
	err := query.Find(&games).Error
	return games, err
}

// BatchGet returns games by their IDs.
func (r *GameRepo) BatchGet(ids []string) ([]model.Game, error) {
	var games []model.Game
	err := r.db.Where("id IN ?", ids).Find(&games).Error
	return games, err
}

// ListTags returns all distinct tags across all games.
// Tags are stored as JSON arrays in the database.
func (r *GameRepo) ListTags() ([]string, error) {
	var games []model.Game
	err := r.db.Select("tags").Find(&games).Error
	if err != nil {
		return nil, err
	}

	tagSet := make(map[string]struct{})
	for _, g := range games {
		// Tags is stored as JSON like ["RPG","卡牌"]
		// Simple extraction: remove brackets and quotes, split by comma
		s := strings.Trim(g.Tags, "[]")
		if s == "" {
			continue
		}
		parts := strings.Split(s, ",")
		for _, p := range parts {
			p = strings.Trim(p, ` "`)
			if p != "" {
				tagSet[p] = struct{}{}
			}
		}
	}

	tags := make([]string, 0, len(tagSet))
	for t := range tagSet {
		tags = append(tags, t)
	}
	return tags, nil
}