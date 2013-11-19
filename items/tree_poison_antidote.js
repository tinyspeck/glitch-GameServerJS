//#include include/takeable.js

var label = "Tree Poison Antidote";
var version = "1337965213";
var name_single = "Tree Poison Antidote";
var name_plural = "Tree Poison Antidotes";
var article = "a";
var description = "A powerful remedy for recently poisoned trees.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 25;
var input_for = [];
var parent_classes = ["tree_poison_antidote", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "0",	// defined by powder_base (overridden by tree_poison_antidote)
	"verb"	: "apply",	// defined by powder_base (overridden by tree_poison_antidote)
	"verb_tooltip"	: "Save a poisoned tree.",	// defined by powder_base (overridden by tree_poison_antidote)
	"skill_required"	: "botany_1",	// defined by powder_base (overridden by tree_poison_antidote)
	"use_sound"	: "",	// defined by powder_base
	"sound_delay"	: ""	// defined by powder_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.charges = "0";	// defined by powder_base (overridden by tree_poison_antidote)
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

function getValidTargets(pc){ // defined by tree_poison_antidote
	function is_poisoned_trant(it){ return (it.is_trant || it.class_tsid=='wood_tree') && it.is_poisoned; }
	var trant = pc.findCloseStack(is_poisoned_trant, 200);
	if (!trant) return [];
	return [trant];
}

function onUse(pc, msg){ // defined by tree_poison_antidote
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (msg.target){
		var trant = msg.target;
	} else {
		var trant = this.getValidTargets(pc).pop();
	}

	var mood = pc.metabolics_add_mood(10);
	if (mood){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: mood
		});
	}

	delete trant.is_poisoned;
	trant.apiCancelTimer('die');
	pc.location.overlay_dismiss(trant.tsid+'_poisoned_all');

	var pre_msg = this.buildVerbMessage(msg.count, 'apply', 'applied', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

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
		'position': {"x":-11,"y":-54,"w":23,"h":54},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH0UlEQVR42t3YeVDTZxoHcHe7szNW\nOT3KJXcgchUQsHIJcgQkIAkJRyAICacQMIgIQghX5AiGehEOK3dAheKNaJUBtQoCglXWC9R6traz\nW8fVjgrf\/Rm21k6nO7N\/JMz0N\/PO\/DL5I595nvd5n\/fJvHl\/5ueAhDm\/XczkNpbQd9UVBl9oENEH\n2yuYgy2ljMEOcehQaxnjkqyccVKaH7QpJ9ZuidKBMkmIZdfnoaOdVWH\/6pSET8vKmWgooaOtjIGO\nCuJdRJ+pygl4XZTiOUlfY2qvdOCR2ghyqzjkflM5HfslTDRto2FvwTrU5gdCmkdFVZYfhClrkBTq\n8GNSuK2h0oF9fR5\/2ytad1uSG4B9pcGoLghCtSAA2zMpKOJ5g4gcMtirEEm1esZkzvtoTvZha2XI\nSGM5fVq8xR\/FfD\/UFgehaosfKjdRUJbujYzoVYgJtn02Z4XSUk6T1RQFvaoXBaOpPAQEGC1iOkQE\nTpjsAX60M2JpdnMDjDrn4ZdXuPr6bsHatw2lNLQRuKYyGvbkBaCC74NsjgvSo1bO+AebPmH2rMoW\nXmMuVBpOeC3B1bvb\/CY1h\/R2S6LLTPlGH3ye7QcxkdqCDWuQn7ga6ZFOiKJaz3jQDacdd+v8lHEl\nfIfSgPk34+Opxz59unGUgeRmKiJ5Dojh2COWYYeYdbbvYPAKMIJbij7cJCZwl5q9TB2iSZUGZPY5\narH63YeEd+PebBpkzfhIbGGVpgP9CBXohxGLpQLD9aqwyFk8415jNkNpsX4mvBnvrdQ9mDnOXsD4\nauXupP6gF\/ZFuiClqcMkQQ1GcaowTlCFKU8dtkXab1xrTboTvqaS56RQHI5qOXEv+T5Ju8iAz04b\nmCZowCBaBQbrVWCyQQ0uO0gvbPcudVG+DPP+wjywar5zp14Ud4jyQ9YIGyuyDeQpXsacXYbRqnAU\nL3u5ok6Hy+71XSAUzvurciqY6CCpw1Ry6te00qAuhweZE6xpOTDH8HdAW5EWvOotf+b0BOxNOR9o\nyQRT8R0l9xu2A+2wU0\/iucBX2WPrkXKRhuSzNLiLLECK0cQyhop8GUSpwDRVDeaZGrDN1X7t32A\/\nkD0WbadwYMpwcCX9mNM\/8+9wIbjGRepZBkIa3OBaSIYZd8lsBBmzUXxXzWZ8Ddjn68FVQnqRdGFd\nicKBiYNUqU+H5XNunz9455jgHKPCV2IPyw3aRAQXwyhC\/VcgkXJSqjpscrTgUKb\/Mm4gQKJwYNZo\nhDS0\/bPn7pWmcC4xxkqhMVwKyLDh6cKE\/WuKfwEuT1gMpyx9BO6we5VxKXy3woHtd0XSsYnm5\/XH\nMsCvDgQ11wbuaaZwjFsG62gtWEfNLieOATxTzJAo8oG4MQ4XhqRv6m\/ldioc+OU9cdu9qUP\/nrq6\nH2Pn63DhZCU627JQtSsam4vWgrXVCZmF\/tizh4Mj7bk43yPBlXP1+Ga8FV\/cEJxVOPD0A+ng\/alD\n+BB4qqsQ3S2bIa5mwbXYBBV7wuWfT3UWvAdOjMtw\/E7V3ACPdwpQ9UU0vEvJsCvUhUcJCZI6No4f\nzJsD4LfVQx8CT\/eUYGcHFyE77WFfrCsH2hbogFphg52tHJw6sU25wIGHewe\/nTr8HnjkhACFMiZY\nVSvxaZ6OHGe99RP4FlogryGE+F4oB\/5jvB29d3YpHjj2uH3o0d2j74F9x8tQ3ZiI4CLiLNy0FFYE\njsTTgEO6HspronDq6GwEb4534NLkPsUDbz3tHnxy97gcODxQjbaDmUiQeMMuQw\/ktMUwS9OEAZfo\nxRw1RJR8hloZD5cHanBrfD9GJ9uUC7zcvwdN+\/mIE62BVZwOSPGLYJqkDr3IhdCjqyCxyBu1bTwM\n9UuVA9x2O3bJxOPOsV+AJ3tKUVrNhksyCcbhi2AYri6PnFbQAmj7L4A7xwwF21k4caxMOUDhjTib\nh9+fmPj+Xg+uDzej+WAWNlYEInKrK4JSbWBAV5dH7hPKx\/CMJoGR7oRkoR8aZFm4OtyCyclDigc+\n\/6F\/4sd7p+TAM71iHO4SQNacATExG1vRNKG9lkiv98fIzvSGrJGP7gMC4iiqxLXLrfhuqlfxwFuP\nuyae\/jfFH3aSyjwK\/IOWwth3IaxdF2BLsutvOsm7FF+9qYQUlw3HTRy9XIqJKy2\/AYo2uyE+zAR+\nVF0EeGsjhW37HviuSA6cFqLoTIxigcU3OOaRZ92vZ18IR25XOLa3cbGPqNKmxnSUi9ZBkOODrAxP\nbOZ7Ii+HguqaeGyTsrFhpx9YNW4IP+yhWGDWDY5K\/EX\/EcEUB\/FnqGDt80BYuTNoW1dgbboVKCkW\n8E1aDkqyBSiplvDikeHE04c5cat2Ie6PMb0UxZ+DqcP0Q6JHG34WTMQhVOYBm006MI5Vnx2YQlV+\nd2E1jFWVA50rTV5zv\/LvUDhwy9UoPm805LvNI5Fgd\/liOW+JfIL7n8CNGnAs1f8pYzQsQ+HA4tsJ\nJpG9q0fWNttNh7S5wTHPCEYxan8MjFEFmb8IXtUWjwSTCdaK\/1\/mAPOj2D5fhqeU3BnS4XI\/sG7l\nW+cCM2Jo0oLp+kXE0KQBfeb7qW6alKD50D5P9yiz0y1ZeI35d6UM7\/wH\/PmUFgtTWpvzKtZBL6qz\n0LyExF3UoB+hNkJEcUyXsfCKMVuzQY81P50cr+nsUGxkzrvkr\/r\/\/s5\/AOAm8hMInezbAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1297448856-1813.swf",
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

log.info("tree_poison_antidote.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
