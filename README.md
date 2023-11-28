# Desafio tecnico driven: Quer apostar quanto? (back-end)

- Link deploy: https://desafio-tecnico-deploy.onrender.com
- para rodar localmente:
  - crie os scripts `.env` + `.env.test`
  - utilize `npm i`
  - utilize `npx prisma db push`
  - utilize `npx prisma generate`
    - pronto, suas conexões devem estar funcionando
  - finalmente, utilize `npm run dev`

## Rotas:

* **POST** `/participants`

  * Cria um participante com determinado saldo inicial.
  * Entrada: nome e saldo inicial do participante.
    ```tsx
    {
    	name: string;
    	balance: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    }
    ```
  * Saída: objeto do participante criado.
    ```tsx
    {
    	id: number;
    	createdAt: string;
    	updatedAt: string;
    	name: string;
    	balance: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    }
    ```
* **POST** `/games`

  * Cria um novo jogo, com placar inicial 0x0 e marcado como não finalizado.
  * Entrada: nome do time da casa e do time visitante.
    ```tsx
    {
    	homeTeamName: string;
    	awayTeamName: string;
    }
    ```
  * Saída: o objeto do jogo criado.
    ```tsx
    {
    	id: number;
    	createdAt: string;
    	updatedAt: string;
    	homeTeamName: string;
    	awayTeamName: string;
    	homeTeamScore: number; // inicialmente 0
    	awayTeamScore: number; // inicialmente 0
    	isFinished: boolean; // inicialmente false
    }
    ```
* **POST** `/bets`

  * Cadastra uma aposta de um participante em um determinado jogo. O valor da aposta deve ser descontado imediatamente do saldo do participante.
  * Entrada:
    ```tsx
    { 
    	homeTeamScore: number;
    	awayTeamScore: number; 
    	amountBet: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    	gameId: number; 
    	participantId: number;
    }
    ```
  * Saída: o objeto da aposta criada.
    ```tsx
    {
    	id: number;
    	createdAt: string;
    	updatedAt: string;
    	homeTeamScore: number;
    	awayTeamScore: number;
    	amountBet: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    	gameId: number; 
    	participantId: number;
    	status: string; // podendo ser PENDING, WON ou LOST
    	amountWon: number || null; // nulo quando a aposta ainda está PENDING; number caso a aposta já esteja WON ou LOST, com o valor ganho representado em centavos
    }
    ```
* **POST** `/games/:id/finish`

  * Finaliza um jogo e consequentemente atualiza todas as apostas atreladas a ele, calculando o valor ganho em cada uma e atualizando o saldo dos participantes ganhadores.
  * Entrada: placar final do jogo.
    ```tsx
    {
    	homeTeamScore: number;
    	awayTeamScore: number;
    }
    ```
  * Saída: o objeto do jogo atualizado.
    ```tsx
    {
    	id: number;
    	createdAt: string;
    	updatedAt: string;
    	homeTeamName: string;
    	awayTeamName: string;
    	homeTeamScore: number;
    	awayTeamScore: number;
    	isFinished: boolean;
    }
    ```
* **GET** `/participants`

  * Retorna todos os participantes e seus respectivos saldos.
  * Saída: array de todos os participantes.
    ```tsx
    [
    	{
    		id: number;
    		createdAt: string;
    		updatedAt: string;
    		name: string;
    		balance: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    	}, 
    	{...}
    ]
    ```
* **GET** `/games`

  * Retorna todos os jogos cadastrados.
  * Saída: array de todos os jogos
    ```tsx
    [
    	{
    		id: number;
    		createdAt: string;
    		updatedAt: string;
    		homeTeamName: string;
    		awayTeamName: string;
    		homeTeamScore: number;
    		awayTeamScore: number;
    		isFinished: boolean;
    	},
    	{...}
    ]
    ```
* **GET** `/games/:id`

  * Retorna os dados de um jogo junto com as apostas atreladas a ele.
  * Saída: o objeto do jogo contendo a array de apostas realizadas nele.
    ```tsx
    {
    	id: number;
    	createdAt: string;
    	updatedAt: string;
    	homeTeamName: string;
    	awayTeamName: string;
    	homeTeamScore: number;
    	awayTeamScore: number;
    	isFinished: boolean;
    	bets: {
    		id: number;
    		createdAt: string;
    		updatedAt: string;
    		homeTeamScore: number;
    		awayTeamScore: number;
    		amountBet: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    		gameId: number; 
    		participantId: number;
    		status: string; // podendo ser PENDING, WON ou LOST
    		amountWon: number || null; // nulo quando a aposta ainda está PENDING; number caso a aposta já esteja WON ou LOST, com o valor ganho representado em centavos
    	}[]
    }
    ```
