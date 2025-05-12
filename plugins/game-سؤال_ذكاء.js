import fs from 'fs';

let timeout = 60000;
let poin = 500;
let dia = 1;

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;

    if (id in conn.tekateki) {
        conn.reply(m.chat, '*جاوب ع السؤال الاول*', conn.tekateki[id][0]);
        throw false;
    }

    let tekateki = JSON.parse(fs.readFileSync('./src/game/ذكاء.json','utf-8'));
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];
    let _clue = json.response;
    let clue = _clue.replace(/[]/g, ' ');

    let caption = `
    *سـؤال ذكـاء*

⟣┈┈┈┈⟢〘❄〙⟣┈┈┈┈⟢

*الـسـؤال:* ${json.question}

*الـجـأزه: ${poin}* 

*الـمـدة${(timeout / 1000).toFixed(2)} ثانيه*

> ملحوظه رد برقم الاجابه مش الاجابه نفسها
> ❬ 𝒃𝒚┋NEZUKO-BOT ❭
⟣┈┈┈┈⟢〘❄〙⟣┈┈┈┈⟢
`.trim();

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m),
        json,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `
⟣┈┈┈┈⟢〘❄〙⟣┈┈┈┈⟢
*⌬ ❛╏ انتهى الوقت الجواب هو*
*⌬ ❛╏ ${json.response}*
⟣┈┈┈┈⟢〘❄〙⟣┈┈┈┈⟢
`, conn.tekateki[id][0]);
            }
            delete conn.tekateki[id];
        }, timeout)
    ];
};

handler.help = ['anime'];
handler.tags = ['game'];
handler.command = /^(ذكاء)$/i;

export default handler;
