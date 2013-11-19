//#include include/takeable.js

var label = "Toxic Moon Party Pack Taster";
var version = "1353015823";
var name_single = "Toxic Moon Party Pack Taster";
var name_plural = "Toxic Moon Party Pack Taster";
var article = "a";
var description = "One secluded and totally transient lunar location. When activated, temporary party spot includes ingredients for cocktails, sparkly rocks for space-mining, and a notable lack of gravity, for super-awesome-space-jumpiness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_toxic_moon", "party_pack_toxic_moon", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "moon"	// defined by party_pack
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKjklEQVR42u2XWVQUVxrHeZtkzkxW\nHzRxiUsSl2hUFGXtbrZmpwUa6G56YW+W7mZfZGmaZl+FVogCIpsCiohREESLLeyoJOISzeCWmDlz\nRoxmnZkz\/7l1CUaPDzN5mDe+c\/6n7u1bVfdX\/+9+t6uMjBZjMRZjMRbjd4dHRNGqPWElnGjdIc74\ncA+n\/HArp6L+JKezp4ejK2vV1LZ0aevaurUN7Re0N29OaycuX9aGZLWXxhWfZRrPjDLVJ4eZ\/skZ\nJrumn1EVdf+mwu5SdVGPRlXSw4kourCKTrbDWV2q0ZYxGftbGFdFKmPrE8fY+SYyfEkS4yhLRVhC\nPg4fqYEysQjuwbnQV5xEYc2naDlzEaV1XShr6Iah6Tz6JmcwMnMHY9fvoq1\/BpXNvShr7EXViX60\n902jqedz5NUPILX8NNIM88r8pAuGliHk1nQjuejoMxVUnUJ1aw9UGVUwWm4eyay0jMJmfhQi809i\nb3k7GrtG0D1+FTk1nUjb34HaTweQXHAYftHFkEaXQB67D4q4fZBEFYLnqYGNMBr2PrHg+8bBSZIA\nF2kSXGXJcFekwCMwDV5BWniHZEAUpockIhsyVS4Umvz\/SUZcLxWz0VaFdVwV7CKq8BFHhs1cOSKT\ns7DV2h\/bbANgbB+EHfwgmDiEYLeTEmYuYTB3DYeVeySsBCpwPdQU0paIhXQUx8PZLxGuBNRNvhd7\nAlLhGZROIX2VmQiOK0B2WTVidfufgbR3daKsuullQM6eMEaTEIeoxHjYhR3EBks\/bLKSUtAtPDk+\ntlZgq40\/ttsFEneisdMhGLscQ2HqrERovB4ZhWUUlIX0CU3ByGQvRqcuUGkL91M3K4404Kefv8TP\nv9zCL\/\/4ipynw+fXR\/Hd0y\/J0ilGVVMr\/o37z4Azi2t+A1xqLGUs3JTk6cNhq6zAh+YSCrnRch5S\nV1SKR3NTGL90DhOXu9F86ugzNwdGOvH4u2mS3qhnbl652oeOc+3QpBbg+x+uQabOhDA4jUDWU8hD\njU3UTYUmG7fvTOGLG2P4699mMDDWT4GUCSVoO9NJRQGN7eSMMT8AAlk4TIRaSMKSSPpCsN5iHlQS\nnkQAJyGL3EtAVBRWGJxIIeceX0Znbzvy91fAzDUClgI1hsa6cbChHtbCOIwQF2MySuEgTkKcvgw\/\n\/nQTSdkGCPzTyNrUkrF9mPvuBv75r1lo0vZBrs6jUNHpBioKaOosZQIiwrFypxhbXeMRHJOO901F\n+MBMTN0Uh80D+kUkw04YSQHlqlS6Ru9\/PYry6mpMTvcSQDXMBVEYJIBD4z1obGvBk6dfQByZBXvx\nXsTqy\/HDj9eRkGWAmyId7v7p8FNl49Hja+gdPE\/XJltAUlXOi2twySYBIw4KgTg4FB87x2DtLl+s\n2+1LIVn5KhMp4ILGLnWRIlGSVNVS2LnHl6iT4ggdTN1jKODgWA++\/MswSg7VwkaUAltxCmJ0Bppy\nQ20jXBRauPlnoKGtjaY9lGxh3qF6+BBIttJZyAU3jbiuIiYyJhyWLn7Y4hSF1Tu9scbEh0Ky8gmJ\nJyATSM8vIm7uxSauP7ZYB+PazT7o9x2Af0wW+oY7cbj5KHa7x6J\/9Bwq6htQf6IVg+PnwfNNhY04\nHZoMA55+P4PDLcfhJM+Af2whTXkXcw57gjLhGZwJr5BMAql\/wU2jNz\/kM2+vd8SSDS74yEGFVTuE\neI9AsqCsm96\/Avoqk7DByh8buUFwcwnEg5vdEEqiYM\/3R3KeAfcejGCXIIEAduNAXSPisitIAV1B\nRFo5rEVaqAkgm\/Lq5lY4yjLJeCWOtJ5AQGwx3AP0BFJPQVnI59002mLhNhcVqwTP1RcfcAKx0lj4\nAqQwOJ6kcBK+YSlYT8aDuC7Q86zR5GSNg1wLGHhcqAVylB2ug0tgJsTqfAhCcmDulQZlqgFeEQXg\ninTgEdn6ZcJOqoc9kYM8C06KLDj7Z8HVXw\/3wCwi\/QtueofqZo1WbLaBq1AEUzsPLFnvgBXbPeEk\nVhNQL7xn4ovVu8RYaybD+xYBiOXyUcazQB3X9AWxkIm2AuwUpMBEkIrdnukwE2bA3FsHC59McERZ\n4IqzwJNkEchsKntZNmL0h5BeUgdVaikydPE4c\/YYRBF5v7qpg1ewjjFavokDKwcBFMFyvP2BLZZv\n86SQK429scpEBHOyv3kr05Eq8nwJ7EVIHqL5PghyVCDJKwgqJymKyNZUG58GXUAs7Hx14EpyYO2X\nCxu\/HNjKcpBTcYxsRSMorDyC6OgglJRoUXf8NHXSPSATgiAC+NoKE7y+ajeRGd5ax8O7Wz0h3MWH\n3kuCSlUsjiVFoTk6ABdTEnA6UEZhxg2leHh5Cuc04Zg53gw22D57zt9v3cSV2mo6xv7Gnvv04TcI\ncwsBR5IHnl8BgcyHjTQPT57cxt6iIzh2uov8s0zi4mcDEIblw4Wk3NU\/k2xFBPC9j8zJYveBX4AE\nb66xwjtbPRBnL0BlZAydeCAnHRf2xtH23cF+CvjL0ycYytVTCLbPBttegIpwUkDmOg+\/IDdhCqwk\nheAQQC4RT1oAH40B6sxqTF+bRFntCVJAHfAIK5hfmwo92Y4yGKOl63bC3tUNygg53lhtgWVbhdjO\nD0ZbTgaduCYijE5wq+sM7Z\/w2UPbrFML6V34nQVk4XsrDqLc3YPCsv2utFSy3eTCQlICK79iAllM\nIIvAkxXBmoD6RhlQ1XwaIs0+ujb5siw4yvVEBPDN5Vvwp6WbsXTdDprqZdu88Y6xBCd184B5HB6F\nGT1STSdkYVko1s3nHWSPnapQms6x8mKcjQx8lnb2msEiLVlvQ+gZuABmZAAHGjugSKwCV1pI3dTv\nPwa1rhq20hxS5aSIpKSSlbmM0dpNO7Fhuxm2mXJhbOkMYUgy3t0hRb5\/+LOJWZgYG1scEIloalkH\nWS04yK6zg0JnNMUGY7SyhKgYY037MVCoQ29hKkY7j+DG5FncuTNKdeNGHz3evTuOqzfG0d3fh5Ka\nNvioDfMFRKpcEVuK5o5TjNEfl7wPP5kQNo4OWPYhAeWHguNFXqtMJZBbCsC3lEDirYGhqgHHspKQ\n72D1UgXXkD2xTqshkw7\/qhGq2dnh5zRCNT82Dzo93Y2pqU4K+uDBFL755jJayVuMj7oU1mRLIm\/w\njNGrS9ZhzUZjCEUeeG35duqed5gWK0xDYOaZiE+OHsfXX4+Ti8cxPNyK\/BAhyqUCHHCxRhnfCgd8\nnFGXrqZgd++OPAc5\/F8hWScHB1tx+\/YQhZyYOEOPt74axydN7QQwjzH6w1trNK++vXaO7+KI194l\ngDvlWLE7EMn5lbhzbwLffjuFq1fPkZv04\/r1XnLTXox0VOPSZ2242FWLzpZyCragl0HngTo6KnH2\nbBUFHRo6gStXul5wk9W9e6yTE8SMS7OnOk8x5C27lH44vfLG6lWvLFnH\/Jk4uMstCheGeshNmskT\nnSIXfobz5w\/j9OkK6uS8xsiNRnH\/\/rzY9oMHY2x7jkAxrEifikCUEmDt1NSn2uvXz2tJJjT19QUc\nVr\/7c9LYyll+a3ZKe\/\/+mLahIVs7MdGhnZ0d1NbX53BYPXw4TjU39znVo0dfvb74Eb4Yi7EYi\/H\/\njf8AWqv0sRcF1MoAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_taster_toxic_moon-1334259390.swf",
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

log.info("party_pack_taster_toxic_moon.js LOADED");

// generated ok 2012-11-15 13:43:43 by martlume
