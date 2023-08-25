let calendar = document.querySelector('.calendar');

const month_names = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const days_of_week = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

generateCalendar = (month, year) => {
    let calendar_days = calendar.querySelector('.calendar-days');
    let calendar_header_year = calendar.querySelector('#year');
    let calendar_week_day = calendar.querySelector('.calendar-week-day');

    calendar_days.innerHTML = '';
    calendar_week_day.innerHTML = '';

    let currDate = new Date();
    if (typeof month === 'undefined') month = currDate.getMonth();
    if (typeof year === 'undefined') year = currDate.getFullYear();

    let curr_month = `${month_names[month]}`;
    month_picker.innerHTML = curr_month;
    calendar_header_year.innerHTML = year;

    // Get the first day of the month
    let first_day = new Date(year, month, 1);

    // Determine the number of days in the month
    let days_in_month = new Date(year, month + 1, 0).getDate();

    // Determine the day of the week (0 - 6) for the first day of the month
    let first_day_of_week = (first_day.getDay() + 6) % 7; // Adjust for starting from Monday

    // Start creating calendar cells
    for (let i = 0; i < days_of_week.length; i++) {
        let dayName = document.createElement('div');
        dayName.innerText = days_of_week[i];
        calendar_week_day.appendChild(dayName);
    }

    for (let i = 0; i < first_day_of_week; i++) {
        let empty_day = document.createElement('div');
        calendar_days.appendChild(empty_day);
    }

    for (let i = 1; i <= days_in_month; i++) {
        let day = document.createElement('div');
        day.classList.add('calendar-day-hover');
        day.innerText = i;
        
        if (i === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
            day.classList.add('curr-date');
        }

        calendar_days.appendChild(day);
    }
}

let month_list = calendar.querySelector('.month-list');

month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div data-month="${index}">${e}</div>`;
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show');
        curr_month.value = index;
        generateCalendar(index, curr_year.value);
    };
    month_list.appendChild(month);
});

let month_picker = calendar.querySelector('#month-picker');

month_picker.onclick = () => {
    month_list.classList.add('show');
};

let currDate = new Date();

let curr_month = { value: currDate.getMonth() };
let curr_year = { value: currDate.getFullYear() };

generateCalendar(curr_month.value, curr_year.value);

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value;
    generateCalendar(curr_month.value, curr_year.value);
};

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value;
    generateCalendar(curr_month.value, curr_year.value);
};


const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
let  myChart;
function createChart(allTasks, completedTasks, date_who) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = [];
for (let i = 0; i < date_who.length; i++) {
    const dayIndex = date_who[i];
    labels.push(days[dayIndex]);
}
    console.log('im draw')
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Все задачи',
                    data: allTasks,
                    backgroundColor: 'rgba(75, 192, 192, 1)', // Зеленый цвет
                    borderWidth: 1
                },
                {
                    label: 'Выполненные задачи',
                    data: completedTasks,
                    backgroundColor: 'rgba(192, 75, 192, 1)', // Мятный цвет
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function removeChart() {
    if (myChart) {
        myChart.destroy();
    }
}

function createEvent_task(arr) {
        var listItems=document.createElement('div');
        var hr=document.createElement('hr')//полоска
        var taskTypeParagraph = document.createElement("p"); // Создаем элемент p
        var taskDateParagraph = document.createElement("p"); // Создаем еще один элемент p

        listItems.setAttribute('class', 'task_days');
        var date = arr['date_end'].split('T')[1].slice(0, -11)// Дата из бд
        var date_plus = Number(date)+3 //Часы плюс 3
        var date1 = arr['date_end'].split('T')[1].slice(0, -8).replace(date,date_plus) //Время +3
        taskTypeParagraph.innerText = arr['pln_title']; // Задаем текст встречи
        taskDateParagraph.innerText = date1 
    
        listItems.appendChild(hr);
        listItems.appendChild(taskTypeParagraph); // Добавляем элемент p в элемент li
        listItems.appendChild(taskDateParagraph);
        console.log(listItems)
        return listItems;
}

document.addEventListener("DOMContentLoaded", function () {
let divs = document.querySelector('.calendar-days');
divs.addEventListener("click", function(e) {
    if (e.target.classList.contains("calendar-day-hover")){
        let menuItem = document.querySelectorAll('.calendar-day-hover');
            for(let i = 0; i < menuItem.length; i++) {
    // Убираем у всех класс с цветом
            menuItem[i].classList.remove('selected-day');
        }
    // Добавляем цвет нажатому дню
            e.target.classList.add('selected-day');
    // Работаем с датой нажатого дня
    var find_month = document.getElementById('month-picker').innerHTML;
    var num_month = month_names.findIndex(i => i == find_month)+1
    let find_year = document.getElementById('year').innerHTML;
    let find_day = e.target.textContent;
    let full_date = find_year+'-0'+num_month+'-'+find_day;
    // Отправляем выбранную дату на сервер
    fetch('/graph_route', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            full_date: full_date
        })
    })
    .then((response) => {
        return response.json();
      })
    .then((data) => {
        const allTasks = data.allTasks
        const completedTasks = data.completedTasks;
        const date_who = data.day_who;
        removeChart()
        createChart(allTasks, completedTasks, date_who);
        let task_events = data.task_event;
        let test = document.querySelectorAll('.task_days'); //ищем все уже созданные встречи
                    test.forEach(function(elem){
                        elem.parentNode.removeChild(elem);//удаляем их
                      });
        let days_all = document.querySelectorAll('.day');
        const labels = [];
        for (var j = 0; j < date_who.length; j++) {
            const dayIndex = date_who[j];
            labels.push(days[dayIndex]) //массив с нужной неделей
            }
            for (var i = 0; i < days_all.length; i++) {
                days_all[i].id = date_who[i] //присваиваем первому элементу класса day id - первый элемент массива date_who
                days_all[i].innerHTML=labels[i]
            }
        for (let i of task_events) { //массив с встречами
            for (let j of i) {
                    count = new Date(j['date_end']);
                    count1 = count.getDay()-1;
                    var listItems=createEvent_task(j);//создать встречу в функции
		            document.getElementById(count1).appendChild(listItems);}//добавление новых встреч к родителю по id
                
        }})
    .catch(error => console.error('Error fetching data:', error));
}});
})

document.addEventListener('DOMContentLoaded', function() {
    const helpLinks = document.querySelectorAll('.title');
    const helpIcons = document.querySelectorAll('.help-icon');

    helpLinks.forEach(link => {
        if (link.textContent === "Помощь") {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                modal.style.display = 'block';
            });
        }
        if (link.textContent === "Выйти") {
            link.addEventListener('click', function(event) {
                fetch(`http://localhost:3000/mail?pass=no`, {
                method: 'GET'
                })
                .then((response) => {
                  return response.json();
                })
                .then((data) => { 
                    if (data.message == 'OK'){
                    document.location.href ='http://localhost:3000/mail'}
                })
                  .catch(function(err) {
                    if (err) throw err
                    console.log(err)
                  });
                
        });
        }
    });

    helpIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            modal.style.display = 'block';
            navigation.classList.remove('active'); // Закрыть плашку
            menuToggle.classList.remove('active'); // Закрыть меню
  
    })});

    const modal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.closes');

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});