 var Connect4 = function (config) {
	config = config || {};

	var _columns_number = config.columns || 7;
	var _rows_number = config.rows || 6;
	var _board = [];
	var _columns_last_row = [];
	var _players = config.players || [new Player(), new Player()];
	var _currentPlayer = _players[0];
	var _winningBlocks = [];
	var _IS_GAMR_OVER = false;

	/*
	 * Connect4 events // move:end, game:win, game:draw
	 */
	var _events = {};

	var _init = function () {
		// generate the board
		for (var i = 0; i < _columns_number; i++) {
			_board[i] = [];
			for (var j = 0; j < _columns_number; j++) {
				_board[i][j] = 0;
			}
		}
		// generate _columns_last_row
		for (var k = 0; k < _columns_number; k++) {
			_columns_last_row[k] = (_rows_number-1);
		}
	};

	var _getBlock = function(column,row) {
		if ((column < 0) || (column > (_columns_number - 1)) || (row < 0) || (row > (_rows_number - 1))) 
		{
			return -1;
		}else{
			return _board[column][row];
		}
	};

	var setBlock = function(column) {
		player = _currentPlayer;
		var row = _columns_last_row[column];
		if (row == -1) {
			_publish("move:end",{column: column, row: row, player: player, is_column_full: true});
		} else {
			_board[column][row] = player.id;
			_columns_last_row[column] = row - 1;
			_publish("move:end",{column: column, row: row, player: player, is_column_full: false});
			if (_checkIfWin(column,row,player) === true)
			{
				_IS_GAMR_OVER = true;
				_publish("game:win",{winningBlocks: _winningBlocks, winner: player});
			}
			if (_checkGameEnded()) 
			{
				_IS_GAMR_OVER = true;
				_publish("game:draw",{});
			}
			if (_IS_GAMR_OVER !== true) {
				_switchPlayer();
			}
				
		}
	};

	var _checkGameEnded = function() {
		for (var i = 0; i < _columns_number; i++) {
			if(_columns_last_row[i] != -1){
				return false;
			}
		}
		return true;
	};

	var _checkIfWin = function(column,row,player) {
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

			winningBlocks = {};
			winningBlocks.horizontal = [];
			winningBlocks.vertical = [];
			winningBlocks.diagonal_forward = [];
			winningBlocks.diagonal_backword = [];

			for(j=0;j<=3;j++)
			{
				// Check horizontally for win
				if (_getBlock(column-i+j,row) == currentPlayerID) {
					total1++;
					winningBlocks.horizontal.push([column-i+j,row]);
				}
				// Check vertically for win
				if (_getBlock(column,row-i+j) == currentPlayerID) {
					total2++;
					winningBlocks.vertical.push([column,row-i+j]);
				}
				// Check on the forward diagonal (/) for win
				if (_getBlock(column-i+j,row-i+j) == currentPlayerID) {
					total3++;
					winningBlocks.diagonal_forward.push([column-i+j,row-i+j]);
				}
				// Check on the backward diagonal (\) for win
				if (_getBlock(column-j+i,row-i+j) == currentPlayerID) {
					total4++;
					winningBlocks.diagonal_backword.push([column-j+i,row-i+j]);
				}
			}
			if (total1 == 4) {result = true; _winningBlocks = winningBlocks.horizontal;} else
			if (total2 == 4) {result = true; _winningBlocks = winningBlocks.vertical;} else
			if (total3 == 4) {result = true; _winningBlocks = winningBlocks.diagonal_forward;} else
			if (total4 == 4) {result = true; _winningBlocks = winningBlocks.diagonal_backword;}
			if(result){
				if(winningBlocks.horizontal.length == 4){  }
				if(winningBlocks.vertical.length == 4){  }
				if(winningBlocks.diagonal_forward.length == 4){  }
				if(winningBlocks.diagonal_backword.length >= 4){  }
			}
		}
		return result;
	};

	var _switchPlayer = function() {
		var index = _players.indexOf(_currentPlayer) + 1;
		// if it's the last player in the turn, get back to the first player
		if(index == (_players.length)){
			index = 0;
		}
		_currentPlayer = _players[index];
	};

	var on = function(event, handler){
		// create the event if not yet created
		_events[event] = _events[event] || [];
		// add the handler
    	_events[event].push(handler);
	};

	var _publish = function (event,args) {
		// return if the event doesn't exist, or there are no handlers
	    if(!_events[event] || _events[event].length < 1) return;

	    // send the event to all handlers
	    _events[event].forEach(function(handler) {
	      	handler(args || {});
	    });
	};

	// initialization
	_init();

	return {
		setBlock: setBlock,
		on: on
	};
};