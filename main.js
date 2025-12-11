
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');

    let todos = [
        { id: 1, text: 'Complete online JavaScript course', completed: true },
        { id: 2, text: 'Jog around the park 3x', completed: false },
        { id: 3, text: '10 minutes meditation', completed: false },
        { id: 4, text: 'Read for 1 hour', completed: false },
        { id: 5, text: 'Pick up groceries', completed: false },
        { id: 6, text: 'Complete Todo App on Frontend Mentor', completed: false },
    ];

    let currentFilter = 'all';

    function renderTodos() {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.setAttribute('draggable', true);
            li.dataset.id = todo.id; // Store ID for drag logic
            
            li.innerHTML = `
                <div class="check-circle" onclick="toggleTodo(${todo.id})"></div>
                <div class="todo-text" onclick="toggleTodo(${todo.id})">${todo.text}</div>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                    <img src="images/icon-cross.svg" alt="Delete">
                    
                </button>
            `;

            // DRAG EVENTS FOR ITEMS
            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });

            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                updateTodosOrder(); // Save the new order
            });
            
            todoList.appendChild(li);
        });

        updateCount();
    }

    // DRAG OVER LOGIC FOR CONTAINER
    todoList.addEventListener('dragover', (e) => {
        e.preventDefault(); // Enable dropping
        const afterElement = getDragAfterElement(todoList, e.clientY);
        const draggable = document.querySelector('.dragging');
        
        if (afterElement == null) {
            todoList.appendChild(draggable);
        } else {
            todoList.insertBefore(draggable, afterElement);
        }
    });

    // Helper to calculate where to drop
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

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

    // Sync DOM order with Array
    function updateTodosOrder() {
        const newOrderIds = [...todoList.querySelectorAll('.todo-item')].map(li => parseInt(li.dataset.id));
        
        // Reorder the 'todos' array to match the DOM
        todos = newOrderIds.map(id => todos.find(t => t.id === id));
    }

    function updateCount() {
        const count = todos.filter(t => !t.completed).length;
        itemsLeft.innerText = `${count} items left`;
    }

    window.toggleTodo = (id) => {
        todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        renderTodos();
    };

    window.deleteTodo = (id) => {
        todos = todos.filter(t => t.id !== id);
        renderTodos();
    };

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim() !== '') {
            todos.push({
                id: Date.now(),
                text: todoInput.value,
                completed: false
            });
            todoInput.value = '';
            renderTodos();
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(t => !t.completed);
        renderTodos();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`.filter-btn[data-filter="${btn.dataset.filter}"]`).forEach(b => b.classList.add('active'));
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
    });

    renderTodos();
});