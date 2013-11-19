//#include include/takeable.js

var label = "Piece of Magical Pendant";
var version = "1350087125";
var name_single = "Piece of Magical Pendant";
var name_plural = "Pieces of Magical Pendant";
var article = "a";
var description = "One charming, chipped off chunk of a total of three romantically charged necklace pieces.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_magical_pendant_piece2", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1311\/\" glitch=\"item|artifact_magical_pendant\">Magical Pendant<\/a> artifact."]);
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
		'position': {"x":-10,"y":-14,"w":20,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGUElEQVR42u2X+09TZxjH\/Q\/Iflyy\nDHXzgkK5FqRcSgErMpBSoECrtAptuRRaWqBcqhVKuazVooLch3hDUUSYNyKuTNFd4tZIdJPohlmy\nzczE8yc8O89LzllLwbAZYD\/wJN+0PT3n9HO+7\/O+77cbNqzXeq3X8uuriwf4qHtDeebzbWLH+bZ0\n50Jd7sh0Tg4dIHp0XUU9vqWBn6Yq4bfHR+H1TBO8fW53oqhZm4OaPWamZu1y6sVx\/n+Gyt4X5+iz\nZTjvXcyjaDBoNiZAtV4MP758BFOv78P4qxvQeqkaSvLCwaCM8pK1MgG6mlLgwskMuHNWBlPDCvju\nyyKYmdTDy0e1BJyGnNdzO4Xgb3+1+y4bULRnu3N6TEdufPOMFHLEQXDp2RBcejEMAz8PsjJ1loCt\nTginGpJZtVTvZjXQoIDpDiu86joJkwoh3LWIAB+YEe02cfp3l4XAzrtsly8D0A8G2qTkibubU0BZ\nIYLWCRucmD4F7d+eJq+WMSsYTxvhqD4OvrCneam\/SAATSZEeuiXcBWebsgkYOooGMLAPRvJh9oER\n3jxrpWFtrne2gHjvDsjP5ZKTJ4cUkK+MA12HDgy9lUT6Th3obAWgOyKBntZUL7haTTTY4zgwHB8G\nIwlcInx\/Ypc\/GFIT4fYFNXEM749gCIj3wVeEdk1oSe++nml3Prz50Hvo62tO8\/XqMteVHjmxf7w\/\nFzoak6G6JBqK87hgLo8DK92Xi8ExgM08f7CH7\/RSzd5AuHlOyQIi1KBDBDhqJfJwGO3NZl0lw\/+k\nje7RY4FekKZSvtNUxocH17UEEi\/Ahmf6azEwRp1Nn0HpoQjQiYOhTsiBBn4A0ZFEDtQXx7A9h071\nfb4PZCIOAWR065yGHX5cEf540gZekKayWC0CWioS4M+ZZnIz5slwhvYu4Z67Wuuk0GvPhCs9Chgf\nrIbJy43kB7G3R3pywVgcDer9XJClB0J6kh9kpfizutanYIcfe\/bNsxZPJ42qUJ+6Uv4cQk4OF5Pl\ngWlmFM7uofYMeikRE13pzIKRbgk5fntQBg\/HDsPz6eNkmPDhJi\/mkfPtJiGUK3mgUUQQOAZQls6R\nq2Vhc8wxbT4Pnk5Vs04i5F9PW5weLjboo0cthj1wtUcF968V0c4lQ2dLBrRbRdCg50NrTTy5GGck\nQnx9VQ13LijhhwkDmZH4Ha4CTcZEwAd1V01JDBQe4EKxXAB6VYEZf0+VFeqjK+CZq4qiATV4Ipc1\nhhluj9ltMfBGGw1RYNJEQGbyVkgWbAJJyjbyfk\/sRqKqQh702iTQVp\/GHtuX+AmYSqNBkRVMQBbC\nMdIo4ilrbbd5Yf\/XlcXK8fuuFjHpVWaoUd+Mqx3siVY9z1xbEg5qGQdKFcGs8HNO6jZI4m8kr3kZ\nO4hEwk9BnLQFCnICQJq2gzT\/EnAU3eNmbKOlljqExP5HQGwTdoGndzf2pDJFkLY8PwSOaiMBnWSE\njh6S+IMicycLr5JyPFQoC\/IEJKtCrPZwacyy92C8xguQlsdJTeWRfBQN5mQAG8p5LEhVIZccqy4K\n9wBUSgMpkdBvtKKAl\/Yup95V96+VpSEg9viSgEzlS\/18K1RhZo0iyEwDEOkLwhwIXq\/jubQHQ9zg\nOBSe\/75JCpMP7ijucGP9Oc5\/fSOEUeYG8Bmpsjb7vC\/c219afDDpLBxegypybs0zKIHDwLBgBo90\nSWB3zGb4X8DhPu2+e6GUuSEQzfV1rhkcLsIIh4HW3TmUtTIeYsJ9IYb7sWP1weg9lh7O0cVcQ1Wq\nefNwBPAj\/qqDYa\/hluYeYFEYvYrp7VDA20TghPzQ0VWCwj9PNhcuIYs5hjp2WAiSVH8Sv5IFW7D3\nXKGhH\/isGFijgef7\/Q3NHC4bGLcwnSDIjTMyuDs0H\/ex79A1DK7u+TAlYSvFC\/7Qd0Wdw92orzWZ\nxLK60hg6Zwo83Bvvz6GDcCLrGiuhH5Uu3Bq44kOLwcNaKaRB\/on0t+mE3kmHXya4HpSELIRzieP9\nfFdlQiAg7tnHTQIS8+sNAjawugdXxjWRcLt5VZcSiyFKzoQN7aEILzhUbloAJdrt51g119yrxRjq\nY9FHUQiISdodTLU\/jKJlxkS9ptsYThRrVbaLgNH\/P1Qy7oBaGpa25mDuhTDq\/cGBG9ZrvdZr5epv\nrGnrh\/sL8NEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_magical_pendant_piece2-1348198034.swf",
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

log.info("artifact_magical_pendant_piece2.js LOADED");

// generated ok 2012-10-12 17:12:05 by martlume
