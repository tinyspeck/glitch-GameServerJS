var title = "Vision Quest";
var desc = "Help a fledgling delivery frog pass his flight exam.";
var offer = "So you like looking at things, right? And I hear with your mastery of <b>Eyeballery<\/b>, you’re pretty good at it too.<split butt_txt=\"Well, I don’t want to toot my own horn…\" \/>You know Horntootlery now too? Why, you’re quite the polymath. But I’m not here to talk about your maths. I’m here because someone needs your help.<split butt_txt=\"OK, I’ll do it.\" \/>Wait, don’t you want to hear what it is first? No? You’re going to need to take a bit of a trip, so are you absolutely sure you’re ready?";
var completion = "That was a good thing you did. You’re a real mensch, or ladysch, or undeclaredsch. Whatever the word for that thing you are is, you’re it.<split butt_txt=\"Thanks… I think.\" \/>You’re welcome, kid. And for your good works, some goodies—";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"vision_quest"	: {
		"dev_tsid"	: "LMF16RB299J2MTJ",
		"prod_tsid"	: "LNVUCOIA1MJ2M54"
	}
};

var requirements = {
	"r350"	: {
		"type"		: "flag",
		"name"		: "identify_object",
		"class_id"	: "npc_myopic_frog",
		"desc"		: "Press 'C' to enter Camera Mode and to identify an object from long way away"
	}
};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(250 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(40 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"	: 400,
	"mood"	: 250,
	"favor"	: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 40
		}
	}
};

function createRandomItem(){
	var classes = ['npc_piggy', 'pumpkin', 'trant_fruit', 'rock_sparkly_1', 'npc_crab', 'lemburger'];
	//var classes = ['npc_piggy'];
	var item_class = choose_one(classes);
	
	if (this.random_item) {
		this.random_item.apiDelete();
	}
	
	var x = -1381
	var y = -206;
	if (item_class == 'rock_sparkly_1') {
		y += 20;
	} else if (item_class == 'trant_fruit') {
		x += 25;
		y += 15;
	}
	
	this.random_item = this.owner.get_location().createItemStack(item_class, 1, x, y);
	
	if (item_class = 'trant_fruit') {
		this.random_item.setInstanceProp('maturity', '10');
	}
}

function getRandomItem(){
	if (!this.random_item) {
		this.createRandomItem();
	}
	
	return this.random_item.formatStack(1);
}

function guess(item_class){
	if (!this.random_item) {
		this.createRandomItem();
	}
	
	if (item_class == this.random_item.class_tsid) {
		return true;
	} else {
		return false;
	}
}

function onComplete_custom(pc){
	pc.instances_exit('vision_quest');
}

function onEnterLocation(location){
	this.createRandomItem();
}

function onExitLocation(location){
	this.owner.failQuest(this.class_tsid);
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'vision_quest', 1240, -197, 5 * 60);
	
	return {ok: 1};
}

//log.info("eyeballery_identify_object.js LOADED");

// generated ok (NO DATE)
