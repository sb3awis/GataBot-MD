let handler = async (m, { conn, args, command }) => {
await m.reply('*انا خارج باي من غير سلام هقهقهقهق😂🥺💜👋*') 
await  conn.groupLeave(m.chat)}
handler.command = /^(out|leavegc|اخرج|برا)$/i
handler.group = true
handler.rowner = true
export default handler
