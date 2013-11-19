//#include include/food.js, include/takeable.js

var label = "Spicy Quesadilla";
var version = "1348008161";
var name_single = "Spicy Quesadilla";
var name_plural = "Spicy Quesadillas";
var article = "a";
var description = "An ooey-gooey spicy quesadilla.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 86;
var input_for = [];
var parent_classes = ["spicy_quesadilla", "food", "takeable"];
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
		'position': {"x":-20,"y":-18,"w":40,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHtUlEQVR42u2Ye1CU9RrHdzpnauZo\n7WhjnUMnWUGIvEFoloDiJSwtUzNTglwDvFZiaUmXadOaOnZOYjVFTdpqDsrNCNLkksP9vuyCihoo\nC7IICLhqZp7Tab7n\/f7o2dljfzSseDrN9M785n3f3Xf4ffg+z\/N9nn11ut+P38Bx1hrr3VERZTx2\nYLapteQxU68tztRRFW2yFywwOq3Lwp3WmMBfDazHGlegAeFMzVK0FC7EyYOP4FRpJJq+no\/OaiOc\n9Stx8fg68BmC\/8\/gem2x8d8eexYXGtYokMa8uWq1V0Tj2IGHFGB3bQwun3gRaH8L5w6vVpAdxdPN\nZ\/N1+msK56xbbv6h5TVwddfGKsDW4kVKveO5DytAqsjP\/2V\/1fVPEJjP2bNuMl1L5cxU4vyRp13K\nNRc8iqNfPajgHGWPK\/X4OYF4T3C5b9PubSkGnN6v874mYRU1CEUgp3ka7DlzFeDJ5KkKht91VD6h\nQiqKMkeZEgTc83Ywls83GAc2rFo1SjEwz7gxoQRMrqkez5KHLBw+z3T4vmkDmgsXIOklP9Tu8M0c\nUMAeW5yNqnAznpljCijtvp8BS7gJJ0oSkIVyLHcO9r83HL1b\/oSmBJ1pwELLsFIVbsxE55kKMaTM\nLckzUZC5R3AWEcHEamoypuHzzUPRPetWVEbcbB6A0MYEUgUCEJBwrbnz0PzVHJdq\/E6gxQ8JTSDm\nHb2Q18y\/ipQwZEfdgJqJetSnTsPVGbFlub6jaolNEp2bUsmurRNwIiOiz5TztZUaodQ7W78KP7a9\noSCZAlTxJ4NWqy5rJgrNQTiwZTDeWReEw\/tm4ipDG5fIMHEj2UzCSAACUi3ecykj1tSmmjwTVOD4\nGdU7mnEL9v7tZqyc74PS3VNxFaGNmyu5RduQ6mVICSlnLgmttDWGlUqyg9Avz1ieVLlnSblTwa16\nxBefbJyofRYOj0NrL3zUqTpCSaTakKFsMU\/+r0rl9y1ZsxVkb91y1dYuNT6vniccuwjVO7TvAZTu\nCkLm28MQv8gPeR\/erSk+B+UpYQUeAZ48uKCAqjGszDkudzABZXh7yp9wtTVRmmZOWzmrQdNWij+b\ngJyteiQsCUCC0Q\/tRbNQ+\/k0lKdNDu83XHtFlJn5wg0l0V3e9sX9alExCb3YjcC5F0az9g+UJt+L\n7S8Pw6uxflj3uD\/2bAwAikejOyco0wMzjjVK\/+zcMdVVEJJroprkouQhYaVyxV4a8+eponhjpQ+e\nWzwS66P8sWKeDxqzQuHYH+ws2xvi3W+\/0\/64k0oQgvlFK+E9AQhFCC55hnByL+bsDrc+yoAlM71U\nUbyybBRyt09Xoa1MCYvvd1F0W560yThEOG7Y+49gFcILDfH496lN6KqJgX33dFxa76u8j4qJmrwm\nHHOOcDnv3oZDW3xxJHksWou0tlc0H\/XZESjfE2rrd2g7q5eYqQI3IRyvCUqFHGVRqjI7qmJUuOlv\nVE+8jqpJv23QQAmX9\/c\/o2PZUGDGCDgyJiu4owdmaXBhzqqUsECP\/I4btm8PQ3dplCv53QtBJhXp\nsVLhasLRfI5WQriqnbegIe46WH3\/iN5A7fqFsQqO31WmhMztd2h7rLF2GSol39wHAimG05VG5XO0\nEPdiIKw1c4YLrnv7YFxMM6DtriGoHTcYDXvvU99VpIb2f\/7TEtxMg6VfMWwEbPpyNjq2BPeFUzvL\ngHC6cqnqEpxOpIWx+VelTVFWUrZND0eaDhW39i0OA7XbJnkOd\/7omngOkOeO9E3IotyVbUyKhgr+\ns\/kV1SUYUsk3mnDJx4Pw9ft65XXPLvZD5Y7xqE6f4lnOid+xIhkeLhmXeCYclSMck195X\/Fi1bao\noKM8WvVVwnHwrE81KDh2CcIlLPXHvqR72MYyLWnj9R7ByXRB5Zh\/Mk65j+3MM4Hk83xWVOPIlP\/e\nIKS+PgSbn\/JW\/XVtpB+2agVRuHOSvd\/F4P5D+1TJIqeMRJJ3ElaCiglTWSkCAeMq3zEcJR8Nwlur\nhuPdtf7I3uyP48kBKPwshB6X6JFqclw8vj6RY1BLUaRLMTl3VsepEYlLFOaAKWBVyWPQmjcO1p3X\na+E0KLDv1ozE+YUjlPl6lGtXWsq5w085O6v6RnKqJY2e4eTc5jy0GvaiRa4c46pO9oMjywsX8oep\n9WNRX7PvjfFSPtfoM8g5MD986lYUsCOwONwnZMkvtiixjNwkP5RtHIqTm\/+Atnd0+D7doKB+KByD\nMzl3oW3\/eJzZFWA\/n2TAhW0j7APyNoAVSEB6XleNUVNqoYIq2z0FeR+PgyU9BJa0iVqv1TwwUofO\nkBvRNUGPJi8dHKtvhD1vhrPPOkJtLAJYfPQoDghHyeirC+2RfbMSOV0wnyzp4Sg2j8euTaPw5mp\/\nbIj2wYo5tyMh+jZsWvZXJK71wuUMH1z6yIBza\/6C7gjt5+G9Q9Dkq0PdB\/52jwz3l46K1DAT\/\/PG\nnJlwZAehJ9sftk8DlDXIeuaxkepHTFnSHSqUKsdyg1CTFuq0vDYmU1PRdGqD7tq9lSJkeUqonUlv\nTZ+EE1l345u9wSj5JBDV5rFwfDGmDyovyPbdwbEFlwtGm6+sSr7s6fpS9+u8iETZnd5KuaLRRt3\/\n46EAS0aZeP79hfZv7fgP4ryYAaXX22wAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/spicy_quesadilla-1334341630.swf",
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

log.info("spicy_quesadilla.js LOADED");

// generated ok 2012-09-18 15:42:41 by martlume
