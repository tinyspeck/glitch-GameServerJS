//#include include/takeable.js

var label = "Fortune";
var version = "1337965215";
var name_single = "Fortune";
var name_plural = "Fortunes";
var article = "a";
var description = "For those who believe their fate is predetermined, this fortune holds your destiny.\r\n\r\nPlus, your lucky lottery numbers!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["fortune", "takeable"];
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

verbs.read = { // defined by fortune
	"name"				: "read",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "... in bed",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
		    type: "note_view",
		    title: "A fortune!",
		    body: this.fortune_text,
		    disabled_reason:"This can't be edited.",
		    start_in_edit_mode: false,
		    itemstack_tsid: this.tsid,
		    pc: getPlayer(this.fortune_author).make_hash(),
		    updated: 0,
		    max_chars: 1000
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function setText(text, author){ // defined by fortune
	this.fortune_text = text;
	this.fortune_author = author;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"fortune",
	"toys",
	"no_auction",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-13,"w":23,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFlElEQVR42u2Ya0xbZRjHt4kJKorG\neSPqnFMGxEWiH3SRiLcYF3STeF+MM8YsarLxwTgTF+cHSXRTxLGwkMwJGAgbYYNdhGW0XDcopfRA\n6e30dlp6gbbQUq6ZZnl8npdzyikgX6DdPnCSf1oOp5zf+b\/P83+fsm7d2rF2zB+hkD01OMz\/cFPA\nAIRSZyfducFha27AZy4gsIDXLAR9Zhj1mnfdAGesuQQxOsLXT4wJ3PS4CyZDAhDQQiFoecLgJkbt\n9UtBjAdtEA5YYXSYh6mwk53ze4zgc+kR0AT0UAlbSoTk5m4+CMNDehhxG2JgrYYrMNinQCnBZeNg\nyN4Pw25D4moRZn2brs94wyMIRwCSyCkC\/PP491BT\/jN0tZ1l5x28BmwmNTitXMKWOsms73rj32kP\nc1ECJKfcjgEmq1EFTQ0n2Kv8IbxOXdwhk1AbUff73fojBGkxqMBi7IkBIfdKDu+HuurfmJsET2XB\nyiAB0ROF\/Gfa4wqN8NDXo4R+TRuYdF1RKf6uZIA9nedY88jrFH\/ekwjIe3o6Gt++PusDwaJhkHJx\nPc1QVPgFnKkuAoqhyKhjHtJrCof9\/NPxhlyPupeWejbijIEjBz2CjmXjyNAAtF+uAr22OZqVtNzY\nZILPod0Udyf37du7ZTbiGiQXud5W1rFUh2ZdG4OTAEN+njlJOYnNAvr+TuhTKcMOY\/whb7t08fTL\nMxHnuGDpY3BaVRNbXm33BQYlV8hvZddIbmt6FJxG0xz3IE\/p17R8HfZboploGmiFi3Wli+Ao2Mnl\nmJpVKcsTAXmXwKsrQwgpNUPD6RJWe7SsBCfVHzmtbKph0qpbYJDrADuvqU\/Elrg5ErSaxzB6CMTA\ntYL6ynlQNlbGxAxtkSdLD6LbffP5KHY35WQ8QW\/9cu+evOlx5wRB0DbHqZXQ3nwKO7uTNQeBjI1Y\nGHTDqZIlJyAG6jPX0+gWjzjaWFV+7OC1ySG2lBQ5F+rK4FxtKatPykOpJq2GDtbdx44UgMCrYGLM\nwRQZtYO8VCTg1Zwtt\/arlWcxftgNzLp2KPv9AFT9UQg241WoKDsU0zzdbXUsilxWNYsl6TzVLj2Q\nVL8kj1Mn4IOueCe6BbU96DM6psMCcyXgNWLDKHC5a6K7y0IRJElyVv47AqV6le35K4ZMyc7etivg\n0QsRHGjlzVB9spCBLM5InnU9ZSjVKA3CtNTSXk4DsATotHHhYZd+xZBJuz\/I\/xBdnKLRjKYa2gJ1\nmsug6TofA0fLSVM5NZAURx5hbnyjEvHie8pX+rw01pkGu0CjUhSsOB+zsrZ+7HMOOAlQcoACm4DI\nJckpKYLo5vLxraz4m+h1clFt0vV+j4HDzxavBDI1MzP9E7dd67Kbe1ln0wxpM\/Wy6JHclUNJIhdr\n\/\/qFNdJSdUsDCLq+KtNRGmq3+uqlTpohB7Udi0Y0Xt\/NslMOSHXndvSxfZ26X97lUciwkLta8UOT\ny0dFhw8VhwN8cCrkoLELXRwA3IFgZty5pIO0\/FJuLgS0mtVf4d\/csJpBvgX1PoF+d2B\/IadWdNDQ\nS7o26f6fZdZhzdljmyokRBSNte\/SZC9O+OtXEzIblY96B\/VeRsaTnzacqSjHwXcKv9YugpPiiTqc\nGiMUsBirKo\/vwM8+IALeHY+vDC+g8lBvot6i1\/ydOz7DPbuZlp6WlhqHooWGj7mOt0a6Oxu\/xWsf\nQz0kc29DPAaLFNSLqNdkehX1ytFffyzAvXxCWnqs05Z+jfKnvLzXnxXh0mRwSfEcz25H0U1zREdJ\n21HP5eQ8\/1LFiaOf4\/ttqAzUE2KTpYlgd6x23S23b2eKoM+I9UmZ9pR4Ph31OOoR0bXkG\/VfvPtQ\nWaJb6aJjm1GPoh5E3Zkox5Y7kkUg0sPiUibfDGCLJvN4debasdzxH5CY6U3zMZI3AAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/fortune-1314818940.swf",
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
	"fortune",
	"toys",
	"no_auction",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "read"
};

log.info("fortune.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
