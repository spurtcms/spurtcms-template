package controller

import (
	"log"
	"os"
	"strconv"
	"strings"
	"text/template"

	"github.com/gin-gonic/gin"
	spaces "github.com/spurtcms/pkgcontent/lms"
	"github.com/spurtcms/pkgcore/auth"
	"gorm.io/gorm"
)

var sp spaces.MemberSpace

var DB *gorm.DB

var Auth1 auth.Authorization

var profilename string

var profileimg string

// func init() {

// 	er := godotenv.Load()

// 	if er != nil {

// 		log.Fatalf("Error loading .env file")

// 	}

// 	DB = spurtcore.DBInstance(os.Getenv("DB_HOST"), os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

// 	Auth1 = spurtcore.NewInstance(&auth.Option{DB: DB, Token: "", Secret: ""})

// }

func IndexView(c *gin.Context) {

	sp.MemAuth = &Auth1
	log.Println("loginflg", Flg)
	log.Println("--", &Auth1)
	if Flg {

		pl.MemAuth = &Auth

		mem.Auth = &Auth

		member, _ := mem.GetMemberDetails()

		profilename = member.FirstName + " " + member.LastName

		profileimg = member.ProfileImagePath

	} else {

		pl.MemAuth = &Auth1

	}

	spacelist, count, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	var spaces []SpaceData

	var data SpaceData

	for _, space := range spacelist {

		data.Id = space.SpacesId

		data.SpaceSlug = clearString(strings.ReplaceAll(strings.ToLower(space.SpacesName), " ", "_"))

		_, pages, _, _ := pl.MemberPageList(space.SpacesId)

		for _, val := range pages {

			if val.OrderIndex == 1 {

				data.PageSlug = clearString(strings.ReplaceAll(strings.ToLower(val.Name), " ", "_"))

				data.PageId = val.PgId

				data.Permalink = "/space/" + data.SpaceSlug + "/" + data.PageSlug + "?spaceid=" + strconv.Itoa(space.SpacesId) + "&&pageid=" + strconv.Itoa(val.PgId)

				break
			}

		}

		if space.ImagePath != "" {

			if os.Getenv("DOMAIN_URL") == "" {

				data.ImagePath = os.Getenv("LOCAL_URL") + space.ImagePath

			} else {

				data.ImagePath = os.Getenv("DOMAIN_URL") + space.ImagePath
			}
		} else {

			data.ImagePath = ""
		}

		data.SpaceTitle = space.SpacesName

		truncatedDescription := truncateDescription(space.SpacesDescription, 88)

		data.SpaceDescription = truncatedDescription

		var allcat []string

		for _, val := range space.CategoryNames {

			allcat = append(allcat, val.CategoryName)

		}

		data.Categories = allcat

		spaces = append(spaces, data)

	}

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/list.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/spaces/spaces.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Space": spaces, "Data": spaces, "Count": count, "Title": "Spaces", "Logged": Flg, "profilename": profilename, "profileimg": profileimg})

}
func truncateDescription(description string, limit int) string {
	if len(description) <= limit {
		return description
	}

	truncated := description[:limit] + "..."
	return truncated
}
