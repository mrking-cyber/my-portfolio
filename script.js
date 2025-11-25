// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Wire project card links if data attributes present
document.querySelectorAll('.project-card').forEach(card => {
  const live = card.dataset.live;
  const repo = card.dataset.repo;
  if (live || repo) {
    const meta = card.querySelector('.project-meta');
    const wrap = document.createElement('div');
    wrap.style.marginTop = '12px';
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';
    if (live) {
      const a = Object.assign(document.createElement('a'), { href: live, textContent: 'Live', target: '_blank', rel: 'noopener', className: 'btn-ghost' });
      a.style.padding = '8px 10px';
      a.style.borderRadius = '8px';
      a.style.border = '1px solid rgba(255,255,255,0.04)';
      a.style.color = 'var(--accent)';
      wrap.appendChild(a);
    }
    if (repo) {
      const r = Object.assign(document.createElement('a'), { href: repo, textContent: 'Repo', target: '_blank', rel: 'noopener', className: 'btn-ghost' });
      r.style.padding = '8px 10px';
      r.style.borderRadius = '8px';
      r.style.border = '1px solid rgba(255,255,255,0.04)';
      r.style.color = 'var(--muted)';
      wrap.appendChild(r);
    }
    if (wrap.children.length) meta.appendChild(wrap);
  }
});