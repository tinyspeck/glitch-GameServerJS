//#include include/takeable.js

var label = "Tree Poison";
var version = "1339779313";
var name_single = "Tree Poison";
var name_plural = "Tree Poisons";
var article = "a";
var description = "A lethal concoction, if you're a tree.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 100;
var input_for = [];
var parent_classes = ["tree_poison", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "0",	// defined by powder_base (overridden by tree_poison)
	"verb"	: "apply",	// defined by powder_base (overridden by tree_poison)
	"verb_tooltip"	: "Apply poison, kill a tree.",	// defined by powder_base (overridden by tree_poison)
	"skill_required"	: "botany_1",	// defined by powder_base (overridden by tree_poison)
	"use_sound"	: "",	// defined by powder_base
	"sound_delay"	: ""	// defined by powder_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.charges = "0";	// defined by powder_base (overridden by tree_poison)
}

var instancePropsDef = {
	charges : ["Number of charges remaining"],
};

var instancePropsChoices = {
	charges : [""],
};

var verbs = {};

verbs.apply = { // defined by tree_poison
	"name"				: "apply",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
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

		if (pc.buffs_has('a_too_guilty_mind')){
			return {state:'disabled', reason: "The guilt is too much to bear. You cannot poison a tree until your mind is free."};
		}

		var mood_cost = this.getMoodCost(pc);
		if (pc.metabolics_get_mood() < mood_cost){
			return {state:'disabled', reason: "You are not in a good enough mood to poison a tree."};
		}

		if (this.isUseable()) return {state:'enabled'};

		return {state:'disabled', reason: "This powder is out of charges."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doVerb(pc, msg);
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

verbs.disperse = { // defined by powder_base
	"name"				: "disperse",
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

		if (this.classProps.verb != 'disperse') return {state:null};
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
	"sort_on"			: 58,
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

function parent_verb_powder_base_apply(pc, msg, suppress_activity){
	function is_antidote(it){ return it.class_tsid == 'tree_poison_antidote' ? true : false; }

	if (is_antidote(this))
		pc.achievements_increment('tree_antidote', 'antidoted');

	return this.doVerb(pc, msg);
};

function parent_verb_powder_base_apply_effects(pc){
	// no effects code in this parent
};

function getMoodCost(pc){ // defined by tree_poison
	if (!pc.buffs_has('poisoners_guilt')){
		return Math.round(pc.metabolics_get_max_mood() * 0.10);
	}
	else{
		var buff = pc.buffs_get_instance('poisoners_guilt');
		if (buff.args.is_second_time){
			return Math.round(pc.metabolics_get_max_mood() * 0.60);
		}
		else{
			return Math.round(pc.metabolics_get_max_mood() * 0.25);
		}
	}
}

function getValidTargets(pc){ // defined by tree_poison
	function is_poisonable_trant(it){
		if (it.container && it.container.pols_is_pol() && !it.container.pols_is_owner(pc) && !it.container.acl_keys_player_has_key(pc)) return false;
		return (it.is_trant || it.class_tsid=='wood_tree') && !it.is_poisoned && it.getInstanceProp('dontDie') != 1;
	}
	var trant = pc.findCloseStack(is_poisonable_trant, 200);
	if (!trant) return [];
	return [trant];
}

function isApplied(){ // defined by tree_poison
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];
	var failed = 0;

	var trant = this.trant;
	var pc = this.pc;

	trant.applyPoison();

	if (!trant.container.pols_is_owner(pc)){
		var mood = pc.metabolics_lose_mood(this.getMoodCost(pc));
	        if (mood){
	               	self_effects.push({
	                       	"type"  : "metabolic_dec",
	                       	"which" : "mood",
	                       	"value" : mood
	               	});
	        }

		if (!pc.buffs_has('poisoners_guilt')){
			pc.buffs_apply('poisoners_guilt');
		}
		else{
			var buff = pc.buffs_get_instance('poisoners_guilt');
			if (buff.args.is_second_time){
				pc.buffs_remove('poisoners_guilt');
				pc.buffs_apply('a_too_guilty_mind');
			}
			else{
				pc.buffs_apply('poisoners_guilt', {duration: 420, is_second_time: true});
			}
		}
	}

	var pre_msg = this.buildVerbMessage(1, 'apply', 'applied', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	if (this.instanceProps.charges <= 0) this.apiDelete();
}

function onOverlayDismissed(pc, payload){ // defined by tree_poison
	this.apiCancelTimer('isApplied');
	delete this.trant;
	delete this.pc;

	pc.sendActivity("Good for you, having second thoughts about poisoning that tree! Unfortunately, you wasted a perfectly good bottle of tree poison.");

	if (this.instanceProps.charges <= 0) this.apiDelete();
}

function onUse(pc, msg){ // defined by tree_poison
	if (msg.target){
		this.trant = msg.target;
	} else {
		this.trant = this.getValidTargets(pc).pop();
	}

	this.pc = pc;

	this.apiSetTimer('isApplied',3000);

	return true;
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
	if (pc && (!pc.skills_has("botany_1"))) out.push([1, "You need the <a href=\"\/skills\/15\/\" glitch=\"skill|botany_1\">Botany<\/a> skill to make and use this."]);
	return out;
}

var tags = [
	"alchemy",
	"botany",
	"no_rube",
	"no_trade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-56,"w":27,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGiElEQVR42uXYyVOTdxgHcA+tIAhS\nNgURXKgCLqwiIJAQAtkggSRAgEAgEFkCAklQCEuQsIfdoChLVBCoCtQCKlWHsa0dWw\/aTnvTYXrt\nhT\/h2\/d9FStSO\/bwkkOZeWbehEM+82y\/X7Jt2\/\/hb24gUzFjSlsZNqSsjhpTMWYUY7orHTOmdEx2\nSDHZLn1xpVGosBpwpj9tZfGyHEuX5FgwZ+PuYBYVS0M5MDeI0FDCgiotdN5qwOk+qaFFy4WlIxWj\nRhF6dBy0lsejpYyF+jOxVMi4xwxWBY62ijHSmgK9mo3hC0J0azkw6bhoVsehJD0M51WxFVYDDjTy\nRTdMYvTXJ+Eq0YMTJgks7SkUsvYME9mC40iO82VYDThYy2NcaUrGdaLEU71SKsx1AnRUJuBcXhTy\nREEoywgPtApuqSXYx5Tv8UKniEJ7BRv9NTx0aThoKiX6TxWLSvkppMb7o0bqumIV4IPe+IpLZYeQ\nHuuMLI4vFEn+UAoDkMP3I14fhjDWByqBF3qKv8TyAHfrV81dvZfBlOeOGmUwMhiuSDhhC\/bb4AXb\nQhpph\/x4B7QovPHwIn\/rJ\/lu3T6RKc9traWSiYKk\/R8Fmop8V78d5FlnUHQZvn3iCHtIGbvBCbYH\n67gNFYmBNuASyMQgAhrjIrLaFJOlq5V5IZu9B3HHbMA8aoPYABvEBLyB9pQexdXaSOtkL8bvM0aJ\nyGd1QHca9UURG0pMhiBsB8wVx1GUtHdr1wz5gdH+2+fLxfshiXJCXa4fdIqgDUAym7wQWxRw3Yls\nbl+LDti+NUMSffjzwArJgbW2wgCIIxyI0npBEuMOTtAbGPNtmWMC\/g4O0YtFAg\/U5fhZaAf2V4Su\ntSp90VB4EldbZWgsZhCZ2rkhe\/Fvh0QQugPyOBcC5w413wmWmjAMnA2lbx+SzT7VEI7O8gi8+mkK\n3dVJ4ATaUrj3gQmBb9aMKHwHMk7bo1iwGxrxHmhETphqin5B68RerQ7Cz0smfDfbBjnb45OAhYlf\nQCvxhF7mCXP5EdAGvN\/LejHTzsXCiJq488UiiSjhpwAVcTuJDHqgPtsLnUpveoCPzXyfe12nMd+X\ngllzAQyqUOSyXJAV64S8eGcUJBK9xnWBiuNCPSsTnaFMIF+7opjviuo0L9Rl7YUxx4MeIHlULbWF\nYqaDj5GWNFRmHoP4lB1kp3cil+GAQrYj1LxdKObsop7zWA7IId7PjN6JtCh7ZDKcUZ7qjWa5Jz3A\nhnw\/xsWKQJSI\/XGtSwFjGZP4YIdPAmZEOyCL6QIZ043Ym470AFn+tj6GPH9cbMpEexUP92\/UY7xZ\nCH3WQWKFuH4UqEpwgo4YEI3YEyquK1o1AvqGZEhzEn\/8Nosn33TB3CxD9\/kktKoj0Eect91FR9CW\nfwDGXB80yb3RKPeBPmMfGpUn0FObjP4GCZ4\/voTfn03QBxzWnVp9\/mgIf76+h1cvp\/Hy+yt4+qAH\nD+cuYHFaj1mLBrdGz1Ixd02DxSk9Hs0Z8eNyH17+MIrXv9zGk4Ue+oCjNZErSzcbNwGNOgGyeIeQ\nyTkAWeJ+Ks7mnMSdcc0m4OJEHX3A5QHeiqXnzAbghFm94dx9P0j0h8Cla1Wg9STpqBZuAFYqIimM\nJM7rHSw+2AFi5l7q+UPg9a5seoF95zkbgBeq+JgYKqV6cOqyGmXZYe96UBDptgn4VU8anSXmKmqJ\ne9\/7wMWpeqoH14dEWxBFAaeG1SiRhWwCDp1n0AckT5PSZK9NQ1IoOQ52sCM1JPpSJjUkbKLMY72F\nm4CthUfXaAU2Ect6Hfh4vg23x7REVKG9RviuB\/kRLjBqedSamRxS4\/HXbRSQ3IPmqjB6v8STQHJR\nk8C2cykUaH0PrgPJMq\/vQXaII7r0Egq4fKt5a4GyxINICNkFKWsflUFySMj+mzAXoVoVTU22lOVN\nTHrU1gH7y0NWSeCvT8dwe1RHlXjhZi0FFDP2Uv1HlpgEkov6DvH\/iaFyCjjeXYjZdlYfrcCLlWEr\n6xnMTzlKZZAckqq8SKrveg1SalCK0gOhTAlAUpQ7aopZFHDImEX\/TyCm0sC1KnkoUeZODHcqoUj2\n+9ezmMSPEJl79nAQxWI\/+oG5bLe+dIYb5ke0uGvR4dblUixN1\/4jcM6iRX+9EIaSaKQSl1thmN0a\neTOn\/asnN8hW0V+XuvpoxojFcS0mu7NhIX8GNnDRWRaOBkUA1EJP5DId392oU8LtLPxg2\/+E+wsR\nd\/ER6u053AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1297448865-8408.swf",
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
	"botany",
	"no_rube",
	"no_trade"
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

log.info("tree_poison.js LOADED");

// generated ok 2012-06-15 09:55:13 by ptp
