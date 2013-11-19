//#include include/takeable.js

var label = "Desire";
var version = "1337965214";
var name_single = "Desire";
var name_plural = "Desires";
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
var parent_classes = ["mental_desire", "mental_item_base", "takeable"];
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
		'position': {"x":-22,"y":-43,"w":44,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJFUlEQVR42sVYCVcTWRr1H3hmelxY\nA2ExbJIQdoGIoGwhYZFFtggI3SASFIV2ocM4js6cOW3sffrMOHEDQhIpFAhhLVxAUSTQI7QIISic\nGZfTnZ9w51WpjCgRsBv7nfNOJalK1X3fvd\/9vldr1vwGY7oynmOulMjMlVLKVCmlTfsTaVMFmfsS\nldNlYt81v+UwVycpzZ8m4+HBeIxViDBesZVMER4eS8b9snBMlcfDVCZWfPioHU3hzBxJNj4+lY\/H\nKgWedKrwzHAWs5o\/42nHPzCn+ysmlIUYKhFiYl8MpsrE8g8G7ufqtLUzR1OM038rwvP+Zvw0ZMDP\nd1rxU78Wz3vP4UnLGcw2KPBQuRsj1VEY3OOL6YpEi6k4eu0HATd1OMk4fiIPc+0qPOmtx7O+Bjyn\nL+F59z\/xrP1L\/FdTiweK7RiRC0gEN+NWoRfG9m6DqTxRueoAJ6sTlUMHxZi8eAozujOYu\/IN\/tP6\nLZ60fYWnLZ9j7tw+mE7GYqwqYAHAoaJAmCokxlUFN1uTLLpTFIrhEwX48dsqTKo+w9TZapi+l2NO\nfRyP\/yWHWZmOiZpw3K\/0h3GfAHc\/9sFAvidu5wswfUCCVQU4tj\/WrJdwMSDfgZGTBRgsj8DtIm\/c\n2+uL8dpY3D\/oz0aOOd4uiUBLZhH0mafQmy1C3y53TFdKVw\/gXE2y72BBMPRiDgYqYjFQGoYbuTyW\nvrufbMZwGZ+ldLTCjz125EigSbqI4VI9urNKcDPHG+bKJMuqAXx0LEXRneoBJoK0LAA96a64lr0J\n\/bs90ScLQZ34DDpzdOjK3c\/qbqBQCMOu7TBkRKM7w5tQ7A\/zoSRq1QDOHEulqChbtMQ5oF3ijK5U\nF9CZbmwUe7ODCMBzuFHYDDqvALf3eLO6u5HHQ1+WO7rTXDFSIiIRTJatGsC7BVuMTZE2uBpjz9Lc\nkewMbYIEF+NPozVDjY5sLfS7GtGWeZ5ELRHXc3is7np3eaBrpxvMh1MwnCXgrAq4phB7kT7eFTrR\nRjRH272IYqIT\/r61GhfiVTBkaQmtbew0EKBUUil6M9zQk8lDTw7J5D0hmKwU\/\/r0Dhd6cHqS3FVX\nI51RH7AOmrANOBuRjibJcbTGOaIxJhrfRZ5Bg+Q8rqQ3sFMt+R6GZE82an0FoTAkucJUJcFAboBo\nWQ81iJ19jVUJxtHaTLTGuC9qnBM1gb7jhwLkpETRPak8+kqkk7HObz3UIeugDd+Apm22uLLDHg3R\n26CNz0N7ahEMmX9Bo7gWPblC9OYHo69YBL3UjQDzx7g8hl52VOgUnmJW\/Uc8PL0bjQH2qOfbQhNo\nj9btLvS1dJ5sqJi7oF52RXPX6kIdjfUCG9QFfAR16HpoIzaiKdIW34WXo1F6EbeKWnCX0Esl\/QmG\nnV6gi6OgT\/Zg5dAa52zpX4n22mK48pvZXrie6QldqIOljm8jvySwWfQG3cnuMnK9pVnkZGwMtJPV\nCdYb6wL\/AG2kA5oTeLgQIcL5yF3oLD2G3soa9JRI0CULQ1uyF7sARrNEFivvYi5vcVTqtjjQ9fyN\ni6b9nSKB6GauN02n8VSMJJjfmsMdVdpgB1wSrDfX+X8EjcgRVKw7msUe5OiGpigHFhAzGRkwelWH\nrlP9agkxXingTHwaqBir9KeMe\/my1yluj3VRXd3mZGna4ihTB9ip6gjdlwQbUOe\/DvUkog1Em4w+\nCSD2c0PwOnNdwO9\/ef93PcNTOljoS42UCakfqwIV00dDF1Ddn+XBoXduMnYkuikZoMykwjkWbZAD\n6gV2FoaBy6GOCm2gvYXRsjWpWB0a4l\/1go0Lpi7EUd4SxaU6Je7mvkwP+na+j3RxmjfLB2Te1I0M\n9\/k9RXssV0H+CyqCY7wcaMf+fjXKmW4K59BENiurs\/0pHpzh2nzcO3mAzdRXU0d0RGyDNsS7SK1R\n\/UOFkBoq4S\/QZw+5X5fUzWKIc6GYSM7bVoKrWR\/nKjKIXekVAXxwKk01q\/0c\/eWp8+Dq+LYWtb\/t\nosBM1cK1k0eCFROHg5TM57fkkO1F96V5KN+UCGNN1zI85P25XitLiInjMdTIgXB0JW16Cc6G1gh\/\nt+ieYLTMTzF+KJB6U4P\/p5svH9y9+a2d2a0CHxbw3WK+grnHyijO85T2pXtaWqO5LyJI9PfmNQM5\n3nKSJGZjKd9qxv2wP0A0WiZ86\/zwXgHnVbaPlvspTJ8Fr3xr2RbqzGGAqQXrF2yeO4lmepJ55muZ\nXvRggZfVjfVEdaDvg+qgRcGPHwyYp5volRo74P\/L9766YEfZla1OtD7WBZ0St3f61L8PCHwZTVpL\npMmakHmApFsmC928fICkhFGXwzi0WmhHqoWNkilnZJq1QfagwjjGlkjnd76OGC4RiEgmWxU9k+UM\nyHlGJG4W0vUsDyDxKdXIiT2Y01+AITVkgcWohbaUtUSZj0a2l4wxb2vn7+T7iIY+4S+wFOKLaCbM\nLAvgzaKteHSpFpOnZWD7uJfgGvi2S66QaQ4Y8x5K41pdxM0sT+Pr5s7o+5VLLAtgz04vy3B5MEbL\nhaB3eqBBwPrfkh7Vtp2rYky36x3gOhLcZb0pmyyvL4Apd688lpHSkgBJUVf1pPBYcPoYFxagta6F\nLYeEcl2IA00osrTssK7NLiF3bet2rsUQ77ZgsZSIax77shrXiuOYKJqXrr\/kgZogeyN56JLUMsCZ\nlTf62+FVbbV63yB7ijQKRDZOC\/y0U+punvk6n+zi\/Egw7Oj3thg131Y6oqxRPdJrLXdqyxYkz1LU\nMOfZJPO3f6shaNvmzLmR40mRjod+02+XPZg2qDVmE0wNX2C2VYV7x7KhCXJ4CdCGWooRJsrLufa9\nB9Oz9Wb64eE3+zFz9hBGDieim9ToF3sSG+W7Iqd52est1wnea1BhBGAqDyMHt2LqeCSGSwVgvjeF\ncazaAxP1zrQQPO3XY+yLqpfX2q7OuxUd2fB0iMkWMM8bpPMgRx8w39nO2EoEGYB9ucEwnzuCqa8\/\nBp3uQzRot3pvp6hwR6UhwY2ltoMcmyPYiBjfVVk6xO7mYfkW3CsRsP9rENjQa1ZzaALs5YznEe2x\nNXqpstcUbi\/qFLsZyfaAafMt752lr43\/Add0SNJN2U0uAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_desire-1312586136.swf",
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

log.info("mental_desire.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
