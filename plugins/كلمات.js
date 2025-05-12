const rooms = {};

const handler = async (m, { conn, args }) => {
  const userId = m.sender;
  const command = args[0];
  const roomName = args[1];

  if (!command) {
    return conn.reply(m.chat, '❗ يرجى إدخال الأمر (ابدأ_اللعبة أو انضمام) واسم الغرفة.', m);
  }

  if (command === 'ابدأ_اللعبة') {
    if (!roomName) {
      return conn.reply(m.chat, '❗ يرجى إدخال اسم الغرفة بعد الأمر.', m);
    }
    if (rooms[roomName]) {
      return conn.reply(m.chat, '❗ الغرفة موجودة بالفعل. يرجى اختيار اسم غرفة آخر.', m);
    }
    rooms[roomName] = {
      players: [userId],
      grid: generateGrid(5),
      currentTurn: 0,
      scores: {},
      active: false,
    };
    conn.reply(m.chat, `✅ تم إنشاء الغرفة "${roomName}". يمكنك الآن دعوة الآخرين للانضمام باستخدام الأمر "انضمام ${roomName}".`, m);
  } else if (command === 'انضمام') {
    if (!roomName) {
      return conn.reply(m.chat, '❗ يرجى إدخال اسم الغرفة بعد الأمر.', m);
    }
    if (!rooms[roomName]) {
      return conn.reply(m.chat, '❗ الغرفة غير موجودة. يرجى التحقق من اسم الغرفة.', m);
    }
    if (rooms[roomName].players.length >= 4) {
      return conn.reply(m.chat, '❗ الغرفة مكتملة. لا يمكن الانضمام.', m);
    }
    rooms[roomName].players.push(userId);
    conn.reply(m.chat, `✅ انضممت إلى الغرفة "${roomName}".`, m);
    if (rooms[roomName].players.length === 4) {
      startGame(roomName, conn, m);
    }
  }
};

const generateGrid = (size) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let grid = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    grid.push(row);
  }
  return grid;
};

const displayGrid = (grid) => {
  return grid.map(row => row.join(' ')).join('\n');
};

const isValidWord = (word) => {
  return word.length >= 3;
};

const startGame = (roomName, conn, m) => {
  const room = rooms[roomName];
  room.active = true;
  room.players.forEach(player => {
    room.scores[player] = 0;
  });

  conn.reply(m.chat, `🕹️ تبدأ اللعبة الآن في الغرفة "${roomName}"! شبكة الحروف:\n${displayGrid(room.grid)}`, m);
  nextTurn(roomName, conn, m);
};

const nextTurn = (roomName, conn, m) => {
  const room = rooms[roomName];
  if (room.players.length === 1) {
    conn.reply(m.chat, `🎉 الفائز هو ${room.players[0]}! مجموع نقاطه: ${room.scores[room.players[0]]}`, m);
    delete rooms[roomName];
    return;
  }

  const currentPlayer = room.players[room.currentTurn];
  conn.reply(m.chat, `🔔 الدور الآن على ${currentPlayer}. لديك 30 ثانية للإجابة.`, m);

  // جمع الكلمة من اللاعب الحالي
  const filter = response => response.sender === currentPlayer && isValidWord(response.text);
  const collector = m.channel.createMessageCollector({ filter, time: 30000 });

  collector.on('collect', msg => {
    room.scores[currentPlayer] += msg.text.length; // إضافة النقاط بناءً على طول الكلمة
    conn.reply(msg.chat, `✅ تم قبول الكلمة! نقاطك الحالية: ${room.scores[currentPlayer]}`, msg);
    collector.stop();
  });

  collector.on('end', collected => {
    if (collected.size === 0) {
      conn.reply(m.chat, `❌ ${currentPlayer} لم يجب في الوقت المحدد وتم إقصاؤه من اللعبة.`, m);
      room.players.splice(room.currentTurn, 1); // إقصاء اللاعب
    } else {
      room.currentTurn = (room.currentTurn + 1) % room.players.length; // الانتقال إلى اللاعب التالي
    }
    nextTurn(roomName, conn, m); // بدء الدور التالي
  });
};

handler.help = ['ابدأ_اللعبة <اسم_الغرفة>', 'انضمام <اسم_الغرفة>'];
handler.tags = ['fun'];
handler.command = ['ابدأ_اللعبة', 'انضمام'];

export default handler;