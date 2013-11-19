//#include include/food.js, include/takeable.js

var label = "Cabbage";
var version = "1354597903";
var name_single = "Cabbage";
var name_plural = "Cabbages";
var article = "a";
var description = "A head of tender, delicately pungent cabbage.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 7;
var input_for = [1,55,330,337];
var parent_classes = ["cabbage", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_cabbage"	// defined by crop_base (overridden by cabbage)
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
	out.push([2, "You can grow this by planting <a href=\"\/items\/317\/\" glitch=\"item|seed_cabbage\">Cabbage Seeds<\/a> in a Crop Garden."]);

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
		'position': {"x":-17,"y":-25,"w":32,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJDklEQVR42u2Y6VNUZxbG\/Q+o+TiJ\nFXBL3LBpGkS6m16g2QVEETJm3BUXEAQxIouNINhCQ7MvgiIIgihgjAsuAXHBBUmDYzSZjGHMJDMf\n+RPOnOe93LYbiGJSUzUfvFWn6l664f7u8zznvO9lzpwPx4fjw\/G\/OazfqN3P\/SdKX\/8iOLXldYS5\n8e9hzXVjwQPljwN7TwzozJO12dKvVeyt8zLvrfXqTWxQuSVVK91Rv\/vG1S8C3dtfx5mbf4w2V48Z\nNh\/qUrk5Q\/FNbZZ+\/Xj5o0CSq+5ZsKiqkSCqGTVR\/fMQqhgOcnxecF1L+095U1Ktl6i9NV7j8t\/M\n7n5P2OqxQGr6PpJaX8VS168bqGrUONHwyuQmKaKn4kE9Nf0QKmBwLkPJkIADFL6Lst4zOECLbgVQ\ncv0kJKt6sF2VmnfN3zZruNpnRn3FUwPlX\/e3lQ8bxhtehFHbP+OobTyOLLeNlH9NK2AAJisHABlG\nrrIho\/jeyZeh4jvOnx2\/rXOomXnel3aUeMbMGjD7qto95yu\/VJxXjBjMUFMugNaOhpPtsZEKbwQI\npZxvDBgZSC5cN\/8ULlR2\/i5+H0qmnfam353FwpuB9qLbes6Pjo716aj4np46fk4Q1nM+qXokjMoe\nGYSqeV9r6BjfdKqSKCjNTTTtgXJ6\/Gin1ZO2lS5TvDdcUX+w\/kR\/MJUMhpD1biiV3g+lsgdhVGV\/\noyhyCmD5uuCGhrK7V1Fmp58Anmr52V8iqfBmAB255E9pp1S0q3yFANxZstyeaJnv9l6AxQPBzQAD\nVPnDcKp4HEGVXFV2EznbjoKagMV5yX0dZXb4M+QqB1wJK59+xof2VisdlWibhJPrXZClD3Xmwtva\n1I1HF+uT65WK0nuhZBsKE1DVTyOp5tvVVGtfTdX2UBe4ym+NAgrnZY\/0dPSKjrLOa1wAC65rXODk\n2l2hcIHcYV0+MPPAfaB2tw7pKaPNh\/6av5SDu1KCexJBNSOrqW40ik5+F8MVzcGPcAG03AkQ2ZQt\nLuwLJPNX+lkBTlVyl82T9rd62bYcX26WS6hqHdKlAvBQp68APMY3gaX1zwDEcM9jqHV8HZ36PpZr\nDdWMBQkg2xMDFd7SUcXTIMJoQu6KbgZRwTUjpTf7zhowkcG2WpbTjjJPYiiX2mpZGiPsBWDeVX\/a\nXLRMqFc1HMkjJYrO8mg59cMaav\/Xemp5tY5a+fr0jzHckeFUORxCNfZInoPBPDfV3MWYcSY6dt3I\nTTAzIMeHdld6ifP0Fm\/aXiKBfHF0KSVkfUbxhz+jhOzFtCFviT25UTG+p9ZT7wKYVKty5K1+LIoa\nX0pwnf9OoA6uNoD+tI4hY4XtsB8Pg4eycsdbvjEJB1IafKiIB7IA7JMA05q9aU\/NCgG0rdjTRbF1\nBz91qbUZn5odGSwbCtAD8MRgAGW0rqKKR+HUyDeHxU0M2PJqLZ37JV4Anvs1XqiKanwRQw3Po0UT\nodOtdyVA5DC92c+Rw9xLqwQgr+nTLJRr\/SEJLDp1oQNQm\/CxImD9XP0cy1OVGwCFipcxWBnwJd\/8\nb9EMsYbzF8cqxgsl235eT62sYPukkkLBKYBQMOdiAO2tUopc5vRIgBnnlA6gTYXLRMnXazMW0Zq0\nhRS1b8Ek6IJmbfzcCfXaP0sbiZIHejsALf1B4mZQBY0BG8++jhPnAELJCuIBEAV0OyzGULeIDAaK\nB4XNuyuUdLDdl6OjpP1nvFxU+zxnsVAOuYth5UJ3ejgsDk2cR9qEuQQVJcAhnQ2AJYMm7uBwangm\n3RxAHWwrAAGFRoHt6Ow6zmj1SKSIBFYaHu50\/JbUxRg1WV1attqHx5bKJX\/OBRW\/yFsi1PvLkSUC\nbk36IgegsFgM6sdaBQCLBwOFxYCoGo4QDQM7MV4AhYJysBYzUlYP9p5A\/m4EUv4VAy9nOsq+oCXz\nZbWw98tOFTeGBLWxYOk00FiGkgFhswug5Za0IWWbx08MGnndDOXREiusBgAsrp9UFAVoRACrDOCw\n6pQyoFCPRwzsze0JoMO8ohy57C8AMy+optk7E+Dq5AVCwaAt7m8A869rbPJyV3yXu7nfRGf+sY7k\n5Q7WQjHAimIwqGx7ECY2ElAP+UNz5F81sL2Sepkdasq66CcAD3Z4T7N2agZj9i+k8N3zKPbAosn8\nzSXV+j+5zSno09Ix3sqLTcJ9\/Thsqh1dzQpKsw2NAtUAhMIGAvCAQu7QuSV3ghnQKOzN6ZbUy7ui\noZRG7xkbRC7YDVAAQkVYHLFnvoDTxH\/cLPLHCtrz+zTiwvpQt7nwpoGKGBJgUEfOYsmdEFHFDIOt\nGMCwtB2\/HSRA0b2wFs1x6JyazF9L9ma0ezuGsvNocS6MGYAC0LjpE3IZMaxgqrOK\/EI0cJSVQKZg\nLToU2cMyJop\/XnRLgrJCSYZG5zrg2NrcXg0daPWZZi8U28BZm6qiPKhh8aS9qY6VBE3CCo4fvaqx\npzSpUrHtL+jTTSDsyFXlk3ABKHLHmUTJg1nsXrhjMZizujQCDurJ2Utv9aZdlZ7TGiTuSyl7GDFi\nSHP+IpPmU8Dnb6w1Jc53C9w+T1Ixv0+rgIqHOldSSpP3BA9X+5FLvPvt1VEehx62Io9CPbZVjBL+\nDHlDQxzu1AgwVE6PPyXXKUX20lp+O3tQDfMPmQtL9CDDxk8m1AkfxQDKtMXDbNrq4foyxfu5zYA8\ncNaXIVU8u\/zYKq0AyO3RiTkHpbIvSj+DnQJsUjXUkUtSY+xr4MZo9vrNtVfOIy9pontDdswjBhIV\ntMVjYhqcMyRbPZHW4iMgD7avZEU0YmTAcoyQTCcg5zp83l\/ApTQqaV+j4p1wAItOWUDB2z2c4caN\n2+a9\/SUKdiOPspLpDJt7Cdt4VoiVzLqgdQHL7lbTgRaOxkmGa1Jy5la8FQ65i+KBDGtN297Asa02\n5G7WL07o7qxuP4eaGWdXMqS\/ABWN0KXmF28\/YWdSndeswJC58N3zp6rW+07V3grKth++4GfLaPO1\np7f6TCSfZCB+6d7FLz0zVWK5YmJHqefAdqtnL94rNhUuNUenLDSHJHLwJ8P\/h4DedmAk5XavVOw7\nrdTPVElNf+C\/Vh+OD8f\/6fFfLQgooG0p+9sAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cabbage-1334340087.swf",
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

log.info("cabbage.js LOADED");

// generated ok 2012-12-03 21:11:43 by martlume
