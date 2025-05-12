let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, 'يرجى إدخال النص بعد الأمر لتحليله.', m);
  }

  let text = args.join(" ");
  let apiUrl = `https://api.textanalysis.com/analyze?text=${encodeURIComponent(text)}`;
  let response = await fetch(apiUrl);
  let data = await response.json();

  if (data.sentiment) {
    let sentiment = data.sentiment;
    let message = `تحليل النص:\n`;
    message += `- النص: ${text}\n`;
    message += `- التحليل: ${sentiment}\n`;

    conn.reply(m.chat, message, m);
  } else {
    conn.reply(m.chat, 'حدث خطأ أثناء جلب البيانات أو النص غير صحيح.', m);
  }
}

handler.help = ['تحليل <النص>']
handler.tags = ['tools']
handler.command = ['تحليل']

export default handler;
