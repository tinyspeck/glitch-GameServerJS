//#include include/takeable.js

var label = "Piece of Wooden Apple";
var version = "1350679222";
var name_single = "Piece of Wooden Apple";
var name_plural = "Pieces of Wooden Apple";
var article = "a";
var description = "A splinter of spice tree wood that makes up one fourth of a most wonderful apple decoration, fit for a mantelpiece.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_wooden_apple_piece4", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1315\/\" glitch=\"item|artifact_wooden_apple\">Wooden Apple<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-7,"y":-26,"w":13,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGf0lEQVR42s2YWVPTZxTGuWmH7Cth\nCSiioJRd2WQLYhAIJCEsCdkgCRggQBJABBSISutSkFRqL9qZDtPtsuNH4MIP4EfgI+TSy6fn\/JMg\nY+868499Z94JufvxnHOe87zJy\/sPJxAI5He3qE3dzcrkzoruLDotS7pGZA15\/4dj7lAnzJ0FH3vb\n1OhpVcNiUsJpUWB8QIEhk+KspU6ebKrOv\/zFAK13DTB3ajDUo8NAlxa97Wp0NavQeUuF201KtDUo\n0VKvQNClP91dM+Ze1VjgMux39Rjs1gp3fEAHz4gW5g6tANneqERrPYPKMT0qTfkcX+UWcnqsGDvL\n1+EfNRKYHt\/FlVgPKdF3W02QGnSTmlkVO2\/JcX9KgZxC9hHEcJ8Oyb0WbM8b8HZHg\/i0FsO9OnBf\n0vCghyBbCbK5TgHXsJT+GWnKY8lRXw7f0Z2ZCMRjL8bRbiOi\/kI4hwowai7AyB09+ju16KJS97Vr\nCFSB0IQUMw4p3MPSDzkBdI0UnjIg38OdJsSDFaRQMRz9BdSPBppqgqR+ZDUDNhVWvXLMjAkqwmaW\nJkQHXPAYT7KAXnsR3u63kUol8NqKhGsnJQdpwvupFZZdKuwEFYhOyXhguNypioo8laiAjyLlCQv1\nGwMOmrRU5puYd5chMFYCH5XdPVJE5dQj7lXhSVgpAD6aUWCWVPTauNT5M6ICbi+Wm5zDhlRWxbW5\nCvz8vA0LUyVYnTFgf0WHX3bVOH6oxP68EruhNGDEKRMAJy2SD6IDBieKzwEnLQb8etCBnUil0Ise\nK5XaasBuWIPjDSX2ZhV4TICrHhkpTAqOSDAm5kRnAJEF7O\/S4PnDWvz45FZqdpJ6kQBdlkIsu3V4\n+1CFZ2ECDCiw5ZcLgB6rFM5BEcvMgMvTZWdkNxjo0QqQ96eM+C1552PEd4mGoVgAnBg04CCmwqvl\nT4AhRwbQkn8iKmA8WIbRfsH7BE9k4z7caUzFQ9c+OqnkXGa2HL9Njzdr1IfBNODihEwAdA3ln4oK\nuOg1YpwU8o0WgTdLVsW96PUU+583A8jmzYD74TRgzCUTetDvkENUwCV\/6Tkg38B4MZkw7eWNWko3\nSlj79JgcSgP+sKrE91TmTZ8cUZpkt1VCfigRFzAWKDsHDJO9MPAIQbHlkJHjHsUwK609AZDCxFGU\nrMafBpwiBZ0WEQE35680cA9mARluzlkCG0WwsYEC7K9X4u5tDa08nQCZJMDXKwokQnKsTKZL7BzK\nPxPVCz8HdFsLBUCOXM83akghNWykqMOsPQd8mgFkBSfFHJKLgFMEFqVy+x1FAiAPy\/bSDbxYNyLu\n02LNq0QypsSriBxbFBpWaIpdVN7JQRFt5iIgJRvw32zcQ6b0fmbon55cxfG6SlhzQv\/NyLDhlmNh\nTCoMSMipTuQckDdKFvCvZKNgLztk0FzeZVcaMGhPDwiV2JRzQJ5iBuQnwZ9HjULv8Q7enZVjmXrv\nwZQcHlLPaxfRA88zYcaoGZBthQHtZv25Yf\/xuhEvIwpsT1MWpJDAwxGj\/kurJ3knOmDY\/QmQ4Vg1\n\/s7P0c3FKhxuVpCtpLcHB1UejnnawwQHW6\/IeTAL6LhXcA7IdsOA\/EY+eNSAmF8lqLfiTO\/e5XEZ\nArRBRs0SiJ6oN8MVKgZkW2FA9sAsICfsl1s1WKKh2KLVNptJL0s0vQNdEtRUSk9EV49X3UVABvPY\n0kbNb5SXW9UC4AN3Wj0vGXOYPutvSFFTlYPfbxjwvqsEnAcZkKH4k30wHiqnHixFlACXJtJbY456\nsL9VhtpK2WleLk42UfNAcCidpT3MKo5Tenm1XS88L3lq2fN4ayzS99oqGequiex9FwE5XjEgq8jG\nzOGVJ5n7jx9GrB5vDB8pGLQK\/Zcb9fg8jpTbeSgYkH1PSNZ0+V0y59ILfefLRKoQwU4MSih+5fC3\nmQdzlxIXAXlyl\/xlVN4GIUqxchlDplAgwXBv\/kleLk80UJrkwWBAjlcLnlIc7TWlfKMKoeeycKzc\n+IAkNWkW2fc+P6TeKQ8Fv+gY7vBxPSKeIjRUSzF2Lw1mMUnQ2yZFR7PUnvMfMF0jhpTHVoSIrxRv\nEnV4HS\/GzW9oSmlSay\/cnJjyv7eIRjXnMuLp6g18u1GNuEcprLGLcDVV0rPaSknsi\/w+vRossx88\nbsRurBJ7dJ9Fik4G2\/Nnrhi\/nrha9rU970ufF1uNid+Pe9+9fzeReP+3IyfW8Q9cEuJajgUAbQAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_wooden_apple_piece4-1348254332.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_wooden_apple_piece4.js LOADED");

// generated ok 2012-10-19 13:40:22 by mygrant
