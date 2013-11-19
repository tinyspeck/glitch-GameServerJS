//#include include/food.js, include/takeable.js

var label = "Olive Oil";
var version = "1354598438";
var name_single = "Olive Oil";
var name_plural = "Olive Oils";
var article = "an";
var description = "A bottle of top-notch olive oil, no virgins required.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 5;
var input_for = [27,41,46,143,305,339,342,344];
var parent_classes = ["olive_oil", "food", "takeable"];
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
		'position': {"x":-7,"y":-41,"w":14,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFq0lEQVR42s3Ya1BUZRgH8KMERFmA\nkGmGpjWjmQ4iKmoLqzhJpggpalpgoFwCRcBdcIFlXdgLyy4sLNdFQW4usNwUApSCBVG56nI3RETT\ntEGMzMaZPv172YSJLl9q5izvl\/P1N\/\/ned7Loaj\/uQbqDy7ur\/euuH01SPOg86Tm4Y1IzZN+oebX\nkYRD1ExYY30Rh+53sjHay8dYvwCP+6LxqIuLwSb\/CzMC+HiAy3yoPYlnQzL8dj8NTwaEuH0lEF01\n7ny94y7m21iXnV6pGe3l4vmdRDwfScKP3VEYvnIcefK1IwFfviTXK7Amz4bZUmqOR9rDGO3yxWjP\nUdxrO4yeS7uhTrMA6yujEb0n2KR6ffyHa0swWGeOjjIKmgIKVWcoFCRRCPI2PKv3MpdnWLm0Va7A\n3cvvorOcQgMBaspswWcbamfEkJSnWTJba53xsHMbrlf8AWw6b4+IIEPNjAXWl66Z2cC6wmUzA6hW\nLjVVp759\/K\/AmryFBGik5R591VpvuKqsD6xz5QvGK5Rz0HFpOrAy2xTicCPEhJogmmVC\/15YX2Cz\nOE9uOV5bxMBPd5Px4Ppu9NWao62UQuM5CrXZs1B5mkJ+4iwIOUYQhNK8YV\/IWs4rzliKZw8UGBsM\nxc1aE2jPU2gtIROsonAph9IBS9IopIkMwGcZjvvspUxpAxanW4301H+MZ99LMTrghyHNUvRUm0Nb\nveRvwHMKA\/DYxgjwMKDvdqNKno+x3j345a4Q95qXYKCa+pcEZ0GVTErMMQbLbzaPNmB+4lzcaffE\n0xEehpreQ3npSuQUboIyxw6KjLVITF4FpdyMAGejMMUEwvCXcSqEZuBw+xd4OnwS7Q12iM3ZgaBY\ne\/hFbYQPxw4B5BsatQwl6QYoSptDgCZ6ALbuw89DwVBVfwaOwhE+kXZwD14DN+9V8Gavg3fYemQl\nvobidDOII+fQD7zdshvjtwKQrHZFsMR+GtDVYwUCSYrKeHOolRaI5ZrSD2zWeKFRK0NG+R6wZcxp\nwIN+1gg5tQn+nI3gCTZAEmVGP7Ch3hPVLXJdgh0Dx3Cx2RPxcUyoK\/fjrMoF7BgGjrDsECNmQMKb\nSz\/wssYdVVelEOZ8gt7hEHT0BSAr9SOEiOwRn+EE\/4gN8AxeD6HEAXGnLOgHDvW44XyzSAcsrfdA\nY4cPMggmkCTnS3BeZFA8Q+wglm4hwDfoB97q\/hRljdE6IE\/ppAOmiRiIljpOAb0IMFa2FVL+PPqB\ng127oG7gTgGFmU4QyzYjlM+AX+QL4IkN4IqdIYueTz\/wO+0OFH7LmQJyFFvBkm7WlXgSOFHiSPEe\nxMe8RT\/w5o3tKKhjQV7kAkWhK1LI5ArSnRAu24KwWAeECe1xOMQWXMk+xAsW0g8cuL4NpZpgXYKK\nIldIz+7QAScSjCBJnohmwD3QBpGS\/UgQWOkB2LkV5745iriCnYg5s30aMCrBEUFkoz4WSZIU7INc\nuIh+YH\/HFpyu8oUk31XXg1nlbojN3A62hIkTAoauB73ZH4IjOoBE0Tv0A\/vaHZBxwQuxeaT3SIIT\nQ5KY66xLMEzs8AJIyh37ORL0kWBv6zqkVnhAnLcLyaQH\/wnoE8oAN86DHHWW9AN7WtdCUXoAYoKa\nTHCiBydKHB63WQf0DbXHKZmnfk6S7hZbyNVuEOXsnNoHhaQHI8mATO6DvmEOiE44QoDz9AFcAxkp\nrZDcpieB17r9UUhuM38GChJ9EMd\/k35gW8NyKCv3TjtJJhIMI+WdBB7nOiI+zZecxTQDC5KsNCUp\nhrhYsgDqstUoLHeY9miSJq0Gh\/8+kuS2KMhyJm8SC7B8DVxoA9apbJi5CeZoLZ6N3irqb8\/OmmwK\nqiTy5FTaIjOJiSBvY\/r\/FVZmr2KqUhbJvz5jqqlQmmlLU18hKBPkxpsgK84YmRJzJIlWa8MDLXlh\nPv\/9r8LvBB5vHThS6SQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/olive_oil-1334341193.swf",
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

log.info("olive_oil.js LOADED");

// generated ok 2012-12-03 21:20:38 by martlume
