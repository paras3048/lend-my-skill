package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	username      string
	password      string
	email         string
	verified      bool
	emailVerified bool
	phoneNumber   string
	upiId         string
	profileUrl    string
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	DATABASEURL := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(DATABASEURL), &gorm.Config{})
	db.AutoMigrate(&User{})
	db.Create(&User{
		username: "hello",
	})
	data := db.First(&User{
		username: "hello",
	}, 1)
	fmt.Println(data)

}
