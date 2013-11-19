//#include include/takeable.js

var label = "Letter Block B";
var version = "1337965213";
var name_single = "Letter Block B";
var name_plural = "Letter Block B";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_letterblock_b", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"letterblock",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-70,"y":-116,"w":137,"h":133},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD50lEQVR42u2XXW\/TVhzGuduH2MU+\nxD7CrnbFxjZxUWhHBS3dNGlrtUGhFFUNY+1CIY5jJ3HeX2znvXHapE3SJM1Ku1HIxhq6FggZiF1V\nQh2hdKOoz+wTJcIq227i7caP9Mj2ka3z8\/\/F5\/jQIV26dOnSpet\/0xfe1JuGkPQBE4\/3DAXmic\/z\n6R5HMn7ApniyR7lPOR8V0keHPDNvdxzoXSr9Rp81\/ukAlxSGfYm6KxVFoRxFviigVI4Q50oRxLNh\nTOciSOajbWeKUSyvZsBKM+g1BxsfGthGxwG7TOLKMUrEKcqLfrOn7V7KD2X83zxgDeE0E8awmYLd\nT6PjgMokTp5BNXsZ90pGPChPqXxfHqvOX8ad\/CQqC1Tbt\/IUsikKAyyPo5NuFKRrMLoZbQAl3oDf\nq048+8WNxoYPz2sR7D+eBh7H2t5\/KOJlnT9gNi7g+BUXKiUrjoxrADjm9SMjjqOx7sbWmgeu2QRs\n6QzEYhaxcp5Yur6Axcoi6rUl7DzK4vmmF7t3fcRMLEgiWF3itAHspgTMCAbsbHiw9r0XJ+i\/r7fP\nORF20YnfbnKvRJDXFvCkRSAp3n8oAI9E5BfVUCHeiBGn+xVIHpU5YxvQmhAI4O2yXbsIKoANuf52\nNj2oLPtUgLOhbyClXaqxPD9yIMW3ClYMXGU7D3ha7kIF8MnPHLarDtxc8uCcV2ynupRmIcwK6DY3\nU3yG5ZD3f0lKQjEbDeAz2kEAv\/XYtOtipfD36kGsV0QC0wI864uR61b0pMgVbJSuErg\/7\/vBz8iA\nZgd+yDHaAH5sbqb4RS1AJswXA6p0nqIDOC6XQeu6zxJEbvqa\/DnykmcUwFaKv7Kw2kWwFZHSd4IK\nMClOQJIY1dgFhxu16xbsPQiCSzS7eKXAYdDMapvi3Xs+pPNBdZOEJ7C5Ylcvb0wAy4lx8kLJ+QC6\njQ5kMhz6p6zaASpd\/Ic8oSmsBsymHbhxI07Oz7ibY8N2N8qh8+SllhfdGLTYEE1yODGpwWeml27W\n4NN1FxaK\/7xBUACVTYSfGyFr9Eu5qXILXpLiXMqMUFSztfgSqcFffwqAifhwkaVxwUIRn7PQGKRt\nxKMWE8KOs1ib+5pET3lmLtcEnJNonDQyqx0HdMXlSaZN2N4Q8aIeIn52N4jdmiBD+Ejqn9zmsPWj\njXh7zUHAGnLEn95xwRRqdrGc3q0jBvqtjgNe8vtX+1kBo3wChrDU9lQiRTYNirlM8xgpZBArzCJa\nTCNWysA3n0KvvFR+NOHce2+MfkeTLb6yox71Bg9\/YuOHjplDF1\/nLpPAdlGi+3XuY3ju\/THTYf1n\nSZcuXbp0\/Xf6CyWtYCIuPDltAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268375121-1784.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: true,
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
	"letterblock",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("npc_letterblock_b.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
