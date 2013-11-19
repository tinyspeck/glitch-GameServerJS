//#include include/takeable.js

var label = "CrabPod Headphones";
var version = "1337965213";
var name_single = "CrabPod Headphones";
var name_plural = "CrabPod Headphones";
var article = "a";
var description = "These appear to be the kind of headphones only a crab could love. The sound quality is fabulous, but they really pinch your earlobes.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["crabphones", "takeable"];
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
	"no_rube",
	"crabphones",
	"no_auction",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-28,"y":-35,"w":68,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFV0lEQVR42u2Yz3MTZRjH+Q96F6Fp\nKWl+tclmN0mz2Sa7m6T50fxoi6EUKBXUGb0IOHICDSMylv4gqKCDglFkUIdxMh7kmouOJycePDnj\nZDx5zJ\/w+Hxf2AWmjdW0EA7szPeQzL7v97PP+zzP++7u2vX8eorXYtFIQLrsXcqqgaqlsh5qbqVj\nBb0qVDTKlVRqYEeAMNliUa\/NZ2KtZHiMDMXXnPCNVGWXY0lyORKSe2hwqzkk55Af9wZGHeWga7iO\nOVgdfrD2XDJcP1ow\/P8frKCfPJKPd7IxiSYld1MedZzc6dUAdNA91IqOO6mQkNuVdDSx5aDDeXNw\nsaA3ARb27q9jkiedNmHvviXFsw+BoJIeOrlFjuk1hP9pgD16xQKuuuweJl3xElav643FuNx5Esu5\n1WVK7sGIb4S0gAuAra4ViidQPMPVfnQI1T\/agv9ccqLdrTCqBt+gK56+ADJcDYDckqhr\/vFT9BHQ\nUwVgjgsUq7kRkKtXk1yky55GPwEzaqA7oC6W2NvsJ2DXSu47IG+fjwBWnwNuc4k3AvKB4NkGxJHo\nWQE8OKX+yxLL3k6\/AUu6sjkgThTcB9vP5BLbjbrPVZyMjNGxaX1pww0n5tI1nJqxJ\/YDMCUPD8yl\n1daRgt4+89rCxp1k7dyp5sG8WS9NxUV4TdU9mI6OJYqTIaEpTfLvFEyB57LmhQe8LIb1c6eql985\nvTngmycOVWezOofaV01xqEsJRZwu8ppEmegYTYW924ZcyE0mXkpHWzNGWMwND3jBEww\/\/1DvDvjW\nG6\/WDuTMNoBmzYhQLuYnUx4VMoLOjiE5e4acn9L8CzmtwyJoxgzbPvA8frBE9+5cb2wKeG31\/ea9\nxl1RRdOTQSryk0FJhQsn6KSwx0FR3zCDOhu9R09rlBmmwJGbz8aINwfbB55m2Ec\/fv8t3bj28eOH\nhbW1tcE\/fv+ts37hHF5cqDKl8sn2\/lMhchHvEAWce4QSgZGeq7ySiTbTsSBBRfYRUeSlhhc84b36\n3ln69ZefOmCyB9795uv633\/9SZW8yYMmhQ5lNco\/WF7J+SLD3VfE6+i5T5YYJqVKQmk+9wGQXzeF\nFzwRUTCA5dbNz+r2wO9u32p\/deO6CPGB1IQdwaw6TvHAiA0HhTyD1CtgPi5TKhpg+SnJ4mJhKNWO\nIH6nIuMEFjDZHfzqlct09sxpQh+0khYVlg57SRvf9xig4t7bM2BWC1JyYtwWwBA1+FlBAQNYwCRe\nP7C11VYviT9TPMgCRPnnuLVEfUO8xLtthbYFKImdAjJZRV2hxUJcBMPyTTMDWMAktl1UrQUIeiTt\nkwCspOSBTCwg0ui+vFy9sgCEFzzhbUVQADKbiODKxQviTysHkbDIh52OYEblogt5WR4yWBYgvCxP\nI+QTLGASEcQeuHzhfFP8wcR57WEPBCByEGBB5wtCEfeenttMXgsIMENxC81yowag7ccpAAawgAls\nYuDllZXE559cpVJKowJXmjUgHxsnXdpvw0HqmKPnRl2IB9sGN35DxuutiwsjSsfLhu0HgeHK2gqB\n6bHBt7+8Wfvi0w9FiBHFshGiYjwo+uCEZ6+AU0Z388SjPX+7qaQiDQDyHJTjFoY+KIqEvbIP8vPs\n26foyuqlzU9Ud27VG6dfPy4gUU1I2gd7MMXGhrCLkB32XvbijFqeS4apxA+O\/neYAdFm0D3g+fL8\nLH20vtZ9hZaXlwfWL12splVJfFHFE1lRhLYTvYf7caxmHRaOTsdFIOA1bURbH5x\/twqG\/zSRoXjK\n+AyCE\/Z8OtqcM8M79s3mxIxZfWUmiXegJjyMkOupfo\/c0esfPUN1u5WAv+UAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/crabphones-1334278072.swf",
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
	"no_rube",
	"crabphones",
	"no_auction",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("crabphones.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
