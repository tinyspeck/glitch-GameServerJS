//#include include/food.js, include/takeable.js

var label = "Greasy Frybread";
var version = "1348008276";
var name_single = "Greasy Frybread";
var name_plural = "Greasy Frybreads";
var article = "a";
var description = "A fresh chunk of butter-running-down-your-arms greasy frybread.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 53;
var input_for = [];
var parent_classes = ["greasy_frybread", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !(pc.skills_has("grilling_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/41\/\" glitch=\"skill|grilling_2\">Grilling II<\/a>."]);
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
		'position': {"x":-18,"y":-21,"w":35,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIHElEQVR42u1X+VdU5xn2P+hf0KY1\nPZF9m40ZBhGoVU+aYEzrFhO0jSeNjSfnNNqm6eLpsWlq9IiEIiLgsA3LgGwKQURBgwKCTNEIiOz7\n6sgiEtQ8fd93uMNAJGJq+0u55zznXi7fvd\/zPc\/zvt+dFSuWj+Vj+fg\/P+qO+wbdSlAfaE3R5TYl\n6sqehC8i\/EzmfW5h\/zNSt5O04W1m\/7LR\/ACMFwViomStA5MlP8X90g2C8c+D5P93843oydDDvN\/N\n9F8jZfn9yu\/VHleFd6TprUxkqnwTZip34fH13wB1ewVTl8IxfmEHHtbQPev7godVv8L4uVfQmaxF\nS6IOWR+5m\/hdz41Yxm9f8q6JVpm6MvS2yfPr8ODyZsxc3UnncCK0C9NXdmOq4m3cv\/xLjH6+FXfP\nbSfSex0EBdffRVuiPwaz9ejNMODyp77t\/7HlvErOzsBpAybOhQoxVuPr6+9hmghNXHgT46U7hBBj\nuHAzBgpeh61kOx7Q\/6ec8KBiN7pSA4ikCiO5BgxlB6A92R+XDvuUsQDPTC71A9cXrDFqK2eIrXxY\n\/TYeVe8W+0aKtpBSW3Dv\/BsYLd6GobO\/EHJDhKmrZO2NjzB1ZQ9GSM1hGvvgyjuY+mInRgpeRtMJ\nX9QdXYWbUa4ED9yJV6ExToOSg14mnnPJyjE5ztnM1XA8rrXn6avKd2A7t02IKMSYRF\/OK+jOXIu+\nrPXoMq9BR8pqWCM9UHvUVVBzZBU6KHtDWUFoPaVB\/TE3IXgn3ge3Y\/0EvWl61ESqbE+1ncl1WVZb\nv65hK\/dgsuxN3C\/fKVljxdjCfsK9ErrO+Rk6ko1oO6XFnTi1nDuT9OhOMaDdpEWPWU\/31GgmAoNE\nriNJg9snfVBz+Me48Zk7WhJ80RDjRff8MJAZQCQNqP1MjbR9rhGLErxImXhUuR0zVbsxeOZ1ws8l\nawwmxVljezvMwbJyJqUQZAxkBqI33YAvo91RH+kCa8Qquu8npHvMRgydDkVnqlGsvn7kJVw79KIQ\nbE\/UCEEeV37Il9qR6\/vfIJf2gUv4UF4QJkpfFbXGCKzcTNWvxeIxKYhteFz\/Iaar9qKZXtyZ5I\/G\nGG958WhuMJrjvFFx8Pu48vEPUB\/lRQvchOnKPRgt3IQBSzAeV78F1O5Cf3aoLLD5pIoWoJJrVpzf\nw8j\/syfS9rsEzbO2LkZlu1sQQNatl0ocJ9UeXduDCSLZZdmAG1GeGCraSgXwLlpSgoWIos5gViDZ\n5YHqQytpMh9RtSv9J9ScQ2UMW87j+jJWo5XyyOrdivZCa4LGTpKKhW2WeCTqceO4BuZ9ru2Ofpm+\nz+0A7wrtiWqxjwmOFm9Fe9pa1B3zEDIKOEPKSttNOgk9W8W5aqcMjhW\/ii76X9MJH1GXxzfS9WQp\nqZgVjFaTHs3xOrQlGWk8LSSFyKfq6ExI1qM+WouGWC0K\/+oFdlXUq4jwtcmWRAp2plCeTunxr0j3\necSufvwCqv+xUojwqnvTjBjJWYN+y1yhsFWsSku8WsbWH3OlCvaXxbCSPZb1EpPJ8h3U4N\/CeEkY\n2kwaea6DyPICmWDjSR0qDvvx1miV7DUn6WTPZNyMchESSgvgiVkpJjV3jxvuGozmhVBRBGIgO4Qm\n8JexyjhWtitVg+EcymdeAAZPr8NEmZ3YV9S+Ji5up8yqJRK8DYrFqQYizAr74+InPpRDN6xI2++a\nO5IX4CBoDy\/1pnSdnBkDFr2g20ythHYEJtGRbKDmu0FCP1W+WfLFSrVRr6v65Idkp9bxzonzL8\/r\nBrwlNsaqpZiaYt0xaAlwZJDBFjsRdENfOlehEbYCI13Tnpmlt6+azl2pWiHJ7eDe2RAM562TNtFl\nDhS0krodiVp5x2AWTWSZm4gzN1K4kXYaaupFm4XgyJnXqFBI7XhPetab3mkUcv3pBsdztZFqnD3g\nOWsxEVQaLE\/Sn2FHj9mf\/tZLl+d8iII05maUO6YvbSHFgihnP6I4rEJfpkYUY4I9Zno+MwSD+WHo\nzd0o6M9\/DWMlGzFeHIqxQqN8fimqDZ+2n3vNdnItCf6oPKqC5UN3ez9kgrdOaB3sGRx0JW8Nxz1x\n7dOVUijcRpzHcfCtES5Upb5UXIGkThhsxfZ9mj8kJi68gfsXwojUGiE1kmMno0AUX6Ce9Z+0N\/\/N\nm9qMm03aDPcb7t710Ro0xelkBYzGWKpGsq47TSV2MDqSfcl6o9jITbolQSvtQkG3Ochx3W8JcRBw\nBrvUYzbMW6gCnrfiiB8yfucGx77MX7nsN8uqoJEmHsmfK5yFYJvaTGqHygxuLT2pVIGzOwO3j6WQ\nUsAxu3ZMhZw\/esz\/8ubPHJaTVaymAYM5ixNjm5TMPAlsFZPhfZUz1ZP6LYRmmzK7JtmO0aKImrPD\n2oX7MMta+ncfWKPVsJ0xziO2MDt9aXYSPU8h8TRwz2OiTJIF4nqYtwc7H+w5s2e7mSRbzFby16+z\nVd2p81W4Q0212Ql8b6kEuTjrotT8E0Cqlrfcp35Jc+\/hwdwoG+KoSMyzbecJSjXE6sQmBV+STbzZ\nM+lbJ3RyvVgxcN447zyPFMWz\/OLjlbDcBX\/xlNVVRaikypV+6WhHp76pHoOtcybHz\/EHAr9DIcbv\n5feLrfxR8KwHZ4HVdCaqVDl3erZmqVCe45xxj8v7k4cQoxb33X40Lcwm79f8Qm4BPAH3Kue25Awm\nwbYVH\/SWhWX\/wX02\/HNgOxcthu96cD759wIX0sIJnwQexwpxXOyLdAl67qS+zf7FsOSfj8vH8rF8\nPJ\/j34hTVc5NQ4hFAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/greasy_frybread-1334191024.swf",
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

log.info("greasy_frybread.js LOADED");

// generated ok 2012-09-18 15:44:36 by martlume
