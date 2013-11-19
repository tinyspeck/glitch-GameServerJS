//#include include/takeable.js

var label = "Piece of Torn Manuscript";
var version = "1350087228";
var name_single = "Piece of Torn Manuscript";
var name_plural = "Pieces of Torn Manuscript";
var article = "a";
var description = "One of four pieces of paper and frame that, when stitched together, create a string of words which probably shouldn't be read.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_torn_manuscript_piece3", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1308\/\" glitch=\"item|artifact_torn_manuscript\">Torn Manuscript<\/a> artifact."]);
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
		'position': {"x":-16,"y":-14,"w":32,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEHUlEQVR42u2W309TZxjHvdjNbsYF\nS8xuXLKbJVzMGL3xxppo4hKMRgwmkrhuZiMIHfIjHVBqD+VnpS2lWAoSrNhAKy1toaBAaTnFtpRa\nkF\/CQCxsOhISE1nCH\/D4Pm88DUUoR3HJLs6TfNOT5uR9P+\/zfJ\/nPYcOCSGEEEIIIYQQfCI2okqZ\nGaq5363LYbVFGTpt0aWj\/xu4yYEqccCh2Aw6GIj0KSHUcwuGTMVUK2Nahs\/h5r31N19NGC6+edYm\n2loxU0HMlnIgsEVf9bcBm9w1M1QLqECPggqfo+5Kqv62ApfTmCd2Gn8XzXlqE4RrPHUrRSNdsuno\nQBUs+TWwPtVK9XbBBP8udeg+rZyTqpRlv8Y171GB404ezHnqYNBUBM8e1wDbLQevRQbjrgqI9lcB\nyS4E7HIKHXYxYFZdB1O1GKYeVW\/6u+Vr+O6Y7RYs+urhZVAXB3wZaoqxFuZr3lANhZcuhh0KZtmv\n1b3wazdfjGmBE5ayqeQK3dhhyIMJUmbMpM8qo7AofB5+IAVj+VUKicB4IDzE7HBdfK3VcT0FNOty\nM3hnyyi76moovgx2fS5ZpAH+Ct+BV0+bqf6OGMjp1RDpVYKnQwoBWzlwJUdFSJkxm5hJagOSTS6j\nnGaHa+OAuGbApbTygsOMYbbIL7hbbwLpUAjaFfEy7NRzrxpGO8ugvfInUvJimB9R0fJvh9lLaJfV\n8SZwm6S9N7LOfJcUDE0d6a1YW2I18ZPNDNbQMo6TTn0dNe4JuUayO9BWCKYqMTgNEprh1ZAe\/hxV\nU4i9AAM98tj50z\/8SrY\/nMxnIgKxlpj+Ompg0hRx2IG2AropgmLWUBzgP5MttExY8nblNXA1S2C7\nXxd8txPAJvoqNnzWsrn8n89lJZ1DzmYJixmyaLL3LgMpGWbC1pgDLfIsCore9JpLKPDKk4ZEGO9t\nOmq2\/4fiyu7pLHGT7U8SpSW\/AQZrpjkDY4fhpgiLY4G1lH0AiiMFOxaF76Kwk9GrO2F2E1Yj6FDE\nMn888f2+jbDgU99fICVEjXaVUjCb\/gYVAuBvMnPjO1ZtNvS15FOf8gFEhRwKLa9OXZ9smeb8g2Xi\nPIagPU258WztHA27Cf26xKr3h3Myc\/nZZ4\/wm3NB\/SaaGqf4du9w2Zgi8wuNjqWO9lfCiPmPfUGx\nqXYDW\/TWbz1sljSSbVN53xB2fQ6T7LRd6t\/AT+A4P\/IBpJCjiZBsd3n47Km0Y2TLLz7qXlWVZKbg\nFwcKr7FYSM+S22KaWxiz9+ShjHoM\/cgH0Hm3wP6oQzrovlfUbjHkyUslFzLJVl991k+o5TGNmIOc\nHarbuKf6xcpI0i9knDv+zfsspLLW8hP4DRjuZSZwliGYNDsdYb58r\/82yFwTeTpLryWd7kIIIYQQ\nQgghxEHiHdkL\/83ROHk2AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_torn_manuscript_piece3-1348253792.swf",
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

log.info("artifact_torn_manuscript_piece3.js LOADED");

// generated ok 2012-10-12 17:13:48 by martlume
