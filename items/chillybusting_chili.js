//#include include/food.js, include/takeable.js

var label = "Chilly-Busting Chili";
var version = "1354601202";
var name_single = "Chilly-Busting Chili";
var name_plural = "Chilly-Busting Chilis";
var article = "a";
var description = "A tureen of fiery chilly-busting chili.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 349;
var input_for = [];
var parent_classes = ["chillybusting_chili", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-19,"w":36,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG6klEQVR42u2XWVBURxSGeclzZB1W\nUUHAgCKCIpsiJkoSdNxSiaUWFRMrQXGJiCLKvggoDiibgzAgyCYIFGC5JQMRVFBR3FhccA2oKKhY\nPv45p2GICFiF5smarjp1L3Pv7f76\/8\/pbjQ01E3d1E3d1O3zaL29vbZv3ryRUoRQKG7evKnkaGlp\nEdHa2qpsa2sTcfv2bRF37twRcffuXWV3d7ei\/1sp9\/XJQG\/fvjWljmQPHjxgkPbTp0+juLgY6enp\nSEtLE9eMjAwoFApkZ2cjJycHeXl5KCgoQFFREUpKSlBaWory8nJUVFSgqqoKx48fx\/nz59HU1IT7\n9++3d3Z2KnmMUQHzy\/wRKYIjR44gPj4eMpkMiYmJSEpKQkpKigCURwTiYMIe5K1dDMUqd1QHOiJn\npT4KpNbIWumOXNkuHE6IwdHC\/EGAJ0+eBE9WqVSipqYG9fX1ePz4cTery6J8UDG2juyCXC5HTEwM\n4uLihgJGBaNsqQ3KFpgjeroegqbqYNtkbcS5GyFqhh7k7sbI+8kK4XY6iKXnSV6WKD6wG8UHU4cF\nPHPmDM6ePYtLly6B3AIzDAElxbyfP3+OzMxMREZGIjo6eljA5BB\/pHnPR7i9LvystbDHUQ8prgYo\nWzgRMmd9hE\/TwaZJmthCz7YT9DrLMYiaZYQEeidlljGC3CyQ9MsSHFjugZxQv0GAbH1DQ4Own1mY\nScBx0vIPycnJCA8PHwKY7LsC8mWOyFhshxIvM8hnGyCGlEp0luCYrx0KfjaDn40mIux1IHOSIJWA\nShdMRKbHWMTOkCDZzYiuegK4ZocTclcRsLMRtlprovJw1hDAixcv4sqVK3jx4gWrKWX1uqurqxES\nEjIIcHdIIGQBGxAwRRs7bLVJIQlB6SPSxRCVPjbIW26IaAddhJKVe2ZKBDArGENQDJa+1IJADHBo\n3ngU\/joZgdM14U\/KcrCyG6zGYDOp7Uv3Kf7rBgE2NjaCVgFWsZsVxIkTJwYB7vf5EUWeY3HqBysU\neo1HyYqJCKYBwqbpQuaqj1jKtzBHHWR8Nw7la6yQOE8He2fqicHY4m02WgiiSSW5GgkFA+31EEYT\niHLQxk6aMKsZNEWLVNTCbxPHiIhbMhtZgetxtqZaANJyxQpCADK9CjAuYBM22eqTVfrInmtEA0tE\nzu1zoQr1HEf2mUG50QGpnhLI55liF+VXJCnJgJlzTbDfzRg7HPQQ66SLeCdDUUjBNLEIFwkprkdu\n6OIPmgQD+liMGQBURcHeKAFIa2cfIC2gpXyTuy8OVYvMkTffBIE0+62kwk6q0IPuhsicYyjyjis2\ntL8Q0tzH4ihVssLDBBWLLIXNXDj+9N1+qRkC7DSxcVJfcBpE0HcBk7VEAQXQO8G2pDrlot9XmgNw\nPhRpG1dDWV6CV69eiYrWoJL37urqQs\/TDhxasxCbqYM0KoRisq+AbC71moCa5TaIcJBgvZWmAEwi\nm1PdDJBMV4beTraxgtnfmCLfcwJ2kaI8wQOzTVC60BJxjvoI64dki9dbUlGRqmz17+8pGDDbBm2N\nDXj58iUePXpkq2Fvb\/8FLaKPGJKVbK7IQbjrBKTPMaaOJcjyMBIKRtGgqbMMUfz9BBxbbIkKqYUA\nTCLr2f6sr01QSb+nzzERwFwIDMYWq\/IyZKq2KJJgdsi6r0DeBTwaH46uzn\/ALJSD7QPrYH5+vk9t\nbS1vPyDLxUvH5AkoWT13ADCDImiqLnLnjaV7I6FgBOUmA3Lx7KRBA0gRtjh2ui4ihaXawuK1Fn3F\nI9Kmv0i2cTVb9Cl2OHQLHt5qEWC8g\/WH96DFmvbN+mvXromH\/QulCFa19XQZ\/or0hb+z5ZCkDqQB\neScR9tA10r5v6WGgYLI\/0dVY5F4U\/c4WR7mMR+ba5fi7QDGgFh0ocP36ddTV1eHGjRvgw8eQrY42\ne3NabnoZkNcgTlIG5CvH69evRXCnTTWnUFeUhQpZhLBluKhM+O9ZXWEWWmv\/xHP6lnOLF2Haf8X2\nxlCq4F2E4LqJYfjDQ25u7re8\/TAkl7kKrqenR3TKs3369CmePXsmrvy36v7Jkyeg0wk6OjqGBKfO\nvXv33rVvQDFVMCzDUUg\/eJqho9IyXs25E+54OEAGYQUePnwo3mlvbxc23bp1axDESNHc3Ixz584N\nwKnGG5J3IzU6dUhpsWSpxcwZ7v8EvHz58vu2to9o60iNPjalvbGSDqtiYJWlnwrIQAzGB4SrV6+y\nCDL69suPPllTR+ZUWbW8NzIQA3JefQygSrkLFy6wzYpPAnu\/keUOZIWCIRhqNICcc3xSYTA6SslG\nbedoGs+aK41gZPzPEFf7SIAMRkBKOtbLyE6p+l9PdVM3dVO3z7D9C76WusVhBt5WAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/chillybusting_chili-1334208253.swf",
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
	"food",
	"foodbonus"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("chillybusting_chili.js LOADED");

// generated ok 2012-12-03 22:06:42 by martlume
