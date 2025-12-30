class cstyler {
  constructor() {
    // SILENT CHECK: No printing, just querying the environment
    this.enabled = process.stdout.isTTY && 
                   (process.stdout.getColorDepth ? process.stdout.getColorDepth() > 1 : true);

    this.styleMap = {
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
      purple: ['\x1b[35m', '\x1b[39m'],
      gray: ['\x1b[90m', '\x1b[39m'],
      white: ['\x1b[97m', '\x1b[39m'],
      cyan: ['\x1b[36m', '\x1b[39m'],
      magenta: ['\x1b[35m', '\x1b[39m'],

      // Background colors
      bgRed: ['\x1b[41m', '\x1b[49m'],
      bgGreen: ['\x1b[42m', '\x1b[49m'],
      bgYellow: ['\x1b[43m', '\x1b[49m'],
      bgBlue: ['\x1b[44m', '\x1b[49m'],
      bgPurple: ['\x1b[45m', '\x1b[49m'],
      bgGray: ['\x1b[100m', '\x1b[49m'],
    };

    return this.createStyler([]);
  }

  createStyler(styles) {
    const styler = (text) => {
      // Return plain text if terminal doesn't support styling
      if (!this.enabled) return text;
      return styles.reduce((str, { open, close }) => open + str + close, text);
    };

    const addStyle = (open, close) => this.createStyler([...styles, { open, close }]);

    // Map standard styles
    for (const [name, [open, close]] of Object.entries(this.styleMap)) {
      Object.defineProperty(styler, name, {
        get: () => this.enabled ? addStyle(open, close) : styler,
      });
    }

    // RGB Support
    styler.rgb = (r, g, b) => {
      if (!this.enabled) return styler;
      return addStyle(`\x1b[38;2;${r};${g};${b}m`, '\x1b[39m');
    };

    // Hex Support
    styler.hex = (hex) => {
      if (!this.enabled) return styler;
      const cleanHex = hex.replace(/^#/, '');
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return styler.rgb(r, g, b);
    };

    // Tagged Template Parser
    styler.tag = (strings, ...values) => {
      const fullText = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
      return this.parseInlineStyles(fullText);
    };

    this.parseInlineStyles = (text) => {
      const parse = (str) => {
        let result = '', i = 0;
        while (i < str.length) {
          if (str[i] === '{') {
            let level = 1, j = i + 1;
            while (j < str.length && level > 0) {
              if (str[j] === '{') level++;
              else if (str[j] === '}') level--;
              j++;
            }
            if (level !== 0) { result += str.slice(i); break; }

            const content = str.slice(i + 1, j - 1);
            const spaceIdx = content.indexOf(' ');

            if (spaceIdx === -1) {
              result += '{' + content + '}';
            } else {
              const styleStr = content.slice(0, spaceIdx);
              const innerText = content.slice(spaceIdx + 1);
              const parsedInner = parse(innerText);

              if (!this.enabled) {
                result += parsedInner;
              } else {
                // regex: match style name OR styleName(params)
                const styleParts = styleStr.match(/(\w+(\([^)]*\))?)/g) || [];
                let styledText = parsedInner;

                for (let part of styleParts.reverse()) {
                  if (part.startsWith('hex')) {
                    const val = part.match(/\(([^)]+)\)/)?.[1].replace(/['"]/g, '');
                    styledText = styler.hex(val)(styledText);
                  } else if (part.startsWith('rgb')) {
                    const vals = part.match(/\(([^)]+)\)/)?.[1].split(',').map(Number);
                    styledText = styler.rgb(...vals)(styledText);
                  } else if (this.styleMap[part]) {
                    const [open, close] = this.styleMap[part];
                    styledText = open + styledText + close;
                  }
                }
                result += styledText;
              }
            }
            i = j;
          } else {
            result += str[i++];
          }
        }
        return result;
      };
      return parse(text);
    };

    return new Proxy(styler, {
      apply: (target, thisArg, args) => 
        (Array.isArray(args[0]) && 'raw' in args[0]) ? styler.tag(...args) : styler(...args),
      get: (target, prop) => (prop in styler) ? styler[prop] : styler,
    });
  }
}

module.exports = new cstyler();