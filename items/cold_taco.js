//#include include/food.js, include/takeable.js

var label = "Cold Taco";
var version = "1348007876";
var name_single = "Cold Taco";
var name_plural = "Cold Tacos";
var article = "a";
var description = "A refreshing cold taco.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 69;
var input_for = [];
var parent_classes = ["cold_taco", "food", "takeable"];
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
	if (pc && pc.skills_has("ezcooking_1") && !pc.making_recipe_is_known("102")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> a bit more."]);
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
		'position': {"x":-17,"y":-26,"w":33,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG20lEQVR42u2Y+VOTZxDH+Q\/kUEgA\nSYCqoAJap3WGgkF0akUwKtqWVo1aT+yIIFpGp9CKtVUQFERuiYiKEAnVKuAxqdp6cCRVEIiooCIq\naoKQcPSX7bsb3xgghohH2xnemZ33hTeZ9\/N+d7+7zxMLi6Fj6PgfH13nvHldp30FqnSrYZoS\/8T2\nPJfE\/wSUpnSql7Z0qlBb5qfQSj+E9hx7haZ4kkxzkAcd+zkCVRaXx36+o8CDXuC9AWpOTWnU5I8G\njcQDOg65QofYERBSc9QdOnJ50C52VDNKNjJnmfaYJzQn2UNhtI3wvcBppRNiOvKc4VEyBx7u4UDr\nXl08TeWCKtOBgDVHGPiCcQy4Pd1r2mEH0o02kB05Akp2ucCVTI8c+cGJXm9PMXmgV3dlkFRTHqju\nlguhWx4M7eXBcP9MINRluEFTvA7yYbI9Kak96QOdZf50jYpqf\/2IXuj85uGQssYSsjdZw8k4PlSJ\nPXMqC1zeLPVdlbNF3VVC6KwIgpYz0+Hp+c8A\/6b4KwQ6q7+F28V+UJfiCo07OfAggQOqDC60Hx4F\n2hIBAZKiTPrb8j1AlT8RTsWOhLT1VnBwiy38kTZWLc\/1EAwKrrsqKJEUewHYKpsBbX8GvASkmAM9\nNaug+excUIg94eZuJ0rpM7EOUJ3JJUhMN0bLbg6cjRoOCcstISvSmtREyIoDHq9Xo11Vs3N6gwwQ\n1xbC86oVUFvoAzXpbnB3FweamUAgFo6tydvMC0girCFpjQ5SzABfzhqnNrsutfIgIavca4ViAfTU\nrderqUzik5pt2Q6gPTGZarE1dSQ8S+PCkww+ZIdawe5VOsj8H7kgF3upB6xJVeX0YZ2VwsZBAbIp\nv7GG1Lx2aBJBIhQCorOfpHDhfpwdRd12W5BE2cGZWEcQf8cYJ96ZMY6XwiQkk9oYYw++KfUFzdVA\ns0F7qldAZ806gsS6RBc\/z7YnSNV+PhkJU64pmgCPMsbA4QhdPV7Y54bqG59GXfIAHgOoNnwQ61pl\nka8Rg\/QPNBL7HYREJatzJ5LDsSbb81zJNA+SHAnscbY7VMSMgKSVuvYjjrKBihxPMOpsNEbr7zP0\nD2u\/PItaC14\/OvepWco1nZxKoVeydh20yBbA9ayxekhUDps8phnPpRF2EL\/IDvautdL1SCbVCrGX\ntF\/tDa7mdIHpx0CVUcVexqnfAEqpH9SmjiLToJPbsuxB+ZMtpCziwOZALuz5mgfbQmxg3zrsjyNA\nkTsB5HnuvH4NebChujiTwuj960tAVb6MHnorwZHGIqpYvZ0DmUv5cCJsFJ23zudAcqhORVnyaFAc\n8AwzBFS8CeCApmFSjSqWxo2FzOVcWmg8z3WGs5FcyFjCh5TFfIieZweJL2qxMNYBHd1IcHeOefMG\n31bMb+SsimmrnGDvN3yCxEYeO48LkTO5sGW2A8TMH061iGbRp7le4hP2zgENVKxMdSegS9EcOB1u\nB5sCuLAt2BHSRXyImeNAYzBzgzVcyRoPNALvnpomQ0B0rakH9FooGJijlylMTpov9CruFPEIEg2C\ncHiWrP2ArhEwPdwKLqS6YR3GWLBtAZuxqV5367ig30vgIuK1GjizsEAVL+4bT4AJXzmRQRAMAxXc\n+qXOzS8mi8wCH4xfbi6bZlINBEGgwbYhumbWkqqrIlIxJdSZlMPUfs\/UHwJjbAzgMGaxghM7eDT6\nLHBKIJypB+B9bCPmNuy+ca\/Uv1fbMVQRIfGMkAkhThA1iwtxS3ULCHwRi\/oiXzWqaCq9eA8BByoD\nswCZBQWrYuJyHgHuX+YMscEOcGS1qy71K6xeAjYU+QqUEh8pKnnnNz9SCWvNWDpf9f++gZ\/BYGu2\n73dwTqOKkh\/GECAqh2BYg5uFtrBnteVLQPa4XTBpWH2RtxBhUVVUC2FRMVNQCNFXVfwb6w4NaFRx\nZrvw+GIIXM3y1NeeYcQvs9SPvFcuvZTHPvbCHskC48NYdc1NLbYmtj2x81q\/bmRmdM2RyZRmnCbo\nZqpJRkGcKGyzNnsbYAjcIBWosa7Q9eYCo9EMTYYtp6ksEI5vd4NooQPs+HwkOfiXxZbUZo4yKdaP\nu8EcfYERANUy7Itsa8KXwXu90s2Mv6eXFpNKPy+0h+j5dgycDe34cB5LdPNY9tb2zzjTlZJPRDeL\np+Qw5UAKo2LstDFWx53VobTqxtULQhlGaYIr7Z3f2a8QuMZsOT0trKF4SuK9En81OwjIQOVzqR\/q\nN1mMiqW7XMi5bNDK+m3+AjHgVrYhXPC3MlzUXR+R2F0bLkM4NAq7oEVINrD2mDks+vd\/KZMvEHTV\nrBT1KCNibhR6C3EvgvHGP4kMHUPHWzz+AZlgJoNqRy3PAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cold_taco-1334340321.swf",
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

log.info("cold_taco.js LOADED");

// generated ok 2012-09-18 15:37:56 by martlume
