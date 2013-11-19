//#include include/takeable.js

var label = "Green-Orange Hexagon Key";
var version = "1337965213";
var name_single = "Green-Orange Hexagon Key";
var name_plural = "Green-Orange Hexagon Key";
var article = "a";
var description = "This key's greenness and orangeosity is matched only by its hexagonaliciousness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_12", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "12"	// defined by door_key_base (overridden by door_key_12)
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
		'position': {"x":-18,"y":-17,"w":36,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEXElEQVR42u2WW0xTdxzHed8DT3tY\nZuRhapaxafZ\/YMkSV+cALxNZspuoCctgjm1soDC5DOlQkVaBAkOgQm9cBGoLpVBc7eVAoR200HIt\nyu2QOS+oo2Dl4nz47rRHQsz2JMJYcr7J5+GXtCef\/H7\/3\/+cgAAuXLhw4cJlzaJoskRml9VRx8+V\n8DaUmPvOIs\/YM04VVukQky7CsfR8CMpVVLXOGvSfipmck0H20bsyq\/s2smVqvJ15DIfS3kJ57B4k\nZ+Wj7IoRrd03RBMzCFxXMbHSEKg2OPhGx6hH2zGIqFIBXrqwH5vEUdhZFQdPxhsY+2ELqrPiIdG0\no3dyxnP93lLCusgVSlXRlRrK0943iVy9FpsLDuNl8WfYXhcP0nACRJMEp+QA5op58PC3Yjj9XbQo\na2EfnYZz\/D5tG6DX9nzKG4ywTNDYJU9CYEEEgmvi\/FJElwqizwAxnkKH6mN4a8LglYZiThSCmZTN\ncBfEYcA9ic6+SWpNBS83t+P4tQoEFX8KUhvPyunTQdp+BrGeBfktB8XmrzGv3YNHynB4FWF4eHE3\nI\/kaRijd+glurYgGUSeCXE0Dac8C6RaAuPJABgqg7o7BIrUfC617WUmmk54zwRhpW09B2ZcgTcn+\nkRLbOZD+fJDRiyC0GINDR7DkOOCX9HXSWx2GWWEwrlt0MPWMe6r0fdSLRtLsaHx9R8i2FcHKWJDm\nkyBmZrR2IYi7CGSqHO\/drcCTqUg8HozAovVpF+vCMZf7pl\/QPvIHJqbnn+Hmnwu4NbO4KnzPuKRQ\n2v8pSC0L\/gLyewUSp4V4cvMjPB4+iEUbI3iVEaxnBPNYwV9tQyi5rFsT4pL49IqgIgZE+yOIKROk\nK4c5eyKQsVJUjifir5GDWHIyI7Ywgi2MYE04Zs+zI9Zbh+hUYTn\/ecgUyeEjI09Gp18oly3XPlIF\nYioi6iveiqDkC2ZJTrAbbDkD4hD6JW29R7HU\/SErp9+HeTWzJPJQzGYzgu2rW5K4VCFYBNQ3aed5\nK7Uf\/sqSGKUIKvkcpP57touGDFaS6eQ9A3P2DPuwoNuL+YZw\/4J4yz6A56ctqxYsVGjgo0CuoYoq\ntbzlmqWJFSyt1tKd\/TSSr1Xi1bIoBNd+y0r6OsmM+5EqnKXu6R1Y9A5uZ4egt0kC18QDdPTRsucV\nlKqN8CFRGSlpg5m3XPuQqU2soFisDJSpDXwN5YSmqx+H5KfwiuwItl9J8F87Xkmon4dlu5ixboM5\nNxZ6iwPuOwse1\/iD6NVccTpzF3y0mLqoVrOdt1z7obr5z\/xYbXIGGR03GikXDaFKi\/dFh7FJcpR5\nte2G53QwOtJ2Ir+oBCrKhb6p2RfyRVPd0hldpbPyFTprpK+uarYl+Go\/zR07\/vVP9rH7vOFb87RU\nY8EnOdnQJxKc\/C4WKbkyyJssrlb72Mb4eDX1TvCljW2ehLOlSDxd7BFcUiUEbLQoDT2BOeJ6fopA\nHBjAhQsXLly4\/C\/zNy2aTp8niu1OAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_12-1334258203.swf",
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

log.info("door_key_12.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
