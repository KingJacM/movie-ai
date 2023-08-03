package main

import (
	"movie-recommendations/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true                            // Allow all origins
	config.AllowMethods = []string{"GET", "POST"}            // Specify what methods should be allowed
	config.AllowHeaders = []string{"Origin", "Content-Type"} // Specify what headers should be allowed

	r.Use(cors.New(config))
	api := r.Group("/api")
	{
		api.POST("/recommendations", handlers.GetRecommendations)
	}

	r.Run() // listen and serve on 0.0.0.0:8080
}
