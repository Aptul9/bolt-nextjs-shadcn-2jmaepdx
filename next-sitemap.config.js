/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://passcore.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: "*",
        disallow: ["/about"],
      },
    ],
  },
  exclude: ["/dashboard/*"]
};
