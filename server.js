const express = require('express');
const app = express();

const PORT = process.env.PORT || 5500;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const Levels =[{
	"level":"1",
	"optionBG":"#0c4b33",
	"optionColor":"#f5f5f5",
	"questionBG":"#d4edda",
	"questionBorder":"#bee5eb",
	"questionColor":"#155724",	
},{
	"level":"2",
	"optionBG":"#563d7c",
	"optionColor":"#f5f5f5",
	"questionBG":"#d5d0df",
	"questionBorder":"1px solid #bbadd2",
	"questionColor":"#004085",
},{
	"level":"3",
	"optionBG":"#721c24",
	"optionColor":"#f5f5f5",
	"questionBG":"#f8d7da",
	"questionBorder":"1px solid #d6a7ab",
	"questionColor":"#004085",
},{
	"level":"4",
	"optionBG":"#002752",
	"optionColor":"#f5f5f5",
	"questionBG":"#cce5ff",
	"questionBorder":"1px solid #6badd6",
	"questionColor":"#004085",
},{
	"level":"5",
	"optionBG":"#383d41",
	"optionColor":"#f5f5f5",
	"questionBG":"#e2e3e5",
	"questionBorder":"1px solid #d6d8db",
	"questionColor":"#383d41",
},{
	"level":"6",
	"optionBG":"#820053",
	"optionColor":"#f5f5f5",
	"questionBG":"#5e003c",
	"questionBorder":"1px solid #d6d8db",
	"questionColor":"#ffffff",
}];

const Question = {
	current: Number,
	sequence: Array,
	all: Array,
	next(){
		if(this.current < this.all.length-1){
			this.current++;
			return true;
		}
		return false;
	},
	show(){
		return this.all[this.sequence[this.current]];
	},
	check(answer){
		if ((this.all[this.sequence[this.current]].answer) == answer) {
			return true;		
		} else{
			return false;
		}
	}
}

let Quiz = {
	username: String,
	subject: String,
	level: Number,
	countTotal: Number,
	countIncorrect: Number,
	currentScore: Number,
	countCorrect: Number,
	progress: Number,
	pause: Boolean,
	attrStatus: String,
	status(){
		if(this.countIncorrect === 4){
			this.attrStatus = 'lost';
		}else if(this.countCorrect === (this.level*6)){
			this.attrStatus = 'win';
		}
		return this.attrStatus;
	},
}

const Timer = {
	secunds: Number,
	minutes: Number
}

function randomQuestions(){
	const SizeQuestions = Question.all.length;
	let num = new Array(SizeQuestions);
	for(let i=0; i<SizeQuestions; i++){ //laço para percorrer todo o vetor
		let randomNumber = Math.floor(Math.random()*SizeQuestions); //gerando número aleatório
		let found = false; //para saber se o numero foi encontrado ou não no vetor
		for(let count=0; count<i; count++){ //função que percorre o vetor até onde já tenha sido preenchido
			if(num[count] == randomNumber){ //verifica se o item no vetor é igual ao gerado
				found = true; //se é igual a variável found recebe verdadeiro
				break; //e o laço de verificação é interrompido
			}else{//se não é igual
				found = false; //variável found recebe falso
			}
		} //fim do laço que verifica a existência do numero no vetor
		if(!found){ //se found é igual a false
			num[i] = randomNumber; //o indice do vetor recebe o número gerado
		}else{ //se é verdadeiro
			i--; //o índice é decrementado para que haja um novo teste
		}
	} // fim do laço que percorre todo o vetor
	return num;
}

function initialState(questionsCategory){
	Question.all = questionsCategory;
	Question.sequence = randomQuestions();
	Question.current = 0;
	Quiz.attrStatus = 'playing';
	Quiz.level = 1;
	Quiz.progress = 50;
	Quiz.countTotal = 0;
	Quiz.currentScore = 0;
  	Quiz.countCorrect = 0;
	Quiz.countIncorrect = 0;
}

const game = {
  players : {},
  rooms : {},
}

io.on('connection', (socket) => {
  //adicionar player conectado ao socket
  const name = `Player_${socket.id}`;
  game.players[socket.id] = {name};

  socket.on('createRoom', (data) => {
    const roomId = socket.id;
    socket.join(roomId);
	game.players[socket.id].id = `Player_${socket.id}`;
	game.players[socket.id].name = data.player;
    game.rooms[roomId] = {
      player1 : game.players[socket.id],
      player2 : undefined,
      status: false
    }
	game.players[socket.id].room = roomId;
	initialState(data.questions);
	game.rooms[roomId].GameState = {
		question: Question.show(),
		attrStatus : Quiz.attrStatus,
		level : Levels[Quiz.level-1]
	}
	game.rooms[roomId].player1.progress = Quiz.progress;
	game.rooms[roomId].player1.countTotal = Quiz.countTotal;
	game.rooms[roomId].player1.currentScore = Quiz.currentScore;
	game.rooms[roomId].player1.countCorrect = Quiz.countCorrect;
	game.rooms[roomId].player1.countIncorrect = Quiz.countIncorrect;
	game.rooms[roomId].playerNow = game.players[socket.id];
	io.to(roomId).emit('createdRoom', roomId);
  });

  socket.on('joinRoom', (data) => {
    const roomId = socket.id;
    if(data.codeInvite == roomId){
      //console.log(`A sala : ${game.rooms[data.codeInvite]} é tua`);
    }else if(!game.rooms[data.codeInvite].status){
      socket.join(data.codeInvite);
	  game.players[socket.id].id = `Player_${socket.id}`;
	  game.players[socket.id].name = data.player;
      game.rooms[data.codeInvite].player2 = game.players[socket.id];
	  game.rooms[data.codeInvite].player2.progress = Quiz.progress;
	  game.rooms[data.codeInvite].player2.countTotal = Quiz.countTotal;
	  game.rooms[data.codeInvite].player2.currentScore = Quiz.currentScore;
	  game.rooms[data.codeInvite].player2.countCorrect = Quiz.countCorrect;
	  game.rooms[data.codeInvite].player2.countIncorrect = Quiz.countIncorrect;

      game.rooms[data.codeInvite].status = true;
      
      game.players[socket.id].room = data.codeInvite;     
	  
      io.to(data.codeInvite).emit('startGame', game.rooms[data.codeInvite]);
    }else{
      //console.log(`A sala : ${game.rooms[data.codeInvite]} já está cheia`);
    }
  });

  socket.on('checkAnswer', (response) => {
	
    const roomId = game.players[socket.id].room;
    const player = game.rooms[roomId].playerNow;
    const playerClient = `Player_${response.player}`;
    const player1 = game.rooms[roomId].player1;
    const player2 = game.rooms[roomId].player2;
	const status = (game.rooms[roomId].GameState.attrStatus ==='playing');

    if(player.id == playerClient && status){
		//console.log('checkAnswer: ' + response.answer);
		//console.log('player: ' + response.player.name);
		let resultState = {
			answer: response.answer,
			correct: Number(Question.show().answer),
		}

		if(Question.check(response.answer)){
			resultState.status = true;
			if(player == player1){
				game.rooms[roomId].player1.countTotal++;
				game.rooms[roomId].player1.countCorrect++;
				game.rooms[roomId].player1.currentScore += 50;
				game.rooms[roomId].player1.progress += 10;

				game.rooms[roomId].player2.progress -= 10;
			}else{
				game.rooms[roomId].player2.countTotal++;
				game.rooms[roomId].player2.countCorrect++;
				game.rooms[roomId].player2.currentScore += 50;
				game.rooms[roomId].player2.progress += 10;

				game.rooms[roomId].player1.progress -= 10;
			}
		}else{
			resultState.status = false;
			if(player == player1){
				game.rooms[roomId].player1.countTotal++;
				game.rooms[roomId].player1.countIncorrect++;
				game.rooms[roomId].player1.progress -= 10;

				game.rooms[roomId].player2.progress += 10;
			}else{
				game.rooms[roomId].player2.countTotal++;
				game.rooms[roomId].player2.countIncorrect++;
				game.rooms[roomId].player2.progress -= 10;

				game.rooms[roomId].player1.progress += 10;
			}
		}

		if(game.rooms[roomId].player1.countIncorrect === 4 || game.rooms[roomId].player1.progress === 0){
			game.rooms[roomId].player1.attrStatus = 'lost';
			game.rooms[roomId].player2.attrStatus = 'win';
			game.rooms[roomId].GameState.attrStatus = 'endGame';
		}else if(game.rooms[roomId].player1.countCorrect === 6 || game.rooms[roomId].player1.progress === 100){
			game.rooms[roomId].player1.attrStatus = 'win';
			game.rooms[roomId].player2.attrStatus = 'lost';
			game.rooms[roomId].GameState.attrStatus = 'endGame';
		}else if(game.rooms[roomId].player2.countIncorrect === 4 || game.rooms[roomId].player2.progress === 0){
			game.rooms[roomId].player2.attrStatus = 'lost';
			game.rooms[roomId].player1.attrStatus = 'win';
			game.rooms[roomId].GameState.attrStatus = 'endGame';
		}else if(game.rooms[roomId].player2.countCorrect === 6 || game.rooms[roomId].player2.progress === 100){
			game.rooms[roomId].player2.attrStatus = 'win';
			game.rooms[roomId].player1.attrStatus = 'lost';
			game.rooms[roomId].GameState.attrStatus = 'endGame';
		}else if(Question.next()){
			game.rooms[roomId].playerNow = (player == player1) ? player2 : player1;
			resultState.playerNow = game.rooms[roomId].playerNow;
			resultState.question = Question.show();
			resultState.level = 1;
		}

		resultState.player1 = game.rooms[roomId].player1;
		resultState.player2 = game.rooms[roomId].player2;
		resultState.gameState = game.rooms[roomId].GameState.attrStatus;

		io.to(roomId).emit('result', resultState);
    }

  });

  socket.on('disconnect', () => {
    //console.log(`${game.players[socket.id].name} > disconnected`);
    game.players[socket.id] = undefined;
  });

});

app.use(express.static('public'));

/*Rotas*/
app.get('/', (req, res) => {
  res.sendFile (__dirname + '/index.html' );
});

app.get('/login', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/login.html' );
});

app.get('/home', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/home.html' );
});

app.get('/home/menu', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/menu.html' );
});

app.get('/game', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/game.html' );
});

app.get('/home/ranking', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/ranking.html' );
});

app.get('/home/multiplayer', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/multiplayer.html' );
});

app.get('/home/multiplayer/room', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/game2.html' );
});

app.get('/home/multiplayer/room/join', (req, res) => {
  res.sendFile (__dirname + '/public' + '/views/game2.html' );
});

server.listen(PORT, function(){
  console.log(`server started on port => ${PORT}`);
});