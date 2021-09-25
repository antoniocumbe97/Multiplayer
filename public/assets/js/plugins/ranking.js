const highScores = JSON.parse(localStorage.getItem('ranking')) || [];
const table = document.getElementById('ranking');
const username = document.getElementById('username');

function showRanking(){
    username.innerText = localStorage.getItem('username');
	let posRank = 0;
    table.innerHTML = highScores.map(score => {
        posRank++;
        return `
			<tr>
				<th scope="row">${posRank}</th>
				<td>${score.subject}</td>
				<td class="">${score.score}</td>
				<td class="">${score.time}</td>
			</tr>
		`;
    }).join('');
}

function scoreSort(highScores){
	for(let i=0; i<highScores.length; i++){
		for (let index = i+1; index < highScores.length; index++) {
			if(highScores[i].score <= highScores[index].score){
				let temp = highScores[i];
				highScores[i] = highScores[index];
				highScores[index] = temp;
			}
		}
	}
}

this.scoreSort(highScores);
this.showRanking();