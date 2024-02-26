package models

import (
	"spurt-page-view/config"
	"time"
)

type TblEmailTemplate struct {
	Id              int
	TemplateName    string
	TemplateSubject string
	TemplateMessage string
	CreatedOn       time.Time
	CreatedBy       int
	ModifiedOn      time.Time `gorm:"DEFAULT:NULL"`
	ModifiedBy      int       `gorm:"DEFAULT:NULL"`
	DeletedOn       time.Time `gorm:"DEFAULT:NULL"`
	DeletedBy       int       `gorm:"DEFAULT:NULL"`
	IsDeleted       int       `gorm:"DEFAULT:0"`
	IsActive        int
	IsDefault       int
	DateString      string `gorm:"-"`
}

var db = config.SetupDB()

func GetTemplates(template *TblEmailTemplate, key string) error {

	if err := db.Table("tbl_email_template").Where("template_name=?", key).First(&template).Error; err != nil {

		return err
	}
	return nil
}
