//#include include/takeable.js

var label = "Piece of Magical Pendant";
var version = "1350087130";
var name_single = "Piece of Magical Pendant";
var name_plural = "Pieces of Magical Pendant";
var article = "a";
var description = "One charming, chipped off chunk of a total of three romantically charged necklace pieces.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_magical_pendant_piece3", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1311\/\" glitch=\"item|artifact_magical_pendant\">Magical Pendant<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-15,"w":21,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGg0lEQVR42u2YWVCTVxTHfeqrb33N\nUztlRsuI4sIWLSbKZsIWSQIkLAmyBGQJW8CAQWQJRAOKFiTsm9DgAhTBBlFkXGjQsRZGLS5jp05n\n+Prcl9N7Lv0+QJKK0kIfuDP\/ycLN\/X733LNdtmzZHJtjc\/y7Y\/4XI4+ZMaYxs0br\/IzRxsxUiv4f\nULNV+vmZyjkCBqjfHpfC87v58HAwBcZ7Yq0bAsY8q+ajpViouXuF8Hg0A271aqDRGA\/69P0QFeoK\nYuFXlg2w2ALY64dFYB9Og5ud0dB1LoxChQXshogj20Ee7EoVFrhNv35WQ\/+aMTK\/\/1S+DCxe6gbB\nh10okEq2CxIi3TmpI3etDyAzW2lCqyHc7b44CldVKATxIRdqMQTLUHtAbpI3FKTyQZfKtycr95hU\nUe78dYN7azfAWI8SBptlkKzYTa0WI3GDFOUeyE\/xAZ2GP1eQ6qPPUe\/cun7HOmtUIBxGJVoNlZvs\nReFiI9wgiYDmpXjbCjXe\/I2JVuJzrOUQrtbgz8ERyzE5KV5pG5bjMJWgz93tV3PWw9SBx0qcn8mM\n8+CtZf2bbTIeag3Wq7TM3s7h4DBiwwO3UbiEyB2un7rum6kiPbsmCk8HjUCCj8EU9ur+idWdClaH\npdZrNokhMsQV1gKHJRAT+vctcmiuFkN5vgoK08LhdM5BOF8SwD1rsl9tGekJ3\/qhAKGTh5rlHKBM\n\/LV+LQGHLmOpCgbzqUZoMM+D5dyfVI01s1BvNFBozLE4706fyv6PkFgpEOxKQwR9xfRSkvkN79Pg\nqvRPxvKgJFsIxdkDHNhSVRn+AENWDIXEY0cRo9icLnpvoNCGBf\/pmHYxUDqiTKsNsLePLupfPtBb\n7TfSmYbKEJCJtoNIIIaokKckPb2AzGOvoUj7jgNMjZ+D8IAuSIp2p2UUn3v1ktTu9CF5mgWfGGmP\ngr6LEvqKn3\/oiFqW8yYGJniv7I2KX6frTM8nK+wYWHhMWHHQGjmJ3pBIyl6g7xcgFVlAeuSJQx0N\nnAb\/\/f0kjbnBYGscLQz0+c6OGcsY+h1Oaj0TAi1mGdy7lgijndFzLybz9W+mzNaZ2wYGd4rf47x2\ncyhcKA2EijwBFGj4kKnyBB2pMieO8ylgsF8PBPkOOZTAqx0O7KsHkfAwlJHfY9v2d9A49nux0MUu\nCdoGvRcktLdb2r040imtLwVilUssV1V4iLRfIipluCsIfUophDP5etZCqN9eqDnpB6MdisX1HeVL\nscDFRKIW0lUeMNQi5ya3ng2G86cCoKlKxEU4qqbYn4JpE7ygLFfAgS1KCvoMBUgCY8D\/QPEK4fcF\nx9XwbXkQnY\/PYdce7YxaGSzBwi9dsYXCtiknyYuDHGiSQdvZSBhozQb7jXz62Vp\/lProtUYp+VsI\nSSUiB4ALqiuVQLlOBiezDixTjcFvxdzBFgXXB4x2Ra9M4EqJm5Xt7dCSeNzo\/Gwnzf64szaUQrHB\nxMJ2nw+jfuwM9kOaHtUCm+5udkQzKwJGHb5zq1rubl\/ahGLDMN4bTwODbSJQl+vC4cLpAGivDYOp\nIQ0Mt0ZS6+IrugJaeaw3AfrqVdBYnbeo96AwIIfaYincuydli4CoLsUtW1\/83p4e\/WfLINPiQzhI\ntik9oz9MLcr+GBN6Q0UQPJssA0w1aNHqE4eoddk8irA3OmKJkgloMUknpTBuPQM\/jjTAz3fa4OXD\nJu50WE0Nm2C4LX3h922Y6pSPJ7479vmK48b2HQERjpWxQAjmYj+wkJ0joK1bSRMsukG7OYRsxpNa\nhMtp5OjxewPxudM5vmCpVsN43zFuk1ctaXC9SQGPRrNgeiSdvsd18T1uGoNzoj8THgwkO76MYaOw\n0DkvB0R11oTCdYuMlEQ5VgDOumy3wkKgFXUabyjRHoS5+0VwjUDcsSbSo6zUCejfEHrs8sIm9el8\n6K6LWJbiiDsxTisMtvS6VB8Fgi4FRB9EQBQma3YTReS2h\/OaSFXB40ahP6JwE86E7V1DxREqdCdc\noyz3IF0T3WxVTYD5pNDVXORnOlvkx1y5FOEQ0JG1UdhivT\/HmRAoO9ELjsftg8To3ZAg3zX30R3L\nYKOUf90iNRFA+1oAsxI8aUrDyxjeeZZmkCXX2bX9x0KX7MHDixTe8nQaHxOpyzZyTWVWA4hgjqAy\n1JFMslJg08QGmLSJqv\/uklZb4s8jgPxSrYCPm3hfmhh3Pt6nWcXJdvC2bI7NsTk+fvwFeN+y4JHv\nvIkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_magical_pendant_piece3-1348198036.swf",
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
	"artifactpiece",
	"collectible",
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

log.info("artifact_magical_pendant_piece3.js LOADED");

// generated ok 2012-10-12 17:12:10 by martlume
