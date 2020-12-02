import { openBrowser, goto, $, dragAndDrop, closeBrowser, click, press, waitFor } from 'taiko'
import chalk from 'chalk'

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

      const url = await currentURL()
      const streetViewLocation = url.split("/")[4]
      const latLong = streetViewLocation.split(",").slice(0, 2)
      console.log(chalk.yellow(` ✔ we are at ${latLong}`))
      await screenshot({ fullPage:true, path: `images/${Date()}.png` })
      await waitFor(100)

      for(let i = 0; i < 5; i++){
        if(i === 4) {
          await screenshot({ fullPage:true, path: `images/${Date()}.png` })
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
