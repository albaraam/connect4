 var Connect4 = function (config) {
	self = this;
	this.config = config;
	this.columns_number = 7;
	this.rows_number = 6;
	this.board = [
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
	];
	this.columns_last_row = [(this.rows_number-1),(this.rows_number-1),(this.rows_number-1),(this.rows_number-1),(this.rows_number-1),(this.rows_number-1),(this.rows_number-1)];
	this.players = config.players;
	this.currentPlayer = this.players[0];
	this.winner = null;
	this.winningBlocks = [];
	this.IS_GAMR_OVER = false;

	/*
	 * Connect4 events // move:end, game:win, game:draw
	 */
	this._events = {};

	this._getBlock = function(column,row) {
		if ((column < 0) || (column > 6) || (row < 0) || (row > 5)) 
		{
			return -1;
		}else{
			return this.board[column][row];
		}
	};

	this.setBlock = function(column) {
		player = self.currentPlayer;
		var row = self.columns_last_row[column];
		if (row == -1) {
			self._publish("move:end",{column: column, row: row, player: player, is_column_full: true});
		} else {
			self.board[column][row] = player.id;
			self.columns_last_row[column] = row - 1;
			self._publish("move:end",{column: column, row: row, player: player, is_column_full: false});
			if (self._checkIfWin(column,row,player) === true)
			{
				self.IS_GAMR_OVER = true;
				self._publish("game:win",{winningBlocks: self.winningBlocks, winner: player});
			}
			if (self._checkGameEnded()) 
			{
				self.IS_GAMR_OVER = true;
				self._publish("game:draw",{});
			}
			if (self.IS_GAMR_OVER !== true) {
				self._switchPlayer();
			}
				
		}
	};

	this._checkGameEnded = function() {
		return ((self.columns_last_row[0] == -1) && 
				(self.columns_last_row[1] == -1) && 
				(self.columns_last_row[2] == -1) && 
				(self.columns_last_row[3] == -1) && 
				(self.columns_last_row[4] == -1) && 
				(self.columns_last_row[5] == -1) && 
				(self.columns_last_row[6] == -1));
	};

	this._checkIfWin = function(column,row,player) {
		var i,j;
		var total1,total2,total3,total4;
		var total12,total22,total32,total42;
		var currentPlayerID = player.id, 
			otherPlayerID;
		var result = false;

		if (currentPlayerID == 1) { otherPlayerID = 2; } else { otherPlayerID = 1; }

		for (i=0;i<=3;i++)
		{
			total1 = 0;
			total2 = 0;
			total3 = 0;
			total4 = 0;
			total12 = 0;
			total22 = 0;
			total32 = 0;
			total42 = 0;

			winningBlocks = {};
			winningBlocks.horizontal = [];
			winningBlocks.vertical = [];
			winningBlocks.diagonal_forward = [];
			winningBlocks.diagonal_backword = [];

			for(j=0;j<=3;j++)
			{
				if (self._getBlock(column-i+j,row) == currentPlayerID) {
					total1++;
					winningBlocks.horizontal.push([column-i+j,row]);
				}
				if (self._getBlock(column,row-i+j) == currentPlayerID) {
					total2++;
					winningBlocks.vertical.push([column,row-i+j]);
				}
				if (self._getBlock(column-i+j,row-i+j) == currentPlayerID) {
					total3++;
					winningBlocks.diagonal_forward.push([column-i+j,row-i+j]);
				}
				if (self._getBlock(column-j+i,row-i+j) == currentPlayerID) {
					total4++;
					winningBlocks.diagonal_backword.push([column-j+i,row-i+j]);
				}
			}
			if ((total1 >= 4) && (total12 === 0)) {result = true;} else
			if ((total2 >= 4) && (total22 === 0)) {result = true;} else
			if ((total3 >= 4) && (total32 === 0)) {result = true;} else
			if ((total4 >= 4) && (total42 === 0)) result = true;
		}
		if(result){
			if(winningBlocks.horizontal.length >= 4){ self.winningBlocks = winningBlocks.horizontal; }
			if(winningBlocks.vertical.length >= 4){ self.winningBlocks = winningBlocks.vertical; }
			if(winningBlocks.diagonal_forward.length >= 4){ self.winningBlocks = winningBlocks.diagonal_forward; }
			if(winningBlocks.diagonal_backword.length >= 4){ self.winningBlocks = winningBlocks.diagonal_backword; }
		}
		return result;
	};

	this._switchPlayer = function() {
		var index = self.players.indexOf(self.currentPlayer) + 1;
		// if it's the last player in the turn, get back to the first player
		if(index == (self.players.length)){
			index = 0;
		}
		self.currentPlayer = self.players[index];
	};

	this.on = function(event, handler){
		// create the event if not yet created
		self._events[event] = self._events[event] || [];
		// add the handler
    	self._events[event].push(handler);
	};

	this._publish = function (event,args) {
		// return if the event doesn't exist, or there are no handlers
	    if(!self._events[event] || self._events[event].length < 1) return;

	    // send the event to all handlers
	    self._events[event].forEach(function(handler) {
	      	handler(args || {});
	    });
	};

	this.getCurrentPlayer = function () {
		return self.currentPlayer;
	};

	return {
		setBlock: this.setBlock,
		on: this.on,
		getCurrentPlayer: this.getCurrentPlayer
	};
};