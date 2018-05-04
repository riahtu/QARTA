import Nightmare from 'nightmare'
const nightmare = Nightmare()


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

Date.prototype.today = function () {
  return this.getFullYear() +"-"+ (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ ((this.getDate() < 10)?"0":"") + this.getDate()
}

Date.prototype.timeNow = function () {
  return ((this.getHours() < 10)?"0":"") + this.getHours() +"-"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +"-"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}



const start = async () => {
  await asyncForEach(paths, async (path) => {
    console.log('in first forEach')
    await asyncForEach(domains, async (domain) => {
      try {
        screenshot(domain, path)
      } catch(error) {
        console.log('ERRORRRR')
      }
    })
    console.log('after looping through domains')
    // this is where we want to use blink-diff
  })
  console.log('after looping through paths - finished')
}

start()

async function screenshot(domain, path) {
  const nightmare = Nightmare()
  const pageUrl = `${domain.url}/${path}`
  const newDate = new Date()
  const timeStamp = `${newDate.today()}@${newDate.timeNow()}`

  const screenshotName = `${domain.nickname}_${path.replace(/\//g, '-')}_${timeStamp}`

  const dimensions = await nightmare.goto(pageUrl).evaluate(() => {
    const html = document.querySelector('html')
    return {
      height: html.scrollHeight + 100,
      width: html.scrollWidth,
    }
  })
  await nightmare
    .viewport(dimensions.width, dimensions.height)
    .screenshot(`./screenshots/${screenshotName}.png`)
  await nightmare
    .end(() => console.log('done'))
}