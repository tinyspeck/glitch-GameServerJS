//#include include/takeable.js

var label = "Juju Shoo-Shoo Powder";
var version = "1337965213";
var name_single = "Juju Shoo-Shoo Powder";
var name_plural = "Juju Shoo-Shoo Powder";
var article = "a";
var description = "An extremely effective talc useful in the shooing away of Jujus.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 225;
var input_for = [];
var parent_classes = ["juju_shoo_shoo_powder", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "blow_on",	// defined by powder_base (overridden by juju_shoo_shoo_powder)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "JUJU_SHOO_SHOO_POWDER",	// defined by powder_base (overridden by juju_shoo_shoo_powder)
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

verbs.blow_on = { // defined by juju_shoo_shoo_powder
	"name"				: "blow on",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Scares away any nearby Jujus",
	"is_drop_target"		: false,
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

function parent_verb_powder_base_blow_on(pc, msg, suppress_activity){
	return this.doVerb(pc, msg);
};

function parent_verb_powder_base_blow_on_effects(pc){
	// no effects code in this parent
};

function onUse(pc, msg){ // defined by juju_shoo_shoo_powder
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (!pc.location.item_exists('npc_juju_boss')){
		failed = 1;
		self_msgs.push("Are you sure you want to do this? There are no Jujus nearby right now. Once you blow on the Shoo-Shoo Powder, it's gone forever.");
	}
	else{
		// Notify juju bosses in this location
		var bosses = pc.location.find_items('npc_juju_boss');
		for (var i in bosses){
			pc.announce_itemstack_overlay({
				overlay_key: 'target_effect_powder_mild',
				duration: 3000,
				locking: false,
				itemstack_tsid: bosses[i].tsid,
				delta_x: 0,
				delta_y: 20,
			});

			var gang = bosses[i].findGang();
			for (var j in gang){
				pc.announce_itemstack_overlay({
					overlay_key: 'target_effect_powder_mild',
					duration: 3000,
					locking: true,
					itemstack_tsid: j.tsid,
					delta_x: 0,
					delta_y: 20,
				});
			}

			bosses[i].onPowderBlow();
		}

		pc.location.announce_sound_delayed('EFFECT_MILD', 0, false, false, 2);	

		self_msgs.push("Ha! As intended, the powder blows into the Jujus's eyes, causing smarting and general grouchiness. The Jujus flee, thwarted. For the moment.");
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'blow on', 'blew on', failed, self_msgs, self_effects, they_effects);
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
	out.push([2, "You can make this with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-40,"w":22,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKdklEQVR42s3YeUyb5x0H8B7btG7d\nVHXa+t82rWu3SJPaqpPaqerWNq3UpGp6LGmSZlTN0ZCEhARCEowxxuBw2thgjnKFw5jLBmNscLBN\nDQGb+7I5wh1MAGMc24ApxpB89zweibo\/9sekt9osffXalvH78ff3Pi9638ceY+7xeFZW1tPV1dUv\nFxQUvJGQkPDLx\/6fHiUlJa+0tLTIe3t7N41GIwiUz+Vyn\/2\/ARYVFbEbGhruDw8Po7+\/H3V1dfV5\neXkv\/y8sj5NmfpScnPwzkUj0DA3BPUMaDFYoFHeamppAoKisrKwtLS19jTT5dH19\/U\/I9qnc3Nwf\n0r\/\/3mBhYWFPJSYm\/j4lJeUUgcnJMWcuLCw0k52b1Wq1tbi42JOfn4+cnBzIZLIFAu0h75fI5XIh\neR1HgIcyMjKeT01N\/Sn5kU8wqiNf+HMej3f8+vXrEwQHsjNIpVLU1NRAq9WiubkZpEGQ1nDjxg1U\nVVXBYDBAp9PRcaO8vBxk8UAsFjv4fD47KirqOUaBpJVfERifjBYUmJmZGUCS0QZgGo0GdLwUSqPX\n69HY2AiVSgXSYOBzEokESUlJYLPZbREREX9iFEgO\/mdJI2wKoaEtkXGhrKwMSqUSZJSBJimMQmlr\nFE7fp8ck\/TxpH1euXMG5c+f6g4ODX2IU2NnZ+RwZWwJtg65SOsLa2lo4HA5YrVa6KALArq6uwFhp\nW0KhEGQlQyAQgMVigYz1YcYiIyNfZRRIdvxiT19f5cjIiJ+eSui5zmw2Y8luD2wphLZlMpkCW7Jg\nQFY3Ckkys7NRREYsTE9HTHw8IlgsR\/jVq68zhgPwxPrW1h67yyWZWViwLCwvL9sWFtZsi4v3Jufm\nHMPj466egQGPubvbY2xr8zTqdB6VVuupqK115clkjoyiopWUr792JhUULHKys23coiJ1fGnpHiaB\nv9jc2Tm17PNVTHu9YpvHo553OjstNptKZ7EU64eGaowWi1o3NKTWkjQODqqrOjrU+UajIl2rlWbp\ndOXFLS21Vd3dJeXDw+Ick6lVYjT+mTHg1tbWS+t+f+705maSY2ur2rO93erw+1VjXq\/A7PGwWpxO\nVqPNxlZOTXFqSOQTE5wqkgoS2e3bHOXcHLf93j1Rt8eT3e52i8qnpiQ3RkdfYAy4sbHximNjo2hm\nc1Po3tnRube3DYtbW5WD6+txFHiLIl0uVvNumghYS9JAonY4WCoSk8slIMAss9udqVpe5pYsLPya\nMeCix\/PqnNtdOufzSdYfPGh3+v3au5ub0oHVVS4FttMQ2C0a8ryZwB4iHwLJZ1K63G5JB4lqZSW2\n2uViDjhjt7827XDU3PX5crzb271kvPXzPl9h39oau5OAvhvzLpY2qifR7gIJPoXgMmi0y8vxNS7X\nbxgDjs7Ovn57fl616PMVbOzsDJEG60ibBWTEMb0E1Lu29ijdJA+htFH9bottLlcywaWbSDQrK3E1\ni4uMA9XLfr\/U9+DBbQJU23y+XOv6OneQgAa9XlZgS9JPngegu0jaJB11m8eTRI4\/EV0kjffu8RgF\nTuwC7X5\/6ebGxrTLZmsh58Gi0Y2NGCsB0YyQjO1urRS6i2zfbZG0mmians5qs9vFjSsrzAPHZ2Ya\n7Xa73OewO9f6OhdXjE0Dtsa6+snyMumYVHpjJCenzJKWVtUnEFT1ZGWVdhcX57WXlOR2yCuKzdWl\nyt4GhdGUK+kxGvSyepvtunJp6beMAqcGBtrcba39Ox6nf+vuODYs7fdd2iqvLSnWPnudO28ryVqe\nLc10TdwQuUZyU5a6ws7Ndly9MGORZSyM1GZ7b2sK7w+VidEq4E\/VVlaWyNTqFxgFTptM\/asa1fLO\n1iq2N5ew5ZmCu6UOizkCTDfI0NdSA9M3cpiaK9GtK4M56gLajn+GkeoMzAzWYdbagOn+enQIoqFI\nTWwql0j+yOgimTKbBu41KFfu+z3Y\/nYeGxOdcJbnwqYqhUZZAn4cG1GR4bgWEQpR+Dnorp5DFysE\nfeJoTBilAeCMRYPu7Hgo0pKYBU48Atas3PctY3vjDtbbG+CSfo3JniZkiJJw6tRJBAX9AycO\/h2R\n+95HdUwYrNob6BGwMFKXjVmCo8CurDjIhUk3i74XoKZ65T5pz78yhrVmJVa1lbD26ZEtSYFYyEfs\nlYsQHA9C2ldfoCidB0uHAn2ZsRhR5fwLOKRGVyYPVcn8pnyRaA\/zI9ZUEeAdbC1YsKZXYO2WCj3m\nBqSl8pEhiEf6hTPIOnMS3EtnIUhkoae1HAN51zGqycUswU0P1aNTwoWMz9VnJSfvYbjBdgKsJMBZ\nbC1ZsKqXY7VZAaNOjvCwi0g4fRIaTgT0Ugm47HBwWKFo15X8O3BQhc6MGEh5HENWfDxzwLE7d\/7y\nXaDfM441Yy2c8kI0qmSI+fJLCA4eRPyZU2BfvYiTZMzhoafxjabgEXCGtBcApnMg5bKZBQb+k7S1\ndS7ICqe2nWPY9k7BO2DAQmU+miSpEB89iujDhxFEtgcJ9KOPPsLpU19AXZAMi1SI8W9KCVCFMbKa\n9WeD\/IUx0SpxdvYfGAUODQ\/fHFZU1HubFN\/67vTA57DC2VSF0Zir0MaykC9OhJgch6mJHCRfj4K8\nIBXmDC5Ga7Mx068MADuFUVBdC+\/KLC3NSVEqn2cUODg5qb7V0iKyKaqUi\/lZA8uZqWvLeWmwxbEw\nlZGAKXM9pqx63B7QYrChGN38KxgQRGEgPQYd7PP+tvhr89pLIUN1NfJcscGQkqjR\/I7RVTw0MWG4\naTJVVFdXNxcIhXeK+XHbci4HDeFhaAoNwc3ICDRERaCOnGqqQ05DduwIKs58tdYYz203VMgKdK1G\nsdrUJqyfmYkTNjcnMQrs6+vbazAaXTl5eW6RWOxNTknxC1JTIUpOhphcjIvJpaQgJgaJ5No3ITIS\nsZcvg3PpEmIuX96OZ7NXUwWCJZFEshjN4y3xUlKmYoXCfo5AwNx1MbkGfl+hUNzncrlISEhAWlpa\n4KL8YejruLg4kItxxBAon8\/HtWvXcJlA6ZbD4SCe\/IizZ8\/is8OHdz48cMC3f\/\/+vzIGNBgM79M7\nCfTuAEWw2ewAKDEx8RGSougPiI6ORkhICD7\/\/HMcJav6xIkTCA0NDeTQoUN466238Pbbb9P8jVFg\nRUVFAEjvrdBmaMLDwwM7vnDhAs6fP0\/vueDkyZM4duwYDpPTzieffIIPPvgA+\/btC2xJa9i7dy\/e\neecdZoELdvu7nV1dXnF6euCOFm3p4sWLARhtKzg4OAD7kpywg4KCAu0dOXIkcE6kSAp87733Annz\nzTex\/+OP8eGhQ8wBATzjdLsvjU9Oepv0ekjLygJIOmo68v8EpCP99NNPceDAgUCDR48fRwg5HmNL\nStYTamreYPTmkcPheNrr9b57b21NuuB0rlgnJ3GztRWF5eVIFIkQQ1YziyyQK1FRCCcLI5weDgTD\nIas9uagIkvp6ZBsM0xK9Plak1+\/hGo0\/+F7uA5M2Hyd5kuTHY3fvvjg6Px9kmZvj9c7O8szj47yW\nkRGewWrlNQwOhir7+j6Ud3S8Vm02P0vOn08eIiFf8F\/do\/4n653icXuNnXEAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/juju_shoo_shoo_powder-1334336226.swf",
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

log.info("juju_shoo_shoo_powder.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
