// 拖拽排序功能
class DragDropManager {
    constructor(container) {
        this.container = container;
        this.draggedItem = null;
        this.init();
    }

    init() {
        this.container.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.container.addEventListener('dragover', this.handleDragOver.bind(this));
        this.container.addEventListener('drop', this.handleDrop.bind(this));
        this.container.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    // 改进：添加拖拽视觉反馈
    handleDragStart(e) {
        if (e.target.classList.contains('poetry-line')) {
            this.draggedItem = e.target;
            e.target.classList.add('dragging');
            e.target.style.transform = 'rotate(2deg)'; // 视觉反馈
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
        }
    }

    handleDragEnd(e) {
        if (e.target.classList.contains('poetry-line')) {
            e.target.classList.remove('dragging');
            e.target.style.transform = ''; // 恢复原状
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = this.getDragAfterElement(this.container, e.clientY);
        const draggable = document.querySelector('.dragging');
        
        if (afterElement == null) {
            this.container.appendChild(draggable);
        } else {
            this.container.insertBefore(draggable, afterElement);
        }
    }

    handleDrop(e) {
        e.preventDefault();
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
            this.draggedItem = null;
        }
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.poetry-line:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}