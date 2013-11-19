//#include include/food.js, include/takeable.js

var label = "Birch Syrup";
var version = "1354648403";
var name_single = "Birch Syrup";
var name_plural = "Birch Syrups";
var article = "a";
var description = "A bottle of sticky birch syrup.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 4;
var input_for = [20,58,85,223];
var parent_classes = ["birch_syrup", "food", "takeable"];
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-35,"w":24,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKS0lEQVR42s2YeVBUVxaHu2omlUoq\nKrKFRaBBFEGBESEQkUU0RnDBBcQAsmOzN6sgsoMIAjZKQ2MjNN3sazc0zWIEF1QSIo6OwUwPkiij\n0RI1UwlqmGj\/5r7H6FRNzT\/TmpBXder2ffe+d797zrnnnNcMxhtcN04HsG8Osc5OXoo9e\/fKwbP3\nr2X8+clfj5x9dvsEB9+fMmDM93V3LOm7e2MpeDSeh8c38\/HwRg4IJCYvxkI+zLKcd8B7YwfEP04U\n4pd7lfj5DpcGvf1FIq73BWDe4R6Pem4e6\/CYfTSeg5lvOXg6WUpr7\/ZIAq51e+POgOuth6OeXvME\nt3vl9MiumVsXizDZy8J48x6MnHTDee5myI44ghdmivJg\/ZePRj0H502DD0d3d98fDn4xnGcIcaQ6\n6vwXo8p7MYShuqiLNcYF\/roXD7\/0kMyfib9wXTghcxuY6HXD1NB2WiZkrrjR6vJivMri0cTAllPU\nnHn1Q34oM4MX9gmas0NoqYrZhtpgrZm+AIZ8ROicOe8HpYbFzKgMc0E\/Lx0DlRloyQqAKFRrRur3\nOwEURDAzT4Y5o688mRYpJxZ1+7VnJPt+LxoM1cmoinBA74k49JUlkDYeDWHaMx3evwPAM3nLD7dG\naj2vZbtAxol6LY3hOjOtexnywSLzgv5kXcvzx61+e9CubDP30xnM6Zo97z1oPeQOWfF+yEpYtLSw\nmb80ejHkp1N1borDF021Bb5\/4cu69b9+2hsqWWkpTdCS9mcuLasO0R0q3roQJ300Fa2pW9FzNBA9\nRYF0y\/VQVdSH6yuocVmK3gORJ0N0WbTe6QuhM5syO\/X7VwGUpJuKxYnMZ13RalMN0cwnpTsW4cTO\nRejK2wNZgc9r4fsb0fep8Y4Y7WnBDgJYaSuv93l3qnon0ewR84K3DneldeOici91BWf7IgxkGD2u\n8VF73JXtjs60zejJ9yTp7T\/SmuyE5gR71AQvQxtr8Z2K7X+4Sz3Xm270kL+DIZekMG+9dUDKLJxt\nC8iiy0mcW6JojjFRSHO2oyeXSN6c9ObvgOww8cc8d9J3R0P0nwiU8Y88jwXPy3apoDlqyQxvG0Pe\nlWr06K2BDfPsMs8UWvhTgBWe6gpx+mY0x1qTbGGAnhxXyHJd0Zvrht48N\/TlzbVUv4fcb2ab45Sv\nOmmtwffWQkvMkhnuFoa8I4k59Or9l+pdlC9qB4pXp\/XnWyg62R9OD3KsMusjjBXi1PWQpLtAmrEB\nPVkbIMuZk96cjejL3Ui3lMiyN6I7zQHilLXoSt+A+ghTCPxVn5S6MeQ9WablVxudi4WhGlcEwWrf\nnCuzi1YKsHa\/9ijl7NK05bPtbO2bopAls+KD9vTC0gxHyDId0Z7qgOo44m\/xlKyDMNGebMARvVlO\n9Lg0w4nMd0RjpAkxsfZ0yacMebnHgr8LQ3QUJ\/e+P1m0iSGvDdY8plwaC9JSVAcaoz7SAq0x+grB\nPlVIDtqiK9UWPWl24EXZ4HjVVgjGgpA\/sAOl571QcyUIvNZdaMxxRm\/Gx+hJ\/xjdqXZoZOljqNji\nWQvb4DHfWwPc3cQn2XrTBRsZ8ppQrXbl0liIDmpDl6Mx2hxN0WZoCjeE5MBqdB+0Ai9mNbiy3Th2\ncRdCW1fDv9YS4UI7VF\/1A3\/UF7wRb4iPk+I1zRrdKWsIoC7qg7UIlAXxX0NUeJK6MUx7On8DQ37S\nT+1rpQK5gAAKgo2IeUyJBs3QHrcSkqSVECeuRE2rHypG9uDUNW9kDX6C7KFNqLkWDsF1f\/C\/2kvG\nvFBxzhODhcRfU8zREWeC1tgVJMusRB3LGJVei1HL0p7OdmbIuT6qU0oFb+F+XYUgUI8kfyPiP8bo\nYC9DV6IJjketQPdkAeq+zAD3gi8EN70hkvug6vpedN8qROUVD3Av7wTn\/A5I6t0hTTaFJGEF2mNN\n0BK9jFQ7BuB\/NgeY6ciQ8\/w1B5TSYEOk3lCNvxYaQvXQFKaP9mgDiOMMkc+xQenFreAPR+GYOBwt\nY4UQ3ywCdygI4vEiNFxLBP8SC0e6dkNyJQX9aRbkOSZ5nkncxAB1IUvoT4MKX7XvD61jyJsOLDun\nlA82RelnVvuqKuqCNNG0XwvtkdoQhGjhcIcDii98itIRVzSNJ9CANefTIL7BwaXpFvTIy+m2TMae\n6x93QCd7CXlel7xHG9T7qn1UwfFS+S5lLeOr3qNWqUqnt2o\/1SeiQHU0hWqgPUITpQT08IAzCoZc\nCORGcC5vAmd4Gz6\/W\/EakgKsH8mhf1PSLdoNcdSHaAvXRGOIBkSBaqgO1HyaZMeQ5275oOmNKp22\neGamKEBN8QqwLFEfOb2OyP98PQrPbkARgSy5+AlKLm1C1ZgfSvuC50xOwChICrZvIAzi6DlA6j0U\nYM6n703FfcT4qqdASe29SkOXa505nQeMFI0h6q8Bs6QOyO1zwuHTzjgy6EKDlp53RsPoWrpP3W\/+\nOhUl0kDwB5PQI4l4DdhIADk7P\/gH24YhP+ajlU1ZSWlA4sR95ANoVhit\/4MoRPM5BXgiXh\/pYntk\ndq9DjswRuf1OtMm7rrrg29sr6D51n9oENS+17WOIGregkwC2EsDyPYt+SnR4Z6Iq0nCihr30KcdP\nW1YRqs9XClREwgw5JCTQGip605f\/Qi3Aj9elF03rXIsMyRxoVo8DHk\/74sUTQ+KHNvR9apyal9xk\nC2GdG9qJD7aEaSJ7y4IprsfCp8JADQUvVO8By5L4obvqXVLI+v\/\/uZil01lFTlutvxrJAqQqYWmQ\nwK2BA40fIaXFjgY41LEWF8c98fJZKQ0o\/9sK+j41Ts1LrLNBJ9cFbRFUJNCAOJ6kTD81Ut0sRoGH\n2vehFgx5yT6d+0pp8PQxGyf+Z6qKGj9ViILUaf+htHiQa4HEehsaILnZFk9nOvDy5zYa8Om9ZeBI\nrZBExuOF1ogVrIG02IHWXgM5wULqBJOczvNW\/WeE7TsTgeYMubTQ+qjSftidaZZxyldNURugRuKX\nOq0FbjoTcWRhCiBBZI1HP3RCMTtAA05\/swp9I2b0OLvaCnmn7NF1wITeHLVJAbEGZZUEx\/em\/MxI\noRBvcu2NDgp1SbNWZVbvU1NQu6dMTUNmG+Jo+xqUd1vj+rgpDff8wVIasPFzK3Ala8BtJZVPlhU9\nn9qckGyS8ukk+3fv+6wgZVaS2fBb+9qjzN0UrfdtrT\/5YgueM3d9sgHaqlbh3Jm1mLxqi28u2ePy\nWScMDTrjjJCqGS3oea\/guJ4LZ9l2f7x7eK\/OfUm+Veoba+5\/Xc3xhpYkeHNEIRpPKJ+iAKjD08zS\npP2Maqk+vQESOyu9VWbzXN\/\/S23M0pGGNHMZdVp\/FbD\/DuANcYYvKZNTfkVpiNLqK6H6on9rTVqw\n+iffVe9MSAtstv1m\/yqURSw9VLGXVCNEyvaoEFk8J17\/bkkxesJTBaUeKqiLMlBEOKncCVu3MOs3\nA+wvWG1ZH7e0pSZMf6AmkjnKC9CZrQzSfS28QB1aKvx1ZqtYBrc4LOP4C5UO7squ9y\/W\/c8z0gCi\n8gAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/birch_syrup-1334210408.swf",
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

log.info("birch_syrup.js LOADED");

// generated ok 2012-12-04 11:13:23 by martlume
