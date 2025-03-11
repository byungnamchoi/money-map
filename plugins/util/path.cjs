const { win32, posix } = require("node:path");
const { normalize, dirname, join, relative, sep } = posix;

/**
 * @param {string} input
 * @returns {string}
 * @example
 * toPosix("foo\\bar\\baz.ext"); // "foo/bar/baz.ext"
 * toPosix("foo/bar/baz.ext"); // "foo/bar/baz.ext"
 * toPosix("foo\\bar/baz.ext"); // "foo/bar/baz.ext"
 */
const toPosix = (input) => normalize(input.split(win32.sep).join(sep));

/**
 * @param {string} input
 * @returns {string}
 * @example
 * getDirectory("foo/bar/baz.ext"); // "foo/bar"
 * getDirectory("foo/bar/baz/"); // "foo/bar/baz"
 */
const getDirectory = (input) =>
  toPosix(input).endsWith(sep) ? dirname(join(input, "x")) : dirname(input);

/**
 * @param {string} from
 * @param {string} to
 * @returns {string}
 * @example
 * toRelative("foo/bar/baz.ext", "foo/bar/qux.ext"); // "qux.ext"
 * toRelative("foo/bar/", "foo/bar/qux.ext"); // "qux.ext"
 * toRelative("foo/bar/", "foo/baz/qux.ext"); // "../baz/qux.ext"
 */
const toRelative = (from, to) => relative(getDirectory(from), toPosix(to));

/**
 * @param {string} input
 * @returns {boolean}
 * @example
 * hasLeadingUnderscore("foo/bar/baz.ext"); // false
 * hasLeadingUnderscore("foo/_bar/baz.ext"); // true
 * hasLeadingUnderscore("foo/bar/_baz.ext"); // true
 * hasLeadingUnderscore("_foo/bar/baz.ext"); // true
 */
const hasLeadingUnderscore = (input) =>
  toPosix(input)
    .split(sep)
    .some((part) => part.startsWith("_"));

module.exports = {
  toPosix,
  getDirectory,
  toRelative,
  hasLeadingUnderscore,
};
