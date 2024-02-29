run:
	go run main.go

build:
	go build -o spurtcms-template

permission:
	chmod -R 777 spurtcms-template

start:
	sudo systemctl start spurtcms-template
