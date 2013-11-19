//#include include/drink.js, include/takeable.js

var label = "Pungent Sunrise";
var version = "1354587265";
var name_single = "Pungent Sunrise";
var name_plural = "Pungent Sunrises";
var article = "a";
var description = "A refreshingly pungent sunrise.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 197;
var input_for = [];
var parent_classes = ["pungent_sunrise", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "0",	// defined by drink (overridden by pungent_sunrise)
	"drink_energy"	: "20",	// defined by drink (overridden by pungent_sunrise)
	"drink_xp"	: "10"	// defined by drink (overridden by pungent_sunrise)
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

verbs.drink = { // defined by pungent_sunrise
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $energy energy, $xp iMG. Grants 'Small Enlightenment'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			if (pc.buffs_has("small_enlightenment")) { 
				pc.previous_small_enlightenment_time = pc.buffs_get_remaining_duration("small_enlightenment");
			}
			else {
				pc.previous_small_enlightenment_time = 0;
			}

			pc.buffs_apply("small_enlightenment");
		}


		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Small Enlightenment buff (doubles skill learning speed)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !(pc.skills_has("cocktailcrafting_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/45\/\" glitch=\"skill|cocktailcrafting_2\">Cocktail Crafting II<\/a>."]);
	return out;
}

var tags = [
	"drink",
	"alcohol"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-7,"y":-32,"w":14,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJaUlEQVR42r3Y6VNT9xoH8P4H90+4\nL9qxIAlLQkLITthkKxgQBBTQFqqtC2i1bphQEJVFVJDVyBoISwgkISQESFICAQ7JCYQSbH4mQQ+B\nWLVab21nvM65v9i5c\/vyjjPHM\/O8O2fOZ77Pc5Z5PvnkAw6VDQtTrz4pnVjfKZpY2ylSrmFFShQr\nUqCPixTWQLlPKFY8GaPL7kMTtsfpGtsTnn7lxT8+IfqYsPn+qXkP2y3XuX9P04DXAuXmS8Ho+jPB\n6OquoN+KCfqXvIKeeSB4YNoUdMxsClp0qwKJcT1XurBZPmZ1XyYUqrJ5n5gwXDDjfSvQef8Q\/L\/A\nRo1V0ACr07herEK9CuKAqBfXrGEjHwK8N2NPU1o9qNLqNhAGHLdvN846d7rnXbsrM86dEd36dpd2\nw1euXveV\/R0otbjTBpcelQ0ugnI4h13yZaDV2b1Ovc11Q77kukko0PECT3309HXprN1VMWKyNUr1\nS9Ju7fxks2Jmsk46MXlnWD86sgQaZRZXY5dh\/dv7M47DRY3KoLHZ5fzRaUv+RwMa0M3Sfo2htLa1\nr\/Rk+Y3SjK9OlkYmCEsjk3IKzvYvBJ3oNASdaNMFlbQpgwJAmc6cL9WYiAduWZZPvZwcXX4ubfXv\nttf7vbdEfmdFmd\/+3RH\/Ykmmf74w1WfO3+cx5gg8+v1sjyaV4RlPoHhU506MtEv6swkF6s32oZcP\nbmGvFb3+Z30BYJ3fWw+B4jI\/erbIv1gs9JsLUt4DZ7MFnqkMlmciNcozFkfx6I4IfYqcfVZCgfJR\njWGjo2bu+Zj0YQC401rr99Rd9W+ISv22M0V+y1cZftPhZN9cXqJnJivGo0tneVQpdI8iLsKjK870\nDXyVYSMUKJOppnuLDzks7TXb5qYq90LtJd\/KjXO7i+Jv\/dribLf6YML2uJD\/WHcwFsyVHZw0ntr\/\n88hhwaPuTNZDSWH6z7UJTAfhQEm+cFVddQUMfX8K9H5zBLQVZIKGjHjQmpuw1ZzFe9Kyn+W5n8nZ\n6BCyN24Jwu1iyqeIKOJT5HZGvLMmPpp4YIswEf07sB0C70DgjbgoIKbvBRXUPc7rtM+Rauoe5Brl\nM6QKAn8IAL+IddbEMYgHtkPgXEfT1kTlZXc\/BEog8B4E1kFgVdReUBm5x1lD\/xy5SduD3KR+hlyn\nfopUQ2RTKt9ZH0MjFjgYaHFWIqq7Vg7Gvz8Nhk4cBT2FWaBDmAjuxkeD1qxkb1My9+fbUUFIA0Q2\nQORdTuhKHYQ2p3Kd9SyynVDgMAT2HUhCpyFQfaEMyE8WA2lRDpBkJoF7iSxwL5756A6X8rCZEYI0\nRQUjTfQgpBFCb8OWtyRxnQ3RJJRQ4Migaro\/Oxk1Vl8F2otlYPxUMRiEwG4IbIHAu0wyuEsPdrZB\nYCsEtkJgMwQ2QWB7ItvZRDRQDoFDEGiCwCkIVEOgvOggkGYmA0kiG9xjhoJmeojzAYOESKJCEAk9\nGOmAyHZaENKZyN5sIx6onlZkp6AL1SIwC4Ha08Vg7OhBMJidDHqS2KCdHQruR4c4+1gkpJcZgvQw\ngpEuBsTBmexO4rjuM0OIBSogUJmTgi5eFwHT5TKgP10C1EdzwUh2CpAmcYCEHQa6oklOGYuMDDBJ\nyABsdR9E9sB29ySyXJ3RBAPHIHAiJxVdvi4Gc5fPAAMEaiFwDAJlENjNCQNSFumnETYZGYYpDsIU\nZcxgZAACpXEMlzQyaIVQoBICpyDQCoELV84AY2kJmBdf3LLUXffJU7ignxsBhtmhjnFOKKLex7Ya\nv\/1yY4wXjsgDUAHdJYPzSChQBYHTuamo\/YYYLJd\/B7+3X4PZ4jygzUkD46l8MMyngDFumEMDURMQ\nOQGTVLFJyHggTR7VJYdJEgpUD6unTXlfoKs1FcBafg4slh0DP0Kg\/mAa0KTxgSKGAtS8MMc0PxzR\n80IRLYeMTHJIEEpChrnhLiXjIwDNeenoTxCIXj0Hls8cAwslecCQmwa0aTFAFUMFU7xwh5EfgRhg\nigaY4jRETsEkFaww1ySTYKAGAi356aiztgKsQaD1zHGwWJIP5nLTwXSaAGhjIsEsL8Jh5lMQs4CG\nzCcwVowQaWCHIir4dE\/BWSQcuHQoHX1YWwnWIdAOgUjJIWDJywCm9FigF9CAmU91TLIj1yXR0ds1\nNM7rylDKb21UypaGEeKcga8eQoGTELiQzEZcELhx9TxY++44sH1dAJbyM8B8RiwwxtKAiUfZqGXE\nv23gZeDlIVH4hRAafjY4Eu+PJHtN8P1IMFAzvQSBAAJdNZXuxQvnfbLcw\/+SpArfNMckvKmns970\nMKN\/keWW4S2xWXgVOQqvTxLiF8gMvIVK9S+wCQZqIRBJ5iBuCLRViX3j5yvx3kPH8ObkTLyOl4RX\nUDm4OJKP92QU4w0RHPw6BIrJdLyCEYP38rk+y8cCOm9UeuWnL\/zbVN2BS\/OK8bbkLLweAish8GoE\nC68MZeA3YVVDoIhEx2sS9+PSyHDv8scArkCgSSR+PnGlBp+6cgvvPlCIt8IEb0HgNTofr4lPg6kx\n8CoI\/IEUhV8h0fBKMvX3RTbZgXwsoBEC+46fwXuKjuMdBwrwJgis5Sbh9QnpeB037u0Mh4Y1RND+\nbAiP\/LOXFvFsgRu+gXDI9o8CNCexnfaqqy+6IFBSeAxvySrAG+CDUM3dh4sZAlzOjHxhE1CwFX4E\ntsQLwyy8UMzMImMm5l6vmUlaI\/Z3S6aam01iY46KS8+mz5a97ij8+t1d4SG8Zp8Qv8ZJfDfEYfy2\nEEPZXYyhYBYItHDCMDOHjBlYJMzADMbU9CC3zLB6m8D94GO94uTJ44b0OGQh74ud+YLsp5O5wl\/V\n6cm\/zqbwfjHE0p6a+NSdHyHOxAnHTOxQzMgmYzPMvZieRbYM1d1rV9o848R9i1EvrkK9r5Q275Ja\nNbuqfiAbmBJXDusuXtQbvynBjN98iRmPfYkZjh3BNGfPTmkuXRqWt3RKFaNTMyMrW5ox25YHXmsg\nMEHvH\/LNV22Dj3DRwKN3ogHXW9HAw7eiwZ9etsgcv3bKHM\/\/qrVfOvvszxu6Ha9FnY5XIsnqX3Uf\n8Z8fQ9xNBCa4VRhIULG6MzWE7ixIrbsrfYjvoXR529cXqKX\/Fva+epcxT491Vztg3TbIrE8ejNu8\nusAintBNf2BLH4BOoFuiwEJcCdumWN12yO3bm3Lb\/0ph3XqqsnktcCwa3p9rw8I+5H7\/AWY5m\/A8\nTNTgAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pungent_sunrise-1334209124.swf",
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
	"drink",
	"alcohol"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("pungent_sunrise.js LOADED");

// generated ok 2012-12-03 18:14:25 by martlume
