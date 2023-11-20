import fetch from 'node-fetch'; // استيراد مكتبة لجلب البيانات

let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) throw `👈🏼 *يجب عليك كتابة:* \n\n_مثال:_\n${usedPrefix + command} 1\n\nرقم السورة`;

    const suraId = parseInt(args[0]); // تحويل رقم السورة إلى عدد صحيح
    if (isNaN(suraId) || suraId < 1 || suraId > 114) {
        throw `👈🏼 *رقم السورة غير صالح. يجب أن يكون بين 1 و 114*`;
    }

    // جلب البيانات من الملف
    const res = 'https://github.com/Alsarmad/whatsapp_adhkar/raw/main/files/json/albitaqat.json';
    const response = await fetch(res);
    const json = await response.json();

    if (json && json[suraId - 1]) {
        const sura = json[suraId - 1];

        // تكوين النص الذي سيتم إرساله
        let mesa = `
*السورة: سورة ${sura.surah}*
-------------------
¶ *عدد الآيات:* ${sura.ayaatiha}\n
¶ *معنى اسمها:* ${sura.maeni_asamuha}\n
¶ *سبب تسميتها:* ${sura.sabab_tasmiatiha}\n
¶ *أسماؤها:* ${sura.asmawuha}\n
¶ *مقصدها العام:* ${sura.maqsiduha_aleamu}\n
¶ *سبب نزولها:* ${sura.sabab_nuzuliha}\n
¶ *فضلها:* ${sura.fadluha.join('\n')}\n
¶ *مناسباتها:* ${sura.munasabatiha.join('\n')}\n
`.trim();
        await m.reply(mesa);
    } else {
        throw `👈🏼 *رقم السورة غير موجود في القائمة:* ${args[0]}`;
    }
};

handler.help = ['ayati'];
handler.tags = ['islam1'];
handler.command = /^(suracard)$/i;

export default handler;
