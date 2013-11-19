//#include include/takeable.js

var label = "Paper";
var version = "1354598548";
var name_single = "Paper";
var name_plural = "Sheets of Paper";
var article = "a";
var description = "A blank piece of paper.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 2;
var input_for = [223,314,315,316,317,318,319,342];
var parent_classes = ["paper", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

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

verbs.create_script = { // defined by paper
	"name"				: "create TP script",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Turn into a Teleportation Script. Costs 1 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('teleportation_4')) return {state:null};
		if (!pc.skills_has('penmanship_1')) return {state: 'disabled', reason: "You need to learn Penpersonship."};
		function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
		if (!pc.items_has(is_quill, 1)){
			return {state: 'disabled', reason: "You'll need a Quill first."};
		}

		var ret = pc.teleportation_can_set_target();
		if (!ret.ok) return {state: 'disabled', reason: ret.error};

		var s = apiNewItem('note');
		if (pc.isBagFull(s) && this.count > 1){
			s.apiDelete();
			return {state: 'disabled', reason: "Your bag is full."};
		}
		s.apiDelete();

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var loc_info = pc.location.get_info();

		var rsp = {
		    type: "teleportation_script_view",
		    title: "Teleport to "+loc_info.name+', '+loc_info.mote_name,
		    body: '',
		    start_in_edit_mode: true,
		    itemstack_tsid: this.tsid
		};

		pc.apiSendMsg(rsp);

		return true;
	}
};

verbs.write_on = { // defined by paper
	"name"				: "write on",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Turn a piece of paper into a note",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var s = apiNewItem('note');
		if (pc.isBagFull(s) && this.count > 1){
			s.apiDelete();
			return {state: 'disabled', reason: "Your bag is full."};
		}
		s.apiDelete();

		if (pc.skills_has('penmanship_1')){
			function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
			if (!pc.items_has(is_quill, 1)){
				return {state: 'disabled', reason: "You'll need a Quill first."};
			}

			return {state:'enabled'};
		}

		return {state: 'disabled', reason: "You need to learn Penpersonship."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var rsp = {
		    type: "note_view",
		    title: "A note!",
		    body: '',
		    start_in_edit_mode: true,
		    itemstack_tsid: this.tsid
		};

		pc.apiSendMsg(rsp);

		return true;
	}
};

function onInputBoxResponse(pc, uid, value, title, msg){ // defined by paper
	if (uid != 'teleportation_script_create' && !value && !title) return;

	if (!this.apiConsume(1)){
		pc.sendActivity("Wha? Where'd the paper go?");
		return;
	}

	if (!uid || uid == 'note_save'){
		var s = apiNewItemStackFromSource('note', 1, this);
		if (!s) return;
		var remaining = pc.addItemStack(s);
		if (remaining){
			pc.sendActivity("There's nowhere for the note to go!");
			s.apiDelete();
			return;
		}
	}
	else{
		if(msg.is_imbued) {
			var s = apiNewItemStackFromSource('teleportation_script_imbued', 1, this);
		} else {
			var s = apiNewItemStackFromSource('teleportation_script', 1, this);
		}
		if (!s) return;
		var remaining = pc.addItemStack(s);
		if (remaining){
			pc.sendActivity("There's nowhere for the teleportation script to go!");
			s.apiDelete();
			return;
		}

		pc.quests_inc_counter('make_teleportation_script', 1);

		// Costs 1 energy
		pc.metabolics_lose_energy(1);
	}

	s.onInputBoxResponse(pc, uid, value, title, msg);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be harvested from a <a href=\"\/items\/600\/\" glitch=\"item|paper_tree\">Paper Tree<\/a>."]);
	out.push([2, "You can write on this with a  <a href=\"\/items\/626\/\" glitch=\"item|quill\">Quill<\/a> once you've learned <a href=\"\/skills\/82\/\" glitch=\"skill|penmanship_1\">Penpersonship<\/a>"]);
	return out;
}

var tags = [
	"paper",
	"basic_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-28,"y":-27,"w":55,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAES0lEQVR42u1XTWgbRxjVwRdfmkMO\nhtBgcjE0BEShFx9MwIf6UBMfezSUHnIIuRV6aDHUkEMuNqEnh6IQYgIlUNxQSC07dluMJVu7klay\nJVn\/kiWvLFtKavc8nbeeT51M1tHuWk1N8cBDseXMvH3f+9436\/NdrIv1P1laODgVCf\/6UyQSvHTu\nyIGUFlpsa+FFFgkvRvVQcOJcEdQ3Fm8a2ktWzm1aqJVirFY2ioeNzNRe1bgJ\/KcEY9pyoFnfYo3a\nFqtXEu8EiHOs7FUTU7WKMdHYTfjV\/Y7bBT9r5XtjFV1fHqzkNbZXTb5BxNxNsuNWjv3Vzlufh2a6\nK3ngYC\/Fjtv5ds\/U29laC7Qa6bcOATEVr\/Yzjkjyvw30hFxhe20QpZU3b3MSduQIUHa\/vs3K+SjL\npTc6KOxEWDEbYbulOLt\/75tpvv04x9iZCJrVrYDsOxyMUhKgJL5XvXl0mLW+lwkSsqkwu3rlyueC\n4JBncvX69iDUcFIyFXgQqAm1VIJ\/rPy8LqnX54lci3cYOpEOxEHVYqyDSiHKS6hbQOlkoIz4\/aGZ\nYk1OFH9L5OplgwUezs4Jgtc8q4eIkBWxU6Ib8plNZorOpwcE6U8+9n\/Bjxg9U2ntyoYDoI5boiBH\nnR\/fXAqeyXsoLTd8FKZvKg2BqAF46TlRzRVJPByy8vvZe9OevSd8FyWDnwYKZCgDrzkhCPWataQp\n1PN7KivIUTmhIPLudXPnDXL4mboUkD2K3LOzQIU\/BP7v48CDGUGw35NydBDMTZufdGTUKqvsx24z\nGWPRUo2HPDJR8p4H9SrGjDToTy1TKadZXnKThyDHx9\/RjY+GKJjdeQ83DXVTObfsAFUrBWdEMZuX\nXvw476lzqbQUvhQHFCndjI+RlUuHLcK0h2qFdiNN6o16Ki3Kpg50KqPqRzsY+irDLRvQN5ZYXFth\nO9uhTnNI6g24mxTl5KQ15PmsNauJDso53SJFajrJPJnkCYIWyd2ibgr1hp1fnwr6ICcwQ\/6wyzmE\nMZXsH1\/GHJPEv\/f5g4tQ7h4rhUzYn01vTnC\/rJDJKQreFcht9fLJ1awWT7IOVlDLn4z9zlKJNau0\nhUzIcNwYLYRwKR6lDfHp9PKJmJADmUKaQhyfyLpaOW51P8ihArc++xQXghFXscKDc5JvUDxRUesc\niIPsgINABl5V30fkGFEfSmqMy24b9wMM6hfPn87zch9BSTUWvEAeh9K8ve6F3DgB3fXLwpP5XCpk\nup0OKnB5IIJi3nq+KfeJW+yoTPbRD7MzuVQ4f1oZnRKU1PuwFy9sAyKfOkS\/+\/arrxP66jq85+Zd\nhBpNeG\/Y1+PVL\/wyRkTRgTisZaaOcLjaxSr+PMhaBEUo9\/v+pdUnSjMiqwpPpYzf1ilyUE71NRTf\nievUkO89rX7h1RFZ1YVngblaSc\/b5eXdO1\/e9vwK2QNlB4Q6w0SWlMVdT0yN676LdbHs19\/uRG2w\nBhRfiQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/paper-1334347828.swf",
	admin_props	: false,
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
	"paper",
	"basic_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "create_script",
	"g"	: "give",
	"t"	: "write_on"
};

log.info("paper.js LOADED");

// generated ok 2012-12-03 21:22:28 by martlume
