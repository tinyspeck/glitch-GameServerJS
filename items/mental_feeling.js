//#include include/takeable.js

var label = "Feeling";
var version = "1337965214";
var name_single = "Feeling";
var name_plural = "Feelings";
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
var parent_classes = ["mental_feeling", "mental_item_base", "takeable"];
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
		'position': {"x":-21,"y":-45,"w":42,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIfElEQVR42s1Y6VZT5xr2DrwELoFL\n4BJ6Cfzrj\/acxemqmHnY2TvZOzsTEECQScUBp2Kl9eDUqAWkWo14pIoCmUMCJDtAGPz1nOfbeFZ1\nLW09liybtb61gYTkyfu+z\/DuQ4feelRvO5o2pmXP9vN+T2XC7SmNSm2H\/i4PY8LVvPHQa+yVR\/B6\n7Sx2UoMwpsIo9MkjfwuA69c8yfpSDHvlXuyV+rCT7sXGL2EUj8vIKtoXnx1g5ZaMrd9C2FkKY\/uF\njvp8BNWEhkKvgrRX+\/xVXP1ORm0qwLb6ULnmxuq4hJVhGblIAMsOLfHZAea7lcTKKRml0xJKp3wo\nDsjIx\/xIuTWkvtFbPjvAqqYdzoVUTz7iT2R50j7VWLbqWPxHGItfh1s\/mmyTrubqlDNVX+hE\/YWY\n4wjWrypGsU8+eEV49VX0i8V\/BRPLDn\/qo77kZUeTccdp7GS6sLc2jNflk9jJDqF2P2KOSzaqNIZs\nadU3kos7\/7QCq9+724x7TuxmIlSDLuwWerC9FEfllh8rIz4C9CcbNgKFEetI9YLl8B+9pnzZG6sm\n3KgvqNRRDfVXQVR\/cmLtOy9Whki4UAANA1gcdDStnGlPVvs\/DLJ02ptYn\/CgNuPFZpKqMC1hfcKN\n8hnJlKtsQEVDiZTrcRrZDncy7\/M1v\/dL9MvjAswqK7b2vQdrl70mOCH2Qq7Sbs1oKMC0Xx5PSwqW\nrSrSspoo9CmJ4qCcKJ3wYe1qiBKlmpUS7RQzJ67idwEuI1GujoQ8jZMhi3Z4yaYllr7RsXwkxA9W\nYdztxdb8CZJhjMQ4TScaQOkk9TNOUNEAcuEAsiq\/jFc1GgrOrJ4rGEuzCrmQhsrtbmy\/OkUinDaB\n7aZHsZ0ewfbiAAH30I10VK5rFHsV5YserIyyzX3yeLVfO9wQcEusHv0Yxf4QCdCDrbnjqD8fQv3l\nMOqLw9hZHKKcHCfAXjI4Tsv071dOUbB6RULlhh+lc2z3MSXZEJApm94iAK5d6SAze7DxiK2d60P9\nt366RR+reQzbL7spK51kr2i9k+4TwdK3Qc6qzPmUSBrOJC200EOQ2gGDTLXvAyxfisK404mNmS5s\nPopj82k3WxrH1vMuAozxRLHx0EV7s7OlCjKUFeHr6z8wfAhGn2MAGeSM0vcPfgY9qlEc5GzdIMi7\nMdRmYwQZYyUFKJUE0bG1oLGCNv7NZl4FUONnBzIXXcifJ8gL3v0g0q8g3ym\/4+\/FbqXJmAmO118O\nJMrnpdZPIcl4LqJibSJMkCEY9ziPszwPNVRvu7A5pxCkxIpa2XYLZ9RqAl2\/Z8dtpx2PYxYsnaBo\nn92Pcfm4\/I6\/s7Kt4j128iGz4jnd\/35r5ZOttSmHscnK1KajyUL3vsGnXHpLRlbZOs1sX\/VmELV7\nGlsuo3qLbf3Vg63\/uExgO8tHyfCjJtD0j3ZMKTYsnmhHdsyF1Yus4kmf+R756O9VzATlVmGJlX+7\nsXJSMopKuOm9AGszHmO31E2zP4HNx1FKhS8lUk0uILVkdSmVcgltC3DwA6jc9GN9UrDUBWOWVXzs\nYBK3muB2C+1ktYWgrfutvuM0P1yAKDNzmnmzc38W872O1kKvI5lR\/Z5CjJHPpzV\/OPrfcHPYdc6Q\nQhAeIQ0mG\/NxF0oXWIWghJQziNIYn5+gY1zy4nGnCwujTrOdoq31BYtZxe1XBPiMAB8SIFNO5bqL\nSuAxXSbtDmK5XRcsH18Ztn3czIlBLY2SdROS2QphVRk1YLwdatNSwMjTJYoD1LhLMqb9LswEbPg1\nYsWU345SgiCf2lC4bcXzszbMj9oxf+oNQFZaeHS+02\/KUMoR\/P\/DQzYYiOU7lIRI1mlFS9Ci3gmZ\nGW\/Qkw3Sc7tExpNx3+\/As96jyI0dQbLDgsy4Ays37JjVbbiv2cz5EyR5FH9TQQIsj5Eo9G\/Rnca4\niqwaIgAUemU80tx4TGAvBo7iSZcNq5NOPIlb8bTbgvk+8TcLZlQbbtoc5jJWmVRgJEKsfqAxAM0q\nurU2YWX5Dlpaj4y5sBvPOKOZUTd+0e1mJRdH2s2qLgy1m+1PuO1mNqzNRkiaGAHy\/3uUxm2LTCjJ\nnB4w50kIr4hcqUEv7kr7AF+9DTBqxbTqpGyFKe6dQr7YYgWFeAPvWgh\/zsiaGePzXfsgcwOSOW+z\nQSvm3mrxg5gTqetRbCW7sDEbpTRRBZhwjJ9l+jr1dEYTfp0qnZQOdqnKOAVhNLZaeG4QRc7Us4gX\nd7x2svt3kjzo8aH2oIO6ydcMB1A+L1OCItgtDeH12hnsrYwyGR1jAmeg6JdbD5Qw2ZCeLJ2h\/V2L\nYf0aq3MtgvzVCF5c0PHioo6Xl3QYbKkxxbaOBLDYFmbFPASoYq\/E9bTUi510N60yjPUfFTNMHGja\nMUFG9eTqpQjbRJCTMVpfB7c5Xu\/wJHh+irB6YaYY3dQ+seltzrm5M2t0HQaNeT+q1EgRJsT+kg8G\nWg9cesxKngoxQUcYUgXYCFnL6w9hM2CsXdH5nGaSSshN7b6bbsUN8L6DsuN8Z\/vLqerBrwepf0Zb\nlq1BECirQDBnCfYczxh\/PqdzodIZAoLmriIqJQBVJl08bqxffSPeIivyeWEGB6+NktxW6Hcg7VNi\nBJoQfi38VgRdsdH97zBXJouDvpQIDAKUOMJe98ODHxm\/ipQldDBsFndl1y5ILSlbsDWtSIniacc7\nEWn523CTkKOUNeRJ2cXR28Q45CO+5ny3bIjIJZhf6Pablc0oXE3twb9+e6Q86muuTXuNnXQc26lh\nzhdny\/UHEel9t\/sYqbJaYFw4kgAmlvoliz6y9OUBMLh83uvZnJOwU1Cx+cRv7hq54KcN9rJFaxY7\nz\/LXHwion\/JgivGsk4kihIp4bsayRgz2X7nZKe7DCP\/lFaJVYrYa8Vn\/BUwF8wHPNR7mAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_feeling-1312586254.swf",
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

log.info("mental_feeling.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
