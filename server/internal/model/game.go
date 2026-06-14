package model

// Game represents a game entry in the game center.
type Game struct {
	ID          string  `gorm:"primaryKey;size:36" json:"id"`
	Name        string  `gorm:"size:100;not null" json:"name"`
	Icon        string  `gorm:"size:500" json:"icon"`
	Description string  `gorm:"type:text" json:"description"`
	Tags        string  `gorm:"type:text" json:"tags"` // JSON array string, e.g. ["RPG","卡牌"]
	Rating      float64 `json:"rating"`
	Category    string  `gorm:"size:50" json:"category"`
	CreatedAt   int64   `json:"createdAt"`
	UpdatedAt   int64   `json:"updatedAt"`
}

// TableName overrides the default table name.
func (Game) TableName() string {
	return "games"
}