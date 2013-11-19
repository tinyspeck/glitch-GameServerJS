//#include include/takeable.js

var label = "Fertilidust Lite";
var version = "1351473123";
var name_single = "Fertilidust Lite";
var name_plural = "Fertilidust Lite";
var article = "a";
var description = "A jar of somewhat musty fertilidust lite, effective in improving the health of individual trees. ";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["fertilidust_lite", "powder_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"maxCharges"	: "5",	// defined by powder_base
	"verb"	: "sprinkle",	// defined by powder_base (overridden by fertilidust_lite)
	"verb_tooltip"	: "",	// defined by powder_base
	"skill_required"	: "",	// defined by powder_base
	"use_sound"	: "FERTILIDUST_LITE",	// defined by powder_base (overridden by fertilidust_lite)
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

verbs.sprinkle = { // defined by fertilidust_lite
	"name"				: "sprinkle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Improve the health of one Tree",
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

function onUse(pc, msg){ // defined by fertilidust_lite
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	function isTrant(it){ return it.is_trant || it.class_tsid=='wood_tree' || it.class_tsid == 'wood_tree_enchanted' || it.class_tsid=='paper_tree' ? true : false; }
	var item = pc.findCloseStack(isTrant);
		
	if (item && (item.is_trant || item.class_tsid == 'wood_tree' || item.class_tsid == 'wood_tree_enchanted')){

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
			uid: item.tsid+'_fertilidust_all'
		});

		item.events_add({callback: 'onFertilidust'}, 3);

		self_msgs.push("It may be the lite version, but this Fertilidust is still potent stuff. The tree shoots up into its next stage of development. ");

		pc.feats_increment_for_commit(1);
	} else if (item && item.class_tsid=='paper_tree'){
		failed =1;
		self_msgs.push("Paper is impervious to powder. You don't want to waste your Fertilidust Lite here.");
	}else{
		failed = 1;
		self_msgs.push("You realize there are no trees nearby, right? You don't want to go around wasting perfectly good Fertilidust.");
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
		'position': {"x":-12,"y":-40,"w":22,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJP0lEQVR42s3YeVCbZR4HcP\/ZmZ09\nrKu7Os66q1uvcd2t7jq7jrorO2vdcetRq7a21toCUmtFae1lyn0UGghHj5SbUMoRwpEQcpWEJCQh\nB1cIIRAg4QyQA0hBCTSA333eSDu6q+7uTNg1M995n3fyx\/t5v7\/nnWTeW24J0kfKObXJ1ClU2Hrr\nFCbDFcUt37WPTsowTgxLMedpx4iVD400N\/s7BWyVpHttlno4RqQYMteiWZj3\/2uRGqeIczTkRnra\nSkLUkrNcoyYPZkMJOtWX0NnCjO9SXQr5n8Iqi2j7eVUJCpUoBQZ5Noyt+bB0lGGwhwOqPX1zVuCc\nArZepcPex4XVWIluHQtqaT7komwFvzotm8Fg3Bt0nJB9dLuk+hiaeTGggHpZJjpVzEBjFIICmvTF\naFecR5vi3Bdwcw36OssJsBDtygvQNqWjRZAITmmMMejAT709ISMDAtJSNjpUFwMXolqimqTOqTZN\nuiL0GIoDoVBdmtwATCdjQC1OhbwhDqKqo8hlRAR\/f06PyEMk1cfhdLRgzt2OsSExln2DuL5kh2da\nh972yxi3SUDdhM3CJeelMLeVkhZrYe1mB5oXlEeirigMTHpo8IEmY1MUdUEKODoohIRzHDNOHZYW\nB6ASpoDHOhjAjQw0krGz0HD5EJSCpMBWoHBKfgJk9TSI2R+jvDhhZOvWrZuCChyxSrZPjWtIW1rM\nkgYnR5sDDS4v2QLN2ft5cE+1YmpcEWiXugkq1D5VCZNh1OaD2sPluWFgnX+TG\/QG\/SsrLOfSUuM1\nv189MT0y45iyLQ6NDzjMNpNjeNyEfnsbeqwadJib0dohgkLHQ6OCPV8prXVcFlU68nksewqHY4ir\nqGjIEouD+5AA2D6\/stLRt7iYvLCyovl0ddUw7fMJhQMD8SUqVSpTIqEz6uoY6SR0krT1nCFJrqlh\nnBUI6FkKRVppX19cjdNJu6hSWdIlkqjgtef3l\/UvLiZOLS9foYAEq7H7fEz9tWs0DYmKRDk3R2sm\nkZJcnZmhiUmEJI1uN62BhOd2R9c7ndEEeLpybCyRAIM3Zvv4eJ75s89obr+\/joxYMUfS5\/Olfx2w\n+RuA5BjT4HTGcEnYpMVshaIuaEDr6KiSAvpWV3sJrokKGTf9BlC7nn\/GXv0qMJYAYwkwNujAgdFR\nnYGMaGltbWDG7xdQsSwuplHAtoWFL\/KlNYVVrY+bapICCjyeOL7LFccjqSZjpkskFUEFKsfG4vxr\nax4K51lZ4RJgahfBUOkm7d5Yd6xjtettStfHLZ6djRd6PPGNJNQ+TBMI2EEHrgIuag86r1\/nkBGf\n6SYYavRULOsxr2O\/3CQ16ubZ2QSxx5NAkAk1bvfGAP2ff+4cXRjX6h0aadfcJL1\/HdXv89Go9Y2Y\n19ukkJr1\/Sj3epMkHk+SiKSWPM0bA1xbm5b0FVxvMjOR1vgqkvg7LbG83bJcdUpZWRuzoFTPLGBp\nmQXF6gsFBS0XCpjKcwU5spyCZHakLO1y+GhR7cnpPXG\/9daRJ3lDgPrRBiz6HFhdmoJ\/wY7la\/0Y\nG5OhzVwKfXcxtB35UBty0aK9ALk6B1JFJtTkp26kh49RsxD27gYUlh\/GgbQQSzyHUxtUoMRiSZQP\nXsba9Rms+iYJ0BYA+mYt+MxjwryzC16HATNjWriHVZi2yeGwNmHcIvoSkI\/BrnqExz2O2Kqq+qAC\neZ2dKVJrMQG6sDBvDQC9c72wTpPfYIcOQxP6fwMUkb9gbAx1cfFu\/O82Bijuy0dtRzxk5otweS2Q\nO1RoHJWDN9yMuiEp1HbFNwIbJWno0JZiyMjDuwm\/3xjg4ZpfI1n0IiZmjWiaVKHYeOErQM7AVXTa\nFDeBwwNNYDUcR0+vAGeL92C4R4BLZe8hYqOA4VX34VzzXvBsbAJsQU5rLLJUMSjuKroJrOmTwDak\ngHVYDvGYHIcLt+FExQFEX94PmaEKueXv46Ujd28McN+Vu7CXdSdprJ40J0JE2ePYV\/AAQgu33ARW\nESCb7DfxhBK1Q414JeEePH\/iNoRnPA2W\/gpSK6PwfOTtwQdWazSpB0vuxOH8uxBV\/2eElj6E1y9u\nwo6cW7Gd8WNEFD+J09wwfFITihPs\/ThVfQA7Un6JNz78Pp778HvYk\/gIPmK+gkMpT+HvH9wRfGCZ\nTEaPKbzfxz+zBcLELSg48wDykjaDGXcfSmibkU77OU6e\/hmOn7wDR4\/9BGcP3QF6+G3I2H8r4vb9\nABkntoBx9Degf\/QIXj78040Bxsv2yrKyNweA\/PhHwY15BLW0h8E59SAqj21G2ZF7wYq8B4Xv3428\niDtxMfR25LyzCZlv\/QhFx55A\/pHHEHH6UaSLWawNAapc\/Ylxkj2yqNJHJ5MzfoEr8Q\/+R8Dkt3+I\nzE+ewNmEZ+dPlx7qKjYYsjcEaJ5vPW+aOS9rd56yN1h2IKf5KaTUP4bkooeRmP8Q4i49gOgL94OW\n8yucyLwXUfT7fIcznul4L+9VWb1ZWqHzes9RKdLpsoIKtLk0E72TJyd6XBFQjLyNrqlwdE2\/SxKO\njikqYWgZ3YeWsX0QDe1Gbd\/rEA69iUYSnj1Z1jROl+mdFQaBLcWhnrzUV6IrrA8q0OiqQuPgm1CN\nvQOTMwJm10F0kyMFptZm90HwB3ZBOvwWlASqnThAkK+hYWAnOORIoQ2OaHCtUeQ8EgzdNtD55xB0\nINe6E1L7W2ifDIORNNjveQ\/WmfdhmAyFmCD4g7sCzRZ2bUOm7jkw219AhXl7AK53xCDHEIqElj2I\nlDyNE7VJbRsCrCHjY\/fuIOs3UNX7Kur73yDf7YLYthuy4b0o7X4ZqZq\/IEn1LGjyp3G06Y\/4mCTH\nEAaGPhTRit0E+Exwga7F3n8BXul5BWWmlwNt5Xa8gPNtf0OWfivStX\/9CvCY9ElEip9AhvYA0nUH\nkKx6OwCM5p7vD+abhewRr5w8DBfJaEtuAlndL30rMFb5pwDyyNU\/IFsfhkySVMVBJPMZyBCLg\/sO\n27+6uv\/T5eWRMW8ftOMly6J++jy795C7yPji1wIThdsQw30J0XWvIbHuA+SSf9h5ah7ylcqpPKXy\n4Ia9Bp4DNrkWFvZPeL3xdpdLYXU63eapKUeLybR81WBAY2sruC0tKBeJFKUCAb9ar09i6\/VRZVpt\nCLu19f7\/9nr\/AMCgGbpkbQbqAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fertilidust_lite-1334275394.swf",
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

log.info("fertilidust_lite.js LOADED");

// generated ok 2012-10-28 18:12:03 by mygrant
