/* Types
 * Contains definitions of each of the 
 * Enemy
 * Item
 * types
 */

var Types = Types || {};
Types.item = [
	{ img : "assets/images/sprites/tablechairs.png", block : true },	// 0
	{ img : "assets/images/sprites/armor.png", block : true },		// 1
	{ img : "assets/images/sprites/plantgreen.png", block : true, looping: true, audioFile: "assets/audio/river.ogg" },	// 2   //River
	{ img : "assets/images/sprites/lamp.png", block : false },		// 3
	{ img : "assets/images/sprites/lamp.png", block : true, looping: true, audioFile: "assets/audio/clock.ogg"},		// 4		//Goal
	{ img : "assets/images/sprites/tablechairs.png", block : false, looping: false, audioFile: "assets/audio/pillow.wav"}		// 5		//Level complete
];

Types.enemy = [
	{ img : "assets/images/guard.png", moveSpeed : 0.05, rotSpeed : 3, totalStates : 13, z: 0, audioFile:  "assets/audio/footsteps.ogg" },
	{ img : "assets/images/guard.png", moveSpeed : 0.01, rotSpeed : 2, totalStates : 13, z: -3, audioFile: "assets/audio/pig.ogg" }
];
