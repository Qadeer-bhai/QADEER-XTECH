const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    alias: ["allmenu", "fullmenu"],
    desc: "Show all commands grouped by category",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const botVer = config.BOT_VERSION || "v3.8.0";
        const platform = os.platform();
        const up = runtime(process.uptime());
        const time = moment.tz('Asia/Karachi').format("HH:mm:ss");
        const date = moment.tz('Asia/Karachi').format("DD MMM YYYY");

        const cmdsByCategory = {};
        commands.forEach(command => {
            const cat = command.category || "Others";
            if (!cmdsByCategory[cat]) cmdsByCategory[cat] = [];
            cmdsByCategory[cat].push(command);
        });

        // Sticker-style text
        let text = `┏━━━━━━━━━━━━━━━┓\n`;
        text += `┃  *${config.OWNER_NAME}'s Bot Menu*  ┃\n`;
        text += `┣━━━━━━━━━━━━━━━┫\n`;
        text += `┃ *Version:* ${botVer}\n`;
        text += `┃ *Uptime:* ${up}\n`;
        text += `┃ *OS:* ${platform}\n`;
        text += `┃ *Date:* ${date}\n`;
        text += `┃ *Time:* ${time}\n`;
        text += `┣━━━━━━━━━━━━━━━┫\n`;

        const sortedCategories = Object.keys(cmdsByCategory).sort();

        for (const category of sortedCategories) {
            text += `┃ *${category.toUpperCase()}*\n`;
            cmdsByCategory[category].forEach(c => {
                text += `┃ ➜ ${config.PREFIX}${c.pattern}\n`;
            });
            text += `┣━━━━━━━━━━━━━━━┫\n`;
        }

        text += `┃ Type *${config.PREFIX}help cmd* for info\n`;
        text += `┗━━━━━━━━━━━━━━━┛`;

        // Send as image caption
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://qu.ax/bBkkd.jpg' },
            caption: text
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply(`❌ *Menu Error:* ${err}`);
    }
});
