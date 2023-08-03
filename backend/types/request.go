package types

type RecommendationRequest struct {
	Prompt string `json:"prompt" binding:"required"`
}
