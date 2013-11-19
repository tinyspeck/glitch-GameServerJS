//#include include/takeable.js

var label = "Piece of Chicken-Shaped Brick";
var version = "1350087087";
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
var parent_classes = ["artifact_chicken_brick_piece3", "takeable"];
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
		'position': {"x":-16,"y":-24,"w":33,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHZklEQVR42u2YeVNTVxjG\/QZM\/2xd\nEgLITjb2LSCRLCwJhLBDTBQQBCI7CgqIC0Ir1tbugltLW22x02o7baf5CHwEPwIf4e37nNwTbhad\nqkz\/4s48c3NPLjm\/+7zLOZdDhw6Og+PgePvjnzW\/K7QWWIjTamDzz2vdoecLbaEXi20hfP5tuTt0\ntac6NOg0b\/8vcKGbfh+D0O+LrfT8UnOUfp1z09ZIDT0+VyWun861kr8mh7wladRUlEoOU\/Ku3Zwc\ncph061azLmn\/nVsJ6P9YaqenY1b6ZbaenpyviejH4AnaHKikDRbgnzBc\/8ls6qlMp46y45FzS0kq\nuQpTyGbWBvcV7q+V\/qTQqn\/np4naKDCph4MWutdfSduzLtqa8dByWwEttpjo9InMCODZk1l0zpZN\nA9Ys6uZrp1m3uy+gcO7vG76dZ9POKKgfglb6edJO3w1XC7iNwRp6NNVMo848AXfZYyKfJYPay9LI\nX51B5525Qv0M2Fl+XIghyW7W+t4a7kqTUf\/9mGMXYQXUo6EqAfPF6XLhGvLt\/tkqejrrpmtd5VSX\nr6OphjxaUOC6KsIQEg4arM0WDraWpon7kZs2g9b1xnDfnC7V3Our3EVubY1U0wMljLd7imlzxE4v\nljqEHo830IzLICZDfi23mmmmUS\/CCpcAIuGCjhwarg2HGmou5uLhBxAyJe+8UfGstOeHNoasAmqT\nXdoac9CtnhKeIJMBbXQ\/6KTVriK66MqjhoIUMYmvKoNWOwsF4BnOP+Sb2j0ABu05kWtAuov2IEWV\nG7UWaMyZ+2pXl7xGyxWviT4OsHsTDfRg1EaXmgwUsKSJ82KLkabrc2nMnk3+qnThBPJsscVMN9oL\nBOCICkQtFEtsTiLkalCHkhYXGvPWE+ee17QNQMCcZ4jhk5nkZ7gphsI4dLnZIL4HCBwcrM2hO74S\nWukooFmXXkw86ghDTtTl0mR9nhDGEX6c4aAExe+oIeH2ose4m9jBFuNLQMApuATIObc+AqfWBE\/a\nWZEuwJAOcBCFIie+6DaIqoaQn8ut+WI8wC4O1WYndNnDEQE8\/gbRTORgBEC6OP8KQABd8YZDC8Cr\nSpFgokkGvd1bHAG86y+jm\/wg8\/jNBGBSpziXfZZ0EQn+u4U4wFi3JutyRM7FwiHMH3KhoO3c8ZUK\nQBQJfhgTXWfoWz17gF\/yffIzwi2BerkltXFDlyGHu2hRgOyryQzFAU44ckJqkCFrJo3asoSbcgzh\nH3dk06enwmCYHOd1duxSszECKIsG0PheAsp7pFAoaFXIRRQSGjzUXZEeD8ghDalD3FedLiDRUuQ4\nCgah\/7qvQkwMoUhu95aIMMMhCYjP41won\/DDIA8lJPIThYR2hKJBcQAUwHBQtp7XAsKpU5VpAlDt\nIGAxJuGglY5CMTHA4BCWu2tt+TStFA0+IyUkIDTHkMMcWoQYQP1K78SYU6noeEBb1vaCxxiB6SlP\nFW4BVg2OcQkHJ68zgHpyqcsMqyR8QmEugKhXHUhC1xqT9VGAY7bMIDdJATJozRB9EIDqvETRdJWl\nRPIPxYBqnm8yUiv\/MHTBtddiMD7AWzCMwdE5VfsZr8sTIFgqvQzpVUAHlLBjGYwCnLHqkpB3WDkG\natIFnNpBPDG+AyDgELY1lswvJPqZmqw4pwDi4maMlaed12moi3OuXlkqsbnlqhVFIpu3R1mv7Sbd\nZmweUqzQbuAszsg\/aI3bypoCiBxEnqFpIw\/VDkJYUdDEz9nCD4AGL93uUvaMAFSHGatOo\/IAUftH\ntBUJNsI7EPW1FFxe4PxCH\/yWNxM43\/WXCkexYiAnl5QchFDNCG+ss\/7qTOqxZETyUfZIOAhA6SK2\nZhFAT6H2pa8iVVQwisFbpKXu8hRxLcfaipOpl+\/56kxFVDXj+lMGXee8RONG25lvMiQskFFHrpjc\nw+FFnsJdWfVo3ABEP5RrdGTvaDN84HIajpAr\/xi1l+gETKP5GNWbjlIDC5+bCzRCaAkbZ8M76yfT\nLno27w3vsnmb9lF3OPxLXEDqdTmRADjVoI8slX5lRVEDsvbeEO2Gw5sOhgSoO19DLYVaciifUSAB\ny3GRh6hyTP55oIzuD52gh8PWiJsyP9dE\/wuv0yimpdeAyl0PgLDpxcuWeisWVSzsVNCdf2wXcAiz\ndA6ACLMMudiO8dPDsc94U4B8hNSACPccVialEACrFpo7chCrDu5B7sFB8WrwKkAcnaXJms5S3Q6g\nEgnhh8sOw1HewGbQGE8AdSnb\/gs8OYpEOoSm7S5KEQDIMSmEFJWM5a+XrwFXXxANF9cT1Ud3ebKe\nXVxv5gJqZSi1PIUakunQUZYqtkzyR7FbgWNIfhSLbMwQNqmx2y28LuDBEsH9p\/cWq\/m9JIfh8Dpr\nxyGci1ed8SjVmzXk4kkQLvmS5Fc2qnhnxlKGM1xDzuG+Ni4I2fditP1O\/5EQ0MYjFoiLy2c3HFlQ\nFKpjNZo1uw4ju2zSCgHcW5ISFWKoKebd5K1fS\/fjcBrf18iHUgvjB\/+mOzgOjnc4\/gXtyfNCxIET\nmwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_chicken_brick_piece3-1348197914.swf",
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

log.info("artifact_chicken_brick_piece3.js LOADED");

// generated ok 2012-10-12 17:11:27 by martlume
