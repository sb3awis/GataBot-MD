import axios from "axios"
let handler = async (m, {command, conn, usedPrefix}) => {
let res = (await axios.get(`https://raw.githubusercontent.com/socona12/TheMystic-Bot-MD/master/src/JSON/Anime-F3alya.json`)).data  
let haha = await res[Math.floor(res.length * Math.random())]    
conn.sendFile(m.chat, haha, 'error.jpg', `
〄━━━━━⌬〔بوت سفࢪوت🧸💜〕⌬━━━━━〄

*⌬🕹️┋السوأل » احزر الشخصية*

*⌬⏳┋الواقت » 60 ث*

*⌬🏆┋الجائزه » 20k*

*⌬━━──⧉⊰🎴⊱⧉──━━⌬*
~⌬ تـوقيع المطور
┋♯ЅᗩFᏒOT꙯◡̈┋
*╰━━━━━━━━━━━━⬣*`, m)
}
handler.comm = handler.help = ['✓ ◡̈⃝ ✓│فعاليات🧸💜']
handler.tags = ['game']
handler.command = /^(فعاليات1)$/i
handler.admin = true
export default handler
