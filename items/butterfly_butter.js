//#include include/food.js, include/takeable.js

var label = "Butterfly Butter";
var version = "1354597642";
var name_single = "Butterfly Butter";
var name_plural = "Butterfly Butter";
var article = "a";
var description = "Butterfly butter might seem like an odd thing, but it is used in many delicious cooking recipes.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 10;
var input_for = [2,81,84,86,87,88,91,94,95,96,227,288,325,334];
var parent_classes = ["butterfly_butter", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.compress = { // defined by butterfly_butter
	"name"				: "compress",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Makes cheese. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.metabolics_get_energy() <= 5){
			return {state:'disabled', reason: "You don't have enough energy to do that."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return { energy_cost : 5 };
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_energy() <= 5 * msg.count){
			self_msgs.push("You don't have enough energy to do that!");
			failed = 1;
			var pre_msg = this.buildVerbMessage(msg.count, 'compress', 'compressed', failed, self_msgs, self_effects, they_effects);
			if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);
		}
		else{
			var duration = 2000 + 1000 * intval(msg.count / 10);

			var annc = {
				type: 'pc_overlay',
				uid: 'butter_compress_'+pc.tsid,
				item_class: this.class_tsid,
				duration: duration,
				bubble: true,
				pc_tsid: pc.tsid,
				delta_y: -120,
			}

			pc.location.apiSendAnnouncementX(annc, pc);
			annc.locking = true;
			pc.apiSendAnnouncement(annc);

			self_msgs.push("You squeeze the butterfly butter with all your might and cheese appears!");
			var val = pc.metabolics_lose_energy(5 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
			self_effects.push({
				"type"	: "item_give",
				"which"	: "Cheese",
				"value"	: msg.count
			});

			var pre_msg = this.buildVerbMessage(msg.count, 'compress', 'compressed', failed, self_msgs, self_effects, they_effects);
			
			if (this.isOnGround()){
				pc.createItemFromSourceDelayed("cheese", 1 * msg.count, this, false, duration, pre_msg);
			} else {
				pc.createItemFromOffsetDelayed("cheese", 1 * msg.count, {x: 0, y: 0}, false, duration, pre_msg, pc);
			}
			this.apiDelete();

			pc.achievements_grant('cheesemongerer');
		}

		return failed ? false : true;
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this from <a href=\"\/items\/50\/\" glitch=\"item|milk_butterfly\">Butterfly Milk<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-17,"w":33,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAESElEQVR42u2Y\/U4TaRTGewe9hL0E\nLsFL8BJ6CSQqulGTJv6hrhsXAb\/qRyoJhjUmi8rG1bhsUSJBi45GCH6Q1JJdSlFslRo77fvO2fc5\nnTPMtAOSaUH+4E1O6nyQ9zfPOc85M8Ziu2t37dBF1dFubd\/LOOphhijbS\/S8a8fAqS9nE2p4lnR5\ngHRliBxnioimzW8258L+9OOUq\/R3AUxdypNaSDcgP18ioyRDrkXWMr\/d2wrLcEsXS2rwHQMy6OxN\nL5zqaBOkFyMGdM\/Wp3buhsXKmfSqYorUgwlSJ1YDoR\/kyfn2ch1QpH86viVw+vNAUp0tkHo01lAO\ngH9YLYAcfRXSMwVyVmfCIK2OQ9Jq\/x7UG4AYzrpN6vRKKxjUxTWk\/PEYqYkPpKfL5LxfIKc05wct\n0ZtiZ1xPlIqrcn9OTf3FmzMg4BBIsYSoKeeNwrp83oBNkp7\/j\/SUSf9Dey3GqyV6VN3bfmrL\/b0M\nBQAoA4UA4qbaH3zdn3b8Gw+Vz7KCYUH5fKJdwJLXVgAgxkDKETg26gZAUZ\/mAQJlcOVrUMGAmnZv\nO4Bp3lSgAARYQAAALYfTOdCqqDgd5nLNo8aqATipT118m4lsnvqLkTS3EGyKDaEOYA1gGFgoLO7H\n3\/3+jnR2kfSLFXIK851zuB592s0bQbH56410y7gLA5J7\/GHONa6fD5k8075xGXGu6\/xgNwAZ4M8n\n4UaBSpJSaT14KIScx7m\/jbtn85xi\/XqJFfVidjl6G+Ke+GY4xxt5irhwgBCApmvhEa4kJpHbN6M5\nnE5SvH45lw7AYfwBztRoaLpxHQ\/Q5HiGNDOcjeJXETVq1CV6lmxr\/HluhaNbNndNJW73p9pr5u69\nC6PhLQgN\/lk53d67IQCb0w3XItVh0NJ+AI5algZ\/rrUN+SZP2mQ\/HhmyBQKbm403bD0AlbqV+M0o\nNvYlmG4zzwGpxm2rI5CsiDRzKORPL459avM9\/lbEL8GmLu275OjJoHlM33Ty70uR25BA8osFUihz\nG2Ayx2X8rZN+RH35GNULPY1YTpL6dIb06jXS326J69uDZJXkLcedQAFH+2e0GAbhqlhf+nkNMCyW\nDpP6eLykCvujtSF1vJLwNmwC9Awkbacp6qlXVD01SdXDM\/xrp+6TfeMm1abOUC13JABaW+yxors7\nN5TwzCIfV5uIevFoEML6heEAaQ\/eacADHMf3rybbelWTz9P13Mw16WvsauXXjVPrC3tiINeZD63U\nvwnvOwb1h36HdErzds2iSn1cW5sFjFx\/66Xbc3SImgCv\/TO8abja4oFM5z9ZoWSIYaSt1OaOkX1r\nqGGI8Qt8vAHk1nxj08lKFz7AAup9PNGqEGANKBuiL8PgMErj+oFkbCuXfCUyHOqucHDjdAL23lVu\nN9Xk80xsO5YLaQUmxvfrLkefDsVj27lQSxJwJdLnxWLPCMwgQcV9O+e\/93bX7vKt\/wEQMJqy9zb2\nEgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/butterfly_butter-1334352628.swf",
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
	"food"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "compress",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("butterfly_butter.js LOADED");

// generated ok 2012-12-03 21:07:22 by martlume
