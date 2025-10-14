(function (root) {
  if (!root.MDify) root.MDify = {};
  const app = root.MDify;

  function splitTwitterThread(text) {
    if (text === null) return "";
    if (text === undefined) return "";
    if (text === "") return "";
    const tokens = text.match(/\S+|\s+/g);
    if (!tokens) return text;
    const limit = 240;
    const tweets = [];
    let chunk = "";
    for (const token of tokens) {
      const tokenLength = token.length;
      if (tokenLength > limit) {
        if (chunk !== "") {
          tweets.push(chunk);
          chunk = "";
        }
        let offset = 0;
        while (offset < tokenLength) {
          const slice = token.slice(offset, offset + limit);
          tweets.push(slice);
          offset += limit;
        }
        continue;
      }
      if (chunk === "") {
        chunk = token;
        continue;
      }
      const candidate = chunk + token;
      const candidateLength = candidate.length;
      if (candidateLength <= limit) {
        chunk = candidate;
        continue;
      }
      tweets.push(chunk);
      chunk = token;
    }
    if (chunk !== "") tweets.push(chunk);
    if (tweets.length === 0) return "";
    const separator = "\n\n---\n\n";
    return tweets.join(separator);
  }

  app.splitTwitterThread = splitTwitterThread;
})(typeof globalThis === "undefined" ? window : globalThis);
