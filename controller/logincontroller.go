package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	spurtcore "github.com/spurtcms/spurtcms-core"
	"github.com/spurtcms/spurtcms-core/auth"
	"github.com/spurtcms/spurtcms-core/member"
	"gopkg.in/gomail.v2"
)
var flg = false 

var Auth auth.Authority

var mem member.MemberAuth

func GetAuth(token string) {

	auth := spurtcore.NewInstance(&auth.Option{DB: DB, Token: token, Secret: os.Getenv("JWT_SECRET")})

	Auth = auth

}

func MemberLogin(c *gin.Context) {
	c.HTML(200, "login.html", gin.H{"title": "Login"})
	
}
func CheckMemberLogin(c *gin.Context) {

	name := c.PostForm("email")

	password := c.PostForm("password")

	token, err := mem.CheckMemberLogin(member.MemberLogin{Emailid: name, Password: password}, DB, os.Getenv("JWT_SECRET"))

	GetAuth(token)

	sp.MemAuth = &Auth

	if err != nil {
		json.NewEncoder(c.Writer).Encode(gin.H{"verify": err.Error()})

	} else {
		flg = true
		json.NewEncoder(c.Writer).Encode(gin.H{"verify": ""})

	}

}

func MemberRegister(c *gin.Context) {

	GetAuth("")

	mem.Auth = &Auth

	fname := c.PostForm("fname")

	lname := c.PostForm("lname")

	mobile := c.PostForm("mobile")

	email := c.PostForm("email")

	password := c.PostForm("password")

	reg, err := mem.MemberRegister(member.MemberCreation{FirstName: fname, LastName: lname, Email: email, MobileNo: mobile, Password: password})

	log.Println("register", reg)

	log.Println("error", err)

	json.NewEncoder(c.Writer).Encode(true)

}

func SignUp(c *gin.Context) {

	c.HTML(200, "signup.html", gin.H{"title": "SignUp"})

}

func Retrieve(c *gin.Context) {

	c.HTML(200, "retrieve.html", gin.H{"title": "Retrieve"})

}

func Reset(c *gin.Context) {

	c.HTML(200, "reset.html", gin.H{"title": "Reset"})

}

func MyProfile(c *gin.Context) {

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	c.HTML(200, "myprofile.html", gin.H{"title": "My Profile", "member": memb})
}
func MyprofileUpdate(c *gin.Context) {

	mem.Auth = &Auth

	fname := c.PostForm("fname")

	lname := c.PostForm("lname")

	mobile := c.PostForm("mobile")

	upt, _ := mem.MemberUpdate(member.MemberCreation{FirstName: fname, LastName: lname, MobileNo: mobile})

	log.Println("ok", upt)

	json.NewEncoder(c.Writer).Encode(true)
}

func ChangeEmail(c *gin.Context) {

	c.HTML(200, "changeEmailOtp.html", gin.H{"title": "ChangeEmail"})
}
func AddNewEmail(c *gin.Context) {

	c.HTML(200, "changeEmail.html", gin.H{"title": "NewEmail"})

}

func OtpGenarate(c *gin.Context) {

	eamil := c.PostForm("email")

	log.Println("email", eamil)

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	if memb.Email == eamil {

		rand.Seed(time.Now().UnixNano())

		min := 100000

		max := 999999

		randomNumber := min + rand.Intn(max-min+1)

		otp := strconv.Itoa(randomNumber)

		subject := "Your OTP Code"

		from := os.Getenv("MAIL_USERNAME")

		password := os.Getenv("MAIL_PASSWORD")

		to := memb.Email

		mem.UpdateOtp(randomNumber)

		message := fmt.Sprintf("Your OTP code is: %s", otp)

		m := gomail.NewMessage()

		m.SetHeader("From", from)

		m.SetHeader("To", to)

		m.SetHeader("Subject", subject)

		m.SetBody("text/plain", message)

		d := gomail.NewDialer("smtp.gmail.com", 587, from, password)

		err := d.DialAndSend(m)

		log.Println("error", err)

		json.NewEncoder(c.Writer).Encode(gin.H{"verify": ""})

	} else {
		json.NewEncoder(c.Writer).Encode(gin.H{"verify": "invalid email"})

	}

}
func OtpVerify(c *gin.Context) {

	num := c.PostForm("otp")

	otp, _ := strconv.Atoi(num)

	newemail := c.PostForm("newemail")

	log.Println("newemail", newemail)

	// confirmemail := c.PostForm("confirmemail")

	_, err := mem.ChangeEmailId(otp, newemail)

	if err != nil {
		json.NewEncoder(c.Writer).Encode(gin.H{"verify": err.Error()})

	} else {
		json.NewEncoder(c.Writer).Encode(gin.H{"verify": ""})

	}

}
