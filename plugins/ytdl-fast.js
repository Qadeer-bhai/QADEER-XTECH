const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// MP4 video download

cmd({
    pattern: "mp4",
    alias: ["video"],
    react: "🎥",
    desc: "Download YouTube video",
    category: "main",
    use: ".mp4 < Yt url or Name >",
    filename: __filename
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        if (!q) return reply("📌 Please provide a YouTube URL or search query.");

        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length === 0) {
            return reply("❌ No results found for your query.");
        }

        const yts = yt.results[0];
        const videoUrl = yts.url;
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the video. Please try again later.");
        }

        // Thin line symbol (can be changed to — or | if you want)
        const lineStart = "┃";  // You can replace with "—" or "|" if you prefer

        const ytmsg = `
╭━━━━━🔥 YOUTUBE VIDEO DOWNLOADER 🔥━━━━━╮

${lineStart} Title    : ${yts.title}
${lineStart} Duration : ${yts.timestamp}
${lineStart} Views    : ${yts.views}
${lineStart} Author   : ${yts.author.name}
${lineStart} Link     : ${videoUrl}

╰─────🔰 Powered by QADEER-XTECH 🩷─────╯
        `.trim();

        await conn.sendMessage(
            from,
            {
                video: { url: data.result.download_url },
                caption: ytmsg,
                mimetype: "video/mp4"
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error(error);
        reply("🚫 An error occurred. Please try again later.");
    }
});

// MP3 song download 

cmd({ 
    pattern: "song", 
    alias: ["play", "mp3"], 
    react: "🎶", 
    desc: "Download YouTube song", 
    category: "main", 
    use: '.song <query>', 
    filename: __filename 
}, async (conn, mek, m, { from, sender, reply, q }) => { 
    try {
        if (!q) return reply("Please provide a song name or YouTube link.");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("No results found!");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("Download failed. Try again later.");

    await conn.sendMessage(from, {
    audio: { url: data.result.downloadUrl },
    mimetype: "audio/mpeg",
    fileName: `${song.title}.mp3`,
    contextInfo: {
        externalAdReply: {
            title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
            body: "Join our WhatsApp Channel",
            mediaType: 1,
            thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
            sourceUrl: 'https://whatsapp.com/channel/0029Vaw6yRaBPzjZPtVtA80A',
            mediaUrl: 'https://whatsapp.com/channel/0029Vaw6yRaBPzjZPtVtA80A',
            showAdAttribution: true,
            renderLargerThumbnail: true
        }
    }
}, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred. Please try again.");
    }
});
