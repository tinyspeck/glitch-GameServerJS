//#include include/takeable.js

var label = "Teleportation Script";
var version = "1352162718";
var name_single = "Teleportation Script";
var name_plural = "Teleportation Scripts";
var article = "a";
var description = "A lovingly handcrafted Teleportation Script (Or \"a magical location incantation scribbled on some Paper with a Quill). This will zip you on a one-way ticket to somewhere specific… as long as you have a Teleportation Token or the energy to pay for your ride.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 5;
var input_for = [];
var parent_classes = ["teleportation_script", "note", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.initial_text = "";	// defined by note
	this.instanceProps.initial_title = "";	// defined by note
}

var instancePropsDef = {
	initial_text : ["Initial text to show on this note, from no author"],
	initial_title : ["Initial title to show on this note, from no author"],
};

var instancePropsChoices = {
	initial_text : [""],
	initial_title : [""],
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

verbs.imbue = { // defined by teleportation_script
	"name"				: "imbue",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Spend a Teleportation Token to make travel with this Script free",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid != 'teleportation_script') {
			return {state: null};
		}
		if (!pc.skills_has('teleportation_4')) return {state:null};
		if (this.is_imbued) return {state:null};
		if (!pc.teleportation_get_token_balance()) return {state:'disabled', reason: "Buy more Teleportation Tokens!"};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.prompts_add({
			txt			: 'Are you sure you want to spend one Teleportation Token to imbue this script to '+this.destination.name+', '+this.destination.mote_name+'?',
			is_modal		: true,
			icon_buttons	: false,
			choices		: [
				{ value : 'yes', label : 'Yes, please' },
				{ value : 'no', label : 'No, thank you' }
			],
			callback	: 'teleportation_imbue_script_prompt',
			tsid		: this.tsid
		});

		return true;
	}
};

verbs.read = { // defined by teleportation_script
	"name"				: "read",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Where does it go?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.readScript(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.write_on = { // defined by note
	"name"				: "write on",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Change what it says",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'teleportation_script' || 
				this.class_tsid == 'teleportation_script_imbued' || 
				this.class_tsid == 'note_hint') {
			return {state:null};
		}

		if (this.last_editor && this.last_editor != pc.tsid) return {state: null};

		var disabled_reason = null;
		if (pc.skills_has('penmanship_1')){
			function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
			if (!pc.items_has(is_quill, 1)){
				disabled_reason = "You need a working quill.";
			}
		}
		else{
			disabled_reason = "You need to know Penpersonship.";
		}

		if (disabled_reason){
			return {state:'disabled', reason: disabled_reason};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var rsp = {
		    type: "note_view",
		    title: this.title ? this.title : "A note!",
		    body: this.contents,
		    start_in_edit_mode: true,
		    itemstack_tsid: this.tsid,
		    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
		    updated: intval(this.last_edited),
		    max_chars: 1000
		};

		pc.apiSendMsg(rsp);

		return true;
	}
};

function parent_verb_note_read(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	this.readNote(pc);

	var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
};

function parent_verb_note_read_effects(pc){
	// no effects code in this parent
};

function getLabel(){ // defined by teleportation_script
	if (!this.destination) return this.name_single;
	return this.name_single+' to '+this.destination.name+', '+this.destination.mote_name;
}

function imbue(pc){ // defined by teleportation_script
	this.is_imbued = true;
	pc.teleportation_spend_token("Imbueing a Teleportation Script to "+this.destination.name+".");

	this.last_editor = pc.tsid;
	this.last_edited = time();

	this.history.push({editor: pc.tsid});
	if (this.history.length > 10){
		array_remove(this.history, 0, this.history.length-10);
	}

	this.state = this.buildState();
}

function onContainerChanged(old_container, new_container){ // defined by teleportation_script
	this.state = this.buildState();
}

function onGive(pc, msg){ // defined by teleportation_script
	var target_pc_tsid = msg.object_pc_tsid;

	if (!pc.teleportation_scripts_given) pc.teleportation_scripts_given = {};

	if (!pc.teleportation_scripts_given[target_pc_tsid]){
		pc.teleportation_scripts_given[target_pc_tsid] = target_pc_tsid;
		pc.quests_inc_counter('give_teleportation_script', 1);
	}
}

function readScript(pc){ // defined by teleportation_script
	var rsp = {
	    type: "teleportation_script_view",
	    title: this.getLabel(),
	    body: utils.filter_chat(this.contents),
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000,
	    destination: this.destination.tsid,
	    is_imbued: this.is_imbued ? true : false
	};

	pc.apiSendMsg(rsp);
}

function setTarget(target){ // defined by teleportation_script
	this.setInstanceProp('initial_text', '');
	this.setInstanceProp('initial_title', '');

	this.contents ='';
	this.title = '';
	this.last_editor = '';
	this.last_edited = time();

	this.destination = target;
	this.is_imbued = false;
}

function use(pc, use_token){ // defined by teleportation_script
	if (!this.is_imbued && !pc.skills_has('teleportation_1')) return {ok: 0, error: "You need to know Teleportation I to use this."};

	var dest = apiFindObject(this.destination.tsid);
	if (!dest || dest.getProp('is_deleted')){
		pc.stats_add_imagination(100);
		var msg = "Your destination is no longer available! As a small compromise, here's 100 iMG";
		if (this.is_imbued){
			msg += " and a refunded Teleportation Token";
			pc.teleportation_give_tokens(1,"Teleportation Script refund");
		}
		pc.sendActivity(msg+'.');
		this.apiDelete();
		return {ok: 1};
	}

	var ret = pc.teleportation_can_teleport(null, true, this.destination);
	if (!ret.ok) return ret;

	if (!this.is_imbued){
		var energy_cost = 0;
		if (!use_token){
			energy_cost = pc.teleportation_get_energy_cost();

			if (pc.metabolics_get_energy() <= energy_cost){
				return {
					ok: 0,
					error: "You don't have enough energy."
				};
			}

			pc.metabolics_lose_energy(energy_cost);
		}
		else{
			if (!pc.teleportation_get_token_balance()) return {ok: 0, error: "Buy more teleportation tokens."};
			pc.teleportation_spend_token("Teleportation Script to "+this.destination.name+".");
		}
	}

	ret = pc.teleportation_teleport(null, true, this.destination, true);
	if (ret.ok){
		if (energy_cost) pc.buffs_apply('teleportation_cooldown', {duration: pc.teleportation_get_cooldown_time()});
		this.apiDelete();
	}
	else if (!this.is_imbued){
		log.info(this+' '+ret);
		if (use_token) pc.teleportation_give_tokens(1,"Teleportation Script refund");
		if (energy_cost) pc.metabolics_add_energy(energy_cost);
	}

	return ret;
}

function canPickup(pc){ // defined by note
	var c_type = this.getContainerType();
	if (c_type == 'street' && this.container.isGreetingLocation()){
		return {ok: 0};
	}

	return {ok: 1};
}

function onCreate(){ // defined by note
	this.initInstanceProps();
	this.contents = '';
	this.title = '';
	this.last_editor = null;
	this.last_edited = 0;
	this.history = [];
}

function onInputBoxResponse(pc, uid, body, title, msg){ // defined by note
	if (this.last_editor && this.last_editor != pc.tsid) return;

	function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
	var quill = pc.findFirst(is_quill);
	if (!quill){
		pc.sendActivity("You don't have a working quill anymore!");
		return;
	}
	quill.use();

	this.setInstanceProp('initial_text', '');
	this.setInstanceProp('initial_title', '');

	body = str(body);
	title = str(title);
	if (uid != 'teleportation_script_create' && this.contents == body && this.title == title) return;
	title = title.substr(0, 150);
	body = body.substr(0, 1000);

	this.contents = body;
	this.title = title;
	this.last_editor = pc.tsid;
	this.last_edited = time();

	this.history.push({title: title, body: body, editor: pc.tsid});
	if (this.history.length > 10){
		array_remove(this.history, 0, this.history.length-10);
	}

	if (uid == 'teleportation_script_create'){
		var loc_info = pc.location.get_info();
		this.destination = {
			tsid: pc.location.tsid,
			x: pc.x,
			y: pc.y,
			name: loc_info.name,
			mote_name: loc_info.mote_name
		};

		if (msg.is_imbued && pc.teleportation_get_token_balance()){
			this.is_imbued = true;
			pc.teleportation_spend_token("Imbueing a Teleportation Script to "+pc.location.label+".");
		}

		pc.prompts_add({
			txt		: "You've created a Teleportation Script! You can give it to anybody you like.",
			icon_buttons	: false,
			timeout		: 15,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
}

function readNote(pc){ // defined by note
	var disabled_reason ='';
	if (pc.skills_has('penmanship_1')){
		function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
		if (!pc.items_has(is_quill, 1)){
			disabled_reason = "You need a working quill.";
		}
	}
	else{
		disabled_reason = "You need to know Penpersonship.";
	}

	if (this.last_editor != pc.tsid) disabled_reason = 'This is not your note.';

	if (this.disabled_reason) {
		disabled_reason = this.disabled_reason;
	}

	if (this.getInstanceProp('initial_text')){
		this.contents = this.getInstanceProp('initial_text').replace(/\\n/g, "\n").replace(/&quot;/g, "\"");
	}

	if (this.getInstanceProp('initial_title')){
		this.title = this.getInstanceProp('initial_title');
	}

	var rsp = {
	    type: "note_view",
	    title: this.title? this.title : "A note!",
	    body: this.contents,
	    disabled_reason: disabled_reason,
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);
}

function parent_getLabel(){ // defined by note
	if (this.class_tsid == 'note'){
		var container = this.container;
		if (container && container.is_bag){
			return this.title ? '[Note] '+this.title : this.label;
		}
	}

	return this.title ? this.title : this.label;
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("teleportation_4"))) out.push([2, "You need to learn <a href=\"\/skills\/97\/\" glitch=\"skill|teleportation_4\">Teleportation IV<\/a> to make this."]);
	if (pc && (!pc.skills_has("penmanship_1"))) out.push([2, "You need to learn <a href=\"\/skills\/82\/\" glitch=\"skill|penmanship_1\">Penpersonship<\/a> to make this."]);
	return out;
}

var tags = [
	"teleportation_script",
	"no_rube",
	"bureaucracy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-28,"y":-16,"w":55,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ00lEQVR42sWY+08b2RXH8x\/sn5A\/\nIX+C\/4T8UlXdqlW6P3SrSm2R+lCkqpI3m00abQIJyTYkBMLD2BgwGJuXH5jBGBvw+\/22x8ZgnrZ5\nZzfZ7ek5dx4YDARHK9XSV3dmPPfM555zz7l35saNa\/zeVeM3j3fDt386TCnhXUYJJ+kWbBWnyt+8\n8f\/47ZRcilrZoz\/ejYCkDwdJgJPMhfrvcRp+PEzRPfz7gyT301GKw2uy6Nr7\/Tj3fTXG9K4aAxLZ\nPdoJgXuuB\/q\/+wv0tv8pMKG6r7wSbqu4eGe75IKdtWWobXihHpIkGT+pRBv+O6+jnTAcbodgfyuA\ntvxQLXvhEIGk\/2t4PjfeDi8e\/AZav\/oFtN37Jbxp\/RImB+7fuRQwujL0lE+YA6vpWdgoLEIVIelB\n8gNJeHy4GxWE5\/tbQahtBqCCEBepyuSDStkjyg27626wjrYyuPZvPofvHv0WXn77O9QdGO68q7\/c\ne6tO2Cktwe7aCjNSQcDaph9q6IU98gYCHRBYJQZH1QReC18KJgNuknzMFtkk2wGHGjqf\/B7aH\/wa\nOh5\/AV3PvoS3z\/8I3SjNq7\/XLgTM+0dvFhOWmgRYEQGrZwAjImAcDhDy43AB1pdskK2KCGgZeQzP\nvvkV81hX+x+gv6MFNG\/+BurOv8JQ1124zINQ78GPAR7VEqytXhDe2laIeZf6nAfc5BfB2P81\/\/zh\n54rOti8U\/S\/\/rNB2\/aNlVPUv5UjfP5XDXXdbGjOXX1BIgNv1IcaJTPMnHbVA0G1oCPFRLYltEiGC\nDIyg6H8S3XsK6GO2yGYuMgNG1X2uqdKSj5hu5RMWKOXmQcrijYITUqEZSIXN4JrTwHreCfuiFxNB\nswgZF0CZ4uyaABdh9+6xBDpNEgFwunlA+qWjJj4TMwGpmJ6DcsGBsMuwWVyCeXOfHOaQ2whe56js\nycpGADZX3TLcAWb5We\/5WTUQAFegzDtqGOKnTQNmojNPJcB6LS8MosemYWt1BQopDnQDrRAPzuAA\nlmFm\/BUYh1\/g\/yYR7BRuj+pfnffiXj145\/sD09pH3Cd5MBO3KJKhCT6ftEIhbcOQLiCUC6wTnRhm\nE7gdw8AnOXBxGrBb+mCw5xELIwFmYzb0rAH\/G4R4YJp5riZ6jgr+HrUIWWVyg3PmNRj67t1uGrKY\nNPMoOVloLlJYWIHdEBKGHiyB0hyjuZmJWpnW8ousaJ+HO69C3EyZ3NM0YCk927KJc0\/IaBcrOWcg\nyQMiKCs\/51QVQ1oVPbZ3CSCJG2+vNQ24lXfc2ixgaIunkBWEW8vaIY0ZvZ5dYMarskfPqiImQ0UM\n51WAsRXdp4W5zM\/XJEjy4DZmsWGonbXB5THWSnOqUqeo1ygsZUwrrJZeBbmDg\/+kZFnPzXMbvB3h\nXMyQxzGEdVDNvKcbeMLO6TqdM0gE4mbewojqCYOiKYGlBLJRM4vA+VDv4qDL+Xko5+bAacIq0H9P\n0ZwHc9xTMkCQ2xjmGHrGbuqF2Yk3zHsES56M+ybAaRuAJJYggvM5RzCDJ8Ex2w8Oaz9eewxmwysI\nu\/VQSM4yWxQVAY7DAdpw2hgA94D6Jj1oU9LoynkOIQVQCvkmvwCFhAmS\/jGmXGSCPYhlvKgtUXzC\nCkucGijhqC\/ZIFuS5whuLTsLaxkrTGseQnOZnLIqS2krlDKzUEpZgMpOzDMCXnsPrMy9YQotqWEV\nr28xr9TLIUOdgtlPvSbBZQS4UtoC9okXzYW5mJhRFuLTUK\/JkTaY0rWBw9QBQacKEj49zjETPsAG\nC5Ze5l3SBqqUsTHvhd3j4MZVqJgyQz42BengOPbT4YoyAuHlQXBzXWyw8xPP4aNb\/TMejE8rzgPa\nJl\/BUO9DUL25D75FDai7H8DsZCfORxXoB9tgNWUFPm6BDK44m7wTDNp21i7iXFzPchBZ0crel+S1\nv4XIshYHrGkum0sZi6KYxA0DSgKcm+oEj32AHUfcOgbnXtCw+URtMmBETUPUYwS3Xcta5+wA6DB5\nqPU7tSwhgs4BCCz2Q9yjg1RgXBbtD5sK8WpyBr1iQpnZPCGxOcPOrWwOrWcl2WAjb8fysQyVNXzX\nMHYyKIIsYLIk\/AbWh2xlwsYzYBT2XMQIpqFH10+UcnzqZswzpEwF9XwuYjgFRa1nrAxUmOCnx\/XX\n1rNzDJglGvZZZUIbOOgiqhCfgiyCkviosZaPGjjO0N5ybUA+OnmnEJuoFRJTUExMM9GDyuitq7Qu\nZqUMxKBMDEqyQzYL8UlI+UfBY+vW01JnHX70WVNlBl3ew8cmgETGSvigNXowPozHOUgZmcUaSEph\niEih5SGYGXuBYdUJQA1QAphkNx81ogwY3nEIuwbAqnt8\/TmYC48HqDMZ4WNGwahoPIMTXYKStGDu\nZqJjSgQC8thVmFiv8XoXrjijDWD5CM09PeTCWK7CY2Aba4UmAPVCZzQigJ6FzUZOIV22XpgYecaO\nY14d1r8+GUaQUYaKeYeZzXqwyNJAzcd1K+fG2q5XqDPhMUU2NMo6Z8OCIQZ6BpZCY0BvjgM33Yl1\nsJW1s5MdrF6SRge+xbaDyWntZoq5tcwms43PyJCCOoiuqK+\/ec0ERpTUicRAUekAbgLcGggvqcDv\n6GHHmdAYA08FdOBzqHApHBK9I4jOfY5+Bpr0j4hQIphon+ym\/EMQXOwhwOttXiMrKmXYpeKTviE0\nQgaGIbqsYvLMd8urQHCxF+gewSP1GoOgS407n5ewPNeD9wzLIAkvvq+41bhRVUPCo4GUT8uu++a7\nGleS98c57scTXg8\/FJXwoaQAqH6W9GtvU6c4dpagJEWW+huWKlpLCTTuwbc+r5YphTABtlqoRC8N\nN9iqV2xlABxTLxpDfLKfrb07yALpe9QPhzmm41ocX4T8WGjnWVkRJrgRQq5GwHqFXH3yQ8nr5DWC\nI49dBUjixp\/SZuFsocZ3WL304n0ofR2oJREwBcd7KTjZT4M0gHd1AzivD8d5poPdMBsYaX87gAoy\n0btxOqC\/EhBrYON2a2vNcWu76KzJr5byt5izb26nn96C8ue30w9IMeEjEhtcAgeXlAd3sp+RB7c4\n\/fpKQPTexTWwnLfdxL1aoH4zsCYu\/vKOWtz6s\/2e+Dq6xXbPLvkbjjA48WvYBYMLODSongvhliwd\nHy8x+cjoLap\/qNtYRJWkbGRcn4uOc1jveGkloeWKLV+000kKa20pbW4YHO2aafcsvdcUExaYHW29\nEHJm8N\/owa9v\/Swf1zN+jYKUDGhbMoEhJSZBTzo4zKWDIwGpuMuFXV59hBUlgbtom74NnDP\/gZBT\nSCjK3qZ20j\/HL+7uVwhStSQ8aiWTT61MetVc0jvILUy2sw9HTBjay3Yy\/wPdkbOn0zPV6QAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/teleportation_script-1334877963.swf",
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
	"teleportation_script",
	"no_rube",
	"bureaucracy"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"t"	: "write_on"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "imbue",
	"e"	: "read",
	"t"	: "write_on"
};

log.info("teleportation_script.js LOADED");

// generated ok 2012-11-05 16:45:18 by lizg
