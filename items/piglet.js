//#include include/animal_naming.js, include/animal_sadness.js, include/takeable.js

var label = "Piglet";
var version = "1354519612";
var name_single = "Piglet";
var name_plural = "Piglets";
var article = "a";
var description = "One wiggly little piggly. He wants to turn into a big pig. Feed him nourishing plant-y food to help him grow.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["piglet", "takeable_animals", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.fed_count = "0";	// defined by piglet
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

verbs.hum_to = { // defined by piglet
	"name"				: "hum to",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "A mood brightener. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return {energy_cost: 2};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if(this.isSad()) {
			self_msgs.push("You hum an off-key hum, but the piglet is too unhappy here to notice. Its misery is contagious.");
			var val = pc.metabolics_lose_mood(2);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "mood",
					"value"	: val
				});
			}
			var val = pc.metabolics_lose_energy(2);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
		} else {
			self_msgs.push("You hum an off-key hum. Fortunately, piggies are tone deaf. The piglet squirms delightedly. You squirm a little bit, too.");
			var val = pc.metabolics_add_mood(2);
			if (val){
				self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			}
			var val = pc.metabolics_lose_energy(2);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'hum to', 'hummed to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.feed = { // defined by piglet
	"name"				: "feed",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Piglet likes crops",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Feed {$count} {$stack_name} to {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.isFood(stack);
	},
	"conditions"			: function(pc, drop_stack){

		if(this.isSad()) {
			return {state:'disabled', reason:"This place seems to give this piglet the howling fantods, and it refuses food."};
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
			pc.sendActivity("With what? Piggies will eat just about anything that grows in the ground!");
			return {
				'ok' : 0,
				'txt' : "With what? Piggies will eat just about anything that grows in the ground!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//Piglets need to be fed any crops 3 times before they turn into Piggies.

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
			pc.stats_add_xp(2, false, {'verb':'feed','class_id':this.class_tsid});

			this.instanceProps.fed_count++;
			if (this.instanceProps.fed_count >= 3){
				
				var location = this.getLocation();
				var new_animal = null;
				if (this.isOnGround()){
					new_animal = location.createItemStackWithPoof('npc_piggy', 1, this.x, this.y);
				}
				else{
					var container = this.apiGetLocatableContainerOrSelf();
					new_animal = location.createItemStackWithPoof('npc_piggy', 1, container.x, container.y);
				}

				pc.achievements_increment('animals_grown', this.class_tsid);

				if (this.user_name){
					new_animal.onInputBoxResponse(pc, 'name', this.user_name); 
				}

				this.apiDelete();

				self_msgs.push("It grew into a Piggy!");

				// pc.feats_increment_for_commit(1);
				pc.feats_increment('animal_love', 1);
			}
		}
		else{
			failed = 1;
			self_msgs.push("With what? Piggies will eat just about anything that grows in the ground!");
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

function isFood(item){ // defined by piglet
	return item.is_crop ? true : false;
}

function onContainerChanged(oldContainer, newContainer){ // defined by piglet
	if (!oldContainer) this.broadcastStatus();
	this.apiSetTimer('onSadnessCheck', 500);
}

function onCreate(){ // defined by piglet
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
		'position': {"x":-18,"y":-41,"w":37,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEi0lEQVR42s2YXW\/bZBTH8w36EXo5\ncbULuA9vV0hThDYJqRuENeumDUo0EcgKiAwxoSFVCtoqEEmblzbt1qQkbZalsZ3Uy2jZupYE7aJj\n2iDT4CLNWE3GurZj5fCcJ3Z54rwsjW06S385tV3753POc87xMZl03kAQOiDNWSHD+59wSXE9HnOb\ndmorBj32YsATKwa8YikUEDeS8TwBA0UEEDYuxuFRPAqPpxPwT5orQIZzw0xqt+Fwy0Gvi4DBcnAQ\nHk5OAAumwKEQTH1Olt8QMOrCGd4sjYfy988NNwN4utJcTD+ojOCCNJ9vG6aRZgSLNjgSLyR2RPWN\n70dCNWoHEO\/dPhyJEzXUdfdJmD3ZW6N0Xw8snD7RphV5s2a4m1+fhp\/PfAa\/DfbXqBT6Bv5ONYnF\n2SzA9Z8Abt6o7Gtikc9v0628mb2BNDFSF0yRFA6QVBKBjeRU7cNv3wJYXd1S0OOBpbSgzYoyoKT8\n8yY\/DcXhgaaQeP7emKf6oVfmKFS5WKTC330OB7y+Z0\/lXDWkRBeimLa36OJMJ6YBFhIBmkGuJ6LV\nD0WXylC\/36pY8q2uLnhu1y6YHw2pVzPAD98DLM6jrNuzpiq9oCvLxO2s6sbgwlUK9c6RIxRK0csv\nPA9LkfHqa68Si\/54TdaCq610Q13AuL4llcuwlMvBa6++AgdeehG6yf7sqc8BLmX+uwZ\/y3Abc5eI\nBa\/ZNaQe4nrVCm+q3CKFxBicz2ZhiUvVxt\/cZQpXTk3C+mUCm8t1akvelW5Fv2oiA5aiI7A+J2qr\n0bKbwQhAIgkWFzt0qyztCKvRo0Ss+nh2pgKXm9+txa0xPaz1mKz2O76zkO\/\/lO6Xx3xQOu\/3\/zrY\n37mjlmO1KaTgCZ+MrU5FLSuhQa0LgrdrgcGmFTvqP8NjsDI+KpZGfHbNUKqUIrXlStLIYreNXTf5\nLPCvhL\/t0L17rtcHtirScctwXtFkxKbuaLYrxXpkbzUGUOPCkK0H94Y9ZqMApWcWsNIYaEslCmAx\n6LU8c\/GH+mM0oEC6dwQQk229b2LlGH4zG7aKWwHEkQaq0TkGEHTLgcrUAD+mW7Hgg4nzdc9h5WAB\ndUk1W1WDNAVricn806yHgKRsNUzSTAzq42bWrYp1sI42gvwrGqb1Ffc1LRVjPRReh42B5tSyloha\nsSHd5KZd5cg5F7qqYV9HIPBFsGKor8OXYwHxRTWNONqpJorl0N0Iwa7otQuTVYDKCzyMRfJ3vQPu\n7CfH7ILzcIcezUKhHhzOA9kVjBAYd+w1peEhP3YxdLhJYpWmJdKsXnB0w8R7+yF+\/E2zIalGsRjG\nFfu34kpm9re1cqcchyXho6PAO22Q+uBgIXT0DbehLkYQdDHTsZBVGyyQj\/dCvYGQz7bXGujZJ8aP\nW8XM+7ZOfeOQWKKRq1G\/eL6CK6ccEvehzUrnz0ouJB9GC1+ecJn+r02e1dDpvTIKuT00AOF3u2hM\nRXr3S7Nf9FmTH\/fCd\/YD1J2c0yYi+I5M+LHqFHwDFnTd0KF9IrqRurNnrx2PXXS8LQrOg5aUs1vT\nRP9foL1K7tERphUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-02\/1265424454-1495.swf",
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
	"h"	: "hum_to"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "feed",
	"g"	: "give",
	"h"	: "hum_to"
};

log.info("piglet.js LOADED");

// generated ok 2012-12-02 23:26:52 by ali
