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

func SpaceDetail(c *gin.Context) {

	sp.MemAuth = &Auth

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	log.Println(Auth)

	SpaceDetail, _, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	c.HTML(200, "space-detail.html", gin.H{"Spaces": SpaceDetail, "Spaceid": c.Param("id"), "title": "Spaces", "member": memb})
}
func PageView(c *gin.Context) {

	Spid, _ := strconv.Atoi(c.Query("sid"))

	pl.MemAuth = &Auth

	pagegroups, pages, subpages, _ := pl.MemberPageList(Spid)

	json.NewEncoder(c.Writer).Encode(gin.H{"group": pagegroups, "pages": pages, "subpage": subpages, "title": "pages"})
}
