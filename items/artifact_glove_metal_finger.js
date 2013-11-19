//#include include/takeable.js

var label = "Woolly Glove Darned with a Metal Finger";
var version = "1352340458";
var name_single = "Woolly Glove Darned with a Metal Finger";
var name_plural = "Woolly Gloves Darned with Metal Fingers";
var article = "a";
var description = "Brother and sister, Tanu and Sitha, once each had a pair of gloves. When one glove was lost, Tanu and Sitha used the three remaining gloves between them, holding hands inside the third wherever they went out. When another glove was lost, they only went out in snow one at a time. But down to one glove, they simply sat at home making sure the remaining glove would never be lost. The metal finger on this one may look harmless, but is unbreakable, the weight of an elephant and once on, refuses to leave the finger of whomsoever it has been placed upon.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_glove_metal_finger", "takeable"];
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
		'position': {"x":-19,"y":-22,"w":38,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG40lEQVR42u1XaVOTVxjlH2jLLvsW\nILiwKsgOskMQJISlGFSMomBUoIgWGWiBIrKoIMriK4iIUUxRXHDpC1oVW0f80H5pp8Onfs5PeHrP\nhTcEKN2o43Qmd+YZQpL33vOce865NxYW5mEe5mEe5rHqOK7y21KVJxcO7\/QW1UkeYnqYo5gc4iDE\n+Ntrg9w\/WffRgGl2uK+ryJXrWVFppowK4t0oeesGSo+WU19HNY3faKen9wdIN9xOI1dbDV1tp8Ta\nEweF2prS6A8OrjTDM\/qYUm44muNL+9O9aFeUM8UF2lFnYxn9\/H6CxIcCQNHwlRZjNdZp6XRNKWkP\nqAxBMkt1gKdVtDLWdbFYw\/8JuMNZPmrGmqEsy5v2pXrSzggnSgt3p0l9N\/309i49uTewBJhU51pr\nOMACZRLFBthxtnNjXI2FRrETBxRehpJ0T\/FAhpd4UOElaNI968qyfeqq8n2iIac\/BVee7SNod\/nQ\nQYWM9qZ4UlakMykTNtL712P04skw3bt1ka4LZ1aA6+\/5khpqyzlAzV4lKVND5uUQ5kDKaBcOkAEi\nNH1M6csL0qnK81tRlXnyuUqVX4dmOeP70jzU6BLFzMCZK94ZQt89HaLpySF6fLefRgfPGkEJlxup\nvaXaCOyPqrxkJxVlhpJiuyPlMKD5TMdFie68Cne4kSrWhf9lBqQj2T4cuEQQa2oO0uDgCuLcXKQH\nYQZ0rYh0pzvX2+jJxACN67q4GUwZa\/mqYgmYExUltE+dTaUlqiXvo4Gezi+ovlpNh4riKSPCjVK2\nOfBKDN7AtZ0QbE9poQ68CQBGgfXMcCfKinJWWxQmuAumesGXG6qL6RvdBdKPnqcH+ks0MXaR6a+f\nxEdX+f+o2yOddLW3iepOHqKygwVUlJ9BirTYFSDRzIW2U7wxNNjdcZJqtIVUlBVFEf7Os0EyKwrx\nsaJQufWKCvOzNlgoY1xFU4DxrKupRwLb3mF6Mz1KnU1HKT8jjOKDnSjW344iNtlQ9BZbpjMHSgtz\nptzEjVShUdDFts9Jd62dhvqb6dL5OupsPcEBNjcco96uel6Dfc1081obl8xi9QnD\/U3c+UFen2pZ\nCuiDvKxEVKCXpWABbZgCTGSUTzGmxIdXKDN+C4VvtGU6cqI9zDiHmBOh0yymUUhiNytoFq8xD7Yp\nL3kzVR9WUm9nDVu818j2GKvRoXkdI6YgnYmxHiPQyfG+udfiiHqFe03BoRATg5fq6XTFborZYscX\nh3AhYrgxL86V6xQxJBkL4pacCLcWMB2xU4ciN9liG2mPKp6+Pq2h8ZFWevXtCD17cIXL5s6Nc1xG\nD\/WXOchn9wX6\/rlOfPfqzmLg50S5LGUwxJ4zlxTuzRmCw6TFkWVgDGbCZwAJ8CyilkQHQr442YML\nHZJICtnAXyMd8hNkpC1OpK6WY3yX5sH20NTkIL18NkI\/vLhF72f07PV1ve7y1+ssMlgMIAowAbIL\nGRbBOo\/abMsZM80psAOXFSxEBvISDCIqlmcaGkMzmLMwYT5O0AgaAnhIIoE5GXK4fe0sA6ajX3+c\npN9+EWn68RANzOdrh8V2P2vB1Dlbfa0JzooLsOeAli8M0J8luFMuyzEJoBTAYA4gJK2iepo0pOuv\nm20oS9Gzz+bweenC53g+dZsjX6+59gAHOTney3V6tqkKJjNY4FYCt7Ay4ItSQUNY6MjC9lWq5Bww\nugcryDLoUQKCAngpdBdLbjhTodC+mbrRMf1wYLa7cb+4L91vDk1iF6DnMLkNX7OyNIebR4qo4+Vq\nWmIYHPSwOQBnRTjPghGwBoBYvCTNkwcrWA7faEPZ7DhUxbry9wEQ3wcoNLOc+aNK3453L8dc3kzf\nrJuZGp3TDdTPlReEGyAtyErauXu3uzkwHJt5yhRx1bOZCVqUmNEsOFXFGMMkgV5WHcgpSCKKZSLY\nzI1xYVHksYRRbKXU5HzJBcz99q1u3cz0qBZAbw2eMYA5zBsV6MpC\/SQPfEVqzGxqapzLqgC3+ViL\nELTpItj2ANl6460jwG29S6DMqi5QZjkHBnB8ASiMZBpDpiAr8\/zEauXiZWDm+Wgmtp+BFVGMOSEj\nNTbzL69eob7WIhYxTsy2LT7AblXKIQ8ARfZh6xFZcLHUJP4eV84DZTKY1az1jsjOQVHaNiywO8md\nYvxXB2gEyo6rEG8rQ1qoIweJSMLzkIjkdGiW5aiwJoAhMksB5y0WgVtT2SUicpON4e88y7eeGW27\nnw1JcyD3UJiLn\/kB9uKaAGLLgr2t+MUgIciemwFC\/idzQK8wE+aJZMEPjaJwnDIpiGv+CQAWTLMR\n7v038\/CbCuKLaXStc33wAbAc8Mf82Woe5mEe5vE\/Gr8D10QvcQ3yqsUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_glove_metal_finger-1348197634.swf",
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

log.info("artifact_glove_metal_finger.js LOADED");

// generated ok 2012-11-07 18:07:38 by michaelconkin
