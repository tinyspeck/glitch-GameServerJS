//#include include/food.js, include/takeable.js

var label = "Vegmageddon";
var version = "1354649389";
var name_single = "Vegmageddon";
var name_plural = "Vegmageddons";
var article = "a";
var description = "No rich urth-born root or brave brassica can survive the searing heat of a Pugilist Grill. It is a slow, vicious end for them. But justified, they say, in the name of 'Healthy Living'.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 90;
var input_for = [26,40,347,349];
var parent_classes = ["vegmageddon", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-35,"w":28,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHjklEQVR42rWY+VNTVxTH\/Q9sp+0I\nQiEJJAFCCIHEbEBIgkBQQFCCgKxhkV0UCMiuBCrFqgVXahG3alullbG20pof2hl1Oi1tf7DTTpeZ\ndqbtTNf\/4PSdE9\/jIQnJw5aZ74S8ebnv88753nPuvRs2rPH32Zlszxdn7UHryxm758F0lueTE1sF\nabpVc2yD0L9Lri2qe5M2uD+VGbSYh8H7L1lgYdQM7x5OgzcHU0jX+k0w5zL41PlOHdTYJX8LBrzY\nazDzAfHh+B21OGGFt4dSSdcHUuBSr3GVZg7o4EzHFjjRnAyvNCbBaHUCjFQq4WCpYpVq7VGwjgga\n2u+Mp3NQgfTBEQvcHksn3WIiyL6AL10+aCT4qVYNuGtUUGYTQUuBTCUIcKZDl49v\/jRyO1V+dZiJ\n6MCeeKjLiYbi9EgotoSpBEeRCf\/fR+oS4WlBx2sTCWqk0gt1oCgWmvKky3CMiizhZkFwr3Xp2jFV\nmDK+9\/yl751DaVyK+cLrvu5HnyIoC+hIj5wX5sEeg0fIDBYihD7LeJCFeyyPIMArfab\/BRAzgNHD\nVD8V4M2RVA7w+pgZZg+lrqmFCUtAOLQIW4ZwkiAYzuASyzpSzAfsbFbA3W7xmrq4TwITTcsaaJDA\nSJuCE47hakniAE\/v01L9q86WQJcjFmqzJUPrBnQ1xcLvxw3w151RTotHnaSbh0qhr9gA4yVquNtn\nhT+vOlfpj\/OF9BL1dSoO8MZwKnTsjIGWHbLHBTtOGOCN4bQlFrCkIgr+mLbCPw+vko50OiFOKwOF\nnpFRDrpiNehK1SBXREF7RSF3Hyt8IQRsbUjkAO8yhX2wPJ6ity5ALAUsIKaMBXx4fRK0KUqwH0+H\ngrmsFbIeMkJUpMgv4Gi7ZgXgZIOaa3e9JXHzTw2IkYtRRUPuaRsHtf2MDXKmLZB7LgOsQ0ZI0SSu\nE1DhWRcgzmAW0J5mAF2VGjIn02DrRCrY3KYVsgwaQCoVw6nB5v8XEFcyLCCWEAREs\/987zx5DL2H\nIOg5c48OVFvjQFeRCKZmDSQXKsG5yx4Q8D2my6wb8HKvvpKZxasA8WGPFk5SqhEUwVAOu4Wii\/5T\nxcaQTwMBYsHmA6IEtDnjEPZRBDw5aKLBWcAPXx8FlVQERXoR9BdIIFkWQYBPQvkCHGhM8gvYVhQD\nQlJ8jAXs2a9dBYhwvx8Wwzc9ETDj2ESQT\/rOF2B3rconYE6mGETaEBC0UMDFaiDA+23hMFUYQmlF\nf\/qC++3jOXh0qZPGaKtbCdjJ1EGZLhQyUl6A\/uznIFT9TGRQgI1Vco96ZxTEFkaT+IAYqYM5XsDb\ntaFQpg+nSYG+ZL2I\/kTgHxbPUeq\/nO2gMfQOGWSVxZK2VcSBLSMMurKeg4ntXmkNzwe3JrzlDPF8\n3xdJEDhB+IAIMl7gBcT0KiSRVPukcglYe4xg7TNBYrbC+12vgXsX3PDpVbc3gqURyyoO58A45T4T\nJGBtGPABv+oXw183O1cAov+cKWGUXnNKMhXp7GNmrj7aT6RTG2wuyydIBFxwhnK6Vr5pFaA97YX2\noABxgG96IzhA\/ESj8wHRfzg5sLNsO26lToJgWUfTqJDj\/3kzGRTN6sJsGmMtwIaM50GkCQncjxfr\nn92IA3zUuBl+HRH5BXTnhVPd0+QnENy2U1aKHrY\/\/N82ttxhsKA\/CXijKoSDQx9q9KHBrQlvVYeY\n2UEetIf7BbQpXwRjkgo0RSpvWse8EcuZslBHwW6DXUWZFkNe\/M0tXwGIYuGSTZuhbKsYAQNv4O1F\nIvM2hxh2FYvIzPaS1YA7tJGglMtgu8UExrpk8hvBpMYSELZBjC7eM9yyh2byT5MmmKvavAJwtjIU\nDOYwaN8Vwy39AwKOtWrNr\/YauKV8JlMOWEAsGz31xfTw7loHeQthYpOkEB3thUKxgI4cb4dhAQ9U\niwFfnpU680Vw5ktp4Ro04JzLmM92EdSOmngCXLo6TA+aHeugyODMRCHoRJeThNcRDNOLn3iND1hX\nHgUNJXHU8k72GWEXsxfBZT92E9ybBAXI78Mo3E8gIPugtXRyoImLIEYVv\/MBGxnAo3uTuOUWGzWM\n4N5cqXBA3L\/27I0JGhCFgPHpclDaYsgC7PXvpvKhmgE8Uq+Gs\/u30CkYf9tZniEOHpA9RcA3ZQG\/\nPeUgfX2mnFoXamnOtQoQodCPOHP5EcTfYkUYcybCiRYN3Habn9wXBw+IcFcOept6U72SIPfVyMhD\n\/K3lzQPL287PRxIojf70y3gC\/WaoQgmvNCXDW4Mp6wU0eHCx6u\/MD1PUVxYPrt0KMjyrytI4KH4s\n+w6pX\/XtiSdAPILjz15BgGz0\/gtdcBlguk1LUHzhy7KnC4IAz3VsWRIKgQeR+FD8xINJVux1f8I1\nJx578E64lgICthTIl2a79TTTfMGc79JzwnvQ8L4e\/jJTToYrE6B7dxy0FsihMU+2Qu1MeucZKx2u\nSuABRlQGBGzIjcpvzpfBQLmSDh7XigAK7xl1qkjor06HbyBfwvPBN\/pNVKxLraLgN+4N22WqvXmy\nIV9iBp1niqpnLTGAP+5nHh6MmC7yo7tGNe8qkmz0xfIvjIiNMQbtzhkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/vegmageddon-1353118122.swf",
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
	"newfood",
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

log.info("vegmageddon.js LOADED");

// generated ok 2012-12-04 11:29:49 by martlume
