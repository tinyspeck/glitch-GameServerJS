//#include include/takeable.js

var label = "Ticket to Slip 'N Slide";
var version = "1347495683";
var name_single = "Ticket to Slip 'N Slide";
var name_plural = "Tickets to Slip 'N Slide";
var article = "a";
var description = "Activate this card to frolic amidst the snowy hills of this winter wonderland. Can you play a tune as you collect the quoins?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["paradise_ticket_slip_n_slide", "paradise_ticket", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"location_id"	: "slip_n_slide"	// defined by paradise_ticket (overridden by paradise_ticket_slip_n_slide)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF7ElEQVR42u2X609TdxjH\/Q\/2bq9M\nTLaYXdzGiy26uQSimcg04IWo88KcgjLZ5CIKCJRCBK0UrQRRHJQWRFQKtlWuhdLSdkBLUShXuXu\/\nxxhfmZh893t+2elOEXCsxzeLv+QTzuHFOZ8+z\/N7nt9ZsOD9er\/mt8bHxz+YnJwMEmD3chEahkVg\neHjYolar5X6\/dGJiYtHIyEjc6Oio\/G9U7N4iwO6fMzA2NuYDk\/CBPccH9gNQUlJi8VuQvVxPAumy\nDGg0WtD1dOYjR2ICkghSlJwuFzaGb+I0NjXNKvdvovZOBCl627ZH+Aj+16gRU1NTnKqqqueSCBoM\nRp8IisWMtQ1eqV5P\/1ujJsgRNTU1kESQIkZpbmoycalms5VDcqlZCuQoC6AqLMGpQjWXqtTp35AT\nixG3bt2SVlAcNdXpEsQlZXEpIj45C53OLq9g\/plS9PUPziknmSATssxUayTW4XTB0zfgTSddk9DF\nagOiYpNnFXtnguJN0OvpQ9mlGsgUpxAasY8RgwTZMZwprZgzasTt27c5kglO36Hll65gZfguLPpm\nFf+7JDCMXwssCVwHeW4B+gYG34iaIPfOBDPZi79csQEfLQvxYdmarfj42xAflofugLnNMaPcnTt3\npBWkGquo0mPx8jU4lKlA+C+\/4ef9Kex+LWd1xHbv9aeBofhixXos\/n4tQrZF+4gJcvfv34dWq52U\nRFDYBNv2HcTKjTvhcDhwXlOA0osafBe6BZ+xFIfuDkdQ+FZ8vXozrjZa4BkYQUdXL9ZHRCL\/jzKv\nmMDjx4+lmSR08iC5elMrdsWmIHTHPsjTlEj9\/Ti0lysRlZiEr1aGIWj9D1j64xrIlYVczjM4yjnP\nor47LtVHjnj06JFkgpMkaLLYEH1IjoSULOwIPoiDO3ORsD8dwVs2Y0NkPDZvWoWUY6fYBqqGo72T\ny9VdM8BqbcH+9GNwdLq42N27dzmSCYqnwYlz5dgTfxh7wjKRFXsW2TIlktIOI115BkeOJEGWmw+j\nqQ1Odw8aGpvRNzQGl9sNWV4RTFaHV46QLMViQZvdgSJ1OWJ2JeFklhqKXBXyi9QoqtBBebYEObIo\nFJ1MRndPL5cjrlarcSJtIxzNF71y9+7dw7Nnz6QTFJqtTqdDUcERKBQKGI1GXK44jYyMDFQba1Hf\nasOVhhZUnC+G+8Y\/giePHsKFSg1GWScQ5Ah6bnFxscrf03SAeBoY6lg0dAG4YMiG2WxGTPhCxG3\/\nnL1sCu4eDxpYnVpsbbje28\/l+ofH0e0ZhNnR4RUToMnk95GfFXWQeFSV1UfiQP6HSM5biirtceQm\nByIt6hM421v5BrCxjWB3urmUQDurx142UcRy1APpmZIJCpPgkikWSTkhyCwIhvFyIRSJyxH\/00J4\nepxc0HW9B41Wuw+d7H9iMYJ2sMfjoRqM80uQScnFc9TmMCMpOwwtViNvvPLkSBTkpXnbxwSrq87u\nGyyKXbC73OgfGn5Djnj69Clc7HxZWloaJIngTKNKjLh9iDfCdDHiwYMHePHiBTo6OvwXZOnVT5dz\ns5S12ds5c4nNJke8fPkStbW1lOJF\/kbQMj1qVVeuISE1G\/VNrbPKaS9Uw97uRFllNafGWO+VI169\negWDweD\/SYYJTk5PacE5LQ6k5uC4qgh749Jwc2QUOkMdGkwWLldtqEfGURUamy1ITDuKiL2JaGqx\neuUePnyI169fo6yszP8vutlqbfjmCDRsehxgArY\/O7lYdHw6l6KIkWB5ZQ1ndGyciw0MDHAEQb+n\nCBMJmGsjCGJCrZEcpZWuBSkBEhM+W+vqG\/DkyRMS1PvdA9+2Q+faCEI6CT2rN0Ew+tcY\/hwpmrR8\nvu1jJjlCrS5FbFw8ovZEw9rWJk2TttlsQd3d3fxhQ0ND846aAE0NOzsFkWCuMo\/Xn5sdwfzugbRY\nGgLoQQSlhGAfOipWUxaCTYPn4sMEtY\/ZaG21cGFakvTA+S7hh7Aj1Dq9Xi\/v6uqS2+12TUtLC\/8x\nlA2CJogk58D36\/+w\/gJV0RTG7veIPwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/paradise_ticket_slip_n_slide-1344472900.swf",
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

log.info("paradise_ticket_slip_n_slide.js LOADED");

// generated ok 2012-09-12 17:21:23 by lizg
