//#include include/takeable.js

var label = "Butterfly Milker";
var version = "1347677170";
var name_single = "Butterfly Milker";
var name_plural = "Butterfly Milkers";
var article = "a";
var description = "A mechanized butterfly milker. It will gently milk your butterflies in your absence. Good for busy farmers or those with chapped hands.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["butterfly_milker", "takeable"];
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

verbs.drop = { // defined by butterfly_milker
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Place this Butterfly Milker here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){ return {state:'disabled', reason: "You're dead!"}; }
		if (this.isQuestItem()) return {state:'disabled', reason: "This item is needed for a quest and can't be dropped."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_takeable_drop(pc, msg)){
			if (pc.location.pols_is_pol()){
				//
				// Is there already one here?
				//

				var collectors = num_keys(this.container.find_items(this.class_tsid));

				if (collectors >= 10){
					pc.sendActivity("WARNING: You have so many milkers now that you are freaking the animals out a bit. You shouldn't add any more, for sure!");
				}
				else if (collectors >= 5){
					pc.sendActivity("Warning: Too many milkers can confuse the animals and make collection less efficient.");
				}
			}
			else{
				pc.prompts_add_simple("This Butterfly Milker is inoperable. You can use only a Butterfly Milker in a back yard.");
			}

			return true;
		}

		return false;
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
	"sort_on"			: 53,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.collect = { // defined by butterfly_milker
	"name"				: "collect",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Retrieve any milk inside",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOnGround()) return {state:null};
		if (pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc) && !pc.location.acl_keys_player_has_key(pc)){
			return  {state:null};
		}
		if (!pc.skills_has('remoteherdkeeping_1')) return {state:'disabled', reason: "You don't know how to use this contraption."};
		//if (!this.isLeftMost()) return {state:'disabled', reason: "Only one Butterfly Milker can operate in a location. See the Butterfly Milker at the left end of the yard for your milk."};
		if (this.milks_inside) return {state:'enabled'};

		return {state:'disabled', reason: "It's empty!"};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.milks_inside) return false;
		if (!pc.skills_has('remoteherdkeeping_1')) return false;

		//
		// You get all of it, I assume
		//

		var remaining = pc.createItemFromSource('milk_butterfly', this.milks_inside, this);

		var got = this.milks_inside-remaining;
		pc.sendActivity('You collected '+got+' milks.');
		pc.quests_inc_counter('milk_collected', got);
		this.milks_inside = remaining;
		this.updateLabel();

		if (!this.isFull() && this.isLeftMost()) this.apiSetInterval("onInterval", 24);

		return true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canPickup(pc, drop_stack){ // defined by butterfly_milker
	if (this.dropper && this.dropper == pc.tsid) return {ok: 1};

	if (pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc)){
		return {ok:0};
	}

	return {ok: 1};
}

function findButterflies(){ // defined by butterfly_milker
	this.butterflies = {};

	for (var tsid in this.container.items){
		var item = this.container.items[tsid];
		if (item.class_tsid == 'npc_butterfly'){
			this.butterflies[item.tsid] = item;
		}
	}
}

function findCollectors(){ // defined by butterfly_milker
	this.collectors = {};

	for (var tsid in this.container.items){
		var item = this.container.items[tsid];
		if (item.class_tsid == this.class_tsid){
			this.collectors[item.tsid] = item;
		}
	}
}

function getContentCount(){ // defined by butterfly_milker
	return this.milks_inside;
}

function isFull(){ // defined by butterfly_milker
	return this.milks_inside >= this.capacity ? true : false;
}

function isLeftMost(){ // defined by butterfly_milker
	if (this.isFull()) return false;

	if (num_keys(this.collectors) == 1) return true;

	for (var i in this.collectors){
		var c = this.collectors[i];
		if (c.x <= this.x && c.tsid != this.tsid && !c.isFull()) return false;
	}

	return true;
}

function onChangeInterval(){ // defined by butterfly_milker
	this.apiClearInterval('onInterval');

	var owner = this.container.pols_get_owner();

	if (owner && owner.imagination_has_upgrade("remoteherdkeeping_production_2")) {
		//log.info("IMG setting interval to 20");
		this.apiSetInterval("onInterval", 20);
	}
	else if (owner && owner.imagination_has_upgrade("remoteherdkeeping_production_1")) {
		//log.info("IMG setting interval to 22");
		this.apiSetInterval("onInterval", 22);
	}
	else {
		//log.info("IMG setting interval to 24");
		this.apiSetInterval("onInterval", 24);
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by butterfly_milker
	if (!newContainer.pols_is_pol || !newContainer.pols_is_pol()) return;

	this.findButterflies();
	this.findCollectors();

	//if (this.isFull()) return;

	//if (!this.isLeftMost()) return;

	//var collector_count = num_keys(this.collectors);
	//if (collector_count >= 23) return;

	var owner = this.container.pols_get_owner();

	if (owner.imagination_has_upgrade("remoteherdkeeping_production_2")) {
		this.apiSetInterval("onInterval", 20);
	}
	else if (owner.imagination_has_upgrade("remoteherdkeeping_production_1")) {
		this.apiSetInterval("onInterval", 22);
	}
	else {
		this.apiSetInterval("onInterval", 24);
	}
}

function onContainerItemAdded(item, oldContainer){ // defined by butterfly_milker
	if (item.class_tsid == this.class_tsid){
		if (!this.container.pols_is_pol || !this.container.pols_is_pol()) return;

		if (!this.collectors) this.findCollectors();
		this.collectors[item.tsid] = item;
			
		// This doesn't seem to work correctly, possibly due to when various events get fired
		//if (item.isLeftMost() && !item.isFull()) this.apiClearInterval('onInterval');
	}
	else if (item.class_tsid == 'npc_butterfly'){
		if (!this.butterflies) this.findButterflies();
		this.butterflies[item.tsid] = item;
	}
}

function onContainerItemRemoved(item, newContainer){ // defined by butterfly_milker
	if (item.class_tsid == this.class_tsid){
		if (!this.container.pols_is_pol || !this.container.pols_is_pol()) return;

		if (!this.collectors) this.findCollectors();
		delete this.collectors[item.tsid];

		//if (this.isLeftMost() && !this.isFull()) this.apiSetInterval("onInterval", 24);
	}
	else if (item.class_tsid == 'npc_butterfly'){
		if (!this.butterflies) this.findButterflies();
		delete this.butterflies[item.tsid];
	}
}

function onCreate(){ // defined by butterfly_milker
	this.milks_inside = 0;
	//this.apiSetInterval("onInterval", 24);
	this.updateLabel();
}

function onInterval(){ // defined by butterfly_milker
	/*
	//
	// Have to be in a POL
	//

	if (!this.container.pols_is_pol()){
		//log.info(this+' is not in a pol');
		this.apiClearInterval('onInterval');
		return;
	}


	//
	// Are we full?
	//

	if (this.isFull()){
		this.apiClearInterval('onInterval');
		return;
	}
	*/


	//
	// Are we enabled/leftmost?
	//

	if (!this.isLeftMost()){
		//log.info(this+' is not leftmost');
		//this.apiClearInterval('onInterval');
		return;
	}

	//
	// Too many collectors?
	//

	if (!this.collectors) this.findCollectors();
	var collector_count = num_keys(this.collectors);
	if (collector_count >= 23 || (collector_count > 3 && is_chance((collector_count-3)*0.05))){
		//log.info(this+' collection fail');
		return;
	}


	//
	// Scan for butterflies
	//

	if (!this.butterflies) this.findButterflies();

	for (var tsid in this.butterflies){
		var item = this.butterflies[tsid];
		if (!item){
			delete this.butterflies[tsid];
			continue;
		}

		if (item.class_tsid == 'npc_butterfly' && !item.isSad()){
			var location = this.getLocation();
			var owner = location.pols_get_owner();

			//
			// Are we the closest non-full milker?
			//

			//log.info(this+' took milk from '+item);
			this.milks_inside++;
			this.updateLabel();
			this.broadcastStatus();

			// take life
			var result = item.removeLifePoints(owner, 1);

			if (result.dying) {
				// butterfly has a chance of dropping stuff
				var chance = Math.random();

				if (chance < 0.1) {
					// 10% chance of butterfly egg
					this.container.apiPutItemIntoPosition(apiNewItemStackFromSource('butterfly_egg', 1, item), item.x, item.y-20);
				}
				else if (chance < 0.5) {
					// 40% chance of 2 milk
					this.container.apiPutItemIntoPosition(apiNewItemStackFromSource('milk_butterfly', 2, item), item.x+80, item.y-20);
				}
				else if (chance < 0.8) { 
					// 30% chance of 3 milk

					this.container.apiPutItemIntoPosition(apiNewItemStackFromSource('milk_butterfly', 3, item), item.x+80, item.y-20);
				}
				else {
					// 20% chance of 4 milk
					this.container.apiPutItemIntoPosition(apiNewItemStackFromSource('milk_butterfly', 4, item), item.x+80, item.y-20);
				}
			}

			if (this.isFull()){
	/*
				// Cancel our timer, look for another one to activate
				this.apiClearInterval('onInterval');

				for (var i in this.collectors){
					var c = this.collectors[i];
					if (c.x <= this.x && c.tsid != this.tsid && !c.isFull() && c.isLeftMost()){
						c.apiSetInterval("onInterval", 24);
						break;
					}
				}
	*/

				if (this.container.pols_get_owner_type() == 1 && owner){
					owner.quests_set_flag('butterfly_milker_full');

					owner.prompts_add({
						txt		: 'Your Butterfly Milker is full! Come back to your house to collect from it.',
						icon_buttons	: false,
						timeout		: 10,
						choices		: [
							{ value : 'ok', label : 'OK' },
						]
					});
				}
				return;
			}
		}
	}
}

function onLoad(){ // defined by butterfly_milker
	this.updateLabel();
	this.onPrototypeChanged();
}

function onPickup(pc, msg){ // defined by butterfly_milker
	this.apiClearInterval('onInterval');
}

function onPrototypeChanged(){ // defined by butterfly_milker
	if (this.timers_fixed_again) return;
	delete this.collector_count;
	delete this.timers_fixed;
	this.apiClearInterval('onInterval');

	if (this.container && this.container.pols_is_pol && this.container.pols_is_pol()){

		this.findCollectors();
		this.findButterflies();

		//if (!this.isFull() && this.isLeftMost()){
			this.apiSetInterval("onInterval", 24);
			this.onInterval();
		//}
	}

	this.timers_fixed_again = 1;
}

function takeMilk(count){ // defined by butterfly_milker
	if (this.milks_inside >= count){
		this.milks_inside -= count;
		return 0;
	}else{
		var diff = count - this.milks_inside;
		this.milks_inside = 0;
		return diff;
	}
}

function updateLabel(){ // defined by butterfly_milker
	if (this.milks_inside > this.capacity) this.milks_inside = this.capacity;
	this.label = this.name_single + ' (' + this.milks_inside + '/' + this.capacity + ')';
}

// global block from butterfly_milker
this.capacity = 80;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("remoteherdkeeping_1"))) out.push([1, "You need the skill <a href=\"\/skills\/22\/\" glitch=\"skill|remoteherdkeeping_1\">Remote Herdkeeping<\/a> to use this."]);
	out.push([2, "This tool only works in your yard or on your home street."]);
	out.push([2, "Too many Butterfly Milkers in a yard may confuse the Butterflies and result in the Butterfly Milkers filling up more slowly."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from an <a href=\"\/items\/1000002\/\" glitch=\"item|npc_streetspirit_animal_goods\">Animal Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("remoteherdkeeping_1") && pc.skills_has("tinkering_5"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/22\/\" glitch=\"skill|remoteherdkeeping_1\">Remote Herdkeeping<\/a> and <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a>."]);
	return out;
}

var tags = [
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-69,"w":47,"h":69},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG2ElEQVR42sWYa08UZxTH\/QZ8gSZ8\ngJqQ9E3fNEENKohy8VKJtYCUClrMEm4WUNaKoCJIbUKqCCzEBkq5LCDIdVlguYNug9ByWVhRYAUX\nFlSUxBf\/nvO4s1mGhVh2iU\/yZAZm55nfnOdc\/md27XLBOHDggMf+\/fs9+bjrc4579+65paWlKUND\nQ5URERHZfDxx4oSCJo4fP46DBw8iICBAGR0drY6Li9MGBQVpCTybwC18jSed6+no73K45ORkd4VC\nYfH19YX0MJ6HDh3C0aNHwf\/39vZGYmIioqKiEB4ejqSkJBw5cmTd7+1AXWtterCWYWhhNW+nNNki\nDMaAPCMjI3Hq1CmcPn3aEh8fL84JSMFreHl5ubFFrZBGl8Hl5+d7hIWFCTj5NYaULMnWOnPmjGQl\nI1v2\/PnzfK6V+azSasUQlwDevn0729\/fH\/v27XOXX2OrkN8JKPZDO0CG1pNbCHD5PeyXjl7Yme3V\nb3adLeXn57cBkC1Efmjk\/8t9jv5W8W9cAkhOb5Rvk\/1oa2vD3NwcSktLERwcDHaHmJgY5ObmgvzQ\nQtEMdgUZYIjLgoX9iN\/Y0bWlpSW39PR0UMrB8PAwLl68iJs3byI1NRVnz55lQO25c+dsgSL3XTn4\ntgY\/gB3b0TWTyeTJPsbzwYMHiI2NxdWrV0W6kQA57cjvZz+0uoJzOTEvL8+dH7QZ4Pz8vAe\/AAOW\nl5fbAClZC0C6ls2B4uh+6xYrnQIsKCjwPHny5JYLZWVlgaoMGhsbheUuXboEqiRISEjQU9D4c8Le\nUUCOws18hbeqpaUFBsMkNBoNmpqaoFarUVFRgaKiIlBpVKWkpHDK+TyAQ0NDKovFApPpJZ48eYKe\nnl60t7ejublFTMqhYEBaY2cAMzIyFJsB9vf3K8xmMxhwcnJqHWBTU7M4Jx8WgJTotQ4AjU4D0uJK\nrhRywMHBQbepqSnL69evsbi4SClmZAOgVtuG+vp6IRo2AdS6BFBeqnjo9XrVysoKGJCTtCPA+voG\n6HQ6YUEKFgvLNZcDXrhwQSUH7Orqcp+ZmcHq6qoAJEs6BKytrUNfX58A5AqjUqmUDgCdq8csPOWA\n9NDst2\/fCsDl5RVMTExsCihZkP2YAs4iB9yqhH5qmdMfPnx43cJkMePa2poANJsXtwTkFGQHyDPE\npYBcBewX4e2l6gEJcH5+YUtADhKuLhIgaUuVTNFonSpzXEftF+nu7vZ8\/\/69DXB2dm5LwLq6OvBL\nMiBXHALU2gtX1oVOJWl2bnvAgYEB5YcPHwTg8ptlXNYkIaImDBHqUFypTdwAWFlZKQBZ+t+4cUNY\nUVrLx8dHyH+65r5dCypYjNoDjo2NqSXA3jkdppaq8ML8FwyzecjpiMRldcIGQBaxjgADAwNhzbGK\nbQGSIjEeO3YMvBBNIYuePXumZcB\/TCMYGW+Bca4cz82lBHgfI5NZCC72QWNrwycB0vYrSkpKkJmZ\nuT0LUpem506N\/AR79uwJscorAVg12oNbM8Bvw3\/j+atStE8UwOuhDrszc3Gr6toGQPZBOeCjR488\nWVxQvd6eaC0uLhYL0BvatpgStHHl\/QpaDd1IawO8rwDNXYX4IcsAXxXgpelDeP63NkBKzpCaKgZl\nQA4+qVvs6Ojg9bfX3fX29vpT1K4DpC2G6Y0JU+8M+OXfj4DeX30hjn71QNafMQj\/I8gGyOKVO0Ke\n3D9bc6GwGAcHi1wuBtsC7OnpUTIgpQelHLDtpQEpLVbAr78UR59sIKUydR0gb3FOTo7YXpZe9oAU\nxZ7sQqQpLS4FNK+aYXo3jusN0x8BAxPEMbhqCPldGfhRBqjTdQoRe\/fu3XWATg9aUM2tJG2TSqoi\nDMhBMvpyAFf61oTf+cR2CMDv7+tQ1vMTrlUkrwN8+vQpqqurhSXl5c6pwc7NeZB9R6oiEuCAaQxR\nFMXfza5AZXkMLzPwzcMO\/FwTgOoW9QZAilgboFzVbHvs3bvXg6YnH+WAxlcv8OvYOMYXGzG9UILo\noSHsTvsd6TVJ6xI1by0LhrKyMty5c8e1gPLBgFRJIFWSdqMGpSPX0Th6C0X9cVTq4h3WYm5L+UsD\nd4c7CtjZ2RlCTZINkBX14Nhj1D6uQUN\/\/aZqhlvRiIgIASpXNC4dFCRKimwbIKuZ6ennW6qZ1tZW\n9Pb2iW3mBsoKqN0xQLIiqehlG+DcnGlLQLpHALIlCWxnAUm+ezDg6OioDXBh4dWmgNw0kTwTgFVV\nVVKKYcDsHfuQzn5IoBZulJaWlkRPYjAYHAJqNK0CsKurW3xYssLp5d3dTmy1+\/DwcCoB6SYnJ1+w\nRR0Btrd3iE8hhYWFFgJTE+D\/1n3\/AU5wurrJ4dGdAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/butterfly_milker-1334269737.swf",
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
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "collect"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "collect",
	"g"	: "give"
};

log.info("butterfly_milker.js LOADED");

// generated ok 2012-09-14 19:46:10 by martlume
