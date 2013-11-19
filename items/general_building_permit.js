//#include include/takeable.js

var label = "General Building Permit";
var version = "1337965214";
var name_single = "General Building Permit";
var name_plural = "General Building Permits";
var article = "a";
var description = "This general (adj.) building (adj.-n.) permit (n.) is quite official and permits (v.), in the general sense, building (v.).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 500;
var input_for = [];
var parent_classes = ["general_building_permit", "takeable"];
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
	"bureaucracy",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-34,"y":-23,"w":65,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGo0lEQVR42u2YWUxUZxTHffDFF33w\noQ\/SUFtFIci4ouCWWKVYidSmralJi2mNVVvFpFpbW4u7lZgOVVERZJdFQUaECjMsss7CLMwMwz4M\nKCBalabU59Pv\/3E\/vCy2A7RKE29ycpfc8P3u\/3\/O+c4wadKr49Xh3mE2qFcb9YVhExbQqCsoNeoK\niUWO0aiZNqHganQFoRIcmfRqsltKe9vazJ4TCdBlNZVQg72CnI06cjXrebQ16UpdTfqwl21teFNd\nJQcqKomllOsHqaw8aQCyP3S9LBJcLbrQFwvHcq3RXtELiBrDDTqfsJ2UcVsp+9apIYCDgysLYKau\nq8WwelCwZx3Omojff2tSjhuQ\/TGlWBTqAS4mZTc115fzZ\/k3k6iproK0Fblk0t3mgeu\/g0c86q6j\np73OiPHBMbvkfzQj5zCHq67O4Pd2czEPze00ysmK5bC6yluUnXmZF1KtsZhstYVcebzfyD7Eaiqm\nu04j9T1ucY0Lzuk0TuvPq5EVgGoCDorhDMCKUhUVq6+xZ3m84uPTv+Gq4+OaHJUcsLvDQtkZsXvZ\nMl4sXhsTYH8OPd8iwAEsMy2ag+EeZ0uNmkMCLv\/2RQ6HqDXnE8tlqreVUUt9lY0tESLF9NFb26wL\nHwoyFLCsOIsHrBWgOCMctXe4vUI9UVBQsLujlo4e2v+tBOczBuX0CjmIWBwBG2GteA44fACeCatx\nL89ZtCSHTcPvO1prqNlRKdRbw2LyGOCe5Z18MVGdKYlK1qi1A6riOZSUvysCxdBz10pPHjTQH4+a\n6c8nrbRxQ9BnEuDocs+sL1DU28p7mx1Vg2wUYCwnWWupYte3eKKrsq+wfNOwasX2V0CtDBrvDMvX\nFgM9vl\/P4SwGjUaCWzxq5cwGTa\/YayvLblJ66rkBhZD8J459TUWFmaxVVJLNXEKqrCuUp0piNsdR\nYX4a3SnKpjqee0WsEMp5S8G7CHy0TL13WExxG65ps7+iPT\/R0ph1iRypShKQ5SU5dPrUAdJX5Q2o\nAXvTUs5xUECygWHgfcBeS79EcTGRAy0GvdBhLetv8gXXrkrqebmv3JZAT8dHAVT9QSBdX+dH6W\/P\no6ubVlDFjXi+APoZFoWaLfXV\/c3WXs7gb1BS\/M\/cbjmkCAGIgHqscvt8vb02syUD3M85c7Fn2qfv\nWi6t9KZ9Ck\/a7fs6bfeeQRGL3qTE4EVkK7o+qCkX5qdyNYzaX6mloZoriMjKjGEVfoHbPBQUlqNQ\nZOpNdbsg7PGRvVBsl48HHV\/yFkUFzqEzAV4cMG2dgpq3BVMlgxqa9MhHtJxiKR8RKBRYf+Vy5AA4\n8hBFc7\/D2iOp5+P2FlaZm2xp3BlKqWt8OdDZ5XModpU3DyhauCmAur4MpTMfBz13F1Gzvgeomywd\n5KDiGk35QaeNkhPOKqXCmOxWtbKvcmlZg9Vv8qfoFXPpKFMvhkHFrfahk\/6z6MD8Nyg3eD6pNyyk\nk+uX8ioW1YxmLO93yD9AIqCagEM4mXrMXqdk7Ux3xqYw0YRbG7SU\/N5yrhYAf1g4k04smUVHFr9F\nGSHLyLFlFeUEKejIhsBh25zYWfgO4nimHAoHZ6GibEv758LouVurbGcNU76QWnmIV29X+IeUHeTH\nq7iOgYmK\/mndIoo6\/d1IgyivaLQaASVXDoEiqjVotG5bS0+c0572toT23LMldLWbCeN7XvI5ylg7\nj1uJgMXnmeXfMzXDl\/tSNqtMse\/KhwarqWgQzEiA3e0W2vnF1t1saY9RDwNpSRf8TLoCrerkfopc\nOpsDIffQZj6fO4N2rVRQtDJimK0Xo4\/z4SAlMYpv+l0MwtVsGAaHZ2zcUo2q58mOyZLsIWHBq45d\n3Le9Z\/8nG+mg\/2zasYwpGLGXw8iVwzXA5PuzuLaaNBzUbCjkYMi7h532HoXv3PdHPalIh48ARGBv\nrLOU2swGNW+0dlaJQ3MOlQvV0ONwFoCwXJUdR6yn8n1WxPmo48fGNIQOUdFDsoCD5mQlXMZvXTYw\nsIVLBwFCvV+Y5Yd\/3MMhYTXuAQvIh132AThpWlH8m78qp0qqhiCpG63ltnttxmH5J1oN1AQkQjyD\nrYCDtcsWL1g7VmvdURWga6AmU6Wv02UacRcBGGwWUzbaFwD3fLVtx38FNxTUC0mODZ5Nw31oS8\/7\nVQf7O9tMGM0Sx5t3YwGduWShXzD20hptgQYjE+yEsiLw41vKO49JL\/GYIg2ZAchTKFt9J1fV1qiz\n1VvLtBvXr10w0f5NOEWyc\/qLtvXV8b89\/gL1gWIQ\/OaTogAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/general_building_permit-1334254264.swf",
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
	"bureaucracy",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("general_building_permit.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
