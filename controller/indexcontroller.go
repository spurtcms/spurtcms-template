package controller

import (
	"log"
	"github.com/gin-gonic/gin"
	"github.com/spurtcms/spurtcms-content/spaces"
)

var sp spaces.MemberSpace

func IndexView(c *gin.Context) {

	sp.MemAuth = &Auth

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	log.Println("memberData",memb)

	spacelist, count, err := sp.MemberSpaceList(10, 0, spaces.Filter{})

	log.Println(spacelist)

	log.Println("error", err)

	// if err != nil {

	// 	c.Redirect(301, "/")

	// }

	var spacedata []spaces.TblSpacesAliases

	var spaceobj spaces.TblSpacesAliases

	for _, space := range spacelist {

		spaceobj.Id = space.Id

		spaceobj.SpacesId = space.SpacesId

		spaceobj.SpacesName = space.SpacesName

		spaceobj.SpacesDescription = space.SpacesDescription

		for _, val := range space.ChildCategories {

			spaceobj.SpacesSlug = val.CategoryName

		}

		spacedata = append(spacedata, spaceobj)

	}

	c.HTML(200, "index.html", gin.H{"Space": spacedata, "Count": count,"title":"Index","member":memb})

}
