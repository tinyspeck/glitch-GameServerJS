//#include include/food.js, include/takeable.js

var label = "Waffle";
var version = "1354593804";
var name_single = "Waffle";
var name_plural = "Waffles";
var article = "a";
var description = "Fluffy waffles with extra-deep waffle-holes.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 185;
var input_for = [];
var parent_classes = ["waffles", "food", "takeable"];
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
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-19,"w":38,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFC0lEQVR42u2Xb1NUZRjG9xvwEXxl\npiHI\/pH\/4u6qNU1F02jgKz6CH4EXNf0vSnM0UmlcFhFFNFkiNdZEIEvdzazGDBZBSoraZV2ml0\/n\n98B9eM6ZNaFEa9pn5h4559znfq7nuq77PqvHU1iFVVj\/86XObinKxEJtmd5w3Ixsb7jpkQObjYWa\nZ05tTt84XK6SrV51\/q116tzrj6uRPSXqZqRCAfRuX7DuoYObjYV3AexWZ7WaORVUX3\/oVdcP+ey4\ncXijmuyqUdcO+BU5md5Q6qEwChuWnAkY63\/lMRV7abVmjetfTm5WYx2VaryzSn3XFlADb65VF98t\nVhfeeUINvLFW3wMorP8RC61aEZ\/dOVGnBluK1eV9pTZbydYydf7tdWo0WqkysbCOhHXPZPTaAa8G\nq2UnpzeUpl7udLD0Acg57zOkIn6IlDs2v2ldIycAkZS4faxWTffUqe8\/Cuicb9v8+vlXezfoAxL8\nzYH\/tk+1nJYkgBLz6wbYXaKmjtdqYD93b9Kgh99br77cW6KZ5V\/yru73qt9PhzRQ5D\/z6hr9zMH8\ngj3mmQ8lsrFg\/X2B4Q\/rhR5eurKvTH2xZ72DMUAkPvDqojTINwd9jucSV\/ZvsCUnOAzNY+bwLrID\ncrGhwvG8HpWxAe0kIlO+okgMizQJDGB+GEVGyZk4Wq3MRpJmInf8SJVm\/8dohWYWps+8tkZ7FC+T\nh6UcbGJWbsIMXUeyyMTpAcCmKas4z5NGEyDbpfdLNZvIOfNxUL\/nZv6qxShAOJzJLO\/SRKZCHIxn\nejSBlIshy0dmomx+\/aDfLkZO0tWhxPDuYi2R5NE0JqMSNA0KSUOJ\/1BKGorgcPPdHo57Mn1b41ww\nw9wFkRcZpBgsMefMzfmbDchBSk5PhwKSgHkJavEMJlGIf5FURpTkk8f17a4q5bn7+QvpzCdb9Q0Z\nttKh+JBCnIhg+OIjZCSP4B2YhUWT0b6XV9sWkaAW9nGzz8H0IF\/Io\/sBN9YeUJ654UaVu\/iiyp57\nxlEMxsxNzYLJVp+dx+nNwe3wnDVazJpT1oFNKc1ckfs36\/C3jpRrcKMRf8ozN9SQACRhsaky\/dts\nut0dLJLCGidGVgC6PST24L45mFEEduhgsx7NpRXs2aRS0YAGR6Si\/mYA1gtAiezAcyrTt8VRjEL4\nD3BsKOOD4Bp\/iodkgMMg1oBhuh9\/kgtQ6gCMPXSjHK+xgWn22gOJxeE8vLMuN9SYMkEi++zZp\/XL\nMj4ozCb5fAQYnoucmN89FQjelTEifps6Vu0EF\/H3jHb5ipyD+vKOotxwQ4ubzdyF7Wr206d0MVhJ\n5BkzmuFDfs2ibGx+i90B0wJu8milizl\/y19\/6vKwqf0Zf96WHanNDbEB9\/Gj6bmfLKnNXBlJ0gzj\nHRsXwUX86VS7b2m\/Ge\/JJt2+4E8Ywm9icL4QzDVkZZgz5BlLpuwSv56sczQD3ToWKVv+T697sZkb\n3GH7U3408MlySwlY7jtHzRL8tqwfqxabcyONzW6Q9lhaGPLu8SHSy1eB5xOdFQ5weow8qJW71FBq\nsRnPBzT72bNadvkaiewSd7prHJJqv3UEVuY\/U7mRnU25oYZ0Xtn5GvU\/qT02faJWd6ijEea7NP6P\nJF2y7EONbfnYJExAKybpMpoofl+ASBr113se1eJzmR3cbnf7RFe1Q9Kx9rJVnn\/Dmu7d1kTHT3bX\nNKcigV0r7rXCKqzC+g+sPwGFktFjCzim7wAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/waffles-1334213862.swf",
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

log.info("waffles.js LOADED");

// generated ok 2012-12-03 20:03:24 by martlume
