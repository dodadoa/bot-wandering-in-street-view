import { openBrowser, goto, $, dragAndDrop, closeBrowser, click, press, waitFor } from 'taiko'
import chalk from 'chalk'
import execa from 'execa'

const printing = async (toPrint) => {
  const { stdout } = await execa('lp', ['-o', 'fit-to-page', `"images/${toPrint}]"`])
  console.log(chalk.yellow(` ✔ printing ${stdout}`))
}

(async () => {
  try {
    await openBrowser({ headless: false, args: ["--start-fullscreen"] })
    await goto("https://www.google.co.th/maps/@18.7905292,98.9863039,17.97z")
    let enterStreetView = false;
    while(true) {
      while(!enterStreetView) {
        const up = Math.floor(Math.random() * 1000) + 100
        const left = Math.floor(Math.random() * 1000) + 500
        await dragAndDrop($(".widget-expand-button-pegman-icon"), { up, left })
        await waitFor(100)
        enterStreetView = await $(".widget-titlecard-exitcontainer").exists()
      }

      for(let i = 0; i < 5; i++){
        // log the lat & long only the first time
        // printing first time and last time
        if(i === 0) {
          const url = await currentURL()
          const streetViewLocation = url.split("/")[4]
          const latLong = streetViewLocation.split(",").slice(0, 2)
          console.log(chalk.yellow(` ✔ we are at ${latLong}`))
          const toPrint = `${Date()}.png`
          await screenshot({ fullPage:true, path: `images/${toPrint}` })
          await printing(toPrint)
          await waitFor(100)
        }
        if(i === 4) {
          await screenshot({ fullPage:true, path: `images/${toPrint}` })
          await printint(toPrint)
          await waitFor(100)
        }

        const shouldBotTurnRandomNumber = Math.random()

        if (shouldBotTurnRandomNumber < 0.2) {
          await press(['ArrowLeft'], { delay: 1000 })
        } else if (shouldBotTurnRandomNumber > 0.2 && shouldBotTurnRandomNumber < 0.4) {
          await press(['ArrowRight'], { delay: 1000 })
        } else {
          const x = Math.floor(Math.random() * 800) + 300
          const y = Math.floor(Math.random() * 500) + 100
          await click({ x, y })
        }
      }

      await waitFor(100)
      enterStreetView = false
      await click($(".widget-titlecard-exitcontainer"))
    }
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
