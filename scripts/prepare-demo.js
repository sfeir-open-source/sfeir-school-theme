const shelljs = require("shelljs");

shelljs.rm("-rf", "./demo/web_modules");
shelljs.mkdir("-p", "./demo/web_modules/sfeir-theme");
shelljs.cp("-rf", "./dist/*", "./demo/web_modules/sfeir-theme");
