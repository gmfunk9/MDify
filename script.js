const turndown = new TurndownService();
const switcher = document.querySelector('.theme_switcher');
if (switcher) {
  switcher.addEventListener('click', () => {
    document.body.classList.toggle('dark_theme');
  });
}

function attach(id, fn) {
  const box = document.getElementById(id);
  if (!box) return;
  const input = box.querySelector('.in');
  if (!input) return;
  const output = box.querySelector('.out');
  if (!output) return;
  input.addEventListener('input', () => {
    output.value = fn(input.value);
  });
  if (output.tagName === 'PRE') {
    input.addEventListener('input', () => {
      output.textContent = fn(input.value);
    });
  }
}

function replaceDash(t) {
  return t.replace(/—/g, '; ');
}

function trimBlank(t) {
  return t.split('\n').filter(l => !/^\s*$/.test(l)).join('\n');
}

function stripComments(t) {
  return t.replace(/\/\*[\s\S]*?\*\//g, '');
}

function mdToRich(t) {
  return marked.parse(t);
}

function richToMd(t) {
  return turndown.turndown(t);
}

function htmlToMd(t) {
  return turndown.turndown(t);
}

function mdToHtml(t) {
  return marked.parse(t);
}

function countSyllables(w) {
  const m = w.toLowerCase().match(/[aeiouy]+/g);
  if (!m) return 1;
  return m.length;
}

function stats(t) {
  const words = t.match(/\b\w+\b/g) || [];
  const chars = t.length;
  const sentences = t.split(/[.!?]+/).filter(s => s.trim()).length;
  const paras = t.split(/\n\s*\n/).filter(p => p.trim()).length;
  let syllables = 0;
  for (const w of words) syllables += countSyllables(w);
  const wps = words.length / Math.max(sentences, 1);
  const spw = syllables / Math.max(words.length, 1);
  const reading = 206.835 - 1.015 * wps - 84.6 * spw;
  const readTime = words.length / 200;
  const speakTime = words.length / 130;
  const freq = {};
  const stops = ['the','and','a','to','of','in','is','it','that','for'];
  for (const w of words) {
    const x = w.toLowerCase();
    if (stops.includes(x)) continue;
    freq[x] = (freq[x] || 0) + 1;
  }
  const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,10);
  let dens = '';
  for (const [k,v] of sorted) dens += `${k}: ${v} (${(v/words.length*100).toFixed(1)}%)\n`;
  return `Words: ${words.length}\nChars: ${chars}\nSentences: ${sentences}\nParagraphs: ${paras}\nRead min: ${readTime.toFixed(2)}\nSpeak min: ${speakTime.toFixed(2)}\nFlesch: ${reading.toFixed(1)}\n${dens}`;
}

function sortLinesAsc(t) {
  const lines = Array.from(new Set(t.split('\n')));
  lines.sort((a,b) => a.localeCompare(b));
  return lines.join('\n');
}

function sortLinesDesc(t) {
  const lines = Array.from(new Set(t.split('\n')));
  lines.sort((a,b) => b.localeCompare(a));
  return lines.join('\n');
}

attach('dash_box', replaceDash);
attach('blank_box', trimBlank);
attach('comment_box', stripComments);
attach('md_to_rich', mdToRich);
attach('rich_to_md', richToMd);
attach('html_to_md', htmlToMd);
attach('md_to_html', mdToHtml);
attach('stat_box', stats);

function initSortBox() {
  const sortBox = document.getElementById('sort_box');
  if (!sortBox) return;
  const toggle = sortBox.querySelector('.sort_toggle');
  if (!toggle) return;
  const input = sortBox.querySelector('.in');
  if (!input) return;
  const output = sortBox.querySelector('.out');
  if (!output) return;
  let desc = false;
  toggle.addEventListener('click', () => {
    desc = !desc;
    toggle.textContent = desc ? 'Desc' : 'Asc';
    output.value = desc ? sortLinesDesc(input.value) : sortLinesAsc(input.value);
  });
  input.addEventListener('input', () => {
    output.value = desc ? sortLinesDesc(input.value) : sortLinesAsc(input.value);
  });
}

initSortBox();

