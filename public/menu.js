

let menuToggle = document.querySelector('.toggle');
let navigation = document.querySelector('.navigation');
let blur1 = document.querySelector('.blur');


menuToggle.onclick = function(){
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
    blur1.classList.toggle('wrapper');
}

let list = document.querySelectorAll('.list');
for (let i = 0; i < list.length; i++) {
    list[i].onclick = function(){
        let j = 0;
        while(j < list.length){
            list[j++].className = 'list';
        }
        list[i].className = 'list active';
    }
}