//#include include/takeable.js

var label = "Powder of Startling Fecundity";
var version = "1351472975";
var name_single = "Powder of Startling Fecundity";
var name_plural = "Powder of Startling Fecundity";
var article = "a";
var description = "This jar of high-potency powder gets under the skin of piggies, chickens and butterflies (up to a limit, one dose can only irritate a certain number of animals) and causes them to fecund their edibles all OVER the place.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1500;
var input_for = [];
var parent_classes = ["powder_of_startling_fecundity", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "disperse",	// defined by powder_base (overridden by powder_of_startling_fecundity)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "POWDER_OF_STARTLING_FECUNDITY",	// defined by powder_base (overridden by powder_of_startling_fecundity)
	"sound_delay"	: ""	// defined by powder_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.charges = "5";	// defined by powder_base
}

var instancePropsDef = {
	charges : ["Number of charges remaining"],
};

var instancePropsChoices = {
	charges : [""],
};

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

verbs.sniff = { // defined by powder_base
	"name"				: "sniff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "THIS VERB NOT USED",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.classProps.verb != 'sniff') return {state:null};
		if (this.isUseable()) return {state:'enabled'};
		return {state:'disabled', reason: "This powder is out of charges."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doVerb(pc, msg);
	}
};

verbs.apply = { // defined by powder_base
	"name"				: "apply",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "THIS VERB NOT USED",
	"get_tooltip"			: function(pc, verb, effects){

		return this.getClassProp('verb_tooltip');
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.classProps.verb != 'apply') return {state:null};
		if (this.getClassProp('skill_required') != ''){
			var skill_id = this.getClassProp('skill_required');
			if (!pc.skills_has(skill_id)){
				return {state:'disabled', reason: "You need to know "+pc.skills_get_name(skill_id)+" to use this."};
			}
		}
		if (!this.getValidTargets || !num_keys(this.getValidTargets(pc))) return {state:'disabled', reason: "There is nothing here to apply this to."};
		if (this.isUseable()) return {state:'enabled'};
		return {state:'disabled', reason: "This powder is out of charges."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_antidote(it){ return it.class_tsid == 'tree_poison_antidote' ? true : false; }

		if (is_antidote(this))
			pc.achievements_increment('tree_antidote', 'antidoted');

		return this.doVerb(pc, msg);
	}
};

verbs.blow_on = { // defined by powder_base
	"name"				: "blow on",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "THIS VERB NOT USED",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.classProps.verb != 'blow_on') return {state:null};
		if (this.isUseable()) return {state:'enabled'};
		return {state:'disabled', reason: "This powder is out of charges."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doVerb(pc, msg);
	}
};

verbs.scatter = { // defined by powder_base
	"name"				: "scatter",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "THIS VERB NOT USED",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.classProps.verb != 'scatter') return {state:null};
		if (this.isUseable()) return {state:'enabled'};
		return {state:'disabled', reason: "This powder is out of charges."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doVerb(pc, msg);
	}
};

verbs.sprinkle = { // defined by powder_base
	"name"				: "sprinkle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "THIS VERB NOT USED",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.classProps.verb != 'sprinkle') return {state:null};
		if (this.isUseable()) return {state:'enabled'};
		return {state:'disabled', reason: "This powder is out of charges."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doVerb(pc, msg);
	}
};

verbs.disperse = { // defined by powder_of_startling_fecundity
	"name"				: "disperse",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Causes abundance of vigor in animals nearby",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.buffs_has('fecundity_cooldown')) return {state:'disabled', reason: "You can't use this Powder again yet."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doVerb(pc, msg);
	}
};

function parent_verb_powder_base_disperse(pc, msg, suppress_activity){
	return this.doVerb(pc, msg);
};

function parent_verb_powder_base_disperse_effects(pc){
	// no effects code in this parent
};

function onUse(pc, msg){ // defined by powder_of_startling_fecundity
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	// At most, affect 15 items
	var max_animals = 15;

	var fecundity_scatter_data = {
		"npc_piggy": [0, 18, 12, 10, 8, 7, 6, 5, 5, 4, 4, 3, 3, 3, 3, 3],
		"npc_butterfly": [0, 24, 16, 12, 10, 9, 7, 6, 5, 5, 4, 4, 4, 3, 3, 3],
		"npc_chicken": [0, 150, 120, 100, 80, 70, 60, 50, 45, 40, 40, 35, 32, 30, 28, 25]
	}

	var animals = [];
	for (var i in pc.location.items){
		var item = pc.location.items[i];
		if ((item.class_tsid == 'npc_piggy' ||
			 item.class_tsid == 'npc_butterfly' ||
			 item.class_tsid == 'npc_chicken') &&
			 !item.isSad()){
			animals.push(item);
		}
	}

	var animals_count = Math.min(animals.length, max_animals);

	for (var i in animals){
		if (i >= animals_count) continue;

		var item = animals[i];
		
		var scatter_count = fecundity_scatter_data[item.class_tsid][animals_count];
		
		if (item.class_tsid == 'npc_piggy'){
			pc.events_add({ callback: 'onCreateItemEvent', class_tsid: 'meat', count: scatter_count, x: item.x, y: item.y-1}, 7);

			pc.location.apiSendAnnouncement({
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url('target_effect_powder_extreme'),
				itemstack_tsid: item.tsid,
				follow: true,
	            		duration: 5400,
				delay_ms: 2000,
				delta_x: 75,
				delta_y: 0,
				width: 300,
				height: 300,
				uid: item.tsid+'_fecundity_all'
			});
		}
		else if (item.class_tsid == 'npc_butterfly'){
			pc.events_add({ callback: 'onCreateItemEvent', class_tsid: 'milk_butterfly', count: scatter_count, x: item.x, y: item.y-1}, 7);

			pc.location.apiSendAnnouncement({
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url('target_effect_powder_extreme'),
				itemstack_tsid: item.tsid,
				follow: true,
	            		duration: 5400,
				delay_ms: 2000,
				delta_x: 75,
				delta_y: 0,
				width: 300,
				height: 300,
				uid: item.tsid+'_fecundity_all'
			});
		}
		else if (item.class_tsid == 'npc_chicken'){
			pc.events_add({ callback: 'onCreateItemEvent', class_tsid: 'grain', count: scatter_count, x: item.x, y: item.y-1}, 7);

			pc.location.apiSendAnnouncement({
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url('target_effect_powder_extreme'),
				itemstack_tsid: item.tsid,
				follow: true,
	            		duration: 5400,
				delay_ms: 2000,
				delta_x: 75,
				delta_y: 0,
				width: 300,
				height: 300,
				uid: item.tsid+'_fecundity_all'
			});
		}
	}

	if (animals_count >= 5){
		pc.achievements_increment('powders', 'critter_catalyzer', 1);
	}

	if (animals_count >= max_animals){
		self_msgs.push("Within seconds of scattering the powder to the winds, many nearby critters become extra fertile, fruitful and abundant. They simultaneously drop their meaty, milky, grainy offerings on the ground.");
	}
	else{
		self_msgs.push("Within seconds of scattering the powder to the winds, every nearby critter becomes extra fertile, fruitful and abundant. They simultaneously drop their meaty, milky, grainy offerings on the ground.");
	}

	pc.location.announce_sound_delayed('EFFECT_EXTREME', 0, false, false, 2);

	var pre_msg = this.buildVerbMessage(msg.count, 'disperse', 'dispersed', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	pc.buffs_apply('fecundity_cooldown');

	pc.feats_reset_commit();

	return failed ? false : true;
}

function doVerb(pc, msg){ // defined by powder_base
	// Do we have charges left?
	if (!this.isUseable()) return false;

	// Is this setup correctly?
	if (!this.onUse){
		log.error(this+' is not setup correctly!');
		return false;
	}

	if (msg.target){
		var target = msg.target;
	} else {
		if (this.getValidTargets) var target = this.getValidTargets(pc).pop();
	}

	// Did the verb succeed?
	if (this.onUse(pc, msg)){
		// Play delayed sound, if one exists
		if(this.getClassProp('use_sound')) {
			if(this.getClassProp('sound_delay')) {
				pc.location.announce_sound_delayed(this.getClassProp('use_sound'), 0, false, false,
					intval(this.getClassProp('sound_delay')));
			} else {
				pc.location.announce_sound_to_all(this.getClassProp('use_sound'));
			}
		}

		// Start overlays
		if (this.classProps.verb == 'apply'){
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
				uid: pc.tsid+'_powder_self'
			};

			if (this.class_tsid == 'tree_poison'){
				annc.dismissible = true;
				annc.dismiss_payload = {item_tsids: [this.tsid]};
			} else {
				annc.dismissible = false;
			}

			pc.apiSendAnnouncement(annc);
		}
		else{
			pc.apiSendAnnouncement({
				type: 'pc_overlay',
				item_class: this.class_tsid,
				duration: 3000,
				state: 'tool_animation',
				pc_tsid: pc.tsid,
				locking: false,
				dismissible: false,
				delta_x: 0,
				delta_y: -120,
				width: 60,
				height: 60,
				uid: pc.tsid+'_powder_self'
			});
		}

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
			uid: pc.tsid+'_powder_all'
		}, pc);

		// Use a charge
		this.use();

		if (this.class_tsid != 'tree_poison'){
			// Delete the item if all charges are gone
			if (this.instanceProps.charges <= 0) this.apiDelete();
		}

		return true;
	}

	return false;
}

function getBaseCost(){ // defined by powder_base
	// [0% of BC] + [100% of BC * current wear/maximum wear)
	if (intval(this.getClassProp('maxCharges'))) {
		return this.base_cost * intval(this.getInstanceProp('charges')) / intval(this.getClassProp('maxCharges'));
	} else {
		return this.base_cost;
	}
}

function isUseable(){ // defined by powder_base
	return !intval(this.instanceProps.maxCharges) || (this.instanceProps.charges > 0 ? true : false);
}

function onCreate(){ // defined by powder_base
	this.initInstanceProps();
	this.initInstanceProps();
	this.updateState();
}

function updateState(){ // defined by powder_base
	if (this.instanceProps.charges > 0){
		this.state = this.instanceProps.charges;

		this.label = this.name_single + ' (' + this.instanceProps.charges + '/' + this.classProps.maxCharges + ')';
	}
}

function use(){ // defined by powder_base
	if (!this.isUseable()) return false;

	this.instanceProps.charges--;
	this.updateState();

	return true;
}

// global block from powder_base
this.is_powder = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.skills_has("intermediateadmixing_1")) out.push([2, "You need to learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && pc.skills_has("intermediateadmixing_1") && !pc.making_recipe_is_known("166")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a> a bit more."]);
	return out;
}

var tags = [
	"alchemy",
	"powder"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-46,"w":26,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIz0lEQVR42s2YWU8bWRqGI80P6Iu5\nmMv+AyPlJyD1ReZuWmqNNEomERFJk2QSwmShyUIgbRKWQAgkNmB2zBIccIyNMTZ2bPbNYGOM933D\nBozBeMUs75yqkJ5MNNMXIzvTJb2qqlNSnafe73zf+ewzZzJ4yLiCMjN3skzfLS0781s7JkqbXm0u\n2LC1aIdTrIKWLcj9TQGuNL1XuiVqGtAlXsYqW6D8v0N9uMf8VlH0OofSDIur1PeMwzI4BT1HivGX\nXUpq\/KsCDTx5eXaylF02W9GpWajtwwqLB2P\/B1jfz8DKm8FsRRcWa\/sx87wD2jYRHKJFmN4qoG7m\n047OVffwp8vbCpeL2d9kHG68qC5H8ZCJaUYbFmp6scIcwlr7KA1o48\/SYVW9HsQykaqBi\/VuCQ1I\nO0qcXW0RkvF3mKvqxsST5syHPzBnzTEQmLnKbkz93Ir5ag5U9VxomodpUCqsFKxpQEHL0CenIbWt\nI7TTiy\/7aYcnSpowerMyC4BThhzZ\/VfY1fqwq9ugAbaW7NhWOeEULcE8OAkjAdNzxrHWIabBDX0y\nUB9FXVPOS\/9Ri5H8cvAuPsg8oE65VKhhC7BFSomuU4zxu3UIrbiRdEUhvVML4dWf4RxdgkeqoeFH\nfmTQUMtvhmjHlY9ZmCL3sqJ6yMtbnOfOnTubUUCbUpPrmV2nHducs2Bj0oC4fZcGNHMn6BBvTBlo\nQCppKEgjSRAKkFoO610SKEsawbtahpa84t3e7658m3EX00dHucFEotdsd7lsFlfCanXtr+qtm851\nB8wrJujm17AysYx56SwmR5SQvJcevOWPbfYNjexwBobDrGGhqWJoyHiTyfx9VspM8vAwR7y39501\nHq\/0RCLTap9P3qBUPq0UiV5VCwRvaj9T9akqiDgzM4PDWq1Q4nZXtc3NsbJWB2PpdO5CJHJ+KRq9\nvXN4yN9Ipdjj4fD5D2Rs4r+IerYcibAM8XjJ5N5eCQXIlskyXwfTx8eFW4kEiwBdciSTNTtHR9ww\nkS2ZLPEkk4y5aPT8wheixuYI4ML+ft5qLNazGIu9EgSDeU2Tk+0vJZLMJQmAnK2DgxoRccufSrG2\n0+nezXS6RU0mVhEISupTaU\/16V51CquNRJ6bE4mH6ni8eYy8p16haMkY4DHw5q3VeolMWEDA2glg\nu\/vgoOxzoPVE4rzxC1Fjn2BX4\/Fb9oODB9ZE4sFMJHJnyOXKq8qUi7vxeI8wGLxAJn1AAJtCh4dN\nBPABNTkFYjmV7QtZPgMla\/AmGesnKl6JRsuotVmjUFzICODGzk4r9UJjLFa0G9rvOFJZ9lILa97I\n4KQq9G6+MSBWMwKi5Y8aXmL4+QsMD2+O4eFOMJz1gkZLXZfKzGC77E84QVcqVbSWTJZOk\/eV83h\/\nyQigxe9nyLa3L1hTqTsnWguOYgGkfTYkLRoknKuIqucRWZpCeF6B7SkpgspR+McF8IwNwaUTwb7K\nh41SCweWer5xLR4vHXM4LlVkCnA7EmEIjMZcUzx+42TDg6N9P5K8WUQfD2CfNAMxnwY7ZMfYWZlA\nyD2LTcckNiwf4DVKPgMUwK4VwfygI6jb3y96p1JdqRCJrmSmQKfTV9onJvLXY7HcE78bx6kADrec\niFa\/x95PvQg\/7EHoWT\/C+mkEyrux0dRPA1IOOqfe04D2NQKqHYG5uCNgiEZvNoyM3HwhFudkqsyc\nla2s3KGS4sTrwFHEiyR3GtEq\/kfAu10I1XCx61\/Cxr1W+C43wJ1XD2duLRwtnTSgc11MXBTCUtQW\nWNrcvFgjFDIyWqi929svxtbXL584rThO+pH2mBFrEv8CuF3QjtBb0u0syhE0KOBt6YOrshX2uw2w\nS7lw6sR0mI35DXqRWn2lTiJ5lFHAaDJZ0Ts+fv3EYSaAXhzGXUhtmRBhDiPClyLMEdIOflqDHtJa\nuZu6Yft7HRwkzA7dKGwaAfQXq\/Vto6PX6qTS3Ix3MrLFxYIThwnHCTcOYw4c7JNMDpO2K6TDflD9\nC2BAMQr33+rgLHwNW14NHI3dcJA1aFHzsfZDueGNSMSoyvR+TNbhN\/5QiHk4r4kfJ1wE0I6DiOXX\nAf\/6ArYfKuB43kYDmge7oP5zqemNXP5TdrqZVOqVuXOs\/chtJIA2Amj+j4BUiKk1SAHafySgCiqL\nR2C4UB4bbOwtYSoU32etH9Rp9DU+2eqz+IxGHB+Z3Iovzf9qoXaSdeis7w9Z6zgOzeOO1ma5nJnV\n38aBcLh5jGShk+yv\/oOD89tEu5JVBqUdsuXtCpcZO2S72yTb3SZvhrFldLfupNP5wXT6Dlcmy2NP\nTDCyCribSBQOKBTXqGbAcwoZPAUNfyFqLJhKvSFw+ea9vXy2VFrWPD19NquAYZIsKpOphiq2nyA9\nfn9ewGYrDp7C\/pvS6aveZPIq5TpbLr\/2Vf4CWXM4nohWV\/OoVsrm9RZ4hELXhkAA3+JiI+UoJQrc\nF49f9yeTebZUitkmENzqmJ39\/qsAum027tLY2KBPqVQFR0exIRRiUyaDb2gIdrm826VWM1wLC7Vu\nHs\/uHB2V6gKBploO5063RHLhqwD6TaaQn8\/HlpxsawQwKJUiND2N0NQUNsm1d+AtPH19cPf2wj88\nDB+PBzuLBe7g4ErW4ba83qsekQg2FhM2JhPunh4ExGJsEBBTdTUMz5\/\/C5A885EPody11ddD0NmZ\nHhgY+GN2y4xeb\/ZxubCz2bA3N8NSVwdzbS1MVVUwEjj906cwVlbC1dlJOxsYG4O9tRVr9+5h4fp1\nDLNY41kF9EqkSVdXF+2gvbGRlpmCrKmhAQ0MBvRlZVgvKYHu0SOsFRdDffs21LduYTn\/GqTPnpmy\nmyDLy21+iQQeEkYKjnbwC0Dd48cfRQA1hYW0Vm7cwPL9+xhqbeVmFTAG\/MHtcIhDWm0yMDICBwnf\nlyFeLy2lHdQWFUFdUAANcXC2ogKSrq7pr5LFpLP5nS8UumxWqeSmoaEgBegmSUGdPw+xlpzlr19j\nrLt7iSOT\/el\/meuf1hqa\/71jtCMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/powder_of_startling_fecundity-1334336355.swf",
	admin_props	: true,
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
	"alchemy",
	"powder"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"y"	: "apply",
	"o"	: "blow_on",
	"e"	: "disperse",
	"g"	: "give",
	"c"	: "scatter",
	"n"	: "sniff",
	"k"	: "sprinkle"
};

log.info("powder_of_startling_fecundity.js LOADED");

// generated ok 2012-10-28 18:09:35 by mygrant
