const errorHandler = (res, headers) => {
	res.writeHead(400, headers)
	res.write(
		JSON.stringify({
			status: 'false',
			message: err.message,
		})
	)
	res.end()
}

module.exports = errorHandler
