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
    function findBoundary(candidate) {
      const max = Math.min(candidate.length, limit);
      if (max <= 0) return -1;
      const newlineIndex = candidate.lastIndexOf("\n", max - 1);
      if (newlineIndex !== -1) return newlineIndex + 1;
      const sentenceIndex = candidate.lastIndexOf(". ", max - 1);
      if (sentenceIndex === -1) return -1;
      return sentenceIndex + 2;
    }
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
      const boundary = findBoundary(candidate);
      if (boundary === -1) {
        tweets.push(chunk);
        chunk = token;
        continue;
      }
      const part = candidate.slice(0, boundary);
      if (part !== "") tweets.push(part);
      chunk = candidate.slice(boundary);
      if (chunk === "") continue;
      while (chunk.length > limit) {
        const overflowBoundary = findBoundary(chunk);
        if (overflowBoundary === -1) {
          const slice = chunk.slice(0, limit);
          tweets.push(slice);
          chunk = chunk.slice(limit);
          if (chunk === "") break;
          continue;
        }
        const segment = chunk.slice(0, overflowBoundary);
        if (segment !== "") tweets.push(segment);
        chunk = chunk.slice(overflowBoundary);
        if (chunk === "") break;
      }
    }
    if (chunk !== "") tweets.push(chunk);
    if (tweets.length === 0) return "";
    const separator = "\n\n---\n\n";
    return tweets.join(separator);
  }

  app.splitTwitterThread = splitTwitterThread;
})(typeof globalThis === "undefined" ? window : globalThis);
