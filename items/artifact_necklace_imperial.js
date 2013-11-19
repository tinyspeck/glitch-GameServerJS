//#include include/takeable.js

var label = "Ouzian Necklace";
var version = "1350443378";
var name_single = "Ouzian Necklace";
var name_plural = "Ouzian Necklaces";
var article = "an";
var description = "A necklace of 23 swirling blue beads, traditionally given to family (and those loved like family) to celebrate the feast of the Sprinkling. Based on the necklace of ancient Mistress of the Water-filled Can, Nephelokokkygia (though not named after her, because during Sprinkling most people tended to lose the ability to pronounce her name).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_imperial", "takeable"];
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
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-17,"w":29,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFVUlEQVR42u1XaUxUZxSdNE1qahM0\nsWqrDYhYqRKWulVcBhQQEDsFZFBQB1BQhmWGxY3tCQYFqQ4giwp2ZMdReAK2wrA8ZGBGhPJAUKE6\nDpa6INRXQ9vY9MfpY5KadEsYGGpiOP\/f98537j3n3o\/DmcIUpjCFNwPGtTDYfPahwGh7MZfj0W4Q\nWKiW8MNq4Bx0XhOR0WH42glaEwoyVqZGSqUGNvurpAF5GlzrGkL4aRU845Wi10LqnY2Zok3RNyj+\nl7dI7qFmXL3FoLp7GC7iMia04Dt0PxzBCkcfGPOv0RviGmkj73rJqLqTTizgYK32J9yjPShsHUY1\nq5RNQA7W8A8h8GQTHCIrCGvvcNo7LBXrRcWMqKQfZR3D2J2kwIxZ27mTx8ytxXCJUE4Lc3ux45iK\nNt0mwfGy28j+ug9u4lqJkekprpVH+V8ILN6aw0uoeow7z35FWKoCViHlk0jQtYnrdfou2r7\/GaWK\nASy0PaJZvi2H2iSqJIM68J9GWB15Q+McI4drwg0s9qzmTRq\/uTubuAtWeyGJVCM2vxNOYQ1jUsMx\nQam52s2gSPED7EVyalJLuzm0BOa7rkiNFoeOWQm7A0rmoESGE6VdcAi4QE56aV0PNwt0+fztDTnE\nCiGJ8IL7rIHqab1ym25bZmG8WyEaT2n\/xHvrLxGRsgEMML\/hVOU97I6u109wzxZUkYKMO8hqHIRd\nyGWN2RdFhC6lfYW1aSJLnhhJsjsIz+nCxFixQfo+v07gFNcmMeJdpDOoQTx4\/jvCMm5qxnWeZRxv\neUgz5RjTADPnbHr2gmCLCfF7y6aIEJzrQxXruqiSPqzaegRh6UrwiRbpeM4zCVRSiRUDaOsfgfgc\nPb7+s7LONXROpWnh+V7GMrCW3pVSg6ben3DkAo1VwgbeRNJ\/lm0ytS9VjgKqH\/7HlLoTHB1b082\/\nEkWw46j78S9IKOyCie0hbI+ugUdMPTnRePrQ5oTU8vPjtN3eUsojf2DsF33XJY9wie9gIorUzCK7\n\/cym0CycknVDLFExenGYvUy0JakTmdefISDzlu5nmvg0UKk1j6Aeeok9yUos2CylbH0Lqc+Crgv0\nwW80WsSFd9E7+BInyV4do4WVfr5DCu0symStfxt70jr1O37YJJhjny\/52D4EojQlfBMVmnFJ73fy\nW5iYHyBmzkzS347mqrCwjlIiRf4UEbk9MPOpYJdVY4P\/SfqxjUWPlJvsWBzROlfXscjhrEwWLOUn\nQShR6Sj92AJ+7YFWco6ZO4LT29jltZlx2VutQzDPS7fYmPYAqXVPIT7DltcpS2\/L498Dfr5rJXfa\ntE90rM66ci4\/sR0q9QuUtAyAn9wl0EfPWfrVE0t962hBWsurgB9f67DuNXc\/i\/Dc29gYUQO7o20a\nf9lTcoln6bi33GWR15FW9wQX24awLvSSNuDdoyYS8OyNZ5hmcT\/1K2SOlWugevACe1Na6NEeWhjX\nJ\/C8NCSxCm+1+LdHkjY+3IolbvGttFOcUjIzoN1gmX8+ilSDkCkewSu2Saq3np7vWETFyPqRW6OG\nDyGnp60sIfxy7qOicxhh2e3aleiDHVfInak9EJ7p0aw62MDTOvR0HxrvjyBXroaXOFY614yvsQss\nhFeUnNkSq9Tjg8golGex8zLlGFJB7RIHE\/Osk6ThxRo09DxHfF4nosseG25I6ALZ8SOU915AkPAN\nae8tlC7blohi5RMk5HXA1qt88h5A\/4BpCFv2cuwgGuEYVCD1dTXhzlvjzwSnNyKxtBtb41SENkc\/\ncidt9lVQToevSc6qYcB5rWBVNnHMJhaZx4g4U5jCG4o\/AJtQFykb4AUhAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_imperial-1350440693.swf",
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
	"collectible",
	"artifact",
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

log.info("artifact_necklace_imperial.js LOADED");

// generated ok 2012-10-16 20:09:38 by kukubee
