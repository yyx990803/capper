# Capper

Export canvas animations to png frames.

## Usage

1. You need to have [Node.js](http://nodejs.org/) v0.10+ installed.
2. Start the capture server with `node server.js`
3. Include `capper.js` in the page the canvas is in.

In your page you need to do a few things:

``` js
// your animate loop probably should look like this,
// in mose cases you don't have to modify anything inside.
function animate () {
    requestAnimationFrame(animate)
    render()
}

// init Capper
Capper.init({
    canvas : '#canvas', // can be a selector or a node
    ui     : true       // whether to show a record button
})

// wrap the raf, so we can skip it while recording
window.requestAnimationFrame = Capper.wrapRAF(window.requestAnimationFrame)

// wrap your main animation loop
animate = Capper.wrap(animate)

// start the animation as usual
animate()
```

Now you can just click the record button to start/stop capturing frames. Or you can use `Capper.start()` and `Capper.stop()`.


Check `frames/` for your pngs. You can use FFMPEG to convert the pngs into .mp4:

    ffmpeg -r 60 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p -b:v 4096k output.mp4