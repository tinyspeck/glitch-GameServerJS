//#include include/food.js, include/takeable.js

var label = "Red";
var version = "1354649341";
var name_single = "Red";
var name_plural = "Red";
var article = "a";
var description = "Some things are so basic, so fundamental that they only need one word to describe what they are. This perfect blend of tomato, onion and butterfly milk sums up the essence of red.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 30;
var input_for = [45,46,50];
var parent_classes = ["red", "food", "takeable"];
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
		'position': {"x":-11,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGxElEQVR42r3YCVATVxgHcGc6rR0r\nUrUqtSpoKZgIhPtSxAuKFKQIyJUgSEE8EEER8QoECBCOkIMjUUGJF6jgbRFrRh3UWgfqVEWKBRXl\nCAji7bTm3911THXUUcLSN\/NNZpLd2V++99733r5Bg\/rYIA3SR1GIF2Rs7qtQyzjKdwVkHKHmOvKe\nIjZr0EA24oGVkC8E5CFah7qI3YwMP90BAapFPkoUsrXG\/SNegL\/WO2PAMqjOclNC6AVIfIDCwJcP\nLgiCOj+QevizPF88zp2PB1le6Mn0RAt3NhoTnVC\/xhHnokxxMtQQx9gG\/xOwIOBllxE4Ekaiuvju\naOW54ubGmfhz7TRcWWWH2hgrXFhqhjMRjIEH\/s13BYTz+gU8EGgAqfsYrwEBPq4SVTzdHAW10BvI\n9wcxaaCWBrwXeDnWFhejLXE2ygxVYZOxO2Qy5KHM8wM3i4\/ui2lKDkPj4WK0n1bgdlURbhzMgeqI\nAC0VKbhRtgFXFfGo3RKNGnEYjmWHoJLvjz1cbxTHuCDfzx6KEI+kgcGd2s+6lxP7pHGlC1THSlG\/\nPReHfVjY52eLXQGO2OHvgNIFDthOIEp87bDVxw6bvW0h97ZBgQsDwqkGSDEeQnwaPd+zyJ\/eeojq\nct1neyR3G4KZaCvhQXV0GxpzYnF23kScctdHldt4HJnzDSpmfI0yJz3scByFEruRkFmNgNRCF7km\nQ5HJGIoUo8+R9O1nEM2yvCfzo7EWvjhetqM53Aq3eGx0Hd6KjoOb8Vuw5ccDTXWQQQBTJw8hgIOx\n1uBTSOdOr6Une+dOON9LC0VLgie6DsjQWVmEm3lxuPCjYZ+AZAbTmEORbPwF1k4ajERDHZQE+HLp\nAFa2RU+HSp6Izn1SqPZKcH2VZ5+BGZMJ4BQd8Bg6WG\/0BVZP+ASFXm69\/QY+P1T84O4iM3QUroGq\nLA8du3PxeyBTqwymTxmGFKYuNhjrUMBMJxbE3h79mzDPKgpBAaVx6NiZhXZFJup8v9MOaPolUk2G\nYyNDlwKm2zMh9\/N0pgcoXoH27Xy0bUvTGphhNhxpZiOxacpw+oHtwqVo35qM1i1crYGZrJHgs0aB\nazqSfmBb9mK0yTfgbtE6ClgbYoX7u3jo2ZmMi4udPhI4AukWY5DMGq0BSue769MDzPwJrQUJuCON\np4CPKwWoPrIEsr0euHJiE34nZvbHdHGm9VjwLPQ0wH7P4lfAVn4o7orj0JK3kgKqZHEULkHBoqAN\nqSEflUGBzTikWI2lD6g+V6WkgClstOWvwoN9AnRLovB0TxIu\/ZygAT45IkKnIgnNxGS6zA3GmWVu\nbwPNv0KW3QSkWo+jgJK5zvQBO7Ij8PcxEVqXWOKWr54mNhab4mjxPHRt8kD7SkdNdKf54q+85W8A\nBRajkO1ggDTbCfQDn1YIoEqY\/QaODOVyffzBGfvW92SQf6bCz+o\/oOVo5EydBL69AQUUuTq10QZ8\ntG3tOxEfipbscA0wy2o0cqcZEhkcTwHz5jjU0gbslURqBSTv0wCtx0A43UgzBmkFdgvYWgEfyleg\nfL4FBcy21kPeTIZmDNIHjLTDo9J1WgHJifUqgzl23xCbVSYxBvUpoNTN+WL\/t1vnq7mqROI9t3AF\n7mdz+oQjZ3NnGV8DFDkbQjzHBOkOEylgSYCPkjZgy2oXoEbRp7FI1srdHkwNUOxsBImrGdIdJ9EP\nbF5si07JMgpJjqvbwQbvhZG\/kddcWh\/0Rh2UzDQmutUcGVMNXwIDfYW0ALuS\/NEcYYXGqGlozQzD\nP7\/I8YIIEkHWxtcLNFmwH+\/PQN3GoLdWEsksBvLnWhIb1e8QP3EwTVv+mmqvh6JYNIdb4M8IO9SH\n2+BysAkaVrvjFoFtSg\/FDf5Cai2+xuPg1xgPlM0a\/861WDqbiYIfrCGYbkxsufRoeydxJoFNYSw0\nhFni2kJzrfeD+S4mKPS0RdYMBr3AJ8U8NC00wXWOKa4GT9EaWOBqCpmXA7JnEqXGZhI9QOrQ6FBp\nbxOHgetBDFwNMNYe+D0Lsh8dwSd2NGIXexT5e9NzwoDTx7k9udFoCH4JrPUx1Aoo97RB\/vfmSDUf\nCwXHXzmIrkYefeDkwbqe\/YW4k7+GyKB2wM1e9sgiVpGdnAU9CrY33ecz1brq88r6p\/WXcP\/X6j4D\nBSbDsMXdHvsXh9bRfnikQZaX6z4\/tFvYXSrubUhkoz5jyQeBBTajUEx064EITu+BZeEl5ZGRA3OA\n\/nrrJqC95cUxXTtkylui1HP1KSvb\/uDFoW5TNC6uW4Ka+AicTlh+u4Ybrzy9PlZ5In55THWkdqdZ\n\/wJsb\/g\/WtQHFQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/red-1353117817.swf",
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

log.info("red.js LOADED");

// generated ok 2012-12-04 11:29:01 by martlume
