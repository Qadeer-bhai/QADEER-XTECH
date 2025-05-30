const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "menu",
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("❗ Please provide a GitHub username.");
        }

        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `
╭━━━[ 🧑‍💻 *GitHub User Info* ]
┃
┃ 🔸 *Name:* ${data.name || data.login}
┃ 🔸 *Username:* @${data.login}
┃ 🔸 *Bio:* ${data.bio || 'Not available'}
┃ 🔸 *Location:* ${data.location || 'Unknown'}
┃ 🔸 *Public Repos:* ${data.public_repos}
┃ 🔸 *Followers:* ${data.followers}
┃ 🔸 *Following:* ${data.following}
┃ 🔸 *Public Gists:* ${data.public_gists}
┃ 🔸 *Account Created:* ${new Date(data.created_at).toDateString()}
┃ 🔸 *GitHub URL:* ${data.html_url}
┃
╰━━━[ 🔰 *Powered by QADEER-XTECH* ]`;

        await conn.sendMessage(
            from,
            {
                image: { url: data.avatar_url },
                caption: userInfo
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.response ? e.response.data.message : e.message}`);
    }
});

// Modified by Qadeer 💻
