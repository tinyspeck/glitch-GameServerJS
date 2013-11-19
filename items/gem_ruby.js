//#include include/takeable.js

var label = "Modestly Sized Ruby";
var version = "1337965213";
var name_single = "Modestly Sized Ruby";
var name_plural = "Modestly Sized Rubies";
var article = "a";
var description = "A modestly sized ruby of nonetheless staggering beauty.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 700;
var input_for = [];
var parent_classes = ["gem_ruby", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gems"	// defined by takeable (overridden by gem_ruby)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/gem-collector\/\" glitch=\"external|\/achievements\/trophies\/gem-collector\/\">Gem Collector<\/a>"]);
	return out;
}

var tags = [
	"gem",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-26,"w":23,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHyklEQVR42u2YC1SUZRrH3\/F0FBxn\nmOHOWGJRoR4TNS9HLRO2I2tttHYyK3eXxVYYAxo3tbbVJJQ210TWIjdhC1RUTHGUi5cBwcuWF9TJ\njJSVBFGk1U28ezqa\/\/2\/73wgIS7j9ezu8TvndwbBc77f93+e93nfb4S4e929\/k+u3X0igh3GrrbV\nws9WJEzBd\/TmqK7r1trvT8THB1eNGGXbFNTdWdTBgnydXxMUdd4xWdQcDm+UPBuXEHY6LjHt0JAR\n1XssPbFZF4ANOn+so1RBM8EWstX5wjetQJjCbovgpYp\/jL+UkWU\/+9LY6mP9n0SV8UF8rQuCUxeI\nHeRzSm6kZDFZcw3JlrLzhdnrlsgdZRnP5K3a9+PKfBxvdy\/q23VGLalqZ8F+Sn5FdlFyGyW3kFJK\nrieFbYjGio7O6UJ\/c4meKVg77ET6xw0Xdu7G5T0VuPjRApxPmIrTL8Th2KORqDWF4gBFv6HkHrKT\nolsp6U7ZY0RHjBMdG25IUvbbOUdp8qlFSy6cLVqPc8WluFxXj8vJc\/DD4F\/iTEAYvmea35HDTPMg\nJSvJ9ZT9dxQcS16h5FtCH31dgkfGx0cfsSagkeppM3AydyUwaSoQNQYXO\/fFuXb34SSRZT\/arOz7\n2ii7XO2fdAhgep6yzFJQybot+U\/K1VPqKNkV9TyyLA8hO6Q3tr8+BZ+290fF4OGAdQIuU\/QHv0dw\nlpINlDxG6ihZQ5qXvVwr++77+8Le9REkGwIxUXSCVZOTouM0yYlCn\/Uf5Y5zfByzJuLrqFH4zPIw\nPhBemCOMSOfn5lcSMZefaWS+wYIvw5\/CRasNP4aPxAVjN5ymaMuyH\/TrjtrBP0fJ4J8hxRCANyg2\niUjBCRSK1cRcpfZUwlJyphBXr\/DvrYlZtWNiUBr6KLKFGX8TJnxMmXSNJT0GNgmmktlS3BCEHRQ9\nb30Nlyh6zhiKkx4P4FSvYaiPehGF\/R5Hcntvlq8T\/kCaC\/5e6JFAIWszyWhKjiXxQu9skkRsrNfh\nUb+2bwvtj1XCB8vJEuGNRRSUkh8RKSjTbCk4i8wkuaF9cIAPd5qix2OsFHsMKRR7WxgwhVxL0Eap\neE2ysR\/l6v4NJeM4ht6UK7wiqIezTPihWPhiDVlNwTyyjJKZbgqu6DkAmyOjsDxsIIqGROB9JptE\nsbYEJ5DXKCSTHE\/iXKNHS1Ml+i+xX\/jb97KJt3GFSdG1lOSkp6CZJXZPsCziKTiGDkcyZRYxzYJB\n4dch6JJMbJbmFVHPFaJaBEZXcqVVUPJLTbSUgtmqB9sWzPB\/AFuYXiYX1XTKzLjHjOKIEZjH1e++\noJ7\/7qgWjk1L9FVVco9o8Y0ICq6hYBXZR8GvyHbBXYAlzmWK89sQlOUtYXrvqzQpSDKDuyOfKbYl\nKHmDTCHy75P5OVGTTFR9qS2UWhHkPMSZ9S0l95ONTLCEfegga0mutqIbBedogqn3eKv0FltC+QAm\nNZL+TKE\/EVnmVPN9VwlO1phGZlBoOj+TyFTyliY8SaXpWdY0Yr4TAbZ6Ch4he5me7MUSShZTbh1Z\nwzQLiOzLTCXiEsxiWTcwvQz+7q\/8W7p6AKNKcx7l8vo\/\/hPBt4mUl8m\/pz2ITPwdTXgq5f6o0pRJ\netquHDxZZil4lHxBuY3C1YdScj1ZS7lCTXIV+UzNSS84BkUgz9KNI8mMT4kUnae1g0zT3nsQZlM0\nhTdPpYiUT9UeYKYmmELk4kpSD6CnqF6JThQePz3o1onA6krBvZNymzTBDcRBZIpFmuRqYpc\/G+5F\nef8nsFIJeyOHZGuz07W4vJDhEQBH7yFM1khpI\/5CpPhsrRWk5LtkukrRoFLUJJ1X7SQ1IiBtB8X+\nTjYLOXJ8lWSxSlGW2YeCPhxBrhS39hyIjeYQlbD8vV31qlkN+IXEtRuZsTokDAvNXfAhpeaSxhRn\naYKNZb6SotwG9WlXv\/Tw3aG4g8VZ2D5Q3WwFJZarvvPGUt4oR93cjAVkiQcPAEzP1at+TNiX5fdV\n4lLS9f9NyCKyZ5eF9Gq6+RS1GDrhTVVG14hJIK8SOaxfFp7O51qWt\/m1c3hU9KaB4Q0LDZ1Vqea1\nMmbyQvtinWdnJu3PlOUu5KeG+yIKfkK5bE1woepNE3L8Q\/COh2\/TKm45B6WgHM6jRQebW0euE9yf\nD4z6lf2L8BFYxhHSUtDB49cuOS\/J5\/LkTDm5hy8lUjJLE83RkElmcHC3Jhiv5p6++vUbOVkfeP7l\nZ2tixjXs5rlwMUfKXO2oVe7ZBXs5L8spWCIPoTrX9ujaw+Vhw4fpeTM9b9USiym4mG0xjSk2F5yk\nxo+Bx6ubeIGSaVY+M7qslgfYfWN+CwePY99qR3v57lGmjvXcw9X7hy\/715VmLskh2SpNk+rfdD7c\nZCUnh7OxYY4wRd+yV889j0XaDsXENpzggfYUOUnkz\/J4VRs1GjXkIKkIfxrl\/YZhe78nsJWs79oL\n+WwTO1nZpQdSuPvMFiZn6u14R5Zfb1QxTXnq3ho6oNW3tWydD9J05msjTDdXUnfTrGOaFeG\/cF9Q\nmG5tSdu6ttzfJ6wycqSzpWSrgrerpO5czn7DkvZHjkTjl0eNgnNJOuEcvXVfc9xMmuW9hzrXUHIp\nBTN1csSYGxYI07P\/Vd8R7np4QFKhlBS+zrw7\/R3h3et\/9fo3Q5UkiG1Sg14AAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gem_ruby-1334609703.swf",
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
	"gem",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("gem_ruby.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
