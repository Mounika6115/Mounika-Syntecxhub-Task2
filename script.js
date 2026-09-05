const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const themeBtn = document.getElementById("themeBtn");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        category: category.value,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    dueDate.value = "";

    renderTasks();
}


function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        if (currentFilter === "active") {
            return matchesSearch && !task.completed;
        }

        if (currentFilter === "completed") {
            return matchesSearch && task.completed;
        }

        return matchesSearch;
    });


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

        filteredTasks.forEach(function(task) {

            const taskItem =
                document.createElement("div");

            taskItem.classList.add("task-item");

            const priorityClass =
                "priority-" + task.priority.toLowerCase();

            taskItem.classList.add(priorityClass);

            if (task.completed) {
                taskItem.classList.add("completed");
            }


            taskItem.innerHTML = `

                <div class="task-main">

                    <input
                        type="checkbox"
                        ${task.completed ? "checked" : ""}
                    >

                    <div class="task-content">

                        <div class="task-title">
                            ${task.text}
                        </div>

                        <div class="task-details">

                            <span class="task-detail">
                                Category: ${task.category}
                            </span>

                            <span class="task-detail">
                                Priority: ${task.priority}
                            </span>

                            ${task.dueDate ? `

                                <span class="task-detail">
                                    Due Date: ${task.dueDate}
                                </span>

                            ` : ""}

                        </div>

                    </div>

                </div>


                <div class="task-actions">

                    <button class="edit-btn">
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>

                    <button class="delete-btn">
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>

                </div>
            `;


            const checkbox =
                taskItem.querySelector("input");


            checkbox.addEventListener("change", function() {

                task.completed = checkbox.checked;

                saveTasks();

                renderTasks();

            });


            const editBtn =
                taskItem.querySelector(".edit-btn");


            editBtn.addEventListener("click", function() {

                editTask(task.id);

            });


            const deleteBtn =
                taskItem.querySelector(".delete-btn");


            deleteBtn.addEventListener("click", function() {

                const confirmation =
                    confirm("Do you want to delete this task?");

                if (confirmation) {

                    tasks = tasks.filter(function(item) {

                        return item.id !== task.id;

                    });

                    saveTasks();

                    renderTasks();

                }

            });


            taskList.appendChild(taskItem);

        });

    }

    updateStatistics();

}


function editTask(id) {

    const task = tasks.find(function(item) {

        return item.id === id;

    });


    const updatedTask =
        prompt("Edit your task:", task.text);


    if (
        updatedTask !== null &&
        updatedTask.trim() !== ""
    ) {

        task.text = updatedTask.trim();

        saveTasks();

        renderTasks();

    }

}


function updateStatistics() {

    const total = tasks.length;

    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const active = total - completed;


    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;


    let progress = 0;

    if (total > 0) {

        progress =
            Math.round((completed / total) * 100);

    }


    progressFill.style.width =
        progress + "%";

    progressText.textContent =
        progress + "%";

}


/* Search */

searchInput.addEventListener("input", function() {

    renderTasks();

});


/* Filters */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();

    });

});


/* Clear Completed */

clearCompletedBtn.addEventListener("click", function() {

    const hasCompletedTasks =
        tasks.some(function(task) {

            return task.completed;

        });


    if (!hasCompletedTasks) {

        alert("No completed tasks to clear.");

        return;

    }


    const confirmation =
        confirm(
            "Do you want to remove all completed tasks?"
        );


    if (confirmation) {

        tasks = tasks.filter(function(task) {

            return !task.completed;

        });

        saveTasks();

        renderTasks();

    }

});


/* Dark Mode */

themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");

    if (
        document.body.classList.contains("dark-mode")
    ) {

        themeBtn.innerHTML = `
            <i class="fa-solid fa-sun"></i>
            <span>Light Mode</span>
        `;

        localStorage.setItem("theme", "dark");

    } else {

        themeBtn.innerHTML = `
            <i class="fa-solid fa-moon"></i>
            <span>Dark Mode</span>
        `;

        localStorage.setItem("theme", "light");

    }

});


function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeBtn.innerHTML = `
            <i class="fa-solid fa-sun"></i>
            <span>Light Mode</span>
        `;

    }

}


/* Add Task */

addBtn.addEventListener("click", addTask);


/* Enter Key */

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


/* Load Application */

loadTheme();

renderTasks();