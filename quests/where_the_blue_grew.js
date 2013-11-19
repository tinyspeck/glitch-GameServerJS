var title = "Operation: Grow";
var desc = "Solve the puzzle to brighten up the gloomy, forgotten bog fields. I bet Mab left a hint somewhere to help you out.";
var offer = "So dark. <split butt_txt=\"Say whaaa?\" \/> The forgotten bog fields have always been a little glum, but this place is the glum-iest! <split butt_txt=\"Which place?\" \/>  An out-of-the-way place that apparently only Mab can remember. <split butt_txt=\"I see.\" \/> Be a pal and see if you can brighten up the landscape a bit?";
var completion = "Wow, you're smarter than you look! <split butt_txt=\"Is that a compliment?\" \/> I mean that in a good way, champ. <split butt_txt=\"Okay then.\" \/>  Yeah, here’s a complementary reward even.";


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
		"value":	"shimla_mirch_completist"
}];
var end_npcs = [];
var locations = {
	"operation_grow"	: {
		"dev_tsid"	: "LRO15T6GC593RL7",
		"prod_tsid"	: "LIFI8QG9A093USI"
	}
};

var requirements = {
	"r516"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Solved Puzzle"
	},
	"r529"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "Complete the Journey"
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
	currants = pc.stats_add_currants(round_to_5(400 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("mab", round_to_5(200 * multiplier));
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
	"xp"		: 500,
	"currants"	: 400,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 200
		}
	}
};

function onComplete_custom(pc){
	//pc.instances_exit('operation_grow');
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
	
	if(pc.is_god)
	{
		pc.apiSendMsg({type: 'viewport_scale', scale: 1, time: 0});
	}
	
	pc.instances_exit('operation_grow');
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'operation_grow', -957, -138, 5*60, {preserve_links: true});
		
	return {ok: 1};
}

//log.info("where_the_blue_grew.js LOADED");

// generated ok (NO DATE)
