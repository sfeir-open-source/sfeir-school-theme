import shelljs from 'shelljs';

shelljs.rm('-rf', './demo/web_modules');
shelljs.mkdir('-p', './demo/web_modules/sfeir-school-theme');
shelljs.mkdir('-p', './demo/web_modules/sfeir-school-theme/dist');
shelljs.cp('-rf', './dist/*', './demo/web_modules/sfeir-school-theme/dist');
shelljs.cp(
    './demo/web_modules/sfeir-school-theme/dist/sfeir-school-theme.d.ts',
    './demo/web_modules/sfeir-school-theme/dist/sfeir-school-theme.d.mts'
);
