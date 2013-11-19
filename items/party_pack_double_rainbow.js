//#include include/takeable.js

var label = "Double Rainbow Party Pack";
var version = "1353015743";
var name_single = "Double Rainbow Party Pack";
var name_plural = "Double Rainbow Party Pack";
var article = "a";
var description = "One ephemeral cute-as-a-button party space, perfect for private events. When activated, temporary party location includes complimentary mineables, munchables and mixables, sparkles and lollipops and glee.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_double_rainbow", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "rainbow"	// defined by party_pack (overridden by party_pack_double_rainbow)
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

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.activate = { // defined by party_pack
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Start party. GOOD NEWS: permit requirements temporarily lifted for parties",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.party_has_space()) return {state:'disabled', reason: "Your party already has a Party Space going."};

		if (!this.instructions_read) return {state:'enabled'};

		if (!pc.party_is_in()) return {state:'disabled', reason: "You must be in a party to activate. Didn't you read the instructions?"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.instructions_read){
			var can_activate = !pc.party_has_space() && pc.party_is_in();
			pc.prompts_add({
				title			: 'PARTY SPACE ASSEMBLY INSTRUCTIONS',
				txt			: "1. Assemble the desired group of party attendees by clicking on Glitches in person or in chat, and selecting \"Invite to Party\" to invite.\n\n2. Continue until your party has reached Maximum Fun Capacity Level. While waiting for party pack activation, the party chat channel can be used for smalltalk and metaphorical icebreaking. \n\n3. Once Party Participants are assembled, activate party pack. Do this by clicking 'Activate' on party pack. \n\n4. Every guest in party chat will be sent an offer to create a teleportation portal that will take them directly your private party space, regardless of their current location. Party Participants have a limited time to join, so ensure everyone is ready to party. \n\n5. PARTY HARD. \n\n<font size=\"10\">SMALL PRINT: \n* A single-activation party pack gives a party of limited duration. To extend party length, insert currants into the machine inside your private party space. CORRECT CURRANTS ONLY. NO CHANGE GIVEN. Parties limited to "+config.max_party_size+" participants.\n* Please note, due to physical funness capacity, individuals can only participate in one party at a time.\n* The giants and their representatives are not responsible for the level of fun experienced at parties. No refunds for bad parties.</font>",
				max_w: 550,
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : (can_activate ? 'Activate' : 'Understood') },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid
			});
		}
		else{
			log.info("Activating party pack for "+pc);
			var ret = this.activate(pc);
			if (!ret.ok){
				failed = 1;
				self_msgs.push(ret.error);
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);


		return failed ? false : true;
	}
};

function activate(pc){ // defined by party_pack
	var template = this.getClassProp('party_id');
	if (!template) template = choose_one(array_keys(config.party_spaces));

	if (!config.party_spaces[template]){
		return {ok:0, error:'Bad template'};
	}

	var duration = 60*60;
	if (this.class_tsid.substring(0,18) == 'party_pack_taster_') duration = 10*60;

	var ret = pc.party_start_space(template, duration);
	if (ret.ok){
		this.apiDelete();
	}

	return ret;
}

function modal_callback(pc, value, details){ // defined by party_pack
	log.info("Party pack modal call back for "+pc);

	this.instructions_read = true;

	if (value == 'ok' && pc.party_is_in() && !pc.party_has_space()){
		var ret = this.activate(pc);
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "GOOD NEWS: Temporarily, parties do not require Party Permits."]);
	out.push([2, "The space created by this Party Pack lasts for 60 minutes."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"party",
	"pack",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-31,"y":-37,"w":65,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ8ElEQVR42u2X6VdaZx7H+x\/0T5g\/\noWfOTKZ7aafLtJ12Mk2bJu1Ykyap0UaNqOAuaiKuqFFABAHZFGURUEBABBSJbBpUXFDjviQmbnFL\n2+Q712uTKe28mHk188LfOZ\/zXC4H+Nzv8zw\/7n3hhZM6qZM6qf9tCYs0L0nLDZTmKhOlrdZK0XJ7\nKAZ+L0XEbab4PFaKSxVkeC1+hkpiYbjM\/YxJ\/zhjZmiKEfIHGRMjw+Kx\/gXH2ui2Y3vpoWN3Zcfx\n+OGuY3fhCcFTx+7SU8feMsQHq2AcrINysIHf\/UaguVZLaayQoK1RBf5NBWroYrBzZODlt4Cbr0Bj\nrRBKiRylOXzoZCZ4bR4EnF4EbYMYtI7C2eGB3xZEr6EPNq0dAWsIHmsQ04MRjPvCaG\/RY6AriGHn\nJEZckWP6JmGQmNGr88LV7ouiS+5GlCAziUspT6vHrVIuXA4zmus0aGEfoYWSc4yGb4KiwoSGAhVq\ns6UkdbkySJhGSEtNkJWbIS\/vQnOlBS1VViirbWi91Q1VXQ80bAc0XCdJa103OTaxDJBVG5+fry9R\nkjw7FyV46p2PKHkZhSjML4ZBrwE7ow2cTBWqaERqVCGY1\/nITahCaaoAAoYOjYV6cPPa0FLfCVFp\nC5T0CqiuZ4FDL4OYrYJeZYGRSLKdWYMOeh5kDVrYzL2wW9zo7\/WDQWch6BshXx8J8ctU2Hi4hf39\nA\/JY+2vBpG\/yKGWFTFRVMqHXqUk5TpYaDGoN7gRHcXh4SDI8FEZ1dhPEuQpUZ1bj8ePHuDMQhC72\nc3R+dxb8ojL8+OOPmAhPYW52EQtzS1ClxUPZIMeTJ0\/w9OlTrCytgVckgIjThqOSCbToUNvJY3eP\nH3p+H0mUYGFCFaUkowrp9HRoNa3gZWvQkKNFbnw1JsenSfLSyhGZnIFC3A5DzBeQsZtI6SPJPmEi\nFrTfQHwjET\/88AMU9Ww0luSSstp6JlxCKm7b7aRkC1uMLloqbJk09Fr7yOSepdfCNaFT2E8SJfj7\nN9+nUK9mIyMjCxq1Evx8HTmV5akiDAVGMBQcQfXlbLTK9QgNhiG6fgEOmxtGfTeWl1bhd3BxL3IF\nKlkSKazXtENUn0oKuizEexNUjPqt+Omnn2CQChFRpmOwigZNZg7uTs8fp+cIwNw08JwowYSvsihJ\n16ig0TKhamuGqKiDpDJdjMHAMMEIss5cIn64i5QtT4nD0uIKBvqDmJq8izsBN0IrF8GTxZOCK8tr\nuDszT6ZpcRVgYi0ZoaFjQb1ShDlnLu7qs+DiMxDwhsj0WqvlsMp9z4kSzPqunHLlYhKyc2hoa1VA\nUmwiYdElGPQP4+Dg4Dm1FVzUltLI42drc+PhJhpdLNzkVZKCrp7b5Khud0A9JoB1oRBmewuZaHeX\nHbPjN3E3WALxrVpy2l22XjhvlMHJ18PeEiSJFvyWSaGmpCAliQ5liwyK0i4omJ3gXM4gE5wYm0Id\nsxw1zDzYdCkQ8zmkmFKmI6f9SFBuHEJ+oZw8X1bIxszUHPwDQ6jVR1DvWEdDk5lMtFPXDXckBxZL\nMTkDu4\/20M6tQqC+Ev1lNegVW+FS3YkWzPj25ml6chbSU7LQ0iyFssIGNa0K9TEJZIJHku0SGgJu\nYt30JkCnMpMbh0n0NFaJBp4+P\/q6fSih80hBtcIIk6GbTLEyXwCTyANhvYYUNGitUPS7wWazyETt\nXQ6EOqswpqmGj1uL\/uoG9Cl\/tQbpsTcYl69eAY2eAoW8CWqGBLoEGpqSExE8EiSQSdOgdqejmPiS\no0TdLi\/ajhpxbTfEDUosLiyjIOZorYWhq+VBVFCK4Ttj4FUK0FtQQbQnFnlh9dVSKDpncJOlRWWd\nEGp1BSb9AoyZORhVcXCbw4eHI3NECabHFjCKCjKRlJQMuUwMfUohbPnEri1IBovJI1JqQJ0oF2yN\nG4VletSVNIGRWgVbUQP64y9ATv0KgpxYjCjPwS3\/CkHVOYR159Env0hMXQzCrBgMpl2ELzcfDrET\nPcQaM2jDkHRFYB0QYsDHw7hXitEOAUJKASEojxZMjclnXP06Dde+T4JUIoQpuxgebg686lJ4LKXQ\n2\/PAI5qpUBaCSeCBqfE2HDmlCFDPYkJ4FrO2b7C5HI+trUtY2zpHcAZL6+cxT+zse3NEj\/QnYaYz\nEeE6YkayU+Hm6eBsG4LWMInWrhF0e\/gYvC1BuFeJpf5WPAhZowVTvs5lxF+4jtjYOEiaGuGuK4ZX\nUgavkQ2jpQTS9nbw5SOwiLywin3oozEwVPItJtRXsDKehrmNZAQ3LqB9gQnplBTSaQlkU3IoI43o\nvJsB7+w1ot\/lYd7NQFicCX\/hTbgVbuJGYg5DCzsIzkcwsWLATMiIrTkntqft0YLJ57MZVOo15Oem\ng8\/nIiCtgs8gRo+pHpoOIYSKEVilAXRL\/XCWCDDCpSLSScPifBF8q9lQR1rRMXkfwaU9RO7vP8fl\nW4XWvQoJ8b\/rXG7A9EY11sNsLJvrMNeuITfR3sEhIbiNmYderD8awMHeMHbm3NGCiV9mMuLOp+If\nMZdQWlKEhUAHApZWmM1NULSFYGwOwdk8hGCbC6PcItwPVOLBFheeFQ46xuexvLlP7t5nvXJq3hvV\nO3f2DjC4uIue6UasbkmwMdaENbsC2zMTpOTiwz2Mr65gdcePg\/0J7D0MRwt+\/yWdceF8HOjXM1Fe\nWoTDvVGsb\/mIFCYxtvIIm+s7GHVOYc3ShvseDh5tKhBYlaFn6h4ptrXzgBzvPZhDqzUDFfKPoyRv\nh1qhIdbxLeUn0HvT4fDmEXcyWRgj1tvR5\/aJFCdXd7CyHcbO7jRxbilaMP6LdEby1UQkJSaguqYS\nhwczWHs0SlzVFrb2Dsl+tR0JY93TSrScYvB1n6FM9jrK5K+ApXwNtdo3wDVQwDf\/meBdCMzvEbxP\n8AEau\/5C8CGElo8hsvwVYtunaLKdhqT77xCZT8PkIzZjWA7noAorm4vY3lsgBO9FC8adSWVcOpuI\nS5cvoq6uBvuHS7i3s4jZ+7uk3NScB2G3lNgw8WC1nUKt7mVwO19DvfF1gjcI3gTP+BZ4JgoaTO+Q\nkse8R8h98DNHkh8Rkh9DbP2EkPwbKXmEtPsMJLbP0TGQiYlFKyG4FS145TPq6atfUjeTEhJxg1mM\n\/ccPMLM6jv4RDcTmc+Do3gKn8xTBn8AxvkyMr4BrfJUQe40YXydFeaY3ifGZ5Nv\/dZrS7s8gtX8O\nmf0LItVcx2+eS66eS30p\/lLibAWLhZFZDVTuKz9L\/RtIyaMUj0V\/nSYhOsQzUhw849uOBtO7DkJW\nTIgyhJYPSBotH14QWT+iHPMpRdbzyUv\/0dNbXFzciznFsWJ25x8dv4Rj\/CPjl3BNpyj\/4lVKg+0P\nL548+57USZ3USZ3U\/2\/9E4bCblXU\/4WBAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_double_rainbow-1334258349.swf",
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
	"no_rube",
	"party",
	"pack",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("party_pack_double_rainbow.js LOADED");

// generated ok 2012-11-15 13:42:23 by martlume
