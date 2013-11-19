var title = "Bartending with Yourself... Oh Oh Oh, Bartending with Yourself";
var desc = "Make, and also drink, both a <a href=\"event:item|cloudberry_daiquiri\">Cloudberry Daiquiri<\/a> and a <a href=\"event:item|cosmapolitan\">Cosma-politan<\/a>.";
var offer = "Ever taste a cloud, kid? <split butt_txt=\"I don't think so.\" \/> I have. It's like eating an angel while it's still warm. Next best thing is a <a href=\"event:item|cloudberry_daiquiri\">Cloudberry Daiquiri<\/a>. <split butt_txt=\"Sign me up!\" \/> Show yourself what kind of bartender you are. Make, and also drink, both a Cloudberry Daiquiri and a <a href=\"event:item|cosmapolitan\">Cosma-politan<\/a>. I'll check in with you when you're done.";
var completion = "Whoa! You smell like my Uncle Doug. How'd that Cloudberry Daiquiri and Cosma-politan treat you? <split butt_txt=\"They'll do.\" \/> Party in a pair of pants, that's you. Here's a little something for your next clambake. Hasta banana, kid.";


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
var prereq_quests = ["cocktailcrafting_make_level1_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r138"	: {
		"type"		: "make",
		"recipe_id"	: 67,
		"num"		: 1,
		"desc"		: "Make a Cloudberry Daiquiri"
	},
	"r139"	: {
		"type"		: "flag",
		"name"		: "VERB:cloudberry_daiquiri:drink",
		"class_id"	: "cloudberry_daiquiri",
		"desc"		: "Drink a Cloudberry Daiquiri"
	},
	"r140"	: {
		"type"		: "make",
		"recipe_id"	: 68,
		"num"		: 1,
		"desc"		: "Make a Cosma-politan"
	},
	"r141"	: {
		"type"		: "flag",
		"name"		: "VERB:cosmapolitan:drink",
		"class_id"	: "cosmapolitan",
		"desc"		: "Drink a Cosma-politan"
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
	xp = pc.stats_add_xp(round_to_5(600 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(400 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(60 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 600,
	"currants"	: 400,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 60
		}
	}
};

//log.info("cocktailcrafting_make_level2_recipes.js LOADED");

// generated ok (NO DATE)
