//#include include/takeable.js

var label = "Wood Tree Bean";
var version = "1354586283";
var name_single = "Wood Tree Bean";
var name_plural = "Wood Tree Beans";
var article = "a";
var description = "A satisfyingly woody wood tree bean. You can use this to grow a wood tree. Guaranteed 100% splinter-free!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 200;
var input_for = [];
var parent_classes = ["bean_wood", "bean_base", "takeable"];
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

function onCreate(){ // defined by bean_wood
	this.trant_class = 'wood_tree';
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
		'position': {"x":-12,"y":-14,"w":24,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE40lEQVR42u2W+0+bVRjHl+jv\/AlL\n\/MWhG50QSXaT4LBQMsaAAeNSylbGReqKo51IubUUKcIGBVaBAmUwVqlAuS3AGDAuMgYSNlCkYes7\nboLcKu4HY2by+D4HX9ZuyMUYjeZ9km96ec95zuc8l3PefftYY4011lhjjbX\/vRkyTor1yvctZUnv\nwY0MLtVaG9FfrQ3WKWXu3v863A+mVOPonWhozuNBQzYXaFDQpp2EupIAaKjkg1rl3a36xM1uT047\nit3s+m\/6594r86EGqgOB0UhDuA6f7dbP0pM03bJZDqgFUzKMtV2EOwWe8FWmGxRKjxEVJblCQqQz\nFS88un9XTs19Ik57Po9CRwg12nyBOGZkHrpssZgVnB3hKLl4Ay4dlqmMDdG\/575NhO86o6G+wHsT\nMkvkDNG+B3S7AjTmuI92fuEFT0eSYXX6GixMZoKp95IN5MPbQstEp\/BPd7xCyQVM5FZnCuDnH+vB\nMlsMK5QKmP8fjyZAe10EGDR+BDLu3EGI9bXfPopdVYGchvxTMPMwEaYGUmBtboje7VUaKhYme0Rk\n98wCy+Y0C0bJev6aWbl\/\/nuZ7sUYBfzyjAK0ladNMPsog6Qan81PJsPdxiiiluowUIiOQKz\/odxt\nAZsq+S79jULoraBr7lYkUMMqeLbcQkcylyz2YuHdaX1BT+Ce\/7oE06PZxGdXiS98Ywwjm2UAUeUF\n\/hAvfLd7W0CN9IiLNvEE9FcGwqIph14kD2bHMmFuvAimvs6imyQGBmvCwLpxrIX1ipFeNKWCZa4U\nfnu+ToSga3Sq0V9\/VRBpFCwjY3nQJmCFJhCUSR7bA5Yku7pgPfRVBUDfjWAaNGJLDdVGbEINfimA\n4booGj6Ork0lTN2vhPmJDlgy98D6YhsBY7Q6rSYp7rtxlkBqEk6Q9CLg9RyfnQHXnqjs1NLj5Kza\n2KUv9JTziYbrRXQHy0kUVqjMjTTSnYkL\/zRfQUoBv2PEcSxu5IEhhoxnAJlOnhoQQ33WB6Q5EBKb\nJTOVB+lJ7uIdu1gpPtZdIDkKTVfdCSQK02ZdW\/j7XukZ6Cj0oqNx4ZUIm3plm5D4uTqdR89T2vjA\nW4U5Zq4rPDB6oJR57nwWxvgccJGGOkBRwnECiQVt7RhTxIBjHT0ejKe7PuUPpdFdL6HBwmHmkQK6\ntefgruYMmIfjbXxMDEnJbcIASsKddk6vtUnDHXUJAg6Z3FcrsHGOizGADwwhr3QuboABwhrFcdg8\nzNEyfl9Cag5Ti\/5ThI4gDj0MimQuZy+33esxfvbj8cGHQJvOhZGeOOKcAcDI4cKYZuZce1kIyYzD\njWDUupqjCVxrzXkCl3bRib5B7EEUeFC850s+0v8NO+HpNyc\/PPsW6LVBxDmC4g2ARc4szlyJL6tV\nzSONUJPlDu014TZnnr7QFzBDCHcpxCH3L7+JqCKd7D4O5bRIIpwhP8sbGvXnNxfpaYmG9mo+GHJP\ngT6bZyOD+jS5wpgjhBHOL1X7QVywA3wU8DZcCXEQ\/C2vTBo5V6D4lDuGnYagVcVBNrDb6bZBCPqy\nEDKP9gGX+YfhCp9jbMvfW83tym4WBwk+S+UZ8cwixwKtaxleZPGtZD1OLnG1yISOOkXUO5x\/4j30\ntfzPvVyy0z1T02UeOjwithI+oyXYa4eyxhprrLH2H7LfAeqsBNxQx0WsAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_wood-1334602464.swf",
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

log.info("bean_wood.js LOADED");

// generated ok 2012-12-03 17:58:03 by martlume
