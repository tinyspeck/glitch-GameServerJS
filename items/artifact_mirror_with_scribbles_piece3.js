//#include include/takeable.js

var label = "Piece of A Mirror with Scribbles On It";
var version = "1350087150";
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
var parent_classes = ["artifact_mirror_with_scribbles_piece3", "takeable"];
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
		'position': {"x":-19,"y":-14,"w":38,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFpUlEQVR42u2WiVJaVxjHfYO004lZ\nq0YT9zQqGgVjUHHfUBDBDZDLJgiIVFBDRI1xSURrjCHighvgghI1S5tMiu0L+Ag+Qh7h33OvjY3N\ndKYz3WY6\/Gf+w733cO\/3O9\/3nXNvRERYYYUVVlhhhfW\/0NPH1fxeQx5c49XYeC4K7Xgkjs1FiePd\njsJxeKAOel3C0D1DTkgnTwtSzSkyqikp+m8J\/PO+ikv7pwO143BfPXW4rwoRH5Fz0P7xhRIBTxP8\nbjE2F8TwuuqxMFmN0b5CPLByYdVlo0uVCUpyE9qWW+jV3ybX8zDam4\/H\/Tz0m9hH1vbMqUHLXZNZ\nlc61qVnn\/hBGTbXJZh+TGZ9AhOjgr\/xSBFeasOluwAbxykwdZkfLYNPdhroxBZrGZFANCWisjkVj\nTRya+XFQSRLJWBI0TcnQNidD15oCfWsq9NJUGOQ3yXkqzFQaeghsb0c2eVYW+s0cuCeq4HpUibcB\nxfHidG1oeqyCH7G1JGKy836XCvnnRARAgIP1VridNRi2cWFWZkApSQIlToBUEIdWQRKa61IgrExC\nVXECRFXJqClNgqwhA3IxC23iTHLMQrMwEx1UIbraS2FQFUMmyYW8MRcdSh50ikLoFQUwKvPQqcpF\nlzoHVm0WegioVcMiE7iJtvp4KETxwQgVCWzVZpDUk0EtC51kZmQALbWxBCgRMtE3JGAmpA1sqKQ8\ntCtKoZaXkONixp3aMph1NbCammD\/Vop+mwzDdgpDfW0YH9Ri1KHB2MCJZ51dmH9ixfS4EQO9FPSq\nSsYdn9iiIxNq40AuvME4gsAc0ZC05fWkHHI2BJUk\/Z21uGcRYMzRAuewDC6nCmtzffDOD2B9fhSL\ns+Pwe6bxw4ttvN2jHcC7\/QBebvvJdTc2lk+8uTKP9YVn2PUtY3ttCYF1D96\/3MXhmz1Mjg5hfnYS\nY0M9cPSa0G3SwNZlgqqFBwXJoLTuOiJa+NdDMsENBvB+txrjD2yYHDTC9UCL5SkLtlenseudI4F9\njF8F\/Hi948fSkhs+3woCWz58H9wioFunsC821uBbmiN2Y2t1EQfbXuY6PYGt1QUGzvN8BiMD99Ha\nKIaojn9qHakOXWZR+TXGDCAxaMg+fQ7snWUwaiTQUHIYdQR42IG1BRd5+A4DcrDlxc7GOuaWl+Be\n8cDrW8Vz8vtmdwMHgQ08WfYwmdojkPR\/acAdLxkn9y7PPcVAn+0MEG2quRwGqgjO+8UYtmSTBXUL\neZkXUMG9+hsgbT1ZbQ5TFibtuXDa8z+DfTo5jpX5Zwj6V09hf5\/ZN7ubCL3eI+VdgMc1g4mRIaZs\nn8KY1TyMWAsxPcCD6yHZjixsWMhiFFfGQVASg8aqONzNugBOxnlPRE7aeVkB+9JRyZ0rqC6MIqBx\nZNuIh1GWikFzNmYGuZjqL0CfiTS0uomBpW01G\/BkYgyvmMz5mOxMPByEsV1zJjsSYfVpdjwTJVh2\nluM7Bw82smrrSq4RiEgGpqrga5TfvYq64pgPUkHClEXPObuRc9K\/iKZh2RmRwaLcyxCWxpzAik5g\nR7o5zGyd9iL0GGrOwEqbxJ+VTSapgN3Ew8pkGaYHi2ChN+uG5F+fe53pLzop7PTIY3b6+RCdLU7a\nV\/w\/9fZgsb489xE2P\/simWk006P0yrIob+FRXx7mRotI4DIGVqc4ae4efT5TOtfDImIeutUscl88\nCnIuMTA0XDPZzClx0rFcmOwh2eL+5VfdR9iSO5eDdAB66dNZpVc9Deu0cxkgY1sa7AbSS6oMtNbG\nM71UX3aNlCwaPM7l47K8Kx5ReQxXVBR77h\/7IKBhS3KvyEjwYE1h1AdJVSyUpF+VDYlML\/F5UUyW\neOxLqCyIQm1xTIie3H\/y9UL3LIFykPIdV+RHkW0h8gMNJBUmegqyLnLD33dhhRVWWGGFFda\/ol8A\nx2zcD\/K\/om8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mirror_with_scribbles_piece3-1348251340.swf",
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

log.info("artifact_mirror_with_scribbles_piece3.js LOADED");

// generated ok 2012-10-12 17:12:30 by martlume
