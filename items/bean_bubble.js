//#include include/takeable.js

var label = "Bubble Tree Bean";
var version = "1354586283";
var name_single = "Bubble Tree Bean";
var name_plural = "Bubble Tree Beans";
var article = "a";
var description = "A fizzy bubble tree bean. It can be planted to grow a bubble tree.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 150;
var input_for = [];
var parent_classes = ["bean_bubble", "bean_base", "takeable"];
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

verbs.plant = { // defined by bean_base
	"name"				: "plant",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Only works next to clean patch. Or, drag bean to patch",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		//
		// find a patch
		//

		var patch = null;
		if (msg.itemstack_tsid){
			//patch = apiFindObject(msg.itemstack_tsid);
			//if (!patch.canPlant(this)) patch = null;
		}

		if (!patch){
			function is_patch(it, bean){ return in_array(it.class_tsid, ['patch', 'patch_dark']) && it.canPlant(bean) ? true : false; }
			patch = pc.findCloseStack(is_patch, config.verb_radius, this);
		}

		if (!patch){
			pc.sendActivity("Find a suitable patch to plant it in!");
			return false;
		}


		//
		// is the patch ready?
		//

		if (patch.is_messy){
			pc.sendActivity("That patch needs tending.");
			return false;
		}

		if (patch.planted){
			pc.sendActivity("That patch already has something growing.");
			return false;
		}

		if (patch.is_dug){
			pc.sendActivity("That patch has been dug. Your poor bean would get lost in there!");
			return false;
		}

		//
		// looks good to go
		//

		if (!this.trant_class || !this.trant_chance){
			pc.sendActivity("Looks like the dev didn't set up this bean correctly...");
			return false;
		}

		patch.plantBean(this.trant_class, pc);

		pc.achievements_increment('patches', 'planted');
		pc.achievements_increment('beans_planted', this.class_tsid);
		this.apiDelete();

		pc.sendActivity("You planted that bean real good. Congrats!");

		return true;
	}
};

function onCreate(){ // defined by bean_bubble
	this.trant_class = 'trant_bubble';
	this.trant_chance = 0.9;
}

// global block from bean_base
var is_seasoned_bean = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "Beans will only grow in certain regions. Like attracts like."]);
	out.push([2, "You can plant this in a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a> in your yard."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/261\/\" glitch=\"item|bean_seasoner\">Bean Seasoner<\/a>."]);
	if (pc && !pc.skills_has("botany_1")) out.push([2, "You need to learn <a href=\"\/skills\/15\/\" glitch=\"skill|botany_1\">Botany<\/a> to use a <a href=\"\/items\/261\/\" glitch=\"item|bean_seasoner\">Bean Seasoner<\/a>."]);
	return out;
}

var tags = [
	"bean",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-14,"w":24,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEj0lEQVR42u1XSUtkVxTuRcgmkF7k\nB5h\/oEjAjahoBAW1cMaJEqd2JA44Dw9EUVEpRXFEywHnWZynUkRbF9ouDC5c+AeUXoTGhYvT5zvk\nFq+Kqop2QpLFO3Cw3nv3nvvd73zn3Ou7d4YZZphhhhlm2D9lh4eHXvPz84Gjo6OBRUVFv\/Krn\/4X\nwAYHB98PDw9bGBiNjIzYvb+\/nyoqKj4mJiaa\/lOA5eXltsnJSdrZ2RFfW1ujvr4+am9vp97eXuru\n7qbc3NxdHvrDqwLu7++\/397etnCwBxW0o6Pjc2VlpRXf3gKO51oZIIE9FctisVBBQQFpmkY1NTXC\nZmFhITGTlzzlO48Bl5aWvBSw9fV1CYjgCIjA\/P3z7u6u+bXgML+trY2am5uJN0c8V+Ig5sbGhoAD\niykpKRQVFUUxMTFlHoMuLCwIuLm5OWJR0+bmJpWWltLs7KydAQQsKyszvwaccqvVSicnJ3R2dka8\nhjAHoGAxKysL7BGY5lQ\/uGVxfHzcDH1gd9jp8\/MzTU9P0+Lion0hZlDYbGpqIldMMiPenC4HzT09\nPRHs6OhIQB4fHwurOTk5lJaWZgcHNkFGUFDQLy4B8gBtZmaGOjs76fz8XIJfX1\/T6empA3vYvV5P\n2dnZn\/i3jXX7Cc9YmCtXvt\/d3Qm4l5cX2TTmr66uyjdkBZWMOaqyExISKCQk5INbgFVVVcRMCsCB\ngQFJ89XVFV1cXJDNZhNwzoIHIH06MQZ+cHAgWYDd399LTDiyhExgLPdFO7iSkhIKDg6GFntcAuTd\naElJSTIRrI2NjUnAy8tLurm5kd9dXV2iT2eAe3t7UgRII5hC63h8fBSAt7e3dnBwfUYAEESw9iTV\nqampKJgmlwAh\/OjoaNmhEjYCQjcqOECj+tQCExMTokcwrcYAEBjn1iRg9eAQC5sBg0h3fX29gIMj\nTmZmJoWHh8e5PYrCwsJkUaU3BGNtCQCkeGtry6Gi8b21tdXOtt4BDuwADJ5RwWAZ8\/EO1YxmrRyZ\nCAgI+IOh\/Oi2PURGRtrQs1Asel15ciwGkHqm9b6ysiIaW15edpgHIvAeMgFAsMgp7vPYB\/kQD8zI\nyJAJU1NTwpgeiDuQqFq0DrAGlpTj2dV4EKA\/l0FKfn7+Fx8fn5\/\/8gSAFhmogMQuVcrR2xRIdcro\nHd\/1Fe5qQygKyEEPDlLCenFxcR9efYZyyqyY1NjYaGcT7Uf1NwXIGYAeuNIqsgBQ6Hl6YHDExjnM\n4GbefAth2q3FxcWElLe0tEhAvjBIenC69PT0yF9UvbNDd9gANqjAoGDwDK2hINDSUJR+fn4dvNz3\n33RVGhoa+o1BPYSGhlJtbS10IilRC2Ix\/HVmRjkKAMeYGgPGABKbjoiI+N3X1zf1b9\/ncMXiI0gz\nmUwP2HlsbKxULZpxdXU1mc1mB6ac9YVeFx8fjzSKoxknJyfXfTNrnoA2NDQwTpMNC+bl5Ym40VyR\nqj+PKbkA4L3eMRYb5IuAxlcqr3\/lpsxHkzen3VRXV6ex0LX09HTN399fnMHKM94zy2Zm3Nv4r8ww\nwwwz7O32FX8zoxs08A2CAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_bubble-1334602743.swf",
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
	"bean",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "plant"
};

log.info("bean_bubble.js LOADED");

// generated ok 2012-12-03 17:58:03 by martlume
