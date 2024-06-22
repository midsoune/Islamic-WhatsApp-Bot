import fetch from 'node-fetch';

const fetchQisaData = async () => {
  try {
    const response = await fetch('https://github.com/4i8/QuranBot/raw/7484ed5cddf21bd7e48d7a01e6519afc901be545/src/data/audio/qasas.json');
    const data = await response.json();
    const qsa = data.qsa;
    const server = data.server;
    return qsa, server, data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handler = async (m, { conn }) => {
  conn.qisaData = conn.qisaData ? conn.qisaData : {};

  const qisa = await fetchQisaData();
  if (!qisa) {
    m.reply("خطأ في تحميل البيانات.");
    return;
  }

  const formattedList = Object.values(qisa).map(v => (
    `*${v.id}.* ${v.qsa}`
  )).join('\n');


  const messageContent = `📚 *القصص الصوتية:*\n--------------\n📢 *يمكنك الرد على هذه الرسالة برقم القصة للحصول على مقطع صوتي لها.*\n\n${formattedList}`;
    // إذا كانت الرسالة تحتوي على نص، قم بالرد عليها برسالة القصة
  const { key } = await m.reply(`${messageContent}`);

  conn.qisaData[m.chat] = { list: Object.values(qisa), key, timeout: setTimeout(() => { conn.sendMessage(m.chat, { delete: key }); delete conn.qisaData[m.chat]; }, 2000 * 600)};
};
handler.before = async (m, { conn }) => {
  conn.qisaData = conn.qisaData ? conn.qisaData : {};

  if (m.isBaileys || !(m.chat in conn.qisaData)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; // إذا لم يكن الإدخال رقمًا، فلا تفعل شيئًا

  const { list, key } = conn.qisaData[m.chat];
  if (!m.quoted || m.quoted.id !== key.id || !m.text) return;
  const index = parseInt(input);

  if (isNaN(index) || index < 1 || index > 48) {
    m.reply("❌ يرجى الرد برقم القصة من القصص أعلاه.");
  } else {
    const selectedObj = list[index - 1];
    const qsaUrl = `${selectedObj.server}`;
    const sqsa = `${selectedObj.qsa}`;
    const sname = `${selectedObj.name}`;
    
    m.reply(`قمت بإختيار *${sqsa}*\nللراوي: *${sname}*`);
    conn.sendFile(m.chat, qsaUrl, `${sqsa}.mp3`, `${site}`, m, false, { mimetype: 'audio/mpeg' });
  //  conn.sendMessage(m.chat, { delete: key });
   // clearTimeout(conn.qisaData[m.chat].timeout);
   // delete conn.qisaData[m.chat];
    }
    };


handler.help = ["qisa"];
handler.tags = ["search"];
handler.command = /^qisasmp3|qi/i;

export default handler;
