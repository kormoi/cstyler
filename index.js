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

    // Dynamically define valid style accessors
    for (const [name, [open, close]] of Object.entries(styleMap)) {
      Object.defineProperty(styler, name, {
        get: () => addStyle(open, close)
      });
    }

    // RGB support
    styler.rgb = (r, g, b) => {
      if (![r, g, b].every(n => Number.isInteger(n) && n >= 0 && n <= 255)) {
        console.error('Invalid RGB value. Falling back to white.');
        return addStyle('\x1b[37m', '\x1b[39m'); // white
      }
      const open = `\x1b[38;2;${r};${g};${b}m`;
      const close = '\x1b[39m';
      return addStyle(open, close);
    };

    // Hex color support
    styler.hex = (hex) => {
      try {
        if (typeof hex !== 'string') throw new Error();
        hex = hex.replace('#', '').slice(0, 6);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return styler.rgb(r, g, b);
      } catch (e) {
        console.error('Invalid hex color. Falling back to white.');
        return addStyle('\x1b[37m', '\x1b[39m'); // white
      }
    };

    // Background RGB
    styler.bgrgb = (r, g, b) => {
      if (![r, g, b].every(n => Number.isInteger(n) && n >= 0 && n <= 255)) {
        console.error('Invalid background RGB value. Falling back to white.');
        return addStyle('\x1b[47m', '\x1b[49m');
      }
      const open = `\x1b[48;2;${r};${g};${b}m`;
      const close = '\x1b[49m';
      return addStyle(open, close);
    };

    // Background Hex
    styler.bghex = (hex) => {
      try {
        if (typeof hex !== 'string') throw new Error();
        hex = hex.replace('#', '').slice(0, 6);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return styler.bgrgb(r, g, b);
      } catch (e) {
        console.error('Invalid background hex. Falling back to white.');
        return addStyle('\x1b[47m', '\x1b[49m');
      }
    };

    // Use Proxy to catch invalid property access
    return new Proxy(styler, {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        } else {
          console.log(`Wrong style: ${String(prop)}`);
          console.error(`Invalid property accessor used: ${String(prop)}`);
          return target; // Return unstyled version to continue chain safely
        }
      }
    });
  }
}

module.exports = new cstyler();
