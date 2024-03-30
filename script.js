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
var TotalTasks = new Map();

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
    TotalTasks.delete(`A${targetDiv.id}`);
    storeMap();
    console.log("Task Deleted Successfully ✔️");
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

    let currentObj = TotalTasks.get(`A${sub.id}`);
    currentObj.taskStatus = true;

    TotalTasks.set(`A${targetDiv.id}`, currentObj);
    storeMap();

    console.log("Task Moved to Completed ✔️");
  });
}

// Function to Add Task in the paritcular Section
function appendTaskToSection(parent, TaskObject, statusG) {
  // Create the new task div
  const taskDiv = document.createElement("div");
  taskDiv.id = TaskObject.id; // Set the ID attribute
  if (statusG) {
    taskDiv.classList.add("completed_task", "task");
  } else if (parent == currentTaskHolder)
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

  if (!statusG) {
    buttonHolder.appendChild(completeBtn);
  }

  buttonHolder.appendChild(deleteBtn);

  // Append child elements to the task div
  taskDiv.appendChild(taskName);
  taskDiv.appendChild(taskDate);
  taskDiv.appendChild(priority);
  taskDiv.appendChild(buttonHolder);

  // Append the task div to the parent
  parent.appendChild(taskDiv);

  TotalTasks.set(`A${TaskObject.id}`, TaskObject);

  storeMap();
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
    taskStatus: false,
    newTaskPriority: taskPriority.value,
  };

  if (taskDate.value == currentDate) {
    // Add to Current Day Taks List
    appendTaskToSection(currentTaskHolder, newTask, false);
  } else {
    // Add to Upcoming Task List
    appendTaskToSection(upcomingTaskHolder, newTask, false);
  }
}

// Function to store the map in local storage
function storeMap() {
  const serializedMap = JSON.stringify(Array.from(TotalTasks.entries()));
  localStorage.setItem("TotalTasks", serializedMap);
}

function startApplication() {
  for (let del_btn of deleteButtons) {
    addEventToDeleteBtn(del_btn);
  }
  for (let comp_btn of completedButtons) {
    addEventToCompletedBtn(comp_btn);
  }

  let storedData = localStorage.getItem("TotalTasks");
  let parsedArray = JSON.parse(storedData);
  TotalTasks = new Map(parsedArray);

  for (let [key, value] of TotalTasks) {
    let dateVal = currentDate.split("-").reverse().join("-");
    console.log(value.taskStatus);
    if (value.taskStatus == true) {
      appendTaskToSection(completedTaskHolder, value, true);
    } else if (value.newTaskDate == dateVal) {
      appendTaskToSection(currentTaskHolder, value, false);
    } else {
      appendTaskToSection(upcomingTaskHolder, value, false);
    }
  }
}

startApplication();
alert(
  `3 Tasks were provided initially for reference and wont be visible in localstorage and visible if page refreshed`
);
