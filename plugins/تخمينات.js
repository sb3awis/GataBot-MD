const activeGames = {};

const handler = async (m, { conn, args }) => {
  const userId = m.sender;
  const command = args[0];
  const roomName = args[1];

  if (!command) {
    return conn.reply(m.chat, '❗ يرجى إدخال الأمر (ابدأ_تخمين أو انضمام) واسم الغرفة.', m);
  }

  if (command === 'ابدأ_تخمين') {
    if (!roomName) {
      return conn.reply(m.chat, '❗ يرجى إدخال اسم الغرفة بعد الأمر.', m);
    }
    if (activeGames[roomName]) {
      return conn.reply(m.chat, '❗ الغرفة موجودة بالفعل. يرجى اختيار اسم غرفة آخر.', m);
    }
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    activeGames[roomName] = {
      players: [userId],
      targetNumber,
      active: false,
    };
    conn.reply(m.chat, `✅ تم إنشاء الغرفة "${roomName}". يمكنك الآن دعوة الآخرين للانضمام باستخدام الأمر "انضمام ${roomName}".`, m);
  } else if (command === 'انضمام') {
    if (!roomName) {
      return conn.reply(m.chat, '❗ يرجى إدخال اسم الغرفة بعد الأمر.', m);
    }
    if (!activeGames[roomName]) {
      return conn.reply(m.chat, '❗ الغرفة غير موجودة. يرجى التحقق من اسم الغرفة.', m);
    }
    if (activeGames[roomName].players.length >= 4) {
      return conn.reply(m.chat, '❗ الغرفة مكتملة. لا يمكن الانضمام.', m);
    }
    activeGames[roomName].players.push(userId);
    conn.reply(m.chat, `✅ انضممت إلى الغرفة "${roomName}".`, m);
    if (activeGames[roomName].players.length === 4) {
      startGame(roomName, conn, m);
    }
  }
};

const startGame = (roomName, conn, m) => {
  const room = activeGames[roomName];
  room.active = true;
  conn.reply(m.chat, `🕹️ تبدأ لعبة التخمين الآن في الغرفة "${roomName}"! عليكم تخمين رقم بين 1 و 100.`, m);
  nextTurn(roomName, conn, m);
};

const nextTurn = (roomName, conn, m) => {
  const room = activeGames[roomName];
  if (room.players.length === 1) {
    conn.reply(m.chat, `🎉 الفائز هو ${room.players[0]}! الرقم الصحيح كان: ${room.targetNumber}`, m);
    delete activeGames[roomName];
    return;
  }

  const currentPlayer = room.players.shift(); // اللاعب الحالي
  room.players.push(currentPlayer); // إرجاع اللاعب إلى نهاية القائمة
  conn.reply(m.chat, `🔔 الدور الآن على ${currentPlayer}. لديك 30 ثانية لتخمين الرقم.`, m);

  const filter = response => response.sender === currentPlayer && !isNaN(response.text);
  const collector = m.channel.createMessageCollector({ filter, time: 30000 });

  collector.on('collect', msg => {
    const guess = parseInt(msg.text);
    if (guess === room.targetNumber) {
      conn.reply(msg.chat, `🎉 تهانينا! ${currentPlayer} خمن الرقم الصحيح وهو ${room.targetNumber}!`, msg);
      collector.stop();
      delete activeGames[roomName];
    } else if (guess < room.targetNumber) {
      conn.reply(msg.chat, `❗ الرقم الصحيح أعلى من ${guess}. حاول مرة أخرى في دورك التالي.`, msg);
    } else {
      conn.reply(msg.chat, `❗ الرقم الصحيح أقل من ${guess}. حاول مرة أخرى في دورك التالي.`, msg);
    }
    collector.stop();
    nextTurn(roomName, conn, m);
  });

  collector.on('end', collected => {
    if (collected.size === 0) {
      conn.reply(m.chat, `❌ ${currentPlayer} لم يجب في الوقت المحدد وتم إقصاؤه من اللعبة.`, m);
    }
  });
};

handler.help = ['ابدأ_تخمين <اسم_الغرفة>', 'انضمام <اسم_الغرفة>'];
handler.tags = ['fun'];
handler.command = ['ابدأ_تخمين', 'انضمام'];

export default handler;