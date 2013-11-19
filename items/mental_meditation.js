//#include include/takeable.js

var label = "Meditation";
var version = "1337965215";
var name_single = "Meditation";
var name_plural = "Meditations";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_meditation", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-42,"w":40,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHkklEQVR42r1Y6VoTSRT1DXgEHsFH\n8BF4BB7BHzOADktEWQex2SEYCCD7vsgOaRIIScgGIrITNhFkCWJG0flxp04llel0EhKQmf6++6W7\nunLr1Llr9YMHt7wc5Ehw\/5jV\/CsmyXVtlNXCxvtcP2YfPvi\/L\/e1Sc8Wp7jk2ugN3cysxnVtSsIm\n7x0YFAeYiQnM8U2mha\/TZLuaovmLcS7Wy8nge+i5N5BQFAmY3WfgICCmkxGaPhjgMvPpLf+VPw4F\nx5Ri8U4EdBjd9wJSbVLn95kQQLOno5whAWzubCxkruFwMAwk\/g92XX+bHt3NnMy5GWseNWtgy3g8\nHASjBIhxwaAwKyQSi0JgBe6nP43Jt2ONRaAaHEyDBQUzNy0cr8ANgn4ZT8T7o4ynCY\/arGBGBIDS\nxL8q0AtzY+2bzcr8IVpUgr1Ijj++00NDq+3Uu\/SGy\/BG551Awk+d32Y8dwYIYPA14WeQLlcDlfUX\nUklPPummykkvV3IB4LuAhFVu9MVoAOHIamVtNh1ptGlU3JlDI4y1qf1+Gtns4iw2zdbQ5G5fcK5g\nuNlcyzfQatWF6RtYaaW+5Waa2O1zGw6HHkYpX+GBAUGCVZs1tyGTSnoLuD\/iPaIbDIvFKt++5EBx\n3+1qDLIbjWXMxTh3kf1+7+TFZII6aqVI4BAcYBC5TSirmy6nguZnzLH9lSKSuYo7c0lipgfA0a0u\najBWBcHhHkDAmJiPORgDcBDAxjSqZIyaGc4cWBHPuB9e76DM6lRuLuGbQ6ttXDkUw4\/g8K8nSvm8\ngfctHABMDjMDgDC\/0g0E89gA5jGXkWM2ACL5Kp\/BHhZus9XxDQBAUfsLrljpe2JexWAR9znBIDYm\nIh\/j6qjvdOj5ONMTauZA2xTR92BegAMzHfZ6vnCL5TV\/17PYxMfALsCMbnVzVvEe81515Yb5nwgU\nAQ6A4adic9gEzN\/l1GsUnUp4M4AAiORfpX0F1GiqDj7DDyd2ezkgLAbW38xp+bNSsnV\/eJhvythI\nLXMBAAVjMCnu2xfquL5gUBkqPDF7PGXNFYKdI+\/BTLiHaMdKOAj5aIj\/p3bc\/5xe8VuiOmNkVqU8\nyqhO8SBNQQ\/+D\/eAG4i0JJgO6fUiAYR5UUWQRmByAVgorRmVuA9iMeRGzIOzw7QAeFNhyKhJeVw1\nXMxZVJNQxdIUS1WyOg+GAYS5eMcReFanFWWrBRHmeVGfHhMgLk1tmhubgc8pUw8KQGZ1ij5qB6Ns\nCPArGlNRk0WRV5ZCmAYmK2zN5uAyqlL7YgFM06YlAIgymODHAJhelZqszoWPozF1kyD6AK7eUMEC\n4WkAXIobi8fT2mFebmNmSAKHnrD\/my+mE7EgzCq6YLAGNqN1xtit2Dl8kTm\/jJ3HCy5oau0Tj9AD\nv8YGI05kLCSxJKxByIMZgBWdMQAGylBQMA9KawOVI6vm9yShq9t3ktxzdeTuutwjSPvFPjWfHVD7\n5am++eIiJLqxMQSMABjTf\/VyhRdRCqcXvZ7oRpSijGKWPrxgrpMuEvqvTqWx83169\/Uzea4vyeU7\nJtm7R6U7Tnq56qCq3S2q914FfQwbEwB5BmC6YgCs1EeqAAgCKEIPCEUAht0jIETOG7w673NdfqYV\n3xmtfT+n9Z\/ntPLjlEa929TwcZmK1+2Ut2glaWODary+YGtVMyL1YbM8sVelSjH9ol6ufMxAaSDl\nA0WyABSsDmyXmTVpIb1bo9ebPH1yROazQ7J\/+UTuv05o6edndt44prHLHdIeLNKrAECNxUzS9r5e\nmcB5gFWnau500oP5YAoogECheo726Fhu3Vyl0aNtmmEmnvtyQGbfIZm+7lPTyXsq88DEC5TrslKW\n2UzZC0shXQuC484A47lKd\/bkHLuFOj1r1HGwSnUH72j0bJvenm5R96c1Kt10UMGyjZ7b5yndNEfZ\njmVSEgB3UVvlXq\/irT1ZM2+mP90LVMiAFK\/ZqWLLSeWbfuYwluO0UBab88Rgogyzk8pOfPEDMuwP\nJLFm0WPzGe60i8L1PfnpzCwH8Jwxmeu2Uv6SX3AP5vAu3ThHmdNmyrIuUuV8rxypqYh6ASCaBLtP\nluL9dsJrOeuIhq8+eJ7IFj87s3MczDOrX3CfbZ4nrXOJpHknpU6YKGdpg3JaC5EJPLdiEUkYFSRw\ngJdcZE6M9\/uN9GGF0tjiWQYzFZhtVDi\/QEUWO0k2J0kWB+WbbJQ5M0c58gjlDdYTylzMvKe+cGhB\n5UC3IoDyz2+qzxPiCwTmoH7j+FlnrCVplrX9riHq2ZqgvKkxqnQYqGndRNkDTVRi7KZmewuv3flv\nNPHnvbCUMalNYMXbDXOjFitPeih9kT69KVswCN7hoDW55y+buEd5FP0iEnykdHWrq8Wqk3GGGPzQ\nFmwkUKfFSQ6g0IEo6zSe0biKhgL\/F4JuG91K1IbgLpduuiJRHAkBTgAUBx316QwARRMKQdcMc\/Ky\nyCVVc9uOJ7bJx18lS915XnyPEcdM5XERzQQY0k2W8ROeqN+YzxljwP7zD+jI8mjTsahuqowz2sHA\n4aQHv0IjwXo7GYLNYIy3\/yxKb5XrfvVCU4rcpT5a4iB032v9A49n6rzbQfvUAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_meditation-1312586678.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_meditation.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
