document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const progressFill = document.querySelector('.progress-fill');
    const completionPercentage = document.querySelector('.completion-percentage');
    const totalTasksElement = document.querySelector('.total-tasks');
    const themeToggle = document.getElementById('theme-toggle');
    const highPriorityCount = document.getElementById('high-priority-count');
    const mediumPriorityCount = document.getElementById('medium-priority-count');
    const lowPriorityCount = document.getElementById('low-priority-count');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Theme handling
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.querySelector('i').className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    themeToggle.addEventListener('click', toggleTheme);

    function updateAnalytics() {
        const priorityCounts = {
            high: tasks.filter(task => task.priority === 'high').length,
            medium: tasks.filter(task => task.priority === 'medium').length,
            low: tasks.filter(task => task.priority === 'low').length
        };

        highPriorityCount.textContent = priorityCounts.high;
        mediumPriorityCount.textContent = priorityCounts.medium;
        lowPriorityCount.textContent = priorityCounts.low;

        // Update weekly chart
        const today = new Date();
        const dayOfWeek = today.getDay();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            const dayTasks = tasks.filter(task => {
                const taskDate = new Date(task.timestamp);
                return taskDate.getDay() === index;
            }).length;
            
            const height = tasks.length > 0 ? (dayTasks / tasks.length) * 100 : 0;
            bar.style.height = `${height}%`;
            
            // Highlight current day
            if (index === dayOfWeek) {
                bar.style.background = 'linear-gradient(to top, #00c853, #64dd17)';
            } else {
                bar.style.background = 'linear-gradient(to top, #667eea, #764ba2)';
            }
        });
    }

    function updatePerformanceBar() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        
        progressFill.style.width = `${percentage}%`;
        completionPercentage.textContent = `${percentage}%`;
        totalTasksElement.textContent = `Total Tasks: ${totalTasks}`;

        if (percentage === 100 && totalTasks > 0) {
            progressFill.style.background = 'linear-gradient(90deg, #00c853, #64dd17)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
        }
    }

    function createSparkles(x, y) {
        const numSparkles = 12;
        for (let i = 0; i < numSparkles; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            
            const angle = (i * (360 / numSparkles)) + (Math.random() * 30 - 15);
            const distance = 50 + Math.random() * 30;
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;
            
            sparkle.style.setProperty('--tx', `${tx}px`);
            sparkle.style.setProperty('--ty', `${ty}px`);
            sparkle.style.animation = `sparkle 0.6s ease-out forwards`;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 600);
        }
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTasksCounter();
        updatePerformanceBar();
        updateAnalytics();
    }

    function updateTasksCounter() {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        tasksCounter.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`;
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <span class="timestamp">${formatTimestamp(task.timestamp)}</span>
            <div class="actions">
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            li.className = `priority-${task.priority} ${task.completed ? 'completed' : ''}`;
            
            if (task.completed) {
                li.classList.add('celebration');
                const rect = li.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                createSparkles(centerX, centerY);
                
                const audio = new Audio('data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAMAAAGRAAFBQUFBQUFBSAgICAgICAgPz8/Pz8/Pz8/X19fX19fX19/f39/f39/f5+fn5+fn5+fv7+/v7+/v7/f39/f39/f3////////////wAAADAAAAAwAAABAAACAAAAAABHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uwxAAABLQDe7QQAAI8mGz/NaAB0kSbaKVYOAAwns321YOxwMBgYDAYDAYDAYDEYYQEBAQEBAQEhISEhISEhIUVFRUVFRUVFXV1dXV1dXV1dkJCQkJCQkJCQtra2tra2tra239/f39/f39/f//////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7sMQAAAToA3+0EAAiNYBuNpIAAUgAAAAAAN6xFQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEA');
                audio.play().catch(() => {});
                
                setTimeout(() => {
                    li.classList.remove('celebration');
                }, 600);
            }
            
            saveTasks();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.classList.add('fade-out');
            setTimeout(() => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks();
            }, 300);
        });

        return li;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
        updateTasksCounter();
        updatePerformanceBar();
        updateAnalytics();
    }

    function addTask(text, priority) {
        if (text.trim() === '') return;
        
        const newTask = {
            text: text,
            completed: false,
            id: Date.now(),
            timestamp: Date.now(),
            priority: priority
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    addBtn.addEventListener('click', () => {
        addTask(taskInput.value, prioritySelect.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value, prioritySelect.value);
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    // Initial render
    renderTasks();
});