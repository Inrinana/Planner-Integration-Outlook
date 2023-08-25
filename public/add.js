var taskInput=document.getElementById("new-task");//Add a new task.
var addButton=document.getElementById("button");//first button
var incompleteTaskHolder=document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var completedTasksHolder=document.getElementById("completed-tasks");//completed-tasks

var createNewTaskElement=function(taskString,taskId, taskType, meetDate){

	var listItem=document.createElement("li");
	var taskTypeParagraph = document.createElement("p"); // Создаем элемент p
	var checkBox=document.createElement("input");//checkbx
	var label=document.createElement("label");//label
	var editInput=document.createElement("input");//text
	var meetingDate = document.createElement("label");
	var dateInput = document.createElement('input');
	
	meetingDate.innerText = meetDate 
	
	var editButton=document.createElement("button");//edit button
	var deleteButton=document.createElement("button");//delete button

	label.innerText=taskString;

	checkBox.type="checkbox";
	editInput.setAttribute('type', 'text');
	editInput.setAttribute('value', taskString);
	editInput.setAttribute('id', taskId);
	editInput.setAttribute('name', 'task');
	dateInput.setAttribute('value',meetDate);
	dateInput.setAttribute('type', 'text');
	dateInput.setAttribute('name', 'dateofend');

	editButton.innerText="Edit";//innerText encodes special characters, HTML does not.
	editButton.className="edit";
	deleteButton.innerText="Delete";
	deleteButton.className="delete";

	taskTypeParagraph.innerText = taskType; // Задаем текст элемента p

	if (taskType == 'Встреча') {
		listItem.appendChild(taskTypeParagraph); // Добавляем элемент p в элемент li
		listItem.appendChild(label);
		listItem.appendChild(editInput);
		listItem.appendChild(editButton);
		listItem.appendChild(deleteButton);
		listItem.appendChild(meetingDate);
		listItem.appendChild(dateInput);
		return listItem;
	} else{
		listItem.appendChild(taskTypeParagraph); // Добавляем элемент p в элемент li
		listItem.appendChild(checkBox);
		listItem.appendChild(label);
		listItem.appendChild(editInput);
		listItem.appendChild(editButton);
		listItem.appendChild(deleteButton);
		return listItem;
	}
}

var addTask=function(){
	console.log("Add Task...");
	const randomIndex = parseFloat(Math.random().toFixed(6));
	console.log(randomIndex)
	taskInput.id=randomIndex

	var selectedTaskType = document.getElementById("taskCategory").value;
	var getNum = document.getElementsByName('taskname')[0].value
	var getID = document.getElementsByName('taskname')[0].id
	var getTaskType = selectedTaskType; // Получаем выбранный тип задачи

	if (selectedTaskType=='Встреча') {
		var meetingTime = document.getElementById("start").value.split('T').join(' ').split('.')[0];
		var listItem=createNewTaskElement(taskInput.value,taskInput.id, selectedTaskType,meetingTime);
		incompleteTaskHolder.appendChild(listItem);
    	bindTaskEvents(listItem, taskCompleted);
		taskInput.value = "";
		return [getNum, getID, getTaskType, meetingTime];
	} else {
		var listItem=createNewTaskElement(taskInput.value,taskInput.id, selectedTaskType);
		incompleteTaskHolder.appendChild(listItem);
    	bindTaskEvents(listItem, taskCompleted);
		taskInput.value = "";
		return [getNum, getID, getTaskType];
	}
};

var editTask=function(){

var listItem=this.parentNode;

var editInput=listItem.querySelector('input[name=task]');
var label=listItem.querySelector("label");
var date = listItem.querySelectorAll('label')[1];
var dateInput = listItem.querySelector('input[name=dateofend]');
var containsClass=listItem.classList.contains("editMode");
		if(containsClass){
			label.innerText=editInput.value
			var parent = document.querySelector('.editMode');
			var getEditTask = parent.querySelector('input[name=task]').value
			var getEditID = parent.querySelector('input[name=task]').id
				if (dateInput != null) {
					date.innerText=dateInput.value
					var getEditDate = parent.querySelector('input[name=dateofend]').value
				} else {
					var getEditDate = undefined}
				$.ajax({
					type: "POST",
					url: "edit_task", // Укажите URL для вашего POST-запроса
					data: { editInput: getEditTask,
							taskID: getEditID,
							date: getEditDate}, // Передаем данные в запросе
					success: function(response) {
						// Обрабатываем успешный ответ от сервера
						console.log("Задача успешно добавлена:", response);
					},
					error: function(error) {
						// Обрабатываем ошибку
						console.error("Произошла ошибка:", error);
					}
				});
				label.innerText=editInput.value;
			}else{
				editInput.value=label.innerText;
						
		}
		listItem.classList.toggle("editMode");
}

var deleteTask=function(){
		console.log("Delete Task...");
		var listItem=this.parentNode;
		var deleteInput=listItem.querySelector('input[name=task]');
		var getDeleteTask = deleteInput.value
		var getDeleteID = deleteInput.id
				$.ajax({
					type: "POST",
					url: "delete_task", // Укажите URL для вашего POST-запроса
					data: { deleteInput: getDeleteTask,
							taskID: getDeleteID}, // Передаем данные в запросе
					success: function(response) {
						// Обрабатываем успешный ответ от сервера
						console.log("Задача успешно удалена:", response);
					},
					error: function(error) {
						// Обрабатываем ошибку
						console.error("Произошла ошибка:", error);
					}
				});
		var ul=listItem.parentNode;
		ul.removeChild(listItem);

}

var taskCompleted=function(){
	console.log("Complete Task...");
	var listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
	var CompleteId = listItem.querySelectorAll('input[type=text]')[0].id
	console.log(CompleteId);
	$.ajax({
		type: "POST",
		url: "complete_incomplete", // Укажите URL для вашего POST-запроса
		data: {taskID: CompleteId}, // Передаем данные в запросе
		error: function(error) {
			// Обрабатываем ошибку
			console.error("Произошла ошибка:", error);
		}
	});
	bindTaskEvents(listItem, taskIncomplete);
}

var taskIncomplete=function(){
	console.log("Incomplete Task...");
	var listItem=this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
	var CompleteId = listItem.querySelectorAll('input[type=text]')[0].id
	console.log(CompleteId);
	$.ajax({
		type: "POST",
		url: "complete_incomplete", // Укажите URL для вашего POST-запроса
		data: {taskID1: CompleteId}, // Передаем данные в запросе
		success: function(response) {
			// Обрабатываем успешный ответ от сервера
			console.log("Задача успешно удалена:", response);
		},
		error: function(error) {
			// Обрабатываем ошибку
			console.error("Произошла ошибка:", error);
		}
	});
	bindTaskEvents(listItem,taskCompleted);
}

	var ajaxRequest = async function(){
		const taskArr = await addTask(); // Получаем значение и id в массиве
		const taskName = taskArr[0]
		const taskID = taskArr[1]
		const taskCategory = taskArr[2]
		const taskTime = taskArr[3]
		$.ajax({
			type: "POST",
			url: "insert_task", // Укажите URL для вашего POST-запроса
			data: { taskname: taskName,
					taskID: taskID,
					tasktype: taskCategory,
					tasktime: taskTime}, // Передаем данные в запросе
			success: function(response) {
				// Обрабатываем успешный ответ от сервера
				console.log("Задача успешно добавлена:", response);
			},
			error: function(error) {
				// Обрабатываем ошибку
				console.error("Произошла ошибка:", error);
			}
		});
		console.log(taskName);
		console.log(taskID);
	};
	
addButton.addEventListener("click",ajaxRequest);

var bindTaskEvents=function(taskListItem,checkBoxEventHandler){
	console.log("bind list item events");
	var checkBox=taskListItem.querySelector("input[type=checkbox]");
	var editButton=taskListItem.querySelector("button.edit");
	var deleteButton=taskListItem.querySelector("button.delete");

	editButton.onclick=editTask;
	deleteButton.onclick=deleteTask;
	if (checkBox != null) {
		checkBox.onchange=checkBoxEventHandler;
	}
}
	for (var i=0; i<incompleteTaskHolder.children.length;i++){
		bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
	}

	for (var i=0; i<completedTasksHolder.children.length;i++){
		bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
	}

	document.addEventListener("DOMContentLoaded", Date_Min());
  function Date_Min() {
    var now = new Date().toJSON().slice(0, 16);
    document.getElementById("start").min = now
  }

  taskInput.addEventListener("keypress", function(event) {
	if (event.key === 'Enter')
		addButton.click();
});