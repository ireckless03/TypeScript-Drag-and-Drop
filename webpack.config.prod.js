const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

// NodeJS export syntax: Of a JS object which is the configuration object picked up by Webpack:
module.exports = {
  mode: 'production',
  // Nope:
  // devServer: {
  //     historyApiFallback: true,
  // },

  // Nope:
  // devServer: {
  //     port: 8080,
  //     writeToDisk: true,
  //     proxy: {
  //         '/': 'http://localhost:8080'
  //     }
  // },
  entry: './src/app.ts',

  // Solves the Cannot Get/ issue
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },

  // Where the bundled .js file wil;l be created:
  output: {
    // Dynamic part: Tells Webpack to automatically create a new hash for every build which can help me with cashing in the browser
    // filename: 'bundle.[contenthash].js'
    filename: 'bundle.js',
    // Where the output should be written to (the directory). It can't be './dist'. It has to be a full/absolute path here:
    // Returns the absolute path to a certain folder. __dirname is a special constant, available globally in a NodeJS environment. (And Webpack uses NodeJS to execute the files)
    // And 'dist' means it will create a dist folder
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },

  // Tell Webpack that there will be generated source code maps already which it should extract and basically wire it correctly to the bundle it generates
  // So that once we get such bundle, we still have a great development experience
  // It's an entry

  // It tells Webpack what to do with the .ts files. How to work with the files it finds.
  module: {
    // We can specify different rules for different kind of files: loaders
    rules: [
      {
        // The test property describes a test Webpack will perform on ANY file it finds to find out this rule here applies or not (used a regular expression)
        // Example: Any file with .ts extension should be handled by this rule:
        test: /\.ts$/,
        // What Webpack should do with those files: should be handled by the typescript loader (ts-loader) which then in turn knows what to do with such a file:
        // The ts-loader will automatically take the ts-config file into account, so we don't need to add any extra configuration here
        use: 'ts-loader',
        // This tells Webpack to exclude what is inside node_modules
        exclude: /node_modules/
      },
    ]
  },


  // We tell Webpack what file extensions it adds to the imports it finds (by default it will find the .js files):
  resolve: {
    // Webpack will look for those files and then bundle all the files with those extensions which we are importing together
    extensions: ['.ts', '.js']
  },
  // We will use clean plugin to clear the dist folder before new outputs are written there so we always have lastest files
  // applied to general workflow
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]
};

