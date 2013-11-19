//#include include/takeable.js

var label = "Million Currant Trophy";
var version = "1345830749";
var name_single = "Million Currant Trophy";
var name_plural = "Million Currant Trophies";
var article = "a";
var description = "Why earn, if not to display? Imagine the awe and jealousy this trophy will inspire! Sweet, sweet jealousy...";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000000;
var input_for = [];
var parent_classes = ["million_currant_trophy", "rare_item", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"quantity"	: "0"	// defined by rare_item
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

verbs.admire = { // defined by million_currant_trophy
	"name"				: "admire",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Lay eyes on this beautiful trophy",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			my_msgs.push("WOWOWOWOW! That trophy looks like a million currants!!");
		}

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

		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			my_msgs.push("WOWOWOWOW! That trophy looks like a million currants!!");
			var pre_msg = this.buildVerbEveryoneMessage(pc, msg.count, 'admire', 'admired', failed, my_msgs, my_effects);
			pcx.sendActivity(pre_msg, pc);
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'admire', 'admired', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_auction",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-47,"w":39,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJR0lEQVR42sWYeVCTBxrGndn6R9e6\n4FHlUFDECwjhCoRDw1VBoaYgcnghhyBFxQutilItW0FQRG0rolIBGYoCotxXBAMCAQLhPmPwAC+i\n1nqsnXn2\/SJ1x\/1np7uE\/WaeSfKRfPnlec+PCROUeIw0BKncuRWQc0cYIGAe\/zgnEwb4yqr9I+\/W\n+PEm\/L8O0eWFfBKaMtl4di8OBInWXJtISa6NvLPYCQPVGxTnCk4tGX\/IhkwdFVHaAjkDyOhu02b0\nlnjhj9eMGMiOwtWI9pvJH3\/A9EW+ovR\/wcjqAiC5wvsI8E6dP\/JOcBAdNEVl3AGbs\/SSxVf1KLyL\n0ZixCLdz1qLgpO5HgL3VX+PHMO2c8XUuUUel5pQuT3KdJW+9zkLLNQO0F1rh52gHVF2Y\/wGOycuS\nVG\/EBKj5jguYJJvFb7vOEfSWu6Cn3JHyywgdRUZoL2DjTq0HLseaozlLX+EoA9h\/yws\/7NZTfni7\nioz4XWXG8h6BOXpvWqC3kkuP9Fxgip4KU3SXGStgGVCFo9nvITuqNmGn+zTlhre71CSyr9IaAzX2\nlPDLMFjvjEHRcsjqnSCrtYe02hp9lWYK0K5SY6pYgrzxHrIuzx9pezWkFdGabOXAlXPi+4X2BLMC\n95rccV\/ihaE2Hwy1r8FQqxfut7hRa1lBf7fDgJCcvWmmcFMBSU52ldiTk8tRFDVbXh6lrj22cGXm\nvgPVjhhs4OOBxAfDHX543BOMJ30heNJP6gvCo24\/POz0wYMWPr3P8QMk4yQTbkmuATm7HOUJLKSG\naySPGVx\/qalKX6WtfFC0kuDW4mFXEEFth1y2B8\/vf4fn9\/bR1NhDr7fj6UAQCtJWoTCZS6G3J0iO\nIjeZnGzLM0QzhfpGohP2e08bO8Cecm6y9LYz7jV7kUObCGInnt2NwCNpFHIurMLLxzF4+ejv+HX4\nEF4MHcQBP13kJllSyF2omiknq5hQmyhc7CyykUcG6OQEOY5RJSvcu7lULhPxKc988bh3G+SDEXgx\nfAxx4WYoz1ovf\/P8LF4\/O4VXT2PQ17wPIa5T0VvvheF2dwq1PdoqnJARN49msVHkg47Qsc09uqhv\nv9ABdxtXUd4Fknu7KKxHUF+6FZtdpwjePL8gffdbOv7x8iLePD+F3GRPHNmsi5E7QZQKnrgnXobC\ndG9sV1Z76aS2MiB0pKpdTeENwlPpHrx48D1+OsjFpe+sIt+9uo7f3+bi9zcMZCKithji8smllI8h\nVDQ+9Jk1iokSF6Sk6dFZzAA64F6jBzlI+ScNx4uHsUj93gbCnLXid6+yCY70Og3D0lhFeLvrAz8A\nDnWGINpfDYl7lTQ9mLzpq7KjXHKnnPJXVO+L4RikR9ugQ7gdb3+9RM6l4O3LJNzKD8X+jXOoUMI\/\nhFhUtBGxgWoCpU2O1nzDyJ6b1jQ1XBQt5lFPCEYG96OhcCN+exyHVyOn8VpOepaAHw\/bUXh5VOHb\n8LR\/Izm4DsUXXZAQ\/HmY8jaVjMVh9ekGaCtgIFfS1NiIx31b8HjgW7QXf4n2IhdqP8F4JT+Fbzyn\no7t2AxXSJnLPGyOyXTi7QwNnQlW1lQbYlKXPrk3TQ32GEZqyOGgrtEVbkR1a8+3ouQMB0nRpWofW\nqq8Rt1mTUiAADyn3HrSuhETgixNBqmKlr1X16fpi0S8sAjRG8zUOJHmWBGdDoDx0FNtisNEbN87x\nkRVvAmntcgJ2oZnsjNI0N8QEfhbfXWHMbi7+Kr7o\/BIkRRjg23WfSw+tUeWPISCL13iFBXEWG825\nJmgtMKeFlEvuWaGjxAoPe7bip3B91GbZoLPMGt0VNEWa3SFINYMkny3upB2xJYcF4cVFqLpkjZ2e\nmtRDp0aObS5eZeU05xpBcsOY8tGU8o+DzhILAuLSKFtCrrnTYmBFzpqRsya0uJrQe9loyWWjMdMA\ntSl6qGYAExfg+B4LBLuqjm3h9NMdW8t1I3FbAX15MQ3\/Ug66yjnoLjcnx5jn5ugq45CjpgRpitY8\nSgcG7iobogwCTNVDTfJi3ExiYbePlnjMZvG\/z+X2EtNkBZiAtpRKWqeqLN4\/kpgNm\/lbRwm5SD+k\nhdxuyjZEQyYLdWn6BLcQR4PV4\/eunqC8lZ9cCmNg+oVc9NdwIb1tqVB\/tSX6bhEk3QIwkO1FZlTp\nxhDnGEGcbYb2Eufk87vUtZVe0XTvIWZgpHVWtO\/ZUMO2hYRCKxNZYaDWUgHeU0n3J1X2lArc0p5K\n1zAgc3zugQeqjbUHyDUG5m6TDU0VH8XuV0E98n4zFUqDDbUcJxz0n88UAXvCeB+9FcY8Bo6BGWqn\nHnjbA0dDNORDHUvxsMOWFtSl6K93R8TaGdJxBas7PoNdHa+WXJOgIZbe5tLSwKObJVtcjdJC4bFZ\ntBg40ASxx3AnD4VnjJF9dDb6hMby\/jqTHFHSbOX\/D0YQoy6uiVcDI1GiFpqvcND0Cw+11HQ785m7\nPFcqjhXUE1dS5XriftsGKpxlaEjWRlWsGtKUXRxbHeYIjrhr43zwAhQeZuPawcWoOG2Kxix7SIpc\n0VnpQYXCR322I1IPGSJp13zE+mli27JpOLxyLo656fKUDrjri7l0q8hFbaIL8g5ZoPiYNSrO2SIn\n1hyXDhjgdKgOEsP0kPqNBRJ2mMPbZDrcDKdin\/Mc5QLupY6\/c5mOmAEsOmmHJ7Xe6MtcgSGhO94M\n+0LW+CVEuVbI\/2GRIuSyIi8Ir3p9BHhi9ULl7IN7HGblHHDSwjEPPexbMR\/ntppAdMnpPwKWpbh9\nAAzlaWI\/QUbxdeXRbgvGrPX8lTRj61KNCwedtXHEdS4SfU1wxkcfFwPNkR5ijcshlgqlBFsieRMX\n5wPMcdhVBzvsNBFsPRNBVjOxnjMdnkZTwTeYAi+T6S\/01Cc503XnkWaSPvtvwP5CUiXNJumRuF8s\nUt0VaKWREe6o1RjjYdBz0ttg5KzPYpzyXIjj7vNxlD8Ph13mIoJ+yB7H2QrA0CXqWG00TfYVa8qA\nre5kgd7MTxMmTZywnq63jGRJMiBpkaaQPvmzkBNHP6g1Cskh2ZNcSd4kf9IW0m7uXJXzHK3JP5vM\nmpzC1pyUov63iSfpfAQpnKktUiDJh7Ry9BoWJH0S03amjX7X\/3x8Mhpy5oJqo+CLSKajX8g4Yj0q\ny9FzjEM6o+9VJzGz+NM\/A\/RPkjyks3pSGEUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/million_currant_trophy-1343948872.swf",
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
	"no_auction",
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
	"e"	: "admire",
	"g"	: "give"
};

log.info("million_currant_trophy.js LOADED");

// generated ok 2012-08-24 10:52:29 by martlume
