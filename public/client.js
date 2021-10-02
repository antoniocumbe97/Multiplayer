//######################### Variáveis ##############################
    //Sockets
    var socket = io();

    // Detectar se o Jogador clicou (Nova sala || Entrar na sala) 
    const playerOneCreateRoom = sessionStorage.getItem('playerOneCreateRoom');
    const playerTwoJoinRoom = sessionStorage.getItem('playerTwoJoinRoom');
    
    //Divisão do "Páginas"
    const pageCreateRoom = document.getElementById('pageCreateRoom');
    const pageJoinRoom = document.getElementById('pageJoinRoom');
    const pageRoom = document.getElementById('pageRoom');
    const pageNewGame = document.getElementById('pageNewGame');
    const pageGame = document.getElementById('pageGame');
    const pageEndGame = document.getElementById('pageEndGame');

    //######################### Renderizar a página certa ##############################
    if(playerOneCreateRoom == "true"){
        pageCreateRoom.style.display = "block";
        pageJoinRoom.style.display = "none";
        pageRoom.style.display = "none";
        pageNewGame.style.display = "none";
        pageGame.style.display = "none";
        pageEndGame.style.display = "none";
        createRoom();
    }
    if(playerTwoJoinRoom == "true"){
        pageCreateRoom.style.display = "none";
        pageJoinRoom.style.display = "block";
        pageRoom.style.display = "none";
        pageNewGame.style.display = "none";
        pageGame.style.display = "none";
        pageEndGame.style.display = "none";
    }

//######################### pageCreateRoom ##############################
    const btnSendInvite = document.getElementById('btnSendInvite');
    const ShowInvite = document.getElementById('ShowInvite');
    
    function createRoom(){
        const dados = {
            player: localStorage.getItem('username')
        }
        socket.emit('createRoom', dados);
    }
    socket.on('createdRoom', function startGame(codeInvite){
        ShowInvite.innerText = codeInvite;
        btnSendInvite.href = `http://api.whatsapp.com/send?text=${codeInvite}`;
    });
//######################### pageJoinRoom ##############################
    const codeInvite = document.getElementById('convite');
    const JoinGame = document.getElementById('btnJoinGame');
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

    JoinGame.onclick = () => {
        const data = {
            codeInvite: codeInvite.value,
            player: localStorage.getItem('username')
        }
        if(codeInvite.value != '') {
            socket.emit('joinRoom', data);
        }
    }

    socket.on('joinedRoom', (data) => {
        pageCreateRoom.style.display = "none";
        pageJoinRoom.style.display = "none";
        pageRoom.style.display = "block";
    });
//######################### pageRoom ##############################
    const otherPlayer = document.getElementById('NameOtherPlayer');
    const otherPlayerId = document.getElementById('idOtherPlayer');
    const btnNewGame = document.getElementById('btnNewGame');
    socket.on('otherPlayer', (data) => {
        otherPlayer.innerText = data.name;
        otherPlayerId.innerText = data.id;
    });
    btnNewGame.onclick = () =>{
        socket.emit('openNewGame', {playerId: socket.id});
    }
    
//######################### pageNewGame ##############################
    const MultiplayerSubject = document.getElementById('MultiplayerSubject');
    const messageBoxCreate = document.getElementById('messageBoxCreate');
    const msgTitleCreate = document.getElementById('messageTitleCreate');
    const BtnStart = document.getElementById('BtnStart');
    const messageSubject = "Selecione uma disciplina";
    import getSubjects from '/api/subject.js';
    import questionsCategory from '/api/questions.js';
    
    socket.on('formNewGame', () => {
        pageCreateRoom.style.display = "none";
        pageJoinRoom.style.display = "none";
        pageRoom.style.display = "none";
        pageNewGame.style.display = "block";
        pageGame.style.display = "none";
        pageEndGame.style.display = "none";
    });
    socket.on('setDisableTrue', () => {
        MultiplayerSubject.disabled = false;
    });
    $(function(){
        let selectDisciplinas;
        const subjects = getSubjects();
        selectDisciplinas += `<option selected value=''>Escolher...</option>`;
        subjects.forEach(function(subject){
            selectDisciplinas += `<option value=${subject.valor}>${subject.valor}</option>`;
        });
        $('#MultiplayerSubject').html(selectDisciplinas);
        BtnStart.disabled = true;
    });

    $('#MultiplayerSubject').change(function(){
        let value = $(this).val();
        if(value != ''){
            messageBoxCreate.style.display = "none";
            msgTitleCreate.style.display = "block";
            BtnStart.disabled = false;
        }else{
            messageBoxCreate.innerText = messageSubject;
            messageBoxCreate.style.display = "block";
            msgTitleCreate.style.display = "none";
            BtnStart.disabled = true;
        }
    });
    function newGame(data){
        const questions = questionsCategory(data.subject);
        const dados = {
            subject: data.subject,
            questions: questions
        }
        socket.emit('newGame', dados);
    }
    BtnStart.onclick = function(event){
        event.preventDefault();
        if(disciplina.value != ''){
            messageBoxCreate.style.display = "none";
            msgTitleCreate.style.display = "block";
            sessionStorage.setItem('MultiplayerSubject', MultiplayerSubject.value);
            newGame({subject : MultiplayerSubject.value});
        }else{
            messageBoxCreate.innerText = messageSubject;
            messageBoxCreate.style.display = "block";
            msgTitleCreate.style.display = "none";
            BtnStart.disabled = true;
        }
    }
//######################### pageGame ##############################
    const namePlayerNow = document.getElementById('namePlayerNow');
    const idPlayerNow = document.getElementById('idPlayerNow');
    const user1Points = document.getElementById('points1');
    const user2Points = document.getElementById('points2');
    const user1 = document.getElementById('user1');
    const user2 = document.getElementById('user2');
    const progressBar = document.getElementById('progress');
    const question = document.getElementById('question');
    const options = document.querySelectorAll('label');
    

    socket.on('startedGame', function startGame(game){
        user1.innerText = game.player1.name;
        user2.innerText = game.player2.name;
        user1Points.innerText = game.player1.currentScore;
        user2Points.innerText = game.player2.currentScore;
        idPlayerNow.innerText = game.playerNow.id;
        namePlayerNow.innerText = game.playerNow.name;
        progressBar.style.width = game.player1.progress+'%';

        pageCreateRoom.style.display = "none";
        pageJoinRoom.style.display = "none";
        pageRoom.style.display = "none";
        pageNewGame.style.display = "none";
        pageGame.style.display = "block";
        pageEndGame.style.display = "none";
        
        const q = game.question;
        const level = game.level;
        showQuestion(q,level);
    });

    function showQuestion(q,level){
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

    function enableOption(){
        options[0].onclick = () => {socket.emit('checkAnswer',{answer:1, player: socket.id});}
        options[1].onclick = () => {socket.emit('checkAnswer',{answer:2, player: socket.id});}
        options[2].onclick = () => {socket.emit('checkAnswer',{answer:3, player: socket.id});}
        options[3].onclick = () => {socket.emit('checkAnswer',{answer:4, player: socket.id});}
    }

    function disableOption(){
        options[0].onclick = function(){}
        options[1].onclick = function(){}
        options[2].onclick = function(){}
        options[3].onclick = function(){}
    }

    socket.on('result', function(resultState) {
        if(parseInt(resultState.answer) !== 0){
            if (resultState.statusAnswer) {
                options[resultState.answer-1].style.backgroundColor = '#28a745';
            } else{
                options[resultState.answer-1].style.backgroundColor = '#e42d3b';
                options[resultState.correct-1].style.backgroundColor = '#28a745';
            }
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
                //######################### pageEndGame ##############################

                pageCreateRoom.style.display = "none";
                pageJoinRoom.style.display = "none";
                pageRoom.style.display = "none";
                pageNewGame.style.display = "none";
                pageGame.style.display = "none";
                pageEndGame.style.display = "block";

                const subject = document.getElementById('disciplina');
                const resultImage = document.getElementById('image');
                const btnBox = document.getElementById('btnBox');
                const namePlayerWin = document.getElementById('namePlayerWin');
                const idPlayerWin = document.getElementById('idPlayerWin');

                
                
                document.getElementById('Player1Name').innerText = resultState.player1.name;
                document.getElementById('Player1CurrentScore').innerText = resultState.player1.currentScore
                document.getElementById('Player1CountCorrect').innerText = resultState.player1.countCorrect;
                document.getElementById('Player1CountIncorrect').innerText = resultState.player1.countIncorrect;
                document.getElementById('Player1CountTotal').innerText = resultState.player1.countTotal;

                document.getElementById('Player2Name').innerText = resultState.player2.name;
                document.getElementById('Player2CurrentScore').innerText = resultState.player2.currentScore;
                document.getElementById('Player2CountCorrect').innerText = resultState.player2.countCorrect;
                document.getElementById('Player2CountIncorrect').innerText = resultState.player2.countIncorrect;
                document.getElementById('Player2CountTotal').innerText = resultState.player2.countTotal;
                
                subject.innerText = resultState.subject;
                btnBox.innerHTML = `
                    <div class="col-6">
                        <button class="btn btn_area btn-block" id="btnRestart">Novo Jogo <i class="fa fa-plus fa-lg fa-fw"></i></button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-danger btn-block" id="btnLeaveRoom">Sair da sala <i class="fa fa-home fa-lg fa-fw"></i></button>
                    </div>
                `;
                document.getElementById('btnRestart').onclick = function(){
                    socket.emit('openNewGame', {playerId: socket.id});
                }
                document.getElementById('btnLeaveRoom').onclick = function(){
                    window.location.href = "/home";
                }

                if(resultState.player1.attrStatus === 'win'){
                    idPlayerWin.innerText = resultState.player1.id;
                    namePlayerWin.innerText = `${resultState.player1.name} Ganhou`;
                }else{
                    idPlayerWin.innerText = resultState.player2.id;
                    namePlayerWin.innerText = `${resultState.player2.name} Ganhou`;
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

    disableOption();
