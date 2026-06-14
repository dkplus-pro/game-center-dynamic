package main

import (
	"log"

	"game-center-dynamic/server/internal/db"
	"game-center-dynamic/server/internal/handler"
	"game-center-dynamic/server/internal/repo"
	"game-center-dynamic/server/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db.Init("data/game_center.db")
	defer db.Close()

	// Initialize layers: repo → service → handler
	pageRepo := repo.NewPageRepo(db.DB)
	gameRepo := repo.NewGameRepo(db.DB)

	pageSvc := service.NewPageService(pageRepo, gameRepo)
	gameSvc := service.NewGameService(gameRepo)

	pageHandler := handler.NewPageHandler(pageSvc)
	gameHandler := handler.NewGameHandler(gameSvc)

	// Setup Gin router
	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080", "http://localhost:8081"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// API routes
	api := r.Group("/api")
	{
		// Page routes
		api.GET("/pages", pageHandler.ListPages)
		api.GET("/pages/:slug", pageHandler.GetPage)
		api.POST("/pages", pageHandler.CreatePage)
		api.PUT("/pages/:id", pageHandler.UpdatePage)
		api.POST("/pages/:id/publish", pageHandler.PublishPage)
		api.DELETE("/pages/:id", pageHandler.DeletePage)

		// Game routes
		api.GET("/games", gameHandler.ListGames)
		api.GET("/games/batch", gameHandler.BatchGetGames)
		api.GET("/game-tags", gameHandler.ListTags)
	}

	log.Println("Server starting on :3000")
	if err := r.Run(":3000"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}