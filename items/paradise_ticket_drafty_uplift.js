//#include include/takeable.js

var label = "Ticket to Drafty Uplift";
var version = "1347495683";
var name_single = "Ticket to Drafty Uplift";
var name_plural = "Tickets to Drafty Uplift";
var article = "a";
var description = "Activate this card to chill out and enjoy a good joke. It's the little things that make life great, champ.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["paradise_ticket_drafty_uplift", "paradise_ticket", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"location_id"	: "drafty_uplift"	// defined by paradise_ticket (overridden by paradise_ticket_drafty_uplift)
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
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-10,"w":38,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFsklEQVR42u2Xy28TVxSH+Q+6q1R1\nwbqVEMtuqLLorptKbRESqOoGCkJVUqm0hTbFygoIKBEESJPYsfMgBucxzjse2xl7JrETv+I4fowf\nseMkvEEIsUJC+vWeW8Ydh0Qk9bCpuNInz2zG35xz7jl39u17v96vva3V1dUPSqVSnQa7N+mwMiQN\nVVUli8ViqvlPi8Xi\/lwu15DP502vaWX3kga7f8ZAoVCogklUwZ5TBXsBmM1mqWZB9ucCCTT+eR5W\nqw10vZW9yJGYhiGCFKXFUAhff3OYM+Ny7Si3m6i9E0GK3tFj31UJ\/teoEWtraxyHw\/HMEEGnc7Qq\ngnqx5eX0nqKmyRHDw8MwRJAiRml2uUQulUpnEY+nuJwgzMPvW8J8II7JyUUulUhk3pDTixHlctlY\nQX3U7tyRGQoXIsGODhGyPw63O8zFRp3Bt8oZJsiEpO1qjQQpapFIEhk1z8XomoQ8nggGB+d2FHtn\ngvpay6g5yIEERl1hzpgrAq+8jFhchZotIBZL7yi3vr7OMUxw6w5Vs3lctXhx4bqLc\/GGWMWlm24I\nU+Fto6bJvTPBWDyDdpsXVztFSMoypr1LMPdLaGF12NrhxjWzGx5fHD5lBcp8BrlccVu5jY0NYwWp\nxsLRJNq6XOixS2jvciCwoMKvpGAfCeC6xc0ZGQ8hsVJiuz7PSiADJZBFYbX0hty9e\/dgs9lKhghq\nPc0xoqCjW2Ttxo1bvTfhl+fRa\/eh0+qu0Gf3w+1bwYx7icmpPIqitFwR03j06JExk4ROHiSXZr3P\n1uvmWC1D+OHIbxgfU2Drc1fo6fdU6O33VpHLF6sEHz58aJhgiQSTSRWSFIXfv4RjXzbgzPfNOHu6\nmd3H4HTKGBjwVLDbvVXcvj3LWlCKi21ubnIME9SabbFYwtx8Ggustr794hSa6ttx2WRmacywmitg\nZmoOw4PeKkYGZyssBOMVOcKwFOsnQjgUxdDQBH6ub8SFc3+hrdWMvj4B4UgBshTD+MjsvwhShQmn\nD5FQoiJ39+5dPH361DhBrdmKooi+7hY0NTWxFuFEZ2cnWi6ehc06AHFcgmt0FuKYtAUfJ8nmtiZH\n0HO7urpaaz1NH9RPA6\/XizbhEK7dOsL72onDB3Dm6EcQZ0TEw6z3TUoVZFGGwghKi5gTFb6LNTmC\nJlPNR35W1HX6UTWj3MQflg9R3\/wxnMMDaDzxCS79+jkGey7xDRBfiGLBIyOnFliDXkcqVWYnm3Wk\nE\/kqOeqB9EzDBLVJIC3Y8HvLITS2fQZxehTnjn+K86cOYMxxgwuusBrNpPPI5jbZrl9HJFpEYD5Z\nJUbQDk4kElSDDTUJMimTfo6m02k0XjiGvsErPGXm9mb88uPhSvtYY+0oHk4xuTKWYuw6tIKN16nV\n5IgnT54gxM6X3d3ddYYI6sfU1omg7236Xbo1ahr379\/H8+fPEQwGaxdk6RW2ykXC6V2JaXKxWBbT\nU5GKHPHixQtMTExQivfXGkFJHzWftITuLg\/\/DQSS7Kgf31GOxJLJAgb6ZYw5FytyxMuXL9n0cdZ+\nkmGCJX1KRXYovWNX2NjKYHIiBLcYxdRkGCsr\/+zSbLbIxQYd8xxFTmDIEWD1mEMqucrlHjx4gFev\nXqGnp6f2L7rtak1VV7mgMBKEUwgiGlXhccfYN8kylyMpkpuZisLriaO8tsHFUqkURxOseYowmYNv\n2wilUplHj8QIqjMS1Itpctpn6+TUNB4\/fkyCQs09cLcbgWpNv0vzubVKOgmB1ZsmePLUaf4cI5q0\naa\/tQ48mR1gs3ahv+AnHT5yEz+83pknLslwXjUb5wzKZzK7l9GIETQ1FmeOCzZev8PqLRCK190Ba\nLA0H6UEEpYRgHzqtrKYkgk2DZ\/rDBLWPnZidlbgwLUN64F6X9iLsCPWVIAimcDhsUhTF6vF4+MtQ\nNgiaIIacA9+v\/8P6G2wwdmtyeJAWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/paradise_ticket_drafty_uplift-1344041683.swf",
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
	"no_trade",
	"no_auction"
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

log.info("paradise_ticket_drafty_uplift.js LOADED");

// generated ok 2012-09-12 17:21:23 by lizg
