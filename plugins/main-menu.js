const config = require('../config')  
const os = require('os')  
const moment = require('moment-timezone')  
const { cmd, commands } = require('../command')  
const { runtime } = require('../lib/functions')  
  
// Define icons for categories  
const categoryIcons = {  
    MENU: "📜",  
    ADMIN: "🛠️",  
    FUN: "🎉",  
    UTILITIES: "⚙️",  
    GAMES: "🎮",  
    DOWNLOAD: "⬇️",  
    OWNER: "👑",  
    MISC: "🔰",  
    UNCATEGORIZED: "❓"  
};  
  
cmd({  
    pattern: "menu",  
    alias: ["allmenu", "fullmenu"],  
    desc: "Show dynamic list of all bot commands",  
    category: "menu",  
    react: "📜",  
    filename: __filename  
},  
async (conn, mek, m, { from, reply }) => {  
    try {  
        // Group commands by category  
        let grouped = {};  
        for (let cmd of commands) {  
            const cat = (cmd.category || "UNCATEGORIZED").toUpperCase();  
            if (!grouped[cat]) grouped[cat] = [];  
            grouped[cat].push(cmd);  
        }  
  
        // Sort categories alphabetically  
        const sortedCategories = Object.keys(grouped).sort();  
  
        // Technical info  
        const botVer = config.BOT_VERSION || "v1.0.0";  
        const platform = os.platform();  
        const up = runtime(process.uptime());  
        const totalCmds = commands.length;  
        const time = moment.tz('Asia/Karachi').format("HH:mm:ss");  
        const date = moment.tz('Asia/Karachi').format("DD MMM YYYY");  
  
        // Header  
        let text = `╔════════════════════════════╗\n`;  
        text += `║    *${config.BOT_NAME} - Command Menu*    ║\n`;  
        text += `╠════════════════════════════╣\n`;  
        text += `║ 👑 Owner: *${config.OWNER_NAME}*\n`;  
        text += `║ ⏳ Uptime: *${up}*\n`;  
        text += `║ 📅 Date: *${date}* | 🕒 Time: *${time}*\n`;  
        text += `║ 💻 Platform: *${platform}*\n`;  
        text += `║ 🧩 Bot Version: *${botVer}*\n`;  
        text += `║ 📚 Total Commands: *${totalCmds}*\n`;  
        text += `╚════════════════════════════╝\n\n`;  
  
        // Category-wise commands with icons and command counts  
        for (let category of sortedCategories) {  
            const icon = categoryIcons[category] || "❓";  
            text += `╭─〔 ${icon} ${category} - (${grouped[category].length}) 〕─╮\n`;  
            text += grouped[category]  
                .map(cmd => `│ • *${config.PREFIX}${cmd.pattern}*${cmd.alias ? ` (Aliases: ${cmd.alias.join(", ")})` : ""}`)  
                .join('\n');  
            text += `\n╰────────────────────────────╯\n\n`;  
        }  
  
        // Footer  
        text += `╔════════════════════════════╗\n`;  
        text += `║ Need Help? Try: *${config.PREFIX}help <command>*\n`;  
        text += `║ ——— *Qadeer-XTech* ———\n`;  
        text += `╚════════════════════════════╝`;  
  
        // Send image with caption  
        await conn.sendMessage(from, {  
            image: { url: config.MENU_IMAGE_URL || 'https://qu.ax/bBkkd.jpg' },  
            caption: text  
        }, { quoted: mek });  
  
    } catch (err) {  
        console.error(err);  
        reply(`❌ *Menu Error:* ${err}`);  
    }  
});
