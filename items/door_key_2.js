//#include include/takeable.js

var label = "Green-White Circle Key";
var version = "1337965213";
var name_single = "Green-White Circle Key";
var name_plural = "Green-White Circle Key";
var article = "a";
var description = "Green and white and shaped like your melon, this little key will take you to the other side. Well, the other side of a door, anyway.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_2", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "2"	// defined by door_key_base (overridden by door_key_2)
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

function expire(){ // defined by door_key_base
	if (this.isOnGround()){
		this.apiDelete();
	}
	else{
		delete this.pc_can_pickup;
	}
}

// global block from door_key_base
this.is_key = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"key",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-17,"w":37,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEqUlEQVR42u2WW0gcVxjH81QoJKSU\nvuSl+1QaKCgcyEMfilAITR\/alJZSaGgUEtpoG9IYgpombi9pvCTG1W4S1\/stXtaMbkxcXY07rhpX\n3cvs3b24zupuvK6O1by18O85swm1hFJiYvLQ\/cOfOR8zDD++73znfLt2JZVUUkklldT\/T+7Yw1Sz\nf7FUN+Tgb7T18UpVA59TqOFL6nVdzXfN6QPW8N6XAjZ436cY9cR4d3QDfRNBqFsMyC+\/iRMXynE8\nrwRKuq7vHmHvRLu4mfZC4bhBu6J3zCvxDhGV3UYcLMvBmwVfYN\/Pn+GN\/MN4tzgTTVo9rlRzaDVY\nYBfXEYr\/efiFwGm0A3u1BrMwMBlAXmcT9hQdgkL9OUjDNyDNmSA3v6XOwpBtHDaLAE5vkjMcWvlD\ncsek1B0HrOkwlHabBNQMm\/BK4ftIqTsO0kKhtKdAuGyQrjMgndnQ2YbgnwrC6XCjxzgBQVyDIyIJ\nOwqnruYUNR39MHpCeFt9FPurM0DaTiag7uaA9J0DMfxAfQ7jfhemQzMIBkJwCC6YrH44KaTZM5u+\nY4CqOq60694kLpk47Cv\/FKT1OxAdhdPnggzmg5h+Ahm9iKOWKkTnooiIswhPiwj4g5i0OCjgKsY8\ns8IOAt4Sx1wiDtRkIaXha5Bb34P0UDijEuT+RZDJIhD7FfRHnJifX0A0GoNIIVkmWamF4DzN4BwG\n7T7FjgCW1XFwR+LYffmDxL5j2TOcBxn5BcRaDOJRIWNai3h8FctLK5h\/sIC52ShmwiJ8Xj\/snmkZ\nsH3QhaZ+p+w2oxv9luln8u0Rr3QkK\/fAFsBDdO\/R8nafBbl3AWTsVxBHCUjwOvTxKaxL61hZiWNh\nYTGRxZkIpnwBChiWAQcmfM\/d6nqt+J+A74WqsLGxSQF\/R3xl9V8B1Y3dKLje8lx97GQez\/agwPbg\n\/hvpSGk+kShx\/3m5MYj1MjICrVhblbAaX3uixG6XF0IgJgPWdhrTrrfon8r5qgbh\/NU6MLP48Zr5\nx9+a6tTNPQrWxXV3THbkDjRCUXmEnntbmoRmsSRgwNLSMpYWl7EgN8kDuZNZk9hs7kQXu2fF7ez\/\n3MIKPq9IA2YWP14z5xZplPJH5bWdaewcHAlE8Hrpx0hpyUxksTePQuaj2HUXsdg8YtF5eszEKNyc\nfMz4vFMYtngT56A3qtwOYEWbnq9o6wVzIk6smTXtvX\/\/s1pr4HtGXbhk4PCq6kO80\/Ko1DST2eZ6\nGYplje07ljkGZxy1whJaZjeJZA2vbWu6adYZ+ebbPJjl+NGa+eZtfgsgN6jQ9pkldherevXYc\/Uj\nvNVwDKTjlHzFVU32IBQMI0BvEJfTg9Y7Q\/JRQO9iuOakbQ8Mw+M2fmTcjmGzXZJj+mRxwsKpf3zc\n1jeRSqcZweSMQKXT42B5Ll5THcZuNfW1T3D2zjVUdHWirF4H7T0bm2akZ51mKriR1MrO4TT23Boz\na7TWJ6vCBtH73pjAhgDOKOCShsPpgip8daYYX54uwNmiWtTq6CQzGZLsMw9Td70suaKbaeP+xS7d\nkBM32g1QljUip6gSdKIWm3rMypc2USeVVFJJJZXUU+svZOzKFcew0MsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_2-1334257799.swf",
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
	"key",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("door_key_2.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
