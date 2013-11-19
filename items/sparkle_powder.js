//#include include/takeable.js

var label = "Sparkle Powder";
var version = "1338861433";
var name_single = "Sparkle Powder";
var name_plural = "Sparkle Powder";
var article = "a";
var description = "A shimmery jar of sparkle powder. ";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 450;
var input_for = [];
var parent_classes = ["sparkle_powder", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "sprinkle",	// defined by powder_base (overridden by sparkle_powder)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "SPARKLE_POWDER",	// defined by powder_base (overridden by sparkle_powder)
	"sound_delay"	: "0"	// defined by powder_base (overridden by sparkle_powder)
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

verbs.sprinkle = { // defined by sparkle_powder
	"name"				: "sprinkle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Causes the delight of all players nearby",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if(pc.location.getNumActivePlayers()>10){
			pc.announce_sound('CLICK_FAILURE');
			pc.sendActivity("There ain't enough sparkle in the jar for this many people.");
		} else {
			return this.doVerb(pc, msg);
		}
	}
};

function parent_verb_powder_base_sprinkle(pc, msg, suppress_activity){
	return this.doVerb(pc, msg);
};

function parent_verb_powder_base_sprinkle_effects(pc){
	// no effects code in this parent
};

function onUse(pc, msg){ // defined by sparkle_powder
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	self_msgs.push("The air fills with energizing, moisturizing, tantalizing, romanticizing, surprising, her-prizing, revitalizing sparkle powder! It's good for what ails you, bewails you and assails you.");

	var val = pc.metabolics_lose_energy(20);
	if (val){
		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: val
		});
	}

	var val = pc.metabolics_add_mood(10);
	if (val){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: val
		});
	}

	they_effects.push({
		"type"	: "metabolic_inc",
		"which"	: "mood",
		"value"	: 20
	});

	var pre_msg = this.buildVerbMessage(msg.count, 'sprinkle', 'sprinkled', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	//////

	var players = 0;
	for (var i in pc.location.activePlayers){
		var pcx = pc.location.activePlayers[i];
		if (pcx.tsid == pc.tsid) continue;
		var my_msgs = [];
		var my_effects = [];
		my_msgs.push("The air fills with energizing, moisturizing, tantalizing, romanticizing, surprising, her-prizing, revitalizing sparkle powder! It's good for what ails you, bewails you and assails you. ");
		var val = pcx.metabolics_add_mood(20);
		if (val){
			my_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var pre_msg = this.buildVerbEveryoneMessage(pc, msg.count, 'sprinkle', 'sprinkled', 0, my_msgs, my_effects);
		pcx.sendActivity(pre_msg, pc);

		players++;
	}

	pc.location.apiSendAnnouncement({
		type: 'window_overlay',
		swf_url: overlay_key_to_url('overlay_sparkle_powder'),
		duration: 6000,
		delay_ms: 3000,
		size: "150%",
		uid: pc.tsid+'_sparkle_all'
	});

	if (players >= 7){
		pc.achievements_increment('powders', 'sparkle_buddy', 1);
	}

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
	if (pc && pc.skills_has("intermediateadmixing_1") && !pc.making_recipe_is_known("169")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a> a bit more."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI4UlEQVR42s2YaVNb1xnH\/Q36EfwB\n+iKvMtMXzbidaTpuG4+bmcw0jlvH9jR2Uzu2S4Mdio3AEBNcY4NtjGNDwDaLAZtFElrRglYQQgIB\n2kBol650ka72Ffvpc24hoW6nnc5c2tyZ\/5xzrq7m\/PR\/nuece3TgAIdXvcVysMvj67u15lY1LCzz\nDnyfrnMK\/cEW6yrzlKKhLxKDthUX1Cjn3\/reANaOiw41mW1wb8MHDzYD8KV1Df6kNBz6vwF99HL6\n4O8QiugTvvJQk1J\/9IpKzzSYlqBxYRkua03QotEfPSvR\/m9dPDU18\/H5CZH1wowevtAtAM+0DDeW\n7XDbsQGN6CBxkbh3ZloJd5wb0G5fhxtLdmg2LMBVhc77Z4m671ORZn+cPTE82XdyUgpnRSq4iIDE\npWtzVmhBoJurLmixrEGtZh7qdGa4gvAdrk02F5stq3AVn6vVmODCjA7OIvzJwYmLnAO2Ljt4PAzh\nFQS7jJOdl2mgRmXE8QLUGy1AwtvEurjCtmRcb1xkfwjmI5yTauD3ghk4NiqEX\/aNcF\/llxRG3qlJ\nGfRH49AboqA3GAVhqQSCYpF1i4S5y+OHTvff+wSOhLvD5WFT4fSUHI6NIFzvCLz3ZIx7wK4F6wSZ\nkABekOvYPOMXijCcYOBI\/wv4VKyGbm8Qc88Df5TMwocjAqidnYdL6N6JcQl8JteygMTNj3qeTXAO\nOOYN9g2HKRikk\/AstsW6OJ7JwdBWkq1cUhC7gCQvv7I52PCel2nZ3PscYd9\/Ng4f9I\/Cjzu\/4TYH\nAeAHxXLZFyiXb9PZrMccCpcsUaqo8fnTxjhdVVNxkIUiMO0LwuT6JgytOuGucQHa1drcrRlVulUq\nTzeLJLE2gWC9eWTEdFsm4xbwFQCPLpW6XcVia3Z7ez6DWonHR18sLz8YNJn6HioUgi6ZjNVdVKdU\nKuhA3Ua1i8WCbqNR+LXFohry+URDfn\/THZlsmVP3Ktvbayu5XF1qe1uVrlZ1REv5fJMhlarToTQo\ndTJZp0DJUdKtrToxaholiMfrJuPxTlT9OEXVj1JU7yOz+SvOAGOx2LvucPjuZql0M1WpqJI7mstk\n6t4E3IV8E3CKotqwvYrt1bFodPR5OFzHGWA4HP65dXPz5no+37YNEEM4GV0ui\/YCGnb0ppvifwS8\nhu21lxTF5xxwzm7v9GD+VV+92tqqVISRSuU5AZxDGBO2e7ULrtkJt5gAxuNtokSiQUjTDXxUr91+\njVNAjc12b7NYbN9+\/TpFV6sTRATGjLKgljA\/VQzTqEowjeSeacdR4iYJtwgBxYkEb5qmeQLUI5ut\ngXNAf6nUiQUD0XJ5lMiCUEsIQ4pnDXV3w\/+03e19SsaWHTd1O+GWJZNt8kSiUUzTjQjZuC+A3kLh\nDgGMlEqDRGRSAuZAuQqFupolh+4z84qOjFcQTkEnGlttzkck1Ep8Vskw1yU0fV2E2hdArOJbBHAy\nlYSxZMLfGgjpLjrdkYVsvnEdAS8t2iIf6xcjpD\/oDXa+PSYvdju9nR12T+eHYoOOZ1wKHJlQRtDF\n5q9ttuucA8qLORMBrFSKUCwXwJdh4Nr6Blxec0Edbmvt2H6OW94nWjP8VKCGI9MaaMHXrGG8r\/H6\nYNbng+OTKjgzM+++ZzDc4xRQaTJ16UpZwgflSgGKpTykCxm44\/WCj0nApaU14Pv88MjhhuOqeZgP\nBeHUjBFM2BoCARYQt0VQbPrgZ89EcFervc8poESv7yaAr1+\/YgELO4BTkTDoYxRsJGjwJWmwxaLg\niFPwwr0BbQu2fwJUIuC7A2LomJ3t2hfAQrUM\/Yk43KcicAsnvuHZhJloBEwINhMMggghdNg+XHHA\nb6Q6eF84C28PiuGdIQlI8SVChaCHByXQqdXuB2AGquheqpSDgVgMHOkkJHMpiGEuDmN+HcO36mMa\nM9xHuBX8AVZ0d8zphg\/4apCse0DnDyCgH34xxDFgtVr9yXeAeSiVc5AvZqE3HAIZFQURgrQ4XKCP\nRECN7l0wWOAhFs0Uhvmiep4NsRad1SOgGgHfey6FG3z+Iy7fZg79K0DlVhy6\/X7WwS50yJ\/cgg28\n17S4wjp4z7oK7Xg22Qs4i+2R5zK4IRTuL+AMFgVxkITYilA1NjvmYIjNwePoGnGQhJg4eA2XHQJo\nCAQRMABHR+TQuh+A08U0CziSjEN9MADjWBgjCEmqmOTgaTzFndZb2BwkVczDNZAcQX\/4RAi\/Fcyy\ngNJ1LxzGHNwXwPtp2rJRzACFy8sqFoiV2WIB91bxS4+XreKndhcL+GTVAT24Rj7GMwpZYk4JNPCr\nsZnUl3z+Y84BheFg+3g24dGnE8UQhpasg\/3opAPDLUEo+c4y88X8EqgwN2vRvd11kIT4pWMd3hkQ\nV\/kRaq5haKifc0C1399gpahhRThs6w8Eco\/DodcNuNU9xclPkFMdbmlkJzks1UONfpFdBxsMi8nj\nYp3njGpxdiocNRsZppOobmCgm1NA88aGThWLlSdTKdjVWDIJf8DlpSMYZse1GMpzGFbSb8aj54\/G\nFTC06S1PWq1mqdNpV7ndLoXfH9SEQgt\/6enp5RRwNcWkDLkc8PcAfkPT8AS1O65ZccLJ+eVvxw8D\nYbjt8bN9IUqdzYIqmwFFJgPDoRBwCmhnmMhSsQD6XBbE6e8g9+qv3gA0uTbZ\/kSK2bnPfAuoRDAh\nfnc6nYa+ZIJjwFQqRAAXC3kw5fOwiNISR3BSCU5IJh6K0zAYi7P9XegXTBJGMRUmsC\/DZwX42RRC\ncw7oZpj1vYBzGG49qywbOiWGTo6SIMR0Jo0gaRZwEEEGUM8RUoL3RQgowraXjnMHSK5SpeL0F\/KJ\nYKUMjmIRLAhJALX\/AXAc3RpjGBZQTj7D+1NbNLTLZFHu\/5upVnmpQiEfzGbptWw2tprJ5E353L8F\nJKEdoaKZF8EAPeZyvuoxGKoPVCpTu0Syf38NM7ncW9F0mhdIJO64Kcq2Fo2uLQYCzjmv1631eNxK\nl9Mts6+5BcvLi+Mmk2PQYBA8MxobezSaX\/+3c\/0Nh\/8C6sbi5DcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/sparkle_powder-1334336497.swf",
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

log.info("sparkle_powder.js LOADED");

// generated ok 2012-06-04 18:57:13 by kristi
