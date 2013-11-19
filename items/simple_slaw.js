//#include include/food.js, include/takeable.js

var label = "Simple Slaw";
var version = "1354588647";
var name_single = "Simple Slaw";
var name_plural = "Simple Slaws";
var article = "a";
var description = "The simplest of slaws.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 27;
var input_for = [];
var parent_classes = ["simple_slaw", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-23,"w":22,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJGUlEQVR42s2Y6VNTWRrGrfkHrJ6v\n82Gqa0ZcupVpW20VhRYQaAeJDqAtIKA4Lci+iagkIIjKaFilWQIhbEG2yxIERAh7AkT2xQiSgIAo\nYsQFXOuZcy6D7VRPK+gIfatOJTe55z2\/+7zLWZYt+4TL3FeLsfDR4r37m5\/CcDlXZmDHlenzuHID\nd3q\/bKkuC58VUnMfLZWFz1845Hs4V76DEyg31Jzv3IWLvbtxrv0HUNAlA7T0\/aueha8WLHxXtNmF\nrWXOtpqwYLT9q8cU3AYDuORsUZ1K3\/XnRYcz910hNPdZoaEK0k838XdtwQojUMighp04UaYL3vVd\n4JaYIqbUDjUDF6WLCrjXS0ubgs0qqAVewh74JOvCKXY9XFM2wvPKFoRWmEFU54oYiTnGVRsB9bL\/\ntD+Ef1a4JzN8vcdP\/Jkp5RdtTfVbISzxglwZgZNpRijtCEajKhYN6sso7TyLMGYfRGU6mHoWjDdD\nfwRGvsSocjsqWvZzPgscRpZpj6kNUCr9Chgjqkw6YfRuInLqvRFXegi37mbi9kMG\/GJrBOdyEHvd\nBpV9\/pga242ZRx7AhA2g8UNkkSUyFS5MtuKnj89ynkxfSOMquMUIXiU6Qh+RISft6hbGM3E7ymu+\nJYNZ4YXmEkpuBEJQ\/k80dp1H\/7gY6XXeiK2xQm7PMRT0uqG4zwtlSk8olF5Iqz4E5ehlpDc6g1+y\nH+kKJ81HwdGSMVcuQttMIJCfQIrcHRl1XvAS6BK3\/R3yTldkyT2RqziOHpUAA+M5KLpxBvzS\/cjq\ncoSg0YGFzO91AdNLYrHSGrHVVijo9EN8pT3cY7fiTM5u+Cbv0Fsw4JlmI9VcyeDW6SNe4Y6Cbh5k\nt\/kQVrnguHAHTqeboLDlBIq7AjB4LwdDkwWIlhzEpeIDqFAHIa7GATUjobimCkB2z1EIm+0RWsiB\nc9QG2J\/7CoE5hoit+xH8Mkv3BQPO1TRabH2KtsFXsg2J9bYQN7kiQ+6FkGwOTmcYI\/yqFaQ9Z9Gp\nTsDwIwnk\/VEIEpsiOM8UsdLD6J4SYex1OVLb7RDMGMMx8htYB66CbcgaOIavRxD5LZTZ0yZosJpf\nrQSgd1URz\/BIkQ2UGcCH2QoP8Wb45emxivBLDiBKcgCZMjcky5xxJssUcWX2uDEYjd6xVDT1h0Nc\n64xzuXsQkPEDRK0OELRYwy9tO9ziNhG41W8BXaI3wStRFwFiY3gyG3A0ey3TP9Gs91tg7s+fP9e0\ntLTgUroHoq\/vxVmGFNz0bfDL\/B7+qUbIlDujeTgG0r4gZLZ4Qt5tjPvKP0EkWYdLBZao7AxC02AU\nmlQxyL7hh5R6Z1wosCBwuviJ\/zfWrftPrYQVbxULeZS\/nsYfWzudMr\/FsbTNCCnfh\/HJEQ3leRdO\nSBoKJflIyePjZ6kt4khLqrdDRPkBhOb9A\/4pxkisPIi+h+nIb3FDd58OJl+JMTNhjOmBL1Db8A0E\nVU5IqnYiL2eHok4uavovIYDE6bHoDTgWsYFV7ceAVayKFNbu7Bq4\/ryZBXQUr2cBndI34WKmHyYn\nJymScA4QL168QFTGSVyQcJChcCRxsRdhEkuE5pvhdJox\/EXGCLlihszGIxA1OqKpQwcYJoV39Gtg\nfCde3rcnWe6ClEYnJFTYwiNBB+GF1gRuEwtDm3XQauw\/vZIFpffeAh2cEO2EcxJ5AQLolPYdC+mX\nwcHw8DDFAgv4+vVr9qb0hgChZXqIlJohtGAPAeSQ2YHEYYI+yVhjAmqC4GwzxFU7IF\/hiumJQ8CD\nI6TwBuDWUAhJoqPIb\/VG03AURLWH4Zukh8BMU9iFzgIdJGAW\/ithc2Y1SRZtnMzaDF\/h9\/AgUB45\nRL0sApmxERevHmV5Xr16NQs4R0uvZvUVRJKgD2E4iKzaRQquGbzj9cG9YoJTrJJGOJ5kCH6hOa71\nctGuPoceNR+SDn+SREcg6fKHtP88KcRu8EnSxeGL64grv551KQE9wFsNW+LaQxfWwTV+I1FrCzxT\ntsK7QAfcShOIWgLw7MUUy9LW1jYLqFQqMTIygpmZmbegfaMyEkc8xNVZkjgyJHXPACfTdxI4AxbY\nJ1EfHpf1EFFsjhzFMaQ3uSGh9ggqlCGIvGpDXmYnLhTuhn3YrHttgtfAmii379Sqt4ran9PGweC1\nCL1ijRqlGNMvH7NjP3r0CO3t7ZBKpb8A9vf3Q6VSYWxsDI8fP8bLly\/x7jUy0Q9FfxnE0vOIZtxx\nucgdrjHb4RGjB2GDA0kMWwhqDyKm3JrNzDS5A7iZxnDgr2Vh\/GL3gpdIiriYzCp1l6Ecaf4v+8+e\nPWNFomD19fWoqan534BDQ0MYHR3F3bt3MTExgYcPH7KdKfCbN2\/w\/7iopx48eAC1Wo3Ozk60traC\nlrempiY0NjYuDJCm+9TUFJ4+fcoangOljSYXzX5SPzE9Pc0+Q9WnLtJoNGxfauPevXusvdu3b+PW\nrVu4efMmenp60NXVxSr2QUDSQfMxgDTL5uCePHnCPkcVp+rcv3+ftUFt0SSktj8akCho9zsF\/GXD\nRQB5xIjmdwT4690gMbC8tLRUQ2NyKQAbGhqQnZ2NysrK317ZECWZuro6XLt2je1ApaaGPwcgtV9Y\nWIjc3FwkJycjLCwMAoFA9d7lFjHgTg0NDg6yZaCjo4OFrKqqYt+YqjoXr\/SZgYEB9p4O2tfX91YZ\nWj7oTEDVUSgUrPuKi4tRVFSE1NRU8Pl8FigiIgLx8fHIyclBSUkJbcL3ApJBtd8FpG9\/586dt3FJ\nSwaFnFNpzkUUorq6GhKJhIWgyhQUFIBhGOTl5bEqUQjqwqysLOTn57PP0j7EpaioqEBZWRkF\/PBu\njwBq5gs4Pj7O\/kefoQlG+1FFaRz39vaiu7ub9QJVk75Ec3MzZDIZ697a2tpfAZLPD+\/yiNuYpQAk\nCdo2r2U\/AXRfIsD5nTjQOFwiF8\/\/tIEMpFlswHnF3zuJwiwmIKm7bQvaF5M6577ICoYvFFBvkQEX\nftpFANsWCVD4UQdIZF5dTgbmfS5AMoVqSLP75DNBCkogeGS\/IiVAmk8BJHOyiiyppGRJZffZTlgJ\nHIdAComaUqKq5n2AZOGgIfO1lACGkzlbe6Fj\/RuTEHJbqnjePQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/simple_slaw-1334213655.swf",
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

log.info("simple_slaw.js LOADED");

// generated ok 2012-12-03 18:37:27 by martlume
