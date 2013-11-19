var title = "Grub Giver";
var desc = "In one game day, make each recipe that a <a href=\"event:item|awesome_pot\">Awesome Pot<\/a> can make, and give each item away to a different person.";
var offer = "Do you like pot?  <split butt_txt=\"Uhhh...\" \/> Oh wait, I mean do you like your Awesome Pot?  <split butt_txt=\"It's pretty awesome.\" \/>  Wouldn't it feel great to share your";
var completion = "Paying it forward is it's own reward... <split butt_txt=\"Ok...\" \/> O, and here's a little something for your trouble.... Pay it forward.";


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
var locations = {};
var requirements = {
	"r417"	: {
		"type"		: "make",
		"recipe_id"	: 40,
		"num"		: 1,
		"desc"		: "Make an Awesome Stew"
	},
	"r418"	: {
		"type"		: "make",
		"recipe_id"	: 93,
		"num"		: 1,
		"desc"		: "Make a Flummery"
	},
	"r419"	: {
		"type"		: "make",
		"recipe_id"	: 32,
		"num"		: 1,
		"desc"		: "Make an Ix-style Braised Meat"
	},
	"r420"	: {
		"type"		: "make",
		"recipe_id"	: 37,
		"num"		: 1,
		"desc"		: "Make a Meat Tetrazzini"
	},
	"r421"	: {
		"type"		: "make",
		"recipe_id"	: 30,
		"num"		: 1,
		"desc"		: "Make a Tasty Pasta"
	},
	"r422"	: {
		"type"		: "make",
		"recipe_id"	: 224,
		"num"		: 1,
		"desc"		: "Make a Hi-Sucrose Corn Syrup Square"
	},
	"r423"	: {
		"type"		: "make",
		"recipe_id"	: 35,
		"num"		: 1,
		"desc"		: "Make a Meat Gumbo"
	},
	"r424"	: {
		"type"		: "make",
		"recipe_id"	: 143,
		"num"		: 1,
		"desc"		: "Make a Pickle"
	},
	"r425"	: {
		"type"		: "make",
		"recipe_id"	: 22,
		"num"		: 1,
		"desc"		: "Make a Proper Rice"
	},
	"r426"	: {
		"type"		: "make",
		"recipe_id"	: 94,
		"num"		: 1,
		"desc"		: "Make a Tangy Noodles"
	},
	"r427"	: {
		"type"		: "make",
		"recipe_id"	: 39,
		"num"		: 1,
		"desc"		: "Make a Chilly-Busting Chili"
	},
	"r428"	: {
		"type"		: "make",
		"recipe_id"	: 33,
		"num"		: 1,
		"desc"		: "Make a Fortifying Gruel"
	},
	"r429"	: {
		"type"		: "make",
		"recipe_id"	: 34,
		"num"		: 1,
		"desc"		: "Make an Abbasid Ribs"
	},
	"r430"	: {
		"type"		: "make",
		"recipe_id"	: 34,
		"num"		: 1,
		"desc"		: "Make an Abbasid Ribs"
	},
	"r431"	: {
		"type"		: "make",
		"recipe_id"	: 31,
		"num"		: 1,
		"desc"		: "Make a Yummy Gruel"
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
	xp = pc.stats_add_xp(round_to_5(10 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(10 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(10 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(10 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(200 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 10,
	"currants"	: 10,
	"mood"		: 10,
	"energy"	: 10,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 200
		}
	}
};

//log.info("grub_giver.js LOADED");

// generated ok (NO DATE)
