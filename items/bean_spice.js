//#include include/takeable.js

var label = "Spice Plant Bean";
var version = "1354586283";
var name_single = "Spice Plant Bean";
var name_plural = "Spice Plant Beans";
var article = "a";
var description = "A small spicy bean. It can be used to plant a spice plant.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 150;
var input_for = [];
var parent_classes = ["bean_spice", "bean_base", "takeable"];
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

function onCreate(){ // defined by bean_spice
	this.trant_class = 'trant_spice';
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEoElEQVR42u2Xe0xTVxzH77KE+Y9h\nr2SJ+4Mw4h7JErZsTB0ZhrINjSZmsI0gmwgpVBgP5SGIcfgag1FaJpWAgEiMqDwEpLxkrqWyFTZA\ncKAskvEYON2IHcKm3Ee\/u+d0vbSIFfbO0l\/yTdt7zz3nc3+vc8owTnOa05zmNKc57W8wl\/8UTfeJ\nxJd6ypNTr6bJ+sd9GRBd9WFMer\/lCeLtB\/9VuJ\/OZyRNX8gG0Ux1AqYiPDCxfhmsoG1ZIZeL0ze\/\nsqRJ0ZXpKhyPiBcSPXVWmWOeruGz3gxdyjxspyqUbdkD7vQHYOuSwHaqqWbalRiuT5fUfnS7adGQ\nBG62Qz1sfmsZsJ6RZA5bYV3k4mxnjuei4MTx5nA34J1HgIDl4MrCJcgbrR9JgEO1e9B4SDG2KMAp\nwyftbGcuuNYs8Nr94NpU0qSSOtQm9CjdHMKJ48zBItiONcBufyphr2zOi+XR+H7dQzTM5LMjWYZG\nTZTjCA1tftL3duRTYI154AbPwMzOgBtqBvu1ZkFI7ivVWjvvi9CznSq1dQz13Hd9oFalhJD7nvQ8\nv81DykOiQT8XVGeHNzgEnPRjdHf8GXC1aRSQGz4P4ZIW5p3eljCLYecKg+cg2zLA7\/OBEOVBRb7b\nvoTQVmyB+3UaOBAAvuFj6WXJeDvA1xjUqeQTDgGvy5jSqTcY8KpACyDxYkYgkBcF5GwFtrhBiH9+\nDmCXl12eCjus93LB9p+E+bYJZn4W\/De14C6dpPOxXfnSs\/M92KyJgkPAK1tWht2QMZaqGzgFXq+R\n8odCip\/8uRyw3QV0Ea5uJ7iqRHA1qdTrbH+5mBJN4K91Qfh5hIqkiPVl2StVdt4fTVsrqXvvRlRl\nhw86BOyrSHLvr0ilPYsCtBwE4rwsInBiiOhCvwOyfcfob37UAH7cKIHcS1bvEYnFaNdq9EdicS4\/\nuua+VWwoiusdOxY996YL9DFJPUccQ4lhFQoUMCuDxPC\/YNdmJpoPSHDfntmN+txItBXH3b\/Plh0M\nCTL6uGAyyetuoIXUe5SGlkoMoS2goBHzNmSFXZ6S0N7UZVKwEXUQzT\/jhsehVawZW\/S2VyF79LRx\nNYMfMjbgjtG+DxJv2jZxW6\/MF6lUWzhuHYPJxg8tnitR0P5HqrfpZQYD3kzporcozbPMY+JDJqO\/\nK53MpM+aW1Ss1IUr1zHgtNgdxt99QgrraMIqCtfyqguM\/g9fxOuM65L24+YXGc\/qt1cOktK\/XJWG\nsYZ9+PGzDPwid7f3yj08SDx\/qyIeN8PccE1sT2PyZ6jXrIBdh+XQ7tqIFmWY4Q+faFoLI13P5kbU\nkwT+snQ73TOteUPa0fXk1TTZ52u8ab9dhdoWQ8+JZLTmR0P7aSS6jifXkL3\/Tx+ZviiJC6tTy3sb\nDilwoSQe\/cXbMJIfehcAuWar4coUCtV3KgWfF8TQSqXVWhQ7fMuQuekvP9uRNtCYp6ghoNbFiDfI\n4vpwTxhWMXZqFENoHUekL4rVDVSmbPonzqEPNB+O9tUVxqTXquRlYhrotFHeuoZAd4uCn9OdzXxf\nR66Lxyh1pXJrAEkX5z8dpznNaU77H9pv+\/BFl2wa0IsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_spice-1334597747.swf",
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

log.info("bean_spice.js LOADED");

// generated ok 2012-12-03 17:58:03 by martlume
