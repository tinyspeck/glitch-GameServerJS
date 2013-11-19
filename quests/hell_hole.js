var title = "It's Better in a Hell Hole";
var desc = "Continue exploring Naraka by jumping into the hole on the first level of Hell.";
var offer = "Continue exploring Naraka by jumping into the hole on the first level of Hell.";
var completion = "I was hoping for more of a swan dive, but I guess that'll have to do.";


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
var prerequisites = [{
		"not"		:1,
		"condition":	"completed_quest",
		"value":	"hell_quest"
}];
var end_npcs = [];
var locations = {
	"Hell One"		: {
		"dev_tsid"	: "LM4107R9OLUTA",
		"prod_tsid"	: "LA5PPFP86NF2FOS"
	},
	"mahatam_audarika"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5PV4T79OE2AOA"
	}
};

var requirements = {
	"r362"	: {
		"type"		: "flag",
		"name"		: "jump_hell_hole",
		"class_id"	: "quest_req_icon_hellhole",
		"desc"		: "Jump down the Hell Hole"
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
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	this.onComplete_custom(pc);
}
var rewards = {};

function canStartInHell(){
	return true;
}

function getOffer(pc){
	var deathDeets = pc.getDeathRecognitionDetails();
	
	if (deathDeets) {
		var mourner = "<a href='event:player_info|"+deathDeets.recognizer.tsid+"'>"+deathDeets.recognizer.label+"</a>";
		var thingTheyDid = deathDeets.type == 'mourn' ? 'mourned' : 'celebrated';
		var thingTheyDidItTo = deathDeets.type == 'mourn' ? 'death' : 'life';
	} else {
		log.error(pc+" has received Hell Quest, but has no details for their death recognition.");
	
		// In case of error, make it still make sense.
		var mourner = 'someone';
		var thingTheyDid = 'recognized';
		var thingTheyDidItTo = 'passing';
	}
	
	var offer = "Woah! Did you feel that? A cold shiver down your recently deceased spine? It appears that "+mourner+" just "+thingTheyDid+" your "+thingTheyDidItTo+" at your gravestone.<split butt_txt=\"Really?\" />Yeah. You're obviously missed by someone up on the surface, but you just got here and you look pooped. You're not in a rush to leave are you?<split butt_txt=\"I guess not.\" />Good. Now I know you're pooped, but there's more to Naraka than this first level of Hell. Why don't you jump in the Hell Hole and start exploring.";
	
	return this.expandText(offer, pc);
}

function onAccepted(pc){
	// If we're in Hell One when we get this, give the player an explanatory overlay
	if (!pc.location.isInHellOne()) return;
	
	pc.removeDeathRecognitionDetails();
	
	this.owner.apiSendAnnouncement({
		uid: 'hell_hole_prompt',
		type: "vp_overlay",
		duration: 0,
		locking: false,
		x: '50%',
		top_y: '10%',
		click_to_advance: false,
		at_bottom: true,
		bubble_familiar: false,
		text: [
			'<p align="center"><span class="nuxp_vog_smallest">Make your way to the Hell Hole.</span></p>'
		]
	});
	
	this.owner.apiSendAnnouncement({
		uid: 'hell_hole_arrow',
		type: 'vp_overlay',
		swf_url: overlay_key_to_url('right_arrow'),
		locking: false,
		x: '50%',
		top_y: '15%',
		width: 75,
		at_bottom: true
	});
}

function onComplete_custom(pc){
	if (pc.getQuestStatus('hell_quest') == 'none') {
		pc.quests_offer('hell_quest', true);
	}
}

function onEnterLocation(location){
	if (location == 'mahatam_audarika'){
		this.owner.quests_set_flag('jump_hell_hole');
	}
}

//log.info("hell_hole.js LOADED");

// generated ok (NO DATE)
