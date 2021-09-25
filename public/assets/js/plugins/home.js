document.getElementById('username').innerText = localStorage.getItem('username');
window.onload = function(){
    sessionStorage.setItem('playerOneCreate',undefined);
    sessionStorage.setItem('playerTwoJoin',undefined);
}
document.getElementById('playerOneCreate').onclick = function playerOneCreate(){
    sessionStorage.setItem('playerOneCreate', (5>2));
    window.location.href = "/home/multiplayer/room";
}
document.getElementById('playerTwoJoin').onclick = function playerTwoJoin(){
    sessionStorage.setItem('playerTwoJoin', (5>2));
    window.location.href = "/home/multiplayer/room/join";
}