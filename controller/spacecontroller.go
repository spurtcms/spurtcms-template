package controller

import (
	"fmt"
	"html/template"
	"log"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	spaces "github.com/spurtcms/pkgcontent/spaces"
	"github.com/spurtcms/pkgcore/auth"
	"gorm.io/gorm"
)

var sp spaces.MemberSpace

var space spaces.Space

var DB *gorm.DB

var Auth1 auth.Authorization

func IndexView(c *gin.Context) {

	sp.MemAuth = &Auth1

	if Flg {

		pl.MemAuth = &Auth

		mem.Auth = &Auth

		member, _ := mem.GetMemberDetails()

		profilename = member.FirstName + " " + member.LastName

		profileimg = member.ProfileImagePath

	} else {

		pl.MemAuth = &Auth1

	}

	spacelist, _, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	count := len(spacelist)

	var spaces []SpaceData

	var data SpaceData

	for _, space := range spacelist {

		data.Id = space.SpacesId

		data.SpaceSlug = clearString(strings.ReplaceAll(strings.ToLower(space.SpacesName), " ", "_"))

		_, pages, _, _ := pl.MemberPageList(space.SpacesId)

		sort.Slice(pages, func(i, j int) bool {
			return pages[i].OrderIndex < pages[j].OrderIndex
		})

		for _, val := range pages {

			if val.OrderIndex == 1 && val.Status == "publish" || val.Status == "publish" {

				data.PageSlug = clearString(strings.ReplaceAll(strings.ToLower(val.Name), " ", "_"))

				data.PageId = val.PgId

				data.Permalink = "/"+Template+"/" + data.SpaceSlug + "/" + data.PageSlug + "?spaceid=" + strconv.Itoa(space.SpacesId) + "&&pageid=" + strconv.Itoa(val.PgId)

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

		data.CreatedDate = space.CreatedOn.In(TZONE).Format("02 Jan 2006")

		data.Categories = allcat

		var readtime int

		for _, val1 := range pages {

			readtime += val1.ReadTime

		}

		hours := math.Floor(float64(readtime) / 60)

		minutes := readtime % 60

		fmt.Println(hours, minutes, "mintues")

		if hours != 0 {

			data.ReadTime = fmt.Sprint(hours) + " hr "
		}

		if minutes != 0 {

			data.ReadTime += strconv.Itoa(minutes) + " min"

		}

		// if (hours != 0) && (minutes != 0) {

		// 	data.ReadTime = fmt.Sprint(hours) + " hr " + strconv.Itoa(minutes) + " min "

		// }

		spaces = append(spaces, data)

		data.ReadTime = ""

	}

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/list.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/index.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Space": spaces, "Data": spaces, "Count": count, "Title": "Spaces", "Logged": Flg, "profilename": profilename, "profileimg": profileimg, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})

}
func truncateDescription(description string, limit int) string {
	if len(description) <= limit {
		return description
	}

	truncated := description[:limit] + "..."
	return truncated
}

func AddCount(c *gin.Context) {

	sp.MemAuth = &Auth1

	space.Authority = &Auth1

	id := c.Request.PostFormValue("spaceid")

	fmt.Println("iddd", id)

	// idstr, _ := strconv.Atoi(id)

	// err := space.AddViewCount(idstr)

	// if err != nil {

	// 	log.Fatal(err)
	// }

}
