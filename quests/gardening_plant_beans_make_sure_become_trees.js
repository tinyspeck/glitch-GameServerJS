var title = "Bean There, Done That";
var desc = "Plant three <b>Seasoned Beans<\/b> in three <a href=\"event:item|patch\">Patches<\/a> and lovingly nurture them through that trying <b>Seedling<\/b> phase. (Important: You can do this one bean at a time, not all at once.)";
var offer = "So, by now you've gotten the hang of this <b>Arborology<\/b> business, wouldn't you say? <split butt_txt=\"Plant. Water. Pet. No sweat.\" \/> Oh, sure, it's easy when you do it all random-like, running helter skelter all over Groddle Forest and such. <split butt_txt=\"Good point.\" \/> So I've got a challenge for you, my chartreuse-thumbed chum. I want you to plant three separate <b>Seasoned Beans<\/b>, and single-handedly raise them till they graduate from the <b>Seedling<\/b> stage. <split butt_txt=\"I can do it!\" \/> You know it. But you don't have to grow them all at once. One at a time is fine. Okay?";
var completion = "You've given those three <b>Seedlings<\/b> a promising start, young friend. <split butt_txt=\"It's all anyone can do.\" \/> I find this all strangely moving. <split butt_txt=\"Aw.\" \/> I'm feeling a little verklempt up here. Take this little reward, then scram so I can collect myself.";


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
	"r212"	: {
		"type"		: "counter",
		"name"		: "beans_planted",
		"num"		: 3,
		"class_id"	: "patch",
		"desc"		: "Plant three beans"
	},
	"r213"	: {
		"type"		: "counter",
		"name"		: "seedlings_fully_petted",
		"num"		: 3,
		"class_id"	: "patch_seedling",
		"desc"		: "Fully pet three seedlings"
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
	currants = pc.stats_add_currants(round_to_5(425 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(65 * multiplier));
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
	"currants"	: 425,
	"mood"		: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 65
		}
	}
};

//log.info("gardening_plant_beans_make_sure_become_trees.js LOADED");

// generated ok (NO DATE)
