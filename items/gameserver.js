//#include include/takeable.js

var label = "Game Server";
var version = "1337965214";
var name_single = "Game Server";
var name_plural = "Game Servers";
var article = "a";
var description = "A plain old game server. This one is labelled \"gs4\".";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["gameserver", "takeable"];
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

verbs.reboot = { // defined by gameserver
	"name"				: "reboot",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Maybe try restarting the server?",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("You hear a ghostly \"gs4:443 is going down in 10 sec\" and the Game Server reboots and is gone ... back to the cloud from whence it came!");
		// effect does nothing in dry run: player/xp_give
		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		// effect does nothing in dry run: item/destroy

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("You hear a ghostly \"gs4:443 is going down in 10 sec\" and the Game Server reboots and is gone ... back to the cloud from whence it came!");
		var context = {'class_id':this.class_tsid, 'verb':'reboot'};
		var val = pc.stats_add_xp(20 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(5 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_mood(5 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'reboot', 'rebooted', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "You are likely to learn something from rebooting this server"]);
	return out;
}

var tags = [
	"no_rube",
	"collectible",
	"swf",
	"no_auction",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-49,"y":-36,"w":98,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADt0lEQVR42u2VS08bVxiG+QdVlgjf\noNzMzSGJwdeZ8X2MbXzDt\/EN3zA2CaYYIqWNZCK1y8qVqq6qlv6Dbrubn8Cme34Cq6qLSn3znXGM\nbAUaVyGLSPNKr3TG1tE85\/2+883UlCpVqlSpUqVK1adWKh7hk7HIZTIalmORkBwLB+VoSJTDwYAc\nFn1yKOCVRR\/Z65F9HkH2usgC13dzXE\/gHD3BYetxNlvPYd3uWK1W3mo2K97a3DR9FFguGS+nE7Gr\ndCKKvXgEBIj4bgixyA6ioSAiOwGERT9CAR+Cfi9Enwd+jws+twCvwMPNc3BxTggOOzi7DU6bFXaL\nBRazGWsrRswa9PL\/hipk4qZ8KtGXUvGbbCqOTDKGhwK0bpmxalTAYNDryNrJAGuSpC9J6V5JSl0V\ncnvIZ5KQ0gk8FKDDsk1gy++gxn0\/VE3S1yr5cqWYlcko5zMgSDwkoJNSW1leuhPsXsBmvRRtVIuX\njUoBtf08qqUcHhrQzTthWl\/7T7AxwHazEm039i9b9fINAeKgWsSnAny6acLcrGESuBuDVhud+vbi\nlfzdxSsw9745w9fnnXv95vU5zk7aOOu00CWf07rTbuCoWUX7oAI6JI5bdZQLdCApg2IuhUKWnNmD\nR+Cw8OXcRKkZdNrLuUePvlDS63YO5e67F\/70689482Mfw2fm1sE+MntR1CnNfHYPJ88P0CKQfUq1\nWSvdrkf3jPrl6XOcHh9Sry1OAndt0Gj4sZ4bBfzzr7\/xxz\/\/4uzlye0LKlTijfUVKnEaOwEPrNvP\n0KgW4PcKcPEOhEQvUold2K1bVPIYRL8bO\/TbY9MakrGw0iLsEMalhQ+kpunfeVtPO62bIczrH77H\nxW+\/jCVQlFII+FzU3AL1pKTAMgjWl2zNwKRMQvl\/Y32VYCPUj2GsrS4roGw\/A1xemr8P7uq91MbG\nCb302dPHCFI6oy5RYgwwl44rALzTpqRWyCbxZHMDXjePWnmwd8W4RElnqRViyn+RUEBJ2Wm3YDcs\nDgAX56HTaqDXDTxITdf74BBmIOxWGWkeMa\/SJ2ZxYV6BHAKyZIYlZmVkpd0yP1HWDJ4BslKzZwbF\noEXfIGW2fwiomZmGVjPDvhC\/z05P6yf6SlAD9+jkfbIsZZPXDJj5sFFWAI\/bdeWZ9VKe0mMpsTEU\nEn1w2LZplPiVXmOJCpwd4aCPDmBXoBlsuZAZSXDmWhkdH6vu0ZH+qxct\/i53j5sddqi7PLhw75tm\nqky3uHc7OlSpUqVKlSpVn43eAqgKTkVO1GwhAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1296002272-7424.swf",
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
	"no_rube",
	"collectible",
	"swf",
	"no_auction",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "reboot"
};

log.info("gameserver.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
