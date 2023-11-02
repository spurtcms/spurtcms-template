package controller

import (
	// "log"

	"encoding/json"
	"log"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/spurtcms/spurtcms-content/pages"
	"github.com/spurtcms/spurtcms-content/spaces"
	spurtcore "github.com/spurtcms/spurtcms-core"
	"github.com/spurtcms/spurtcms-core/auth"
)

var pl pages.MemberPage

type SpaceData struct {
	Id               int
	SpaceName        string
	SpaceDescription string
	SpaceSlug        string
	PageSlug         string
	CategoryName     []string
}

func SpaceDetail(c *gin.Context) {

	auth := spurtcore.NewInstance(&auth.Option{DB: DB, Token: "", Secret: ""})

	sp.MemAuth = &auth

	// pl.MemAuth = &Auth

	spacelist, _, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	log.Println("sp", spacelist)

	pl.MemAuth = &auth

	var spaces []SpaceData

	var data SpaceData

	for _, space := range spacelist {

		data.Id = space.SpacesId

		_, pages, _, _ := pl.MemberPageList(space.SpacesId)

		for _, value := range pages {

			if value.OrderIndex == 1 {

				data.PageSlug = strings.ReplaceAll(strings.ToLower(value.Name), " ", "_")

			}
			break
		}
		data.SpaceName = space.SpacesName

		data.SpaceDescription = space.SpacesDescription

		var allcat []string

		for _, val := range space.CategoryNames {

			allcat = append(allcat, val.CategoryName)

		}

		data.CategoryName = allcat

		data.SpaceSlug = strings.ReplaceAll(strings.ToLower(space.SpacesName), " ", "_")

		spaces = append(spaces, data)

		log.Println("hghg", data.PageSlug)
	}

	c.HTML(200, "space-detail.html", gin.H{"Spaces": spaces, "Spaceid": c.Param("id"), "title": "Spaces"})
}
func PageView(c *gin.Context) {

	Spid, _ := strconv.Atoi(c.Query("sid"))

	pl.MemAuth = &auth1

	pagegroups, pages, subpages, _ := pl.MemberPageList(Spid)

	for _, value := range pages {

		if value.OrderIndex == 1 {

			var PageContent, _ = pl.GetPageContent(value.PgId)

			log.Println("hhh",PageContent)
		}
		break
	}

	json.NewEncoder(c.Writer).Encode(gin.H{"group": pagegroups, "pages": pages, "subpage": subpages, "title": "pages"})
}
