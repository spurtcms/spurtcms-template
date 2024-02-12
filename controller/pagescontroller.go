package controller

import (
	// "log"

	"encoding/json"
	"fmt"
	"log"
	"sort"
	"strconv"
	"strings"
	"text/template"

	"github.com/gin-gonic/gin"
	pages "github.com/spurtcms/pkgcontent/lms"
	"github.com/spurtcms/pkgcore/member"
)

var pl pages.MemberPage

type SpaceData struct {
	Id               int
	SpaceTitle       string
	SpaceDescription string
	SpaceSlug        string
	PageSlug         string
	ImagePath        string
	Permalink        string
	PageId           int
	CreatedDate      string
	Categories       []string
}

type GroupData struct {
	Id       int
	Title    string
	PageData []PageData
}

type SubData struct {
	Id        int
	Title     string
	Content   string
	Permalink string
}

type PageData struct {
	Id          int
	Title       string
	Content     string
	Permalink   string
	SubPageData []SubData
}

type PageDetails struct {
	Pages PageData
	Group GroupData
}

type Notes struct {
	Id         int
	Content    string
	CreateDate string
}

type Highlights struct {
	Id         int
	Content    string
	CreateDate string
}

func SpaceDetail(c *gin.Context) {

	if Flg {

		sp.MemAuth = &Auth

		mem.Auth = &Auth

		member, _ := mem.GetMemberDetails()

		profilename = member.FirstName + " " + member.LastName

		profileimg = member.ProfileImagePath

	} else {

		sp.MemAuth = &Auth1

	}
	spacelist, _, _ := sp.MemberSpaceList(100, 0, pages.Filter{})

	var memb member.TblMember

	if Flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &Auth1

	}

	var spaces []SpaceData

	var data SpaceData

	var PageTitle string

	for _, space := range spacelist {

		data.Id = space.SpacesId

		_, pages, _, _ := pl.MemberPageList(space.SpacesId)

		sort.Slice(pages, func(i, j int) bool {
			return pages[i].OrderIndex < pages[j].OrderIndex
		})

		for _, value := range pages {

			if value.OrderIndex == 1 || value.Status == "publish" {

				data.PageSlug = clearString(strings.ReplaceAll(strings.ToLower(value.Name), " ", "_"))

				data.PageId = value.PgId

				break
			}
		}
		
		data.SpaceTitle = space.SpacesName

		data.SpaceDescription = space.SpacesDescription

		var allcat []string

		for _, val := range space.CategoryNames {

			allcat = append(allcat, val.CategoryName)

		}

		data.Categories = allcat

		data.SpaceSlug = clearString(strings.ReplaceAll(strings.ToLower(space.SpacesName), " ", "_"))

		spaces = append(spaces, data)
	}

	Spaceid, _ := strconv.Atoi(c.Query("spid"))

	var spacename string

	for _, space := range spacelist {

		if space.Id == Spaceid {

			spacename = space.SpacesName

			break

		}
	}

	pagegroups, pages, subpages, _ := pl.MemberPageList(Spaceid)

	sort.Slice(pages, func(i, j int) bool {
		return pages[i].OrderIndex < pages[j].OrderIndex
	})

	sort.Slice(pagegroups, func(i, j int) bool {
		return pagegroups[i].OrderIndex < pagegroups[j].OrderIndex
	})

	sort.Slice(subpages, func(i, j int) bool {
		return subpages[i].OrderIndex < subpages[j].OrderIndex
	})

	var PageDetailss []PageDetails

	var grpflg bool

	var pageflg bool

	for _, val := range pagegroups {

		if val.OrderIndex == 1 {

			grpflg = true

			break
		}
	}

	for _, val := range pages {

		if val.OrderIndex == 1 {

			pageflg = true
			break
		}
	}

	if pageflg {

		var orderindex int

		for _, val := range pages {

			orderindex = val.OrderIndex

			if val.Pgroupid == 0 && val.Status == "publish" {

				var singlepage PageDetails

				singlepage.Pages.Id = val.PgId

				singlepage.Pages.Title = val.Name

				singlepage.Pages.Permalink = "/space/" + clearString(strings.ToLower(strings.ReplaceAll(spacename, " ", "_"))) + "/" + clearString(strings.ToLower(strings.ReplaceAll(val.Name, " ", "_"))) + "?spid=" + c.Query("spid") + "&pageid=" + strconv.Itoa(val.PgId)

				PageDetailss = append(PageDetailss, singlepage)
			}

			for _, grp := range pagegroups {

				if orderindex+1 == grp.OrderIndex {

					var singlepage PageDetails

					singlepage.Group.Id = grp.GroupId

					singlepage.Group.Title = grp.Name

					PageDetailss = append(PageDetailss, singlepage)

					break

				}
			}

		}

	}

	if grpflg {

		var orderindex int

		for _, grp := range pagegroups {

			orderindex = grp.OrderIndex

			var singlepage PageDetails

			singlepage.Group.Id = grp.GroupId

			singlepage.Group.Title = grp.Name

			PageDetailss = append(PageDetailss, singlepage)

			for _, val := range pages {

				if orderindex+1 == val.OrderIndex && val.Status == "publish" {

					var singlepage PageDetails

					singlepage.Pages.Id = val.PgId

					singlepage.Pages.Title = val.Name

					singlepage.Pages.Permalink = "/space/" + clearString(strings.ToLower(strings.ReplaceAll(spacename, " ", "_"))) + "/" + clearString(strings.ToLower(strings.ReplaceAll(val.Name, " ", "_"))) + "?spid=" + c.Query("spid") + "&pageid=" + strconv.Itoa(val.PgId)

					PageDetailss = append(PageDetailss, singlepage)

					break

				}
			}

		}

	}

	var Final []PageDetails

	for _, val := range PageDetailss {

		var PG []PageData

		var Sub []SubData

		for _, page := range pages {

			if page.Pgroupid != 0 {

				if page.Pgroupid == val.Group.Id {

					var singlepage PageData

					singlepage.Id = page.PgId

					singlepage.Title = page.Name

					singlepage.Permalink = "/space/" + clearString(strings.ToLower(strings.ReplaceAll(spacename, " ", "_"))) + "/" + clearString(strings.ToLower(strings.ReplaceAll(page.Name, " ", "_"))) + "/?spid=" + c.Query("spid") + "&pageid=" + strconv.Itoa(page.PgId)

					PG = append(PG, singlepage)

				}
			}

		}

		for _, sub := range subpages {

			if sub.ParentId == val.Pages.Id && sub.Status == "publish" {

				var singlepage SubData

				singlepage.Id = sub.SpgId

				singlepage.Title = sub.Name

				Sub = append(Sub, singlepage)

			}

		}

		val.Pages.SubPageData = Sub

		val.Group.PageData = PG

		Final = append(Final, val)

	}

	var LastFinal []PageDetails

	var LastFinal1 []PageDetails

	pageid, _ := strconv.Atoi(c.Query("pageid"))

	for _, val := range Final {

		var pagedet []PageData

		for _, grppagesub := range val.Group.PageData {

			var pagedeta PageData

			var Sub []SubData

			for _, sub := range subpages {

				if grppagesub.Id == sub.ParentId && sub.Status == "publish" {

					var singlepage SubData

					singlepage.Id = sub.SpgId

					singlepage.Title = sub.Name

					singlepage.Permalink = "/space/" + clearString(strings.ToLower(strings.ReplaceAll(spacename, " ", "_"))) + "/" + clearString(strings.ToLower(strings.ReplaceAll(grppagesub.Title, " ", "_"))) + "/" + clearString(strings.ToLower(strings.ReplaceAll(sub.Name, " ", "_"))) + "/?spid=" + c.Query("spid") + "&pageid=" + strconv.Itoa(sub.SpgId)

					Sub = append(Sub, singlepage)
				}

			}

			pagedeta = grppagesub

			pagedeta.SubPageData = Sub

			pagedet = append(pagedet, pagedeta)

		}

		val.Group.PageData = pagedet

		LastFinal = append(LastFinal, val)

	}

	for _, val := range LastFinal {

		var Sub []SubData

		for _, sub := range subpages {

			if val.Pages.Id == sub.ParentId && sub.Status == "publish" {

				var singlepage SubData

				singlepage.Id = sub.SpgId

				singlepage.Title = sub.Name

				singlepage.Permalink = "/space/" + clearString(strings.ToLower(strings.ReplaceAll(spacename, " ", "_"))) + "/" + clearString(strings.ToLower(strings.ReplaceAll(val.Pages.Title, " ", "_"))) + "/" + clearString(strings.ToLower(strings.ReplaceAll(sub.Name, " ", "_"))) + "/?spid=" + c.Query("spid") + "&pageid=" + strconv.Itoa(sub.SpgId)

				Sub = append(Sub, singlepage)
			}

		}

		if val.Pages.Id == pageid {

			PageTitle = val.Pages.Title

		} else {

			for _, new := range val.Group.PageData {

				if new.Id == pageid {

					PageTitle = new.Title

					break
				}

			}

			for _, new := range val.Pages.SubPageData {

				if new.Id == pageid {

					PageTitle = new.Title

					break
				}
			}

			for _, sub := range subpages {

				if sub.SpgId == pageid {

					PageTitle = sub.Name

					break
				}
			}

		}

		val.Pages.SubPageData = Sub

		LastFinal1 = append(LastFinal1, val)

	}

	var Error bool

	Content, err := pl.GetPageContent(pageid)

	if err != nil {

		Error = true

		log.Println(err)
	}

	var highlight, _ = pl.GetHighlights(pageid)

	var note, _ = pl.GetNotes(pageid)

	var NOTE []Notes

	for _, val := range note {

		var nt Notes

		nt.Id = val.Id

		nt.Content = val.NotesHighlightsContent

		nt.CreateDate = val.CreatedOn.Format("02 Jan 2006 03:04 PM")

		NOTE = append(NOTE, nt)

	}

	var HIGH []Highlights

	for _, val := range highlight {

		var nt Highlights

		nt.Id = val.Id

		nt.Content = val.NotesHighlightsContent

		nt.CreateDate = val.CreatedOn.Format("02 Jan 2006 03:04 PM")

		HIGH = append(HIGH, nt)

	}

	for _, val := range LastFinal1 {

		fmt.Println(val)

		fmt.Println()

	}

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/spaces/pages.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Spaces": spaces, "Spaceid": c.Query("spid"), "Title": spacename, "PageId": pageid, "member": memb, "Logged": Flg, "profilename": profilename, "profileimg": profileimg, "SpaceDetails": LastFinal1, "PageTitle": PageTitle, "Content": Content.PageDescription, "Notes": NOTE, "Highligts": HIGH, "RestrictContent": Error, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})

}

func PageView(c *gin.Context) {

	Spid, _ := strconv.Atoi(c.Query("sid"))

	pid, _ := strconv.Atoi(c.Query("pid"))

	if Flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &Auth1

	}
	pagegroups, pages, subpages, _ := pl.MemberPageList(Spid)

	Content, err := pl.GetPageContent(pid)

	var Error string

	if err != nil {

		Error = err.Error()
	}

	var highlight, _ = pl.GetHighlights(pid)

	var note, _ = pl.GetNotes(pid)

	json.NewEncoder(c.Writer).Encode(gin.H{"group": pagegroups, "pages": pages, "subpage": subpages, "highlight": highlight, "note": note, "Title": "Pages", "content": Content, "error": Error, "Logged": Flg, "profilename": profilename, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})
}

/* Update Highlights */

func UpdateHighlights(c *gin.Context) {

	if Flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &Auth1

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

	pl.UpdateHighlights(high)

	var highlight, _ = pl.GetHighlights(pid)

	c.JSON(200, gin.H{"highlight": highlight})
}

/* Update Notes */
func UpdateNotes(c *gin.Context) {

	if Flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &Auth1

	}

	Id := c.PostForm("pgid")

	page_id, _ := strconv.Atoi(Id)

	content := c.PostForm("content")

	pl.UpdateNotes(page_id, content)

	var note, _ = pl.GetNotes(page_id)

	c.JSON(200, gin.H{"note": note})
}

/* Delete Highlights */
func DeleteHighlights(c *gin.Context) {

	if Flg {

		pl.MemAuth = &Auth

	} else {

		pl.MemAuth = &Auth1

	}
	id := c.PostForm("id")

	pid := c.PostForm("pgid")

	del_id, _ := strconv.Atoi(id)

	pgid, _ := strconv.Atoi(pid)

	pl.RemoveHighlightsandNotes(del_id)

	var note, _ = pl.GetNotes(pgid)

	var highlight, _ = pl.GetHighlights(pgid)

	c.JSON(200, gin.H{"note": note, "highlight": highlight})

}

func clearString(str string) string {
	return nonAlphanumericRegex.ReplaceAllString(str, "")
}
