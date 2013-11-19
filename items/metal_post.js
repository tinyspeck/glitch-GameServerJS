//#include include/takeable.js

var label = "Metal Bar";
var version = "1347906481";
var name_single = "Metal Bar";
var name_plural = "Metal Bars";
var article = "a";
var description = "A post made of metal. Good for arduous construction, securing Mineshafts, and doing daring dances on while people tuck herbs into your elasticated pants (probably not all at the same time).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 8;
var base_cost = 400;
var input_for = [262,264,269,282,283,284,285,286,287,297,300,301,302];
var parent_classes = ["metal_post", "takeable"];
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a>."]);
	if (pc && !pc.skills_has("metalwork_1")) out.push([2, "You need to learn <a href=\"\/skills\/126\/\" glitch=\"skill|metalwork_1\">Metalworking<\/a> to use a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a>."]);
	return out;
}

var tags = [
	"metalproduct",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-13,"w":51,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEcElEQVR42u2Xy1JaaRDHfQMfIY\/A\nItsYwPsdUZCLwBEdR42ZMWUq40xSSuIN0CDGigtXaOSOcIDDQRCFmsluxirmDXwEHqGn+4gEhGRm\n85FZ8FV9+1919\/\/\/725ra73Wa702QcjIItGE7eXL1YJarVb9L6Aur35fFtNZno8LpXA4BsvLKzA2\nNo5ffavVatu\/G1ju5qY9k70uCKkMxPgkfDoLwMLiUhmu8j3fBS6f\/yxLX+SKyWQazqMJ8Jx4YX7h\n2UM4UKnUgK3mmtvS\/B\/ylHhZiidECEd4OD31gVarr4OjPzw8Cv39g6BU9sqaApe9KnApMYstFSAU\nioJr\/wNMTZmxShN1lRscHJbgenv7QaHoKjCHy2SuPUnhAqKxBFYuDgcfPsLEhBbGxzV1gENDI1Vw\nysLjx93sxJLL3bSL6ctCAlsaOY8jYBLW1t5KcI0AR0fHKnBPnyrYiiSTz8uwpUW0EAihhQQCEVha\n+hk0mskyoKYGkOAGBoagu7uX4JbZiuEyL08K6RJVLBA8h5NTL7x4sYKC0DUEvK9cGY6tctPZKy5B\nFoIt9WPVyEo4bhomJ3U1gARHf2REJcF1dfWUnjxRslWsKF56+HgKhRCDICrV4zkDnc6AcPo6QKrc\nvSA6O7uLTOFyuVx7MpUpUCoQGM+nJKXq9caGgDRzNG99fQOk1CJTpWYyeRmqtEitpJaGwlGwO\/bA\nYDA2AJxsslIRLh5PlSKYCj5\/CNBSYGXlFRiNU2VAQwVQo9FWWkpi6OhQuJnCpVJZTkoFrNiZNwjx\nuAizsz8gnAnhagEpHQjsLrq62CsVg95NqUAW4veHcRvxI9wcRpepBlCn01eqVp63UkeHUs5UDFgp\nnlLBh2BRnLujo2Mwmy1gMplrAKmtQ0PD1fPG1kZE8foRWkiRFkuvLyhFl9P5HuG4OkBqa\/W8IRxb\npdI6ji0tBUPn0nJJNvLql1\/BYuEkQJPpCyApt8rfSAw8U7hEIs3dp4LXF4JYTID5+QUpHR4C0tzd\nw5EYEI6tjWBL3ZQKBHaGlTv95IPp6Rn81ipAiwRI1kJwJAa5XMk28EkMUV7gabEkMII8PDwCq\/UO\n7iEgzR3BlXe4ElMbEUXxEQqgGAhGsGJ+VGoSduxOmJmZ\/Sog+VxTlCoIggxToUSpQMcM3Q6rq79J\ncNWAHPcFkOB6evqwrQq2gR+LpThKBTJfOgf\/\/OtvWFx8VoFrBIj3a3Ns5OTE66ZqXVxcAR02tDLR\nDbGPh01jwGlpIylnKvv79eDwo9u1fwC7ey6w23dhc2sH3r7bBLf7EJ4\/\/6kGkGaOlkzyOKycrSkn\noeP4uH3vvbvocO7B9o4DNja2Yd32Dt68WYfNzZ0KIPlc0wK\/DtLlktkdu7C1ZZeqR9fX69dr+Ndx\nFpekzeQu8DvZBv633rbdadvY3Jaur7m5Razaj9K3WuektmLVbpnfDf\/2LBbrrdlsBfoGgxmD34jH\njZbWdbZK\/a9PrdbKMRlsRqPFptHoVCbTjKyt9VqP7fsHqkQMI4docksAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/metal_post-1332882594.swf",
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
	"metalproduct",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("metal_post.js LOADED");

// generated ok 2012-09-17 11:28:01 by martlume
