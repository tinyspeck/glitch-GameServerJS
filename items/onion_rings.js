//#include include/food.js, include/takeable.js

var label = "Onion Ring";
var version = "1354733141";
var name_single = "Onion Ring";
var name_plural = "Onion Rings";
var article = "an";
var description = "Battered and fried, these are onions prepared the way Pot intended. Rumored to be popular amongst the elves. Wait, what's an elf?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 51;
var input_for = [];
var parent_classes = ["onion_rings", "food", "takeable"];
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

verbs.twirl = { // defined by onion_rings
	"name"				: "twirl",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Twirl it around your finger",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Ew, your finger's all greasy.");

		var pre_msg = this.buildVerbMessage(msg.count, 'twirl', 'twirled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

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
	"sort_on"			: 55,
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
	"sort_on"			: 56,
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
	"newfood"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-20,"w":27,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKA0lEQVR42u2YeVAUVx7HhwFmOAYY\nDjlWBCQcCjKgxFs0EaKuaFBRQU4VEBXBIBGDcigioiASjhExoOvq6nqw2SRlooB4cHigLocSrkEY\nOdSK\/2zVJiL9632\/N\/bICGpSlcrWVtlV33o9M939Pv39He8Bj\/f+eH+8P36\/o\/uoj0dPoVdmd870\ns7J05\/ZH+5xD\/+dQzalTNrXutG9rT3Uob0myGWxNtBxsjjdmHsQZQssXptCXN7W9L3vinD8cTCb1\nlbTsGl\/XnDBmEGE4tSbbKM+bNulB8+dG0HtAAr0FHuX9hV6J\/dluPkSb+7LdSjvzPBO6CrxmPctw\nN\/hd4Vr2T496sNXkJwrxmQEMBWzf46jyGSXfM5ZC9h+cxPQfdIO2eAto2TKKjl277aA3ywXk6eNk\n3XscL1PwFNujfZkTStD53qP+Hr8a7EGc2Lo1a\/b9BwmWT7nJG2L0hwG9ruY4MQ03wqGqAwRsfaQu\n27hBRNUUZUDcNgT87k6YNns\/Sh8e7rSFnn1O0J\/jzshzpl2S587c\/06nH+x2aRk6cVOsGGrDtOiI\nn\/9FQjoi4FZjaEkwg0c4IQFs2mwOdWu02RvBQhZhf\/BWo6pYos5eW6lJoTuTbKBzxxjozZygfLHe\n3OlP5Ud9XIaBdWwzNGhNl5RxEyIIB3clUJ2qZo2QjuX+AqheowW31+tQDQt3xjg62WVfAXBgQ1UX\nrg+yRCsaenm6I72274AL9GU5KyDzpj356USgvgpgQ6JDlBIuSofCVK0WwMUVfDi7gA9\/8+LD6fl8\npniWGoPnZxbwmbKVfLi1bjhg504bOpEsxZ64Opa8rDkdUZxTnHqIex3JViBLGk1z+HH+FOjP\/fDZ\nMAfrE+x6uAmqCdj1EE2oDFCncH\/9mA8lHmpMtpsakyVRY\/InqzFHZqoxJz35zLdLNOFGhAhuhGvS\ne3+MN6ETdqc70JE6QouHuLTfHuRp5LsDE6Av20UJibnbEm9IuwHeL8ueUasCV7XvU72meIvnHCC6\nUuHPh39486F4ihocm0U0W42RTlEAovLc1Rj8Dh2tCdOFextRImjc\/Kri25MsoSvNjoJi2B\/utoWO\n7aRNxYuhe6cZfQmEwwJr\/txYkctk7Mic3N9z2MvqVWEkWCfij3c26Cqd+8ZH4Rzqq6kKQA4OhQ5y\n58Ue6kyZnwBq1wjZu+t1lXBYOMoiIu5w542vtS1FwzenoyzVHtozJANyqafkFWC8WTH+yMFdIM5h\nfnGARCUoDC0HhecHXBXn6OzXi9Xhe18NFUjaBeIs4Ha4FlXdOm2oJXOg0yN1AoRs3+Uw2JFik6wS\n4qZY\/eymLWK4GqxBATG8KMy\/r7352dx1JR685INuvDtZEl7FUDdLPPgMgr0OR\/M5TA8uLtdga0JJ\nuwnWJKMOi5Cci1Xk98pQEVzw04VvfHXgu5V6z9q2mqgum\/Xb7VuwGWPlIiAnrODKAH7KSP0y04Xn\nkynhxSDg8bnqSkB8DtfY75IWVBYogmx3Dfb4XA32erAWWxE0ij2zQJM9v1gLjnkK6W+cSj7SYP9C\nrmvbYSaTF\/858BVgkvPP9XHGg5iDWCBKQN83A1JICa8DAc8vVIT2VqQeey9KBLcjtOny2EAKptRH\nWwXiTTr5iQZ7ZZU6WxUigPYdZiAvmP0f5UT3t5pW0DcmD0cXMdTYkBHysh\/P9U0OIlzOJD5TR14K\nXcMKRigMH+pGhM4wl9Kc1dnMiRpsqrOqc7fJM2RJ5qTSreBhqiXpj46M\/PjyBDpZ9SaTU\/derhwI\nei9Sm64kN8O14X6s2GckwCxXXjICnvUWMnUbRHArUpcKn1NL7kO466uFcNRzuIMImOH66nO5nwaL\ncN1ZTtCVPpas0X8C+V4b6CtZ8AOdrHSV\/rHqtaTKyERVZAmrj9aDRuIIDVOM6OBIgKd9tEsPz9Bg\nbqwTMfhiCHeTuFBP7rsWKqS6Giq4WxQ8cc6RkEkph3wdK6VL7O5JF49lcz8yYnNmiijcl5MxNzXY\n1u3m0LX3A9Ibbch6\/gE8yZPA08PTX7SdiHSigAowfQKpcIE4RyHJ7ubuSIBX1xtX1H8mZvDF8F50\nC53DkQOsixl9bqR7i4MmuhaFuG8uXD6uU+qhzZav0qKuobp2W5LdjRM8LXCDx8Wev\/ScDp3JOx9k\nVlLhrwm1a2lIR+hR4s2vb8nqNunL6khLuRulpwR6XTURonfusi+FjoKWbSYU7lGGrcI5Asep70yQ\nN+\/klkULL60gPTBQMGKXR92PE1++v0Wc0hgrLr21QZdBl7EgMLQjwVVHGDBX0+aNeRtcw0Y9n5at\nJkr3unGdfukep0fF89fzpHEr3L\/fYP8zPhgnfNfmFPPsNnEPwzk0pEN1fY02VKUtOj0SWEeGoUFj\ntDimNcH0Weu2UQrAVNzNOFIH+7MdoSfNAvr22cBj6Ydf0ZuOhE8\/XLlah8GHN27WV+hlu2gaEnZ0\nDYsB8+5NoeV0L9oAqmKs\/916NKyx559JFR0Zk0tbL52Ib9w\/r6ohWjzYkWjGKPLOSuFgujUtEJp\/\nOePhaeH0Fz1n1s5SAEbP9ziz2uE5fXviSn2sEWk1IqiL1KKOIVh1mKJKubBeCRZAhZ8m6ZsCFbCb\n5He8rinOiPa0LhI6VGeqLdO5h+xudpgiEMIxvbluZKdjSyDHwKNMBwqJYUY9LvJ4qmL98TDXxNMB\nptTF6rU6tJehe+gYNzl+x7mHOVu2XJM0dQGUBwmZC\/5Cei+CyRJNKVz3Xlt4fGQG2\/sl2YwWTSO7\nZTcCizB21K0+AoitBUPM5SKqJ2\/KC\/nptYHD8qMg2O3S4aVmcGaZHlQEaylbB6nIt4bz3FLh4LGF\nwhd4\/uPLvOrJmUDVXzgFEFBOgOSZ9tBH3HkinUjVk+WgaMzEOQ6yK8Nx4KHU8+KIlSUNmSopCJKc\nzfUZDdnzjNiTn+qSHQfZMW80gqq1CierIsjOJ9IYLkZaDv59me5goZdwQOqpNVCyQDhQGSJkMMS4\nnj7MsKcu0jATl9A5hED35HvHUuEKgo7fIX\/ltSePZrrTrJnuvFm\/NJzavu6t\/SlphbtLfqDLt\/kr\nbAeLlpnBCT9TKPZV6NBScyhaMZohbj8v8LdvkXrplBXM1bqNkKUBJtTFm+vFUBMugoZYQwqAQui2\nRAto\/sKMgqHqNuorXoY415buNHBjm92Fx1IPya\/+Ozk\/LiCwKHJ2ZlH4jOcFq8a\/KAhwGqBgqyff\nJFqskh6ewiyEPLVYEWpOtesMVNKhlqTL3RgjqIs2gYY4U0Xe7bKQybJVn\/ebDy93W4NFM52scHzT\nNQUfC6PzFxjVnPTRGcCi+W6lcBALSAUwknSECLL\/jNR71rxtVIkszcL6D\/+\/jtRTIJF6Gwcd8jbc\nceQTQdK5pYLkC36C5GshAp9rwRpzbsWaz+G9P94f\/yfHfwF82R7yYI7HMQAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-12\/onion_rings-1354668234.swf",
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
	"newfood"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"c"	: "twirl"
};

log.info("onion_rings.js LOADED");

// generated ok 2012-12-05 10:45:41 by ali
