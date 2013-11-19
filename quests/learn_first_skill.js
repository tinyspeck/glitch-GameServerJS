var title = "Start Learning Your First Skill";
var desc = "Choose a skill to start with. Click on your <b>Magic Rock<\/b> and press the button to start learning. (The skill picker will open in a new window.)";
var offer = "Choose a skill to start with. Click on your <b>Magic Rock<\/b> and press the button to start learning. (The skill picker will open in a new window.)";
var completion = "This is now in the getCompletion function.";


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
	"r119"	: {
		"type"		: "flag",
		"name"		: "learn_skill",
		"desc"		: "Start learning your first skill"
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
	xp = pc.stats_add_xp(round_to_5(100 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(1000 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(20 * multiplier));
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
	"xp"		: 100,
	"currants"	: 1000,
	"energy"	: 20
};

function getCompletion(pc){
	if (pc.skills_get_count() > 0){
		var completion = "Good job on learning that first skill, kid.<split butt_txt=\"Thanks\" /> ";
	}
	else{
		var completion = "Good job starting me on your first skill, kid. I will learn that up just as fast as I can and let you know when I'm done.<split butt_txt=\"Super\" /> ";
	}
	
	completion += "And that's it! I am going to stop bugging you and just let you play.<split butt_txt=\"Phew!\" />But if you ever need me, I am just a click away. <split butt_txt=\"Gotcha.\" />I've put a few more simple quests in your <b>Quest Log</b>. Check them out. (Hint: \"L\" will bring up the Quest Log.) <split butt_txt=\"Will do.\" />But anyways, nice job completing your first quest. Quests are a good way to get some sweet rewards. <split butt_txt=\"Gotcha\" />In this case I'm giving you some currants, energy and imagination points. Look out for the symbols below to see what you got.";;
	
	return this.expandText(completion, pc);
}

function onAccepted(pc){
	if (pc.skills_is_learning() || pc.skills_get_count() > 0){
		this.set_flag(pc, 'learn_skill');
	}
}

function onComplete_custom(pc){
	pc.startQuest('buy_bag', false, true);
	pc.startQuest('tutorial_reinforcement', false, true);
}

//log.info("learn_first_skill.js LOADED");

// generated ok (NO DATE)
