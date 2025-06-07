const md = new TurndownService();
const switcher = document.querySelector('.theme_switcher');
const input = document.getElementById('input_area');
const output = document.getElementById('output_area');

md.addRule('h1', {filter: 'h1', replacement: c => `# ${c}\n`});
md.addRule('h2', {filter: 'h2', replacement: c => `## ${c}\n`});

md.addRule('bold_text_style', {
  filter(node) {
    if (node.nodeName !== 'SPAN') return false;
    return node.style.fontWeight === 'bolder';
  },
  replacement: c => `**${c}**`
});

md.addRule('form', {
  filter: 'form',
  replacement: (c, n) => `\n## ${n.getAttribute('name') || 'Form'}\n${c.trim()}\n`
});

md.addRule('form_block', {
  filter: 'form',
  replacement: (c, n) => `\`\`\`form\n% #${n.getAttribute('name') || 'Form'}\n${c.trim()}\n\`\`\`\n`
});

md.addRule('input', {
  filter(node) {
    if (node.nodeName !== 'INPUT') return false;
    return node.type !== 'submit';
  },
  replacement: (c, n) => {
    const ph = n.getAttribute('placeholder');
    if (ph) return `::(${ph})\n`;
    return '::\n';
  }
});

md.addRule('select', {
  filter: 'select',
  replacement: (c, n) => {
    const labels = Array.from(n.querySelectorAll('option'))
      .map(o => o.textContent.trim())
      .join('|');
    return `::${labels}`;
  }
});

md.addRule('button', {
  filter(node) {
    if (node.nodeName !== 'BUTTON') return false;
    return node.type === 'submit';
  },
  replacement: (c, n) => {
    const form = n.form;
    if (form) {
      const url = form.getAttribute('action') || form.getAttribute('method') || '#';
      return `[■ ${c}](${url})\n`;
    }
    return `[■ ${c}](#)\n`;
  }
});

md.addRule('a_button', {
  filter(node) {
    if (node.nodeName !== 'A') return false;
    if (node.classList.contains('button')) return true;
    if (node.classList.contains('btn')) return true;
    if (node.classList.contains('elementor-button')) return true;
    return false;
  },
  replacement: (c, n) => `@[${c}](${n.getAttribute('href')})\n`
});

md.addRule('checkbox', {
  filter(node) {
    if (node.nodeName !== 'INPUT') return false;
    return node.type === 'checkbox';
  },
  replacement: (c, n) => `\n[${n.checked ? 'x' : ' '}] `
});

md.addRule('radio', {
  filter(node) {
    if (node.nodeName !== 'INPUT') return false;
    return node.type === 'radio';
  },
  replacement: (c, n) => `\n[${n.checked ? 'x' : ' '}] `
});

md.addRule('label', {
  filter(node) {
    return node.nodeName === 'LABEL';
  },
  replacement: c => `$${c}$\n`
});

input.addEventListener('DOMSubtreeModified', updateOutput);
input.addEventListener('input', updateOutput);
switcher.addEventListener('click', () => {
  document.body.classList.toggle('dark_theme');
});

function updateOutput() {
  output.value = md.turndown(input.innerHTML);
}
