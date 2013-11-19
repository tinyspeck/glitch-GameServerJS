//#include include/food.js, include/takeable.js

var label = "Zucchini";
var version = "1354597897";
var name_single = "Zucchini";
var name_plural = "Zucchinis";
var article = "a";
var description = "A teeny-weeny green zucchini.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 5;
var input_for = [9,329,330,344];
var parent_classes = ["zucchini", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_zucchini"	// defined by crop_base (overridden by zucchini)
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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/323\/\" glitch=\"item|seed_zucchini\">Zucchini Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-17,"w":41,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHIUlEQVR42s3YWU+bVxoHcKRej6Ko\nmgZkg7GNMSTe9w0nECBkSEIgYQmLFxwDYW3CvjqEJQYMxhjMFqBJM6WTqjOVqmpGVSVfpeod0nyB\nSJXmGqlf4N\/nHGM3SHM3YOZIf73o5ean55znnPM6I+OjEfq2ULT8N1V46VAbD741xOe+NMTHd\/QH\n47uGqrbg5UsZFznC3ygCoa8VCB1qMPfGipnXVkx\/YUP\/phHjexZMHtiOh3eN8acxjTvtuJdfXjuI\nfqdH+J2SZ\/FQjdk3JgJaESAk4XjG920Y27Nj+JXt3wM7Vl9acAtvC9yvf6nAV0dVWP\/ehImda5h8\npcbErhqBfQ2mX2sx91c9Zr8yY5LAowxIGXplx8i+8+fedUPVuQK3\/mn+F8OxbP5YhOFNFUY2NRiK\naTBI6d\/Q4Nm6BgP0bnhXg8AbA56\/tWCIkP27djzbsaNn0xJvX9OqzwW4\/aMdSWD4Wx2m9hQY2FCd\nwj1d16KP0hPVopvSQ+8GCTu0b8FTAn5O6duyH3dumALnBtz+yYnFr1VYOFTR2lNgcFP5X3FDtA6f\nRLToiOjQSw00sGckoBV923b0UvxrxqPGUKHozIChd4qjlb\/r0ReWoGdFgm6WsJSmVI6R3WsY3Faj\nK6LmuK41LWqnC+Bb1qB9VYemlwp4Qxr0xLSENKGHgN1bDrStW48bI1fPZm1Gv1N3TB9chX9eBB\/F\nOyeCe1YEF6V5JhfueTHalmUEVKArquGVYzg\/S1iHxxTfCj1XGVKP7m0bOjcd8KwY0bSiP5stKXio\njA\/G8jnO8xGu6UUuHlHqp3NR+zwXrqAUT9YU6KQp\/xjXSvGu6AmlR2dMR0grOgjZHiNoxNz3vwPf\nSS5N7V09mty\/ivaQBC0nOM+yHA0zYtQR7iHlQUCMGkr9rBTdMSVVUXsK56a4lvXw03Lo3DJxYFus\nCM3hM2ie0rbLlyo7MjfcBHi6XgB\/KA\/V49l4MCXiuPtTYtwZTzyrKPcmxWgMytARVcNLlUzi6uaV\n8MUMcNO73l0zB\/opvpj9bKa7\/PGVkjL\/lff147QmF\/PgodROJyrHcPdPcHcpdyiVExI0LRagjdYn\nAz6cVeJeoBCNSwa4CN1DSAZ8vFGE+iVD+My629n0WXnx4yvvyzoFqA9I4F6Qwb2Uj\/uB07i\/UG6P\nS3A3IEVrREHRcRzLI0rLioGm2sSBLK6I5WzPcl3lp4VOT+aGszXzP+V92dQwUjS+lKFpQZ7CVVBu\njUlQRqmdp2pSEz06ATYsMqQRXTtmDvSs2dG65jiXU+cTM1XV5s16b\/NlobQnB80vqYmC8hSudFTK\nUxmQwRdVEVDPgSyusJEaxwLfehG80aLj80Lyoa3+zGpqyvzG2ipAaa+ImoWqOZWHm0MiFA+JcZNB\nx6TwrP6BbA5Tl68a0bFlQ+s6q6TjqG1bf753TCVBjS1Zv5hbhbg3moeaWTnHlYwkwpERJZpCetwe\nK8CDedqS1kxURRurIjxRRzwdN7ZPdI1ZWyavECW9uah+IU8Bi0\/iWVWifpG2oAUDj3\/DxHAUhnQG\n0oHMUNVnPjES0tGeg4qxvBTuxjA9R1klVRxZGzTQ00BTbWE4mmonznU9fjzU9VnlBo\/w2OzLRvW0\nnONYrp8gfdEE8CGlJWymqXbAtWojvPMobZ8P2laBWk9IU2s2nTj5HFc2KsaNkTyUT8qoWRLAB0Ej\n3BEjVbCIV5GQfelDNgvUOrfw2EjISkI6h6Q8RZSGkAIPFxLA2kUjVdGaBB6fe1efXpNZOo1L8JvB\nm43bEzKOY7H3S1G3qOJAlibaxL2sYQjZsGQ5SOvXYn7Fnx1alxD2JyKUjsvgGMzjKRmVEVJzUkUD\nnTAWDnRT7k5rr6cVqWoUzDHkjT5JCshy50Uhquf1qJpRoXaB7pTrdg5sCFnjGekehPxBQ8jigbxT\nyGQVWTxRMweyVAdN6rQC9bWXLxHw2OzPgWOANvHRBLB8Us4bpoaAjSuJzZsB69K9FnlntwivsyqW\nfC49VcWaoIYDWbxRKwc2rzpg6xeL0o5U1mdtsa4uG000jJ1SRlW8T2uRAemumJrmuiVTIO3Agpt\/\n+lTdLPjtFq1F5zDdfibyUUTPWwG6hc9oUReijqbbN2+WZduHC\/kVjaY5oHULcZe62H5SxaLh\/NQ0\nt0TYOqTThbo67c2SvP2omgW\/VozIeBWTyJqgjgPrlsxoWaVPA6ri7Req8IVUUeUSuHW0FlkXJ4Hl\nU9dSVXy0YuPA6qAxnnFRQ+PN\/mDpyk0BWarmElWseK7iT7Y2Lwyob8txazzZHHZjjLqaprt4rJDD\nyqcUsNF7lgv92Vntzv5g6hbD+kwCK10iGMg5IudNw\/4290l+vVCgkjZvNVUxiTP1iKH15aSi8ggD\nGRc9CPkPrf8ERCdNMsoWwUHG\/8OQ0DnNkEmY2i2MKxqzapL\/\/x1QPsK83RZGbAAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/zucchini-1334214857.swf",
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
	"crop",
	"croppery_gardening_supplies"
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

log.info("zucchini.js LOADED");

// generated ok 2012-12-03 21:11:37 by martlume
