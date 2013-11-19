//#include include/takeable.js

var label = "Powder of Mild Fecundity";
var version = "1351472962";
var name_single = "Powder of Mild Fecundity";
var name_plural = "Powder of Mild Fecundity";
var article = "a";
var description = "The dust in this jar of reasonably fecund powder gets up the noses of piggies, butterflies and chickens (up to a point, there is only so much dust) and causes them to shed small amounts of their edibles everywhere.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["powder_of_mild_fecundity", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "disperse",	// defined by powder_base (overridden by powder_of_mild_fecundity)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "POWDER_OF_MILD_FECUNDITY",	// defined by powder_base (overridden by powder_of_mild_fecundity)
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

verbs.disperse = { // defined by powder_of_mild_fecundity
	"name"				: "disperse",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Extra vigor for all animals nearby",
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

function onUse(pc, msg){ // defined by powder_of_mild_fecundity
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	// At most, affect 15 items
	var max_animals = 15;

	var fecundity_scatter_data = {
		"npc_piggy": [0, 6, 4, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
		"npc_butterfly": [0, 8, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
		"npc_chicken": [0, 50, 40, 32, 28, 24, 20, 15, 14, 13, 13, 12, 11, 10, 8, 8]
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
			pc.events_add({ callback: 'onCreateItemEvent', class_tsid: 'meat', count: scatter_count, x: item.x, y: item.y-1}, 6);

			pc.location.apiSendAnnouncement({
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url('target_effect_powder_mild'),
				itemstack_tsid: item.tsid,
				follow: true,
	           		duration: 4300,
				delay_ms: 2000,
				delta_x: 75,
				delta_y: 0,
				width: 300,
				height: 300,
				uid: item.tsid+'_fecundity_all'
			});
		}
		else if (item.class_tsid == 'npc_butterfly'){
			pc.events_add({ callback: 'onCreateItemEvent', class_tsid: 'milk_butterfly', count: scatter_count, x: item.x, y: item.y-1}, 6);

			pc.location.apiSendAnnouncement({
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url('target_effect_powder_mild'),
				itemstack_tsid: item.tsid,
				follow: true,
	            		duration: 4300,
				delay_ms: 2000,
				delta_x: 75,
				delta_y: 0,
				width: 300,
				height: 300,
				uid: item.tsid+'_fecundity_all'
			});
		}
		else if (item.class_tsid == 'npc_chicken'){
			pc.events_add({ callback: 'onCreateItemEvent', class_tsid: 'grain', count: scatter_count, x: item.x, y: item.y-1}, 6);

			pc.location.apiSendAnnouncement({
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url('target_effect_powder_mild'),
				itemstack_tsid: item.tsid,
				follow: true,
	            		duration: 4300,
				delay_ms: 2000,
				delta_x: 75,
				delta_y: 0,
				width: 300,
				height: 300,
				uid: item.tsid+'_fecundity_all'
			});
		}

	}

	if (animals_count >= max_animals){
		self_msgs.push("The powder dutifully does its thing, causing many animals in this location to simultaneously drop their meaty, milky, grainy offerings on the ground.");
	}
	else{
		self_msgs.push("The powder dutifully does its thing, causing every animal in this location to simultaneously drop their meaty, milky, grainy offerings on the ground.");
	}

	pc.location.announce_sound_delayed('EFFECT_MILD', 0, false, false, 2);

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
	if (pc && !pc.making_recipe_is_known("164")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> and complete the associated quest."]);
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
		'position': {"x":-11,"y":-40,"w":22,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIS0lEQVR42uXY205b2RkH8LxBH2Ee\nIY+Qu97mohdVq0qR2s5V22Gm0UxCEgJkZgIOAUKAgMFgA7YxR4PPRwzGxsaAARvb+LB9tvH5gDnb\n8O\/aGxKhidSmklFHqqW\/9gcbaf\/41re2Fty79\/\/0sQlUDakNqhjVbGNPqN3+VeFWmwbvewR6pC1+\nZG1B+OdMMLaOPvjVAKXtI\/edXCWCsnWE5Da4xtVYe\/0\/Auof93210sp+ZP6Z27zRO9PsEWibnXPL\nXEvfFLb6ZrHNXoTlDR\/UoqXZNWNotgtUDzXj8w84HM5XdwoTPWm\/L2\/qM2jbRmDrFjEQulO+GSPT\ntb0xNYyvOAQ5h6Vn\/QgrtxCUrsM7tUzuqbA9uABj10RR\/pot1j5h\/6buQGPLcLf+aS+MLUOkQxPY\nfD+DnSEJg6QRAbEZ9DLTGBdfC\/+8CfsiwzWO\/DIbPdNYax\/DSvMQtN91Paw7MLHiag4srMFPIN7Z\nFeyOyLBHcB6h\/nppSYdoMB0atMuRYp\/A3QIdnARpfSuA9vt3kHzdivk\/NNZ\/PslDm60dfGQ3QuSh\nWqaLZ5EKjqki7B\/m4SbQhGEPIcUG+VqMlZeDDHq9UwhVwxss\/rUF6m\/fkroDxqah+gP3FVZxcsXN\nAHc5MqZLNDBl9kLzzy5YWOOfgGvt41hr48E+IGaAFtYEnDwlA1z9cQSDXz\/l1h1YiKQMWWekXHQn\nUHQkUNiOMd07ChRAwzPk\/Zda8yFucCJCXtbJFRczgxbSdXrTKB53YrqxG7yOYcw876nvDAJ4WL64\nEOyfnLT7Eom4LxrNe+Px1LrXG11zuKOWzd2o3rQelepWo2LlUnRapo0Kxcooe0Hu6VYo9jrk8r3X\nEskWS63WdGq1w11qdXddgbXLS6OjUvmuUKupDqtVa5nEeXzcpovFXkl8vo4Jm407brVyeSQjJMM3\nGSQZMJu5fI9HJIpGNXOp1LOZVKq912AQ1LN7D8KZzM97x8dNpVrNWKpWjUUS6+Fh41qp1GgiMZIs\nFwqNehItiTqXa1SSyEmkmUyjOJ3uXMhkns+nUs+n0ukxrt\/\/vH6vl0Tit3a\/v5U6PWUd12oOgtPT\n+SXQRGAfaz2BqW8BF1MpFrm+INcXMwcH08JEorGuwC2K6ibA9urVVT53caGi8xFopUNq601Nf894\nq5sMMJNhyfP5JlI3kWVWTITDz+oKNDocvX4ycwSYzZ6fS9MkNMpGskliPzpqtN\/Uthss3U39zXJL\nCFCZzTbL0+lmKcmgw\/Gy7sDw2Vk3AWYyFxdzaRIGRuIkuB0SJ6npK43dvOmm6Wa5NbkcDWwhwBYC\nbLkTYOTs7N3F1VU6eX4uokNDXDfxnJw0em5qBnzTzY\/LrSsUWLp8vlWRzbbKSO4EGDw56aodnVXO\ndHup4zWfO7RN9dAgL8HR8ZPaf1O7biHpzWOxez+YDPYty7DCp97xmu8EGD8oDFwVK6gV4rg4COHM\nvoGjOR1KXEUhJ9RQWb6SSnNlVHJkgYoPzlGRD1MU1SOkguzxAjU2hoBUBF\/PMDZ\/4GQGdnba6g4s\nr3q1V5fnqOYjOFvaxBE5Wh17NnGcc6KS3kbBbkQ+ZkU2bEKKWkbSp0PMo0JkT4agY5FEhsD2Ava7\nB6H5pmelrkCV2TxQXnYzwNppAmfkyFV5LkLp5SQqW2so9M8hx579D0A5AjuL8M6PQ9NwF0C9S3tV\nOyLAOM4DblRezaD0hI\/C4zHkGkZRsBiQGZlF4i99SHwQIOFQIzIwhjBZ2qBDgpBTAWpHAq+YT4C9\ndwDUOrVX52lUKQ9OxvSosOY\/A2ZlcgYYe9SDyJ+7EXr0FqHeEQRt4mvgrvQa+O1dAFUO7dVZHLWT\nCM7Dn3cw2zOFzKwEmf0VHGxpEBviI\/ykH8HH70ENcRHclDFA34IAqm\/eGet6WGCA8m0CjBFgGBcV\nCmdRB8p9CyiyppH7YYzp4O0ZjL4ZZZY42DGEoHEWoT0Vs1F8i0Io\/t5tqj9w0U6AUQIMEWAA52Uv\nTpIOHMW3cei1opTc\/ARM6mWI\/LEToQbSvb91I8BiI+xSMRvFL5mE4h93AExPry39EnhacH96zdwG\nJkZF18DfvwH1uzb4\/\/SGANUIkjn0S0R3A6Q0dmFVvX76JcCkfPF6k9wAA6SLEbcGQbME+w39VV4n\nT1x34HIk8rI8ZTVV\/Xs4z3n\/LZCewbhm4XqT\/DiAkG2BALUITkxiY1IffDk1NXonQPqA4DzItyRn\nzebS\/NLpsdyAisWE8sYqitZl5Ew6ZFZUOFiSIUGAUSXZHBwefK+GK77hhZKzZyG9uh\/efCEU8uoO\n3Nzd5bgXF9Oe8fFaYHgYHxN5P4LwOw7C3cMIdZEd28mGp2f03D00mXBw5+2WDTeL\/DnQsVkuv18v\nFt9bSJ7y+QN1BcbW15PBiQnchn1JPBwOdni8U9fk5LlfIqnGxGJQUml1jsNx1hWYcjrzmdVVhIXC\n\/xpJh+JyESW4yNQUgnw+XG1tqCswubsbp4EpgwFxmQzh6Wky8HzmwZ+BRkbgHxxkaj+bzSQwOsrg\n6HsUj4e9n366O+CBTofUMjmtqFQMNiqeR1gkQkggAD0GwfFxUAREA10sFjwdHfD19yNCfoa+T58N\n6w4s5nK+nM2GotPJAJNqNRIKBRMaGJ2dZTrEIG8B6e75+vrgJtAQGQ+64\/T9RTY7X9f\/LFxeXnKP\nT06ypVjssORyfQLGpdIvAvoGBpj7rrk5zKnVJ11KpfNevT+n1eqDw9NTbq5cjidzOU80HvdQHo8n\nYDTGfAZD3KPTJdxabcKhVCa2ZdLEukZjXVardyQGw\/aM2UwJTKY8d3VVL7LZvv\/SZ\/4LPPisiqxk\n3KYAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/powder_of_mild_fecundity-1334336127.swf",
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

log.info("powder_of_mild_fecundity.js LOADED");

// generated ok 2012-10-28 18:09:22 by mygrant
