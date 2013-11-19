//#include include/takeable.js

var label = "Ticket to Cloud Flight";
var version = "1347495683";
var name_single = "Ticket to Cloud Flight";
var name_plural = "Tickets to Cloud Flight";
var article = "a";
var description = "Activate this card to sail about Cloud Flight. Tickle the tree-tops, collecting quoins as you fly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["paradise_ticket_cloud_flight", "paradise_ticket", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"location_id"	: "cloud_flight"	// defined by paradise_ticket (overridden by paradise_ticket_cloud_flight)
};

var instancePropsDef = {};

var verbs = {};

verbs.eat = { // defined by paradise_ticket
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Eat this to gain 20 iMG and 1 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.stats_add_imagination(20*this.count);
		pc.metabolics_add_energy(1*this.count);

		self_effects.push({
			"type"	: "xp_give",
			"value"	: 20*this.count
		});

		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "energy",
			"value"	: 1*this.count
		});

		// Add an amusing message. Put "Yum!" in the list twice so it is slightly more common.
		self_msgs.push(choose_one(["Yum!", "Hmm, slightly stale.", "Tastes like chicken!", "The paper got stuck in your teeth.", "Yum!", "You got a papercut on your tongue. Ouch!", "Mmm, not bad.", "Mmm, tasty."]));

		var pre_msg = this.buildVerbMessage(msg.count, 'eat', 'ate', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		this.apiDelete();

		return failed ? false : true;
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
	"sort_on"			: 51,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.activate = { // defined by paradise_ticket
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var name = this.getParadiseName();

		var num_tickets = pc.stats_get_daily_counter('paradise_tickets_activated');

		var ticket_text = (num_tickets != 1) ? ' tickets today' : ' ticket today';


		if (name){
			return 'Be whisked away to '+name+'. You have used '+num_tickets+ticket_text;
		}

		return 'Be whisked away to a random Paradise. You have used '+num_tickets+ticket_text;
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You can't just magically ascend from Hell!"};
		}

		if (pc.stats_get_daily_counter('paradise_tickets_activated') >= 11){
			return {state: 'disabled', reason: "You have already activated the maximum 11 Ticket to Paradise cards per day."};
		}


		/*if (!pc.is_god && pc.stats.quoins_today.value >= pc.stats.quoins_today.top){
			return {state: 'disabled', reason: "You can\'t collect any more quoins today, so this would be a waste."};
		}*/

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var img_cost = this.calc_img_cost(pc);

		if (pc.location.isParadiseLocation()){
			var failed=1;
			self_msgs.push('You already activated a ticket!');
		}

		if (!pc.stats_has_imagination(img_cost)){
			var failed=1;
			self_msgs.push("You need at least "+img_cost+" iMG to do that!");
		}

		if (!failed){

			var location_id = this.getClassProp('location_id');

			var loc_data = {};

			if (location_id && location_id.length) {
				loc_data = config.paradise_locations[location_id];
			}

			if (!loc_data.name){
				loc_data = {name: 'a random Paradise'};
			}

			var text = "Activating this ticket to "+loc_data.name+ " will cost you <b>"+img_cost+" iMG</b> (though you're sure to make it back, and more). Any quoins collected will not count toward your daily quoin limit. Do you want to?!";

			pc.prompts_add({
				title			: 'Go to '+loc_data.name+'?',
				txt			: text,
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : 'Activate' },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid
			});
		}

		if (failed){
			var pre_msg = this.buildVerbMessage(1, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
			if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);
		}

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
	"sort_on"			: 53,
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

function calc_img_cost(pc){ // defined by paradise_ticket
	var base_cost = 20;

	var qm = pc.stats_get_quoin_multiplier();

	if ( qm <= 40) {
		return Math.round(base_cost * pc.stats_get_quoin_multiplier());
	}
	else {
		// cap at 100, which should be the maximum
		if (qm > 100) { 
			qm = 100;
		}

		// increase multiplier by 1 per 4 qm up to cap of 100
		base_cost += intval((qm-40)/4);

		
		return Math.round(base_cost * pc.stats_get_quoin_multiplier());
	}
}

function getParadiseName(){ // defined by paradise_ticket
	var location_id = this.getClassProp('location_id');

	if (!location_id) return null;

	var location = config.paradise_locations[location_id];

	if (location && location.name) return location.name;

	return null;
}

function launchInstance(pc, location_id){ // defined by paradise_ticket
	var its = time();

	var instance_id = 'paradise_'+location_id+'_'+its;

	var instance = pc.instances_create(instance_id, config.paradise_locations[location_id].template_tsid, {preserve_links: true}, {});

	if (!instance){
		log.error('paradise ticket '+this.tsid+' failed to create instance from tsid '+config.paradise_locations[location_id].tsid);
		return false;
	}

	var loc = apiFindObject(instance.get_entrance());
	var marker = choose_one(loc.find_items('marker_teleport'));
	if (!marker) marker = {x: 0, y:0};

	pc.instances_schedule_exit_prompt(instance_id, 4*60);

	return pc.instances_enter(instance_id, marker.x, marker.y);
}

function modal_callback(pc, value, details){ // defined by paradise_ticket
	if (value == 'ok'){
		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var img_cost = this.calc_img_cost(pc);

		var location_id = this.getClassProp('location_id');

		if (location_id == undefined){
			location_id = choose_one(array_keys(config.paradise_locations));
		} 

		if (location_id) {
			if (location_id && location_id.length) {
				var loc_data = config.paradise_locations[location_id];

				if (!loc_data){
					log.error('paradise ticket '+this.tsid+' ('+this.class_id+') specified invalid location_id '+location_id);
					failed=1;
				}

				var success = this.launchInstance(pc, location_id);

				if (success){
					 this.apiConsume(1);
					pc.stats_remove_imagination(img_cost, {'paradise_ticket': location_id});
					pc.stats_inc_daily_counter('paradise_tickets_activated');
				} else {
					log.error('paradise ticket '+this.tsid+' ('+this.class_id+') failed to launch an instance for location_id '+location_id);
					failed=1;
				}
			}
		}

		var pre_msg = this.buildVerbMessage(1, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"t2p",
	"upgrade_card"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-10,"w":38,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFwElEQVR42u2X3U9TdxjH\/Q9254XJ\nYpbdLjHxYrtZQkyWebElJlu2zCmZy5w6dWLYIuJbncpQEAGnUQalRQEDWgsT5L3lTQultKWlb+ec\nvoH4bozxysTku+f56a85ZaBjPd4s\/pJPTk\/Pyemnz\/P7Pc\/vLFv2drwdSxvxePydZDKZJ6Fzkw4L\n4ZREo1Gn2Ww25fyjiURipaIoBaqqml5SSedOCZ0\/JqBpWhYkkQU9Jwv6A6irq3PmLEg\/bmeBAwcP\nwWKxgj\/PZylyLCYxRJCjNO5244svvxJ09\/QsKvdvovZGBDl6327IzxL8r1FjUqmUoLW19bEhgm1t\n7VkRzCVqUo6x2WwwRJAjxmnu6eldUG4iEn2tnF6MSafTxgrqxSKKgumXuMIRtHinMEaSfcEQQnSv\nQrJTdHyVnGGCJOScHzVfLIbewDTafQF4ojHY6MiS1+k7KXVtahoqRXEhsTcmqJ9rnFY\/RZCR6QzT\nPXzkCHYHw7gRiS0oNzMzIzBMcLGFMB7V0BlQ0RnUsvCrSRG9CN07P2pS7o0JslhMi+OSN4aqsWws\nkyqqxhUBfx6LJReVm52dNVZQRm1ajeNy\/xBOm2twqqUdf4zHBI5wXKSSI3jWrWboCyWyxKTc7du3\nYbVak4YISrmuvlbst1TAdq0TvxTuQkl5Bc5NKBiNxjNzTUum0OTTcN6jCmomNQxHkxkxyf37943p\nJLzzkIKmkq0YmPTBcqEbRZvLUXL4PGo9iuCST0U7Ra83FEcdpbfOqwka\/ZqQU1LZgvfu3TNMMClX\n6dGj21BtLsL29QdxaEc1Nn1WhKtTNN+82VhJlmn0qwglUlDUMMLJtBC7deuWwDBBWdcGb3bjk69X\n4KfSLdi5aT\/Kiy0o3nkCTX4FF3wvuEhCei5TRJv6ruCMuRjJ9ExGjjEsxVIwHAkg\/\/s1KCn7GYdL\nSlFR0YDe3kGcb2qkUhND85SaxaWAJqi7MYL9dUfgoBWtpV9EcG5uDo8ePTJOUC6ASIwWhOMqmpub\n0eb2wR8IourkYQy4xtFK9VBAUdNTfHYnNhZ+hIsTPsQoiizH8HNra2src91Nr9K3KtfYMEz176Oq\nZQ38WgJH9qzHvi0f4ExNGWxBBcebK3F1Ws1gD2n4s78Ta79ZAetgV0aO4c6U85afJnWevlV1DFag\n6NxyFFYvh9vbj4L176Hq0Kc4VrgWvRENeyq\/Q5NrGO1hTXDswlEcayhGRXMtbmipjBzXQH6mYYKy\nE1xpr8W+Ux\/jwNnVcDgc2LFhNX7f\/SFKD\/wgVuhpazFONJ1CJ7dAwub1Iv\/Xz7Fu87sY9QwIMYZX\ncCAQ4DlYkJMgSZn0rSocDsPWU4aWa2WitnV1tqO2uhiTHreY\/J7gOKwDLeiJqehRNJQ27EVZ4z4U\nmTZm5JiHDx\/CTfvL+vr6PEMEF2pVemTpULUIjlt+w4CqCU5SNCtq9mL2ZVqZO3fu4MmTJ3C5XLkL\nUnrti8kplHp9XZPlI0XXgnSNCdGqjRJpuiblmKdPn6Kjo4NTvDLXCDoXitoYpa8rHPuHnEb3DdG1\nSCothPop1UO0ufDTuZRjnj17hra2ttx3MiSYnC83FU9glCT+mo6KIwu5qeQEaZPgTSTho6M7nhRi\n9lAUE9TqXHQu5e7evYvnz5+joaEh9ze6xeZamCTGSYDlWmnnbJ+OCMEgReomybLYAF3jyM1QZFks\nFAoJpGDOXYREVi0kp0+phOeZfpWy1DCJxuk+KSdfWzuvd+HBgwcsaM+5Br5ObE63OvWrVJ9Oxk7z\nTQpu3bZdPMeIIm16ldyrxPRyjNlcj10Fu7H5x60YHBoypkgPDw\/nTU5OiodFIpElR03CXWNkZFQI\nlpWfFPPP4\/HkXgN5UBpW8YMYTglDLzqVNKecDHWDx\/rNBJePxXA4nEKYhyE1cKlD\/hHaQq2z2+2m\niYkJ08jIiKW\/v1\/8Gc4Gwx3EkH3g2\/F\/GH8DPlN+GcfqdvwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/paradise_ticket_cloud_flight-1341011960.swf",
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
	"t2p",
	"upgrade_card"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"e"	: "eat",
	"g"	: "give"
};

log.info("paradise_ticket_cloud_flight.js LOADED");

// generated ok 2012-09-12 17:21:23 by lizg
