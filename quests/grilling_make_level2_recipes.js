var title = "Lemburgers for Lem";
var desc = "Get your greasy mitts on, put your <a href=\"event:item|mike_tyson_grill\">Famous Pugilist Grill<\/a> to work, and make 3 deliciously junksome <a href=\"event:item|lemburger\">Lemburgers<\/a> to donate to Lem. (Hint: You can find <b>Shrines to Lem<\/b> all over the place - try checking the map for your nearest designated donation hole)";
var offer = "Hey Griddlepants, how's it going with that <a href=\"event:item|mike_tyson_grill\">Famous Pugilist Grill<\/a> of yours? <split butt_txt=\"Smokin'…\" \/> It's like cooking with the harnessed power of the sun, right? You're going to use it to make <b>Lem<\/b> happy. <split butt_txt=\"Lem?\" \/> Yes. You know, the Giant? One of the all-powerful imaginators without whom you would never have… Ringing any bells? *sigh*. Well, as you might imagine, he loves himself a <a href=\"event:item|lemburger\">Lemburger<\/a> or three every now and again. <split butt_txt=\"Three Lemburgers coming up!\" \/>That's the spirit. So sizzle yo' shizzle, and when they're all ready, you can donate them to the <b>Shrine to Lem<\/b>.";
var completion = "Ah. I love the smell of Lemburgers in the morning. You clearly know your way around a Famous Pugilist Grill. <split butt_txt=\"Thanks!\" \/>Consider this little reward an investment in your promising career in the meat-cooking industry.";


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
var prereq_quests = ["grilling_make_level1_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r167"	: {
		"type"		: "make",
		"recipe_id"	: 36,
		"num"		: 3,
		"desc"		: "Make 3 Lemburgers"
	},
	"r168"	: {
		"type"		: "counter",
		"name"		: "lemburgers_donated",
		"num"		: 3,
		"class_id"	: "npc_shrine_uralia_lem",
		"desc"		: "Donate 3 Lemburgers to Lem"
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
	xp = pc.stats_add_xp(round_to_5(450 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(45 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 450,
	"currants"	: 300,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 45
		}
	}
};

//log.info("grilling_make_level2_recipes.js LOADED");

// generated ok (NO DATE)
