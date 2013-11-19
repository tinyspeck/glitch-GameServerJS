//#include include/takeable.js

var label = "Plain Crystal";
var version = "1344624508";
var name_single = "Plain Crystal";
var name_plural = "Plain Crystals";
var article = "a";
var description = "It shimmers, it glitters, and it's worth a good few currants, but you can't help but think that for a crystal, it's a little bland. Not that you're complaining.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 30;
var base_cost = 300;
var input_for = [197,198];
var parent_classes = ["plain_crystal", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/702\/\" glitch=\"item|crystallizer\">Crystalmalizing Chamber<\/a>."]);
	if (pc && !pc.skills_has("crystalography_1")) out.push([2, "You need to learn <a href=\"\/skills\/88\/\" glitch=\"skill|crystalography_1\">Crystallography I<\/a> to use a <a href=\"\/items\/702\/\" glitch=\"item|crystallizer\">Crystalmalizing Chamber<\/a>."]);
	return out;
}

var tags = [
	"crystal",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-21,"w":41,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ+ElEQVR42u2YWWxjZxXHS1kKlNIC\nhdIWWiragQKl7FBUqKAUCV5AYnlBqDzwwAttkQoIHkAqi8pM2+lkJp1kss44yTjJJJkkk4wzTuwk\nzuLES+J9X6735Xq93u53l8P57DtQVbyQZMoLV\/rlWolj\/fw\/33e+Y9900\/+vzgUA70DejdyGvBe5\nXXl8K3LL\/0rqrYrA+5G7kHuR+5D7lftHkLuROxXpd7yZYu9BPoh8FHkQeRj5DPJZ5FHkEeRTyDHk\nY4ro+264pFLGO5WUPqnIfBn5OvIN5Ankm8jjyNeQLyri9E3cg9yB3HwjxG5W1tW9SiqfRx5rEXiO\nrUmqOpFGiQRjRJIvdu4wgo8v4H0I7+cIwDPKm6FL4dajlns78gGlVI8oyTzJS3ASAY6XodqSoYJw\nSJ3IEM6KEM6JEMmLkK1KwNYlqOLzmpLsrArw+FHK3YJ8SCnRF5TyfV8EeB49gFJuShAviRBlRQii\nWKUpgy8pgieOJAXwpATwZgTwZQVgGxLMrQd+fiRlxhd5p1KSY8o6exL5IYb2R74TFAgIfZCuiG3i\nRUysIkEk2xF0JxBF0pMWwBnnYFrnPU432lEkR+U+gXwFeQr5MdDk0ElQ5KqYVoKVoFiTIM9J7XKm\ny3hH3DERXJS40MaZEGDTw8KlFfeJQwniP79NaSHHFLnvIj9Ffo1SietylYYMmZIMWaRYk8VaSxYL\nuNayKEr\/5mZEcCKOqAh2RgBbTIBr5gSolxzqwwrSxvtx5EtKcj9BnsFKJqmYSNddXYZ8RQa2ilTk\nerUhc\/T3uElIAddZGQU9mJ4jIoItLMJeWABrRIApnRdGFmwb+HpvOajcbUqP+xzybeRHyC9xUzio\nHLYMmhYUORlKdVkq16RauS5VsJ2I9ZaAaTalQl2U6M6mgnaUswZEMAcEMDgqMHx5F4bnrYbDrDva\n8T+tNN0fIL9AsV0q18IfpVoHTIznGlINy1pHZ7FS5yGaroA\/VgIvU5LyHN8WpOmZ\/SJsupowcsUM\ng9NG6Js2lQ5T2geVdfc95GeCBEYqx+FmKHRSE3B9NWpNuYFNuiVIssQ1CGQKdYhlqm1BRzAP\/jgn\nmjxlbmO\/kLxmzMVG5y3N\/kkDnJvchNfGjXAQuXcphzs9S79FS4tym+3NgHK5qkyKnMRVGxKHcs0W\nkWm1JZ5g36vxkC02gEFBH1MEe5CVdx0ZRrsV2Z9Z9u2q5h2GXvVWuOfiKnRfXIfTFzfhoOk9hHyV\nNmKU6yUdORH7WhnTK1XqUpVrJyfzMsoh0ORFKHEtSGOCkVQF3JECWLxZds3MODWGkHVyyWMcnLav\nnVJt7p9WLcMrw8twetTw54M05HuUY+wJlOsinTbSSJXEfK4qFQucWKngmqvzcpOIskjwSS3cGdU6\ngXy5CYkcB8FEGRyhfMtoS3l0O4xtTh8wXVxwbfZOWPUvD26tvjyogX\/0X5s5SHp0CHiATh4CwHHl\n+GokikIuUxZZtiqVirhTsbw1Wtp6k0CtKbTlCpUWpFiaXhW80aJkcaWD6+Y4phe2XtL6jednHWtn\nRi3Lfzu3ufiX7jn\/i73a2w8ypdDx6RiG8gI9\/LHZVmMFIZMsiblsRSzQ8pZqUpVujDLuzhJSrPLA\nlrG0KMdkOPDh5rB585nt\/aR7eYfZn9MHd9WLno3eiX39S0O7mj91GcZ+e3z+oYO2lg\/jWn+aypUa\nYp1hhTSeqdlkScDy\/lswV2pJCORKTdwUzXZyVC6U4nDnlsq0tGu7cduCIWSeWPJtDc04VrtGLNf+\n2rs1+fyJtQcOPIBiWZ9qSXKlhCUM50mKKZBMsixl6frLomC+IpaTbFNM5hso1QB6j+eoXA3CqTrY\nA0V2x57yrplids1G2DKNpVXNudZfU1tXjg8YLx0fND504GMND\/7HsOmXiygXYkmiLVgUMnFcfzTB\ndEUoMLmmwGSwz2U7RFEsnm9BJEPA6mHTRkfavWZKUDnrrC5oHFtwG85N2nVdY9a+brXl4QPL8Tjh\nYosrVYjcDORJPMySZKQgpGJUsCxm40XChtINIYQp0aSimSbE8jwweQH8CSKaXPnE1n7Spd9l7Etb\nUctlXWBHvejdGJiy67rHrQNmd\/7uwwwEtzfwDC9j2\/DlSCxA0yt0BDHBNFMQcv5kQwjE6xBIoFyO\nikkQSEngYnjR6MwFN6wJh24ntq8xRM2zuoBRfRXlpu36nnHb0chVseH6MDlfjo8HWL4tiKSiuIN9\niSbxxhoQTGMpaWIpsT3f2SMtcXMvFdCbYvtL24x1cT1surwc2L644DEModzZib0BoyN716GGUZzQ\nhzgB+ECRJLwsH\/MV+HjwumCRpIJ5UgxmePCl+PZE7FIGz71wS1zdTXmWjTHL1Y2IaW41bLykDW6O\nLnjWh6ZdKz1qW7\/enLzz0HKYHAmWSNJf4BNelAsUSNzP8hl\/niQ8aT7rTgmSDQdMR6yDE9kLtYRr\n23Hn4kZkd04f2plZCW5NaHwG1bxntX\/KtXx23NY3o4\/ccTg57HU1QZYCRT7lyfNpe5qP7cX5qCXG\nh0yRls+bIlFXQmhRObsi58BR3RpsCosbjG1WH96eWgluTiz5DWMLvrWhWZfu3CW79qza\/rsDD6Cv\nX3d1EcQAKyRQKmDt4LcyvN8cbfmCrJhMlCXRFidgpyToXQBLqCnM6CLWSW3AMK7xr4+i2Pk5t05J\nTfPKBctvjuTjo9nZuK+O6y7FiSVHhg9jemF7ig85U3wkzUklBj822pIohTgoKQLmUF0Y14ZMI4s+\nveqKTzc8514ZmHZpeyacmpOqvYUTQ5bnjuzzbROnFCYvb+BkEmQbYs2d4xmmImazdVHAnQyuLAEn\nNl5HGu9pmiBPJrSR7cFZj7ZvxrXUe8m+1K12XD01ur9A5V4ZPqLkrl+psvgrb1ycN\/nIhRwnBXGz\nAIs\/\/EUCvgIBL4Ul4EFZTJioteHNnknX1Z4J19XuCcfVM2r74mnk1Kh98dXRvaOVuy64FyQXrH5y\n4bok7maIVAmEKgSC5Q5etgWTuvBW37Rb0zvl0rxRsmvc\/p0b8q1UTYA\/2ELk\/OslcZyy1fCzIh4Y\nEK1RwRbMrDFbA5e9SwMz7qU3Sr427r4xcvTK1+D3zgg5\/y\/JYEfSHSNX4iUx6MHpRK0NVPtnXMG+\nKSfiSAxOOwoXZt2FEcq07ekb+r1ejUgON0OG\/5PklD5iOzO2CSdVq\/DysA6OD2jhxT4N\/L1nAV7o\nni290DX\/6A3\/VrQlwbPRrDj7esltFzevWnRxZyd34Ix6C7rGDPCqaq0teWIQJc9pZv7rEf0wV4GT\n+jwxMrwXbExqjKnA8BUH9F\/eg94pM1DJbpQ8NbquP6Vae\/alkZX73\/Qvvet1uFu\/l+tTL\/v1Ko1b\nP3zFqR+Ys+n7L1v1vVOmk2emrG+61D8BdbFd9K1DuOIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/plain_crystal-1334275201.swf",
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
	"crystal",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("plain_crystal.js LOADED");

// generated ok 2012-08-10 11:48:28 by martlume
