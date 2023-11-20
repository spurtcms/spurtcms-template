package controller

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	spurtcore "github.com/spurtcms/spurtcms-core"
	"github.com/spurtcms/spurtcms-core/auth"
	"github.com/spurtcms/spurtcms-core/member"
	"gopkg.in/gomail.v2"
)

var flg = false

var Auth auth.Authorization

var mem member.MemberAuth

func GetAuth(token string) {

	auth := spurtcore.NewInstance(&auth.Option{DB: DB, Token: token, Secret: os.Getenv("JWT_SECRET")})

	Auth = auth

}

func MemberLogin(c *gin.Context) {

	c.HTML(200, "login.html", gin.H{"title": "Login"})

}
func MemberLogout(c *gin.Context) {

	flg = false

	c.Redirect(301, "/")

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
	
	imageData := c.PostForm("crop_data")

	if imageData != "" {

		imageName, storagePath, _ := ConvertBase64(imageData, "storage/users")

		fmt.Println("imgname", imageName, storagePath)
	}

	upt, _ := mem.MemberUpdate(member.MemberCreation{FirstName: fname, LastName: lname, MobileNo: mobile})

	log.Println("update", upt)

	json.NewEncoder(c.Writer).Encode(true)
}

func ChangeEmail(c *gin.Context) {

	c.HTML(200, "changeEmailOtp.html", gin.H{"title": "ChangeEmail"})
}

func AddNewEmail(c *gin.Context) {

	c.HTML(200, "changeEmail.html", gin.H{"title": "NewEmail"})

}

func ChangePassword(c *gin.Context) {

	c.HTML(200, "ChangePasswordOtp.html", gin.H{"title": "ChangePassword"})
}

func AddNewPassword(c *gin.Context) {

	c.HTML(200, "ChangePassword.html", gin.H{"title": "NewPassword"})
}

func OtpGenarate(c *gin.Context) {

	eamil := c.PostForm("email")

	mem.Auth = &auth1

	memdetail, mailcheck, err := mem.CheckEmailInMember(0, eamil)

	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(mailcheck)

	if mailcheck {

		rand.Seed(time.Now().UnixNano())

		min := 100000

		max := 999999

		randomNumber := min + rand.Intn(max-min+1)

		otp := strconv.Itoa(randomNumber)

		subject := "Your OTP Code"

		from := os.Getenv("MAIL_USERNAME")

		password := os.Getenv("MAIL_PASSWORD")

		to := eamil

		mem.UpdateOtp(randomNumber, memdetail.Id)

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

	// confirmemail := c.PostForm("confirmemail")

	_, err := mem.ChangeEmailId(otp, newemail)

	if err != nil {

		json.NewEncoder(c.Writer).Encode(gin.H{"verify": err.Error()})

	} else {

		json.NewEncoder(c.Writer).Encode(gin.H{"verify": ""})

	}

}

// Change Password

func OtpVerifypass(c *gin.Context) {

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

		json.NewEncoder(c.Writer).Encode(gin.H{"verify": err1.Error()})

	} else {

		json.NewEncoder(c.Writer).Encode(gin.H{"verify": ""})

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
