//#include include/takeable.js

var label = "Fiber";
var version = "1343155518";
var name_single = "Fiber";
var name_plural = "Fibers";
var article = "a";
var description = "A patch of downy hair brushed from the tail of a fox, perfect for spinning into thread or stuffing into furniture for padding.  Also might be perfect for gluing to your face as a moustache, but due to its origin (the underside of a fox tail), no one does.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 999;
var base_cost = 1;
var input_for = [257,258,259,266];
var parent_classes = ["fiber", "takeable"];
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
	out.push([2, "You can find this by brushing <a href=\"\/items\/1155\/\" glitch=\"item|npc_fox\">Foxes<\/a>."]);
	out.push([2, "You can use a <a href=\"\/items\/1169\/\" glitch=\"item|spindle\">Spindle<\/a> to turn these into <a href=\"\/items\/1170\/\" glitch=\"item|thread\">Thread<\/a>."]);
	return out;
}

var tags = [
	"fiberarts",
	"basic_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-17,"w":40,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF+UlEQVR42u1X21YaVxj2DXwEHsGL\n3nWtOmqMEeSoICAoZ5CDchIREEYQEEUZREQQdQyerTom1sa0TSYrXb2eR5hHmEf4uzddpitXzepK\nUy\/475i92fub7\/v+b+\/p6upUpzrVqU516n+vP+6rouPavOlJgvv1stDN3paZl5U5rpyxU6e1mGk9\nZfOHXKqexzkq8Q+EarjX9L8w99v1BvvupiS0KkGinHHQF81FKCTMEHCMsY\/z1NI+clw+QH5zgNf7\nyTZLH15tsioJAXNuNXe1TwqpsAHcZkUb4IfXFer+bAWOdxb46so0W0ya2KhT0\/1VgSS8oyKHXkw4\nJmWEWtZHeaZkdDk7w14dpISDchBuDpcgGVADteyBN+erkPDrwGmUfGJs3qcjM1EzddGIkzurXviq\nAH+\/q\/Rs5Vz+Sc1zQqsYAKteDBbtMPjtKnZU8r1IpxqEXMzeBtnaisA+FQDkRchEdLxm8LtuPGdy\nfIiJuPXETyc5rrbqNX11n22vTJNKSS+JZbQbRrCcnE0vZvC4efwFc1JPAtoczpHkB6UgsblsJ5fn\ndaBT9sPE6HMYV\/Rz8YARamsB7mxngUQ2YCdUgwqluNf\/r0BdNqLdpaSFePRQaFoNWuUAp0TAnJMy\n0MgHKMwOHp9UP6cWZg1I2gKgBmn7rpJ2EBigRTcEM1YlVPIzwBwu8ZtZH19cmobrAxLcJimjVT7z\nPybBRtLa88Wx0dqO0BtLVmFlYYJsUmF2xqaC1Jyx7anRkV4KMzkxOiDCv70WBeswjNCN9RB\/2VwU\n9jdCPZtpmz8fM8DCrA6QPWDGJod8wgk7xSB4LUrBMDbET0\/J0BoS0fvXFeLNxSrqehX8I6NYzrdX\n60iyKMO8TPO1ggeKKYtQybk4uhzkt1fcYNa+YNSyfuxFBvmS8pgV3NhIn8k1JReu9xIiJ2qABZ+W\nvzlMI0YTsJY0Qdg1Cmspl3DbWgbcVKmQHgGVsh8RuPcMBZd7JHjNcmFc3vfJn3itUtr2t19xVNy2\nMszDxSpzsZvgcZ5d0yTM2lUKPN5AslfzbmEprBcQSHBPyTEbyGcDJJZeLe0HE2oet0kOyAaCSStB\ncWMEzGTINQbm8WHy\/jgrQuOc2ywDveqZ6eOrTQXKUHh9lOVPd2PEZzbbT9JU2ip8evD2cp07303y\nby7XBCQVYLC\/XK3Dq6Nl8qIZJw82g6ZGwdldSEzCon+MLSQdglk3zCL2aNxASjHBI2\/CHhXBG8JR\nNcJWsk4hGdAIIZcaJseGaKN6iLQbpXxsVg8+q5LEip3UF5m74xycNeLovwGunLXj3KR\/3E+h2LKS\nXXhxs1bMXR1k4IomuZN63I8nH26G+ObGrJCLGoT0nFaxVw2LquteEQZYX\/P50fEm1IseRSo41pbh\nrJmiLvdJOKzMQaM4w1dz02whboRZm9SPAWJmzYjhh4tiu0kaRR+fjxnbSXB3lOk5bcSYetEnlNJW\n2Cv5AeXlXycRenN2UjNEt2oJCkkq7Kx5EUMabs6jAZ9NCa3tKHN3lCNPdubJ7RUPhzZtGxkBpH8+\nKwBdDnFYrmYpqEBsw1bezSxHTWzAOSroVajzEbNYevuEpC3zlPqFYnctSLS2wjSW9\/ZlBlrVCGB\/\n5+MGLovIyMf0BD4cPmsQ3EHozGTRQmTQqeZwd5p1YkSzF4qkC7ILFhZLjGW5P1mhsYSHlbCQi1s5\nnfIZeusgYi\/c3qyan4aNJYuwEjOysZlR3m+XwrxPK2ykXYhRucltkREWjZg4b6YUr1tpolWLELW8\nm\/jiHIx4NH6fRck6jFIGH\/qOCQmj0Qx2P44FkenRCwB6zk1phgSUZ22pEBvc\/WkeWcDjx57F2Vhb\n9XDJoIpAeUrvUUEU9BIIo1xFKcD\/Jzec83qy53yPFBIBA4XZnhofIjF4fCQ+XKwBSgDYLnj8haim\n++G80LNfDjDL8\/p2xx4jH3+TW8y7G4q9O87y540EiwCw1ZyLLSSMbAmFO74sHNeikFuYoJ\/kBfYd\nuh\/iCwOW9cl+AtQ3fD1dnepUpzrVqU49ifoTpHF7hNCup24AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/strips_of_fabric-1331259174.swf",
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
	"basic_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("fiber.js LOADED");

// generated ok 2012-07-24 11:45:18 by cal
