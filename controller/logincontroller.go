package controller

import (
	"encoding/base64"
	"errors"
	"fmt"
	"html/template"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
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
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/login.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Login"})

}
func MemberLogout(c *gin.Context) {

	Flg = false

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

		c.SetCookie("Error", errorz.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/login")

	}

	name := c.PostForm("email")

	password := c.PostForm("password")

	mem.Auth = &Auth1

	token, err := mem.CheckMemberLogin(member.MemberLogin{Emailid: name, Password: password}, DBIns, os.Getenv("JWT_SECRET"))

	if err != nil {

		log.Println("if")

		// c.JSON(200, gin.H{"verify": err.Error()})

		c.SetCookie("Error", err.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/login")

		return

	}

	Flg = true

	// c.JSON(200, gin.H{"verify": ""})
	GetAuth(token)

	Session, _ := Store.Get(c.Request, os.Getenv("SESSION_KEY"))

	Session.Values["token"] = token

	Session.Save(c.Request, c.Writer)

	sp.MemAuth = &Auth

	// c.SetCookie("success", "login successfully", 3600, "", "", false, false)

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

		c.SetCookie("Error", errorz.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/signup")

		return
		// c.JSON(200, gin.H{"verify": errorz.Error()})
	}

	GetAuth("")

	mem.Auth = &Auth

	fname := c.PostForm("fname")

	lname := c.PostForm("lname")

	mobile := c.PostForm("mobile")

	email := c.PostForm("email")

	username := c.PostForm("username")

	password := c.PostForm("password")

	_, flg, _ := mem.CheckEmailInMember(0, email)

	if flg {

		c.SetCookie("Error", "Email Already Exists", 3600, "", "", false, false)

		c.Redirect(301, "/signup")

		return
	}

	flg1, _ := mem.CheckNumberInMember(0, mobile)

	if flg1 {

		c.SetCookie("Error", "mobile Already Exists", 3600, "", "", false, false)

		c.Redirect(301, "/signup")

		return
	}

	_, err5 := mem.MemberRegister(member.MemberCreation{FirstName: fname, LastName: lname, Email: email, MobileNo: mobile, Password: password, Username: username})

	if err5 != nil {

		c.SetCookie("Error", err5.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/signup")

		return
	}

	var web_url = os.Getenv("WEB_URL")

	var url_prefix = os.Getenv("DOMAIN_URL")

	fmt.Println(fname, email, password, "checkvalues")

	data := map[string]interface{}{

		"fname":         fname,
		"memid":         email,
		"Pass":          password,
		"login_url":     web_url,
		"admin_logo":    url_prefix + "public/img/spurtcms.png",
		"fb_logo":       url_prefix + "public/img/facebook.png",
		"linkedin_logo": url_prefix + "public/img/linkedin.png",
		"twitter_logo":  url_prefix + "public/img/twitter.png",
	}

	var wg sync.WaitGroup

	wg.Add(1)

	Chan := make(chan string, 1)

	go MemberCreateEmail(Chan, &wg, data, email, "createmember")

	close(Chan)

	c.SetCookie("Success", "User Registered Successfully", 3600, "", "", false, false)

	c.Redirect(301, "/login")

}

func SignUp(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/signup.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "SignUp"})

}

func Retrieve(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/forgot-email.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Retrieve"})

}
func PassReset(c *gin.Context) {

	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/auth/password-reset.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Reset", "EmailId": c.Query("emailid")})

	// c.HTML(200, "passwordreset.html", gin.H{"title": "Reset"})

}

func MyProfile(c *gin.Context) {

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	if !Flg {

		c.Redirect(302, "/login")
	}

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/myprofile.html", "themes/"+Template+"/layouts/partials/crop-modal.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "My Profile", "Member": memb, "Logged": Flg, "profilename": profilename, "profileimg": profileimg, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})

}

func MyprofileUpdate(c *gin.Context) {

	var errorz error

	var imageName string

	var storagePath string

	if c.PostForm("firstname") == "" || c.PostForm("mobileNumber") == "" {

		if c.PostForm("firstname") == "" {

			errorz = errors.New("First Name Required")

		} else if c.PostForm("mobile") == "" {

			errorz = errors.New("Mobile Number Required")

		}

		c.SetCookie("Error", errorz.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/myprofile")

		// c.JSON(200, gin.H{"verify": errorz.Error()})

		return

	}
	mem.Auth = &Auth

	fname := c.PostForm("firstname")

	lname := c.PostForm("lastname")

	mobile := c.PostForm("mobileNumber")

	imageData := c.PostForm("crop_data")

	if imageData != "" {

		imageName, storagePath, _ = ConvertBase64(imageData, "storage/member")

		fmt.Println("imgname", imageName, storagePath)
	}

	mem.MemberUpdate(member.MemberCreation{FirstName: fname, LastName: lname, MobileNo: mobile, ProfileImage: imageName, ProfileImagePath: storagePath})

	// c.JSON(200, gin.H{"verify": ""})

	c.SetCookie("Success", "Updated Successfully", 3600, "", "", false, false)

	c.Redirect(301, "/myprofile")
}

func ChangeEmail(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-emailOTP.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "ChangeEmail", "Logged": Flg, "profilename": profilename, "profileimg": profileimg, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})

}

func AddNewEmail(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-email.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "NewEmail", "Logged": Flg, "profilename": profilename, "profileimg": profileimg, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})

}

func ChangePassword(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-passwordOTP.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "ChangePassword", "Logged": Flg, "profilename": profilename, "profileimg": profileimg, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})

}

func AddNewPassword(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/footer.html", "themes/"+Template+"/layouts/partials/header.html", "themes/"+Template+"/layouts/partials/auth/change-password.html", "themes/"+Template+"/layouts/partials/auth/changesection.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "NewPassword", "Logged": Flg, "profilename": profilename, "profileimg": profileimg, "Email": memb.Email, "FirstLetter": FirstNameLetter, "LastLetter": LastNameLetter})

}

func OtpGenarate(c *gin.Context) {

	email := c.PostForm("email")

	_, err := GenarateOtp(email)

	if err != nil {

		c.SetCookie("Error", err.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/retrieve")

		return

	}

	c.SetCookie("Success", "OTP sended successfully", 3600, "", "", false, false)

	c.Redirect(301, "/reset?emailid="+email)

}

func PassOtpGenarate(c *gin.Context) {

	email := c.PostForm("email")

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	if memb.Email != email {

		c.SetCookie("Error", "Please enter the login email id", 3600, "", "", false, false)

		c.Redirect(301, "/passwordotp")

		return
	}

	_, err := GenarateOtp(email)

	if err != nil {

		c.SetCookie("Error", err.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/passwordotp")

		return

	}

	// c.SetCookie("success", "", 3600, "", "", false, false)

	c.Redirect(301, "/passwordchange")

}

func OtpGenarate1(c *gin.Context) {

	email := c.PostForm("email")

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	if memb.Email != email {

		c.SetCookie("Error", "Please enter the login email id", 3600, "", "", false, false)

		c.Redirect(301, "/change-email")

		return
	}

	_, err := GenarateOtp(email)

	if err != nil {

		c.SetCookie("Error", err.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/change-email")

		return

	}

	c.SetCookie("Success", "otp sended successfully", 3600, "", "", false, false)

	c.Redirect(301, "/new-email")

}

func OtpVerifyemail(c *gin.Context) {

	var errorz error

	if c.PostForm("otp") == "" || c.PostForm("emailaddress") == "" {

		if c.PostForm("otp") == "" {

			errorz = errors.New("Otp Required")

		} else if c.PostForm("newemail") == "" {

			errorz = errors.New("Email Required")

		}

		c.SetCookie("Error", errorz.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/new-email")

		// c.JSON(200, gin.H{"verify": errorz.Error()})

		return

	}
	num := c.PostForm("otp")

	otp, _ := strconv.Atoi(num)

	newemail := c.PostForm("emailaddress")

	email := c.PostForm("confirmemail")

	mem.Auth = &Auth

	_, flg, err := mem.CheckEmailInMember(0, email)

	if err != nil {

		fmt.Println(err)
	}

	if flg {

		c.SetCookie("Error", "Email Already Exists", 3600, "", "", false, false)

		c.Redirect(301, "/new-email")

		return
	}

	_, err = mem.ChangeEmailId(otp, newemail)

	if err != nil {

		c.SetCookie("Error", err.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/new-email")

		return

	}

	c.SetCookie("Success", "Email Updated Successfully", 3600, "", "", false, false)

	c.Redirect(301, "/myprofile")

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

		c.SetCookie("Error", errorz.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/reset?emailid="+c.PostForm("emailid"))

		// c.JSON(200, gin.H{"verify": errorz.Error()})

		// return

	}
	num := c.PostForm("otp")

	otp, _ := strconv.Atoi(num)

	newpass := c.PostForm("mynewPassword")

	// email := c.PostForm("id")

	Auth1 = spurtcore.NewInstance(&auth.Option{DB: DBIns, Token: "", Secret: os.Getenv("JWT_SECRET")})

	mem.Auth = &Auth1

	memdetail, mailcheck, err := mem.CheckEmailInMember(0, c.PostForm("emailid"))

	if err != nil {

		fmt.Println(err)
	}

	fmt.Println(mailcheck)

	_, err1 := mem.ChangePassword(otp, memdetail.Id, newpass)

	if err1 != nil {

		c.SetCookie("Error", err1.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/reset?emailid="+c.PostForm("emailid"))

		// c.JSON(200, gin.H{"verify": err1.Error()})

		return

	}

	c.SetCookie("Success", "Password Changed Successfully", 3600, "", "", false, false)

	c.Redirect(301, "/login")
}

// Change Password
func OtpVerifypassMyprofile(c *gin.Context) {

	var errorz error

	if c.PostForm("otp") == "" || c.PostForm("mynewPassword") == "" {

		if c.PostForm("otp") == "" {

			errorz = errors.New("Otp Required")

		} else if c.PostForm("mynewPassword") == "" {

			errorz = errors.New("Password Required")

		}

		c.SetCookie("Error", errorz.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/passwordchange")

		// c.JSON(200, gin.H{"verify": errorz.Error()})

		// return

	}
	num := c.PostForm("otp")

	otp, _ := strconv.Atoi(num)

	newpass := c.PostForm("mynewPassword")

	// email := c.PostForm("id")

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	Auth1 = spurtcore.NewInstance(&auth.Option{DB: DBIns, Token: "", Secret: os.Getenv("JWT_SECRET")})

	mem.Auth = &Auth1

	memdetail, mailcheck, err := mem.CheckEmailInMember(0, memb.Email)

	if err != nil {

		fmt.Println(err)
	}

	fmt.Println(mailcheck)

	_, err1 := mem.ChangePassword(otp, memdetail.Id, newpass)

	if err1 != nil {

		c.SetCookie("Error", err1.Error(), 3600, "", "", false, false)

		c.Redirect(301, "/passwordchange")

		// c.JSON(200, gin.H{"verify": err1.Error()})

		return

	}

	// c.SetCookie("success", "", 3600, "", "", false, false)

	// c.JSON(200, gin.H{"verify": ""})

	c.Redirect(301, "/myprofile")
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

	// email := c.PostForm("email")
	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	log.Println(memb)

	verify, err := GenarateOtp(memb.Email)

	if err != nil {
		c.JSON(200, gin.H{"verify": err.Error()})
	} else {
		c.JSON(200, gin.H{"verify": verify})
	}

}

/* Resend Otp */
func AgainOtpGenarate1(c *gin.Context) {

	email := c.PostForm("email")
	// mem.Auth = &Auth

	// memb, _ := mem.GetMemberDetails()

	// log.Println(memb)

	verify, err := GenarateOtp(email)

	if err != nil {
		c.JSON(200, gin.H{"verify": err.Error()})
	} else {
		c.JSON(200, gin.H{"verify": verify})
	}

}

func TermsandService(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/termsandconditions.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Terms & Service"})

}
func PrivacyPolicy(c *gin.Context) {

	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html", "themes/"+Template+"/layouts/partials/privacypolicy.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Privacy Policy"})

}