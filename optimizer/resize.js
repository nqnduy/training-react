const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const fs = require('fs')
// const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminGifsicle = require('imagemin-gifsicle')
const sharp = require('sharp')
const mkdir = require('mkdirp')

async function compress(file) {
    let ar = file.split('/')
    let filename = ar.pop()
    let dest = ar.join('/')
    // remove "/public"
    ar.shift()
    ar.shift()

    let relativeDest = ar.join('/')

    let lowDest = '../public/low/' + relativeDest
    // console.log(dest)

    let originalFileSize = getFilesizeInBytes(file)

    // resize
    let lowDestFile = `${lowDest}/${filename}`
    // console.log("lowDest", lowDest);
    // create directories:
    await mkdir(lowDest, { recursive: true })

    // console.log("file", file);
    let meta = await sharp(file).metadata()
    // console.log("meta", meta);
    // process.exit(1);

    await sharp(file)
        .resize(Math.round(meta.width / 4))
        .toFile(lowDestFile)

    // compress
    await imagemin([lowDestFile], {
        destination: lowDest,
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

    // GENERATE MEDIUM PHOTOS

    let mediumDest = '../public/medium/' + relativeDest
    // console.log(dest)

    let originalFileSize = getFilesizeInBytes(file)

    // resize
    let mediumDestFile = `${mediumDest}/${filename}`
    // console.log("lowDest", lowDest);
    // create directories:
    await mkdir(mediumDest, { recursive: true })

    // console.log("file", file);
    let meta = await sharp(file).metadata()
    // console.log("meta", meta);
    // process.exit(1);

    await sharp(file)
        .resize(Math.round(meta.width / 4))
        .toFile(mediumDestFile)

    // compress
    await imagemin([mediumDestFile], {
        destination: mediumDest,
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

    // let compressedFileSize = getFilesizeInBytes(file);
    // let reduceRatio = Math.round((1 - compressedFileSize / originalFileSize) * 10000) / 100;
    // console.log(`Compressed: "${file}" -> [${originalFileSize} KB] to [${compressedFileSize} KB] -> [${reduceRatio}%]`);

    // process.exit(1);
}

function getFilesizeInBytes(filepath) {
    var stats = fs.statSync(filepath)
    var fileSizeInBytes = stats.size
    let fileSizeInKylobytes = fileSizeInBytes / 1024
    // var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInKylobytes
}

function nextOptimize(pattern) {
    if (!pattern) pattern = '../public/**/*.{jpg,jpeg,png,gif}'
    glob(pattern, function (err, files) {
        files.forEach(async (file) => {
            try {
                await compress(file)
            } catch (e) {}
        })
    })
}

// var assetPath = process.env.ASSET_PATH
// console.log(assetPath)
// if(assetPath) nextOptimize(assetPath)

nextOptimize()

// module.exports = nextOptimize
