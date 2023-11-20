import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';
const leagueEmojis = [
  { league: 'الدوري الفرنسي', emoji: '🇫🇷' },
  { league: 'الدوري الإنجليزي الممتاز', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'كأس رابطة الدوري الإنجليزي', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'الدوري الإيطالي', emoji: '🇮🇹' },
  { league: 'كأس إيطاليا', emoji: '🇮🇹' },
  { league: 'الدوري الإسباني', emoji: '🇪🇸' },
  { league: 'كأس ملك إسبانيا', emoji: '🇪🇸' },
  { league: 'الدوري الألماني', emoji: '🇩🇪' },
  { league: 'الدوري الهولندي الممتاز', emoji: '🇳🇱' },
  { league: 'الدوري الهولندي', emoji: '🇳🇱' },
  { league: 'الدوري البرتغالي الممتاز', emoji: '🇵🇹' },
  { league: 'الدوري التركي الممتاز', emoji: '🇹🇷' },
  { league: 'كأس تركيا', emoji: '🇹🇷' },
  { league: 'دوري أبطال أوروبا', emoji: '🇪🇺' },
  { league: 'الدوري الأوروبي', emoji: '🇪🇺' },
  { league: 'دوري المؤتمر الأوروبي', emoji: '🇪🇺' },
  { league: 'كأس العالم للناشئين تحت 17 سنة', emoji: '🏆' },
  { league: 'تصفيات أمم أوروبا', emoji: '🇪🇺' },
  { league: 'تصفيات كأس أمم افريقيا', emoji: '🌍' },
  { league: 'تصفيات كأس العالم أمريكا الجنوبية', emoji: '🌎' },
  { league: 'تصفيات كأس العالم أفريقيا', emoji: '🌍' },
  { league: 'تصفيات كأس العالم آسيا', emoji: '🌏' },
  { league: 'دوري المحترفين الإماراتي', emoji: '🇦🇪' },
  { league: 'كأس المحترفين الإماراتي', emoji: '🇦🇪' },
  { league: 'الدوري المغربي القسم الثاني  البطولة الإحترافية', emoji: '🇲🇦' },
  { league: 'الدوري المغربي البطولة الإحترافية', emoji: '🇲🇦' },
  { league: 'مباريات ودية', emoji: '🇺🇳' },
  { league: 'كأس المانيا', emoji: '🇩🇪' },
  { league: 'وديات منتخبات', emoji: '🇧🇱' },
  { league: 'وديات منتخبات تحت 23', emoji: '🇧🇱' },
  { league: 'وديات أندية', emoji: '🇧🇱' },
  { league: 'الدوري البلجيكي', emoji: '🇧🇪' },
  { league: 'الدوري السعودي للمحترفين', emoji: '🇸🇦' },
  { league: 'تصفيات أمريكا الجنوبية لكأس العالم', emoji: '🌎' },
  { league: 'كوبا ليبرتادوريس', emoji: '🌎' },
  { league: 'تصفيات آسيا لكأس العالم', emoji: '🌍' },
  { league: 'كأس الاتحاد الإنجليزي', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'كأس الاتحاد الآسيوي', emoji: '🌍' },
  { league: 'دوري السوبر الأفريقي', emoji: '🌍' },
  { league: 'دوري أبطال آسيا', emoji: '🌍' },
  { league: 'دوري أبطال أفريقيا', emoji: '🌍' },
  { league: 'كأس الاتحاد الأفريقي', emoji: '🌍' }
];

const excludedLeagues = [
  'الدوري الليبيري الممتاز',
  'الدوري الصيني سوبر',
  'الدوري القطري نجوم قطر',
  'الدوري الروسي الممتاز',
  'الدوري الليبي الممتاز',
  'الدوري الياباني الممتاز',
  'الدوري المصري الممتاز',
  'الدوري الكويتي الممتاز',
  'الدوري العراقي نجوم',
  'الدوري الإماراتي',
  'الدوري الإسباني الدرجة الثانية',
  'الدوري الإنجليزي الدرجة الثانية',
  'الدوري الجزائري القسم الثاني',
  'الدوري الإيراني للمحترفين',
  'تشامبيونشيب البطولة الإنجليزية',
  'الدوري السعودي للسيدات الممتاز',
  'الدوري التونسي الرابطة المحترفة الأولى',
  'الدوري النرويجي الممتاز',
  'الدوري البحريني الممتاز',
  'الدوري الماليزي السوبر',
  'الدوري الأرجنتيني الممتاز',
  'الدوري النمساوي الممتاز',
  'الدوري البولندي الممتاز',
  'الدوري التشيكي الممتاز',
  'الدوري الأوكراني الممتاز',
  'الدوري البرتغالي الدرجة الثانية',
  'الدوري الصربي الممتاز',
  'كأس QSL القطرية Ooredoo',
  'كأس رئيس الدولة الإماراتي',
  'الدوري المجري الممتاز',
  'الدوري التونسي الدرجة الثاني الرابطة المحترفة الثانية',
  'الدوري الكرواتي الممتاز',
  'الدوري الألماني الدرجة الثانية',
  'الدوري الفرنسي الدرجة الثانية',
  'الدوري الإيطالي الدرجة الثاني الدرجة B',
  'الدوري السعودي للشباب تحت 19 سنة',
  'الدوري الأسترالي الدرجة A',
  'الدوري المكسيكي الممتاز',
  'الدوري السويدي الممتاز',
  'الدوري الهولندي',
  'الدوري اليوناني السوبر',
  'الدوري الدنماركي السوبر',
  'الدوري السويسري الممتاز',
  'الدوري الإسكتلندي للمحترفين',
  'الدوري المصري الدرجة الثانية (أ)',
  'الدوري الاسباني - الدرجة الثانية',
  'الدوري الجزائري الدرجة الثانية',
  'دوري المحترفين الإماراتي',
  'الدوري اللبناني الممتاز',
  'مباريات ودية -  أندية',
  'البحرين - كاس الملك',
  'كأس الاتحاد الآسيوي للأندية',
  'بطولة الألعاب الآسيوية - كرة القدم',
  'الدوري البرازيلي',
  'دوري الدرجة 2 السعودي',
  'دوري محمد بن سلمان د. أولى',
  'دوري الشباب السعودي',
  'دوري السعودي يلو',
  'دوري جنوب أفريقيا',
  'دوري أبطال أوروبا للشباب',
  'ليسوتو - دوري ليسوتو الممتاز',
  'دوري الدرجة الأولى الكويتي',
  'دوري الدرجة الثانية التونسي',
  'دوري الدرجة الثانية السعودي',
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
];


const getLiveMatches = async (command) => {
  let kurl, txtx;
  if (command === 'koora') {
    kurl = 'https://jdwel.com/today/';
    txtx = '*هذه هي مباريات اليوم* :\n‏▬▬▬▬▬▬▬▬▬▬\n';
  } else if (command === 'koorat') {
    kurl = 'https://jdwel.com/tomorrow/';
    txtx = '*هذه هي مباريات الغد* :\n‏▬▬▬▬▬▬▬▬▬\n';
  } else if (command === 'kooray') {
    kurl = 'https://jdwel.com/yesterday/';
    txtx = '*هذه هي مباريات الأمس* :\n\n‏▬▬▬▬▬▬▬▬▬▬\n';
  } else if (command === 'kooran') {
      kurl = 'https://jdwel.com/today/';
      txtx = '*هذه هي مباريات الأن* :\n‏▬▬▬▬▬▬▬▬▬▬\n';
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
  $('ul.comp_matches_list.matches_list').each((index, element) => {
    const leagueName = $(element).find('.comp_separator.container .main h4').text().trim().replace(/ الدرجة الاولى/g, '').replace(/ الدرجة الأولى/g, '');
    const leagueMatches = $(element).find('.single_match');

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
      matchesInfo.push(`\n*${leagueEmoji} ${currentLeague}‎*\n‏══════ ⋆★⋆ ══════`);
    }

      leagueMatches.each((index, matchElement) => {
        const teamNames1 = $(matchElement).find('.team.hometeam span.the_team').text().trim();
        const teamNames2 = $(matchElement).find('.team.awayteam span.the_team').text().trim();
        const dateTime = $(matchElement).find('.middle_column.cell.col-2 .match_time .the_otime').text();
        const liveNow = $(matchElement).find('.match_status .status_box span span').text().trim();
        const time = moment(dateTime).subtract(2, 'hours').format('HH:mm');
        const liveStatus = $(matchElement).find('.match_status');
        const matchStatusText = liveStatus.find('span').text().trim().replace(/بين الشوطين/g, '45"').replace(/انتهت/g, '✅').replace(/'/g, '"');
        const matchStatus = matchStatusText.split(' ').filter((text, index, self) => self.indexOf(text) === index);

        const matchScoreElement = $(matchElement).find('.match_score');
        const homeTeamScore = matchScoreElement.find('.hometeam').text();
        const awayTeamScore = matchScoreElement.find('.awayteam').text();
      let liveScore = `${homeTeamScore} - ${awayTeamScore}`;
      let matchResult = ``;
        if (command === 'kooran') {
              if (liveNow.length > 0 && matchResult.length > 0) {
         matchResult += `‏【 *${teamNames1}* *${liveScore}* *${teamNames2}* 】${matchStatus}\n`;} 
          } else {
              if (command !== 'kooran' && liveStatus.text().includes('بدأت')) {
            matchResult += `‏【 *${teamNames1}* ✘ *${teamNames2}* 】${time}\n`
          } else {
             matchResult += `‏【 *${teamNames1}* *${liveScore}* *${teamNames2}* 】${matchStatus}\n`;
          }
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
    const truncatedInfo = matchesInfo;
    const replyMessage = truncatedInfo.join('\n');
    conn.reply(m.chat, replyMessage, m);
  } else {
    conn.reply(m.chat, 'لا يمكن العثور على المباريات الملعوبة حالياً.', m);
  }
} catch (error) {
  console.error('حدث خطأ أثناء استخراج معلومات المباريات:', error);
  conn.reply(m.chat, 'حدث خطأ أثناء استخراج معلومات المباريات.', m);
}
};

handler.command = /^(koora|kooray|kooran|koorat)$/i;
handler.tags = ['sports'];
handler.help = ['livematches'];
export default handler;