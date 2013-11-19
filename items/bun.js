//#include include/food.js, include/takeable.js

var label = "Bun";
var version = "1354598473";
var name_single = "Bun";
var name_plural = "Buns";
var article = "a";
var description = "A nice round bun.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 9;
var input_for = [8,11,12,21,28,29,36,91,96,97,340];
var parent_classes = ["bun", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> or purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-21,"w":30,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIgklEQVR42u2Y+VeTVxrH+Q88\/bED\nkrBomTK41S7a46ijHWlnWjoyWoujqdYVrKJo0WqlBQSkIuAC0rIqHSirIkUoS1gCRCDEQEBkkX1J\ngARh5ufv3Oe+SUgkRDzjOL94z3kOyhvu\/dzv93mee9\/Y2b0ar4btoWvatmiiwsdLU7ojaPje1pT+\nAi\/p47wPpd1ZH0gfZWyQPvp5bVB78pr1\/wewA4v0dfuiJ6u\/gLbiHxgr3YGRe94YvPsJ+vI\/wuPs\nP6MrcyMepa9DW+p7aE18S98S57H+pcFN3z+snKo\/AGuAA8W7MaK4hNHWBHTlexsAV0N1YzmU198M\n+p8A\/bvR12um0TdopsE3heDYT0zV7bcKOFi2H0P159FbcsBMQQGw+bo7GmOWpLwQsOkmP8l0g5\/0\nX01HYIyZRj\/oFadgC9DC4szN6KsKZMCh6Cvei8dFu9Fzdyd6C7bn9975zKs9fa3oucFIrekG315z\nMGNM1e\/HhDJsQYADsnPQqq9hrPowRor\/jqHCT9Ff8DF68z5ET\/YHbAMbuMIPU99LaU9cuTBQstFC\nseZTmOxO56F78B0H0kgl0LVE2gSkHKSNmJ7ZAGxPW4PWpNV6VcIyyXPBUTxRncf4wD0ek42n+YKj\nxdswUsvAH4RaBRxpDGfPQiyf2QDsur0DHb98jJYfV0J5zV0yr63WLJ1R+GNK9S0mGwIwLt2Nsd8+\n4wvRIoOy05iUH7cAHJYegk4VBn3tvgUDanryuQCtyWugjPPQ10Q5LZ9bEPPknCnvqiR8oaFf\/4b+\n239hC2xG589\/xGB9MLSyr0yAE+ormL5\/aA7gaPURjDaEYLD84BzAzpxP0VWwiyv44MYy1EUt7Z1T\nrfPBPZEfFPKu3IcDkAJUAJ0Z63nutPy0Cv0132C0fBdGyiR40hpiFXBMfYOrNNIUYTUH1UlvC4Dx\nHqiPckVNuONsv5xpOpJvDY71O+hkX5ryjvKrN9eTt4+Om+9TYvMJFXEr0C8LwljTBUy1RUHXFoPJ\n1suYUF2CVnkRmoazXMFh6WEMFHo\/E1Bx9fco+96+18xey15n6ndMBfO868v7CN2\/bOKTqpPf4Y2X\nJmuKX43223tMxaRXfccrXFezFxOVEmjrT0CjCIfmUTqG684uCFB6YTGkIfaSeQGNeacp\/XxO3rWn\nb8DD7K3ouCPBQNMVjPdkYvLhdeibz2FSHY3JtmtcebJ4XLoLmjIfjJZsx3DRVlb9X2OYVXlvoY9N\nwMowEUqD7YUTZ7rRL9pW3pEt\/SV70V8ZgCFFDMYf50KnjmHVyiyV+zG19kFX+yWHItW0fXcwWbNH\nUK9852wVs40OFrA0YX1ysCYQXVlbbAKWBdsr+TnLclBv3piprejaYnkuEQhXhYVOGQQdazdGEIKg\njZDSBEPpQIppO1Ixfv8Uz11N2ecm9Z5uMwNVJ\/lRaNXi0MUoOu8Auxm57zEqhmn5Ia7cE3ZDofyh\n\/OMgZNV8IJV7oG34FtrmCGjqvxaqleXraEscxuUnuQP0\/5F7s+rRKdOb48nThSzuk56YA9gY64by\nYAcUnHOEHQOQ6mX7rINUGkCYEmQV5RLlpBFEowgzFcaYOl5QiYEMK69wePrsaMk2\/vvBu17ov\/NX\nrh61qe7MP6Hzn+vRfdeHqehpAVj7gwsHzD0jgt2EdLd+oso2CFnEjzeWR\/y0MIBQ49W0J7FIxFDx\nTqFH5mzBUHOsmXre3NoB9oxfIthz6gRdGaxAWME9vLkW3YUSEyBdx8je8hAH3AoQ6e162I6eBUIL\nUPC7HrOJQEgNWpBbxuag\/kiLt6Sug1Z1WTg92FzcWvZ3XL1cT0N72cjV67j1Pr8rdmR9YgKUXXQ2\nqZfk75xv15zw1jNBqMU8DUI20WKUS6QIWdZBLajwIDSV+\/lmR4q8LQqDW2tUz1C9bSnv0usA2m5t\ngsxgLRVHynEXJB8VS+yqIpytg1DkCDBPg5AClOC0EClBvZHsarzuwW4yEcwNy7ZiWRgb+eeN6hmV\nq43+g6kwko87M\/WchJPktxB7afvNdZaqZG22CUK7pwXouCMVKAhOnc1Spdr3mYVh6n3sNCL1muOX\noSxsCdJPijkcRdpxsZcB0OFY9UUXAWYBILRrsoUmp93Tu0bDFXfIr67ASF3gvIVBm+YnB6nH5uPW\nsrNc9eMKNF7zQFGoGwcja1P8xbMXhdKI1xYxafV1l91sg7DJaLd0eyFLVAkr0HTVHbJLS1EbtRRd\nZQH8RjOnMAxN2agebVhQ720+V3PcMjQwwLzzS43WKufcBctDfhdE\/lezfHyQsNIShO1QlbCc39Oo\nR1EbaIhxY3e2Jaj5wZUBLkFLpjc08sA5hUGXC4u2Qu8frK0YC6OZXTYIjiItwEWo2vkGHczUewi0\n8oIIdZdchYgyBPu3LNIZVFTVrBVUR7qgJtIVilRPjNWfsV4Y87QVckRpBlcS5satTTjw2qL5AZnV\nZcEO+QTII2QxKljDlIY6squPIzu8xagMFzNAJxOkInULOgu\/MJwY22cLw7ytkLUZs4XRyqxVxM\/C\n1ce6I\/WEi3VrrQ0qGspJgqzgkALgLKQTh5RfZYvErYI89k12VG0SzlvqoQb1hPY0Wxjq5HfRFLec\nf948ss+6CpVLPW+hozz0dRG3nIGaQxIYWStjRVF7+Q2LUNxYCXXaWv7i08JgVMzG5oRVXKW6aLc5\nn69mxZXD4ISqdZK+kG8aqiKdj1Fh\/LdREe6CjEBnU9XazL3nHZXhjtFCHj5\/VLAUyT\/nxHJO6Hes\naqNfKJxx5J0RS3K\/EelLg0Wm\/LQVxd+LkHNGzMGS\/Z31Kf7OKUlHrLz7vsiR6Pe6iBZKOyHWZwWK\n+e3DPLJPi3AzwEk49DmUkzTxqPgY\/d1L\/zLzp6NiLzqeng6qzOSvxC\/\/29VXw2z8B5JdsUHua3Ux\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bun-1334339998.swf",
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
	"food"
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

log.info("bun.js LOADED");

// generated ok 2012-12-03 21:21:13 by martlume
