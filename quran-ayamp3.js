import {alquran} from '@bochilteam/scraper'
let handler = async (m, { args, usedPrefix, command }) => {
    if (!(args[0] || args[1])) throw `مثال:\n${usedPrefix + command} 1 2\n\nفالنتيجة هي سورة الفاتحة الآية 2 مع الصوت، والآية 1 فقط`
    if (isNaN(args[0]) || isNaN(args[1])) throw `مثال:\n${usedPrefix + command} 1 2\n\nفالنتيجة هي سورة الفاتحة الآية 2.`
    let api = await alquran()
    let mes = `
الأية: ${api[args[0] - 1].ayahs[args[1] - 1].text.ar}

( سورة ${api[args[0] - 1 ].asma.ar.short} : الأية ${api[args[0] - 1].ayahs[args[1] - 1].number.insurah} )
`.trim()
    m.reply(mes)
    conn.sendFile(m.chat, api[args[0] - 1].ayahs[args[1] - 1].audio.url, '', '', m)
}

handler.help = ['ayta'].map(v => v + ' *surah no*')
handler.tags = ['islam']
handler.command = /^(ayamp3)$/i
export default handler