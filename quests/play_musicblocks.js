var title = "Blocks That Rock";
var desc = "Get out there and amp up other players' moods: 25 musicblocks, 25 players, 1 game day.";
var offer = "So you have quite a collection of tunes now, huh? <split butt_txt=\"Yeah, I'm a regular DJ.\" \/> Prove your metal, then, MC Glitch! Play 1 of each musicblock to 25 different players in 1 game day. <split butt_txt=\"Their ears will be ringing!\" \/>";
var completion = "Not bad! You're ready for your own 100-watt AM radio show. Okay, maybe FM. Anyway, hope you like the sound of your rewards, kid!";


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
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	10
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r437"	: {
		"type"		: "flag",
		"name"		: "musicblock_b_brown_01_played",
		"class_id"	: "musicblock_b_brown_01",
		"desc"		: "Played Musicblock BB-1"
	},
	"r444"	: {
		"type"		: "flag",
		"name"		: "musicblock_b_brown_02_played",
		"class_id"	: "musicblock_b_brown_02",
		"desc"		: "Played Musicblock BB-2"
	},
	"r445"	: {
		"type"		: "flag",
		"name"		: "musicblock_b_brown_03_played",
		"class_id"	: "musicblock_b_brown_03",
		"desc"		: "Played Musicblock BB-3"
	},
	"r446"	: {
		"type"		: "flag",
		"name"		: "musicblock_b_brown_04_played",
		"class_id"	: "musicblock_b_brown_04",
		"desc"		: "Played Musicblock BB-4"
	},
	"r447"	: {
		"type"		: "flag",
		"name"		: "musicblock_b_brown_05_played",
		"class_id"	: "musicblock_b_brown_05",
		"desc"		: "Played Musicblock BB-5"
	},
	"r448"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_blue_01_played",
		"class_id"	: "musicblock_d_blue_01",
		"desc"		: "Played Musicblock DB-1"
	},
	"r449"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_blue_02_played",
		"class_id"	: "musicblock_d_blue_02",
		"desc"		: "Played Musicblock DB-2"
	},
	"r450"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_blue_03_played",
		"class_id"	: "musicblock_d_blue_03",
		"desc"		: "Played Musicblock DB-3"
	},
	"r451"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_blue_04_played",
		"class_id"	: "musicblock_d_blue_04",
		"desc"		: "Played Musicblock DB-4"
	},
	"r452"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_blue_05_played",
		"class_id"	: "musicblock_d_blue_05",
		"desc"		: "Played Musicblock DB-5"
	},
	"r453"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_green_01_played",
		"class_id"	: "musicblock_d_green_01",
		"desc"		: "Played Musicblock DG-1"
	},
	"r454"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_green_02_played",
		"class_id"	: "musicblock_d_green_02",
		"desc"		: "Played Musicblock DG-2"
	},
	"r455"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_green_03_played",
		"class_id"	: "musicblock_d_green_03",
		"desc"		: "Played Musicblock DG-3"
	},
	"r456"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_green_04_played",
		"class_id"	: "musicblock_d_green_04",
		"desc"		: "Played Musicblock DG-4"
	},
	"r457"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_green_05_played",
		"class_id"	: "musicblock_d_green_05",
		"desc"		: "Played Musicblock DG-5"
	},
	"r458"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_red_01_played",
		"class_id"	: "musicblock_d_red_01",
		"desc"		: "Played Musicblock DR-1"
	},
	"r459"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_red_02_played",
		"class_id"	: "musicblock_d_red_02",
		"desc"		: "Played Musicblock DR-2"
	},
	"r460"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_red_03_played",
		"class_id"	: "musicblock_d_red_03",
		"desc"		: "Played Musicblock DR-3"
	},
	"r461"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_red_04_played",
		"class_id"	: "musicblock_d_red_04",
		"desc"		: "Played Musicblock DR-4"
	},
	"r462"	: {
		"type"		: "flag",
		"name"		: "musicblock_d_red_05_played",
		"class_id"	: "musicblock_d_red_05",
		"desc"		: "Played Musicblock DR-5"
	},
	"r463"	: {
		"type"		: "flag",
		"name"		: "musicblock_x_shiny_01_played",
		"class_id"	: "musicblock_x_shiny_01",
		"desc"		: "Played Musicblock XS-1"
	},
	"r464"	: {
		"type"		: "flag",
		"name"		: "musicblock_x_shiny_02_played",
		"class_id"	: "musicblock_x_shiny_02",
		"desc"		: "Played Musicblock XS-2"
	},
	"r465"	: {
		"type"		: "flag",
		"name"		: "musicblock_x_shiny_03_played",
		"class_id"	: "musicblock_x_shiny_03",
		"desc"		: "Played Musicblock XS-3"
	},
	"r466"	: {
		"type"		: "flag",
		"name"		: "musicblock_x_shiny_04_played",
		"class_id"	: "musicblock_x_shiny_04",
		"desc"		: "Played Musicblock XS-4"
	},
	"r467"	: {
		"type"		: "flag",
		"name"		: "musicblock_x_shiny_05_played",
		"class_id"	: "musicblock_x_shiny_05",
		"desc"		: "Played Musicblock XS-5"
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
	xp = pc.stats_add_xp(round_to_5(2500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(300 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(200 * multiplier));
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
	"xp"		: 2500,
	"mood"		: 300,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 200
		}
	}
};

function canPlayFor(pc){
	if (!this.played_for) this.played_for = {};
	if (this.played_for[pc.tsid]) return false;
	
	this.played_for[pc.tsid] = time();
	return true;
}

function onComplete_custom(pc){
	pc.buffs_remove('play_musicblocks');
}

function onStarted(pc){
	this.played_for = {};
	pc.buffs_apply('play_musicblocks');
	return {ok: 1};
}

//log.info("play_musicblocks.js LOADED");

// generated ok (NO DATE)
