//#include include/takeable.js

var label = "No-No Powder";
var version = "1338861166";
var name_single = "No-No Powder";
var name_plural = "Flaps of No-No Powder";
var article = "a";
var description = "Some tempting no-no powder. You know you shouldn't, but maybe just this once …";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 100;
var input_for = [];
var parent_classes = ["no_no_powder", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "0",	// defined by powder_base (overridden by no_no_powder)
	"verb"	: "sniff",	// defined by powder_base (overridden by no_no_powder)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "NO_NO_POWDER",	// defined by powder_base (overridden by no_no_powder)
	"sound_delay"	: ""	// defined by powder_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.charges = "0";	// defined by powder_base (overridden by no_no_powder)
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

verbs.apply = { // defined by powder_base
	"name"				: "apply",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
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
	"sort_on"			: 54,
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
	"sort_on"			: 55,
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
	"sort_on"			: 56,
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

verbs.sniff = { // defined by no_no_powder
	"name"				: "sniff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Be careful when sniffing powders",
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

function parent_verb_powder_base_sniff(pc, msg, suppress_activity){
	return this.doVerb(pc, msg);
};

function parent_verb_powder_base_sniff_effects(pc){
	// no effects code in this parent
};

function onUse(pc, msg){ // defined by no_no_powder
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (pc.buffs_has('pooped') || pc.buffs_has('super_pooped')){
		self_msgs.push("No-no powder when you're pooped? That was dumb. Total waste!");
		failed = 1;
	}
	else{
		self_msgs.push("Oh! Wow! Oh! The powder may say no-no, but your energy and mood say yes-yes! You're on top of the world! ON TOP OF THE WORLD! Wait a minute...");

		var uses = pc.achievements_get_daily_label_count('no_no_powder','sniff');

		var duration = 360;
		if (uses > 0){
			duration = Math.round(duration / (Math.pow(2, uses)));
		}

		if (duration < 1) {
			duration = 1;
		}

		//if (config.is_dev) pc.sendActivity(' rush_duration: '+duration+' ('+uses+')');
		
		pc.buffs_apply('no_no_powder', {duration: duration});

		pc.achievements_increment_daily('no_no_powder','sniff');
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniff', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	if (failed) this.apiDelete();

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
	out.push([1, "This substance is known to be addictive."]);

	// automatically generated buff information...
	out.push([2, "Sprinkling this will give you the No-No Powder Rush buff (this feels really, really fantastic)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.skills_has("intermediateadmixing_1")) out.push([2, "You need to learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && pc.skills_has("intermediateadmixing_1") && !pc.making_recipe_is_known("168")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a> a bit more."]);
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
		'position': {"x":-12,"y":-10,"w":25,"h":10},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFLElEQVR42u2X61JadxTF8wZ5BB\/B\nR+AR8gg+gp\/7oaO2TdKmMW1SayKQYLzgBQQEJcjFYwC5KHA0CCKgKKB4AwUVNWpW\/\/uPEGhMBttM\nOtNhz6wv55yB39l7rX3OuXOnUY1qVKMa1ahvUjhda7o4iknOD1d+OzuMCKRiLiwUsyHhJLskFPeD\n2pNssO14f7HldO+dBLnVu98E6v1RvPV9ISYy4bwQxXl+BQyO6\/RgGae5MIq5EBgkTvaDON57h+Pd\nRRztLCCfEcXDLb9wmPErChlfy0E60Px1wM7Xmi+PV4WLkzVcHK+CQeKfABa2RQYZQH7Lj8MtHw42\n55FNe8Vs0iNkU+62g5RLcsuOpSSXxXXhqpjAJYerEzBbB+BmCTCX9iKb8iCbdGN\/w4W99VnsJRza\n3YSjNbc223QjWCRgure97hU+nG7g6nQdl3UBLt8eMD13I+BuwondNQd2Vu3IxGbE7dj0vQrctF4q\nMeteYGL0WUUmTTec5n747CrEg1akog4UdoN1Ax79C8Dt+AzSESuifr3oMvdJOKB++HfIn33HpRl8\nDP+shivkN8Ix1Qe3TQmjuguiS4PYohmbcSeOGQwBFusAPKwGTH0KmIm\/RdCjxay5Dza97KPGZQe8\nizaDrI0g06uzfMQfzpLAeeoTJaNOBOcnODR1mcBDvgmko\/Y6AOc\/AiZLgKmIDQHHaAXIouuBbrAT\nI4oHfJLEVRl1bjMgkM8umN8oveTDK+bJz8GeFeJIx13wzoyAbo5sEnCqEXs3hf3U3BcBN8JWiA5V\nTbcM7DeU8h9gVHVCMDyHVS\/VVuCK2WArrQoaGfnrPB9lwYjxgFBYruqAXY+8hXtayWHpD93WAUQX\nTGycc3zFEODeuhsiu4lqMKOqi3dMN\/gLvFY5XGYFrONSsQJ3vBNoLrC7peTRiIpsVGT8EuwKD0Yt\nLLMAg70JlGQZf4He7u8x2vuQ24AgFmbHsBIw1oBNaZ5Dxa5RyjvgmpIh7BmG3fiSw1ksPR+fQpmY\nXUGtp7vMbwf4aMhHJdgQh6XEnuXLsPFr2EQJ9qwWVnSNVQJHGpB2lPz0N5\/197QxmC7ERQ0WnUpM\nG+i8VFEDRyXalQh7x7CzZuf+oGVKninUwC6hZIHwtQVW+F6swHILlMKVitlrAEnqvkccjHw2IG1n\n3b2PoHsIK74xuCy91\/BSxY1LWv36oSAYXoBAYwED20dOnrIybD7j52anZHLYbBm2yq9V4dpNzmFi\n5Cn3Vlma\/l85GHXNrP2DdU2LyLyahUHO4dhYW7\/4iBuUtiv0Q4\/htb3GgmMI8YUJvjRpT3FYsgDb\nY9WwZIEbYZlfqUMEU60hllCX5RU2liZZ5zQlOLbnaA\/X9RxWSjskg7J2YXLkCdwsSQQamdchETQx\nWEcJli3Yil\/Z+vhcuCzj3RxK9foBnFMv2d6UIyaOIxl+w54QOggTch4G26S86dZvMhyUdVSluA8a\nvU\/o5+MPedS8s2m2XPc33CULfCZcvrdD1yHoxlbUivSKGallE5Y86i\/77TY1IP+piUCHX\/6YoK7a\nJ6UctKwQC1ZMNCCxZGIQMyxkzkq4lv16DL\/6EX52XRkwwsbKusYkb\/nqL64EOyRrbyMLjPU9xBv1\nU95d8mw1dFlz7Pi48hGW57VsrFPsul5MjnTCOPKk5Zu8\/pMNysCq3vsHFDCb7k84TXLuX4L0WBTs\nWBcM7Nz44KMDw3Bn83\/2vTLa8\/PdQVnHvTK0UtYBErNIgmxC5xtfdY1qVKMa9T+tvwBvoSHF8qGM\nmgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-01\/no_no_powder-1326315100.swf",
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

log.info("no_no_powder.js LOADED");

// generated ok 2012-06-04 18:52:46 by kristi
