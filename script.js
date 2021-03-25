const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
$("#imagesDiv").hide();
var ctx = canvas.getContext('2d');
var tile = [];
/*
    [ [0] [1] [1] ]
    [ [1] [3] [X] ]
    [ [1] [X] [X] ]
    tile[0][2] = 1, tile[1][1] = 3
     _ = null, X = mine, nums 0-8 = 0-8, f = flagged mine, n = flagged number
*/ 
var imageList = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"]  
var neighborIndexMath = [[-1,-1], [0,-1], [1,-1], [-1,0], [1,0], [-1,1], [0,1], [1,1]];
var rows = 10;
var cols = 10;
function drawBoard(){
    for ( var i = 0; i<rows; i++){
        for ( var j = 0; j<cols; j++){
            var x = i*50;
            var y = j*50;
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x+50,y);
            ctx.lineTo(x,y+50);
            ctx.closePath();
            ctx.fillStyle = "#FBFAF9";
            ctx.fill();
            ctx.fillStyle = "#BDBDBD";
            ctx.fillRect(x+5,y+5,40,40);
        }
    }
};
drawBoard()
function generateArray(){
    for ( var i = 0; i<rows; i++){
        tile[i] = [];
        for ( var j = 0; j<cols; j++){
            tile[i][j] = "_";
        }
    }
    generateBombs();
};
function generateBombs(){
    var i = 0;
    while(i<20){
        var x = Math.floor(Math.random()*10);
        var y = Math.floor(Math.random()*10);
        if(tile[x][y]!= "X"){
        tile[x][y] = "X";
        i++;
        }
    }
    generateTiles()
}
function generateTiles(){
      for ( var i = 0; i<rows; i++){
        for ( var j = 0; j<cols; j++){
            if(tile[i][j] !== "X"){
                var ii = 0;
                var neighbors = 0;
                while(ii<8){
                    x = neighborIndexMath[ii][0];
                    y = neighborIndexMath[ii][1];
                    if((i+x)>=0 && (j+y)>=0 && (i+x)<=9 && (j+y)<=9){
                        //this if statement is to make sure that tile[i+x][j+y] exists
                        neighbors += (tile[i+x][j+y] === "X") ? 1 : 0;
                    }
                    ii++;
                }
            tile[i][j] = `${neighbors}`
            }
        }
    }
    console.log(tile)
}
generateArray();

function tileClicked(row,col){
    var i = Math.floor(col/50)
    var j = Math.floor(row/50)
    if(i>=0 && j>=0 && i<=9 && j<=9){
        let image = (imageList[tile[i][j]]) ? document.getElementById(`${imageList[tile[i][j]]}`): document.getElementById("mine");
        console.log(tile[i][j]+" "+col+" "+row+" "+i+" "+j+" "+imageList[tile[i][j]])
            ctx.drawImage(image, j*50, i*50, 50, 50);
        }
    }
document.getElementById("canvas").addEventListener('click', (event) => {
    tileClicked(event.pageX-15,event.pageY-15)
});