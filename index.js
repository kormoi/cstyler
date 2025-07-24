class cstyle {
  constructor() {
    return this.createStyler([]);
  }

  createStyler(styles) {
    const styler = (text) => {
      return styles.reduce((str, styleCode) => styleCode.open + str + styleCode.close, text);
    };

    const addStyle = (open, close) => this.createStyler([...styles, { open, close }]);

    const styleMap = {
      // Text styles
      bold: ['\x1b[1m', '\x1b[22m'],
      italic: ['\x1b[3m', '\x1b[23m'],
      underline: ['\x1b[4m', '\x1b[24m'],
      dark: ['\x1b[2m', '\x1b[22m'],
      // Foreground colors
      red: ['\x1b[31m', '\x1b[39m'],
      green: ['\x1b[32m', '\x1b[39m'],
      yellow: ['\x1b[33m', '\x1b[39m'],
      blue: ['\x1b[34m', '\x1b[39m'],
      purpal: ['\x1b[35m', '\x1b[39m'],
      gray: ['\x1b[30m', '\x1b[39m'],
      // Background colors
      bgRed: ['\x1b[41m', '\x1b[49m'],
      bgGreen: ['\x1b[42m', '\x1b[49m'],
      bgYellow: ['\x1b[43m', '\x1b[49m'],
      bgBlue: ['\x1b[44m', '\x1b[49m'],
      bgPurpal: ['\x1b[45m', '\x1b[49m'],
      bgGray: ['\x1b[40m', '\x1b[49m']
    };

    for (const [name, [open, close]] of Object.entries(styleMap)) {
      Object.defineProperty(styler, name, {
        get: () => addStyle(open, close)
      });
    }

    return styler;
  }
}

module.exports = new cstyle();
