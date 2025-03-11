const { URL } = require("node:url");

/**
 * @param {string} url
 * @returns {boolean}
 * @example
 * isProtocolRelativeUrl("//example.com/foo/bar/baz.ext"); // true
 * isProtocolRelativeUrl("/foo/bar/baz.ext"); // false
 * isProtocolRelativeUrl("https://example.com/foo/bar/baz.ext"); // false
 */
const isProtocolRelativeUrl = (url) =>
  url.startsWith("//") && URL.canParse(`https:${url}`);

/**
 * @param {string} url
 * @returns {boolean}
 * @example
 * isUrl("https://example.com"); // true
 * isUrl("http://example.com"); // true
 * isUrl("//example.com"); // true
 */
const isUrl = (url) => URL.canParse(url) || isProtocolRelativeUrl(url);

module.exports = {
  isProtocolRelativeUrl,
  isUrl,
};
