/************************************
 * 1. 主题切换（localStorage > 系统）
 ************************************/
const toggleButton = document.getElementById('theme-toggle');

const getPreferredTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme, animate = true) => {
  if (animate) {
    document.body.style.transition = 'background-color .3s,color .3s';
    setTimeout(() => document.body.style.transition = '', 300);
  }
  document.body.classList.toggle('dark', theme === 'dark');
};

/* 初始化：无动画，防止闪烁 */
applyTheme(getPreferredTheme(), false);

/* 手动切换 */
toggleButton?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme, true);
  localStorage.setItem('theme', newTheme);
});

/* 系统主题变化（用户没手动设置才跟随） */
window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
          applyTheme(e.matches ? 'dark' : 'light', true);
        }
      });

/************************************
 * 2. 通用淡入动画
 ************************************/
const fadeIO = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.classList.add('fade');
      observer.unobserve(target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('h1,h2,h3,p,img,section,div,li')
        .forEach(el => fadeIO.observe(el));

/************************************
 * 3. 数字滚动（进入视野开始）
 ************************************/
const grow = node => {
  const final = parseInt(node.dataset.to, 10);
  node.textContent = '0+';
  const duration = 4000;
  const start = performance.now();

  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const cur = Math.floor(p * final);
    node.textContent = cur.toLocaleString() + '+';
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};


const counterIO = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ target }) => {
    if (target.classList.contains('counter') && target.dataset.to) {
      target.classList.add('run');
      grow(target);
      observer.unobserve(target);
    }
  });
});

/* 备份终值并归零 */
document.querySelectorAll('.counter').forEach(el => {
  el.dataset.to = el.textContent; // 存终值
  el.textContent = '0+';          // 归零
  counterIO.observe(el);
});

/************************************
 * 4. 日志卡片展开/收起
 ************************************/
document.getElementById('updateCard')?.addEventListener('click', function () {
  this.classList.toggle('open');
});

//轮播图
function slide(id,d){
  const vp=document.getElementById(id);
  vp.scrollLeft+=d*vp.clientWidth;
}


//自动轮播
function autoSlide(id, interval = 6000) {
  const vp = document.getElementById(id);
  let timer = null;

  function next() {
    const max = vp.scrollWidth - vp.clientWidth;
    /* 到最后一张就滚回第一张，否则滚下一张 */
    vp.scrollLeft = (vp.scrollLeft >= max) ? 0 : vp.scrollLeft + vp.clientWidth;
  }

  function start() {
    stop();               // 先清旧计时器
    timer = setInterval(next, interval);
  }

  function stop() {
    clearInterval(timer);
  }

  /* 鼠标/触摸进入时暂停，离开继续 */
  vp.addEventListener('mouseenter', stop);
  vp.addEventListener('mouseleave', start);

  /* 按钮点击后重新计时 */
  vp.parentElement.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => { stop(); start(); });
  });

  start();   // 首次启动
}

/* 对两个轮播分别启用 */
autoSlide('mbe-vp');
autoSlide('ttu-vp');