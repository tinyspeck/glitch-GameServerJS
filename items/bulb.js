//#include include/takeable.js

var label = "Bulb";
var version = "1347677145";
var name_single = "Bulb";
var name_plural = "Bulbs";
var article = "a";
var description = "The glowy bit of a lamp. Without this, a lamp is just a stick with a silly hat on.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [289,290,291,292];
var parent_classes = ["bulb", "takeable"];
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-14,"w":24,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKX0lEQVR42sWY6VdT1xrG+Q\/6sR\/7\n4f4BfrxdXdoBBZSKVK3oVQtYW6W1ztDJqc6u3qtWKwjKPIQhICREQkKSQwKZDxnJQCBkIgMJmckE\nXvfd7wlaXb1fGoeetfZKFpys\/PbzvO\/z7pO8vBwuhNB7eB1\/+vQp8eLCf2vB6wJepXi9k\/e2LwCL\nR2wst+OxdUb7m1olrpZoZT9ItfKfZXrFeZnDQjN6nGxrNGT043vDa8BvBzQY0F2ZnrqhUoqOTKrE\nJ8Qa6fdSnfyMVE+elxnIS3Kj+prCrL6umNH8Sq05\/e9ToYBiYQ209I3CTU2eOiHjH5x4Ge6szKi6\nrpyfaZl2ztIMC7Z+o3Ou2zA3fYecm75LUq\/6O6TL2j29uhpPg\/VvBE4pPH5WwqsUKYiqSXLimFgt\nqZFYdL9rFt1CZzxiCSYT7mgmHUo+eZJcefp09b8rK9F0NGzyexxDJru5YcpqqpuyzjxUpxLe2GuH\nFD7e9aOYu18k43+F1fsOq3dKYlBdU\/oxXCig8kYjlqXksiuSTgWWV1eiqSericyT1VgagNNJXyzk\nl9kdsy1q20yjym5p0WTSwQSGXPd64FjbK0Sju4Xi5+odF2tk30uNqmsKp7XbEPAK7dGw0Z+I20Op\npDeaSS0tZzLhxEo6lMikl+KZpC+SSjiDkSDpWLC2qx2WZpXHPmh8spoiXxlOMFy4jhjZMT7B2SuU\n8L9cq72TEp38Z6mBvCg3a24oZvW\/kXZLsybgJeZSCVcolfBE06nFWCblj66k\/ZFU0h1OLtuXErHZ\nxSUfMeuydWpAzZBf4cQqVrwSII9R\/EA4smtczNkvzNp7VAyRopOfkxmmrshntP9WzhnvkjbzA5Vz\nrk295BVYMGQwnfSE8ApnX11LqWW7PxGzeKNhtcPjoGtd1k6NzdKkWl2JyXKG4w4WFPKZWwUiAOR+\nIZIJDmHAY1TnQtYZcZRY9LeUUPzwZS5bl8bn6teG\/OPm9LJtEcAyqYVAJuX0p5J233JsxpOImRd8\nziGdx96rhQ2FA0oXZGpugI8KLvKZJUQWsJwChO6F+tOTF2SQdWDvvKl+yjnbqnbbejTw5UEfWx8L\nyS3ppHMRw+Hl8qVTDm962eoByID3sd7rHNDBhjzOYRNMolwB+S8BEoepeIGJ8TJgAwUIqvgWGLqg\nlzMdDQqNybh+fjXt9q5mvL6V9II3nbR7k3Gza8nLnoaNwIYc+HM5Rc5wz\/p1WcCXLf7\/Cv4ZMBYU\nGZcjCtNKyjL\/ZGXRt5pxUyrGw8o5+D\/cR9mMP5eMO5k5Am6kAKkmgQwUfEXVIAT0izUIFjtesBgU\nigQIQzwsNaViKlyPuplUXGN2OwUBXJ+m8CIfRxPH8Aww5Jf35gQ4OpDP4zOKMWA2ZrIjDkL6hS7W\n\/wc3yT3cJI0qiA9oEr+bpQ8ujlEqAiQo6XURvjnTcGbewgzjRnEnl51Bn2tIDxsL+qS6vww40vPB\nP0b7P+bxGJsF46zthAhykHdApBR+81IOUocBPGtt5gYqZrCKWlAx4B2hIEFJqEeva8zpc3FsFgM9\nGotonamEY8m3wDJB93udwzM5NQmb\/iGPO1jIF7BKCRG7bFzM+6NRsnX4YtTUZlW0dmg8dvoaJEsP\ndkPNwXLbGPMmXVd0wT5kXY7O+t32gWnYmH22XZfT2MOA9VQdMj7FNn+Obd73gs2nJHD2g+NV9kh1\nh4obGGNZSNww2G4AhYagFn5v1rf75k0ds17HgB7mMmQoNBoG\/Oiv20z\/sPwPmz\/DNu\/50zzWKc7h\no9baRJnOQoKSYDfkHDSO3dI1o1c1RTSKB3EtWR+Z0T+ch3vgXviMWfurciUd\/e4vAzJo\/3yXsnkt\nbqCbsyr+MZO18h+pyFFJL5m0ihtms+a2jposePRBfemUdX5Sei+pUdYFNYraoFF336pV3PXAPQAH\nG4MyiYVNbbnVYd+GmtH+TygVBVjFCfaebC1SYw\/mMmW1dJRZg0RjZ0IS\/sWAWXtTZdHdUevI2zbl\n5M2wnrxrM2vvzYBiADZJXE+AraAcwBnIX+Rux4gmp0cCUBFbPUSpiGvx+ckGWw0NA7kIkGJe9RyP\nVbOsJy+R08qrGp3yxrSQdzkh4l1NG1W3DFCjAAUNJSYuh9SyqyaIKb3iFznUslH161TOh1gO\/cMP\n2PSPqY6G0Ze1Ohs7WciskgpRjZbDPJUe5\/7gn5JcMILtKvFlCxzJqIXVAsVU0ot6YvTHKNQvxJVa\nUi2Bml50TxhyPjjgWtwBVo8NFmVj5zlk5ZrdR6jGISdOyyWCavM4t9pDcGr8atl5FagENsIrRBOA\njXNOeyTEaQNsDGIL8pUUnZSkk352zscvbHUhTJdsPZY+VxI6G86KCmEVpSaAwhdL+Kem2UNH0zKi\n2gAHDFB4ZPDo6tjwd0ER9\/gsh\/HtIoaTKkUndXLiiE4qqNKa9Y2uV3ryoybMwCc3KUgmQO4Ypx4H\n8KymLMfzGmIIFAVYGXGUHO6vSkn4x9QE+8j82PC37nH2Nxb24OGInPgpwh0+hnisE4jLPILYg4fQ\nxNhJFFoymF75UYBLzy\/kDRbehPihRuEzNSlQUPTLCYCFGhVxDqkf0w9GxGOHlaODB91M+pdxVv\/X\n6BGtEtE79qHe1j2ou7kMdT7cjiEPIsfcCHptT3s8xsZ3sZoVAua27megEOjPYOEcCSXAYZSbH9H2\nx7nMyrlHtHIMV4F6Wndn4Vp2os7G7ai9YSti9O5Ds8ZBZDQa38t73Rc8YPGYJT+Ms0q7KesBdqRs\nHOY45OcIffcshkR9bVmonpZdqKvpM9TV+Blqqy+mFp91CNnmNYhG6\/so701eY4PFO\/mMrUyoU2go\nCHlGzy4XgPW170KdD7ZhsG2o48FW1Hp\/M2qpK0CMnn8ho5aGpkg14oxyEUmSFW8UEuznDGzqgvyE\n1dtWEupt24mhPkW0plIKCt631RchevsORIqvoUVfEPX29CNSqUIMBouwWq1v9gcn6HqcoZ0w02mN\nRaGellIMVYxVK6TA2hs243rch1TyZgznQ8NMNmINs9HkpBQpFCQaGeG+WaufQcK4bK\/\/xE9r2oYA\nEtRrvV+ARodOIILPQKopHers7EZNja24Bl2os6MbW6xGY1ye+q38ZAeQrbUfMZrubcKqbcEdvBd1\ntV9Fzc1t6NatO+j8+V\/QwwfNyOtZQq0tHRhYix4NMJBUIkd5b+vatGnTOwUFBbeLtxTbynbtRgcq\nD6C9e\/ej6tM1qLubjkQiCaq9dx9bPIoIgQgJ+ELU19cffuu\/zhYWFqrLynajw4erKOXu\/V6Lzp29\ngM78fI5Sjd73CDU3teE6lKG62obBtw64fv36dfn5G21bthSjnTs\/RxUVlejKleuooaERXTh\/Ed2v\na8AW6zH4fVRbW3887++48vPzL5SUlKDdZXvQoa8Po8qKA1jRb1BLczvq6KChy5evocuXrmDwK+\/l\n\/V0XrsnbJSXb0P79X1CrqupbdPDg1+jo0eMUbHl5eUve3329\/\/77FRs2bLhdVLSZ2L59J4FBiaKi\nImLjxo1EXV3dSxn4P9MWv8b4BYPyAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/bulb-1336680195.swf",
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
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("bulb.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
