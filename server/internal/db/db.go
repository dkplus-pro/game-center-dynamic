package db

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB is the global database connection instance.
var DB *gorm.DB

// Init opens a SQLite connection with GORM and performs auto-migration + seed.
func Init(dsn string) {
	var err error
	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	if err := Migrate(DB); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
}

// Close closes the underlying SQLite connection.
func Close() {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}