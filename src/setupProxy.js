const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://45.79.111.106",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      pathRewrite: {
        "^/api": ""
      }
    })
  );
};
