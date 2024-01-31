package controller

import (
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
	"text/template"
	"time"

	"github.com/gin-gonic/gin"
	spurtcore "github.com/spurtcms/pkgcore"
	"github.com/spurtcms/pkgcore/auth"
	"github.com/spurtcms/pkgcore/member"
)

var Auth auth.Authorization

var mem member.MemberAuth

func GetAuth(token string) {

	auth := spurtcore.NewInstance(&auth.Option{DB: DBIns, Token: token, Secret: os.Getenv("JWT_SECRET")})

	Auth = auth

}

func MemberLogin(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/authfooter.html", "themes/"+Template+"/layouts/partials/auth/login.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Login"})

}
func MemberLogout(c *gin.Context) {

	log.Println("cc", c)

	Flg = false

	log.Println("logoutflg", Flg)

	session, err := Store.Get(c.Request, os.Getenv("SESSION_KEY"))

	if err != nil {
		fmt.Println(err)
	}
	session.Values["token"] = ""

	session.Options.MaxAge = -1

	er := session.Save(c.Request, c.Writer)
	if er != nil {
		fmt.Println(er)
	}

	c.Writer.Header().Set("Pragma", "no-cache")

	c.Redirect(302, "/")

}
func CheckMemberLogin(c *gin.Context) {

	if c.PostForm("email") == "" || c.PostForm("password") == "" {

		var errorz error

		if c.PostForm("email") == "" {

			errorz = errors.New("Email Required")

		} else if c.PostForm("password") == "" {

			errorz = errors.New("Password Required")

		}

		c.SetCookie("Alert", errorz.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/login")

		// c.JSON(200, gin.H{"verify": errorz.Error()})

		// return

	}

	name := c.PostForm("email")

	password := c.PostForm("password")

	mem.Auth = &Auth1

	token, err := mem.CheckMemberLogin(member.MemberLogin{Emailid: name, Password: password}, DBIns, os.Getenv("JWT_SECRET"))

	log.Println("-------", err)

	if err != nil {

		log.Println("if")

		// c.JSON(200, gin.H{"verify": err.Error()})

		c.SetCookie("success", err.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/login")

		return

	}

	Flg = true

	// c.JSON(200, gin.H{"verify": ""})
	GetAuth(token)

	log.Println(token)

	Session, _ := Store.Get(c.Request, os.Getenv("SESSION_KEY"))

	Session.Values["token"] = token

	Session.Save(c.Request, c.Writer)

	sp.MemAuth = &Auth

	c.SetCookie("success", "login successfully", 3600, "", "", false, false)

	c.Redirect(301, "/")

}

func MemberRegister(c *gin.Context) {

	if c.PostForm("fname") == "" || c.PostForm("mobile") == "" || c.PostForm("email") == "" || c.PostForm("password") == "" {

		var errorz error

		if c.PostForm("fname") == "" {

			errorz = errors.New("First Name Required")

		} else if c.PostForm("mobile") == "" {

			errorz = errors.New("Mobile Required")

		} else if c.PostForm("email") == "" {

			errorz = errors.New("Email Required")

		} else if c.PostForm("password") == "" {

			errorz = errors.New("password Required")

		}
		c.JSON(200, gin.H{"verify": errorz.Error()})

		return
	}

	GetAuth("")

	mem.Auth = &Auth

	fname := c.PostForm("fname")

	lname := c.PostForm("lname")

	mobile := c.PostForm("mobile")

	email := c.PostForm("email")

	password := c.PostForm("password")

	chk, err5 := mem.MemberRegister(member.MemberCreation{FirstName: fname, LastName: lname, Email: email, MobileNo: mobile, Password: password})

	log.Println("chk", chk)

	log.Println("chk", err5)

	data := map[string]interface{}{

		"fname": fname,
		"memid": email,
		"Pass":  password,
	}

	var wg sync.WaitGroup

	wg.Add(1)

	Chan := make(chan string, 1)

	go MemberCreateEmail(Chan, &wg, data, email, "createmember")

	close(Chan)

	c.JSON(200, gin.H{"verify": ""})

}

func SignUp(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/authfooter.html", "themes/"+Template+"/layouts/partials/auth/signup.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "SignUp"})

}

func Retrieve(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/authfooter.html", "themes/"+Template+"/layouts/partials/auth/forgot-email.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Retrieve"})

}
func PassReset(c *gin.Context) {

	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/authfooter.html", "themes/"+Template+"/layouts/partials/auth/password-reset.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Reset"})

	// c.HTML(200, "passwordreset.html", gin.H{"title": "Reset"})

}

func MyProfile(c *gin.Context) {

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	if !Flg {

		c.Redirect(302, "/login")
	}

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/myprofile.html", "themes/"+Template+"/layouts/partials/crop-modal.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "My Profile", "Member": memb, "Logged": Flg, "profilename": profilename, "profileimg": profileimg})

}

func MyprofileUpdate(c *gin.Context) {

	var errorz error

	var imageName string

	var storagePath string

	if c.PostForm("fname") == "" || c.PostForm("mobile") == "" {

		if c.PostForm("fname") == "" {

			errorz = errors.New("First Name Required")

		} else if c.PostForm("mobile") == "" {

			errorz = errors.New("Mobile Number Required")

		}

		c.JSON(200, gin.H{"verify": errorz.Error()})

		return

	}
	mem.Auth = &Auth

	fname := c.PostForm("fname")

	lname := c.PostForm("lname")

	mobile := c.PostForm("mobile")

	imageData := c.PostForm("crop_data")

	if imageData != "" {

		imageName, storagePath, _ = ConvertBase64(imageData, "storage/member")

		fmt.Println("imgname", imageName, storagePath)
	}

	upt, _ := mem.MemberUpdate(member.MemberCreation{FirstName: fname, LastName: lname, MobileNo: mobile, ProfileImage: imageName, ProfileImagePath: storagePath})

	log.Println("update", upt)

	c.JSON(200, gin.H{"verify": ""})
}

func ChangeEmail(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-emailOTP.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "ChangeEmail", "Logged": Flg, "profilename": profilename, "profileimg": profileimg})

}

func AddNewEmail(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-email.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "NewEmail", "Logged": Flg, "profilename": profilename, "profileimg": profileimg})

}

func ChangePassword(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-passwordOTP.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "ChangePassword", "Logged": Flg, "profilename": profilename, "profileimg": profileimg})

}

func AddNewPassword(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-password.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "NewPassword", "Logged": Flg, "profilename": profilename, "profileimg": profileimg})

}

func OtpGenarate(c *gin.Context) {

	email := c.PostForm("email")

	_, err := GenarateOtp(email)

	if err != nil {
		c.JSON(200, gin.H{"verify": err.Error()})
	} else {
		c.JSON(200, gin.H{"verify": ""})
	}

}
func OtpVerifyemail(c *gin.Context) {

	var errorz error

	if c.PostForm("otp") == "" || c.PostForm("newemail") == "" {

		if c.PostForm("otp") == "" {

			errorz = errors.New("Otp Required")

		} else if c.PostForm("newemail") == "" {

			errorz = errors.New("Email Required")

		}

		c.JSON(200, gin.H{"verify": errorz.Error()})

		return

	}
	num := c.PostForm("otp")

	otp, _ := strconv.Atoi(num)

	newemail := c.PostForm("newemail")

	email := c.PostForm("oldemailid")

	_, _, err := mem.CheckEmailInMember(0, email)

	if err != nil {

		fmt.Println(err)
	}

	_, err = mem.ChangeEmailId(otp, newemail)

	if err != nil {

		c.JSON(200, gin.H{"verify": err.Error()})

	} else {

		c.JSON(200, gin.H{"verify": ""})

	}

}

// Change Password

func OtpVerifypass(c *gin.Context) {

	var errorz error

	if c.PostForm("otp") == "" || c.PostForm("mynewPassword") == "" {

		if c.PostForm("otp") == "" {

			errorz = errors.New("Otp Required")

		} else if c.PostForm("mynewPassword") == "" {

			errorz = errors.New("Password Required")

		}

		c.JSON(200, gin.H{"verify": errorz.Error()})

		return

	}
	num := c.PostForm("otp")

	otp, _ := strconv.Atoi(num)

	newpass := c.PostForm("mynewPassword")

	email := c.PostForm("id")

	memdetail, mailcheck, err := mem.CheckEmailInMember(0, email)

	if err != nil {

		fmt.Println(err)
	}

	fmt.Println(mailcheck)

	_, err1 := mem.ChangePassword(otp, memdetail.Id, newpass)

	if err1 != nil {

		c.JSON(200, gin.H{"verify": err1.Error()})

	} else {

		c.JSON(200, gin.H{"verify": ""})

	}

}

func ConvertBase64(imageData string, storagepath string) (imgname string, path string, err error) {

	extEndIndex := strings.Index(imageData, ";base64,")

	base64data := imageData[strings.IndexByte(imageData, ',')+1:]

	var ext = imageData[11:extEndIndex]

	rand_num := strconv.Itoa(int(time.Now().Unix()))

	imageName := "IMG-" + rand_num + "." + ext

	os.MkdirAll(storagepath, 0755)

	storagePath := storagepath + "/IMG-" + rand_num + "." + ext

	decode, err := base64.StdEncoding.DecodeString(base64data)

	if err != nil {

		fmt.Println(err)

	}

	file, err := os.Create(storagePath)

	if err != nil {

		fmt.Println(err)

	}
	if _, err := file.Write(decode); err != nil {

		fmt.Println(err)
	}

	return imageName, storagePath, err
}

/* Resend Otp */
func AgainOtpGenarate(c *gin.Context) {

	email := c.PostForm("email")

	verify, err := GenarateOtp(email)

	if err != nil {
		c.JSON(200, gin.H{"verify": err.Error()})
	} else {
		c.JSON(200, gin.H{"verify": verify})
	}

}
