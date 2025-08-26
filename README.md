# CSTYLER
Hello World!

Style your console log with your cstyler package by kormoi.com

This cstyler kit is fully free to use. You can colorize your console log useing this kit. You can use dot notation to add more style like 'bold, underline, italic, dark(for color), bg for background'. You have all red, green, blue, yellow, cyan, purpal, colors on both text color and background color.

You can not use two color names e.g. 'red.blue'.
How to use:
INSTALLING:

> npm install cstyler
>

Then it will install packages.
IMPORT:
const cstyle = require("cstyle");

USE:
console.log(cstyle.bold.underline.italic.dark.yellow("Here goes your text"));

You can add these colors by name: red, green, blue, yellow, purpal, grey. You can darken them with a .dark property accessor. You can add rbg, hex, bgrgb and bghex color using .hex('#123456'), and rgb(100,100,100) and same for bg hex and bg rgb. You can also add nested styling with inline styling with a backtick: cstyle`{bold.red Hello} {bold.green World! {italic Hi. This is kormoi.com}}`

Feel free to use.

**Regards from
kormoi.com
MD NASIRUDDIN AHMED**
