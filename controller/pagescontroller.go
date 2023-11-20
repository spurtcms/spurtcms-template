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
	"github.com/spurtcms/spurtcms-core/member"
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

	if flg {

		sp.MemAuth = &Auth

	} else {

		sp.MemAuth = &auth1

	}
	spacelist, _, _ := sp.MemberSpaceList(10, 0, spaces.Filter{})

	var memb member.TblMember

	if flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &auth1

	}

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

	c.HTML(200, "pages.html", gin.H{"Spaces": spaces, "Spaceid": c.Query("spid"), "title": "Spaces", "pageid": c.Query("pageid"), "member": memb, "myprofile": flg,"profilename":profilename})
}

func PageView(c *gin.Context) {

	var Content string

	Spid, _ := strconv.Atoi(c.Query("sid"))

	pid, _ := strconv.Atoi(c.Query("pid"))

	if flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &auth1

	}
	pagegroups, pages, subpages, _ := pl.MemberPageList(Spid)

	var PageContent, err = pl.GetPageContent(pid)

	Content = PageContent.PageDescription

	var Error string

	if err != nil {

		Error = err.Error()
	}

	var highlight, _ = pl.GetHighlights(pid)

	var note, _ = pl.GetNotes(pid)

	json.NewEncoder(c.Writer).Encode(gin.H{"group": pagegroups, "pages": pages, "subpage": subpages, "highlight": highlight, "note": note, "title": "pages", "content": Content, "error": Error, "myprofile": flg,"profilename":profilename})
}

/* Update Highlights */

func UpdateHighlights(c *gin.Context) {

	if flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &auth1

	}

	var high pages.HighlightsReq

	Id := c.PostForm("pgid")

	startoff := c.PostForm("startoffset")

	endoffset := c.PostForm("endoffset")

	pid, _ := strconv.Atoi(Id)

	high.Pageid = pid

	high.Start, _ = strconv.Atoi(startoff)

	high.Offset, _ = strconv.Atoi(endoffset)

	high.Content = c.PostForm("content")

	high.SelectPara = c.PostForm("selectedtag")

	high.ContentColor = c.PostForm("con_clr")

	res, _ := pl.UpdateHighlights(high)

	log.Println("res", res)

	var highlight, _ = pl.GetHighlights(pid)

	c.JSON(200, gin.H{"highlight": highlight})
}

/* Update Notes */
func UpdateNotes(c *gin.Context) {

	if flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &auth1

	}

	Id := c.PostForm("pgid")

	page_id, _ := strconv.Atoi(Id)

	content := c.PostForm("content")

	res, _ := pl.UpdateNotes(page_id, content)

	log.Println("result", res)

	var note, _ = pl.GetNotes(page_id)

	log.Println("n", note)

	c.JSON(200, gin.H{"note": note})
}

/* Delete Highlights */
func DeleteHighlights(c *gin.Context) {

	if flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &auth1

	}
	id := c.PostForm("id")

	pid := c.PostForm("pgid")

	del_id, _ := strconv.Atoi(id)

	pgid, _ := strconv.Atoi(pid)

	result, _ := pl.RemoveHighlightsandNotes(del_id)

	log.Println("res", result)

	var note, _ = pl.GetNotes(pgid)

	var highlight, _ = pl.GetHighlights(pgid)

	c.JSON(200, gin.H{"note": note,"highlight":highlight})
	
}
