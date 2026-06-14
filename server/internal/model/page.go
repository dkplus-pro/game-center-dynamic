package model

// Page represents a page schema in the game center.
// Pages define the structure/layout of a page using components.
type Page struct {
	ID        string `gorm:"primaryKey;size:36" json:"id"`
	Name      string `gorm:"size:100;not null" json:"name"`
	Slug      string `gorm:"size:100;uniqueIndex;not null" json:"slug"`
	Status    string `gorm:"size:20;default:draft" json:"status"` // draft, published, archived
	Version   int    `gorm:"default:1" json:"version"`
	CreatedAt int64  `json:"createdAt"`
	UpdatedAt int64  `json:"updatedAt"`
}

// TableName overrides the default table name.
func (Page) TableName() string {
	return "pages"
}

// PageComponent stores the components (layout tree) for a specific version of a page.
// Components is stored as a JSON string of the component array.
type PageComponent struct {
	ID         string `gorm:"primaryKey;size:36" json:"id"`
	PageID     string `gorm:"size:36;index;not null" json:"pageId"`
	Version    int    `gorm:"not null" json:"version"`
	Components string `gorm:"type:text" json:"components"` // JSON string of component array
	CreatedAt  int64  `json:"createdAt"`
}

// TableName overrides the default table name.
func (PageComponent) TableName() string {
	return "page_components"
}