import fs from 'fs/promises';
import path from 'path';

// دالة لقراءة الأوامر من ملف plugin
const readCommandsFromFile = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf-8');
  const commandRegex = /handler\.command\s*=\s*\[(.*?)\]/s;
  const match = content.match(commandRegex);
  if (match) {
    return match[1].replace(/['"\s]/g, '').split(',');
  }
  return [];
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    // قراءة ملفات الـ plugins
    const pluginDir = path.join(__dirname, 'plugins');
    const files = await fs.readdir(pluginDir);
    const commands = {};

    for (const file of files) {
      const filePath = path.join(pluginDir, file);
      const fileCommands = await readCommandsFromFile(filePath);
      fileCommands.forEach(cmd => {
        const category = cmd.split('.')[0] || 'غير مصنف';
        if (!commands[category]) {
          commands[category] = [];
        }
        commands[category].push({
          header: `يعطيك اوامر ${cmd}`,
          title: cmd,
          description: '',
          id: cmd
        });
      });
    }

    // بناء الرسالة التفاعلية
    const sections = Object.keys(commands).map(category => ({
      title: `قسم ${category}`,
      highlight_label: 'بوت GataBot',
      rows: commands[category]
    }));

    const message = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: '> ⧉┆مرحبا ياعزيزي 😍 ⤌⤈\n> ↝👋🏻↜\n> ⧉┆انا بوت واتساب'
            },
            body: {
              text: '> ♩☜ اعمل في الخاص وجروبات\n> ♩☜ وظيفتي حماية جروبك\n> ♩☜اوامر كلمه .الاوامر لمعرفه\> n♩☜ اوامر البوت وطريقه الاستخدام\n> ♩☜ مميزات البوت كثيره جدا\n> ♩☜ ويعمل بجودة فائقه وعاليه\n> 𓍹————————————𓍻\n> ↜★ اوامر سورس عفرتو و بلاك بوت ★↝\n> 𓍹————————————𓍻'
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: '❰ اختار من القائمه📄 ❱',
                    sections: sections
                  }),
                  messageParamsJson: ''
                }
              ]
            }
          }
        }
      }
    };

    await conn.relayMessage(m.chat, message, {});
  } catch (e) {
    console.error(e);
  }
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['مهام', 'ty', 'أوامر', 'اوامر', 'الاوامر', 'ألاوامر'];

export default handler;