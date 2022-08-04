const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
// const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminGifsicle = require('imagemin-gifsicle')

async function optimize(file) {
    var ar = file.split('/')
    ar.pop()
    var dest = ar.join('/')
    // console.log(dest)

    await imagemin([file], {
        destination: dest,
        plugins: [
            imageminGifsicle({
                optimizationLevel: 2,
            }),
            imageminMozjpeg({
                quality: 80,
            }),
            imageminPngquant({
                quality: [0.6, 0.8],
            }),
        ],
    })
    console.log(file + ' -> Optimized!')
}

function nextOptimize(pattern) {
    if (!pattern) pattern = '../public/**/*.{jpg,jpeg,png,gif}'
    glob(pattern, function (err, files) {
        files.forEach(async (file) => await optimize(file))
    })
}

// var assetPath = process.env.ASSET_PATH
// console.log(assetPath)
// if(assetPath) nextOptimize(assetPath)

nextOptimize()

// module.exports = nextOptimize
