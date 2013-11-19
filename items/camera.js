//#include include/takeable.js

var label = "Camera";
var version = "1351296314";
var name_single = "Camera";
var name_plural = "Cameras";
var article = "a";
var description = "A useful handheld gizmo with a lens, a button, and lots of complex intricate technical gubbins on the inside. Depending on who you ask, cameras are either for taking pretty pictures, or for stealing the soul of whoever they point at. This one is mainly for pictures though. You'd need a much bigger memory card for souls.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["camera", "takeable"];
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

verbs.take_picture = { // defined by camera
	"name"				: "take a picture with",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Doesn't do exactly what it says on the tin",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.buffs_has('camera_recharging')) return {state: 'disabled', reason: 'You need to wait for your camera to recharge'}

		if (pc.is_dead) return {state: 'disabled', reason: 'The dead have no use for pictures'}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendMsgOnline({
		  type:'snap_travel_screen',
		  text:'In Soviet '+pc.location.label+', picture takes you!',
		});
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"toys",
	"tool"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-23,"w":45,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG0ElEQVR42u2X7U9TZxjG9x\/sT+iW\nLMs+yZbty5xaRHlRlMrceBEnTnAubrMwcDQwLFLFyjaRtkBpgQIFLEgpjFZLoT1QqLzVFhwWROiR\noRNNkA+aIMm2a\/d5Fki2uYnu7Uvv5Mk56Wlyfs91X\/dz3+eFF0IRilCEIhShWA2bzSay2RzSrq4e\nS09PL+dyuTm322Po7x8O+9+gTCZzmNncXtLe3sl3dl7GpUsOdHU50ds7QPddIFC4XH3o6\/P4R0d9\nEq939sV\/HYpenEpAhuZmM9\/S0gazuQPt7VbYbHa0tJjZtaPDBo7rh9t9BR7PMIaGvAhMTmN6epa\/\nc\/eeHMA\/B+rz+USDg8NyUoXr6eGYMgKQAFdba0RNTR2qq2vR2GhaU1BQTgAcHvZibHwCjm4n+twD\nGBwawVXfGK5dC4j\/FhTP85LJySnD+Ph3S16vDwRIaRqAAFhZqUdVlQGlpWoCq1tTcDXFwv\/Gxr8j\n5YZgMrUgL+8Ejh+XoaBAgW\/OlaKhsRnPDLS8vCxaXFySLiwscHNz83xbm4WUcJCX3OShXlgsHWhq\nMqG+voFgOtcUXE2xk3wWCEzBe9UPe1c31JpynD37NXJz8\/HJJ5\/hwIGDkMnyUEUbqtBWrR+QvBD2\n+PFj7uHDh1hcfICFhXuUmj6MjnoRDN7C1NQ0pWOC\/baq4GqKh4ZGwfNzuH17DjdvDMFgqKYNNBKA\nDudKzsNMm3T3D7BNOl0cVCrNswEKx8KjR4+wsrICAfDmzRlcveojY\/dTakzwkVcEVfr7PXA4ejAw\nMIjJyRuYn7+De\/fvE1gQ9xbmsLK8gJ9+XESbuYYg66ApK0fHt52YDfKYmQ3ixvQMW54rg6iuqV8\/\n4LGjR6XKoiKqukukxjADFBT8\/vvbmJ3lGczERIAqb4au18HfIrXu\/IC7d3kCWsLPPy9j5fED3Lll\nxdS4BuWa0wywUqdHl6MbXG8fpdtBVzeGR7zwj10jRT0wNbeuDzB8yxb5juhoHEk7hJzsbJTTzj2e\nQQKdZYCBySlS4lvo6IVWqw1GYwNazWYsPQgS4K9gAX8JxkbOwW79hqq5igGeP69ikNpKHXT6ahgb\nmmAmD1foqqEur2RLVaZdUmm1YU8F3CoWY9vWrXhXImGg+bIcFJOqX59VIj0tDYUKBQO8fNlOHlKR\nl1xYvD+GyXE93C4tnN3NsJEnrdZLVDCtDPDL\/BPIzv4Cx7\/IwQl5AVVuCW3Uiq+oglM\/PIx3Nomx\nb3+qAMmvC3B7RARioqKwe+dOxEvikLD3XQYbHRW5BigYvby8nAGO0rFzZXAEPv8YRqiYhGc22+U1\nwMOHjyAxMRlJySk4lJbOlCzT6pH+0VF8+mkmzpxR4qWXX2FKrgswcts27KRUh23YgMjt27Bp49sM\nMIruc\/Py1gCLi4sZ4M2ZWebHieuBJwLGx+9FAgFu3iJGVHQMlMVfMZjomDjExe1FUlISXnn1NeQX\nFC49DdAQER5OINsRGxODgx\/sZ7C7du5AfNzu5wZMJwUTEpLo+jEke+Ihy\/2SAYa9\/hYiIiKxceNm\nbHjjTSHFhr8GFIs5wX\/RkZGIi41F+ocHUVGmwpH0NJbqWAJ9HkCVWoPMz7MhzcjCqdNK5MhyGWBG\n1nG8s1mMLeERTD2Npkq0BmO3u8Lq65vEVE3y1bVHIuEF\/+0g\/ylOyumYUCH78wzsS0ygoonD7l2x\nzwUonINnKa0FJxXUPXJxRlkM7W8rmK+srPx1WHA6nSKaLPyG2voSjabCr68y8BeaL8qNxgtyya44\nXkhp0vvvwWG3oamhDsqiU0hJSnwi4GoVrwewiAqhkVpjXV0D9e1aoeVZiovP\/XFAsNrsnEajldQZ\nG7mSErVcqVSujTlbw8O5aPJfMgH19znRerEF6YcOYX9yEvPh7wF1ev1TAYV+TfMhmmnsKi0t8ysU\np6V5eXmiP\/WZodZocThc4ra2Dsnvn1FhcDHkP1mODNqKChoI2vHxR4fxwb7kZwK02x10Ftqpe\/Sg\ntbXdr6uqkWo0GtG6uoW6TCutrW+0kOf8tCuupbWNo5RzAnTWsWOpQnGcOlVE00cFpMekzH8HUvY9\nFfA69egRal\/CfNfn9vg7O21Ss9kseq7Z7mRRkVhIr1pdwVYZQZMn\/ZaOTnlWVpYoMyOTy8+XI\/G9\nvcx\/qQS4+wmAKrWahoZuptr4+ITf6\/VLPR6P6F8Z2wsLlWFk4qWLrRZcMF2kYfIkR8fLkuC\/g\/tT\n\/lAkQqsLBG5w8\/M\/SIPBoOg\/+eDR6WrEBoORKSoUT3d394unFQqDorAQmRkZSElJ5mS5uQa9Xi8R\nnoW+W0MRilCE4p+PXwA7754XZMuOGwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/camera-1334271294.swf",
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
	"toys",
	"tool"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"t"	: "take_picture"
};

log.info("camera.js LOADED");

// generated ok 2012-10-26 17:05:14 by mackenzie
