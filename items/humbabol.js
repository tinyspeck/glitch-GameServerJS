//#include include/takeable.js

var label = "Humbabol";
var version = "1338860323";
var name_single = "Humbabol";
var name_plural = "Humbabol";
var article = "a";
var description = "A compound made out of blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 5.7;
var input_for = [162,163,165,167];
var parent_classes = ["humbabol", "compound_base", "takeable"];
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
		'position': {"x":-10,"y":-21,"w":20,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAII0lEQVR42sWY+28bVRbHhwWxCMS2\nK5YFLQvRan\/Z3\/oLP\/Cb\/4T+BQtCKwSrahWpC1vQPrxdHqIhxUg8RF+4dCltaJNxk+addNK4jT1+\njePYjp2xPbHj+JHYHsdJmldXZ8+5ziQe2w1xEmCkK0WR58znnnPuOed7Oe5HfNo9saZOh2zodsvG\nPm+E98YzgqIuGrif8vnOFT103R5svi4GJd4Rgi73FPR6IzDki0E4nQclV4TJVE7yJDJHf3S4To9s\nsDhCCoExOBfCSTIMItztYJzBaSs2r0I4leOjhcKhHY0O4o7dStqo5BeM0XnVGErlm8NZ9cheAHuk\nCN8rRaDHI0M3rh6E60fvDU\/EwBmd1QFqC78pxQorTXUNdjhDR296ZNUZTelemimUID5flBoF5MVJ\nIMDqRZDj8Swsrq7VXaWVdfX8sKepyljIhOFg+WGbSkKisABzi8twb30D1u\/\/DwqL9+DsgGPXCX1m\n0HWom\/KtCm5gPAp3QgkIZ\/LMPtmuXkq2oP9WlzNsvOEMw81Ng9bJBOSW7tW8eK5fNO4W8Gyfvbka\njg4GwYlyEmSEoOgsrKzWfMclz+gBcadCpSHrZBwicwXmRfXetoEzfXZ+t4C0mUqbtyYUBmdHOFds\nO4Wm88WtKGmrXwpDda4Yt3cZhbGpGTr6W0aSaonlRpcjoO46xH12tuk+gvMrYEU4Sh3Kb8q\/yhwn\n+6sb9xnc6vp9uDzi0X\/nq0HnUQ2Qjr8oz0IgOaczcjugQMfYBDQCiMW4DIcRseGmCU6azkAwOV9z\nerOlJQaYKy0DpodZZ4xOzPUxPwz4yglMhiYS5V2KmA+9njAk8SS7oympAUDlyqgXOmx+BuiIzIJH\nSYMP7cqZfN0SQ+kUSGQIsLnGoHnAIXQ58RR7pmCQdo61ymL3g4g7z+KubOG4RCdz14ek16Z2Oibh\n2t0J+EbwQK87DD4MLXkvsnlAKldwdh69mwILbqhutTjTL75yddSrtKMnbyJoD57oa3d9VN2hzerl\nG4HTysz5fpFvs\/qYLd4WYLD90hQMjcuY6xEY8cdgLByHO5PT4EfP0rd4BNzR8Jd94pFzffajFwed\nCp5EcjfstdX9sWPG8HG3C8yDTrCIQQZadsAkhnOtZhF8Tf7t5AEMk0SAjXpPe168WuRf5RVoRUiy\n8+1tiXmR0kaDUuZUGPZFlEuC20TO4RoNE+UShb+R9579asXw3DdryvNXNuClNhX+1BEVPiRbmFt0\neNqs49DtCgkYdiNFa68O0DqCmUrGbn77WGuh6ZenC8LTn5XgmbPL8JuLq\/D85Q34\/bX7P9woRR3h\n\/IAD2m1+kys6K4QyedNEMqsPxYnCoZ\/\/LWF6\/J8pePLdLBw+lYOnTCo8\/XkJnj23DM99vQq\/vbIu\n\/K4dmg582Gy3B3ma5aiIBzYLLM1uWCoEMZYsg74mG7g\/R+CR43F47O0kPPGvNDz53hwcbsnDU58U\n4ddfLMIvThcU7v0cf6CAnc6wCcdzNs9RV4jnFljL09oStb5TFlF44URI4d6IAPfmDDz0ZgIe\/SuC\nvoOgxjQ8juvhd1LA\/XsOuFNF4UAB28cCW0OE4J9mI1Ll8NApBqDF4oCmt0PAAN9KAndyHrh3c\/Az\n9OZDx6LAHU8A9\/cMcO\/ngTOVDhbw8ohXIO8NYVehXqqNSNocR6WjLuDpEnBG9NhfFOBOzJb\/17IA\n3GfLBwv431tugQZMmkRc2J8rWxQ1dzrhLZ0Ow6+Oh401gCfnyt77B3rvgwJ6bxG4L1cPFhBblWCx\nUwcIw91QHOe4WfBOp8E\/kwUJZ7qtpv567Aj3ekTVAWKYt7z3EXlvBbgLG+YDBaQCenHYabo6Os76\nsz2cYIODN5ZSuhxB\/cRxLNbEvTXDbwF+kNd779MV8w9SB2mKply70C+aqPJ\/ry45OW\/gWhcU7kMV\nuP9seo9Wa+mVA\/cedRDWi3ttpoYNnFJNXEtRJbiHW4vwhy\/Shu3c9hzB8sWjDlI6HLKhocJML1ic\nIVOXK6yM4whkxVHohj2w51Z1+ON880vnEvDylUkmuCgSFkdZjlKFoCbQIYYEuhbZEQx\/2IzSk90C\nkMgm9S9vn1pVzuaN36v6H\/Aca\/ObPu2xkypUbmx2JW11b4p60uMo9OunwQ0U7OzH7vKPqWuQ9Jwt\nLupWqrgk1fThXTw0Rl3Afk4zYT0hT6WMai2tYZ9Sm069UlQnEUmJkTysp1m7xIBxL16kWfC7Oz4Q\nAtMwgovEFOlkguv3Uq2NM0FFUZPTqj4vr1p95kq4UVR24\/EM06xLa+tbcEsraw2Jd53mGXLyNKwO\nb8paG1tJ5gg3iql0cWmrCYTS8+aqjuEpa1hvWXba8UUSMZqw1oaDBE4xNGDuqSrg0EshttgD4MYi\n746lmcrzz5TlLQ0h1ELpbzlT0Ovir2+5VYIbCU6z3VFbC1UJd4L0Yidp5H6mWtpqI78TJSiBTVXI\nTwIkJ1ALZSqvMszofpbAowhI12IU3mppmF5YgluoxvYznpMQo+904oqiFqm0rwHSom8peXW7U10Y\ndEj0IknDPtTFY9jS3Ogtt5JiNwoeDAndNIz4o9J+ij\/lLylFYSLK7D4IkKKVKS7qh1vqFiSwqecS\nKElAuk0g5UX9l5TY5dtS836707U74yrZJZvUBLQwVwLS9Yc7mjTVzROsV2bKFQIkqJvOoMR0SfWF\n4j4gLw27eBLptHkS7gSpTeo+nJYuDbvNO6YSFVYmEfcjB3dxqq3BaYU8SfdAIxj2i0NOte69zE\/1\nkANoQqLrjgdF6f\/8mfVJXHlaHAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/humbabol-1334267272.swf",
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

log.info("humbabol.js LOADED");

// generated ok 2012-06-04 18:38:43 by kristi
