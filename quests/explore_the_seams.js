var title = "Explore The Seams";
var desc = "Visit 3 \"Seam Streets\" located behind key-locked doors around the world. Hint: You will \"Finds\" the entrance to one of the seam streets on the west side of <a href=\"event:location|89\">Andra<\/a>. (To find the rest, you'll need to ask around, or go exploring!)";
var offer = "Ancient lore tells of locations made from the dreamy goo that act as \"seams\" between the fully-imagined regions of the world.<split butt_txt=\"Whoa.\">You will not find them on any map, and to be worthy of entering, you will need the correct key.<split butt_txt=\"Sounds exciting!\">Go forth, and visit 3 locations that act as \"seams\" between various regions of the world.";
var completion = "Congratulations, worthy glitch. You have visited 3 of the seam streets in the world.<split butt_txt=\"Hooray!\">The giants smile upon you!";


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
		"condition":	"has_achievement",
		"value":	"senior_ok_explorer"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r433"	: {
		"type"		: "counter",
		"name"		: "visit_seam_street",
		"num"		: 3,
		"desc"		: "Visit 3 Seam Streets"
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
	xp = pc.stats_add_xp(round_to_5(650 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(150 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 650,
	"currants"	: 300,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 150
		}
	}
};

function isNewVisit(location_tsid){
	if (!this.seams_visited) this.seams_visited = {};
	if (this.seams_visited[location_tsid]) return false;
	
	this.seams_visited[location_tsid] = time();
	return true;
}

function onAccepted(pc){
	this.seams_visited = {};
}

//log.info("explore_the_seams.js LOADED");

// generated ok (NO DATE)
