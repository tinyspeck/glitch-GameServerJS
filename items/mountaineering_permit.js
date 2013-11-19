//#include include/takeable.js

var label = "Mountaineering Permit";
var version = "1337965215";
var name_single = "Mountaineering Permit";
var name_plural = "Mountaineering Permits";
var article = "a";
var description = "A permit allowing one party of adventurers access to the highest heights of Ur. See how high you can go!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 300;
var input_for = [];
var parent_classes = ["mountaineering_permit", "party_pack", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "mountain3"	// defined by party_pack (overridden by mountaineering_permit)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.expedition_id = "mountain_7";	// defined by mountaineering_permit
	this.instanceProps.difficulty = "1";	// defined by mountaineering_permit
}

var instancePropsDef = {
	expedition_id : ["Which mountain this gives access to."],
	difficulty : ["The difficulty of the mountain"],
};

var instancePropsChoices = {
	expedition_id : [""],
	difficulty : [""],
};

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

verbs.activate = { // defined by mountaineering_permit
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Grants your party access to the mountain",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) return {state:"disabled", reason:"You have more important things to do right now - get out of Hell first."}

		if (pc.party_has_space()) return {state:'disabled', reason: "Your party has a party space or already has mountain access."};

		if (!this.instructions_read) return {state:'enabled'};

		if (!pc.party_is_in()) return {state:'disabled', reason: "You must assemble a party of mountaineers to activate. Didn't you read the instructions?"};

		if (num_keys(pc.party_members()) < 5 && !config.is_dev) return {state:'disabled', reason:"You need a party of at least 5 mountaineers. Didn't you read the instructions?"}; 

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
				title			: 'MOUNTAINEERING INSTRUCTIONS',
				txt			: "1. Assemble the desired group of mountaineers by clicking on Glitches in person or in chat, and selecting \"Invite to Party\" to invite. A minimum of 5 mountaineers is required.\n\n2. The party chat channel can be used to coordinate your mountaineering efforts. \n\n3. Once Mountaineers are assembled, activate permit. Do this by clicking 'Activate' on permit. \n\n4. Every Mountaineer will be sent an offer to create a teleportation portal that will take them directly to the mountain, regardless of their current location. \n\n5. Light the lamps to clear the freezing fog until you reach the top of the mountain. \n\n<font size=\"10\">SMALL PRINT: \n* A mountaineering permit gives access to a single mountain. Mountaineering equipment not included.  \n* Mountaineering is undertaken at your own risk. The giants and their representatives are not responsible for accidents, injuries, or traumatic experiences.</font>",
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

function parent_verb_party_pack_activate(pc, msg, suppress_activity){
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
};

function parent_verb_party_pack_activate_effects(pc){
	// no effects code in this parent
};

function activate(pc){ // defined by mountaineering_permit
	var expedition_id = this.getInstanceProp('expedition_id'); 
	var duration = 365*24*60*60; // a year?
	var difficulty = this.getInstanceProp('difficulty'); 

	var ret = pc.mountaineering_start(expedition_id, duration, difficulty);
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function parent_activate(pc){ // defined by party_pack
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"toys",
	"party"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-34,"y":-23,"w":65,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG+UlEQVR42u2YWVBTZxTHefDFF3zw\noQ\/aWqviUhUXVHBj6r6NS6sy47S16oytC0KnotYiQRYXXMKqgkvCFmUJIWAMmCAYloQ1LEETIATX\nqVbFKfb53+985GIiMA3YqjP1m\/nPvXNvyP3d\/znfOSe4uX1cH5drq67qpm9NZeHWDxawxlBQXGMo\nBJOipkYz7MNzrxuOq8lY3NneXjfqgwGs1hca66o0uNOog9VsgK2lkqvdYii2WSrfb9gp70zGEiew\n3jJ0MklsrYZ17xzQYiq19Q\/Wt7izBMzctbVW+TqJXbtnrRa9\/MMixgvr2+Uy+zJxfxDFuiIobqh7\ndDX3OsSSLJde4OmjJvzVaRW9HRwLF32Z3lACtfYmJFlKHE+8hoDjEmwNTuSi8\/PpOTDWleKuqYIf\nZTm5fCPV1xSh7a6+B8psKkVDbRHuW2vQ9bzV9lZwVmvNsO68eu0WgTjCOULSkeBJcclZyMhVIEkm\nR6w0E81N5fw7LM1lHPDxPSM06mvB7DEeTCMHBdidQ32HhxylcB48k9ILVlCuSsldp9DTy3EHm5jL\nTTq03ilvZI9YY9fwgYe2xRAgwDTVFaHWoO43lyisBEHOOQKmyxUIOp3MX4Jehj7b0lzO3KtH2JGg\nQ3Y4r0E4V+npCECAGbIELn1pHtiO7heW8k9wloApJQiWcpfud7RWwdJUKri3nGnIwOBYZ3DMu9tF\n2T0PJxdJqVIxq4d6p3v9pYGuogQ\/hV+GLK8Afz5rwasXbY7uDSz3qLdaTGVGx12nUiajIOMcirMv\noEqdCoMqBZpr51CmlCBZHIxi+UWoEyNxI0EENdNtWQyq1Wk9R1LK0UCotFoOd6fhtt4O5zPgHcu6\nhU3osxW6PFxNi0N9iRxZUfuR4L8ZUUHbkSrahfzYI8g5cxDppw5CkXgM2SkxyIwPg4Jdb6gshIJ9\nvpi9VH5sMHLYeWbYHrQxxwlw7epl2+2hHeo63KaZwzpUUqOZudSSea5nGNDdUuDk\/m1QJIRCHuEP\n7ZUTiNm+EvF7NyEpwA8ZEfugOHsIGZEBKEiJxgV2PS18H2L8\/aCMEyHlwPfIOhaInJO\/wGoxwFil\n0djdG+16zm2ZO8rsN7fT8I03spZO5UrfMB+lOVc4ZFrobsglZyA+sB0FSZHd9ZC9iJLdTzwRBFVq\nNJTRh3sgVReP83OC02ZeQCG7X3kjFU8eNgruLRhQzmXu2mSMnz8B4V5j8POUz7gOTfsc0hUz0ajN\n4q6p7flFUooP8\/Cq4kM4cHm+FGlxoUiLFSHjfCRKlFI4jmSm+hLeNRzcc3dttqsrGmWSnjJKls\/E\nzokjEDLzC5z28eAK9foCuau9cHfbUpSp0nrtTto4tIOLCjNY6yrjqmW5l3zlLC4nRaGx7hZX91im\np57bZXfPw+UNUa5Kt7XuXIXLvpMgYnBx88bj4sKJuLCgW9qNC\/BozzrEbF7M6+CbkHRNxdySpcZB\nnZ\/qBCqcU1ujoqwtyExnj13kUs2jIsxamE2ffRGVG2YjgYU3ynscYhjgJQYbNWccDrIQ562Yhpur\nZyBqlTcvzkId1KhlToWaTdkcMjsjkbsmwJGoXD1\/3Nw1eaKHn0vtjM9l9iJMf5yyfh53K2zWGBxl\nORg5ayw\/qjd\/BfO3vlAs88ThFa8BHQs2dRU6kkuCc\/rSfC4BlNxLkcSK2aMn\/SPc7\/frxdRmHB+k\niQ5Bxca5sO5ej6uLp\/AdbNqykF+j84jFMxARsq+vQZQ1+wpoWQ7qbuU4hVVQ690K3Guttrrczmhq\nfdXZtpW9VfGjjjoWpjJWIuJxbckUHkoKKYU4Zu54\/DZjNPb6fAm57JxTOCnvyM2GWq0TTF+ATx40\nCi3tkwEPA\/nyZD\/mgPX68QM4w3YtAR2bPRb+kz\/FjgkjsHuBJxLEIue+ysDOJ0RAwXKXRNF40F7L\n7lX1gutoqxbKiudgxjx3u+1rwgN2JElFgV1B363FkTkeHCxeFNhrtCIXCUpw0zEnLSYdHjLQRuYq\n5dyTh03ofGLu8pw84esBTyr2NUkAJFF9MjfoGlkTR6FKhmZWWN\/MOap5qdJo7iBJmGIo5LnyS2zD\nVfA+Kyg+OiJ8UEOowxpiH3V8BFBFtiSJFdUu+t3bzGAdAQW4ULZhBEgSXSdX6cePAGefVjzc\/sXl\nbne1x81HHcZe+SeElboIlZgYlqPCtYe2Wg5HofX2mr7kv\/rpO8QOuojcpPZEOdXnIMrAqGBTWyNY\n2jAEeCzs1\/2DzbuBgnpQklOLYlNIF5WlvkApvOToy6dmoZ25u73DRaCjZ82YuoK6QbW+QMMc5a5S\nSAU9e2wSSspIt\/e4htoT32fXjz\/4k1sVJXm57WYD7X792pVLpn9o\/yYcai8jw9+2nHxc\/5v1N7jz\nNRuL3G4RAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mountaineering_permit-1334254315.swf",
	admin_props	: true,
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
	"no_trade",
	"toys",
	"party"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("mountaineering_permit.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
