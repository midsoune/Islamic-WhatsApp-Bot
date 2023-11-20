import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

const reciters = [{
    name: "ajamy",
    folder: "ahmed_ibn_3ali_al-3ajamy",
    arname : "أحمد بن علي العجمي" },{
    name: "fares",
    folder: "fares",
    arname : "فارس عباد"},{
    name: "sudais",
    folder: "abdurrahmaan_as-sudays",
    arname : "عبد الرحمان السديس"},{
    name: "maher",
    folder: "maher_almu3aiqly/year1440",
    arname : "ماهر المعيقلي" },{
    name: "saad",
    folder: "sa3d_al-ghaamidi/complete",
   arname : "سعد الغامدي"},{
    name: "yasser",
    folder: "yasser_ad-dussary",
    arname : "ياسر الدوسري"} ];

let quranSurahHandler = async (m, { conn }) => {
  try {
    // Extract the surah number or name from the command text.
    let surahInput = m.text.split(' ')[1];
    let reciterInput = m.text.split(' ')[2];

    if (!surahInput) {
      throw new Error(`يرجى إدخال إسم أو رقم السورة`);
    }

    if (!reciterInput) {
      throw new Error(`يرجى اختيار مقرئ. الخيارات المتاحة:\n\najamy\nfares\nsudais\nmaher\nsaad\nyasser\n\n*مثال:*\n.quran 1 fres`);
    }

    let selectedReciter = reciters.find(reciter =>
      reciter.name.toLowerCase() === reciterInput.toLowerCase()
    );

    if (!selectedReciter) {
      throw new Error(`المقرئ "${reciterInput}" غير متاح.\n الخيارات المتاحة\n\najamy\nfares\nsudais\nmaher\nsaad\nyasser`);
    }

    let surahListRes = await fetch('https://quran-endpoint.vercel.app/quran');
    let surahList = await surahListRes.json();

    let surahData = surahList.data.find(surah => 
        surah.number === Number(surahInput) || 
        surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() || 
        surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    );

    if (!surahData) {
      throw new Error(`لا توجد سورة بالرقم أو الإسم الذي أدخلته "${surahInput}\n\nلعرض جميع سور القرآن أكتب *_سور القران_*`);
    }

    let res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
    
    if (!res.ok) {
      let error = await res.json(); 
      throw new Error(`API request failed with status ${res.status} and message ${error.message}`);
    }

    let json = await res.json();

    // Translate tafsir from Bahasa Indonesia to English
    let city = "";
    if (json.data.type.en === "Medinan") {
      city = "مدنية";
    } else if (json.data.type.en === "Meccan") {
      city = "مكية";
    } else {
      city = "غير معروفة";
    }

    let quranSurah = `📜 *السورة : ${json.data.asma.ar.long}*
📚 *النوع :* ${city}
🔢 *عدد الأيات :* ${json.data.ayahCount}
👳🏻 *المقرئ :* ${selectedReciter.arname}`;

    m.reply(quranSurah);

    // Get the selected reciter's folder name
    let reciterName = selectedReciter.folder;

let surahNumber = String(json.data.number).padStart(3, '0'); // تأكد من أن الرقم يكون ثلاثة أرقام
let recitationUrl = `http://download.quranicaudio.com/quran/${selectedReciter.folder}/${surahNumber}.mp3`;

    conn.sendMessage(m.chat, { audio: { url: recitationUrl }, mimetype: 'audio/mpeg' }, `${surahNumber}_${json.data.asma.ar.long}.mp3`, `${surahNumber}_${json.data.asma.ar.long}`, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply(`خطأ: ${error.message}`);
  }
};

quranSurahHandler.help = ['quran [surah_number|surah_name] [اسم المقرئ]'];
quranSurahHandler.tags = ['quran', 'surah'];
quranSurahHandler.command = ['quran', 'surah'];

export default quranSurahHandler;
