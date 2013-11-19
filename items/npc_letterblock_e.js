//#include include/takeable.js

var label = "Letter Block E";
var version = "1337965213";
var name_single = "Letter Block E";
var name_plural = "Letter Block E";
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
var parent_classes = ["npc_letterblock_e", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEL0lEQVR42u1XXVMbZRjtnRf+BC\/8\nGf4Ar7yqVp3OSFsqVgpFrdKqU52hMtBC+Shks2w2X5uvze7mm3xukyxJgApFoFMLlFAEBm216tQp\nhYq2nR5330g6GZnxJqs3e2bOJPvOO\/OcOc9znmwOHDBgwIABAwb+N3ziSb7UHUi8yUSjjWf4LOGX\nQqbREY\/uy2KRb4xmA40dYubwaS79St0FvUZlXmhmo22t9rh4zhvb4JJhFCZUlgIoTYQI86UQorkg\nRvMhxJVwlXIxDOVrGUOxNJooYfetCyzqLrDBJE0foSS8T3lw0uyusonyQTv\/N7awAbQwQZwzU7D5\n6PoL1Iow3CAWcz1YLQ1gfeJyDdfGB7GU68WS0ofrY1SV84oJuSSFVouAw30uKPFh0D6LPgITQje2\nFp14tOLF7maK8NlPGeCeXKX2\/PRuGlurEdxfcOHphkBoiYo4OsjheolFU78OAr\/geMhSFx4ucWDU\nYu+NSIR7LWzngviYixC22YL4wCYiGjZjp+zG7m0vmIifOLh41Y5DXUz9BR6jRKTEbjxSC96Y9qCT\nF2tm7FPWhXbaijazE0fVu5+7JPS4HPhxzvq3g5UW35y06SPwxIhIWvxsUwS+l5AtSThmrojTPouR\ni+QcP4Sx8W3FXUZ0YHV8iAhkYyIROF9g8U6PTg5qAreXXeoMulEs1qb3WrIXW2UfhqMRzOYolL9x\nYyrdh3tzTE2LZ\/IMzo7osGZa1BRqAn+7aceDRQdSWU+NwLGChIgSw7u0BClsIcJ+X\/GQkdBoCfP4\nkHZgKkuj323VL8VaMa3NM9PPxTVbtD33\/Nnks2FzisKO5rZ6\/8\/vfBBSPE6rAjUHv7Lp4OBxc6XF\nj9d4UlAp8jUODrht6PU4yXeWZ3B3hiZ396gJJDNYZPHZiI57UGvbH6tepJTaFMvBXvxyS8Bxs4CY\nt4PMaXkhiTs3\/Hiy7oc9VknxdMGOdrOOArWB31UFphWBJLXNKpG5SwT7STu3b3G4c82M+alKiIQA\njYfqWTzLo4VyQpbtOHmZ1U+gluLtFR5nnbUOJrIiFhZyKC\/nIV9N4ZJUOffzA\/hZDcxUyYUupw3B\nURtODOiwZproygxqbvSL\/ur+qy5q7p8vCK0Mj\/HQeXUP+pHJe0iLs3EKfIDWy8ELpI33l3nMTXJQ\nMjSKORZX8m5kZAfiKRv4uBv+hAf9PidC\/EWsTw6ReVQUNxGYjlH4yMTO1l0gF3XjyqgJD8oSHm8E\nCHdu+7G7JqrB8ZKkavO5t\/f2qP12azQFKik+NWz59VA3\/XLdBfbw3lltWXcFRtEdTFQ5EE3BmpEJ\n\/WM5RCYUhAoyIoU0wsUMIiUZ3mwSzYyIty85n7zeSb+qyyt+v9f7YofHf\/CUVThzxBw4vx8bTKKl\ngZJc+7GZEexvdJoOGn+WDBgwYMDAf4e\/AOLpamP6fFGkAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268375202-3447.swf",
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

log.info("npc_letterblock_e.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
