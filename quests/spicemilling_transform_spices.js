var title = "Spice is the Variety of Life";
var desc = "Using a <a href=\"event:item|spice_mill\">Spice Mill<\/a>, turn ordinary <a href=\"event:item|all_spice\">Allspice<\/a> into 2 each of <a href=\"event:item|ginger\">Ginger<\/a>, <a href=\"event:item|curry\">Curry<\/a>, <a href=\"event:item|mustard\">Mustard<\/a> and <a href=\"event:item|black_pepper\">Black Pepper<\/a>.";
var offer = "Spices are the variety of life, chum. And you look like you're ready for a little variety. <split butt_txt=\"Well, uh...\" \/> Don't fight it. We're going to start small. Get yourself a <a href=\"event:item|spice_mill\">Spice Mill<\/a> and some <a href=\"event:item|all_spice\">Allspice<\/a>. Then use the Spice Mill to create 2 each of <a href=\"event:item|ginger\">Ginger<\/a>, <a href=\"event:item|curry\">Curry<\/a>, <a href=\"event:item|mustard\">Mustard<\/a> and <a href=\"event:item|black_pepper\">Black Pepper<\/a>. <split butt_txt=\"And then what?\" \/> And then I'll tell you what. Yes?";
var completion = "That's some solid Spice Milling, friend. And now look at all the Spices you've created. <split butt_txt=\"But now what do I do with them?\" \/> Use them as ingredients in foods and drinks. Buy a <a href=\"event:item|bag_spicerack\">Spice Rack<\/a> for storing them. Use your Spice Mill to make even more Spices! <split butt_txt=\"Yeah!\" \/> The question isn't what can you do with Spices. The question is what can't you do with them!";


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
	"r52"	: {
		"type"		: "make",
		"recipe_id"	: 120,
		"num"		: 2,
		"desc"		: "Make 2 x Ginger"
	},
	"r53"	: {
		"type"		: "make",
		"recipe_id"	: 117,
		"num"		: 2,
		"desc"		: "Make 2 x Curry"
	},
	"r54"	: {
		"type"		: "make",
		"recipe_id"	: 121,
		"num"		: 2,
		"desc"		: "Make 2 x Black Pepper"
	},
	"r55"	: {
		"type"		: "make",
		"recipe_id"	: 122,
		"num"		: 2,
		"desc"		: "Make 2 x Mustard"
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
	xp = pc.stats_add_xp(round_to_5(225 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 225,
	"currants"	: 150,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 20
		}
	}
};

//log.info("spicemilling_transform_spices.js LOADED");

// generated ok (NO DATE)
