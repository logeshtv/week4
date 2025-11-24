const API_BASE = 'https://poetrydb.org';

const authorsEl = document.getElementById('authors');
const resultsEl = document.getElementById('results');
const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');

function setLoading(target, msg = 'Loading…'){
  target.innerHTML = `<div class="poem">${msg}</div>`;
}

function renderError(msg){
  resultsEl.innerHTML = `<div class="poem"><strong>${msg}</strong></div>`;
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderPoems(list){
  if(!Array.isArray(list) || list.length === 0){
    resultsEl.innerHTML = '<div class="poem">No poems found.</div>';
    return;
  }

  resultsEl.innerHTML = list.slice(0,12).map(p => {
    const title = escapeHtml(p.title || 'Untitled');
    const author = escapeHtml(p.author || 'Unknown');
    const lines = escapeHtml((p.lines || []).join('\n'));
    return `
      <article class="poem">
        <h3>${title}</h3>
        <small>${author}</small>
        <pre>${lines}</pre>
      </article>
    `;
  }).join('');
}

async function fetchAuthors(){
  try{
    const res = await fetch(`${API_BASE}/author`);
    if(!res.ok) throw new Error('Failed to load authors');
    const data = await res.json();
    return data.authors || [];
  }catch(err){
    console.error(err);
    return [];
  }
}

async function fetchAuthor(name){
  const enc = encodeURIComponent(name);
  const res = await fetch(`${API_BASE}/author/${enc}`);
  if(!res.ok) return [];
  return await res.json();
}

async function fetchTitle(title){
  const enc = encodeURIComponent(title);
  const res = await fetch(`${API_BASE}/title/${enc}`);
  if(!res.ok) return [];
  return await res.json();
}

function renderAuthors(list){
  if(!Array.isArray(list) || list.length===0){
    authorsEl.innerHTML = '';
    return;
  }

  const display = list.slice(0,40);
  authorsEl.innerHTML = display.map(a => `<button class="author-chip" data-author="${escapeHtml(a)}">${escapeHtml(a)}</button>`).join('');

  authorsEl.querySelectorAll('.author-chip').forEach(btn => {
    btn.addEventListener('click', async () => {
      authorsEl.querySelectorAll('.author-chip').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const name = btn.getAttribute('data-author');
      setLoading(resultsEl);
      const poems = await fetchAuthor(name);
      renderPoems(poems);
    });
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if(!q){ renderError('Please enter a search term.'); return; }
  setLoading(resultsEl);
  // try title first
  let poems = await fetchTitle(q);
  if(Array.isArray(poems) && poems.length>0){ renderPoems(poems); return; }
  // fallback to author
  poems = await fetchAuthor(q);
  renderPoems(poems);
});

// initialize
// initialize
(async function init(){
  resultsEl.innerHTML = '<div class="poem">Choose an author or search to view poems.</div>';
  const authors = await fetchAuthors();
  renderAuthors(authors);
})();
