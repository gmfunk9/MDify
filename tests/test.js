const assert = require('assert');
const funcs = require('../script.js');

function run() {
  assert.strictEqual(funcs.replaceDash('a—b—c'), 'a - b - c');

  const dashGuard = funcs.replaceDash('2010–2015 — range\n- bullet — detail');
  assert.strictEqual(dashGuard, '2010-2015 - range\n- bullet: detail');

  const cleaned = funcs.trimBlank('a\n \n\nb\n');
  assert.strictEqual(cleaned, 'a\nb');

  const noComments = funcs.stripComments('a/*x*/b');
  assert.strictEqual(noComments, 'ab');
  const inline = funcs.stripComments('code // dev note\n# shell note\n{{ remove }}active');
  assert.strictEqual(inline, 'code \n\nactive');

  assert.strictEqual(funcs.countSyllables('testing'), 2);

  const stats = funcs.stats('Hello world. This is a test.');
  assert(stats.startsWith('Words: 6\nChars: 28'));

  const asc = funcs.sortLinesAsc('b\na\nc\nb');
  assert.strictEqual(asc, 'a\nb\nc');

  const desc = funcs.sortLinesDesc('b\na\nc\nb');
  assert.strictEqual(desc, 'c\nb\na');

  const firstTweet = 'First line\nSecond line ';
  const secondTweet = 'B'.repeat(220);
  const separator = '\n\n---\n\n';
  const threadInput = `${firstTweet}${secondTweet}`;
  const thread = funcs.splitTwitterThread(threadInput);
  assert(thread.includes(separator));
  const tweets = thread.split(separator);
  assert.strictEqual(tweets.length, 2);
  assert.strictEqual(tweets[0], firstTweet);
  assert.strictEqual(tweets[1], secondTweet);
  assert(tweets[0].includes('\n'));

  console.log('All tests passed');
}

run();
