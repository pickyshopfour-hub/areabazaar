const fs = require('fs');

['betasup/index.html', 'thriftz/index.html', 'uwanbuy/index.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let pos = 0;
  let idx = 0;
  while (true) {
    const sStart = content.indexOf('<script', pos);
    if (sStart === -1) break;
    const tagEnd = content.indexOf('>', sStart);
    const tag = content.substring(sStart, tagEnd + 1);
    const sEnd = content.indexOf('</script>', tagEnd);
    pos = sEnd + 9;
    
    if (tag.includes('src=') || tag.includes('type="application/json"')) continue;
    const code = content.substring(tagEnd + 1, sEnd);
    idx++;
    try {
      new Function(code);
      console.log(`${f} inline script #${idx}: Valid JS syntax.`);
    } catch (e) {
      console.error(`${f} inline script #${idx} SYNTAX ERROR:`, e.message);
    }
  }
});

