//#include include/food.js, include/takeable.js

var label = "Bunch of Grapes";
var version = "1345744801";
var name_single = "Bunch of Grapes";
var name_plural = "Bunches of Grapes";
var article = "a";
var description = "A heaping handful of red grapes.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 4;
var input_for = [13];
var parent_classes = ["bunch_of_grapes", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by bunch_of_grapes)
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
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-24,"w":39,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHpElEQVR42s1Ya1NTVxTlozMKhHfC\n+w0WBRQVlUASCCEJeQAJLxMMYHgoKLQ6tbYdI4p9ToeOdlofCH2X2mmtU6mo40Sdtn5qM53p9Gt+\nQn7C7l4n51r6oQ9JMvXOnNF77uGeddZee+19k5QU4\/XGPWPq3F2L7q1Hdt2FX7p1c2sdzrNrprqk\nZ+mav28tOrNmXn77Jzudu2eJnL1nCQH4Rt+3tmZLzAHB5Nyamc7ft9LrDzqX17P8X99xnw\/74w8H\n6OMPjaG4A2QWgwB4+paJ3v25K6IAO\/VNm+9p2Pv9t2n68ktTIP4M3jH7ztzuCL3ybTvN3TbTm486\nQ9Dkic\/0\/5mNu3ftul9DE\/TxkkEXd4CnbxqdL660RnjQ0Staeul6K80stdCxxWaautzkO\/mV0flv\n7wiFxma+X+2mhGjQmJSWOlhbvDDcUE4Y3p1l5OmspunLWjFOMuDZD3XBqcX9RX\/3jocP+0Mrn5tu\nJARgV6omNN\/ooJWBU3SqfA8dTMsnlyqXPN5tNPl6I4292EB+HiPHd0a8EzV191ijCOnjx97Agwe9\ny2t37MHVVRtdeT8B4W3fkqkbKdhGF9uH6Vjec3Q4o\/AJQGuKmp4v301DfN+vyiNHqoYO6ioit27Z\nIt\/d7AqvrjoCALp21768stIRTAh7+i3ZARtv3MeAAATgBhhMT0YBeUvqaNlxlCbTo6B7UnPJlJJD\nn31qCl+6ZHjiedevm8OL77UWJQRgMzPYzpvaGWQ3AwAIMAWQAHwgLY9cPNcnn\/WWbKVrl\/ULyt+z\nrfiuXdUHkhJ5NSdnLXck5zAwNdk4rAOZRU\/0OJJeIMKLAzjBtKaU3Jq8kDlZHfRqS+quXTXE15g5\nlAGPKj\/oUeUF3SpNkHUWGNVULBxnrfmzygRj3QxkSFNJ0xlFdIgBDkiAPTx8zOog3wOsq6qQlpYM\nzriBO1RYu7zEmrpqnaAx3tjDYAYziwlzizx3NKdcAHDLBAF7Q\/K+J6dEhBlJ5JNJ5OA5SCRO2arW\nndimF2CO8CYTLHwkxpk9djE3lV1O4+l\/ZrCFAbL9CHD9BZU0WFlLo\/xsYt0a\/+7m+AE0pmQHEBaE\nxyez1SF11S8TQrGTodIa6sqvEGsRcjcfCIyCcS+v6QWj\/He96lKysBYN8QDZnJzhNK9jBQx08j3m\nHEJff2bwdIuJPCX1NFfbSqPrNOjktQD2ZpOb5naaBWBkfgfP79+kit1mWjhbYSlgY6ZsF7263UDt\nnL2YwyZipOdRf3EtvcaVBUniZ4CD0qRNvNbNGf6R6zjN5FTQSFqBYBPva2E\/jQuLroKaiL9wO309\ndIbeaLDQGG+CMIPJVgYAVif4OWQwKpMEIHpZhzbJ9oC6QmhRSSh3fiVpYwHYs0lTxCFd9rB1+Lis\nHanaR+9xaRvjTfwym7ulCYNFAAYo6BEAurmq+HdrpfY4gdKjWuyXduOpaSDt5uyNd9MHVHkRn0yC\nPqknR4pGAFMqRW9qtNR5JGNgEiUQ4XMzcFdmoQCFg\/jqG4WW8R4rgzVmFz49ez0qTdGgSq2blN53\n0eARNqJsgppql2zNVO2nT1hXF\/UewShAA0BrcrbQHVjzisPlCtD+fYawMTkn2Lol+8aGmHOp1L5X\nOAHe0brpHPsc9PZC\/nN\/ATjAvtbGAMwM9IJxmK6wUc+y8LHGI9ZoxDMAtXEJVBg1M2MxeZ+V9fZa\nk0vU0um8rXSIBX+iej8NS++DbuBfB+sahRmbmSEkDcKLyuGTa3xV9QIUZAAGAVafnB2OSWu4TFxb\nDxVsp5GsUgEKpxddCLKNB0Law1nnyIi2VbgHUPgi9Nkr1xze18pAc4WVYB7v4dYs9o6ZdRHoTI1u\nCCYwANAq2YLnAYA\/LWohWAeLQTcDEFhnzykW\/SDqrgJwbMdeBpgVe1MKR2dxRyYKa+nU1iaxAYwW\nWjKy5vDvOIcSPqYAHKnfK5IBYYRxYw2e+WQ\/iAPOtnWy9rIWYvK6Xs5aDAeHGVk5X9smumEFSGd6\n\/pOWSemcweb4PoP4f5+sCjBjl5QEkgVadJXURDZczrpZuCdrdOGzXB+hu6myBpEkR7hDgW0omTvM\nTKEauNfpEaBR3sCak8M6uktLbSk5YYTdIsufgSOy4eTAJ+N0ZWMYVnKOizsY65IdilcYb1T4MNUR\n3hwhtMrNTdHMFHbD3U7EwBpTLKRlc9YM6itKWEyNAL7KJksb6GX2PTSh6NksMkxgLepjGlGe\/JWN\nokFQMpeBRRr4gAn9nkAvZpO1E4L2ZpbQPPugjcMFhjDamLVj9UZRLV4u3iHCrrRQ+s1ZvoQCBP1g\nAkLGhqgK+FQ8xq2SkgQ21tnsNh1N5lYLlodl2XLwPEKZ8N\/5IGCAtDBb55m9l6qbBEsHZTs0zq05\nQgpQgyJbo9+9KHdxaTT\/6RrLrwmiufRz5VCKvF229gh7FwOZNTkiMGiFZRi5l1ukDXUhT\/WbCvvd\nF2wnH7SP0BSHVGkgzRKIVXbIJnWxT8uh1HGW6qNjoSnR2sPlTFWHL1nH6Sg3BePrDNnK2gIQ3Ubb\noXhdVlnkuSEVftcnQzpQvSP8TPwIjoZRKU1OqS2039bcMuczARAZyLoKwecw9PzV9r+GdN31B87T\nZDzpqhWCAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bunch_of_grapes-1334340022.swf",
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
	"fruit"
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

log.info("bunch_of_grapes.js LOADED");

// generated ok 2012-08-23 11:00:01 by martlume
