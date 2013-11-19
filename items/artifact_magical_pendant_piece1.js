//#include include/takeable.js

var label = "Piece of Magical Pendant";
var version = "1350087120";
var name_single = "Piece of Magical Pendant";
var name_plural = "Pieces of Magical Pendant";
var article = "a";
var description = "One charming, chipped off chunk of a total of three romantically charged necklace pieces.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_magical_pendant_piece1", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1311\/\" glitch=\"item|artifact_magical_pendant\">Magical Pendant<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-24,"w":48,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADbUlEQVR42u1XS2sTURTuP6iCzTTN\nJDMJKNRa0jQxj8ljknQmyUSneWmL1FqxaKlCYy0WBWGoFnQhZGUFN7MoigthFtZFERwQQVyUWbvK\nT5ifcL0nbfoISZxpQ1Zz4CwyuXPud79zznfuDAxYZplllllmWV\/M7z8\/GPFdYMOTNikZcaitDs+n\nYmSVj5PsTc4z2BdQqaDDGw8Oy0yA0EI+m4ZByOGJoQUA2s5DE0QVgIZ9BAY9orFhuypytFLJ0Qs9\nBZZm7BRmQsUb1QEQsHda1uH9RMhe52IObTpDS+W8p62X8nShJNDG2Bd5T03ZLqKdj1n17Ubw8PSl\njNtbEehqMygwU867KSNgGd85qsFui4cmh2qRAKGyoREds46yrBMVs7TSNe67N4y8vZVE01kKiTyl\nQ40BA+moQz4enI875LLgrhsFacSgVLIJEpPg1k+wube7XtO+r6O\/v16gvd0q+v31Ifqz86j+aauo\n\/\/h829spYINJwaP0ujEOMiUfPriRvyTNly+jezNX0NKcFz1bjqCtp9fQtw+z+s8v99H71yW1U70K\nSZfGJ0iUijq0ZldHA0QNWGYCw9I0T1ehPMyCFHn6aM87lbGFlbs+JK2E0eZaFL1cZRD8BsAYPCpl\nL6LTShNukmohQ+vAtpn3hZTzCODaoo96vhxUMDj11ZOoDiA3HkcagOdLo2iuOIrOlDLcUCJH6WYU\nATLR8c\/NNYbaXGUKAPjBrXG0ODOun7WuoKGAUSNrQfShww0FXpod8\/aiU69zlGYEILAdD9p1kKa+\nTCQ4HEgSTKRu60AJoHNB0oI+W\/umEjlngUuQkpB0KlCkx72Yo9VOk6Cd59MuOcOSWpJx6DAGO9Uf\nANuXFbcO+7ZdB6Mmn6bqET+BYOZCQDhFsxPbebvJcMLxmOvIxMGewBh0OEgVzP6OoggdBpp11rwD\nGzBTm97CqgxZwMxqQspVFzlXLc2MSN0O0ThFJe9BEMxsXZUFT60iuFVgADcAAgfBziSc+lRsX7Dh\nRhOatCmNuXuQFdOtbwagyJNsNulU8VzWYTab3tC0gGJwDYCYyW7r4AC44BU2ZFcwE4W+3ZRzSVIq\n5dwIp0xr1bpmd+ErUD0aGDYssj232FWiCinDxYuakgIX1oZY+gmlm0T0\/ZvjuFtfYpZZZplllv3X\n\/gGiJocSUIxkIwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_magical_pendant_piece1-1348198033.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_magical_pendant_piece1.js LOADED");

// generated ok 2012-10-12 17:12:00 by martlume
