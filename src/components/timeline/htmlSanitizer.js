import sanitizeHtml  from "sanitize-html-react";

// NOTE // cleans html text used for the on hover
const cleanHtml = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [
      "blockquote",
      "p",
      "a",
      "ul",
      "ol",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "strike",
      "del",
      "br",
      "div",
      "sup",
      "sub",
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src"],
    },
    // NOTE // Lots of these won't come up by default because we don't allow them
    selfClosing: [
      "img",
      "br",
      "hr",
      "area",
      "base",
      "basefont",
      "input",
      "link",
      "meta",
    ],
    // NOTE // URL schemes we permit
    // allowedSchemes: ["http", "https", "ftp", "mailto"],
    // allowedSchemesByTag: {},
  });
} 

export default cleanHtml