//#include include/takeable.js

var label = "Essence of Hairball";
var version = "1348002530";
var name_single = "Essence of Hairball";
var name_plural = "Essences of Hairball";
var article = "an";
var description = "All the speed-giving power of the Hairball Flower, scraped from the individual hairball ball-hairs, and concentrated into a tincture.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 449;
var input_for = [241,246,248,311,313];
var parent_classes = ["essence_of_hairball", "tincture_base", "takeable"];
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

verbs.imbibe = { // defined by essence_of_hairball
	"name"				: "imbibe",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drink to run dangerously fast",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You are too dead for that now."};
		}
		if (pc.get_location().is_game) return {state:'disabled', reason: 'You\'re playing a game. No cheating!'};

		if (pc.buffs_has('hairball_dash')) return {state: 'disabled', reason: 'You are already under the effects of '+this.name_single+'.'};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity("You feel exceptionally speedy, and ready to run with alacrity. Also—weird aftertaste.");
		pc.buffs_apply('hairball_dash');
		this.apiDelete();
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Imbibing this will give you the Hairball Dash buff (drastically increase your speed for 1 minute with some energy loss)."]);

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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHpElEQVR42sXYWU9b6RkH8HyDfIRc\n9qJSo6k6o45aKVGnbTpbQoNZJkNCIZQ1BMK+GBsbjI0XwDHeMMaAcdi3EBvwdowJYIyDWULCbgIB\nkoEGCB1NMpnRv69PFVTUXI104Eivju0b\/\/R\/zvOe55wzZ37h0SS9eu5eeXh0syScaxSyuM3iMENz\neRjVIGRRwXO9INSg4lyOPnNaR3tFBNplkdAWh0BfchUGQSg05HOzOJxetfyr9FnF\/hoxf\/\/owokD\nTVKWv0vxDcya6wQagVZJBA0yloWig8Cr2ZeRHXcR17\/+DdpEYWdPHNgkZVElGX+DThACoyQUKs5X\nkGReohcv5U\/IjfkD7kT9PpgeTqXETTJWZa3gKsGxkJ\/8ZxSl\/oWk9iXEBCjN\/hyC1M+QeeNTJEV8\nvHcqQIMwhGuSsSDO+wKq4itQcv6bpKLwSzrFouTPkBL5Mb66+CvqVICdxhJuXVkInWAQGlxBYDBF\n4Z2\/Ijf2j0gK\/x2uXfnEr7X5Tu4atPl8Z+dWVqiFp4\/ATbwIadYlaHmXUVt6BRU5n9PpvS9vbMhH\nKKkqRfv0TEDjdJ4\/EaDV672wu7+Pg9f70MmLSBk\/QXHSRRoVBGdFf0onF37p12B98Vv0jg3DshqA\n2kFxTwTomJw8t769vffu55\/x9qefcPjjjxj2uGEfoWBx29HrsqLDOYAWWz8ebmxiZmcH5oVFkASv\nnFiZZxcWzr\/c2\/e\/efcO+2\/eYPPw3wjsH2Dh1SvM7uzC9+Ilxja3MbT+HCPr64FWv\/907iirW1vU\ny4MDrL3aw7OD1zRw5rsdTGy\/wEOCo+YXobXZzp45rWNrd5cKlvp7Uubnrw+xSKDTBOjZ2ga1voFJ\nkqTK6rxwKrg20s3\/Ium9B258ABgss9E7UXeiMPPI5LnZwJph5\/AQO6Sbg8DDt28\/COxfWoF1dQ22\ntWeBhhEP800yMD5+fnHj+d73P\/yAzc1VLD0ZwcrKNLZfrGJ5bQZz6wvwPp2Aw2tHj70D90wyGJur\nMDQ3hf6VAPRDw8xuNbbxce7UrA\/LC5OYf+zBzKQTc9NOPJ62k88D8I13w001oa9HgUYdBy0NPNTV\n8tHTrUdn3z3oXS6KcWBTgwztjSLYzXXwjT3A3IwLY0OtGHY2wmU3wDZQiwf3Vehqr4KpqRx1Oh7U\nSi4ExYnQdjUzDzQaRGit48KgykcHAfT3VMMxUAe7RQ+jNhcjZjF62qRouSdFjaoQcnE6pKUJqFdm\nwjjiZh4or+DDOzqIzkY+mmvz0dtUhCZNNkzaHJhqclGnSEd9dQb9W6s+n0YrZOlISoqEtNnE7Gxo\n9XgMWpUIk14b+npbUFaai5yMaEgEtyATpkEmSkNFOUlMmIpSUtLU1CgkJkaCXZiIm3EsVHa0MQsc\n9HgorYKD\/ecObMzfh9dlQHczKXlDCWkIPlrqefS5wyQAZVbAPajGxtNeTLgbaaC8q4N5YEMNjwZu\nL\/VhdaYN8z4jZkb18Ls18FFKPBpSwz9cg7nxBiz5W2jg8nQPUm5FQWjQMQ980CE\/AprbymBuFcDr\nVB0DOnol8FKaI+BOwAZ2fiz41TJmgSNT01R\/t4IGPpvrhIUALW0C0ix5MCjSoJWlQCFKhK4qDaX5\nURh3aI+Ak24DBJpKMDq4Ti0sUlayxwWB\/e3luCtMICuedGsWOhtI52pvoVGdiY76IljahaTMxiMg\nryQNohoFVE4Gh4cgcHa8lQYKCq6TrSQXlaVx+G6VR68Xy\/lk+4mHkB0Nfu63kJXEY3mqnQbWkGtX\nXFvNPHBpuvvoGpTyYiHmxuDJeDq2F7OwNZ+GMetNurzV4hSyJ2bRpQ0CjY3lkNQpmQU+ejIfWCId\n+R7Iz\/sWgsIb0Mj+QRokDhPOGCjLo1Cccw3sjAi4LYqjEpuMYoi1MmaBXZb7+F\/gg5YyqCS3SJI3\naSyPlLWEpFdGSlxJbm9D5rvHgIJKHqqZfDaxuex4szt6bB\/UyG6TLi5AUWYEnVpnIwcy\/j9Jk4gw\nalMfAZ2DepRUcJl9urNS\/w9sri1EdxMPuaksskJh7yGl5MYe26iDQHu\/DnwJh1ngoNMGa5\/uGHB6\nRA+fS4Pq8hQ6weBG3WYoOgac93dBKMxAUXkhs0Df49mARFQAQ40Yfk8PZsfbMOdt\/OCtzuvSkZlR\nCWN9GUoF6ZBICtDlGGC2SXxP5rsnfWMw32+FTi1CU70ctZpS6FRcaFQc1KiLoSVLreTg7t1CSKW5\nEJSmg81OglIphMk2gGqH4xyT41aa3z8BF9UPS18bjAY59Io8LDzqQpUkC5WSHFSQJRVnQ8BLJiNY\nKricBGRmxqKikg+DezjA+GuPYc8oKIcFPV0mFGTHgZN7AzXyO+BzksArvgV+cXAWTIa2IhUTtgpo\nKu8gKfkbVNdrUeNwGRh\/sptZXgmolWIoFUII+Nm4nRKFjPRoZGXEIDsrFtnZsWDn3YS8LB7mFi6q\nRElkFgyD1tJHBoVh5t9wBR89nZ6RQGODGga9giBzkJeTgJTka0iMj0BiQgTi48ORmhyBzNuR5HsY\n2CLuXsPDsZN9P\/PQ74u2Dtkpi2MwoNJUQE5SlcrLIJTywBexUcDJ2CtXyyh1u4kbfAvxS\/\/nP97N\nybh\/zxK+AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/essence_of_hairball-1334273867.swf",
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

log.info("essence_of_hairball.js LOADED");

// generated ok 2012-09-18 14:08:50 by tim
