package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/spurtcms/spurtcms-content/spaces"
	"log"
)

var sp spaces.MemberSpace

func IndexView(c *gin.Context) {

	sp.MemAuth = &Auth

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	log.Println(Auth)

	pl.MemAuth = &Auth

	spacelist, count, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

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

	c.HTML(200, "index.html", gin.H{"Space": spaces, "Data": spaces, "Count": count, "title": "Index", "member": memb})

}
