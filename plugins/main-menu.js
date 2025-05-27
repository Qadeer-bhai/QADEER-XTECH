const config = require('../config')  
const os = require('os')  
const moment = require('moment-timezone')  
const { cmd, commands } = require('../command')  
const { runtime } = require('../lib/functions')  
  
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
        // Technical info  
        const botVer = config.BOT_VERSION || "v1.0.0";  
        const platform = os.platform();  
        const up = runtime(process.uptime());  
        const totalCmds = commands.length;  
        const time = moment.tz('Asia/Karachi').format("HH:mm:ss");  
        const date = moment.tz('Asia/Karachi').format("DD MMM YYYY");  
  
        // Header - hacker style ASCII art  
        let text = "";  
        text += "╔════════════════════════════════════════╗\n";  
        text += "║  ╔═╗╔═╗╦  ╦╔═╗╔═╗╔═╗╔═╗╦═╗╔═╗╔╦╗ ║\n";  
        text += "║  ╚═╗║╣ ╚╗╔╝║  ╠═╣║  ╠═╝╠╦╝╠═╣ ║  ║\n";  
        text += "║  ╚═╝╚═╝ ╚╝ ╚═╝╩ ╩╚═╝╩  ╩╚═╩ ╩ ╩  ║\n";  
        text += "║                                        ║\n";  
        text += `║ OWNER: ${config.OWNER_NAME.padEnd(28)} ║\n`;  
        text += `║ BOT VERSION: ${botVer.padEnd(21)} ║\n`;  
        text += `║ PLATFORM: ${platform.padEnd(25)} ║\n`;  
        text += `║ UPTIME: ${up.padEnd(27)} ║\n`;  
        text += `║ DATE: ${date.padEnd(29)} ║\n`;  
        text += `║ TIME: ${time.padEnd(29)} ║\n`;  
        text += `║ TOTAL COMMANDS: ${totalCmds.toString().padEnd(22)} ║\n`;  
        text += "╚════════════════════════════════════════╝\n\n";  
  
        // Commands list (no categories)  
        text += "┌───[ COMMANDS LIST ]─────────────────────┐\n";  
        commands.forEach(cmd => {  
            let aliasStr = cmd.alias && cmd.alias.length > 0 ? ` (aliases: ${cmd.alias.join(", ")})` : "";  
            text += `│ > ${config.PREFIX}${cmd.pattern}${aliasStr}\n`;  
        });  
        text += "└─────────────────────────────────────────┘\n\n";  
  
        // Footer  
        text += "╔═[ Need help? ]═════════════════════════╗\n";  
        text += `║ Try: ${config.PREFIX}help <command>                  ║\n`;  
        text += "║ ———— [ Qadeer-XTech Hacker Bot ] ———— ║\n";  
        text += "╚════════════════════════════════════════╝\n";  
  
        // Send message with image and caption  
        await conn.sendMessage(from, {  
            image: { url: config.MENU_IMAGE_URL || 'https://qu.ax/bBkkd.jpg' },  
            caption: text  
        }, { quoted: mek });  
  
    } catch (err) {  
        console.error(err);  
        reply(`❌ *Menu Error:* ${err}`);  
    }  
});
