import fs from 'fs';

let timeout = 60000;
let poin = 50;

let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tekateki = conn.tekateki ? conn.tekateki : {};
  let id = m.chat;

  if (id in conn.tekateki) {
    conn.reply(m.chat, 'لا تزال هناك أسئلة لم يتم الرد عليها في هذه الدردشة', conn.tekateki[id][0]);
    throw false;
  }
  let pathUrl;
  if (command === 'qu1') {
    pathUrl = './src/quran/quiz1.json';
  } else if (command === 'qu2') {
    pathUrl = './src/quran/quiz2.json';
  } else if (command === 'qu3') {
    pathUrl = './src/quran/quiz3.json';
  } else {
    return; // إذا لم يتم العثور على الأمر المطلوب، يتم الخروج من الدالة
  }
  let tekateki = JSON.parse(fs.readFileSync(pathUrl));
  let json = tekateki[Math.floor(Math.random() * tekateki.length)];
  let _clue = json.filename;
  let clue = _clue.replace(/[A-Za-z]/g, '_');
  let caption = `
ⷮ• *${json.path}*\n
❶- *${json.q1}*
❷- *${json.q2}*
❸- *${json.q3}*
❹- *${json.q4}*\n
\n🕘 *• الوقت:* ${(timeout / 1000).toFixed(2)} ثانية
🏆 *• الجائزة:* +${poin} نقطة
`.trim();

  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    poin,
    setTimeout(async () => {
      if (conn.tekateki[id]) await conn.reply(m.chat, `انتهى الوقت!\n*الإجابة هي:* ${json.filename}`, conn.tekateki[id][0]);
      delete conn.tekateki[id];
    }, timeout)
  ];
};

handler.tags = ['game'];
handler.command = ['qu1', 'qu2', 'qu3'];

export default handler;
