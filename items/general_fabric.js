//#include include/takeable.js

var label = "General Fabric";
var version = "1337965215";
var name_single = "General Fabric";
var name_plural = "General Fabric";
var article = "a";
var description = "A coarse fabric necessary in the construction of various basic furniture items. Attractive from a distance, face-to-fabric contact feels uncomfortably like getting up close and personal with the underside of a fox's tail.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 250;
var input_for = [257,258,259,266,289,290,291,292,296];
var parent_classes = ["general_fabric", "takeable"];
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
		'position': {"x":-34,"y":-16,"w":64,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGtUlEQVR42u2Y+VJaSRTG8wY+go\/g\nI+QRrJqp1KRmCZlJZZuZDNHEGCUC7riiqIgrKogrImqMAnrdFVEwLO56XaMxMTeLk\/WPM\/31BKvm\n34GkZqrsqq576dtU\/+53vnO64dy5s3bWztpZ+3+2xdnq83aL0leluRaz4jbETQwUCr2taXF4ZjIk\nxp3O89bGhmYMxtGHeVSac00WHjfX3on9cnBY1F3lqyz+jToaFfGzQyViY2UitdTcU007ioy1Ormo\n01yPA7h\/Ui\/1tampvOAmB3TZc2Stdcki5nwROCy65KmRhF4NWWqSfICrK5NTqea64BFKbM3VSVSa\ne03FVIufdhVLxooEwInDvRrRZn5A1SW3qCzvhqDLuXo+6nCf3syef\/t8XPIIZTTck0MI25SjiFz2\nbBp\/lE9Ls9W0Ol932hcmKmhisJBmXMXU26qkzsYUetiupu1Qm8BeQPBPVERHxbdHgvzjS7fw7niC\n9lfaaM1rpGeinY53+mh9oYGebtrp9YGDXu4P0MFaB20HTbTBxll4ee9rU7IXymWwRTQ\/ZiCnHerf\nowZ9IkUMNzOkNXqEUlplUGLARFusv9h9+A+YpxtdtLvUSv4pA1eLJQxXNjBtoH6m2M6SjT5I07Ts\ntZCh5A\/qbEohY+VtVXnWlcgS5UjsNq75mnjoNh430pNVK1OwnXYXm0n0N9Km33TaMSfIgNDdQyX0\nqDOdelrSaLArg7YXO8lUk0L1FXIqL7wpWuqTIvffx5ezxpMjgYdxf7mVq3TEwioGLRSYqaHF2Tra\nX8VYLwcXGeT+Sgd\/AYR1YbKKh3kj0EaO7mxqqEygouwrtojB6J039v3xhPDmcIgt3HGqCjpMj2RA\nyOdHy2mGKYVQYmySJUPIXcdsYCHfuJ4+vZplL9DDVEsghy2TKZkpiwyM5mLeS1NyppoEfyEJvGNl\ntBU0cxXhuwDz2B5TU9p7xJPiaNPGwX1sHry47qvn9xg7WO8he1s2leZdjw7cZrBNmB8rpzVfA08E\nLIJQAexwvYuctiwG1H2arVB3flTH1YQfAYgrK+D8vqNJQQWZv6CrIoZjfvPBb\/DZTsjMFwEgFALQ\nYwY6OVjA1Gtnhm9hIazgSYDy4RF09GKnn3f4EdcJh47y0i9TesoPkde5NV+janepjScCTA04XKEC\nQnuwZuWlA5D4\/IQlgZcpDUUxDv+N9OWTW9DT68MREhd76O6tb+hB0kWqKPxVHhHce2kyHosilLPD\nWr4gdggnMzXMj46xaWcRA6+h51s9tBVqIZs5lde4cFgRaiRQ0N1Aqvs\/ccDk29+KyckXYv413MnT\ngbjj7V4JymEBAGJ7WvPWf653HTzcgMTz8K6AwmtlhTbsu+W5WnY1085yN+mL5ZSddok06svGyHx3\n4uZwm2wRF6tRI325PAMP163cc+gAR\/GFekgSwAp9Graf3uclJWyDnVAzbQatpMv\/HWBiV7MiPmLf\nfTie8qGMIHz2ZsVnFUwcEFmM8AFubkRH8CeSZ4QdDKAcvoO56Jt+MzUY7nG\/lWiuGiMK6emJ5JVH\n9eezUb5doUQsz9VxQIQRhkdmYotCh7IYx2kFnxFuhBaqhTwmSr1zkXSszhVH8+g05dRKc6MVrKCW\nc0+hpqHWbYcs3IMotAjryryRKweloBrmAg5WODkaJaMhlSdDjvKSNmpw2yGTamowjwatKsHRpZZc\n3Zm8pu0sWmhvqYVDjA\/kc6Dl+Qa+v\/L99LPfcAgY7c+nlYVOSkm8QIq735FC8X10ju57AVPcVqBJ\nmhO0UnBaL5sfKQGobdCqFhxWFY3159FQTzYxcDauFl22dHJY1XwfHR8oYIdTDT+ZbPibqTj3BuWq\nZFSvT5BFR7mASc5N\/bhBmh7MkzFQcaw\/V8AzBsoAlaz2qVUMzMbupcUZg5y\/QGea6OxKj8eYw5ru\ng+r97WmUn\/EzZaT+aIsK3JNFcyzggtOV5B7QxLGaJVthSTFgTYvDM9w7rGnGFxvtMewYLjqtStVW\n0CTgOwxQ2Ao2aYftGTRkVcQGpvSSy6Zmx3alL2qhRYNqzi5lvHeyPBagbBG+RzIljTPOAr447gGw\n7KmJD59MAA5buLrVvnAUJgY0X+bXWLgxVWyA9U+Wx\/vGdATFwiqP9Gbb2EnGhvvRviwKzVQa\/ZMV\n5OhUygGKcY9QrD33NRpUG7Sm8cWWPFWqvz2nlEFFwEG1dW89QiriRzrgYAe83Ff\/lwAKwW\/wJRRF\nR3iRHBjb8Bm1AJxy5EvO9uSYc\/+FBoXDMCM9WcJ4fy63w9mfPmftrH3l9hdp+62KzudzJgAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/general_fabric-1332892809.swf",
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

log.info("general_fabric.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
