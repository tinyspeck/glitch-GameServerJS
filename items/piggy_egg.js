//#include include/takeable.js

var label = "Piggy Egg";
var version = "1341274511";
var name_single = "Piggy Egg";
var name_plural = "Piggy Eggs";
var article = "a";
var description = "An egg seasoned with special porcine spices to hatch a <a href=\"\/items\/359\/\" glitch=\"item|piglet\">Piglet<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 300;
var input_for = [];
var parent_classes = ["piggy_egg", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.insta_count = "0";	// defined by piggy_egg
}

var instancePropsDef = {
	insta_count : ["How many animals we can insta-hatch from this stack"],
};

var instancePropsChoices = {
	insta_count : [""],
};

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

verbs.insta_hatch = { // defined by piggy_egg
	"name"				: "insta-hatch",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var count = intval(this.getInstanceProp('insta_count'));

		return "Instantly hatch "+pluralize(count, "Piggy", "Piggies");
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var count = intval(this.getInstanceProp('insta_count'));

		if (count > 0) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var count = intval(this.getInstanceProp('insta_count'));

		if (count > orig_count) count = orig_count;

		var location = this.getLocation();
		var is_on_ground = this.isOnGround();
		for (var i=0; i<count; i++){
			if (is_on_ground){
				location.createItemStackWithPoof('npc_piggy', 1, this.x, this.y);
			}
			else{
				var container = this.apiGetLocatableContainerOrSelf();
				location.createItemStackWithPoof('npc_piggy', 1, container.x, container.y);
			}
		}

		this.setInstanceProp('insta_count', intval(this.getInstanceProp('insta_count'))-count);
		this.apiConsume(count);

		var pre_msg = this.buildVerbMessage(count, 'insta-hatch', 'insta-hatched', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onStackedWith(stack, delta){ // defined by piggy_egg
	var insta_count = intval(stack.getInstanceProp('insta_count'));
	if (delta < insta_count) insta_count = delta;

	this.setInstanceProp('insta_count', intval(this.getInstanceProp('insta_count'))+insta_count);
	stack.setInstanceProp('insta_count', intval(stack.getInstanceProp('insta_count'))-insta_count);
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Seasoned eggs can be incubated under a <a href=\"\/items\/278\/\" glitch=\"item|npc_chicken\">Chicken<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/262\/\" glitch=\"item|egg_seasoner\">Egg Seasoner<\/a>."]);
	if (pc && !pc.skills_has("animalhusbandry_1")) out.push([2, "You need to learn <a href=\"\/skills\/30\/\" glitch=\"skill|animalhusbandry_1\">Animal Husbandry<\/a> to use an <a href=\"\/items\/262\/\" glitch=\"item|egg_seasoner\">Egg Seasoner<\/a>."]);
	return out;
}

var tags = [
	"egg",
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-37,"w":37,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI70lEQVR42sWYW0xUdx7HNd13H5rs\nPvq4j33bze7LZNNkk30y+2DSpolN03RdizKCqKCW4X4THBQFuch1UEBgYGC4zDAMF2eUFiuIrRYv\nCBaVKgyC9YKX3\/6+v3P+Z85YNoMt7k7yy3E4x\/P7nO\/vembDhnX+LLhbNv\/U7rTOtTb777ewNTf5\n7zY1+GebGqpmG+q3bPh\/fRbc7s3zrnb\/fEc78ZEetrfRgzYn\/dTaQnMtZ4lBiUHpxzP1oTv1ddb\/\nKdyS271l0d0ZWuxyU8jdSQudHbTQ4dJBGdLZKpD3zjbS3cYzgKQ7p+ucC01Nm949XG\/Xp496ummJ\nDcdH3V20yKZAw5AtBuSsDjldX3PpnUIuezyWZU8vLXs99JgNR3xf6u3RQFlRBanCrUI923Caph21\n9MOpcv87gXvq821moNDPfX30s89kfV6BFUhWVEE+dHFOmkKtqeigG1WVdO1UqX3dAR97PJee+Hz0\n1N\/P5qenA345PunvF1ADUg\/3POekhNqkIsI8U19Hl08W0\/XK8i3rGVorIAD3bHCAng8N0sr4OD0P\nnKNnAwPydyiLkC8ZKrqkslEw96GiHmYuFpqsrKCLRUenbpaW\/vZ8JK930+M+bwhKAW4lEKDXy8uE\nz6vpaYF9NgAlfayiV1RE0Ri5aA6zADpouq6GvikqpImSE7Z1qNpeu1IPMK9mfyT1eTU5SSvDwwIu\noeZ8RNEYYZZiWQXQUSNhHjl6hH6TilBvydMT0gD9Amj+vAwG1gbY2vwLQK5mOm\/Pp2+O2n+9io96\neqxwiPxS+ff6xQtNvbk5enHuHK0MDUkeSoj7vOFCMdrN6iGeqqkSwGDB4dCvBuRkn4JD5BYAULkr\n42P0cvo2rQSDGtygXiSmSja3GmOqmIpEA6ykkcIjFMjPo\/P5uZ++NVyoy2WBI1SlpqIOyaGGYgBT\nFYz281iFl6+XqdKhV\/EbbYbnMgNW01R1JY0es1PgcB4F83On3hpw3tVWBUeoSKiCFvLsuyv09OKo\ngCrTlNPglkyNWk0TlX9qJs\/U19Lt2mq6VX2KLh0\/xoC5NJyXTRPHCj54K8CHbW0h9DJAPtIhX87P\n05PzQQF6LBPEGx53gIto0m0yjyN7oFYgtzn\/blVV0PiJY3QuL5eGcrMomJu99unyoLXVgqeHCgoS\nysiSwKARphYGtdnocNL\/fqFeOLw3uVmPHT\/K6uXQUE4mncvNXHuYOaltyB1AItHhFFWpQBf1DUb+\nbVq5lHKqtZgXBag340B4qyS8N7jNjHGzRngBOJCZRt\/mZ2xeEyA2YoRGg2wVp6ImA8juF2EuAVNr\nllIOcCq0WBKQe2b1blSU0WhhgYR3MDuDBjJSaTA9dW3VjJAgNHACZ2gVoma7U2ChqgDxUb4DjB9E\ndkAznFpW6+uM3nerCuqV0fXyk3ShIM9Qz5+eSv605Oh5eNfh2IybCiQ7EUhWU0BZUYE1GaBkzQeY\n2qIN5cJwKrQ3K8vpekUpTZaV0LBJvf60FOpLORR9V7xzutaCZoqbw4lSUykKiDmT3dffP+QaBsP1\n4bCG4cyhnSw7SVdPnqAhwOnq+VKTqdd2YCw6YG2tBa0AN0dim0GhzD1lCki3WQOsXisIybk34Di0\nkxzaH0qLaZwLZDArnfyino36Ur8ij+0gRQXkEWRFn0JCo+rMoAr2TdPOOXSwOq3XcTOWnJOwRsJd\nKzlOX+fnaqFNTxH1vLZD1Jt8IDrgzapTNtwUsxJPD1BRVMEKsMn4O\/6O85pi1dKIoRoKAjknYTXB\nfV9cREOsngGXcog8DNdzKDE64PXKMgt61E3u9ALKjuBQHLMBItKq9XNVolgYTFNNK4hIuHHeA7W8\nC4e296skcifum4kOWFZsQQvAUwsoO7plghWr0U3\/jnNifJ0opsBEtRK6xgVxFXA82r7j6RHMySJf\nWiRcz8FEak+ID0QPMW+4eFq0AYDCERxqsMoqTFZuQOGhFBj+v6gGOFZN4LgwxgrzDeW8Co5D231g\nPzXHxZasqVFfLioM4cZwAAXgDE6vl5cKQIThbwAyoExgJtWu4B3k2BEa5rbSl2JSTofrStxLjdaY\n\/REgvNP5X1+4wKv8kGwmoc5O6eTB3CznNd0JHIRhiw1oBaIM1ygoQzEd7ArvfRNHC2iEG7NWEOGw\nKjj3\/j1U+q\/P\/mx6Geq24z3i+eCgLJ1YmTBrH7Q2Wa6Wlkglw\/GVIjtd5pvDqRgA3jT9HKBWA7vM\nYb2Yn0N9Nq1aV4NzJsSiQH5n\/GSGDUTWJX4hX+7ttYXcHVWYt1PVpz7j6gwhv6DIBFfct4ezBRSO\n\/6sBSMwuoVRg4\/bDdCEng7zJ4ZAKXNI+A65jXxw1xu4I59+9piYLhrv8dNbpkrCGOlo+QHvgtvEU\nbQW5BTXG+cVmNDeTxniwi2PdRB3TdzzIZQOK7chhGuUHG8xIkQasVOth1QDnTkygTsDtjSNXgpUK\nP9n6x4iF4K5pEbh\/ttHOo6lBreOoWKgHiEvc8YPpNurnqhth0EvsGBDKBIZVgo0dyRMbYcX8fD2g\n3gQT1RL3UOe+eIbbTa49VjqzczvU26jP2koLjrfrqqe0aeCQiYBJgN4GOOQewibhyUqTMCCxUXlo\nDT5O9IG0ZDG\/MgaKgNJDGQmmq7YPqu2m9j2x1BIbM5Hwz7\/\/Pvyu4Wr382jyTxQVTt3gNmFusGgX\nUE6Dy6cAh6eLbwoTh2wKwGzqnAApqFXAzKq1x8eSc\/fORfvHH\/8l8mc0v8+GTQTVN8Q3\/zo7na5g\n\/KCJch6NcN4EeE56ZPQk+FviY\/\/mTIg7AWdwvJopGAWkoCSU++NFMQFL0MDa4mKpOTZmpuCjj\/4a\ntSk3bd26qS8p6X3OMQuMwSyepCSL7+BB8\/vBxgbrzq0c6kVN0b0m0xRWQEgHQGlqaaFUigHMuXsX\nNcb822398MM\/rPtvhMe3bXu\/OW5XZnuCdQYAZtNUUkrpUJxjZrAzX27vLt72yT\/4Vu+965+q36v4\n\/PM\/NVl3ZDbvjgk0W2MCzvjYRQMoXkv+xl07Ag07t9c7tn\/xha7Yxmg3\/g+vphf0VP\/EDQAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/piggy_egg-1334276285.swf",
	admin_props	: true,
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
	"egg",
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"n"	: "insta_hatch"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "insta_hatch"
};

log.info("piggy_egg.js LOADED");

// generated ok 2012-07-02 17:15:11 by martlume
