//#include include/takeable.js

var label = "Krazy Salts";
var version = "1352322780";
var name_single = "Krazy Salts";
var name_plural = "Krazy Salts";
var article = "a";
var description = "A vital magical ingredient, Krazy Salts should never be mistaken for normal, run of the spice-mill Pinch of Salt. For one thing, you need to save it for <b>Potions<\/b>. For the other, this Salt be KRAZY! Seriously: keep it away from sharp objects.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 33;
var base_cost = 111;
var input_for = [237,241,243,244,249,250,307];
var parent_classes = ["krazy_salts", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "0",	// defined by powder_base (overridden by krazy_salts)
	"verb"	: "",	// defined by powder_base
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "",	// defined by powder_base
	"sound_delay"	: ""	// defined by powder_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.charges = "0";	// defined by powder_base (overridden by krazy_salts)
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

verbs.push = { // defined by krazy_salts
	"name"				: "push",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Push it real good",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		self_msgs.push("Ah. You pushed it, but you didn't push it good. If only there were such a thing as Krazy Pepa. Alas…");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var val = pc.metabolics_lose_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		self_msgs.push("Ah. You pushed it, but you didn't push it good. If only there were such a thing as Krazy Pepa. Alas…");

		var pre_msg = this.buildVerbMessage(msg.count, 'push', 'pushed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

function onCreate(){ // defined by krazy_salts
	this.initInstanceProps();
	this.initInstanceProps();
	this.instanceProps.charges = 1;
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

function parent_onCreate(){ // defined by powder_base
	this.initInstanceProps();
	this.updateState();
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.skills_has("intermediateadmixing_1")) out.push([2, "You need to learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
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
		'position': {"x":-21,"y":-23,"w":44,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIPklEQVR42u2Yu3Mb5xXFVaX15C9w\nn8ZF\/gAVSe8yVcZVapUp1WaSTOQZKY6ikUJL1IOiSVEW36QIgC9AIEguCGAB7ALYxWIfeGPxflI6\nPt+KzCRNxqAVO5PRN3MHAAESv73n3nPv8tq1j+fj+Xh+3LOyH\/t5ulL3F3rDGbM\/vGEOJtf\/pwDD\nmdxSKJ2BpBnINzvIt7rQml0UeiPpJ4cu989\/SxABA5OhVl2o5To0PmbLNZitDrR60wPX3Dbhe5J5\nAV38b0MD+NnidsRdXdtFYPElzg4OYF2AiiAMUqUaTnUTZ3kTsmEhZTrIlCpQKw0PuNAdiN\/xoJ0B\nPv2ggGZv\/LvL7Kn1FlaPFHx1+wnu\/vUZFudWcLi+jeSpBKc\/+id4rtFGrOAgRmApqyOiZKA4Jdjd\nPqy++Mxw5oPA5TuDX+mdQUHvDJHtDJBj6N0h8gy51ERIsfAqlMb8Rhgvv1nG8os17C0uYXfuOXLM\npAAWoQlgZlXK5VGouzhKqT8M0OwMrmudvu70hqgMxvwSArYHyFyEylAuQjzXeAEGoYWUOUq6nypg\ndc2Pl7Pz2H62gATLwhYZZiTsIl7v7f3iSmCiPvLdvr\/IP9QcTdAen6M6HMMmYIk\/E8AKZU65HQ\/s\nEvQSXGRZwF7WZ4Gv0xUXvkMJ6w8eIby1jbXgkX9qsAbwibAKASLA+udv0Zmco8XnNQKWByMYFQfH\niRMc6QUo5fJFxoaehKI+c7QcudZCvNZEot72ykG851zILOL2vdnYH379y0+mgrO6o8\/4Ra6Qsk8o\nAdccDJg1ZqTaQMp2EDVMHJ\/uI59Peu9ZrTayNReyVYTERjhmbb3J6Ahm8wjnLSSZ4csSSIqMi\/qj\nf8759j+bCo4Z+9xqd9zmYIjhoIPRsIN+r4latQAtF0e+aECvNxAzCjCrJfTHlH48IVwDsq4haxmw\n6H2ldhfNfg\/t0RjVlguH3SrkFiUgvFHU33L45OZUcMJArVYL43EX55OBB\/ju7dADrFbz0LQY5HgY\nhwcbcGwZE36u02nArliw2y2UKLvLEmgMJ6i36ryoPDJKBBlekGzqXvYKnT50dnBEL0hT1xyz5\/ZG\nI0wmfYxGPQ9w0G\/BbdgwzRROjv3Yeb1EwDWYRprgbZTLJnQtjlTyCMHgFsKRPag2YVJBRMIbONhf\nRjwrIyqH2c1dGOxouVjF7IZvOmnZkX5Ra+PxkHB9DIdd9Hp1NF0LRUfBcWQH62tzWJh\/gJOID21m\nqNtpElyFLAfxensBD+7\/BXf\/9kc8eXwXO9uLCAReIarEvG4WDWJS2gwnyfNA8NZ0VtIf3eqxGSZv\n3+LduzEhhbQicyay2RMcH+\/gKLwFv++l98W1qo1ut0XIGgw2STZzilBw3Xvv1bezvIj7mH18n81k\nIEMolZlT7RLMdg+vz2Rpfnv7+3ct\/e03ddrG5N07jCYjtNsVglmUToOcCCEq7RJCgiQFEDxcRzwe\n9ODKJRNmQUFel\/mYRiy6hzehDezvvsKzJ3dx96s\/QW00keXSUBRzl5tOtGC7U0kr6q7YH7pjZm7E\naLXKhHPYAFnWUMST0tCjzFAE8dgBTk58yGWjlFwjWBJK+hSxsyCkEwG3xQtYRcD\/Ev+4\/yVerLzw\nZBULgum2kGTdrR2dTrfFEO73ddpAVxgwJ0SZ0llmGunUEWxTZubOYBXifB1mDfqQUSMo2jnYvIBW\n0\/E62rezhNXlp\/C\/foEXCzN4\/uweHn19B4FIGLYwZmbxIKni8ab\/i6m7tjwcO23CiTBosvEE\/6gl\no1HXvEeLkHIiSPkOkE6+8ZqlXOZwN1SUinkc7q\/h4cwdyvlnrK8+82Jp4Ws8ZZMcRSXY7FiJJj01\n3PvGGN8QniVM1u70kKuUKW2akSJckhZiEyJFiWPe61olg0oph2az6PlipWxhc30ec0\/vefHt0iOs\nLM8hfBbh0srupyIJTpWH277Pr7QEcJ766wQscZwV+2POxwHlS3uQ5ZLCDjUImGat0SbUEy+b5VKW\nNVqkaZvotF1K+hB3btNWZv+OvcAKFH5OcRzoxbLXGAv7b25cbXXixBBgHpyIdhsOpRMSFoyEB2nk\n4x6UyN77kAlMQLfI7BW82N9bp+99ySU0D8NWUaw5Xi07tJON46j\/yrsdJ8ZM8RJOBOdsqagSTCFU\nyoNLxIJIxEOe5CJq1SzqrM1azYbDLlZSx4gcBfB0\/rG3uSS505nVGhpU5VQvuFN53b+ewQTXxT73\nb4D0PAGm0ULiBItKB4x9dq7fk1jLRZHLSJ7UtpWDqkQROtxEOLSNbd8GsrYFg3aSJaRCO3m05bva\nTZFRrd\/sTuh3BMxZDsrcKN5L3OQXp5FkF6vKCSFDOIseerDC9xJ8nSVgVj31\/G9\/dxP+nVfY3FiE\nYtATeW9R4RLgsO7mA4dXX93FlS2HIjNn3MPalMLhvYAAFc3isJNNLqCaniLkKReDPY62Vez617xF\nIE3jjnL\/E9mNhHcQ8C0jllHQYc2JLVujTa2EjqUPcuMj6kMplr8wKjWpw4zWOhxDaYWb8sS7y8rX\nalDZjVaJs7SgwR\/Y4KKwSNhVTotNbG0sQdaySOkG3OEIpd4PzNx\/OsGkeiOa0fQKIYVhxwha5PwU\nxZ4rlb0NxGJ289UqdC84ughe6fW9CSSyLzJ35ab4vhldomcdyor0JqnQtGueXagFC43+EHXCxHkf\nKyXpkVztM6aNtKZ7y6lY7R\/v7Hx67cc6Ala4\/zfc2QKxpHTKeq0SUtbzcJptuARP8Z5DY9canLOL\nu6Gb137Kcwm8I8VuyZbjj2R1N2WVkCnXsBON6x\/\/x\/fx\/D+d7wCfnuqGxoPPegAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/krazy_salts-1322523968.swf",
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
	"u"	: "push",
	"c"	: "scatter",
	"n"	: "sniff",
	"k"	: "sprinkle"
};

log.info("krazy_salts.js LOADED");

// generated ok 2012-11-07 13:13:00 by martlume
