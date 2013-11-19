var title = "Carry That Weight";
var desc = "Solve all the clues to help the Juju Bandits recover their priceless family heirloom—the Ancestral Paperweight.";
var offer = "{pc_label}! You're going to help us whether you like it or not!\r\n<split butt_txt=\"Wait, what?\" \/>Who’s tough and translucent and asking for your help? That’s right, {pc_label}, it’s the infamous Juju Bandits!<split butt_txt=\"Are you trying to ask for my help?\" \/>Uh… yeah. Sorry, I’m really only good at threatening people.<split butt_txt=\"A little politeness wouldn't hurt.\" \/>Politeness? Ha, the Juju Bandits are the meanest gang around, you’ll be quaking in your boots with helpfulness, if you know what’s… no, that doesn’t sound right either. Hold on. I can do this.<split butt_txt=\"OK, I'll help if we can just stop talking about this.\" \/>Ha! I knew you’d see it our way, {pc_label}. Now come on, the boss wants to see you.";
var completion = "";

var button_accept = "OK, sure.";

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
var end_npcs = ["npc_juju_grandma"];
var locations = {
	"dust_path"	: {
		"dev_tsid"	: "LM410BL52JAAI",
		"prod_tsid"	: "LA5P9MNTJK42IJS"
	},
	"empty_via"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5BVMNOTH42T8L"
	},
	"stake_claim"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA515GCSSC42QGF"
	},
	"plains_rte"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5N5E10CM42HJ4"
	},
	"parsins_trail"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA51450HIC42Q4I"
	},
	"rubes_way"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5135VC0J52RGQ"
	},
	"yokel_yarn"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA513OVR0J52BMT"
	},
	"loutish_ln"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA513A7M0J521F2"
	},
	"cornfed_crt"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5137QE0J52UB8"
	},
	"boor_bane"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5132LA0J526JJ"
	},
	"hazy_gate"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFF949JBO728GK"
	},
	"fervor_tack"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFF8EOJAO72U8U"
	},
	"ramble_way"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFF8OI1BO72KC1"
	},
	"distant_drag"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFF7T7N9O72TP2"
	},
	"languid_line"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFF86N5AO72UVT"
	},
	"tumble_rd"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFMNSVS7952M4T"
	},
	"chester_way"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFNNHRBJG52QS0"
	},
	"naif_lane"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFNL5554G52MHJ"
	},
	"rooks_way"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFD6TMU2952RMJ"
	},
	"putter_track"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFMR8JU7952PH5"
	},
	"juju_camp"	: {
		"dev_tsid"	: "LMF6I97NI8O2MMD",
		"prod_tsid"	: "LNVDIG7F7DO2CM5"
	}
};

var requirements = {
	"r357"	: {
		"type"		: "counter",
		"name"		: "solve_clue",
		"num"		: 3,
		"class_id"	: "note_hint",
		"desc"		: "Solve all the clues"
	},
	"r358"	: {
		"type"		: "item",
		"class_id"	: "juju_paperweight",
		"num"		: 1,
		"remove"	: 0,
		"desc"		: "Recover the Ancestral Paperweight"
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

function buildHintTable(){
	this.hints = {
		baqala: {
			dust_path: {
				title: "Hidden in Baqala",
				text: "Dead-end on a trail of dust. Behind the big tree."
			},
			empty_via: {
				title: "Hidden in Baqala",
				text: "At the northwest end of nothing."
			},
			stake_claim: {
				title: "Hidden in Baqala",
				text: "Stake your claim in the southeast, and put down roots."
			},
			plains_rte: {
				title: "Hidden in Baqala",
				text: "Not the fanciest route in the southwest. Behind the tall grass."
			},
			parsins_trail: {
				title: "Hidden in Baqala",
				text: "On your way to Kajuu? Look to your left."
			}
		},
		zhambu: {
			rubes_way: {
				title: "Hidden in Zhambu",
				text: "Looking for a good trade in the southeast? Stop for paper first."
			},
			yokel_yarn: {
				title: "Hidden in Zhambu",
				text: "The northeastern bumpkin's tale ended on a small mound."
			},
			loutish_ln: {
				title: "Hidden in Zhambu",
				text: "A brute on the way to Xalanga hid something near the street sign."
			},
			cornfed_crt: {
				title: "Hidden in Zhambu",
				text: "If you’re well-fed in the northwest, rest under the tallest tree."
			},
			boor_bane: {
				title: "Hidden in Zhambu",
				text: "On a small mound to the southwest, find the secret to banishing rude guests."
			}
		},
		xalanga: {
			hazy_gate: {
				title: "Hidden in Xalanga",
				text: "Under the eaves of touching trees, you can barely see Choru from here."
			},
			fervor_tack: {
				title: "Hidden in Xalanga",
				text: "Where fiery fervor breaks into deadpan doldrums."
			},
			ramble_way: {
				title: "Hidden in Xalanga",
				text: "The story of the northwestern tree and its rocky friend rambled without conclusion."
			},
			distant_drag: {
				title: "Hidden in Xalanga",
				text: "You can’t drag yourself much further northeast than this. Rest between trees on a tall hill."
			},
			languid_line: {
				title: "Hidden in Xalanga",
				text: "Enervated in the west? Rest near a paper tree."
			}
		},
		choru: {
			tumble_rd: {
				title: "Hidden in Choru",
				text: "Before tumbling into Besara, check behind the sign."
			},
			chester_way: {
				title: "Hidden in Choru",
				text: "A yesterday rhyme. Look on top of this ladder in the southeast."
			},
			naif_lane: {
				title: "Hidden in Choru",
				text: "Naive about alternate spellings? Check this western signpost."
			},
			rooks_way: {
				title: "Hidden in Choru",
				text: "An enemy of imagination rises from behind a tree in the west."
			},
			putter_track: {
				title: "Hidden in Choru",
				text: "If you try golfing in the northeast, avoid this dirt trap."
			}
		}
	};
}

function callback_juju_dig(details){
	if (this.owner.items_has('juju_paperweight', 1)) {
		return;
	}
	
	if (this.current_location == this.hint_location) {
		this.owner.sendActivity("Seems like this might be a good place to dig…");
	
		// Get box geo info
		var box = this.owner.location.find_hitbox_by_id('juju_dig');
		this.hitbox_left = box.x - box.w / 2.0 - 100;
		this.hitbox_right = box.x + box.w / 2.0 + 100;
	}
}

function canDig(){
	if (this.owner.items_has('juju_paperweight', 1)) {
		return false;
	}
	if ((this.current_location == this.hint_location) && (this.hitbox_left || this.hitbox_right)) {
		return this.owner.x > this.hitbox_left && this.owner.x < this.hitbox_right;
	}
}

function chooseNextHint(){
	this.hint_hub = choose_key(this.hints);
	this.hint_location = choose_key(this.hints[this.hint_hub]);
}

function doDig(){
	if (this.owner.items_has('juju_paperweight', 1)) {
		return;
	}
	
	// Delete current hint
	var items = this.owner.takeItemsFromBag('note_hint', 1);
	if (items && items.length) {
		for (var i in items) {
			items[i].apiDelete();
		}
	} else {
		log.error("Juju bandit quest attempting to remove old note for "+this.owner+", but it has failed.");
	}
	
	this.owner.quests_inc_counter('solve_clue', 1);
	
	if (this.current_hint <= 2) {
		this.chooseNextHint();
		this.setUpHintText();
		this.giveHint(this.current_hint + 1, null);
		this.owner.sendActivity("You found another Secret Juju Hint!");
	
		this.apiSetTimer('openHint', 1500);
	} else {
		this.givePaperweight();
	}
}

function getJujuBanditColor(){
	if (this.juju_bandit_color) {
		var color = this.juju_bandit_color;
		delete this.juju_bandit_color;
		return color;
	}
}

function giveHint(hint_number, source){
	if (source) {
		var remaining = this.owner.createItemFromSource('note_hint', 1, source, true, {suppress_discovery: true, title: this.hint_title, contents: this.hint_text});
	} else {
		var remaining = this.owner.createItemFromGround('note_hint', 1, true, {suppress_discovery: true, title: this.hint_title, contents: this.hint_text});
	}
	
	if (remaining) {
		// Couldn't create note item
		return false;
	} else {
		this.current_hint = hint_number;
		return true;
	}
}

function givePaperweight(){
	var remaining = this.owner.createItemFromGround('juju_paperweight', 1, true, {suppress_discovery: true});
	
	if (remaining) {
		// Couldn't create paperweight
		return false;
	} else {
		return true;
	}
}

function offerCampExit(){
	this.owner.instances_cancel_exit_prompt('juju_camp');
	
	this.owner.prompts_add({
		txt		: "All done here! Press OK when you're ready to leave.",
		icon_buttons	: true,
		timeout		: 0,
		choices		: [
			{ value : 'yes', label : 'OK' }
		],
		callback	: 'instances_exit_via_prompt',
		instance_id	: 'juju_camp',
	});
}

function onAccepted(pc){
	this.buildHintTable();
	
	var hubID = pc.location.hubid;
	
	switch (hubID) {
		case '86':
			// Baqala
			this.hint_hub = 'baqala';
			break;
		case '91':
			// Zhambu
			this.hint_hub = 'zhambu';
			break;
		case '95':
			// Xalanga
			this.hint_hub = 'xalanga';
			break;
		case '90':
		default:
			// Choru
			this.hint_hub = 'choru';
			break;
	}
	
	this.hint_location = choose_key(this.hints[this.hint_hub]);
	this.setUpHintText();
	
	this.questInstanceLocation(this.owner, 'juju_camp', -839, -98, 5 * 60);
}

function onComplete_custom(pc){
	pc.quests_offer('help_juju_bandits_2', true);
}

function onEnterLocation(location){
	this.current_location = location;
}

function onExitLocation(location){
	if (this.hitbox_left) {
		delete this.hitbox_left;
	}
	if (this.hitbox_right) {
		delete this.hitbox_right;
	}
	
	if (location == 'juju_camp' && !this.current_hint) {
		log.info(this.owner+" left juju_camp. Failing juju bandit quest.");
		this.owner.failQuest(this.class_tsid);
	}
}

function openHint(){
	var items = this.owner.takeItemsFromBag('note_hint', 1);
	
	if (items && items.length) {
		for (var i in items) {
			items[i].readNote(this.owner);
			this.owner.items_put_back(items[i]);
		}
	} else {
		this.apiSetTimer('openHint', 1000);
	}
}

function setJujuBanditColor(color){
	this.juju_bandit_color = color;
}

function setUpHintText(){
	this.hint_title = this.hints[this.hint_hub][this.hint_location].title;
	this.hint_text = this.hints[this.hint_hub][this.hint_location].text;
	
	delete this.hints[this.hint_hub];
}

//log.info("help_juju_bandits.js LOADED");

// generated ok (NO DATE)
