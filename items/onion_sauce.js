//#include include/food.js, include/takeable.js

var label = "Onion Sauce";
var version = "1348008197";
var name_single = "Onion Sauce";
var name_plural = "Onion Sauces";
var article = "an";
var description = "A jar of eye-wateringly zesty onion sauce.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 64;
var input_for = [298];
var parent_classes = ["onion_sauce", "food", "takeable"];
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
	if (pc && pc.skills_has("saucery_1") && !pc.making_recipe_is_known("47")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a> a bit more."]);
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
		'position': {"x":-11,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIKUlEQVR42rXY+VNTWRYHcP8Dfuya\nmunqmrbb0rEbZAsSlrAK2AiKIIvsCi0SCRAgCMQAhp0Qlsi+7wYEZAZQEGMgLGGRRZu1EcGiUbGl\na5aa6eqp+s7NowaHEeL0+HKrTuWH5IdPzjnvvnvuoUO\/cnEfMz+LGGc6hyuZgnDlyZ0YNpKFDxvK\nwocMdkJhIOMo9GVhCj1x2OAJARUDJ5zZg8d1DmlycSfM2iPHzRA5ZooIJZOEMSJGTyJ8xIgEAwS5\nE0MGJPTBUeiBM6i7EwMnSOiAI9dZDZ74XEsjQFV2IpUmFDByzGQfIEMt8ErPV3CRHIbGMkj+vYyr\nMEC8koXESQdkzLoiY\/oC+KP2uK6wRbTMChG95gjrMsHVDiME1BrAq1gHbnnHYZdwGGacT2EY\/Inm\ngQlKC6RMOSFvzgf5T\/yROeaFZLkr4u85gdtmB3ajFS6Xm8C7wBCumTo4k3QMtrEaBr6d4GkV9J3D\nxwJP+nyJy2cOO2sE+WIqgjMzfg1tCjcUKc+jctIHFUrfA4FBOQwECHXhFf8VvDnHEBLwB4S6HRNr\nrMSv5tMEK2NxmJalY7KPj6HOa1DcDcVARyj6pd+ip\/4SOir80SxxR8lNa+TFmSE7yhhpHAaEofpI\nJZHCZgg0gttezWRtzNzAsjIBW+v9WJ6WoqPYCbXpNiiMN4XkugkKYpnIjzFGbvRJiLlGEEUyIIpg\nIDfKiHzPRBH5XRaXiaQQQxatOLxN13qzkLq9NHQVm8tN2Fp7gGfTxVB2+mKo7SLktz3Q33AB92vO\no6v8LDqKzqC14DSaxfaoz7RFdaoVypNYKOabUX9CeI2xzQvWp28v\/Mu6uGptkou12Wy8We\/F6+f3\nMN0X+uuBN8ypTKqym3BZd4rnRsOG\/ctWIev1vADrM0K8edFDsteNtSdlmOwJ2AMc7w7A8F1ftcAS\ngQVpBzPkRRsj9ao+on2+rvpo4M8vC9rXJjl4tVKHN2t\/wuvVTiyOJL4HfCoP+d+ACSwU8EyRzTEE\nz097+6OBf9\/I26aA31dj6\/ldvHrWjvkBNlT9+N9AeYvnB4FFfAvSh+YQhRsiIVAHke5HPu4A8de1\nLKiAL5crSfbuYIvE8wkO5uRXDgTeznVAbYYtGrJP4Y8VLmQb8kOT2AGlAkvSh1akD1kEyIDgsg4i\nPI+yaAFuLpWRMktJmVuxOhaGnhpXdFW67AEqu\/wpYLnQCiWJFgRpsyeDpYmWJIs2uBVvqQHgYgkB\nNhGgFAuDIXjY5IGRDu9d4Ex\/MIV82OSOspsEdNPyvRKXJVoRpC3pQyuyPxrRC\/xhoRCvVxqw9awB\nHb0uEHYyEddqiJhmfXBrdVFX67Bnm2krdEQb+WzKsX8HTLImOBtI4qyRQ4D8S3QC5yXkQanF\/FIR\n2F3auNRxDP4tR+HdeASe1V\/CrfQwKitOUUBV6R+1+VC99+iOD3nbWFPAIj4L+ddVJbalgHEB2vQB\nN+by8GKpHNXT0QjuOr4v8GzB71FabI0HzZ5U9DV5orfRA\/VZtrvAoht2pA\/tkRN5kh7gzy8lMsWY\nHwaf8NH7JAnFUxy1QD\/x0QO3mbJkG1SmOKI0yWEXSMNGLZE1jzhDNOmNoulQND+NQ5LMcheY0Gm6\nB+go+gyBmcfgIyRw\/hdw5X2+C6y4eQqVqU4E+g0BGtMHbB89j6wJDxRMBSNvPAjyxRj0zYbh8Xdx\nYLfqvge0T\/0U1oLfghX7GzAjPnkHFNqhKs2ZPOGOEBMgz5cmoKrEN5VOKJz6FrMbpdjYlOCnzWIM\nz3LfK7E6YKWQPNHp5wjUidpmYugE8kdsUTpzBVmjFxH7gEkBX66KPphBu6jf7QKr0k6jPucCarJc\nybvYgF5gwrA1MsbckTbiDs49vV3gMHnCrzRoHwjc7cFkFpoL3dFeHURFHo9JH3BoPABxQ5ZIGXVB\n4uAZlI957AJX5xLxWBmG3Ds2aoFVmadwu9gTHdXBaC0NoC+Dv7y6JZif5iB2yBzJI07IHnHF262y\nPcC5CS4m5EHovOsMv\/wj+wIrU61JBj1I+KMybafE5DwoowW4McsDT2EKwbADFM+E+Md23b5AefcF\nSKqN9y8x6cFbfDuUpbihItWNfmD0oDHiFTZY3ixUC+yWnjoQWJ12Bo3ii6jN8kA6W59eIHfACLED\nLNxf5KkF1tabHwisSXdCY6436rK96AP+86XEWTWTRAwYIEpuQnrQWS0wqUxvDzAg7ugeYFOeL+pF\nFylgjM\/XHz\/E\/3toCpfrIULGAOeBIe59F7YvsKXd8b2nmMPXfgfMcEZzvh8acnx2gL7aAtqAoyOB\n5B1sgtDeE9Rh4fa4P\/UmeTgWgm65HzJaWHC\/9YVaYG0mGQckgaTMftRURwtQtX5aSd9eUbKxqAhB\n+yMXJNw3OvA0ox54DlICrMlwQ2KwHnjeNN24\/u2FWLD+OJoCqkI1NA0N+KGt4yykreTU3PgNdaJW\nHVhV58HCfEvk5ZijrtCBOg\/eq3dHS6ETqjNdSfZ8kRNlqhrcZYfoWqqrjx+XMqY2Z3LxYjILK6Ns\nCqn6fPowGANkmlN3s1Cm2gPjTFAn8kQJOQsmhzK2+YG69N5Xv11J13o9lzX15+878XZeSs3Fqpjt\nD6JGyubc0x+8+ihJskNaOHMqmc3QzGW6Crk+nSxeGorZfvIwHAvyRAy2eqG31hV9dW77AuvIfFwh\nJHMI32pbxLOoSufpa+YC\/T\/XygRPa2GQx5npj5KNdbFlivbg1UfSQPTW+6Gr6iLaSy5AWnB+tV50\nVlaR7igrTrLjlPBs\/i\/YvwC0RbGwHAuBKgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/onion_sauce-1334213069.swf",
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

log.info("onion_sauce.js LOADED");

// generated ok 2012-09-18 15:43:17 by martlume
