var title = "One For My Baby - and 23 More for the Road";
var desc = "Prove your consumate boozehoundery. Use a <a href=\"event:item|still\">Still<\/a> using your expert <a href=\"event:skill|distilling_1\">Distilling<\/a> skill and a handful of <a href=\"event:item|grain\">Grain<\/a>, <a href=\"event:item|corn\">Corn<\/a> or <a href=\"event:item|potato\">Potatoes<\/a>. Then sell, trade, flog, hawk or otherwise distribute your moonshine.";
var offer = "Pssssst! Kid! You available? I've heard rumours of impending disaster. I say disaster! <split butt_txt=\"I'm listening…\" \/> I'm not saying where - *cough* Bureaucrats *cough* - but there's been threat of a booze-shortage for a while now. <split butt_txt=\"Say it ain't so.\" \/> Don't worry, kid. We're prepared. All we need is a small band of plucky moonshiners with the <a href=\"event:skill|distilling_1\">Distilling<\/a> skill… <split butt_txt=\"As luck may have it…\" \/> You don't say! So get yourself a <a href=\"event:item|still\">Still<\/a>, some <a href=\"event:item|grain\">Grain<\/a>, <a href=\"event:item|potato\">Potatoes<\/a> or <a href=\"event:item|corn\">Corn<\/a>, and a quiet, safe place, then brew up - I don't know, 24 <a href=\"event:item|hooch\">Hooches<\/a>? <split butt_txt=\"Sounds doable.\" \/> Then put those jugs back into circulation somehow. Sell 'em, gift 'em, whatever: just get 'em out there. They can take our money, they can take our papers, but they'll never take our booze, right comrade? <split butt_txt=\"Viva!\" \/>";
var completion = "Didn't that feel good? <split butt_txt=\"I felt cool. And dangerous. But in a good way.\" \/> I can't help it. Even after all this time, the art of Distilling, and, more specifically, the tool used for it, gives me thrills like no other. You know what they say… <split butt_txt=\"No?\" \/> I'm \"Still-crazy, after all these years\". <split butt_txt=\"Ay…\" \/> Gettit? Kid? Still? Like the tool, the still? Kid? Wait, where are you going?!? Don't forget your reward!";


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
	"r301"	: {
		"type"		: "counter",
		"name"		: "make_hooch",
		"num"		: 24,
		"class_id"	: "still",
		"desc"		: "Distill Hooches"
	},
	"r302"	: {
		"type"		: "counter",
		"name"		: "bootleg_hooch",
		"num"		: 24,
		"class_id"	: "hooch",
		"desc"		: "Bootleg Hooches"
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
	currants = pc.stats_add_currants(round_to_5(350 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(50 * multiplier));
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
	"currants"	: 350,
	"mood"		: 25,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 50
		}
	}
};

//log.info("distilling_make_and_distribute_hooch.js LOADED");

// generated ok (NO DATE)
