// 直接在浏览器控制台中运行这个脚本来测试字词功能
function testWordBank() {
    console.log('测试字词库...');
    
    // 测试字词库
    const words = getRandomWords();
    console.log('随机字词:', words);
    
    // 测试渲染
    const container = document.getElementById('wordsGrid');
    if (container) {
        console.log('找到字词容器');
        renderWordsGrid(container, words);
        console.log('字词渲染完成');
    } else {
        console.error('未找到字词容器');
    }
}

// 运行测试
testWordBank();