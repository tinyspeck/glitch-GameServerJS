//#include include/takeable.js

var label = "Ticket to Starlit Night";
var version = "1347495683";
var name_single = "Ticket to Starlit Night";
var name_plural = "Tickets to Starlit Night";
var article = "a";
var description = "Activate this card to float through Starlit Night. Play a twinkling melody as you collect quoins among the stars.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["paradise_ticket_starlit_night", "paradise_ticket", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"location_id"	: "starlit_night"	// defined by paradise_ticket (overridden by paradise_ticket_starlit_night)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGC0lEQVR42u2X2VMUVxSH\/Q\/y6KMv\neUmMouwoOihWoonRxCWpUgmSAhmWYQCHHRmXwoVFUAREmAUDhtUZFRBkmYERkGUUAQVZ3XfLsnyy\nyqpf7rlFtz0ELc20Lylv1Vfddx56vj7n3nNuz5v3ZXwZnzYmJye\/mp6eVgiwuVaCgWERGB0dteh0\nOq3Tfzo1NbVgbGxMPT4+rp0hh80tAmz+koGJiQkHmIQD7DkOsBdASUmJxWlB9ucmEkjdkwaDwQi6\nn82nyJGYgCyCFKWe3l5s2ryV09jU9F65j4naZxGk6G3bHuAg+F+jRty+fZtTVVX1UhZBs\/mcQwSl\nYoODNzkfGzVBjqitrYUsghQxSnNT0yVRrKW1mwtVVF1CXn4NWtuuQG+sw9DQCBe70jPwXjHizp07\n8gpKo3Y4o5yL6Q0XuFzaPiNOFNRyQRLr6b2O\/IKzH5STTZAJWWavNUpp2j4Dh6Qu1Hdw6J6EhodH\nEZdQhMzsijnFPpugdBOQJKWzrr6TU9\/QBYu1X4ya1doHY2nDnHJ3797lyCY4e4eSWITqJLyWJ82Q\n7EBkVBGqa6xzRk2Q+2yClZVN8FuzB57LEuA1wyr\/JPy0PoXdJzqwfmM62tvtc8rdu3dPXkHamW2W\nXsRG74WHjwZ+qxM4W7akwNMnjt\/TlbMsHoGBafhxfTJ7mVS0d9j\/Jffw4UMYjcZpWQSFmqaJPwUP\n71gEBh1FWEQuFKuTmOzuWWjY7\/H425jFr1u3Mkn\/ZPT3D3MxgadPn8rTSejkIdS1H9ZpEBqWDY0m\nDuEhv2H7jgi4eceIuM+wctVu6Aoz2H2sSFxiiYPgkydPZBOcJsHY+JPw9YuGq1cUDu4\/hiPaPISG\nZ\/O5m5caK\/xiHK6pSfs4dO\/mHc0ZHR3H\/fv3ObIJCmVjx87DWK5QISY2A5tXhULD5ju3xcPVM1KC\nSsRXoWbyKhFfPzUuNnaJgrKlWBA8fqIKSz3CEBx8ACEbtNirykfIjkQsXxnBf1\/qGc5eIJJfZ+Pq\nGcEpKDRxuQcPHuDFixfyCQrF9viJagQEpkO5RQtNYBb8\/XbBxV0JFw8lfJgoXZcw2WUrI\/lVQJhn\nZJ3hcgQ9t7i4OMfZ07SLtFVRN8k\/lo6mxlZWD8+z41INCvPzEBKeicXuIexIths+K8KY9C6Rd\/NQ\nluJOUZCe5fSRn+02hbRVnanQQZMQgNzcXNZvh5GXewjJcUqUlVdjF5P0\/56WgAYbf4nCYrfgd7gH\nY806tShHNZCeKZug0AlKTEFIr56Piosp6GXHr+jf5yM15Bu0NV\/gpSMvvwqLXIOYqBLevsGcRW5B\nHEPpWS5G0A4eHBykNah2SpBJaaV9dG\/xEmSXrUV68WoYi45AG+6KtNBvcbowhS\/+Q5mlWOj6B+c7\n10CRDZsTRTni+fPn\/AX1er1CFkGhRWkLvXFYvxa62kjY2luRplyE5D+\/hrXZzAX77UPwYFFbuDRA\nZMOmeIyNTYpyjx49wqtXr9Dd3e28IEuvSdpDGxrPo6Y5FdeHenlKK\/\/KR17WHrG20fqyXx1iqa7A\noQwD2xQ2DAyM4FJzD0zmDi5HvH79GnV1dZTiBc5G0CJt8IT96rBDR5DKSRkfn+IRO3CwHM0tvThV\nUicKvnnzBmaz2fmTDBOclsoRp8sakZ1TzT6eujkkczS3Bteu3RR3KEWts2sAZWea8fOv+xEVU4iu\nrutc7vHjx3j79i1KS0ud\/6KTihG3bk1wuZOnzqPWZIUquoDLJaboOCREgiomRFJJqQYOyd24cYMj\nCDrdRVjaXKRy0nSS6OXOa1yOopaYokdRcR1fayRYzkRJynzOxlNLYsJna33DRTx79owETU7XwNli\nc601EqL1JiCsMyGdhImtN0EwVBnOnyNHkdZ+SE5a14TyMZccodPpEaWORnBIKKzt7fIU6Y6ODoXd\nbucPGxkZ+Wg5qRhBXcNmu8wFMzKz+Prr7+93vgbSYGlwoQcRlBKCfejksDVlIVg3eCk9TFD5eB9t\nbRYuTEOWGvipQ3gRdoTaaDKZtH19fVqbzWZoaWnhL0PZIKiDyHIO\/DL+D+MfVL2KBTmRaYoAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/paradise_ticket_starlit_night-1341012033.swf",
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

log.info("paradise_ticket_starlit_night.js LOADED");

// generated ok 2012-09-12 17:21:23 by lizg
