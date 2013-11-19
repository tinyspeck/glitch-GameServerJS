//#include include/takeable.js

var label = "Pitchen Lilliputt Party Pack Taster";
var version = "1353015819";
var name_single = "Pitchen Lilliputt Party Pack Taster";
var name_plural = "Pitchen Lilliputt Party Pack Taster";
var article = "a";
var description = "Miniature Ur for Glitchean giants in one small but perfectly formed temporary party location. When activated, this ephemeral party spot includes minables, nibbles, snacks and sammiches, and one DIY fancy-cocktail bar.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_pitchen_lilliputt", "party_pack_pitchen_lilliputt", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "pitchen"	// defined by party_pack
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
	out.push([2, "The space created by this Party Pack lasts for 10 minutes."]);

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
		'position': {"x":-30,"y":-36,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKiUlEQVR42u2X6VMUZx7H5z\/IP7BV\nebVXZatiNomKmqCo8SpjdiuprajRYAJREDnkGgSbS26GuZlhmIFhZrjEORiGa4AW5oLhGERQOcQb\ndU3irbim9ru\/fhB2k0rti619yVP1qX6mp6efT39\/z9PdIxKtttW22lbbavuf2hdpaW\/h9YNw4OG7\nceKc8ImxgfCoEnX47KVg+LXZYPita2PhTe4u7v6dy5ytn+dUo9Nck8fHTdy9WeO9fZsfvX+Pt8zd\n4fXT\/8mCrWb2LmeYvbOven7hbTaQWFJ2eDjg5s7UGLmvz5RzRworuG9LFdx35So+8UxhqM3ZBLXF\nhAStiTe5u6819brR5ePR4e+H3e+BzdMPPugBiWD25hVMzl1Ez9gwlGdtcAWHEJidxtWFeQzNXkFz\nMIQ67wjOjl+G9eIM2qZmEZibg3P0Aiy+UZwdmfwZVZ4xiPac4vhDXA46+A4aMADHMoFBtBJtI2OQ\nONyoaF1C6uyBoqMf6h4\/4msdSDS2Ek4kW9qRaTuPLIJz9COn1YO8Ni\/OuPwo7AigqHMQxV1DKHMP\nQ9I7ioo3lLZ5VvrldExRSzcKGl0r+0V708T83zI5SI01iDI4EF3Tiu+Io7VOHCNi6tpwVNOE4yYX\n4i0djAQiRmlCLJHS5EZqsxtpZ3tQ3GiHrMUJhdUFWUMLUnWNTFRsOItOnw\/dfj86+T4MDPmRbWiC\nZ9CLqSsTkHf6mIy5xwP89BhXr0\/\/W\/DgyZN8bl4W9I11K4IpSj283h743uDucYFTaHBM20yC7Ugq\nV+Pxjzfg6nDgRFUT0pq6kU6Co6M+PHt8B\/N35nFnYQ7T0+PIozTSNWa8evF3\/OPlA7xe\/AE\/vfoR\np6vMUNFFLC7+iLHJcZS18li4d50J1vd6oODHGKIdKWI+NptDdb2RpRZDHCpUYfryCB4+mEeOzoiJ\ni0HWT1YZkFTfAZnewAQXbl9BbEEFxCSXQeQrVHj66DYkpkZwmlo8f7IAh28QebY+iLUWTF0eZ6KZ\nVRaUkJCk0w9zaxv++foRLk6OMbl5Sk\/RMwx1\/zgqB8Yh2p6czkcmxENVW43jVM444gSV0+NxM6mo\nCgOi8ytY32CzI4nmXKvTiqFhL4ZGfJDpdMhs6WEUqLUkeAuleiPSDc0sTSeVtNDlxWmTDRcuBLH4\n\/D7yG9ogJQl57whk3QEMhEJMUhBsOu9DlXdiBdFBsZg\/kp5Gc9CAeHM7EoUSUkoeTzeT+k5qwMGM\nAtaX1RoRq6jFzJVRyCuV0NYZ0dPbjlRDCzhrH\/KVlXjy8Ca6ejtxrsPF0mx0uVDS7sPpOivGxwfx\n8tk9iBXVkLmDLClV3wia+wZY2S\/NTEF7fgQG\/8U3TEK0LSGZT+EyoTDqkdLYSXQhlfAMdJHUVZbk\ncrnj8suQItWy\/jKPvr9O88mEXNuSoFB6AUF0eIRWsukcSkmQI8FQKIAXT++i1NRMckEo+4YhdQ3g\nLs1XYW5Wd\/TB4JtALYkZB6dQR4h2JpzkM7IzoKzVIb25G2JakanmNgysCHaj3tmKdIkSGfUuyCnF\n2zemVhbRvbtztMAacMbBI0++tHiKqwy4vXAVTQ4ryqi8kg5atSQ4Oupn81Lv7ISyN4hKErT28azs\nIxdD0NI+g\/cCCV5EXWAS5iAJ7iXBA2npKK+uQhbNI4Hj8lom9uj7ecQrjci29iKHyLX1otVlh5dS\nPXpGigS5AS6+F+MhH7LrnUxQSFR51g4+4MFdWkT5lKCUFkOeyYoRSlSYl1KDkeSCkLbxuHXjCiu7\n1tmNGkGOEqwjQfPgJOzjMxB9lpgUOhR\/AmUaFXJsPHLtPBJUdSxBQTCp0oQ82se1tCOttpEGL0dE\nzC4cKEtGUet5lOiWSl5maYHReo7616BusUNNSQtp2t1dkHctCQaDA2wRSXQ10FJ6JQYz7B1taGh1\nQtc7hFrvOIy+CzAFJuCduYEXi68g2hJ1FJHR30Khr0SBsx8Frf1IUptWEkwmQa7ZjgSDGlvTdyMs\nYcMKHydHILqAg8aophVchXy9BWpKL9\/YjAJTCzTnWiExN0PlDkDm6kdymRKpdA8tb+mAjh+Gvp8W\nxMAYauiRVuulx6BvHCY\/PfZIMDh\/C69fv4Zo34kTOJ4YB7lODcfIFEpdHuQ0OHFGXwcp3Uhz6EYb\nrSz8mdgvOanXQkZPA3mXDwpCSYlZPKOoJypJTtMzSIkNoYrQ8UFUnyc5omZgFLVEnScEE8mZCUFu\n8uZd+Kav49UrSnDr0VjsT0xEoVKGZ8+eoZquTNoVYPNGSoNGSrL\/q9wy+4tPIKdegmxzGSIrEpFa\nnUarshqZxmxI2jrpvEHoCYMgRskJYka6ABMlJ2Dxj6MhcIFCuoQXL17g5cuXS4Kbv4nG7shvUKSo\ngM1rR1W7jp1Y5dTiqDKV9SusUibxl5y\/ovF8I\/ucZ8nD9O0ZLPywsCIzOjvKvotRxLL9bUMuPHnx\nBBkkbfKQVP8wMUKJkRhhptLW+0KMiWu3cOnmAuYW7uP58+eMxcVFetRFRSPr1EmUkqDJbUauORdC\nS9VnYU\/WPjaAwPb0T5icICIICcKCiCAl9AUZ4bv2QDuKGoqZfP9EP\/uNxX8e3ZevwkmvUB1jl2Dx\nkhjR4A+hkZIbnLmGJ0+e4OnTpwyhkm8kQ6JNR6KwPTIKGbm5LNZKp4YJptUUIYvKIwgIgwkDCUKC\n7KGSQ0xqOTWhL2yX0zxccoCdQzi2tEUCncMMfvY6huZvYu56CIGxABSSBNRaFPCG\/Lj34Ac8fvyY\nSf5ClBdFfBOFndHHkC+TM0HNG8GDxV8xKWfAtVIqIUWhhMtSy\/2PqC8cK\/Q5Yyq2JIexcwjHCxdx\nVPolNA4xCgw7ILN8Dm3Zlyg\/tQ+n4nah0pSCW3dmcOGKb0Xy+s1ZJkh9XrT9yDeIio9FsVy2IijI\nhL0Z9Jj0GD7L+oxJCukIEsL8W56TQn\/n8Y2I5T5HpjYG2aZYesHYgOSqw0jiNuNk7scoavwYSvtm\nqBwRUBOFp3eiIGcnMsRb6a0nHOX1n0LZFIeWnkx69XLjVNkhJkrCvCjsq68RfSIGnKSCCQ6Md9J9\nqhzVrkpkG5OQpfsKW+P+jF2n1v\/q6t11KgwxpzeiTLoJ5YYNkDWGQW7bAHnLRnqh2AJ5VQQUum1Q\nGrZCWR9B74DbkK\/aAq5iM9SNO6Cxf4Jiy1bkGCJQ1bYbWeoIHE7eiJkbgSXBdQcPP9wXFYWCCgkT\nTJKG49JVDzIrvkCJJQyZ+j8hXfsOxPr3sTbyfayLWxITtruTN0CsXA+pjsTMYZBa10HGWE8Iohvf\nsAkK20eEkGQ4xJVhyNBshNpKiVp2oLJ6DzT6vdA07CbJXahy7UF1+15YB1J40Xv7978d8XVkiCsr\nR3CqHYdzf8ukdkf9Bgnlv4fM\/h4joeQPOBD\/O0QVrcOn4vWIk38Iqe19kvqAth+yrcy2lrZrafsh\nQ3puPU+ixEZeYV\/HK2ybOJLkVA6BDZzS8dE+deuW8CW2h2vd29761b+Q276Ifiu5ILZCal\/DC5Q2\nvcunq\/7Ic9Xv8HL7GpvM8gEnK97EyWrWcgrnGobMsSZebn0vXEDdvsTqn\/HVttpW22r7\/7d\/AeYU\nXTOCGTnCAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_taster_pitchen_lilliputt-1334259345.swf",
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

log.info("party_pack_taster_pitchen_lilliputt.js LOADED");

// generated ok 2012-11-15 13:43:39 by martlume
