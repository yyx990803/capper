# Capper

Export canvas animations to png frames.

## Usage

1. You need to have Node.js v0.10+ installed.
2. Start the capture server with `node server.js`
3. Include `capper.js` in the page the canvas is in.

The API is really simple:
    
    // set the canvas with a selector string or the canvas element
    Capper.initCanvas('#canvas')

    // If you want a button on the page:
    Capper.initUI()

    // Or if you want to control it from javascript:
    Capper.start()
    Capper.stop()

Check `frames/` for your pngs.