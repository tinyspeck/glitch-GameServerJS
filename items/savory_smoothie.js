//#include include/drink.js, include/takeable.js

var label = "Savory Smoothie";
var version = "1347677188";
var name_single = "Savory Smoothie";
var name_plural = "Savory Smoothies";
var article = "a";
var description = "A savory smoothie. It sticks to your ribs and doesn't let go.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 96;
var input_for = [];
var parent_classes = ["savory_smoothie", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "10",	// defined by drink (overridden by savory_smoothie)
	"drink_energy"	: "0",	// defined by drink
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by savory_smoothie
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood. Grants 'Savoring Experience'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("savoring_experience");
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Savoring Experience buff (periodic mood-booster, based on your current mood)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && pc.skills_has("blending_1") && !pc.making_recipe_is_known("59")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> a bit more."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-44,"w":20,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGtklEQVR42s2Ya0xTdxjG+bLFbzNb\njE5FVMDbLm7JTETmJItzQ6aAglwVFB1DiKAWnKADFeQiyGXUcisFsaIMaBGKjIuV1WpbSktpqRkU\nioDTbQ50qNk+PXv\/FRK2LMuSpQdP8uacnrY5vz7vvQ4OdjomTM1hj9QV8l81lbFWeVHsYIcg2dCQ\nk6yry1nrMNvHhLpq7W9DdzA5ogcBYqJXarseU5RCW3dOPuuA47pLTo80FXoGN9N+VomgrT834fCy\nHBOmJv0v2mqYmvLk3ZJzycy0kqzYlwaQufVeZxl0ddlOnD4YwFyyedOm1+vXaTSaTTPNommIfWxu\ngVVe1soZmE6nm2c2mw\/29\/dnjY6OptBZNDg4yGfXM43dG9M1mx71SGBSXmu1WCwHrFbrUrsDdnV1\n3SLFdv0XG++p0wzdKHo6\/Zp+WA2dX7EroNFoLNdqtTr2sGm1xsfHo6chhr6rih\/pao1m90Y0kp8M\nHWIr+yx9r95gMPDtrqDJZKp68ODBGZlM1ikSibro3MEerK8vVXQVn8SNXB4aso7iemn6hKK9Hr26\nO82Tk5NCgg8ZGBiI4ATwccflm4+vZuBhRjBUx3doH4jT462JH09aEjaiyc8JpV6OuJLggw7JN2jO\nO3zL0P5t1907rUcpBiM5AXxak2F5Js3HRFYo7setR3+4K3p2u6AzcJkNsIGsRXgCnVcycHnfOjSf\n5+HCfg+01YoEdgf80Xyz\/rng0MPnFYkYTg2C4aCbDVAVvByqkOW4QZCygx\/a1FMUHERjlDsaM2Mg\njPVEE5+nsDtgnzjV8ktWGH6vTMST3L14mOCBob0rMHRsI\/qPuqE1cDnqj3jiuiAeZfs2oCToHShK\nj6PmdBByY33t34NrMg\/DXHoET2rSMJ69B\/d5H0EZtBwKArtNKrb4L0WN7xJ8G0guT\/ZET3k0pDnR\nSN+znhvA2vRDky0nA6Dl89CdGgJLwR6MCUJtNnIhFEP8EOjOeKEtzh2Czxch128Vyng7kRb8ATeA\ndSkRhraTgdDz46FL2QV99HoYKEGMe1ygC3XGLVKzZRepuGMJSrctRv7OFSiO\/RxnAt7jBlByKsLQ\nGLkBvRfiYTwdgL6YF0kyQNZHkJoQZ3QELEP9ziUo374YhTtcIYjajBS\/tyE4Hs6Bi3k+Dc1fuqOP\nksB8OhADhzZgZN8KjEWshGWvK\/S7nXGTMpmVmkpvR\/B9nVEYsRFf+65CdUGKyO6A7cWp+dJAV5iL\nEvDDmUDco1j7+cBKPDqwCqMEaiIVmZsbCbDKhwB9liF\/9zoc+8wRorRDyXYHbC1IOiXZ6QRzYRws\nVAdHD7vjyRer8OzL1fiRVDSHuUBJ2Szzd8IlBujthPOB7yJhyyKo1Wr7A2o7Gn2lpE5vRrgN8D4B\nPo1cjT+i1uDh\/pW4G+ZqKzfTgIXbHJHpuwJfbV0GNiPaHZAa\/vvS4NXQfuX1FwUZ5EwFm\/xfuJgB\npnouRkbEx0xB+29zNJXMaeZ5T6riPNCfOhWD+1\/E4D2KQVZuFFMxeJGSJN9rIU5tWYDytFhwNlW3\nnY1sl4e9hbuUxZapLGYJwkoNq4VyymIWBhXei5G3dSGSP5mP2rIc7lbN27XlMawY6+K3wDyjDrIM\nVtPA0B6wFLVUqIVUB3M838SpbTRIqFTcbXI01y34Lt5n8vuwNeiZ6iS9ZN2kHnNvM\/XjK76OKN62\nCFmfvYnKs3GgXYbbrU7VVJ3dSioqw9+yqaYOedHmmHrS6RroRYDeVLjbroscuD5oL3lNnhWjaiMg\n1jmYtVOLY9lbM+VeFn9X805Y2WdnZSmnDc9Ptu8DXCclWUwyuDrqwUw9NskUBK3lpvb9a+srPGFk\ngwEzlhhigisj9Vh5qc6Im\/0\/iTqbasOuBKzEZQJjyjHXstg77+uCtnqx96wDsviq4e2wgZVQ1jI4\nVlouRG15ef7BEvP85IUEVkBuzSa4tE8XoCwpfPbdS4v7HLFYvFmcmdB5jsAyqealEtxJ6hyXBRmd\n6enpLrMCJpfL5\/T09MRIpVKeUCgMv1qcLTm73Rkp1HNPbJ6PRJpcxEXZEvZecXHx9urq6oWcwanV\n7W9QJ1GNjo5CoVAck8lk4S0tLVF0LZlp7B57j5lSqUzSaO5s5gRQIsqd26X8vo4BDg8Pm\/V6\/Rfd\n3d3h\/2TU3qKMRmNSn8n0TW1FyS7OVPR3c3v9Ej\/vgKKjrfqe1VoyNjaW9HcbGRmRDQ8NdivbW\/lx\noT4e\/mvWvMp5LIZ6uLl8HRXhJczNPH1NfDF\/ptVVChPPHo7a5O+xbsH\/fc6f1jsSa3Sbx9UAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/savory_smoothie-1334209181.swf",
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
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("savory_smoothie.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
