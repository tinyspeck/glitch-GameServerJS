//#include include/takeable.js

var label = "Worry";
var version = "1337965215";
var name_single = "Worry";
var name_plural = "Worries";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_worry", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-42,"w":40,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFW0lEQVR42s1YCVZaSRR1By4hS8gS\nhMQ+3SIG02pQTKI4MAXDYBQB9atoJMpgRJOQ7rQ9D2q3S2AJLIEl\/CVU1y14pijq\/0hOjoRz7pH\/\n+cOt+96775V9fV\/BZ3l5fuZr4NF3fl7t\/+\/8zcC\/F6cGUK3mjGIhfZWI+1nPyYHQ5cUJI\/z5R5mV\nS1lmbC6xSGS63lNyFxcnZRA6PdkSKBUzbC0VZMmE39xcj8Z6Gs7L85MaFPvpQ57xcLLdXIKlUwEz\nt524fWL5fKr\/7enO2eVFxaRQ\/v3XEXtf3WWHBym2vfWch\/RZHdf1RLViMXOGUMq5BuVe5Vc4sSiL\nhKdZMOj19CzXeAhrb9\/ssN9\/Kwr8+suhKATkXG4nzkLBKRYOTPXOUqAgyOjwcm+ZxWOzLBiYMntK\nslRKD4Do66MNUbHVdznxd283ydJrQaFiE5ONUGDSSCT8A7dKsFDI3kFo5Tz84f0e23+5LDxvYz0i\nALKE1MpiLZUK3F7hVI6NM\/I8gPJQh\/z+C1FAvN3d+eKWUipkYuVixigV0jOydeD4qJxt\/Hx2cF0w\nsqIqyZ3tWH1jI3r384nwvCIghHJBQB2oxHPObF6T9eB85XizjRTh\/J9jHUEWe\/6UZbPPulMRSvBw\nmR9+3Bd+RmpUKkYDD8Y5ejGu4efMFsSLUSjyffgO4nJlN3OThzg5x5LJubtdVSOU0alAjV4+h2q1\nyjPCwatV4YdQrNlVogKZdIiFQ75Gt6Z7ZUWQwkTVCnVAGOqQWgCqV1YMKByutZF7sTwvbCcenzW6\nswv+IIQIJEBI7q30UvI6gmov8j3oMEQSfTmbCV974meNW1gdwoE8gRXoQoYq1RHSAYqq9oK8C4d9\nN+ssqFb0UtxMYxGFAd\/pwQgl8s1KrZsSBPDs9WyYLUWfiBYYCEz02+Yc2QOFDERQncglMlscd0OM\ngAWpBUMCoLPYDhLwNtU2VOA3K4LqiKUrKuSrnINEDGHGECHykfdmS0vBjVBMLgi1n1KI8R1EAWpl\nst\/JwDVETk0dAL2YW4wIseXg0FLQRKWpysj7CBXUReyukdOmZeaiQFB8ABFtKamftin\/1MTXJbb8\nUp3aqGx5AWql6wqF0FKy3lEs8ktl31MTWwbCbJVzpCZCKy+C8tiKIKoZufh42lPXErSCbMhk0vir\nKw7qKuozYPwAHSMf0fJ0BCe9w8zrdXluNKrrphJZiZvmISC3OLlIxNC6GhAhDix62Yj7HvP7x2ba\nTBpzHV9VQ14xEdApJXcTqCa3Mrt9iUqQVAOxad8DNuq53xgZcnZWM0Zu+JO8WrQ6EJVtRB6ZZHXJ\nhuTFqdgyljoIwgvhg08ej7Lxse+Ye9hhulz3OufCzc2IR71ZbnVwfuSNLgXUiYV6OO4B8F0mh\/am\nhnlh\/pEIrXvYydwux5WGYNSwIghg8221p6AFALRJt0My4W87Xl1ZYHP+8Sa5FgYHB9utBnsCyG2n\noo6g2hk+BaiHYqDwYh7EMfJw7PtvP5J0Ozun60jIZ2A1kBxTrvpwhEq3n7AiooaSyH3cG3fi4eg3\nyMOa5VSDiUJMFvxBOkVRPCBlRUwZ423JqECh8Pz79GTNd\/013ICdll3YZTK68xRCWAnZCWHm6UOF\nnMfU2oudiqQkGjmNRUgBlYDYU\/Df7BZB1wGPJlwiz9AxfFMjIqw3JocPmjXGH1V+PAxeNTE+JB4O\nFWCwpAjOBwOTnOzM9aLkec8\/O9byOmcbhocd3f8zSZAMemOLC97ayMj9GhK3HU6xclReM7H5i1yO\nOkdDJdAOh8kJlZFrArpq\/RIfPJiIgpTL5fS0\/UYEZAw5YtouYfP5H3C3lUoZBJJxAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_worry-1312587467.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_worry.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
