//#include include/food.js, include/takeable.js

var label = "Mexicali Eggs";
var version = "1348008121";
var name_single = "Mexicali Eggs";
var name_plural = "Mexicali Eggs";
var article = "a";
var description = "A heaping serving of bean-infused eggs.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 78;
var input_for = [];
var parent_classes = ["mexicali_eggs", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !(pc.skills_has("cheffery_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/37\/\" glitch=\"skill|cheffery_2\">Cheffery II<\/a>."]);
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
		'position': {"x":-21,"y":-18,"w":42,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHlklEQVR42u2Xe2yT1xnGrWXaVjqR\njgKraJcqXVmBJTiQQAIxZBNbNandgKo0omOY5tJu1Vi0dWWqtolpq7S\/OjZpEtpWyW2jDhMScUs8\nAqEmFye+fLYTcjFxLo5zIXd\/AQIUO+zZeU56LEubtJkETdr4pFefvy8nOj8\/7\/s+57XB8OB6cP2P\nXxHt1dRpf3GZCEuwbpc9XF9on9BesfPztL\/kMEP3lezkuv8CWMkREWCEGwoRPL8T\/fYXMdi0V975\nfm7w17je+SNEvIWI+jcAnVkWaIb7C6v7ioy3e9\/yxwZ+JTcnUJftOfRdfAGBvz2PnrrdGGnZhxuB\nH0vAmfbXJeyI40UBmYNo8+fsvncNT943uEhrqf5x71uYbn1VQhGOQdX4rJSMtP0Ao87vxYGHHC9j\nojEPMdcjGLcZzIufVl\/xk9c7y\/RJb5FUjSDcmAAK8krtdyTchOeAvPMd11JFAvbX5uKOOw0dx1NC\n5UWPGBe15qb8JX5uTFVUOhUYg8CE5XvCEX7g0h6ZaireK\/5Hs67HXV86btUbUHMoFYsGyIYgGAG5\nsao7lc5EUFWHw0KxxEbxndwBz7FMzGmPI9ryMIZtT\/sXqe5Kdo65zXJzbkxVCKUgCKyemWLC892U\nr1SC3Qq+KZ9brCa0nViHyMUluHxqBboa1umL0hQD9S\/p3Jhp5eaJjUG1aDF8R6Crzv1SZSrHutPb\nvi8\/X67+Fho+2ITZltWYdhgwETqIHm0TFlx3g417Q1RMpUulU9Ubn1WzsNb4BQjMZ+WRbA6q1302\nC7MNS6AHVqPPtw1BT05oQYBsCtYdAZlibko4AhBONQr\/ThCupWKzV96QERE2JE4VeCq\/jvbTeZjz\npiFsM2AmXCjVC2o59nuGG3PvtygQ+h2VYZoTm0GlmCmlenf6fyG7FSO\/xd2htyVs6+lnoVVuEQZt\nxGRtCgYdmWizmVDxs8dR8fMn7q1Jeut2lRGMUDTbcU\/RP4ERlspRVQJyLVW81vFDCUfgTrHOeSwP\n153Z0px7Kg0Ia9+A\/Z10HN27DEf2fCF5wNGW75q5qfIwZSeJwbrj3xI9jyXAOqVqDMI1lm\/G2KUN\nuNu6BtEmA7qqlsraa\/hzGqoOPex\/Z3eSRq37SguoBlPLoEpsAEKoz4RI9D3WIWuPX4QnDGuOftf0\nYZ60FHRsFp63BNPnDQhcypC1F2jaCFf5V4xJ24kYmXTlcWpz5W+EIICyGsJSNWU5MtWfwFG5mj88\nhZuebGnKPDUCZx+TcAx\/Td7hpO1k1G3WlXrKRqjckGMf5NTS9UY8nUo1QnGd+uyq2C7hgmcz5+E8\nX5SpDdmWotu14RPAAn\/ycK79\/sR5jioy+G7efA\/ETwj1N35myKFAPBOORky4v7d9VaaVcNOuLITb\nNiPg2IjyA8vRVrvenOQZW2yhAqq+lLcRTg0DEq5RwGglEorrlQkHar8tTbipPBszzesRcy+XYIze\nkyno9c4rR0DvmYzk1Lvq3FfGTVThq1lOhfK5SNvr0ttudP0kbiesN3oc4TzWjbijrUPUkRKHm6kz\noN22Kl53PVqO3qdlpyZxShSbaQf0K9aPglMDgWoSppPv6YfqXKW6TCk7tfXEenzs\/FIcLCpGqblh\nM253ZeBGKFcoOA\/X79tgTKpjr3Uc1JkyVXuESRwCVDczvTe7D8lTYsr\/mjz0qVrDe0b01ayVBkyw\niXMGxIZzMBPcjbCYmn0nn0HYnYWRzlx70nDCLnTC0CYUSGJKVSOoyZjpDF7YNQ8mGuFyZQZmnWvj\njcCINK9CR9V8IzAaj67Vu+355qQ7VtSbn2kiHOtJzXAqpVRUmS7X8ERQ9tFx0oibrgzE\/KIRXALM\nsxKxyxnyPqGlIxLYgpq31+D0L5+2O6q2Jv+jiL\/EmCrVmUqx4PldohbflJMv64yQBKNiruNbMHBh\nfo6LtYt09q\/E3HQRbgy+jOhIHqKhTHkfcJrQbM0PNVdsK7jXkf2wGomYTqaQilFBORZ5S6VlUC3Z\nmRW5GLyQhdtuodKVNYhdNSE28ZwAewnRMROu9efJO6On3qQ7raayBU3Folt1qjfueUUqxBRykCQU\n5zXHX7ei\/r1sBM5kY9KejlirUKtbwI19DdFJcXK0boT\/7DMy9OBmCTbTa0LnhXyLVpGduiA4nrEs\ndAIx+OuKUPWWTFz8Uzoc7y5Hb+VDmK77PGa9nxFq7UDn6eehffhNOMtX49ZQHm4Pb5WQhJvoENPx\nRwtIZ+LFurhyZh0GbGkInloF7\/up6KlKRdBqwGi1Id6FYx+tFCAvYE7\/KQabC3DqtRV43\/wo\/lK8\nFP5jn8X1PjGiXzLBXZkfajluOmxYrMt9YjsmXaKQuw0Yr0\/B0LlPY8r7KUTDwrfGRB2NFEjAyXZx\nH9+BqcAmdIuxqLrsMWkXfyxchuYPsuCs2CbrbEHp\/FdXizXf0l79LPpEwVeWzqtyZM8y+KxPYNCT\nK4Gi2jKMNq6UdcUUsrZsv\/myXPt7sdZyMM2y6GDqcllNRqa5r3E7WiuNOLpvBc797imM+nIwpJlk\n2oLVaxE8k4b2c+J3a7VJb7aa7EzjotTYf3Lx23Ozfxf3TaUH1\/\/z9Q\/x7ZJR+qFlpgAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mexicali_eggs-1334340940.swf",
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

log.info("mexicali_eggs.js LOADED");

// generated ok 2012-09-18 15:42:01 by martlume
