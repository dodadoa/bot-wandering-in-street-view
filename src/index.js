import { openBrowser, goto, $, dragAndDrop, closeBrowser, click, press, waitFor, currentURL } from 'taiko'
import chalk from 'chalk'
import execa from 'execa'
import gm from 'gm'

const printing = async (toPrint) => {
  if (process.env.ENVIRONMENT_DEV === 'pi') {
    const { stdout } = await execa('lp', ['-o', 'fit-to-page', `images/${toPrint}`])
    console.log(chalk.yellow(` ✔ printing ${stdout}`))
  }
}

const getLatLong = async () => {
  const url = await currentURL()
  const streetViewLocation = url.split("/")[4]
  const latLong = streetViewLocation.split(",").slice(0, 2)
  return latLong
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
          const latLong = await getLatLong()
          console.log(chalk.yellow(` ✔ we are at ${latLong}`))
          const toPrint = `${Date()}.png`
          await screenshot({ fullPage:true, path: `images/${toPrint}` })
          await gm(`images/${toPrint}`).resize(100)
            .noProfile()
            .write(`images/${toPrint}`, (err) => {
              if (!err) console.log(console.log(chalk.green(` ✔ resize images ${toPrint}`)));
            });
          await printing(toPrint)
          await waitFor(100)
        }
        if(i === 4) {
          const toPrint = `${Date()}.png`
          await screenshot({ fullPage:true, path: `images/${toPrint}` })
          await printing(toPrint)
          await waitFor(100)
        }

        const shouldBotTurnRandomNumber = Math.random()

        if (shouldBotTurnRandomNumber < 0.2) {
          await press(['ArrowLeft'], { delay: 1000 })
        } else if (shouldBotTurnRandomNumber > 0.2 && shouldBotTurnRandomNumber < 0.4) {
          await press(['ArrowRight'], { delay: 1000 })
        } else {
          const x = Math.floor(Math.random() * 800) + 300
          const y = Math.floor(Math.random() * 500) + 300
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
