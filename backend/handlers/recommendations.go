package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Movie struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
}

type MovieResponse struct {
	Movies []Movie `json:"movies"`
}

type RecommendationRequest struct {
	Prompt string `json:"prompt"`
}

type OpenAIResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func GetRecommendations(c *gin.Context) {
	var request RecommendationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request.Prompt += " Please provide 9 recommendations in the list of json format, in which each object has: 'title: movie title, description: movie description with reason why it matches my request, link: movie link'. Do not return anything else other than json(not in code snippet)"

	reqBody := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{
				"role":    "system",
				"content": "You are a helpful assistant.",
			},
			{
				"role":    "user",
				"content": request.Prompt,
			},
		},
	}
	reqBytes, err := json.Marshal(reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating request to OpenAI."})
		return
	}

	req, err := http.NewRequest("POST", "https://api.openai-proxy.com/v1/chat/completions", bytes.NewBuffer(reqBytes))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating request to OpenAI."})
		return
	}

	er := godotenv.Load()
	if er != nil {
		fmt.Println("Error loading .env file")
	}

	apiKey := os.Getenv("API_KEY")

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting recommendation."})
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading response from OpenAI."})
		return
	}

	var aiResp OpenAIResponse
	err = json.Unmarshal(body, &aiResp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing response from OpenAI."})
		return
	}
	fmt.Printf("%v", aiResp.Choices)
	if len(aiResp.Choices) == 0 || aiResp.Choices[0].Message.Content == "" {
		fmt.Printf("%v", aiResp.Choices)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No recommendation found."})
		return
	}

	// As OpenAI returns stringified JSON in response, unmarshal it into the appropriate structure
	var movieResponse MovieResponse
	err = json.Unmarshal([]byte(aiResp.Choices[0].Message.Content), &movieResponse)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing movie data."})
		return
	}

	c.JSON(http.StatusOK, movieResponse)
}
