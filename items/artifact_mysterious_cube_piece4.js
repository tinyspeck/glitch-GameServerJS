//#include include/takeable.js

var label = "Piece of Large Mysterious Cube";
var version = "1350087183";
var name_single = "Piece of Large Mysterious Cube";
var name_plural = "Pieces of Large Mysterious Cube";
var article = "a";
var description = "One of five small fragments that, never mind the laws of geometry, combine to make one large cube. Mysterious.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mysterious_cube_piece4", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "artifact_mysterious_cube"	// defined by takeable (overridden by artifact_mysterious_cube_piece4)
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1307\/\" glitch=\"item|artifact_mysterious_cube\">Large Mysterious Cube<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-20,"w":36,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG7UlEQVR42u2XaVNTdxTG\/Qa+7ihL\nAiFBoqhICCH7vpCVsIZFFgURQWUHwwUhEiAkKAIiiHHD0bq11lbbaTOdfgA\/Ah8hH+Hp+f+p9kVr\n3Wf6ImfmTpIb4P7u85znnMuePZnKVKYylalMfUz5bNI+n0Vys9KUn9KX7U\/8L6Dq3TJdk0+eMpdn\npZzaXFgrcmBQ7Ie65JvUF7nA481AzoM1n7C96tedaS3V9TQfE7qbjwqnQkcTXaHDqSqbJNURlKdC\nbmlipl+V8+b3Qv6iljpvEfsehrL98JvFqHXkwW3Ihal8PywVWZ8P+O16ILEVc2J91o4rU2Y0uqUI\nVUrhMYrRViWHx5QHozIL7cEiDlBly0d36Aia\/HKEfHJUOQrg0OQQUBbqXRIOF7CKUW3PQ31l\/s5n\nwT3ZCHo3onZEzqpwsbccC6N6NLgKECQIpgpZBps6BzUEUU\/nvUYR2ZcNj0FMIGIEHVI4dbnwmcQc\nLOSWIEhwQZsYdnU2KuncJ8M9XK\/euzCm3xntLMXwiVKM0HFpUMvhqumoc0oISoZKfS6qrPlwEYiN\nLspAeJ+psvk5dhOs50IeCWpINYsqC16TCAGLiCv5SXC\/PKzee++K9\/XypAnTfeWYOF2G8S4FosM6\nriCzmClWY99V0UFAfnMeXTSPX7ySwNwGEbeWtYKblPXQwRRkPUjhoBvLofOfoODvzwcl91d9rxdH\ndYj2qzF7vuKtxfELJt6D9c4CuoAIXQ1y9LUWcwUZIINgsC463KQs+xk\/fRe05cFnFkFfug96xT6Y\nqGdZitm5j4J7fqe2+FmyJp1cdCE28k\/AyV4VqbZrcVtVIfWcGH5S7SxBst5jqjEF2XkPvWfQLr2I\nq9galPGQMAVZQKrI3o+yeDFcWTzQUZYe7lRhsq8Ci2EThUKD0U4FBjtKcaaxBEMny7jFrf5C9DYf\nxOxgGfVWAU6F5NTwIt5zPvMunF2TTRASNPsOcKt5K9ArC4eOlGSvDWT5B8H98bynODpoSG\/FrLi3\nbMfdy3bMDaqxuWBB5BwB9yh5D55tOUL9V4Czxw+hv70YnXVFOFFbhK56ObfZQYlmqWUgDgJ0k3KN\nXhn\/zNLOgtNWxUYUC1EWTofk6ffC\/bhdr3u0WZ2Oj2ixveLA4gU9NuctmBvW4PqsCSvTBiyOaREf\n1\/LP4Z5jON14kFvMVGSAnfVFZK2Y955LtxuSZm8hV\/ANsN8i5oB1zjw+ZpjV3Q0HhHeCPVj1t1yf\nc+xcDhuxverEDPVZcslGQdARpI4UUmB9zoTlaSP6yeJJ+n4jaiRbVehtOUSgJRjpPILjARkfPXZS\niI8cer87YtgoyeeA7PyJ2kIKxj4Y2UaxiNIna2TCO0fIq4dNT5\/cqMZ6xIolSuv9FTfWCGR1msE6\nkIxbcWvJilhYjxmyeEnQI0KW34yZ0UW2tgYOIEhhYevrJH1ucBe+HTOsB9l7FhQ2D9ncq3Pl816t\ndeSjo1r6urO2oPidyv38qCX1XbIWSVpfKxMGXA0bsEwg21cdSBDswrAW0UENJs6oMNal5CkWTisx\n0FZKFhsxfPIYzKrdDdIeLKQQyCiVEt6DbwCZYmxLsMFtJ3ud2hwcp97raZQL\/z2AHzcnvr9dh2tT\nJqwKxreAV8b1iI\/pwEKSoH6LDWkwN6DmYyZBvbd91Y4YJXpr3oTokJIUkWKsW0FqFBJcPgdkcCy9\nfA7q\/p6DZHHaXpHd8t4wvLjfIDy7WYONGfO\/Ai4RYHxch7VLJgKxcFAGODdQQRtEgwuk4g0CbA0U\n8jHEeo9tkiZS8FxbMYdhu5gpyOegPjdNSgrmEvHe98K9etCUuLvsxQJZFzmnxlRvBa0vFcL8KMdl\nsjhKINMUhMkz5RSAct53W4tWrEwZ6NzumNlaMGGiV80Va\/ZJ+T5uJxVDHil\/IHhjMQ3mm2bzB4Cx\nSi56EnfjLlyjvbo2YcTlv9RaGNqFXYuYsULHJtl7rlVBPaZEpL+CPyCMElSMLN6cN9ONlOHhmpP2\nqYxGiAzj3UfR4pfxkLBQ8B405z0NGEU5H7W+4qMaHVnadyWsT6yEDanVSVOa20rz7ioptzZFVpPt\nSVJr9rwayxN6PNqoxPJFA2J0I\/OjWoyTvaszBpqJetomx3CeLG0k1ZjFTMXu0MF0R+0B7xd7BI8O\nl+yd6i3zTvQoBdqzwrVZ687jTS9mBzS4SE8vU30qUkhJFluo31T0mEVhCWuxfkmP40w1Gs4t1Hv9\n7YfTkQGFwP7eV\/2fgc3G355U6359XCP8cDuQSCZsqetRM9ajFtwg66MjGtymubg5b8DMeQVGTx3d\nmRtSfn2w99XLew2Kl\/f83p\/u+IQXtzzCekQrxMdV3j2ZylSmMpWpL1Z\/AjrpUdy2FDRiAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mysterious_cube_piece4-1348252080.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_mysterious_cube_piece4.js LOADED");

// generated ok 2012-10-12 17:13:03 by martlume
