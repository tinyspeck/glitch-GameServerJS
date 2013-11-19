//#include include/takeable.js

var label = "Egg Plant Bean";
var version = "1354586283";
var name_single = "Egg Plant Bean";
var name_plural = "Egg Plant Beans";
var article = "an";
var description = "A smooth, round egg plant bean. It can grow egg plants. Then the fun really starts!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 150;
var input_for = [];
var parent_classes = ["bean_egg", "bean_base", "takeable"];
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

function onCreate(){ // defined by bean_egg
	this.trant_class = 'trant_egg';
	this.trant_chance = 0.9;
}

// global block from bean_base
var is_seasoned_bean = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "This kind of bean can only be planted in <a href=\"\/items\/376\/\" glitch=\"item|patch_dark\">Dark Patches<\/a>, which you will only find underground."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD\/0lEQVR42u2X7U9adxTHzfYH+CeY\n2KwJAgJeqhZbNI1Z0zVri53zaZF2l8sFhaJc4CoCtta24hOrXB9QWyZVtI+kuqzt3rClW5a9qdmL\nJlu6pGnSd0u6F+v7U84vuTdgQbDbsqS5J\/mG3Ad+58N5+J0fZWWyySabbLLJJtt7b5OGyYqAPjQc\n0AfTAzX+nwaowbRb645wOq7if4cLHwxHxg6GQdTFulEIHggReXU+sKlsw++0sGdNf9K7RsUzn2lR\nmWvXXtYQjII5ahRgp8YNExKkR+eFfq17O0bFyktalL9FlXuTVMqb1ENerem38Z29wC0cjRFlQ47U\nXZQgXZo+8Nbw8ZIAncvaNIL4bzbAaOoYhDdNMLBRnwOJ0SwV7tqp67BB3yT6unVFApxsmJIA\/dQQ\nOKqdgLW6K5x7Q6fpXdAQiMlvPoenL3+A27+Mwsi9oxJcuNsH\/pmPgV8+lBIMQs6CmKaoMerKjtSz\n9B+AtunbguSZdRCaZsn96UMRCRBlV\/VkUt1v3hWQmVY3Oha1BOSrB12w+uMg\/PzsLly5fwJ867Xk\n\/tXm6dyaOiykRc0Yo8+znz0IPSRwr168kqKYnepswF61A1glGykKaBOqpQgipAgafXSGpHyC9UC+\nwt+plbYEvP7zNdHD849KAnSonbuWTtmXbJPeMq0C9w0KgrebCNxc4hwsfNsD1753kevoHQvETPM5\nMLNH5iB2bBGut8Rhi9+Cx9HH8Nt3vxPdddyT4DDF4nd2ptimskOPuqdoo3xovqD+W6xDhJxd6oOk\nbRXmlzkpopEETZzMNc8TpxihJ+tPJJBCwh8hAoYN4zlNwiitwGm54ttYu12XoKeU0L9SIzXGRHuA\nRGnWFIGxAAsh4RMIXWohgMWgxMgtHl+S4K4enoHQgWEJ0K3lSJPwFF98L2RMnza2B\/eD\/VIdcKsU\nAfTFDTBlGslbaxiVRMcNorXuZA4YXuM2I3auqOxpMqQPkPQ6Na5UyRPgtFOxiZCe7i7gluoIJG4t\nb3XwHoV1lw0nbtJWJQu91X01JQO2jlWWmzz7np79ohmGGnjgudPALxhhINZUMJLFhHM4G0wcc1h7\ndBV9ec+zuC24X9Pi3feXxdhBipjUTMs5GPS2wnibvygQ1hlOi8v1V2C49nwOGKYVJwfCWZTM1juf\nRDpHFRVdbu322foOHOg5TtApztN8ulA78la0UJljFmkITCnCsUr7\/YybD\/7xkYkeqjWzFP0cF0ZQ\ndJQPoBAUphIbAaFI1KqYF5Yqy2f\/+tnOpx00W1VsilXZJGc4AQpJfEcCU1h+pRV0v7XSWv6fH0Tt\namcjHjaZKiaeqaN0IeFzRsG4Oj\/qrJT\/W8gmm2yyvYf2BtueI3aPJaRzAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_egg-1334602572.swf",
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

log.info("bean_egg.js LOADED");

// generated ok 2012-12-03 17:58:03 by martlume
