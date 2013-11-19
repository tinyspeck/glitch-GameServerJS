//#include include/food.js, include/takeable.js

var label = "Big Salad";
var version = "1342483398";
var name_single = "Big Salad";
var name_plural = "Big Salads";
var article = "a";
var description = "It's bigger than small. It's a big salad.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 58;
var input_for = [];
var parent_classes = ["big_salad", "food", "takeable"];
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
	if (pc && pc.skills_has("ezcooking_1") && !pc.making_recipe_is_known("16")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> a bit more."]);
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
		'position': {"x":-25,"y":-23,"w":48,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJYUlEQVR42u2Y+1NURxqG\/Q\/cX3ZT\nu1sVkjUbYxIdkDsyN1S8gSREQlBugqAgOFwFQRgElOHmACIqoCAgKEEREOQ+IiCgKEgAuQ8oIiAw\nKiqoSb3b3ewgWJhds2a3asuu+urMOdOnz9Pv937dc2bRog\/tQ\/vQ\/s+bZ7KeCo2516Y2qqm82maY\nAjP1xf9zQLdEvpxEk\/JcrrPEZliwXPH0G33AzbrpTUifE+qL3RO5fPckrolbEk+sDHr+3uHck3k2\nNlH62J3AA33ojaUfmbSrqmBAbynGVnMwar8W7a5CPoWiEKSfDQVxjOPCKZ4HzwwBPE\/z4ZrIg0Ms\nF7E5NjJ5dxqfRl9fhspvBmMqELidcTy5SzIfPj8K4ZbEl1395A9Nt5b9GZ3qn0K+fgVu7NJngARG\nsesYj\/VzT+IzGAppd5iLbRJ9eCRsRlvLCfR1pM5Gb0eq\/G2WomK8aav5HZL5cu8zAuwkD\/VO5SIk\n1gDZOU5oO+uHjuz9aHPdhBobbeT8wEH6QZ6YAtH+XkQxqhxVvejkXpQdFWFP9DpcrjqAxtoItN06\nOgvYfF2KqsL9Ih\/Hvy2eK4xHCl+xN0vABHmL53gpPtkCpoZ91CrkZbnMmzmNnprDqLLTQa6tBo5E\n8WXbo4kNyGR2SLnYGkbgnIk\/MxMxHeqN9h900JwXwIBo0PvrqkJRWbwP8s7TYv9CAxXvTCGfqmYb\nzU3xvSjEvovChQFnvMRXuKfPpNXbYwUbkM6cKqAc\/GbSblTaauPSVnVIkgQK+9gZMGVUea7DuMMG\nKIx1MMT7Er2CLyH15uJ2Qwwb48QhIxwRr0Wwr1YKzRYVhByZNfzyhCwbxNPSBYuCeoh6hwJ6enFQ\nW3qAAZble7PBL363DLkWqii30cJlSw1WCGRSDMw6Qp+lOClQgDqn1Rh1N8HAmhVoU\/0YqRZq7P7K\nAj9YeanCPloboiSugqSUFSGFs4vhkmt8eBCBFqz6meWAD2XKtpOUUT\/tJTMMiRKyB8Rv+7opaxsH\n579XRYGrLusXmPoNwiM3wS+YB+tAouoxA+RaquKBtyl6rfighVWvs4Tdf1K6BXbRq1jx0Mm4EuV2\nHF4Nq3ByTkCdSMUTLysW9h\/Ju9NxsqQQiekANKgqyXECRHppsAe4h21oMnXjYL+jKmL9dBGTbTfP\nnxRgV5Qezjpoo93dCLXOAjR88RHyv\/ojYoLWYjexzY74mSqn6qcYfowIBw72pJEUk+s+54n\/Evm5\nbwWk6fXMFGDXkRlf+UZy8TzAEc27efgpzg5nMrwQdyYAnkc2I6HYehaMepNagabQWaKLY956qHXk\notnJALG2arD118T2EE1sDdRmE6e2yIwQ4JpwCWo0liLek1wjqd1zkg+X49y3AfLEohM87DzKAy11\nmt4+5014ecAN1WRZuWitgRI7LeQlBcE3fQNqb0lQXS5mgKUXvOAjNYZL3Hp4HeVDHGqAVE8BRCJ1\nmIu1YUtsY\/vPKqeTDyB9CsgqUG+mikahBq5KXOBwRA9uqTTlXOmvbm1URVrJ1LSjDiZQGKrhjhVZ\nVszVWNAKDhDr4VyJNy4W+uDHIl9WoRZeajjuJ0SnywaY7tOEia8mvgvQnlfhVD0X4tsckS5ytnJQ\nt0UV1z\/\/E25\/\/VdsFWuwnWceUFTFRpXISmOTyAoj8bmmgNzz9anwT9yMyGgjHDy0BmWmy3GfLBU9\nxqpo3yNAjb0ug3T0WDn7UP8kM3Q3xOMCUbfcWhc1dlw4uKjCLEiHAVpH68HjrID5zDxUD\/uCuMi3\nWMkK7Yb5SjR\/9Rd0rPwEbi4c+KdtbpoHGF5uJAu5tAH+59bC98xqhOWb4U7r622JKnPKQRO1qz7F\njR26SN+pjrAkLiwPvlYmMXAtii3JskNSJnffjEsOeohy0YHFwVVwJHC+yXrwO7WKhbNEix3jQ3VZ\nJlqttHBHTQV92n\/HXvvlOHs1UgFANAsYUWEMSakRgwvIMYT3aSGiss3nbUt3mo8j0lUT9Ws+RwLx\nkn+BAfaSarMMnwG8ac\/FuMgED33NGCBdYnKcqE14iAoWsvvf3I2KfdaztbTte3X0an2GQe4y7HdW\nw5WWbMIHcUSlMZ+Il7uIppYqSCEPFm0E\/UyPR5ON5w1IqzPe8jMEXRAyQCUkTV1pSzKmSgvQaaGD\nEUsBhrfoocxDB35SrQXhaMgkFizFnd+q4Z7+F2jcpY3wnHU4VeeK2IrtcknpJrmk0oizSFK2ZjFR\nUUHBwkq+RXrtYTT0VKFLfgXDgxVoqI5g2xzdUQJidXDgsiGCi9fNhjjPEIFn1iP0tDE8yBIRkWKA\nmHNr2HeBYZporItk95cWeDGwvGwnlF72xQlvITK8tJAfwkUaKTiaQWozn3QDiC8YIqLc6HWawyuM\npYeKN+Fw2U6MPZnE0+kXePHqZ\/z8yy9Ubky9nERCiTVTlwa1Ah2EfqZHOrAyA\/RBQRfXgVqHhrTS\nFCcLrFFeGAp5dz6udedg6FE3WgarkHNTCqXFlFmkQVmocLOA9ITmO6shQk7hnkxN49HzKUw8fY77\nilGcqndlUMH562chafhlrWFw9Ei\/U0LR7+gxvMwUI096MbdNvXyFexOPcEN+DxXtPUirzkdwTgD2\np55EaFYGomUWudR2C66BdMmZnJ6WKwHr5UWIuWI+OyslgDKoYnOhlH0OFdoh6KwExTebyQQf487Q\nCFruDRH1+lHdJUdVZx9kHb0MsKytGyWtXYjLL0Ja1bWmf\/lr+tn0tIkScGC8nwHOhQq7bMUAQi74\nIiTXg6k09\/tjNc4ob2nHlbYO3OofRCNR6nrfXdT3DvwqYGbNdUXBT52cf+sn\/+TUC7EyxXV9RUio\n3g5JiTkCM+IQnJ6FtHIZLtTWIz6vEPtT0ll6xJnRiClIRNNAH1HrAZrv3n8nwKLWTpt3ei959Gwq\nhQKOTT7DKCmcjIorqGnvwCDxz91xBfrHJtA3Oo72wQcov92K7OprqL3TjdbB4d8A2Cn9TS9P40+f\nS5WAw4+fYIj46U3AnpExdA0\/RMeDUbTfH3l3wNZu6X\/06ql4+pQz+vhJ0\/sGrOzokVV29nHe2zvy\nyONJ8fsAvNolV1R1yEW\/y78MExNYfE\/xWDQwpmh6V8C6nv6ma10Dov\/aXyJDExMq8tFxUffww5TO\n4VFZx9CIrG1wWEYAZbfvDsmaBwZlN\/vvpTTKB21u9Q2pLPrQPrQP7fdp\/wDjMSrgPMlbPQAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/big_salad-1334208199.swf",
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

log.info("big_salad.js LOADED");

// generated ok 2012-07-16 17:03:18 by lizg
