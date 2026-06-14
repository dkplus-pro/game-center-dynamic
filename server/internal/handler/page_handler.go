package handler

import (
	"net/http"
	"strconv"

	"game-center-dynamic/server/internal/model"
	"game-center-dynamic/server/internal/service"

	"github.com/gin-gonic/gin"
)

// PageHandler handles HTTP requests for page operations.
type PageHandler struct {
	svc *service.PageService
}

// NewPageHandler creates a new PageHandler.
func NewPageHandler(svc *service.PageService) *PageHandler {
	return &PageHandler{svc: svc}
}

// ListPages handles GET /api/pages
func (h *PageHandler) ListPages(c *gin.Context) {
	pages, err := h.svc.ListPages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if pages == nil {
		pages = []model.Page{}
	}
	c.JSON(http.StatusOK, gin.H{"data": pages})
}

// GetPage handles GET /api/pages/:slug
func (h *PageHandler) GetPage(c *gin.Context) {
	slug := c.Param("slug")
	resolve, _ := strconv.ParseBool(c.DefaultQuery("resolve", "false"))

	page, err := h.svc.GetPage(slug, resolve)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": page})
}

// CreatePage handles POST /api/pages
func (h *PageHandler) CreatePage(c *gin.Context) {
	var body struct {
		Name string `json:"name" binding:"required"`
		Slug string `json:"slug" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	page, err := h.svc.CreatePage(body.Name, body.Slug)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": page})
}

// UpdatePage handles PUT /api/pages/:id
func (h *PageHandler) UpdatePage(c *gin.Context) {
	id := c.Param("id")
	var body model.Page
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	body.ID = id

	page, err := h.svc.UpdatePage(body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": page})
}

// PublishPage handles POST /api/pages/:id/publish
func (h *PageHandler) PublishPage(c *gin.Context) {
	id := c.Param("id")
	if err := h.svc.PublishPage(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": true})
}

// DeletePage handles DELETE /api/pages/:id
func (h *PageHandler) DeletePage(c *gin.Context) {
	id := c.Param("id")
	if err := h.svc.DeletePage(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": true})
}