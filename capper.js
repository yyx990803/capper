var Capper = (function () {
    
    var capping   = false,
        pinging   = false,
        uiInited  = false,
        initiated = false,
        canvas    = null,
        el,
        dot

    function toggle () {
        if (!capping) {
            start()
        } else {
            stop()
        }
    }

    function start () {
        if (!canvas || pinging || capping) return
        pinging = true
        pingServer(function () {
            capping = true
            pinging = false
            if (uiInited) dot.style.backgroundColor = '#F44'
            // sendFrame()
        })
    }

    function stop () {
        capping = false
        if (uiInited) dot.style.backgroundColor = '#999'
    }

    function pingServer (onload) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'http://localhost:7777/reset', true)
        xhr.send()
        xhr.onload = onload
        xhr.onerror = onError
    }

    function sendFrame (cb) {
        if (!capping || !canvas) return
        console.log('sending frame')
        var url = canvas.toDataURL("image/png"),
            xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://localhost:7777', true)
        xhr.send(url.slice(22))
        xhr.onerror = onError
        if (cb) xhr.onload = cb
    }

    function onError () {
        stop()
        console.warn('Something went wrong on the server.')
    }

    function applyStyle (el, style) {
        for (var key in style) {
            el.style[key] = style[key]
        }
    }

    function initUI () {

        if (uiInited) return
        uiInited = true

        el = document.createElement('div')
        dot = document.createElement('div')

        applyStyle(el, {
            position: 'absolute',
            bottom: '14px',
            right: '14px',
            width: '50px',
            height: '50px',
            borderRadius: '4px',
            backgroundColor: '#eee',
            cursor: 'pointer',
            border: '1px solid #ccc'
        })

        applyStyle(dot, {
            width: '24px',
            height: '24px',
            margin: '13px',
            backgroundColor: '#777',
            borderRadius: '100%',
            transition: 'background-color .25s ease',
            boxShadow: '0 1px 8px rgba(0,0,0,.3)'
        })

        el.addEventListener('click', toggle)
        el.appendChild(dot)
        document.body.appendChild(el)
    }

    var api = {

        start     : start,
        stop      : stop,

        init: function (opts) {
            if (initiated) return
            // set canvas
            var c = opts.canvas
            if (!c) throw new Error('Capper: you need to give me a canvas.')

            canvas = canvas = typeof c === 'string'
                ? document.querySelector(c)
                : c

            if (opts.ui) initUI()
            initiated = true
        },

        wrap: function (loop) {
            return function go () {
                loop()
                sendFrame(go)
            }
        },

        wrapRAF: function (raf) {
            return function (fn) {
                if (!capping) raf(fn)
            }
        }
    }

    return api

})()