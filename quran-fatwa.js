import fetch from 'node-fetch';

let handler = async (m, { args, command }) => {
  let listTitle; let url; let maxf; let mf;
  if (command === 'fatwa' || command === 'getfatwa') {
   url = 'https://raw.githubusercontent.com/Alsarmad/binbaz_database/main/database/fatawaa_aljamie_alkabir.json'; mf = '60';
    listTitle = 'الجامع الكبير';maxf = '1783'}
      else if (command === 'fatwa1' || command === 'getfatwa1') {
       url = 'https://raw.githubusercontent.com/Alsarmad/binbaz_database/main/database/fatawaa_aldurus.json'; mf = '190';
        listTitle = 'الدروس';maxf = '5675'}
    else if (command === 'fatwa2' || command === 'getfatwa2') {
     url = 'https://raw.githubusercontent.com/Alsarmad/binbaz_database/main/database/nur_ealaa_aldarb.json'; mf = '409';
      listTitle = 'نور على الدرب';maxf = '12269'}
  if (args.length === 0 && (command == 'fatwa' || command == 'fatwa1' || command == 'fatwa2')) {
      throw `يرجى إدخال رقم بين 1 و ${mf} لتصفح قائمة الفتاوي\n\n*مثال:*\n\n.${command} 10`;
      return;
  }
    try {
      const response = await fetch(url);
      const data = await response.json();
        if (command === 'fatwa' || command === 'fatwa1' || command === 'fatwa2') {
            const pageSize = 30; // عدد الفتوى في كل صفحة
            const fatwaNumber = parseInt(args[0]) || 1;
            const start = (fatwaNumber - 1) * pageSize;
            const end = start + pageSize;
            if (start < data.length) {
            let reply = `*📜 قائمة فتاوي ${listTitle} - الفتوى ${start + 1} إلى ${Math.min(end, data.length)}:*\n\n`;

                for (let i = start; i < Math.min(end, data.length); i++) {
                    const fatwa = data[i];
                    reply += `📁 [${i + 1}] ${fatwa.title}\n`;
                }
                m.reply(reply);
               await m.reply(`أدخل الأمر *get${command}* لعرض الفتوى التي تريد\n\n*مثال:*\n.get${command} 5`);
            } else {
                m.reply('الرقم المدخل غير صالح. الرجاء استخدام رقم من بين الأرقام المتاحة.');
            }
        } else if (command === 'getfatwa' || command === 'getfatwa1' || command === 'getfatwa2') {
            const selectedFatwaId = parseInt(args[0]);
            if (selectedFatwaId >= 1 && selectedFatwaId <= data.length) {
                const selectedFatwa = data[selectedFatwaId - 1];
                m.reply(`*${selectedFatwa.title}*\n‏︻⋆︻⋆︻⋆︻⋆︻⋆︻⋆︻\n\n✫ *السؤل:*\n${selectedFatwa.question}\n\n✫ ${selectedFatwa.answer}`);
            } else {
                m.reply(`الرجاء إدخال رقم بعد الأمر بين 1 و ${maxf}\n\n*مثال:*\n\n.${command} 10`);
            }
        }
    } catch (error) {
        console.error(error);
        m.reply('حدث خطأ أثناء جلب البيانات.');
    }
};

handler.help = ['fatwa', 'getfatwa'];
handler.tags = ['islam1'];
handler.command = /^fatwa|getfatwa|fatwa1|getfatwa1|fatwa2|getfatwa2/i;

export default handler;
