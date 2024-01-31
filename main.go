package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"spurt-page-view/config"
	"spurt-page-view/controller"
	"spurt-page-view/routes"
)

func Readjson() map[string]interface{} {

	// Open our jsonFile
	jsonFile, err := os.Open("config.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Successfully Opened config.json")
	// defer the closing of our jsonFile so that we can parse it later on

	defer jsonFile.Close()

	// read our opened jsonFile as a byte array.
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var result map[string]interface{}

	json.Unmarshal([]byte(byteValue), &result)

	return result
}

func main() {

	result := Readjson()

	controller.GetTheme(result["theme"].(string))

	controller.DBIns = config.SetupDB()

	r := routes.SetupRoutes()

	r.Run(":" + os.Getenv("PORT"))

}
