//#include include/takeable.js

var label = "Pumpkin Seed";
var version = "1352767814";
var name_single = "Pumpkin Seed";
var name_plural = "Pumpkin Seeds";
var article = "a";
var description = "A packet of Pumpkin seeds. This can be planted to grow one mighty <a href=\"\/items\/928\/\" glitch=\"item|pumpkin\">Pumpkin<\/a> at a time in either a Crop Garden or a Herb garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 17;
var input_for = [];
var parent_classes = ["seed_pumpkin", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "pumpkin",	// defined by seed_base (overridden by seed_pumpkin)
	"produces_count"	: "1",	// defined by seed_base
	"time_grow1"	: "3",	// defined by seed_base (overridden by seed_pumpkin)
	"time_grow2"	: "3"	// defined by seed_base (overridden by seed_pumpkin)
};

var instancePropsDef = {};

var verbs = {};

verbs.lament = { // defined by seed_pumpkin
	"name"				: "lament",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Close your eyes and wish hard for Zilloween to come again",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (isZilloween()) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity('You wished hard, and lamented the calendar, but Zilloween did not come, so you could not plant your seeds. At least you learnt something. You gain 2 iMG.');
		pc.stats_add_xp(2, true);
		this.apiDelete();
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "This item is seasonal. It can only be grown during the appropriate holidays."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"zilloween",
	"croppery_gardening_supplies",
	"herb_seed",
	"seed"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-27,"w":23,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALBElEQVR42s3Y6VfTVxoH8P4Hth0F\ntS\/a09k6nXamnemprVPrnOq0M22nrdPNjq2AYTWQjUVc2Pc1JIGEQCBsCbKrIIssPxZBUHYUEpaE\nAO601ra2nc6L79x7f0lgRqvJmXkxnPOceJSDH+5z7\/M89z700AO+Kgul3PowaCVcRT4NMVeuEXOl\nuSFcSW4wV6IK5vQKIVeUI+R0OUGcTh7IFWYFctrMAC6fRpofp0n15fJI5KYIuNwkAadK9OEUid5c\nTgKJOC+uVCH1esjdr8pCGdaHsUAKggQBggBRlicCQYIAoVcKUawQoijnIHTyIBRmB6IgKwAEifx0\nf2jS\/KBO9UVeigC5yQKokg5AmegDRYI3cuK9UKqSxLiFS03131CSKyIgigtlYSyQwUCiQislSClB\nSlCmFqM0jwT5Xvr9elUIipXBBBuMIgLW5QgJ9iCJIAIOIuBA5GfQCICGwNVp\/shL9UN5nsw9YHac\n387MOF\/yn4qdOAeQR9ojX7oW7O9C7UH\/TYby\/wyNlEWZ\/dNQEI7Kokga7gEz4wReFEhXhKbWqOXT\ny6eYT3OFhk81S7daxAdNe14In3p7+tkWcGwD+1YoVhxk24GGUXcI6bHeereAWbG+MRT4YzgHrFz9\n3+HofjUURuCQeA\/n3gHpezumsu+vqBt6j4\/B91Az+C6qz72DqoG3UdX\/Fo6ffROVfX+Bse8NGHpf\nR0Xvn1DRsxvl3btQyr2Gkq4\/Qt+5E\/qOV1HcsQNF7a9A174dhWe2o6DtJWhbt0Hb8iL7c9jhHe4B\nu7u3yTsG\/oD1cab\/ZbT1vYTW3m1o6XkRzd0v4DT3Apq6fofGzudxquM5nGz\/LU6ceRb1bc+grvXX\nqG15GjXNv0J101Ooavoljjf+HJWnfgbjyZ\/CcOJJVNQ\/gfK6J3BUsts94FLWY9xy9mNwxFLWVtgy\nt2IxfSusaVthSdmCheQtmE\/cgrmEzZiN2wxz7GaYojdjOsoTl4564uIRT0xFemDykAcmwj0wHuaB\nMdkmjEo3YUS8CcOijbgQvBFDwo2I9n4J\/9fAEK\/X3ANmxvpyymT\/\/+lhcERl8vssjEnv43jKRziZ\ntRdBPm+4CxTcUjiAdlhfWyEsM91YWRjEyvxaLM+dw\/LsAJZm+2Ezn8WiqZdED6wzJKa7MdhVht6W\nAlIRDrEOw3cZPlghV4ohPPBnhArffNyNOugLBrTjRvur8c87V\/8tfvjmCn74+jL+8dUyvv9qCd\/d\ntuG7L6349pYFd75YwJ3P5\/DN6iy+vmnGVzdMWF0ZQ\/uJHDuOb4N6lQj58mAE+74JadCenW4BlSkB\nzpW7G0dgX68w2PcMtrgONs\/DVs0EZyK4ady+fglfXruIG7ZhVBUdYTgGJJ1KKw+ByP8thIe4CKR9\nmAI1GUFsv925Zb0HbHkdzIqJ6WqMXarCjSuj62AzDHabwL68OoVbVyZIjGPZ3MsPERn+DKjOEkIc\n8DYOifa861YfpsCWugxnOimMpfP2khNGV01ZtQ\/70zZAoHgEk2ajHTa9Brs6yWBfXB7D5yuj+Hx5\nGHUlMQxYppEhK9GXpPcdREo+iHELqCZTR0ttxto+s8PW77OeoQLsT92AoPxHEN3igWmr0Z5OB2xi\nHWwEq0sXcNN2HrUl0WyaKc8PRXaSH0IPvosjbgPTA9Fck37fA3Dj8jCiq55BTJsnAZK6N1dBVs0B\nI6vmgJFVo7CbtiHcWDyHGj0F+jFgDjmMYcF7cEz2UYxbg4KWzHA9zZoHHoDOfiWkho0Ir94Eq6XN\nDqOrZoctOWCDuG4dwHVLP2qKj7Ehlo5aycf2I0L0NxwL\/7jBLSAdNM\/3GPCtA0ZW7V4HYGVuEAGa\nRyEsetSZTgrj0+mAnWOwawtncXWhjxR2CRlWfRkwJdobkeL3ERO+l3MLWECB3eUMxtczE67ZRmGa\n6IZpvAumsU5WpFdJCiO0v4Eg52Es1kthrZXAUiPBQrUI1uZEXB5vwDULD7s634src90M51jBtBhv\nHJZ+iNjIfa4BM2IFegYkI\/oQV2YvtDOwndWiNf5lTJULcLMnA9caQzGbsx2tIk+Iox6GjAQn9kSf\nxNF7Sd8lvXc86mnYzpUSWA8uz3K4bO4iYz7ZQuTnU2ASSfHR0I8Qd2TfmMt9mAJ1pIdODjawfbY8\noEWTeCPmit\/DzeYw3DgdhusEOFUagCIfT6SE\/ASZgRuh+cwTmXs90CtaA45INuFi1utYnmrEipms\nuqmDB5L7CQUmHP0MUWF7kXh0P9wC0oY\/P3WGdYCe+GcwrtqN1ZYwBrxCcJ06GSaMMphiNmPGMcEc\n9sQImVoUf\/fAgHgNOBL+OJZ6dVieacfSdBu73TlXMMoLMRGfsE8XU+w7RoFFZBqZm2jF1Yl6NEk2\nkpSKnMCeYhnOFQfDqtp+F5COV42BJALsoxUBXiCjlbUhFkuXWmG71AJyPyY\/P4Q\/JDE+dP+xw+Jy\nH2ZAkuLZ8WbMNEWjK+oXWG0NY8ApYwjqo3ayOdBM5sB7AYdlHqgSeDhnPwo0qz+BjazeCFfC7sYU\nqFfLkEoOSfzhT5EWe8B1YE6iH5vdlsw9mKiWopekmAJvNolQKX4K42QwvR+QHpJ7AZem23Ghq5hd\n3GkfLlGHMiDdh+nxAveBtJ6NV4kxotzFgEu5z0Hr7Yn5pC3uAUPsK0hSfL5Tx4ClpA+XaEKRHneA\n7b\/MBD+43OYokL4G0EI7dlyE8dzduFb1MRv39YIHAzuD7wYulAphmWzCUHsBe\/YoJenVqaQE5sv2\nX3aSv+tAOQMGsg5gas\/GqGoXltXPMWCzZDP6I++fYsMBD9T7rd0\/JqKfh7XmCOZGajF4Jp8B6X2Y\nArMILJXsPzmZP10GKpNJIyfLTzvA8nQreqOewGIGf2GaJJej0+L7A2ktZGXGDpzVfAJLSyZmh6vR\ndSILigQfdoKLcqUMlh4ngCI1CC4\/eahS\/FFXGm1vTT0YLvFyAumNriH4x4FNQR5Qf0oKdSgPnMnY\nhUWjFOaBMpjPV6LJmMBetRxARVoQS7Mq\/SBc7sOqFD\/U6qNwZbabtKcu2CZPwZS7zQmcJjAuzPMu\n4GgE30lomaHA6bQdsFVKMdehgmnIiJkhA5oM8aQO8oNCoVJKYEKW5rzMYNeBNMUUSFvTCmlNtAPY\nJhqw2CiDJeNJdkjO03tvtCcDOu7COi++F1+KfxZWvRcsp+Ix26NlsJnBChYNJVHsyY0Ci3NlZOQP\ngTw5gH260kXkDqBRG2FvTWecHWDxYjOso9VYMH6KOfWrGJPvgFm1AzOKV3A+7VVcTP49LIUfYrEu\nArOnE\/hVs8McUSQXOoF6dRhZuRCy\/wLJ7U4El\/swBdI7w1hfhRO2OHUa1slGWCZOYWH8BBbGGjA\/\nWo+50VpyOmvYATBfOA4T2Wc8zHAXrr9ZCXmcFwoJ0gGk6ZWnBEKrkLgOlJOLDH26rdCEYXqohsCa\nGMwyfpKHjVFY3TpYFTsAPwajMdmnhy5byIDFShEDluZHIO7wPiSTQq105ZA4gOxOYh8q1SS6TsrZ\nqlHYPIPVroMddx6Ae8FodNSlk+4hYDj67Gt\/VWX7LuHIZ8igpzhDeMulJw8HMDvel81t7PHbHtqM\nABjyw2EgK1tB6mSFmoYM5XlSFmU0cvkoVfGRnxbAYDnx3mzlaIGmOKMuEpmkIaTG+iAnJUCu1R7a\n8OBCTX6T9SGnv1kyfZ23v9A7XumTD\/Av9fbXevZi73i1J0HLCD0INOjcp8+VOGGOKNeGI\/GYF5eZ\nKLjnm8y\/AFEPI4kKD0JRAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/seed_pumpkin-1319484534.swf",
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
	"no_rube",
	"zilloween",
	"croppery_gardening_supplies",
	"herb_seed",
	"seed"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "lament"
};

log.info("seed_pumpkin.js LOADED");

// generated ok 2012-11-12 16:50:14 by martlume
