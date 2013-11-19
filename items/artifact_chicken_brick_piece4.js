//#include include/takeable.js

var label = "Piece of Chicken-Shaped Brick";
var version = "1350087092";
var name_single = "Piece of Chicken-Shaped Brick";
var name_plural = "Pieces of Chicken-Shaped Brick";
var article = "a";
var description = "A piece of brick that resembles one fifth of a chicken and is warm to the touch. All of them will likely combine to make a whole fowl.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_chicken_brick_piece4", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1312\/\" glitch=\"item|artifact_chicken_brick\">Chicken-Shaped Brick<\/a> artifact."]);
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
		'position': {"x":-15,"y":-19,"w":30,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF0ElEQVR42u1YiVJTSRTNH\/gJCmKC\nIIQkkJCQjVUQZItsCRAICYuyCCq4DESCgCxC6SAiAnG3RmcGa5YaylnyCXxCPiGfcOeeDi+8AMNY\njoxlVbrqVPJeOunT5557+oFCkRiJkRiJ8fWPDa+las6VG1xqM23POvXbdxqyQ+OOLPcXJfW4U3ds\nvdPqX+u0hvmVmBzdbcqhMYeG+svOUF\/pmfBCi9H2xYit+6yRh+0mWmzJpenGHGLVaKJeR8Pn1XSz\nWkOPO8wE4ms+S2hnI0ev6HqXWb3ms25j4eX2PFZMT3MuPT1wG4WCILzqtQhiwJzLIO5J11B7rcN0\n\/JMWX26PlmOoJF09UpR8TLrPXhoI1Ok2uXyhhRZDBIoB87w4SEqLAw\/5WsK3TBgE7zUbxHt8Z4Ex\nVZfzcWX\/c77jeGjGszjfZg2v+sz0yGOiyXotteen0gB76PYFbQxRpQwxLOwsJl3De4E6bdx39mK0\nVkMXS9Kp2arcrtPtCrBv\/DxSoWZim6FZD21NuOg+lyfYbaEnPosgWJubQhU5J+kaewk\/zOrFkdsL\n+A8E79Rnc2Nk8OYy6GqFmrqL0wVarKr9sCiDB5LjBdmsFvow4aQ\/pt30oreIlcujN335wtQSwSp9\nCj3ptvPi2UKZwwj+GyYbcugGNw1IS+99hWnksirjm2bDZ7HBJ5D63VAJvRksi3kHBFc68gTB86ze\nss9OP92opI0uiyA4yR16GAnOPppiJacOmAd7QGE5ZpyiuSLzTs1uw7y\/5QiCDMz98pKdgl275n7V\nGyUY4JKO1Oppa7yR3l0upBn+seFKdcxHiBGQlQMWkD6\/s3MPREGEs5C8haepzZ4q\/AfA3xI4L7cF\nudCcxw\/Pvb1aLogBz3pscR0IgsteG\/0+2Uw\/XCkhWOHyuQwaKs+kKxWZ1MM\/7uXSAE6LikukIm\/B\naUGiuziNOovS6NLZdAEENb4rh\/RZF89DI8KLzVZVWIFORTP8MuqgX0dr6VV\/sVAHZZUTfD1QHCP3\ndqBAKDF+IRq4jzxmchhPUZkumcqzk8ltSxWksCAWHzyHxsjkzURfD4JEFHOv8DyQbLYoNxW\/BVwR\nOZGn3TZBECRWePFVr5m9ZqUXF+2i9MDDNiOXSUcrnmjIIoRRKhBsyFPuU+fa+Uzy8xE3xv4+LGrk\nkQP1OXL8iq1AU5zn+OgR1yjxrRqNKOHtCzqRa9ETwsTey6bXvXZBHBu4XpUl5lTqT6Is+wiOsE8H\n99yDwiij26YS5YdNblVnCQzzhjysYKtFVaX4EHBG5CWF1\/CKhQdZatF9jMUWIz1gpZ5eKqTvr5XT\n0x67mDPZqKfljujx1VeWyf5TxikH9HKpQQKqoHRA647HmsynQnXGXTiMKREHR1m96RQ1m5VqxV8z\n7SEQBNbZ+A9aDYLkOCsyzT5DyQG5DSQgI\/H67GK+UH3GaaBqQ0qMILwEYlIAu8zKMC8cbDCdrDrs\ntCjRJKlLtcnBIsxBBz\/ncn7XXyCw5OZz1JlN39Rk0QYTQ6Qg81735h9IEmWWNrjYahQ+RJl97EkX\nqwng+BJqfMr48UaNW15a4B4TvF6lZh\/uLr7RZT2QoDzMJYIxaJMipboT\/+0xCieIlH33WwxCPWCi\nTiM89oI9F9xDDpuR8Jw\/fz98LhrcXGI5waLDDv2PHfgRLIqHAXSoRNDvyNqnEHwmdfJsk07MA0kp\nBeBbuXqf7UFzrkkXlogBCGBEzD+VE49efs4qzL3fmiueeHBEInAlgjD5ZyM4VHHGP1abFVPlZrVa\ndOECP0wutRljgAXu7WxipDKTw1orADvg+7iHLi7VJoU\/S3nlgwkF5UGKM1ROei9ABjaQrqf4SafR\nrBSlRUwcyd8Ug2UZNrc9NYyYgBIIXZynCFvEzt3GKNkAWwD3sAmELo43nMFHSk4+zupODGAxeUfi\nQRUQRGT3Uc5SXVIoFqz\/94AiZZoTtijp5EVBZocQ7if+LZEYiZEYX\/n4G\/IhUzhJesY1AAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_chicken_brick_piece4-1348197925.swf",
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

log.info("artifact_chicken_brick_piece4.js LOADED");

// generated ok 2012-10-12 17:11:32 by martlume
