(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function countSyllables(word) {
    const matches = word.toLowerCase().match(/[aeiouy]+/g);
    if (!matches) return 1;
    return matches.length;
  }

  function stats(text) {
    const wordsFound = text.match(/\b\w+\b/g);
    let words = [];
    if (wordsFound) words = wordsFound;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(function (item) {
      return item.trim() !== "";
    }).length;
    const paras = text.split(/\n\s*\n/).filter(function (item) {
      return item.trim() !== "";
    }).length;
    let syllables = 0;
    for (const word of words) syllables += countSyllables(word);
    const wps = words.length / Math.max(sentences, 1);
    const spw = syllables / Math.max(words.length, 1);
    const reading = 206.835 - 1.015 * wps - 84.6 * spw;
    const readTime = words.length / 200;
    const speakTime = words.length / 130;
    const freq = {};
    const stops = ["the", "and", "a", "to", "of", "in", "is", "it", "that", "for"];
    for (const word of words) {
      const lower = word.toLowerCase();
      if (stops.indexOf(lower) !== -1) continue;
      if (!freq[lower]) freq[lower] = 0;
      freq[lower] = freq[lower] + 1;
    }
    const sorted = Object.entries(freq).sort(function (a, b) {
      return b[1] - a[1];
    }).slice(0, 10);
    let density = "";
    for (const pair of sorted) {
      const key = pair[0];
      const value = pair[1];
      const percent = (value / Math.max(words.length, 1)) * 100;
      density += key + ": " + value + " (" + percent.toFixed(1) + "%)\n";
    }
    return (
      "Words: " +
      words.length +
      "\nChars: " +
      chars +
      "\nSentences: " +
      sentences +
      "\nParagraphs: " +
      paras +
      "\nRead min: " +
      readTime.toFixed(2) +
      "\nSpeak min: " +
      speakTime.toFixed(2) +
      "\nFlesch: " +
      reading.toFixed(1) +
      "\n" +
      density
    );
  }

  app.countSyllables = countSyllables;
  app.stats = stats;
})(typeof globalThis === "undefined" ? window : globalThis);
