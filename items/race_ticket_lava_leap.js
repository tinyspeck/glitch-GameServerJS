//#include include/takeable.js

var label = "Lava Leap Ticket";
var version = "1340389944";
var name_single = "Lava Leap Ticket";
var name_plural = "Lava Leap Tickets";
var article = "a";
var description = "Challenge another player to Lava Leap.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 20;
var input_for = [];
var parent_classes = ["race_ticket_lava_leap", "race_ticket", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"game_id"	: "race",	// defined by race_ticket (overridden by race_ticket_lava_leap)
	"location_id"	: "2"	// defined by race_ticket (overridden by race_ticket_lava_leap)
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

verbs.activate = { // defined by race_ticket
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Challenge nearby players to a random race",
	"get_tooltip"			: function(pc, verb, effects){

		var name = this.getGameName();
		if (name){
			return 'Challenge nearby players to '+name;
		}

		return 'Challenge nearby players to a random race';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You are too dead to be racing around."};
		}
		if (num_keys(pc.location.getActivePlayers()) <= 1) return {state:'disabled', reason: "You need at least one other player here."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var game_id = this.getClassProp('game_id');
		if (game_id == undefined) game_id = '';

		if (game_id == ''){
			var choice = randInt(0, config.shared_instances.race.locations.length + 1);
			log.info("Ticket choice is "+choice+" from among "+(config.shared_instances.race.locations.length + 1)+" options.");

			if (choice < config.shared_instances.race.locations.length) {
				game_id = 'race';
			} else if (choice == config.shared_instances.race.locations.length) {
				game_id = 'hogtie_piggy';
			} else {
				game_id = 'quoin_grab';
			}
		} 

		if (game_id) {
			this.apiConsume(1);
			var location_id = this.getClassProp('location_id');

			if (location_id && location_id.length) {
				pc.games_invite_create(game_id, this.class_tsid, location_id);
			} else {
				pc.games_invite_create(game_id, this.class_tsid, randInt(0, config.shared_instances[game_id].locations.length - 1));
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getGameName(){ // defined by race_ticket
	var race_id = this.getInstanceProp('race_id');
	var game_id = this.getClassProp('game_id');
	if (race_id != '' && race_id != null){
		var race = config.multiplayer_quest_locations[race_id];
		if (race) return race.title;
	}
	else if (game_id != '' && game_id != null){
		var game = config.shared_instances[game_id];
		if (game) return game.name;
	}

	return null;
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a Ticket Dispenser."]);
	return out;
}

var tags = [
	"no_rube",
	"games",
	"ticket",
	"races",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-18,"w":43,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFtklEQVR42sWY2VIbRxSGeQM\/gh+B\nR+AReIBcUJW7XNl3jh3AJFWU44Aj25hgm0URELMjVqFdICSxaWEzYSn2FCmIC1WeoKOv7TMZBgmB\nLMFUdfVoZjT96T\/n\/N2tsrJbOg5OE7bUZsDpmemr4vP5efze2lawvOyuD0AOTuOhw7OEsrbUhj91\n93Bn8dTWUVQ1tdWqxuZHytHfqJzuVgNyYcUduhO4v06T5Rnl9pfWp9SPTXWqtmdcVTt61A8dDvWk\ntVWN+BwacOd4LgPpeXr7cGeJNHDVr+vV0wHPpfb4bbPiPpAfd8MqujRZeStwR5+SlcAFYn2qprkh\nK5w04Ak\/kCvboXRyI3C\/pHCHp\/EqBnOFOrVCucBavEHVO+tTzrmAsnU8N\/IxmpgoXT4ensUfMEjf\nxDsNVz\/sVSOLs2r9aFFFEiM6nBQJitU++073Dx9\/o5onxlTrhwYDMpZy2YrvcWcJOy9nIAoBlcIb\nMWNQwIB831Wv6n99qKv4Ud23anUnqJJ7C4p0kMpe351Jj3q6q4poIwk7arQPthhwKMdg9Dqco2+0\nzRB6bIbPnANOz7Ncl6JZ25neH3d3lRfN435u+UnbCHANYz49CApKzqGOwAGFkjQ+oyLP8x5Jga\/O\nRzPc8\/YXBhytLzajgcZmBvU5wJwzuISaVJhZm1bRZdeFmQUFUVo+e6b7QkX3uPntea2KABFOoBi4\nKzyti8f8rHX64zm+v3kQVaNuR2XBcLXvXmW1kA5nuy4EBkJhQgkgsHzPvxrVeZkLkOe\/TIFqzNtZ\ncSOPA+4qj0Mdfr0UAnbC8xSLhFfm41B8UltQLkBml2sDigFPhXv1XJrLgPE0oAQGEG\/8c+Gg6ORS\nUOclcPyAbCscub53sqjGPV3552jWcXyhc+i1YSO5GpULGL4GKGq0+T7fY+DB4IDxrCsZuQRHCvBd\n4CLx8XReqxEDxuNquocuwDiXYqp3LnLhmiyppDCCC06jKPqn7Lpx\/srlV9snSxfgAAMQOH9kMOXz\n9d\/Lt8h0kuS\/\/fHygo1oNTJgJ\/9uqMYJv3ofmP4fOjO3ru1HDI\/DRlCKovAsjOt8pEisynEdOCo3\nEBkK5Yf74nG\/\/N50KYyu5XkNNbsV15BNnqAGlfvZAK5qeCZjATcV6LFfGdKT8+R94Pg12eBQbnEv\nqeqdXt02\/17Vzf9xUYeSeRVA+nxgQJEK9Kk\/A2oq1GO7tsfV2duyFgHq0bSlZADJQ9SkSoGiQgG1\n5lc2OFkcAJd3cXD8T7ICOBI7GxyqAQLU\/qd1rRjXUJSEx8\/agyFDQXIuFxwCiJXMpVzpvLOF2eNy\n2QhhRLmV42UjB4EFBLWAw2JofGZKQ00rnFiQPr+OjXDMp1xOMUgzFIkPDD2hRDUB5T4QsqRCNcIM\nMGoCac1DwKhWsZHJQPf1lvfsqOTXiYKOcFirRU9IgaRiUU3WezJNSThRjHNAzYtVqVRCyw4ur8dl\nyz9RUPwOEADJM8AktGYbARIVAeIcv6O3LgB4r3gcNnIjOPNe4tmb6kshBo5CIOcax\/16cNSRUJJ7\nNK7TzNUrKxn61e1Qfo\/LdWzshlOSI9832y5OXRkTBlA8judQTMILEFVsNWdWNGaP+6o9BkuaTOKm\nZV9gXa0AAJy5GCTHCLEVjnDyHsNGirEB4iX4IC998bbGWBiIx9EDQ0+uAcl9wmsOq3l3dm0bue4x\nvTBik9ype\/lEdYa8eiCgAJIpTGaNbBO+2IhvdmC\/qHByZPakIQmTrGwl1wQMRa0rYfIN9QqykZvu\n1naOY2lRxPw3GXDWkJr3s9iIK\/DBWTI4OYKx4Qrz\/kA209kmfLnP\/qFgGynkCEQGbOa\/LWQzbbYR\n8ThtI+6uB7f+B2TGIlJmGPJMmsCxNSza\/yiFHKhjDa38VYGN3GjfWoqDhEclGrBUKTYSjA6nS2Ij\nhc40UpkskcbcnfaSV6rp+A+VZdtESYR5PwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/race_ticket_lava_leap-1318447328.swf",
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
	"games",
	"ticket",
	"races",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("race_ticket_lava_leap.js LOADED");

// generated ok 2012-06-22 11:32:24 by simon
