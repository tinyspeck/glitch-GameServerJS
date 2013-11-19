//#include include/takeable.js

var label = "Spinach Seed";
var version = "1347677151";
var name_single = "Spinach Seed";
var name_plural = "Spinach Seeds";
var article = "a";
var description = "A packet of spinach seeds. This can be planted to grow <a href=\"\/items\/230\/\" glitch=\"item|spinach\">Spinach<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 12;
var input_for = [];
var parent_classes = ["seed_spinach", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "spinach",	// defined by seed_base (overridden by seed_spinach)
	"produces_count"	: "12",	// defined by seed_base (overridden by seed_spinach)
	"time_grow1"	: "0.5",	// defined by seed_base (overridden by seed_spinach)
	"time_grow2"	: "0.25"	// defined by seed_base (overridden by seed_spinach)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be planted to grow <a href=\"\/items\/230\/\" glitch=\"item|spinach\">Spinach<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	return out;
}

var tags = [
	"seed",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-27,"w":23,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMmUlEQVR42r3YeVSU9RoH8M65p65Z\nlm22YIvVvVl2s25dM1us7s00rdTSMtLMTEXcSTS3CQUUBRUFERFQRJGRHURkmZdhnWGGGZiNYZh9\nH4ZVQBSt7\/2978AAIjLdPy7nPOfIcDznM8\/ye37ve9ddw\/z80WWnBsbNTjN1s91A9bTpqWvNaupa\nUz3V5VBQnXYZ1WmpodrN1VSboYpq0fOoZk0Z1aTmUo31xZRDWUjZ5ZcpqyyXMktyKHNNBmUUpVJ6\nIZvSV52nFCXx1OUz26ex2Qv+ctef+cFVOwbG750W3LxixI02Pa63aHCtSYWrjXXossvQaa3FFbMI\n7UYBWvU8tGjL0awugVNVjEZlEeyKfNhkl2CR5sBcmwmTOA2G6gvQC86jriQexSn7duUmsh7wGNdh\nrx33O8H8cdUBdDuZ+L3LgZudNtzosKCn3YTrbQZca9Ghu1mDq04VuhqV6LQr0GGT4YpFgnazGG1G\nEVoNArTo+GjWVsKpKYdTXYpGAnfUc2CvK4RRkov8xF0Bfwp4o1Ux\/UZTHf4gWfuDwEiJSQZtJKy4\n2UFn0oQb5Av0tBvQQ2e0VUdCS8Aks81qdDc1kO9EMuysZ+Bdjjp0OuQkSLbtUhIy5st0OsjfmtSg\n2AfOF7EDvTwG9jQr1t9oUuD3DjNBWpny0v+mS0z6kClzT5sOPQRFl\/s6QV1rVpGy1xOYkin9VYeC\nwOSuFrBJmDbosNagwyJ2tYOpmsmyTVWB3NOsioKzrOc9z2BzHavHKXfjbnaYXP03BKcmuAamH4fi\nZAQn7cdZakjpaRyBmYRMv7abRFBVZeL0nu8qDvi8\/ZrHwPi6aaw4xTSc0H7ARLTmfRzXvIco9TRE\nNkxFhGoKjta\/hXDlmzhc9wYOKSYjTP4PhMpfxX7ZKwiRTsQ+yd8RXPsigmpeQKB4AnaLnkVA9dP4\nTeiFXcKnsFPwBA7WTkEcZyHi9izkBK94c6LHQLlxc7xQ\/wOEjhWusP8MgW0ZBNYfUGX5Hnzzt+Cb\nFoBnnI9Kwxeo1M9GhW4myrWfoEzzEcrUH6C04V2UqN5GCfkiXOUbKK57DcWKV0DJXwJH9iI40gng\n1X8MTuUCREV9yv9TwOuNUdTN5mCg85ArOg4CV0KA9kCg7TegdTvQ4g80bwSa1gDOVYDjJ8C+BLAt\nAqwLAMtcwDwbMM0AjB8DhvcB3VRA+xagmQyoXwH0M6HnzsSxzZ9ID7Be\/5AlvGu0Z0PSGPj\/ARrm\nofz8PBxc+54ybN27H3mcwat2EXXNIbllUv\/3YWgzVqHNwGcO8VZdpesg15ah3VIL0aUghK99XxW5\nabrnwG6bCN00sFXDTOq1Xly3G6cgOPkwONFgnKGKHNYuXIuuwo1r1pSizVyLnJgtOLLhI2WU3\/uf\nep5Bq5AAZYNxzltwzPnmwnUwONf5dntcZT9O48I1kVVIA1PDVyFi03+6ovz+7e0xsMtCA6W9OBes\nmy5po+vwlUlTwRPEk4iDnqwrN87kwg0p6UAcgZGLBJwNxWi3ypB2xAfH\/Gcgyn+GZ8BOs2hyl1lA\n7ge1g\/uN4BoNPKwIm4TPWHfjy733YN7+e7Do0FjklAS4NsMIuKYBOKeKIj0oBTtsGaK3zsKJ7bO8\nPey\/qumdJj5T4lvX1o6YTzA74G4sCP\/rgBiF72NHYfWFR7Hs\/CgsvzAaewrehlAaPajfGFxDH45D\nLgwEaJYgYc\/XiNk2G7G\/zv4pmjVn5GOm21Q1vcPEIxmUDhoGm7YUM7beja\/C7nHDFpJYdHyUG7Yy\n9X74pD+AtdmPILdm51CcqhdXX4RG8jvdg3E7P0fsjs9xKmB+aCJr1sg3mk4D\/4cOYyW6bLXuYaAn\nle63mTvudsMWht+LhUfuxeK40VjRC\/PNHIu1OQ9jQ+6jOCn0duP6StrYiyOXWObK1aQTIH7Xl4hn\nzUVi0NeeATsMlawrhnJmOvsmNbsoGCtPj8fPyWOYbP14jmTu2Gh8c2Q0lp663w1bT2Ab88ZhW9EL\niBJ+NajfGuv7cY66fAZollM4HTCPxHwkBS0MZQcu8PIAWM5q15e5r0mFZQex\/KQXosq9sTnrJSxn\n34sVKfeRco6Bd9R9WHJyjBv2S\/4T8C96CnsrpmBf0cfwjngQpwvXwVyXx9ysHcoCBmdXXCbwUmiF\nmUgkPXiGRHKId2RK6KKR93E7AyxxH76bY6ZiC\/tfOF7hzcBWpY3B6swHSZ89BJ+Uh\/Bd5Bj45T\/O\nwLZS47GN+wyOiedg1alnsDLmOZzlbmV6j8bZe3E2eR4BcqGtzkRS8EKcDfoGKaGLszwCtum5VLuO\n694MW2KnYk\/ux4gTLHbD1l98hGTsMQa2POFhbMp9gsCexo7SZxHMn0ym+B1sOvNPnCj0QYMsnWSt\ngHku6cPZZLmkxCVQliched8iJO1dhLRDPxLgUg+A2mKqTVfqWlvk8L1QsAVb019HvHApWEWPu2H+\nhU+SjHnBv8ALPufHYVfFBATwXkC0dA6CsmfhFGc9VJKUATgCk19icFbpRfJ8UgE59zQuHPAGe783\nMo78lJURuWzkfdymcQH7NoNNUwzfM88hrnoJjvInYTvnMWzheLkzRsPWpT2JPVV\/w6HaqYgTLUEe\n7wDMilx3vzFZIzhrL84iySEPT2WQFkYjNWwJKe8S5ESsEOd5BqRaW7UlgzZDWfVhbGRPRFzNNwgX\njEVA+XjsKp+A30jGaNhO7vP4tXACYpVfgC1e557U\/pIOxGXDUpvFPOHV5EUg4\/BSpB1ciktRPsq8\n6BUjA1vVHLRouO5rUlL2ZvgdnYbvw7zglzQZ4VUfIFL8OPYLJyBI+BL2il9GSO0k\/FrwAhK134Jb\nc2DQMDAllV0kuBwGZyY4+tm4iTyKii4eZrKXcXgZLkf7KgtjVn49IrCloRAtaoq5idA7dVXYZMwL\nJEdKxFgsjnoIK0+Nx6b0Z7Gv9DkcI1f3MOkkHCTPJHsqX0aiehF44hODcdJbcDXkwb0mA01aHoSZ\nIUz2so7+jPyTa5WFJ9beeR+3aIuebVEVEGCx+w4XkjCfAB+A95Gx+D7yISyOfJiJ1ee8sCH5GURU\nv4xY1euIbngPx0QzUGIKJP2X7cZZBuEyYBKnM28WnORBXpAejMzwZciJXImiuI3gnNpwZ2BrQ\/70\n5vrL5EpUPOgOV15xDJWVkeBVRaKSH4FKHh1HSRwBn3x2gjsHCep3EFf3KTIt9MPVQZhlWcwwWCSu\nkg7EmQnYqakEP3U3siN+Jv23GtQpPxTH+y2+4zsaGtikzENzAzXsHc69tpT9a4tXEYHDxR8i1TQX\nyeoFKG70h9QRBaMkdRDOKEojkQoT+cypLocwPRC5x1aR\/lsD7hl\/lJ71W8FLXDv8Pia4L5vqLpGb\nB2eYa1IfrnDQ2tKLsxFdsADp1rm4ZFoOrnM9atrCoNGdY\/qNzhoNM1anMC+N6M8aCVBwYQfyjq9G\nQcw6gtuKirPb1vPu9I7GWXeJ5STnl1NVOOw1yZW1giGTeu7iWlLeb1DRvBlVrdsgbt8NzZWEITi9\nkE36khw7iiJUp7GQf2IN6b8NqEjahqrUXaEjAhsV5JRXFQ3CNd6Kc6+t\/s3AKdmHDPUP4LdugexK\nMJSdB2DsPg2jku3CCenXbcnMKzezhEy2ohA1mbtRGLue6T9e8k6IUgNChSmsiXcAXiTAHAY43DWJ\nhvWtrYGbQSqMRVoVyUarDzRXw2G4FgXH9WSYlWkEx3bjdFVJpC9zyP\/NhzQ7CJz4jeAmkKynsAh4\nBKBDnp3ukGcRUOFth2G4tWXpPXz58v3IkKxBWccvsPTEoqmTlFbci6ty4XT8c7DK80npMyDP3Yt8\nuv8St0CYFgBJ9t54SVbw8EC7LJMiAQfJ0O2GoX9tDd0MzDDUpkKnSYBKF4O6+pj+zNE4AtPyz0LL\nSyTlLWCmWpTKIgf1EpLFDahO3w1Zzr4s5cWQt4YHSjIouzQdNmmmC3ebYRiC690MtxsGGqe7BWeW\nkkuEisscPVTcOmQf\/QlFpA8rz2\/rFmXuiVVkB382LNAqSdfZJGmwkkzYpNm3HYbhNoMbJ+zD9ZdU\nyzvLYC0k+zSODiP5e1b4j8iPXo2SM7+UCpK3H5JkB\/jWXj4wblhgH85akwKr+AKskgxXxgbhhm4G\nGmdgcIOHgcbpBWwytTmwKyk3jg5x7mFyQPtUlCRs+rUyacu22hzWqyNeFJwNnOn1eSGhdbl7SQQx\noczbF2LgJ\/jbJNm+dFiYyPA1itN8jdUDI9lX3xeCJF89L8mXlJQJ8gX8rLLLgY56KrQv9DU5u5Wc\nKG8B238K2Oxh19t\/AU6hfe3hD034AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353271-1433.swf",
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
	"seed",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("seed_spinach.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
