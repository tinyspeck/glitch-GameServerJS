var title = "Tater 'n' Mater";
var desc = "Grow 50 <a href=\"event:item|potato\">Potatoes<\/a> and 50 <a href=\"event:item|tomato\">Tomatoes<\/a>, then sell them at an <a href=\"event:external|http:\/\/beta.glitch.com\/auctions\/create\/\">Auction<\/a>. You will, of course, need your own <b>Crop Garden<\/b> or a <b>Community Garden<\/b> for all this growing. You can cultivate a Crop Garden in your yard or home street.";
var offer = "If you want to get by in this world, kid, you have to think big. <split butt_txt=\"Bigger-than-a-Giant big?\" \/> Not quite that big. I was thinking more like growing-50-<a href=\"event:item|potato\">Potatoes<\/a>-and-50-<a href=\"event:item|tomato\">Tomatoes<\/a> and selling-them-at-auction big. <split butt_txt=\"That'll be way easier.\" \/> I'm keeping my eye on you, kid. See you after the harvest.";
var completion = "You did it! You sold your crops! How did it feel? <split butt_txt=\"Capitalism is a seductive mistress.\"\/ > Ooookaaaay. Anyway. Here's a little something extra, not that you really need it now. Don't go blowing this all on practical stuff. Live a little!";


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
	"r201"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_potato",
		"num"		: 50,
		"class_id"	: "seed_potato",
		"desc"		: "Harvest 50 Potatoes"
	},
	"r202"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_tomato",
		"num"		: 50,
		"class_id"	: "seed_tomato",
		"desc"		: "Harvest 50 Tomatoes"
	},
	"r203"	: {
		"type"		: "counter",
		"name"		: "auctions_sold_potato",
		"num"		: 50,
		"class_id"	: "potato",
		"desc"		: "Sell 50 Potatoes at Auction"
	},
	"r204"	: {
		"type"		: "counter",
		"name"		: "auctions_sold_tomato",
		"num"		: 50,
		"class_id"	: "tomato",
		"desc"		: "Sell 50 Tomatoes at Auction"
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
	xp = pc.stats_add_xp(round_to_5(700 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(450 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(150 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(70 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 700,
	"currants"	: 450,
	"energy"	: 150,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 70
		}
	}
};

//log.info("croppery_harvest_and_sell_at_auction.js LOADED");

// generated ok (NO DATE)
