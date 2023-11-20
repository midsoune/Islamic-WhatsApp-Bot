import fetch from 'node-fetch';

let handler = async (m, { args, usedPrefix, command }) => {
    try {
        const response = await fetch('https://github.com/Alsarmad/whatsapp_adhkar/raw/main/files/json/adhkar.json');
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            if (!args[0]) {
                let reply = '📚 *أقسام الأذكار:*\n\n';
                data.forEach((section, index) => {
                    reply += `📁 ${index + 1}- ${section.category}\n`;
                });

                let reply2 = `*✅ أدخل الأمر ${command} ورقم القسم لتظهر لك الأذكار الخاصة بذلك القسم*\n\n*مثال:*\n_.${command} 10_`;

                // أولاً، قم بإرسال القسم
                m.reply(reply);

                // ثم، قم بإرسال الرسالة الإضافية بفاصل زمني قصير بعد القسم
                setTimeout(() => {
                    m.reply(reply2);
                }, 1000); // يمكنك تعديل الفاصل الزمني حسب رغبتك
            } else {
                const sectionIndex = parseInt(args[0]) - 1;

                if (sectionIndex >= 0 && sectionIndex < data.length) {
                    const section = data[sectionIndex];
                    let reply = `*📓 أذكار ${section.category}:*\n\n`;

                    section.array.forEach((adhkar, index) => {
                        reply += `📜 [${index + 1}] ${adhkar.text}\n\n`;
                    });

                    m.reply(reply);
                } else {
                    m.reply('الرقم المدخل غير صالح. الرجاء استخدام رقم من بين الأقسام المعروضة.');
                }
            }
        } else {
            m.reply('لا يمكن العثور على البيانات المطلوبة.');
        }
    } catch (error) {
        console.error(error);
        m.reply('حدث خطأ أثناء جلب البيانات.');
    }
};

handler.help = ['adhkar'];
handler.tags = ['islam1'];
handler.command = /^(adkar)$/i;

export default handler;
