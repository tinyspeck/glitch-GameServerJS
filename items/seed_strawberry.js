//#include include/takeable.js

var label = "Spoiled Strawberry Seed";
var version = "1337965213";
var name_single = "Spoiled Strawberry Seed";
var name_plural = "Spoiled Strawberry Seeds";
var article = "a";
var description = "A packet of spoiled strawberry seeds. While it once contained fruity ovaries and potential for life, this item has lost its ability to grow delicious red fruit and is now only fit for donation.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 30;
var input_for = [];
var parent_classes = ["seed_strawberry", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "strawberry",	// defined by seed_base (overridden by seed_strawberry)
	"produces_count"	: "17",	// defined by seed_base (overridden by seed_strawberry)
	"time_grow1"	: "1.5",	// defined by seed_base (overridden by seed_strawberry)
	"time_grow2"	: "1"	// defined by seed_base (overridden by seed_strawberry)
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
	return out;
}

var tags = [
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-26,"w":22,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK8klEQVR42r3ZCXDTdRYHcBWF4i5W\nRGcrMsu6zs6qsyoKCspKvVCgggwiq6K0wrIILKfiUdDq4qq4IrdAS2kpLb3T+6C0\/feg9ErTK83R\npDmbNGmSJulNW\/ju+\/9D06RnOrOznXkzbQZmPnnv937v\/ZPbbhvn52aXgXGNgc5mZsCuYfpsKqbX\nImd6zVKm2yhiOg1CplNfw9ibqxibhs\/YVGWMRVHCmOVFTGtjAWOU5DIG0WVGL8xmdHXpTHNNCqMR\n8Bg1P4FRVcQwirIopizt2K7bJvuDbgNc40anDgPtWvTbVLje1oRecyN6WsXoMgrR2VKLdp0Adi0f\nNnU52pTXYGkqhklWgFZpHoziHLQ0ZENfn4Hm2lRoq5OgqUqAqjIWyvJLKEk+zEwO19bkfbNDi5td\n+lGAaly3KnDdIkevSYpuF2SHrgbtzVWwaSphVZU5oWYW2siAsgmDiLDCLDdsRfbpyQH7rTLffouU\nA97sNlG04kaXkcKAgc4WCj36Oyjadeiza9Fn01AQnM2uVYXeNiWFAj30JnrMMnSb2GhEF72hrlYJ\nvSF6U+zfrfS3WU6\/NwVNCjhgFvv3m0W4wWaRMGz2bnQ0UwY1GLCr0W9XEUiJPjaTVO7rbZRNi8xR\ndpOEK313qwjdxgZ0Gdjs1lPUoUPPZrmasizgMs0eiQ6DCJXZoWGTy6BFHNRnahiB62dxtmE4ttSW\nRsJJOVz3LVyXE1fnKL++ZgindeBsmgp0ED726PbJlThDFhBEgVTtFmckazYjWb0JPNVHSFQGIEHh\nj\/imDxEnX49Y+fuIlr2LS43rECV9B5GSt3FRvAYRotUIb1iFsIaVCBP6IbR+Bc7VLUNI7es4W7MU\nZ6tfBU+yDWcOr5wcMD3Tl8nIWIK0nFeckXL5JSRnLQEv869IyFiM+PTnEZu2EDGpzyI6dQGikp9B\nZNLTiOA9hQuJTyAs4S84H\/84zsU9ipDYPyM45k84E\/0ITl96GKei5uJk5O9x\/OIcJGSvQeTRjyYH\n7Fu7nOl\/ewXw1ltc3Fy1CgMrV6Lfzw\/XV6xAz7Jl6HrjDXQsXYr2116D7dVX0fbyyzC\/9BJalyyB\n8cUX0bJ4MXQvvADtokVQL1wI1XPPQbFgAeTz56Px6achnTcP4iefhCIgAD9vX4xJAwfW+P1fgNp\/\nfTV5YK9BwPQa6\/5nzWCne5G9wNm70aoq5e7HNkUJ3ZFXYVdV48THkwR26wXWHhboxDmuEDeccRhO\n746zu3SqE6d0x1nkRdAK83Bsly9OfvLK3EkA+ehtFXL32yCuxw3XwE2PLkO9E2fSXEVs9n6I6nlD\nWRsTR9OFcBbFVcgqU3Bi7ysI\/nK5r8fALh0fPcZ6l8t3EDd0+bri2BF3sTQAm079Ad9FrLpV0iGc\nE0agQZxZVghzUwnklak49elrngPRxvfu0lXS+K3zcDLUoFVdjANZj+FQ6lJUVp3jcNYJcKbGAgJe\nhbQ0Aac\/ex3nv175lkfAnpYK387mcsLUe9wM9ZIIfJezYNxmcMcxtDzkw0JlL087RtlbhrCvV3s2\nj3u0BNSWUQbrx2wGWVMScgTfIrlsH3glnyCsgCZK2VY0iVNRzg9GecVZNAqT3JrBLC\/k1i8OJ83n\n1jCzohQV6ccJuAIXvlnjGbCDgB2aUnQRxoEbOm+28kxUbliK+Ce8kEJx8c0Z2HXOB1ujHsTmcB\/4\nn34AOz+\/F3u234NdO2YhLnAVDILMkThJHrd6WZTlqMw4gZBAP1w8uNZTYGlQu7qEgLVuzWDPiUXd\nnNmQ0zHVzpiC0N2zsDNhDn75dBa2RPhg90\/3Y\/Ph+xFw6D6Ez7sbeV5eyHvoIVRt3gBDbZYLLpdw\nV7gl1qKsQF5EIEIPrMSl79cleQZUlwS1q666NUMnm7l7ZkBDN7\/t9tvBLJ2BI9\/\/DnkL74b8zjs5\n4In3vZHvMw37dnnjb4dncsBsFvn446ggJLdZszjxFRgIR48BDuCFLxAWtBoxP77r2Ty2E9CuKr6F\nczSDfu8WyGl83QgMxPX162Hx8YF+yhSoKVjgwcBZiF7yG\/CnTkUpRdG0aU5g5n33gaHxp7oS6cCJ\nHDj2EcCqqQJzMRAXvl2D2EMfeAa0qYrC7MpCt8kgen4+2rdt44Bdzz6L9mV3uQGL\/uiF2rvuGhWY\nNn06B2xKDuFgBlE24bJo7c9Em7oKOef3sucP8f\/ZUO0ZUFHA2BWFjueLW9eIYNF89BGOBXbMm4L+\n4LvdgGLCsUDDjunQbpw+KlCeHMxljcXpCdcizIZFxUfGqc2I+vc68H4J8Gwe25oKGJuimHtKG1zL\nBYue4YD9mzZxZ9B0xx2jApV+lMlHp40K1BTHOR6WCMc+MLU00BlUVSLr9BZE\/\/Aeko9u9BAoL6i2\nKoucOPbyVa71g5VwN45ugN3nDifQvHwqjMunOYGDJa56zP0MFi57nSupXphBuHTo6tLo92yYmkqR\nE7yNzt96pJ7Y7BnQKs+HtanQZU2qgCnmV65J+rd9ANtvhzLYtnYqLB95uQHZEksok65dXP\/Tfi5r\ngzj2cdMgzoNKkIrLZ7bS+fsQ6ae2ID9071MTA2V59FhcMGITUWx8D53UKOOVeHiTXHngAVSsXwdt\nBQ86F1xzTTJaRLkcMJuAib\/4I\/P0VuRH7Jl4YWiT0Q1PWRyxJtVkQ7o1APq5czmglcrrChTNcQcy\nM2ei\/M1lUBdEE4zFEaw2hcOxD+sGST5U1am4EvJPJNH5yz67HUUR+3wnyF6Or0WagzZ5wRBu2CZS\nu2QRZJRFG5W3efadHNDwjhdad3g5gddmz0b1utVoLk904GrdcRoBDwbaZiRF4cgL3YnU439HTshO\nXI38zH9CoFlK3UXAsdYkAz8dJY89Ai1lcTCDcspe\/b2ODFY++CAaNq4nXMJQSQmndeISuc9lDFIG\n0sLzKAjfg\/ST\/0Bu6G6URAcGTQyUZBEkf8wdjl2TWvKjUOs9Y8QZrCGcbN92riGGztsgjufEqavi\nYZKXQFocTmX9FJm\/0vkL24vS2APjA83iTH+TmLaPxjyXHc5lE2nMd85UXdIZyLzvcQKFNP6UP+6n\nZhiGo6y54fjxUPHj0EpAMRPMlpU7fwUELY\/\/enygSZwVZBJlwiTNHX2HkwwOfMc81YT\/BPlMbzQ+\n8jA0IYdGbYYRuMpYLoNGWTEaLh\/Dtegv6PztQFHk56hI+IaZAJgR1CpKJ2DeGLgrThw3tlwmw1jN\nwOLUHC6Ow6kqY6Cm142NxRDnHkd53H7u\/F299CX4vIPjA42i9CPGhjQO6MA5Sjq4wxlG4IYuX92I\nZuA5z5sTVxEDZUU0vZZIwCJIck+gLCbQcf5i9kOQ\/N34QIMwlTEKUzmQ63kbvia13Mqa62QYwrk3\ngxuu\/BIU5VHQ0r83NhZClHUITNhu5J3fQ5n8CjWpPygnACYzhvpkgmSMghtak7iSuk2GsZuB+5jX\nBacoi0RzfSYHlOb8jJQj\/sg4uRnF1Cx16T+OP48NdclMS10S2HBthkGc3g03cTOw540tKYcrc+Ac\n5S3kojL+AFKOBnDThIDW6pSD43+Yrq9NsrbU8qCvTSBkylBJG4Y1wxi44c3ghqPsNdP\/NUgYDseu\nW\/nnd9K69TFd1nuP8OM+955wDutrEhjdYAjiKBIZOvyMTpju+AqBfme\/RiAYo2GD\/TqhKtHxlQI\/\njiKW+2qBXheoBUlCdRVPqK5OEeqEl4WEErY2XXOGtjZNkX5iE5N3bvuYn8n8F1sn5ijg0xjCAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353283-8665.swf",
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
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("seed_strawberry.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
