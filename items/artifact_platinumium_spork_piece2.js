//#include include/takeable.js

var label = "Piece of Platinumium Spork";
var version = "1350087212";
var name_single = "Piece of Platinumium Spork";
var name_plural = "Pieces of Platinumium Spork";
var article = "a";
var description = "Half of a platinuminium spork that requires its partner before functioning like a spoon, fork, or both.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_platinumium_spork_piece2", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "artifact_platinumium_spork"	// defined by takeable (overridden by artifact_platinumium_spork_piece2)
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1314\/\" glitch=\"item|artifact_platinumium_spork\">Platinumium Spork<\/a> artifact."]);
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
		'position': {"x":-8,"y":-9,"w":17,"h":10},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFBElEQVR42u2W2UpcSxSGfYM8go\/g\nI\/gIgqBiUBQ5CiomV6Ki0jcKImJfCGKi0nGe53nczsY4tEOch3YeEPQRVtZXWDntFM7xIOemCxa9\ne+9dVV\/966+1Kygo0AIt0AIt0ALtf2nX19dhNzc3rouLC9fh4aFre3vbtbm56drY2HCtrq66l5eX\nne\/fvzuzs7PO1NSUs7i4KPpfFhYWHJ\/PF\/ouUHd3dx+Aury89CmYHB8fi8LJ\/v6+KKAooCigeL1e\nUUD58eOHzM\/Py8zMjCikOI4T965gCnWvq5eDgwM5OTkxcXR0ZKBGRkakublZ6urqpLa2VhoaGmRg\nYADFRFWU6elpeRe429vbUE2n7\/T01ICg1N7engA6NzcnNTU1Ulpa+mp4PB4ZGxszKu7s7IT5j6sL\n\/Kyp7xgdHfW2t7eHvUU1t4acnZ2ZtK2trcnW1pYsLS2ZiS1EWVmZfPnyRb5+\/Srl5eWPgns86+\/v\nl5WVFfn586esr68bP6Jwb2+vt6+vL\/gtcF7gUA6DA4WvmpqaDBSTAlBZWWlgv337JlVVVVJdXf0o\nuMcz3mlpaZHx8XGjKJYYHBzEm882jC4kWG3yMrRChZBS4HZ3d01qMPrExISBAayiosJMyOSkGN\/h\nucbGRrOAp8Gz+vp6403eB0zTKkNDQ0I18BeGtLPr1c8fXoO7Bw6vsdrJyUljcNSyYCgDFEBsjNbW\nVlEPSUdHh3R2dpro6uoyv9zjWVtbm1EQYN4HcHh42PiaKkCQJe3jfQanSoUokOfq6srAUS7wB4No\naTADox6psjuUe0wKRHd3N14yPqMfChFcc089Jj09PQYaYACBs2m2z1+EoymQqWvAsRmYkIEZBBVJ\nD+lENasAYAzKe6SKyfAW77MoG9yzaj1sCgPKHMDRl\/s6VseLnuMLgNfYqaSTdDCAnZjBGdTCoRrP\nWbX1EiDWCtQ8yo8NW6TxMLCAMjaAqEkmGF\/jURFX+4RERkZ6gigbNtildKYjnfzTDJRVjmcWnont\nRuLLYXc7wbX9xAEOKAr7Q1p\/kjn1v3N+fu7ouE5hYaFERUX5DCD1jQ62zrHSp2lmcBQjrRbcwgEA\nDJNQ46h1BBuAMal\/wKOohWSBZIEFs3DmIgvMQaZiYmIkIiLCjf+83HC73VJSUmLUAtL6xSpFZ2D8\nleAX5VBJDwgGSr8WZkfyOcQ6jAU0ivLZYwwWhmetiijIXADzPzc3VzS99+Hh4cEoGKpg9wDawG8Z\nGRmSl5dnUouKgFsg1ACKa6ueVR84PoN8pzlIAGwPEPRjgQCyaLvLgbWbhY+AphbAvz1ZXFwc5g9Y\nUFAgHz9+NC8itT7\/XRNJE0qQNqD8w19B4jUFGQfIp5sHYZjPbI6nraioKFjhXBpOWlqaA5x\/JCUl\nGXiURDnrOaDsAYK02tQCChzPST9BHwJQFsquB5bFU\/xjY2NfhnupKVRIfHy8By8AqNeSnp4uOTk5\npiaSKlREHUAA5OhFajknco2KgP7pnEh6sdKztP6blpycHKeAHQySkpJiQPPz883usyqimv850Z4b\nbZqtkiwK\/5JSrPMA5jEb4r82bJCYmPj5r6QkX3R0tCQkJBhYvjSA2nMiRZ\/fp6dt1KZiZGdnW+v4\nNMLe5SCruzwkNTXV8zDJI7\/GxcVJVlaWZGZmmqAifPr06fdzVcz75nS+peFXiqr+On8K3tEIDQq0\nQAu0QAu0f9x+AcZbpS7DbsgOAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_platinumium_spork_piece2-1348253044.swf",
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

log.info("artifact_platinumium_spork_piece2.js LOADED");

// generated ok 2012-10-12 17:13:32 by martlume
