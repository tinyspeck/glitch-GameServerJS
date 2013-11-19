var title = "Notice the Unnoticeable";
var desc = "Search the world for evidence of ghosts.";
var offer = "In the mood for a good ghost story?\r\n<split butt_txt=\"Always.\" \/>\r\nOK, do you just ever find yourself daydreaming about nothing in particular?\r\n<split butt_txt=\"Wait, this is a ghost story?\" \/>\r\nBe patient, kid; I’m getting there. When you're daydreaming about one thing or another, and suddenly you snap out of it because you've, say, dropped something on your foot, where do those thoughts go?\r\n<split butt_txt=\"I dunno.\"\/>\r\nI should clarify—where do they go if you're a Giant whose imagination can create whole worlds? You see, kid, there are some who say that a parallel Ur exists somewhere out there, a shadowy world of half-extant musings and figments not quite remembered, but never entirely forgotten.\r\n<split butt_txt=\"Do you think they're right?\"\/>\r\nWell, I don’t know for sure. But I do know this: sometimes you feel a chill in the room when no one's there, or see something out of the corner of your eye that you can't quite describe. What is it? Maybe you should put on your ghost hunting hat and find out. If you peer into dark places, you just… might…\r\n<split butt_txt=\"Just might what?\"\/>\r\nJust might what what? Sorry, I must have zoned out there for a second. What was I talking about?";
var completion = "Where did he go?\r\n<split butt_txt=\"I dunno.\" \/>\r\nWell, champ, at least he left you something to remember him by.\r\n<split butt_txt=\"Yeah…\" \/>\r\nCheer up, maybe you'll see him again someday.\r\n<split butt_txt=\"Do you think?\" \/>\r\nAnything is possible. What is not forgotten is never really lost.";

var button_accept = "Never mind. It's ghost hunting time!";

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
var locations = {
	"g_forest_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LCRHITPKONL1T7J"
	},
	"g_forest_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LLIF6R3R9GE1GQB"
	},
	"g_forest_3"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LCR101SU5VL1P09"
	},
	"g_forest_4"	: {
		"dev_tsid"	: "LM410BL52JAAI",
		"prod_tsid"	: "LCR195Q63RK143M"
	},
	"g_forest_5"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LCR13NMUQEM1A2R"
	},
	"g_forest_6"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LLI23Q4NDHD11EK"
	},
	"andra_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5DVVGJQQ5237U"
	},
	"andra_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA51B2OQAK623EF"
	},
	"besara_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA912LITC492EU2"
	},
	"besara_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA9GT0J87H92MPR"
	},
	"bortola_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHV2CGP55U22T4Q"
	},
	"bortola_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHVH2BF13132CUF"
	},
	"bortola_3"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHV12AQNBB32CJ2"
	},
	"chakra_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ11HQLJUV1R15"
	},
	"chakra_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ7GRG1VCV1VJD"
	},
	"chakra_3"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFAGDB0IGU1BCK"
	},
	"chakra_4"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ1F3AER9V139B"
	},
	"chakra_5"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ8GSQV1IV1FBE"
	},
	"chakra_6"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIF8TUJ3HGU1G3J"
	},
	"chakra_7"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ13TRDHKV1970"
	},
	"chakra_8"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ2S0EVDSV1HQ0"
	},
	"chakra_9"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFNG7GD8OU17BO"
	},
	"chakra_10"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ1FR102AV17DP"
	},
	"chakra_11"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ1PV6RLCV1L08"
	},
	"chakra_12"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFDIDJT0GU1CR8"
	},
	"chakra_13"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ18J9ASDU1UPS"
	},
	"chakra_14"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LTJ10HO3FAV1HDD"
	},
	"ilmenskie_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA91JU4QQ712DJN"
	},
	"ilmenskie_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA9114MS8B32FB2"
	},
	"ilmenskie_3"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA918AIN63127HB"
	},
	"ilmenskie_4"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LM1TS65LBN12EIV"
	},
	"ilmenskie_5"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA9QR2STO832N8E"
	},
	"ilmenskie_6"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA912TJ0KF328Q3"
	},
	"ilmenskie_7"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA9DNT3I2U22RS7"
	},
	"ilmenskie_8"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA910DULG012JIE"
	},
	"ilmenskie_9"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LM113VSD6922MRJ"
	},
	"kajuu_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHV15C8IEQ322UG"
	},
	"salatu_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIF14N6MU872GGI"
	},
	"ilmenskie_c_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHH110KCF411NK6"
	},
	"ilmenskie_c_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHH1011JSO11ORS"
	},
	"polokoo_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHFUE6UMQ4D2K42"
	},
	"polokoo_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHFNIVJNP4D2IM6"
	},
	"polokoo_3"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHFNBKJMP4D2S9M"
	},
	"polokoo_4"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHFFH3GKN2D2BTS"
	},
	"polokoo_5"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHFTQ7GLV2D2GG1"
	},
	"polokoo_6"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LDOOD6S77DD228S"
	},
	"polokoo_7"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LDOVRMU9SCD2ASN"
	},
	"polokoo_8"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LDOTQ8JCOCD20TU"
	},
	"callopee_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LDO8HM0S8DD240C"
	},
	"kloro_1"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIF6RTBE48435HF"
	}
};

var requirements = {
	"r290"	: {
		"type"		: "counter",
		"name"		: "found_ghost",
		"num"		: 7,
		"desc"		: "Find what cannot be found."
	},
	"r291"	: {
		"type"		: "flag",
		"name"		: "got_heart",
		"class_id"	: "faded_heart",
		"desc"		: "Retrieve Faded Heart"
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
	xp = pc.stats_add_xp(round_to_5(1200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"		: 1200,
	"mood"		: 100,
	"energy"	: 100
};

function callback_clickPhantom(details){
	if(details.pc_tsid !=this.owner.tsid) {
		return;
	}
	
	var text = [];
	
	switch(num_keys(this.chosen_haunts)) {
		case 7:
			text.push('<p align="center"><span class="nuxp_vog">…</span></p>');
			break;
		case 6:
			text.push('<p align="center"><span class="nuxp_vog">… Please.</span></p>');
			break;
		case 5:
			text.push('<p align="center"><span class="nuxp_vog">Please, help me…</span></p>');
			break;
		case 4:
			text.push('<p align="center"><span class="nuxp_vog">I… I’m fading...</span></p>');
			break;
		case 3:
			text.push('<p align="center"><span class="nuxp_vog">Please… keep thinking.</span></p>');
			break;
		case 2:
			text.push('<p align="center"><span class="nuxp_vog">Think of me...</span></p>');
			break;
	}
	
	if(text.length) {
		this.owner.apiSendAnnouncement({
			type: 'vp_canvas',
			uid: 'phantom_text_bg',
			canvas: {
				color: '#000000',
				steps: [
					{alpha:.5, secs:.5},
				],
				loop: false
			}
		});
		this.owner.apiSendAnnouncement({
			uid: 'phantom_text',
			type: "vp_overlay",
			locking: true,
			duration: 3000,
			x: '55%',
			width: 400,
			top_y: '50%',
			click_to_advance: false,
			text: text,
			done_payload: {
				quest_callback: 'overlayDone',
				pc_tsid: this.owner.tsid
			}
		});
	} else if (num_keys(this.chosen_haunts) == 1) {
		this.apiSetTimer('spawnPhantom', 1000);
	}
	
	this.owner.announce_sound_stop('HEARTBEAT');
	array_remove_value(this.chosen_haunts, this.phantom_location);
	this.owner.quests_inc_counter('found_ghost', 1);
}

function callback_giveHeart(details){
	if(this.given_heart) {
		return;
	}
	
	var heart = apiNewItem('faded_heart');
	
	if(!this.owner.isBagFull(heart)) {
		this.sendNPCMessage(this.getPhantomName(), 'set_state', {state: 'giveHeart'});
		this.sendNPCMessageDelayed(this.getPhantomName(), 'give_item', {pc: this.owner, class_tsid: 'faded_heart', num: 1}, 2);
		this.sendNPCMessageDelayed(this.getPhantomName(), 'kill', {}, 3);
	
		this.given_heart = true;
		this.owner.quests_set_flag("got_heart");
	} else {
		this.owner.sendActivity("The phantom wanted you to have something, but your pack is full!");
		this.sendNPCMessage(this.getPhantomName(), 'kill', {});
	}
	
	heart.apiDelete();
}

function callback_onMoveComplete(details){
	if(details.npc_name != this.getPhantomName()) {
		return;
	}
	
	this.sendNPCMessage(this.getPhantomName(), 'set_state', {state: 'transition'});
	this.sendNPCMessageDelayed(this.getPhantomName(), 'conversation_start', {conversation: 'give_heart', pc: this.owner}, 1);
}

function callback_overlayDone(details){
	log.info("Details: "+details);
	if(details.pc_tsid != this.owner.tsid) {
		return;
	}
	
	this.owner.apiSendMsg({type: 'overlay_cancel', uid: 'phantom_text_bg'});
	this.owner.apiSendMsg({type: 'overlay_cancel', uid: 'phantom_glitch'});
}

function callback_pickupHeart(details){
	
}

function chooseHauntings(){
	var possibles = [];
	
	for(var i in this.locations) {
		if((config.is_dev && this.locations[i].dev_tsid.length) || (!config.is_dev && this.locations[i].prod_tsid.length)) {
			possibles.push(i);
		}
	}
	
	if(!possibles.length) {
		log.error("Cannot find any valid haunting locations for quest "+this+" on player "+this.owner);
		return;
	}
	
	if(possibles.length <= 7) {
		this.chosen_haunts = possibles;
	} else {
		this.chosen_haunts = [];
	
		for(var i = 0; i < 7; i++) {
			var new_haunt = choose_one(possibles);
			this.chosen_haunts.push(new_haunt);
			array_remove_value(possibles, new_haunt);
		}
	}
}

function getPhantomName(){
	return 'phantom_'+this.owner.tsid;
}

function onAccepted(pc){
	// Select which hauntings we're going to be using.
	this.chooseHauntings();
}

function onEnterLocation(location){
	if(num_keys(this.chosen_haunts) == 0) {
		// The player has already found our glitch the requisite number of times. Just spawn the NPC
		this.phantom_location = location;
		var spawners = this.owner.location.quests_get_spawners('phantom_glitch');
	
		if(!spawners.length) {
			log.info("Failed to spawn phantom for player "+this.owner+" in location "+this.owner.location+". No spawn points exist.");
			return;
		}
	
		var spawn_point = choose_one(spawners);
		this.phantom_position = {x: spawn_point.x, y: spawn_point.y};
		this.spawnPhantom();
		
	} else if(in_array(location, this.chosen_haunts)) {
		// Is this location somewhere we're currently haunting?
		this.phantom_location = location;
		var spawners = this.owner.location.quests_get_spawners('phantom_glitch');
	
		if(!spawners.length) {
			log.info("Failed to spawn phantom for player "+this.owner+" in location "+this.owner.location+". No spawn points exist.");
			return;
		}
	
		var spawn_point = choose_one(spawners);
		this.showPhantom(spawn_point.x, spawn_point.y);
		this.phantom_position = {x: spawn_point.x, y: spawn_point.y};
		log.info("PHANTOM playing heartbeat for "+this.owner);
		this.owner.announce_sound('HEARTBEAT', 1000000);
	}
}

function onExitLocation(previous_location){
	// make sure the heartbeat stops
	this.owner.announce_sound_stop('HEARTBEAT');
}

function showPhantom(x, y){
	this.owner.apiSendAnnouncement({
		type: 'location_overlay',
		uid: 'phantom_glitch',
		swf_url: overlay_key_to_url('phantom_glitch'),
		x: x,
		y: y,
		under_decos: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {quest_callback: 'clickPhantom', pc_tsid: this.owner.tsid},
			dismiss_on_click: false
		}
	});
}

function spawnPhantom(){
	if(!this.phantom_position) {
		log.error("Cannot spawn phantom for player "+this.owner);
		return;
	}
	
	var phantom = this.owner.location.createItemStack('phantom_glitch', 1, this.phantom_position.x, this.phantom_position.y - 100);
	phantom.setInstanceProp('npc_name', this.getPhantomName());
	this.sendNPCMessage(this.getPhantomName(), 'set_owner', {owner: this.owner});
	this.sendNPCMessage(this.getPhantomName(), 'set_state', {state: 'appear'});
	this.sendNPCMessageDelayed(this.getPhantomName(), 'move_to_player', {pc: this.owner, stop_distance: 75.0}, 2);
}

//log.info("phantom_glitch.js LOADED");

// generated ok (NO DATE)
