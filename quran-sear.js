import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
   let type
  if (command === 'qsen') {let type = 'english';} else if (command === 'qstf1') {let type = 'tafser1';} else if (command === 'qstf2') {let type = 'tafser2';} else {let type = 'search';}

if (!text) { throw `أدخل كلمة البحث، مثال:\n\n.${command} الله نور السماوات`; return }

    try {
        let result = await searchQuran(text, type);
        m.reply(`أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ \n\n${result}${site}`);
    } catch (error) {
        console.log(error);
        m.reply('حدث خطأ أثناء البحث');
    }
}

handler.command = /^(qs|qurans|qstf1|qstf2|qsen)$/i;

async function searchQuran(text, type) {
    try {
        let response = await fetch(`https://api-quran.cf/quransql/index.php?text=${text}&type=${type}`, { method: 'GET' });
        let data = await response.json();
      console.log(data)
        return data.result ? data.result.join('\n') : 'لم يتم التعرف على الكلمة !';
    } catch (error) {
        console.log(error);
        return 'حدث خطأ أثناء البحث';
    }
}
export default handler;
