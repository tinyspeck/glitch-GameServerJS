//#include include/takeable.js

var label = "Piece of A Mirror with Scribbles On It";
var version = "1350087146";
var name_single = "Piece of A Mirror with Scribbles On It";
var name_plural = "Pieces of A Mirror with Scribbles On It";
var article = "a";
var description = "One fifth of a shattered mirror. Combining all of them will undoubtedly bring good luck at the expense of whomever broke it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mirror_with_scribbles_piece2", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1309\/\" glitch=\"item|artifact_mirror_with_scribbles\">A Mirror with Scribbles On It<\/a> artifact."]);
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
		'position': {"x":-21,"y":-25,"w":43,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFjElEQVR42u2W609adxzG\/Q\/6JzSr\nLs3Wtbraq21HdVoVq9xFQS4qIggVEeSqchNB5SrITQFbtdU6p2uzpVmzku1F3\/ZP8F3f+ic8+55j\n1xfLsmV03ZKFJ3lyEhJyPuf5Pr\/vOXV1NdVUU0011VTT\/0LzMR\/PF3VWAmsp07PXrznfv3179q\/+\n89MPzyp7Dzcqm7lUJeSbO553mrFfHjv55TsN7x+Fc0fD5UgmDW8ygWh2Dd7VJGYTMYTjUWxv5HD4\n+CH2NpMohpxvtpPhytHuVuVgZxOlTBLl7CrrtYgbL7\/V4ufnWjzKiGHVNsVfvdht\/HC4eLScL2RA\nSSCbz8AdjyFXyKKQiiGfjKAQX8LjTBwM0PbDIgrFAlZyGRa6nI1jI50geC8LVkryEfV3wTZxHe4H\nN2BQN1U+CC62txc3hxaRSEbxpFzA7jtvFdaQiS0hEQkjlogiGF3CLIE743Espimx8jqbmlE7iv3N\nSTwtDsD+oAV6xSVK7jJ8llswDjeBz60\/qRoulIqWzW4nPe0ofBMqlNYS2Cnm2LGlCSgQDEA\/Owur\n1wNHcAFBGnchm8L2egbrlG46EsDR9hglzMOw9AtYx5vhNFzFwswdjA5eBL+7\/ljAra+ui\/nIvCoy\nrYVXOwivSQu7SQ+zYRxBpwXJpSAWg37oXE4s0DUWCiDFJElXj9MG\/6wDhYQNr4502EoLMKFqhEXb\nDLfxOvzW2ywsn9vwRtJ+7kxVcD7npMo8LDsxKPvhsOihVskhkAgx0N0GNa8ThqkJGFx2eP0eRBY8\nGFMrCGwGLqsZU5T005KG7RvjecsdGAhwRncFXhqrXPgZJddQqQrObRGeVasVh30SMZQyCaT3vkJv\n223WotYW9HR9jU4BD\/28LoIxUWJ+eBxWjAwNQkMPEQ2ocLSlRDLQAe90CzxTN+GYuEZjvQEHpSfu\n\/fSE333OVFVqSvOkacgwctI3JMekZQohrxuWKQOk8gHIRTyo6SqUiHBfJESvWAiVfhz+eRdGFDJ4\n7ArabcN4eTBCPbuCedNNAryFAHXNNXkTQ6LT1ITcT87+\/a7l82fs5gcVn9vOdic474RSIUc\/eXx6\nCkbqnXJQQu5nrZJJWWtVQ4gFR+h0KpAJc5Fe7EJqsRtj8kvUszuYm7oFnbLp9CB0N3CqSk03NlIe\nVspOBsR8dkQ2kxE+6pLPZYPdbgUDbRwfhVwqZj00IIZJL8XaihI\/HmgQcrfBQeMLO+9i0cGBVXcV\nGtlFKMSfn4J11auqXiEGg14lEfShX8hjLWUs4rNmgAfFgncWwmUeQGpJwaa1m5cgHezC8lwb9JSQ\nk5ataawZUt55CLgNDNhh1auDHWm4\/cz+o4nysm8Qv\/eKX\/beG0k1DjaH8eKpGo+zYuSX7yPh7UDc\n246Yp519EzC77LT49YdM+ateG7+Bra\/0lslgXIz2sWkclAbxTWkAuwUJdjIi7G9I2Wt+uYdgOpAN\ncQmsne1YhFLTyC6dQnHry1V364\/EwBWWe5GjG6YCnWxvMlTqAsGuBu4h4etgATzmFszQxndMXEVq\noQvFSB\/WI\/fxfEcBDR0AZsFWdRr\/TKVIn6kU5SG\/dJpKjLzO3JjgSjEeyvQqSi10Imj7it32k+pL\nGJWeR5oAmYfZXOXDOHKZeW+WP8p3HJPCbr4fT3ISbNLXxBqNa9ndyqZToG5lmDFSgiEnB3OmGzBr\nmqAbugD\/DIfdYzrll8dy0QVV3cdSMcKrMDAMCFNwZona6NVTjvGxQb\/nwj1Y9d\/DiruVPX0z2stl\n+uJ4E7BxDlcXezl1H1t0IDzFdyNmkmK+Jmy6Zupjz\/sUkwQYm2t9D+OfvtZY929pKypoLFFa6+yB\nOD0gLuM1hB13jzcivZVMqDse83Vw6mqqqaaaavpP9CvoucIOWgou8QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mirror_with_scribbles_piece2-1348517540.swf",
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

log.info("artifact_mirror_with_scribbles_piece2.js LOADED");

// generated ok 2012-10-12 17:12:26 by martlume
