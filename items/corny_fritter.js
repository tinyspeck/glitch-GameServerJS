//#include include/food.js, include/takeable.js

var label = "Corny Fritter";
var version = "1342483399";
var name_single = "Corny Fritter";
var name_plural = "Corny Fritters";
var article = "a";
var description = "Some delicately frittered corn.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 39;
var input_for = [];
var parent_classes = ["corny_fritter", "food", "takeable"];
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
	if (pc && !(pc.skills_has("cheffery_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/69\/\" glitch=\"skill|cheffery_3\">Cheffery III<\/a>."]);
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
		'position': {"x":-20,"y":-18,"w":42,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAExElEQVR42u2W609bZRzHeW+MMTHZ\nCzWLGl9oxiVjiENmB+Myrs2ybDq3hcUZo2ORmRgTo6b+B7w0RmfNyMaUyy4yICB0lhXa0lJ6vwG9\nrJQCbU\/pjTIuX5\/fo8VFB3ERoi\/ON\/nmPOc5v\/Z8nu9zaXNyRIkSJUqUKFH\/a8HZ2MTcmtRWK8LK\nMsX9gUOCrbNI4estVawY6xQxdaXCcr1QmGwr8Biu5LXe7yuRsXoZHA1STFc8tbtwU2+1BAcPYeHu\nYdh+LMT497nQfrcPtp8OIDQsgfV6Iczt+6H\/IQ9zQxL4e0swc+t1Vl8G07X9UH+7TzFxtWD3QB+Y\n6gzenoNwdBRxmKkbxQj0l3IQ788HeTvEwOLaKj4IuvfeKYHhSgGMbQUIj5QjqjqCjLEWwmiFITNZ\nK4ezPn9n0nM3SJK6ap4IwWSvBEQvJChKN5swXek5wYeV5YiNVfAaMt0TPAEvKsuFHYFE6HPpuucC\n4D4JOKVYszUgOlqNhXuN8PeXcWByFojACZBA04YafqU+gqc6SjI7kHVrw7+DnOt\/Ug5vMxK6U8g4\nL2LFfYm3UxOnkZ44g2VHM9KWdxDVHENUd4YlU8mhHk6aEiQgGgCZZiM9WY+YVoq4hiVs+tQQiURk\ngiBIotHo461RT3dOU0SVKyTVx5HWnkRMWcu9NFKP+L0G3k4Zz2HZ9gFWZy5hw\/8x4G9GxvU+N6WV\nhSU4AqPngv4UXF2vIK15EWENm5FoFAyQOxaLeZjlS0tLLYlEQrIlnFarlYyPj8sXvR3C0tgxJEal\nDKgImH4XsB9FcjQPCVUjlrUnNsFjyjokWC1BP3BfxMbMeVZ\/FvC893vSLGWCnbpZDDfbaBr5C9B0\nHgd7D1wuF6anpzE3N8fNUgUDRDKZxNramoFDaTSafOZWvV7voQ8EAgFEAkPw91UhoqjBXP\/LCPY9\nwe3s3IOZ24chKOsRHKjmgPGxSqw6P8TqZDnCw6V8AGnbBfgHquDteQ1h\/SfwDzbC2F4Ew9UDGL58\nBGqVAuydj7TT6eQMofl55KjVail16nQ6+P1+zM7OcgeDQbjU38DS\/xFMPeeh7z6L8c7T0LUVc1s7\nSuHsfpMBlLEBPIfo3T1YGHwapvZXMf\/LUSxp34aPAQb7nufPnF17MPR1AYcbVXRuCcdCgtVqg8li\nUdhsNklOKpWShkIhgWI2Go2w2+0ckOJm\/dzzbCR073a7eY1BOwRt71fcBK1vK2Tn5LPw3XkJKU0+\n4DoBV3cuXL21UF3Ow6g8F6pbn20Lxr930giz1So3m51\/3+EAJMyt6XTaQEA+nw9er5fDLiwsYHFx\nkTscDnNTH9XQdJjVXdD9eg3u\/jcQHnqG29JTA9XtLzFy84ttp3OczZzRZOJgLLG9\/+wMBPYyNzHf\nYAtWYLuLw9G00yKm3feXHcjN4b098Dn64HA4YDabHwlF\/TSVJrNFeCywbYB5uhsbG55MJoN4PM53\nGkGxY4Gb+rL92V3Ilg\/38vIyVldXQZ+dZ8nb7A7BarXL2LLa+d\/oP9JtoXSZN1\/MlsamCYi8srKC\n9fV1pFk7EJiF2WLdPbBtgKXZdPGQCCrINtbU1DSBeSwWe9N\/\/9\/xz3RlbGpllBY\/KkSJEiVKlChR\nW+k33SttEnOuC4oAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1280261442-9486.swf",
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

log.info("corny_fritter.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
