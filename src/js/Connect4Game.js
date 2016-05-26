var Connect4Game = (function () {

	that = this;
	this._connect4 = null;
	this._players = [];

	this._board_rows_number = 6;
	this._board_columns_number = 7;
	this._board_selector =  'body';
	this._boardMargin = 0;
	this._blockWidth = 0;
	this._blockHeight = 0;

	this._renderBoard = function () {
		var boardContainerWidth = $(this._board_selector).width(),
			boardContainerHeight = $(this._board_selector).height(),
			boardWidth,boardHeight, boardMargin;
		
		boardWidth = Math.min(boardContainerWidth, boardContainerHeight);
		boardHeight = (boardWidth * this._board_rows_number) / this._board_columns_number;
		boardMargin = (boardContainerHeight - boardHeight) / 2;

		columnWidth = boardWidth / this._board_columns_number;
		columnHeight = boardHeight;

		this._blockWidth = this._blockHeight = columnWidth;
		this._boardMargin = boardMargin;

		$board = jQuery('<div/>', {
			id: 'connect4_board',
			class: 'board',
			style: 'width:'+boardWidth+'px; height:'+boardHeight+'px;padding:'+boardMargin+'px 0;'
		});

		for (var i = 0; i < this._board_columns_number; i++) {
			$column = jQuery('<div/>', {
				class: 'board__col',
				'data-col': i,
				style: 'width:'+columnWidth+'px; height:'+columnHeight+'px;'
			});
			// add click listner to columns to play next move
			for (var j = 0; j < this._board_rows_number; j++) {
				$column.append(jQuery('<div/>', {
					class: 'board__col__block',
					'data-col': i,
					'data-row': j,
					style: 'width:'+this._blockWidth+'px; height:'+this._blockHeight+'px;'
				}));
			}
			$column.click(that._dropBlock);
			$board.append($column);
		}
		$blocksWrapper = jQuery('<div/>', {
			class: 'board__blocks-wrapper',
		});
		$board.append($blocksWrapper);

		$(this._board_selector).prepend($board);

	};

	this._renderPlayers = function () {
		// TODO: render players names on screen
	};

	this._renderPopup = function () {
		// TODO: render popup html to be used instead of prompt & alerts
	};

	this._render = function () {
		this._renderBoard();
		this._renderPlayers();
		this._renderPopup();
	};

	this._dropBlock = function(event){
		that._connect4.setBlock($(event.toElement).attr("data-col"));
	};

	this._renderBlock = function (data) {
		if(!data.is_column_full){
			var $block = jQuery('<div/>', {
				id: 'block'+data.column+data.row,
				class: 'block',
				style: 'width:'+(that._blockWidth - 6)+'px;height:'+(that._blockHeight - 6)+'px;background-color: '+data.player.color+';transform: translate('+(data.column*that._blockWidth+3)+'px,0)'
			});
			$(".board__blocks-wrapper").append($block);
			// force to compute styles to make transform animation run
		    window.getComputedStyle(document.getElementById('block'+data.column+data.row)).transform;
		    $block.css('transform','translate('+(data.column*that._blockWidth+3)+'px,'+(data.row*that._blockWidth+3+that._boardMargin)+'px)');
		}else{
			alert("Column Full");
		}
	};

	this._showWinPopup = function (data) {
		// TODO: change alert with fancy popup
		alert(data.winner.name+" Win");
		// TODO: reset or restart the game instead of reloading the page
		location.reload();
	};

	this._showDrawPopup = function (data) {
		// TODO: change alert with fancy popup
		alert("Draw Game, Nobody Win");
		// TODO: reset or restart the game instead of reloading the page
		location.reload();
	};

	this._showPopup = function (title, content) {
		// TODO: 
	};

	this.start = function (config) {
		config = config || {};
		// Add Players
		for (var i = 1; i <= 2; i++) {
			var playerName = prompt("Enter Player "+i+" name:");
			that._players.push(new Player(playerName));
		}
		// create conncet4 instance
		that._connect4 = new Connect4({
			players: that._players
		});
		// subscribe to connect4 instance events
		that._connect4.on('move:end',that._renderBlock);
		that._connect4.on('game:win',that._showWinPopup);
		that._connect4.on('game:draw',that._showDrawPopup);
		// render the ui
		that._render();
	};

	return { start: that.start };
})();