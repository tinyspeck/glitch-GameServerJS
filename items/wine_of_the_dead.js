//#include include/takeable.js

var label = "Wine of the Dead";
var version = "1342051363";
var name_single = "Wine of the Dead";
var name_plural = "Wines of the Dead";
var article = "a";
var description = "A forbidding decanter filled with wine of the dead, made from grapes crushed in Purgatory. This Hade-licious drink will revive even the most pooped of hellions... but will kill all who drink it aboveground. Pour it on cultivated items in your home street or yard to unreap what you've sown. Beware its cursed powers!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 13;
var base_cost = 66;
var input_for = [];
var parent_classes = ["wine_of_the_dead", "takeable"];
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

verbs.drink = { // defined by wine_of_the_dead
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (pc.is_dead) {
			return "Bottoms up! Drink this to become less Pooped.";
		} else {
			return "Bottoms up! What's the worst that could happen?";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead && !pc.buffs_has('pooped')) {
			return {state: 'disabled', reason: "You aren't Pooped, so there's no reason to drink this now."};
		} else {
			return {state :'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.is_dead) {
			pc.metabolics_dont_get_pooped();
			pc.buffs_remove('pooped');
			self_msgs.push("You are no longer pooped!");
		} else {
			pc.croak();
			self_msgs.push("You died!");
		}

		pc.quests_set_flag('drink_wotd');

		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'drink', 'drank', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.pour = { // defined by wine_of_the_dead
	"name"				: "pour",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Remove an item from the location",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.location.cultivation_can_cultivate(pc)) return {state:'disabled', reason: "There is nothing here to apply this to."};

		if (!this.getValidTargets || !num_keys(this.getValidTargets(pc))) return {state:'disabled', reason: "There is nothing here to apply this to."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var target;
		if (msg.target){
			target = msg.target;
		}
		else {
			if (this.getValidTargets) target = this.getValidTargets(pc).pop();
		}

		if (!target){
			return false;
		}
		else{
			var txt = "Are you really sure you want to remove this "+target.name_single+"?";
			if (target.has_parent('proto')){
				txt = "Are you really sure you want to cancel the project on this "+target.name_single+"? All contributions made so far will be lost.";
			}
			pc.prompts_add({
				title			: 'Please Confirm!',
				txt			: txt,
				is_modal		: true,
				icon_buttons	: true,
				choices		: [
					{ value : 'ok', label : 'Yes' },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid,
				target_tsid: target.tsid
			});

			return true;
		}
	}
};

function getValidTargets(pc){ // defined by wine_of_the_dead
	function is_cultivated_item(it){ return (it.proto_class || (it.has_parent('proto') && it.hasInProgressJob(pc))) && it.class_tsid != 'furniture_tower_chassis'; }
	var item = pc.findCloseStack(is_cultivated_item, 200);
	if (!item) return [];
	return [item];
}

function modal_callback(pc, value, details){ // defined by wine_of_the_dead
	if (value == 'ok'){
		var target = apiFindObject(details.target_tsid);
		if (!target) return;

		if (target.x < pc.x){
			var state = '-tool_animation';
			var delta_x = 10;
			var endpoint = target.x+100;
			var face = 'left';
		}
		else{
			var state = 'tool_animation';
			var delta_x = -10;
			var endpoint = target.x-100;
			var face = 'right';
		}
					
		// Move the player
		var distance = Math.abs(this.x-endpoint);
		pc.moveAvatar(endpoint, pc.y, face);

		var annc = {
			type: 'itemstack_overlay',
			itemstack_tsid: target.tsid,
			duration: 3000,
			item_class: this.class_tsid,
			state: state,
			locking: false,
			delta_x: delta_x,
			delta_y: 20,
			uid: pc.tsid+'_wotd_self',
		};

		pc.apiSendAnnouncement(annc);

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: 3000,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -120,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_wotd_all'
		}, pc);

		if (target.has_parent('proto')){
			target.resetJob(pc);
			pc.sendActivity("You poured Wine of the Dead on a "+target.name_single+" and canceled the project.");
		}
		else{
			target.apiSetTimerX('makeDepleted', 3000, true);
			target.wotd = true;
		}

		pc.achievements_increment("wotd", "poured_on_something", 1);
		this.apiConsume(1);
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Wine of the Dead can be obtained in Hell Bar, for a <a href=\"\/items\/1100\/\" glitch=\"item|drink_ticket\">Diabolical Drink Ticket<\/a>."]);
	return out;
}

var tags = [
	"drink",
	"alcohol",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-7,"y":-59,"w":18,"h":59},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEHUlEQVR42s2Yy28bVRTGrz3jGdvj\nxPa4tvN0Hk2gSlq5JUrzqO1x3Ji8IG5SQhMgNglJTBNB2qAWFZCsIgpIgIxalT6oMFQiiyDIAiQQ\nLAybIsECVt0h\/wn5Ez7OHZOoYgvy3JE+jeTZ\/HS+c8\/5rhn7n56da\/HSN+8b5e8\/ThV\/uD4SZSI9\nD7+ebfv59gS++yhp6tsPk\/jx+oghDuDOnPHLnafw2+fTKN+awE83xvDg06miEHAx5th843R36cFn\n0\/j9\/gwefvUs\/vxytvLXzpxXCMBRp1Y5rbixfSlmwv16bxqXk50FYeyNMRadcHsro6qGpKQizhym\n+hjzCgO5KAX2ppgb45IGQ1LLBFgSBi7LfJnNtl4sOxuQswV2mWjPIvPvXug8ipfcjViSgjnhAJeU\n0N5GQ7dZwUXmM4SCe4H5omv1LVjRmrDqaYFw1aP+21wPHUaW6Vh2NULA\/tNL6+GuKiBZ\/BzztYl2\nQMrnD3WYgCtaM719OcEs1pH3t\/0D2AReUaEAc\/YA8t7IIxX0780xv1cQe33GmrsJhUgPNgPt2Ax2\n4GKoEwuecFEYwEmm4cXWdswHwsh4dQy73DhF+1iIKnKIDPMgoXlwnDFTT9jt6JdlAvSKsfJorPxx\n0uHAKZfrAHJAURCTFCww364ANuulfmZH2qcfAHLF3RqGmMwhi1aPmUKCst+kz49RAk2RBpnNtHlI\nVUEtULY8ao0xF7b0MM7IbozZVawxFQOSTFarmGGuiqWAt5i7UKSgekkLIOb0IEq9F7cr2FDqsKJ4\nyGLV2v18mTkLZ+1O5DQ\/Hq\/zIixXAdOqB8cUF8ZtirWAh2TZ4FDdnnpSFZDrKN1PTjicJuAMkw1L\nAXtCQayOJ7GcTmAhNYzpwROION04JgrgzSt5bF97DS9PpfDBxSXcfPM8Uj2PISEJAvh2fh4bmTSO\n0KjZWngar8xN4pwxiCn7PqCUsQwwJCuFmeE+zCcG8MXVC6bFi0\/GMdTZThVUTcAzTClYCpg40oXt\nd7dw\/50t3Lv6qtmDzYoTY2Rx0gR0WLdNwrKjzCv4yet53H1rAzeoH092RNBAJ9kgwEG7CWjdNglL\nSoWPleMNYQx3dSDa3IgIpRsO2C+riFUruGcZIF9tEdoerTSU92fgvjpJMfOQKJhkrPaXqdtMi+Zt\nTszy00p2tkpVsBZ6Z2wqRshebjEHHGeO2l+m+A1ulvbwOarSOu3cVYLNkRYI7hmSYXPgLCWdNGme\n1df+JPMsOELV4fkvSRFrP24lSQlS337Kpm\/8elr7Ctr8ledVP40TF3hofTSwcvHfRqmys6wOWVXH\nXDDoqW0F7XpprTGMtfYG5JoCyHlJ9f+SP2B+yzp18P9xLOnDrKaXrnQcxnu9veDvVQqvB4B1gTL\/\n\/+a\/3PL+Bh2WvsIOcf96AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/wine_of_the_dead-1334277736.swf",
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
	"drink",
	"alcohol",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give",
	"o"	: "pour"
};

log.info("wine_of_the_dead.js LOADED");

// generated ok 2012-07-11 17:02:43 by mygrant
