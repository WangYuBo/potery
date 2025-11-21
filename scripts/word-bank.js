// 现代诗常用字词库 - 修复版
console.log('word-bank.js 已加载');

const wordBank = {
    nouns: ['月光', '星辰', '大海', '山川', '云朵', '落叶', '飞鸟', '河流'],
    verbs: ['流淌', '飞舞', '沉睡', '醒来', '等待', '寻找', '遗忘', '记得'],
    adjectives: ['温柔的', '寂静的', '遥远的', '清澈的', '深邃的', '朦胧的', '孤独的', '明亮的'],
    adverbs: ['轻轻地', '缓缓地', '深深地', '远远地', '静静地', '孤独地', '自由地', '热烈地']
};

// 获取随机字词
function getRandomWords(count = 12) {
    console.log('getRandomWords 被调用');
    const allWords = [...wordBank.nouns, ...wordBank.verbs, ...wordBank.adjectives, ...wordBank.adverbs];
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 渲染字词网格
function renderWordsGrid(container, words) {
    console.log('renderWordsGrid 被调用', container, words);
    
    if (!container) {
        console.error('容器未找到');
        return;
    }
    
    container.innerHTML = '';
    words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word-item';
        div.textContent = word;
        div.setAttribute('data-word', word);
        container.appendChild(div);
    });
    
    console.log('字词渲染完成');
}

// 导出函数到全局作用域
window.getRandomWords = getRandomWords;
window.renderWordsGrid = renderWordsGrid;

console.log('word-bank.js 初始化完成');