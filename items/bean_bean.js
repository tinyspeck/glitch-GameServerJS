//#include include/takeable.js

var label = "Bean Tree Bean";
var version = "1354586283";
var name_single = "Bean Tree Bean";
var name_plural = "Bean Tree Beans";
var article = "a";
var description = "A plain, non-magical bean tree bean. It can grow even more beans!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 150;
var input_for = [];
var parent_classes = ["bean_bean", "bean_base", "takeable"];
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

function onCreate(){ // defined by bean_bean
	this.trant_class = 'trant_bean';
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE20lEQVR42u2Xe0zbVRTHFzUmRheM\n4szmA0qh7SjwK4UxgZZCQRgbax3jVWAr0I7nVsZ4lDq2wupKedYudaMwHpuTIIjIJLCp0M2xxceW\nYYiPxBj+0L\/0DxJ8JIt\/HH\/n4q9pKQUkGo3pSb7\/9N7fuZ977j3n3G7Z4jWvec1rXvOa1\/4Be5TW\nw\/8ZGm0ahzLlhowN1EYuXqrbBaiuY0Kol3OH1BLWy\/8qXHNGiN6cR8Hk2ViiCUMsXKmPgqaDwfBq\nGg\/qUjlQnsAeoqc+tmGn0+0xftOt4v7p1rjF8VMxMFgVRXSxRHi\/UxEq2aifTkWY0qygYET7EtC+\nHLp2VgQN+3kEEFW\/jwslEtbIn0e\/ts2YRNRHLXELCGTJpwAXWKFFXHg9Px3ZfIr55gOjGGbapXDD\nnEIAcdN0ZB2AqJo9HEjib0tZF\/C9puiF7iNC4rj3WKoD7EJROIniRGPs8oJtYrknH91HwiW4Efzu\nvEoEc6NamHunDj67pILZ8+kEEMecAVH50S+OrxnFLo1A3n80knz8el44fD07CaPGUrcjQsChmt3Q\nWxzRb8oM8HFEv1UsmW4Rmy35gkVmY99\/+Tmg\/fTtLAFEYTStSgGcku10AdQksSFsx1auR8De40J9\nS2YocdxVEg\/DTYUwP2mBW2+84gKH0Vx59G9qdpFxjDDz28gZFYH7\/cGvjgiiPrbKyGno5SsBAyGN\nejbbI6AhK1j\/WjqfOO+r3Atvn84hDr+aaoZP+4sIQG9phBscRgPBcRwjyxztjwvfwIPffoF7I6cd\ncChmw+YCyg0wOWQNwOrkwAwdnVEkItoMmOo45HB625YN14zxqyUNXToS4Q49jnfti0kbfDJqg+\/u\n3oC77w+QU7hqynMBtHcmLW\/m5G6wlgrAqAgBQxYfdOlcOBz\/gmdARcR2X8wmE51h3WWJcMtW4OL4\nuvkQXK5NJ2MMXJ8mCe4NHoUf5sbJnHcNufCWLttNty8WOo4X4T40iYEp2oyaDgcv0RjPrJnF5VL2\nZHVKEHTkhJGjcAZ0XhyTCAEHKhM8znHWmCEHbp7b57jLY43RLnC240LQyAOvrNsCy6TsVLpokkKK\njpj6hc4xcihrYbQjgliScCN3ehREV40KF7CBajn5BjeE9xN9ThlFcFnrGr3mohCI4z0Vs5EG8JBK\n7NeDkIO6KLjeLHLserX7hxntXIKYGudJPXSS9VdHusBd0IRDpSxwhl77iY12qUfUcaz5xtxgoBs8\n6Z+eAFHOgKiBiki3OVi+VpYVVC3di1Vi\/yXWk49Tf6nJp3G2+2ozuPOGAj7ZITZ4s5KCtqxQt8Ux\nas6AUwYRaZM4F1vaamCoquQghINo9tMHNvX8slaE+xmUwTfPKPnQVhwGlpLlunWSFi7KyFJEkZLh\nLGuJYFUopu+WJwRAoch\/adNwzmarEla1qkMXEbRWxoETdJbjC4RZsEHGg74V9wp1rlhAxnCOdi8X\nKqRsUNMRw6ilRzw3zPPdyvnb3nXD2gif9mL6+VRG3a+Rk3uDTyQSCewADQd5YC6lwFIucBFmpy6T\nBydkQaCO9\/85K+r5CSlvW\/KGnlabNXwv6g7wJOXSAL06zt9CR8WuEvnbSxNZdhrG3qTkE+nzd9qr\n5UETZXtYrfsFO\/D14+P9t+M1r3nNa\/8z+wP7HiR+ul9v1wAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_bean-1334602769.swf",
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

log.info("bean_bean.js LOADED");

// generated ok 2012-12-03 17:58:03 by martlume
