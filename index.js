class cstyler {
  constructor() {
    // Basic ANSI styles map
    this.styleMap = {
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

    return this.createStyler([]);
  }

  createStyler(styles) {
    const styler = (text) => {
      // Wrap text with all collected styles in order
      return styles.reduce((str, styleCode) => styleCode.open + str + styleCode.close, text);
    };

    // Helper to add a new style in chain
    const addStyle = (open, close) => this.createStyler([...styles, { open, close }]);

    // Dynamically add style properties to chain calls
    for (const [name, [open, close]] of Object.entries(this.styleMap)) {
      Object.defineProperty(styler, name, {
        get: () => addStyle(open, close),
      });
    }

    // Proxy to catch invalid style chains
    const proxy = new Proxy(styler, {
      get: (target, prop) => {
        if (prop in target) return target[prop];
        console.warn(`Warning: Unknown style '${String(prop)}' used. Ignoring.`);
        return target; // no-op to continue chain safely
      },
      apply: (target, thisArg, args) => {
        if (args.length === 0) return "";
        return target(args[0]);
      },
    });

    // Attach tagged template literal parser for inline style
    proxy[Symbol.call] = proxy; // make callable

    proxy.inlineStyle = (strings, ...values) => {
      const raw = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');

      // Parse and replace inline style tags with ANSI codes
      return this.parseInlineStyles(raw);
    };

    // Enable calling proxy as tagged template: cstyler`...`
    const taggedTemplateHandler = (strings, ...values) => proxy.inlineStyle(strings, ...values);
    Object.setPrototypeOf(taggedTemplateHandler, proxy);

    return taggedTemplateHandler;
  }

  parseInlineStyles(text) {
    // Parse text with nested {styles ...} blocks with support for nested tags
    // Safe fallback: unknown styles ignored

    // Regex to find outermost style blocks (handles nested by recursive parser)
    const parse = (input) => {
      let output = "";
      let i = 0;

      while (i < input.length) {
        if (input[i] === '{') {
          // Find matching closing brace accounting nested braces
          let level = 1;
          let j = i + 1;
          while (j < input.length && level > 0) {
            if (input[j] === '{') level++;
            else if (input[j] === '}') level--;
            j++;
          }
          if (level !== 0) {
            // Unmatched brace, output literally
            output += input.slice(i, j);
            i = j;
            continue;
          }

          // Extract content inside braces, e.g. "bold.red Hello {underline nested}"
          const inside = input.slice(i + 1, j - 1).trim();

          // Separate style names from text:
          // styles are the leading words separated by dots until first space
          // rest is the text to style
          const firstSpace = inside.indexOf(' ');
          if (firstSpace === -1) {
            // No space found, treat whole inside as style with empty text
            output += this.applyStyles(inside, "");
          } else {
            const stylePart = inside.slice(0, firstSpace);
            const textPart = inside.slice(firstSpace + 1);

            // Recursively parse text part (to support nested styles)
            const parsedText = parse(textPart);

            output += this.applyStyles(stylePart, parsedText);
          }

          i = j;
        } else {
          // Plain text, copy until next {
          const nextBrace = input.indexOf('{', i);
          if (nextBrace === -1) {
            output += input.slice(i);
            break;
          } else {
            output += input.slice(i, nextBrace);
            i = nextBrace;
          }
        }
      }

      return output;
    };

    return parse(text);
  }

  applyStyles(styleStr, text) {
    // styleStr: e.g. "bold.red.bgBlue"
    // text: string to wrap

    if (!styleStr) return text;

    const styles = styleStr.split('.');
    let openCodes = "";
    let closeCodes = "";

    for (const styleName of styles) {
      const codes = this.styleMap[styleName];
      if (codes) {
        openCodes += codes[0];
        closeCodes = codes[1] + closeCodes; // close in reverse order
      } else {
        // Unknown style - skip, safe fallback
        // Could log warning here if you want
      }
    }

    return openCodes + text + closeCodes;
  }
}

module.exports = new cstyler();
