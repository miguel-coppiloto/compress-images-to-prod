const compress_images = require("compress-images");
const fs = require('fs');
const path = require('path');
const clc = require('cli-color');

const INPUT_path = "../webpage/dist/webpage/assets/images/";
const INPUT_path_to_your_images = INPUT_path + "**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
const OUTPUT_path = "../webpage/dist/webpage/assets/images-opts/";

if (fs.existsSync(INPUT_path)) {
    if (fs.existsSync(OUTPUT_path)) {
        rimraf(OUTPUT_path);
        comprimeImagenes();
    } else {
        comprimeImagenes();
    }
} else {
    console.log(clc.red(`No existe carpeta de imagenes (${INPUT_path}). Proceso abortado.`));
}


/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
 function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}
function comprimeImagenes() {
    compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "80"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (error, completed, statistic) {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");

            if (completed && fs.existsSync(INPUT_path)) {
                rimraf(INPUT_path);
                fs.renameSync(OUTPUT_path, INPUT_path);
            }
        }
    );
}
