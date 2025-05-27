const axios = require('axios')

// Download image or file as buffer
const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		var res = await axios({
			method: 'get',
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(e)
	}
}

// Special buffer fetcher for menu image
const getMenuImageBuffer = async (url) => {
	try {
		return await getBuffer(url || 'https://qu.ax/bBkkd.jpg')
	} catch (e) {
		console.log("Error fetching menu image:", e)
		return null
	}
}

// Get admin participants only
const getGroupAdmins = (participants) => {
	var admins = []
	for (let i of participants) {
		i.admin !== null ? admins.push(i.id) : ''
	}
	return admins
}

// Generate random file name
const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

// Format large numbers (K, M, B, etc.)
const h2k = (eco) => {
	var lyrik = ['', 'K', 'M', 'B', 'T', 'P', 'E']
	var ma = Math.log10(Math.abs(eco)) / 3 | 0
	if (ma == 0) return eco
	var ppo = lyrik[ma]
	var scale = Math.pow(10, ma * 3)
	var scaled = eco / scale
	var formatt = scaled.toFixed(1)
	if (/\.0$/.test(formatt))
		formatt = formatt.substr(0, formatt.length - 2)
	return formatt + ppo
}

// Check if string is a valid URL
const isUrl = (url) => {
	return url.match(
		new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
			'gi'
		)
	)
}

// Convert any object to pretty JSON
const Json = (string) => {
	return JSON.stringify(string, null, 2)
}

// Format seconds into human-readable uptime
const runtime = (seconds) => {
	seconds = Number(seconds)
	var d = Math.floor(seconds / (3600 * 24))
	var h = Math.floor(seconds % (3600 * 24) / 3600)
	var m = Math.floor(seconds % 3600 / 60)
	var s = Math.floor(seconds % 60)
	var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : ''
	var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
	var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
	var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

// Pause execution for X ms
const sleep = async (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// Fetch JSON data from URL
const fetchJson = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: 'GET',
			url: url,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
			},
			...options
		})
		return res.data
	} catch (err) {
		return err
	}
}

// Export all functions
module.exports = {
	getBuffer,
	getGroupAdmins,
	getRandom,
	h2k,
	isUrl,
	Json,
	runtime,
	sleep,
	fetchJson,
	getMenuImageBuffer // only added for MENU command
}
