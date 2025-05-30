const config = require('../config')
const { cmd, commands } = require('../command')
const os = require("os")
const { runtime } = require('../lib/functions')
const axios = require('axios')

// Grouped commands for each category
const menus = {
  download: [
    "facebook", "mediafire", "tiktok", "twitter", "insta", "apk", "img", "tt2", "pins", "fb2",
    "pinterest", "spotify", "play", "play2", "audio", "video2", "ytmp3", "ytmp4", "song", "darama", "gdrive", "ssweb", "tiks"
  ],
  group: [
    "grouplink", "kickall", "kickall2", "kickall3", "add", "remove", "kick", "promote", "demote",
    "dismiss", "revoke", "setgoodbye", "setwelcome", "delete", "getpic", "ginfo", "disappear on", "disappear off",
    "disappear 7D,24H", "allreq", "updategname", "updategdesc", "joinrequests", "senddm", "nikal", "mute", "unmute",
    "lockgc", "unlockgc", "invite", "tag", "hidetag", "tagall", "tagadmins"
  ],
  reactions: [
    "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave",
    "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "happy", "wink", "poke", "dance", "cringe"
  ],
  logo: [
    "neonlight", "blackpink", "dragonball", "3dcomic", "america", "naruto", "sadgirl", "clouds", "futuristic", "3dpaper",
    "eraser", "sunset", "leaf", "galaxy", "sans", "boom", "hacker", "devilwings", "nigeria", "bulb", "angelwings", "zodiac",
    "luxury", "paint", "frozen", "castle", "tatoo", "valorant", "bear", "typography", "birthday"
  ],
  owner: [
    "owner", "menu", "vv", "listcmd", "allmenu", "repo", "block", "unblock", "fullpp", "setpp", "restart", "shutdown",
    "updatecmd", "alive", "ping", "gjid", "jid"
  ],
  fun: [
    "shapar", "rate", "insult", "hack", "ship", "character", "pickup", "joke", "hrt", "hpy", "syd", "anger", "shy",
    "kiss", "mon", "cunfuzed", "setpp", "hand", "nikal", "hold", "hug", "hifi", "poke"
  ],
  convert: [
    "sticker", "emojimix", "fancy", "take", "tomp3", "tts", "trt", "base64", "unbase64", "binary", "dbinary", "tinyurl",
    "urldecode", "urlencode", "url", "repeat", "ask", "readmore"
  ],
  ai: [
    "imagine", "imagine2"
  ],
  main: [
    "ping", "ping2", "speed", "live", "alive", "runtime", "uptime", "repo", "owner", "menu", "restart"
  ],
  anime: [
    "fack", "truth", "dare", "dog", "awoo", "garl", "waifu", "neko", "megnumin", "maid", "loli", "animegirl", "animegirl1",
    "animegirl2", "animegirl3", "animegirl4", "animegirl5", "anime1", "anime2", "anime3", "anime4", "anime5", "animenews",
    "foxgirl", "naruto"
  ],
  other: [
    "timenow", "date", "count", "calculate", "countx", "flip", "coinflip", "rcolor", "roll", "fact", "cpp", "rw", "fancy",
    "logo", "define", "news", "movie", "weather", "insult", "save", "wikipedia", "gpass", "githubstalk", "yts"
  ]
}

// Command to handle `.menu` or numeric replies
cmd(
  {
    pattern: "menu",
    desc: "Show all bot command categories",
    category: "main",
    filename: __filename
  },
  async (m, text) => {
    if (!text) {
      let response = "╭────✧〈 🧠 *MENU CATEGORIES* 〉 ✧───◆\n";
      const cats = Object.keys(menus);
      cats.forEach((cat, index) => {
        response += `┃◈┃• ${index + 1}. ${cat.toUpperCase()}\n`;
      });
      response += "╰─────▸ *Reply with a number to view commands.*";
      return m.reply(response);
    }

    const index = parseInt(text) - 1;
    const keys = Object.keys(menus);

    if (index >= 0 && index < keys.length) {
      const cat = keys[index];
      const cmds = menus[cat].map(cmd => `┃◈┃• ${cmd}`).join("\n");
      return m.reply(
        `╭────✧〈 ${cat.toUpperCase()} MENU 〉 ✧───◆\n${cmds}\n╰─────▸ QADEER-XTECH`
      );
    }

    return m.reply("❌ Invalid category number. Please reply with a valid number.");
  }
)
