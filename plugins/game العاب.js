import fetch from 'node-fetch'

let timeout = 80000
let poin = 1000
let tiketcoin = 1
let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {}
  let id = m.chat
  if (id in conn.tebakgame) {
    conn.reply(m.chat, '❐┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tebakgame[id][0])
    throw false
  }
  let src = await (await fetch('https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
  // if (!json.status) throw json
  let caption = `
⟣┈┈┈┈⟢〘❄〙⟣┈┈┈┈⟢
❐↞┇الـوقـت⏳↞ *${(timeout / 1000).toFixed(2)} ثانية┇*
اكتب .لمح للحصول على تلميح
❐↞┇الـجـائـزة💰↞ ${poin} نقاط┇
تذكرة العملات: ${tiketcoin}
❬ NEZUKO-BOT❭
⟣┈┈┈┈⟢〘❄〙⟣┈┈┈┈⟢
    `.trim()
  conn.tebakgame[id] = [
    await conn.sendFile(m.chat, json.img, 'tebakgame.jpg', caption, m, false, { thumbnail: Buffer.alloc(0) }),
    json, poin,
    setTimeout(() => {
      if (conn.tebakgame[id]) conn.reply(m.chat, `❮ ⌛┇انتهي الوقت┇⌛❯\n❐↞┇الاجـابـة✅↞ *${json.jawaban}*`, conn.tebakgame[id][0])
      delete conn.tebakgame[id]
    }, timeout)
  ]
}
handler.help = ['tebakgame']
handler.tags = ['game']
handler.command = /^العاب/i
handler.limit = true
handler.group = true

export default handler
