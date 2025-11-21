// 现代诗常用字词库 - 扩展版
console.log('word-bank.js 已加载');

// 检查是否已经存在，避免重复声明
if (typeof wordBank === 'undefined') {
    const wordBank = {
        nouns: [
            '月光', '星辰', '大海', '山川', '云朵', '落叶', '飞鸟', '河流',
            '梦境', '记忆', '时光', '远方', '故乡', '灯火', '窗台', '书信',
            '季节', '晨露', '晚风', '细雨', '雪花', '阳光', '影子', '回声',
            '城市', '田野', '森林', '石头', '花朵', '果实', '翅膀', '足迹',
            '天空', '大地', '海洋', '山峰', '溪流', '草原', '沙漠', '岛屿'
        ],
        verbs: [
            '流淌', '飞舞', '沉睡', '醒来', '等待', '寻找', '遗忘', '记得',
            '拥抱', '离别', '歌唱', '沉默', '生长', '凋零', '燃烧', '熄灭',
            '徘徊', '奔跑', '凝望', '倾听', '呼吸', '思念', '穿越', '停留',
            '坠落', '升起', '旋转', '沉淀', '绽放', '闭合', '诉说', '隐藏',
            '闪耀', '消逝', '凝聚', '散落', '漂浮', '沉没', '呼啸', '低语'
        ],
        adjectives: [
            '温柔的', '寂静的', '遥远的', '清澈的', '深邃的', '朦胧的', '孤独的',
            '明亮的', '忧伤的', '轻盈的', '沉重的', '永恒的', '短暂的', '破碎的',
            '完整的', '陌生的', '熟悉的', '炽热的', '冰冷的', '自由的', '束缚的',
            '苍白的', '鲜艳的', '古老的', '新鲜的', '潮湿的', '干燥的', '柔软的',
            '坚硬的', '透明的', '浑浊的', '光滑的', '粗糙的', '温暖的', '寒冷的'
        ],
        adverbs: [
            '轻轻地', '缓缓地', '深深地', '远远地', '静静地', '孤独地', '自由地',
            '热烈地', '温柔地', '忧伤地', '快乐地', '突然地', '渐渐地', '永远地',
            '匆忙地', '从容地', '反复地', '偶尔地', '时常地', '彻底地', '部分地',
            '完全地', '几乎地', '几乎地', '几乎地', '几乎地', '几乎地', '几乎地'
        ],
        conjunctions: ['而', '却', '但', '于是', '因此', '所以', '然而', '可是'],
        particles: ['的', '地', '得', '之', '乎', '者', '也', '矣']
    };

    // 获取随机字词
    function getRandomWords(count = 24) {
        console.log('getRandomWords 被调用');
        const allWords = Object.values(wordBank).flat();
        const shuffled = [...allWords].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 渲染字词网格
    function renderWordsGrid(container, words) {
        console.log('renderWordsGrid 被调用');
        
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
    }

    // 导出函数到全局作用域
    window.getRandomWords = getRandomWords;
    window.renderWordsGrid = renderWordsGrid;
    window.wordBank = wordBank;
}

console.log('word-bank.js 初始化完成');