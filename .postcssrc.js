const path = require("node:path/posix");
const { cwd } = require("node:process");
const ROOT = cwd();
const DIST = path.resolve(ROOT, "dist");

const { isUrl } = require("./plugins/util/url.cjs");
const { toRelative } = require("./plugins/util/path.cjs");

/**
 * @param {string} url
 * @returns {boolean}
 */
const skip = (url) => isUrl(url) || !url.startsWith("/");

module.exports = {
  plugins: {
    "postcss-preset-env": {
      features: {
        "nesting-rules": true,
        "custom-selectors": true,
      },
    },
    "postcss-import": {
      filter(url) {
        return !url.includes("/fonts/");
      },
    },
    "postcss-url": {
      url(asset, dir) {
        if (skip(asset.url)) {
          return path.normalize(asset.url);
        }

        return toRelative(
          path.join(ROOT, dir.to, path.sep),
          path.join(DIST, asset.url),
        );
      },
    },
  },
};
