var title = "Advanced Bean Fancification";
var desc = "Use a <a href=\"event:item|bean_seasoner\">Bean Seasoner<\/a> to transform two <a href=\"event:item|bean_plain\">Plain Beans<\/a> into two different kinds of <b>Seasoned Beans<\/b>. Hint: You're going to need other ingredients to do this. Get them from <b>Street Spirits<\/b> or your friends.";
var offer = "Consider the <b>Bean<\/b>, kid. <split butt_txt=\"Consider it considered.\" \/>I mean, your basic bean is all right. But here's what I want you to do. Get yourself two <a href=\"event:item|bean_plain\">Plain Beans<\/a>. Get yourself a <a href=\"event:item|bean_seasoner\">Bean Seasoner<\/a>. <split butt_txt=\"Beans. Seasoner. Check.\" \/>And then make two different kinds of <b>Seasoned Beans<\/b>. <split butt_txt=\"I feel ready for this.\" \/>You look ready, kid. One last thing: you're going to need to mess around with other ingredients to do this. Buy them, harvest them, or get them from friends. It doesn't matter which, just make sure you get them.";
var completion = "That was some mighty impressive Bean Seasoning, kid. I shouldn't say this, but I haven't seen such fine Beans since the days when Spriggan himself was seasoning them by hand. <split butt_txt=\"Wow. I don't know what to say.\" \/>Then don't say anything. Always a good call.";


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
	"r180"	: {
		"type"		: "counter",
		"name"		: "different_beans_seasoned",
		"num"		: 2,
		"class_id"	: "bean_seasoner",
		"desc"		: "Season Beans"
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
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(30 * multiplier));
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
	"xp"		: 300,
	"currants"	: 200,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 30
		}
	}
};

function onComplete_custom(pc){
	delete pc.stats.different_beans_seasoned;
}

//log.info("botany_make_tree_beans.js LOADED");

// generated ok (NO DATE)
