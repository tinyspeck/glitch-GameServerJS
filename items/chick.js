//#include include/animal_naming.js, include/animal_sadness.js, include/takeable.js

var label = "Chick";
var version = "1354517978";
var name_single = "Chick";
var name_plural = "Chicks";
var article = "a";
var description = "A wide-eyed chick, fresh from the egg. It needs grain in order to reach full chickenhood.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 300;
var input_for = [];
var parent_classes = ["chick", "takeable_animals", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.fed_count = "0";	// defined by chick
}

var instancePropsDef = {
	fed_count : ["Number of times they've been fed"],
};

var instancePropsChoices = {
	fed_count : [""],
};

var verbs = {};

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

verbs.smile_at = { // defined by chick
	"name"				: "smile at",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Caution: potential disappointment",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if(this.isSad()) {
			self_msgs.push("The chick's unblinking gaze conveys its extreme distaste for its surroundings. You feel embarrassed for smiling at it.");
			var val = pc.metabolics_lose_mood(5);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "mood",
					"value"	: val
				});
			}
		} else {
			self_msgs.push("The chick stares back at you with its unblinking little eyes. For such a small creature, this is surprisingly unnerving.");
			var val = pc.metabolics_lose_mood(3);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "mood",
					"value"	: val
				});
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'smile at', 'smiled at', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.feed = { // defined by chick
	"name"				: "feed",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Chicks like grain",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Feed {$count} {$stack_name} to {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.isFood(stack);
	},
	"conditions"			: function(pc, drop_stack){

		if(this.isSad()) {
			return {state:'disabled', reason: "This chick is off its food in these uncomfortable surroundings!"};
		} else {
			return {state:'enabled'};
		}
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (this.isFood(it)){
				uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("With what? Chicks need to eat grain to grow!");
			return {
				'ok' : 0,
				'txt' : "With what? Chicks need to eat grain to grow!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//"Feed"-chick is a verb which takes exactly one grain for the players inventory, gives the player 2xp and advances the chick one grain towards chickenhood

		if (msg.target_item_class){
			var stack = pc.takeItemsFromBag(msg.target_item_class, 1).pop();
			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			// is this really food?
			if (!this.isFood(stack)){
				stack.apiPutBack();
				log.error('chose something we can\'t eat...');
				return false;
			}

			stack.apiDelete();
			var val = pc.stats_add_xp(2, false, {'verb':'feed', 'class_id':this.class_tsid});
			if (val){
				self_effects.push({
					"type"  : "xp_give",
					"value" : val
				});
			}

			this.instanceProps.fed_count++;
			if (this.instanceProps.fed_count >= 10){
				
				var location = this.getLocation();
				var new_animal = null;
				if (this.isOnGround()){
					new_animal = location.createItemStackWithPoof('npc_chicken', 1, this.x, this.y);
				}
				else{
					var container = this.apiGetLocatableContainerOrSelf();
					new_animal = location.createItemStackWithPoof('npc_chicken', 1, container.x, container.y);
				}

				pc.achievements_increment('animals_grown', this.class_tsid);

				if (this.user_name){
					new_animal.onInputBoxResponse(pc, 'name', this.user_name); 
				}

				this.apiDelete();

				self_msgs.push("It grew into a Chicken!");

				// pc.feats_increment_for_commit(1);
				pc.feats_increment('animal_love', 1);
			}
		}
		else{
			failed = 1;
			self_msgs.push("With what? Chicks need to eat grain to grow!");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'feed', 'fed', failed, self_msgs, self_effects, they_effects);
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
	"sort_on"			: 54,
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

function isFood(item){ // defined by chick
	return item.class_tsid == 'grain' ? true : false;
}

function onContainerChanged(oldContainer, newContainer){ // defined by chick
	if (!oldContainer) this.broadcastStatus();
	this.apiSetTimer('onSadnessCheck', 500);
}

function onCreate(){ // defined by chick
	this.initInstanceProps();
	this.broadcastStatus();
}

function parent_onContainerChanged(oldContainer, newContainer){ // defined by takeable_animals
	this.apiSetTimer('onSadnessCheck',500);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"babyanimal",
	"herdkeepingsupplies",
	"no_rube",
	"animals",
	"no_vendor"
];

var responses = {
	"sad_baby_animals": [
		"I don't wanna be here.",
		"I'm BORED.",
		"I don't like this. You promised me fun. This isn't fun.",
		"What is this place anyway, it's rubbish, take me somewhere else.",
		"Take me away from here, it's lame. I hate it.",
		"Don't like it here. It's smelly.",
		"This is boring, why did you bring me here? It's lame.",
		"Where ARE we? It's Lame-o. LAME-O.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-31,"w":30,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD+0lEQVR42u2Yz2vUQBTHx9bfHiL+\nA\/sn5NCbCLl5EoIXQRACPQhCYXvxIAg5iQhiQFQoFHNa8NASUJQeCsGieOjaYEEt9hARCqUFB0RR\nERzznczsJmkyO8nuqocGHrM\/ZpJPvvPemzdDyP71n12sSwzerhFLfG\/L3\/4d1BppSShur4nLweTn\n9Lsjof82nMlWif27S8KkjRIQVmr4b5V4HLb\/Qua44SyuTBWUwsQL2eIexsj9jN9YpZieUbjCWHxu\nSLDi9PtQc1TqOeLN2QiNAnJ4OATDKolHDJcPpKb+iGktg4s6hLnXHOa6LjfvhsOihVYjQH7\/plON\nFFEEpCsGi7ohK150N2ahPxjSu272XgzmXDAZDZP\/RBqqF7VdEhQfEHddVnn9ooxFRiVcOG8wSmn+\nxZLv7hU+pl1XPb\/sIXEc85u2222uQBRFecjYqQSk21Hpe+Een54lCV1XRVVgBEHQg2u1WgzdAd27\nttxSuOiRwSzL4uY4zh4ld1+d1gsWJGOe8StUsM9ZvZsCEkPCMBwIGNw30+kUY3zfLyh\/KdBat\/na\nqXBy2yJ7FMwBbtql49rTJu\/neR4fg\/H5eT41WEG+WqRVSGVSDucIf4A0w8g4\/reo8sWC2\/kxOd\/d\n9phwKXWgAE4nKQPSmkrUtO2+\/wFuvZ9m1m8licBNDZ8lpDvTysNlXWLQFPO0UqcYeGsytmGllvl9\n4y5hc1N52+qUjEObTdiJQEpAdBp2WfuytBcO9viixoqiSjO8Tks6\/nxxYKi1dTdIYYr28qpGragC\n3Fk8GNKnk+UJNvl9Z\/GQFuCPlSSFnOkr1znbhxwwNqgEfH\/nqFMFJ+3r8gR7c\/OEFiSCIgu5YKfK\nNiq9Fs+fNCUcIDYfHKu8EVTUVRK+iMDIBYfKqgIEgJ+fTFI8eGXWYBIW7VbnMLd33nEOJtsx1IWB\n0v++hxM+lMtO88eHR7iaCBqAAR7tmApXqtxCIsQBAggoBFDAZG1sFbXYn2itHoAE4LCppsEuz1Hl\nv0bbyHg+XTHq9EfglO5Jqvyv6T4X6yvSBiIUCRig+FyVSmRftHKN\/nCPz1qgPGng1UtF5awyQCG3\n4UFIzAOLixnClqZTg5KATdpo+bJiamVZX3fthQpIwrJKgakg0Q\/9AVZraeObogbqAUguYbKMUhn6\noT9Uh3Jim6lZ3mvWf1nDmoqHljp8yWpSUI8K5cx6xxo1AgWAxemqMigmiwShnNfo4KiOkvApXUD4\n5vPZVDWxEWs3PeKwREURDQJFkABS60gjuSeiVaQTa9gTLEMUrUFm00TLgDP+RzNtr2\/v5FVM6ciO\n2XJHvOmRW5A14eBW71gXaSqF8cV3m49Lj3wbK\/YH5uQ9D1RVTRwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-08\/1283022343-9829.swf",
	admin_props	: true,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: true,
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
	"babyanimal",
	"herdkeepingsupplies",
	"no_rube",
	"animals",
	"no_vendor"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "feed",
	"t"	: "smile_at"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "feed",
	"g"	: "give",
	"t"	: "smile_at"
};

log.info("chick.js LOADED");

// generated ok 2012-12-02 22:59:38 by ali
