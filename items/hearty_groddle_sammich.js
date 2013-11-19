//#include include/food.js, include/takeable.js

var label = "Hearty Groddle Sammich";
var version = "1354594145";
var name_single = "Hearty Groddle Sammich";
var name_plural = "Hearty Groddle Sammiches";
var article = "a";
var description = "A meaty Groddle sammich with extra hot 'n' fizzy sauce for extra hot 'n' fizzy energy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 93;
var input_for = [];
var parent_classes = ["hearty_groddle_sammich", "food", "takeable"];
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

verbs.eat = { // defined by hearty_groddle_sammich
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.getTooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.parent_verb_food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_eat(pc, msg)){
			pc.buffs_apply('kukubee_winter_positive');
			return true;
		}

		return false;
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

function getTooltip(pc){ // defined by hearty_groddle_sammich
	return this.food_eat_tooltip(pc) + ". Grants 'A Hearty Feeling'.";
}

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Hearty Feeling buff (immune from ill effects of cold)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
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
		'position': {"x":-15,"y":-25,"w":29,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALW0lEQVR42u2Y+VeTVxrH\/QumVcGI\nqAgoIhUppYvWwYBQWRQoKrKIRAXFpdq6Fa1tEVERRVOVuhcUi0Use1kDCRD2JSggO4RNFkHj0jn9\n8Tv3uSERBK0zZ+bM\/ND3nOe8h4T33s\/9Ps\/3uffNpEl\/XX9dr79Ucl+Lfqm3sD\/HXdiT6iLsSXQS\n9vfUCl+8aBX+T8GelwW4PS7arHxcIMJgng\/6sz3Qm+6OnuyNGOjMRl+1GC2xy9Bwcwnqf\/oI9y5b\nKKsvmEUrIgwN\/mtQHQnLDZTxtsJn5buDn5dvh6o4AMMM8FHeega4jgN2pbpAmeCItjt2aLktRHOc\nI9rTN6E1aQ2abi3FgxuL2d06uvXOsuDGm0tFDdct\/33gJxL7d1RduaJHrfHRXWmrVcpEJ7Tf\/QyP\nyg9CA\/i0JQZDLT+jX7p5DGB7sjv6q8MxWLyHfbcJLVU30CL7FpoxWuNs0fyzNVe47pqVsubKItHb\ng1V5vDMoWS8eyPFEQ+ZONKX784l78rahryIMjTl78VQRxAG7S7\/HYHUoujM8tIC9RQcxpDiOoUJ\/\nDOb6aNXtSXUdC8hKoDGW3RM8UHvVEjU\/LkyqujL5nT8t+qF8kXJIth4DOV7oy1yL3t8+5xM3pPih\nNnkLG3Q5OjL8MFx5GI8LN+KRlP7Xk0P0V4RCVXUAT4r8MZTvN1KfLwE7E53RcXeFFpBKoKlAjLpE\nEavTRSgXz6upOvkaSFWpv+iJfLOK15XUF0Ml+9D+m48WcKLVPywPwaPCQA74UBoAVX0EnpVu5YDD\n+SIt4MOM1Qz+KJ52SdB37wIaby\/nY3ATRX3MFbx3yRyV5+Yj76h+9HhXVu5we1YWqB54BHCgcDu6\nM70nBCSHNsWwoo\/+BG0ZAegv2ouBymMcUFX9DR5XsjSXHcBgyR4MyHejr2AneiWb0JO7Ba3Ja9EW\npwZsjPlUDXhNDVh9YQHyTxgg75jeWPM8K9+u5IDFowAlLMVZa3l6ukcAKT00ODlUA\/gg1g4defsw\n1J3Jo0f2BTp+dUB7vD1af7FhaWSLSvFCZ34QugoPoUcexBbqxBf5EvADDqiINENBmAEkr6r4onIn\nNIDquvLFoMQb\/VkeWkBN\/XSkeaG76DB6S0MxVHcOT2qC1c\/JN2G4aAsetcWPA+xI34zmeFfUXbdC\nfYwtOotCocwKUANGawAXcUCu4NGZqrEprtgpe1a+DU9LtmC44muWnn2sRXzF0rwLffk70F+8DwNl\n32D4XhieVO7jpUALIbWHZBu4UcixZKzB2vPoyvZnKjHAOBs03F6BzoKDaEz05oD3r7yPmosLmfKO\n6MjezrPAAZlJ1DU4k4cW7ndFoMXzih3K36u+AAWp+bxiO57Vh0PVeBG9rH6YedRA+er0U\/E\/rI5E\nm\/QgV7kvY43aqWlurPWEojPZbQRQbShNOdRd\/xD3r76vTWf9bZcxgPnHZyMvdCYkIfrKUdvWNtlz\nph6572lJgFqd4q1ozt2Lppw9aGNO5uqwmiRHUushV5J5etJcuYE6k5x5jbYwoL7qM+pm\/RaApFhd\n1GIoWHoLwuao1QulmBGsBRyS+mnV4eliWxfVH7UOrk6mWh0OxHpZV8oqNRCDoJokEO5KZpwH8Qxc\ntmsE8BXHs22u7qfxgOU\/WkEaOkub2uS9eohZPkUssRrph02s8WrVyRqvTlfySq5OX2kIlOk+fJ+l\nickANDnfsm4sQdXlD9FbeZovYMKW9BpAaehMLdztQAGOWP0NaXZTIXfSUeUtf9dgkjzCRNWb\/oo6\n1FLIiWwSDRDf\/GkytulTg6UJqUXUsKIvEZuiTfIlr8FxgNSSbr0E1DRlAiwKN9TCXfXUQaz1FEhW\nChDiYYLv15niqIO+eBLlu0xspk5XvDpdXB0CYurQ6jkQqyE6OpETaRLFRXOUnp2PYhYP7rjjocRv\nHKC2Z44A0vNqwEUoiTDWwt39YjpyV+igzk2AFJcZOOS5AIe8zHBo3QLVpAAHgVvat7NV+SfmQHHZ\nkvcmPhjrT3zFzGE8Lcxl1B4qz5uyweeh6DSLCBM0p21En8SXl8bbALKzIVPOSAtHcdNDFy2i99C7\n3x4pq9SAQUxBkR3rh37L9FQyVwF+CRBoHyhkjio8aagNeTiFEQpOGqGQ3QtPGfOoiDTXnlh4qxm1\nLY7ZdRhgHSuHMlYKow2hMQWltmrVNOQ4C3BqzVzsWGWEtX8XqNwXTxVNOrtMRyxz1OVfxrnqIGW3\n3ojdZ0F6bDZkrDfJWHcnhQvCDJHPgj7TTNCV4sodz93+CmATKxHKSslZ0zFQo1MbYzMFMgddRDrp\nY4ujAXxt9XGAKaiI91a\/NlS66IpP2k7DfjdjxLow9VZO4y6SbRDg7oZpuOqli2veuri0RoevdqKJ\nSn8wY0ZZwEGKWchPzZ3w\/0ardstNh9ddkZMuvrURYPOK2djjPo+n98Lexfijdo8aMN9BR3bCxxRr\nlwq4tN+tm4+z7kZIcNGHwmUaL1yKUudpuLJkMs6tmoK0oBlvBJgo6Bly6nnryciw1+Fjl7ExpUy9\nXAbJjTESYYGWaIh3UgMqr7m4DZftRqCLEVZ\/KuCgtJqvPUyRxhxFxdu+lW3yq\/W1oMm2U7kCNOGf\nRbjtu7gknIxfbaYi1lGPL57qjOLQCn3cdJqOSlZ\/\/O8RwG+856Li4kdqwEGpr8Uftfshj1nHAXe5\nGPO7n91M3HCdhY4dn2D4hDeU7K5Rc3RQmt4U1Uype8yEiStnjFGJwluox3vedVcDnjn6bJuzIa7v\nNUNx5MgLlTLVQ\/isYhe6ZYEcjOrgS7e5XMmDttNR5qKHZt\/5aPCYjftsIkrL6NS\/GqR0X5AjD1Kf\nnilkJiQQDRhlhwQgU2g+ozn9HWYhctd8FP1g8fK41ZHmadGduR7\/uLcHhzeaY6P9LO0glOpQWwHk\nbAIKcpt0VCQ4z0ASU4aaKwUVPMFTSZDiD9iiitlnlAkNCGXI03q6tpQojgd+gKjvrZFz+gMUidmp\n5rTZ2AOrMsVT1Zu1AQ1pIviyldEAJDWtigbVAJHbAuxncjONThUthv6XOsEtx+ljFhE30njpGUop\nZYnqPVHsjOpfffFC8RU6Ulej+AcLyM+8h\/xTpsgNNR77GqpMXhetTPUCQdazt7fj2604KA22zVrA\nVclk9aQBIZWpX40OzeQnbXQRYSfg6TvnOIOH5jsal8D+qGWvCPIANN9didIfP4T87EKmGmviJ+ch\n55ihbPyvBuk+BqRiJzvOE+gAexGnlQ2X7ULhkWW8hmLsdLmyrxb6aBVJdbG9APuX6eIrtlWlbDVH\nwgYTZF\/5nEMN5m9Ge8pqVFxZgpILlqzWFqEwwgyycBPknTBGdoiBUhL0mtdOZYq3SAOoie6M9agN\nWYIKfxM0Rbki+oiQK0MqaoJSR4qSQhQEVn7bE09KtqEh0g7F6+egNsYOlVc\/Rfmlj1EaaYXicyyd\nZ9+D7DQ74jPVJMcMkXVklirtO32LN764E+RowInigJeJFkYTPrYzcCxgIaSRy9HwizPqb63A\/ZvL\nUXlwIe+bFZcXo4ylsuT8+5CLF6IggtV1+DzknjCCJNQAmcH6NemH9d7udxpqOx0pnrI3QUoiHXjk\nnGdnvgR3\/sbWGLcS9bEOXK2aKBtUX7dGabA5incYvUznGZbOU0y1MGOm2hxkHNFXZh8Zdbz\/Vy5S\n83WgHameaEtcg5a7nzOwVfwNrTbmM9yLtoXiJ2tU8XR+MmE6c48bIevozKSMEH3Ra+vtX\/rZjRuI\nUu+ZRMDtSWtULUy1pjuuY9JZE7UMVdeWjklnkdgc0lMLlHlh88R5YXOCs47+SY39p67muBUWTDFh\nbYytUBFlLVRcXSKkvbPioqWw5LylsPCsuVB6xsRi0l\/X\/8H1TygUcjQB3qFZAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/hearty_groddle_sammich-1334340787.swf",
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

log.info("hearty_groddle_sammich.js LOADED");

// generated ok 2012-12-03 20:09:05 by martlume
