const { openBrowser, goto, $, dragAndDrop, closeBrowser, click, mouseAction, waitFor } = require('taiko');

(async () => {
  try {
    await openBrowser()
    await goto("https://www.google.co.th/maps/@18.8845604,100.1593356,8z")
    while(true) {
      const up = Math.floor(Math.random() * 1000) + 100
      const down = Math.floor(Math.random() * 1000)
      const left = Math.floor(Math.random() * 1000) + 500
      const right = Math.floor(Math.random() * 1000)

      if ($(".widget-expand-button-pegman-icon").exists()){
        await dragAndDrop($(".widget-expand-button-pegman-icon"), {up, left})
        await waitFor(2000)

        for(let i = 0; i < 5; i++){
          const x = Math.floor(Math.random() * 1000)
          const y = Math.floor(Math.random() * 1000)
          await click({x,y})
          await waitFor(1000)
  
          await mouseAction('press', { x: 800, y: 500 })
          await mouseAction('move', { x: 200, y: 500 })
          await mouseAction('release', { x: 200, y: 500 })
        }

        await waitFor(500)
      }

      if ($(".widget-titlecard-exitcontainer").exists()){
        await click($(".widget-titlecard-exitcontainer"))
      }
    }
  } catch (error) {
      console.error(error);
  } finally {
      await closeBrowser();
  }
})();
