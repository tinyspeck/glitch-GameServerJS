//#include include/takeable.js

var label = "Fruit Tree Bean";
var version = "1354586283";
var name_single = "Fruit Tree Bean";
var name_plural = "Fruit Tree Beans";
var article = "a";
var description = "An ordinary fruit tree bean. It can be used to grow a fruit tree.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 150;
var input_for = [];
var parent_classes = ["bean_fruit", "bean_base", "takeable"];
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

function onCreate(){ // defined by bean_fruit
	this.trant_class = 'trant_fruit';
	this.trant_chance = 0.9;
}

// global block from bean_base
var is_seasoned_bean = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "Beans can only be planted in certain regions. Like attracts like."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADXElEQVR42u2XS0wTURSGG+PCmCAL\nE7e6Muy6cWtYuoSdG5MuTNzYpNFAokatukDiQhAlQqEptJQ+oDxKaZGChZYChXYKlAIiCEgaIGoa\nBXyAeLznNq0zw8y0KIkJmZP8Sdvce+53HvfMVKGQTTbZZJNNNtmOvG05epTJlm5j0u5KfHZ4gKq9\nN7ludRqct7UF\/xVuzzem2ekdht2+ESr8vNnhhTToJ7sLpmoaq8nS4zk7hQCjhIGIgSgJgxGgws\/4\nW5A5m7OfwbAqs5+lX75xDiTJLoSf17WeUyhOZHfqZ4qoo0AUIDS9zzkF9TOFOQWJ64cmACIzAMOT\nHD8\/+0czgOlMdj18opF2Gg7n7\/QGEQBgjMDNLQOMTIFQFhAgSwVS2Y8tAMyvADBz+yDZWUTN1ZtX\nyfaT4s3c2afCPqFRj8YAxuMp0AAjnMnBiBaDYgdIyqrJwGFwCDe7lPKH8v\/x9dXl4wCuGFvAVHrv\noiggWaTlAKaFB41MCmdSTNgiM+8A4oupQNO+hqKZNd89\/n2AnkflNyUBcRONkg0YiqVKhKB+Rhos\nOJFaF5nlgqXFqoYQoLfsaYUkIPZFJgN85wJZoMCY8eBkCkxsT7oSrGD4gEsNdrCV3r0uCrjd6S36\nYHXSeZVxhIejsMFRQVap8TseLJYtPhyvl7e7+jmAs3VNoFNrLkne4vemVjLlX+XWZ\/xelYLjtcbe\n6zEO3IalE5gX9QmCcUpy1KxZOgxv6s30huUEGWRll19izHYgKrhvy9nHAXyrt4DnQfljgnBMehba\nvfnzenNy0WClJcCpf6Dbm0Xojz9e1prbYfxZ7XxBXt7pnB5RG1aHcrrWSKPCcuPUPwywb90DHDAU\n9nysphFqr6mLD\/SQX7O5VLgRhU4wm\/igPygYXji8rV9IoHw47Dv0335Lq85aWiH72OpWxXXG5NTL\nBjqjqOO2HgqLh0qJ32Ns4csB+otU1a3bSu5c+Su4tP3oCSkT5g5DnJQco0XH+GAXO1xKiaY22jbo\nx32\/rKKs+PL5Q3uv23X7C5dNDgN5oNOM4kEIu0rGEpZKTLgG12KA0Wr95kB5pcmovnHhn7KW7Y0n\n2eYuXDTYtAt6i48cvITAYsLbGa7SNYcqdVeNJSVn5P8Xsskmm2xHzH4DVfV+J\/g0FlQAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_fruit-1334602515.swf",
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

log.info("bean_fruit.js LOADED");

// generated ok 2012-12-03 17:58:03 by martlume
