//#include include/food.js, include/takeable.js

var label = "Eggy Scramble";
var version = "1348008053";
var name_single = "Eggy Scramble";
var name_plural = "Eggy Scrambles";
var article = "an";
var description = "A messily scrumptious pile of eggs.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 32;
var input_for = [];
var parent_classes = ["eggy_scramble", "food", "takeable"];
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
		'position': {"x":-17,"y":-18,"w":34,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGx0lEQVR42u2X6U+UVxTG+QdaY9VY\n40IwarW1nWharW0j2rRWa2tT4\/KhpiQ2\/dB+oa1+KHUZBVxYxpFNgRER18YFBKyKAwzDDgO8MGwO\ny+zMAAPMDJvAFJ\/ec18YqdrGxFiTZm5ycu\/c9wV+9znPOXfw8\/MN3\/AN3\/AN33ipA9YdQbDvlcKy\nQ\/rQvFMF8w4nW2fQZ49ug3Sw4i3JywGzbA98aPvFgK6DgO1HwLJzIr7hn0d1W+AqWQZX0WLnYNES\nyX+s2k4JOn4QHkGxsAcD3WFATzzG23bBo12DsbrV6C97E67iJXCXLJG+UFDYtvoPOCsDH3SlBcH2\nsxOdxwDdJ0DrRqB9M9D2ubju+AlcVdO3GKp6Dz3qJbArF6CvcBEH7dLslhuac4N0Ot3zww4ODkr6\n+\/vl7j4r99a4dSKV9r2AMQhoXsdiPdDyKTz1H2BUWIXBSgk8LZswWh+Itozp0F1\/hYfp9gIOSOHQ\nhsBkMqG1tRVNTU2q5ubmoPb29mnPDDY6OioZcplTR7rPOj2WX0V1GAQP8ltniLgmQNP3QN8ZjLV8\ngQHNSi9EZ94iWHJY3F0I8x1\/cT0RnQUr4GiKQr\/Ljr6+PthsNjBFodVqU\/8V1OPxBA4NDancPTp4\njAS2jSm1GzydpBylksBopvTS2rwLcMhED7J3WOWy4niDQ9oZpE25yAvdq17sBae5z5SN4eFhPHjw\nACxTMBgMqKurc7II\/ru\/gGkjIyMZbrcb9+\/fF5Vp+Yz7CMYdbN4mAhq+Ep+R1+x7RCVp3\/j1I4Xv\nfwzot3A1O5QiDM3d+QEs\/OFQBcCaMx9mpqwtfwUGjAoOyLKGsbExDAwMoL6+HoIgZFRVVU3jcOyh\n4HQ6aRP9tds4BFXhn\/UfTvjssaCUk4qTxTG5T+AThxkS3udQbTdnwXBrLgelue3mTLRmvMbW82C9\nJ6rrrv4Sg3o5Rod7wLII5n1SEtXV1ankNznJXFNTQxswlX6HzqI16K9ei4etmzBS8y56C5fyAnjY\nuPYx2PWiYlP3JpR0lUsY4EIO5ihYzKpZDNuEqqbb\/mjPnM38uYBVuahsbUk83CzV4+PjMBqNnMmP\nZO3t7QWTkwM2VF2BvXaP+IeZOlSV5ntvw65ejeGqFaJKxq1iainFpp1PVVlMaQCH6VaJcA7VQrTf\nnA591kyW4gAY\/1jgrXKK0oztyC0oALMbLBYL5yEFvYDa6hyM1G\/AiHYthqtXw1a8AS3Kjci\/dRQV\nuWFTFFz\/yHO0Zntkh8GKdzBQvtxbJBSURvIbpVaf9TqDmocupmx75iye6qmAtTeW42bW79A2NvIU\nFxYWwo9MySp3MucoLS9HpVqB6rx9uKNUIicvD4XFxegu24ghjQTjDR95VSIoAnocajJIOapW0+35\nHMZ0R1RNnz2HAb3KofRZM+CuXMk925EzF03XZ0MoSeHpvXT5suAnCLVOkpT6UUNDAy+U2tpaDkzV\nRHusmUJge5pChWjq0mVeMKrMyVtialCLobZCa2fRYq4YAdVfD0DNjVXe0GUt5b\/Dcns2mrJWQMgP\n4wzp6RkICQkJ9EtLuyBtamrm\/Yh6EeWeNcwnAFm35y2ojtmgWH0D6tyzUGZHQ5O+jvvKencOV6BX\nvZCDkUrtmTO4QvSc3kvPzn5qKLOjUJ5\/GkJVIRfn6tVrCNm3T+7tg+fOnU9VFahBrYZKnNLe1dXF\nG2cj88NUwJaWFn5FsY4PvV6PRvasUXMBubeiuYdIJUpTefpm3M2MeCpQUWkpKjQalFVUoKSsjAtB\noiiZpU7GxOK3\/fuDn7hFzqalBaecPYfcvHymnhbUtF0uFy+gjo4OXvZtbW1PANIh6F7Vs7mK+aaC\nFVslCw3zc0FREfLUaihVKhQwH2tZNuhn6aB0aDo8eS2LQcfGxWP\/Qalw4MCBwH+86s6cueivSElN\nTVakGC5euoLiklIGYeCQPT09cDgc6O7uht1u59BWq5VbgsJsNnuDgCkIng5FUHQwum8JLpcVXtr5\n8zh67DgOHQ6F9NAh4eDBw0HP\/GUhKSlpmkKRIk1KVgiJSQqcSUnFtes3UMBswIqKK0eQdMlPBZ2E\nIzB6h7pCGUthZmYWrl67huRkBSIioxAWfgShYWEZhw+HBYWGhj7f167ExBRJYmJycMLpRFXCqUTE\nJ5xGXPwplpIExMTGM8\/EQX4yFifkMZCdOIlomRxR0TJERkVzmOMRkTh2PAJHjh03hB89Kg87ciQ4\nPDzc\/4V9cY2NTZTEnjoVGBeXII2hiImTyinkMVIZhUwujZLJpFFRMmlERHRQZGRkoO8\/N9\/wDd\/w\njf\/x+AsZV5tCVxr+jwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/eggy_scramble-1334189887.swf",
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

log.info("eggy_scramble.js LOADED");

// generated ok 2012-09-18 15:40:53 by martlume
