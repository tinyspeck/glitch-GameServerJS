var title = "Shucks To Be You";
var desc = "Shuck herbs until you have 6 seeds. Then plant the seeds, and harvest the herbs.";
var offer = "The circle of all life can be traced to one simple, physical act, little Herbalist. <split butt_txt=\"And that is?\" \/> <b>Shucking<\/b>. You like to shuck, kid? <split butt_txt=\"I'm sorry?\" \/> Shucking! No new Herbs exist without someone having shucked the generation before them. A good vigorous shuck provides the seeds for Herbal life as we know it to continue. <split butt_txt=\"I *think* I know what you mean…\" \/>Try it: take these Herbs, and shuck them to release <b>6 Seeds<\/b>, then plant those seeds to grow new Herbs, and harvest them. You in?";
var completion = "Beautiful isn't it? <split butt_txt=\"Shucking?\" \/> The act of shucking is beautiful, of course, but the whole circle of life thing: each generation giving up Seeds for the next, and… oh. You're just waiting for your reward, aren't you? <split butt_txt=\"Yes.\" \/> Go on, then, you little shucker. Take these tiny tokens, and begone…";


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
	"r325"	: {
		"type"		: "counter",
		"name"		: "seeds_extracted",
		"num"		: 6,
		"class_id"	: "herb_seed_yellow_crumb_flower",
		"desc"		: "Shuck herbs until you have 6 seeds"
	},
	"r326"	: {
		"type"		: "counter",
		"name"		: "herb_seeds_planted_shucks",
		"num"		: 6,
		"class_id"	: "herb_seed_gandlevery",
		"desc"		: "Plant 6 seeds"
	},
	"r327"	: {
		"type"		: "counter",
		"name"		: "harvest_herb_shucks",
		"num"		: 6,
		"class_id"	: "hairball_flower",
		"desc"		: "Harvest your herbs"
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
	xp = pc.stats_add_xp(round_to_5(300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 300,
	"currants"	: 200,
	"mood"		: 50,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 30
		}
	}
};

function doProvided(pc){ // generated from provided
	pc.createItemFromFamiliar('gandlevery', 1);
	pc.createItemFromFamiliar('rookswort', 1);
	pc.createItemFromFamiliar('rubeweed', 1);
	pc.createItemFromFamiliar('hairball_flower', 1);
	pc.createItemFromFamiliar('yellow_crumb_flower', 1);
	pc.createItemFromFamiliar('purple_flower', 1);
	pc.createItemFromFamiliar('silvertongue', 1);
}

//log.info("herbalism_harvest_shuck_and_plant_herbs.js LOADED");

// generated ok (NO DATE)
