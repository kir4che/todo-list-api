const http = require('http')
const { v4: uuidv4 } = require('uuid')
const { headers } = require('./constant')
const errorHandler = require('./errorHandler')

// 用來存放代辦事項的陣列
const todoList = []

const requestListener = (req, res) => {
	let body = '' // 用來存放請求的資料
	req.on('data', (chunk) => {
		body += chunk
	})

	if (req.url == '/todoList' && req.method == 'GET') {
		// 取得所有代辦事項
		res.writeHead(200, headers)
		res.write(
			JSON.stringify({
				status: 'success',
				data: todoList,
			})
		)
		res.end()
	} else if (req.url == '/todoList' && req.method == 'POST') {
		// 新增一筆代辦事項
		req.on('end', () => {
			try {
				const title = JSON.parse(body).title
				if (title !== undefined) errorHandler(res, headers)
				const todo = {
					title,
					id: uuidv4(),
					completed: false,
				}
				todoList.push(todo)
				res.writeHead(200, headers)
				res.write(
					JSON.stringify({
						status: 'success',
						data: todo,
					})
				)
				res.end()
			} catch (err) {
				errorHandler(res, headers)
			}
		})
	} else if (req.url.startsWith('/todoList/') && req.method == 'PATCH') {
		// 更新一筆代辦事項
		req.on('end', () => {
			try {
				const title = JSON.parse(body).title
				const id = req.url.split('/').pop()
				const index = todoList.findIndex((todo) => todo.id === id)
				if (todo !== undefined && index !== -1) {
					todoList[index].title = title
					res.writeHead(200, headers)
					res.write(
						JSON.stringify({
							status: 'success',
							data: todoList,
						})
					)
					res.end()
				} else errorHandler(res, headers)
			} catch (err) {
				errorHandler(res, headers)
			}
		})
	} else if (req.url == '/todoList' && req.method == 'DELETE') {
		// 刪除所有代辦事項
		todoList.length = 0
		res.writeHead(200, headers)
		res.write(
			JSON.stringify({
				status: 'success',
				data: todoList,
			})
		)
		res.end()
	} else if (req.url.startsWith('/todoList/') && req.method == 'DELETE') {
		// 刪除一筆代辦事項
		const id = req.url.split('/').pop()
		const index = todoList.findIndex((todo) => todo.id === id)
		if (index !== -1) {
			todoList.splice(index, 1)
			res.writeHead(200, headers)
			res.write(
				JSON.stringify({
					status: 'success',
					data: todoList,
				})
			)
			res.end()
		} else errorHandler(res, headers)
	} else if (req.method == 'OPTIONS') {
		// 處理 OPTIONS 請求
		res.writeHead(200, headers)
		res.end()
	} else {
		// 404 Not Found
		res.writeHead(404, headers)
		res.write(
			JSON.stringify({
				status: 'false',
				message: '404 Not Found',
			})
		)
		res.end()
	}
}

const server = http.createServer(requestListener)
server.listen(8080)
