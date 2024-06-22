import fetch from 'node-fetch';

let surahName = '';

const fetchQuranData = async (surahNumber) => {
  try {
  //  const response = await fetch(`https://quran-wudy.vercel.app/surah/${surahNumber}`);
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
    const data = await response.json();
    const ayahs = data.data.ayahs;
    surahName = data.data.name; // تعيين المتغير العالمي
    return ayahs; // قم بإرجاع الآيات فقط
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handler = async (m, { conn }) => {
  conn.quransData = conn.quransData ? conn.quransData : {};

  const surahNumber = parseInt(m.text.split(' ')[1]);
  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    m.reply("❌ يرجى كتابة رقم السورة. من 1 إلى 114.");
    return;
  }

  const ayahs = await fetchQuranData(surahNumber);
  if (!ayahs) {
    m.reply("خطأ في تحميل البيانات.");
    return;
  }

  const formattedList = Object.values(ayahs).map(v => (
    `*${v.numberInSurah}.* ${v.text}`
  )).join('\n');
  const instructions = "📢 يمكنك الرد برقم الآية للحصول على مقطع صوتي للآية.";

  const { key } = await m.reply(`📖 أيات ${surahName}:\n--------------\n${formattedList}\n\n${instructions}`);
  // قم بتخزين بيانات القرآن في متغير conn.quransData للاستخدام لاحقًا
  conn.quransData[m.chat] = { list: Object.values(ayahs), key, timeout: setTimeout(() => { conn.sendMessage(m.chat, { delete: key }); delete conn.quransData[m.chat]; }, 5000 * 60)};
};

handler.before = async (m, { conn }) => {
  conn.quransData = conn.quransData ? conn.quransData : {};

  if (m.isBaileys || !(m.chat in conn.quransData)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; // إذا لم يكن الإدخال رقمًا، فلا تفعل شيئًا

  const { list, key } = conn.quransData[m.chat];
  if (!m.quoted || m.quoted.id !== key.id || !m.text) return;
  const index = parseInt(input);

  if (isNaN(index) || index < 1 || index > list.length) {
    m.reply("❌ يرجى الرد برقم الآية من الآيات أعلاه.");
  } else {
    const selectedObj = list[index - 1];
console.log(selectedObj.audio)
    // تحقق مما إذا كانت الرسالة هي رد ومما إذا كان معرف الرسالة المقتبسة يتطابق مع key.id من القائمة

    conn.sendFile(m.chat, selectedObj.audio, '', '', m)
  }
};

handler.help = ["qurans"];
handler.tags = ["search"];
handler.command = /^surat/i;

export default handler;
