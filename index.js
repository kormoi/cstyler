class cstyler {
  constructor() {
    return this.createStyler([]);
  }

  createStyler(styles) {
    const styler = (text) => {
      return styles.reduce((str, styleCode) => styleCode.open + str + styleCode.close, text);
    };

    const addStyle = (open, close) => this.createStyler([...styles, { open, close }]);

    const styleMap = {
      bold: ['\x1b[1m', '\x1b[22m'],
      italic: ['\x1b[3m', '\x1b[23m'],
      underline: ['\x1b[4m', '\x1b[24m'],
      dark: ['\x1b[2m', '\x1b[22m'],
      red: ['\x1b[31m', '\x1b[39m'],
      green: ['\x1b[32m', '\x1b[39m'],
      yellow: ['\x1b[33m', '\x1b[39m'],
      blue: ['\x1b[34m', '\x1b[39m'],
      purpal: ['\x1b[35m', '\x1b[39m'],
      gray: ['\x1b[30m', '\x1b[39m'],
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

    // RGB support
    Object.defineProperty(styler, 'rgb', {
      get: () => (r, g, b) => {
        r = Math.max(0, Math.min(255, parseInt(r)));
        g = Math.max(0, Math.min(255, parseInt(g)));
        b = Math.max(0, Math.min(255, parseInt(b)));
        if ([r, g, b].some(v => isNaN(v))) {
          // fallback to white
          return addStyle('\x1b[97m', '\x1b[39m');
        }
        return addStyle(`\x1b[38;2;${r};${g};${b}m`, '\x1b[39m');
      }
    });

    // HEX support
    Object.defineProperty(styler, 'hex', {
      get: () => (hexCode) => {
        try {
          let hex = hexCode.toString().trim().replace('#', '').slice(0, 6);
          if (!/^[0-9a-fA-F]{6}$/.test(hex)) throw new Error();
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          return styler.rgb(r, g, b);
        } catch {
          return addStyle('\x1b[97m', '\x1b[39m'); // fallback to white
        }
      }
    });

    // Background RGB support
    Object.defineProperty(styler, 'bgrgb', {
      get: () => (r, g, b) => {
        r = Math.max(0, Math.min(255, parseInt(r)));
        g = Math.max(0, Math.min(255, parseInt(g)));
        b = Math.max(0, Math.min(255, parseInt(b)));
        if ([r, g, b].some(v => isNaN(v))) {
          // fallback to white background
          return addStyle('\x1b[107m', '\x1b[49m');
        }
        return addStyle(`\x1b[48;2;${r};${g};${b}m`, '\x1b[49m');
      }
    });

    // Background HEX support
    Object.defineProperty(styler, 'bghex', {
      get: () => (hexCode) => {
        try {
          let hex = hexCode.toString().trim().replace('#', '').slice(0, 6);
          if (!/^[0-9a-fA-F]{6}$/.test(hex)) throw new Error();
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          return styler.bgrgb(r, g, b);
        } catch {
          return addStyle('\x1b[107m', '\x1b[49m'); // fallback to white bg
        }
      }
    });

    return styler;
  }
}


module.exports = new cstyler();

const cstyle = new cstyler();

console.log(cstyle.bgrgb(255, 140, 0).bold('Orange RGB'));
console.log(cstyle.hex('#00ff0dff').underline('HEX Color'));