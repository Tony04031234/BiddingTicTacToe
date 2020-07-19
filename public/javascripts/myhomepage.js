class Square{
    constructor(){
        this.value = null;
        this.isHighlighted = false;
    }
}

class Game{
    constructor(){
        this.inProgress_player1 = false;
        this.inProgress_player2 = false;
        this.winner = null; // O or X
        //this.currentTurn = Game.O; //O or X
        this.moveMade = 0;
        this.squares = new Array(9).fill().map( s => new Square() );//fku
    }

    makeMove(i){
        if(this.inProgress_player1 == true && this.inProgress_player2 == false && !this.squares[i].value ){
            this.squares[i].value = this.currentTurn;
            this.moveMade++;
            this.checkFormWinner();
            this.inProgress_player1 = false;
            this.inProgress_player2 = false;

            //this.currentTurn = (this.currentTurn === Game.O) ? Game.X : Game.O;// switch player each turn
        }
        else if (this.inProgress_player2 == true && this.inProgress_player1 == false && !this.squares[i].value ){
            this.squares[i].value = this.currentTurn;
            this.moveMade++;
            this.checkFormWinner();
            this.inProgress_player1 = false;
            this.inProgress_player2 = false;
            //this.currentTurn = (this.currentTurn === Game.O) ? Game.X : Game.O;// switch player each turn
        }
    }

    checkFormWinner(){
        const winningCombinations=[
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        winningCombinations.forEach( wc => {
            const [a,b,c] = wc;
            const sqA = this.squares[a];
            const sqB = this.squares[b];
            const sqC = this.squares[c];

            if(sqA.value && sqA.value === sqB.value && sqA.value === sqC.value){
                this.inProgress_player1 = false;
                this.inProgress_player2 = false;// inProgress == false and winner = Null
                this.winner = sqA.value;
                sqA.isHighlighted = sqB.isHighlighted = sqC.isHighlighted = true;
            }

        });

        // check for tie
        if(this.moveMade === this.squares.length){
                this.inProgress_player1 = false;
                this.inProgress_player2 = false;// inProgress == false and winner = Null
        }
    }
}

Game.O = 'O';
Game.X = 'X';

//var activeGame = new Game();

var app = new Vue({

    el: '#ui',

    data: {
        activeGame: '',
        start: true ,
        set_token: '',

        token_player1: '',
        token_player2: '',

        player1_bid:'',
        player2_bid:'',

        bid1:'',
        bid2:'',

        //bidding_table:'',

        newfeed1: '',
        newfeed2:'',

        nort1: '',
        nort2:'',

        player1_win_round: false,
        player2_win_round: false,

        round: 1,

    },

    computed:{
        infoMessage: function(){
            if(this.activeGame.inProgress){
                return 'It is ' + this.activeGame.currentTurn + '\'s turn!';
            }

            if(this.activeGame.winner){
                return this.activeGame.winner + ' wins!';
            }

            if(!this.activeGame.winner && !this.activeGame.inProgress){
                return 'It was a draw!';
            }
        },

        infoMessage_bidding_table: function(){
            if(this.player1_bid !== '' && this.player2_bid == ''){
                return "Player 1 is making a bid ....." ;
            }

            if(this.player1_bid == '' && this.player2_bid !==''){
                return "Player 2 is making a bid ..... ";
            }

        }
    },
    methods: {

        login: function(){
            window.location.pathname = "main.html";
        },

        logout: function() {
            window.location.pathname = "index.html";
        },

        start_game: function(){
           this.start = false;
           this.token_player1 = this.set_token;
           this.token_player2 = this.set_token;
           this.activeGame = new Game();
           this.bidding_table ='';
           this.player1_bid = '';
           this.player2_bid = '';
           this.bid1 = '';
           this.bid2 = '';
           this.newfeed1='';
           this.newfeed2='';

        },

        end_game: function(){
            this.start = true;
            this.set_token ='';
            this.token_player1 = '';
            this.token_player2 = '';
            this.bidding_table ='';
            this.player1_bid = '';
            this.player2_bid = '';
            this.bid1 = '';
            this.bid2 = '';
            this.newfeed1='';
            this.newfeed2='';
            this.round = '';

        },

        bidding_player1: function(){

            if( this.player1_bid !== '' &&  parseInt(this.player1_bid) <= parseInt(this.token_player1) && parseInt(this.player1_bid)>=0){
                //this.bidding_table = this.player1_bid;
                this.bid1 = this.player1_bid;
                this.player1_bid = '';
                this.player2_bid = '';
                this.newfeed1 = 'Making a bid successfully.';
                this.newfeed2 = '';

            }

            else if(this.player1_bid == '' || parseInt(this.player1_bid) < 0 || parseInt(this.player1_bid) > parseInt(this.token_player1)){
                this.newfeed1 = "Invalid input! Making a bid again!";
                this.newfeed2 = '';
                this.player1_bid = '';

            }

            this.check_bidding_winner();

        },

        bidding_player2: function(){

            if( this.player2_bid !== '' &&   parseInt(this.player2_bid) <=  parseInt(this.token_player2) &&  parseInt(this.player2_bid)>=0){

                this.bid2 = this.player2_bid;
                this.player1_bid = '';
                this.player2_bid = '';
                this.newfeed2 = 'Making a bid successfully.';
                this.newfeed1 = '';

            }


            else if(this.player1_bid == '' || parseInt(this.player1_bid) < 0 || parseInt(this.player1_bid) > parseInt(this.token_player1)){
                this.newfeed2 = "Invalid input! Making a bid again!";
                this.newfeed1 = '';
                this.player2_bid = '';

            }

            this.check_bidding_winner();

        },

        check_bidding_winner: function(){
            console.log("running...check_bidding_winner...");

            if(parseInt(app.bid1) > parseInt(app.bid2) ){
                if (this.player2_bid !=='' && this.player1_bid == ''){ // player 2 turn now
                    alert("player 2 lose this round because of making a lower bid, player 1 secure your spot");
                    this.player1_win_round = true;
                    this.player2_win_round = false;
                    this.activeGame.currentTurn = Game.X;
                    this.round += parseInt('1');
                    this.token_player1 = this.token_player1 - this.bid1;
                    this.activeGame.inProgress_player1 = true;
                    this.activeGame.inProgress_player2 = false;
                    this.player1_bid = '';
                    this.player2_bid = '';
                    this.bid1 = '';
                    this.bid2 = '';
                    this.newfeed1='';
                    this.newfeed2='';
                }
                else if (this.player1_bid !== '' && this.player2_bid == ''){ // player 1 turn now
                    alert("player 1 is making a heigher bid, player 2 continues or stops ? ");
                }

            }

            else if (parseInt(app.bid1) < parseInt(app.bid2) ){

                  if (this.player2_bid !== '' && this.player1_bid == ''){ // player 2 turn now
                    alert("player 2 lose this round because of making a lower bid, player 1 secure your spot");
                    this.player1_win_round = true;
                    this.player2_win_round = false;
                    this.activeGame.currentTurn = Game.X;
                    this.round += parseInt('1');
                    this.token_player1 = this.token_player1 - this.bid1;
                    this.activeGame.inProgress_player1 = true;
                    this.activeGame.inProgress_player2 = false;
                    this.player1_bid = '';
                    this.player2_bid = '';
                    this.bid1 = '';
                    this.bid2 = '';
                    this.newfeed1='';
                    this.newfeed2='';
                }
                else if (this.player2_bid !== '' && this.player1_bid == ''){ // player 1 turn now
                    alert("player 1 is making a heigher bid, player 2 continues or stops ? ");

                }
            }

            else if(parseInt(app.bid1) == parseInt(app.bid2)){

                if (this.player2_bid !== '' && this.player1_bid == ''){ // player 2 turn now
                    alert("player 2 lose this round because of making a same bid, player 1 secure your spot");
                    this.player1_win_round = true;
                    this.player2_win_round = false;
                    this.activeGame.currentTurn = Game.X;
                    this.round += parseInt('1');
                    this.token_player1 = this.token_player1 - this.bid1;
                    this.activeGame.inProgress_player1 = true;
                    this.activeGame.inProgress_player2 = false;
                    this.player1_bid = '';
                    this.player2_bid = '';
                    this.bid1 = '';
                    this.bid2 = '';
                    this.newfeed1='';
                    this.newfeed2='';
                }

                else if (this.player1_bid !== '' && this.player2_bid == ''){ // player 1 turn now
                    alert("player 1 lose this round because of making a same bid, player 2 secure your spot");
                    this.player1_win_round = false;
                    this.player2_win_round = true;
                    this.activeGame.currentTurn = Game.O;
                    this.round += parseInt('1');
                    this.token_player2 = this.token_player2 - this.bid2;
                    this.activeGame.inProgress_player1 = false;
                    this.activeGame.inProgress_player2 = true;
                    this.player1_bid = '';
                    this.player2_bid = '';
                    this.bid1 = '';
                    this.bid2 = '';
                    this.newfeed1='';
                    this.newfeed2='';

                }

            }
        },

        stop_bidding_player1: function(){
            this.player2_win_round = true;
            this.player1_win_round = false;
            this.activeGame.currentTurn = Game.O;
            this.round += parseInt('1');
            this.token_player2 = this.token_player2 - this.bid2;
            this.activeGame.inProgress_player1 = false;
            this.activeGame.inProgress_player2 = true;
            this.player1_bid = '';
            this.player2_bid = '';
            this.bid1 = '';
            this.bid2 = '';
            this.newfeed1='';
            this.newfeed2='';
        },

        stop_bidding_player2: function(){
            this.player1_win_round = true;
            this.player2_win_round = false;
            this.activeGame.currentTurn = Game.X;
            this.round += parseInt('1');
            this.token_player1 = this.token_player1 - this.bid1;
            this.activeGame.inProgress_player1 = true;
            this.activeGame.inProgress_player2 = false;
            this.player1_bid = '';
            this.player2_bid = '';
            this.bid1 = '';
            this.bid2 = '';
            this.newfeed1='';
            this.newfeed2='';
        },

    },

});

/*
            if (this.player1_win_round === true){
                return "Player 2 stopped making a bid, Player 1 won this round !";
            }

            if (this.player2_win_round === true){
                return "Player 1 stopped making a bid, Player 2 won this round !";
            }

            if(this.bid2 <= this.bid1 && this.player1_bid == '' && this.player2_bid =='' && this.bid1 !== ''  && this.bid2 !== '' ){
                return "Player 2 lose this round because of making lower bid, player 1 secures a spot on the board ";
            }

            if(this.bid1 <= this.bid2 && this.player2_bid == '' && this.player1_bid !=='' && this.player1_bid == ''  && this.player2_bid ==''){
                return "Player 1 lose this round because of making lower bid, player 2 secures a spot on the board";
            }

            if (this.bid1 > this.bid2 && this.bid1 !== '' && this.bid2 !== ''){
                return "Player 1 is making " + (this.bid1 - this.bid2) + " higher bid, Player 2 continues or stops";
            }

            if (this.bid1 < this.bid2 && this.bid1 !== '' && this.bid2 !== ''){
                return "Player 2 is making " + (this.bid2 - this.bid1) + " higher bid, Player 1 continues or stops";
            }

            if (this.bid1 == this.set_token && this.bid1 !== ''){
                return "Player 1 want to all in and lose all the token in the first round";
            }

            if (this.bid2 == this.set_token && this.bid2 !== ''){
                return "Player 2 want to all lose all the token in the first round";
            }


            if(this.player1_bid !== '' && this.player2_bid !== ''){
                if(this.player2_bid > this.player1_bid){
                    return "player 2 is making a higher bid !, player 1 wants to keep making a bid or stop....";
                }
                else{
                    return "Player1 won this round !, please mark on the board to secure 1 spot...";
                }
            }
*/