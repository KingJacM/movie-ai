package db

import (
	"fmt"
	"movie-recommendations/models"
	"net/url"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() (*gorm.DB, error) {
	er := godotenv.Load()
	if er != nil {
		fmt.Println("Error loading .env file")
	}

	connectionURL := os.Getenv("DATABASE_URL") // Assuming DATABASE_URL is the name of your env variable containing the URL
	parsedURL, err := url.Parse(connectionURL)
	if err != nil {
		return nil, err
	}

	password, _ := parsedURL.User.Password()
	host := parsedURL.Hostname()
	user := parsedURL.User.Username()
	dbname := parsedURL.Path[1:] // Trim the leading "/"

	dsn := fmt.Sprintf("host=%s user=%s dbname=%s password=%s sslmode=require", host, user, dbname, password)
	var connectionErr error
	DB, connectionErr = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if connectionErr != nil {
		return DB, connectionErr
	}
	DB.AutoMigrate(&models.Playlist{}, &models.Movie{})
	return DB, nil
}

func CloseDB() {
	db, err := DB.DB()
	if err != nil {
		fmt.Printf("Error while getting underlying db from GORM: %v", err)
		return // Exit the function if there's an error
	}
	err = db.Close()
	if err != nil {
		fmt.Printf("Error while closing the database connection: %v", err)
	}
}
