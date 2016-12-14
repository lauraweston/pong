module.exports = {
  entry: './src/client/pong.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  watch: true
}
