package controller

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	spurtcore "github.com/spurtcms/spurtcms-core"
	"github.com/spurtcms/spurtcms-core/auth"
	"github.com/spurtcms/spurtcms-core/member"
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

	if c.PostForm("email") == "" || c.PostForm("password") == "" {

		var errorz error

		if c.PostForm("email") == "" {

			errorz = errors.New("Email Required")

		} else if c.PostForm("password") == "" {

			errorz = errors.New("Password Required")

		}

		c.JSON(200, gin.H{"verify": errorz.Error()})

		return

	}

	name := c.PostForm("email")

	password := c.PostForm("password")

	token, err := mem.CheckMemberLogin(member.MemberLogin{Emailid: name, Password: password}, DB, os.Getenv("JWT_SECRET"))

	GetAuth(token)

	// logErr = err.Error()

	sp.MemAuth = &Auth

	if err != nil {

		c.JSON(200, gin.H{"verify": err.Error()})

	} else {

		flg = true

		c.JSON(200, gin.H{"verify": ""})
	}

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

	mem.MemberRegister(member.MemberCreation{FirstName: fname, LastName: lname, Email: email, MobileNo: mobile, Password: password})

	c.JSON(200, gin.H{"verify": ""})

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

	c.HTML(200, "myprofile.html", gin.H{"title": "My Profile", "member": memb, "myprofile": flg, "profilename": profilename})
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

	c.HTML(200, "changeEmailOtp.html", gin.H{"title": "ChangeEmail", "myprofile": flg, "profilename": profilename})
}

func AddNewEmail(c *gin.Context) {

	c.HTML(200, "changeEmail.html", gin.H{"title": "NewEmail", "myprofile": flg, "profilename": profilename})

}

func ChangePassword(c *gin.Context) {

	c.HTML(200, "ChangePasswordOtp.html", gin.H{"title": "ChangePassword", "myprofile": flg, "profilename": profilename})
}

func AddNewPassword(c *gin.Context) {

	c.HTML(200, "ChangePassword.html", gin.H{"title": "NewPassword", "myprofile": flg, "profilename": profilename})
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

	memdetail, _, err := mem.CheckEmailInMember(0, email)

	if err != nil {

		fmt.Println(err)
	}

	mem.ChangeEmailId(otp, memdetail.Id, newemail)

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
