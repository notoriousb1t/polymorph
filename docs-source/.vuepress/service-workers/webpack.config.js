var path = require('path'); 

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, "docs-source/.vuepress"),
  entry: { 
    "svgo-worker": path.resolve(__dirname, "./svgo-worker.js")
  },
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: '[name].js'
  }
};