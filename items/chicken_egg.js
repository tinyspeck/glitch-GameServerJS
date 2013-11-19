//#include include/takeable.js

var label = "Chicken Egg";
var version = "1341274505";
var name_single = "Chicken Egg";
var name_plural = "Chicken Eggs";
var article = "a";
var description = "An egg treated with special poultry seasoning to hatch a <a href=\"\/items\/279\/\" glitch=\"item|chick\">Chick<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 200;
var input_for = [];
var parent_classes = ["chicken_egg", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.insta_count = "0";	// defined by chicken_egg
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

verbs.insta_hatch = { // defined by chicken_egg
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

		return "Instantly hatch "+pluralize(count, "Chicken", "Chickens");
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
				location.createItemStackWithPoof('npc_chicken', 1, this.x, this.y);
			}
			else{
				var container = this.apiGetLocatableContainerOrSelf();
				location.createItemStackWithPoof('npc_chicken', 1, container.x, container.y);
			}
		}

		this.setInstanceProp('insta_count', intval(this.getInstanceProp('insta_count'))-count);
		this.apiConsume(count);

		var pre_msg = this.buildVerbMessage(count, 'insta-hatch', 'insta-hatched', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onStackedWith(stack, delta){ // defined by chicken_egg
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
		'position': {"x":-13,"y":-37,"w":25,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHrklEQVR42s2Y+1OU5xXH7fQPYPpL\ngzWNqW2mzaQZO+10OpP+IKgJxqQS8dbYpkTwhiYh4IWoJUAM0aoVkmpaTRpMREWILrqAN+oKu8tl\nL+wKC8pdljvCrq5XFP32nPPsLi5pO+NySXfmzLv77Ducz36\/55zneZk0aYxeZeGhM4xhoSn68O9P\nn\/T\/+GK4qrk\/hiliKhj2W4XxqSUxc\/JUXtOHTda43nwRDQumg9e\/PaUIqHz2k2iK+iVaFv4aFbOf\ncjMQQzvmPYvGRb9A2awndb772XL+zjL7eyETp+DMKbbayOfQsvhXuBT1c5jnPA1D2GRbxYs\/dNdF\nPSefjeFPRBrCQqNtc58h4CmYUBVZDWmIsNBWgkL1vJ8qyPDJqIn8GeyvPgOy3G2JmKbxxL4MBp8w\ne0kVHTeC9eVp0hAMxQr5ANn+ypeekvd8j+O1Z1E+a0r0hACyjZcin4d72UtSa9y1ttW\/VbGK4wWU\nzf2RwHEYZ\/5A4H2NNL7qUU1xQlaFgxO37ovDrdYciiO42XIIN5oPwtP0JVz2vejUboZj0xwY5kxF\ngyFd52reHjLu9vIoERtfmYZ+fSZut33tjTzcunJUgTZn4wZBXm\/4Atfq96NNvx21uq2o\/VeqbVwh\nuTHYYoYbMHyCu+0ncLeDoj0fd5waimO4fSVXIG8QpKfpAEH+E9cu74Orbi\/6qjNQX7JVN65wrJ7L\nsAeDHVoMdhbiXlchXQvo80kv6DFSMpfsPkwqfgVPo1LRfenvGKj9BL32Xai\/kJoxLtsYwzXtinYz\n0L2uU7jffRpDAybc7ymmz0UCzZBsOdclW+1pJBXrPyfAf8BVuwf9NZmkYhpqTidNH+PuDdWZFz\/v\nvtN+ws0w93vP4+E9D\/g15LIQ7BlRky1XKh6VpvFILbLNBFi3BwOOTLSbt8FRvMU2poD6sCfiu\/JT\nbYOdWtzrPoUHt9rgez24WkoqnhNV2eo7zuNSi9LVfkBVhwOOj8nmnag5txkW7fr5YwYIV27IbafG\n7QN8OOgSuIeDV\/Gg7\/xjAV6t3oXLF5JhLdxQOmaAd9ryUjjxXQJgi4fcVQI55LZiqLf4sSxmwBZj\nGi6eSUL12YSxOZbdvJLj5uLnJhAVvU0iYHQNbJK8\/9Ikf5MmuXpxF1qNqbh4eiPsRYma0cM1ZUfz\nbGPblIo0XvpNarx0Pt6Y6a\/ZTYA70V75AQFugO1UArqqtoxuG6SBq7nZki2q3L6Sh8HeEgz26QVI\nhrV3UMuO8j8GNddff\/Vf0Wf\/C9or0mA\/vZ4A30Xd2YT44JujeV8Iq8BqKMgjohDbOLzNfXOr8zyy\n1bF6yt4MsbfPvh3OilQCXAdbUTzVYnzwI+dG4\/4ZXEMK8ktRhotfQOWQkPMfDwsK7jNVe9IcXvUu\n7kCv7SM4y98Xe6sK34GtcG3wh1n69SncgdcpGSflomc1GURg+WAgcVB+gKcxS9nqh9sbUHt9tm3o\nqfoQTfrNop614G2ah3Fkc1xw3dzv+FjHSTgZ23W94XMvaJY3DnivX8g6q33t8v4RcBkyWrj2eqvS\n0WP9AA0lSaKeVbsWlpOrUHNqdXAPWf3VmTpOwjZxLbGaDMAKiaoExFeG52ZgMPelT2XfHXCMgCNr\ne6xb0W1JgeNcIqn3lqhnPrECZk1McIBU1G5OwjXEhS6gdZ8K7MhgxQSMfhAPZGXrSLhUdJmSyV62\ndg3BrYI5fzns2tjg5iH\/ca4dLnAFminKiKoM7A0F9QgYqSY1Rx3ba0sfhjMnw1n2nt9ac\/4KmDQx\nsBcsC+6c2GP9sJUL2wfKiRXsbgEejt2yPgzGqm3z1xzbynCdlZtRr0sguNUCR9ai8ng0vX8jKzhA\nS6qOu45V6BXQ7V7YHQrYHztkXSn2kRdsK0Uaus0EZ\/qzwHVUJMFeuMZbd7Gk3puoPPZHlOctDa4G\nO03JWWwNJ5KEDFuVriACIl1B0fd+MFHtfXSathDcJnSUJ6G5JGEE3Buo+PoPKMleEBMUYKtxYwr\/\nek7ESjBstyVNbAuMNFmX783KzmHV3kN7+Qa0l62D9eTKb8CV5\/4eZbmLgpuD1WffnnH5fKIo0Fm5\nRZJyFzJwYCSrdYHyKiZgGwlsPZzGRJp1cdIQAXB5BHd0Ee8k3w16N7Fq49wNVNhsESftqNjkBQ4M\nXpfv6T6lmAJzGuhAcGY1gS2ThuCa8ytHcLqD8wtGdZqpLlqVYT6xkrajt9BmWCeJBWBk8DrZ6DRy\nJNC976JJt5ZGyIpHVJOGIEuXwEhwhiMLcOazVxeO7pEzd2WIWbPMzQPVQgVed3YNWkviBcIfhgRR\nqs0QTw\/q76ChOA42baxS7PifUOFTLe91gltMcAsJLgrnv5qnpxTfGfWhtaYwNp5VYJtUxBBsLGwF\ny1VolwuQTRvjhxLFAsCWiKXGnAUENx\/6w5E4sjP8N2P2XMLDlOuHE0swhC+8awrIB7VUNUEAWBQM\nh18juHko2h+xYswf4K2apSkq8VKB8IVvjZUahlosdTYMplS7kP3Ktfy9s5aM2\/9oTMdfn2HMWaRj\nAK4nuXpDgKi+FJSyUikWidLDv8O5rIhDubvDfjIh\/yusOrZkemn2\/LTSQ1F2BROlgB6BYiuLD8wt\nKM6KSAwW7N9M7bVhoIJhEAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1262845060-8354.swf",
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

log.info("chicken_egg.js LOADED");

// generated ok 2012-07-02 17:15:05 by martlume
