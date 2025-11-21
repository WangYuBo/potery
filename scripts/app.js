class PoetryGenerator {
    constructor() {
        console.log('初始化 PoetryGenerator...');
        
        this.poetryLines = document.getElementById('poetryLines');
        this.wordsGrid = document.getElementById('wordsGrid');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.newLineBtn = document.getElementById('newLineBtn');
        this.refreshWordsBtn = document.getElementById('refreshWords');
        this.messageElement = document.getElementById('message');
        
        console.log('DOM元素获取结果:', {
            poetryLines: !!this.poetryLines,
            wordsGrid: !!this.wordsGrid,
            copyBtn: !!this.copyBtn,
            clearBtn: !!this.clearBtn,
            newLineBtn: !!this.newLineBtn,
            refreshWordsBtn: !!this.refreshWordsBtn,
            messageElement: !!this.messageElement
        });
        
        this.currentLine = [];
        this.init();
    }

    init() {
        console.log('开始初始化应用...');
        
        try {
            // 先初始化字词显示
            console.log('刷新字词...');
            this.refreshWords();
            
            // 然后加载本地存储
            console.log('加载本地存储...');
            this.loadFromLocalStorage();
            
            // 初始化拖拽功能
            console.log('初始化拖拽功能...');
            new DragDropManager(this.poetryLines);
            
            // 绑定事件
            console.log('绑定事件...');
            this.bindEvents();
            this.bindKeyboardEvents();
            
            console.log('应用初始化完成');
            this.showMessage('应用加载完成', 'success');
            
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showMessage('应用初始化失败，请刷新页面', 'error');
        }
    }

    refreshWords() {
        console.log('调用 refreshWords 方法');
        
        if (!this.wordsGrid) {
            console.error('wordsGrid 元素未找到');
            return;
        }
        
        const words = getRandomWords();
        console.log('获取到的字词:', words);
        
        if (words && words.length > 0) {
            renderWordsGrid(this.wordsGrid, words);
            this.showMessage('字词已刷新', 'success');
        } else {
            console.error('没有获取到字词');
            this.showMessage('字词加载失败', 'error');
        }
    }

    bindEvents() {
        // 字词点击事件
        this.wordsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('word-item')) {
                this.addWordToPoetry(e.target.getAttribute('data-word'));
            }
        });

        // 按钮事件 - 使用箭头函数确保正确的this绑定
        this.copyBtn.addEventListener('click', () => this.copyPoetry());
        this.clearBtn.addEventListener('click', () => this.clearPoetry());
        this.newLineBtn.addEventListener('click', () => this.addNewLine());
        this.refreshWordsBtn.addEventListener('click', () => this.refreshWords());
    }

    addWordToPoetry(word) {
        // 移除占位符
        const placeholder = this.poetryLines.querySelector('.placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // 创建新的诗词行或添加到当前行
        let currentLineElement = this.poetryLines.lastElementChild;
        if (!currentLineElement || !currentLineElement.classList.contains('poetry-line')) {
            currentLineElement = this.createNewLine();
        }

        // 添加字词到当前行
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        wordSpan.className = 'poetry-word';
        currentLineElement.appendChild(wordSpan);
        
        // 自动保存
        this.saveToLocalStorage();
    }

    createNewLine() {
        const lineElement = document.createElement('div');
        lineElement.className = 'poetry-line';
        lineElement.setAttribute('draggable', 'true');
        this.poetryLines.appendChild(lineElement);
        return lineElement;
    }

    addNewLine() {
        this.createNewLine();
        this.showMessage('已创建新行', 'success');
    }

    clearPoetry() {
        this.poetryLines.innerHTML = '<div class="placeholder">点击下方字词开始创作...</div>';
        this.currentLine = [];
        this.showMessage('已清空诗歌', 'success');
        localStorage.removeItem('poetryData');
    }

    async copyPoetry() {
        const lines = this.poetryLines.querySelectorAll('.poetry-line');
        if (lines.length === 0) {
            this.showMessage('请先创作一些诗句', 'warning');
            return;
        }

        const poetryText = Array.from(lines)
            .map(line => {
                const words = Array.from(line.querySelectorAll('.poetry-word'))
                    .map(word => word.textContent)
                    .join(' ');
                return words.trim();
            })
            .filter(text => text.length > 0)
            .join('\n');

        try {
            await navigator.clipboard.writeText(poetryText);
            this.showMessage('诗歌已复制到剪贴板', 'success');
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = poetryText;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showMessage('诗歌已复制到剪贴板', 'success');
            } catch (fallbackErr) {
                this.showMessage('复制失败，请手动复制', 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    showMessage(text, type = 'success') {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
        this.messageElement.classList.remove('hidden');

        // 3秒后自动隐藏
        setTimeout(() => {
            this.messageElement.classList.add('hidden');
        }, 3000);
    }

    saveToLocalStorage() {
        const lines = this.poetryLines.querySelectorAll('.poetry-line');
        if (lines.length === 0) return;

        const poetryData = {
            lines: Array.from(lines).map(line => 
                Array.from(line.querySelectorAll('.poetry-word')).map(word => word.textContent)
            ),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('poetryData', JSON.stringify(poetryData));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('poetryData');
        if (saved) {
            try {
                const poetryData = JSON.parse(saved);
                this.clearPoetry();
                
                poetryData.lines.forEach(lineWords => {
                    if (lineWords.length > 0) {
                        const lineElement = this.createNewLine();
                        lineWords.forEach(word => {
                            const wordSpan = document.createElement('span');
                            wordSpan.textContent = word;
                            wordSpan.className = 'poetry-word';
                            lineElement.appendChild(wordSpan);
                        });
                    }
                });
                
                // 如果有内容，移除占位符
                const placeholder = this.poetryLines.querySelector('.placeholder');
                if (placeholder && this.poetryLines.querySelector('.poetry-line')) {
                    placeholder.remove();
                }
            } catch (e) {
                console.warn('Failed to load saved poetry:', e);
                localStorage.removeItem('poetryData');
            }
        }
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter 换行
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.addNewLine();
            }
            // Ctrl+C 复制（不在输入框中时）
            if (e.ctrlKey && e.key === 'c' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.copyPoetry();
            }
            // Escape 清空
            if (e.key === 'Escape') {
                this.clearPoetry();
            }
        });
    }
}

// 确保在DOM完全加载后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM完全加载，开始初始化应用...');
    new PoetryGenerator();
});