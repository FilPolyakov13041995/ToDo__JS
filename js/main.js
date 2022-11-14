// Находим элементы на странице

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');


let tasks = []; // Пустой массив для (LocalStorage 1)

if (localStorage.getItem('tasks')) {
    tasks =  JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        renderTask(task);
    });
}



checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной.
tasksList.addEventListener('click', doneTask);

// Функции.
function addTask(event) {
    
    // Отменяем отправку формы.
    event.preventDefault();

    // Достаём текст задачи из поля ввода.
    const taskText = taskInput.value;


    // Localstorage // Описываем задачу в виде объекта. (LocalStorage 2)
    const newTasks = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // Добовляем задачу в массив с задачами. (LocalStorage 3)
    tasks.push(newTasks);

    saveToLS();

    renderTask(newTasks);

    // Очищаем поле ввода после отправки формы, и возвращаем фокус.
    taskInput.value = '';
    taskInput.focus();
    
    checkEmptyList();
    // Условие по скрытию блока с текстом "список дел пуст" если в нем есть хоть одно дело.
    // if(tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }
}

function deleteTask(event) {

    // Проверяем, та ли это кнопка которая нам нужна.
    if(event.target.dataset.action !== 'delete') return;
        
    const parentNode = event.target.closest('.list-group-item'); // Ищем родителя этой той самой кнопки, которую хотим удалить.


    //Определяем id задачи. (LocalStorage 5)
    const id = Number (parentNode.id); 

    tasks = tasks.filter(function(task) { //(LocalStorage 6)
        if(task.id === id) {
            return false;
        } else {
            return true;
        }
    });

    saveToLS();

    // Удаляем задачу из разметки.
    parentNode.remove();
    
    checkEmptyList();
    // Условие по открытию блока с текстом "список дел пуст" если в нем нет ни одного дела, то мы его показываем.
    // if(tasksList.children.length === 1) {
    //     emptyList.classList.remove('none');
    // }
}

function doneTask(event) {
     // Проверяем, та ли это кнопка которая нам нужна.
    if(event.target.dataset.action !== 'done') return;
        
    
    const parentNode = event.target.closest('.list-group-item'); // Ищем родителя этой той самой кнопки, которую хотим удалить.

    // Определяем id задачи. (LocalStorage 7)
    const id = Number(parentNode.id);

    const task = tasks.find(function(task) {
        if(task.id === id) {
            return true;

        } 
    });

    task.done = !task.done;

    saveToLS();

    const taskTitle = parentNode.querySelector('.task-title'); // Нашли внутри parentNode нужный класс.
    taskTitle.classList.toggle('task-title--done'); // Добавили ему класс.  
    
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    
    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    } 
    
}

function saveToLS() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формируем css класс.
    const cssClass = task.done ? "task-title task-title--done" : "task-title"; // (LocalStorage 4)

    // Формируем разметку для новой задачи
    const tasktHTML = ` 
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item"> 
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>
    `;

    // Добовляем задачу на страницу.
    tasksList.insertAdjacentHTML('beforeend', tasktHTML);
}