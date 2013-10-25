/*
 *  Command to convert pngs to mp4 with ffmpeg:
 *  `ffmpeg -r 60 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p -b:v 4096k output.mp4`
 */

var http       = require('http'),
    fs         = require('fs'),
    base64     = require('./base64'),
    path       = __dirname + '/frames',
    frameCount = -1

if (!fs.existsSync(path)) fs.mkdirSync(path)

http.createServer(function (req, res) {

    allowCORS(res)

    if (req.url === '/reset') {
        console.log('reset')
        frameCount = -1
        return res.end('ok')
    }

    var s = Date.now()
    console.log('got frame')
    frameCount++
    if (frameCount === 0) return // somehow first frame is empty

    var writer = fs.createWriteStream(path + '/' + pad(frameCount) + '.png', {
        encoding: 'base64'
    })

    writer.on('finish', function () {
        console.log('saved frame ' + frameCount + ' (' + (Date.now() - s) + 'ms)')
        res.end('ok')
    })

    writer.on('error', function () {
        console.log('error on frame ' + frameCount)
        res.end('no')
    })
    
    req.pipe(base64()).pipe(writer)

}).listen(7777)

function pad (count) {
    count = count.toString()
    if (count.length === 1) {
        count = '00' + count
    } else if (count.length === 2) {
        count = '0' + count
    }
    return count
}

function allowCORS (res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}