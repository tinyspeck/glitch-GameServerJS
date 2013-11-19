//#include include/takeable.js

var label = "SWF";
var version = "1351542626";
var name_single = "SWF";
var name_plural = "SWF";
var article = "a";
var description = "One of the three vitally important widgets that go into making a game great. Without this one, the doodahs don't layer correctly, and the side-scrolling shizzle-facilitator gets all out of whack. And you don't want that.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["swf_3", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.wrangle = { // defined by swf_3
	"name"				: "wrangle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Wrangle all the imagination out of this buggy sucker!",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var context = {'class_id':this.class_tsid, 'verb':'wrangle'};
		var val = pc.stats_add_xp(25 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		self_msgs.push("Every last bit o' imagination has been drained out of that sucker! Optimization complete.");
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'wrangle', 'wrangled', failed, self_msgs, self_effects, they_effects);
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
	"sort_on"			: 51,
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
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
	return out;
}

var tags = [
	"no_rube",
	"collectible",
	"swf",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-34,"w":30,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHxUlEQVR42sXYW0xb9x0H8LxN09SR\nrtueVqV7aTuNlIepWrduTaZJ28Na5anbnkZfN6nb2zKpIU7acAsBh6svXGxzvzWEJAYbMAZMEgIh\nJIR7AiSEJkq4m4sDGH77\/v8+\/8Px4X8ITJp6pK8wPrL94fvz\/3+MDx3a50FEMci\/tra2\/FvhsH9r\nc9OM2yba3DzGcujbOoCKA8Sxvb29sL21RVss4TABSGGWjQ0Kr6\/TJksotLDxcs2\/EQo5cNsUXl09\ngZ\/H\/l+weKD8CBnCNhTYy5c8gCFrtLG2Ruurq8gKra+s0Mvl5UiWlvxrwcW60NKSKRQMxoeWF47R\n\/HzMQVBHEBNQkwK2LWDhzQiOwzZeAVuNwFYUWDBIoeASAYYs0triAq0tsMzT6vwcrc4hszN9K7Oz\n\/tW5GdPs9HS8FDj34gUtzeNB7EnxYhFYOAoWGWcEtslhIQ7bWNuBre8LJnCzBBgyw28P9fbSteoq\nvxT47MkT0ubp1BQ9f\/qU5mdmKMieGC8ukHvCloPA7cBCi4sqbE0CYz9npqepw+thOLpSWbk3kMFY\nvnn8mKYfPeJ5MjnJMzUxQdO4\/8WzZzSPJ2Zt8\/ECvA4sb21PGBunAsMfzv6Q0f5+ctdUc9zVqkqq\nr6yQA7UwgdPCWB6Pj9Ojhw95Jh884JkYG6Mp3P8NHjuHF10GkL1F2NuAtcvGzKCR1iIwNu75F8+p\no8mrwq5UVlB9RTldriiTA7UwFaeBqTgNjGV8dJQejozwPBge5hkbGqKH+DmF55h9\/pwW0WAIaLby\n2VtkYmw0qjUVV15Gl0pL5UDZOKNgojUNTMVpYCyjg4M0OjBAI8jw\/fs0jDEOsdy7R+zw1F3aBasr\nKwWuhGpLS4yB+xnnhAIr\/c8\/KeHtN8j05nd40t\/\/Kdk\/+ZAqTn5O3S1NNMJgyJCCGwRu8O5dDtwZ\nZzTu65JiqnU55cD9jnMcjXkL8jiqMS5GGt8nv4hqjeEGgBvo6+PAehms2EU1SLXT6ZACDzLOpN8e\npdrY16gBGKMIGGuN4e4Dd\/\/OHQ5UYWykAudyAuegKofDZAg0Gqd2EQx0d1HKW98ld9xhNY2\/+gn5\n\/nqcfH85Tt7fv8vvEzDWGsP1A9ePjXgZW1FUayqsiCqLCqnCUSgHGo1Tvzpby1xkfft7dBUIkR5H\nbtQ4e+trVRhrjeHuAXfv9m0OVMcJXJUWV1iA5MuB+12drWVOcv7sNboCmIjROEVrDHcXuLs9PRy4\nqzXAygvyqSzfjhgA99rTxgAr+MdnZP34Q0r8TSwH1gMmYjRO0ZrA9XV3UxAbOWutErgK4Mo1uFK7\njUpsNjlw3AAm9rTkP35Al997XRrLn35NhX\/\/G5Wf\/jd5nPm7YQruzq1bHKhvLQKzUjHislnkQDHO\nBwabbfIfPqA6YPZKdexhKnr3+xS4mBgNQ3qB6+3q4kAVhpQAx2DFVgu5LHlIrhyob21EciVo\/PPv\nyP3x+3QJmL3S8OkxFcZaE7jbN29yYFRrCsyZl0sOllwDoHacskuU2GybXAVUiJa+fu8Haho+PU51\nv3xT\/d2N36NgCq7nxg2axycadZzAOYGLwHKoKCebCrOz5UABi7pE6VYnWwRevMcKAKwFRESMs7vh\nKrWbE6kt41w0TMF1X79O0\/jUE9WaCsuiAiQ\/O1MO1Lc2qLtEidXJFkE+gDWAiRiNU4UpuFudnTSM\n1xHjLAKuEDgOy8oke+ZFys80y4FG1079Zutx2Mn+TgxVHX1DjdE4VZiC6woE+P1RrQGWD5j9opls\n5gzEAKj9xKHidJst2zoai2xkA7ASMBGjcYrWuhTczY4Ofp++NRtwVuAsGelkSU+XA2Xj1F6ixJ7W\nAKAVwArARBhONk4VpuButLejzc5drVk57ALlIbnpaXKgfpz9Bputu8BKFgDLARMxGqcKU3DX29pw\nLhCBaVrjsAtplJN2nrLTUuVA6SVKt9my95q7wALgYSo7+kM1RuMUrV1XcJ1+Pz+3M060BlguYBx3\nPpUyU1JOSIGycTKcfnVeAzAPwFLARFhrsnGK1joVXKC1lZ9TxylaAywrNQW4ZMpKSpJ\/XWJ07dSv\nzqv2XMoFsAQwEQbrkoxTtBZQcB0+Hz+nh2UBxnAXk5MowwjIcPpxMpx+dV6x5VLOO69TceyP1BiN\nU7TWoeDaW1r4OX1rDGZOSqSMxHMAnpUDjVrTr04BdAEmom2tU9Jau4Jra27m5\/QwM4Od+4rSkYyz\nBkCjzbZHtzrrrdmUDaATMBGjcYrWBM7f1MTP6VtjsAtffUlpX56l80ZA2Thle9plSxZlAlgEmIjR\nOAVM4Fq9Xpz37YJdACzt7BngWBLkwFddorR72qXPP6Pij35OhbE\/5pGOU9Naq4LzIfU1NZLWzlDq\nGROlmE5TUkKC8ZeeGHMcQPGIGY35X7U629zXyGvLMRynaI3jPB5qaWyky9XVu2CpgCk4c8rJkzEH\n+rb1ViAQd7O9PR5vfjPi1+5prxqngAlcc0MD1VVVquMUrSUnnJrcs7mDHsDFARQf8PlMGKUfWdC3\n5tO0JnAsNWVlO7DTCWjti4O39r8cPp\/vSKvHc8Lv9ZpaPB5\/S0PDghYmUmy3R8Z5+lRfSkJC3KFv\n8\/C53Uea3e4TzY2Npia324\/bCy78L5J86pRpP4\/\/LwtnmyBYWhUgAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-09\/swf_3-1316567434.swf",
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
	"collectible",
	"swf",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "wrangle"
};

log.info("swf_3.js LOADED");

// generated ok 2012-10-29 13:30:26 by mygrant
