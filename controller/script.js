const grow = node => {
  const final = parseInt(node.dataset.to, 10); // 读备份值
  const duration = 1200;
  const step = Math.ceil(final / (duration / 16)) || 1; // 保底 1
  let now = 0;
  const t = setInterval(() => {
    now += step;
    if (now >= final) { now = final; clearInterval(t); }
    node.textContent = now.toLocaleString() + '+';
  }, 16);
};

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      const p = en.target;
      p.classList.add('run');
      grow(p);
      io.unobserve(p);
    }
  });
});

document.querySelectorAll('.counter').forEach(el => {
  el.dataset.to = el.textContent; // 把“6500+”先存起来
  el.textContent = '0+';          // 显示初始 0
  io.observe(el);
});
