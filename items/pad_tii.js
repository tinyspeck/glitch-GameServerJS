//#include include/food.js, include/takeable.js

var label = "Pad Tii";
var version = "1354649308";
var name_single = "Pad Tii";
var name_plural = "Pad Tii";
var article = "a";
var description = "Tii has not heard of this dish yet. Chances are it would not approve. Do not tell Tii. Please.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 392;
var input_for = [];
var parent_classes = ["pad_tii", "food", "takeable"];
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

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-23,"w":47,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIHklEQVR42u2XCVDTZxrG\/+0qti4t\nIC0EDJdAOeQIiFgOCZAIEm6UhCMQKCgKlHIIohxRYaFUFA+85VC0QKVLVUSUAi5SxIrF9ahSlqZ0\nZa2riF3HdWq7+2y+jyEiYjvd1up0fGee+ZJMZvLL877P931\/hnlez+t3Vo5BjB5ZY7JG1meuHAIZ\nrjCJkZB1Uw1j\/cwB8vmzVNyFU2Tzg1+tiMua1LbjA0ZlVjCjMursU6m+xmBub4NQUlnoUcH3mg4X\nviaCExn4RCnh3bLJFQSaL2akT8Wt09VBJX2NQlxvF+NudzRkzSJ4hinBVcRgUTaD9GIGGws5Mm+R\nSltSPuP\/xGC+b03hHhbpvlPjoSY7MF8dDYFaqAlk4\/zWeRTs2y4JtuU6Y0u2E0oLbSkgcXHlRgZl\ntapYt8oO8tkcJi1\/InAX8t3xZ+\/X0fmWIXqXWeH9SHN07BJQ54iD5flc1JXw0b7HF18dD0F6pi4E\n0SMubqh+AXsqDeEUxEBa\/Irs7QgH7q8Gd1WsYS1Ltx7uidanYOczZyOKb4YkoR1O5NihMcYQ9REG\nqI2YIXeTh6utYbjfHYXmCjf4RU5FWMoIZFGZEgJjlej78s02ELhz6Gz+ovmK4JlXtAe+Ntwv1sRA\nJAtfpVngLV9rnC32wRGRHo4u1Eb3EhP0Zs\/CzTo\/3DgchLPLLNGznIOeDwMQEqtKXSOA8atHRN4T\n2LBAKwLZI3C3+Xnp9nGzsSb\/TswzR43HNJwP0aBwRE0rHPF5sStORcvdSjKnjnbluaC\/IRiXixxw\nUmKA3kwOrstdxMVFGGgTKgITtZyh7pG2kzVF+jIc7Yzh7c4ZFrhxfjo8Xm42XAGPU+\/lZg1XBzPk\nurHRnczB0Ho+bpUGYiDJGO2JpugNH3GzP84AA+W+uPTRQnQXu+GgnyYFvlgpwLUT4bjZEYErx\/xw\nsMoeQbGTIIx\/kUIGxI24mFzIwFOgCmszXXi4WBLQkgnBiMXEMU+uJebam8DeegbVX7cJce9YAv7V\nkII7TSvRmTYbjT7qCjevrLTBrc5I3D4ipuEhjp4pcMGRrfPR3yTC2UYuyir1UFVtQbWzTAuZhVOo\ngwSQaGnui7Aw04CpoRZ1c8KW+\/HtpGmLBeDOeQBHdLchDv059tSVK8usKdyVZAtcy7DCYLIp+uoX\n0O3lQrY9ehJM6Xdri\/mQb9i4cMiPAp04HY\/rQ23oPLccJ7uTKXBq3mTa8lHIwJhJMDHSwBsGLOrm\nPBfLYW8eR6IAnM5iSYz0dTEe8qh4ZDsh+maDB+41xeN+Rw5+uLAbvftDcWynFy5tcUf\/UkPIYnTw\nRZEjqte60y2m69BcHG+PpGB9A3tx+nwuzl0ppsCr3n2FuugqUoJ39DREZ5gjTz5CFmZsCjnGzQcp\n12FpyQhkSqwXnO3egGCOoWKmrpUKaKuv7\/BXALcU8bFRHpiWULai5TervSggcbCp2o7CXf5yFwb\/\n2YSLfaUUknxWuc8Y4SkshKcaoKRKjKT8N1Hd+g7W7hZTwFFFBc\/FhlXhMgpoOkNXqqOljVFIXz4H\nZX66GNzqix96NuPcGjcFHNHRrDdRtcwex3wfzOQXVQIKR2bw\/e2WaPkklgKNgn597SBV4\/EF2Fzl\ni7S1DthZH4O6jlQU7loof70Ybu7m4DmZY11OKDblieHJmwkKqKampiIHHCaQRMvjfbFeZIXr1ZH4\nrjUZjUIdxZwRJ8l8tqTbozNEmyb8drmIwp2pCaDOlhaaoqE5EGcv\/YmKOEhafe+7v6HrsyzkbXbC\nvuZ4LCtywaFPM7B6XTDSVnijKFdEwQK9baCirgQlZQaKWWSztKWjgMTJxChPDBxMpIAfx5rhfMYs\n3O9cTWfwzkcxOBlnhhv7wjBUl4q\/l3jjTKU3bTEBzE60pa0k7pGQjLaY6EhzEKIlplhXEYH4TGe8\nty0cZbsXY2uBBDHhc8GarkzBiCb\/kal4KNE6LO2K8ZCff5CAM6m2+FreBgJ772QB+jJt8e9DizC0\nV\/RQ2wmcNGEO5CmENJeN1k8W47+4QQG\/vFpLk7x9lwH851vR7yyN5FGwjATBQ2CjYl6a4A45EWSL\n1FPR7m\/2iOjxdqcxHrLVjhSOAP+jbAH+sskHtdnzsHdVACoKXHGgzglDw6dogo+2iairGWl6iA3l\nolg+Z9K0AMycyXoEbKrKH\/DqNKXH3x\/HQhIRyB1rQnCrMRE35CDkCCTBOb3ImALe\/nAJ7ncV0Bkd\nkG\/W\/7m8H5\/tfxtZK3Swfac61foSDazKnonCFUIUZQnh4mT8CBiR2msvtZkasbg\/eVEYDxkbykN5\nYTgurfemgB1JNvQEGSzxwPefvoe7H+dSWOIqcfpsRRRtY+gCcyyJtsaadD9FACYCU9eYOjxJmeH+\nrNuMPptdPxZSHOSCnGR\/RPva0h\/f4qOHwXIhBSLJPhGhj+MiNr49IMHqpXwEeM5CWpwXnbOxyRzX\nzmFd\/WnS\/\/vKZaSv0zYW0oc3m84P+fEAnhVOrfWjgEQEjri7O8FJATY+mWPnTL5Kf9GdcBTSZIZe\nz3jI\/IyFFDJYYEdDQVp6OM0Zm8I52LhGTJM5UQCINLWU28wMtPR+1Yej8ZB8Zw5KpOEIC3Cg7ZYE\nOysC8DgwFfUpMktLHf8n9gQ3HtLOyoRCkpb\/WDLJnE3XVZX8Jo+Z4yFNjXTpmTlRACYrM8NsXdWS\n3\/xZeCyk5uvqj9s2yDGlwjyNGgupx9Z6ZKOd8Ih6WpCmhnqj7WxT15zqzzxLRSBtLQzr5bcOCfO8\nntfvtP4H7RztuTLZLVoAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/pad_tii-1353117636.swf",
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
	"newfood",
	"food",
	"foodbonus"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("pad_tii.js LOADED");

// generated ok 2012-12-04 11:28:28 by martlume
