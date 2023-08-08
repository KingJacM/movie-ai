package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Movie struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
	ImageLink   string `json:"imageLink,omitempty"` // new field
}

type OMDbResponse struct {
	Poster string `json:"Poster"`
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

func fetchPoster(title string, apiKey string) (string, error) {
	resp, err := http.Get(fmt.Sprintf("http://www.omdbapi.com/?t=%s&apikey=%s", title, apiKey))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var omdbResp OMDbResponse
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	err = json.Unmarshal(body, &omdbResp)
	if err != nil {
		return "", err
	}

	return omdbResp.Poster, nil
}

func GetRecommendations(c *gin.Context) {
	var request RecommendationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request.Prompt += ". Please provide 9 recommendations in json format of {'movies': [objects]}, in which each object has: 'title: movie title, description: movie description with reason why it matches my request, link: movie link'. Do not return anything else other than json in the form of {'movies': [objects]} an do not return in code snippet)"

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
		fmt.Println("Error creating request to OpenAI:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating request to OpenAI."})
		return
	}

	req, err := http.NewRequest("POST", "https://api.openai-proxy.com/v1/chat/completions", bytes.NewBuffer(reqBytes))
	if err != nil {
		fmt.Println("Error creating request to OpenAI:", err)
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
		fmt.Printf("%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading response from OpenAI."})
		return
	}

	var aiResp OpenAIResponse
	err = json.Unmarshal(body, &aiResp)
	if err != nil {
		fmt.Printf("%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing response from OpenAI. It could be because GPT has returned unexpected content, please try again or see console for more details", "content": aiResp.Choices})
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
		fmt.Printf("%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing movie data. It could be because GPT has returned unexpected content, please try again or see console for more details", "content": aiResp.Choices})
		return
	}

	// Fetch movie posters for each movie concurrently
	omdbApiKey := "b656f347"
	var wg sync.WaitGroup
	results := make(chan struct {
		index int
		url   string
	}, len(movieResponse.Movies))

	for i, movie := range movieResponse.Movies {
		wg.Add(1)
		go func(i int, title string) {
			defer wg.Done()

			posterURL, err := fetchPoster(title, omdbApiKey)
			if err != nil {
				fmt.Printf("Error fetching poster for %s: %v", title, err)
				return
			}
			results <- struct {
				index int
				url   string
			}{i, posterURL}
		}(i, movie.Title)
	}

	// Wait for all goroutines to finish
	go func() {
		wg.Wait()
		close(results)
	}()

	for res := range results {
		movieResponse.Movies[res.index].ImageLink = res.url
	}

	c.JSON(http.StatusOK, movieResponse)
}
