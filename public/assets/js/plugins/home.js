document.getElementById('username').innerText = localStorage.getItem('username');
window.onload = function(){
    sessionStorage.setItem('playerOneCreateRoom',undefined);
    sessionStorage.setItem('playerTwoJoinRoom',undefined);
}
document.getElementById('playerOneCreateRoom').onclick = function playerOneCreateRoom(){
    sessionStorage.setItem('playerOneCreateRoom', true);
    window.location.href = "/home/multiplayer/room";
}
document.getElementById('playerTwoJoinRoom').onclick = function playerTwoJoinRoom(){
    sessionStorage.setItem('playerTwoJoinRoom', true);
    window.location.href = "/home/multiplayer/room/join";
}
