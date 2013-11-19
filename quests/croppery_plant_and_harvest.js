var title = "A Beltful of Onions";
var desc = "Plant and <b>Harvest<\/b> 50 <a href=\"event:item|onion\">Onions<\/a> from your <b>Garden<\/b> or from a <b>Community Garden<\/b>. Important: You can cultivate a Crop Garden in your yard or home street. You'll need a <a href=\"event:item|watering_can\">Watering Can<\/a>, a <a href=\"event:item|hoe\">Hoe<\/a>, and some <a href=\"event:item|seed_onion\">Onion Seeds<\/a>.";
var offer = "Hey, kid, I've got an important job for you. <split butt_txt=\"I like important jobs. They make me feel important.\" \/>Well, I can't name names, but someone pretty high up needs an onion belt. <split butt_txt=\"An onion belt? I love onion belts!\" \/>You and everybody else, kid. If you want to help, cultivate yourself a Crop Garden and Plant and <b>Harvest<\/b> 50 <a href=\"event:item|onion\">Onions<\/a>. Can you handle it?";
var completion = "What's this? A bunch of onions? <split butt_txt=\"Yup, just like you asked.\" \/>Oh. Oh, yeah. Bad news, kid. While you were working, onion belts went out of style. <split butt_txt=\"Well, dang.\" \/> Fashion is a capricious beast, kid. Don't let it get you down. Here's a little something extra for all your hard work. <split butt_txt=\"Thanks!\" \/> And as a little bonus, you can even keep those onions.";


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
	"r64"	: {
		"type"		: "counter",
		"name"		: "onions_harvested",
		"num"		: 50,
		"class_id"	: "onion",
		"desc"		: "Harvest Onions"
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
	xp = pc.stats_add_xp(round_to_5(450 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(45 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 450,
	"currants"	: 300,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 45
		}
	}
};

//log.info("croppery_plant_and_harvest.js LOADED");

// generated ok (NO DATE)
