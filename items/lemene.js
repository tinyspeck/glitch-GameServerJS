//#include include/takeable.js

var label = "Lemene";
var version = "1338860407";
var name_single = "Lemene";
var name_plural = "Lemene";
var article = "a";
var description = "A compound made out of red, green, blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 4.7;
var input_for = [168,235];
var parent_classes = ["lemene", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-22,"w":21,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIqUlEQVR42s1YeVRTVxq\/M7ZjrVpC\nFhKyEEnrCiSBsCQQSxeP43h6is7MmU77RzP\/jO05o5M5LtNOW5tWW02tGBeqgmgcXKbSalyxovU5\nUMaKYFjKKuEpAdyQp7gNOp5v7vceSQHLoKeEzjvnOw8ed\/nd3\/fd3+9eCPmBx3xMYZt2Wu2YWa12\nTDutzCADPGOdHRmyz7rcqm133bp8CCPD8cR65Pb0b1QwuzEKXr80DmY1RIG1WGV4oOEbjczIt\/zw\n1MeXQbruOii33vFG7wZD6AF+GcE9W6yEjLooeLVVCy\/XaiDliIJVb5QystUvMqOXZjJkYT1D5pwF\nstAPjy\/yw9gll2A0jVHOq56QA5ywPQKSvoqEF06qYHq5Gp7\/lwqMe+WcAPAF95NLXQ4yv95N3mwC\nsvgSkI86gPypGcg7F4A4OXvIASo3SNhJ\/4iA+P0KSCyI5N8TdsjcfRrNbTaQeSyQJVeAOC4DeasN\nyLJOIGu7Q5\/i0U6RQbFOzGpzZaBzy0C7ScZqNsrY8Ozw7zfBAr+HzG\/xko87ObL4IgXawZG1t9xk\n2B5neNiYZaL0MStE6fizOkearlgXzzzxUZaW1p2DLPKnC+1uGsiHHTbiHKYd\/L8ekXOuffQSF\/fE\n4rz0nwSA6Wh42HPfqFwzKtTMrHoN85smDZNRq2boNxuyJ175mn3Uh+vsj793gCN\/rXGEU93T7Lzn\nGffFfdewyEtKYaTnxVMqXlZe9Wvh9cvj4JVzWnipWgNJhxXB+vrZou+YEX9rA8na6yDPuQWRW+6A\nKq8bonbe46Ly77tFuXe0IRFn89FImEYBZtRp4DWqf7Yr0fDKeQHgcyUqDhnGtiPfa7ePWXIRwpZf\ngfCVnSBZfQ2om4BsfReMXE4lx3l96KVmSr6cTabaR4HAzEoN\/Jq6yG+btTCrPgpmnFHDs0VKMB1U\n2MgbzYYR85rhF4taYNQ7bTD6\/Qu8SKObjHi7FcgHVHYyu4Z+N0\/cKehe6tdKXqB\/SQX6VxVqmF6m\n5kEju3qPwsE3RgeZ3wLk3Qvwcyoxj1G7o7oI5O12KtpXgay+6R1ygNFbZDBllxwSDih4MFNPKHnW\nrIyS2lwkGPcpgIq3APCPjV7yl\/NA3qcu8ul1Qazt5yjgi+gkQLJuw5ADjFwv8ei2ymDy53LQ75FD\nPAWacFDBsxq3Ww7IcPRmkaGHQRfvIpRB8sk1ICtoLPALjoKAN3YD2TbEu1qUKTJEZkk4dI+n\/x5B\nrS2CB4W+jMA12VIm2HhOk433Xkwp2tuqLsHqltIN4uriSM690OikaKVIK3OJvZFZUlBtoLFRCsr1\nUohYIwFJpuT7U8ocXxj5M+ulbiLU3JpbwkFh2VUvyQqBxPS3uKecIrvoE7FD9KnYMdYpyhCvEtvF\nmWJWvko4uD727mEXWdjAkgWtNnqaMRDXDQdZzrl+UrvDg4J+vcWlc73pePKDDQ7y\/\/gosoy2l91z\nvfPyV\/A1drTMF7a\/rIHxlNZ5PaX1cKC8EYrqzgPb0WULGQhdfngYlRbHjEq1gx71HS\/RO8nz9Liv\nzpa6VNkS25x8Z9iSvZ+znxUUMXtO1TKHvU1QcOYsHKJRWOWDuvYOCvBa6EAa9yvceILG+8gfOqLh\nd9SL06gWUoDBTZJdcNKW89W3sO90PSDAQJxsbIXLN25BS+f1HpDc0IJUUZ0z7FVAerFwYPh9i5a3\nPPTnuD2KPtKRW1jKBoAVVvr41Na2XYEb\/+6Gu\/+5D7fv3oPOm3fgZvcQnrAV66XpKNToHGh36MHT\nStWQdlxJAUr7ANxZVOE9UuGDEzXnoKTBD6VNbdB8hYO2azd4gBidN25DTmHp0GliOJWYcZtlEPOF\nHEyHFECPX\/SYFck7S\/R2UVDfcr8+o91VXAWeb2v4tJY1t\/PsCWm9FmTxRLWPyz5aNrTSI80UuzQ5\nUngmT3CT8dsi8E7ygPnnMeWu\/aV18GVJNXjZC+C73BkEiCwie9lHToVmo6BQSzMl9IopYaQuiYe+\n2dnzH7y45xWUeA7SjbLteDlUnr8YjDJfGxworWGHVQMlayQZm2ZPDP4LJDdWZ8+ZOd299VgZc8Tb\nCNzt7mA0UKnZ8U9vaO7H2Tpd2Ja4cekYCGJzrM6xKUbnyo19mllpjmbpGzDKzQlsp8nE1xduhP4x\n0Lg4Hu3voWNzp5PjufbU1EfzbgrGHQAxUOw2TgL\/VAu0ppkHrTFcJB3TG+i7Qz+ej61xz0DLVAv3\nSOB8Jl1YQcJk6B3FSbHBwN9xkkqziR88wGDgabUmG86mJUGF2QBVljiexUPxk9hjpil8f\/yO4TFO\npGPF0DHMj341qDDr3YGB+scuw4Qgez5rcp9\/EiHYFqvFi3+rMhuxPX9+RKDYtzE1EXxpSa4eVrka\nSyLgggL9m9KSmIoUA4ckDcoiHZCtppPgZH6rmT+5CDUpsHfeaqZvHjQTCDqBtzktBTD6s1hp1tuw\nPfYrSjR4ttMUt1jNwV2OpYJzfWeJp+PqBz8pVSfHGHCC+lSTAHKqBcExAfaQjR5WWWS8LjXBjd8x\nbUyiHoIsUkZwQozAooXFmYDtyQDPPC0X\/HbOmsKPW5s6efCNU5mit2NjmhZotqZwWNQ4CE5eYzY6\ncBG9JyhLSeDrMy9uvBt\/D7DYE4wAUu9GlvgFWIxcVUpcBtYhjot9kVUkhS7M85D1iAMb+JVhzeDA\n\/Qvbb7V4MK24ANytwjezozeLfcqHTo6M07cXwWJfTDnKD6Y6UD6B8hi8HukEwXqk0Vu3ArWDqXdT\nBkqSYtzIVFWK0dVAywABVAwwGY6NC8ey2KkfzwVqWahDoXweikVMQ6Aee7OHQDGVxUkGPj3HTTHc\nQLs\/sKP7Mm92BMpit3EC11\/eMPYYJzyclwu7UO9oTo0PsocbB9OOqf0hMUcxRlkKBDpJ7zHrzMm2\ngfoGY3L0j7sh7jNO5q2wxw7RgRiM3s4hhO5H+fJ\/AY4a99w1fgc3AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/lemene-1334267482.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("lemene.js LOADED");

// generated ok 2012-06-04 18:40:07 by kristi
