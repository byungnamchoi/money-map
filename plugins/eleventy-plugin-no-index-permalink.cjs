const { hasLeadingUnderscore } = require("./util/path.cjs");

/**
 * `src/path/to/file.html` 파일을 `dist/path/to/file/index.html` 대신 `dist/path/to/file.html`로 출력합니다.
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addGlobalData("permalink", () => ({ page }) => {
    if (hasLeadingUnderscore(page.inputPath)) {
      return false;
    }

    const permalink = `${page.filePathStem}.${page.outputFileExtension}`;

    return permalink;
  });
};
