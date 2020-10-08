const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 14;//WAS 20
const COL = COLUMN = 10;//WAS 10
const SQ = squareSiza = 12;//WAS 20
const VACANT = "WHITE";
 /*ctx.addEventListener("click");*/
// draw a square


function drawSquare(x,y,color){
    ctx.fillStyle = color;
ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

ctx.strokeStyle = "BLACK";
ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);

}
//drawSquare(0,0,"blue")

// create the board

let board = [];
for(r=0; r<ROW; r++){
    board[r]=[];
    for(c=0;c<COL;c++){
    board[r][c]=VACANT;
}
}

//draw the board
function drawBoard(){
    for(r=0; r<ROW; r++){
        for(c=0;c<COL;c++){
        drawSquare(c,r,board[r][c]);
    }
}
}
drawBoard();
// the piece and their color
const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

//generate random piece
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length);
    return new piece( PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();
// the objet Piece (tetrominos, color)

function piece(tetromino, color){
    this.tetromino=tetromino;
    this.color=color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    //controle de la piece

    this.x=0;
    this.y=0;
}


//draw a piece to the board
//function fill
piece.prototype.fill = function(color){
    for (r=0; r<this.activeTetromino.length; r++){
        for(c=0; c<this.activeTetromino.length; c++){
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

piece.prototype.draw = function(){
    this.fill(this.color);
}

p.draw();
// undraw a piece
piece.prototype.unDraw = function(){
    this.fill(VACANT)
}



//Move down the piece

piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }
    else {
        this.lock();
        p=randomPiece();
    }
}

//MOVE right
piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
    this.unDraw();
    this.x++;
    this.draw();
    }
}

//move left
piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
    this.unDraw();
    this.x--;
    this.draw();
    }
}
//rotate funtion
piece.prototype.rotate = function(){


    let nextPattern=this.tetromino[(this.tetrominoN +1 )%this.tetromino.length];

    let kick=0;
    if(this.collision(0,0,nextPattern)){
        if(this.x >COL/2){
            kick=-1;
        }
        else{
            kick=1;
        }
    }

    if(!this.collision(kick,0,nextPattern)){
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN +1 )%this.tetromino.length;
    this.activeTetromino=this.tetromino[this.tetrominoN];
    this.draw();
    }
    
}
let score=0;

// function lock
piece.prototype.lock = function(){
    for (r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            if(!this.activeTetromino[r][c]){
                continue;
            }
            //piece lock on the top
            if(this.y - r < 0){
                alert("Game Over !");
                //stop request animation frame
                
                gameOver = true;
                break;
            }
            //we lock the piece
            board[this.y+r][this.x+c]=this.color
        }
    }
    //remove full rows
    for(r=0; r<ROW; r++){
        let isRowFull = true;
        for(c=0; c<COL; c++){
        isRowFull = isRowFull && (board[r][c] != VACANT);
    }
    if(isRowFull){
        for (y=r; y>1; y--){
            for (c=0; c<COL; c++){
                board[y][c]=board[y-1][c];
            }
        }
        for (c=0; c<COL; c++){
            board[0][c] = VACANT;
        }
        //increment the score
        score+=10;
    }
        
    }
    //update the board
    drawBoard();
        

        //update the score
    scoreElement.innerHTML=score;
   
}



//Collision

piece.prototype.collision = function(x,y,piece){
    for (r=0; r < piece.length; r++){
        for(c=0; c < piece.length; c++){
            //if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after mouvement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            //conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true
            }
            if (newY < 0){
                continue;
            }
            if(board[newY][newX] != VACANT){
                return true;
            }
        }

    }
    return false;
}

//control the piece
document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if (event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }
    else if (event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }
    else if (event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }
    else if (event.keyCode == 40){
        p.moveDown();
        dropStart = Date.now();
    }
}

//drop the piece every 1sec
let dropStart = Date.now();
let gameOver=false;
let gamePause=true;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 500){
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver){
    requestAnimationFrame(drop);
}
}

drop();