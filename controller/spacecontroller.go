package controller

import (
	// "log"

	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/spurtcms/spurtcms-content/pages"
	"github.com/spurtcms/spurtcms-content/spaces"
	"log"
	"strconv"
)

var pl pages.MemberPage

type SpaceData struct {
	Id                int
	SpaceName         string
	SpaceDescription string
	SpaceSlug        string
	PageSlug          string
}

func SpaceDetail(c *gin.Context) {

	sp.MemAuth = &Auth

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	log.Println(Auth)

	pl.MemAuth = &Auth

	spacelist, _, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	pl.MemAuth = &Auth

	var spaces []SpaceData

	var data SpaceData

	for _, space := range spacelist {

		data.Id = space.Id

		_, pages, _, _ := pl.MemberPageList(space.Id)

		data.PageSlug = pages[0].Name

		data.SpaceName = space.SpacesName

		data.SpaceDescription = space.SpacesDescription

		for _, val := range space.ChildCategories {


			data.SpaceSlug = val.CategoryName

		}
		spaces = append(spaces, data)

	}

	c.HTML(200, "space-detail.html", gin.H{"Spaces": spaces, "Spaceid": c.Param("id"), "title": "Spaces", "member": memb})
}
func PageView(c *gin.Context) {

	Spid, _ := strconv.Atoi(c.Query("sid"))

	pl.MemAuth = &Auth

	pagegroups, pages, subpages, _ := pl.MemberPageList(Spid)

	json.NewEncoder(c.Writer).Encode(gin.H{"group": pagegroups, "pages": pages, "subpage": subpages, "title": "pages"})
}
