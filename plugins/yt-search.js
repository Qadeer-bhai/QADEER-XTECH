const config = require('../config')
const l = console.log
const { cmd, commands } = require('../command')
const dl = require('@bochilteam/scraper')  
const ytdl = require('yt-search');
const fs = require('fs-extra')
var videotime = 60000 // 1000 min
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: '.yts <search term>',
    react: "🔎",
    desc: "Search and get details from YouTube with thumbnails and buttons.",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please provide words to search.*')

        let arama = await ytdl(q)
        if (!arama || !arama.all || arama.all.length === 0) {
            return reply('No results found for your search.')
        }

        // Limit results to first 5 for cleaner UI
        let videos = arama.all.slice(0, 5)

        for (let video of videos) {
            let caption = `🎥 *${video.title}*\n⏳ Duration: ${video.timestamp}\n👀 Views: ${video.views.toLocaleString()}\n🔗 Link: ${video.url}\n\nPowered by QADEER-XTECH`

            let buttons = [
                {
                    buttonId: `.ytplay ${video.url}`,
                    buttonText: { displayText: '▶️ Play Video' },
                    type: 1
                }
            ]

            // Get thumbnail buffer to send image
            let thumbnailBuffer = null
            try {
                thumbnailBuffer = await getBuffer(video.thumbnail)
            } catch {
                thumbnailBuffer = null
            }

            await conn.sendMessage(
                from,
                {
                    image: thumbnailBuffer ? { data: thumbnailBuffer } : null,
                    caption: caption,
                    footer: 'QADEER-XTECH',
                    buttons: buttons,
                    headerType: 4
                },
                { quoted: mek }
            )
        }

    } catch (e) {
        l(e)
        reply('*Error occurred while searching YouTube.*')
    }
})
