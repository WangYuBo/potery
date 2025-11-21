// 扩展字词库
const wordBank = {
    nouns: [
        '月光', '星辰', '大海', '山川', '云朵', '落叶', '飞鸟', '河流',
        '梦境', '记忆', '时光', '远方', '故乡', '灯火', '窗台', '书信',
        '季节', '晨露', '晚风', '细雨', '雪花', '阳光', '影子', '回声',
        '城市', '田野', '森林', '石头', '花朵', '果实', '翅膀', '足迹'
    ],
    verbs: [
        '流淌', '飞舞', '沉睡', '醒来', '等待', '寻找', '遗忘', '记得',
        '拥抱', '离别', '歌唱', '沉默', '生长', '凋零', '燃烧', '熄灭',
        '徘徊', '奔跑', '凝望', '倾听', '呼吸', '思念', '穿越', '停留',
        '坠落', '升起', '旋转', '沉淀', '绽放', '闭合', '诉说', '隐藏'
    ],
    adjectives: [
        '温柔的', '寂静的', '遥远的', '清澈的', '深邃的', '朦胧的', '孤独的',
        '明亮的', '忧伤的', '轻盈的', '沉重的', '永恒的', '短暂的', '破碎的',
        '完整的', '陌生的', '熟悉的', '炽热的', '冰冷的', '自由的', '束缚的',
        '苍白的', '鲜艳的', '古老的', '新鲜的', '潮湿的', '干燥的', '柔软的'
    ],
    adverbs: [
        '轻轻地', '缓缓地', '深深地', '远远地', '静静地', '孤独地', '自由地',
        '热烈地', '温柔地', '忧伤地', '快乐地', '突然地', '渐渐地', '永远地',
        '匆忙地', '从容地', '反复地', '偶尔地', '时常地', '彻底地', '部分地'
    ],
    conjunctions: ['而', '却', '但', '于是', '因此', '所以', '然而'],
    particles: ['的', '地', '得', '之', '乎', '者', '也'],
    // 按主题分类
    nature: ['青山', '绿水', '白云', '红叶', '明月', '星空', '晨雾'],
    emotion: ['欢喜', '忧愁', '思念', '孤独', '期待', '回忆', '梦境']
};

// 主题模式选择
function getWordsByTheme(count = 16) {
    const allWords = [
        ...wordBank.nouns,
        ...wordBank.verbs,
        ...wordBank.adjectives,
        ...wordBank.adverbs
    ];
    
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 渲染字词网格
function renderWordsGrid(container, words) {
    container.innerHTML = '';
    words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordElement.setAttribute('data-word', word);
        container.appendChild(wordElement);
    });
}

// 改进：更平衡的字词选择
function getBalancedRandomWords(count = 16) {
    const categories = Object.keys(wordBank);
    const wordsPerCategory = Math.floor(count / categories.length);
    const result = [];
    
    categories.forEach(category => {
        const shuffled = [...wordBank[category]].sort(() => 0.5 - Math.random());
        result.push(...shuffled.slice(0, wordsPerCategory));
    });
    
    // 补充剩余的字词
    const remaining = count - result.length;
    if (remaining > 0) {
        const allWords = Object.values(wordBank).flat();
        const shuffled = [...allWords].sort(() => 0.5 - Math.random());
        result.push(...shuffled.slice(0, remaining));
    }
    
    return result.sort(() => 0.5 - Math.random());
}