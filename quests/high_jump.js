var title = "The High Jumper";
var desc = "Get to the top of tree in your Magic Rock's memory-place, <b>Activating<\/b> whatever you need along the way.";
var offer = "You know that poem in the beginning of <i>The Great Gatsby<\/i>?<split butt_txt=\"Eh? Maybe\" \/>I remember really liking it, but I can't remember how it goes. Help me?<split butt_txt=\"I'll try\" \/>OK then. Let me transport you to my special memory place and we'll give it a go ...";
var completion = "Ah, yes - I remember! You did it!<split butt_txt=\"Oh yeah?\" \/>Yes, the poem goes like this ...<split butt_txt=\"...\" \/>Then wear the gold hat, if that will move her;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if you can bounce high, bounce for her too,<br> Till she cry \"Lover, gold-hatted, high-bouncing lover,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I must have you!\"<split butt_txt=\"Oh yeah! I remember that too!\" \/>I feel like I should give you a <b>Gold Hat<\/b> now ... but the Giants haven't made a mind-picture of it yet.<split butt_txt=\"Awwww ...\" \/>Oh well. Whatever. Great poem, great poem. Here's a lil' something more.";


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
var prereq_quests = ["de_embiggenify_part2"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r198"	: {
		"type"		: "flag",
		"name"		: "top_of_tree",
		"desc"		: "Get to the top of the tree"
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"		: 200,
	"currants"	: 100
};

function onComplete_custom(pc){
	pc.prompts_add_delayed({
		txt		: 'Just jump off the tree to go back to where you were…',
		icon_buttons	: false,
		timeout_value	: '',
		timeout		: 10,
		choices		: [
			{ value : '', label : 'Ok' }
		],
		callback	: ''
	}, 1);
}

function onStarted(pc){
	if (config.is_dev){
		var template_tsid = 'LHH37ET29CT1CBO';
	}
	else{
		var template_tsid = 'LLI19Q27KMF175V';
	}
	
	pc.events_add({ callback: 'instances_create_delayed', tsid: template_tsid, instance_id: 'top_of_tree', x: -315, y: -53, exit_delay: 2*60}, 0.1);
	
	return { ok: 1 };
}

//log.info("high_jump.js LOADED");

// generated ok (NO DATE)
