//#include include/food.js, include/takeable.js

var label = "Desssert Rub";
var version = "1354649213";
var name_single = "Desssert Rub";
var name_plural = "Desssert Rub";
var article = "a";
var description = "Gritty, sandlike, and strangely sweet, this is both sandy like the desert, and sweet like dessert, and, as such, has the s's of both.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 78;
var input_for = [2,24,31,93];
var parent_classes = ["desssert_rub", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.1"	// defined by food (overridden by desssert_rub)
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
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
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
		'position': {"x":-10,"y":-22,"w":20,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJX0lEQVR42sWYjTfU+R7H9z+4\/8G9\n\/8CNSPJUnmZUKFk9KCFib7aSpRBlVB6iNIvxMBQyMp5tVphoZ0OpFcpT6pJuhVDZ6mzn7rm7930\/\nn2\/NHDFqpjrnOud9zM\/v6fV5fx6+3\/HVV+9+5vwyA2fcZcWPPVNlc3H1sml5twyXZx31apk2\/+r\/\n+TO5LEQ+aRaK+XpstR8P7aMxsUWOiaBCTEX\/gJnUq3iuvINfi4f6XpWNaP+reSqE1mmZXprpQBHU\nlRd\/+2KAE8tCtAsBP6RRSRIGfYtwJ7hGaDS2VWji5HU8PfOLCOJ12T28qRwFBTAugrj8tPiTAzAG\nkB1dCKZT89Y8VHilo8Ena9G5pYKYye4RQbwsGX4vgJ8OVzkuBjQLmTME9cQiDA+cZRjeUrDki6\/u\nKEaiQ5hefLzUtR+TQnqYnrFHtghwZIO8mCFYA36qT3zwW8A238JF5+9FNusdZPeWUuWuTMOAt4Or\n5Z8aNas7UC1SzNJB\/Fo0hD8an4BSZ7S08RVItA+TLwYMqtF+DuCjE+0C6Pf6hyYBLVRfegs7qP0i\ngJw27tLPAVqo8YIbhgHfddEXfdm\/87rw6mA55sJLMb3tDJ55JxvU2OYTQnzt0Dd5hgFxearvS0D9\neXFcvGjKej9Mmavz9b2tQcDPB\/stuWlJsAfmu9FnGYQbVrs+qA6rYChtDAD+ph6d46Gpm\/7GQP2u\nGsCzhFo8356BR2Yh7wHx8YBFMDqtAtG0yh\/VdjuNUoldIHdx3wdXlYHgWvMHzf1N\/9T04Nb+Igz5\nZWIkKIdWkBRRK0+pbnhVWejS3U8AMghIs\/SjS9+TJ0+0JMzNzRnUxO1hjHd0Y+zqTQzXaNCTU47u\nLBW6Thaibc8xaEIShEwFbJREGA3YNzU1hdevX3+WXr169V5QHBCrv+ISuuQlyPEPR77vXpR4hKLK\ndqf2olOY1mAXGwDEzMyMURBzz5\/jwZ07GO3pwcPh4SUhZ2dnwUHzs3VKTEwUUigUb4ze2bx48eIv\nfDM\/0BjA8aFh3KqswmBtHXrq6hfBPXv2DJOTk++Bsbq7u\/WAmZmZs0YDUpSOuvozBvBe9y0B2Fdd\ng1\/o9zV1BboqKsXf51\/3nJye7+C1a9f0gHl5eVMmA758+XIRzOz0NCbHx4X484BWK+D6yb2xhkaM\n1P+AGwTXXVmNXo1Gfx8\/i51kwImJCQHY0NCgB6ysrBw1GvDx48cH+AGG3Brq6qKXV+FOTS16LzXh\nurpSHPefV+F2fgFuZOeiNCoaqohIdNA1XMcL606nmpoaPeDZs2d\/NH53PTEhW6qDH92\/L9L4syIX\ntVGHkOMXgGOOzjiwwhqxK22RZL8G3zu5IsPRBWfWuyMjcBdygkORHbx7EaBSqdQDlpWV1ZjiYLGh\nDuaU3m67gmzvzShz34imzVtRu8Eb8Tb2+HbFShyxcRBw56TrkbLGCcftVyPG2gbHCJpVGhuH0ZER\nPWBGRoYeUKPRKI0G5CGt62AeIf8aGMD9W7fQ06JBLzXC5RPJaI2IQsvWbaj18kaYpRWB2CHdwQkK\n17VQe3ohz9UNaQSZutoJh+mcUuKGXMlaNCkLFo0YlkqlCjIJUNfBYoRUVQu1XygXxd9DnzvL1aL2\nGhKPI8ZtHVIcHJHnIkH1xk0CXO2xkRy1F65GWa3CGUo5p\/1naiaGGyEn5wO2tbVtMhqwt6Xl9e3S\nMgyTY13Ule0X1GJsaC9cwMWCQpyVyaAICIJynTuK3NaLFB+xdUCynSNyXaTIIcWxo+RgtrMEcavs\nkGDngKO29vipmprrciuaKyreA+TJYTRg5anTwp3hujrcrKiCJl8JdXQsor19EEFunCYnjtlRXdmu\ngWqdB6o2eAmwaGtbfEvpTqRzMfQ5y0mCQnJXRmBxNnY4ucZZBMNup9B98bGxekCTvsQP3LyJoY5O\n9DU2oWRngGiEMvcNSKdu3WdpjQRyi90pXu+BOi8fdPj5i7oLewenpCYpkK6jtDojR7oWu80tBCDf\nJ3d2FXUZ4eSM8JBQAZednQ1T6s+cRwwvUfy7MTVNpLGQXlhKkCcIgNNZQAWfTi+6sN5TBCCnVPov\nt0Q+NUkDdXnrNl+cpo4OMF+O7cuWI5ggeQSdo2dl0bXxISE4Gh9v+jrMtcAdzBru60XTyXScXO2I\nI04uOEGpOeXoKoo+murqu5WrELPSBscd1uAgjRM\/c0uk2DuKlDN0GgXAaWVXg8yWi2t53BynDp8\/\nA01eh3WLe+mBSKg8PIVbDBBmuQLhNO8CzSywm9wKp+HMNZVBTjHENxYrKAAXyCm1Ap7qkNMpowYJ\nIfi3peEimiYyNBShnhsQ6R8AtVrdb7KDPAoUe\/fTLHOGghrgDD2YneExcuCdE+fc3tbZEaqv\/ZYr\nsXeFlRgnPPMOEdxOM06tJQ6vshUDXE7nOLBAM3PscHHFLqkb\/F0lOJ14rMOUGgx8NDaG5sws1CWn\nItlnq5hlJW7uKFnrjvPUGAxxkCA5heVUlz9+7SOaiOdeIq0e3M37yOm9VtbwXWZGjtkL6HKajaH2\nDthOwH5uBCeRwp+CPJ2U1GjSOqxR0qwjGC5oLuzdyy3EXDtLjcKADMJp4vHBrl7x3YG6Td6UQnsk\nU52yY7lcZwTFtRpBoDyWjlKg+Qejkb0rGGGU3qh9+0xfRRjwYm4+kqjws5ylSKEHV9IIqfP6GjJy\nJ4pqK49erKBOTKAXZtC44cHMx5xuhg6mNHIt5rlKUU4BZNI85PkYQKnlRkmkcwFSKQ5FRAjAtLQ0\nqclbrcHeXnS1tKD+YKxII4Ocp+GaQJ9PUV2WrvUQ40SA264WTRJNzh2gDt9HjgVR7fFQZ\/giuk\/m\nuRHR23fg+OYtiFjtDD+qvch3Dkokkr8aDdjf3+8+ODioX9A7autRTPVXuskHbVkKsRtpzMsX0Jqt\nvgIyldzmEcRdy27x3OTVopU2FrzVUtEuprejQzyP7z+nUOhnYGxs7AuTVhHahv+d9mb\/KS4u5j0a\nGhsb0dnZiV5ydP5err1MjYbw73ApJg7Xm5uFWkpVNPecRLpbQv9hcJO6cCdNW64xk\/9fzV+aONV3\n7969TruMNwwql8uFGLy+vh5a2uovhGaxU1wa8\/d9SwEmJSX9QQ1i+dn\/YGdgno\/0LSyyvb29qLa2\ntou+Q0yVlJTM6bTwWKeioqKpgoKCcZ1oWZsj1\/6MiYkZ3bNnj9PH3v0\/BPRsXld+2DMAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/desssert_rub-1353117104.swf",
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

log.info("desssert_rub.js LOADED");

// generated ok 2012-12-04 11:26:53 by martlume
