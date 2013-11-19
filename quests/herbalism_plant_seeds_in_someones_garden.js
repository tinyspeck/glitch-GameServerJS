var title = "The Philantherbist";
var desc = "Surprise a friend by planting three Herb Seeds in a garden on their Home Street or back yard, or a stranger by planting three Herb Seeds in a Community Herb Garden. Spread the love, herbally speaking.";
var offer = "Do you know what's interesting about generosity, my Advanced Herbologist friend? <split butt_txt=\"It sounds like it begins with a J?\" \/> No. Well, yes. But more than that, generosity has been proven to improve the experience of all Herbs. <split butt_txt=\"Really?\" \/> Mhm. Try planting some Seeds – not many: three, say? – in a friend's Herb Garden for a surprise or planting some Seeds in a Community Garden for a stranger to find. Any Herb afterward will be just a little more… well, you in?";
var completion = "So? You planted Herbs for others? <split butt_txt=\"So. Herbs should be better now?\" \/> I said that? That doesn't sound right. Ah! Herbal experiences improve with Tinctures. That's what I meant. What you did, on the other hand? Pure philanthropy. You know what's interesting about philanthropy? <split butt_txt=\"It sounds like it begins with an F?…\" \/> Um. Have a reward, kid.";


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
	"r330"	: {
		"type"		: "counter",
		"name"		: "herb_seeds_planted_for_others",
		"num"		: 3,
		"class_id"	: "herb_seed_rubeweed",
		"desc"		: "Plant 3 herb seeds in a garden that's not yours"
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
	xp = pc.stats_add_xp(round_to_5(700 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(400 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(300 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(70 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 700,
	"currants"	: 400,
	"mood"		: 200,
	"energy"	: 300,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 70
		}
	}
};

//log.info("herbalism_plant_seeds_in_someones_garden.js LOADED");

// generated ok (NO DATE)
