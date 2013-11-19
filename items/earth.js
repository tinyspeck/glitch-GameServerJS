//#include include/takeable.js

var label = "Lump of Earth";
var version = "1345779789";
var name_single = "Lump of Earth";
var name_plural = "Lumps of Earth";
var article = "a";
var description = "Many have tried to sum up the wonder of Earth, with superlatives like \"Earthy\", \"Lumpy\" and \"Eart... oh, that's been said? Brown, then.\" But it's just a lump of earth. For building with.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 3;
var input_for = [190];
var parent_classes = ["earth", "takeable"];
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
	out.push([2, "This can be dug from a <a href=\"\/items\/756\/\" glitch=\"item|dirt_pile\">Dirt Pile<\/a>."]);
	return out;
}

var tags = [
	"basic_resource",
	"earth"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-30,"w":58,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFe0lEQVR42u1Ya1IiSRD2BsZErDwb\nGhB5K09RHg4giIAg4AMVZ3RWHWfW\/eER+ggegSN4BI7AETwCR8itryB7GzSc2I2NWH9QERn0o6ry\nyy8zv2pdWlqMxViMxfh44+jWqn5ogJ1b5fGDA3QMPjbAO2V4cbx6fVcJDP+ohV9+1sL0vRqku70g\nHaad1\/8ruC89r3b8TX3p7Kp0XfLRQz1CX4tr0nIBK2X95vF76yvJT8uN+H9cw\/cVz\/LPamjwbddH\n7ZJKuQ0LNTYdEiBYu9hZpc6WSls+MyVXTbQXsw+rMZsGa6QUrZd1aed5j3ZbDgxuyv7xSdY17myr\nQ7CNhut+Vwr\/GtyPajgqWBr\/XvZLILBezk2Xn72StS8FL51k3QKUjfJBC+3H7dRMKdTectKB+D1M\nO+hUvMc67HFbCVBfXCO444yLWk0xt6eMAPQfg72pBDRs+mM\/JMEwQDi8r4akQzhrJBXK+M0kGKOm\nYBbgYJh3lFGps+2U6xAMB9oXAQoGaS9np2LRSs2M4\/nw0n4t6lvr3tijv661oldrp1W6EsBQZwyO\nrT91CPbAWnrNLBljcGAH80Q6pc2vR8DIAoJAgDWxR6vuIDTgK4Cn95+WQW33ztFGBJh01HdSZt0i\nU4G0wOadTNLtkQCzAYsODvYWqNOcW7\/uipqtxhTaXbfLwMD00baL6j37y7tpPk16li\/ynlGrqNJO\nyKbXDgzRnglAeHaW90gQ3W2Vagm7BIl6wz2M5\/I90nwkfkWzyOdYX5sGBgYxv7vlolzwHRVAt14W\nvCOkD\/RztNgUTsAMridd+zdbcACAsJNpQ8Ah3oEZXgPDPcCBeQZYjdnlO\/yWNmyjN8E97Ece0a39\n6UZoAsgKA5yvpYkTt5QXAEMX4xdgzwyA5lPMe6BBihGhm3ELFaNWqicUKm\/YKO4x0StwfzaCKk4D\nrjNuAHbUy806BDvsiNkrrVvpc9gqnTZTDr1JsAfLDLLAe2Id5jcvhRT1Bbi4TeooAMZdvxXm2Au1\ncVTxhi0hFfmgVdbKSUakSnQzA+NUcyPsiqhZAyUjImV4BtCtTacelNQ8sS9SDObriQnr1baNEj4T\nZdOWCThhMY9Jm\/l0uir520Z24DwjHOF+L6rMODF2KozZg8xwHVaiNj3tAImgD5IOXbiRXgBEIKmQ\nSQdmAPisA4S0nNZdw\/NpKtBtcAz6IQFGgMweWAB7SCVYA0AccQyQDawCLOqrpgN2SJAACB\/z4GCV\nqDIWoj9opGztCchD53WjJE6AtHOmGQCwGLHNHHHGRjkQAAEMADe9swA59TC8B1hOPZjkAObBba6Z\nx+f51WF7Sx2KjD0u3ZR80UbK0Rbn5wgMMosMopFwyq8UI5NsJQEeDAEEChy\/CYMzHH94DoDc5Twf\n19wU2H8\/rgjdtYr0rjzNNIhgaCTq7aW0bmsjDfMswVopp2SqvDHRORiukSI44uaAQ7AEQGxgiQHi\nGvvwRwUziEaEH4DE+1cgMa6KPg3ijM49FgtwDAEI6gdAmBmkkuuOAbDhHTOHe2YI15xqliMug\/KG\nIvUWjQSh3glZpiANnfxQi2jQuo44atCpMNSf0TmcJubqBfdGWQHwlNcsgnLK2kVn81zM4\/oEQA4G\nZPCphY5HCSAIXbBvd90qRBmdWU84ZNSYZNw85lp5hHi+ZfmARZt8nIpPpbRLuyysyW9HfK0Uwgbx\nnZcS98pIMPUsfL6AkJqsQQuDH+tiXY3bo6CftQv0MjtvCud7f6ukXQM+KWQWoHPeiaYZg0p6Pi3j\n2dmOS+ovahAZzPitT8b3+ihErEMuYKNYvpr4i5EPm6IilYNtv3mY9pmfwfx783N+8xN8w8rr9uGm\n1\/y0+K\/DYizGYizG7PgLc1MqZSBZzF4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/earth-1334268751.swf",
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
	"basic_resource",
	"earth"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("earth.js LOADED");

// generated ok 2012-08-23 20:43:09 by martlume
