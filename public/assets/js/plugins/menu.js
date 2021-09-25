let categorias = [{
        "categoria":"portugues",
        "valor":"Português"
    },{
        "categoria":"geral",
        "valor":"Cultura-Geral"
    },{
        "categoria":"biologia",
        "valor":"Biologia"
    },{
        "categoria":"matematica",
        "valor":"Matemática"
    },{
        "categoria":"Física",
        "valor":"Física"
    },{
        "categoria":"quimica",
        "valor":"Química"
    },{
        "categoria":"historia",
        "valor":"História"
    }
];
let disciplina = document.getElementById('menuSelect');
let messageBox = document.getElementById('messageBox');
let msgTitle = document.getElementById('messageTitle');
let BtnStart = document.getElementById('BtnStart');
const message = "Selecione uma disciplina";
document.getElementById('username').innerText = localStorage.getItem('username');
$(function(){
    let selectDisciplinas;
    selectDisciplinas += `<option selected value=''>Escolher...</option>`;
    categorias.forEach(function(disciplina){
        selectDisciplinas += `<option value=${disciplina.valor}>${disciplina.valor}</option>`;
    });
    $('#menuSelect').html(selectDisciplinas);
    BtnStart.disabled = true;
});

$('#menuSelect').change(function(){
    let value = $(this).val();
    if(value != ''){
        messageBox.style.display = "none";
        msgTitle.style.display = "block";
        BtnStart.disabled = false;
    }else{
        messageBox.innerText = message;
        messageBox.style.display = "block";
        msgTitle.style.display = "none";
        BtnStart.disabled = true;
    }
});

BtnStart.onclick = function(event){
    event.preventDefault();
    if(disciplina.value != ''){
        messageBox.style.display = "none";
        msgTitle.style.display = "block";
        sessionStorage.setItem('disciplina', disciplina.value);
        window.location.href = "/game";
    }else{
        messageBox.innerText = message;
        messageBox.style.display = "block";
        msgTitle.style.display = "none";
        BtnStart.disabled = true;
    }
}