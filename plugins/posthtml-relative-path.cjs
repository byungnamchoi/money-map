const { isUrl } = require("./util/url.cjs");
const { toRelative } = require("./util/path.cjs");

/**
 * @param {string} url
 * @returns {boolean}
 */
const skip = (url) => isUrl(url) || !url.startsWith("/");

/**
 * @param {{pathPrefix: string}} options
 * @returns {import("posthtml").Plugin}
 */
const plugin = (options = {}) => {
  const { pathPrefix = "/" } = options;
  const attrsWithUrl = [
    "action",
    "cite",
    "data",
    "formaction",
    "href",
    "itemid",
    "poster",
    "src",
  ].map((attr) => ({
    matcher: {
      attrs: { [attr]: true },
    },
    callback(node) {
      const url = node.attrs[attr].trim();

      if (skip(url)) {
        return node;
      }

      node.attrs[attr] = toRelative(pathPrefix, url);

      return node;
    },
  }));

  return (tree) => {
    attrsWithUrl.forEach(({ matcher, callback }) => {
      tree.match(matcher, callback);
    });

    tree.match({ attrs: { ping: true } }, (node) => {
      const urls = node.attrs.ping.split(/\s+/).map((url) => {
        url = url.trim();

        if (skip(url)) {
          return url;
        }

        return toRelative(pathPrefix, url);
      });

      node.attrs.ping = urls.join(" ");

      return node;
    });

    tree.match({ attrs: { srcset: true } }, (node) => {
      const urls = node.attrs.srcset.split(",").map((url) => {
        url = url.trim();

        if (skip(url)) {
          return url;
        }

        const [src, size] = url.split(/\s+/);

        return [toRelative(pathPrefix, src), size].join(" ");
      });

      node.attrs.srcset = urls.join(",");

      return node;
    });

    return tree;
  };
};

module.exports = plugin;
