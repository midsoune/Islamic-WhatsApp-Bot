import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { alquran } from '@bochilteam/scraper';

let handler = async (m, { conn }) => {
  try {
    let surahNumber = m.text.split(' ')[1];
    let ayahNumber = m.text.split(' ')[2];
    let api = await alquran();

    if (!surahNumber || !ayahNumber) {
      throw new Error(`*يجب إدخال رقم السورة ورقم الآية معًا*\n\n*مثال*:\n.tafsir 2 18\n\n(هنا سيعطينا تفسير الآية رقم 18 من السورة رقم 2)`);
    }

    const tafsirResult = await surahTafsir('ar-tafsir-muyassar', surahNumber, ayahNumber);
    const tafsirIbnKatir = await surahTafsir('ar-tafsir-ibn-kathir', surahNumber, ayahNumber);

    if (tafsirResult && tafsirIbnKatir) {
      const teks = `🔍 *التفسير الميسر للآية:*\n\n📜 *الآية:* ${api[surahNumber - 1].ayahs[ayahNumber - 1].text.ar}\n\n📖 *التفسير الميسر:* ${tafsirResult}\n\n📖 *تفسير ابن كثير:* ${tafsirIbnKatir}\n\n( سورة ${api[surahNumber - 1].asma.ar.short} : الآية ${api[surahNumber - 1].ayahs[ayahNumber - 1].number.insurah} )`;
      await m.reply(teks);
    } else {
      await m.reply("لم يتم العثور على التفسير للآية المحددة.");
    }
  } catch (e) {
    await m.reply(`${e.message}`);
  }
};

handler.help = ["tfs"];
handler.tags = ["internet"];
handler.command = /^(tafsir)$/i;

export default handler;

async function surahTafsir(tafsirType, surahNumber, ayahNumber) {
  try {
    // استخدم رقم السورة ورقم الآية لبناء URL المخصص للآية المحددة
    const url = `https://quran.com/ar/${surahNumber}:${ayahNumber}/tafsirs/${tafsirType}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // استخرج التفسير
    const tafsirText = $('.tafsirs_tafsirContainer__DIxKj div.TafsirText_md__mJWtv').text().trim();
    return tafsirText;
  } catch (error) {
    console.log(error);
    return null;
  }
}
