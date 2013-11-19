//#include include/animal_naming.js, include/animal_sadness.js, include/takeable.js

var label = "Caterpillar";
var version = "1354517066";
var name_single = "Caterpillar";
var name_plural = "Caterpillars";
var article = "a";
var description = "A proto-Butterfly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["caterpillar", "takeable_animals", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.fed_count = "0";	// defined by caterpillar
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

verbs.feed = { // defined by caterpillar
	"name"				: "feed",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Caterpillar likes bubbles",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Feed {$count} {$stack_name} to {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.isFood(stack);
	},
	"conditions"			: function(pc, drop_stack){

		if(this.isSad()) {
			return {state: 'disabled', reason:"The caterpillar is too busy complaining to eat."};
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
			pc.sendActivity("With what? Caterpillars like leaves and things that pop.");
			return {
				'ok' : 0,
				'txt' : "With what? Caterpillars like leaves and things that pop.",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//Butterflies start out as caterpillars. Caterpillars need to be fed X tiny/blue/plain bubbles Y times before they turn into butterflies.

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
			var val = pc.stats_add_xp(2, false, {'verb':'feed','class_id':this.class_tsid});
			if (val){
				self_effects.push({
					"type"  : "xp_give",
					"value" : val
				});
			}

			this.instanceProps.fed_count++;
			if (this.instanceProps.fed_count >= 1){
				var location = this.getLocation();
				var new_animal = null;
				if (this.isOnGround()){
					new_animal = location.createItemStackWithPoof('npc_butterfly', 1, this.x, this.y);
				}
				else{
					var container = this.apiGetLocatableContainerOrSelf();
					new_animal = location.createItemStackWithPoof('npc_butterfly', 1, container.x, container.y);
				}

				pc.achievements_increment('animals_grown', this.class_tsid);

				if (this.user_name){
					new_animal.onInputBoxResponse(pc, 'name', this.user_name); 
				}

				this.apiDelete();

				self_msgs.push("It grew into a Butterfly!");

				// pc.feats_increment_for_commit(1);
				pc.feats_increment('animal_love', 1);
			}
		}
		else{
			failed = 1;
			self_msgs.push("With what? Caterpillars like leaves and things that pop.");
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

function isFood(item){ // defined by caterpillar
	if (item.class_tsid == 'green_leaf'){
		return true;
	}
	else if (item.hasTag('bubble')){
		return true;
	}
	else{
		return false;
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by caterpillar
	if (!oldContainer) this.broadcastStatus();
	this.apiSetTimer('onSadnessCheck', 500);
}

function onCreate(){ // defined by caterpillar
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
		'position': {"x":-15,"y":-37,"w":30,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK60lEQVR42s2YCVQT1x7G0bY+7ev2\nWiu2VQjirq0LKqKikSUhIQmZzExCkIQEEHEBBISCYEFQFGqxIkIQqSIWKe4CarW22udBX0V7VESs\nWy2CVKwLaiHBvu\/dGdzapy1PwfPmnP\/JNsn88r\/3+757x8qq3Q50YoEXgirwEldWQCer\/6cj6Azs\no861LIo\/a9kfWm353FjZIv6z8xMS0LkS6JJwAV25P9axdKRby2ru6vZcvYuapt9gutSCgFOWlfp\/\nNb71pK\/MOW323n215fSqSxbMPWuJCjqH1zuMT3cMPeaea0nJr7OgtKEFpIsc4AH\/6pbJT\/pOQJUl\nN7PGYk770YKw05Yiw6kmQccBVjfZGassJgJlDjxlQWCVpSXgpPnLqacs4x53vlM5uumOmFONleYL\nAVXmKwGnmuO0FY3dOwxQ+A1eDDzd4mw43vy18Xhzo\/Fk87f+J81qtri8G5ltnbkaPDihi1C4uqtD\nTu3LHmWWadKd5kWa8mZZQKVlzJQzeK3jVULmoUdpk594y42NzqbKwezg4i6sPNeOli0fSNOmfqRG\n0d6fOUpX1+ikZea94jKz2qq4o8XxyDF+W8Or0rLmWPGW69UT807rVercsSydFcEwpsUMk52oUmWP\nl2ZW2UpKLfnSHZZjsp0twucGJxQmvCjLqbWRlppTPTZfN7usObtZFrolhfUvKPeN3poTurNKusgC\nh8Cqu7O15ZZTmgOW87ojd1UJlejyXABZNuNt5ewdEllRQ66k5Fe4F9WZRRlHL6pzjp0I+a7hROI1\n88UU87\/Niyz\/BldJd35D4i1sCq6Gy+BivPIcAHNeV\/msCfBacLDas6TprrS0CeJNDZAV\/AC\/gu8x\n+2AtYupbEHf1twcV\/uNdqP9pPioqtQS5fgXrDksell3xilKZ2Z9VZeuoqC+rPIuuNnnusICD9Fh1\nForQLaAWHgK16zbYby0PSrHbAv68MvM1SZklzG1PBxk16Z4NS5vCGDo7TxWy9Qd5ZjXp3GXI1tVD\nnnYE1LRieCUfhOfmRh7ocUUgj0rKWsY75JAM74hDqcyxJ2pdSRsKmqnwHaAiSEXuBBWyDcrYvZDl\n1z4R7n5JtjctFBbf7tmeXJ3E4vQ3VfKssaSLE1hNbowmqBBMzC4owwlc\/D4oPq2EZ\/G1v4TjSlR8\nu2JywfVh7ciX0FmlyrRlKJOR1a2dT\/sX7vKLL4Fu7UmIcy89vkulzRBvISrfcBtuRbce1vpGTMq9\n2jQ+64pzu4CxbHo3zvsUiuXvUpRpGBW6zYsKK9lsXLgLftsuwm3d9f+C89jaBJd1N+Cc04BxGfUY\nm16LsZ88LMfUSxidVjPpmfGcnNK7KRSmUSQdhLQ8cwh59FYZCuap43YXGBbsgndGBdxXX\/k93PYm\nCNdcw9glBGThWUyavx+ieRvgEV8I149K4ZRciTEpFzE65RkAZbKclzk7UalWjFbTK2k1Y0olw+tF\nxOHKaHLzNXNKfjKuqoA24zBcM396qNBSM1w\/vwmn9DoCcQGi+A3wjZyO4NlSTJvlAkMIDVlkKpyS\nvq8fueDC2DbBUFR2DwLELX86OTpmvCYUrniFppePoulsNenYFIbJmkuEsYXYywby3iwCmU8bPz\/o\nk7gb6vTDcMl6qFpuzk3IvoIxi2ogTPwahkh\/fBg+EnGRwxAxYwhCpw2G3uAIYeymr0Ym1w1qE6BC\nkWvNKLMkZAUSTC5uJF0LIUZMMV5ZzowqewZDm\/II3AGWMZ0knxeQ8zYT4J20z2qIwvZicvblB4Cu\nhTfJfKsjQ3sGqugFiIwYh8SYEYifMwzh9wCNU\/pBFL4keejC89ZtthCKyhhGuuPP0jmLyMV\/ZAwF\n62Wf1YRJU4+tlSYf2eQZd+CoInZfg1fSwePKuH3nVbO23pAHb4MwhnQw9+cHwzsp7xeMWVwD5\/kH\noQv3R2z4B\/goejiiQobycDMDB0LvM7BRYaA8HIIq2m7UKklGLzVtkjPqlXn01OLLik+OmxVbb5zz\n3d9Yo9t\/s05RWNc4Oa36V0nm2TviVbXw+PQ0pAmHIJ5\/BOKim63etvEOxmf+zA8vJwZDKIOImUMQ\nOWsowoJb4QJ8+8FHPaCCpvsO+Z9MmOaUqspOon3zv5AvPfGLfOM1TN1Xj+mbT2J6yWnQqd9BPHM3\n5CFlUCaXQ511DEziPkjjDmBy3lVMXnO9de6lXeIBXeI2wW+GAiFBg1o7N5XA6fphCtsH3ipBOisV\n9GyrWrsrFNkjWJUpgMytIpWhsFw5bx\/o5SdgzDsC7ZxtYOP3QBLzLTzjD0AZtQdM2Hb4hBZDGbET\nLilVpGv1cPyYgKXW8HBcuUWvgdboAn\/SsUBdfxh8+sKHh+tz1ocWiB0crF5qY\/hnjyECSOPEoPLJ\nT\/BaeOgnrwWHoEz5DsrFh+HxcSXEy8\/BI\/9nSNb\/AjIvoUj7HvKUCohWXIB74Q0+HZxNDQSylocb\nu\/AHiKOy4O03CTqNPXxJcXBahgO0m8eyvd5s89jyewevFeOk0kxbtxmlg9xX1R+VfUFA8uvguf4q\nPLbc4Y33gRFv\/xWeG65DsvkW\/z4nDElJM1zW3oDTkotw+Wgn2DmxMMxSIChwBIKNAxDo15+HbAW0\nDSCA3doMqFDkvXr\/+fClF95w+rSu3L34FshC9ElLJT5j+awlYFyuct2bSDotj8uCNpiG75QPEKjv\nx4uCm3\/BxoGkg3ZgvGxAyXqlKVx7WD9VejgsPvf66EWX9oxbVg+Xghs8wKNgok13eBuZvLb1My5r\nnZbWYcICsg6MTsaMECFmBg2FXtuXF4Pe2x5+5Dk3zBqVAErpu5CJrIskLj3snwpQkHChq2PS8Rhu\nHjmSHOUsg8tUl3U3IVx9DU7LLvMq5aCciWK50J+QfIQY8nzMChmPuREfID5qGD6c\/T5mTR3EC8RX\n3QdqpS1YUip5r2sKsfVUofDtp9yXJCR0FofEjZGFJWDi\/AP8hOfUyYf+Pft4UMSMubSQxq7E9JkT\nEUOguMRImjuSf4wObYXkhlqt7A2WDK+GEnyjlL43\/JlWLxRl38NXN3qvYaYCyugUYrglrauPR+Hu\nlTBxL3RhehJhQ\/komx\/bGmnRYUMxe\/pgfv7NCBhIhphXLwG0i2Ld+jzbXkQotHpRy9q4G3373w6e\nNhpBM4QwhnhBExEORcxSeMxdjUnxZZgYVwpVZDxmBo\/gQTggLmtnB7eC3a8gouApZJi9abvD3l62\n3L2bZ9\/NyRzeedmHEXjrffqeC9T3R4B+APz93oefwQG++lFgfRz58vMbzg\/jo0D3i+sctyjgzZnp\nc0lD2Rp1Iuu\/t+PdA6uuPnRvsZaxu0tgb3MXum+294t7bZzSF9OI1wX7D+QfuTjTa+35rvG+Rwsq\nNZSN3s3tH+23zZRIrP7mzQiEJJYWkwsc0lK2TmSSM2qVbRJL2ayn5b0biCJrKXmvZd6MXRLxuPN\/\n\/AOcrbBKm5O0vBfN\/V47bysFb2gYuyXk4hf5aCLBzmUnlwAy0VsD5SLrVcTPmmSiHvmcp2mUNjLy\nRwq1tO0CLS1QUp7v+cnEPb+RiXpe9BRbzxWLu7\/T3lvfF2hF71HkolUaWvC1VmFn\/bvtp9Nrb4qd\nu4+kZO\/p1bRtgYa2O0ZqI+vV632WtXqBE5qHe3eFlJiy1L1HhOvTJsdfLcGEQkHXPxmeThqV7Ugt\nbbeddPoMJ4I\/KLTzvRXL87sn+LjDmxJ4kGlwWEM6ySreHfCsv\/cf8d8T09ZSaIAAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-04\/1271659230-2555.swf",
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
	"e"	: "feed"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "feed",
	"g"	: "give"
};

log.info("caterpillar.js LOADED");

// generated ok 2012-12-02 22:44:26 by ali
