-   como controlar o time_elapsed no backend?
-   é melhor controlar o time_elapsed no frontend ou no backend? [performance]
-   quero controlar o status da partida, deve se fazer assim 
    status(){
        if(countIncorrect === 4){
            status = 'Lost';
        }else if(countCorrect === (level*6)){
            status = 'Win';
        }else {
            status = 'In-Progress';
        }
        return status;
    }
    [Trabalhar a opção de Empate para Multiplayers]
-   ao carrgar a partida, se tiver status diferente de 'In-Progress' deve carregar a tela dos resultados ['Lost','Win']
-   como passar para o proximo nível

-   [quero ter a opção de fazer pause da partida, em que momento isso é melhor e deve ser no backend ou frontend]


{
    subject_id: 1,
    type: '1 vs 1' || 'multiplayer',
    teams: [
        {
            name: 'Team A',
            squad: [
                {
                    players: [
                        {
                            id: 1,
                            name: 'Vanessa',
                            surname: 'Fruma',
                        }
                    ]
                }
            ]
        },
        {
            name: 'Team B',
            squad: [
                {
                    players: [
                        {
                            id: 2,
                            name: 'António',
                            surname: 'Cumbe',
                        }
                    ]
                }
            ]
        }
    ],
}