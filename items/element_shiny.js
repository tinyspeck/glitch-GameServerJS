//#include include/takeable.js

var label = "Shiny Element";
var version = "1351723224";
var name_single = "Shiny Element";
var name_plural = "Shiny Elements";
var article = "a";
var description = "An element is the basic building block of all stuff. This one is shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5000;
var base_cost = 1;
var input_for = [152,154,155,156,157,158,159,160,176,317,318];
var parent_classes = ["element_shiny", "element_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

verbs.disperse = { // defined by element_base
	"name"				: "disperse",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Elements will be destroyed",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Those elements done gone back to the universe.");
		// effect does nothing in dry run: item/destroy
		// effect does nothing in dry run: player/custom

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

		self_msgs.push("Those elements done gone back to the universe.");
		this.apiDelete();
		var xp = pc.stats_add_xp(msg.count / 20, false, {'verb':'disperse', 'class_id':this.class_tsid});
self_msgs.push("(+"+xp+" iMG)");

		var pre_msg = this.buildVerbMessage(msg.count, 'disperse', 'dispersed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canDrop(pc, drop_stack){ // defined by element_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by element_base
	return {ok: 0};
}

// global block from element_base
this.is_element = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be obtained by grinding chunks of rock in a <a href=\"\/items\/427\/\" glitch=\"item|ore_grinder\">Grinder<\/a>"]);
	if (pc && !pc.skills_has("refining_1")) out.push([2, "You need to learn <a href=\"\/skills\/54\/\" glitch=\"skill|refining_1\">Refining I<\/a> to use a <a href=\"\/items\/427\/\" glitch=\"item|ore_grinder\">Grinder<\/a>."]);
	return out;
}

var tags = [
	"element",
	"no_rube",
	"no_auction",
	"no_vendor",
	"alchemy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-46,"w":41,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFhElEQVR42uWY+1IadxTH8wZ5hD6C\n\/\/aPzvAI9g18BB+BP4OCocVlWRBZxEtL1ZJMW43BZKOpFxCzSr1gFBYWohACS4jXOJnT3\/kl68C6\nLJuLxZnuzBnBvfDZ7zm\/c\/ndufN\/OfyHju98+fsWNG\/VdvdWwXkLjh5OdggqoEcecHKFga5bAcfJ\n97sJkKJVDSFR1c4qR6CIchIqqHcOITsGF8gxPROVIXG85lPGqn5dpbi8o7djgHyWkX5VhmHqdATG\nyz6+1cLRU\/e\/cW\/qJ2mk4IHRIy\/wsptvdZ0nP2DtCCCbdYBnfwA8Bw7Rm26dVjw5+7cHbMxpWlMX\nAJuzgzvbD4zUZ+hCNt9vcRVsXVf3kWdgbHqJsk1GQqFt\/lRXHpr2AfT\/OYdAoCRioluicNCoXjqd\nvvYDrNRvcUt9EXIPz2btTka2d2tBVEHa5k9Tb0EOAtfLZPpgMGOD0e2pyOx6ip9JpCQheQDJdF5Z\nSb7kw5thq+vgnuhK33MOpm282ZxquKjwAjMPGpT6rN4UA9ObSwqBA9UQcK\/wGnblEsRfyrCQ3BdX\nd6Rebt9pCpCWSaNFZSYlLMdfWObETbERTAuoGoKupnIgbKSU6NKaNRqNGnoHY1ONc\/0LiP9bXRBN\npO8+SWwJM2vboAeHtrybbQJUbTtXpOeeibvibGLrBwPASFuZ6QLRicPple3JP+M7cM3WduCvtV1q\nCFI\/OYO3xI5Pz+Hi\/SW147MLeFM7hmK1DuLOgaLrPeJaUyGGK0rvTSYWxcQfBKiVIejqXg4O37yF\ns\/P3cH5xqWvFN1VgWdbSHPv2bk4e4E3nQXSz9oaRZxu1VnCoHroYAaViFQrlGlHwQhcQzzUCYlhh\n+vrsHhIXjEe2X0HygqgLOJPYvYpBFRAtW6oSd59fA0SFfZuM5MrYujDJM9k+6Yt7Rzbn6MEEiw8a\ni61fal3aCKcFVK1aP2kCRPf79\/xA8qMyKNkUtcp88eHO9kUIoBhaFI+1LtWaHiBaSXl3BXhEFgoC\nkuRNK5H7a2o1liZ8Q3THyEriUutSs4BqXJ4S9RDQu86QCmPjKSCp58GSWxiv+Hr9h4z5DlxbF92z\n8VrwSQJCT9dhYkGkSmoBF7czLQHR5NcKTUUM8xGEydiEUNkDDz+Mw291Hkj7JpheINqE7Yuu18LP\nN8H\/OE5tOBqHyb83mwAX\/kkbAmaOKjC\/sQ9Xv0MajVDJI4brAZio+CFo0Fdq8+C1Vt0\/FxPGhBfw\nMLYNCIqACIqKqmq2AkTVCmT1FkksBmefQ9PokGctQaLccI4RvZKzfTy2miMQEGGmlpIUEhcKKsjP\nr1FY\/N4ImC5WIFOqUKh3pJIks0c0NPA5hgOYUT6k6rUoN55HMU517S+LG\/BgdYuConIIjeri56Wd\nLKRI\/a2Q9FJ5dwqJgwIsbmUoIH4efSbyhvO10aDVrptxzax\/734UfzA0F6PuRUUQVgXdyLyiaqFq\naRJvu\/nXFBL\/hp\/GhMDjuMXEGCt8dsM6WuK6xstD1oD8czfpjq2uHU+ZSzwA3\/wqBUU3Y+IuKXU4\nvXhPIVW3hhLRS3bZa3o+NqzJasvfuCOAcFMnQZg+G4HQEafOIYAdtWvfqbArs5O+uVgZXY95UCb5\nLpUvKrNrW85A8nfLp446gl01qRy9jMFuA51V2tVkzH0oM5cfADRf3gnhWgDCbwMQesUBK9mB1E+B\ntP0izhvqfc458cd8WbEq9ZPu5vGAdN+f5hZM+jjlYY3Xzjym4FodwZxbCOZZGNp3OVUF3Ln+XrR2\n95KX6cz2B4Ky2f5Iu6A38xI3dnhkMrQbuIXLfYXbvtm+oEHe8nZq20ObFvRU+rjYzI2xN771q5e7\nboV6jTCNVehW7K7qblt8ymm3Du4mj38BWuH0djGsCIwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-05\/1273133946-1498.swf",
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
	"element",
	"no_rube",
	"no_auction",
	"no_vendor",
	"alchemy"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "disperse"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "disperse",
	"g"	: "give"
};

log.info("element_shiny.js LOADED");

// generated ok 2012-10-31 15:40:24 by martlume
