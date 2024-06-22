import similarity from 'similarity'
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return !0
  this.tekateki = this.tekateki ? this.tekateki : {}
  if (!(id in this.tekateki)) return m.reply('هذا السؤال قد انتهى بالفعل!')
  if (m.quoted.id == this.tekateki[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tekateki[id][1]))
    let userAnswer = m.text.trim()

    if (userAnswer === '1' && json.filename.toLowerCase().trim() === json.q1.toLowerCase().trim()) {
      // الإجابة صحيحة
      global.db.data.users[m.sender].exp += this.tekateki[id][2]
      m.reply(`✅ *إجابة صحيحة!*\n\n+${this.tekateki[id][2]} نقطة`)
      clearTimeout(this.tekateki[id][3])
      delete this.tekateki[id]
    } else if (userAnswer === '2' && json.filename.toLowerCase().trim() === json.q2.toLowerCase().trim()) {
      // الإجابة صحيحة
      global.db.data.users[m.sender].exp += this.tekateki[id][2]
      m.reply(`✅ *إجابة صحيحة!*\n\n+${this.tekateki[id][2]} نقطة`)
      clearTimeout(this.tekateki[id][3])
      delete this.tekateki[id]
    } else if (userAnswer === '3' && json.filename.toLowerCase().trim() === json.q3.toLowerCase().trim()) {
      // الإجابة صحيحة
      global.db.data.users[m.sender].exp += this.tekateki[id][2]
      m.reply(`✅ *إجابة صحيحة!*\n\n+${this.tekateki[id][2]} نقطة`)
      clearTimeout(this.tekateki[id][3])
      delete this.tekateki[id]
    } else if (userAnswer === '4' && json.filename.toLowerCase().trim() === json.q4.toLowerCase().trim()) {
      // الإجابة صحيحة
      global.db.data.users[m.sender].exp += this.tekateki[id][2]
      m.reply(`✅ *إجابة صحيحة!*\n\n+${this.tekateki[id][2]} نقطة`)
      clearTimeout(this.tekateki[id][3])
      delete this.tekateki[id]
    } else if (similarity(userAnswer.toLowerCase(), json.filename.toLowerCase().trim()) >= threshold) {
      m.reply(`*تأكد من كتابة الإجابة بالحروف الصحيحة!*`)
    } else {
      m.reply('❌ *إجابة خاطئة!*')
    }
  }
  return !0
}
export default handler
