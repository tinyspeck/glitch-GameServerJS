//#include include/takeable.js

var label = "Gameshow Ticket";
var version = "1344877324";
var name_single = "Gameshow Ticket";
var name_plural = "Gameshow Tickets";
var article = "a";
var description = "One glittery, razzling, dazzling game show ticket. Ain't nothing you can do but USE it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 11;
var base_cost = 0;
var input_for = [];
var parent_classes = ["gameshow_ticket", "takeable"];
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

verbs.use = { // defined by gameshow_ticket
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Redeem for a chance at special prizes",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var location = pc.location;
		var x = pc.x+100;
		var y = pc.y;

		if (x >= location.geo.r){
			x = location.geo.r - 100;
		}

		var wheel = apiNewItem('npc_spinning_wheel');
		wheel.owner = pc.tsid;
		location.apiPutItemIntoPosition(wheel, x, y);

		var pre_msg = this.buildVerbMessage(msg.count, 'use', 'used', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		this.apiDelete();

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"gameshowticket",
	"no_auction",
	"no_donate",
	"no_vendor",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-14,"w":38,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADiUlEQVR42u2YT2sTQRiH8w38CB4E\nQRAKHgqBSqRCoVAJFDeeJDePehS8FE8qCFUv2ovSi+ihKIIggii0oFAxh231VHL02EPbpJ7WeSb7\nbt+ZzCbGtEkOO\/CS3cns7rO\/998kpVIxilGMyRjtrVr9T3xtavLAfkaVVlxrGsAktTpzYslOdGp8\nYFvRZwUWtFYc7Y4VrPV9Mdl\/erHLDj4tHEGa9SMAWzzdjqMXDtjzS8nB2lxQOQv5fl5DLo8EDANq\n\/+VlC9nLvUC2NqqZqw+3r1aPDYzgbm\/XlpwHGihU88Ear8Mqsm7v3rSzfuikETDe2FFMqSH2bXU2\neXD9XPLh0Ux+kqSQeu7\/3emDmRgKgTU\/LiS\/3s1bsC\/PKsnq7Qs9XU3CcJ+jzK69GbjI6lomYDrI\nsd\/r1eTV0rT9fHzjfLK72XHd2\/tlaz3jkfAwJueHcXRrYDCU2lsud2Umiolqd6OzVjHOV25OOZCA\n90saXX5yO09XLTNgtn6pN9QG0J0rZ2zMAYUBRHKgaL9irQ0Bcot4CIwLbJypTEMV4gsQ4IgzjoEh\nKfjExQCKaqJkP9OxmClILeuq\/qZchEoGBhAA4l6gcC+QQPGpXwY1+yWKr2DWXajg\/huQ9n4CAAIU\nIJyjkpQPgDmWONRxCZjEX79EkbaYZnIzKx2aXoLUVw8lxKU6U3ko88BoV\/I9yjJP4oTWOHBpnOsk\nIUlt3IX8L5D6HCBxLw\/HnSSGXiPAKClJI+qznhcUlf3NhBbEhpxhK9H\/NKC4Cfu6UnEgcaPEEiqI\nEjpJmAOGY+ZQj+uAY51ckwtmXOv0ZJ0cLEYBbgQgN0NyqXu4zVeMOUkKqX0yx\/Xch\/v5RZlw0h0o\nrbf1YPvyCyVvy81RAdt5WPZjwwHE3drFkjD+y9hu4bXGtHXWe3YMncmyu5BCy8N4kE2ajXAnkH7L\nep3pujXqBMzAjDj\/vHsxkA0dG1KMUYJjHu7Hi68kYLqdhXr2wGB6GyV91+4u0rYGJGoCqetUz3pG\nyWA37dVSu7E1TWHIX2Cd7RSJIQ\/AxShJPP54MpMLmWWm37OHBdODbY5AyrYdOIlFYs26TkFYMHPu\n73I6teyYwBwl1W8MSQ4pytINrAsJBXq2p1hWZE9y+PVRgj2ztblQ9W+cOJiTNGlmS+BrQPfHd06R\nHcX\/KShpzf37YrxguQlkeiRQUsuKv8SKUYwJGH8BdItXnch0YPAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/gameshow_ticket-1343434123.swf",
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
	"gameshowticket",
	"no_auction",
	"no_donate",
	"no_vendor",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "use"
};

log.info("gameshow_ticket.js LOADED");

// generated ok 2012-08-13 10:02:04 by mygrant
