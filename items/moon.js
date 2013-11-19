//#include include/takeable.js

var label = "Moon";
var version = "1347677145";
var name_single = "Moon";
var name_plural = "Moons";
var article = "a";
var description = "One full, craterous moon, without which mooning cannot happen. Most useful if attached to an <a href=\"\/items\/460\/\" glitch=\"item|emotional_bear\">Emotional Bear<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 99;
var input_for = [];
var parent_classes = ["moon", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.use = { // defined by moon
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Click on your Emo Bear to upgrade it!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.items_has('emotional_bear', 1)){
			var bears = pc.get_stacks_by_class('emotional_bear');
			for (var i in bears){
				var bear = bears[i];
				if (!bear.hasUpgrade('moon')){
					return {state:'enabled'};
				}
			}

			return {state:'disabled', reason: "You don't have a Bear that needs a moon."};
		}
		else{
			return {state:'disabled', reason: "You need an Emotional Bear."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity('Click on your Emo Bear to upgrade it!');
		return false;
	}
};

verbs.emote_moon = { // defined by moon
	"name"				: "moon",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: true,
	"sort_on"			: 50,
	"tooltip"			: "Moon someone",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);

		//
		// change stats
		//

		pc.metabolics_lose_energy(10);
		target.metabolics_add_mood(10);

		pc.achievements_increment('players_mooned', target.tsid);
		pc.counters_increment('players_mooned', target.tsid);

		if (pc.getQuestStatus('rising_moon') == 'todo'){
			if (pc.counters_get_label_count('players_mooned', target.tsid) == 1){
				pc.quests_inc_counter('players_mooned', 1);
			}
		}

		//
		// send message to target player
		//

		target.announce_window_overlay({
			item_class: this.class_tsid,
			duration: 3000,
			size: "50%",
			msg: pc.label+' mooned you! Mood +10'
		});

		pc.sendActivity("You mooned "+target.label+". Energy -10");

		return true;
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"moon",
	"emoteitem",
	"tool",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-32,"w":33,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOQklEQVR42r1Y6VeUd5rlP\/BPyB8w\nH5xzZj7NzDn5NGfmdM\/E7qSTNjGGLC4RF2SRuEEhm6IiAorghkuMS7RREh2XjCRKRGUpKLaCgiqg\n9r0oKIqCgjv3ed4yOTOZ7pNJd4\/n\/M5bVQh13\/vc5z73ebOyfuG\/yMShVbOOw68nbAdNCVulKeGo\nM81O8PVEjSkxdco0a6vm+xqTf6B4ddb\/5795x9HchP24IzndhIT9KOanGrHgvoz5yRNITBzD3MQR\nzNmqQXCYGS3HnL0WBIuY9WBLZHjfa381YAuOY2uS02fMycl6JO01SDqOIznZgHnHMYI7ziuPvj9O\ngIcJtobXQwpyZuxgBvBBRKwV7dGRA9l\/MWDO3vrXyU57cuoEAR3FwlS9npT7HK91WArcwsJ0M183\nE1wtFlwXyOJBMtuE2cED8D0vhK8jF96nWzH5n5sQH60EASI8XOr4sxgFNRa1HG1NjtZhYawaKVcj\nlggq5SQ4V5OCS7lOEVzm\/eQxfnYKyvD0KTJ4GEnbEUT7yuD5bjPc7Rt5\/RS+zp3w9exG1FqGUH8R\nQkMlayI3\/m7VyJV\/Mv1scCl70+pFxxmk7eeQHBHWTmLJxeNuRtrbotclNwE7TypwBe85T7An9czb\nD7HcdVruhclGeJ7lI9iZB\/\/zfLi+24rp77YhOlSCoTvrYL3+L609p\/+h5fGRv13z88CN1q9ODB2M\nLtrPIGFjmSylBHMaaQJYDt0kwHNYCbUaAN2n9POUq4HMHldGU65mLX+S2lxwtVCHFdTfMXheFKLv\n9joMfLUO3p4SxFjmQN8uzFivY9HzoH0l1N2+MmNp\/9NljXSvmrVUOuatxxHrP4S5gQOYGztKICex\n7DtPMKex7D1rHP8V47187pWfSflrCfDkDzJIUquiy4Q0EjXK7mdHHyI4Exunilqsgs9yHZiz8mbu\nIWa7GAUiq\/4owFh3cXvcUkVxVyPwohihXpMytuw9gxVfiwJbCVziuYwVP5kkuBUff+67iGUPQQeu\nGhLwtGDB2ZjRaQuBUpP2Y2o\/8yy5gBz\/ZjPCAw1A8AV\/vwPR0RY4v\/0Izgdvmp7W\/f1P9RgdPJod\n669U5sLmcrifFWipVvwC5vwPB4GLPBcIUs5FAyCBp72n9EbkhlKuTONQj0m1ofrMOckOP6oAfd17\nMHFnLeJDLWT5Dvx9JQS8F+Ehk3n41ps\/7e7YYFmtm6x5OgoQ6C3Wu1aG\/AYYhK8Boc8JjiD9LXx9\nOfOeJ3SNLAjIZl7PsaEaKIszWmphMelgw5DBBMGJP6pxj5xCZOA8xu9+gMn27YgMFiPYV8jvZjNZ\n9tT+D0tpXrXgPBddFE0FbiDNL0h7TxOYfPkXBpAwr+ErfE2w0Rt8fYlyuZEB2cIbycjAdwFpHun6\nRTbRwqQYep1h5pwqAjIyXMZGqYO3txQhyz44u\/Yg2L8L4cH9CtJnzo96hgt+ZDE11WBKOcVGyILo\nSbSWKS1Clwy2Ild5\/gDE2gjwtgEu+gogy+4\/q+UW1pf9l5AWK6IuF6YIUEyeVhUbO4bx22\/A8b2J\nRs1xSH+dGSiH91keAi+LWGITS78dQctulrzoRxbpWQ4pheFxjQRIXXkoYDaDljZyTV8vTdDnRiox\n27sH6clmjrxG42fhqxmglw0duuuVRSlx2nclA1IapYaTJRe2r9fqCJy31yFqpqye5mDi6\/cw8R8f\nIGzZj0D\/Z2QxL5ox5frVC\/ZqLYf42rK3RfUkbIDCN0p7A6lRzlbzHsz1FmJhuAKpYY6r7v1YIdta\nemGbZV72NdMn\/0DbadIblgmz5L3MMkt5jytIv0XGXQUbpBiRnr2YvP8+Jh99xFG4AWN317NRSsji\nZ3C9yF\/NdFKXm+Idptxy5+Jrl7QxIEe1xxO8hlhXAWa7CzHXtw\/zlhKCLKcNVfCmLmW0eUn1uhK6\niuXgVSxKcBijl46fYDdTi64z7NY6tRvpYkk5c2Qw9HwnXN9uhOPBetgffICxtt\/Dy+8JDuyB35xv\nyqIVtArARXcTNXPG8DSWCYHMlxJg2tmE6MsCzFlMiD3fTib3ItG3F1NPdhkMhi5qoyD8pbIPMhil\njYT55YEnW6izMjXtJKOZMDgzVkb9VTGClSHevxe2+x\/B3bGVPrgJo7d\/h7FvNlGjJXC\/2NyalZg8\nYU7RVKXEaS87UAxXvsR\/0SgbGQHfy1SJU3sCMt6zS4XtelGRaZ7rqtUVaZTQdSxRbxGCC36\/DaFO\niv7ZTsSHq9QLJS8Kg3JmyHB0cB9v4ACc7Ztgu7sOjocbMXTvQ4T4ude805yVnOIcdZ2GgBSDTWfG\nmOGBBBr5Ukud5nTwPt3BkuQjwRg11JZNRjKWI0yLcdMf5fdS4zWcmkwqz3YgQGZ8bIKYpUzzYkKs\nhob9CqDM5Bhz4nTHNgx\/\/SH6297DZEcO\/L0FLHEhsubtR4wBL6mEXScma4y2swZ7HG3gWDPKfUWt\nKEXdpZj7lLmMYevo87eoUaf5f2Lm\/fC1fwI\/v8zHLBh4uVc1ODdWaaRuBogZaznLXI7ICKeIhZJg\n0wT7C7WL\/QwSBkDSvuA8TSE3GqlETfqsGq4B9IwBVOxGOzpj2Aruip4V9cELKg31QE8zS3qQ4t8G\n93c5cDzaAEfHLnbxkcwkqSK4MoPB0QpOERo0s+Ero5YOFpDerq3CIPcK+2EjJTMupX30OzK5HLhm\nGLYGAgHabPiiMBm9Y4w86k0\/z4CTdKP2wr8h3hdj2PV2F5ONKjImqaZe1wHp4OjQfgLbjVl2cnhg\nN2bIaGSkDP6ePE6X3WrWHgE4Z6+JJglS3H5B9Djdgri1DkFzKZNxs7KxEqB9+C4YgcGXKT8\/k06X\nibPsPa1sG\/nwLK9NkMkkNy3+J39bwquMOSMsGFNkVhI3NRglsNhAMcPsFhr5ToT6ijQres250ayE\n\/WR7YrxSE3Dceojphxpg9wU689lZm\/nHhZXGTLnPZ8aZTJpTGg6MjEjd0aKWNBNyIvm\/0JuVFcBY\npk4Q0AE2R4MuT6I77WCWOUJTjg+VwfVkB6xf\/x6WG\/+Ooda32SQ74enZ2Z41Z6upTeof4nporYan\nfQMC7D7Pt59yDO2H\/fFWfmmTxigJpssaryRIXFOmBFhaphB\/JmYvjpCcrOHrC+xYSsd1nmVliW3c\n7MYqCKxSw+rMqPhgBZuD+0nvPvRfW4O+L36N4TtvYbiNqZsz2dO1vTZrbrwuO6FRqJqTYTfc33yi\nS06wM5dGWwD3k61cbI5o+V5FfwFq7Ciyi5zWHUVtytlgyITgjJXU2EsSjgbV3gwbYpZX0V+M212Y\nzRBlQPB05JO5N9BP9gZu\/QZDt99hBxcQ5NZsfUIgu4OA9DGourh9OR99gmmOHR+Z9HcWws6JIezI\ntFkkmEXO1nTgJlKesxoGNEFTa8ZIO8ddppzOcNbIf2yIGWsp2TuktiLXWc5kYU+619\/FUcclStjr\nuvDP6L3yrxihUbs6N9JLPzPiPzXRLgBDnLOubzdj+tHHcD3eALeMnrufYORBjtqQJOQUZ2q0r9SQ\nAZn2dvDasR1J1VyjkZx5lbIm2KHaFFzc50R7I6WqPwEnjRGRwDGwj2X9HTe8tRj66l2Yb74Nx5NN\ncL3c\/uMCFR+vzo6Pyt1VwsvmcNxfbySMB9kYbVuL4fs5RqZjI3lZDo1GPHYex30OeKZi15NtmlZk\nWiRlD3E0c+\/dr3qbpf\/JoqSex\/JGCVCsJETPE2sJMep7mZSmO7mSfp\/D0nLR7877708fZmwHzXEZ\n4KNHtKMcDz6E\/R731q\/WY+LJbo3sC\/YGTNx7HxO8ARnqNt7xBP+Pg3Jw8nfGH23SzS1pq+Huux32\n+9kMoLsyhlyuuouSQWFPrsJeiEemhjSFn2bNBAOPOdf8k52E4n09PlqmM5IBgno5DB+juOvFXhqr\nrI\/1cD\/NI6PvYIyB0wC4FiO33sTE3feM8\/BjOF\/swcxQJW\/sXVhvv8Wb3UqA1QRlIlvCYpVeBZxM\nDcl+PnMRZhjfrKyas5MMvtzy+v+6dsatla2yZAvIpPtzHUmvdCQjKsTNa4TA7A\/XY+DqvxEsfUus\n4dZbeiYefAzb4y2I245jpPUtOB5\/BBtTsmguxBkbI5Nh5rxgXz5HGVnr2sbxZkLw+Q44n21B3803\nMPnk49Y\/+cwvYj3gMJ5EVWig1CttQuwhyG1PAMqx3nkbgzfWwEpG5f0QAY62vY2BtvXc1orhaM+h\nXazF1LNCY1JYKwmywCirjLK+Ap29MjEGWt9BN7t3+P77jh8694\/94+hbPWOVSF6itmAYaimv3Jm5\nj1jb3oXt3nsYvPlbvZo\/\/xVGOQHkyCSwfZNDfVXrCJulLJQxaisyWGKkFQ0DuxWcr1eYLGLXfspF\nKgeugfyf97AzPlqVHR0yqXakPHHmO2FVQIf7SzFw802CeYes\/Rb9LHH\/lV9j4EtjEphvrYOb60GE\ngTNs2YsY5650qXRrINMEwqCvZ6cC9fLq4y7s6tz0f3tmKI9uo8OlURH3DwOdbEr3BbiJWdvep\/v\/\nhqB+peNpiJobf7gJg3c3MK6X64wNMjJpM3BihHSV3KUTQqNUT64yKIHA\/HDbP\/6y59DDFa+FLPvb\nw4N71PXDliLVUsxaRYHn0VY2YuRuts7OkXsfYPjRp\/xCI9MJY77uHWwMg0E\/WdJ1kldv9zZ4uul5\nXQVdfffz\/ubPfsrKBSaXGoqSUX1EIezINUpd+rhAebtlRczTEmroJGPBfiPTyWdBpmVhTxdypmRn\nV96SvTN\/31\/0GbU8ro0OFtcGzAVRETuvWr6AOV+ZCanwSwxvoyRC1J+AkjIaDFJr5sKor6+o1tO7\n9bW\/6pN+D8GyM038UkdAmSlS0YeEKQIXUMoef8ZM56DfmX4pqP8C9GfQBI0nS9cAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/moon-1334277035.swf",
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
itemDef.hasConditionalEmoteVerbs = 1;
itemDef.tags = [
	"moon",
	"emoteitem",
	"tool",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"o"	: "moon",
	"u"	: "use"
};

log.info("moon.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
