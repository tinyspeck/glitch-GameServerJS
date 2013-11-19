//#include include/takeable.js

var label = "Note Pole";
var version = "1352405074";
var name_single = "Note Pole";
var name_plural = "Note Poles";
var article = "a";
var description = "I'm a little note pole which you can customize to your heart's desire and then place in your yard or your house. Post a note on me to amuse, astonish or edify your visitors.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 600;
var input_for = [];
var parent_classes = ["note_pole", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.size = "Tall";	// defined by note_pole
	this.instanceProps.note = "hide";	// defined by note_pole
	this.instanceProps.pole = "1";	// defined by note_pole
	this.instanceProps.sign = "1";	// defined by note_pole
}

var instancePropsDef = {
	size : ["size of pole"],
	note : ["display a note?"],
	pole : ["which pole"],
	sign : ["which sign"],
};

var instancePropsChoices = {
	size : ["Tall","Medium","Short"],
	note : ["show","hide"],
	pole : ["1","2","3","4","5","6","7","8","9","10"],
	sign : ["1","2","3","4","5","6","7","8","9"],
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

verbs.read_oneclick = { // defined by note_pole
	"name"				: "read_oneclick",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "What does it say?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// this verb is only for nonowners(there is a read verb for the owner, that is hidden from others)
		if (pc.houses_is_at_home()) return {state: null};

		if (this.getInstanceProp('note') == 'show') return {state: 'enabled'};
		return {state: 'disabled', reason: 'Nothing has been posted'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.readHelper(pc, msg, suppress_activity);
	}
};

verbs.flip = { // defined by note_pole
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Turn it around",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!config.is_dev) return {state: null};
		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.dir == 'left'){
			this.dir = 'right';
		}
		else{
			this.dir = 'left';
		}

		this.broadcastState();

		return true;
	}
};

verbs.customize = { // defined by note_pole
	"name"				: "customize",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Make it your own",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.houses_is_at_home()) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({
			type: 'itemstack_config_start',
			itemstack_tsid: this.tsid}
		);
	}
};

verbs.post = { // defined by note_pole
	"name"				: "post",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Post a note",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Post a note",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'note';
	},
	"conditions"			: function(pc, drop_stack){

		if (!pc.houses_is_at_home()) return {state: null};
		if (!pc.countItemClass('note')) return {state:'disabled', reason: "You don't have any notes."};
		return {state:'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: true,
	"valid_items"		: function(pc){

		var possibles = [];
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'note'){
				possibles.push(it.tsid);
			}
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You don't have any notes.");
			return {
				'ok' : 0,
				'txt' : "You don't have any notes",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_itemstack_tsid){
			var note = pc.removeItemStackTsid(msg.target_itemstack_tsid, 1);
			if (note && note.class_tsid == 'note'){
				if (this.getInstanceProp('note') == 'show'){
					if (this.contents){
						var props = {
							contents: this.contents,
							title: this.title,
							last_editor: this.last_editor,
							last_edited: this.last_edited
						}
						pc.createItemFromSource('note', 1, this, false, props);
					}
				}
				else{
					this.setInstanceProp('note', 'show');
					this.broadcastConfig();
				}

				this.contents = note.contents;
				this.title = note.title;
				this.last_editor = note.last_editor;
				this.last_edited = note.last_edited;

				note.apiDelete();
			}
			else{
				failed = 1;
				self_msgs.push("Could not find that note");
			}
		}
		else{
			failed = 1;
			self_msgs.push("You didn't pick a note?");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'post on', 'posted on', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.read = { // defined by note_pole
	"name"				: "read",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "What does it say?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// this verb is only for the owner (there is a oneclick read verb for others, that is hidden from the owner)
		if (!pc.houses_is_at_home()) return {state: null};

		if (this.getInstanceProp('note') == 'show') return {state: 'enabled'};
		return {state: 'disabled', reason: 'Nothing has been posted'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.readHelper(pc, msg, suppress_activity);
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
	"sort_on"			: 54,
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
	"sort_on"			: 55,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.place = { // defined by note_pole
	"name"				: "place",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Put it here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.houses_is_at_home()){
			if (!this.takeable_check_furniture_plats(pc)) return {state:'disabled', reason: "This item can't be placed on furniture."};
			return {state:'enabled'};
		}
		return {state:'disabled', reason: "Note Poles can only be placed at home."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

function canDrop(pc, drop_stack){ // defined by note_pole
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by note_pole
	if (!pc.houses_is_at_home()) return {ok: 0};
	return {ok: 1};
}

function getLabel(){ // defined by note_pole
	return this.title ? this.title : this.label;
}

function make_config(){ // defined by note_pole
	var ret = {
		note: this.getInstanceProp('note'),
		pole: this.getInstanceProp('pole'),
		sign: this.getInstanceProp('sign'),
		size: this.getInstanceProp('size')
	};

	return ret;
}

function onInputBoxResponse(pc, uid, body, title, msg){ // defined by note_pole
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
	if (this.contents == body && this.title == title) return;
	title = title.substr(0, 150);
	body = body.substr(0, 1000);

	this.contents = body;
	this.title = title;
	this.last_editor = pc.tsid;
	this.last_edited = time();
}

function readHelper(pc, msg, suppress_activity){ // defined by note_pole
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var disabled_reason = '';
	if (pc.skills_has('penmanship_1')){
		function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
		if (!pc.items_has(is_quill, 1)){
			disabled_reason = "You need a working quill.";
		}
	}
	else{
		disabled_reason = "You need to know Penpersonship.";
	}

	if (!pc.houses_is_at_home()) disabled_reason = 'This is not your note';

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

	var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	if (pc && !pc.skills_has("furnituremaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/99\/\" glitch=\"skill|furnituremaking_1\">Furnituremaking I<\/a> to use a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	return out;
}

var tags = [
	"no_shelf"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-196,"w":50,"h":181},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACMElEQVR42u3V3WuSURwH8F1035+w\nyyIKgjYsYnNzz1btoi2SmKnZy1bm2zQHOfDtQbfZUkYxiGVr5muk4YThcGqPw5KZe3GzCQajQX\/I\nt8eLoMvAi+dXeOB3cc7F4cP5Hb6\/jo7\/fUVf3hP\/WT7b9QWrVrL3e\/9h6eFJwXDhxQedPvYOSoWP\niL114\/3KLJJRHyLLMwi8ciAenEPEb4XNwEAQ4Ot5pXg15kXjsIxGfQufN1Oo176gflACl0ugspVB\nLOCBeaJHGCBruiaOBz0oFdeQSi6jVt3koWXs7xZQLqWx8zWLwBIL4\/3LQgGvjBQyYXznX2+3ksPe\ndg5HjQoOD4r4tl9EfiOOkN8l3Au+cEod\/kU7dsqf+HZuIJnwI5OOYH0tBC6fwPFRFeE3s5iQdQsD\n9FpHJ6e1Ejgtd5FefYf1VBBZHphNR1HdzuPncQ3x0DxseokwQLdZ0smaBsXNcj0ZcjSLNTKc5VEv\nLBrJimm8h9MqL3FquYgjk4t2XZ9DJxeopX8L1Mq76AJdxgHOqCLU0n8SqBo5SxuopA58LLtAGzip\n7KYN1CvawNaA6jHCf9Cm6+NUo+foAqfVYo4fdW1ga0AZYaBT388HNWGg20R8kjybYmjHzJyZ4W4O\nnqId1KSBzaC+wRAGsoZ+jEvPO8gCZ0wDsGt628CWgJrbXbSBY8Nn6AI9UwxtoPfpEG5dJQ88TRso\npQh8bhsW2Q3MgsfMQKMQ\/dAoLsr54xOt3vsLfZxWA1xJ+sAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/note_pole-1347040361.swf",
	admin_props	: true,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by note_pole
	"id"				: "read_oneclick",
	"label"				: "read_oneclick",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "What does it say?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// this verb is only for nonowners(there is a read verb for the owner, that is hidden from others)
		if (pc.houses_is_at_home()) return {state: null};

		if (this.getInstanceProp('note') == 'show') return {state: 'enabled'};
		return {state: 'disabled', reason: 'Nothing has been posted'};
	},
};

;
if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_shelf"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "customize",
	"e"	: "flip",
	"o"	: "post",
	"j"	: "read",
	"n"	: "read_oneclick"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "place"
};

log.info("note_pole.js LOADED");

// generated ok 2012-11-08 12:04:34 by eric
