let tasks = [];

function addTask(event){
    event.preventDefault();
    let link=document.getElementById('input-text');
    let task=link.value.trim();
    tasks.push({text: task});

    link.value ="";

    renderTasks();
    
}
function renderTasks() {

    const ul=document.getElementById("taskList");
ul.innerHTML = "";

    tasks.forEach((item) => {
        console.log(item)
        const li = document.createElement("li");
        li.textContent = item.text;
        console.log(li.textContent);
        ul.appendChild(li);
     })
};

