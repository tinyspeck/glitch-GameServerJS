//#include include/takeable.js

var label = "Extremely Hallowed Shrine Powder";
var version = "1346894217";
var name_single = "Extremely Hallowed Shrine Powder";
var name_plural = "Extremely Hallowed Shrine Powder";
var article = "an";
var description = "A jar of extremely hallowed shrine powder. It lets the giants know that, when it comes to currying favor, you really mean business. ";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["extremely_hallowed_shrine_powder", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "sprinkle",	// defined by powder_base (overridden by extremely_hallowed_shrine_powder)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "EXTREMELY_HALLOWED_SHRINE_POWDER",	// defined by powder_base (overridden by extremely_hallowed_shrine_powder)
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

verbs.sprinkle = { // defined by extremely_hallowed_shrine_powder
	"name"				: "sprinkle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Scatter near a shrine for triple rewards",
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

function onUse(pc, msg){ // defined by extremely_hallowed_shrine_powder
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (pc.buffs_has('extremely_hallowed')){
		failed = 1;
		self_msgs.push('The giants are already listening. No need to bother them further.');
	}
	else{
		pc.buffs_apply('extremely_hallowed');
		self_msgs.push('Invisible waves of energy emanate from the shrine. The giants are listening. Better make this donation a good one.');

		function isShrine(it){ return it.is_shrine ? true : false; }
	        var item = pc.findCloseStack(isShrine);

	        if (item && item.is_shrine){
			pc.location.announce_sound_delayed('EFFECT_EXTREME', 0, false, false, 2);
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
	out.push([2, "Sprinkling this will give you the Extremely Hallowed Shrine Powder buff (your next shrine donation: superduper powered)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && !pc.skills_has("intermediateadmixing_1")) out.push([2, "You need to learn <a href=\"\/skills\/16\/\" glitch=\"skill|intermediateadmixing_1\">Intermediate Admixing<\/a> to use a <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a>."]);
	if (pc && pc.skills_has("intermediateadmixing_1") && !pc.making_recipe_is_known("163")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/462\/\" glitch=\"item|beaker\">Beaker<\/a> a bit more."]);
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
		'position': {"x":-11,"y":-45,"w":26,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI+klEQVR42uWYWVNaaRrH+2pu8xHy\nEVLzBcaL6Zqayk1m6e5pM53REI0xm4kplxi3oMYFETDiLooE96iIsgoKKpKAuICCskZENkUR2bt8\n5n1PYiqZmrmYKujpqqHqX5ziUOf9nf\/z\/J\/zwjff\/L+8Ghoari0tLcH79+9BIpHA2NjYlV8VIJfL\nXVCr1eDxeAC\/j46OTv2qALu7u\/uxc6urqyCVSmFgYOB\/B1hbW3uDSqVW0en0\/t7e3gU2m73A5\/Pt\n6BiGhoagp6cHv69jV8fHx6uYTGbV4OBgRkVFxbW0QZWUlFwhk8lTFAoF2tvbsUO4z2B2dhbkcjkh\nfA6VFhAw9PX1wcrKCuEmj8eDkZERYLFYgG7qpLGxMSvlgJ2dnTcqKyuhvr4eLwKopMDhcAA5BMg9\nEIvFsLCwAEqlEhQKBQEsEok+w+Eb6ujogJaWFkA3up5ywK2trQy8OHYML4gXwqDYTfyZUCgkIHEf\nYuFjgUBAvM\/PzxOuotaA4uJiyMvLW0gLIIYxGo2gUqmwC3B4eAjBYJAoZX9\/P6DvEAmWyWTQ1NRE\nwOOy0mg0yM3NBdSDUFRUBGgkpR4QLUrTarVgNpuJWYeaHtxuNwGIw4EdxeAYEJeVwWAQrmHA1tZW\nwnUUFkC9DNXV1XD9+vUbKYe02+00r88HXq8XnAcH4D8+Bh+SxWIhnMUOYnjcCnhoz6M+nEDlpyIn\na5qboQI5WUShRPKKi\/+SliRHk8mMnVDoidJm45hcLvu61epgyeUy\/tqafkqj0Y+r1foRlUrPWV7W\n9ysU+q75+bUWPl\/GFAjUHQKBtnVubqh5ZmYIXeo3aQXUh8Nlx4kEH0sYCGROOhwkrsHwcORfxN3a\nIjTvcvXuRKPly8Hgy16VipkWOAC4EopGp9VnZyTd+fkzBDcR+Pnnid1IpNSCFteFwyRVMJh5qaVP\nWkTShELVxvPzF4rT05KBjY3nbXL5y5TDRRMJ7mIgcGvz\/LzIm0iwjxKJIWc02qhDwOpQCEMQ0n1x\njIXPYeCNcLjNGI2WrZyeFnNNpvwWiYSRSsCC1ePjHNnJyW0EN+BDcsfj1EugTaRhV6Ckx+Imd+zs\nk19vWMi9W3slm18Ar5+fF5uR21jykxNSn053r0kgyEgJYCgerxo2m2\/pP7rX7Ufaj8crMIDqLEpq\nsfq3J817MKrfAo72HbCWFdAlE0E2h7ctdXlI+HuGWOyBPRYrsUQiJZqzszIJ6t16sfhpSgA1Fss9\nfEFTJFKMANuQg22eeLxu6SxMqjcf+46PjEDR2+H2ogluCrTw17FFeDUnBKlqFr6lsn3yfQ9pFwE6\nY7FiG9J6KFSFe7NRKKSkBPAd6hl8wV0UDm8ySfUjmUIRBt1yxG61+sDl34Xn6x++AiycFIDTKILf\nNfbBQ\/Y0m61ep+zHYkWOSKTIEA5Xyv3+m\/V8PjUlgCan88mczXbLGos98SWT9Srvyaw54I2eBa1Q\nagqAwWOBc\/8m2PfXQG1Ug8OsALcZPe54U\/BHKgv4kiHg8DjQMifT7EcizzDglMGQXTMzcyslgIFQ\n6OGoTkfajkZJKBxkyb7HcRH3QPLcBvYjKzSY\/UDedHzuQaZiEb4fnAXSwDgoVibBuj4JlvVpYAyx\n4CCReIpm6YMemSy\/USDISlWKs4Q63WNDJHIT9V65aN9tu4i5CcB4cBeIHjTYvwpJ\/pgAdreE4NDz\nCUDrJh8YXBYcoiqgQU9q5vObmufmrqZsDm47HJSVw8OfnIlEweyHQ8tF7BCSYQfhIN3qBfWHHQi6\ntXDsXAWfXQndMjFUv536BDgFtq1ZoL3pgw+RSKfMaMymCYWvUjqsj8\/O6DMazR0HKjPPdmC+iLmQ\ng3aYRZuGqt0josR177ehUqGBUpEChUQIf2COgXDxLdg2eYSDLW96wRWPVw\/LZPeoEgk5pYDxZJLG\nUyoL9yKRzLe2A9NF9IAA7LZ7iJDsugywZl0nQrK8+TEkbXPTBKB9i\/8RcLAHbOHw3XahsIYqEqX2\n90kc4JrF6WxVO523xAdH5TrPvh8D4jFzmeIvS\/wVoH4O9BoUEr5YKtfrSUyJhJ6WDcNZOMyfWFq6\na0cuSg4DL4Qu72T1bsAfCez8W0Cegg\/Z3UOBtytLhl6JTHeYSBSOSqWktvn5rLQARmKxAqFKVYoB\nUS9l+pGemU7P\/xMgfpK8mJYpzhKJe\/jpY\/L7f2oTicraZLKraQHEaXafnEwqUQrRwM1EIyezdPfU\nwba7YNWxA1qr7nMPLmok0Dg9BcxFzTzamuV54\/FK0epqbrtcXpbWH+1HwWDrKErhpYsYcjUQfjS+\nf0wet3nJw3tOMsdgI\/frTGSpxfHoKJlsQpuLuwfhcH7v5OSPnUrljbQCnkSjGSsGQwNO85eQnk8l\n\/1L4M1TaHE80mqOxWkndYvGdLq02\/X8qmQ8PhxcslqxLSI5O2d6lkWpMJ8ekS1gM7k4kshHcHbSx\nvYNd71Iqf\/xF\/pux+3x07uLiXZHLXsLaWlqkvRMAQyuGZuW0Q+PaJ9k\/gU8bda2bp4H7aKvVzOBy\nC1gqVcYvAri2b3Uw12WRtnUZMDRioL8XQq9JBcwNOdDfiXzUJd52k3zCUYN2Ma8kw0BbmPKWjXQJ\nX02PsNMOF4hGr\/I3VkMvpnugSTkFrVoJdO+sAGtPDXWyUagWvYH6hXGonR+Gl+iYoRZA58YCPOXS\ngDIz4Uu\/e4696UpePxSNMeHZMAOevGmB51Pd8GykFfK6a+FOeyVUzPZDo3ISmpdnoBWNmw4EeL+v\nDnJfV0Ht5FBPWgF5mypvi3oOQXURKhprg8eDzfBooIkAzGmvgix6KdztJEMZchmfv9lUCN9V58G3\nBd9D\/fSYN62Ab9RSd+nbLsLBcn4f4eIjNgUesBoIwNyOagIwi14C\/6CVwHc19+Fvrx7DDzUP0HE+\nVI0OfEgroPf0NP+dZSdk8R0Ac36CKHEBhwoP+xs+O3j79QvIZjwnAH+oewh\/Ru79qSIHCvtaLqhz\nvMK09+FpNPr7BeOmYlQtjTfNDhLlfdBX\/xmQ1FZOAP6dUgiZDU8gh14er5sY9NZPDP32v13rnwdl\nTdVHkEAZAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/extremely_hallowed_shrine_powder-1334335901.swf",
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

log.info("extremely_hallowed_shrine_powder.js LOADED");

// generated ok 2012-09-05 18:16:57 by martlume
