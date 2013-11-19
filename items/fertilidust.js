//#include include/takeable.js

var label = "Fertilidust";
var version = "1351473111";
var name_single = "Fertilidust";
var name_plural = "Fertilidust";
var article = "a";
var description = "A jar of chokingly musty fertilidust, effective in promoting the health of trees. ";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["fertilidust", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "disperse",	// defined by powder_base (overridden by fertilidust)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "FERTILIDUST",	// defined by powder_base (overridden by fertilidust)
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

verbs.disperse = { // defined by fertilidust
	"name"				: "disperse",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Significantly improve health of all Trees in your location",
	"is_drop_target"		: false,
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

function onUse(pc, msg){ // defined by fertilidust
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var trants = 0;
	var dead_trants = 0;
	var paper_trees = 0;
	for (var i in pc.location.items){
		var item = pc.location.items[i];
		if (!item) continue;	

		if (item.is_trant || item.class_tsid == 'wood_tree' || item.class_tsid == 'wood_tree_enchanted'){
			trants++;

			pc.location.apiSendAnnouncement({
	                        type: 'itemstack_overlay',
	                        swf_url: overlay_key_to_url('target_effect_powder_extreme'),
	                        itemstack_tsid: item.tsid,
	                        duration: 5400,
				delay_ms: 2000,
	                        delta_x: 25,
	                        delta_y: 200,
	                        width: 300,
	                        height: 300,
	                        uid: item.tsid+'_fertilidust_all'
	                });

			item.events_add({callback: 'onFertilidust'}, 3);
		}
		else if (item.is_dead_trant){
			if (item.class_tsid == 'trant_bean_dead'){
				var trant = item.replaceWith('trant_bean');
			}
			else if (item.class_tsid == 'trant_bubble_dead'){
				var trant = item.replaceWith('trant_bubble');
			}
			else if (item.class_tsid == 'trant_egg_dead'){
				var trant = item.replaceWith('trant_egg');
			}
			else if (item.class_tsid == 'trant_fruit_dead'){
				var trant = item.replaceWith('trant_fruit');
			}
			else if (item.class_tsid == 'trant_gas_dead'){
				var trant = item.replaceWith('trant_gas');
			}
			else if (item.class_tsid == 'trant_spice_dead'){
				var trant = item.replaceWith('trant_spice');
			}

			if (trant){
				trant.setInstanceProp('health', 4);
				trant.plusHealth();
				trant.setInstanceProp('maturity', 3);
				trant.plusMaturity();
				dead_trants++;

				pc.location.apiSendAnnouncement({
	                        	type: 'itemstack_overlay',
	                        	swf_url: overlay_key_to_url('target_effect_powder_extreme'),
	                       		itemstack_tsid: trant.tsid,
	                      		duration: 5400,
					delay_ms: 2000,
					delta_x: 25,
					delta_y: 200,
					width: 300,
					height: 300,
					uid: trant.tsid+'_fertilidust_all'
	                	});
			}
		}
		else if (item.class_tsid == 'paper_tree'){
			paper_trees++;
		}
	}

	if (trants){
		self_msgs.push("The airborne fertilidust alights on nearby trees, where it is quickly absorbed by the leaves, races down the medullary rays, and tickles the roots. Every tree immediately grows to its next stage of development.");
		pc.location.announce_sound_delayed('EFFECT_EXTREME', 0, false, false, 2);

		if (trants >= 4){
			pc.achievements_increment('powders', 'fertilivert', 1);
		}

		pc.feats_increment_for_commit(3);
	}
	else if (!dead_trants){
		failed = 1;
		if (paper_trees){
			self_msgs.push("Paper is impervious to powder. You don't want to waste your Fertilidust here.");
		} else {
			self_msgs.push("There are no trees in this location. Seems like a waste of perfectly good Fertilidust. You may want to reconsider.");
		}
	}

	if (dead_trants){
		if (dead_trants == 1){
			self_msgs.push("Oooh! That powder brought a tree back to life!");
		}
		else{
			self_msgs.push("Oooh! That powder brought "+dead_trants+" trees back to life!");
		}

		var val = pc.stats_add_xp(dead_trants * 25, false, {'verb':'disperse','class_id':this.class_tsid});
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'disperse', 'dispersed', failed, self_msgs, self_effects, they_effects);
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.skills_has("intermediateadmixing_1")) out.push([2, "You need to learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && pc.skills_has("intermediateadmixing_1") && !pc.making_recipe_is_known("162")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a> a bit more."]);
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
		'position': {"x":-13,"y":-44,"w":26,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJOUlEQVR42uWYe1BTVx7H3Znd2T92\nZ2m32+5ud1rabdfW1a59t\/sqTt3Wqe3WtW7tSkVEwfoAETWCoKLUCpaXSoAE5SkkEEIA8yIkhBCQ\nR8IrmBASEiIPeRsISEKi3e+eewudtjPd2Z1Jup3ZM\/Odm3Punbmf+f7O73d+uStW\/L8MOS\/ar1tb\nabt1U4UBYxUa5YXx3ynABuHp+P4bfEyPt+KWTQFdWyG+U4D1wk8jb2jyYTEIYNKVQaPKnPmfgJw9\ne9ZfUJK0qUWeHN9Sl5berEip17Xm1vd2FHc1134KTf1FUFdtQ4bN1MOr72nLT9e15cbXSS\/HK8Vp\nm5hMpr9PwKKjo\/2K2Yx6GT8OaslZtCpS0dGYBco1k66U7Ltq4tpFMi+AuYeHBlECbppEMN8oh6G9\nCF3X2dAoL6CpJhHV3DP1SUlJfl5PAl3LFcjKj0FZfQqN0nNorUtDhzoTutYrNERfN5eGo0RBE1dx\noy0PnU3ZNNx12XmohKdRU3YEjKiwAK+72NddihGSACMDtWSvVaJfX0E7Z9LxoNcWwkCAjJ0ltHo7\ni+n7g\/1S3DSLCXQ5HX4Kriz7Q4SEhHgfkHJwwHiNZGoLZLyj9G\/3ooUAy+kXGzs5BEhCg1FzCefQ\nF2HlsXdAWnoY14r2k\/Cf8T6gsrYoYKC3ClNjLbBPatDTlovRQSUNSDmrFn8MM3FyGZBKFCr8y4Ba\n1SXawerCvTT86aPveL9OuuZtAYNDPdNmU+PQjL0XczN9mJ2z4vZkByZuNWFsSIUhSw0ddmtvNSx6\nATQaPiTiNFQJzqGk+OQE68rx9kxuaoLPyszg\/Dxf3Nd3rNtkUjZoNA2ZfH4GVy7PWVbZkljV1TmJ\nXG7OvuTk46dYrKS04uLsVC43+RSHsyW+uPhNnwLKZ2Z23PZ4qim1OxyRwuHhD692dYVQKvmSqHkB\nkbSvL6rX5TqhnZ8P5\/X3H85SKr2fIAD85lyu2vbZ2Zim2dm9BK7cfu9e+ZjHkzXkdicOuVwJJqfz\nsHFxMaLf6Yxpdji2UWokUjscQeReTNf8\/CHh+HgYu6lJnqpUrvUqoPPu3RzlzMzuDvKSKY+nZJrI\n6nLFa+\/cCSLObKPU+TUtr7cSdc3NhZlcrliD03lEZrd\/mHX9elWKWOzvLffWdk1NfSKy27dRjk16\nPPkEMmcZSrckvdP5VS2tU890OZ2BVrc7hnJXs7Cwp2Z6ekuyTMbwTvYC+3N7ena2EBcmPB721N27\n7DG3O5WGIjISGPOSLEtanhuXYKlnBxcXo21EvU5nZB0JPVOtLvAKoOHmze0cozG4Y2Hho\/G7dzPM\njoECy8xAgf5LUDaioa\/JtqRl0LLmqywCecy8uHiQ2psX6+qqvAI4fPt2aBkBJPtoT\/u4tkiqz5ww\njcjBuX4MnKYTWgZvI5\/B3cg\/UvwW\/3DhBn5U7gZ+ZM6b\/PDsN\/mppXskl66GTCZf+QfimO+Cqy7I\nJsAHm4mjyWJxibf2YHy+Wh2mu3MntKonZdC5YMNni2Nwz1ngmjFi4bYe8xPdmB3V4vZwCyZtjRiz\nKDHSV4tBgxgDOlK0u6pIQ8FHTPpGWBcW9tePjm4\/V1ER6y3AAJVef5JKCpH+ku2f7nHcc43CPW\/9\njwGtumuw9ojBunoAloWFMEF3965PRaIIr9XAG1ZraZvdHijQJRmto0poLFwMT3WiYaQJ124qIbTW\noc3W8I2ATWo2gRQh++p+mF2unXkKRWhyTc0mr9XB4cnJ5EqtdneCbJMhTREIw606NJD\/HwKriAas\ntCpQbq6Fxlr\/FcCO1nxomi5DXncBjSoWTlx8F90TE0GpVVX5Xi3Uns8+i8wWCML2VzxryG2OgtQm\ngHq8DelNJ5HRnIhS0iBQgKXGGlgsKvQNKCEl4CnyBASlvILy5gJIa9Ox+ag\/pJ2du9MlkqPePur8\ntQZD\/u6Sp82hJU9AMiiEbEiBkLxV+Fv6T3BKFPoFYKleCumwCnntV7Ah5j5sYNwHlpqFijYO1u39\nEfLE4oNpCkWw18\/jMbudeShvdX9yxkocyP01duQ+iq2ZD+L9VD8Epz6M3Zdfxk7WS9iR8SJCL7yE\nbTE\/w9\/Df4itjJ9jc+yjCIz6Fd7a\/j0wRaIzSXK5n9cBXR5P8JmKd7X8xDUQJzwH4Zm1qDy5Bvzj\nK1HKeALFUY+hIOIRXNn3S7DCHkJGyE+RHuSHzL2PI2PP44gLug\/rd\/7AyaytDfJJq0Vlc4\/FUngu\n45mRyoQ1uHZqNSrjVv1bwAs77qcBL4Y+gs07v4\/YzNhIplK5aYWvxrTDkVUil++TWUQRcWXrJckZ\nzxs+\/sT\/TtzpXyDmxIM4GvMAoo7cj4ORfjhw4MfYG\/XQQlTyn7oYrPcqGcxgZpZEErvCl4P0hMFC\ntfqk0eEIpM7bW273tqkl2Ykc9+7RslMic9KW7SSdz55htzuII5fvuqxWb\/IpIF20bbYyESkVlqWm\ngIIc\/xLosqi1Sbc7ZNzlCu2dnt7B5PGCctTqgBW+HmOzs1nsyspw41In0zxSkVJm2mJrHqpIoWCX\nNURdXa5dwy7Xbqr2sSSSpG\/l+8zU\/Hz8+aKiqDarNk1iZtg4pjfAtbyGQv16NI7zYpbbrJZJVYRm\nqpnRTyDzhMJwVm3t9m8FUD\/eks63bAbPFoBSawCKzX+GcHQ9BEPryPz1O\/mGdwy5PW8bMtpfAbtz\nHdja9wczZB+ZozkRld8KoMpaYDureg7MjlfAIc5VjbwOycRfwOp+FZe0L4Ot+z2yul4FBZh74zUI\nBjcgreVVhHM2gtXYuNancA7SrjNb3wYFmKh+Hqdq1yKu5neIFq8BQ7gakYJViOA\/jXMNzyNX\/weU\n9BOHTa\/jnOplbGU\/hlTZVd+6WGdl1mcS59LbXiKuvIgzimdxmihW+gwNeIgAHuA9hX1lT9HzY6LV\nCClciQ\/YT2Jd4sM4yNnu2y+vrUOl+UnqF2gHzze9QANSDh6XrCEwaxBV+VuElz+NvaVP0dpOzmxK\ngZefQFDeb0iYt\/gWcG5u7oHuWwrDgF2DKsNJOsQnlgCPXvvcQSrE+3mfQwZefhwf5DyG9zL9EVX2\nPtJknGCfJ8kIgbRM9p1Q9OdC1JuEjxV\/xAX1Fnwif4MGPFixigbcw12JXUVP4gj\/r0iXZ3ZdUub9\n10X6X0br6r915EV1AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fertilidust-1334275431.swf",
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

log.info("fertilidust.js LOADED");

// generated ok 2012-10-28 18:11:51 by mygrant
