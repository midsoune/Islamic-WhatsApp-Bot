import fs from 'fs';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const quran = await fs.promises.readFile('./src/quran/qvideo.json');
  const quranList = JSON.parse(quran);
  const randomIndex = Math.floor(Math.random() * quranList.length); // اختيار فيديو عشوائي

  try {
    const videoInfo = quranList[randomIndex];
    const dl_url = videoInfo.path;
    const ttl = videoInfo.filename;
    const size = videoInfo.size;

    const res = await fetch(dl_url);

    if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
      // menghapus respons server
      res.body.destroy();
      throw `Content-Length: ${res.headers.get('content-length')}`;
    }

    const contentType = res.headers.get('content-type');
    let filename = '';

    // ngendaliin konten tipe yang bisa aja berbeda
    if (/^video\//.test(contentType)) {
      const videoBuffer = await res.buffer();
      await conn.sendFile(m.chat, videoBuffer, {
        quoted: m,
        mimetype: contentType}, ``, m);
    } else {
      await conn.reply(m.chat, '*[❗] تنسيق الفيديو غير مدعوم*', m);
    }
  } catch (error) {
    await conn.reply(m.chat, '*[❗] خطأ في تحميل الفيديو*', m);
  }
};

handler.command = /^qvideo?$/i;
export default handler;
