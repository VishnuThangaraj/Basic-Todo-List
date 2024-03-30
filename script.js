let currentDate = new Date();
currentDate = `${currentDate.getFullYear()}-${
  currentDate.getUTCMonth() < 10
    ? "0" + (currentDate.getUTCMonth() + 1)
    : currentDate.getUTCMonth() + 1
}-${
  currentDate.getDate() < 10
    ? "0" + currentDate.getDate()
    : currentDate.getDate()
}`;

// Input Area Items
const taskName = document.getElementById(`task_name`);
const taskDate = document.getElementById(`task_date`);
const taskPriority = document.getElementById(`task_priority_selector`);
const taskAddBtn = document.getElementById(`task_adding`);

// Task Holding Sections
const currentTaskHolder = document.getElementById(`current_task_holder`);
const upcomingTaskHolder = document.getElementById(`future_task_holder`);
const completedTaskHolder = document.getElementById(`completed_task_holder`);

// Buttons
const deleteButtons = [...document.getElementsByClassName(`delete_btn`)];
const completedButtons = [...document.getElementsByClassName(`finish_btn`)];

// TaskList
let totalTaskCount = 0;
const currentTasks = [],
  upcomingTasks = [],
  completedTasks = [];

// EventListener for DeleteButtons
function addEventToDeleteBtn(delete_button) {
  delete_button.addEventListener("click", function (event) {
    let triggeredBtn = event.target;
    if (triggeredBtn.classList.contains(`fa-solid`)) {
      triggeredBtn = triggeredBtn.parentNode;
    }
    let targetDiv = triggeredBtn.parentNode.parentNode;
    let parentDiv = targetDiv.parentNode;

    parentDiv.removeChild(targetDiv);
  });
}

// EventListener for CompletedButtons
function addEventToCompletedBtn(completed_button) {
  completed_button.addEventListener("click", function (event) {
    let triggeredBtn = event.target;
    if (triggeredBtn.classList.contains(`fa-solid`)) {
      triggeredBtn = triggeredBtn.parentNode;
    }
    let targetDiv = triggeredBtn.parentNode;
    let sub = targetDiv.parentNode;
    let parentDiv = targetDiv.parentNode.parentNode;

    parentDiv.removeChild(sub);
    targetDiv.removeChild(triggeredBtn);

    sub.classList.remove(...sub.classList);
    sub.classList.add(...["task", "completed_task"]);
    completedTaskHolder.appendChild(sub);
  });
}

// Function to Add Task in the paritcular Section
function appendTaskToSection(parent, TaskObject) {
  // Create the new task div
  const taskDiv = document.createElement("div");
  taskDiv.id = TaskObject.id; // Set the ID attribute
  if (parent == currentTaskHolder)
    taskDiv.classList.add("ongoing_task", "task"); // Add classes
  else taskDiv.classList.add("pending_task", "task"); // Add classes

  // Create child elements for task details
  const taskName = document.createElement("div");
  taskName.classList.add("task_name", "py-2");
  taskName.textContent = TaskObject.newTaskName; // Set the task name

  const taskDate = document.createElement("div");
  taskDate.classList.add("task_date", "py-2");
  taskDate.textContent = TaskObject.newTaskDate; // Set the task date

  const priority = document.createElement("div");
  priority.classList.add("priority_selector", "py-2");
  priority.textContent = `Priority: ${TaskObject.newTaskPriority}`; // Set the priority text

  const buttonHolder = document.createElement("div");
  // Create completion and deletion buttons
  const completeBtn = document.createElement("div");
  completeBtn.classList.add("btn", "btn-success", "finish_btn", "mx-3");
  completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Add the check icon
  addEventToCompletedBtn(completeBtn);

  const deleteBtn = document.createElement("div");
  deleteBtn.classList.add("btn", "btn-danger", "delete_btn");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'; // Add the trash icon
  addEventToDeleteBtn(deleteBtn);

  buttonHolder.appendChild(completeBtn);
  buttonHolder.appendChild(deleteBtn);

  // Append child elements to the task div
  taskDiv.appendChild(taskName);
  taskDiv.appendChild(taskDate);
  taskDiv.appendChild(priority);
  taskDiv.appendChild(buttonHolder);

  // Append the task div to the parent
  parent.appendChild(taskDiv);

  console.log("Task Added Successfully ✔️");
}

// Function to Create New Task Item
function appendNewItem(event) {
  // Invalid Date Selection
  if (taskName.value == "") {
    alert(`Please provide a task name to add to your to-do list. 📝`);
    console.log(`Empty Task Name`);
    return;
  } else if (taskDate.value < currentDate) {
    alert(`Select a date from the present or the future, not the past. 📅`);
    console.log(`Invalid Date Selected`);
    return;
  } else if (taskPriority.value == `⏱️ Priority`) {
    alert(`Please choose the priority for your task. 📊`);
    console.log(`No task priority has been selected`);
    return;
  }

  let newTask = {
    // TaskObject
    id: ++totalTaskCount,
    newTaskName: taskName.value,
    newTaskDate: taskDate.value.split("-").reverse().join("-"),
    newTaskPriority: taskPriority.value,
  };

  if (taskDate.value == currentDate) {
    // Add to Current Day Taks List
    currentTasks.push(newTask);
    appendTaskToSection(currentTaskHolder, newTask);
  } else {
    // Add to Upcoming Task List
    upcomingTasks.push(newTask);
    appendTaskToSection(upcomingTaskHolder, newTask);
  }
}

function startApplication() {
  for (let del_btn of deleteButtons) {
    addEventToDeleteBtn(del_btn);
  }
  for (let comp_btn of completedButtons) {
    addEventToCompletedBtn(comp_btn);
  }
}

startApplication();
