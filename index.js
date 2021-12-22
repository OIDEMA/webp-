/* dependenciesのダウンロード */
const sharp = require('sharp');
const fs = require('fs');
const fsPromise = fs.promises;
const glob = require('glob');
const path = require('path');

/* 初期格納フォルダ */
const ORIGINAL_IMG_DIR = glob.sync('assets');

/* Webp返還後の格納フォルダ*/
const WEBP_IMG_DIR = 'replaced';

/**
 * 画像をWebP形式に変換
 * @param {string} imgPath 元画像のフルパス
 * @param {string} outputDir 出力先のディレクトリ
 * @param {string} outputFilePath 出力するファイルパス
 */
const changeWebpImages = (imgPath, outputFilePath) => {
  const fileName = outputFilePath.split('/').reverse()[0]; // 拡張子を含む画像ファイル名
  const imgName = fileName.split('.')[0]; // 拡張子を除く画像ファイル名

  sharp(imgPath)
    .webp({
      quality: 75
    })
    /* 第一引数がwidth, 第二引数がheight*/
    .resize({
      width: 540,
      height: 360
    })
    .toFile(`${imgName}.webp`, (err) => { // 画像ファイル名.webpで出力
      if ( err ) console.error(err);
      return;
    });
};

/**
 * 元画像のファイル情報を読み取ってWebPに変換する関数を実行
 */
 async function writeFiles() {
  const resolvedPath = path.resolve(`${ORIGINAL_IMG_DIR}`);
    fsPromise.readdir(resolvedPath)
      .then((files) => {
        files.forEach((file) => {
          changeWebpImages(`${resolvedPath}/${file}`, `${path.resolve(WEBP_IMG_DIR)}/${file}`);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

async function init() {
  await writeFiles();
}

init();