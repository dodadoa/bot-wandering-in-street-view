const { openBrowser, goto, $, dragAndDrop, closeBrowser, click, press, waitFor } = require('taiko');

(async () => {
  try {
    await openBrowser({ headless: false })
    await goto("https://www.google.co.th/maps/@18.7905292,98.9863039,17.97z")
    let enterStreetView = false;
    while(true) {

      while(!enterStreetView) {
        const up = Math.floor(Math.random() * 1000) + 100
        // const down = Math.floor(Math.random() * 1000)
        const left = Math.floor(Math.random() * 1000) + 500
        // const right = Math.floor(Math.random() * 1000)
        await dragAndDrop($(".widget-expand-button-pegman-icon"), { up, left })
        await waitFor(1000)
        enterStreetView = await $(".widget-titlecard-exitcontainer").exists()
      }

      for(let i = 0; i < 5; i++){
        const x = Math.floor(Math.random() * 1000) + 300
        const y = Math.floor(Math.random() * 1000) + 100
        await click({x,y})
        await waitFor(1000)
        await press(['ArrowLeft'], { delay: 1000 })
      }

      await waitFor(500)

      enterStreetView = false
      await click($(".widget-titlecard-exitcontainer"))
    }
  } catch (error) {
      console.error(error);
  } finally {
      await closeBrowser();
  }
})();
