# CSTYLER 🎨
**A lightweight, powerful console styler by kormoi.com**

`cstyler` is a zero-dependency Node.js toolkit designed to make your terminal output beautiful. It features an intuitive chainable API, support for HEX/RGB colors, and a unique nested inline styling system.

---

## 🚀 Key Features
* **Auto-Detection:** Automatically strips styles if the terminal doesn't support them (perfect for logs).
* **Chainable API:** Mix styles easily using dot notation.
* **TrueColor Support:** Use HEX and RGB for millions of colors.
* **Smart Nesting:** Complex nested styling using tagged template literals.
* **No Overhead:** Built to be fast and lightweight.

---

## 📦 Installation

```bash
npm install cstyler
```
## 🛠 Usage
### 1. Basic Styling (Chainable)
You can combine text styles and colors using simple dot notation.
JavaScript
```js
const cstyler = require("cstyler");

// Bold, Underline, and Yellow text
console.log(cstyler.bold.underline.yellow("Hello World!"));

// Darkened green text
console.log(cstyler.green.dark("Subtle green message"));
```
### 2. Custom Colors (HEX & RGB)
Go beyond the standard 16 colors with TrueColor support.
JavaScript
```js
// Foreground Colors
console.log(cstyler.hex('#FF5733')("Vibrant Orange"));
console.log(cstyler.rgb(100, 150, 200)("Custom Blue"));

// Background Colors
console.log(cstyler.bgHex('#333').white("White text on dark grey"));
```
### 3. Inline Nested Styling (Tagged Templates)
This is the most powerful way to style complex strings. Use {style text} syntax inside backticks.
JavaScript
```js
console.log(cstyler`
  {bold.red Critical Error:} {italic.gray Connection failed.} 
  {bold.green Success! {italic.white kormoi.com is online.}}
  {hex('#00dbde').bold Powerful custom colors work inside too!}
`);
```
🎨 Available Styles
| Category | Available Properties |
| :--- | :--- |
| **Formatting** | bold, italic, underline, dark |
| **Colors** | red, green, blue, yellow, purple, cyan, white, gray, magenta |
| **Backgrounds** | bgRed, bgGreen, bgBlue, bgYellow, bgPurple, bgGray |
| **Custom** | .hex(), .rgb(), .bgHex(), .bgRgb() |

> Note: You cannot use two foreground colors at once (e.g., red.blue). The last color in the chain will take priority.

## 🛡 Smart Terminal Detection
`cstyler` is smart. If you pipe your output to a file or run it in an environment that doesn't support ANSI colors, it will **silently return plain text.** Your logs will remain clean and readable without any "garbage" characters.

## 👨‍💻 Author
### MD NASIRUDDIN AHMED
Visit us at: kormoi.com
`Feel free to use and contribute! Regards from kormoi.com.`