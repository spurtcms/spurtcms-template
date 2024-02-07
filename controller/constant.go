package controller

import (
	"fmt"
	"log"
	"os"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	spurtcore "github.com/spurtcms/pkgcore"
	"github.com/spurtcms/pkgcore/auth"
	"gorm.io/gorm"
)

var Template string

var Flg bool

var DBIns *gorm.DB

var TZONE, _ = time.LoadLocation(os.Getenv("TIME_ZONE"))

// var nonAlphanumericRegex = regexp.MustCompile(`[^a-zA-Z0-9 ]+`)

var nonAlphanumericRegex = regexp.MustCompile(`[^\w]`)

func GetTheme(themename string) {

	if themename == "" {

		log.Println("Config theme name is empty")

	}

	Template = themename

}

// check the jwt token with authorized
func JWTAuth() gin.HandlerFunc {

	return func(c *gin.Context) {

		session, _ := Store.Get(c.Request, os.Getenv("SESSION_KEY"))

		tkn := session.Values["token"]

		if tkn == nil {

			// c.Abort()

			// c.Writer.Header().Set("Pragma", "no-cache")

			Auth1 = spurtcore.NewInstance(&auth.Option{DB: DBIns, Token: "", Secret: ""})

			// c.Redirect(301, "/")

			// c.Next()

		} else {

			session.Values["token"] = tkn

			session.Options.MaxAge = 60 * 60 * 2

			session.Save(c.Request, c.Writer)

			token := tkn.(string)

			Claims := jwt.MapClaims{}
			tkn, err := jwt.ParseWithClaims(token, Claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(os.Getenv("ACCESS_SECRET")), nil
			})
			if err != nil {
				if err == jwt.ErrSignatureInvalid {
					fmt.Println(err)
					return
				}

				// fmt.Println(err, "+++++++++++++++++++++++")
				c.Abort()

				c.Writer.Header().Set("Pragma", "no-cache")

				session.Options.MaxAge = -1

				session.Save(c.Request, c.Writer)

				// c.Redirect(301, "/")
				return
			}
			if !tkn.Valid {
				fmt.Println(tkn)
				return
			}

			GetAuth(token)

			Auth1 = spurtcore.NewInstance(&auth.Option{DB: DBIns, Token: token, Secret: os.Getenv("JWT_SECRET")})

			Flg = true

			memberid := Claims["member_id"]

			c.Set("userid", memberid)

			c.Header("Cache-Control", "no-cache, no-store, must-revalidate")

			c.Header("Pragma", "no-cache")

			c.Header("Expires", "0")

			c.Next()

		}

	}
}

func DashBoardAuth() gin.HandlerFunc {

	return func(c *gin.Context) {
		session, _ := Store.Get(c.Request, os.Getenv("SESSION_KEY"))

		token := session.Values["token"]

		if token != nil {

			c.Writer.Header().Set("Pragma", "no-cache")

			c.Redirect(301, "/")

			return
		}

	}
}
