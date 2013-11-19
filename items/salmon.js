//#include include/food.js, include/takeable.js

var label = "Pocket Salmon";
var version = "1354586986";
var name_single = "Pocket Salmon";
var name_plural = "Pocket Salmen";
var article = "a";
var description = "It's like salmon, but in your pocket! Pocket Salmon! The handy friendly fish-at-your-fingertips that's always ready to go! Why settle for boring old underwater catch-me-if-you-calmon-salmon when you could have the ever-accessible, always-dependable, never-stinky always-yummy Pocket Salmon instead! POCKET SALMON! [TM. Always read the label. Terms and conditions apply]";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 15;
var input_for = [27,101,332];
var parent_classes = ["salmon", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
};

var instancePropsDef = {};

var verbs = {};

verbs.release = { // defined by salmon
	"name"				: "release",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Release the Salmon!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var salmonNum = pc.location.find_items('npc_salmon'); 

		if(pc.location.hubid == 136 || pc.location.hubid == 140) //136 = Jal, 140 = Samudra
		{
		   if(salmonNum.length<71)
		   {
		       return {state:'enabled'};
		   }
		   else
		   {
		       return {state:null};
		   }
		}
		else
		{
		   return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		pc.location.createItemStack('npc_salmon', 1, pc.x, pc.y); // spawn salmon in level

		var energy = pc.metabolics_add_energy(-1 * 4);  //remove 4 energy

		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: energy	
		});

		var context = {'class_id':this.class_tsid, 'verb':''}; //give 5 img
		var val = pc.stats_add_xp(5, false, context);
		if (val){
		   self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
		   });
		}

		pc.announce_sound('SALMON_RELEASE'); //play sound
		pc.feats_increment('animal_love', 1);

		var pre_msg = this.buildVerbMessage(msg.count, 'release', 'released', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		this.apiDelete(); //delete self

		return failed ? false : true;
	}
};

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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be pocketed from a <a href=\"\/items\/1372\/\" glitch=\"item|npc_salmon\">Salmon<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-17,"w":58,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHHElEQVR42u2YX0xUdxbHm33YVx72\nedMm24fdpBse+tQ0WWLERKJY478RZUEQ1GT4p\/wViQgKImgGkb8FGYvIHwFRrMjM4Nz5PwwMpUVE\nyp+5aNOWtmlYs5Lswybf\/Z7fFrLt7ssmly6b9CY3ZMiduZ\/7Ped8zzn3jTd+Of4PD4fDEVVRUTFY\nVVUVtSUBU1NTrdnZ2SgpKSndcnDx8fEx+\/fvx8mTJ3HmzBmUlZXFbCnA2NjYUkLi8OHDCvLs2bP6\nlgr1tm3bYv6cmIjjqanYs2cPzGYzSktL9Zqamg+2DGRVZeWqy27HyP37OJmejiNHjuDSpUtg4eg3\nb94c7OvrK7Xb7TGBQOB\/E36GV+u6dQvux49x+8MPkZKSgmPHjuHChQugkurs7e1Fbm5ux6bD1NfX\nv1lXVxd9\/fr15IyMjOikpCTLqVOn0G21wvPoETwPH2LXrl0K8sSJE0rJhoYG8Lohfv1XmwbGm0WJ\nnciNeTN188LCQtTX1eHOD3C2vj50tbRgx44diIuLe8Xr3bzWykLa3HzcvXt3NAtAT0tLQ15eHqwf\ntcM++hiuUTuCzlEF18XQFuTmBk+np0ue\/WbTQ5mQkBBDlSzXrl3TKysrIWfn7dsYHBhAeDyASZ5j\nLicChJSwXma+Xb58WW9padk8i2H1vcmELz137pxOMDQ3N0P+PrI9xMvvdDx9NgW\/5oRrZATu4eGN\nnBu+cwcFp0+juLhYNwxGnvTu3bvqaQ8ePBhFMCttYZV2ADkFrLr6CuZfPseC\/hxBvxeeUQeCHhcm\ngz54Pv5YwXkfPEB\/ayuS6YVZWVnG5Zo099raWpSXl+ss\/9URqvKQN2xqagIrFE88o\/hu7WvMR2YR\nGvMr5dy8xv\/EAd\/j4Q04rb8fLQw\/c9RiGBxbUjahIPZAywANFG1tbcq36m7UKdVe\/f17zC3MQHM4\nEA4x39yaUi7gsG3A+QYHMcwKvlJUpBnZO6MOHDiwevToUXR3dyMUCqlcY96hu7dLqfbt668wORmC\nz+3C1OQYJsd8\/xZWgfNTvR6LBRezspINA6RHxezduxdWPrnX64XNZkN+fj5udVgVnCgX+WIen02H\nFZwoJ9U64dHgGRr6EZyDv9FYUvLqrpHDwaFDh5ItfOp+3oB9UqnX1NyEL1df4sXKEiYmgnAxrC6C\ne+02pdx\/gguwdQ0wV6\/l5RnbvjgOaU6nE+veJjmnryzi+799Aw8LYZxAknPjfg\/89DjJuRAL46dw\nno4OWMvKUGVk5ZpMpg9aaQmimqgo5+fLswpubnEGQZ8bQa9LNX2BmwwQkl7n5ZTiu3dvAy7Y1YUh\nqnclM\/OFoeqxL+oCJdOFWMnM\/Gf49q9fYYyq+V2ayrnpqXGG1YuQNgqvhHUdjn12Hc7N1LhdXo7C\nxMQ8I1tXMgdJBSYmPHh\/QBWDGLAo53HYlXJuKhawj+BpOAg\/K3YDrqdHwY1Ju5MRKiMDhTR4wwA5\nhegD7KOSd61s7B5WpnicDJrSuiTnZli5ISe7hW3kx8qtwzHvRuib7cXFKGBLNFS9q1evKt8TBZ0a\nIQL\/VC4c8qtq\/ZTNf8LtRJjnOpxjHY69VuBG6+vRef48ziclPePP\/tpQ9bjIqNC2M3\/+VTkJ6wQL\nQxnwDzk3ylxro1Id7C7O9nYF52xsRA+rtjItba3QZIo2dGySLsFRCHeohEvT2FvH8HT6U4T8foz7\nfHDSPmZYIH7bMGqYpyc498kk3MoH8nOUF+UEroG7rzk+\/pChlZuYmKjJAMDFBTIQ+Aj0ydQneP75\nc8wvzEPXI4gsLXHwdKD6Yhl27twJmrnqLo0VFXjA1FiHS9y+vdhoW8nmIg3xPo5WGJIQsr2Fw2G8\nXFnGkr6ISCSC5eVlhKmqn9d4qbKTafCEo\/tgdfXmwdGUozlArrrdbqysrGBubk4p+Ig2MjExgYXI\nPCIvlvDNX75WgM9mZnCPy02wsxMaq7yPKdHD6cZiNq\/te\/\/9I4ZPx1z7pgROrEU2\/tevX2N8fFxV\ncngyjEV9QUEvMbwC2MNcu3fjBmzMt16GVuAupaYuHnjvve2bsU8kFxUVqQFU5r52VqKAaCwQ+Z+M\nWNPT0wpwdnZWrYy1tI9+hrT74kW087sFJtPTP73zzm83a0XUpWrllNbWQZuQxVngXC6XAlThZk42\ns1IbmGedrFqBs2RmrqXGxRUb6nM\/VU\/eMom1iIpSjZxg5K0Tymgh+VS0kKtjjSQ\/++lH7CxdDGlT\nQQGy9u2zvfv227\/b1HVRTDknJwfyvi47MxMVDF2tKEmIWqrUTMNu4+deKtdSUoLreXlrOQkJzX98\n663f\/1wvE6cEMJPNPIPbv4VhayCUeFojAWsKC1FB+Pzk5FeZJlOzKTb2Dz\/rixzZbc1ms0UqV940\n5aSnazlpadrp48e13JQULScpqS4vKWnrvBr75fgvj38A1uZCkMVYmCcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/salmon-1339640329.swf",
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
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"c"	: "release"
};

log.info("salmon.js LOADED");

// generated ok 2012-12-03 18:09:46 by martlume
