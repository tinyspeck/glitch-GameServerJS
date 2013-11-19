//#include include/takeable.js

var label = "Fairly Hallowed Shrine Powder";
var version = "1338859566";
var name_single = "Fairly Hallowed Shrine Powder";
var name_plural = "Fairly Hallowed Shrine Powder";
var article = "a";
var description = "Curry a moderate amount of favor with the giants with a jar of fairly hallowed shrine powder. ";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["fairly_hallowed_shrine_powder", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "sprinkle",	// defined by powder_base (overridden by fairly_hallowed_shrine_powder)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "FAIRLY_HALLOWED_SHRINE_POWDER",	// defined by powder_base (overridden by fairly_hallowed_shrine_powder)
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

verbs.sprinkle = { // defined by fairly_hallowed_shrine_powder
	"name"				: "sprinkle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Scatter near a shrine for double rewards",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		return this.doVerb(pc, msg);
	}
};

function parent_verb_powder_base_sprinkle(pc, msg, suppress_activity){
	return this.doVerb(pc, msg);
};

function parent_verb_powder_base_sprinkle_effects(pc){
	// no effects code in this parent
};

function onUse(pc, msg){ // defined by fairly_hallowed_shrine_powder
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (pc.buffs_has('fairly_hallowed')){
		failed = 1;
		self_msgs.push('The giants are already listening. No need to bother them further.');
	}
	else{
		pc.buffs_apply('fairly_hallowed');
		self_msgs.push('You sense an increase in power coming from the shrine. Quick! Make a donation!');

		function isShrine(it){ return it.is_shrine ? true : false; }
	        var item = pc.findCloseStack(isShrine);

	        if (item && item.is_shrine){
			pc.location.announce_sound_delayed('EFFECT_MILD', 0, false, false, 2);
	                pc.location.apiSendAnnouncement({
	                        type: 'itemstack_overlay',
	                        swf_url: overlay_key_to_url('target_effect_powder_mild'),
	                        itemstack_tsid: item.tsid,
	                        duration: 4300,
				delay_ms: 2000,
	                        delta_x: 75,
	                        delta_y: 200,
	                        width: 300,
	                        height: 300,
	                        uid: item.tsid+'_shrinepowder_all'
	                });
	        }
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'sprinkle', 'sprinkled', failed, self_msgs, self_effects, they_effects);
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

	// automatically generated buff information...
	out.push([2, "Sprinkling this will give you the Fairly Hallowed Shrine Powder  buff (your next shrine donation has double benefit)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.skills_has("intermediateadmixing_1")) out.push([2, "You need to learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.making_recipe_is_known("167")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> and complete the associated quest."]);
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
		'position': {"x":-11,"y":-41,"w":22,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKMklEQVR42s3YaUwj5xkH8DSJVKmV\n2iZV8iGV0kM90jbKblS1UtVE1Ur9kk+tVK3UD5XSqpEqbdKkiTZNCNeyQGBZYL0QwIANNja+sPGF\n79sYX2AbH+D7vm2MvQaDDd59+o6ztFGrtKo0qTLSI3tk7Pnp\/zzvzDCPPILT1t\/f\/yiLxfq+RCL5\n88rKSheBQHjhkc\/Ttrq6+mutVutGG9hsNuDz+XMI+eznBri8vPzBxsZG2+VydYBCtJHJ5Ev\/d8jV\nq1cfu3379pcnJyefnJqaemppaekpDofzFI1G+z1qsQ+5YH19HVCiTAqF8jOEfgKl+bX5+fmvovoS\n+tvHPhMYNmMjIyNPoPoVApIRLoMOCFQqFWsnyOVyQInB+Pg4jI2NYUBQKBQglUpDPB7PjPZVCwsL\nk9PT06+g7z+Nfu9xvIFPDwwM3BgeHm5MTEzA3NwcoMUAa2trgBYGqFSqzqtYLAYEAoFAAGq1ugN\/\nmCggIKC5BPQb1J6enm\/jCkQHehKl1Y0S6BxkZmYGLhJEbcNmrgPEQDKZrPMeQ2JYJpMJJBLpAgfX\nr1\/ffPPNN5\/HFYgG\/+uolb1cLhfMZjNgr2jGOolh6WHtxBIzGAydfSw1LF2RSNTBE4lEQB2Ad955\nB954443da9euXcYVaDKZnkEHmkBDD9vb24AWR6dthUKhs4+1HEPZ7fZOimjOYHR0tJMy9n5oaKgD\n7OvrwyrW29v7U1yBVqv1ey63mxoIhaqhcLi1vbPzwO3xQKlcBtfuLqyhRJUoObPFAjIE5KD0WKj1\nVBoN5hYXgc5iPZiYnj5\/r6+v9frbb8evvfUWfkAAeLxxdvaT6vExIVksilOFQiyZzR6n8vnDUCpV\n9ITDh3aPp27c2TlSbm0diTWaI55cfkQTie7Nc7n5aRarNMFglG+x2embNJrn9sYGZ1yheA5P4DPN\n+\/dfLzSbhESz+VGp2dSlqlWnOR4X8t1ussTr5Uk9HpnA6VRixXc4lDSzWUk0GKQIszChVq\/MWq1c\nstfLZqZSH82azQKCWo3fpbDVal2qNZtz0dPT0YNWS3yv3d4stVpC3\/HxLXOt1mVEpT887NKgUqFS\nHBx0yVBJUIlLpS5hqdQrKpW6BYXCB7xi8c5qLDZI2t\/\/Jm7AUrV6OXt4SIqjBOvttv7w\/Fybb7XY\nnqOjm58E\/gP578AuDCgsFHr4qNgIyslm8btOxzKZS5F8nphqNmeO2207SlGRazZpzqOjPgxo+kRd\nYC+Q\/wLsRcDetXy+n5nPfws3YDyTuRzO5UiZZnMeAZ3lVmsj3WwuOer1bisCYWV\/+Gqt17tMCGh8\nmKbiIRBBe0TFYp8A1Vou9+FqofAd3IChePxyIJ1eLpydLZ202z5sDrPNJtnbaPTvIJDzE4XtY9iL\n1muwViOgHM2hpFjsF6PiFQr4A0PZLKV4dkZDwBACSlG7F5xHjUFBsTbDTRf5ylRSLI1ExOJQQMz3\necREi0N81+ai8BKpQWzRqCuVXlm5fEOCilcq4QvcSyReDGYyFJTgymm7HTg4OxNGT07m+cU6ZSFe\n8tMjiRbJ64fb1l3o11qhR6aFQbEUrnNEhfdEmg1mKDasr1b71OXygBTVeqEwwv0sgPlmk4oS3EMJ\n8py1xgolVdnmJLNtejgK72+H4TWtB34nssFvWVroFsjgjogPfyIzK10yPUNRKAzpyuVBlOIgN5ud\n5KTT38UV6E+lKNnTU8q9s\/PAXrW+pcgfeCjxYlGRToI8HoLx3SDcNO9CL0qwW6qFOZUc6Coh\/IFI\nhT+SWL5xhUZF9+1xN7L5CUYkQqQFAj\/ADxgOv7ifTFKitRr13lkrk6iVq\/6DTJufzp8txnKgTobB\nHPOCI7wDtn0zqB16WNuUQw+HB6\/OrcAUb\/VEoOY26GpxkeZyyan7+7Rlj+c5XBeJLx6nhNHJutZs\nZA6PctBqJCB8EAdmIgN3AymY9QaA7HQB0WyBWyotvM2VwF9XuUDa4IDTxoPIrgDkKub9RYMuuOTx\nruEKxBL0IKCzUJoK1w7dhVoazhtxaNTC4C9GYC6YgFFXCMiOj4Hjai38hSMBklIEe04RRFx8iO4K\nQadjAUmvjZDdHu5yMIgv0BuPL+vS2du2UmkzX0vB+XEc6ghozsaBEY2DPe6FRGIbohEz7O3rYV4t\ng0mxADbNfAg51yHqFoFexwayXhdZdDh5uCaIXerQiZqkTGZHDbmcLldNIGAM0pUY0BNZuBtMAdu\/\nD2y3E+h2C1BMus5p5tWlNZhHLfZs8z4G6jmwZNBHiBabYMZi+SF+wGLxkj+dXpTEUyOaXFaT7QCj\n4C0ngYVmUJkIgyLkA6HXCTyHBfg2PcgsCujn8mBGxAEXmsGYW4z+HVgDitHQAS7iCcSuxb5EgiTa\nDw1r8\/n12GHiCAM6SylQZJJQLnmhkHNBOmmHRNQMiZAB0kE1zEv5sLDxMTDoEgFTutYkW6z+RZsd\nXyCWoDcWI8v9wQFjuTLpqeTUtXoiocrlTgWpNDQOvFAvuqCatcNB0gzFmAFyIQ1QlQIY5TCBr2CC\n2ig4p5sMKUEkuk5xuhiLDgf+QEUweAO7g3HcqwyHjysEZvpgU\/gfgOs6IbzL4OSIep1AH\/EzdJk0\nzXhwML1os9GnjMYf4bpILoDYHYs5nx1b97pks\/vhpAq1+NOAQoMI3mML9me3vQR7vT5qr1YJZlQL\nJhNjUi7\/Ma4z6I1GhMIdo31hSxiZ0LJyYxrm0bBR2ibsOoDq98OSdx+I206YNplhUqOFMYkU3mev\n3f+AI3LSLTtkYzS6rHA7laqwn0s06pdvyWT4XeqC2eRL1og3Nm8SNG8pV+5\/qKDAMKohxQoMqxjw\noYYNw2oODClZMKhgwE0ZHQakNOiXrDwYkq40bqnolcUt0SHVIjmm2mS1aSWnfEdC\/wV+wFzqZXsi\nkGA4NTCzuQ4jCipgyP9Ww\/LlTmHvZ408mEffnUIn674N4oMu0dQvcU1wJxmM87wmYLi0QLHJYH5L\nANNGLkxoGDCq\/Cf4Aj8oX4KbqAZkJLghXQSClgVTejaMos\/eF0zDu+s4AqOl7EvOVLgDZO\/qgYmS\npO8oYdkugwWzCGZRMtMGLhAQYFzLQDcLtA6yR0yEv\/Gn4Pr6XUCjAdPoc4KWCd2iWXyBJycnP89U\nyj5T3HdiTuyBIrANNASk2OVAsm4AEaWJtX4KXSkmdUwYU9NhBKWKJdgvWYB3+XdhTLWCcAy0gFZh\nSEo7ublBexnPJwtfbLRav6k2jkPJSqliSwZORb4tYKN2ryLopwEH0fxh7e0WzyEYExZNsva8UXVK\nUCucd5RKfJ9uIeSjB43GN+qnp68VazVe+rBiDRcLQWc6FtGHfT5V0O3d8Nr9fKc5sLZjCrB3TA6G\nddPKsJrcdMuWnWIybi4aDFSySf8Kx2x+Ev3eFz6z59QYFisOwGO+bPZZXzp9ZSeRuGKKRK7oA4Er\nap\/viszreEFqtX4FeyZ99WFhj5H\/12P9HaN\/iLo4S+fDAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fairly_hallowed_shrine_powder-1334335971.swf",
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

log.info("fairly_hallowed_shrine_powder.js LOADED");

// generated ok 2012-06-04 18:26:06 by kristi
