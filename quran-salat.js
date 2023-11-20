import axios from 'axios';
import cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import moment from 'moment';
const cities = {
  "1": "الرباط",
  "2": "الخميسات",
  "3": "تيفلت",
  "4": "الرماني",
  "5": "والماس",
  "6": "بوزنيقة",
  "7": "القنيطرة",
  "8": "سيدي قاسم",
  "9": "سيدي يحيى الغرب",
  "10": "سيدي سليمان",
  "11": "سوق أربعاء الغرب",
  "12": "عرباوة",
  "13": "مولاي بوسلهام",
  "14": "طنجة",
  "15": "تطوان",
  "16": "العرائش",
  "17": "أصيلة",
  "18": "شفشاون",
  "19": "مرتيل",
  "20": "المضيق",
  "21": "القصر الكبير",
  "22": "القصر الصغير",
  "23": "الحسيمة",
  "24": "سبتة",
  "25": "الفنيدق",
  "26": "الجبهة",
  "27": "واد لاو",
  "28": "باب برد",
  "29": "وزان",
  "30": "بوسكور",
  "31": "وجدة",
  "32": "بركان",
  "33": "فكيك",
  "34": "بوعرفة",
  "35": "كرسيف",
  "36": "جرادة",
  "37": "عين الشعير",
  "38": "تاوريرت",
  "39": "الناظور",
  "40": "مليلية",
  "41": "دبدو",
  "42": "سلوان",
  "43": "بني أنصار",
  "44": "فرخانة",
  "45": "تالسينت",
  "46": "تندرارة",
  "47": "العيون الشرقية",
  "48": "بني ادرار",
  "49": "السعيدية",
  "50": "رأس الماء",
  "51": "تافوغالت",
  "52": "فزوان",
  "53": "أحفير",
  "54": "زايو",
  "55": "دريوش",
  "56": "بني تجيت",
  "57": "بوعنان",
  "58": "الدار البيضاء",
  "59": "المحمدية",
  "60": "بن سليمان",
  "61": "سطات",
  "62": "الكارة",
  "63": "البروج",
  "64": "ابن أحمد",
  "65": "برشيد",
  "66": "الجديدة",
  "67": "أزمور",
  "68": "سيدي بنور",
  "69": "خميس الزمامرة",
  "70": "خنيفرة",
  "71": "مولاي بوعزة",
  "72": "زاوية أحنصال",
  "73": "بني ملال",
  "74": "أزيلال",
  "75": "الفقيه بنصالح",
  "76": "دمنات",
  "77": "القصيبة",
  "78": "قصبة تادلة",
  "79": "خريبكة",
  "80": "وادي زم",
  "81": "فاس",
  "82": "صفرو",
  "83": "مولاي يعقوب",
  "84": "بولمان",
  "85": "ميسور",
  "86": "رباط الخير",
  "87": "المنزل بني يازغة",
  "88": "إموزار كندر",
  "89": "تازة",
  "90": "تاونات",
  "91": "أكنول",
  "92": "تيزي وسلي",
  "93": "بورد",
  "94": "تاهلة",
  "95": "تيسة",
  "96": "قرية با محمد",
  "97": "كتامة",
  "98": "واد أمليل",
  "99": "مكناس",
  "100": "يفرن",
  "101": "الحاجب",
  "102": "زرهون",
  "103": "آزرو",
  "104": "مراكش",
  "105": "قلعة السراغنة",
  "106": "الصويرة",
  "107": "شيشاون",
  "108": "بنجرير",
  "109": "الرحامنة",
  "110": "تمنار",
  "111": "آسفي",
  "112": "الوليدية",
  "113": "اليوسفية",
  "114": "تسلطانت",
  "115": "تامصلوحت",
  "116": "قطارة",
  "117": "أكادير",
  "118": "تارودانت",
  "119": "تزنيت",
  "120": "إغرم",
  "121": "تالوين",
  "122": "تافراوت",
  "123": "طاطا",
  "124": "أقا",
  "125": "فم لحصن",
  "126": "بويكرة",
  "127": "أولاد تايمة",
  "128": "الرشيدية",
  "129": "الريصاني",
  "130": "أرفود",
  "131": "تنديت",
  "132": "كلميمة",
  "133": "إملشيل",
  "134": "تنجداد",
  "135": "الريش",
  "136": "ميدلت",
  "137": "زاكورة",
  "138": "ورزازات",
  "139": "تنغير",
  "140": "هسكورة",
  "141": "قلعة مكونة",
  "142": "أكدز",
  "143": "بومالن دادس",
  "144": "النيف",
  "145": "أسول",
  "146": "أمسمرير",
  "147": "تازارين",
  "148": "سيدي إفني",
  "149": "كلميم",
  "150": "أسا",
  "151": "الزاك",
  "152": "طانطان",
  "153": "بويزكارن",
  "154": "المحبس",
  "155": "لمسيد",
  "156": "العيون",
  "157": "السمارة",
  "158": "بوجدور",
  "159": "طرفاية",
  "160": "تفاريتي",
  "161": "بوكراع",
  "162": "كلتة زمور",
  "163": "أمكالة",
  "164": "أخفنير",
  "165": "الداخلة",
  "166": "الكويرة",
  "167": "أوسرد",
  "168": "بئر كندوز",
  "169": "بئر أنزاران",
  "170": "خميس سيدي عبد الجليل",
  "171": "أولاد عياد",
  "172": "تاهلة",
  "173": "مطماطة",
  "174": "إيمنتانوت",
  "175": "سيدي غانم",
  "176": "تفنتان",
  "177": "آيت القاق",
  "178": "أكدال أملشيل",
  "179": "اكودال املشيل ميدلت",
  "180": "أكايوار",
  "181": "عين العودة",
  "182": "أسكين",
  "183": "آيت ورير",
  "184": "زاوية مولاي ابراهيم",
  "185": "تولكولت",
  "186": "إيكس",
  "187": "كرس",
  "188": "تيسنت",
  "189": "فم زكيد",
  "190": "قصر إيش",
  "191": "إيمين ثلاث"
};
let handler = async (m, { conn, command, text }) => {
 if (command === 'salatm'){ if (!text) {
let citiesList = `أدخل رقم المدينة، مثال:\n.${command} 58\n\n*قائمة المدن وأرقامها:*\n\n`;
for (const [code, cityName] of Object.entries(cities)) {
  citiesList += `${code}: ${cityName}\n`;
}
m.reply(citiesList);
return;
  }
  const city = text.trim();

  if (!cities[city]) {
return m.reply("المدينة غير مدعومة. الرجاء اختيار مدينة أخرى من القائمة.");
  }

  const cityCode = cities[city];

  const VALUES = [
"day_name",
"arabic_month",
"month",
"fajr",
"chorouq",
"dohr",
"asr",
"maghrib",
"ishae",
  ];

  const M1 = "https://habous-gov-ma.translate.goog/prieres/horaire_hijri_2.php?ville=";
  const M2 = "&_x_tr_sl=auto&_x_tr_tl=ar&_x_tr_hl=ar&_x_tr_pto=wapp";
  const getMonthlyPrayers = async (city) => {
const cityCode = encodeURIComponent(city); // ترميز اسم المدينة
try {
  const data = await axios.get(`${M1}${cityCode}${M2}`).then((res) => res.data);
  return mapResponseToMonthlyPrayers(data);
} catch (error) {
  console.error("حدث خطأ أثناء جلب أوقات الصلاة:", error);
  return null;
}
  };

  const mapResponseToMonthlyPrayers = (data) => {
const dom = new JSDOM(data);
const items = dom.window.document.querySelectorAll("#horaire > tbody > tr");
const prayersData = Array.from(items).map((item) => {
  const result = {};
  const children = Array.from(item.children);
  VALUES.forEach((value, i) => {
if (i === 2) {
  result[value] = children[2].textContent.trim();
} else {
  result[value] = children[i].textContent.trim();
}
  });
  return result;
});
return prayersData;
  };

   getMonthlyPrayers(city)
   .then((prayersData) => {
 if (prayersData) {
   let prersData = prayersData[0].month;
   if (prersData.length > 0) {
 let parts = prersData.split(' / ');
 let firstPart, secondPart;
 if (parts.length === 2) {
   firstPart = parts[0].trim();
   secondPart = parts[1].trim();
 }
 let message = `🕌 أوقات الصلاة في مدينة *${cityCode}* لشهر *${prayersData[0].arabic_month.replace("الآخر", "الثاني")}*:\n\n`;
 let site = global.site

 prayersData.slice(1).forEach((prayer, index) => {
 let month; // تعريف المتغير هنا

 if (parseInt(prayer.month) >= (index + 1)) {
 month = firstPart;
 } else {
 month = secondPart;
 }
 let prayerMessage = `🗓️ *${prayer.day_name}: ${prayer.arabic_month} ${prayersData[0].arabic_month.replace("الآخر", "الثاني")} - ${prayer.month} ${month}*\n`;
 prayerMessage += `🕔 الفجر: ${prayer.fajr}🕐 الظهر: ${prayer.dohr}\n`;
 prayerMessage += `🕟 العصر: ${prayer.asr}🕗 المغرب: ${prayer.maghrib}\n`;
 prayerMessage += `🕗 العشاء: ${prayer.ishae}\n\n`;
 message += prayerMessage;
 });

 message += site; // يتم إضافة المتغير `site` إلى نهاية الرسالة
 m.reply(message);

  } else {
m.reply("حدث خطأ أثناء جلب أوقات الصلاة.");
  }
}})
.catch((error) => {
  console.error("حدث خطأ أثناء جلب أوقات الصلاة:", error);
  m.reply("حدث خطأ أثناء جلب أوقات الصلاة.");
});} else if(command === 'salatn') {
   try {
 // استخراج عنوان الموقع من النص الذي أدخله المستخدم
 const address = text.trim();
   if (!text) {
 return m.reply("يرجى إدخال اسم المدينة بعد الأمر، مثال: \n.salat casablanca");
   };
 // استخدام مكتبة moment للحصول على تاريخ اليوم بالتنسيق الصحيح
 const date = moment().format('DD-MM-YYYY');

 // URL لاسترداد معلومات أوقات الصلاة من API
 const apiUrl = `https://api.aladhan.com/v1/timingsByAddress/${date}?address=${address}&method=16`;

 // جلب المعلومات من API
 const response = await fetch(apiUrl);
 const data = await response.json();

 if (data && data.data) {
   const currentDay = data.data.date.hijri.day; // اليوم الحالي
   const previousDay = currentDay - 1;
 const prayerTimes = data.data.timings;
 const location = data.data.meta.address;
 const gregorianDate = data.data.date.gregorian.date;
 const hijriDate = data.data.date.hijri.weekday.ar + " " + previousDay + " " + data.data.date.hijri.month.ar + " " + data.data.date.hijri.year;
 const teks = `🕌 *أوقات الصلاة في ${text} بتاريخ ${date}:*\n\n🕔 الفجر: ${prayerTimes.Fajr}\n🕖 الشروق: ${prayerTimes.Sunrise}\n🕐 الظهر: ${prayerTimes.Dhuhr}\n🕟 العصر: ${prayerTimes.Asr}\n🕗 المغرب: ${prayerTimes.Maghrib}\n🕗 العشاء: ${prayerTimes.Isha}

   🗓️ *التاريخ الميلادي:* ${gregorianDate}
   🗓️ *التاريخ الهجري:* ${hijriDate} `;

 await conn.reply(m.chat, teks, m);
 } else {
 await conn.reply(m.chat, 'لم يتم العثور على أوقات الصلاة', m);
 }
   } catch (e) {
 console.error(e);
 await conn.reply(m.chat, 'حدث خطأ أثناء تنفيذ الأمر', m);
   }
}
};

handler.help = ["salah"];
handler.tags = ["internet"];
handler.command = /^(salatn|slat|صلاة|salatm)$/i;

export default handler;