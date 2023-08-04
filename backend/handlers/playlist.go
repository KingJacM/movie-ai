// ./handlers/playlist.go
package handlers

import (
	"movie-recommendations/db"
	"movie-recommendations/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PlaylistRequest struct {
	Name   string         `json:"name"`
	Movies []models.Movie `json:"movies"`
}

func CreatePlaylist(c *gin.Context) {
	var req PlaylistRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Connect to the database
	dbConn, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not connect to the database"})
		return
	}

	// Create playlist
	playlist := models.Playlist{
		Name:   req.Name,
		Movies: req.Movies,
	}

	dbConn.Create(&playlist)

	c.JSON(http.StatusCreated, gin.H{"data": playlist})
}

func GetPlaylists(c *gin.Context) {
	// Connect to the database
	dbConn, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not connect to the database"})
		return
	}

	var playlists []models.Playlist
	dbConn.Preload("Movies").Find(&playlists)

	c.JSON(http.StatusOK, gin.H{"data": playlists})
}

func GetSinglePlaylist(c *gin.Context) {
	// Connect to the database
	dbConn, err := db.ConnectDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not connect to the database"})
		return
	}

	var playlist models.Playlist
	id := c.Param("id")

	dbConn.Preload("Movies").First(&playlist, id)
	c.JSON(http.StatusOK, gin.H{"data": playlist})
}
