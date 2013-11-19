//#include include/food.js, include/takeable.js

var label = "Roasted Pepitas";
var version = "1345744917";
var name_single = "Roasted Pepitas";
var name_plural = "Roasted Pepitas";
var article = "a";
var description = "Crunchy, nutty, seeds pulled from a pumpkin ready roasted (it must be that hot knife you used). May cause a roasted pumpkin to grow in your stomach. No, not really. Will cause you to feel smug about your healthy snacking choices, though.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 5;
var input_for = [223,224,225];
var parent_classes = ["pepitas", "food", "takeable"];
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

verbs.eat = { // defined by pepitas
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $energy energy. Grants 'Smug Healthy Glow'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (this.parent_verb_food_eat(pc, msg, true)) {
			
			pc.buffs_apply('smug_healthy_glow');
		}

		return failed ? false : true;
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

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This item is seasonal. Some of its ingredients can only be grown during the appropriate holidays."]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Smug Healthy Glow buff (energy bonus every 30 seconds)."]);
	return out;
}

var tags = [
	"no_rube",
	"zilloween",
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-15,"w":28,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGWUlEQVR42u1WCU\/TZxj3G\/AR+AjG\nmJCh03LU0pPelEOoYLZk0YW4LCOZYY07HJsiHgh0HLWllFJaCm1pS68\/tFBuyuGJw27TuTm3NZsf\n4NnzvFXmmWWL0y3pm\/zzcvz\/7\/t7fsfzvjt25EZu5EZu5EZu\/CeGv0\/Ei9jE7phdykUHpVzQLOJG\nuw9wtjMlba8VWMQq0SdHFam1CQ1cjVXA5agWlv0qiA\/LwH9JBNa2Yu61AAsb+XlTDilHwNLJavh5\nQw8\/rtbBzUQlLI2rgLPLwG0sg9YPCwyvBSDJSECuT+ng2\/ka9lzjKmDRp8KnBrghBfS07ONamnbn\nvXJw4z0l+VGbBJJuOYJRwkpAB6uhQ7AWrsefD0IM2fOahOlUQGWYH1Pq0Zc7X628VkXb1HAV+M0a\niAxqIeHSwbyvHgJmKUQHJXA5ooVv5qqZ5LcXs8zOjSnS4QGx\/F8FFrKIeBiINAEgSe89BHCVSauB\nafdhmB6pgtlRBVyJVjCQP6zUspnCQ38P9YvdFKyXFoSYTcSLO2Q8bkiiTzjLYRl9R5tRML5byLKz\n4FVBwqmGiK0chtoPQNReCdMuFQKSs8CsBNTMCtOucpjoF4Onp4yYTvt6BP8caNgmaUO2MushDUsm\nsXArWcUAZdsIbmYRMVmnHGqYwrYStopxYyn4TELobtkHQQSTcMkQvBzfUULIKoOxbhHE8J2ZETl+\nLwZX5wHT3wbn7RUYOLuUVU2AiKn769hGUrWwNVMFBHrKIYPJIRl5C+Y9im12RroE8PV0Jfu978si\nsJwpQcAycHaJwNJWCsMdpUBKzGDAkgiS+iWC5XA\/t98s1LvaS\/L\/EuCD9MXGleDRzMrEYZZUkikV\nVDOp5tBHtAH1PwJCgMlvzF9WCQyc5WNh1ZjoBgRfAZ5eAVCxS+NKmMdiaD1im9a7vXgQ7i7X4jpV\nbD3GKhbp7OC7x3vE+S8MQsQm0Xu6BSZnZ2nab1ahpzQQd2qRFS1j5tqkDtmsg8zVeuZFAj7j1qLc\nEhi8wOf8FklmHGUmv27GdXAHgXy\/dJBZhd4l9n19QgaIwrYZr4TVxwB6e0UZY8tj\/ZPCgKY1zXuU\nsBHWwg1svvTRFTy6iL2QVQTOTj7OYrYQMZeerc4GBL9Z8OpYY\/aZytj7BICYepT2n9AeBPA6Frbg\nVWKYJOQ9VCL7HhVNvowNyjFAImg\/sefJdjRpl2XI+FQttYXfbzSwmUCSx0iigFnENiaZyJvzXi0s\njlcjs0oIYlhWJ9RwB0FszRzCTWswSLWwEdEj2\/hwdbAeroEFXwWuoWApNp0qxj6Ka2PAYkMqmLCW\ng729FKxnnzq7Obu6kcxOla2HNYwV6mvkCaqQs0sYoCV\/JSRHayA8oICApRwvAkL0VxmsopfuYjHU\nlCnl66EaSIw04PMW3Jxpgq3Z9+HW7HuwlTyK7amOSWg7V8L2IRKolz7qk0RGZEACYz1l3LYHnV3S\nRktrUWa4g882JbbiCCzhUsNy8AimTM1YI7kpzb9cPgT31upYOFLopxgWQBKR6ek2Q2czzcQ2+dB2\nvoTZI2AWwjDOl04XY0hU2+EjT5J6BI6ICprF4Gjnp16Y4Pbje\/I7Thbyvjq5j9eFXvBbqlOTwzoE\nkZWWWgx5ayWgYmzEMdEElAJAjDzYbGABIp8SaAJP9vD2CGHOU4MyCsBxsZQFgv5PTJKVaKbfaT1U\nhhvp4j97LDowLKF+USNK617yKbnVoIauU1yM9cSqhwkrYwmk83dz+gNYDlArUjIWNhA42YPkImaI\npahNih6VUroN55sLeeOXKtycI8vgxsMzm65q9\/Gh4JHNCDz52tUp+JNJ+NWYh5IYGCNYCfUm8sdv\n1+u3E0gMEli3UYAX0aLUwLlizvhZEecyKtMRmwY9Wolezj5JbDsxOwaiVwydn+x94rSIu99p8\/Qp\nMglnVloqhrrDil\/F+indJT3dZWB9+ja+HjsmD\/RXZWY9evxAD2uhWpa+VLAaN63AyjR4lCnAfLro\nmVvyyWO7eOc+esNg\/PxNQ++p\/YbeL\/Ybuj7dI29tLnjuVev4kV359P5Qe2malGEnk0OKyRbieV5K\nRT3\/Jt709u685nd38To+3ttGkccPSGIOTwnOfqGYu3CisPFlX0Jbmgp2kvwdJwp5NLc2FezckRu5\nkRu5kRv\/j\/EHmvGLxnV4hOYAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pepitas-1334213193.swf",
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
	"no_rube",
	"zilloween",
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

log.info("pepitas.js LOADED");

// generated ok 2012-08-23 11:01:57 by martlume
