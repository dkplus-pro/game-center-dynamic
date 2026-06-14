package service

import (
	"game-center-dynamic/server/internal/repo"
)

// GameService contains business logic for games.
type GameService struct {
	gameRepo *repo.GameRepo
}

// NewGameService creates a new GameService.
func NewGameService(gameRepo *repo.GameRepo) *GameService {
	return &GameService{gameRepo: gameRepo}
}

// ListGames returns games with optional filtering, sorting, and limiting.
func (s *GameService) ListGames(tags string, sortBy string, limit int) ([]map[string]interface{}, error) {
	games, err := s.gameRepo.List(tags, sortBy, limit)
	if err != nil {
		return nil, err
	}
	return gameListToMaps(games), nil
}

// BatchGetGames returns games by their IDs.
func (s *GameService) BatchGetGames(ids []string) ([]map[string]interface{}, error) {
	games, err := s.gameRepo.BatchGet(ids)
	if err != nil {
		return nil, err
	}
	return gameListToMaps(games), nil
}

// ListTags returns all unique tags across all games.
func (s *GameService) ListTags() ([]string, error) {
	return s.gameRepo.ListTags()
}