//#include include/food.js, include/takeable.js

var label = "Garlic";
var version = "1354597650";
var name_single = "Garlic";
var name_plural = "Garlic";
var article = "a";
var description = "A nice stinky garlic.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 4;
var input_for = [60,73,327,345];
var parent_classes = ["garlic", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by garlic)
	"energy_factor"	: "0.2"	// defined by food (overridden by garlic)
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

verbs.eat = { // defined by garlic
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Caution: think of your breath",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.isOverDailyFoodLimit()){
			return {state: 'disabled', reason: "You can't eat anymore food today."};
		}

		if (pc.metabolics_get_percentage('energy') == 100){
			return {state: 'disabled', reason: "You already have full energy."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (this.parent_verb_spice_eat(pc, msg)){
			if (pc.buffs_has('buff_garlic_breath')){
				self_msgs.push("People have been warned about your garlicky breath. It does not affect them.");
			}
			else{
				pc.buffs_apply("buff_garlic_breath");

				var mood_amount = Math.min(1 * msg.count, 20);
				for (var i in pc.location.activePlayers){
					var pcx = pc.location.activePlayers[i];
					if (pcx.tsid == pc.tsid) continue;
					var my_effects = [];
					var my_msgs = [];
					var val = pcx.metabolics_lose_mood(mood_amount);
					if (val){
						my_effects.push({
							"type"	: "metabolic_dec",
							"which"	: "mood",
							"value"	: val
						});
					}
					my_msgs.push("Something smells funky.");
					var pre_msg = this.buildVerbEveryoneMessage(pc, msg.count, 'eat', 'ate', failed, my_msgs, my_effects);
					pcx.sendActivity(pre_msg, pc);
				}

				they_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "mood",
					"value"	: 1 * msg.count
				});
			}
		}
		else{
			failed = 1;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'eat', 'ate', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

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

function parent_verb_spice_eat(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_food_eat(pc, msg, suppress_activity);
};

function parent_verb_spice_eat_effects(pc){
	return this.parent_verb_food_eat_effects(pc);
};

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Garlic Breath buff (your breath is icky)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a> or purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-25,"w":26,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIR0lEQVR42t1YaVJTWRRmBy7BJbgE\nlsASWIJLoKpBVGxlEFQSICpjIBCGEIYAGck8kABhCMkjgRBQISi2\/jx9vvPeCyDSbXVZmmqqTr0h\n957z3e+Mj5qa\/\/vfl3zy\/l\/5ZENFCqm6qgFXLqVrL\/bXiIFVpJRylb8epe9WCcBM7bGyRvvrHtoO\n2iix2E\/ukXZnVbn409E25Td8AjAwZaw+gBelnQpAz1hXdQIsbgerE+DZUe4uAL7PxgVgyNZLK4Ot\n5SrK4kztu3yqkiQA6DF30LShubYqAJ4ebd8HwNJuuALQNdJO06+aqsPNFyd71s\/Hu9fKzFL\/U7L3\nNNPUq6bfW7DPzrJ3Pr\/bI8QgAK57Jii5PEQLr1touf8Js9hYnu1p+j0F223prGfXJtjFdF7cEoDx\npRGK2E3kHGqlBdMjmut9SDOGJsUx3GaaffPo17DpGXlW5zK3KZG518TupfPSLqGTlDkOdYA+SxfZ\nDE0038cAu5vI8fYJl55Wcg8\/VXzmNidLq8\/cXu8d6bj3U0CtTnTWrY53mHxj7WXfaBtBipwUcO9H\njr8PhXU62YtS0jkmLtYZBDgB+KaF9H2qtNOqpYP8489xVbzj\/xFoZMpYF54xKpHZXorYeig4+YoY\nJOG5lEvQp5MMlTn+rvbi2Pwbmjc9FlA6QPfwMwbTKRKY6BI9oeluYt0ioWkD3in+iRc\/Vpqiju47\nUbvJiYxcWxpkGWJQfaLcP9Gpnb5TAGUTy1TMRCsA0YsBatb4QFwM14IprA9OdctBRex9FF94qwof\nKsYhg4MzcGt0tPvOreBCM733eEM5uTxM6+4x2nBbKMrK5LSsGNeA9YUAxfWq6ODhRgFkfUkhBgWG\ndLbCsz0U54MDGNgGAamVEQmNxOKAAA3bjAmQdBPcVHc9LygnecOmd4I2POMU5Q1QJCdlxbiHURgT\nJuB+LQTEXfwbwOKK97E50+V+MDWv6gMBOih4CESsu0blHusA8noijHfejbIbD1KLtOWzyoa4uHiI\nADjlNItAIbtfDCIEEo4BVcAKK8ZvYXFjb8W47F8xa0wN05pDDRsQAJ24T\/C7Td+EeA3POEhkxthQ\nARiYfJlQYjba9k8KezCa9loE6KbXSunVSZYp0uNSBT3Kpx4TwT3ewTjAg3m8AwjZ71MFugECayF4\nJ8\/MJvRmo3bKscA+Qktlb6y9DlkFxVCK0xyuL8niLf807YRmaTc8JyD12IQhAMbvENyLcdeYrJED\n+iZpOzCj7bfTDgsSacuvrgV7G9DD67BPEpJtn+X84m4tnOprvOY2qw4QijPBKfp6nCAlsUi7kXna\nizsot7bCLphkRiwCZocNAXQmOi+CexjHb2AdIAEsE12gbHyJ9y9LxkPXbmROgAtIdn0mOiegNhgU\nMGz5xsWTuA\/NGKw1qO6oTVEOaPj\/fD8oAMv7IVG6v+6mQtrHvdYipwcTe7FFAa0knSK4x7udkF1A\ngmU847f9DY\/sz2\/6RBd04uBgHocBg+f5EO2FbcIgcKScIxJOkZmecg3KAmocAlyJ2elzMUonu14B\nWdpZpYOtABtyMYNWYeVDNsCtLSwGD7b8IvlNLykplwqSmUTcZRgE1hzvhekkF6XzQow+HcToYyHC\ner2iC+vg5uKmU7wjCcLxKwkIgJxwcLHCcSg+P0ozE2E1Zk5zQTpVwtLW9mIOYQ8nB3DIaZ4PosTo\nKBujw92QgAGTcCFYxJ5PhzFZ+6WUoItigs7yMZ4dA+o6La6RSHA5rkgWANQrBUqXxCAKLF6k2f+g\nHAChBK4pZiJy2i1WgpjSAV6Vj4dxOcyZEqJi2i3uQ7ydZPldIUHvDzcIg+0R9+xCevUWgJcMgjlc\nubpQDSYLuBgApUhrrswmliR+DneCAloH+LkYowtmplyI86iVFDkrqADfs\/uxRs9+uB+gjrl3l3Jx\njWmvGodMQlqrufCOZDJikMsLJ4cUeg9P51Jq\/NauBBCDYv1EMJTjIIdCbNZdjNPDnTBWyt7uYujA\nAQEShzzYDohH9FhF1m9KsR6VWERGozlIT5YW2c1Dx2PS2tzLBnQSVH9sAGNgQM9WbE5rzMJ1MHI9\nSXw3kgQ6wBTeI3shueTVbJ\/Uirz5soOgF3PvRrtctTwnu\/GB2vIC1q4GBCRaDBZiAxRIYQ1MV\/ql\nsHi1zLBxSKXMhC\/LDNartXJBfoMgs3HIq\/UyqbVAhBjYC3Lc+Rnc0tsWTEVqu\/OPdtTiBwSnxCK7\nGqfThwY9PnEvtRDdIaIah+B+Ry\/UHs0wCw6J2N3WBLG5WWlvw5ot9Sqxx671jnbwN00L2YyNZUf3\no8upxmfpKAenXqlTCEYhh9pz0XawGXVJnqXVWb\/f6nTD2kiFvWAKBwNwcemKOiDoI5cMGRxeiDkf\n3NrDs6SpuTzT+8f1SRvZjOESTMLdl1PLgGyOakMmlKc04AAk4tKGhSVtWGCD6kTTX5le1KllQAXG\n3UId1\/pk+gEx3rEO\/tBqZnAPnZiuvjuw8ueiE98M+kwncx8zinoU0iZiKNeBXxu3xE2qYRiUkOG9\nOBje44pnAMKBMWHr86Nr6BnHWxPZehrr\/3Hctxuaa0HxysAT+ZZwm9vIw4A9fEVWCfDpS+C3Dawo\n\/KvMCO4BFL1ehKds1Fzn4FNx5YLpobD2Q+D0PyxEgGLTVQFo9G0A9bMRMc4Gxeg3Iz9\/YlbWi3Ar\nhWecg3\/Kt4qu02ZoVGYNjdYb8fZvf8ieud4HDaLgCkgUTv42\/uYz8lIAavH1I\/r2cLrM9zZbr2Xm\nz\/jDvy\/E9Sw2Y5MThgACdUoXPMNlOiv6ugpT6vOv+e8CDMEtNxjCO0Pj\/Z\/N0N\/VGkPsDuBBQQAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2009-12\/1261531563-8232.swf",
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
	"spice"
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

log.info("garlic.js LOADED");

// generated ok 2012-12-03 21:07:30 by martlume
