import fetch from 'node-fetch';

let handler = async (m, { args, command }) => {
  let listTitle; let hadithURL; let auth;
if (command === 'bukhari') {
     hadithURL = 'https://raw.githubusercontent.com/A7med3bdulBaset/hadith-json/main/db/by_book/the_9_books/bukhari.json';
    listTitle = 'صحيح البخاري'; auth = 'الإمام محمد بن إسماعيل البخاري'}
      else if (command === 'muslim') {
       hadithURL = 'https://github.com/A7med3bdulBaset/hadith-json/raw/main/db/by_book/the_9_books/muslim.json';
        listTitle = 'الإمام مسلم'; auth = 'الإمام مسلم بن الحجاج القشيري النيسابوري'}
        else if (command === 'ahmed') {
           hadithURL = 'https://raw.githubusercontent.com/A7med3bdulBaset/hadith-json/main/db/by_book/the_9_books/ahmed.json';
            listTitle = 'مسند الإمام أحمد بن حنبل'; auth = 'الإمام أحمد بن حنبل'}
        else if (command === 'abudawud') {
           hadithURL = 'https://github.com/A7med3bdulBaset/hadith-json/raw/main/db/by_book/the_9_books/abudawud.json';
            listTitle = 'سنن أبي داود'; auth = 'الإمام سليمان بن الأشعث أبو داود السجستاني'}
    else if (command === 'ibnmajah') {
       hadithURL = 'https://raw.githubusercontent.com/A7med3bdulBaset/hadith-json/main/db/by_book/the_9_books/ibnmajah.json';
      listTitle = 'سنن ابن ماجه'}
  else if (command === 'malik') {
   hadithURL = 'https://raw.githubusercontent.com/A7med3bdulBaset/hadith-json/main/db/by_book/the_9_books/malik.json'; auth = 'الإمام مالك بن أنس'; listTitle = 'موطأ مالك'}
    else if (command === 'nasai') {
     hadithURL = 'https://raw.githubusercontent.com/A7med3bdulBaset/hadith-json/main/db/by_book/the_9_books/nasai.json'; auth = 'الإمام أبو عبد الرحمن أحمد بن شعيب النسائي'; listTitle = 'سنن النسائي'}
    else if (command === 'tirmidhi') {
     hadithURL = 'https://github.com/A7med3bdulBaset/hadith-json/raw/main/db/by_book/the_9_books/tirmidhi.json'; auth = 'author":"الإمام أبو عيسى محمد بن عيسى الترمذي'; listTitle = 'جامع الترمذي'}
    else if (command === 'damiri') {
     hadithURL = 'https://raw.githubusercontent.com/A7med3bdulBaset/hadith-json/main/db/by_book/the_9_books/darimi.json'; auth = 'الإمام أبو محمد عبد الرحمن بن عبد الله بن الدارمي'; listTitle = 'سنن الدارمي'} else if (command === 'hadith') {
    m.reply(`*لعرض الكتب، أدخل الأمر:*\n\n.ahmed (مسند الإمام أحمد بن حنبل)\n.muslim (الإمام مسلم)\n.bukhari (صحيح البخاري)\n.nasai (سنن النسائي)\n.tirmidhi (جامع الترمذي)\n.malik (موطأ مالك)\n.abudawud (سنن أبي داود)\n.ibnmajah (سنن ابن ماجه)\n.damiri (سنن دارمي)\n\n${site}`)
      }
  if (command === 'ibnmajah' || command === 'abudawud' || command === 'muslim' || command === 'bukhari' || command === 'ahmed' || command === 'darimi' || command === 'malik' || command === 'tirmidhi' || command === 'nasai') {
    try {
      const response = await fetch(hadithURL);
      const hadithData = await response.json();
      const maxHadith = hadithData.hadiths.length;


      if (args.length === 0) {
        let booksList = `*📚 قائمة الكتب المتاحة لـ ${listTitle}:*\n\n`;

        hadithData.chapters.forEach((chapter, index) => {
          const chapterId = chapter.id;
          const bookId = chapter.bookId;
          const hadithsInChapter = hadithData.hadiths.filter(
            (hadith) => hadith.chapterId === chapterId && hadith.bookId === bookId
          );
          const hadithCount = hadithsInChapter.length;
          const chapterName = chapter.arabic;
          const hadithCountmin = hadithsInChapter[0].idInBook;
          const hadithCountmax = hadithsInChapter[hadithCount - 1].idInBook;

          booksList += `${index + 1}. *${chapterName}* (من ${hadithCountmin} إلى ${hadithCountmax}):\n`;
        });


        m.reply(`${booksList}\n\nㅤ${auth}`);
        await m.reply(`*لعرض حديث في قسم ما، أكتر الأمر التالي:*\n\n*مثال:*\n\n.${command} 345`);
      } else {
        const hadithNumber = parseInt(args[0]);

        if (hadithNumber >= 1 && hadithNumber <= maxHadith) {
          const selectedHadith = hadithData.hadiths[hadithNumber - 1];
          const chapterId = selectedHadith.chapterId;
          const bookId = selectedHadith.bookId;
          const chapterData = hadithData.chapters.find((chapter) => chapter.id === chapterId && chapter.bookId === bookId);

          const chapterName = chapterData ? chapterData.arabic : 'اسم الكتاب غير متاح';

          m.reply(`${selectedHadith.arabic}\n\n${chapterName} - الفصل: ${chapterId} - الحديث رقم: ${selectedHadith.idInBook}`);
        } else {
          m.reply(`الرجاء إدخال رقم الحديث بين 1 و ${maxHadith}\n\n*مثال:*\n\n.${command} 10`);
        }
      }
    } catch (error) {
      console.error(error);
      m.reply('حدث خطأ أثناء جلب البيانات.');
    }
  }
};

handler.help = ['hadith', 'gethadith'];
handler.tags = ['islam1'];
handler.command = /^hadith|ibnmajah|bukhari|muslim|ahmed|abudawud|malik|darimi|nasai|tirmidhi/i;

export default handler;
