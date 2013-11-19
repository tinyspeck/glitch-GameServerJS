//#include include/takeable.js

var label = "Hope";
var version = "1337965214";
var name_single = "Hope";
var name_plural = "Hopes";
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
var parent_classes = ["mental_hope", "mental_item_base", "takeable"];
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
		'position': {"x":-10,"y":-43,"w":21,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHDklEQVR42s2YWW8b1xXH9Q38EfwR\n9BH80pektihSEik7kihR1GYtVGSnXuSYtuwmTeNGRoKkD0HjJIBRFG0h1C0aRBQ5WkhK3ESKmyRS\n5Ij7OhzOcBlRdvHvIYv6qX1pQUYX+IN3Lkjwh7Pdc6ar6\/9c58Un6gb3ZK0hPGPOq18yjeoXTKP8\ntKlVlJ5e7vqpViO30l3Prbil8udoSL\/Hm9c\/4B9vjDg\/f0XPLyGJX0DinqLB\/VLfcTiUfnWpmnjA\nVrlPIdW+RuPsJYH9ifRnNM7\/gDPpW9SrX6FaeIp66j7O8k90HQWsxfWMmNajJvyGQL4koK8h1X9H\n+gb1Ou2l36Jee45a+ROIybuoJZchFR5f6RDcY5l48gEq+Ueo8h+jXnmGuvQ5yrlPUSk9h8h\/Bqnx\nGeqlB6hmbqGSuAUhPI9a7IG7M4Dsh2vl8CLE3DKq3CPUisuoiyukhyjHZsGFJtEQliDldagl5lGJ\nzEIITpN0aCRXutsOKIbu8eXQHIQ0WTG+SO6bJ\/fRnwvvQyrpUApNoRjQQojOoBafR8Y6jNT2EIqO\nCdQTj9sfi5Xje+Ddkygf3UQlfBMFjwaZ3REUfRPIucZRcE8gszeKuOk6qqdzSJuHkafzol1Dbn7U\n\/owWD++i5JxA2TsF8WgGp+tKAhwl6yy1QMSTBRQPJpHcGQbn1bbcW\/ZMoWTXdgjQf5fl9rTg9ych\n+KaR2noP7I9KpK1qlPzTqLA6FAk+RYDFfbIoWY53TaD5mxr7WNZ+wOOHq9zuRMsiTUiOrHa6rkJ6\nV03unmhZL2sfa50Vyd2FfS0ymyP0XR2q0Q\/bnySI3LlU9tzmi5ZxlGxaJDauI\/xKjphhEElKhqZr\nm\/F3QmeprSFkt9Uomsn1wXtrHSvU1cOHasF3F8UdDeI\/DuLoj9cQWpPh5K8KRP7Whygpbx4DZ6Xk\n2Nag7F7ipehyZ+9lkSBLtnkUNseQNY4gYxxCxjSMLLmzaNagaJkA71yEELjPV4874Nr\/CLl\/R8bt\nzbGceZospUWBGWuJs0xD9N+H4F9mpODyT9fR\/Hs1IQjqRQtwS4uceYrlTZrurou28pujbHZTDZ9B\n8aLrIq6CWbOa2B5GwKjQX0hAPrCoj9PVFjTJr1xIQDH10VrOMYaAQS67kIDVzK\/d\/OEc\/AbF6oWD\nQ2TyUr30FcT4HYS2Ve4LA2aKXu22nvavBgND7rPKN9RF30faPQqTVcZYAwPMcV7NeDM3XjgSSv1O\nVN7Z0vPD8TurxwUtdo4UyMSWaDb5HrX8XZSpWXVsyvl1m4yx+AbWzP5+xh8bYxLlWZjYa52Lz\/XQ\nz92HeQ1OTzVr9fLHNGo+g5TTQcrqcLSlRNCoeHuLBEs3LtsTAzAGetpbI9fD71yxJwZZe0KJHbYX\n\/qwaB8nryOfpeuPmaJBaQJ1fRNI\/ilO\/mslVpvVRbpzxZ4d4a7gP6\/ae9rb9O6yCFxv3YI8rsR2Q\nM9ZgH8uWqEEVZkkzKFTnIUpLqDVomqsvIM5pEUyOwBLsZzdsPeq2u3WPwPw5NZxJpVpKz14Wcp8g\n4FVjz9kH234\/HO4BOD1KuA5U8LhVcNn7seHoZY2u3s7cLqaTHtaXHYEzoWJzaR3z5o2h9TahUl5B\nKjSDzAl10KFxZA41SAc0iNrfw+6OHFsHCnjTQ\/xurM3XoOn4arclquCT5NIouS\/BzUOg2DsTbqFR\n+wXOpdt4Xae9SFnN0fwcn4VvQ8GbnXJ1lJvkI9wkNiM97S3kJp+82348gGiJrCXOUdwtgGvGXm0B\njTqBVWhwLy+25uV6egH+jb5WA+FOq3TN5NqMyJi2wTEnPWoXq3yRPNDyNrMce4EB+GI0i3AzEKRF\nVM9uk26hVJtHVpxBnJ9AuDhK2T4EV0oFK6uAwdOmUmMIv6v3ZkZwEh6BVPkOxdhHOLLcgItRtOJs\n29KLDZsMu\/4BHESH4I7cgDM8CHuIwI76wXh6YbD1rBqcP7vUFkDzqYJPCfNU48Zw3vgL6RXO6t+i\nGF9G0juJE8v1ljv\/m9rehjmpIPtzozh0DeKs\/D1en\/8dZ7XvUBOfo1LQo5J6H\/zJDHIBSh6nGgnH\nCBL2EcRtNIruDsPmVbR39DTH+vgAAe6HlIh5KBGElxCOdBCO5yDGPoB4PEO6+a\/PI4rJIMk\/jZxD\nQ0nSD0tE0byL22dFY+Cq\/iA1jMP8GHxeFQ5NA8h6F1rvZJqvQZowb0XPOacG4S1Vy70eFwHGFDD6\netpbB42UgbHSTaTFeYQi1N5blC2AJmxoU\/VWzedW7G33w+8fhCupwlawmUQduO6Yg16dI6LiQzkN\n8lUdshwBpyeQy0whl51ChvaJ5DiiqVGEC6PwUOxu+RStDO5oP2hwXJM1ez6zrx9WKi27LSlbe0vz\njBrWzX05Y3D06I377\/5PA\/w\/ARgOLvpYCwy3AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_hope-1312586415.swf",
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

log.info("mental_hope.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
