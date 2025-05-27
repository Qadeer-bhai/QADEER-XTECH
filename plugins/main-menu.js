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
        // Bot info
        const botVer = config.BOT_VERSION || "v1.0.0";
        const platform = os.platform();
        const up = runtime(process.uptime());
        const time = moment.tz('Asia/Karachi').format("HH:mm:ss");
        const date = moment.tz('Asia/Karachi').format("DD MMM YYYY");

        // Group commands by category
        const cmdsByCategory = {};
        commands.forEach(command => {
            const cat = command.category || "others";
            if (!cmdsByCategory[cat]) cmdsByCategory[cat] = [];
            cmdsByCategory[cat].push(command);
        });

        // Start building menu text
        let text = `*${config.OWNER_NAME}*'s Bot Menu\n`;
        text += `Version: ${botVer} | Platform: ${platform}\n`;
        text += `Uptime: ${up} | Date: ${date} | Time: ${time}\n`;
        text += "--------------------------------------\n";

        // Sort categories alphabetically for neatness
        const sortedCategories = Object.keys(cmdsByCategory).sort();

        // Add commands per category
        for (const category of sortedCategories) {
            text += `*${category.toUpperCase()}*\n`;
            cmdsByCategory[category].forEach(c => {
                const aliases = c.alias && c.alias.length ? ` (aliases: ${c.alias.join(", ")})` : "";
                text += `• ${config.PREFIX}${c.pattern}${aliases}\n`;
            });
            text += "\n";
        }

        // Footer
        text += `For command details: ${config.PREFIX}help <command>\n`;
        text += "Qadeer-XTech Hacker Bot";

        // Send menu with image and caption
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://qu.ax/bBkkd.jpg' },
            caption: text
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply(`❌ *Menu Error:* ${err}`);
    }
});
