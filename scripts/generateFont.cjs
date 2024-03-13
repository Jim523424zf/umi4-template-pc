const fs = require("fs");
const { resolve } = require("path");
const { getZhHan, getTTF, transformFont } = require("./font/utils.cjs");

const TEMP_FONTS = "temp/fonts";

transformFont(resolve(__dirname, "source", "DFHeiGB-W5-Proportiona.otf"), resolve(__dirname, TEMP_FONTS)).then(() => {
  const { zhHanCharacters, zhHanUnicode } = getZhHan();
  const { characters, unicode } = getTTF(resolve(__dirname, TEMP_FONTS, "DFHeiGB-W5-Proportiona.ttf"));

  const newCharacters = characters.filter((c) => zhHanCharacters.includes(c));
  const newUnicode = unicode.filter((c) => zhHanUnicode.includes(c));

  fs.writeFileSync(resolve(__dirname, TEMP_FONTS, "characters.txt"), newCharacters.join(""));
  fs.writeFileSync(resolve(__dirname, TEMP_FONTS, "unicode.txt"), newUnicode.join(","));

  // eslint-disable-next-line no-console
  console.log(
    `
  通过对比，筛选出字体包包含的简化字 temp/fonts/characters.txt
  请至下述网站转换woff文件:
  https://transfonter.org/`,
  );
});
