//#include include/takeable.js

var label = "String";
var version = "1337965215";
var name_single = "String";
var name_plural = "Strings";
var article = "a";
var description = "This is String. In theory, it can be used for constructing fabric, rugs, and other basic furniture items. It is a pretty good theory.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 53;
var input_for = [273,274,296];
var parent_classes = ["string", "takeable"];
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/1160\/\" glitch=\"item|loomer\">Loomer<\/a>."]);
	if (pc && !pc.skills_has("fiber_arts_2")) out.push([2, "You need to learn <a href=\"\/skills\/136\/\" glitch=\"skill|fiber_arts_2\">Fiber Arts II<\/a> to use a <a href=\"\/items\/1160\/\" glitch=\"item|loomer\">Loomer<\/a>."]);
	return out;
}

var tags = [
	"fiberarts",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-12,"w":48,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEZklEQVR42u2YW1NTVxTH8w34CHyE\nPPStJZPpSLWjbWWcIiUtRomAVeCkNDCA6AECgkCIyEUCQiiES4F4wJAQQEyAghDAgFzldsr9zvFC\na8GHf89Opwyl4yMnmZE1s+fM5OyH\/1l7rd\/+r4hEJ3ESH0nscV3it6st9BbbwLxabGI3Zhts69NG\n7f52B7W7ZBUf3js\/apArAn1sCpkPJYi4tytWhl\/Y\/r0RU4MPsTBmQL0+CnNDpVibrnet\/W07926j\nXf\/Xert2Y9YIWnUeJfeu4tjFvVmyyF8tmjE9WITe1nRkJsqgSQ4CFeKL2z\/7ITXen\/89A2TP3JAe\nEw4dmmvj8digQkLUN\/SxinvPdUqnB4vxsl+HJ49u4rbKjw71\/8Tr8J4rMsl5KuS03lQdz9aWKJF+\n6yKykgJtwQE+4mMVh50Br825R9xQpwaOtlSoY\/xotzfC0kiFmJtvlG\/MMvq1mXqOfVEGS00M+lrU\njNtE7czWepGuI525PFmDSccDEGHkaHtbU6G\/H8qQPW4RNz9SQa3P1LNETKcpEQPtaagrVfI19D20\nKT+gSndD6xZhpL4IEkZ78tBhSsLTBppHQggpbudPYWcohexTb\/fW2kS1k7Bs+Lf7yKQDkBb\/Le12\nUQdcW27WE8DWl1KIDT\/LEhxgp9v7\/XYHvbvayhEgkxpkX\/yCueEyNi9LIZxwvt7khPJjPbloqlJx\nNYVRYiLszbLFBeIeawqeWdUwVarQZU5GtyUFd29dZAUTuDnLsKtTv6I8LwymGpohKCFd29eagsrC\nG4iNOMvydygTLPOhrXVqPfmY\/LtyHDt0D92pGO3Jh+NpPlanavHcroG5OgbXL3\/OHb3Y+b3USHcu\nn8EAXAmUSAURSDg34yyB057pylpJTiiUYWe0R68v4lz4y99lDujoCzj6\/tji3Wa7kziPNmMC7zb8\n2A8dHXEv07xrqdKFIzhQIgwLF8fLpS\/7C\/niTyQuA4nRFxhdur\/Xf\/nY7c37Pf4j6tDdfAfxyq+c\ngmWP71SWoIO4DYVMAsODHzE\/Us7tbdu1rxfN9O5ai\/b1kpkj3Wyujka44hQrGBtJZv5cf4K+tgxE\nKE7pYyO+thkKrvE2qsjl4xbGKvlnE4a7clzHGnnVV7jM\/WvBiZnMSQ066EhN4nf0w3sK1lITx7tj\nJTrNqagrodikaD9KJHQQGBOsZKsv4eixFdwJkpIVEfKFVOSuIPU13luA2MhzEHliTA0W28xV0VBd\n\/5L1SIH7W3YX\/9ISAmweJ454v+XJWhjLVIiLPKd1uyAyiR0svjn2tuw24pSzk2VQBH4md6u4fwYe\nI\/5YawXhHoHu1hyDnpZMBMsknKBs+5+4RRPFLZhcMyyx8f3tWRh7lovGChVCgqScYJbpQy55wlGI\nAZsGjyvjuBz1JfnKuMEzLDw3b6LIMZK\/HMpyr7FHDYD7Z4wVq23CUYTibAUXFXZa7HEYmezXMcay\nKChDfRmRJwaZ+jstGVKPGRtP4mOLvwHobhsTvuFCGQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/string-1332892798.swf",
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
	"fiberarts",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("string.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
