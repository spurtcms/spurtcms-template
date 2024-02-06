package controller

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/smtp"
	"os"
	"spurt-page-view/models"
	"strconv"
	"strings"
	"sync"
	"text/template"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	spurtcore "github.com/spurtcms/pkgcore"
	"github.com/spurtcms/pkgcore/auth"
)

var Store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

func GenarateOtp(email string) (em bool, err error) {

	Auth1 = spurtcore.NewInstance(&auth.Option{DB: DBIns, Token: "", Secret: ""})

	mem.Auth = &Auth1

	memdetail, mailcheck, err := mem.CheckEmailInMember(0, email)

	if mailcheck {

		rand.Seed(time.Now().UnixNano())

		min := 100000

		max := 999999

		randomNumber := min + rand.Intn(max-min+1)

		otp := strconv.Itoa(randomNumber)

		mem.UpdateOtp(randomNumber, memdetail.Id)

		data := map[string]interface{}{

			"otp": otp,
		}

		var wg sync.WaitGroup

		wg.Add(1)

		Chan := make(chan string, 1)

		go OtpGenarateEmail(Chan, &wg, data, email, "otpgenarate")

		close(Chan)

	}

	if err != nil {

		return false, err
	}
	return true, err

}
func MemberCreateEmail(Chan chan<- string, wg *sync.WaitGroup, data map[string]interface{}, email, action string) {

	var templates models.TblEmailTemplate

	models.GetTemplates(&templates, "createmember")

	sub := templates.TemplateSubject

	msg := templates.TemplateMessage

	replacer := strings.NewReplacer(
		"{firstname}", data["fname"].(string),
		"{memberid}", data["memid"].(string),
		"{password}", data["Pass"].(string),
	)
	fmt.Println("repla", replacer, data["fname"])

	msg = replacer.Replace(msg)

	GenerateEmail(email, sub, msg, wg)
}
func GenerateEmail(email, subject, message string, wg *sync.WaitGroup) error {

	defer wg.Done()
	from := os.Getenv("MAIL_USERNAME")
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	contentType := "text/html"
	// Set up the SMTP server configuration.
	auth := smtp.PlainAuth("", os.Getenv("MAIL_USERNAME"), os.Getenv("MAIL_PASSWORD"), smtpHost)

	// Compose the email.
	emailBody := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nContent-Type: %s; charset=UTF-8\r\n\r\n%s", from, email, subject, contentType, message)

	// Connect to the SMTP server and send the email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{email}, []byte(emailBody))
	if err != nil {
		fmt.Println("Failed to send email:", err)
		return err
	} else {
		fmt.Println("Email sent successfully to:", email)
		return nil
	}

}
func OtpGenarateEmail(Chan chan<- string, wg *sync.WaitGroup, data map[string]interface{}, email, action string) {

	var templates models.TblEmailTemplate

	models.GetTemplates(&templates, "OTPgenerate")

	sub := templates.TemplateSubject

	msg := templates.TemplateMessage

	replacer := strings.NewReplacer(

		"{OTP}", data["otp"].(string),
	)
	fmt.Println("repla", replacer, data["fname"])

	msg = replacer.Replace(msg)

	GenerateEmail(email, sub, msg, wg)
}

func RenderTemplate(c *gin.Context, tmpl *template.Template, templateName string, data interface{}) {

	err := tmpl.ExecuteTemplate(c.Writer, templateName, data)

	if err != nil {

		c.String(http.StatusInternalServerError, err.Error())
	}
}

func FileNotFoundPage(c *gin.Context) {
	// Parse templates
	tmpl, err := template.ParseFiles("themes/"+Template+"/layouts/_default/single.html", "themes/"+Template+"/layouts/_default/baseof.html", "themes/"+Template+"/layouts/404.html", "themes/"+Template+"/layouts/partials/head.html", "themes/"+Template+"/layouts/partials/scripts/scripts.html")

	if err != nil {

		log.Fatal(err)
	}

	RenderTemplate(c, tmpl, "baseof.html", gin.H{"Title": "Login"})
}
