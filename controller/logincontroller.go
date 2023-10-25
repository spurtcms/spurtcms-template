package controller

import (
	"encoding/json"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	spurtcore "github.com/spurtcms/spurtcms-core"
	"github.com/spurtcms/spurtcms-core/auth"
	"github.com/spurtcms/spurtcms-core/member"
	"gorm.io/gorm"
)

var Auth auth.Authority

var mem member.MemberAuth

var DB *gorm.DB

func init() {

	er := godotenv.Load()

	if er != nil {
		log.Fatalf("Error loading .env file")
	}

	DB = spurtcore.DBInstance(os.Getenv("DB_HOST"), os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))
}
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

	log.Println("chk", name, password)

	token, err := mem.CheckMemberLogin(member.MemberLogin{Emailid: name, Password: password}, DB, os.Getenv("JWT_SECRET"))

	GetAuth(token)
	log.Println("token", token)
	sp.MemAuth = &Auth

	log.Println("auth", Auth)

	if err != nil {
		json.NewEncoder(c.Writer).Encode(gin.H{"verify": err.Error()})

	} else {
		json.NewEncoder(c.Writer).Encode(gin.H{"verify": ""})

	}

}

func MemberRegister(c *gin.Context) {

	GetAuth("")

	mem.Auth = &Auth

	log.Println("athu", Auth)

	fname := c.PostForm("fname")

	lname := c.PostForm("lname")

	mobile := c.PostForm("mobile")

	email := c.PostForm("email")

	password := c.PostForm("password")

	log.Println(fname, lname, mobile, email, password)

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

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	c.HTML(200, "changeEmailOtp.html", gin.H{"title": "ChangeEmail", "member": memb})
}

func OtpGenarate(c *gin.Context) {

	eamil := c.PostForm("email")

	log.Println("email",eamil)

	mem.Auth = &Auth

	memb, _ := mem.GetMemberDetails()

	if (memb.Email == eamil) {

		rand.Seed(time.Now().UnixNano())

		min := 100000

		max := 999999

		randomNumber := min + rand.Intn(max-min+1)

		mem.UpdateOtp(randomNumber)

		c.HTML(200, "changeEmail.html", gin.H{"title": "Change Email", "otp": randomNumber})
	}

}
