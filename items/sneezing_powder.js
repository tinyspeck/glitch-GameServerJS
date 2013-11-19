//#include include/takeable.js

var label = "Sneezing Powder";
var version = "1338861422";
var name_single = "Sneezing Powder";
var name_plural = "Sneezing Powder";
var article = "a";
var description = "A potentially troublesome jar of sneezing powder. ";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 150;
var input_for = [];
var parent_classes = ["sneezing_powder", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "scatter",	// defined by powder_base (overridden by sneezing_powder)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "SNEEZING_POWDER",	// defined by powder_base (overridden by sneezing_powder)
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

verbs.scatter = { // defined by sneezing_powder
	"name"				: "scatter",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Causes hilarious sneezing",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if(pc.location.getNumActivePlayers()>15){
			pc.sendActivity('Really? Really?! Why be SUCH a jerk??');
			pc.announce_sound('HORRIBLE_SOUND');
			pc.naughtySplanking();
		} else {
			return this.doVerb(pc, msg);
		}
	}
};

function parent_verb_powder_base_scatter(pc, msg, suppress_activity){
	return this.doVerb(pc, msg);
};

function parent_verb_powder_base_scatter_effects(pc){
	// no effects code in this parent
};

function onUse(pc, msg){ // defined by sneezing_powder
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	self_msgs.push("At first, watching everyone around you erupt in a sneezing fit is terribly funny. Until the spraying starts.");

	pc.announce_sound_delayed('SNEEZING_AHCHOO', 0, false, 2);
	pc.location.apiSendAnnouncement({
		type: 'pc_overlay',
		swf_url: overlay_key_to_url('overlay_sneezing_powder'),
		delay_ms: 2000,
		duration: 2000,
		locking: false,
		pc_tsid: pc.tsid,
		delta_x: 0,
		delta_y: -110,
		width: 300,
		height: 300
	});

	pc.events_add({ callback: 'onCreateItemEvent', class_tsid: 'bean_plain', count: 1, x: pc.x, y: pc.y-1}, 2);

	var val = pc.metabolics_lose_mood(2);
	if (val){
		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "mood",
			"value"	: val
		});
	}

	they_effects.push({
		"type"	: "metabolic_dec",
		"which"	: "mood",
		"value"	: 2
	});

	var pre_msg = this.buildVerbMessage(msg.count, 'scatter', 'scattered', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);


	//////

	var players = 0;
	for (var i in pc.location.activePlayers){
		var pcx = pc.location.activePlayers[i];
		if (pcx.tsid == pc.tsid) continue;
		pcx.buffs_apply('sneezing');
		pcx.sendActivity(pc.linkifyLabel()+" scattered a sneezing powder. How hilarious.");
		players++;
	}

	if (players >= 5){
		pc.achievements_increment('powders', 'sneezeorama', 1);
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

	// automatically generated buff information...
	out.push([2, "Sprinkling this will give you the Sneezing buff (nobody likes having to sneeze)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.skills_has("intermediateadmixing_1")) out.push([2, "You need to learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.making_recipe_is_known("171")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> and complete the associated quest."]);
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
		'position': {"x":-12,"y":-39,"w":22,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIzElEQVR42s3Y+U+b5wEH8P4H+TO2\nn5ZFk6pWmxZF+6HStnaTtqlNuyNK26S5Ss4yh8uEQLAxR7hMbA6DwYDvE2NsYwPGsR3jA2wOY+MA\nITaGACUJp7PvnucVRFmlapn0osXSV8\/rA\/nzfp9DFu+9x\/KjcbLsZO148cn33rVH7sjl45rF5qQl\n0wXZXD1Kfbdy3ingXe8tR+9jIYbWlFAviiEIFDjeKSDfztWIp\/lMe62xSgi8BZr\/C6S8vPzYXV3e\nH6oNvKLKYH5RQ7S0qCl6z\/FgnJcs9txERSAfZY9yURPmJpunKxyNkbLquomSIqGluog\/WHB0a\/Oc\n9dyxHPvZttzhi+B6roM3dhv3x4shmuJBGr8PxUITOCOXUODOIevvO\/ADeZDPN6EjXoMHU+UEXIxy\nPweF7qvrNx3nitjfBLm5x647zoEmb\/QKSrw3GQRFNk2WM9NKoV1zdUzodcuMAMLJewyO3tAd8je3\nXVdwpf8sjqTFzkQt2mJVKB\/jMC1RKG1TNMVnMBLyniRWzYR+jr5Gx55kA+4T5LXBr\/C1+XN8pv3k\naIBketBNvsy8LEXO4JfQPGlGeGcA9GihDdHnqkURpORG6FIo9txgppXeyF\/Uv8NF69\/xlfk0yFJh\nH9gTaDlOj4\/+5U6YUu0MyEhGCqTXt4a+QftsNQOkU84ZuczgaOi6pNN8x3sD5\/v\/SpbJ1zglff84\nq8B94GR0cfyJP+XaCawOwZuxYOyZHZObo3A8kzOtWjMyGJ9KoFwQQb\/USjaJEEIXH7f1V3FVcR7f\ndubgkuQWbnVVBVlvcC+bdc5sbeUtPH9um0gk0hPx+JrJ653Ue71TI1NTC0PR6ILO51tQejwLMrd7\nocPlWhA7ncmavr6IwGSK8I3GSIlWO8qzWnsrjEZf1cAAe0cOSHsv9\/b6kzs79zf39x9+T7JKnns2\nNjjGWKxCHg43Sj2etg4SCYn4IE0kwtHRNnEg8EAai9lU6fRtRTrd0zk3l1dpsThZA25vbxvnSHvp\nvT3ZRjY7vLG\/Pzy\/s9NCgW4SF8nw2hrHSWInsayucswkJhJDJsPRkWgyGZU6nc5TkvQuL3MFNpuW\nNeD84mLtxIsXHIKzkTjX9\/ftBCh6E+giMCbkmiKtPwSm03JdOp1PxvzeVIpXOzTUzh5waUlMgS+z\n2UfPs1kvmV4zWY8CCqTxbW5yDq89b7RpJTEfAHUrK3KCLSDXBYrl5Yba4WEVq0Dn\/Hzhi2zWt5nN\njmb29vTxra37PoLxE1yAJHQw+g+wtFknCZ1uEwHqCdC4slJIxkJ5KiWqtNs1rAO3X72aJC2Gl3d3\nVQRYewij7U4cjCGSQySdbtokXY+kSYWJrD0DifKogFuvXk3QPN3d7SE7uoaiogQ09Ubo88M2PSSu\ng40zsLam6FtZKSYtFquWl48GSNtbeZGOz6w\/Vie2tqooaIZkdmuLM0vGBB1Jpg4apU26D1q0P3um\ntK2s3NFnMnZVJiM+EuD6zveRUNIIif0b1Pf9I91o\/dYqctw26EKdIk2wU6QiUY51iLp9ElEXicTd\nJqq3VXY0GgtdYmNxRqjK3S7S350jR4600mZjFyi0XRoMzmkRSGghspxBueojfNd2HHXaTzEe7UZw\nvBNjwXZ4\/S146BXB5SY\/\/0caMB1UYi6sI9EjHtSC2\/K3\/Tqv2s7v79exCqzrOz\/kjyvxaFaJBtNn\nKFP8hgHmtX+A58shbDz1Y23Rg5XHLiwnnHgas2FxyoL5iOkAaEA8pIPVVo08Rf7YkQB9sR6o3fmo\n0f8RJb0nGeCN5p8hFtO9FTAR0hNgDfJVBUcDVLpz0TxwBg\/MX8Dur0CV+hMGSKf4x4APR0UQKS4j\n4JEiQZA2ey2K1NyjAQq0p8BTnyLTe4oA+dhen0SF4uMfBfaYbuOs4AR47V8gOW5kgPbBOuQrCoP3\nDAYDa8Dl1dVGCryn\/BB35R+iuPsD5HX+4vUU99pu\/gfw8XQfiiWf4ErdL+EYqoXCWIB2LQdSXR76\nBiqR11sQKtXpjKwD7\/SeQFH3CeR3\/hycjuOvge3mi0jNDzNAyzAfgu7TMNhLmV2cJ\/49Pi39Kc5V\n\/Rq5oj9BY76HAnkh+8Aq7VnXIbCObJLwtBSTZEdHpuVYSFqRjPcjGiHXswOYnlBBpL4AifYa1GYu\nbINVmAqoMDdugsPZiEJFEfvAGv1F2yFwNqnD7vczzBp8uRp5fcxQIG1Q1neLARa2fIwWdQ4MljIk\nI31ITvShvicHRQpumHVgm1VTXSJ\/f5sCxWQXzyTUTIPxhJEB0oNaar6KQslHaFCeZTYJneK7bX\/G\nP5t+i6HhJgyPNOO6+PROeyhkYR3YYbPx5MGGjnrr1y5uz6\/W6Bps7f\/yNfDNTRIMdCIR1b8+B2mD\nQsVVCE0lGyK3bLY9ELCyDuyy2e47Yv1R1diDF7IxHoTOC6js+xyigW\/QYr0EseUiOR8voNF0HvW6\n86hTX9jlSj\/bzu85N1Ji4CqsqeTAw\/X12lGSVp9PzSow9WxJbYqK\/iULlKFzrPSt0xUg4ygf3Q9r\nYAx3wBRpgSnaCqWneVegV4yxBkyvL2m883LYZlvwvyIPo48KYYiKoR6vh8R\/F5VmyRPWgaOPZXDG\n22GM1kMbqUFviE9aKvtBa2VM2v130DFWwow0mol6qCYaIPXz0OIrAq+\/deZIgMNzUgY5mpTBGhPD\nPC0k7dRBPVEFZVgARbgCPSEeZMEyNPvyUeu6BuHDXHIzleQzDeT1SgLkgmdunWYNuLu7OxJ6Yt+c\nSNkIrIcB2sl022LNDNA42QBdtBaaSDWU44LXQNqgxM9Fg\/s7dAV5BNhI2hWg1VeKcpOGvSkGcHwv\nm11PbS4sRlLO3UcLegY4cNDgfwPSJhXjNeT9RnSPyV\/VD1pf8M3mM6z+b4Ygj23t7OSsv3wZfLqx\nmpxfTU9HU5NR97wz6YjrFgdmNEuWKdWSIdq7pBmXLSnDnXOKsMrb4zdNyrzDYZlvJNUy4kg8GBqq\nk7pcP3nb7\/03YhI0Hu4UxTIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/sneezing_powder-1334336408.swf",
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

log.info("sneezing_powder.js LOADED");

// generated ok 2012-06-04 18:57:02 by kristi
