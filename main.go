package main

import (
	"spurt-page-view/routes"

)

func main() {
	r := routes.SetupRoutes()

	r.Run()

}