var label = "Light Beam";
var version = "1352404501";
var name_single = "Light Beam";
var name_plural = "Light Beams";
var article = "a";
var description = "Select a light to travel to new places.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["light_beam"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.dest = "a new location";	// defined by light_beam
	this.instanceProps.event = "";	// defined by light_beam
}

var instancePropsDef = {
	dest : ["destination for tooltip"],
	event : ["event to broadcast"],
};

var instancePropsChoices = {
	dest : [""],
	event : [""],
};

var verbs = {};

verbs.beam_up = { // defined by light_beam
	"name"				: "Beam Up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Travel to "+this.getInstanceProp('dest');
	},
	"is_drop_target"		: false,
	"proximity_override"			: 160,
	"handler"			: function(pc, msg, suppress_activity){

		var val = this.getInstanceProp("event");

		if (val){
			var events = val.split(',');
		        for (var i=0; i<events.length; i++){
				log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
		                this.container.events_broadcast(events[i],{target_pc: pc});
		           }
		}
		return true;
	}
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-88,"y":-414,"w":176,"h":415},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAABYElEQVR42u3Y246DIBAGYBHwULZU\nu\/Tw\/i\/qQvLPZjKLdxuYi5L8aUq9+KrMoA7DP4\/jOMZB68g4k7NqBrqcqBm45nyXM6kVGAGctALv\nOSknaMSNwD1ydo3AGbgnYrQBAwO+ClgbcAOw4N45X9qASQDv2hp0Epf4pWYdokEnUSRPNf2wrDc0\naEJSghZgZEBCls9NS4PesYtwZFKxL6NANoGklO++N3BhQEJS9u73h9hBbgLJc9VQIJEhZW49cbac\nIYGUKfO2F9CjB3JkZDDK1LNAAkNKKM2tvYAXAAnJoVc2F3rgDPbgGvIXxmJ6FMjKkBcBotBvtjXQ\nYQ0uAilDf8L3qOBZIM+yNH8EAHACkkNrmZsCUSC+gjzLhJiWQCeQPHNlzjd784V7QAskh\/oKiuKa\nVTKAEimhHOZwrG15iTlSQp2EIWPrQqlBa6Fjmu8mpgKtxXR9NhHQPxk+4zPOxw83gOPwxSelmAAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/light_beam-1351033549.swf",
	admin_props	: true,
	obey_physics	: false,
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"e"	: "beam_up"
};
itemDef.keys_in_pack = {};

log.info("light_beam.js LOADED");

// generated ok 2012-11-08 11:55:01 by ryan
