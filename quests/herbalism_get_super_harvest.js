var title = "Herbal Hat-Trickery";
var desc = "Get a 'super harvest' of Herb flowers, three times.";
var offer = "You know what's better than a single herbal harvest, my little underground gardener? <split butt_txt=\"No?\" \/> A double harvest. And the only thing better than a double harvest, of course, is… <split butt_txt=\"A triple harvest?\" \/> My Giant, you're good. Yes! <b>Triple!<\/b> A herbal SUPER-HARVEST! A super harvest of herbs from single seed is a marvel to behold. Of course, while it's marvellous to behold it once, it's even more impressive if you behold it twice. And the only thing better than that… <split butt_txt=\"I GET IT.\" \/> Ok, ok. Get a triple harvest of herbs three times. Maybe THEN you'll understand my excitement.";
var completion = "Super-triple-herbal harvest! Three times the herbs! Not once, not twice but three times! Now tell me that wasn't a marvel unlike anything you've ever seen before! <split butt_txt=\"It was certainly something.\" \/> That's right, kid! Something! And here's something else, just for being you.";


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
	"r329"	: {
		"type"		: "counter",
		"name"		: "super_harvest_herb",
		"num"		: 3,
		"class_id"	: "silvertongue",
		"desc"		: "Get 3 triple harvests of herb flowers"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 500,
	"currants"	: 300,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 50
		}
	}
};

//log.info("herbalism_get_super_harvest.js LOADED");

// generated ok (NO DATE)
