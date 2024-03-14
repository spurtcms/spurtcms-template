package controller

import (
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"text/template"

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
	Categories  []Category
	ImagePath   string
}

type Category struct {
	Id           int
	CategoryName string
}

type EntrieDet struct {
	Content     string
	CreatedDate string
	ReadTime    string
	ViewCount   string
	Author      string
	Categories  []Category
}

func EntriesList(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/list.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/index.html")

	if err != nil {

		log.Fatal(err)
	}

	categoryid := c.Query("category")

	catid, _ := strconv.Atoi(categoryid)

	channelAuth.Authority = &Auth1

	TblChannel, err := channelAuth.GetchannelByName("Default")

	category, _ := channelAuth.GetChannelCategoryByIdTemplates(TblChannel.Id)

	var Cate []Category

	for _, val := range category {

		var singcat Category

		for i, val2 := range val {

			singcat.Id = val2.Id

			if len(val) == i+1 {

				singcat.CategoryName += val2.Category

			} else {

				singcat.CategoryName += val2.Category + " / "
			}

		}
		Cate = append(Cate, singcat)
	}

	log.Println(Cate)

	Categories.Authority = &Auth1

	Entries, _, _ := channelAuth.GetPublishedChannelEntriesListForTemplate(1000, 0, channels.EntriesFilter{ChannelName: "Default", CategoryId: categoryid})

	var EntriesDeatils []Entriess

	for _, val := range Entries {

		var entry Entriess

		entry.Id = val.Id

		entry.Title = val.Title

		entry.Slug = strings.ReplaceAll(regexp.MustCompile(`[^a-zA-Z0-9 ]+`).ReplaceAllString(strings.ToLower(val.Title), ""), " ", "_")

		const Template = `(<\/?[a-zA-A]+?[^>]*\/?>)*`

		r := regexp.MustCompile(Template)

		Trimstring := r.ReplaceAllString(val.Description, "")

		entry.Content = truncateDescription(Trimstring, 346)

		entry.CreatedDate = val.CreatedOn.In(TZONE).Format("January 02, 2006")

		Catego, _ := Categories.GetParentGivenByChildId(val.CategoriesId)

		entry.Author = val.Username

		if os.Getenv("DOMAIN_URL") == "" {

			entry.ImagePath = os.Getenv("LOCAL_URL") + val.CoverImage

		} else {

			entry.ImagePath = os.Getenv("DOMAIN_URL") + val.CoverImage
		}

		var category []Category

		for _, val := range Catego {

			var SingleCat Category

			SingleCat.Id = val.Id

			SingleCat.CategoryName = val.CategoryName

			category = append(category, SingleCat)

		}

		entry.Categories = category

		EntriesDeatils = append(EntriesDeatils, entry)

	}

	err1 := tmpl.ExecuteTemplate(c.Writer, "baseof.html", gin.H{"Entries": EntriesDeatils, "Category": Cate, "SelectedCategory": catid})

	if err1 != nil {

		c.String(http.StatusInternalServerError, err.Error())
	}

}

func EntriesDetails(c *gin.Context) {

	channelAuth.Authority = &Auth1

	entryid, _ := strconv.Atoi(c.Query("id"))

	Entries, entryerr := channelAuth.GetEntryDetailsByIdTemplates(entryid)

	if entryerr != nil {

		log.Println(entryerr)

	}

	log.Println(Entries, "---------")

	var entdetails EntrieDet

	// entdetails.CoverImage = Entries.CoverImage

	entdetails.Content = Entries.Description

	entdetails.CreatedDate = Entries.CreatedOn.In(TZONE).Format("January 02, 2006")

	entdetails.Author = Entries.Username

	Catego, _ := Categories.GetParentGivenByChildId(Entries.CategoriesId)

	var category []Category

	for _, val := range Catego {

		var SingleCat Category

		SingleCat.Id = val.Id

		SingleCat.CategoryName = val.CategoryName

		category = append(category, SingleCat)

	}

	entdetails.Categories = category
	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/index-details.html")

	if err != nil {

		log.Fatal(err)
	}

	err1 := tmpl.ExecuteTemplate(c.Writer, "baseof.html", gin.H{"Entries": entdetails})

	if err1 != nil {

		c.String(http.StatusInternalServerError, err.Error())
	}

}