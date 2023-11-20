import fetch from 'node-fetch';
import cheerio from 'cheerio';

const leagueEmojis = [
  { league: 'الدوري الفرنسي', emoji: '🇫🇷' },
  { league: 'الدوري الإنجليزي', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'كأس رابطة الدوري الإنجليزي', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'الدوري الإيطالي', emoji: '🇮🇹' },
  { league: 'كأس إيطاليا', emoji: '🇮🇹' },
  { league: 'الدوري الإسباني', emoji: '🇪🇸' },
  { league: 'كأس الملك الاسباني', emoji: '🇪🇸' },
  { league: 'الدوري الألماني', emoji: '🇩🇪' },
  { league: 'الدوري الهولندي الممتاز', emoji: '🇳🇱' },
  { league: 'الدوري البرتغالي الممتاز', emoji: '🇵🇹' },
  { league: 'الدوري التركي الممتاز', emoji: '🇹🇷' },
  { league: 'كأس تركيا', emoji: '🇹🇷' },
  { league: 'دوري أبطال أوروبا', emoji: '🇪🇺'},
  { league: 'دوري أبطال آسيا', emoji: '🌍' },
  { league: 'تصفيات كأس أوروبا', emoji: '🇪🇺' },
  { league: 'تصفيات كأس أمم افريقيا', emoji: '🌍' },
  { league: 'دوري المحترفين الإماراتي', emoji: '🇦🇪' },
  { league: 'كأس المحترفين الإماراتي', emoji: '🇦🇪' },
  { league: 'الدوري المغربي الدرجة الثانية', emoji: '🇲🇦' },
  { league: 'الدوري المغربي الممتاز', emoji: '🇲🇦' },
  { league: 'مباريات ودية', emoji: '🇺🇳' },
  { league: 'مباريات ودية -  أندية', emoji: '🌍' },
  { league: 'كأس المانيا', emoji: '🇩🇪' },
  { league: 'الدوري البلجيكي', emoji: '🇧🇪' },
  { league: 'الدوري السعودي', emoji: '🇸🇦' },
  { league: 'تصفيات أمريكا الجنوبية لكأس العالم', emoji: '🌎' },
  { league: 'تصفيات آسيا لكأس العالم', emoji: '🌍' },
  { league: 'كأس الاتحاد الإنجليزي', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'كأس السوبر الإفريقي', emoji: '🌍' },
  { league: 'دوري أبطال أفريقيا', emoji: '🌍' },
  { league: 'كأس الاتحاد الأفريقي', emoji: '🌍' }
];

const excludedLeagues = [
  'الدوري الليبيري الممتاز',
  'الدوري الاسباني - الدرجة الثانية',
  'الدوري الجزائري الدرجة الثانية',
  'دوري المحترفين الإماراتي',
  'الدوري اللبناني الممتاز',
  'مباريات ودية -  أندية',
  'البحرين - كاس الملك',
  'كأس الاتحاد الآسيوي للأندية',
  'بطولة الألعاب الآسيوية - كرة القدم',
  'الدوري البرازيلي - الدرجة الأولى',
  'دوري الدرجة 2 السعودي',
  'دوري محمد بن سلمان د. أولى',
  'دوري الشباب السعودي',
  'دوري الضفة الغربية الفلسطيني',
 'ليسوتو - دوري ليسوتو الممتاز',
  'دوري الدرجة الأولى الكويتي',
 'دوري الدرجة الثانية التونسي',
  'دوري الدرجة الثانية القطري',
  'الدوري البحريني',
  'الدوري اليمني',
  'الدوري الليبي',
   'الدوري السوري الممتاز',
  'دوري نجوم قطر',
  'الدوري الجزائري',
  'كأس خادم الحرمين الشريفين',
  'الدوري الإماراتي للمحترفين',
  'الدوري المصري',
  'الدوري العماني',
  'الدوري الكويتي', 'كأس تركيا',
  'كأس الأردن',
  'كأس مصر',
  'كأس السلطان العماني',
  'الدوري التونسي',
  'الدوري الأردني للمحترفين',
  'كأس فرنسا'
];

const getLiveMatches = async (command) => {
  let kurl, txtx;
  if (command === 'kora') {
    kurl = 'https://timekora.com/matches/today/';
    txtx = '*هذه هي مباريات اليوم* :\n‏▬▬▬▬▬▬▬▬▬▬\n';
  } else if (command === 'koran') {
    kurl = 'https://timekora.com/matches/now/';
    txtx = '*هذه هي المباريات الجارية حاليا* :\n‏▬▬▬▬▬▬▬▬▬▬▬\n';
  } else if (command === 'korat') {
    kurl = 'https://timekora.com/matches/tomorrow/';
    txtx = '*هذه هي مباريات الغد* :\n‏▬▬▬▬▬▬▬▬▬\n';
  } else if (command === 'koray') {
    kurl = 'https://timekora.com/matches/yesterday/';
    txtx = '*هذه هي مباريات الأمس* :\n\n‏▬▬▬▬▬▬▬▬▬▬\n';
  } else {
    return; // إذا لم يتم العثور على الأمر المطلوب، يتم الخروج من الدالة
  }

  const url = kurl;
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const matchesInfo = [];
    let currentLeague = '';

    matchesInfo.push(`${txtx}`);
    $('.col-md-12').each((index, element) => {
      const leagueName = $(element).find('.match-title h2').text().trim();
      const leagueMatches = $(element).find('.match_item.single-match-box');

      if (excludedLeagues.includes(leagueName)) {
        return;
      }

      if (leagueName !== currentLeague) {
        currentLeague = leagueName;
        const getLeagueEmoji = (leagueName) => {
          const match = leagueEmojis.find((item) => item.league === leagueName);
          return match ? match.emoji : '‏';
        };
        const leagueEmoji = getLeagueEmoji(currentLeague);
        matchesInfo.push(`*${leagueEmoji} ${currentLeague}‎*\n‏══════ ⋆★⋆ ══════`);
      }

      leagueMatches.each((index, matchElement) => {
        const teamNames1 = $(matchElement).find('.awayTeam b').text().trim().replace(/تحت 17 عام/g, '').replace(/U17/g, '').replace(/تحت 17/g, '');
        const teamNames2 = $(matchElement).find('.homeTeam b').text().trim().replace(/تحت 17 عام/g, '').replace(/U17/g, '').replace(/تحت 17/g, '');
        const liveTime = $(matchElement).find('.small_display_box .match_time').text().trim();
        let liveStatu = $(matchElement).find('.eventStatus.match_time.match-status').text().trim().replace(/جارية حاليا/g, '🔸 *مباشر*').replace(/انتهت/g, '✅');; 
        let matchResult = ``;
        if (liveTime.includes(":")) {
          const [hours, minutes] = liveTime.split(":");
          const date = new Date();
          date.setUTCHours(Number(hours) + 9);
          date.setUTCMinutes(minutes);

          const formattedTime = `${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
          matchResult += `‏【 *${teamNames1}* ✘ *${teamNames2}* 】• _${formattedTime}_\n`;
        } else {
          matchResult += `‏【 *${teamNames1}* *${liveTime}* *${teamNames2}* 】${liveStatu}\n`;
        }
        matchesInfo.push(matchResult);
      });
    });

    return matchesInfo;
  } catch (error) {
    console.error('حدث خطأ أثناء الاتصال بالموقع:', error);
    return null;
  }
};
const handler = async (m, { conn, command }) => {
  try {
    const matchesInfo = await getLiveMatches(command);
    if (matchesInfo && matchesInfo.length > 0) {
      const linesToRemove = 1;
      const truncatedInfo = matchesInfo.slice(0, -linesToRemove);
      const replyMessage = truncatedInfo.join('\n');
 //     
      conn.reply(m.chat, replyMessage, m);
    } else {
      conn.reply(m.chat, 'لا يمكن العثور على المباريات الملعوبة حالياً.', m);
    }
  } catch (error) {
    console.error('حدث خطأ أثناء استخراج معلومات المباريات:', error);
    conn.reply(m.chat, 'حدث خطأ أثناء استخراج معلومات المباريات.', m);
  }
};

handler.command = /^(kora|koray|koran|korat)$/i;
handler.tags = ['sports'];
handler.help = ['livemtches'];
export default handler;
