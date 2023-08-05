package models

import (
	"gorm.io/gorm"
)

type Playlist struct {
	gorm.Model
	Name   string  `gorm:"size:255;not null" json:"name"`
	Movies []Movie `gorm:"many2many:playlist_movies;" json:"movies"`
}

type Movie struct {
	gorm.Model
	Title       string `gorm:"size:255;not null" json:"title"`
	Description string `gorm:"size:1024;" json:"description"`
	Link        string `gorm:"size:1024;" json:"link"`
}
