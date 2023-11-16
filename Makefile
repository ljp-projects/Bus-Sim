minify:
	html-minifier --remove-attribute-quotes --remove-tag-whitespace --collapse-whitespace --input-dir ./src --file-ext html --output-dir ./dist
	tsc
	uglifyjs ./dist/index.js -c -m -o ./dist/index.min.js