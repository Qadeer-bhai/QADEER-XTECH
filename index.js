const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data');
const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const config = require('./config'); // Ensure this path is correct
const GroupEvents = require('./lib/groupevents');
const qrcode = require('qrcode-terminal');
const StickersTypes = require('wa-sticker-formatter'); // Not used but kept
const util = require('util');
const { sms, downloadMediaMessage, AntiDelete } = require('./lib'); // Assuming these are correctly exported
const FileType = require('file-type');
const axios = require('axios');
const { File } = require('megajs');
const { fromBuffer } = require('file-type'); // Not used but kept
const bodyparser = require('body-parser'); // Not used but kept
const os = require('os');
const Crypto = require('crypto'); // Not used but kept
const path = require('path');
const PhoneNumber = require('awesome-phonenumber'); // Make sure to install this: npm install awesome-phonenumber

// Load prefix and owner number from config or environment variables
const prefix = process.env.PREFIX || config.PREFIX;
const ownerNumber = (process.env.OWNER_NUMBER || '923079749129').split(',').map(num => num.trim());

const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.error("Error reading temp directory:", err);
      return;
    }
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }
  });
};

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH============================
// This part should handle session download before connecting to WA
const sessionPath = __dirname + '/sessions/creds.json';

const startBot = async () => {
  if (!fs.existsSync(sessionPath)) {
    console.log("Session file not found. Attempting to download from SESSION_ID...");
    if (!process.env.SESSION_ID && !config.SESSION_ID) {
      console.log('Error: Please add your session to SESSION_ID env or config.js !!');
      process.exit(1); // Exit if session ID is missing
    }
    const sessionId = process.env.SESSION_ID || config.SESSION_ID;
    const sessdata = sessionId.replace("Qadeer-Bhai~", ''); // Ensure this prefix is correct if used

    try {
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
      filer.download((err, data) => {
        if (err) {
          console.error("Error downloading session file from Mega:", err);
          process.exit(1);
        }
        fs.writeFile(sessionPath, data, (writeErr) => {
          if (writeErr) {
            console.error("Error writing session file:", writeErr);
            process.exit(1);
          }
          console.log("Session downloaded ✅");
          connectToWA(); // Connect after successful download
        });
      });
    } catch (e) {
      console.error("Error processing Mega.nz session ID:", e);
      process.exit(1);
    }
  } else {
    console.log("Session file found. Connecting to WhatsApp...");
    connectToWA(); // Connect if session file already exists
  }
};

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

async function connectToWA() {
  console.log("Connecting to WhatsApp ⏳️...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
  var { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"), // Or any other browser
    syncFullHistory: true,
    auth: state,
    version
  });

  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });
  store.bind(conn.ev);

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
        connectToWA();
      } else {
        console.log('Connection closed. You are logged out. Please re-run the bot to scan QR or set new SESSION_ID.');
        process.exit(0); // Exit cleanly if logged out
      }
    } else if (connection === 'open') {
      console.log('🧬 Installing Plugins');
      const pluginPath = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (pluginPath.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log('Plugins installed successful ✅');
      console.log('Bot connected to whatsapp ✅');

      let up = `╭══════════════⊷
┃ ⚡QADEER 𝗫𝗧𝗘𝗖𝗛 𝗕𝗢𝗧
╰══════════════⊷
╭══════════════⊷
┃ 🪆𝗥𝗘𝗣𝗢
┃https://github.com/Qadeer-bhai/QADEER-XTECH
╰══════════════⊷
╭══════════════⊷
┃ ❤️‍🩹𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗜𝗗
┃https://newtester-6e302603809f.herokuapp.com
╰══════════════⊷
╭══════════════⊷
┃ ғᴏʀᴋ ᴀɴᴅ sᴛᴀʀ ᴏᴜʀ ʀᴇᴘᴏ
┃ ғᴏʀ ᴄᴏᴜʀᴀɢᴇ ᴘʟᴇᴀsᴇ
╰══════════════⊷
╭══════════════⊷
┃ 𝙌𝘼𝘿𝙀𝙀𝙍
┃+923079749129
╰══════════════⊷`;
      conn.sendMessage(conn.user.id, { image: { url: `https://qu.ax/bBkkd.jpg` }, caption: up }).catch(e => console.error("Error sending startup message:", e));
    }
  });

  conn.ev.on('creds.update', saveCreds);

  //==============================

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      // Check if update.update and update.update.message exist to prevent errors
      if (update.update && update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates).catch(e => console.error("Error in AntiDelete:", e));
      }
    }
  });
  //============================== 

  conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update).catch(e => console.error("Error in GroupEvents:", e)));

  //=============readstatus=======

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ?
      mek.message.ephemeralMessage.message :
      mek.message;

    const readMessageConfig = process.env.READ_MESSAGE || config.READ_MESSAGE;
    if (readMessageConfig === 'true') {
      await conn.readMessages([mek.key]); // Mark message as read
      console.log(`Marked message from ${mek.key.remoteJid} as read.`);
    }

    if (mek.message.viewOnceMessageV2) {
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
    }

    const autoStatusSeenConfig = process.env.AUTO_STATUS_SEEN || config.AUTO_STATUS_SEEN;
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && autoStatusSeenConfig === "true") {
      await conn.readMessages([mek.key]);
    }

    const autoStatusReactConfig = process.env.AUTO_STATUS_REACT || config.AUTO_STATUS_REACT;
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && autoStatusReactConfig === "true") {
      const jawadlike = await conn.decodeJid(conn.user.id);
      const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      await conn.sendMessage(mek.key.remoteJid, {
        react: {
          text: randomEmoji,
          key: mek.key,
        }
      }, { statusJidList: [mek.key.participant, jawadlike] });
    }

    const autoStatusReplyConfig = process.env.AUTO_STATUS_REPLY || config.AUTO_STATUS_REPLY;
    const autoStatusMsgConfig = process.env.AUTO_STATUS_MSG || config.AUTO_STATUS_MSG;
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && autoStatusReplyConfig === "true") {
      const user = mek.key.participant;
      const text = `${autoStatusMsgConfig}`;
      await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek });
    }

    await Promise.all([
      saveMessage(mek),
    ]);

    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message); // Not used much, can remove if not needed
    const from = mek.key.remoteJid;
    const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
    const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
    const isCmd = body.startsWith(prefix);
    var budy = typeof mek.text == 'string' ? mek.text : false;
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');
    const text = args.join(' '); // text is same as q
    const isGroup = from.endsWith('@g.us');
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const botNumber = conn.user.id.split(':')[0];
    const pushname = mek.pushName || 'Sin Nombre';
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber); // Check if senderNumber is in ownerNumber array
    const botNumber2 = await jidNormalizedUser(conn.user.id); // Renamed for clarity
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => { console.error("Error fetching group metadata:", e); return {}; }) : {};
    const groupName = isGroup ? groupMetadata.subject : '';
    const participants = isGroup ? await groupMetadata.participants : [];
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : [];
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
    const isReact = m.message && m.message.reactionMessage ? true : false; // Safe check for isReact

    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek });
    };

    const udp = botNumber.split('@')[0];
    const devNumber = process.env.DEV || config.DEV; // Get DEV number from env or config
    const creatorNumbers = [...ownerNumber, devNumber].map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    let isCreator = creatorNumbers.includes(mek.sender);

    if (isCreator && body.startsWith('%')) {
      let code = body.slice(2);
      if (!code) {
        reply(`Provide me with a query to run Master!`);
        return;
      }
      try {
        let resultTest = eval(code);
        if (typeof resultTest === 'object') {
          reply(util.format(resultTest));
        } else {
          reply(util.format(resultTest));
        }
      } catch (err) {
        reply(`Error in eval: ${util.format(err)}`);
      }
      return;
    }

    if (isCreator && body.startsWith('$')) {
      let code = body.slice(2);
      if (!code) {
        reply(`Provide me with a query to run Master!`);
        return;
      }
      try {
        let resultTest = await eval('const a = async()=>{\n' + code + '\n}\na()');
        let h = util.format(resultTest);
        if (h === undefined) return console.log(h);
        else reply(h);
      } catch (err) {
        if (err === undefined) return console.log('error');
        else reply(`Error in async eval: ${util.format(err)}`);
      }
      return;
    }

    //================ownerreact==============
    if (ownerNumber.includes(senderNumber) && !isReact) {
      const reactions = ["👑", "💀", "📊", "⚙️", "🧠", "🎯", "📈", "📝", "🏆", "🌍", "🇵🇰", "💗", "❤️", "💥", "🌼", "🏵️", "💐", "🔥", "❄️", "🌝", "🌚", "🐥", "🧊"];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction).catch(e => console.error("Error reacting to owner message:", e));
    }

    //==========public react============//
    const autoReactConfig = process.env.AUTO_REACT || config.AUTO_REACT;
    if (!isReact && autoReactConfig === 'true') {
      const reactions = [
        '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣',
        '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕',
        '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️',
        '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑',
        '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄',
        '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀',
        '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾',
        '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟',
        '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤',
        '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪',
        '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈',
        '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚',
        '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌',
        '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫',
        '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
      ];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction).catch(e => console.error("Error reacting to public message:", e));
    }

    // custum react settings
    const customReactConfig = process.env.CUSTOM_REACT || config.CUSTOM_REACT;
    if (!isReact && customReactConfig === 'true') {
      const customReactEmojisConfig = process.env.CUSTOM_REACT_EMOJIS || config.CUSTOM_REACT_EMOJIS;
      const reactions = (customReactEmojisConfig || '🥲,😂,👍🏻,🙂,😔').split(',');
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction).catch(e => console.error("Error reacting with custom emoji:", e));
    }

    //==========WORKTYPE============
    const botMode = process.env.MODE || config.MODE;
    if (!isOwner && botMode === "private") return;
    if (!isOwner && isGroup && botMode === "inbox") return;
    if (!isOwner && !isGroup && botMode === "groups") return;

    // take commands
    const events = require('./command');
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    if (isCmd) {
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
      if (cmd) {
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } }).catch(e => console.error("Error sending react for command:", e));

        try {
          cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
          reply(`An error occurred while executing the command: ${e.message || e}`);
        }
      }
    }
    events.commands.map(async (command) => {
      if (body && command.on === "body") {
        try {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
        } catch (e) {
          console.error("[EVENT BODY ERROR] " + e);
        }
      } else if (body && command.on === "text") { // Changed mek.q to body
        try {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
        } catch (e) {
          console.error("[EVENT TEXT ERROR] " + e);
        }
      } else if (
        (command.on === "image" || command.on === "photo") &&
        mek.type === "imageMessage"
      ) {
        try {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
        } catch (e) {
          console.error("[EVENT IMAGE ERROR] " + e);
        }
      } else if (
        command.on === "sticker" &&
        mek.type === "stickerMessage"
      ) {
        try {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
        } catch (e) {
          console.error("[EVENT STICKER ERROR] " + e);
        }
      }
    });

  });
  //===================================================   
  conn.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };
  //===================================================
  conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype;
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message
      };
    }

    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    };
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {});
    await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
    return waMessage;
  };
  //=================================================
  conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };
  //=================================================
  conn.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  /**
   *
   * @param {*} jid
   * @param {*} message
   * @param {*} forceForward
   * @param {*} options
   * @returns
   */
  //================================================
  conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = '';
    let res = await axios.head(url);
    mime = res.headers['content-type'];
    if (mime.split("/")[1] === "gif") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
    }
    let type = mime.split("/")[0] + "Message";
    if (mime === "application/pdf") {
      return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
    }
    if (mime.split("/")[0] === "image") {
      return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
    }
    if (mime.split("/")[0] === "video") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
    }
    if (mime.split("/")[0] === "audio") {
      return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
    }
  };
  //==========================================================
  conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0];
    let isEphemeral = mtype === 'ephemeralMessage';
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
    let content = msg[mtype];
    if (typeof content === 'string') msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== 'string') msg[mtype] = {
      ...content,
      ...options
    };
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant; // This line might be redundant
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = sender === conn.user.id;
    return proto.WebMessageInfo.fromObject(copy);
  };


  /**
   *
   * @param {*} path
   * @returns
   */
  //=====================================================
  conn.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    let type = await FileType.fromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    };
    let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext);
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data), // getSizeMedia is not defined. If not needed, remove.
      ...type,
      data
    };
  };
  //=====================================================
  conn.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await conn.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = '',
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = 'document';
    if (options.asSticker || /webp/.test(mime)) {
      const { writeExif } = require('./exif.js'); // Make sure exif.js exists and exports writeExif
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, { packname: process.env.packname || config.packname, author: process.env.author || config.author, categories: options.categories ? options.categories : [] });
      await fs.promises.unlink(filename);
      type = 'sticker';
      mimetype = 'image/webp';
    } else if (/image/.test(mime)) type = 'image';
    else if (/video/.test(mime)) type = 'video';
    else if (/audio/.test(mime)) type = 'audio';
    else type = 'document';
    await conn.sendMessage(jid, {
      [type]: { url: pathFile },
      mimetype,
      fileName,
      ...options
    }, { quoted, ...options });
    return fs.promises.unlink(pathFile);
  };
  //=====================================================
  conn.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
  };
  //=====================================================
  conn.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    let types = await conn.getFile(path, true);
    let { mime, ext, res, data, filename } = types;
    if (res && res.status !== 200 || data.length <= 65536) { // Changed 'file.length' to 'data.length'
      try { throw { json: JSON.parse(data.toString()) }; } catch (e) { if (e.json) throw e.json; }
    }
    let type = '',
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = 'document';
    if (options.asSticker || /webp/.test(mime)) {
      const { writeExif } = require('./exif'); // Make sure exif.js exists
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, { packname: options.packname ? options.packname : (process.env.packname || config.packname), author: options.author ? options.author : (process.env.author || config.author), categories: options.categories ? options.categories : [] });
      await fs.promises.unlink(filename);
      type = 'sticker';
      mimetype = 'image/webp';
    } else if (/image/.test(mime)) type = 'image';
    else if (/video/.test(mime)) type = 'video';
    else if (/audio/.test(mime)) type = 'audio';
    else type = 'document';
    await conn.sendMessage(jid, {
      [type]: { url: pathFile },
      caption,
      mimetype,
      fileName,
      ...options
    }, { quoted, ...options });
    return fs.promises.unlink(pathFile);
  };
  /**
   *
   * @param {*} message
   * @param {*} filename
   * @param {*} attachExtension
   * @returns
   */
  //=====================================================
  conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
    const { writeExifVid, videoToWebp } = StickersTypes; // Assuming these are from wa-sticker-formatter
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      options
    );
  };
  //=====================================================
  conn.sendImageAsSticker = async (jid, buff, options = {}) => {
    const { writeExifImg, imageToWebp } = StickersTypes; // Assuming these are from wa-sticker-formatter
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      options
    );
  };
  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //=====================================================
  conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted });

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //=====================================================
  conn.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted });
  };

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} caption
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //=====================================================
  conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted });

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} caption
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //=====================================================
  conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
    let buttonMessage = {
      text,
      footer,
      buttons,
      headerType: 2,
      ...options
    };
    //========================================================================================================================================
    conn.sendMessage(jid, buttonMessage, { quoted, ...options });
  };
  //=====================================================
  conn.send5ButImg = async (jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
    let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer });
    var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
      templateMessage: {
        hydratedTemplate: {
          imageMessage: message.imageMessage,
          "hydratedContentText": text,
          "hydratedFooterText": footer,
          "hydratedButtons": but
        }
      }
    }), options);
    conn.relayMessage(jid, template.message, { messageId: template.key.id });
  };

  /**
   *
   * @param {*} jid
   * @param {*} buttons
   * @param {*} caption
   * @param {*} footer
   * @param {*} quoted
   * @param {*} options
   */
  //=====================================================
  conn.getName = (jid, withoutContact = false) => {
    const id = conn.decodeJid(jid);
    withoutContact = conn.withoutContact || withoutContact;

    let v;

    if (id.endsWith('@g.us')) {
      return new Promise(async resolve => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) { // Check v.name for group name, not v.name.notify
          const groupMetadata = await conn.groupMetadata(id).catch(e => { console.error("Error fetching group metadata for getName:", e); return {}; });
          v = groupMetadata || {};
        }
        resolve(
          v.name ||
          v.subject ||
          (new PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        );
      });
    } else {
      v =
        id === '0@s.whatsapp.net'
          ? {
            id,
            name: 'WhatsApp',
          }
          : id === conn.decodeJid(conn.user.id)
            ? conn.user
            : store.contacts[id] || {}; // Use 'store' defined in connectToWA

      return (
        (withoutContact ? '' : v.name) ||
        v.subject ||
        v.verifiedName ||
        (new PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
      );
    }
  };

  // Vcard Functionality
  conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      const displayName = await conn.getName(i + '@s.whatsapp.net');
      list.push({
        displayName: displayName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${displayName}\nFN:${
          process.env.OwnerName || 'Qadeer XTech Owner' // Use env variable or default
        }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${
          process.env.email || 'info@example.com' // Use env variable or default
        }\nitem2.X-ABLabel:GitHub\nitem3.URL:${process.env.github_url || 'https://github.com/Qadeer-bhai/QADEER-XTECH'}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${
          process.env.location || 'Pakistan' // Use env variable or default
        };;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    conn.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Contact`,
          contacts: list,
        },
        ...opts,
      },
      { quoted },
    );
  };

  // Status aka brio
  conn.setStatus = status => {
    conn.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'status',
      },
      content: [
        {
          tag: 'status',
          attrs: {},
          content: Buffer.from(status, 'utf-8'),
        },
      ],
    });
    return status;
  };
  conn.serializeM = mek => sms(conn, mek, store); // Passing store to sms
}

app.get("/", (req, res) => {
  res.send("QADEER XMD STARTED ✅");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

// Start the bot logic after server starts
startBot();
