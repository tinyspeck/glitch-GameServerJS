//#include include/takeable.js

var label = "Ancestral Paperweight";
var version = "1339199236";
var name_single = "Ancestral Paperweight";
var name_plural = "Ancestral Paperweight";
var article = "an";
var description = "An ancient decorative weight of uncanny beauty and density, this relic is used by the Juju Bandits to secure the bounty of their traditional paper hunts.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["juju_paperweight", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.celebrate = { // defined by juju_paperweight
	"name"				: "celebrate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Celebrate the peerless craftsmanship of this relic",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.celebrated) {
			return {state: 'disabled', reason: "On second thought, maybe you should just get this back to the Jujus."};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("In the middle of the celebrations, you break down.");

		var val = pc.metabolics_lose_mood(2);
		if (val) {
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}

		this.celebrated = true;

		var pre_msg = this.buildVerbMessage(msg.count, 'celebrate', 'celebrated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

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

function canDrop(){ // defined by juju_paperweight
	return false;
}

function canGive(){ // defined by juju_paperweight
	return false;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_vendor",
	"no_donate",
	"quest-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-42,"w":38,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIaUlEQVR42s2Ye1dT6RXG\/QZ+BD4C\nS1cZOzAWbbmEiySAeAVRkCSIGgUxKGoUQfEayAUIF4NAIEFj8FJq64ynts4aZ5w2\/+kwXU4+Qj7C\n2\/f3Zl4aMq6pJC7brLVXTk7O5TnPfvaz93s2bPiEn0AgsDEcCpn\/\/sJwDV4ZiC0shIKLi4sbN\/w\/\nfJaWYsHbt24Kv88rZmfuiuCdKTE64hfzobn4\/xSkx+PJjz2IJgevXhET4wHhGR5SINkOL8wroNPT\nQQN2P9pNfT5fnnd42DHQ329cGegXRP\/lPnHzxvWk3+sJpt\/sbE+P66Lrwiowgu2+SxfF8JBbsbgw\nHxJjo\/5EOBzOzxnc3MyM+8b1a2Kg\/7Lo6jypgF0bvCoWI+H\/gPB6Y+nndHV15Tm7ux2uC+eTnHfC\ncVydQ3A858Lk+NhoMhKJNGcF7N27dxtXfnhjLP\/xiZi5O60u7L59S5zrPSu3PeLO1KTYUV0lLvdd\nkmyMCFjOvEZvb6+59+wZdYzj+DEBsz6vR2kSkLdu3lDnZgVyZeVN7M9PlwUBuL17dovt24rVzdDX\neGBM1OyoFhZzjQI7MT4WzLzGyIinmHOH3LeF3WYVztPdQrIqAmOjYm52RgFFLjZrW3LdAL9++TfJ\n3mN1IW7SbreJstIS0Xa4Vd0QNk91dYqiws\/F1SsDKjJZ9PmGzZxLajkPBonz53rRL6wmd+2qzy7F\nkXDYMJ5\/qbTi9QyrJ62sMKngyWFSM0PaYIaCed+1AHjyhEMcP3ZUsc\/DSV3Gd++uzb5IAPj40ZLS\nH9XHRRv375OFckJpp\/PkCXGmx6nYIAAL0F+y6MsDFOm11NQ4blwfTJ7uPhVvaGjIzWYikQU3QibF\n3FhXYMeRdvH5b7eoYmEfGvys4DeqYADqGRoKpncSr8cTg\/2DzQdEZWVlHhX+UbxvMRx2aICwR1jb\nDitw6K68rFTsrK8T24p\/p35v+axAAYXdwy0tLvxw8OpAAps5drRDVFdVGNmDka3nXiTiCoXmjNm7\n08Z08E4S54cxbAC\/oyBKS\/6wqsPMoICocsRPQSEHWNu3d4+oqqxIlJWVZac3rMDn9Sbpm5iw1IcS\nNJoh+A3QHufpNYAAnTJrtyoirGMxsqB02d5uT1RUVBTrKCkpyU5v44FAbGpyQlkE2rLZbGuekptK\nNld7qfv2TQVsbjZVxRfOn1PRfaoLL1NWQlUT7W1txTlpLBqN5mEh3Jw++T6ANHcAoitAwDAVSTE0\nH2gSTY37ZXFUq9QTZaWlKtiur68L5lal4XCCFOkJAx\/raG1dU2FYDF1Ct6p2u12YyssVgFqLWXWX\n\/fv2il0NO1VXqa6qXJXA5s2bXTkBpFUBgMmCNKMdu9W65qJMHvgb+gPM77dvVzevq7WoCiYAR7Bv\n+7Zt8rsW60lu2rQpNzuR2kkypWAfpPnsmR5htVrXiJkpBX3CWoWJSLGD9zXsrBd7du9SDPLNb44j\nxUggJCfpnAA6nZ35sivEzjhPxwF3pN0Wf1+F430w19pySFmHqbxMgdUs1tfVyqgj7cktWwrchYWF\n5gNNjWLU70t8kglZtid3VWVlHC3S3ooKC8XWL4ow6MTWrV8YW4uK3AUFBY70lFrMZgNpSH8t\/iQg\nV1beNt9bjAhn96kP6gayWOK0wbnZWeOTAHz97asY1d7j7E78a+Wt6+nyckwWWAILujsdTE4Hg8bU\n1KTh83kNadKGZFz5I5Y04vfHPur6I\/3z009v8r55+bJZDqNJqp4OQ2FF798TS7EH4uFSTHWT0Nys\naoloubqqSnUgBgTaHtKYD83GPiowRiQ5SRt\/NZ6Lf\/7jtXgQvacAXLroUgMDfRlwX335TDz907L6\nfvRwSbLlU4WEJR1ptytv5YHY39d3KZ7pEll2mHD+ixdGkqH0u2+\/ET+uvBVyulYdBUZgh8GAKqYV\nwuSTx49Wg\/Ng+nBrizh08KCgogFMyCFVrgK9jpzeBHz\/+lVSrmvF5MS4MnFuSHqpStKWGv1LFVMA\nfBC9r1KsA3On6zx5\/FA1ALV6k+frJagKv9eVZWqHzc\/+8lQNBkw3eqmI2OnFauiURo33UQSyQFRw\nPGA5FpYBQVqff\/VMUP08BMfxgKxJjh\/tiGcFcHIiYETvLwqWmkwtXIxhMzXf7Zdpa1UtETYBAVsA\nS49fsPXzoolrkGYeEPbXPe3QNUgrVUla0dzr716pYtBgAcbsp8csQrOcGZwzH5pTa+ijHUfWzJJk\nwG5rW59Hjvr9QTQHQFggRWwT9GsmGjQmLUdpi0AGFA37qNalWFQxrF+NwFjLoYMq5FS9CpBJiJkx\nc3r6VVtBzBoQ4DSb+hUHM6F+L8P\/pJf0MUyw6uO1iB58YZbjAA84wKBfc82OVZBUud3a9mEzI+tZ\nDZBvUonvkWpGMoR\/\/dqgSjuB+aZrjYUVEgCoTj0AGdP0hE1gORogOvwgFvv7+\/OkrtQiCUDoB+1Q\ndaQWcNyM\/zWjgITFdIAcw\/F8M6GzrdOcDlIDZDHFb5ut7dd98dbgYD4rflgjjbCggdB\/+c1NU4ui\n1H7Sr8GRagDq9kagR\/02gjlRpfNngOgvXYs1NVX\/\/dVHV1dnjD6KFcBYqhhSy07aG8WggcByOntI\ngXSTTpgDFA\/Kf2zr5SdMphcKIQfgxAd3kDqLJQbtANUvg2CF6s30tczgzQNWgplrBiks\/UaB66YX\nSCrKk+teK\/OmSU7JCZ4Wr8Kk6SLokpvCTGawn4cABBnQaaZQ6MnanNOBVZpMQV6DZN2TTSZTs6Tf\nqLVYkqSICQYbgVFSCct6YU+gMyo0vRg4h306rWZzTbyivNyRE7D3fVbfEHBxk8nV0FAf3Flfa8hp\nJqFZAYSeWJoaGw3iQFNTkON52PUMrP8GLk162fIrZUUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-02\/juju_paperweight-1329869612.swf",
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
	"no_trade",
	"no_auction",
	"no_vendor",
	"no_donate",
	"quest-item"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "celebrate",
	"g"	: "give"
};

log.info("juju_paperweight.js LOADED");

// generated ok 2012-06-08 16:47:16 by martlume
