import Nightmare from 'nightmare'
import { compress } from './compressor'

export async function takeScreenshotPair(urls, pathObject, timestamp) {
  // at present, only two urls are allowed in config
  const screenshot1 = takeAndCompressScreenshot(urls[0], pathObject, timestamp)
  const screenshot2 = takeAndCompressScreenshot(urls[1], pathObject, timestamp)

  // send through imageOptim

  return {
    screenshot1: await screenshot1,
    screenshot2: await screenshot2,
  }
}

async function takeAndCompressScreenshot(urlObject, pathObject, timestamp) {
  const screenshotName = await screenshot(urlObject, pathObject, timestamp)
  await compress(screenshotName)
}

async function screenshot(urlObject, pathObject, timestamp) {
  const nightmare = Nightmare()
  const { url, name: urlName } = urlObject
  const { path, name: pathName } = pathObject
  const pageUrl = `${url}/${path}`
  const screenshotName = `${urlName}_${pathName}_${timestamp}`

  try {
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
      .end(() => console.log('screenshot taken: ', screenshotName))
  } catch(error) { throw error }

  return screenshotName
}