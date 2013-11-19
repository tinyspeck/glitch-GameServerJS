var title = "Get the Vapours ";
var desc = "Turn <a href=\"event:item|general_vapour\">General Vapour<\/a> into exciting gases! Use a <a href=\"event:item|gassifier\">Gassifier<\/a> to make 3 <a href=\"event:item|heavy_gas\">Heavy Gas<\/a>, 3 <a href=\"event:item|helium\">Helium<\/a> and 3 <a href=\"event:item|crying_gas\">Crying Gas<\/a>.";
var offer = "Gassy? <split butt_txt=\"Not at the moment.\" \/> Then do you want to be? <split butt_txt=\"Do I!\" \/> That's the spirit. Get yourself a <a href=\"event:item|gassifier\">Gassifier<\/a> and use it to convert some <a href=\"event:item|general_vapour\">General Vapour<\/a> into <a href=\"event:item|heavy_gas\">Heavy Gas<\/a>, <a href=\"event:item|helium\">Helium<\/a> and <a href=\"event:item|crying_gas\">Crying Gas<\/a>. <split butt_txt=\"I'll make three of each!\" \/> Three of each it is, my earnest young snapperwhipper. Ready?";
var completion = "Let me count... 1... 2... 3. Yup, you gassified 3 Heavy Gas, 3 Helium and 3 Crying Gas. Nicely done. <split butt_txt=\"It's all in the wrist.\" \/> Now that you've broken in your Gassifier, there's a rich and satisfying world of other gases for you to explore. <split butt_txt=\"I can't wait!\" \/> Before you go, here's a little bonus reward prize thingummy.";


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
	"r56"	: {
		"type"		: "make",
		"recipe_id"	: 133,
		"num"		: 3,
		"desc"		: "Make 3 x Heavy Gas"
	},
	"r57"	: {
		"type"		: "make",
		"recipe_id"	: 134,
		"num"		: 3,
		"desc"		: "Make 3 x Helium"
	},
	"r58"	: {
		"type"		: "make",
		"recipe_id"	: 137,
		"num"		: 3,
		"desc"		: "Make 3 x Crying Gas"
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
	xp = pc.stats_add_xp(round_to_5(275 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(175 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 275,
	"currants"	: 175,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 25
		}
	}
};

//log.info("gasmogrification_transform_gasses.js LOADED");

// generated ok (NO DATE)
