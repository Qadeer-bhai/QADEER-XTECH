const config = require('../config')
const { cmd, commands } = require('../command'); // contains all registered commands

cmd({
    pattern: "menu",
    alias: ["allmenu", "fullmenu"],
    desc: "Show all bot commands dynamically",
    category: "menu",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        let grouped = {};

        // 🔄 Group commands by category
        for (let cmd of commands) {
            const cat = cmd.category || "Other";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(cmd.pattern);
        }

        let text = `╭───────✧ *${config.BOT_NAME} MENU* ✧───────╮\n`;

        // 📜 Format category-wise commands
        for (let cat in grouped) {
            text += `\n📂 *${cat.toUpperCase()}*\n`;
            text += grouped[cat].map(c => `┃◈┃• ${config.PREFIX}${c}`).join('\n') + '\n';
        }

        text += `\n╰─────▸ *${config.OWNER_NAME} | QADEER-XTECH* ◂─────╯`;

        // Send as image or plain message
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://qu.ax/bBkkd.jpg' },
            caption: text
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});
