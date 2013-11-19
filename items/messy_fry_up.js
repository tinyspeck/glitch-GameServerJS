//#include include/food.js, include/takeable.js

var label = "Messy Fry-Up";
var version = "1348008096";
var name_single = "Messy Fry-Up";
var name_plural = "Messy Fry-Ups";
var article = "a";
var description = "A sloppy, gloppy messy fry-up.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 60;
var input_for = [];
var parent_classes = ["messy_fry_up", "food", "takeable"];
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
		'position': {"x":-18,"y":-18,"w":35,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJNElEQVR42u2X+VdTZx7G+Q84M785\n0wFKASloUds6YFVQW2eqnarjbhes50idoyM9pzoz1kpUtGoVGRRFFBoXRMAFEQgkIYQQAklICFkI\nYQlbWBSQgAsqLs+835fJVWo7nTnW6S+85zznvrkX7v3c57u87\/XyGh\/jY3y8nJG\/KTQsf3OIyCPD\nsQhlQ0Z49C8Ohs6VYXCtEGVumeQ+FR2AnL8EIz82FN+tC0La+kCgPuqXg8TAcm\/07nKjNx75e2ci\nabU\/1+7FvtjxoQ\/XI+s7uFUVmjikCRKRblUERd9RB4X9fwA7lifCtRJwfoD75rnI3xnKAUWLRuEO\nrPLBTVUoBiuCxsitDsp9+XCuJZFwLgQa3qUwcj22R8KWEYwL\/\/CFOskHPbIp\/Hxn\/mS0XZmIvrJA\ndMsD0MU0yCDJTRj8vX9+OOR4P7FHKT1gaFoKNP8JzFHcs85Gj9yXORfAnArEkHYKLm8ezUvJlyEw\npwfBJR2FJGAm088GiZb5YWiPMaHvIJ445o7CtS0DbsQBro\/Aw922BA8tESzvQtCrDOQwVDwE6JHt\nzCikRwz2xSHRMCfssX2OmyAety7GY9tMoPE93LdFcddId4xvczACfxbwxFp\/nI+ZyHVqbSBytj6F\ny93BCivaD868F4CE811v2KPcT+pmY1AzUYAg3TO+OaYARsy\/Z+FewP7udR5igsj+m79Q1XGLf4eD\n634LnTgIioRAXlT7lvpBcsAffbo\/i1paWnz\/a7DU5f7e7Kath9f6u7sVERyIIAdU4ehXzGCJPpOf\nGzZM5XB3q8P+HfYl3FE6d700FJUn38TOpa9g70cTcGTjK8iKC4U+fR6UibMEwMy\/T4MlZwXqbTWw\nlqWLLbLDkT8JmLTSL9Zzg4Rof4xYZmGkdjaKtk4S8qnu9FuCm0JFUy4ydZewglFthOPyMiiSZuDq\nN1M5mOnMfDTlrYLl\/AIOWbgnHJJ9EZBsfYPfs\/zgDJgyPoSlqiDxPwOu9osmwMRVryJprQ86Cqai\nv2wG8raG8BsVfBkKVTK5Nof3QqpiDkhzFmZXcSSHIRC0J+G2OY7P67IX8TlJnz4fBXvDUcwAM1mO\n8mpnoOXJkSg5vgIWi0VptVrDfqCVwLunfLmpaA\/ra1\/4oWiPP4atf+AABH06Jgj7lvlBmjAJvB\/2\n7eeu3dXP4g5XHpiCUtFklBx8hwORkyRyjqA9omvW7OVCuMXrApH88WsQx05GzvY3YSjLRW1trXsM\nJME9attmEkLnEYGwo2fFiF\/qA83RAIzY5\/O8I6nipwjhz90UgqR1wWOASL2aL3BTt4W7SfMW2V9R\nLV6AtJhgJKx4FbtZSpGDCgZtyDuAhoYGDllTU+PL4R48ePAMHAufawNwfcfonJ0bqhpdd69+7ccK\nY8aYl0hZ+xq\/lvppAI6s8RcAyTnKxe\/PTWffhzxhJqpS56LqxBxW2TNhEP8Rg8Zt0J56D9cOLMTg\n0BBMJhOMRqPY6+HDhyIGyBd5AZDc6VovOPisbmsn4Y7uDd6cqcXkbg8QNg2HmBsJnwaiIW8Nz0ES\nhZnACJBcpBB7crKl8BN+reHqGgwYtuNS3FvI2jYNF8QJqK+vB3MQXgyudbivgrcIeqgAw5qyp0qp\nkk3Hp\/E8MyYHQ38qQOiDjuzAMYDxq3+Di7vDuGueyvUUziPnIQ5Cvz0vYM1awqFyd0fwI0n87eeQ\nyuWjgCMjIxjqd\/CHkTt8xfBsBticzsl3hfB9X9aGYHzLII597oNOWQDfCHQU+cB0cQm06atxYdt0\nJMRMQGVq1HN5SNKnzeOFQPPajA9QfGgeJPsjUHZkNq9sD+CJlMMoLC6mEHMHcfPmTZirxOhVTeYr\nB0GRhipfR6fkqUPUH2l1SF4\/AY1XfoWm3F8j92wMLqTvEiDKj80SHOtUxAi5J\/RHVgjt0nXcXZpT\ncRCkB+5s\/FKcPn8eer0eWq12FPDu3bvczgr50ef2cqTvA8Z\/Ngs5Z2KRf+4THE9Lg039T\/5QT8VS\nfhEQhZCSn2BoTtc8oabfBPiscx73dAyOeMpUKpOX2z2I+\/fv4\/r169zSwqtHcCkzjqvoYiwUlzcg\nZVOEkGMEuOvjtzmYR+QUQXkKgCBInhwk5+g6AVIFa9PeR825RWPAMreHI\/XYfmiqqngF63Q65BcW\nirw6XF259+7dw\/DwMLq7u\/lF1oNgNpvBmiWf52V9h6NfRXNAgktOSeZgeQUF0LK31WWsGZNr1Sfn\nQrU\/XNC1XdOhSZnD4QiG8pDkgTvzzWqkpB5DWXk5f57BYECxTOaWy+XeXk2trZGd3T0ckEJN+Wi3\n2wVAm83Gf9cw8CvXrgmuURJTQ21tbUWddOcYQOWe6ULzpi3XyS1RY0J4KukrnmuktMNbcC4rC3KF\ngsNRFKXyEkgkkqebh8Ymp7it3YVbt27h9u3b\/Hjjxg04nU4BkPqSw+FAY2Mjmpqa+DW2VeKAzWYZ\nqk8vxMX07VynN46uPMfYErZzsQ8S93\/NoUjXJBI0NTejif2\/hd3bxKDY+ssN0Wp1KJLKUFgkFT23\nFjsanWJHYzPLxRsYHBzEEOvmdOzt7UV7ezua2U1\/DJCuU+4oysqQkZ2N5N2bkfTZVF5UO1dOFlIi\n69IlNLP\/o3vU1dXxl6coVbOQlirLUFQsg0Qq\/fHP1vqGJlG9oxF2JldnF9xuNwYGBnjY+\/v70dfX\nx\/O0o6PjB+VyubhoXsOckWYeQVFRAVRqNepYFCglKBIUEQpnhaYSpWUqHtIimcxUXFz805+ndrbD\ntdkbEm12Bwi22dnKoHo4ILlJoaeK7+np4bBdXV3o7OzkUORkW1sbd5XcJZfJeXKc4MgtI2sfKnUF\nSkqVLO9KIStRuKVyhYgXxP8y7PamSGtdvdhis8NirUOtxYa6egd7oBOtDKKtrZ2BtMHJQChslFeN\nBMLC5yCnWDqYWW5VG4ws\/FpWoWrW18q5YwoWTrlCKS4tLX3xD3qrtSHMbLXH1pptSpPZypLaAqPJ\nzJyoRbXRBL2hBvpqI2s3BlTpqlHJEp2ANJVVULMQlldouGMcsKw8V6lSxSoUGt+X8vFucDq9ayyW\nRQxQZDDW5jI4pc5gVOr0BqVWZ1BWavVKjVarrKjUKjWVlblqTZVIVVERrVarw7zGx\/gYHy9n\/Avd\nfgqN4cFnIAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/messy_fry_up-1334190140.swf",
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

log.info("messy_fry_up.js LOADED");

// generated ok 2012-09-18 15:41:36 by martlume
