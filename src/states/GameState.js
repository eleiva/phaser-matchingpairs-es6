class GameState extends Phaser.State {

  constructor(){
    super();
    this.timeCheck = 0;
    this.flipFlag = false;
    this.startList = [];
    this.squareList = [];
    this.masterCounter = 0;
    this.squareCounter = 0;
    this.square1Num;
    this.square2Num;
    this.savedSquareX1;
    this.savedSquareY1;
    this.savedSquareX2;
    this.savedSquareY2;
    this.map;
    this.tileset;
    this.layer;
    this.marker;
    this.currentTile;
    this.currentTilePosition;
    this.tileBack = 25;
    this.timesUp = '+';
    this.youWin = '+';
    this.myCountdownSeconds;
  }

  preload(){
    this.game.load.tilemap('matching', 'phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/images/phaser_tiles.png');//, 100, 100, -1, 1, 1);    
  }

	create() {
    this.map = this.add.tilemap('matching');
    this.map.addTilesetImage('Desert', 'tiles');
    this.layer = this.map.createLayer('Ground');//.tilemapLayer(0, 0, 600, 600, tileset, map, 0);
    this.marker = this.add.graphics();
    this.marker.lineStyle(2, 0x00FF00, 1);
    this.marker.drawRect(0, 0, 100, 100);
    this.randomizeTiles();
	}

  update(){
    this.countDownTimer();
    if (this.layer.getTileX(this.input.activePointer.worldX) <= 5) // to prevent the marker from going out of bounds
    {
        this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
        this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;
    }

    if (this.flipFlag == true)
    {
        if (this.time.totalElapsedSeconds() - this.timeCheck > 0.5)
        {
            this.flipBack();
        }
    }
    else
    {
        this.processClick();
    }

  }

  render(){
    this.game.debug.text(this.timesUp, 620, 208, 'rgb(0,255,0)');
    this.game.debug.text(this.youWin, 620, 240, 'rgb(0,255,0)');

    this.game.debug.text('Time: ' + this.myCountdownSeconds, 620, 15, 'rgb(0,255,0)');

    this.game.debug.text('squareCounter: ' + this.squareCounter, 620, 272, 'rgb(0,0,255)');
    this.game.debug.text('Matched Pairs: ' + this.masterCounter, 620, 304, 'rgb(0,0,255)');

    this.game.debug.text('startList: ' + this.myString1, 620, 208, 'rgb(255,0,0)');
    this.game.debug.text('squareList: ' + this.myString2, 620, 240, 'rgb(255,0,0)');

    this.game.debug.text('Tile:'+ this.map.getTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y)).index, 620, 48, 'rgb(255,0,0)');
    this.game.debug.text('LayerX: ' + this.layer.getTileX(this.marker.x), 620, 80, 'rgb(255,0,0)');
    this.game.debug.text('LayerY: ' + this.layer.getTileY(this.marker.y), 620, 112, 'rgb(255,0,0)');
    this.game.debug.text('Tile Position: ' + this.currentTilePosition, 620, 144, 'rgb(255,0,0)');
    this.game.debug.text('Hidden Tile: ' + this.getHiddenTile(), 620, 176, 'rgb(255,0,0)');


  }

  //------------------------------------------------------------------------
  getHiddenTile() {
    this.thisTile = this.squareList[this.currentTilePosition-1];
    return this.thisTile;
  }

  flipOver() {
    this.map.putTile(this.currentNum, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
  }

  flipBack() {
    this.flipFlag = false;
    this.map.putTile(this.tileBack, this.savedSquareX1, this.savedSquareY1);
    this.map.putTile(this.tileBack, this.savedSquareX2, this.savedSquareY2);

  }

  processClick() {

    this.currentTile = this.map.getTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
    this.currentTilePosition = ((this.layer.getTileY(this.input.activePointer.worldY)+1)*6)-(6-(this.layer.getTileX(this.input.activePointer.worldX)+1));

    if (this.input.activePointer.isDown) {
        // check to make sure the tile is not already flipped
        if (this.currentTile.index == this.tileBack) {
            // get the corresponding item out of squareList
            this.currentNum = this.squareList[this.currentTilePosition-1];
            this.flipOver();
            this.squareCounter++;
            // is the second tile of pair flipped?
            if  (this.squareCounter == 2) {
                // reset squareCounter
                this.squareCounter = 0;
                this.square2Num = this.currentNum;
                // check for match
                if (this.square1Num == this.square2Num) {
                    this.masterCounter++;

                    if (this.masterCounter == 18) {
                        // go "win"
                        this.youWin = 'Got them all!';
                    }
                } else {
                    this.savedSquareX2 = this.layer.getTileX(this.marker.x);
                    this.savedSquareY2 = this.layer.getTileY(this.marker.y);
                    this.flipFlag = true;
                    this.timeCheck = this.time.totalElapsedSeconds();
                }
            } else {
                this.savedSquareX1 = this.layer.getTileX(this.marker.x);
                this.savedSquareY1 = this.layer.getTileY(this.marker.y);
                this.square1Num = this.currentNum;
            }
        }
    }
  }

   countDownTimer() {
    var timeLimit = 120;
    this.mySeconds = this.time.totalElapsedSeconds();
    this.myCountdownSeconds = this.timeLimit - this.mySeconds;

    if (this.myCountdownSeconds <= 0) {
        this.timesUp = 'Time is up!';
    }
  }

  randomizeTiles() {
    let num;
    for (num = 1; num <= 18; num++) {
        this.startList.push(num);
    }
    for (num = 1; num <= 18; num++) {
        this.startList.push(num);
    }

    // for debugging
    this.myString1 = this.startList.toString();
    let i;
    // randomize squareList
    for (i = 1; i <=36; i++) {
        let randomPosition = this.rnd.integerInRange(0,this.startList.length - 1);

        let thisNumber = this.startList[ randomPosition ];

        this.squareList.push(thisNumber);
        let a = this.startList.indexOf(thisNumber);

        this.startList.splice( a, 1);
    }
    this.myString2 = this.squareList.toString();
    let col,row;
    for (col = 0; col < 6; col++) {
        for (row = 0; row < 6; row++) {
            this.map.putTile(this.tileBack, col, row);
        }
    }
  }

}

export default GameState;
