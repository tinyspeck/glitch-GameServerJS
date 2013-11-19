var title = "Baqalic Caesura";
var desc = "Collect three Glitchian ancestral remnants from devilishly-difficult-to-predict snapping dust traps along the roadside.";
var offer = "Whoa, kid. Are you OK? \r\n<split butt_txt=\"Ouch.\">\r\nSeriously, you just went all pale. \r\n<split butt_txt=\"My heart hurts all of a sudden.\">\r\nThat's called nostalgia, kid. Welcome to the savanna. Millions of years ago, these sun-blasted plains were where the giants imagined some of your predecessors out of the stygian depths of antediluvian mind-stuff… \r\n<split butt_txt=\"Huh?\"> \r\nWhat you're feeling is the weight of aeons pressing on your heart. \r\n<split butt_txt=\"I can't tell if I like it or not.\">\r\nIt's supposed to feel like that, kid, but don't stay too long – your overwhelminess will force you to flee to safety, unless…\r\n<split butt_txt=\"Unless what?\">\r\nUnless you can find a tangible way to connect to your ancestors. This place used to be teeming with them. They must have left some remnants. I'm talking microscopic, though, teeny-tiny bits and bobs: the golgi apparatus, endoplasmic reticula, vacuoles, super old mitochondrial DNA, the pileated gibbon…\r\n<split butt_txt=\"Isn't that some kind of ape?\"> \r\nWhatever. The dust traps that snap on the streets round here usually shake something loose. Try to find as many of those as you can, and I bet you can hold on to that feeling for a little bit longer. And if you can find three of them, I might have something extra for you. \r\n<split butt_txt=\"OK, I'll do it!\">\r\nJust be careful out here—a group of mean-spirited mothers calling themselves the Juju Bandits have claimed the savanna as their own, and they don't take too kindly to strangers.";
var completion = "Colour me impressed. You've got pretty sharp eyes to spot three of those wee-tiny remnants in all this dust.<split butt_txt=\"Does that mean I can stay?\">For a little while, and collecting even more remnants will help you stay for a little longer still, but I'm afraid nothing lasts forever.";

var button_accept = "Well, forewarned is forearmed!";

var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
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
	"r268"	: {
		"type"		: "counter",
		"name"		: "organelles_found",
		"num"		: 3,
		"class_id"	: "golgi_apparatus",
		"desc"		: "Find three Glitchian Remnants."
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
	xp = pc.stats_add_xp(round_to_5(800 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 800,
	"mood"		: 100,
	"energy"	: 100
};

//log.info("baqala_nostalgia.js LOADED");

// generated ok (NO DATE)
