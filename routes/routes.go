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

	r.NoRoute(controller.FileNotFoundPage)

	r.GET("/", func(c *gin.Context) {

		c.Redirect(302, strings.ReplaceAll(strings.ToLower(controller.Template), " ", "_")+"/")

	})

	TEM := r.Group("")

	SP := TEM.Group("/spaces")

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/login.html"); err == nil {

		SP.GET("/login", controller.MemberLogin)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/login.html no such file found")
	}

	SP.GET("/logout", controller.MemberLogout)

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/signup.html"); err == nil {

		SP.GET("/signup", controller.SignUp)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/signup.html no such file found")
	}

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/forgot-email.html"); err == nil {

		SP.GET("/retrieve", controller.Retrieve)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/forgot-email.html no such file found")
	}

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/auth/password-reset.html"); err == nil {

		SP.GET("/reset", controller.PassReset)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/password-reset.html no such file found")
	}

	SP.GET("/change-email", controller.ChangeEmail)

	SP.GET("/new-email", controller.AddNewEmail)

	SP.POST("/checkmemberlogin", controller.CheckMemberLogin)

	SP.POST("/memberregister", controller.MemberRegister)

	SP.POST("/passwordotp", controller.PassOtpGenarate)

	SP.POST("/otp-genrate", controller.OtpGenarate)

	SP.POST("/otp-genrate1", controller.OtpGenarate1)

	SP.POST("/verify-email-otp", controller.OtpVerifyemail)

	SP.POST("/spaceclickcount", controller.AddCount)

	SP.GET("/termsandservice", controller.TermsandService)

	SP.GET("/privacypolicy",controller.PrivacyPolicy)

	D := SP.Group("")

	D.Use(controller.JWTAuth())

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/index.html"); err == nil {

		D.GET("/", controller.IndexView)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/index.html no such file found")
	}

	D.GET("/:stitle/:pgtitle/", controller.SpaceDetail)

	D.GET("/:stitle/:pgtitle/:subtitle/", controller.SpaceDetail)

	D.GET("/page", controller.PageView)

	D.POST("/highlights", controller.UpdateHighlights)

	D.POST("deletehighlights", controller.DeleteHighlights)

	D.POST("/notes", controller.UpdateNotes)

	D.GET("/passwordotp", controller.ChangePassword)

	D.GET("/passwordchange", controller.AddNewPassword)

	D.POST("/verify-otppass", controller.OtpVerifypass)

	D.POST("/verify-otpprofpass", controller.OtpVerifypassMyprofile)

	D.POST("/send-otp-genrate", controller.AgainOtpGenarate)

	D.POST("/send-otp-genrate1", controller.AgainOtpGenarate1)

	D.POST("/myprofileupdate", controller.MyprofileUpdate)

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/myprofile.html"); err == nil {

		D.GET("/myprofile", controller.MyProfile)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/auth/myprofile.html no such file found")
	}

	BL := TEM.Group("/blog")

	BL.Use(controller.JWTAuth())

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/index.html"); err == nil {

		BL.GET("/", controller.EntriesList)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/index.html no such file found")
	}

	if _, err := os.Stat("themes/" + controller.Template + "/layouts/partials/index-details.html"); err == nil {

		BL.GET("/:entriestitle/", controller.EntriesDetails)

	} else if errors.Is(err, os.ErrNotExist) {

		log.Println("themes/" + controller.Template + "/layouts/partials/index-details.html no such file found")
	}

	return r
}
