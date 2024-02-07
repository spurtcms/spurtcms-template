package routes

import (
	"errors"
	"log"
	"os"
	"path/filepath"
	"spurt-page-view/controller"
	"strings"

	"github.com/gin-gonic/gin"
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

	log.Println("themes/" + controller.Template + "/assets")

	r.Static("/asset", "themes/"+controller.Template+"/assets")

	r.Static("/static", "themes/"+controller.Template+"/static")

	r.Static("/storage", "./storage")

	// r.Use(controller.DashBoardAuth())

	r.NoRoute(controller.FileNotFoundPage)

	D := r.Group("")

	D.Use(controller.JWTAuth())

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/login.html"); err == nil {

		r.GET("/login", controller.MemberLogin)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/login.html no such file found")
	}

	r.GET("/logout", controller.MemberLogout)

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/signup.html"); err == nil {

		r.GET("/signup", controller.SignUp)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/signup.html no such file found")
	}

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/forgot-email.html"); err == nil {

		r.GET("/retrieve", controller.Retrieve)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/forgot-email.html no such file found")
	}

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/password-reset.html"); err == nil {

		r.GET("/reset", controller.PassReset)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/password-reset.html no such file found")
	}

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/myprofile.html"); err == nil {

		r.GET("/myprofile", controller.MyProfile)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/myprofile.html no such file found")
	}

	r.GET("/change-email", controller.ChangeEmail)

	r.GET("/new-email", controller.AddNewEmail)

	r.POST("/checkmemberlogin", controller.CheckMemberLogin)

	r.POST("/memberregister", controller.MemberRegister)

	r.POST("/myprofileupdate", controller.MyprofileUpdate)

	r.POST("/passwordotp", controller.PassOtpGenarate)

	r.POST("/otp-genrate", controller.OtpGenarate)

	r.POST("/otp-genrate1", controller.OtpGenarate1)

	r.POST("/verify-email-otp", controller.OtpVerifyemail)

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/spaces/spaces.html"); err == nil {

		D.GET("/", controller.IndexView)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/spaces/spaces.html no such file found")
	}

	r.GET("/space/:stitle/:pgtitle/", controller.SpaceDetail)

	r.GET("/space/:stitle/:pgtitle/:subtitle/", controller.SpaceDetail)

	r.GET("/page", controller.PageView)

	r.POST("/highlights", controller.UpdateHighlights)

	r.POST("deletehighlights", controller.DeleteHighlights)

	r.POST("/notes", controller.UpdateNotes)

	r.GET("/passwordotp", controller.ChangePassword)

	r.GET("/passwordchange", controller.AddNewPassword)

	r.POST("/verify-otppass", controller.OtpVerifypass)

	r.POST("/verify-otpprofpass", controller.OtpVerifypassMyprofile)

	r.POST("/send-otp-genrate", controller.AgainOtpGenarate)

	return r
}
