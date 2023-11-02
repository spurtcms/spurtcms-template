package main

import (
	"os"
	"spurt-page-view/routes"
)

func main() {
	r := routes.SetupRoutes()

	r.Run(":"+os.Getenv("PORT"))

}