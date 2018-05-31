module.exports = {
  dest: "./docs",
  title: "Polymorph",
  description: "Get Your SVG into Shape!",
  base: "/polymorph/",
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  themeConfig: {
    nav: [
        { text: "Setup", link: "/setup.md" },
        { text: "API Reference", link: "/api.md" }
    ]
  }
}