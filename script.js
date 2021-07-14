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
     _ = null, X = mine, nums 0-8 = 0-8 mines in the neighboring cells
*/
var status = {
    over: false,
    flaggedMines: 0,
}
console.log(status)
var revealedTileList = [];
var checked = [];
var unchecked = [];
var flagList = [];
var mineList = [];
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
function generateArray(avoidX,avoidY){
    for ( var i = 0; i<rows; i++){
        tile[i] = [];
        revealedTileList[i] = [];
        for ( var j = 0; j<cols; j++){
            tile[i][j] = "_";
            revealedTileList[i][j] = " ";
        }
    }
    console.log(revealedTileList)
    generateMines(avoidX,avoidY);
};
function generateMines(avoidX,avoidY){
    var c = 0;
    var i = 0;
    var avoidNeighborX = [];
    var avoidNeighborY = [];
    while(c < 8){
        avoidNeighborX.push(avoidX+neighborIndexMath[c][0])
        avoidNeighborY.push(avoidY+neighborIndexMath[c][1])
        c++
    }
    while(i<16){
        var x = Math.floor(Math.random()*10);
        var y = Math.floor(Math.random()*10);
        if(tile[x][y]!= "X" && (avoidNeighborX.includes(x) === false || avoidNeighborY.includes(y) === false)){
            /*this if statement ensures that mines are not placed where mines
            already are or neighbor the tile where the player first clicked*/
            tile[x][y] = "X";
            mineList.push(x+(y*10))
            i++;
        }
    }
    console.log(mineList)
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
            tile[i][j] = `${neighbors}`;
            }
        }
    }
    console.log(tile);
}
function updateFlaggedMinesCounter(i,j,change){
    if(change === "placed" && tile[i][j] === "X"){
        status.flaggedMines += 1;
        console.log(status.flaggedMines)
    }
    else if(change === "removed" && tile[i][j] === "X"){
        status.flaggedMines -= 1;
        console.log(status.flaggedMines)
    }
    if(status.flaggedMines > 15 || status.flaggedMines < 0){
        if(status.flaggedMines > 15){
            console.log("game won");
            /*
            
                write game won code here
            
            */
        }
        else{
            status.flaggedMines = 0;
        }
    }
}
function tileClicked(row,col){
    var i = Math.floor(col/50);
    var j = Math.floor(row/50);
    if(i>=0 && j>=0 && i<=9 && j<=9){
        if(flagList.includes(i+(j*10))){
            $('#flag-removed').html(`<audio autoplay><source src="sounds/flag-removed.wav"></audio>`);
            //tile clicked was a flag
            flagList.splice(flagList.indexOf(i+(j*10)),1)
            var x = j*50;
            var y = i*50;
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x+50,y);
            ctx.lineTo(x,y+50);
            ctx.closePath();
            ctx.fillStyle = "#FBFAF9";
            ctx.fill();
            ctx.fillStyle = "#BDBDBD";
            ctx.fillRect(x+5,y+5,40,40);
            //redraws a blank tile over the previously drawn image of flag
            updateFlaggedMinesCounter(i,j,"removed")
        }
        else{
            if(tile.length !== 10){
                generateArray(i,j);
            }
            let image = (imageList[tile[i][j]]) ? document.getElementById(`${imageList[tile[i][j]]}`): document.getElementById("mine");
            console.log(tile[i][j]+" "+col+" "+row+" "+i+" "+j+" "+imageList[tile[i][j]]);
            ctx.drawImage(image, j*50, i*50, 50, 50);
            revealedTileList[i][j] = "X"
            if(tile[i][j] === "0"){
                //tile clicked was empty, reveal surronding tiles
                $('#tile-chain').html(`<audio autoplay><source src="sounds/tile-chain.mp3"></audio>`);
                chainEmptyTileReveals(i,j);
            }
            else if(tile[i][j] === "X"){
                //tile clicked was a mine, end game
                $('#mine-clicked').html(`<audio autoplay><source src="sounds/mine-clicked.wav"></audio>`);
                /* 
                
                    write endgame code here
                
                */
            }
            else{
                //tile clicked was a number
                var n= Math.floor(Math.random()*3+1)
                $('#tile-clicked').html(`<audio autoplay><source src="sounds/tile-clicked-ver${n}.mp3"></audio>`);
            }
            }
        }
    }
$("#canvas").mousedown(function(e){
    if(e.which === 1) {
        tileClicked(e.pageX-15,e.pageY-15);
    }
    if(e.which === 3) {
        e.preventDefault();
        placeFlag(e.pageX-15,e.pageY-15);
    }
});
$("#canvas").bind("contextmenu", function(e) {
    return false;
});
function placeFlag(row,col){
    var i = Math.floor(col/50);
    var j = Math.floor(row/50);
    let image = document.getElementById("flag");
    if(flagList.includes(i+(j*10)) === false && revealedTileList[i][j] !== "X"){
        //flag has not been placed on this tile and it is unrevealed
        $('#flag-placed').html(`<audio autoplay><source src="sounds/flag-placed.wav"></audio>`);
        flagList.push(i+(j*10))
        console.log(flagList)
        ctx.drawImage(image, (j)*50, (i)*50, 50, 50);
        updateFlaggedMinesCounter(i,j,"placed")
    }
}
function chainEmptyTileReveals(i,j){
    var ii = 0;
    while(ii < 8){
        //find the neighbors of the current tile 
        x = neighborIndexMath[ii][0];
        y = neighborIndexMath[ii][1];
        if((i+x)>=0 && (j+y)>=0 && (i+x)<=9 && (j+y)<=9 && flagList.includes((i+x)+((j+y)*10)) === false){
            //if the neighbor of the current tile exists and is not covered by a flag, reveal it
            let image = document.getElementById(`${imageList[tile[i+x][j+y]]}`);
            ctx.drawImage(image, (j+y)*50, (i+x)*50, 50, 50);
            revealedTileList[i+x][j+y] = "X";
            if(tile[i+x][j+y] === "0"){
                //if the tile is blank, then:
                if(unchecked.includes((i+x)+((j+y)*10)) === false && checked.includes((i+x)+((j+y)*10)) === false){
                    //if the current tile is unchecked, add it to the list of blank tiles if not already on the list
                    console.log((i+x)+((j+y)*10))
                    unchecked.push((i+x)+((j+y)*10));
                }
                else if(checked.includes((i+x)+((j+y)*10)) === false){
                    //if the current tile is checked, add it to the list of checked tiles
                    checked.push((i+x)+((j+y)*10));
                }
            }
        }
        ii++
    }
    if(unchecked.length > 0){
        //if there are any unchecked blank tiles, check the first unchecked tile on the list
        setTimeout(() => {
            chainEmptyTileReveals(unchecked[0]%10,Math.floor(unchecked[0]/10));
            checked.push(unchecked[0]);
            unchecked.shift();
        },)
    }
}