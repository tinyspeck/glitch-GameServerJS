//#include include/drink.js, include/takeable.js

var label = "Hooch";
var version = "1354594147";
var name_single = "Hooch";
var name_plural = "Hooches";
var article = "a";
var description = "One jug of premium high-octane hooch.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 15;
var input_for = [62,63,64,65,66,67,68,69,70,71,228,229,230,231,232,233,234,298,314,315,316,317,318];
var parent_classes = ["hooch", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "5",	// defined by drink (overridden by hooch)
	"drink_energy"	: "0",	// defined by drink
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by hooch
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood. Grants 'Smashed' and 'Hungover'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_drink_drink(pc, msg)){
			pc.buffs_apply("buff_smashed");
			return true;
		}

		return false;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function onAuctionSold(pc, buyer){ // defined by hooch
	pc.quests_inc_counter('bootleg_hooch', this.count);
}

function onGive(pc, msg){ // defined by hooch
	pc.quests_inc_counter('bootleg_hooch', msg.count);
}

function onMail(pc, sender){ // defined by hooch
	if (sender) {
		sender.quests_inc_counter('bootleg_hooch', this.count);
	}
}

function onSell(pc, msg){ // defined by hooch
	pc.quests_inc_counter('bootleg_hooch', msg.count);
}

function onTrade(pc, target){ // defined by hooch
	log.info(pc+" trading "+this.count+" hooch to "+target);
	pc.quests_inc_counter('bootleg_hooch', this.count);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this using <a href=\"\/items\/979\/\" glitch=\"item|still\">Still<\/a>."]);
	if (pc && (!pc.skills_has("distilling_1"))) out.push([1, "You need to learn <a href=\"\/skills\/123\/\" glitch=\"skill|distilling_1\">Distilling<\/a> to use a <a href=\"\/items\/979\/\" glitch=\"item|still\">Still<\/a>."]);

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Smashed buff (lose energy, gain mood every minute)."]);
	return out;
}

var tags = [
	"drink",
	"alcohol"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-39,"w":23,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJYklEQVR42s3YeVBTSR4HcP\/fXV0E\nk7wcHDLCDChEQBQhkJBTbiSAgARCCAgEUAxyyCU3CgKCKB4Iyi2COjIqIngtGgRUXBXUUVZn9EVk\nwvgURZ3q7ReE1XH3j60K6qv6VipHVT759a873W\/OHA1dpwuYQWeLWN2XytndfXs53XfquAeetDvp\nzflWrvtNgu5\/HuSC3j0ccGU3G5wrdQRHsld+G8DmBM68jm387tuHeOBmDQ9cKHMEJ3KZKvz1b6aC\nca4moEhqBbZLLUF+sCXI9LcCkfxF4JsBhnMXgnq5DSgWLwE5fj+A5NVGQMLS\/7LAgOXz54pZVIeP\nI3FE1H0mW7UItCQzvh5QzNR12eS28FH66oWjGwUIGsshqCNjE0fDWNRTXxUYxtGat0GgN57rZzS6\ngUtA5XwiGv8hG3nEKejXBEqZtM25a4yeyyEmhkO5GMOjydfDxPIoWRv55KtyPulZGNsA7Ailg2yI\nS\/EyApE8AyBh6rd9mQnAogxuDTAajRcg98X2ZNonQw+fy1dRhqM4tBfrnQxfrmPrvghj6f4exqKN\nixlUhy8CjHAkj2V56SvlfGrZf5s4UY7U9jKxyc2qCPqtVBekN4FHUGzi6Chi2YSL4UyqYNaBkWzy\nWLIzCZULKEnTKDh8gmg2JVnOJfdkupF7S9cuupbjQb2aIiAqNvOJiiQ+QYFD49gLBmRMJC+cSRH+\nufoau2Rs5Hy6OwVOCGpemIOuN47KcCYqslzJvSX+3w3slZoMFq9Z2J\/nQbua4UxSpMP3UlZNQaer\nGeeorYhiag+E2xNT8B+oUWAMm1Sd5k5GY7i0R0kCZABHZLqQFNmuiCLHbSr5ntTe0gDD\/hI\/w\/5c\nWFH8M6kfIeVsHcUGiIxhzVdI7ZF2zU4SR2rCJj5JGc9D3qU7kW4XCPX79kda362UWt4vFZne3+ql\nf6PAk6oo8KAo8mBwMI7\/GJnqAocfBkdG289XhNojYRoDhjjorYrmkLE0J+LbLHfaeHOy4GH9Jvbj\nqmjbxxWh9MeF\/saP8zypw4VCqmLb6iloLo6EVcaR+HDjPVkuMRtMd9ftj3aYrwhnEDo1WsVYLuVu\nBgTWxzPftaa7PmvfInjamsh8Wh9r\/bReZq5siPhhtCXK+MHRGOOhI1HGQy2RRkPNEUZDewL1Bsv8\naNeLfWjXi\/wMb+wIMbuJ92MkQ7sv2IHG0BhQzqP8Wh9t\/u72oeD3w9UBb+7sE2KDO12wa9s5WF8+\nA7uyxQrrSaO\/6M9aivbBXM1civZm0FFFOh29AtOTZo72pC9FrxWznx\/daD4CR2NA6oDEaQQXxNI1\nTXNC+s5kc1\/da5C8vXtw7UsceLPCBbtezMH6C+wxReYyrCedjg1kWSjVyGlgxhTwMgReSjVHrxbY\nj17IXKHMcicOSu2JuzWzUbDXW1nkRb7elc0c663wV\/XsWK3qKXZVXcznqrq3MFRdactVnUl01cmN\npqpziUsen0tcPNKVsHikM9505MR640dt0cYjrTKjkaYIw0ctG5Y8aV5vqiz1RR6EMQiHNAK82yhJ\nOZfHenJpK++3vko\/rGeHB3a+gId1ZjlgPyVbY8fk5liLzAhrCNfHDq8zGGuJMEAPwzSF66ONMA1h\n+mi9VA+tDdVDG2VGz5pjTUYbZN+P1cbb\/qIRIFAkpv9xOQG8vSQHz9oj3\/3cGDw5fMh\/8tou99cX\nt7InurIYEz\/KzV5CENYCgW0Qd2SdAdoMca0xxs+OyZeMHYs3V51ItcFO57DedG7lv+8oWAVO5vKB\nxoGvz8cBrGs9GD8TA8ZORQFlewR4cjwcPGoLBQ9bQsD9pmAwVCcCtw4GgMEDfmBgny+4WikEVypW\ng0tlHqAplQ26ipwBDiwMXTY7wMuVfqAtx\/Uz4K3aQKCo9AHViWxQFG7zCVAKzye1SSxwusAJlEQs\nB\/vi7MCeWNvZq2CynwXo3x\/wCTA\/dDloyVylrmCc52JQt5mjBh7LFgDvlbqgs9AFnC9xUwNz4cGq\nMZk1e8Bfj68D2WLrGeDRXGc1cHqI+\/b4AB9bPfCPnV4gX7IMVMTYqocYB\/6UxwdeK2iz34MXd\/qA\nmiQuOFviBQqkKz7rQbyCse6mIMbNZKYHcSDegyEcwy8zSRJ96cB9GfV\/ThKflXrqCn4MbN3CAekB\n9NmbJNNAvAdxYLSbKejY7vEZsDVTMFPBtkzeDBDvwcOpjpoD\/pjrkvLb6eg3HwPvNkngly8GD1ok\n4EZNIJC5mnwGDHI0BJ3b3UHHNhcQyFw4A9wdu1K9zNQl2N\/TzHaLqZu4zYswdGOXO\/biTOwfOFDK\nN\/5kFjek8cEOmd0MsCKGATJFljPLTK7YSr3MTPdga7wFFs8jNGsMWOBBGOrMYMD\/Ym+sf9fqV0M1\nfpN3qn0mR5qD3k8vMxfKvWaAHYVun6yD3Vu5kyfTbF4eiTVVVYtpYwdEZHiE0CAw333B0JkPwEuF\nztjZbEfsVOpK7Hg8HWuJ\/h6rC6VhB4MRrC4EGW8OJaNN6lDQRpiGEApaB1MrJqM1wWTl\/kDy8yoR\ngsZxNQjMcdVRAxU7vbGLENiZMwWc2igYY3USCAxCsFoxMt70AdgoIaMNMPUhZLQW5mAQBAaRlftE\nyPOqQAhkaxCYCYEd6XZjivIPQFjBkyk22LGN5tjhKGOsNgQCRbCCwRAo+YALQdSpwwOrdxCmOghR\n7gucAq5nL9AMMNiOErfFWWfodJrd2IXtHljLJtuJhg1WE3Uys1dVkkUTlSK9iV1rkFdlQsJEuZDw\nsiqAOFq1ljRaFUAa3Q9TIyIpa8UkWD0ErRYhyr1rSc\/3B5LQaDbxsmY2rAyEH7hs7kBrgs3TwwmM\niZ0hppP7w5e8bk9ajh3dYIY1RRphh8RUrDqQhNUGkcYb8cqJEbRejFeOhMLX4PBCoIgEgSTlPohO\n4GkNiRmksxo7kwSuIBRuFpoOt2U4oUeSmb\/XyOgT1etMJ9pwYNR\/gIeCiOMNISQIJM3gakU4joju\nWrPgl0Tu34d9Lf5y3dd6wWCwPXWJRk92wfZ6Tv7W2rWxTt89zAww+1eJ2AwtXGs8WhFkoNouJKq2\neWirijy1R8u9dUbKhDojpULtkRKYFIHWkNTmr9c96X+7JbTU6hfZkfM0fnfhz5eEpefsv1xnW4CN\nTj18\/Nnbct49ocVcPHe9Lebe8l4695YQxsdS67iv1fzKQFvE39tS6\/++qf5vNVFGCqnNDlAAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2009-12\/1261531538-4654.swf",
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
	"drink",
	"alcohol"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("hooch.js LOADED");

// generated ok 2012-12-03 20:09:07 by martlume
