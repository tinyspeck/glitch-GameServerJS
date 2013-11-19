//#include include/takeable.js

var label = "Your Papers";
var version = "1337965214";
var name_single = "Your Papers";
var name_plural = "Your Papers";
var article = "a";
var description = "Here is a full yet incomplete set of all the papers a person might require in order that they may prove, justify or otherwise provide evidence that their papers are in order.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 100;
var input_for = [];
var parent_classes = ["your_papers", "takeable"];
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

verbs.complete = { // defined by your_papers
	"name"				: "complete",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Fill these out and your papers will be \"in order\"",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.achievements_has('card_carrying_qualification')){
			return {state:'disabled', reason: "You need the Card-Carrying Qualification to use this."};
		}
		else if (pc.achievements_has('you_have_papers')){
			return {state:'disabled', reason: "You have already completed this."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.achievements_grant("you_have_papers");
		this.apiDelete();

		//var pre_msg = this.buildVerbMessage(msg.count, 'complete', 'completed', failed, self_msgs, self_effects, they_effects);
		//if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		// The above resulted in "You completed a Your Papers," which is terrible. We need capacity for nouns that are by default plural.
		pc.sendActivity("You completed Your Papers");

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([1, "Don't forget to \"complete\" Your Papers to finish your qualifications for riding public transit."]);
	return out;
}

var tags = [
	"bureaucracy",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-31,"y":-14,"w":65,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHsklEQVR42uWYbXBU1RnH+cAXPoAf\nxHGm0w5SRBwqRh1srRXaaWsdZ5jp1LGjsTjKUIWC0RAqENFgIiHTJG4MEPJCQrJ5Z5PsZsn7vmRf\nkmx2k929aRISaQJBXU1tqCmE2YB15u\/9n3B2bhasKMZkpnfmmd17c+6e3\/3\/n+c552bRov+3A\/Df\nhrBiwrRSzO8LD5Bg0wpEhJVJXAn+fsHBfXDOj08\/DkADmjXvamqVu\/xZEGeG\/Rg948fVS0EJqeBq\nMGZe4b64HMTQaT8++zQgvn\/yYUCcXxjXqDmtHJi\/nLumHqHOjc6od3Fi5py2E\/p7VZNqaOFkhP8T\nFPZKNQnKc0bU2ANzCfcCJyEA841Q2smpFoEGB\/zCal6L5KM25kJNtg45IcEIKNWKBgidDwhIfmqv\n895ZtotUCa64Zbg+X\/U97G+yIDiJtFCrljZYJMzN6Fzlg\/GeWS2JafNNWpJYGa4or4nVQe1n6qWn\n21sKnNJeTiDbCWHlebTl0XASmPB8UMJGHGCDvxlQ5sbnlwJjf+\/ugq3BCrOhDH0+88iGXzyYfES3\nt0JbtQxCUUFC3kAZaFsR\/y4rndc4Vv6Opi0V\/0+4S\/\/yT3ZZ3Tjd60GnxY7jOUfRbGzCsOIOl504\naIzb8eyR6UlfmGDyx6mChP4qyzlG\/l3mJ0EZMmc5rtdjwFdW6OR4Lwg30ONEo+ko3PZSnB3sgr3R\nKkCpak+HoZ9q+jrKfFRBWkwonnMyTRFE1GNv1I6PBpXpUVKYoVwPp+bZxEc9cLe68c+xHuQeTcJf\ntj+HhPgtuPCxEyP9HqFizns68QChf3SFk5O2F1LN8TFbSDZm5lQ0nFZdWVwcL4uFIe87VZeH1ffG\nbNOoFlxx9WLA8b7iERMT0uMqgy5jrwBk6ItSxWQE5xizoQYlBcdFCijeGqEmrb844Q1zYq2tzDGp\nkraRyzxl3knF83IO4d61D9arWDEzq4GqGvMt0NEprJuenLmJ1ko4RmrKa5EJe93tsDkLRPGkH0qG\n+aQR54c6w1SSoFRTjiUsoWR+EY5KSotlgXFs0lu7cd+6h7tVuCfUWLzo84sBhWrQ0tGB7llPLdWj\nvYSTgJ+c8+CUwYgjea+L+2h5Vkaa+OQDVpRktqg\/Hm+uyWoZ\/8D1b9nICUqlJBQtp4JyCSTc\/Q88\ncnbJkiXPqPffGbGWdtaUVwsVzg25cWbALIJAUr39idvR12PA5Qs9auHYUHpch+qaNGSnvonGonxY\nq6ojuWkoLYXP1RR65o+\/SydoUuL2Ql93W0gWkLbKZUuJgvvhrMJwtmaPnR\/2inxicBIJRhWZex+O\ntqn5EcCI0gxbfQ727N6KjH1bURX\/B1Ts2YyCLY9B\/+IjKNv1NEpTEoT1SrczfPxYMnMpnqEv1rWw\n9zGk5cy5Cn2WhHsqopy239VXp6C1Pl212CVUpF0EfTXuRQHGJ5ye7FXtc2FUqVUVrITXUoSibb9F\nRW4Weix1sJv1cBsrYTr0V1TsfFLA1uzfio5mCxwtdSOPPfrAQUJS1ZHT1pBUjtWqgVt2w77XacuZ\n9DrzkZ+9U4W0oqnWhMpivbA92G0Syp0ddGDIb4GrqRB97jJY8\/ehcE8s0hJfFjDt5Zno9zSgKVcn\n7G4pPCYAy176lTj32O1XTuSmW9XpEgjKas\/WJYW+Fo6VYmnMraKCfV69gBzsNcLd1iKUtJib4HN0\noKPNBaWrDV6HERZjDlL\/\/CTMf9sJr9OEjF2x6DpVBOuxN+AsTRdQdck7Yc58Cyf3PCdgWUwsxj6f\nKbTq7rUtq9esc94MHI+VP1qx+h0maU15soDU5++Gv7NE9DdaTrs5gb+9AsW576CyJAuGnDdQ\/vJG\nmFO2wJz3tlDP73agrbRY2ExIqslPe119BPC\/U0Gsi\/lp\/6q7f1JwrZUs+7oNCwc8cccdP4iLjX12\nqtmUBWfrYRHMTRYP7a48cURVbiaGvEbkHT4AXeouGPb\/CSXbfi1splpUjZAN2akiqKSEY7cYGawf\nVOfbdLNw8liixgaW+IaNvzlbXJAi4IaVaqHm+WE3rKca4WwogKsxD4qzFN72k2ioKxIW11YUw15d\nJRSTtlI5Fgvzj6vT1IQH42OtOPre21Pfdi+6WCwt6tOtvW+99c3EuFmQowNNaj4akZGagIZqHYY8\nVehxOWBpKFP7X51Q6UbBZXFsuF50CZPhMO6P+Zn9VjfNKwl514\/XZD2\/ORblhYkCkhMwL30OGw5n\nHlQnrxUAiseOfp9dFJEWTFrKe5kuVWrx0J3ly5ev+S5eO+6Uebnxl49PvZsWJyZhARGUWzBuuVg8\nXPKCXe3qftE1C25qwg+2Lt5XcCwZdGXp0qWPfpfvRstkXrLqDqXE46R+v7CL1rOpi+JRw93WFoHj\nhkPCcZyE42\/Nxdsl83I9Lef2Z+\/rrwjLZU69r6iF02wTDZ1w3CiwGGQHiIJbPJfv6PcQkv2Sraiy\n5IBQiNFpyxOtKDTiw+S4Q1wj\/Lvp+yTcN2ont3LcLvOSyV5blSlApOWsdGnrtpc2yw3npusW\/zk+\naNPPmZdUpyg\/LdKKJCjTgB3gGtzK+fpv21rZihLid0CuPlFwMYvm+Yi0Ii76D63fsKDgZi2R16A2\nLTS466p8ocLN6fEl\/cnSKWCzzBkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/your_papers-1334192333.swf",
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
	"bureaucracy",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "complete",
	"g"	: "give"
};

log.info("your_papers.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
