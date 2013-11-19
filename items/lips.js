//#include include/takeable.js

var label = "Lips";
var version = "1347677145";
var name_single = "Lips";
var name_plural = "Lips";
var article = "a";
var description = "Pre-pursed, super-soft and infused with an antibacterial salve, these lips can be attached to whatever might help you kiss people better. Like, say, an <a href=\"\/items\/460\/\" glitch=\"item|emotional_bear\">Emotional Bear<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 10;
var input_for = [];
var parent_classes = ["lips", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.use = { // defined by lips
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Click on your Emo bear to upgrade it!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.items_has('emotional_bear', 1)){
			var bears = pc.get_stacks_by_class('emotional_bear');
			for (var i in bears){
				var bear = bears[i];
				if (!bear.hasUpgrade('kiss')){
					return {state:'enabled'};
				}
			}

			return {state:'disabled', reason: "You don't have a Bear that needs lips."};
		}
		else{
			return {state:'disabled', reason: "You need an Emotional Bear."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity('Click on your Emo Bear to upgrade it!');
		return false;
	}
};

verbs.emote_kiss = { // defined by lips
	"name"				: "kiss",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: true,
	"sort_on"			: 50,
	"tooltip"			: "Kiss someone",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		// This function appears not to be used - use the one in emotional bear instead.

		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);


		if (pc.metabolics_get_percentage('energy') < 5) {
			pc.sendActivity("You tried to kiss "+target.label+", but you just don't have the energy.");
			return false;
		}
		else{

			//
			// get target player
			//

			var target = getPlayer(msg.object_pc_tsid);

			//
			// change stats
			//

			if (pc.buffs_has('buff_garlic_breath')){
				var energy = pc.metabolics_lose_energy(5);
				var mood = pc.metabolics_add_mood(5);
				self_msgs.push("Hopefully they don't notice your garlic breath. "+energy+" energy, +"+mood+" mood");

				var mood = target.metabolics_lose_mood(3);
				var xp = target.stats_add_xp(2, false, {'verb':'emote_kiss','class_id':this.class_tsid});
				var target_msg = pc.label + " kisses you. Wooeee, that is stinky! "+mood+" mood, +"+xp+" xp";
			
				pc.achievements_increment('players_garlic_kissed', target.tsid);
				pc.counters_increment('players_garlic_kissed', target.tsid);
			
				if (pc.getQuestStatus('spread_garlic_love') == 'todo'){
					if (pc.counters_get_label_count('players_garlic_kissed', target.tsid) == 1){
						pc.quests_inc_counter('players_garlic_kissed', 1);
					}
				}
			}
			else{
				var mood = target.metabolics_add_mood(10);
				var energy = pc.metabolics_lose_energy(10);

				var target_msg = pc.label + " kisses you. +"+mood+" mood";
				self_msgs.push(energy+" energy");
			}

			//
			// animations and sounds
			//

			var args = {
				item_class: this.class_tsid,
				state: "emote_animation",
				duration: 3000,
				size: "50%",
				msg: target_msg
			};
			target.announce_vp_overlay(args);
			target.announce_sound('KISS_RECV');

			pc.announce_sound('KISS_SEND');

			//
			// achievements
			//
			
			pc.achievements_increment('kissed', target.tsid);
			target.achievements_increment('been_kissed', pc.tsid);
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'kiss', 'kissed', failed, self_msgs, self_effects, they_effects, target);
		pc.sendActivity(pre_msg);

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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-12,"w":27,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEqklEQVR42u1WbWxTVRhuou0djtJ9\n3AGC2imMdSIOQpwuKONuVSQbq24VhMwVF3QGleC2CkYnzKAZBp0uarIoIX4F9sMsqJtBpwsIRkXS\naDQO6edapkuIlYTE+Ov1Pi892+1lYy0bf8g9yZP7dc49z\/u8X8dkMoYxjGEMY1xdI\/aSUjz8Vn1H\n7I0N8T\/3PU1nOutoqK2cIruU+NCu8v34Hmlb5VGffSMfeunsp3vp76\/fo3PHu+n8yT7fmc6NPZhz\nRcgdds7a6V83h84PHqf\/RoL0b\/hnih\/5gMLeEgptWUzBzQV8DW1bRoGGBRR7bT2dO3FoFP8cO0Aj\nB1vZmGibUjat5Porsjwn1+bwxtHdVYzIDoXCz5RQwJNPfnfeKE7VyHwF4cgLyuj88LOl5N8wj2Bk\nYFN+PNa0bHqU\/Mppsn3ptMW1JC6F79ZkpzTPv3F+aFoIfq7YBn5x5aa06feVOdRbbqNU5wfc8s4p\nketVrK5UFTnstDE54IsK26irx8PvD8r06wOqEbVyPFiTZb9s16rqhcSmAOIQGwNQCVdsJpTTov\/e\nLJ7DRBLEsB7v8R0G8ftauSdtcp8pmcW9is2n31T8+Jv7LmwCdbXKTQSQwhr9XKyHkadr8\/anTM5f\nm+v5aW1OfLJN9fhkpZXevuM6vqazDuEAZaHkJd0dekgu87vlgR+rclL68aFVs2jfXZlMas\/SDGpd\nLJHXYeH7j1fMZKRDFuoiJKBmEtHulVbPD5XZoSOrL3ZB9z1WenP5DAaIaCEICTQtstAT+RJtvkmi\nbQWWpG9A220Sk4ZRgDBiPEO+vT+bBmsSsel1XFvW4rCEXr49g\/QAMe3zc0VjG25daKGnFljocbtE\n9fMyyC3PSALegSzmCOiJgzT+qze2pdAcVzkllyC8wEeQADFYicBGhvqqc+m3R4uob80cel39BrUa\nbpDo4dkXE5sI6\/Iy2ChBAl4QinWVZI4RLDT7tt9iso0bh02LzMVQExa9XzqTXc5lQm1RsVfddLav\nk8I7SqmnIpva1VgTrt1ys4Xqrk8mi+dN8yVWuLlAoq47M+momrXAqcZi+uPJJXSiOo8O3G3VqGee\nPJvBHiShorAQKp6ut9NwVyPhFBPaupQCdTeSzz2XDqrxAzx\/q859SyR+f7RSpqFWJ8U61tPQ7tU0\n\/E4DRdtdvB7GjxE0p15qoCQWwc2CJNyNmhVuWs6Hhr8+2s7KRrwrKPqKi47VLaTuilx23bvquv7q\nuVyIIy8qfCxjw9TTDh8u1AMDyKHEQAgIMqFbJxqwSE8SSqJzBB9zULChgDfDxkC0vYqCjQ4uFShV\nsb3uC50icYLBPUjhu+gmyGDs0ewwe9LuJs1FJjuyCT9AudGWASQNSGDzwUfsSUculCsoM1A1m8uF\n6Dp64J+cvWpSXPZhoaXwGpfIbCQNirO2AyCJQAgtC8+pFmV4Bf+EABBiSicayC8CH\/ECoum2QW33\n2ZPIfpBDrE\/LmZCTRnWFVk292ycD5otC3+IwD0xZuXFdnijmAqLDwNXIcAQ\/VBItDPdoY1rVVHSk\nnbHpqgmiKA2CKIJd2xL1fdhbaOnBmiuimjGMYQxjXMXjf6mi3IntcWmYAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/lips-1334258269.swf",
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
itemDef.hasConditionalEmoteVerbs = 1;
itemDef.tags = [
	"tool",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"k"	: "kiss",
	"u"	: "use"
};

log.info("lips.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
