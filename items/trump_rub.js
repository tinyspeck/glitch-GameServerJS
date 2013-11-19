//#include include/food.js, include/takeable.js

var label = "Trump Rub";
var version = "1354649377";
var name_single = "Trump Rub";
var name_plural = "Trump Rub";
var article = "a";
var description = "So called because it trumps all the other rubs in expense, flavour, and the ability to be extremely annoying (if you get it in your eye).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 128;
var input_for = [38,344,347];
var parent_classes = ["trump_rub", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.1"	// defined by food (overridden by trump_rub)
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
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
		'position': {"x":-10,"y":-22,"w":20,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK0klEQVR42sWZ+VeTVx7G+x\/0h\/bM\nDxXIQtA6rZUi1Fq1LtNlrK1YxbGrWitSFbVKlSVg2EH2LQIJkEAgCCaEBIgJBBKChEBkFZUdK1IX\nVKqeM3PmzPLMvZfCcaEVPLaTc56TmNz3vp\/7XZ57X3zhhV9eV4wrU68YV5mvmVaY7zZ7me80v6X5\nZ6eHCBfcp9TrvhM9b66Z1gt\/9KtLtc7crV6P2XRBsxZD+tVM4\/Xv4IZlBW5Zl+NBqyfTv7venPxv\nj7t5WuhxT2WL6nH3ZgsaXvbi7wo4V822kDvn3mKL+LtjGQhw5zMv4Pzpteb2srV4Fhlzl0O0j8Mk\ni3odneqN6K3+Apdr\/dDfcAT95qMYsATgknEPkS+uWr\/GiMkb442bcN2yGjcty3Hf7onJZq\/OhnyB\nOSdswdInAG3Fq80txe\/iWSSL8cJen5dn1GcJRn+jEP3WMAw0iTB4LhKDzVEYssVgqCUew\/YEjLQm\nYaQtFaOOdFw5n4kr7WJcbjjOrj\/u+9qHTwBaZCvNjbKVeKrkq9Fc8iHs5Vvh0HyNLv0BdBsOImSv\nG5vc\/4tXcMF0HL31QbjYEIJL5jBcsohwuTECfdZo9J+LRX9zPAZsieS3UHTq96FVtQ3WwrVs\/gOf\n\/Qm+215+sglrc98erZOswOMySVfBLH8f1uJNaC7\/HPaKXWjV7EZbpS8cWj84dPtwvuoAbBV+kMSs\nhzrHB52GH9BlDER3XTB6TEL01IfhQoMI7TWHYVfvQKPiY8x2LyqhrzP2bn1p5xOANeLloNJnr4JB\nsg51+X9Fg+JTWEq2oVG5HdbSL9BU9hXRDpw7swvNqt2wqX3RQsDslfth1\/qjVXcQbVXfw1F9lLwf\nIWO+hbl4K4zSv2B6\/qcpeI8TzYToCUBNmif0kg9xVroBhvyNMBZsQq3MG3XyLagr9IFJsR31xZ+j\noeRLmEt3wHJ6JxrLdsNavgdNKj\/22VT0N3a9Nmsl6HzPoqBvfwWwPMkLleL3oD31AXQ5G1CVuxHV\nkk2okXpDn78FZwt8YJBvh7Hwc9QWfcn+TcdoMteBXluW6PFcFEJTPBtgcfwylKetgyr9PagzP0BF\n1gZoTm1EZfYn0OZ4o0K8AWfS1qM0cQUUse6\/m6IP8mcHlEV7oCRxDZRJa6FMXofihNUoin8b9Pv8\niCV\/mCL2c2cHzA1bapaGLzPnhC4xZwtfw\/9LJ\/w48N36kuypO8vY2Njk6HAfOu01TG2NZahVxzLV\nKENQkr6dSRq9FunHX31uYoA+L5ufCnjt2jXcuXMHDx48+FVNTk7OaGJiAleGe3Gxw4Se80bY6gtR\nVxEPw5lYlIp3ozB5G1N6kAcSjyz8VUXs4z0d8KeffuJQwJ9\/\/vk3Aeere\/fu4fbt27h16xbIPWCu\nUyNCuI8pNerrezH+AlHoXq5oVqN++HX9+vU1FPB5QE1H98aNGxgfHwedd1pmsxnh4eFMhYWFDXM+\nepGLdxLIOQFM3BzDQGsh2filGOpQzxo1Cvg4HJVOp5sBzMvLq5ozIJlMRNMwF8Af++0YtOdhrFOC\nAfJ+daAFY4N23CbgD4+7f\/8+q2ma2mlAuVw+A1heXq6cFyBd9dPgKMRwtxaj5\/Mw3iXF1XYp+lry\nMdiaj+Eew8w4Wst0wY9HMTc3dwawpqYmcT4pNtPaeRxobKgdI106XOnRsShdthGQVilGrCG4ZtmJ\nwbNfkYPGdmhS18OqSwAtk8fT+rCm4agUCsU38wKktfM44LXhDnJsisYAOSXXyz7D6bh3oIpwgT7B\nGWcTXaCO5KA0ggdNDAf6nM1ob6kiHlqNzhbdE3AjIyOPAJpMps1zBqQmPXtDjKM6631Y0p3gkLqg\nKdMZslABEg+\/hvxgAapOcslvzqiM5aIy2gXSEFecieJDGe6KvkuORwAdDscjgOS7pfOpwSfgxq9c\nQL89nxzPpfjxnJA8S2zBZdUa5AYuRHbgIihCedDFcVgkS07wiQRQiFyRF+TKgDVxfHTZq2a1GKo5\nw929e\/fFaYu5c\/MqxroKSeEX4EJTPkYcUvIMQQAJ5FinFBeq90MS+RHKoxazNFsyObik4KNFTNId\nPRU9GllTihOMyVxYNVGzWkxmZubcAfs76z\/qayvBxPhlDPY24HIzbYQ8BtjTVIA2fRy0GZthSF8K\nYxIHOccW4XQEiVKUE9qkHHTLuDAlOaMolM8ieerYQijC+VCQiD6cZqVSOQOYnZ39rzkDVud4Z3RX\n7sCP7RISuTzolUJoc\/dAEv0pko54IvOHxcgPcmONoIt1YrVWSGpNHiLAqQABZMFcSALdUJXAYfVI\nQQuCXVF0wg1n0reQ4\/9m8gz9KXLEGTOA6enpE3MGrMzeXdxeE0YeDzOhJSflthwXdORzIQ4ix6Fj\nr0Idw0V5JA8VMc44TyLWV8yHNYsDSZCAgdG0Foe5ouakE9qlPPa9IkyAcpJyGtFSEZ99DhMenQEs\nKysbmt8ucn0Mfd0WWAs+QUu2MyqiuKhN4bJ0FYXxWWppXXWQTu4r5cMmdkL8wTegieXjkpKLrgIX\ntpCUAHoA9YD4uIDZjyXNGdUnOZCTBQQG7H+2fZgCUpOmddLVWAJz2gKoIrnQnuRBGzNV9FVxPKij\nXEhkpjyP1mGcvwcbe7GIx6JKUywJWoSsgMWIPPAGSzW1Ie3JpbA31T\/SwcXFxao5A5K9UkJPHh2m\nFHTLucQ6uJAKPViaqJ9lBSxErL87YkjEaCR08a7st5hDb7Jaq0tawKInD+GhOp6kNEKApMOvsrEV\n0ST9IgHzwKAAX5LmQAao1WrD5gNoo9FTpfuQdHCZGdObUQjqa\/H+r0Me6so8Tx3FQ0k4j0U19eif\nWdSmxguQGbCIjcsNdCW16wZZCJ\/NIf7BDVH7luDgjnfw\/TcrERYmnPc2Z6WAttp8nI5fxYramr6A\nNYSNNIwy0g0KoYDUIfG2RGcYU1yYzdAGoWNVMTwSsSUQfeeJsO+WMcM2pS5AXRqP1eMJv2WI2r+U\nAK7E\/q9WIujYIaSlpa2aM+Ale0lHSzYPBtIIRSJ35AXzGYg51Qn9Sh7pQGIjpFmUJ3hsuxtVCUhT\ncFmHVidMRZPuHLROYw+5s87XnXQhOwwfmsJQnDm1F1GH3oX\/tx8j4NA389tF6MugCBytIFFoynJi\ndiIXLmQdqCQNQe1jyv84LO20e6kx23M4KBFxWIdTIEOyM+pSiDJckS90ZdA0wjTVdM6Yw54I\/aX+\ngoKC7s7vD5ltZ9v0igOoySGmmvE2HHkE4BSHdTHdd2uTyOkl3gX1yVOnmIJgHutQWo\/iY4sRfsCD\n7c2qaA4a0zmoTXVF6pElEPp5MZuijSLc6zkTvdjY2PvzAhwaGrL29vYym2mpOIbmLGdm1g6ZF8xV\nGahIeR+txBuHy\/jMUqgF0U6mHUy7tybBhe020hhv0EzoSdqN5DHVfs6AJmMeVBlbERW8izUHBYyL\ni+uYF2BfX993BoPhHxqNBqdLS1CSF4+qsmTiXSYGPXjxPGxSL2bGdO+tzNwMdabPTNc3pL4Ch4Q3\n5aO2avRfbP\/Ng+q8GuThEw0xbG9yLtTYbLabRqMRMpkMqamp7J08P0CrkqPZrGMHT3pTClKTt4vt\ntRctKb95kiZRY3Bisbj2uf0vAH0UpWpqagrV6\/UVarW6heyh18mDzyQV2Q0mpj8\/LIlEMvqwsrKy\nJpOTk\/8THR1dPJf7\/g8nXh3SRL0ZJgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/trump_rub-1353118054.swf",
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

log.info("trump_rub.js LOADED");

// generated ok 2012-12-04 11:29:37 by martlume
