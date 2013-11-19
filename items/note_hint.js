//#include include/takeable.js

var label = "Secret Juju Hint";
var version = "1346778856";
var name_single = "Secret Juju Hint";
var name_plural = "Secret Juju Hints";
var article = "a";
var description = "If you can decipher this clue, it might lead you somewhere interesting.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["note_hint", "note", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"note_background"	: "http:\/\/c1.glitch.bz\/img\/dialogs\/notehint_bg_01_80921.jpg"	// defined by note_hint
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

verbs.write_on = { // defined by note
	"name"				: "write on",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
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

verbs.read = { // defined by note
	"name"				: "read",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "What does it say?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'teleportation_script') return {state:null};

		if (!this.contents && !this.getInstanceProp('initial_text')) return {state:'disabled', reason: "It is blank :("};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.readNote(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canDrop(){ // defined by note_hint
	return false;
}

function canGive(){ // defined by note_hint
	return false;
}

function onCreate(){ // defined by note_hint
	this.initInstanceProps();
	this.disabled_reason = "You can't edit this."
}

function readNote(pc){ // defined by note_hint
	var disabled_reason = "You can't write on this.";

	var rsp = {
	    type: "note_view",
	    title: this.title? this.title : "A note!",
	    body: this.contents,
	    disabled_reason: disabled_reason,
	    background_url: this.getClassProp('note_background'),
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);
}

function setText(title, text){ // defined by note_hint
	this.title = title;
	this.text = text;
}

// global block from note_hint
this.article = 'the';

function canPickup(pc){ // defined by note
	var c_type = this.getContainerType();
	if (c_type == 'street' && this.container.isGreetingLocation()){
		return {ok: 0};
	}

	return {ok: 1};
}

function getLabel(){ // defined by note
	if (this.class_tsid == 'note'){
		var container = this.container;
		if (container && container.is_bag){
			return this.title ? '[Note] '+this.title : this.label;
		}
	}

	return this.title ? this.title : this.label;
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

function parent_onCreate(){ // defined by note
	this.contents = '';
	this.title = '';
	this.last_editor = null;
	this.last_edited = 0;
	this.history = [];
}

function parent_readNote(pc){ // defined by note
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_vendor",
	"no_donate",
	"no_discovery_dialog",
	"quest-item",
	"bureaucracy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-15,"w":58,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEsUlEQVR42u2YS08bVxiG+Qf8hPwE\ntt1F3XZDpW4qtRLdROoiSip1kWwaqBpFCWo6NC0pJGkMhaSQUJwLxVcYcPBtPPYY49t4sB1KoBAg\nE5FIXX6d9yRnesYpqLa5VeJIR2fmDJ55zvt93ztnaGk5bsftf9rUqK9DiXjlVNzbduTgMknZpSWC\nhJ5Wg+aRgSyX1dayHtUqeozEXsiETH3hyeFCVg3lZKUYNWvh7G5dw98cDlwxdnYnsImHA5RJBu3z\nqh7vODCwSiV1olyMyUY+4oAqLoQYFMaZ4H3qvHCGHQuQnfsLpsfbNMV\/FjmH0C0WopRNzxBGAIzc\n6WVgHPb6jxepR7pAatRjQ1oLc+H3ewqUiHjdKSVAHEiJel1GLtyOB+rZORob7bfBMPon7zqUBbg4\nh4JqGhIhxM1gGYmol\/WFlEx8Tol4tGImJOEc89LVrygSesjUgnKiaoAev3+THfO8tO5fhQBNWQfC\nCMU4IDpURO6pMR8lIh4zq8ka5n4d7qUbfZftnPtlQKJbN7odhQJoqOmo8GKsvakQl3JzpggIYB5a\nPpdJTltgT+jxgwEa+PmqDSkqx6H5NUeFW27QMOTSotrB1BIgS7kwu3E+E7LnknE\/C\/3s1Djd7L\/C\nQNABdfGbL+3q5vaDUaxwFE\/DkLn52U4REDC8ckVI3lOK\/53QItwcWrQk5K0AKTdcPKhcEYIXDA+3\nqDKOEXIA8OoFCIcUwWvzsqni0RJ+t6UmK5Jak8Y5rAghRi4m4z7bYhBOXtVcTdHcsQjM5+ZnWESQ\n56V8pP68VNVAq5EPazu+d99aDlT0TtyxF4FCAQQAmNoWDObENKi1NIA2ZOr4QbUU3xUS4UWYhwa\/\nd+QcCiY2N\/Hm+lu\/3AkQec5Nve6Q04ty6x9lVdtNQYQbPTQ97sg5KGd5p21XYk+rU\/RvltbQjuiv\nF5UTa8uZd7ZZorFDxXj4dxZe8VWH0KbVAFsM1OTz\/FUqFhxSwoasd7Px2qy0ba5kTSvkjmIRVajd\n7dQew+QBhJHnLO73xgWmmaocHtfLesxdV14CcmstX31qKA4V+dbfBkrLNNpzjvrOf0ruvi7HvPzo\ntuOttPpUoxWr10YGC8FLwnqeu+6cfPlcl59Vk7Rb8WRikwwoMHKNvv38AwaL8euP36PvTn9Is74R\nGxQqmusFWq6odn5anxBkrhVceF5DPvlqy+hcf5ZxQMEuxPNrX3zEgNAnB7sp9OiWff7TuU9Y9f7z\nSp2rbm8Z0uZqtmqpRjhueg\/5yjROiiEXDR3qARA9OPoD3e46RZc+e5+yiocdQ1lxE4KQri6lzdeb\nix1IpT3bebOQb+juP5fSjvAinPeud9HUb33sGApiBDBAsQDRbtJWDm+sLJjbptG+L58IUNN6gK0m\nAMLWFozZz9Q9O9wYi1qAhi6dNo35aVpbnmfdWqTUcL7VqaaE3OT2EZl5QL6xfhq6fIYi3mGmLhbg\nGezWjFSgHbkMnz3QT1TkkPm8oC0tJlgh3JXO0+PhHkcRyWO9lAwMSy2H2aDOxkqWsCsS4WAnyNt9\nD+l\/VfPlerHKPQ7FtL1VcrUcpQalAGUpSlD1yP677sCL4bgdtz1qfwOpffsxmGcTRwAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/note_hint-1334192240.swf",
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
	"no_trade",
	"no_auction",
	"no_vendor",
	"no_donate",
	"no_discovery_dialog",
	"quest-item",
	"bureaucracy"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "read",
	"t"	: "write_on"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "read",
	"t"	: "write_on"
};

log.info("note_hint.js LOADED");

// generated ok 2012-09-04 10:14:16 by tim
