//#include include/takeable.js

var label = "Contraband";
var version = "1340402899";
var name_single = "Contraband";
var name_plural = "Contraband";
var article = "a";
var description = "This is a surprisingly light package of *something* given to you by a smuggler who might ask you to take it from one place to another for reasons you cannot fully grasp. Still, a job's a job, right? What business is it of yours what's in the package. It DOES smell familiar, though…";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["contraband", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.check_address = { // defined by contraband
	"name"				: "check the address",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Remind yourself of this package's destination",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.destination){
			this.setSmugglingDestination();
		}

		var path = pc.buildPath(this.destination);

		if (!path.path){
			pc.sendActivity("Hmm. You seem to be off the path right now. Your contraband is temporarily confused about where it needs to go.");
		} else {
			pc.apiSendMsg({type: 'get_path_to_location', path_info: path.path});
			pc.apiSendMsg({type: 'map_open', hub_id: path.path.destination.hub_id, location_tsid: path.path.destination.street_tsid});
		}

		return true;
	}
};

verbs.drop = { // defined by contraband
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Dropping this is probably a bad idea",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.buffs_has('dont_get_caught')) pc.buffs_remove('dont_get_caught');

		pc.apiSendMsg({type: 'clear_location_path'});

		this.apiSetTimer('onDropped', 2000);

		self_msgs.push("Clumsy! The Contraband doesn't take kindly to being dropped, and disappears...");

		var pre_msg = this.buildVerbMessage(msg.count, 'drop', 'dropped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		if (pc.getQuestStatus('smuggling_basic') == 'todo'){
			pc.familiar_send_alert({
				'callback'	 : 'quests_familiar_fail_and_remove',
				'class_tsid' : 'smuggling_basic',
				'txt'		 : "Rule 1 of delivery, kid - don't drop the package! Better luck next time!"
			});
		}

		return this.takeable_drop(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function checkLocation(){ // defined by contraband
	var loc = this.container;

	if (loc && loc.findPack){
		var pc = loc.findPack();
		if (pc && pc.is_player) {
			pc.buffs_apply('dont_get_caught');
			this.setSmugglingDestination(pc);
			return true;
		}
	}

	// fallthrough
	log.error("Contraband created outside a player's pack. Naughty naughty");
	this.apiDelete();
}

function onCreate(){ // defined by contraband
	this.setQuestItem();

	// give it time to settle into its home
	this.apiSetTimer('checkLocation',100);
}

function onDropped(){ // defined by contraband
	this.apiDelete();
}

function setSmugglingDestination(pc){ // defined by contraband
	if (config.is_dev){
		this.destination = 'LM4105P196DJ5';
	} else {
		if (this.destinations[pc.location.tsid]){
			this.destination = choose_one(this.destinations[pc.location.tsid]);
		} else {
			this.destination = choose_one(this.default_destinations);
		}
	}
}

// global block from contraband
//
// map of destinations, decided by the starting point of the quest
//

var destinations = {
	// Starting from Stopan Winnow
	'LCRGEU0PUP12CLS': [
		'LIFFBC4MNO72556', // Via Velaya
		'LIF1AQ6CK972734', // Kalp Clips
		'LIFEL8CPH08259V', // Vattuu Vains
		'LHV2JBHA9152QAS', // Laroo Ledge
		'LCR10H9E3QJ1E2P', // Yeoman's Bluff
	],

	// Starting from Peatland Moors
	'LLICF642CTI16R1': [
		'LIFMOLVTLHV1RAR', // Naata Garth
		'LIF10O20NQU1B2P', // Oulanka End
		'LM416LNIKVLM1', // Baby Steppes
		'LCR111KI08O1HLB', // Langden Abbey
		'LTJOCVQUMHV1K83', // Koita Clutter
	],

	// Starting from Hayden Seek Alley
	'LLIF3AQTOFE19OR': [
		'LCR10199TPJ1DA3', // Bishop's Arch
		'LCR10K0NLRK1GKE', // Bailliure Heath
		'LLIFINFQT8G13OU', // Undermine Hollows
		'LCR16VUKOQL18DU', // Pinhigh Prose
		'LCR13VM1REM1GHI', // Brinlow Vale
	],

	// Starting from Qabena Quaint
	'LIF18V95I972R96': [
		'LA93B4PV0I82IH7', // Nowaa Holler
		'LA9L02KJ2D829LS', // Desmona Dr
		'LA9FDN44SG92SDQ', // Kanuka Saus
		'LA97Q5LV0F92PU6', // Garillis Fill
		'LA9NRNJSB792OG4', // Akaki Cape
	],

	// Starting from East Spice
	'LM413SQ6LRN58': [
		'LTJ11KEKAKO196V', // Soggy Bottoms
		'LCR10157DMK1L0G', // Addingfoot Trip
		'LCR131F8U1K1PF9', // Uplands Verge
		'LCR143M18PK1774', // Blackberry Glebe
		'LTJ12E6VSFQ1V4E', // Fjarcke
	],

	// Starting from Odena Odes
	'LA9KL9UE1D82RFO': [
		'LHVAKM1MR032IGJ', // Akas Apparata
		'LHFD24US63D2QO6', // Hamli Egza
		'LIF14VBBV872N2I', // Prutki Pardons
		'LHVH2BF13132CUF', // Simpele Slip
		'LHFTQ7GLV2D2GG1', // Kikal Kalzo
	],

	// Starting from Kitka Carom
	'LTJ13TRDHKV1970': [
		'LA9111M11LA2VAT', // Ghora Chani
		'LA9TIJ7S4JA2CNF', // Pandu Chepa
		'LA9U04T3OAA2R2L', // Jellow Diaspora
		'LIFMOLVTLHV1RAR', // Naata Garth
		'LIF102S56SV16TJ', // Iso Roine
	],

	// Starting from Boorgal Broods
	'LDOVUDD84DD2U4U': [
		'LHFNBKJMP4D2S9M', // Kotteletti Kota
		'LA96CLEAK692K72', // Atsas Gaque
		'LA99NEQK1F92ICE', // Pedieos Fig
		'LA95G0P137927B4', // Dunlin Roble
	],

	// Starting from Appam Almost
	'LHV17CFO5V327AJ': [
		'LHV12AQNBB32CJ2', // Uko Grips
		'LIF13QL5IG02UAI', // Kalla Chase
		'LA512IH5226256P', // Gaare Grims
		'LA517KBQL262H3U', // Pooma Plea
		'LCR1303AT622I0Q', // Jadraan Fix
	],

	// Starting from Jonna Jinx
	'LA55645B8O528MI': [
		'LHV4U1QMFC42NBP', // Manggal Haste
		'LHVB16RSG652GJ4', // Tonga Trips
		'LHV43I0BI352TG6', // Sadam Savanna
		'LIF16SBFB972GLK', // Konkan Carom
		'LIF103GH4C72BHJ', // Shak Shales
	],

	// Starting from Simon's POL in Dofsan Vex (for testing)
	'LIFPKPACCJ328C9': [
		'LIFQMHF4MT72V9Q', // Agala Axis
		'LLI1C5DJ2Q12O21', // Pinnan Glimpse
		'LHV17CFO5V327AJ', // Appam Almost
		'LIF10P7CR622E3R', // Poro Nella
	],

};

//
// Defaults to choose from if we find ourselves in a place that isn't in the map above
//

var default_destinations = [
	'LLIFIG7BP8G1MU9', // Louise Pasture
	'LLIERMJ93DE1H25', // Marrakesh Meadow
	'LLI32J0SVTD114U', // Estevan Meadows
	'LCR11DNA3EL10TD', // Briarset Croft
	'LCR143M18PK1774', // Blackberry Glebe
	'LLI2V0UN7RD1T2J', // Hechey Track
	'LCR103UREMK11MT', // Fairgower Lane
	'LCR195Q63RK143M', // Grimssea Bottom
	'LIF101NCNU112O2', // Oktyabrya
	'LIF102FDNU11314', // Ilmenskie
	'LIF2IUQJQ571TFL', // Eastern Approach
];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"contraband",
	"smuggling",
	"no_rube",
	"no_discovery_dialog",
	"no_auction",
	"no_trade",
	"quest-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-25,"w":35,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHvUlEQVR42u2YaVNTWRrH8w38CP0R\nfDFVPVUz02X1gO3SKk6rbUDoqKxhCxCRJZAgixAIhE3ZwxqyQ5BGIAEuEkCIIGDbTltqU\/NmXo4f\n4ZnzP+Fcb0KmnKqZ6hdd3Kp\/kbue33me5\/+ce1GpTraT7WT7nW\/\/2mk69SHUanr7rEX6ebnp8HWg\nUdrwlkrBkWzr4nCGacGWkRSwZZ4J9mWd+s2gPuz0nToM9595v9WrexeyHL4ONhK0+8RAock8WhnL\npsBwJi3aMmhpJIsdy6VNZz5tuXX0wqc\/fLVYL\/2y1iGF58206Tfuhey5OkxieTD9i\/8b5PpMPUHv\nt\/tlvVlt4zpYqON64S\/jCnuL6aX\/Pr2aN9Hb9S56E+ome0cmzQ1k03N3IW048vhkhBaGMqTFofRp\nZQb+a7B\/vrR88etmq\/RToIFWHPe5FkaKaHG0gALjRSS5KmjVY+DwiJByAlDAWUW+fh29WmohFkna\nma2idbc+CvA\/iWXjcNNVIO0\/KZcOZst0b+YM0RH\/x1ab7sN668efl5p4Sl8hStP3WRR0PIXb3iLa\nn62QtWrXUXCskLbnGml\/2UoT7elkvneR+h+mcsgFewWfCM4B\/u+hLjoImik8a6KQ5x5Jk4UcLMjK\nZc0eKZPnrgIKT90jf086tZZfOuRg79Zakt6vWaRfJDMdzD+g\/ac1HAw3QM8mtCSN5\/B0KQFfBxvo\n3fMeDuLt0kRdj9r8sfcu2S0pNFB\/nXoefEc2cypNWO+QuyeP3yPAUTZhn552\/aW0NJpHvbXXqIlN\ntL74PKnerjbLJoBespRse0si8hSxoi\/hEoPDCND+fA1\/OAabfqSh5dFs2SyoOfEbWmfGwnllOrHv\n6UgjX08OLxVM1NaYTB2GK4gcNeovUFvFJVKFXCUksVRt+srpxUw1bXjLaGvaIGvTW0o7Mwbanamg\nHWYIgP\/ESgBw\/oF8muu\/Kw+KNIno7j0p5xEXkAJ8lWUCEcb+iyk9v87ZfptH0\/UohwMqpXrm0B1u\nuEtofiiL\/I81LBo\/kMOaQpNtyfwv9nH8x\/4MVjNF9HrFwuGeeatpd9ZIW1NlFHIWs0my+vEU8xoS\nUVbCxQrwzz0lNGJWc5Cgw0BLjvLjgOOWZGl1UscGKaLZvrscBvJ1p9HUEZxSB8ydPLWdGloc1spa\nHi+kNaeeQu5Sno0NZgIo7K\/kNb03Z+RZCPvYcRfGyqRu41UZZMbGJumqjIKzlH1LqsGG69Ljmms0\nb9NyyCe9d45BxQKiZrxdaXHPuzpu8ejHZkCp\/rprxyLlfqylNZ9R3m+vvBwxCQAfma5SbeE3NDfI\n6oNZ\/3OAaB2TrcnHziHqAs7VHh9uwqKmvtrvjgEON\/9Au4vN8r659CLVFZ37yAFHzN\/zA436i7Qy\nUUjBUS1\/GFLs6UzlQsSwLwDHW9THBsd5XhrdaXHPjbF7MBYb87OAcHF90XlJ5X+kkcTsO6uSWN4v\n05pDR08HM\/iD3YqUQS8DZg44ygbCOSeLFIAQLfE7Fg6T6apOotHmm5Eotqij4NBOBs1pHLDzqPaQ\n3ihAoVHzTd5UJXuBXI8YFLXlsH4CHGy4diydiHQsWNO9C7yvTbalyMedrDaVRgDMiEXDV6QOQ5Lc\npKMAMQAfjIFgIIc1lUPO9NzmD0WKlREUgLg21u241sqKvPj2V9ypSkNhsuMtNzmcDMI01nqbP7ed\nAcIgSLEpP1FSsdRGAQp5u1JZClNpwZbN28\/U0XkBOPTwetx02h7eoCrtX8mYn8iWuWgjTSlMpIxe\nQ8l5\/htvQX2119l6foFK7nxF1XkM0N6qlpRgSiF1Pl5fnwp9P9gc1yRjrL4AVsKiZmcOx7UQooco\nx9aySDFKwFJ2iQOivwKwTvcNVecmRAOiZ+FhABISJrE13mAGuBXVZgQgagvpNDC4B6xVGfMS5RYU\nKZWUuJOPdbEA7Ky6KoNXaRMklbM9WYrtWT5eJ2oWiRQKjBXQMms9M0eGEYCA6mVm8nSn09yQlqYe\n3+UuRY\/rY28jyrrD85QOB3g8QF6DlVf4s2sKzpIu7c\/RLkZqrBWXqaH4HNma1LRiL2QrTHb8Rm3V\n0JpLT09tOSyVGtkoGBygyqgrJdb65vvfRgECSgAiC2WZZyhH\/aWJA6JHVWZ\/zdM00cZeDAYyecRE\n4xXNGlHYC0RqEPeg7SiXNWXURGnYY1YcmA\/XwxxIIxwrIPHcgQY16ZlBClL\/NM1fVtmOVJ2XQD01\nf2NpuiOnMtZ97pg+2Fl1JW5tAVSk0mm9xdsMVg5lK8JkRXuBg5WAg01plH3zy72sG3+IfCXW6c5J\nQ6w1KIXlCGkSqVIe212MAGJCykkgukKYjPIcGj8glREWgFhFAFfLnIvPhEGz5hMcNmNuYhKTidl6\nGraGExvYjVibsQLgZrxMCIWfNnJAREakXql4bzmIKszTzp4lztcfjYHaQ82j7gD463bv6c9+2ZVl\nJZ6q1p49Y8xL0HB4Bs7+7uEhKx4TBxQTUU5CmQWRAQjRxzGAAAjmwX1w7oPCs9wQrH8OY9z\/+Xs5\n8kHf\/3G8PWtYjnxuwiHgIYBjmQIAJCIvwHFNC3MwrmF9ji2Hf4m49bfaqvO\/Po3o8wzkJugwCZEF\nIUAyl5I2+Y\/TzBCnT\/7BdLKdbL\/n7d+bsAOjeBA9KAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/contraband-1313519495.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"contraband",
	"smuggling",
	"no_rube",
	"no_discovery_dialog",
	"no_auction",
	"no_trade",
	"quest-item"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "check_address",
	"g"	: "give"
};

log.info("contraband.js LOADED");

// generated ok 2012-06-22 15:08:19 by martlume
