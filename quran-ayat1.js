import { alquran } from '@bochilteam/scraper';
import translate from '@vitalets/google-translate-api';

let handler = async (m, { args, usedPrefix, command }) => {
    if (!(args[0] || args[1])) throw `👈🏼 *يجب عليك كتابة:* \n\n_مثال:_\n${usedPrefix + command} 1 2\n\nرقم السورة ورقم الآية`;
    if (isNaN(args[0]) || isNaN(args[1])) throw `👈🏼 *يجب عليك كتابة:* \n\n_مثال:_\n${usedPrefix + command} 1 3\n\nرقم السورة ورقم الآية، هنا سنحصل على سورة الفاتحة الآية رقم 3`;
    
    let api = await alquran();
    let ayatf2 = api[args[0] - 1].ayahs[args[1] - 1].tafsir.id;
    const transAr = await translate(ayatf2, {from: 'auto', to: 'ar', autoCorrect: false });

    let mesa = `
*الآية:* ${api[args[0] - 1].ayahs[args[1] - 1].text.ar}
ـ٠ـ٠ـ٠ـ٠ـ٠ـ٠ـ٠ـ
*النطق:* ${api[args[0] - 1].ayahs[args[1] - 1].text.read}

( سورة ${api[args[0] - 1].asma.ar.short} : الآية ${api[args[0] - 1].ayahs[args[1] - 1].number.insurah} )
`.trim();
    m.reply(mesa);
};

handler.help = ['ayati'];
handler.tags = ['islam1'];
handler.command = /^(aya)$/i;

export default handler;
