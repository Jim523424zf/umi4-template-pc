const fs = require("fs");
const { resolve } = require("path");
const opentype = require("opentype.js");
const Fontmin = require("fontmin");

/**
 * 获取TTF字体包含的所有[字符]和[编码]
 */
function getTTF(fontPath) {
  if (!fontPath) {
    throw new Error("请传入字体文件路径");
  }

  // 读取字体文件
  const fontBuffer = fs.readFileSync(fontPath);

  // 将 Buffer 转换为 ArrayBuffer
  const arrayBuffer = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);

  // 使用 DataView 创建字体对象
  const font = opentype.parse(arrayBuffer);

  // 获取字体包含的所有字符
  const characters = [];
  const unicode = [];
  for (const glyphIndex in font.glyphs.glyphs) {
    if (font.glyphs.glyphs.hasOwnProperty(glyphIndex)) {
      const glyph = font.glyphs.glyphs[glyphIndex];
      if (glyph.unicode !== undefined) {
        unicode.push("U+" + glyph.unicode.toString(16));
        characters.push(String.fromCodePoint(glyph.unicode));
      }
    }
  }

  // const outputPath = resolve(__dirname, "characters.txt");
  // const outputUnicodePath = resolve(__dirname, "unicodes.txt");
  // fs.writeFileSync(outputPath, characters.join(""));
  // fs.writeFileSync(outputUnicodePath, unicode.join(","));

  return { characters, unicode };
}

const zhHanSourcePath = [
  resolve(__dirname, "通用规范汉字表", "一级字表.txt"),
  resolve(__dirname, "通用规范汉字表", "二级字表.txt"),
  resolve(__dirname, "通用规范汉字表", "三级字表.txt"),
];

/**
 * 获取简体汉字所有[字符]和[编码]
 */
function getZhHan() {
  const zhHanCharacters = [];
  const zhHanUnicode = [];
  zhHanSourcePath.forEach((path) => {
    const zhHanSource = fs.readFileSync(path, "utf-8");
    const zhHanSourceArray = zhHanSource.split("\n");
    zhHanSourceArray.forEach((item) => {
      if (item.indexOf(":") === -1) {
        return;
      }
      const zhHan = item.split(" ")[1].trimEnd("\n");
      zhHanCharacters.push(zhHan);
      zhHanUnicode.push("U+" + zhHan.codePointAt(0).toString(16));
    });
  });

  // const zhHanTargetPath = resolve(__dirname, "通用规范汉字表", "zh-han.txt");
  // const zhHanCodeTargetPath = resolve(__dirname, "通用规范汉字表", "zh-han-unicode.txt");
  // fs.writeFileSync(zhHanTargetPath, zhHanCharacters.join(""), "utf-8");
  // fs.writeFileSync(zhHanCodeTargetPath, zhHanUnicode.join(","), "utf-8");

  return {
    zhHanCharacters,
    zhHanUnicode,
  };
}

/**
 * 字体包转换成 ttf woff woff2
 */
function transformFont(fontPath, outputPath) {
  if (!fontPath || !outputPath) {
    throw new Error("fontPath or outputPath is null");
  }
  const promise = (resolve, reject) => {
    const fontmin = new Fontmin()
      .src(fontPath) // 指定输入的字体文件路径
      .dest(outputPath) // 指定输出目录
      .use(Fontmin.otf2ttf());
    // .use(Fontmin.ttf2woff())
    // .use(Fontmin.ttf2woff2());

    fontmin.run((err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  };
  return new Promise(promise);
}

module.exports = {
  getTTF,
  getZhHan,
  transformFont,
};
