//#include include/glitchmas_2011.js, include/takeable.js

var label = "Glitchmas Card";
var version = "1346778856";
var name_single = "Glitchmas Card";
var name_plural = "Glitchmas Cards";
var article = "a";
var description = "A holiday greeting card, containing a heart-warming poem.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["glitchmas_card", "note", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.initial_text = "";	// defined by note
	this.instanceProps.initial_title = "";	// defined by note
	this.instanceProps.which_poem = "";	// defined by glitchmas_card
}

var instancePropsDef = {
	initial_text : ["Initial text to show on this note, from no author"],
	initial_title : ["Initial title to show on this note, from no author"],
	which_poem : ["The poem and background to display on this card (values 0-3)."],
};

var instancePropsChoices = {
	initial_text : [""],
	initial_title : [""],
	which_poem : [""],
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

verbs.write_on = { // defined by glitchmas_card
	"name"				: "write on",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Change what it says",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'write on', 'wrote on', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.sign = { // defined by glitchmas_card
	"name"				: "sign",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Sign your name (and add a personal message if you want)",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.last_editor) { 
			return {state:'enabled'};
		}
		else { 
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.readNote(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'sign', 'signed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.read = { // defined by glitchmas_card
	"name"				: "read",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Who is it from? What does it say?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.last_editor) { 
			return {state:'enabled'};
		}
		else {
			return {state:null};
		}
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

function parent_verb_note_write_on(pc, msg, suppress_activity){
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
};

function parent_verb_note_write_on_effects(pc){
	// no effects code in this parent
};

function onCreate(){ // defined by glitchmas_card
	this.initInstanceProps();
	this.parent_onCreate();

	var which = choose_one([0,1,2,3]);
	this.setInstanceProp('which_poem', which);

	this.poem_choices = this.getPoemChoices();
	var note = this.poem_choices[which];

	this.contents = note.contents;
	this.title = note.title;
	this.url = note.url;
}

function onInputBoxResponse(pc, uid, body, title, msg){ // defined by glitchmas_card
	//pc.sendActivity("New body is "+body);
	//pc.sendActivity("last editor is "+this.last_editor);
	//pc.sendActivity("pc tsid is "+pc.tsid);

	if (this.last_editor && !(this.last_editor == pc.tsid || this.last_editor == pc)) return;

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

function readNote(pc){ // defined by glitchmas_card
	var disabled_reason ='';

	if (!this.last_editor) { 
		this.last_editor = pc.tsid;
	}

	var player = this.last_editor;

	if (!player.make_hash) { 
		player = getPlayer(this.last_editor);
	}

	var rsp = {
	    type: "note_view",
	    title: this.title? this.title : "",
	    body: utils.filter_chat(this.contents),
	    background_url: this.url,
	    disabled_reason: disabled_reason,
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: player.make_hash(),
	    updated: this.last_edited,
	    signed_by: 1,
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);
}

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

function parent_onCreate(){ // defined by note
	this.contents = '';
	this.title = '';
	this.last_editor = null;
	this.last_edited = 0;
	this.history = [];
}

function parent_onInputBoxResponse(pc, uid, body, title, msg){ // defined by note
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
	"glitchmas",
	"toys",
	"bureaucracy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-27,"y":-13,"w":54,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFH0lEQVR42u2Y+09TZxjH+Q+UiTBB\nWnqF0tMWBhTKnY3SyybOOLcwM6u4Mozjlg2dopOYMRMcdy8wtjGnbNGAGBd3AafJfliyn\/gT9if0\nT\/ju\/b7tIeUIpThuyXiTJ6fn9PS8n\/d5vs\/zvKcpKbtjd6x\/LNTX71kIBIbmg4HF+YCvY8fBzQf8\n\/\/zm82K2qhwLwQAI+qyhwbXtcIQQQJHf\/T78VFaMH91FIOiT+tfxa4M3sq2QT\/3+EL31i7dewt0t\nLpA2V1Mpj\/dKCiXsQtB\/Zcvh5oP+KRWOICpcPCCN4Lxny0Iu9SYmI9zjupoX4Gj3PW5MlbuWznkP\nISmFhaDv8KbrjXBMBi2Yav3thWi9ZcX148qy61zQkwYvRpT8K5umNzUZtFADXjt6juei\/aIVx\/py\nEO4xob\/ChiFHPgYUG8acdmmDTgW9uRacMxsXP8rKcm2o3n5+o27FkH7jduLo21nwvL9\/yeoa03G+\n2obJMvcyGygsQJ9DQbfVgnaDIdKi0w21pKbu+U96o9celJcug5ousuPZoSrMunPQa0lH43sZ+PNI\nLR6VW\/FVXgZOH83CVFO5TBjao9pqWXq0NieuP6yrjdAJfwSD+uS9FgjUUG9ar1H8o28puF+r4K9j\nXsyVGtBnTcdIfhTwcYVVfm6tysCYW1lVp1rjHNNlJRhx2kNre07UrXiv3fY5MdbowIWuPHRcy0X4\nWysGPZmYdBzAjMeCeV8JppyZGLBlYEI5gM\/NaWjV7ZeaSxZw6jUnBoVWPzbkYK2W9ZwlgR2BWdjb\nkS+BTt4yo+m6AW+eO4jDl7IRCmWix5SGp\/4S\/N0UlGBt+lSc1aWi2bAXp05mY+gdJWm4EZFM3WYT\nwjrdVMKQqrWNXmOpIBztg1ETmsfN8hi6YYpCNx+UnrvjEt4TumvN3osjIjkaWl6V91w7ZU8arsdq\nTgTn69B2Bf6wzWNE+ETMGg0IV4vy0S3g3o2ef2jWoduQhvPGfejUv4JQyT6c\/toiF3IitqBEkCrc\nZZHRK8JFQxqYU+sbwxr\/gN48q3R7l9GITrMZVxU7WvR69CqKNF7rNBsxXFSAizaL\/C4ssjrcJhZx\n2SxlQU9Tv+uGU0Oq9RwhmRwsDQ9FCfihsgLTNdW4WerGcHExemw2dOda0SpgeD5TU4WZSo9sb1\/Y\ncnFJTNhmMOBMTk4UWHhdmyxrhlUWR\/Hjl7XPLCZMV5Yv2xRobbLQIcEIHX\/9u1i2JkyIsF6\/yIno\n3n57HobFatZr7KkrtbxERmi2PXp4VTjpQdFaCEkXf1\/kWgpR\/MN4naul8cETBVGPqICUxnrhruZF\npZEQTgvJZs5QccJkPHJDQNLr1G2ycFzcJyZjVJPJwMVDdhkNkXGxOk64UiZr7bZLQZ\/QFVtgMnA3\nXXYZ0nXDqYNbHrG6CMPHIr3SDlnrDeooUYKoxkw9q2bzy8DFQ3Lrw+yara5cdc+nAvY77FK3ieCG\nNgouHvKMXh\/5UoTvQYUHq+2aCThc4HohqVS7I5KLnmuNlaQNgYuHZOJcsJhxV2iRnmTYkwUk3PBm\nwWmy+\/mnIusmCp1Sk9xYqrqk6FcCVOHUhBDNYHNfNbl6TjYsy1DVUllhmdECEo5Jxu4QgwulbMXg\nRAwX69690mLZownSl5+3BMi+Ohrby20pnEaXEb6JSf3Fmrx8943baG4LnLbrsBuwBvI4XqBIOIJv\nK5xWl6xtNIadm40dAxevS4ackDzuKLj4kLOMbNg\/A7vj\/zb+Bbkidf8i9hNuAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/glitchmas_card-1334192151.swf",
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
	"glitchmas",
	"toys",
	"bureaucracy"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "read",
	"n"	: "sign",
	"t"	: "write_on"
};

log.info("glitchmas_card.js LOADED");

// generated ok 2012-09-04 10:14:16 by tim
