var title = "Tend to Your Community";
var desc = "Visit the <a href=\"event:location|72#LA95U14319524O9\">Chakra Phool Herb Gardens<\/a>, in <a href=\"event:location|72\">Chakra Phool<\/a>. Plant 5 <a href=\"event:item|herb_seed_yellow_crumb_flower\">Yellow Crumb Flower Seeds<\/a> and 5 <a href=\"event:item|herb_seed_silvertongue\">Silvertongue Seeds<\/a>. Then, harvest 5 herbs of any type, and donate them to the shrine at <a href=\"event:location|85#LHV17T973F42GEP\">Pahsmeq Diggs<\/a> in <a href=\"event:location|85\">Kajuu<\/a>.";
var offer = "Well, shucks. It looks like you're getting pretty good at planting and harvesting herbs. <split butt_txt=\"Hey, thanks!\" \/> But, there's something to be said for \"giving back\". <split butt_txt=\"I can see that …\" \/>Go to <a href=\"event:location|72#LA95U14319524O9\">Chakra Phool Herb Gardens<\/a>, in <a href=\"event:location|72\">Chakra Phool<\/a> and Plant 5 <a href=\"event:item|herb_seed_yellow_crumb_flower\">Yellow Crumb Flower Seeds<\/a> and 5 <a href=\"event:item|herb_seed_silvertongue\">Silvertongue Seeds<\/a>. Then, harvest 5 herbs of any type and donate them to the shrine at <a href=\"event:location|85#LHV17T973F42GEP\">Pahsmeq Diggs<\/a> in <a href=\"event:location|85\">Kajuu<\/a>.";
var completion = "Hey, why so pale? You look like you've seen a Giant! <split butt_txt=\"I did, I did!\" \/>Uh huh. Suuuure you did.<split butt_txt=\"I swear!\" \/> Giant sightings aside, you've done a good thing for your community. Take pride!";


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
var prereq_quests = ["herbalism_harvest_shuck_and_plant_herbs"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"Chakra Phool Herb Gardens"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA95U14319524O9"
	},
	"Jethimadh Herb Gardens"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA97L62229522GS"
	},
	"Shimla Mirch Herb Gardens"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA99U5PI39524GN"
	},
	"Pahsmeq Diggs, Kajuu"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHV17T973F42GEP"
	},
	"Kitkaa Carom, Chakra Phool"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ13TRDHKV1970"
	},
	"Heckes, Shimla Mirch"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ1013E97K17P1"
	},
	"Naatamo Way, Jethimadh"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFN3FI0TNU10PS"
	},
	"Kaiya Kit, Tahli"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHFR1N2PUMI2C7A"
	}
};

var requirements = {
	"r440"	: {
		"type"		: "flag",
		"name"		: "visit_herb_gardens",
		"class_id"	: "silvertongue",
		"desc"		: "Visit the Herb Gardens"
	},
	"r441"	: {
		"type"		: "counter",
		"name"		: "yellow_crumb_flower_planted",
		"num"		: 5,
		"class_id"	: "herb_seed_yellow_crumb_flower",
		"desc"		: "Plant 5 Yellow Crumb Flower Seeds"
	},
	"r442"	: {
		"type"		: "counter",
		"name"		: "silvertongue_planted",
		"num"		: 5,
		"class_id"	: "herb_seed_silvertongue",
		"desc"		: "Plant 5 Silvertongue Seeds"
	},
	"r443"	: {
		"type"		: "counter",
		"name"		: "harvest_herb_gardens",
		"num"		: 5,
		"class_id"	: "yellow_crumb_flower",
		"desc"		: "Harvest 5 Herbs"
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
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(150 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 100,
	"mood"	: 50,
	"favor"	: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 150
		}
	}
};

function isInDestination(pc){
	return pc.location.tsid == this.destination;
}

function onCreate(pc){
	var choices = [];
	for (var it in this.locations){
		if (this.locations[i] && this.locations[i].prod_tsid) choices.push(this.locations[i].prod_tsid);
	}
	
	this.destination = choose_one(choices);
}

//log.info("tend_to_your_community.js LOADED");

// generated ok (NO DATE)
