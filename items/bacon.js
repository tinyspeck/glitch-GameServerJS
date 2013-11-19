//#include include/food.js, include/takeable.js

var label = "Rasher of Bacon";
var version = "1354734737";
var name_single = "Rasher of Bacon";
var name_plural = "Rashers of Bacon";
var article = "a";
var description = "A delicious, greasy, surprise Piggy treat from the Piggy's newly discovered Orthogonal Meat Generator (OMG).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 20;
var input_for = [];
var parent_classes = ["bacon", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "5"	// defined by food (overridden by bacon)
};

var instancePropsDef = {};

var verbs = {};

verbs.sniff = { // defined by bacon
	"name"				: "sniff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Gives 5 mood, costs 5 energy",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		if (pc.metabolics_get_energy() >= 10){
			var val = 5;
			self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			var val = 5;
			self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
		}

		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			if (pcx.metabolics_get_energy() >= 10){
				my_msgs.push("Something smells delicious.");
		}

		}

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_energy() >= 10){
			var val = pc.metabolics_add_mood(5);
			if (val){
				self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			}
			var val = pc.metabolics_lose_energy(5);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
		}

		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			if (pcx.metabolics_get_energy() >= 10){
				my_msgs.push("Something smells delicious.");
		}

			var pre_msg = this.buildVerbEveryoneMessage(pc, msg.count, 'sniff', 'sniffed', failed, my_msgs, my_effects);
			pcx.sendActivity(pre_msg, pc);
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

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
	out.push([2, "You can get this sometimes by nibbling <a href=\"\/items\/24\/\" glitch=\"item|npc_piggy\">Piggies<\/a> if you know <a href=\"\/skills\/27\/\" glitch=\"skill|animalkinship_5\">Animal Kinship V<\/a> or higher."]);
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
		'position': {"x":-32,"y":-30,"w":65,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFgUlEQVR42u2Y21JaZxTHeQMfIY\/g\nI\/gIXPWimJRomtQkUqJUG09hqGlijAniIaKYoBBjNAeKVrQm454xbQDrhEw7nQ4HBQQ0Cnt\/iICK\ncVa\/9YXNYJtcdZPMZFwz60LdDj\/+6\/BfIJMdx3Ecx2cQsLxchnnkd153Oawsl0WGeirWx4c5SHht\nfoVCK+bK2bPmmFbLYWZtNj28enWiJHBZp9Oz3X8D4h0\/QKytDXyVlSxj13Xw9u+XhDyxloeN3WQ\/\nsAwbhs7C34szUFUF22YzgMtllhyQuN3lGaeT7Nsfwc6QHuK6BghfqAb\/qZOwNdQDwv1BDlWMT43D\n27U\/IKJtfi8k5s7YGIDbrS0J5DaFpArA24XnQLquwFbrRVi\/dgUSo0bIuebU4UGDMuX8BSDhY5nz\nLsH2zCSEGuuPKMkgXS659JBLSxU5CoiQhy8WQei4DBuNNRCjpU85HhHwL1WsDXbrN59Y4CD8Gkiv\nDhJaFSTv3YKoruWIkrQvCVWyXHJIweXiIA+5+3iMASBkwjoEkZbv4eD3Z1pUMnKvD7Dk6eUFSC9O\nQ\/rpMOy7Z2FnYYq1xarqAuxOTRHJBwdV3M0D5mbsDBAzUneelTNQXQWpqQee3V8dSgRdM3abcYA2\nHt6FbYuBPcv\/qGGwsWs6oNPt+fd2+N\/BO536wzwk9qII+aZVDfyYiU2yQIEyc5M2XEP4P2tGgzy5\nOAPJoY4CZHy4l\/Vk8u5dj6RKCvQdE7p6DvK9iKXGfiyAXj5fmPKotin45tZ1szDcdwLVzPncDA6f\n27GPFnoyfvs22bPb5ZJCJmg\/ZvNKZh+OQNLQzrIYFvsTQQNnqsnad3Xy+M\/j+qxrlg0QpvDYwvpR\nBA3V1nJpq1W64eFdLjVP9xqFDSYpaJomKnsw7wC+vb6gaEB5qgCx0tTA8fNPSGrCyCAzM1bIPp+E\nzMJT2hrDENLUQaylxVySKaeg8jeTFrIzNQHpnx5AdtIC6EIIutl8AWJ155ii\/tNKW9TUo+dtowSH\nRyw7JgLjwEUaGyE1MmKTfIhWzn1R5q9VaEM6tYe\/3wfZWRtb7tgGCIALPt+jxHdaya2ZDBzvoG9o\nbhyEruZ3\/Tnez1YSlj9QXR30njwpvZoIGtKqiDA+AOLuFFUSQbH01NM9YUOHmu5OsvfXbwxOhERH\nylsnEfr6pD82fCqFebWZLnKzAXbnp5mXF0Nif653tkNYU6fEVRSzDsJh7M+CkrnXC7D3epH1bspq\n5UpyDflVX1b4L31FPdsA+88dkKYuU6xigv6ccc5DpLOtgi51Dvfl7gt7oR9RRQTc6uwszaGB4VVV\n6mlPMsBiB4pevsSOClzuodYGW9TYU442iV4uDg7Cot\/jUt+bnoaSTLf\/W4UcS40Dg8tdBMSpxhdH\nhaLdV7l3rtNtxoMD\/Vt0HSw7+j2uoAOOk94efbUKdfhqPeQW5gtrh3m46msGiBMbamsEfBZvS3oV\nsSOjuF+3R\/WQmZ8AwWwCoE4mKaT3YqUyoKliChYDik6Dey96U+cRn8deRBVF7y5OMmaEkFotrZK4\ncry1iuCmqRMytFTFL7iu+YadYLGBm0R8fp16N15BybmJI0uc3ZcUmp8YsQVrarSS9iNOc6yr9T+A\nbJr7uyDS3gr8jFUtPo8Dg5Cpl7OQtpsJaastl5U6fJeUweISi4nOwuztWhvEHRZ9sZLYk8LgYJns\nY0RAc0bJjwwUDoniMq\/WnGXXzdZoP6wPdXlivTe0iZlRuexjB66RxH16YQ\/cLACi5eFEo5LYj7i4\nEXbTeueIoh8VMmLqhYTpDgQvnvvgx1TMDWqTwrPJMtmnCPzcgoOw2tzwQUDcj8RhqfhkX6vgAKw0\namzeykrufRlqqtfLjuM4juMzjn8AbOT2TiO55HsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2009-12\/1261531638-6400.swf",
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
	"v"	: "give",
	"n"	: "sniff"
};

log.info("bacon.js LOADED");

// generated ok 2012-12-05 11:12:17 by martlume
