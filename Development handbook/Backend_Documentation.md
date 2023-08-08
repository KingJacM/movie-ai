# Backend Documentation

## Table of Contents

1. Introduction
2. System Architecture
3. Development Process
4. Features and Endpoints
5. Database Schema
6. Deployment Process
7. Error Handling
8. Third-party Integrations
9. Security Considerations
10. Testing
11. Future Improvements
12. Appendix
13. References

## 1. Introduction

- **Purpose**: This is the Golang backend with Gin and GORM framework, for the Movie Recommendation App powered by GPT API.

## 2. System Architecture

- **Overview**
  ![Alt text](image.png)

## 3. Development Process

### Enviroment Setup

Install Go, set up main.go, run go mod init with name or github url. Implement Gin framework `"github.com/gin-gonic/gin"`

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	config.AllowMethods = []string{"GET", "POST"}            // Specify what methods should be allowed
	config.AllowHeaders = []string{"Origin", "Content-Type"} // Specify what headers should be allowed

	api := r.Group("/api")
	{
		api.POST("/recommendations", handlers.GetRecommendations)
		api.POST("/playlists", handlers.CreatePlaylist) // Create playlist
		api.GET("/playlists", handlers.GetPlaylists)
		api.GET("/playlists/:id", handlers.GetSinglePlaylist)

	}

	r.Run() // listen and serve on 0.0.0.0:8080
}

```

Implement handlers in separate folder called handler, name the file `package handlers`, so other files could access by `movie-recommendation/handlers`, 

## 4. Features and Endpoints

For each feature, provide:

- **Endpoint**: URL and HTTP method.
- **Description**: Brief about what the endpoint does.
- **Request Parameters**: Required parameters and their types.
- **Response**: What's returned to the client.
- **Errors**: Possible error messages and their meanings.

## 5. Database Schema

- **Overview**: Type of the database used (SQL, NoSQL).
- **Tables/Collections**: For each table/collection, list fields, types, and relationships (if applicable).
- **ER Diagram**: A diagram illustrating the relations (for relational databases).

## 6. Deployment Process

- **Hosting**: Where is the backend hosted (e.g., AWS, Heroku)?
- **Steps**: Detailed steps for deploying new changes.
- **Configuration Management**: Managing environment variables, secrets, etc.

## 7. Error Handling

- **Standard Error Format**: How errors are sent back to clients.
- **Logging**: Tools used for logging errors, info, etc.

## 8. Third-party Integrations

List and describe any third-party services the backend integrates with, such as:

- Payment gateways
- Email services
- Cloud storage
- Others

## 9. Security Considerations

- **Authentication and Authorization**: Methods and tools used (e.g., JWT, OAuth).
- **Data Protection**: Steps taken to ensure data safety (e.g., encryption at rest).
- **Rate Limiting**: If implemented to prevent abuse.

## 10. Testing

- **Methodology**: Unit, Integration, E2E testing methods.
- **Tools**: Libraries and tools used for testing (e.g., Jest, Mocha).
- **Coverage**: Code coverage goals and current status.

## 11. Future Improvements

A list of planned or desired improvements and features for the backend.

## 12. Appendix

Any additional info, scripts, or tools that don't fit into the main sections.

## 13. References

List of references, articles, tools, or libraries referred to during development.

Remember, while this is a comprehensive template, it's important to tailor the documentation to your specific project and its needs. Good documentation is clear, concise, and easy for the reader to understand.
