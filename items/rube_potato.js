//#include include/npc_conversation.js, include/takeable.js

var label = "Rube Shaped Potato";
var version = "1345785417";
var name_single = "Rube Shaped Potato";
var name_plural = "Rube Shaped Potato";
var article = "a";
var description = "A spud that's a dud, with the self-evolved claim to resemble a rubbed-on Rube. Miraculous! Fries not included.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 503000;
var input_for = [];
var parent_classes = ["rube_potato", "rare_item", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"quantity"	: "247"	// defined by rare_item (overridden by rube_potato)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.owner_id = "";	// defined by rare_item
	this.instanceProps.sequence_id = "0";	// defined by rare_item
}

var instancePropsDef = {
	owner_id : ["TSID of the owner player. If empty, it has never been sold."],
	sequence_id : ["Which sequence in the rare item catalog was this one?"],
};

var instancePropsChoices = {
	owner_id : [""],
	sequence_id : [""],
};

var verbs = {};

verbs.inspect = { // defined by rube_potato
	"name"				: "inspect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Examine the potato",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var choices = {
			1: {txt: "Yes", value: "yes1"},
			2: {txt: "No", value: "no"}
		};

		this.conversation_start(pc, "Sure you wanna inspect this, kid?", choices);
	}
};

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

function onConversation(pc, msg){ // defined by rube_potato
	this.conversation_end(pc, msg);

	if (msg.choice === "no") {
		// do nothing
	}
	else if (msg.choice === "yes1") { 
		var choices = {
			1: {txt: "Yes", value: "yes2"},
			2: {txt: "No", value: "no"}
		};

		this.conversation_start(pc, "Might blow your mind. Really?", choices);
		
	}
	else if (msg.choice === "yes2") { 
		var choices = {
			1: {txt: "Yes", value: "yes3"},
			2: {txt: "No", value: "no"}
		};

		this.conversation_start(pc, "Honest to Giant, kid? Can you handle the truth?", choices);
	}
	else if (msg.choice === "yes3") {
		pc.sendActivity("It looks like a potato that looks a bit like The Rube.");
	}
}

function canPickup(pc, drop_stack){ // defined by rare_item
	if (this.is_racing) return {ok: 0};

	var owner = this.getInstanceProp('owner_id');
	if (!owner) return {ok: 0};

	if (owner != pc.tsid) return {ok: 0, error: "This does not belong to you!"};
	return {ok: 1};
}

function getLabel(){ // defined by rare_item
	var sequence_id = intval(this.getInstanceProp('sequence_id'));
	if (sequence_id){
		return this.label + ' (#'+sequence_id+')';
	}

	return this.label;
}

function onContainerChanged(oldContainer, newContainer){ // defined by rare_item
	if (newContainer){
		var root = this.getRootContainer();
		if (root && root.is_player){
			this.setInstanceProp('owner_id', root.tsid);

			if (root.is_god) this.no_sequence = true;
			if (!this.no_sequence){
				var sequence_id = intval(this.getInstanceProp('sequence_id'));
				if (!sequence_id) this.setInstanceProp('sequence_id', getSequence(this.class_tsid));
			}
		}
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "There will only ever be 750 of these in the game."]);
	return out;
}

var tags = [
	"no_rube",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-41,"w":31,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKUklEQVR42r2YWVNTeRrG\/QBTNd2j\nIGhjBBWQLZAAWYAkQEIChH2RRTYFERUhssgiBJBNtgQIu4CIKKI2rm1fdE1mei5m7vojWNVfgKqu\nuX\/nef8haaiumkLQTtVTOUnO8jvPu\/1Pjh07xOuVI02yNmZoWBvVWxf6E50zvTrntFXrtHXGO4db\nVNvdN6Pz+pvUkmN\/9mtzKkX6fDp1e8uRSqwNm4GeTRrp0aieZvt0QgsDiTTWHke9DYrfehtjp\/40\n0OcOU8ULR9rOy7kMcuvZpIk2p0wClsHckI5eLQ00Kan\/jlKA9lsUWV8V7iXgXs1n0vZizh\/0\/UI2\nbc2kCSfn7us8kFNWDQ02qwQk675FWfFV4L6fz8hiiLfLBfR+9ZJHr5dyPZDsJrv41L4f0g061KL6\nepDbC9mf3q8WkvN5GX18XEw\/rLm010UG5HxkSHZyw5YitD6RIvJz5UGyyMv7FgVNtKu0X869hcyK\nNw\/z6B9bl+k\/byrp75tlu4BF+wCf2lNo2BIptLeAVoZ19HwaeQqtjuhpsAUu3lF82lrQ\/\/XL5N5c\n5qd3K4UC7t+vK+nH9RIB+HY5\/w\/h3Zwy0vp4ssfFpxB\/x9viM25itF1NPQ0x9KBVaf0iLeX1Yq4n\npKwPj4r25d6ruUyPY8KpKZOAWh5OoqkeDSpbR4\/H9SLcT+DolDWBuuujUeGKT0cG3Jo2NrB7ewFf\nL+V54J470ujhUBKhUdN8v05oGlATnXE0Do11QHBsrENNU90J5MBvw60qarsuo4bKCLidKD1i30u1\ncf654RiWq\/kVtDmdhl6nEUDc86Z7EsTFO29G021cvDLvIpXnXqQrBSFUVxpObbUyQtMWvbGuNEx8\nP9WVoD1qY3YyEBfEB+j5dAbAzMi5LOpFNXI+cSg5dPaueLKx7sXTOJzrro8RgBUAbaqOIow\/muUb\n6o6nvsZoulp4kerKwo8GuDlpcm4hjNzz3kFPJ9ORX+nIrSS6ez2GnmF7w2YSOcahXhpMpEmEUoQY\nkLfKIqi+PAIhjaJXs65GvjigoZmeOGqpkVJdcfDRADfsRidX3uuH+fRuuRCFkIG8y6DGKzJ6NIZK\nnTILrU\/wLE5GG0lGv0sSbo60qeBcJLXWRlFXvZzeL2fSnFVNM9Y45KwWjVtBzdURR6vkdZth58mE\nQUC9nM0S4WWg7ttK+nENrmKysKuPx00CbHk4UYh7XXVRCJVkBlFzDcLbqkQ\/hLv3FAhzPCaNBg6r\n4GLE6pEAOXSPx\/QCikFYG\/Z0Whkx0j+3Ssm5WYLfMlAgiVRzKYTsHQpaHNSJPjeHyna3H7c4GvP9\nGrJUhNJwczTVFgc7Dw33ZCxJwmFjMdSGPQ3FkIZwporPPz0tAmAxbUyaabY\/mbpuRpLDqkKO6cTU\neDmbLvQCi4i9kBuAdPSgUCzRdA0uHxpwZSRR+3AoUYSOoViPhUy0hpBuIeSv5rORiyZaGkoWznDo\nntiM9PZhzj5hsbFnRhtwjJ7zj8pzAqnrVtTheuEIBvo8kpkh13ahGGZ1zEiro0ZaYY2k0CLg5vo0\nWLUk0ExvAiZLBn18lEcfVnMFHE+a9fEUMWEEoH13oqDaL6Wf40o+3OrGdk9tneELIxwTdxX7oJYh\nRy+S3oqlFPraDPbhsI22KenNUjb99KSA\/rWFsbiah3Cn0xNUORfbOnJ6De65Kj4Ji4ZYNPTAwxXK\nUHOs1YHpwKHjecpQyw8MqFID3NIKGM6jXjTdHlZDtGgt24vZ9HE1n34G4A9w8sUswjuTIaDclc5R\n4WJywPH68tCdyzmBnx\/mgabYbXaHQzeLEy0N6SGDEE8DW5eaOm7I6FpxqFAntifx3daMWaxuthcy\n0Z7MrmZuTwWUzgXVHYfj1Z6U6K6XUZE5gC6b\/T8P8n5jtNPeFSdCx5rBmJpHtTqscK9FjmasJvs9\nNUabimydKkwPFcKtRggNAurpJKoeYOu2VITTIM7BbYiheJtvZrQ1msYQifKcCwLSUvUZo6\/7tvxX\nvvhIs5yG78jIhpO7gLUAUrqg0GzH2mJp9G4sVi1KAbsEl3g+r40bhVYAxxGYaOeVdKwA4\/34hsb5\n2DYFemgQFaT6U37qWduBATmnxMk62SEFTqoUJ2Wo8Q4ljQOIoQYbsYpuktEIIB+0xoqKZpfc8jgt\njnUdw1C8\/3BLDA01x9CN0mDKNUooW+938MbNucEn5eE\/jYcefvCxY6UyhpOP7soNxRq4I6fGyhDh\nzuQu1GhrDI1Abijezw012BSNhyg53W+UUV1JMGUbzlCeUbJzYMCum1HCJR5j0z1oJxC3lb1QfDFW\nv0VO7dcjqLrwAt6lwuExcQN7oXgVDSgA9TdE4lk5inpuR5G1PpKq8s5TYaqENNHeB58sHXWR9AAw\n9m4NwLR4R+51acTFBi0yKIr6cBEeca3V4ZgM4XS7PISu5F\/A93LXfgwFl\/gG+gDWB7D+21IaaJDi\nOCnduxFBnXURZE48DQe\/o3i518EB265LP\/U1yoULvHwfbVOLbQ7NAOCGLVLqqZdS09VwaroSRndY\nVWFUWxRI5dnnqL1OKqCEU3Cp+1akB6qjLhxOY5V9DftfukCpmlOUpDhJqsjjB39OaasNd7I7HBrO\nk5aacGqAQ+wSfqPuG2HUUu2CslSF7CoUv1+kkowAyjdJRMg5LxmmA2qvDRNQrTWhODaEbpQEUpr2\nFKmijpNSehwhPnHw9SFOZG1B2NiFnvooOBVG9WUXMT\/9sQoJFDBCALBUYlkPNVRcFIA3SoIox+An\nQleScZYuZ52lUryXmM9ScTpX62m45kN69UmA\/Y0UEd9STMTx\/14rCDj4s\/Ld2lApQzEkh+mOAAoh\nreIUycO8KSPpDPpXoAeqnlUWTLcuu1Sa6Y+88hPhS1adhLwpUelNpgRfMut88X6SkvA5TnaCFFJv\nigzx+vylV11psPMmehQ71YGwsktXCwJJLfMRJ5SFegFCQrwPQ90sDUJPCxKhK0yTULF5173MXQeh\nMoDzNjuZb\/QjY7wvxckPCWipCtZeybtAV\/PPAyCIOq5xDgajEC7AQT9KiPHByfeLv9OrT1FW8ndU\nluUvVJEdgHOco5rC80LVBbx9DvucJkOcj3AYgL8calVzNe\/8dmXuOSrDRWqQ9A3lQR6n6uAUX1go\nL4Cu5AUIAL6Ba5dccgG5oFi8z2U4Wph6hkxwz6B2hTpe5n24B6iSXH9Jebb\/TjkAhSPZ\/uKC14vP\nCxeqoasFu8p3AVTlBqDV+ENcGBIhBipgmVh+qF5f0rtzU+H1q17+7eH\/TKoqOKst5gtlSvblE1el\nuzJZRUJn6FLaGeTgGReU6XeofCjXcJpS4lyuJSm9AHdiJzH2m6P9BcIvs8Y3xaw7vZOj9xMX3AvF\nQP8PKjv5FGUk+qIgTgooIYUXaWNP\/Bx1\/i9eX+y\/wpI0X4kxzqcP+pQS74MW4vu7Elg+Qib8xjAu\nIG8PFEIppJGf2EiK+ubr\/rGerjtdYYg7aTPG+ziTVN6\/ufMpWQDth9LFev2ii\/Fa1cUerzgM2P8A\n3PxES\/HuqZwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/rube_potato-1343939585.swf",
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
	"no_rube",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "inspect"
};

log.info("rube_potato.js LOADED");

// generated ok 2012-08-23 22:16:57 by martlume
