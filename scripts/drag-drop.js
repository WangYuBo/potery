// 字词级别拖拽排序功能
// 检查是否已经存在，避免重复声明
if (typeof DragDropManager === 'undefined') {
    class DragDropManager {
        constructor(container) {
            this.container = container;
            this.draggedWord = null;
            console.log('拖拽管理器初始化');
            this.init();
        }

        init() {
            this.container.addEventListener('dragstart', (e) => {
                if (e.target.classList.contains('poetry-word')) {
                    console.log('开始拖拽:', e.target.textContent);
                    this.draggedWord = e.target;
                    e.target.style.opacity = '0.5';
                    e.dataTransfer.effectAllowed = 'move';
                }
            });

            this.container.addEventListener('dragover', (e) => {
                e.preventDefault();
                const targetWord = e.target.closest('.poetry-word');
                const currentLine = e.target.closest('.poetry-line');
                if (this.draggedWord && currentLine) {
                    if (targetWord && targetWord !== this.draggedWord) {
                        const rect = targetWord.getBoundingClientRect();
                        const midPoint = rect.left + rect.width / 2;
                        const reference = (e.clientX < midPoint) ? targetWord : targetWord.nextSibling;
                        currentLine.insertBefore(this.draggedWord, reference);
                    } else {
                        currentLine.appendChild(this.draggedWord);
                    }
                }
            });

            this.container.addEventListener('drop', (e) => {
                e.preventDefault();
                const target = e.target.closest('.poetry-word');
                const line = e.target.closest('.poetry-line');
                
                if (this.draggedWord && line) {
                    console.log('放置到:', target ? target.textContent : '行末尾');
                    if (target && target !== this.draggedWord) {
                        target.parentNode.insertBefore(this.draggedWord, target);
                    } else {
                        line.appendChild(this.draggedWord);
                    }
                    this.draggedWord.style.opacity = '1';
                    this.draggedWord = null;
                    
                    // 触发保存
                    if (window.poetryApp) {
                        window.poetryApp.saveToLocalStorage();
                    }
                }
            });

            this.container.addEventListener('dragend', (e) => {
                if (e.target.classList.contains('poetry-word')) {
                    console.log('拖拽结束');
                    e.target.style.opacity = '1';
                    this.draggedWord = null;
                }
            });
        }
    }
    
    // 导出到全局作用域
    window.DragDropManager = DragDropManager;
}