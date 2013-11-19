//#include include/food.js, include/takeable.js

var label = "Creamy Catsup";
var version = "1354587011";
var name_single = "Creamy Catsup";
var name_plural = "Creamy Catsups";
var article = "a";
var description = "One gallon of the creamiest catsup in all the land.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 81;
var input_for = [29,36];
var parent_classes = ["creamy_catsup", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !(pc.skills_has("saucery_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/68\/\" glitch=\"skill|saucery_2\">Saucery II<\/a>."]);
	return out;
}

var tags = [
	"food",
	"sauce"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHf0lEQVR42rXY+VdTZxoHcP8DHGSR\nNSyBQAKEsCTsCARRj5ZatVin0IrKqhWwKGWLrCqELCQsYZXDMkWkWHBQRE6oaNhlkR0RtHXmnHZm\n+BO+8947ozOeDjqGyz3n+SXnnpvPeZfneZ93166PfF68eMFaWlqKXFxclMzPz9MxOzurnZ6epuPp\n06d0TE5OUiEnIRkfH6cicnR0lL9rJ5\/V1dWulZUVECAIEAsLC5ibm8OzZ88wMzMDAqRjamoKBAmC\nw8TEBAgOY2NjIECMjIysk98MdgT46NEjLQXaCvgGuRVwaGgInZ2d2LER7O7u1vb399N\/RuHW19ex\nsbEBalQpMIWlgBSKjBQGBwfR19eHnp4etLa2oqamBkqlcueB1FRRwFevXuH169d4+fIl1tbWaCQF\nfDNa1LsUrqOjA83NzTsLjIuLM5DJarFdYFFROVJTUyN3BJkZf+aiqlBCT5dOp6PX3vLy8pbA3t5e\nes1R72s0GpTkZCIrK0u+c7s4NkAyclKEvvSz6M1NQU9KDPrSvoKupgxDVaUYrLiBh8pi9F7PRnva\nWTTERKL6SADUh3xR4usMCc8CGVxzyY7gfj4XEjx7yhtD0cHY+KERw8pCaIRWkAmsUMy3RpGbFQpJ\nFLhaIZ9EnoslrpKQ8CyRxzNHIW8vbnCNcZVninQno2BGcf+IExusfh2wORBui0WVBOud9ZgsuIA7\nQVboDLBEu78l2nwt0OxjjptCc9R7maHGcy+qBKZQu5tC4WaCMldjlPCMUcw1QibXePOK3R+Yy4Wv\nE0Ibh484YTzlBNbbNVj7vhr3D7t+PNDFBNcIsMBpD1IdjabimED+lhgePBclwOiZcKy3VWCtVY3p\noovoCbb+aGCpG5lmEkU8E2Rx9iDZ3rBx+8CksK6hCDK1pelYa5Lj+U05hs4e0BNohhK+Oa65miGP\njOI39oab2wb+NTFkkwLOX0vF84ZSrNSV4P5+tl5AKQGWCixxnW+BfCcjpLENEW+7e3sHiJex\/qCA\nc4XnsaIpxlJVIXpDrPUDktGTelrjBtn5+c5GSCfAcza7gxkBPstLxHJFHhbVV\/UHupujzIuFEg8W\nARozC5zNPYdFZRbm5Vl6A8sEFpAJbVHqZYN8LsPAmaxYLEgvY45sFr2BHpaQ+9hDKrRDAdcEl5gE\nTmdE45eBXPzliQRzN4WYqfPCRLUHRlQC\/HTNFXfjHdASZPHBNajwc0SZjwMKSKpJYRK4qPgaM0vZ\n6Jm+jBt3+Sj+wRX5f+Ihp4mL7zROkFfx8GO5G26dsn0P0AzKACfI\/DgEaMoM8NdssXYun4\/F22fQ\nM3sJi\/MZWGgSYrrWC6OVHhhS8NEi5SFTxcEXRbZoKeVuCZSRHVwexIU8wBkFLv8CbjsP\/ioVaztG\nRLg3E4vlhXSsVidiQGxDrz9qzVEImYcpBps8aGC51Am34tlojbbFzZMsVPjufQuUe9tAFcyDIpCH\nQpe9DAEvibV1Om+Uj5\/E\/ZlkUk3ifgekDgHDzV74poSN2Ku2OJvJQkyKFdSZbFSFmr8FKsgOVoe4\nQhnsQgMvMAJMFmu7R30hHf0ElROn8fhpAkbTeHgQzUZXlB1aP2WhK42D+hpXHCu0wSfZ1jh4yQJh\niWaQZdi\/CxTZoSKMj\/IQNzrNnGfvYQ5YrAuHauxLKHV\/xLc\/8t7ZJGnVHJyU2n0QqCQpplIsgCrU\nHXkcQ2aBRU\/CoBiJQtnjKFy4w0XSLWfENXNwus4R0Wr2\/wf0JVMe4QV1uCezwOHbIhQ8DoH6wado\nlkWgJN0OOTn2SKh1+Chgua8Dqg8IURHhzRzwtySxZLI7EEUDgXiSEIb+Ez743s+CTiUyoSlyMkhV\niLdBarI1Ps9lvR\/o7wjNIREqD4jeALWMAZsUIgzHBOFhlN9b4D1S8v68zxrtfpao9zYjBwETfBlv\nsSVQFcBBzWFfVB3yYRa41hKIOrU3dKd80X9cSAOp2ju43\/YdoJJPTso+xu8BOqH2iD+qD\/shh0ng\nhsoPeQ+EuJcoRN9RDxrYIjL\/n8CMQJMtgepAZ9RFBkJDWlHGgH9LEkdu5AegTUc+qvXHjQYhssod\ncVnqgIYE+98Bv4o13xpIylz90WDURAbRwGS24fab+DdNky7VDXcHyIf7hO+kmWSFA1Jy7JB4mVSP\nb63fu0kqSJlr+CwEtUf3\/XsEDSWMAbUR9ngURVrPHAEetHiivccTDbfdoWnjo6LRlT7NlCickZNq\ni++SWMiLZ6E+yQ6VgWb\/Ae5zQeOJMNQfC6O7OkaA9K3qaf9NLWnaH5Ia3BfK0vvAWknqcOPnYlQe\nFCGdY4Tz222Y\/qtxl4xGcrcN1Oz3JKMXggI3c6RwjLS7mHqoq4\/nsUFTCwVnMJMbozewjuTAMpKs\nr3BNNtMcdzN7X00jkyOm\/n6\/Dr90qfTrSUT2yHYxm7riaLIzl+lrcZ4Gc9H+8uFjgs3Bz0g\/knb8\ng0AVAcoEZrgusNjMd7doZPTSaKtn4oSnwViU6OLj417ah0f42p6D3PU7EVx0iDloC3VEUzAbdUH2\n69UBbK3Sx1YrFdlcvO6pH+yf41qsHpnAVwkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/creamy_catsup-1334211623.swf",
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
	"sauce"
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

log.info("creamy_catsup.js LOADED");

// generated ok 2012-12-03 18:10:11 by martlume
