package handler

import (
	"net/http"
	"strconv"
	"strings"

	"game-center-dynamic/server/internal/service"

	"github.com/gin-gonic/gin"
)

// GameHandler handles HTTP requests for game operations.
type GameHandler struct {
	svc *service.GameService
}

// NewGameHandler creates a new GameHandler.
func NewGameHandler(svc *service.GameService) *GameHandler {
	return &GameHandler{svc: svc}
}

// ListGames handles GET /api/games
func (h *GameHandler) ListGames(c *gin.Context) {
	tags := c.Query("tags")
	sortBy := c.Query("sortBy")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	games, err := h.svc.ListGames(tags, sortBy, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": games})
}

// BatchGetGames handles GET /api/games/batch?ids=id1,id2,id3
func (h *GameHandler) BatchGetGames(c *gin.Context) {
	idsParam := c.Query("ids")
	if idsParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ids parameter is required"})
		return
	}
	ids := strings.Split(idsParam, ",")
	for i := range ids {
		ids[i] = strings.TrimSpace(ids[i])
	}

	games, err := h.svc.BatchGetGames(ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": games})
}

// ListTags handles GET /api/game-tags
func (h *GameHandler) ListTags(c *gin.Context) {
	tags, err := h.svc.ListTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": tags})
}