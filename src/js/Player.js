var Player = (function() {
	var nextId = 1;
	this.getRandomColor = function() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	};
	return function Player(name) {
		// auto id
		this.id = nextId;
		this.name = (name !== null && name !== '' && name !== 'undefined') ? name : 'Player '+nextId;
		this.color = getRandomColor();
		// auto increment
		nextId++;
	};
})();