var title = "Being Watched";
var desc = "You drank water from a questionable source and you don't look well. You need to ride it out.";
var offer = "Umm, You don't look so good.<split butt_txt=\"I don’t feel so good.\" \/>Yeah, you look really, well … plain, boring, without character.<split butt_txt=\"I think it’s something I drank.\" \/>Ah, maybe you should nap for a bit then?";
var completion = "Ahh, that's better! You look like your normal \"interesting\" self again.<split butt_txt=\"What happened?!\" \/>You passed out. Hard. Rolled around in your sleep, embarrassed yourself a bit, then woke up.<split butt_txt=\"You were watching?\" \/>Oh ho, yes. But, here's something that will make you feel better.";

var button_accept = "Take nap";

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
var prereq_quests = ["card_carrying_qualification"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"being_watched"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFHAO6QB4A34MO"
	}
};

var requirements = {
	"r522"	: {
		"type"		: "flag",
		"name"		: "leave",
		"class_id"	: "cup_of_water",
		"desc"		: "Ride It Out"
	},
	"r523"	: {
		"type"		: "flag",
		"name"		: "convo_end",
		"class_id"	: "cup_of_water",
		"desc"		: "Peek Behind the Veil"
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
	xp = pc.stats_add_xp(round_to_5(750 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"		: 750,
	"mood"		: 100,
	"energy"	: 100
};

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
	
	pc.instances_exit('being_watched');
}

function onStarted(pc){
	var location_id = 'being_watched';
	var tsid;
	if (config.is_dev){
		tsid = this.locations[location_id].dev_tsid;
	}
	else{
		tsid = this.locations[location_id].prod_tsid;
	}
		
	var loc = apiFindObject(tsid);
	var marker = loc.find_items('marker_teleport')[0];
		
	if (marker) {
		this.questInstanceLocation(pc, location_id, marker.x, marker.y, 5*60);
	}
	else { 
		this.questInstanceLocation(pc, location_id, 0, 0, 5*60);
	}
	
	return {ok: 1};
}

//log.info("stale_but_necessary.js LOADED");

// generated ok (NO DATE)
