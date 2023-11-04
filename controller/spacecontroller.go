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
	PageId           int
	CategoryName     []string
}

func SpaceDetail(c *gin.Context) {

	auth12 := spurtcore.NewInstance(&auth.Option{DB: DB, Token: "", Secret: ""})

	sp.MemAuth = &auth12

	// pl.MemAuth = &Auth

	spacelist, _, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	log.Println("sp", spacelist)

	pl.MemAuth = &auth12

	var spaces []SpaceData

	var data SpaceData

	for _, space := range spacelist {

		data.Id = space.SpacesId

		_, pages, _, _ := pl.MemberPageList(space.SpacesId)

		for _, value := range pages {

			if value.OrderIndex == 1 {

				data.PageSlug = strings.ReplaceAll(strings.ToLower(value.Name), " ", "_")

				data.PageId = value.PgId

				break
			}
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
	}

	c.HTML(200, "space-detail.html", gin.H{"Spaces": spaces, "Spaceid": c.Query("spid"), "title": "Spaces", "pageid": c.Query("pageid")})
}

func PageView(c *gin.Context) {

	var Content string

	Spid, _ := strconv.Atoi(c.Query("sid"))

	pid, _ := strconv.Atoi(c.Query("pid"))

	pl.MemAuth = &auth1

	pagegroups, pages, subpages, _ := pl.MemberPageList(Spid)

	var PageContent, err = pl.GetPageContent(pid)

	Content = PageContent.PageDescription

	var Error string

	if err != nil {

		Error = err.Error()
	}

	json.NewEncoder(c.Writer).Encode(gin.H{"group": pagegroups, "pages": pages, "subpage": subpages, "title": "pages", "content": Content, "error": Error})
}

