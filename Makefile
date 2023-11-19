.DEFAULT_GOAL := prepare

deploy:
	@git pull
	@git add .
	@git commit -m "Changed Stuff" -m "Please note that this was commited via a Makefile"
	@git push

prepare:
	@html-minifier --remove-attribute-quotes --remove-tag-whitespace --collapse-whitespace --input-dir ./src --file-ext html --output-dir ./dist
	@tsc
	@uglifyjs ./dist/index.js -c -m -o ./dist/index.min.js

test:
	@make prepare
	@yarn parcel /Users/geez/Library/Mobile\ Documents/com~apple~CloudDocs/Bus-SIm/dist/index.html