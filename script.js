const toggleButton = document.getElementById('theme-toggle');

// ========== 核心修复：优先级 localStorage > 系统主题 ==========
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme; // 用户手动设置过，优先使用
    
    // 未设置过，跟随系统
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// ========== 应用主题（带过渡）==========
const applyTheme = (theme, animate = true) => {
    if (animate) {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
    
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    
    // 清理 transition 防止影响其他样式变化
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
};

// 初始化（无动画，避免页面加载时的闪烁）
applyTheme(getPreferredTheme(), false);

// ========== 手动切换 ==========
toggleButton.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    applyTheme(newTheme, true);
    localStorage.setItem('theme', newTheme);
});

// ========== 监听系统主题变化（仅在用户未手动设置时生效）==========
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', (e) => {
    // 只有用户没手动设置过，才跟随系统
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme, true);
    }
});
