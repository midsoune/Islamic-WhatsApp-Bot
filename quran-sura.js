let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) throw `👈🏼 *يجب عليك كتابة:* \n\n_مثال:_\n${usedPrefix + command} 1\n\nرقم السورة`;

    const suraId = parseInt(args[0]); // تحويل رقم السورة إلى عدد صحيح
    if (isNaN(suraId) || suraId < 1 || suraId > 114) {
        throw `👈🏼 *رقم السورة غير صالح. يجب أن يكون بين 1 و 114*`;
    }

    const res = 'https://raw.githubusercontent.com/Alsarmad/Quran-Json/main/Quran.json';
    const response = await fetch(res);
    const json = await response.json();

    if (json && json[suraId - 1]) {
        const sura = json[suraId - 1];

        // تكوين النص الذي سيتم إرساله
        let mesa = `
*السورة: سورة ${sura.name}*
-------------------
${sura.ar}
`.trim();
        await m.reply(mesa);
    } else {
        throw `👈🏼 *رقم السورة غير موجود في القائمة:* ${args[0]}`;
    }
};

handler.help = ['ayati'];
handler.tags = ['islam1'];
handler.command = /^(sura)$/i;

export default handler;
