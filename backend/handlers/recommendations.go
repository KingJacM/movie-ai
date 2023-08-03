package handlers

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"movie-recommendations/types"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"
)

type Movie struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
}

func GetRecommendations(c *gin.Context) {
	var request types.RecommendationRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Append your request with specific instructions
	request.Prompt += " Please provide 9 recommendations in the following format: 'title: movie title, description: movie description and reason it matches my request, link: movie link'."

	client := openai.NewClient("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")

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: request.Prompt,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting recommendation."})
		return
	}

	if len(resp.Choices) == 0 || resp.Choices[0].Message.Content == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No recommendation found."})
		return
	}
	// Split the returned content by comma
	parts := strings.Split(resp.Choices[0].Message.Content, ",")

	if len(parts) != 3 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid recommendation format."})
		return
	}

	// Extract the movie information
	movie := Movie{
		Title:       strings.TrimPrefix(strings.TrimSpace(parts[0]), "title:"),
		Description: strings.TrimPrefix(strings.TrimSpace(parts[1]), "description:"),
		Link:        strings.TrimPrefix(strings.TrimSpace(parts[2]), "link:"),
	}

	c.JSON(http.StatusOK, movie)
}
