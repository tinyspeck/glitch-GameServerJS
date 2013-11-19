//#include include/takeable.js

var label = "Butterfly Bone Hair Clip";
var version = "1348259937";
var name_single = "Butterfly Bone Hair Clip";
var name_plural = "Butterfly Bone Hair Clips";
var article = "a";
var description = "This hair-clip belonged to Gwendolyn, but was lost when a strong wind from a quick-approaching storm swept belongings out her open window. Originally given to her by her cousin, Earnest, on the occasion of her memorization of the 137 verses of the first Book of Cosma, the clip is made of hand carved butterfly bones and encrusted with the dust of shiny elements.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_butterfly_hair_clip", "takeable"];
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
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-37,"w":46,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK+0lEQVR42u2Y2VOb1xnG8x+0t2kS\ng7ENBhmziB2EMIjVgJAAIcAgIRYhCSGE2BHaJRCSEGJHLDJgvIAx2EnGjh2HTJYmk3bKpJ22k+mF\nr3rVC\/6Ep+ccB5o4UNNM2k47OTPv8El8fN\/vPO\/7nvMc3njj5\/Hz+D8dzxarf\/E02MC\/P1GuuzNa\nZN50Fu3TeBiolP1HQZ4v14VtjZfxtz2l5nWbwL9hz99fs+UdhszXMKpKgb05CX3VcRisiUdP3VVM\nGtJxy1l4QCfwk4K8OyWKW7MKhBt2gXnDWbC7ZOTtr1nzsDCYhXFNKqxNXAbSXhgNMTccksQI1HAj\nUJ988Tj0pWnwm+VQS2JBJ\/KjYe57y2VLxmzzTUve\/rIp54Bcw9+dDg8Bsci56BbFQl0Ug\/r0i5By\nL6Ax9RIUGVHovBaL\/sJ4jFznsnBWpMJWnozh4kQMFSXC116BoH8Ak+YmeLv5uO0q+tfSvewoCdsL\niA9WRvgwNiZgRJoIfUkseovjYBDEoTc\/HkPkZfTl9vIUBkBjVJQKf3UGxsVpx9\/RMF1PYmBHserq\nxEBPG3oUQrQIr2LFnLN7Zrhxfbpu3VF8ONefBW0xBz0EiD7UWMLFeGM+Pr43jolGATyV6ZiuycJU\nTSYCkpdBP7tfgbOUfh9u2T8Cl1EFe1s1+6wsiEagl4czwdmVybr54VxWT+qCGDJzLkvN0cumNSI8\n2wlg3dUBf4MAs7W846CAY6JX4MqSGcRAYQI0fA4CGjFm5kdh97lga62CKjsGbaRW5wZzXg9oVSXz\nLcokbDgKYZMlQZ93lb3ERWKCpI2qszYsw+OtCUw4OrG0cwvLY70MjN7nEKawyRzFkXL9BfFQZkWj\nKYuD2bVZOBdnENgMwT0\/iTbyvao4BvND114PONKauOszZIM2QkcBhxW581s4qtCMNAvTbaXokZVB\nIq+DbXkBixtz+OzpChZdBthEGd9L5ZFy7bwY1kDurlpMhWYQ+mQfM+8\/gmMugLqkC1AURSJkEbx4\nLaC+Lha+bpKq7gy0ZFw+7j6qIK0rO1HISBqjT5KPtpFh9Af80DpsqM9Lwvy9EJ4\/nMW0pYs0UByL\nbpIBqlxVwnlUxp\/Hk7seOGe8sK4uwbUahLq1HtL0CIx1ZtImCb0WsLP2Crx6UvSdGZCnRWKkhHtc\nSzR9tEmYMqobUFlM6PF50DPhZZATO9sIPn6I27\/5Ej6rjqWOxo2US2zp6VfWIjhlxMCADjpy\/8Cw\nAW3SfGglVxCyFmBlJCvutYAKYRRc2gyMtaewB1MVXk3ZUXS6HBj0e9FRU4x+twPOjTV4t++x9G1t\nzWLTZziGpDGglMC\/Mg3PyjzU+jaY3CbolEUIjggQHOaFztTB9SWXDnrliaBrnzQ5Ajqy2J4GODTu\nQqdCwl4u5ZF0etxQW82Ye\/w+DJZBPPlgHauPtlkm6M6xNW9EZ7eSKe0KLWJxi8So5Oxw3wKGWsUx\noHtnV0UsK+yjNfDVMJRlHqsjzU6AwWaCVlEN9\/oKAo924dm6g+X9D+EP2GFSZODJth\/DXRXQOu1M\n6alF2+7maKn5r398aP78yYLwTIAlGW+GlfLeOTQrk8k6mI1q7svipiq0ZkZ\/L1htZURjuEUIu0YC\nt8cEv60V3tvrCO7dxcaKg6m1sebDozse2AZb0dVStK93WRjgvSk5Ptpx43bQinGjDG5tCjxd6Qdk\nc9gNGrN1y8MZYSdCFqW9JRPmhGOmn4eJrnTUpV2AKC78ByHjR2PC1IpJYyXG+kTwj3XjXnAAc47G\nwylPd8hh6Tj0z3sOp10abN90YsZtwO2FIXyyN4613XV8+iyEpzuT+PzxIr54bwZm0ogaAQcasnN1\niDkYUsQjaOTtLvZzf+h0GkuihMUZ517YiUWiayJtGnMT2epkCex6mdTo5oQcC9aqfWokZkbK\/JNO\n7aGXLN5euxZ+fQHcfVVwjaiwOT+CzUULPn53FstTgzB13cCUTYMvny7B3CPHNLn\/7rIdjl45ywo1\nE76qDPSXxENTEYOp3qzDUzucE\/5LmbwsajfQk75PLdXSMM9P5acRsDbse3oEB9TZLDsaMO3uZop8\n\/ek6vvggiAfro3j2IIAn9\/1kbWyH29CAR5vjeL43jTGTCj6LGnP2DhRFv80yQkupKT0KutxYtl2a\nibnovHYF8rxIzPRlHp6acuZsyC+p3D592guLkouehqsYaUjBQG02Hq2Y8OLrHQboGGqD09jOrqcd\nWjh7ZZhydmI75MSCtwdGfSMmicr1gmRUxEfAPaBgYLSmaePZyL5NDchE1Us3RF2TiPhJS1siiAM\/\nvdtDlmv7vQQqP\/VXaBZEwVyexNLgrMxAYLQLsx4DgxskAB0tVfA7dcTr9bPvnUYlBjRSLI\/rIUq8\niP66AphIY6nz4mDRSqHNuQJZaiT72UXUo0F3HwpNVxFp+gVWZnuTlSeb2t\/tdMfRGxqLLqIl+zKb\nqZfM8sjj6SqvQa0Qo71JhOYbZdC0VEKvkkLVWI7qvGSI02JQcTWMqNXM9uS+xuvokwrQKuTDIM5m\nMHSVoI6bbok03bQxO65zYJYlsm337lgJZodLTlZwojefT28wkwWczqqDWCY6S+pQ2r59+FFnl3LO\noeDyWyiPDSPbWyTbixWkrmgaTR1SKHKuoqO+GE3kOeKECLYFUjC6nNHjwVBd\/DHQrdEyTPblwqkl\nxqWWqN2Rengi4KqnTLjlq8IqWbx7JFfZ+aKZWHoKSe0UTbW3Kp1ZLmpc3aTAj2wWdTINpDObyrPR\nV18EaWoU21WkyReOgXzaNHpwwn1fORZNhTCrsqCvj0d3Qxx8vdm45S7GqiMPMySLJwL+\/kmLcMWR\ng8cLN9iD3OoUqApfLtTUbB45l0ECQ4FoYVN46oaolSrihEGcdOkHQA\/8IpAjBXYDFbg9Xog1Zy4s\nqiTWgBpJDPZmhFi15WDBlI2pwUxMDmSeDPjVIxH\/19tCWNuTcGdcDHK+xZpNwFLRL4mDtoSDlpwo\npuxRiEm6m3Oj2MmOrpv0\/m2vECvWYvj7BHh3VsyAXg0POYa2V0ZjsDmRff4uoK83\/XTAxyvlWHGV\nY1hBDk8tXCxZirHjr8L7szWsXmgTfTcoEFUoaC6GqzMbXfWJqC28AHnZJXQQde54i08F1BHLp5Zw\nMGfkMUC3Pg3qmhiUZr1z8qHqb395wN+eEmBvtgzDzQnEjmXCa8iFtycXK85y2NTp8BlyCAgPjo4s\nDLWkkaJORCnvHJRVpKHqr5CUcaAlLzHciGUpXB8tOBFOkh8BpTiaQXbXx0JeegnXs84dXOe97ac+\n4fSjgDLl0D+QB7sqmdj2LDzfkJCTXQe++agBf\/5Qjv0NIT65p8Dz2zJ8tqPBzlwlgtZclpr5ER4B\nykc3gaPqUdBBkokuAjDWlcrglix8aKQcNJVFQiGMPCRq79YWhMv+KdR3h6rysqylIorN\/tZ4AT7b\nImDPGhjgn57V4w+PpTh4rxq\/fSjGNx+r8ORmLSb60o8Bl618DBH16d+rq2OYMg0lF9m1hgCXZ597\nUZUb7i\/hvSP80f9haLx+0a8ojzzU1V2BmWx396dEZwYcakmAkhS\/toaDTunLdJPYvVEcoTuzSmcZ\nClFkHFFyv1UUhZvuIny1JzkV0N1NzsRqLqlHDqmt82iuiHpBFAu1ii7ym8Xnw\/6t\/8Wis67ICfeT\nejloE19Gr5ycnztJfepTyHKQhYFm7j+Km6TtJ1Xpx4zBpgQ+VUZ0LZxfxnub\/18H+nn8r46\/AxpZ\n9n8YfEYXAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_butterfly_hair_clip-1348197640.swf",
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_butterfly_hair_clip.js LOADED");

// generated ok 2012-09-21 13:38:57 by martlume
