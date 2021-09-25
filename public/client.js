    document.getElementById('username').innerText = localStorage.getItem('username');
    const playerOneCreate = sessionStorage.getItem('playerOneCreate');
    const playerTwoJoin = sessionStorage.getItem('playerTwoJoin');
    const screenCreation = document.getElementById('ScreenCreation');
    const ScreenJoin = document.getElementById('ScreenJoin');
    const ScreenPlay = document.getElementById('ScreenPlay');
    const navbar = document.getElementById('navbar');
    const MultiplayerSubject = document.getElementById('MultiplayerSubject');
    const messageBoxCreate = document.getElementById('messageBoxCreate');
    const msgTitleCreate = document.getElementById('messageTitleCreate');
    const BtnPlayerOneStart = document.getElementById('BtnPlayerOneStart');
    const messageSubject = "Selecione uma disciplina";
    import questionsCategory from '/api/questions.js';

    let categorias = [
        {
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

    if(playerOneCreate == "true"){
        screenCreation.style.display = "block";
        ScreenJoin.style.display = "none";
        ScreenPlay.style.display = "none";
    }
    if(playerTwoJoin == "true"){
        screenCreation.style.display = "none";
        ScreenJoin.style.display = "block";
        ScreenPlay.style.display = "none";
        console.log('Player 2 > dentro')
    }
    
    $(function(){
        let selectDisciplinas;
        selectDisciplinas += `<option selected value=''>Escolher...</option>`;
        categorias.forEach(function(subject){
            selectDisciplinas += `<option value=${subject.valor}>${subject.valor}</option>`;
        });
        $('#MultiplayerSubject').html(selectDisciplinas);
        BtnPlayerOneStart.disabled = true;
    });

    $('#MultiplayerSubject').change(function(){
        let value = $(this).val();
        if(value != ''){
            messageBoxCreate.style.display = "none";
            msgTitleCreate.style.display = "block";
            BtnPlayerOneStart.disabled = false;
        }else{
            messageBoxCreate.innerText = messageSubject;
            messageBoxCreate.style.display = "block";
            msgTitleCreate.style.display = "none";
            BtnPlayerOneStart.disabled = true;
        }
    });
    
    BtnPlayerOneStart.onclick = function(event){
        event.preventDefault();
        if(disciplina.value != ''){
            messageBoxCreate.style.display = "none";
            msgTitleCreate.style.display = "block";
            sessionStorage.setItem('MultiplayerSubject', MultiplayerSubject.value);
            createRoom({subject : MultiplayerSubject.value});
        }else{
            messageBoxCreate.innerText = messageSubject;
            messageBoxCreate.style.display = "block";
            msgTitleCreate.style.display = "none";
            BtnPlayerOneStart.disabled = true;
        }
    }

    const message = "Forneça o seu convite";
    let convite = document.getElementById('convite');
    let btnJoinGame = document.getElementById('btnJoinGame');
    let messageBox = document.getElementById('messageBox');
    let messageTitle = document.getElementById('messageTitle');

    btnJoinGame.disabled = true;
    
    function eVazio(){
        if (convite.value === '') {
            return true;
        }else {
            return false;
        }
    }
    convite.onfocus = function foco(){
        messageBox.style.display = "none";
        messageTitle.style.display = "block";
        btnJoinGame.disabled = false;
    }
    convite.onblur = function desfoco(){
        if(eVazio()){
            messageBox.innerText = message;
            messageBox.style.display = "block";
            messageTitle.style.display = "none";
            btnJoinGame.disabled = true;
        }
    }

    btnJoinGame.onclick = function(event){
        event.preventDefault();
        if(convite.value === ''){
            messageBox.innerText = message;
            messageBox.style.display = "block";
        }else{
            localStorage.setItem('convite', convite.value);
            window.location.href = "/home";
        }
    }

    function initialScreen(){
        navbar.style.display = 'nome';
        screenCreation.style.display = "none";
        ScreenJoin.style.display = "none";
        ScreenWaiting.style.display = "none";
        ScreenPlay.style.display = "block";
    }

    //Sockets
    var socket = io();
    const btnSendInvite = document.getElementById('btnSendInvite');
    const ShowInvite = document.getElementById('ShowInvite');
    const ScreenWaiting = document.getElementById('ScreenWaiting');
    const codeInvite = document.getElementById('convite');
    const JoinGame = document.getElementById('btnJoinGame');
    const user1 = document.getElementById('user1');
    const user2 = document.getElementById('user2');
    const user1Points = document.getElementById('points1');
    const user2Points = document.getElementById('points2');
    const namePlayerNow = document.getElementById('namePlayerNow');
    const idPlayerNow = document.getElementById('idPlayerNow');
    const progressBar = document.getElementById('progress');

    let result = document.getElementById('endGame');
    let playing = document.getElementById('playing');
    let subject = document.getElementById('disciplina');
    
    let resultMessage = document.getElementById('result');
    let resultImage = document.getElementById('image');
    
    let levelComplete = document.getElementById('nivel');
    let btnBox = document.getElementById('btnBox');

    function createRoom(data){
        console.log(data);
        const questions = questionsCategory(data.subject);
        console.log(questions)
        const dados = {
            questions: questions,
            player: localStorage.getItem('username')
        }
        socket.emit('createRoom', dados);
    }
    
    socket.on('createdRoom', function startGame(codeInvite){
        console.log(codeInvite);
        console.log('Esperando o adversário');
        ShowInvite.innerText = codeInvite;
        btnSendInvite.href = `http://api.whatsapp.com/send?text=${codeInvite}`;
        navbar.style.display = 'nome';
        screenCreation.style.display = "none";
        ScreenJoin.style.display = "none";
        ScreenPlay.style.display = "none";
        ScreenWaiting.style.display = "block";
    });

    JoinGame.onclick = function(){
        const data = {
            codeInvite: codeInvite.value,
            player: localStorage.getItem('username')
        }
        if(codeInvite.value != '') {
            socket.emit('joinRoom', data);
            initialScreen();
        }             
    }
    
    socket.on('startGame', function startGame(game){
        user1.innerText = game.player1.name;
        user2.innerText = game.player2.name;
        user1Points.innerText = game.player1.currentScore;
        user2Points.innerText = game.player2.currentScore;
        idPlayerNow.innerText = game.playerNow.id;
        namePlayerNow.innerText = game.playerNow.name;
        progressBar.style.width = game.player1.progress+'%';
        console.log('Jogo Iniciou');
        initialScreen();
        enableOption();
        const q = game.GameState.question;
        const level = game.GameState.level;
        showQuestion(q,level);
    });

    let options = document.querySelectorAll('label');

    function enableOption(){
        options[0].onclick = function(){socket.emit('checkAnswer',{answer:1, player: socket.id});}
        options[1].onclick = function(){socket.emit('checkAnswer',{answer:2, player: socket.id});}
        options[2].onclick = function(){socket.emit('checkAnswer',{answer:3, player: socket.id});}
        options[3].onclick = function(){socket.emit('checkAnswer',{answer:4, player: socket.id});}
    }

    function disableOption(){
        options[0].onclick = function(){}
        options[1].onclick = function(){}
        options[2].onclick = function(){}
        options[3].onclick = function(){}
    }

    socket.on('player', function(players){
        
    });

    socket.on('result', function(resultState) {

        if (resultState.status) {
            options[resultState.answer-1].style.backgroundColor = '#28a745';
        } else{
            options[resultState.answer-1].style.backgroundColor = '#e42d3b';
            options[resultState.correct-1].style.backgroundColor = '#28a745';
        }
        setTimeout(()=>{
            options.forEach(element => {
                element.style.backgroundColor = '#0c4b33';
            });
            progressBar.style.width = resultState.player1.progress+'%';
            user1Points.innerText = resultState.player1.currentScore;
            user2Points.innerText = resultState.player2.currentScore;
        }, 1500);

        setTimeout(() => { 
            
            if(resultState.gameState === 'endGame'){
                playing.style.display = 'none';
                result.style.display = 'block';
                
                resultImage.src = "/assets/img/win1.png";
                
                btnBox.innerHTML = `
                    <div class="col-6">
                        <button class="btn btn_area btn-block" id="BtnL1" onclick="endGameOption('restart')"><i class="fa fa-refresh fa-lg fa-fw"></i>Reiniciar</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-danger btn-block" id="BtnL2" onclick="endGameOption('quit')"><i class="fa fa-times fa-lg fa-fw"></i>sair</button>
                    </div>
                `;

                if(resultState.player1.attrStatus === 'win'){
                    idPlayerNow.innerText = resultState.player1.id;
                    namePlayerNow.innerText = `${resultState.player1.name} Ganhou`;
                }else{
                    idPlayerNow.innerText = resultState.player2.id;
                    namePlayerNow.innerText = `${resultState.player2.name} Ganhou`;
                }
                
            }else{
                idPlayerNow.innerText = resultState.playerNow.id;
                namePlayerNow.innerText = resultState.playerNow.name;
    
                const q = resultState.question;
                const level = resultState.level;
                enableOption();
                showQuestion(q,level);
            }
            
        }, 1500);
        
    });

    function showQuestion(q,level){
        const question = document.getElementById('perguntas');
        const options = document.querySelectorAll('label');

        question.innerText = q.question;
        options[0].innerText = q.option1;
        options[1].innerText = q.option2;
        options[2].innerText = q.option3;
        options[3].innerText = q.option4;
        progressBar.style.backgroundColor = level.optionBG
        question.style.border = level.questionBorder;
        question.style.backgroundColor = level.questionBG
        question.style.color = level.questionColor;
        options[0].style.backgroundColor = level.optionBG;
        options[1].style.backgroundColor = level.optionBG;
        options[2].style.backgroundColor = level.optionBG;
        options[3].style.backgroundColor = level.optionBG;
        enableOption();
    }

    disableOption();