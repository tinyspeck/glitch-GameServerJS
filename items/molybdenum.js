//#include include/takeable.js

var label = "Molybdenum Ingot";
var version = "1345780567";
var name_single = "Molybdenum Ingot";
var name_plural = "Molybdenum Ingots";
var article = "a";
var description = "The glint off a good piece of Molybdenum is like glimpsing into the future. That's why it's used for sophisticated and desirable electronic gadgetry.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 100;
var input_for = [183,187,208,209,213,214,218,219,220,221,222,281,283,284,287,300,301,302];
var parent_classes = ["molybdenum", "takeable"];
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
	out.push([2, "This can be made with an <a href=\"\/items\/621\/\" glitch=\"item|alchemical_tongs\">Alchemical Tongs<\/a>."]);
	if (pc && !pc.skills_has("alchemy_2")) out.push([2, "You need to learn <a href=\"\/skills\/81\/\" glitch=\"skill|alchemy_2\">Alchemy II<\/a> to use an <a href=\"\/items\/621\/\" glitch=\"item|alchemical_tongs\">Alchemical Tongs<\/a>."]);
	return out;
}

var tags = [
	"metal",
	"advanced_resource",
	"nobag_advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-28,"w":50,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF10lEQVR42u2YWUyUVxTHSVdT09LW\nmrRpGrVp0rSx4aFN2qZNSJr0oU996bsJD+UFGJYQ2ZFFJICyKavwsSk7yCoQNsOmEhjQsijLgCC7\nDIuyCTk9\/5u55JsRZRQQHrzJP983M4zf757\/Ofec0cLizXqzdm+dPn1a4+3trQQGBh47aGCWjo6O\nip2dHTk4OJCLiwu5ubkpnp6e+w+KaHl5eWk9PDyIQcnZ2Zk0Gg1JWH69f6AXLlywDgkJ0Z87d44Y\nlM6cOUNsMQHW1dXVCNbe3l7hyL4+0MuXL2vi4+Pp0qVLFBkZSQxLDEtqWI4subu7G8GGh4f77ilY\nTk6OZVZWlnL16lVKT08nRVGIYSkuLo4uXrz4DGxAQAD5+vqSj48PJScni+\/wd633BK6mpuZYeXm5\ntqSkhK5du0Z5eXmUnZ1NEhYAiYmJz8BGRERQamqqeB8R503psNFdhbt9+7Z1Y2Oj\/saNG1RbW0tV\nVVXEsLQVLGAkLCLMMIR0kNBsMz4L3zW47u5uzZ07d6i9vZ1aW1vp5s2b1NTURIDlqG4Jy2kgroBL\nSEgQkYuKihJwYWFhFBwcTH5+fju3+v79+0pfXx9Bvb291NXVRaawDQ0NVF9fbwQLZWZmisjFxMRQ\ndHS0sPr8+fMiP1HtTk5OupeCIaK3WO+xDk1NTX3e39\/fwSIJqJYpLKcAtbS0CFikAKzdKh9DQ0PJ\n398fVa23sbGxMgfqbdZh1seso6wvJicn\/xwcHJxjkdTAwABtB9vR0SFsT0lJEbbKolBbi8rmA11v\na2trZU60APYZ60vWCda3ExMT7sPDwyQ1NDQkpNPpXggKSEQOYLD1edby2ajjg3tbuPdZnxjAvmGd\nZP348OHD0pGREYJGR0dJ3j948GATVoKqIQGH3IuNjRVgsBb3ptZyUWjRt7eDO2SI2nHW96yfVlZW\n\/hobG+tjQOKrkfCehJWgash79+6JagUQLH2etWfPnjUb7qjBzh9YvywsLPzLEIvj4+PE9gpxDgrJ\n12pQNSTg0tLShJWAeoG1ZsG9w\/qUdcxg6a8zMzMheLiE4sql6elpI+E9fIYNqCH5bNw8415kLeD4\nzLM0p1o\/NOTcd6yfGapCwkmwR48eCc3OzgrhnjdhBInvoGIBh46RlJT0XGs578yGe5d1hPX106dP\nf+dI9KnhAAGYubk5WlxcpMePH4srXqshoZ6eHsrPzxdtLSMjQ5x3snLV1nLemQdnAPwA5xsn9R+s\nBdgEQERFRg4wT548obW1NVpfX6fV1VUBiUgCEFetVkulpaVUWFgoInjlyhURRWmztJbzTnnZDiHs\nzc3NTYMlnZ2dwi4JiIdzsQgouTjSAliv1wu1tbVRZWXlloAm1iov3U\/5eR+xvmLAUSQyxJOJSHoJ\nOD8\/T8vLywIMEcQ9oPE+ei4O4YqKCgFYUFCwCYipRWWt8koNHxHkpv4Pdo42BDsYVrQlHBeyMACD\n\/INwD8Bbt26Jv6uurqbr169TcXGxyEFMK5gB5Rj1ynAGwMNsTxZ2j8SGJfjHMXE0NzeLQ1cWBOwE\nGAoIk4qEQ\/QwTmGT2BzmPhSIwVplRyMTWhvDDeMhqD4kNcZ0WAXrkF+AXFpaEnmIq3owReQknJz1\ncEDDiR3DycUD5kmO2H94AOCQ0IhmWVmZyEcUDiA3NjbEQICCABg+Lyoq2oyctBab5LzT7NpUjDmP\n8+0451AFEhstCA\/BQxEl5BqaPioXtiPXMB1LMEQeAyjgUGScd6d2\/UePoRcf4fxJRBsCJIoGIHV1\ndcJqTCfITVQpoBAx5BuiDVsBx1W7+3AmXcWSH+SA3644HqTVmIbv3r0r8g3vIVqAwiZwfiLiewpn\nWjh8qP4WFBQ0h6pGxGA1RnfkHoAQLdnGDNfXA6dePOGeQFMHEKoaViP\/cHzIMWrf4ORCU2egQhQB\nqheScCw9R\/LvA\/HfaJxr4cg\/ABomZD3LyuIgLT4nT+H3LQMePDi5uONYHVi4N8tk\/Q\/a2Y6TMGSJ\nHgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/molybdenum-1334275905.swf",
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
	"metal",
	"advanced_resource",
	"nobag_advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("molybdenum.js LOADED");

// generated ok 2012-08-23 20:56:07 by martlume
