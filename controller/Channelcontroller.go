package controller

import (
	"fmt"
	"html/template"
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/spurtcms/pkgcontent/categories"
	"github.com/spurtcms/pkgcontent/channels"
)

var channelAuth channels.Channel

var Categories categories.Category

type Entriess struct {
	Id          int
	Title       string
	Slug        string
	Content     string
	Author      string
	CreatedDate string
	Categories  string
	ImagePath   string
}

func EntriesList(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/list.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/blog.html")

	if err != nil {

		log.Fatal(err)
	}

	channelAuth.Authority = &Auth1

	Categories.Authority = &Auth1

	log.Println(c.Param("channelname"))

	Entries, _, _ := channelAuth.GetPublishedChannelEntriesListForTemplate(1000, 0, channels.EntriesFilter{ChannelName: c.Param("channelname")})

	var EntriesDeatils []Entriess

	for _, val := range Entries {

		// fmt.Println(val)

		var entry Entriess

		entry.Id = val.Id

		entry.Title = val.Title

		entry.Slug = strings.ReplaceAll(strings.ToLower(val.Title), " ", "_")

		entry.Content = val.Description

		entry.CreatedDate = val.CreatedOn.In(TZONE).Format("January 02, 2006")

		fmt.Println("check--", val.CategoriesId)

		// Catego, _ := Categories.GetParentGivenByChildId(val.CategoriesId)

		// fmt.Println(Catego)

		entry.Author = val.Username

		if os.Getenv("DOMAIN_URL") == "" {

			entry.ImagePath = os.Getenv("LOCAL_URL") + val.CoverImage

		} else {

			entry.ImagePath = os.Getenv("DOMAIN_URL") + val.CoverImage
		}

		EntriesDeatils = append(EntriesDeatils, entry)

	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Entries": EntriesDeatils})

}

func EntriesDetails(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/blogdetails.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{})
}
