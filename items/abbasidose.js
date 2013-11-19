//#include include/takeable.js

var label = "Abbasidose";
var version = "1338857048";
var name_single = "Abbasidose";
var name_plural = "Abbasidose";
var article = "an";
var description = "A compound made out of red, green and blue elements.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 6;
var input_for = [169];
var parent_classes = ["abbasidose", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-20,"w":20,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJg0lEQVR42s1YC1BU5xW+qKlvee0D\ndoGFBVRkYUGeu2A3zWhs2hiSTjrtTKeh045Gm+oam4iKuj4j8loBqzzU9f1qDKmdpp2xyZ3G0cbW\n9PqIjopwERAEhcvLKJKZ03P+y667gJOASvvPnOHu7tn\/fP93Ht+\/cJzbSj+tMs75T5DllUuyzT7v\n682N0Go0m3VXTQn8xZRY66AO5k81tjn\/DoLXr4fAz+t08GaNDn50MVg0nwnUufvF\/01lfPGMRnj1\ncjDzebM6BF69HFT5tIepSzcJtekpcCHFKFUn6D33ivlInZHGa+CHQhD8VNTBr9vC4Be3Q+G1q8FA\nYJx++uO+3kl\/DRRmn9PCGzdC4K2WUPhlcyi8fi0EXvpC43Dfc09MqMVpFTNCM3Yb9DanCSkJHizV\nzTLZb5iT4XzKTLhimgkXU2NtHgANJ9QiMgj9GfzxpWCwnNbCjD+qbIpihSXykNKBAOGlf2rhtSvB\n8LNbOmbz8PkHZ7QQ5lAKEZsV\/JJ5IdIuQzgMZgdjI6F+lgnaEhK8d0WF6a6Zkqw1aSlwzDgNTsRN\nh5q0ZLiQahQ9AEYdVUPiJ4Hw\/dMamPtlEAP2yoUgZEULpr8Hgt6hBFWRAkJ3KyHuTwFAbM\/5l+xH\nNhuf0z7TQPh+lUgAN2WE8RgE+tv+mAj4IjmOWQWCPYqgCNzJ+Ch8nsqMmPzKFE8sZroA6vcqwfCh\nGogdCk5AZ\/1DA6mnAhmg8P1KBzEYVKYQph9Rwcw\/ByBw9Ptc9qNDxON7+JkrNRdSYu0U6Lo5iQU+\nhMwRQ8QeNYRcd6n8qQQD++x0kgHOJce4H+gxi4E7\/CvD9ylhxnE1GD8OYMHiTwZAzAk1TD2kAu1u\nHyP5KYv8rLpdSph2WMU+I\/Bk9EzvOf1oUaFTkOq0JOATYxljF1MT4GxSnESpJZ+zSbHWimi92L8M\nCPBxY6T0l\/gouUF98n106hJ\/SVehBAIaeUAFEftVELZHCdqdCrt7OSjsfoK2FNO9R\/Ylo2ftDk8\/\nWpdMMZaLyMat9FQGEptBwuBWBFHp9JEB6q1ler13uSFcKo\/WC9RI1Fieu+X4evvn+1aqivwhoMQf\n1EV+on+hf+aAeYB+U3J8rIoCf165TTafQp+MJ40PZ6optfXpqawEGIBovYOA7YoOd8UoM0TwFYYI\nGzeSy5nqa+YEiTrXjTmHO5P\/M4C0yqMjBAru\/h4CtKMJBJTS6wR4xDhN\/Cw+2jhi4EpjwjNKY6ZC\nqSGSAaQGYezhXwKGaZbICPCnSUagpkI1qXzuwCh9aHx5dLhYboigLqbhzctdOlVsSE9mLO2ODjMS\nQJqNV0yJrKFI7p4ruFOJMzI+mRkF\/e1k\/HQ2RmjckLyRL9VldVqKSADpM2qmy6lxcDn5OaaZNQay\ncAkDCanxwCcbmX2IA5tUg8YNASMW6ZLgnJNFcbHwpTkFsKHgibeaZ7UoAAEkRkqSTbAt3gh7UeqY\ntJlMUk6iia9ONyGz0Wwwn0+Jhc9T4uEcpvm6OXFk6pDGyw0MdjotHcoNkUyDv0ozi7bU2TzZsaQk\n1slO9aASOIuSx6TuedfhYEpCbDqbw32tTX05c2Pyi1BiNLA6pEvFx3HTBt4LnwuLmCqqKXclGWy9\n9fJiR+bcxZBlnpdBCkPdPSJz8Ko5Skcpq8VOdVeS\/mvOG7mWuT\/JA+7\/ec34VeWzAag\/Dt+5NsJO\ngPHb\/MdtatP5F3Vm+ha2gWbvQ8dTgdMc6LEFHXwEwYd7IeQI2rFvYGJx56Cbqkq7HJo9DyDoQA8E\nH+11hH4Enreet2uMY5bWChNWN8KUD+6C\/7Z2UJffB+3BR8JQSHAtn+Iui6K4A5TbO0H5h05Q7eyC\niVvuAbex1WMkjMtu1E3Z3CL45LaCn11i\/uqybgiouA8TCttdP8K4+Tes3MIqGL20Fsavug1TNrWA\nX6EE6tJu0OzrEYj9744uq8170romafKGZpi8sRkQAEy0NQGXdRu4D9qA2\/7Ada\/zWnSTH\/NeHQtK\nPuQ7GYOPXt0k+9LKf6DjrLU897sa4FY0wujf18G4FQ3y3jn3YNLWVhibKw1hWC+6mem1pBZGZTXA\nmFWN8EJ2I3C\/rQZuJf7dgkGL7wtcbpeF2WLRwS29BdyaOzAKbcwyfLbWstdcbgdwBR08l9suv0e2\nthm4re3ghUx6LRHlQ6+\/S75DlLu3b0ouxoq65c1XISs5EjEoYRCe2apGkaNAazBwQSdwy\/E779XL\nQe1dwFV8I9fi\/CqJW1bX9z7uR995vwE4WwuwA+x4YBkawAVVNu7dW\/IGhRhocytw2XfkzUp7HtfL\n\/CoL906NDJ4+23CXpZEdrORr4MofycwsuJnJAG3CffI65EMQm3Tg4vvDGDm\/qdGxwJRW5yaUtrz2\nAT+YMP0StwKZ2yLJIFezg0iMUWLZuVY2ZTIf2o98nNmp6LUPb87QqZfV25AVB7etm0dwEpfX6Tk+\ntnZmIhiBy7qTgSw7GKh1LSJX0G3kctAIYG67w8OfsrH5nsiYzGvnn934Z8G6HtcKAXAPzn5s4EzL\nafPu9z07M\/eV12FjbBPgZ6YkxJQTIHUdvc7xHLK+CDDocO\/AgicgW9sryV97oMfou+trflQ+AnQ\/\n8HBW4N6HvHZ\/D5CiqPc+hEAcql55CGxru+gC906NbuzyOvukDc0CG744qIMPPRqoODmSdWJem6Qo\n6WCDXLPvIWiO9A7\/p6dfQavDH9VBUdTOFEK1owvGbmiRi5zS69bxXthQY7PqgYa7E2TQwR7elQEm\ndaI0Pvs2G9C+ea3ynqVdMD63VRwyuHHZDZkT1jQydZi0\/g7b9HsIgMvuGydlfYFJJRZWiTSSvHBI\nj11eD5MIZEEbA6ksvy\/L3RIxg1t4k42XF9CHNHncygbwyuobPUPv4Co7R9MeAY2yNcOolThGlvQp\nBHUfqQmlmTpyQZU8dHEGeiEAvBTAmPfrwQtVCIPLQ309Mk8AnWr0rlNxmuX9hrwwJa4BjNLExgdJ\n2to+xSjFGqMCX1Znd8kgpZ6Ugg5Crzfi5SK\/s5J1bHaTgwGkIU774QGY6hB7wxrU8g1EYBOfAtEm\nJH3rSFk6BVeKF1R7IyDBJXVUAgRiwz359XbQuQ68AOXOCZAO7mSvrKdyuACtrrTmkyogQ+vuSlxx\nt7H\/7QeZkxC4fAiSO\/Lf+dCz+OkwK5psDCBJ6EYc1sUPnmLM0IaLRAuX1WhlKmHvxFq6N\/i\/33Ik\nI1OadS0Ck8MdvU8OTI21WRpwe\/kv0CZ4ukTXT6AAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/abbasidose-1334266960.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("abbasidose.js LOADED");

// generated ok 2012-06-04 17:44:08 by kristi
