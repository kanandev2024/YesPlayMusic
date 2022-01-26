// copy from https://github.com/sl1673495/vue-netease-music/blob/master/src/utils/lrcparse.js

export function lyricParser(lrc) {
  return {
    lyric: parseLyric(lrc?.lrc?.lyric || ''),
    tlyric: parseLyric(lrc?.tlyric?.lyric || ''),
    lyricuser: lrc.lyricUser,
    transuser: lrc.transUser,
  };
}

const extractTimeRegex = /^(?<rawTime>\[(?<min>\d+):(?<sec>\d+)(?:\.|:)(?<ms>\d+)\])\s*(?<content>(.+|))$/;

function parseLyric(lrc) {
  const lyrics = lrc.trim().split('\n');

  const parsedLyrics = lyrics
    .filter(lyric => lyric.length) // filter the lyric line which is empty
    .map((/** @type {string} */ line) => {
      try {
        const extractedLyric = extractTimeRegex.exec(line);

        // If this line is not a lyric.
        if (!extractedLyric) throw 'This line is not a lyric.';

        // Otherwise, we extract the lyric part.
        const { rawTime, min, sec, ms, content } = extractedLyric.groups;
        const time = Number(min) * 60 + Number(sec) + 0.01 * Number(ms);

        return {
          time,
          rawTime,
          content: trimContent(content),
        };
      } catch (e) {
        console.warn(`Failed to extract "${line}". ${e}`);
      }
    })
    .filter(response => !!response) // remove "undefined" entries
    .sort((a, b) => a.time - b.time);

  return parsedLyrics;
}

function trimContent(content) {
  let t = content.trim();
  return t.length < 1 ? content : t;
}
