package controller

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"
	"time"

	"gopkg.in/gomail.v2"
)

func GenarateOtp(email string) (em bool, err error) {

	mem.Auth = &auth1

	memdetail, mailcheck, err := mem.CheckEmailInMember(0, email)

	if mailcheck {

		rand.Seed(time.Now().UnixNano())

		min := 100000

		max := 999999

		randomNumber := min + rand.Intn(max-min+1)

		otp := strconv.Itoa(randomNumber)

		subject := "Your OTP Code"

		from := os.Getenv("MAIL_USERNAME")

		password := os.Getenv("MAIL_PASSWORD")

		to := email

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

	}
	return em, err

}
