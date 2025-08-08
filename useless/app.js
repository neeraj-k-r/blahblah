const stopwords = new Set(["the","is","in","at","of","a","and","to","it","for","on","with","as","this","that","by","an"]);

function tokenizeWords(text) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(w => w && !stopwords.has(w));
}

function sentenceSplit(text) {
  return text.match(/[^.!?]+[.!?]+/g) || [text];
}

function generateQuestionsFromText(text, count) {
  const sentences = sentenceSplit(text);
  const questions = sentences.map(s => `What is ${s.trim().replace(/[.!?]$/, "?")}`);
  return questions.slice(0, count);
}

function generateFlashcardsFromText(text, count) {
  const sentences = sentenceSplit(text);
  const flashcards = sentences.map(s => {
    const words = tokenizeWords(s);
    const term = words[0] || "";
    return { q: `Define: ${term}`, a: s.trim() };
  });
  return flashcards.slice(0, count);
}

document.getElementById('genQ').addEventListener('click', () => {
  const text = document.getElementById('content').value;
  const count = parseInt(document.getElementById('count').value);
  const out = generateQuestionsFromText(text, count);
  displayOutput(out.map(q => ({ q, a: '' })));
});

document.getElementById('genF').addEventListener('click', () => {
  const text = document.getElementById('content').value;
  const count = parseInt(document.getElementById('count').value);
  const out = generateFlashcardsFromText(text, count);
  displayOutput(out);
});

document.getElementById('clear').addEventListener('click', () => {
  document.getElementById('content').value = '';
  document.getElementById('output').innerHTML = '';
});

function displayOutput(items) {
  const container = document.getElementById('output');
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<div class="q">${item.q}</div>${item.a ? `<div class="a">${item.a}</div>` : ''}`;
    container.appendChild(div);
  });
}

document.getElementById('downloadTxt').addEventListener('click', () => {
  const text = document.getElementById('output').innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

document.getElementById('printPdf').addEventListener('click', () => {
  window.print();
});

document.getElementById('file').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('content').value = ev.target.result;
  };
  reader.readAsText(file);
});