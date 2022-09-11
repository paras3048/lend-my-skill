package main

import (
	"fmt"
	"net/http"
	cors "revamp-backend/helpers"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.AddCorsHeader("*"))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	fmt.Println("Server Started on http://127.0.0.1:8080/")
	r.Run()
}
