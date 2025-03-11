const { isUrl } = require("./util/url.cjs");
const { toRelative } = require("./util/path.cjs");

/**
 * @param {string} url
 * @returns {boolean}
 */
const skip = (url) => isUrl(url) || !url.startsWith("/");

/**
 * `relative` 필터 추가
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @example
 * output path: `/path/to/page.html`
 *
 * before:
 * ```html
 * <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative }}">
 * <img src="{{ '/assets/images/beautiful.png' | relative }}" alt="">
 * ```
 * after:
 * ```html
 * <link rel="stylesheet" href="../../assets/css/style.css">
 * <img src="../../assets/images/beautiful.png" alt="">
 * ```
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("relative", function (value) {
    if (skip(value)) {
      return value;
    }

    return toRelative(this.page.url, value);
  });
};
