package controller

import (
	"log"
	"os"
	"regexp"
	"strings"
	"text/template"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	spaces "github.com/spurtcms/pkgcontent/lms"
	spurtcore "github.com/spurtcms/pkgcore"
	"github.com/spurtcms/pkgcore/auth"
	"gorm.io/gorm"
)

var sp spaces.MemberSpace

var DB *gorm.DB

var auth1 auth.Authorization

var profilename string

var profileimg string

func init() {

	er := godotenv.Load()

	if er != nil {

		log.Fatalf("Error loading .env file")

	}

	DB = spurtcore.DBInstance(os.Getenv("DB_HOST"), os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

	auth1 = spurtcore.NewInstance(&auth.Option{DB: DB, Token: "", Secret: ""})

}

func IndexView(c *gin.Context) {

	sp.MemAuth = &auth1
	log.Println("loginflg", flg)

	if flg {

		pl.MemAuth = &Auth

		mem.Auth = &Auth

		member, _ := mem.GetMemberDetails()

		profilename = member.FirstName + " " + member.LastName

		profileimg = member.ProfileImagePath

	} else {

		pl.MemAuth = &auth1

	}

	spacelist, count, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	var spaces []SpaceData

	var data SpaceData

	for _, space := range spacelist {

		data.Id = space.SpacesId

		_, pages, _, _ := pl.MemberPageList(space.SpacesId)

		for _, val := range pages {

			if val.OrderIndex == 1 {

				data.PageSlug = strings.ReplaceAll(regexp.MustCompile(`[^a-zA-Z0-9 ]+`).ReplaceAllString(strings.ToLower(val.Name), " "), " ", "_")

				data.PageId = val.PgId

				break
			}

		}

		data.SpaceTitle = space.SpacesName

		truncatedDescription := truncateDescription(space.SpacesDescription, 88)

		data.SpaceDescription = truncatedDescription

		var allcat []string

		for _, val := range space.CategoryNames {

			allcat = append(allcat, val.CategoryName)

		}

		data.CategoryName = allcat

		data.SpaceSlug = strings.ReplaceAll(strings.ToLower(space.SpacesName), " ", "_")

		spaces = append(spaces, data)

	}

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/list.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/spaces/spaces.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Space": spaces, "Data": spaces, "Count": count, "Title": "Spaces", "myprofile": flg, "profilename": profilename, "profileimg": profileimg})

}
func truncateDescription(description string, limit int) string {
	if len(description) <= limit {
		return description
	}

	truncated := description[:limit] + "..."
	return truncated
}
