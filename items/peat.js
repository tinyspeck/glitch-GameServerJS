//#include include/takeable.js

var label = "Block of Peat";
var version = "1342121166";
var name_single = "Block of Peat";
var name_plural = "Blocks of Peat";
var article = "a";
var description = "After eons of sitting in the bog -- condensing, compacting and quietly conducting Peaty business -- this dense stinky block should be used to boost building projects.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 12;
var input_for = [192];
var parent_classes = ["peat", "takeable"];
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
	out.push([2, "This can be dug from a <a href=\"\/items\/630\/\" glitch=\"item|peat_1\">Peat Bog<\/a>."]);
	return out;
}

var tags = [
	"basic_resource",
	"firebogproduct"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-25,"w":35,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHNElEQVR42u2YW09j1xmGuazUdmAm\nYcbmZPDZ2+cTxh5gE8ZgDgMYD8acfMAG4yOHMNAmjKCTqK0SpaKqehOpStReVZFapFz0Zhr5au6i\nzA\/IxfyE+Qlv1rfsbbYZ48y0jXrDkl7t7W17rWe\/7\/etjWlruxk342bcjLbCjrCwX7KclQrCWSkn\nnJW3tD3\/V6CTk4yqWJ4\/z6bN5+Wi5eX+rgXlohm5rA072zbslkaQTQvYSplw\/Kux7w8fi5X4qu58\nfdmwEYtpLG+yxrffZtvfCiqzZlId7JqT6bT1YnXdUklu3sdG0oedHQv2yi4UCg+Q2rQjsTnErjux\nmTIgmzPi4MiP46chlN4PoHQQQH7Pg1hY9++lee0HzdZ5\/jyjouOzZ28IeHTgF\/M598uDPSskZTJe\nFEsTDEpAOiMgnjAjnvIhmXahVBrHZpxdTxiRy7vw0R8jOP10GoUjO1IZGz54OoXVZQOW5rSIzGoR\nntJUUhvDZ6VSzE7rff3PuPjVV9F2UkuwaFDdzmI7zxfM2N9\/j4OdPh3HyanIz6VYS3kz0pseBjqG\nZNyCVMLE4VLrRiRWDUgnbciknFh5pEdsUY\/1NQvi61Y8+XgR4WkNFmc0iCw6kUj6sRrzXfzti6j4\nlz9HVC3h8ttGsVywvJK7dvihAyefjuLpn0J48ocRlEsWDlfYYbW3bUY2U625NAOU4DZiBqxFDXW4\n6IIO20U79k\/9ePwbkZWCHnMTDHDOhpWoA9tpG5Ir9srJ8WjyX1\/HxeffZFRN4fb3rBzu8LELT343\nivcPXcxFJ05\/H8JHn8yhvMuiLAoo5mzI7fjqcJtxE5JrVbittLPBOYKTYi0UROwfBbG2YkNI7MfE\nqArBYRX28j6k1hwIzxorf\/1iaaGpe7ktgdfb8WMHd+742Me60srFOpZBWbhrpHSKaWsYG4lBJBMs\nuhUjdy2xIeDXH4fw4SdTOPptoAEuzCJdCGkwG1RjdKgXfnd3XSdHIh7NmRCdN7\/67LOZ5jGn1u2I\nhlkHso5cXTJyLczoMTOhw4MRLT\/ms9VYtzYt2Mr4Wd0NYm3ZBLaN8EizBTdSSTvia1ZWcyawjsX8\nlBpBcmpEBZGB3ff2NMCR9vN+rC\/Z2M2YKtfW30pEQIy0KCDy0MC1MK3ncKQwg00nBB5nYtXIwNhN\nMKh15tzqEqu3CDsuCwzUXHWOwYXG+hHwdL8GJNfwYA8ezQiIzpkhelVQq28372IC2li2IL3h4HDl\n3CA\/PpysOihByzUhavlNLM7qsRzWMyg9ZifUmBxTYSzQ2xJM0oi7F+O+fkyxNWzaThh67uy9Budm\n1KKnF4VtD8jJ5KodxexgHWRqXNcUUNJMUMeirLo9OqS6FmYscPneoE0Jh+4uvEYlArYeeIUuqJXt\n0HV3vHgN0KtViF69ApFJFl3EgvlJAw7Lw8yN1mBX1QxQ9PfVz0eH+uAxK2DXdMLS\/y6MvXdgG+jk\nR4IjabraYRrouGwUerQMCYozAow9NGNzmUUcMiGz7oJTf4\/VRS\/rPC13qBXcXKi5gyODvXAZ72HQ\nrITo7uNAJLpGQARnZ05KgCQe83fPi5ySHi3hoKFCgGOuPuQSHkRnzVwu3T0+mV3diYCjBzPjmqZw\nVIPB0Woz3fde1p7P0YXQsJrPMeZRwWNU1AHlrpnV7zYAaro6Ltqe1Z55h8WAiuAkpVecWGZw02yx\ngKUbnhqkU3MXbnY+JCjxwK\/C7IOqq1R\/1Czv3VezOKlr2Tbi6ub15WDfofqiY3BooA5HGmE1TzDO\nmpO1+uPHAUV7pe3zz4McMLFkXZADBn0DWGQRj3v769cIjkDln2sl+jxBDDurkXpNSvhYE0hwBOw0\nVMEc+rss0tscTs+OEmzbP\/4es58cMvd0ii+nhzX1ycm1gLUHPlNX\/Zpbe48v+qaAckgu9WWsdDT1\nXcZrYOdC3zsNkXNAGrvZoTPJtVaLuRig+w0clH9OAqSFraxjJSiz6h1ouzoauvZqTdYBw5OmC5ps\n0KB8K3dauUZuc9drtUvxEZxUX+SWPEo6J2jp\/VoNvuSAPpPy\/L8BorokIEkOFiVJei1vCrnkMOSg\n3DmCG7j7c\/5HbJt9oPMF3TWJJm7WCHTNUashl7axDgmCopFEbjUDovfIJTqnDVoO1CDFrTP17bbL\nZ7Gtv\/OlNAlNQLVCe55c0gJ01\/SZZoD0HoniuwpnrQFJtSZvkLpryvYXddfkgx4pQt+dFzSxNIl0\np9dFIu9maY+Uw0g3YqmdyxtC2k6uuvajP5D03R1JrbKjIp9IHp28TsiBq1HTawlQSsLaKsqa+hW\/\nTL7VT0xyVKPoSLJHzZcaZXvlagFLkvazeilQdLXtRHLzuu\/KY\/2f\/Fg3KRl0V8eCuuvWGYO+oImv\nW9RSA7y6pzXXrfOf7D8MA8qfqah2aEv4cZDm7jV06085qPtawTKYV+RWv+IXYtNOvRk342b8Z+MH\n2zqIZb5i66IAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/peat-1334269531.swf",
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
	"basic_resource",
	"firebogproduct"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("peat.js LOADED");

// generated ok 2012-07-12 12:26:06 by martlume
