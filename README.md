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

Check `frames/` for your pngs. You can use FFMPEG to convert the pngs into .mp4:

    ffmpeg -r 60 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p -b:v 4096k output.mp4