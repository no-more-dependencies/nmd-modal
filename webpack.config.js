module.exports = {
	mode: "production",
	entry: {
		"nmd-modal": __dirname + "/js/webpack-entry.js"
	},
	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					}, {
						loader: "sass-loader",
					}
				]
			}, {
				test: /\.css$/i,
				use: [
					'style-loader',
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					}
				]
			}
		]
	}
};