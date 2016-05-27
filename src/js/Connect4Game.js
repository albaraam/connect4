var Connect4Game = (function () {

	var _connect4 = null;
	var _players = [];

	var _board_rows_number = 6;
	var _board_columns_number = 7;
	var _board_selector =  'body';
	var _board_margin = 0;
	var _block_width = 0;
	var _block_height = 0;

	/**
	 * Render a board that fit its container using some calculations 
	 */
	var _renderBoard = function () {
		var board_container_width = $(_board_selector).width(),
			board_container_height = $(_board_selector).height(),
			board_width, board_height, board_margin, column_width, column_height;
		
		board_width = Math.min(board_container_width, board_container_height);
		board_height = (board_width * _board_rows_number) / _board_columns_number;
		board_margin = (board_container_height - board_height) / 2;

		column_width = board_width / _board_columns_number;
		column_height = board_height;

		_block_width = _block_height = column_width;
		_board_margin = board_margin;

		var $board = jQuery('<div/>', {
			id: 'connect4_board',
			class: 'board',
			style: 'width:'+board_width+'px; height:'+board_height+'px;padding:'+board_margin+'px 0;'
		});

		for (var i = 0; i < _board_columns_number; i++) {
			$column = jQuery('<div/>', {
				class: 'board__col',
				'data-col': i,
				style: 'width:'+column_width+'px; height:'+column_height+'px;'
			});
			// add click listner to columns to play next move
			for (var j = 0; j < _board_rows_number; j++) {
				$column.append(jQuery('<div/>', {
					class: 'board__col__block',
					'data-col': i,
					'data-row': j,
					style: 'width:'+_block_width+'px; height:'+_block_height+'px;'
				}));
			}
			$column.click(_dropBlock);
			$board.append($column);
		}
		var $blocksWrapper = jQuery('<div/>', {
			class: 'board__blocks-wrapper',
		});
		$board.append($blocksWrapper);

		$(_board_selector).prepend($board);
	};

	var _renderPlayers = function () {
		// TODO: render players names on screen
	};

	var _renderPopup = function () {
		// TODO: render popup html to be used instead of prompt & alerts
	};

	/**
	 * Render the whole game UI.
	 */
	var _render = function () {
		_renderBoard();
		_renderPlayers();
		_renderPopup();
	};

	/**
	 * Used as callback for board (columns) click listeners
	 */
	var _dropBlock = function(event){
		_connect4.setBlock($(event.target).attr("data-col"));
	};

	/**
	 * Render a single block (chip) on the board
	 * Used as callback after each move
	 *
	 * @param {object} data The data, contains is_column_full, row & column of the block.
	 */
	var _renderBlock = function (data) {
		if(!data.is_column_full){
			var $block = jQuery('<div/>', {
				id: 'block'+data.column+data.row,
				class: 'block',
				style: 'width:'+(_block_width - 6)+'px;height:'+(_block_height - 6)+'px;background-color: '+data.player.color+';transform: translate('+(data.column*_block_width+3)+'px,0)'
			});
			$(".board__blocks-wrapper").append($block);
			// force to compute styles to make transform animation run
		    window.getComputedStyle(document.getElementById('block'+data.column+data.row)).transform;
		    $block.css('transform','translate('+(data.column*_block_width+3)+'px,'+(data.row*_block_width+3+_board_margin)+'px)');
		}else{
			alert("Column Full");
		}
	};

	var _showWinPopup = function (data) {
		// TODO: replace alert with a fancy popup
		alert(data.winner.name+" Win");
		// TODO: reset or restart the game instead of reloading the page
		location.reload();
	};

	var _showDrawPopup = function (data) {
		// TODO: replace alert with a fancy popup
		alert("Draw Game, Nobody Win");
		// TODO: reset or restart the game instead of reloading the page
		location.reload();
	};

	var _showPopup = function (title, content) {
		// TODO: 
	};

	/**
	 * Start the gae
	 *
	 * @param {object} config
	 * @public
	 */
	var start = function (config) {
		config = config || {};
		// Add Players
		for (var i = 1; i <= 2; i++) {
			var playerName = prompt("Enter Player "+i+" name:");
			_players.push(new Player(playerName));
		}
		// create conncet4 instance
		_connect4 = new Connect4({
			players: _players
		});
		// subscribe to connect4 instance events
		_connect4.on('move:end',_renderBlock);
		_connect4.on('game:win',_showWinPopup);
		_connect4.on('game:draw',_showDrawPopup);
		// render the ui
		_render();
	};

	return { start: start };
})();