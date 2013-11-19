//#include include/food.js, include/takeable.js

var label = "Legumes Abbassidienne";
var version = "1354649278";
var name_single = "Legumes Abbassidienne";
var name_plural = "Legumes Abbassidienne";
var article = "a";
var description = "The most sophisticated, chic ways to prepare a bean: simply, classically, with a smile, a touch of flair, and a really big guillotine.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 22;
var input_for = [39,40,331,332,333,348];
var parent_classes = ["legumes_parisienne", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
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
		'position': {"x":-15,"y":-19,"w":29,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFeklEQVR42u2Ya0ybVRjH3xIXl2jG\nNDMhMVnVxPsS4iYkmiwNxsQPfiBxMcA0NnKLGpBOGUucrM65DJZhASmXMqhbSaGUrVCFITSCwLp2\nBMtMtiK3lzuDAuUaPj6e55TTvb0zJOFLT\/Lv5eW85\/yey\/\/0DRwXHuERHuGx96NYy0kq6rnI\/7vO\n7b85scXCZZktog6zNUKxa4BFtZy8UMs5i+q4eHbtZMpb4oSUmKyP04+FBN+C4u9YI8BTnHR3AOu4\nrMJaEaAQNiH17XgC50xMjYXElFg+KSXW70bmu5xECGbqEoG+VQSdPREKzOauZRDLW1jL8Qwyr\/pJ\nZ8qpN12ATAS0s6e5Y2NjQ223n5BiGRGqs0cEN9tEUKp33Uul5Qy7Ama1ctEs0uI6Ltq9gWsTZ\/bF\n50EImSN\/Dyx3j9JsNf\/pBbWlc8XPgOwHMZ966o14YQJw\/ceCI5vIWWkwG6SP4ou0nNR7wx9LD4A0\nIxryCsVwx\/I0dJtFcK3J9bcr15+AM\/lRIDt\/GNKzX4NPvjhKA0mXfUAzWFLDiUmgCiLbjjLIyiRU\n618HoeY3z+xUGUQUDJWvioLM3JcotDC73+a+TqWpOwaj\/FloNyfyWIVS\/UGobzsuSUiOjU5IjVEk\npsZ04OeAUElpMRLmzM3NTcl9+0dOX\/c9anqE\/UVH+lJ1ALLPH6Ewp3NPgFb3KTQY3gFjy1Me92BP\nYkAsOIvtV7iqyfcIBkF9wPDYQHo6gTj0pysZfF\/\/bSBND\/YHBbR83oB\/mPZD6dUoSJO5soVZU11\/\nlcx90W9AaBYMhsGdufSKBxgTMZsTzba+vi51Z+3zzDi\/k9Nl70NxqQxM7ZfAYomjG1VpnoPvLrzs\nnoOAeM0fFAZRY9jvY5izBYd89sLMNzUVw+wMD2tra0AAOzjyoiBCYujt6wSF8hvIzPnQLywukPz1\nu7TH0BxMWDJ\/Old4iM4VgqFx0DTe6xoMBTBwvxsc89O0altSIyDPLkxP\/QtDA2a41\/c7tDQr4bLi\nS5B+ddxdPnQkbuDtZGHZhCB4DHl\/Z05GYSIMjYUwOGCFhYWHbrCFhQWw2WzQ1dUloRlcWVkRUlM5\nnQ54ODNCJppAU3uZRvlo4TjQGyLp0YLlxXc0A75n5LiMkiw7QqHw3MMsCjP2\/YWT0HqrEkaHbbC4\n6HDvOTU1Bb29vdDY2Ag6na7DbZDBwcGO0dFRmJychLm5OVhaWiI3LoI3+NjYA+q40\/Ikjw1rdM96\nOrVrHxjb9sHFn8VuA7FStrVdA37kH4+1h4aGMFtgNBopXGVlJenFJvdBzg0PD0txEhP5TqNBTU9P\nw\/z8PIVeXV31AEaXaxuUIM9Lo6ZBoyCct1GMzS8QAA2Mjw24wZaXl8FutxPgNgrG4KqqqlC8zzFD\nssgLIRmgt2ZmZoIC3zAWg\/HWZ3DTeJjC9d+TkiDt1JXC\/mppaXGDMSFcSUkJltf34YNAyYWAWO5A\nkELNzs6Cw+EgPev0ARaK9Zc3FJNaraZwKpXK2d7e7vsINzIyEikEHB8f3xYgE87H+7x7WdhfoeBQ\npP\/kAX\/mSJnVOwFEIGFwQgUDY4ZgcEqlEvxmjw0SfTRbmOf5bQOiqfzB9ff3B4WrqKhww6HKysrU\nIZ9g8Mh5HEAsaaDsBQL0B7el0E\/Z7MghPRkSbmxsLCAcymq1+sA1NDRgpjzAqqurnfX19Vnbfg7E\nIwfLhlnEXpyYmPCBw2vB4FBms9kHDvuMgaFj9Xq9PGjfBetHApqFxmFnJGYVS4rggfpOqO7ubr9w\nCKbRaHYGFgRYjOUXAoeSyWTygCsvL+dJOaW7ChZobJ2b8UQKAmwLBKjVahGOgu3pfx8EwHJ2EpCf\nLJ6UdG\/BwiM8wmOPx3\/hC5vBNJCNnAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/legumes_parisienne-1353120347.swf",
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

log.info("legumes_parisienne.js LOADED");

// generated ok 2012-12-04 11:27:58 by martlume
