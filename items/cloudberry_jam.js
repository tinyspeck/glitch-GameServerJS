//#include include/food.js, include/takeable.js

var label = "Cloudberry Jam";
var version = "1354648611";
var name_single = "Cloudberry Jam";
var name_plural = "Cloudberry Jam";
var article = "a";
var description = "A jar of tart cloudberry jam.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 39;
var input_for = [2];
var parent_classes = ["cloudberry_jam", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && pc.skills_has("saucery_1") && !pc.making_recipe_is_known("49")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a> a bit more."]);
	return out;
}

var tags = [
	"food",
	"sauce"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-33,"w":20,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI6ElEQVR42tXYiVOTdxoHcP8Dd2d1\nu4r1oCoodRVdt1YYgggK1XoDul4FqRQRkSqIiCSAWgQV0ACCSATqWkHwllPCqSByBQiQAOEOhyEk\nIVxqv\/t7f6jozDJd60tn9p155j0YeD88z+98J036yGN4uHLx4JBIMDRcJRweGYuRVx\/Gq\/dC0Vsk\nVGmKuUDl4kkTeQwPVwUTGIZHqmmMvByLl68+jFevP4zXv44GuS6bECgg5jCQTwGqVMV4lBKFyMhj\nkycEyLxkcKgc\/dpSqDUl5FwOTX8pVOoS8vLnUPYVo7e3CC8Uheh58RTdPU8ga8pESWkS0tKicfXq\naURE8DAh5X0fqFIXE8ATtLfnQCbLRF1dCior76GkJAlPn\/6CnJx4ZGTE4OHDSNy+w8fNhGDExwf+\nfwDDw3nKCeskGsVjmVqZ+7uBEXwPnDm5\/cYEZK9h8svXlQJNXz6qn15CXdk1NIhiUfP8CsRl8Sgv\nEuBZXhTys8KRlRqK1PvnkSA4gutRrogIsEWo\/1YEntyAQD8bhIY4K+\/fj+AmJ4dzWEUy49nQcAXt\nILKmNJSX30JBfgyeZIch7\/El5KSew\/1EHyRd98QNgRuuRBzAZb4jYgSeiL\/OQ+KtINy5E4q7d\/kk\nIoQJCZHs9uSOs8ZCsacxmjJD0SVLhYL01K6ufFrm5pYsNDRmoE6SgvyCWKSk8ZGeeRl5+fEoyIpB\nZrAj0s\/sRqr3VjzYoYfbVlOD2R2gr1oF95z+GnJfDpRp4ai95II6vh1Ked8g38MCeR7myHVfjaJw\nJxRGu6H4bhAKk88i+7w9Um2\/QOrG6UhhYsM0pJHIsf4cyWs\/28hO+4v7lqMJNUWH91dQ3Q9Cf24s\nNOkX0eP7FV74MbEC7Sf\/AZmHIcQuBsjbOQdpW2aMxmYdpDKxSQfZNjNRtFsX9c4L0eCkh\/RNOsok\nsz\/N+mTg67h1ArnXUvT+fBT92dHQ5lyFMsYBilNfo\/fMSvT+tBLKn4zomblnnjPoHt4\/0eWzHJ0n\nlqHD0xBt7kvQ4m6IJrfFaHRZhJLdc5BgMVXw6cDYdTLmJX1JXPRnRUIrjETvWVLqACOowjZCHWkD\ndRQJ\/gb0nTWmzynUfwXNMoOUey2D\/ORKtHmvRMvRpQS5hGYxwXyq7JOBQ5ct0EVKqLrlDe3jMAIM\noxDVeTNoom2h4X8DTQi5vmAK9XkOVCFr0BdkOoZkMskl5xAbdIVuhzxgI5qPLEOj8wIkWkwFK8Bu\n7nKoE72gzQhF\/x1vqM+ZQBNsiv7QVdBeNMPAJTN61sbYQhtnB\/VFS\/pPMEim3Mzvd58hf+fiTnRe\nsEaLx3LIDrIGXENLpU48RoAhGEgLgiZiwyiMvxqD4eYYirCg54EwC2jDLGk2VUEmtNxMm6RZJFWQ\n+69Cu48JWj1XoMllITvAkdhNUEZugzrhKAay+BjMvACtYAfFMbCRqLUYuWJJz8w985zJLFPusSy+\naYs8I3RwjdF6wghNhwzYAf6adoiu50ZGGjColULbLISqIBh92adoKIX+UGT5oTuDB3mqD9oenIDs\ngQ+qSbYrUs6jIdp+tMwUaIwOHgft3sYUmGA+RcgqcGhYRqa6Wih6ySzSXYCOjly0kFmkkcwiEkkq\nxDUPISKLhtKyZBQXJ9KFQ+1113ftUM41IoP9aJlZA77OPCJjgMPD9RgaaiDAmo8D\/uxKS8xksJNk\nUO5nRoAciB31WAJmHxeOAqUEWI\/+fjEUzY\/QJbBDW3rg\/wR8Ox52kk4i91+NNu4qVDrMYxsoIYtV\nKVniV0ORE0h7ZWvwlt8Gxru+14vJlOlvgXbe6rfA2ywCawlQQoBVUJReoS9sI1PebwFr4g7R9sfM\nRkx5GWAr1wyifXORaD6Fy8JUt\/4NUEyAdeiv\/gUKsmjtqr6J9qJoyK7\/CGkyb3xgrMto9o4vfQNc\ni5YTJhDZf8E2kOxHep9hIG4vHYAZIJPBhh\/0UHNo2bhA8TUXOhe3H1uCDl\/SQfwtCZCDCrsJAA4o\niqCN3TkKrL83Bty\/YFxgteDgm9XMYtL2zNDmZ4lmLw7K9+qyBIxbFzwKrMLAoBiaynhaYmlnMtpr\nbo+W+FHguMCqq84U1\/rjIrT5mKHV1xJNxzko2zOHAP\/y6YtWxK\/njgGryI6unI6DmW1eKGzg\/2Yn\nqYw+QHHNrgZoOckArSDzJMBds8l6cAqHFeDLnnQCrCTASsi1mShRXsC\/m61xTWSLRxU8pD8PGhco\ninKiOBlZHDR7m6GZbBMaj3GQZz2DRWD7PQrUDojQqymkQKbETAavFdrheXX8uMCKyz\/QpVWjy5cU\n13xqMxrcOcjdqsMSMHbdXs0Dd6jFNwmwgpS49KOmuvIIR7p6bvFdj9YQezK4O6D+qAlyt+iAlT0J\ns2nqJlNV\/QEDNPHM0XmXh86CcMhFN\/478PlNiB6dQ3mSH0SXHVHtYwHp9\/Mg816D1gv2aA7YBekR\nDnI2T2fnGw0D7CJTlWS\/HqROCymUGVqYrDQe0B8NZ\/1318xz5uf1jvMpTOIwF3VkUK4l416jlxUa\nvNdD4maCjG\/\/xt5HJHWoqbL2O136ovpDZIvpaQrZ8VWQua9E\/f7570K6fx5FSQlKsu8NbN981Dn9\nHbUOBiRzpqj3Woeq\/Utxx+ozGWvAlwJLbtNhA9TsmY2670mmvNaQkllBetCQIj4IO12SLRJ756DG\nbi6kbsaQHDaCeJ8BJEctUHdkNYQbp+G25V+5k9g81GHmZR38faQd7UGNgz4kToYULHE2ROOJtZC6\nrqD3NbtnQ7xrFqp3zkT1v2aiasfnqLSdAZGNDiQelijapY+766eVsf+FK9J8cv8N+zJtUQwUKZfo\nixmAeO88iO30CGj2OxBFbZ9BYDoQWU9HxdZpqLCZiafffYmHm2YIM8z\/zP4n4LdI5UWz4Daf5cp6\nt6WQndpKM0MhNu8Fg9o2HeUEVkqikAzKQttZyrRtM7mT\/oijN8B8cmeAsWvbaSNhk+8KofT4MlnN\n4UWoOrgQFU4LUEZ6\/DNHfVmhg74w326eMGeXrmuGte7vytp\/AJs+925WRw\/EAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cloudberry_jam-1334211199.swf",
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
	"sauce"
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

log.info("cloudberry_jam.js LOADED");

// generated ok 2012-12-04 11:16:51 by martlume
