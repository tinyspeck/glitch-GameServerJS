//#include include/food.js, include/takeable.js

var label = "Swank Zucchini Loaf";
var version = "1354649366";
var name_single = "Swank Zucchini Loaf";
var name_plural = "Swank Zucchini Loaves";
var article = "a";
var description = "A good loaf can be made out of anything. A great loaf is made from Zucchini and talks about how rich it is.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 441;
var input_for = [];
var parent_classes = ["swank_zucchini_loaf", "food", "takeable"];
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
	if (pc && !(pc.skills_has("grilling_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/41\/\" glitch=\"skill|grilling_2\">Grilling II<\/a>."]);
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
		'position': {"x":-22,"y":-29,"w":45,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI2ElEQVR42u2Y61NU9xnH\/Q98lTRq\nGiwKQUWWBVRQkAUpEC67LHeQm4BXkIsgIsZwEbkuN5HLymXlDstlDSKKgICiQs2ESdtJm850dNom\n004zw6u+6Ztvf88D57hK0lSDTV54Zp7Zs+cc9vfZ7\/e5\/JYNG94eb4\/XOz4zHtu40HFEs9iRkL9w\nPWHm5Vi8nmD6vDvJ4o2DLHYlKha6YtIXu2JNBEMLC4Cn4hwvx0SVFo2JjmhKckJ\/rifuVqmXR867\nuL8ZsBVllseqQlCf6oaR4gDc0Wlxo9AHdyoCcFcXgK4UWw7j2T0YynWBMccZ3WlKtCTthP7IDjTE\n2qAzxXa5OdFasa5wpXFO+blaW5zxtcLRA+8jwXkLMj234oKPJS9KUATYk6bAlWgbBpJgx0u88Wm+\nO\/oyHfi+4fgulGisltYNLlq5yYKgcr1\/hcuBVhwFftuQdWgrcrzEtaDtvKgERHBtR58D3izyRMfJ\nXTBddMd0rYbv02dUh1vHrwvglTi7mvKQnWjNUmGkRosvhpOwNBgPk1Dm2sk9KA22QZ6vJXrSHRhg\npj6E7aUg1SRoysWaKFu2uizICuVa66c\/Gu5xX7ih8ZgDBst88GQ0Ad\/MngaenOf410I2vrl\/Ggsj\nsdDF2uGSejvaUw9wcZCt+qNOqI5YUas28kNZffNojLVxf82WEbZxoiVw5lFvOKoid2GyJRjPpk\/h\n34s5+PZhBr6+l4qbbWH4avY45vtj0ZbjhYu+21ASZIObJYGoj93NAJSjRf7bZSDpnFIjbt8WFARZ\n5r96tfZHKBYHIpYe9oThbksgf+B8VzjD\/HU6BY+McVgciYfuvCdf++1EMvpKNKiLU7wAQ3ma6PI+\nF5V0\/bjrLxkuXWWBSMdNCFO+92oK3msP1NxuDlie7w7F4kAkZju0\/MGm2gBkJ+\/DrdZwzPQfxpfT\nRxnuz3Mn8ad7xzFSG4LOcypWTAJMdf+AVYpy2oTk\/SugMXs34\/CezQh3eA+hAnCqVf2\/F8pCf0T6\n474I3LkWgPFmP5CC9L4u3g5jVX4YatJisieK4f4xn4bfTyXjD\/eOMei9vmi0ZexnKFKLKpxaUYQA\nCbR9ByH2v2AoeqVranEt1d+K1xjX+z\/9QVBhpYHsJNXoj27r\/XGryY+j7cw+DOR7MBjFX+6ncIF8\nMZGE300mc9wfiuEcJAsJjpQLFTAEp7V7l+2ka5KidD0rZIe8HglCoHPdIWtBZzuDDfxAkz8eth3m\nNjFZ74dJfQCDEiC1k789SGW1KOj8sSmOK3teVPH4NS3nFoGQSprd7zAEKUWWkrVBAjTaifOO7+VF\n7WZACkopYrh+6QDWVCp9A4qxOm+YPvHgvjVcLF4znfBpkSs6Mvdyz\/v8diJ+czOBVSR79SW+GDeE\n47OxBIxeVXP+kX0EQEGg9EqqERgBknoSfOERBacTpRFB9lZ4oDrbHmZwAUtkoZRvU01qTu6m+B0Y\nKvfH7MBhzPVGYLjIHQN5zngkFBtrDuOCeCRUI+VIzVvN4TDVBOCs11YGkKwkqOjV95Ld6tWgc32e\nK6T1xxo\/YjgGJDgh6dJUm0bOM3popkXNeUSQ+iRb9Fw6hMEGLUYbQsU31cJ4wRn5x\/ejKMWNi4Ly\nbsIQgd5iDboLfHDG04LVISCylNQjy4MV78pQFEVHlELxQLlL9JSpcOWckqMizS59A\/U4uvlIqDbf\nepiHPM3L\/hwXnPZeaaIESePp2Y1E\/P1BGv44eQwP+iNRf0qJ2MCdDDfZGYmB8iBo3K2QH6FAkssW\nBohYrdZAMyiK7FAbdBSp2FZyjBgmxHlpmh3D1ec6GNjeG3W\/Fr6H8wPG8yqMlXmip8APtWe8MFgR\nhNO+2xmyRG3FQ\/9JQyC+vZuG+8YYzPZGwVTmhSlDCKcAARYKRZtP7V0DxLBCzbITezCh13AhUKeQ\nHKNz\/cd7GLD2rL1BLo5BnWp5qMoTcx3BqI+zh6noIGb7otBXLyxvC0fPZX8ku30gN13aTvWLgvlS\nAH11OwmTXZG4UfsRxhs1bP\/ttggUqq1lKCqGU96WuJrjirnOULlSzSt2RBTklXOOaMxzRGm63ZL+\nnOPG54CVqppBnQcoSoOscTXGBr1ZDpio80F13iH01qjRWeiHy4l7keO97flUcN6Mc\/5bUZMoklls\nIGoSd6M8aidaMlxQ6Led4U75iY1BpjO6hCvjzf5yhZrH\/a4Q1OU4cEE05DkslR2z3Lim9w3pVPEE\n2HBCyQAVwdZs52jBATybOsHNd344FsO1WpTGOPCYUq+qo10NAjrhsw1Dl73QnuUs8ssdY00BQqEw\nzjOyUmr+UjzsDYOhyGWlYrPsl69eUH7\/b5ThKg8F2X0tw4mVlLZFxiwnfD2ajH8+SMdDYb3xkjc+\n1lrJI4uqlKqT3lel7OOF5zqD5dyiHRAVgdQh6J45HNlak22\/XJa664e3\/cYyr41GnWqmt9gN1TG2\nDEnFQdv2XGGnFEmuW+QGW5CoQF60eDZZiVsNAbI61DIIiNqX+XuCpryT4DjOK19tFzNYpcony5tT\nHeXdCPUvspLaBo2ruH2bkSH2e\/pPDoqF\/dm+ly2UeqvURqSq7Sh2NYNzfL2tvrHaw91YqXpKarZm\n70Vxwm4UJylRc9oZhgsH0S3GX0\/5ITGfA1mR7yoACUoaYWR380VnspThmvIc8n\/UFp8tr1QZpCqn\nGBdjSOqbtCBZN9mqlnOMNhQz17UyoLRlo2cGKlVyIxYVa1i3X3KSmhIk9c0ZQ9ALShEsgVGOSRUr\nWUuv7UUrtq42YtO6\/1AnNc17JsVYg6+spnmQqhLodHsQ+is9UJGpYMDKTMWLjXjdQb9Dzel2zRpI\naaM7oDu0MvgFIDViXZbyzf8\/xrzSpRit95YtlYK2TeUZCgYUyi2\/UeW+r7kLNZfM1ZxsXWk1ZK+U\nc3VnlU\/\/73Br1VQty6DVnnKfK0mzW646s0ux4ac+hnWeFjSFCLCn1I3hePin\/gzgXiginSq9p8Rt\nWUwI009q6387uov3W2x4e\/xMjv8AW4jR+JSfaWkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/swank_zucchini_loaf-1353117975.swf",
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

log.info("swank_zucchini_loaf.js LOADED");

// generated ok 2012-12-04 11:29:26 by martlume
