package routes

import (
	"github.com/gin-gonic/gin"
	"os"
	"path/filepath"
	"spurt-page-view/controller"
	"strings"
)

func SetupRoutes() *gin.Engine {

	r := gin.Default()

	var htmlfiles []string

	filepath.Walk("./", func(path string, _ os.FileInfo, _ error) error {
		if strings.HasSuffix(path, ".html") {
			htmlfiles = append(htmlfiles, path)
		}
		return nil
	})

	r.LoadHTMLFiles(htmlfiles...)

	r.Static("/public", "./public")
	r.GET("/login", controller.MemberLogin)
	r.GET("/logout",controller.MemberLogout)
	r.GET("/signup", controller.SignUp)
	r.GET("/retrieve", controller.Retrieve)
	r.GET("/reset", controller.Reset)
	r.GET("/myprofile", controller.MyProfile)
	r.GET("/change-email", controller.ChangeEmail)
	r.GET("/new-email", controller.AddNewEmail)
	r.POST("/checkmemberlogin", controller.CheckMemberLogin)
	r.POST("/memberregister", controller.MemberRegister)
	r.POST("/myprofileupdate", controller.MyprofileUpdate)
	r.POST("/otp-genrate", controller.OtpGenarate)
	r.POST("/verify-otp", controller.OtpVerify)
	r.GET("/", controller.IndexView)
	r.GET("/space/:stitle/:pgtitle/", controller.SpaceDetail)
	r.GET("/space/:stitle/:pgtitle/:subtitle/", controller.SpaceDetail)
	r.GET("/page", controller.PageView)
	r.POST("/highlights", controller.UpdateHighlights)
	r.POST("/notes", controller.UpdateNotes)
	return r
}
