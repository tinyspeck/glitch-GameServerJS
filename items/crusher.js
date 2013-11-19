//#include include/events.js

var label = "Crusher";
var version = "1314292154";
var name_single = "Crusher";
var name_plural = "Crushers";
var article = "a";
var description = "Beware of the Crusher. For it will, as the name implies, crush.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["crusher"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.drop_height = "0";	// defined by crusher
	this.instanceProps.ratchet_steps = "1";	// defined by crusher
	this.instanceProps.ratchet_interval = "1000";	// defined by crusher
	this.instanceProps.teleport_point = "0,0";	// defined by crusher
	this.instanceProps.top_delay = "1";	// defined by crusher
	this.instanceProps.bottom_delay = "1";	// defined by crusher
	this.instanceProps.movement_type = "vertical";	// defined by crusher
	this.instanceProps.start_point = "";	// defined by crusher
}

var instancePropsDef = {
	drop_height : ["the distance in y-pixels that the crusher moves each time it drops (this is always all in one go)"],
	ratchet_steps : ["the number of steps it takes to get back in to its original position (so, it will always move ((drop height)\/(ratchet steps)) pixels per step on the way up"],
	ratchet_interval : ["the number of milliseconds between ratchet move messages"],
	teleport_point : ["the x,y in the current level to send the player in the case of collision"],
	top_delay : ["the number of seconds before the crusher drops (or moves right), counted from the point at which it got back to its original position"],
	bottom_delay : ["the number of seconds between drops, counted from the last ratchet step movement"],
	movement_type : ["horizontal or vertical (for consistency, the crusher's original position is always considered to be the top or leftmost)"],
	start_point : ["x,y position that we are supposed to start from"],
};

var instancePropsChoices = {
	drop_height : [""],
	ratchet_steps : [""],
	ratchet_interval : [""],
	teleport_point : [""],
	top_delay : [""],
	bottom_delay : [""],
	movement_type : ["vertical","horizontal"],
	start_point : [""],
};

var verbs = {};

function endDrop(){ // defined by crusher
	//log.info(this+' endDrop');
	this.container.apiSendAnnouncement({
		type: 'play_sound',
		sound: 'CRUSHER_IMPACT'
	});

	var delay = intval(this.getInstanceProp('bottom_delay'));
	if (delay){
		this.apiSetTimer('endDropDelayed', delay*1000);
	}
	else{
		this.endDropDelayed();
	}
}

function endDropDelayed(){ // defined by crusher
	//log.info(this+' endDrop delay complete');
	var distance = intval(this.getInstanceProp('drop_height'));
	var steps = intval(this.getInstanceProp('ratchet_steps'));
	//var interval = intval(this.getInstanceProp('ratchet_interval'));
	//log.info(this+' endDrop params: '+distance+', '+steps+', '+interval);

	if (this.getInstanceProp('movement_type') == 'vertical'){
		var step_distance = Math.round(distance / steps);
		this.apiMoveToXY(this.x, this.y-step_distance, 1000, 'onRatchet', 1); 
	}
	else{
		var step_distance = Math.round(distance / steps);
		this.apiMoveToXY(this.x-step_distance, this.y, 1000, 'onRatchet', 1); 
	}

	/*
	for (var i = 1; i <= steps; i++){
		if (this.getInstanceProp('movement_type') == 'vertical'){
			var next_move = this.y-Math.round(distance / steps * i);
		}
		else{
			var next_move = this.x-Math.round(distance / steps * i);
		}

		this.events_add({next_move: next_move, callback: 'onRatchet'}, (interval / 1000 * i));
	}

	this.apiSetTimer('startDrop', steps * interval);*/
}

function onCollisionTeleport(details){ // defined by crusher
	var pos = this.getInstanceProp('teleport_point').split(',');
	details.pc.teleportToLocation(this.container.tsid, intval(pos[0]), intval(pos[1]));

	delete details.pc['!crusher_collided'];

	details.pc.removePhysics(this.tsid, true);

	details.pc.stopHitAnimation();

	details.pc.playEmotionAnimation('angry');
	var mood = details.pc.metabolics_lose_mood(2 * details.steps);
	details.pc.apiSendAnnouncement({
		type: "pc_overlay",
		duration: 2000,
		delay_ms: 0,
		locking: true,
		width: 100,
		height: 100,
		bubble_talk: true,
		pc_tsid: details.pc.tsid,
		delta_x: 0,
		delta_y: -114,
		text: [
			'<span class="simple_panel">Ow. Crushers suck!</span>'
		],
		rewards: {
			mood: mood
		}
	});
}

function onCollisionTick(details){ // defined by crusher
	if (details.step % 2){
		var hit_type = 'hit1';
		var face = 'right';
	}
	else{
		var hit_type = 'hit2';
		var face = 'left';
	}

	var pos = this.getInstanceProp('teleport_point').split(',');
	if (details.distance){
		details.pc.teleportToLocation(this.container.tsid, details.pc.x+details.distance, intval(pos[1])-100);
	}
	else{
		details.pc.teleportToLocation(this.container.tsid, details.pc.x, intval(pos[1])-100);
	}
	details.pc.playHitAnimation(hit_type);
	//details.pc.metabolics_lose_mood(2);
}

function onCreate(){ // defined by crusher
	this.initInstanceProps();
	this.apiSetHitBox(125, 125);

	this.apiSetTimer('startDrop', 1000);
}

function onPlayerCollision(pc){ // defined by crusher
	if (pc.buffs_has('crusher_invincibility')) return;
	if (pc['!crusher_collided']) return;

	pc['!crusher_collided'] = true;
	pc.announce_sound('CRUSHER_COLLISION');

	var pos = this.getInstanceProp('teleport_point').split(',');
	var distance = pc.distanceFromPlayerXY(pos[0], pos[1]);
	var steps = Math.floor(distance / 100);

	if (steps){
		if (pos[0] - pc.x){
			var move_distance = -100;
		}
		else{
			var move_distance = 100;
		}
		pc.addCTPCPhysics({gravity: 0}, this.tsid);
		pc.playHitAnimation('hit1');
		pc.teleportToLocation(this.container.tsid, pc.x+move_distance, pc.y-100);

		for (var i=2; i<=steps; i++){
			this.events_add({callback: 'onCollisionTick', pc: pc, step: i, distance: move_distance}, 0.3*(i-1));
		}

		//this.events_add({callback: 'onCollisionTick', pc: pc, step: steps+1}, 0.3*steps);
	}

	this.events_add({callback: 'onCollisionTeleport', pc: pc, steps: steps}, (steps*0.3));
}

function onRatchet(details){ // defined by crusher
	//log.info(this+' details: '+ details);
	var distance = intval(this.getInstanceProp('drop_height'));
	var steps = intval(this.getInstanceProp('ratchet_steps'));

	if (details == steps) return this.startDrop();

	if (this.getInstanceProp('movement_type') == 'vertical'){
		var step_distance = Math.round(distance / steps);
		this.apiMoveToXY(this.x, this.y-step_distance, step_distance, 'onRatchet', details+1); 
	}
	else{
		var step_distance = Math.round(distance / steps);
		this.apiMoveToXY(this.x-step_distance, this.y, step_distance, 'onRatchet', details+1); 
	}

	/*
	if (this.getInstanceProp('movement_type') == 'vertical'){
		this.apiSetXY(this.x, details.next_move);
	}
	else{
		this.apiSetXY(details.next_move, this.y);
	}*/
}

function startDrop(){ // defined by crusher
	if (!intval(this.getInstanceProp('drop_height'))){
		this.apiSetTimer('startDrop', 1000);
		return;
	}

	if (this.getInstanceProp('start_point')){
		var start_point = this.getInstanceProp('start_point').split(',');
		if (this.x != start_point[0] || this.y != start_point[1]){
			this.apiSetXY(start_point[0], start_point[1]);
		}
	}

	var delay = intval(this.getInstanceProp('top_delay'));
	if (delay){
		this.apiSetTimer('startDropDelayed', delay*1000);
	}
	else{
		this.startDropDelayed();
	}
}

function startDropDelayed(){ // defined by crusher
	var distance = intval(this.getInstanceProp('drop_height'));

	if (this.getInstanceProp('movement_type') == 'vertical'){
		this.apiMoveToXY(this.x, this.y+distance, 1000, 'endDrop'); 
	}
	else{
		this.apiMoveToXY(this.x+distance, this.y, 1000, 'endDrop'); 
	}

	//this.apiSetTimer('endDrop', distance / 800 * 1000);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-65,"y":-127,"w":130,"h":128},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHp0lEQVR42sVY+VNTVxR+v1hnagv2\nh7Y62nEpoh0dsbajtYymUvepxQ2qoyVlpOJCiSgSWR8hLIksgbCEAJriggsgoOM2iKkzLTpTlT8h\nf4J\/wun7bnPe3Ly8LLYdm5kzSW5u7v3OOd\/57rlPUf6D14sXk6nTL6c8v\/85GZq4PxxyNtWoOTk5\nqcrbfP3xamrR9KsnluevnmQ\/ffZAnXg4nH37zpBlZGLIOjx+PTQycZ18\/Z109Fg+5eUfoTNlp2lo\n+DJhHDY8PuTBXPxHtluTt1L\/UUSezTy2PpuZUoPT98dujl0OXb11ifoC3eTtadM3lQ3gYDdGr5AW\nxajfAbauURX\/xzwd\/PjQa83BwOjEdTUJUFPqw+B4YPTutddj927Qo+AdejA1TpNP7wobvXPDFJxs\nA4O91NRcT4NDF\/Wxm7ev0mXtO8w30EmulnoqKz8rrLa+mhrcddTp81DvQBdl790d1OBYowA++m18\n7NdrfdTe1UJdve1icpu3WViP3yuMv8vW0dUq5l4c9OsgZOsL9IjfYxmAqXVVdKKokLK2bCYNCqWv\nSMe7TQc3\/fLxWP9gD7maG6jBVfevrMvfThfaGml\/zl76\/Is1VFCYrxu+L1m6mNKXL6ONmzLFHIyD\ns\/tz99LcD+YKgGu1eWnL0oICHLh2b3KE3K2NcTcG+DbvhYixZo9LmHFeR3crFZ85JTaE7d7zHR06\n8gMtWLhAAJBtzpx3Begdu7aJOYjeRx9\/SKtWr8TvFuX5zGOb\/1JXXHCNbid19nq0yDRFAfQNeHXn\nahwVVGQ7Ttt2bKGWdhf9UnKSZs2aJQwANloyxWcjSAYKgIikBFBVRiau2OBxIoDdfR3iXR4HYADk\n8YrqMso9uE9sePxkAdU1qFSovXMkAQBAY4FE9AAMjoR5GFQCV3uDxjSxFdlOCI6AwJ7O5igaGNPu\nbKwle8VZAfJsWTFV15aL8fyjeQIAosMgESUzkBzN8OeA0tXrCcaKXKm9RCwGb1wtTlOe2itKhSMg\nPI\/VOqt1q1LPizEUCMgPgGzxQIZNVdq7W0wB2s4U6emYP3+eqM6mC\/Wmjmzd\/i3t2LlNRBQyxWoA\nTjLAimq7SPP6Det0gCieBAAtMQEiMtAlVBgW8\/raNL2qTMhTGCiB6BnnQE6Yf8zJrK2b4wP09XsD\nLe1ufREQG1zCZ4yDY+7WBk3xq6i86pwpOAgt5qJgnE0qLfxkgR452XBO8+YoBI4k65+J2ZSegQ4r\nFoYhSkhLqd0myA4rKy8RhD93\/rRpVJirBw\/n0vadW2meRoeVqz4zdQbO5xdYI3iIlMeJ4Gsh1r7+\njlCNo1zz2i6AAJBsAIzF5c0AFuOQFkTr6M9W2pC5XtiP1kPif2aUKC4p0oUbHE\/AQRIAe\/q9Hmwk\ng0IEuBJlcCWlNg1QuQCFeQBkdIiN04z\/4zOvk7FmdTL8g80IgJrGqcZUGCPGhhQhpdgQejd79jum\n4EANR32NXs0YY4rgyIMmwhIADEYBBDBemKMELsoFwREB177J2hgRdTPHMMYAUe3QPxhSHT7SYusg\nXrLUYBPwEJ8BFEAQAXlDVHl+QR6lpLwfAS7ecYk1ARRiD3CIInMxTqGoit\/vT+XjKpb3RgFPX54m\nUstHmtEBdkL+zg4AIDgI\/kFjWbjDZ280QMgMnxDnK0v1zQAMZym4FKl5laJKGRyKSz6boYeYg7Vk\nWWLAAFh0+qQOCMcfIgk+mjQRqqJ1MhEFAlBGwhsBmqWVW682r1uXKgaIooIxQNVZKYQaICA1fKqY\nRDGgNLidqpErXBgwOUKIAgu3PI5NWexRBOAuO4aiAhgA4bm4kyBiSC86F\/AxBsCgov0pIIuvLA\/J\nGk4guUmAASBoAs4iQuAbA0T\/yUINcOAjzCTFnogIAlgicEgxOuZP05YKnmEM3bZxHgszuhgAQcfD\nANFbQk+5QOIIthqVYjZuFJCyrzO\/iuqYITFcQHKfCEB5Px2hPfu+DwMtFyCYg+Aq1sXZzQ1DnL5w\nTKl3ObLNAGJTGDZAitCJgJOnigsFSFQyH2WYczjvkOAVqpL7Phk0r4l2DM5z0xDvCqDZIsXlcqWa\nAcSZy20QFgAIpB8NAiKHVMtah2IA3+AIooN+Ul4PUUMRdfa20YHcfYKTSTQKFnGSyIIMoiMN8Fpu\ni2QOxuMpdNQo3FgT4JqanfTlurXJAIOFRASdbocV\/EC3i4hwVwzADA6pS7ai5ULDAYC0wmFcGXbt\n3pksuL8rOBy9wLETBQKIo6FGeAoZkAHiKYCxg849eCDiooSI8y0Q64ESkB+sB4eR4iQuSdGdDABi\nYQCxa7IBcPAaHOKDnEXWeGeBdKAb4bssOwTZwJoyQKgBX97NnjDESLGiOOrVEFcUPOd2ise464h1\nF5F5Kj\/e+GzlClGtHD2WGzbp7hs\/xZxeeM0Xa5l7WMiStUlEDGmE8V3YeL+QW3hUPlcy3iFD8twE\nVRzQn2wtWbI4CCDwHGC4mYSxl3z1TGTGEwGOyU4gvUyJOJekbOOjwYyUlPdmEoVcBi4biyz+b7w+\nys9jkuAdwGXEe8hqDYfWWEnB8OUl0eLBMLHpDS0Uflj51h66W8KOziSQkGDEU9T\/6ZURBizbG73+\nAg6DYoRDV5LZAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1285880597-7811.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("crusher.js LOADED");

// generated ok 2011-08-25 10:09:14 by eric
