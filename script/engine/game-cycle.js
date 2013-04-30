/* GameCycle */
var lastGameCycleTime = 0;
var gameCycleDelay = 1000 / 30; // aim for 30 fps for game logic

function gameCycle() {
	var now = new Date().getTime();

	// time since last game logic
	var timeDelta = now - lastGameCycleTime;

	move(player, timeDelta);

	checkWinState();

	ai(timeDelta);

	var cycleDelay = gameCycleDelay;

	// the timer will likely not run that fast due to the rendering cycle hogging the cpu
	// so figure out how much time was lost since last cycle
	if(timeDelta > cycleDelay) {
		cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
	}

	// setTimeout(function() {
	//     requestAnimationFrame(gameCycle);
	//     // Drawing code goes here
	// }, cycleDelay);
	if(playing) {
		setTimeout(gameCycle, cycleDelay);
	}

	lastGameCycleTime = now;
}

function ai(timeDelta) {
	for(var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];

		var dx = player.x - enemy.x;
		var dy = player.y - enemy.y;

		var dist = Math.sqrt(dx * dx + dy * dy);
		if(dist > 4) {
			var angle = Math.atan2(dy, dx);

			enemy.rotDeg = angle * 180 / Math.PI;
			enemy.rot = angle;
			enemy.speed = 1;

			var walkCycleTime = 1000;
			var numWalkSprites = 4;

			enemy.state = Math.floor((new Date() % walkCycleTime) / (walkCycleTime / numWalkSprites)) + 1;

		} else {
			enemy.state = 0;
			enemy.speed = 0;
		}

		move(enemies[i], timeDelta);
	}
}

function checkWinState() {

	var levelGoals = goals[level],
		distX, distY, absDist, i;
	for(i = 0; i < levelGoals.length; i++) {
		goal = levelGoals[i];
		distX = goal.x - player.x;
		distY = goal.y - player.y;
		absDist = distX * distX + distY * distY;
		if(absDist < 2) {
			// preparingNewLevel = true;
			tearDownAudio();
			level++;
			init();
			continue;
		}
	}
}