package controller

import (
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/spurtcms/spurtcms-content/spaces"
	spurtcore "github.com/spurtcms/spurtcms-core"
	"github.com/spurtcms/spurtcms-core/auth"
	"gorm.io/gorm"
)

var sp spaces.MemberSpace

var DB *gorm.DB

var auth1 auth.Authorization

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

	if flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &auth1

	}

	spacelist, count, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	var spaces []SpaceData

	var data SpaceData

	log.Println("spaceslist", spacelist)

	for _, space := range spacelist {

		data.Id = space.SpacesId

		_, pages, _, _ := pl.MemberPageList(space.SpacesId)

		for _, val := range pages {

			if val.OrderIndex == 1 {

				log.Println(val)

				data.PageSlug = strings.ReplaceAll(regexp.MustCompile(`[^a-zA-Z0-9 ]+`).ReplaceAllString(strings.ToLower(val.Name), " "), " ", "_")

				data.PageId = val.PgId

				break
			}

		}

		log.Println("pgslug", data.PageSlug)

		data.SpaceName = space.SpacesName

		data.SpaceDescription = space.SpacesDescription

		var allcat []string

		for _, val := range space.CategoryNames {

			allcat = append(allcat, val.CategoryName)

		}

		data.CategoryName = allcat

		data.SpaceSlug = strings.ReplaceAll(strings.ToLower(space.SpacesName), " ", "_")

		spaces = append(spaces, data)

	}

	c.HTML(200, "index.html", gin.H{"Space": spaces, "Data": spaces, "Count": count, "title": "Index","myprofile": flg})

}
