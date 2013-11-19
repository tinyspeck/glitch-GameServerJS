//#include include/takeable.js

var label = "Aquarius Party Pack Taster";
var version = "1353015802";
var name_single = "Aquarius Party Pack Taster";
var name_plural = "Aquarius Party Pack Taster";
var article = "an";
var description = "Swim, float & drift your way around this quoin-laden party space. And, remember … quoining is always more fun with friends!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_aquarius", "party_pack_aquarius", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "aquarius"	// defined by party_pack
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
		'position': {"x":-30,"y":-35,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALN0lEQVR42u2XaXNb1RnH\/Q36EfgG\n5QVtQmoTJ94Xed9kS94tS7KsXVfrle6VZG3W4n3Da+I4sXHsBNtJSEhycaCEkJUtiRNKphQCnTJN\ngUJZOv33udckhEI7neENL3xmnrnSOUf3\/M7\/Wc5RWtpO22k7baf98prOeu4JrflMpkp\/MlOlPZnZ\nql3LvHnzXubq2rXMxMCmMZYUuDbN81xH1zo3O3+J29q6x+ks5\/pc\/CvChVfuCDduvCccX9sSPME3\nBS5yW+Cj31lkq88fvW30997N7Em894S0WHmlrq+ukRcaNc8JLvrBw8niD+kFOLBwE+\/eeR9DY1dA\ni2Bp+RquXd3CseNXkBo8h+WV1zA8dhYbJ67QnJewfuI6nN41lDeOw+Q9Agu3hED\/CfiSp9DJHEVs\nZB29oycQHzuJvsnTmFg4ByO\/CqP3KNkKjL4VuELH4O9dBB85hLTdGUZhV7oBuUVGdDtWoGePQk+T\npSe7jG7Pc9A4FtGqPoiajgGomUmo7VOI0AKitetH0aBJQqFJQanrR7NuAM2GQRjMUzDZZmCxz2Fo\n4jTs7gW4CNhDwL7AMtnR72wFbt8Cjc+AC66C7zmGAdrQ7MQKkrFxpBWU2ASCxK50PZo1Myguc6Os\nhkOtMoTyal6yqroASiucKK10oKzKiRq5HxrDCLqMY6iscaCqxo6W9hRU2hHUK1iQV2Cx9UBnCECr\nF2GTCEWGcPjIMpaPLkLXzWFldQn+YL8EvHDkMN659SqMlrAEmEhuYGFmYxuQ5XkhngrAbGMlwMIS\nF+SNYVQ39KCi1o+F1UtQtAQwNT2ElzZXsHlhFUPDKRQU6yBXRnBgfgJ3330ZFdUM2tSDcLrD+PsX\nN\/H2OwL+8skbsDI9BBjGV1\/fxdff\/AF37l5ESxtLIXEUn32+BcYRxudf3MXmy6ceqRhPrmP50Jlt\nwD2ZNkGudKGpzYlm7SwKZE4UFOlRWaGATEaqdiRRWuXB5NQgLl85gdq6VtzeEsD5QyipYHDt+ml8\neP8SVGqG5vahrMIoAdqdQVJigECWoGzh4fFuQ\/qDSXL9NLr0fbj42hl8\/Oc38S\/8CS5PErHUBiYP\nXMDg0CmsHjm\/DZi+zyHUN7rg9HBo0c5RLDqQX2iCzlaOooI2cjkLWYUPyb4obt0+i2cyG9E\/EMfA\nYIJcqcffPr0Br8+HuYPjkvJllWZS5m1YrF5SegivXTqJlo4YWC6OL\/+xBS6QgpmZg9U5j06NF9\/+\n8x7OCxuwOiYRjq0R4CbGx174HpBx8kKV3E1gDEprYsgpZFBWzkCjV6K+pQ0mxxTFpB+JVAR\/fXAV\nKQn0HMKRMLnPiw8+vIir107h9p2XICsz0YaMBPiWZB99fBWhcBjtmiF42Bi++PI2+gfHYLDMwGid\ngpcL4Ztv34PZ7IXF6AfLbyfP+OhjgCUVrBCOBUklhwSYVcBQEuhgdMnQ1NEERWsvCko9FBdh\/PH9\nV7BweJzcxCF9r4LcPkSw56XYFEGbW00olHXj08\/epBDw4\/5Hl1Fbb0WHZoRiMyK5fmZ2AjrTFJpa\nWFy5+iJeOLMKtYrBxPTzGBw\/Qxm9hKV5AcsLL24DZmSzgtXBk\/T+bcA8GxSNGuidxaiWy5FX5EK+\nzI14IoSz5xaxa08d9VmRndeN1y+vw+Gi8SKDlEQzsyPIym0nt78BtcZICbGJsYlBKFvjFJM9EuDU\n9Bg6u0YpOXySyzVaG3QaF3qC4\/DxRyjUjmDlsIDDc6eQjBIg5w8KfDBAMG40dY6RSychp4zUO4ug\n0suQu78Gufk69MZ7JMCn0xshK\/cht6BDcnm9sptKkR9KZaek5q7dMinTFY1aDI\/04dTpJXq3gdS1\nY3xiGCazC83tCXSqHbQ5J7rULBhLBLxnGH7vKHr8Mzjw7POYn95ALDSCtLIqTsjO94CSBfVNfWhv\n9kLVJaeiXYj6xgpk76tGTo4K8gaKR7MFe9IVKCz1SmWmvdNKiutRWu5EXk4t9me3SJvJyddQsrhR\nXsVC3mSFg9fA3WOgZBlEa+ew5HKrqQ+BqBkeRwJedxw+1yCiwWkMJRcwM7aKg5NrCPmHkabqCjwY\nHAlBdHN5TQiKGhuaSJUuWyE0lgJkZVYhmwBzCqkMNTjRVGtBZbEZJSV2FJX6KHY5yEpskBUqqcS4\nUFkbIsUiqK6Pok4Rg9ZMSvm7MH7gMFITYXSZA1TQE+RKB4IJFUIpNTjeS6D9mBtbw4GJdUwMLEqQ\nAV\/\/9bTich42RwCtKi\/251glQJW2TgJs01agILcOBaRISakDpoomxPIzkMzNQCiHnqpueskEigrV\nKM5X0BwLuTsIb\/A5zB55FY1tfVR6QpTFHJ2tFGf9dMK4qaBreuELd4CPquBy+DF36DzF4BTmnz2B\nA+NrSEWmMDWyAp5NCGniaeH2Buic9COLABsIsLW9GRpjKbqYPLS0dEJZSzEpq8JQ7m5MZf36B8YX\nFKEup4Y2Iqe62UqlxonR2bNYWrsKvW2S4tgKb68CXFwJPtGETq0KykYDiWIGG1CTihocXLqAaPQg\nqbeBmZFjiPhHMDm0DK8zJqTty+WxN5tFPh1xooL1VVY0t7RCbaIk0VVDQXDOwjwMZD+F6ewnfwQo\n9jFZmSjLLocypwRtOcUwlioQVihhKJBBUWWAursLnkgj2EgT2FAHdFo7PMEm+CLNcLitsBpisJl6\nMUsunhpeRYgbwkT\/ElhnVJBcrO7m0dDM0jHnQdgcBFNdCl6egYDiaXC1+7CgbnoEtBllcW1uFC+y\nRtx7+TzuX38dbx2dx4a5TXqKY+Kczz76QBpbMnXC5GqAK9gIb6wBBoMDOnUAek0QVhsDd6ANLh+5\nXh\/F9MhxjBNYkB3AYHweLlsPuZhuLuOTYYSjQdQ2JnBI24HNmBdiExcTF\/7q80+lxQ+WpEuLigCL\n9QXSmPhdBN964TgWTWo0ZBUjnr1L6hdtPeJHt0EPm6eNVJSDjdXDwpik7+6eBrog6GDo6oHDHCe3\nrmI4cRi8O4WQbxhOMwHuzfEiI8uNhiYPXRJccDuGEZUrJcAe+W5cHI5JoGIToURlxD4R6nHA+zcu\n4\/eH5qQ5i4xR2pQ0ZnPCbuuDrpNiPVwLt18DmzEGO7nUTlDuQAvC3Dgi\/AQGYvNIhmbgtIRgM1Dy\nmnghrazah6x8F36XydAlgV5mSDwCHJT9Bp\/cvSUBPnyKAOLnxwFHsp6UFBZtmXXjmN0g9YthsM5o\n4fbQZYQnVwaVEiDvGoKfHUE0PEsxqaIC3UtxN0aQ44gSKGOk61+3D1Y9R4BUTMUa6GI5AnT8AFCE\n+OTdW\/CUFeIQ00WAY5J6Iog4JrpcDAeWxsdULVgmkCWeQ6JOjkNmPXitBwG1HSzTR9ZPQR+DM1QN\nljbBUWFOphbRQ0BBgg2Kp4hvVFKTMfXA2MXC1O0V0jL2u6RzWEUvyyvYBnRreEy6g\/C36OFrs0l9\nocoKDOb+9kdZ7CvJBtOsg8NExdf80JJwW1OPzGMTbRvS5dWDdYXgcw6Acw5KavLuIQQeQn5nPmeK\nkoTKjHjE7ctlEIr6CdAuwfyUMQY68Ktr0J+fLoH2konKMk0EZ0xIgN9DJiVzWf4TtO+Rml7HAHyi\niaCkpt9NZzGdx4+rGeLGhbQ9zzCZe\/ZaHlRQvcvLt\/1XwEegKg+paoVby8NCZidwEdBujP8E6P9W\n08v0P\/A6+gWvs1\/gnAMCqXmM1OQIkmyMC3pGm6W\/nk895fjVrgzjsdz\/A\/CRmuLTmHjA6OOCZMa4\nYDcmKD+SnN20bQ5zwugypzIfmsOSfPJn\/SEvLrY3Swt8Z4whYWT0qcyH5uj+mQvstJ2203baL6\/9\nG7YMgQPRal+uAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/party_pack_taster_aquarius-1348171337.swf",
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

log.info("party_pack_taster_aquarius.js LOADED");

// generated ok 2012-11-15 13:43:22 by martlume
