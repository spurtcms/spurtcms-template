package controller

import "log"

var Template string

var flg bool

func GetTheme(themename string) {

	if themename == "" {

		log.Println("Config theme name is empty")

	}

	Template = themename

}
