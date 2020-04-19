const HTMLWebpackPlugin = require('html-webpack-plugin')
const { config: { title } } = require('./package.json')
const path = require('path')

module.exports = (env, { mode = 'production' }) => ({
  mode,
  output: {
    path: path.join(__dirname, 'docs'),
    publicPath: '/coronavirus-sonification/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 2.5%, not dead'
              }],
              '@babel/preset-react'
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({ title })
  ],
  watch: mode !== 'production',
  resolve: {
    extensions: ['.jsx', '.js', '.json']
  }
})
