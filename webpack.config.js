const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'production',
	devtool : 'module-source-map',
	entry:{
		// "wxShare": path.resolve(__dirname, './src/js/index.js'),
		"index": path.resolve(__dirname, './src/js/index.js'),
		// "identity": path.resolve(__dirname, './src/js/identity.js'),
		// "relevantInfo": path.resolve(__dirname, './src/js/relevantInfo.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[hash:8].js'
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: __dirname + '/src/public/',
				to: './public'
			},
			{
				from: __dirname + '/src/json/',
				to: './json'
			}
		]),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			chunks: ['index'],
			inject: true,
			hash: true
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].[hash:8].css"
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [{
					loader: MiniCssExtractPlugin.loader,
					options: {
					  // 这里可以指定一个 publicPath
					  // 默认使用 webpackOptions.output中的publicPath
					  publicPath: '../'
					},
				},{
					loader: "css-loader",
					options: {
						modules: false,
						url: false
					}
				},{
					loader: "postcss-loader"
				}],
				include: [resolve('src')], //限制范围，提高打包速度
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: /node_modules/
			},
			{
				test:/\.(png|jpg|gif)/ ,
			    use:[{
				   loader:'url-loader',
				   options:{
					   limit:500000,
					   outputPath: 'images/'
				   }
			   }]
			},
			{
				test: /\.(html|htm)$/i,
				use: ['html-withimg-loader']
			}
		]
	},
    devServer: {
		contentBase: path.resolve(__dirname, "dist"), //监听地址
		host: "localhost", // 访问地址
		compress: true, // 服务器压缩
		port: 1717 // 运行端口
    },
	watchOptions: {
		poll: 1000, //监测修改的时间 单位（ms)
		aggregateTimeout: 500,  // 连续保存之间的反应间隔时间，小于500毫秒时，只打包一次
		ignored: /node_modules/,
	}
}