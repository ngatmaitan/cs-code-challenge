let taskInput = document.getElementById("new-task");
let addButton = document.getElementById("btn-add");
let incompleteTasksHolder = document.getElementById("incomplete-tasks");
let completedTasksHolder = document.getElementById("completed-tasks");

// initalizing arrays to be similar to start of the challenge
let todos = ["Pay Bills", "Go Shopping"];
let completedTodos = ["See Doctor"];

/**
 * renders each task list
 * @param {object} tasksHolder - tasks holder dom element
 * @param {string} tasksCookieArrayName - name of cookie array (should be same as tasksArrayName)
 * @param {function} checkBoxEventHandler - taskCompleted if Todos, taskIncomplete if completedTodos
 */
const renderList = function (
  tasksHolder,
  tasksCookieArrayName,
  checkBoxEventHandler
) {
  let listItem;

  // remove all tasks in list to avoid duplication
  if (tasksHolder.childElementCount !== 0) {
    while (tasksHolder.firstChild) {
      tasksHolder.removeChild(tasksHolder.firstChild);
    }
  }

  JSON.parse(localStorage.getItem(tasksCookieArrayName)).forEach((task) => {
    listItem = createNewTaskElement(task);
    tasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, checkBoxEventHandler);
    if (checkBoxEventHandler === taskIncomplete) {
      listItem = listItem
        .querySelector('input[type="checkbox"]')
        .setAttribute("checked", "true");
    }
  });
};

const isATodo = (element) => {
  return todos.some((listItem) => listItem === element);
};

const isACompletedTodo = (element) => {
  return completedTodos.some((listItem) => listItem === element);
};

const addTask = function () {
  let listItem;
  let listItemName = taskInput.value;
  if (listItemName !== "") {
    listItem = createNewTaskElement(listItemName);
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    todos.push(taskInput.value);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderList(incompleteTasksHolder, "todos", taskCompleted);

    taskInput.value = "";
  } else {
    alert("You must fill out the field.");
  }
};

const createNewTaskElement = function (taskName) {
  let listItem = document.createElement("li");
  let editInputContainer = document.createElement("div");
  let buttonContainer = document.createElement("div");
  let checkBox = document.createElement("input");
  let label = document.createElement("label");
  let editInput = document.createElement("input");
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  checkBox.setAttribute("role", "checkbox");
  checkBox.setAttribute("aria-label", taskName);
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskName;

  editInputContainer.classList.add("task-inputcontainer");
  buttonContainer.classList.add("task-buttoncontainer");

  editInputContainer.appendChild(checkBox);
  editInputContainer.appendChild(label);
  editInputContainer.appendChild(editInput);
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);
  listItem.appendChild(editInputContainer);
  listItem.appendChild(buttonContainer);

  return listItem;
};

/**
 * updates cookies
 * @param {string} listItemName - name of task
 * @param {array} tasksArrayName - name of tasks array
 * @param {string} tasksCookieArrayName - (optional) name of cookie array (should be same as tasksArrayName) OR if set to 'updateBothArrays' then updates both cookies
 * @param {string} updatedValue - (optional) updated task name
 **/
const updateLocalStorage = function (
  listItemName,
  tasksArrayName,
  tasksCookieArrayName,
  updatedValue
) {
  let listItemIndex = tasksArrayName.indexOf(listItemName);
  if (updatedValue && tasksArrayName) {
    tasksArrayName.splice(listItemIndex, 1, updatedValue);
  } else {
    tasksArrayName.splice(listItemIndex, 1);
  }

  if (tasksCookieArrayName === "updateBothArrays") {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  } else {
    localStorage.setItem(tasksCookieArrayName, JSON.stringify(tasksArrayName));
  }
};

const updateTaskCookieName = function (listItemName, updatedValue) {
  if (isATodo(listItemName)) {
    updateLocalStorage(listItemName, todos, "todos", updatedValue);
  } else if (isACompletedTodo(listItemName)) {
    updateLocalStorage(
      listItemName,
      completedTodos,
      "completedTodos",
      updatedValue
    );
  }
};

const editTask = function () {
  let listItem = this.parentNode.parentNode;
  let editInput = listItem.querySelector("input[type='text']");
  let label = listItem.querySelector("label");
  let button = listItem.querySelector(".edit");

  editInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      updateTaskCookieName(label.innerText, editInput.value);
      label.innerText = editInput.value;
      button.innerText = "Edit";
      listItem.classList.toggle("editMode");
    }
  });

  // if in editMode, checks to see input box is empty
  // if input box not empty, checks to see whether edited task
  // is in Todos list or completedTodos list and updates each list
  // and each cookie accordingly
  if (listItem.classList.contains("editMode")) {
    if (editInput.value !== "") {
      updateTaskCookieName(label.innerText, editInput.value);
      label.innerText = editInput.value;
      button.innerText = "Edit";
      listItem.classList.toggle("editMode");
    } else {
      alert("You must fill out the field.");
    }
  } else {
    editInput.value = label.innerText;
    button.innerText = "Save";
    listItem.classList.toggle("editMode");
  }
};

const deleteTask = function () {
  let listItem = this.parentNode.parentNode;
  let ul = listItem.parentNode;
  ul.removeChild(listItem);
  if (isATodo(listItem.querySelector("label").innerText)) {
    updateLocalStorage(
      listItem.querySelector("label").innerText,
      todos,
      "todos"
    );
  } else if (isACompletedTodo(listItem.querySelector("label").innerText)) {
    updateLocalStorage(
      listItem.querySelector("label").innerText,
      completedTodos,
      "completedTodos"
    );
  }
};

const taskCompleted = function () {
  let listItem = this.parentNode.parentNode;
  completedTasksHolder.appendChild(listItem);
  completedTodos.push(listItem.querySelector("label").innerText);
  bindTaskEvents(listItem, taskIncomplete);
  updateLocalStorage(
    listItem.querySelector("label").innerText,
    todos,
    "updateBothArrays"
  );
};

const taskIncomplete = function () {
  let listItem = this.parentNode.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  todos.push(listItem.querySelector("label").innerText);
  bindTaskEvents(listItem, taskCompleted);
  updateLocalStorage(
    listItem.querySelector("label").innerText,
    completedTodos,
    "updateBothArrays"
  );
};

const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  let checkBox = taskListItem.querySelector("input[type=checkbox]");
  let editButton = taskListItem.querySelector(".edit");
  let deleteButton = taskListItem.querySelector(".delete");
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};

const init = function () {
  if (
    !localStorage.getItem("todos") ||
    !localStorage.getItem("completedTodos")
  ) {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  }

  todos = JSON.parse(localStorage.getItem("todos"));
  completedTodos = JSON.parse(localStorage.getItem("completedTodos"));

  renderList(incompleteTasksHolder, "todos", taskCompleted);
  renderList(completedTasksHolder, "completedTodos", taskIncomplete);
};

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});
init();
