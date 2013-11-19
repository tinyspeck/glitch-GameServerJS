//#include include/takeable.js

var label = "Thread";
var version = "1342643791";
var name_single = "Thread";
var name_plural = "Threads";
var article = "a";
var description = "Thread, spun from Fox tail <a href=\"\/items\/1150\/\" glitch=\"item|fiber\">fibers<\/a>, and essential in the <a href=\"\/items\/1160\/\" glitch=\"item|loomer\">Loomeration<\/a> of <a href=\"\/items\/1143\/\" glitch=\"item|string\">String<\/a>. Easily lost (but easily picked up again), smells faintly of Fox bottom.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 400;
var base_cost = 9;
var input_for = [294,295];
var parent_classes = ["thread", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/1169\/\" glitch=\"item|spindle\">Spindle<\/a>."]);
	return out;
}

var tags = [
	"fiberarts",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-5,"w":20,"h":4},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAABpUlEQVR42u1XXU7CQBjkBhyBI3AE\njuAROEKPwB1aMBFNiJrog2ItpaY\/kKZqMIq6kQqmrdgAxkd7hLVTghKjxCd2E3eSvuw26eT7vpn5\nmssJCAgICPxv2C25ZLUU1dIU97Kz4\/r3zSIXxBxnK5+Sa3TaNTq8a9J4ZJBJYMZ4mJPrGtWCrcnE\ns+oZsVlkl3A+CazyNLToa2Cyq6Kpy0XPriekd5DMIquyfAeiILggzISc3z\/K2vgTiUloSswIYuYe\nb4+TVS1ERXH\/PnbyaydHrg4JPo45++29t5dugcn8wULipzM6Dc0Gdz7n6Erl2ttNK2e63JHL7KSl\n0MjX47XP1Z9amyYEqsfU11ZFGKoXDk75m7uMYJoUPbeRQJkcklMkZGzwoFb4Uy2WAE1OkBhcCAOz\nBlLLttK\/2KfTyNxgbiHY38KB9pkOOMMiwNzzQOTG20vmwf61kXSMGhkP25SpMNDOc2ebfA99LJ9Y\nPLGRsDVfrVqGQkdElRbV7BqbKlrNRdZCBDDgxb\/EnOxJwrxyy6qFEFKBUGzFz74ucZmzAgICAgJ8\n4AMsNFCRszztbgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/thread-1332892796.swf",
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
	"fiberarts",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("thread.js LOADED");

// generated ok 2012-07-18 13:36:31 by martlume
