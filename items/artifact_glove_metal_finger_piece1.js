//#include include/takeable.js

var label = "Piece of Woolly Glove Darned with a Metal Finger";
var version = "1350087103";
var name_single = "Piece of Woolly Glove Darned with a Metal Finger";
var name_plural = "Pieces of Woolly Glove Darned with a Metal Finger";
var article = "a";
var description = "A shred of wool and a chunk of metal that look remarkably like one third of a glove.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_glove_metal_finger_piece1", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1316\/\" glitch=\"item|artifact_glove_metal_finger\">Wooly Glove Darned with a Metal Finger<\/a> artifact."]);
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
		'position': {"x":-8,"y":-21,"w":16,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFH0lEQVR42s2Ye1ZaVxSHmUHSggqi\nICgokAQRH1EUUMH4iiiKqGlL09akNa0mPlb\/dAgOwSE4BIfgEBiCQzg934FDLzfC4lYDvWvtpXAP\n93zsvX9774PN9sjrbD9SOt+L3J4WQldfCiMp2\/\/lOi1GooBd7EXE2W5YfFgPiN83guK8GBYKWN7v\nGNz5XvgSMA23tzAgDjI+ZdtJj9hJecTxdui+I5AXe+FrDfd5J6Q8935lUKxO9YnsuEtk4k5pLrH2\n2i0+bQbvzw5C3raA\/V3wP7sohu803F\/5EXEo4X5bGxL7iz6xPu0WSxMuMRnqEvGgQ3rRqyCP88N3\nbYX7UgiJP3JBBffr6pAK78ZMXx3cxIhDvS6kvco+F0I3POObAZ7kQ3fH0mOIADDs5+VBsZseEJuz\n\/WJ5slfMvOhWcNjsy27xdrpP3ecL7C8OiI8bwfI3ycnDtcC1hmoFDsOT6ahTzI86xdJ4r1iZcosf\nl\/zqcwjs6eDWAydmODYCbmvWo+DSoz01sPFhh5iPOcXCmFNkq0JhXfJVjziQeYqYULgU1+PLUH7B\n5\/0h61ciOKwqFTEAV5ACMMNhKBio\/JxHrdOWS\/Srv+8yfnEk85c1ypvFyNV\/BiykB66NmxiN\/KKk\n4DENR5hXZSgbfUZ7nQicbI8oYeFNOpF1uIz\/WaNNdpIV770Od9V5j9CyaTNAcpIoHOWGVSVYkl9S\netR6GZIPKzXaBAhyzAiH8R6iafS5bfnF+AsgRgfSob7Yt9jDZXivGm3EQ6cjXV8Bkn+EmPtGI\/\/I\nSVrgv8\/xqkK\/Ndevwkzvtgp42wiQ8JrhsGS0R8y9qhj\/A4eY8BZiI\/e2JOhmwqNymDwEkOfRACyp\nWoKUrQLq+gccda8o19KnCSVGNcDDm1Io5DFQAJKHrLNUH5slOoBG9WoFo2ru4R28BdCnzWEh50QV\nzp\/ke5l4r\/Rsnyw3vjpA1lsKczNAvGDuHPRd4BDJLysVMOZC82BRnK88A2HoHKwBFiP3LQPuVBXX\nSCQIwug94HKJPgVBIdZgZkC8SG+m6FNmNCD5yBjXMmBlw4dLxspUb10e0k14XXrjFx\/fBuo8p40J\nSLdKJiAA30tPo2Ag8Z6luXF50lVmU10mtPGa9wmpsbzsznvV5hVPRL4yoIEHjBzcmOlX6mY9OSrv\n5yyVmYmg\/ZrQ6caP6TwzTy90FLyCEh+C0waIFkriRU9NyZZCq6+Y77l3LGC\/b1ROjJaSYxXeQxjN\nALE\/t4ZV0c5KyPVqLbTcRfQVD9pLrUBqQDZvBEaIOb8cVSdxVJuQUZADcPlRI1fVk9etAGIok8mb\nwmw+WHGfUx9nF10FpOieZnhVoEHH5VjQXm4WYiMYRgg1\/LusT+UvcHQcFR3\/d09\/ThkdtOeAjQe+\nP2GDlQn31UO179RQWjjLUJ6MAy7PactxNDPeewkEZYQQayOsmG51VAQNNxZwXNnadeHN5Um3MJ9d\nNBze\/CDhOYoqOLm+rb80sKFZKITcmI\/Uv4r37CVbuy8AmQGb1UH6b1vDagZciLnUCEVJMcPhSQaJ\n2JAj1THArDycM0iU3gyq0mIcGAg75aWjgIuyV+tphwO6PktjesDoSP5pQOobZ14NqWe+fNJTGzDa\nrl5j4eYIsBBzqvOG8fzM9A0cNZCW2RFAuokeKjiOpqIMsG51fia8tZ\/lAo5bW6cu1faqPx4xH85E\nutXMNy3\/1wesjnmwlotNph48HAs+j9o6faFUaTf1gPabx8D9A4QW5XAbEiSnAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_glove_metal_finger_piece1-1348197973.swf",
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

log.info("artifact_glove_metal_finger_piece1.js LOADED");

// generated ok 2012-10-12 17:11:43 by martlume
