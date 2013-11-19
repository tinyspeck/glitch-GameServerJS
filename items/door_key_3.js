//#include include/takeable.js

var label = "Orange-Blue Square Key";
var version = "1337965213";
var name_single = "Orange-Blue Square Key";
var name_plural = "Orange-Blue Square Key";
var article = "an";
var description = "Does this orange and blue square key smell funny to you? This probably won't affect its door-opening abilities. Though you might want to wash your hands later.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_3", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "3"	// defined by door_key_base (overridden by door_key_3)
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

function expire(){ // defined by door_key_base
	if (this.isOnGround()){
		this.apiDelete();
	}
	else{
		delete this.pc_can_pickup;
	}
}

// global block from door_key_base
this.is_key = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"key",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-15,"w":36,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADZklEQVR42u2W20uTYRzH+w+67sor\nA7uRBhZI9KLNWVeW5srEygNpdqIDCGVaWaTl8my5dihNKvWtZiSuptPprKbsUCLm0o2wzDRnrRIK\n9u153ne6TS+kdAbxfuHD+O3qw+\/3Ps\/zW7VKiBAhQoQI+b9TqWBD1OyzElbX69L1DsE0NI6BDz+g\n6xtG7eMuFNY04HhBJQrljVA\/6kTL80GYHdMY+vTTZR6e1He9Hg0PqmCpmnXVaTpgsI7A2NWFZ\/eU\naJKXQSm7CFleDvZnFmJjggLbMhqw56QWhy48R3m9Bd3972AZ+QyjzWkJqmCZmkXv4ChGFVlw5a3D\n9KWIAJ6eykZojAehYh9rIj0I2zYDm4MIvnIi6IJjb2yc3JfiKB+l0fhaTqiIxmbpV4jiPRDtIGwn\nxPGSjW3TKyP40WbgusWJXYvixaqi4b6xBe6aLUg7YIFop4eXjOclaSeVmi8rL8jJXSdyN4mcSgz3\nLTGkGXaIpEQskZDAS9Kxr7xgqbdzVI6Iue\/EwK5IgSiJSO0m7PJKUkHJPxCk3ePGquLlvt2XQF1U\nDVEykdrjJ0nGHRrrE6zTWvX+aE1v9Z1W55Jo6Rl4mJB6NDJQsDKa++Zo977dleA7K8GZs1qIUjy8\nZJKvi\/6C1uHxoFB1655joaA8UDD9hHVRwfJaTVBIPZRjChSs8HaQjriejLhBgrRj1kVHfK6iPv+v\nKKuFF8e8GrkypX5rfHLEwkNSTSQVRPB2DCeZdti68JAkLM8hOXL2GiiHc2V6\/5r\/ryR\/4SmWRfFd\npAeFSqrFSDto4cUoUs\/cfbgc10xFXTN4NPrAmvJ4nmCBiL+oS\/jXg7sLZy\/pRK+Y9w6kL0oIs3RB\nFasDRdmk0\/vXFDXb5hN89\/4TJnPDOEnuDb5MKNpAhDfgarac+944JHznqNza2BkY+6eWJKjtNIHS\n2vFS71\/z9ObPbTNN2hewjUzA1liGvqpjMBRnorVgL9jTUlzKIsuCuA3r43qwKcmK2PQ3SMlxwkDE\n6DbTbXM6\/lZQoenep9QY81XNPYx\/TVE8MYbwHVQ9iFOzOhfZB\/GH+yDIPugI+j44G7bdHN5usjMm\n+wQzMDbDtJsdTG2zgbkib2COn6\/mflWkbumxM2aHm7FP\/GL6hqdWCyu\/ECFChAgRsqT8BsqWwoFc\noQK6AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_3-1334257828.swf",
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
	"key",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("door_key_3.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
