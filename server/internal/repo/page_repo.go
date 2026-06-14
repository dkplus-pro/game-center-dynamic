package repo

import (
	"game-center-dynamic/server/internal/model"

	"gorm.io/gorm"
)

// PageRepo handles database operations for pages and page components.
type PageRepo struct {
	db *gorm.DB
}

// NewPageRepo creates a new PageRepo.
func NewPageRepo(db *gorm.DB) *PageRepo {
	return &PageRepo{db: db}
}

// List returns all non-archived pages, ordered by creation time descending.
func (r *PageRepo) List() ([]model.Page, error) {
	var pages []model.Page
	err := r.db.Where("status != ?", "archived").Order("created_at DESC").Find(&pages).Error
	return pages, err
}

// GetBySlug finds a page by its slug.
func (r *PageRepo) GetBySlug(slug string) (*model.Page, error) {
	var page model.Page
	err := r.db.Where("slug = ? AND status != ?", slug, "archived").First(&page).Error
	if err != nil {
		return nil, err
	}
	return &page, nil
}

// GetByID finds a page by its ID.
func (r *PageRepo) GetByID(id string) (*model.Page, error) {
	var page model.Page
	err := r.db.Where("id = ?", id).First(&page).Error
	if err != nil {
		return nil, err
	}
	return &page, nil
}

// Create inserts a new page.
func (r *PageRepo) Create(page *model.Page) error {
	return r.db.Create(page).Error
}

// Update saves all fields of the page.
func (r *PageRepo) Update(page *model.Page) error {
	return r.db.Save(page).Error
}

// SoftDelete sets the page status to "archived".
func (r *PageRepo) SoftDelete(id string) error {
	return r.db.Model(&model.Page{}).Where("id = ?", id).Update("status", "archived").Error
}

// GetComponents returns all component versions for a page, ordered by version desc.
func (r *PageRepo) GetComponents(pageID string) ([]model.PageComponent, error) {
	var components []model.PageComponent
	err := r.db.Where("page_id = ?", pageID).Order("version DESC").Find(&components).Error
	return components, err
}

// CreateComponent inserts a new component version.
func (r *PageRepo) CreateComponent(comp *model.PageComponent) error {
	return r.db.Create(comp).Error
}