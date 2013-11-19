//#include include/takeable.js

var label = "Essence of Rookswort";
var version = "1348002530";
var name_single = "Essence of Rookswort";
var name_plural = "Essences of Rookswort";
var article = "an";
var description = "Distilled Rookswort harnesses the power of the ancients for ultra-absorbent protection during those heavy rook attacks.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 509;
var input_for = [237,243,247,311];
var parent_classes = ["essence_of_rookswort", "tincture_base", "takeable"];
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

verbs.imbibe = { // defined by essence_of_rookswort
	"name"				: "imbibe",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drink to gird your loins (and other bits) for battle with the Rook",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You are too dead for that now."};
		}
		if (pc.buffs_has('rook_armor')) return {state: 'disabled', reason: 'You are already under the effects of '+this.name_single+'.'};
		if (!pc.location.isRooked()) return {state: 'disabled', reason: 'Maybe you should save this for a Rook attack.'};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity("Your loins are now exceptionally girded. You will lose less energy and mood from doing battle with the Rook.");
		pc.buffs_apply('rook_armor');
		this.apiDelete();
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Imbibing this will give you the Rook Armor buff (prevents mood loss and lessens energy loss during Rook attacks)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	if (pc && !pc.skills_has("tincturing_1")) out.push([2, "You need to learn <a href=\"\/skills\/132\/\" glitch=\"skill|tincturing_1\">Tincturing<\/a> to use a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	return out;
}

var tags = [
	"tincture",
	"tinctures_potions",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-39,"w":17,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHZ0lEQVR42sXY2VNTWR4HcP8DX6Zm\nnqaYmoexS7tbHZe2tbtZBQVBCGFpFNlEQREEWYQGAgSUTXAcZA+EJWHfZU3CBWICCUvYwtoSFhFU\ndrQbne76zuHWNC1l9zzM1A236ls3SeXhk9+555zfyb59\/+NVmMjSEcbZOiUFmSencSwpQZwNVfRB\neFwrqijBluPnqn94315c5Q\/tUfbAHkXxtnQK7rPB47J23mdHsZAVaYV4PxO4WB3V1TpQkMhWFSXZ\noC71MgRxbOTHWIMfzUJGmAVyo6yQfNcUgVd1YWtyCKWxNvu1DixMZFPh3meRG8sCnyQ9whyJ\/iZI\nuGOCiBv68Hf6EneufLldPezJEBc+YCfnx7NBoLjjboCwW8Y0MsH\/HJICTRF7+ywN9LQ7sbonwDSu\nBUfwgI37AeeRc4+F7BgWChKskRp+AXF+xgjx0Ien7XFc0DtAaR0n6unZX1uVUZVzz5JGbUO3kxfH\nQkqoGQ0MdD5NA52\/NdDwWqWHtYp79nxeNT7aC46HHnnmjPHP78yQEWmBGF9j+hmMuWVID6\/zxSPg\nPoxGxbB6Nb21VTvIFqVSd2ltDesbaygXpCLwuhkCXM7Q8XU8hZt2J+Bo\/jncLxsiJMwbTQN9aJjS\nIE1CcbRYweer73\/+Ge9++gmb799D2tUBsYxCQ4cYNW0tKG9tQuf8Ap7OzaP\/1SvUjY4jtbVVe2th\nk0Jx+MXKCvVmawtrJPObb6BZW8f4ygqGXi+hZ\/ElDWybniWZ1uTJZBf3ZCaPz8xSaz\/+iJdv3mL6\nP8DBV6\/RvbCIjpk5dJKkSCQ6+\/bqerm8rPoXGeo3795hbmMTEyurGCDArhcLoGbn0Lf4Cumi1r2p\nnnR8\/PDy+jq2gZu\/A9y+lw+NVGWIRNrb6uplfTpDmunclR9+wPLGBt5vT5TfATZrpiGaokOew66L\nWpkcE3PPV7fevsX6yACWxU+wJKnHkkqJGTJ7x+srMVxTil4hD10PuRi87YqBuzegUsrRTKC8dimz\nS41IoeBM8tOwIRVhrbkKi+V8LJbkYJ73D8ykxOLZ\/WCMBXti9KYdehyMoHKxwPANe2gSORjjBqKo\ntoZiHDhw9yY0Xg6Yjw\/Fi8exWCxIwxzZLZ5F+WPM3w2jfq4kLhjxuQK11yWoPe2g9rDHgOUZVBby\nmQeKyJBN+rlh6JIJJq7ZYOqOK74PuIoJXyd02+ljkvyAUR9HjNxyxKCTOQbtDKEgOKWHHXJbmpkH\nUgFuGC\/jQxF+G03O5uh0Y2HC\/zomAn7NJMmQtxNqLE+j7tI5VLL1kWd4CFm5mcz2hs1diipFXCDm\nZNVQl6aj2dMWZef\/jgqz46i8cBKV5idRQVJ+4QRKTI9BeP4o6jwsIA5zoYG5hXymgV0U5WuDtecS\nLEzWYaw9C30VsVCWRKNLGAF5IQdyQQQU5DO1Ig+TqmLMjdZgvDkdfMNPwRfmMQ\/sTfbdAU4NlmKs\npwCDch5UHenooR6jtz0NKmnmLuALdS0KTY6AFx\/JPHAoMxRLY7X4vjoe6hIu+gXh6Ben\/Ffga40I\nDRZfICcqiFmgUq2mhrPD6QrKHU5BdGQ\/HYnBX9BxzQCU9RFQ7KNoI2m3PYbOm+cw2fiIBo7e9Qaf\nGwxGG9f+8QlqJIezM8RS+xM7SLHpH3de\/5LeOPedClZafYW86O+Y7Qu3gQuygh1gVykLVPqhnUiC\n\/grJ1T+jw1cXQ1TariEW+9iSs7MWgIsfAOVC013AX9JZ4frRM9ge7IT8e6HMAuXdytVF+a9AZYXD\nbwKV9UEfAaUhLhAmRjILbKsuI51LOQ3sEyUg1vkPeJL4t124itiDaK+K+E1gcRIXqWLKiTGgorEG\nW0tyGtiQ7YaskFNozHVHfogOnWSPP+GRzyFkh379EXAwJxJFD6KYPd11NdRgc1aya6Fuyr8FXtg3\nUIqSaVzFY0cI4izQT9bFD4EDPAJMZBxYDVVyCJYnW3aAg7JMtJaF0At1cRIbouLAXQv1tIp8Jz8a\nNd8aoPRRLLPAEdK6y8K88DTQHUNZ9zFWnQp1Qwr6a5PQUxIDRRGX3pe7S+9BmRGMjjA3NDgao4r1\nFZ6Q5rWdjACjk6RnZKxqoVeOZ9VCKKJ8IQt0Q4e7JaRXzkF82RiSS8YQk7Q4nEWjvQHqbHRRbXUG\n5WSbE5OesUYiZvYY2qxQOM0qpZioLMQw7yGeetlBQVr7rdkZtNjqoclWH412eqhn66Le4iRE7G\/o\n9quYtF5NwR7Ilys0jO7Fkr4+nUFZOw3sz0xCJalMvRFZVkilas2\/QI3VabpJFRt9AiWp4nJdJbqu\nslBg9Bmq4sORIWlLZvxkp9ZMqzrjQtAe4omm69YoMTmKUtK0lpkdQxmpVClJs9EBSM2PY8jLESJr\nsgeTXrCoTIhsiYz5fxm2z8UDSjnVGu4NZVIEOsi98RoL5aRyQuPPITj7GZ1yvQMo1v8EBQYHURzp\nr51z8YdX39SUTneFgDNYJcgVc\/1XReE+aAi6jmrvyyg0+pQq1D8oLvNy4Agjg\/+vWftv77ykd9E4\nvtMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/essence_of_rookswort-1334274031.swf",
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
	"tincture",
	"tinctures_potions",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "imbibe"
};

log.info("essence_of_rookswort.js LOADED");

// generated ok 2012-09-18 14:08:50 by tim
