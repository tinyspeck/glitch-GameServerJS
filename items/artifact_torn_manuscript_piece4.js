//#include include/takeable.js

var label = "Piece of Torn Manuscript";
var version = "1350087235";
var name_single = "Piece of Torn Manuscript";
var name_plural = "Pieces of Torn Manuscript";
var article = "a";
var description = "One of four pieces of paper and frame that, when stitched together, create a string of words which probably shouldn't be read.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_torn_manuscript_piece4", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1308\/\" glitch=\"item|artifact_torn_manuscript\">Torn Manuscript<\/a> artifact."]);
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
		'position': {"x":-16,"y":-22,"w":33,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE8ElEQVR42u2Xz1NTVxTHXbhxUxdd\n0Olkhpl2hnHoTLOxiy4YOiy0i1Yp1tLWpmBFB0ZADCgmBF4g\/AgkEH5KyvBDkGBAMQ\/kRyC\/JBFC\nTBAIKmIbYqvOuGPhH3B6zyU3DWArSAQWOTNn3uPl8u5nzvmec+7bty9iEYtYxLZllu6CaJOu4Ljl\nhiTDxn21f0\/BmXskKWaddMXcIwV0i06auutQVn2+0HJDyqHf7ZX5pweKwXGrCCb6CsGqLwCM5q7B\nTfNyw5RBDjPDpTBnLF\/j3vEKevUMKVa8JuXOQd6+mhW\/YFQK8f6hqXIWIR6ZK6kzuJkhBf376UR1\n0Jfuqg0+j\/Lge4HymZQH54xlHfY+2QqDeGytWgMQgADPHQW0K1JAW3QKXs5o4dl0A\/xhr4F5Y8Ur\ni16SFVYwr7H0OIExkDQBasvWKwNWAN5xJYXCSA215ICzvygIamzPBXsv0V\/nZVgg62rlIg153TfE\nY8MHNlq2gmChUKE+QZ4zQMv1fNCpzlJQfLZgUtIo23okMNQm9pFXJhDfv60UsmixFCLcvX4OXIMl\ntAhcJIJ9dRnQIEmG3tp0cPJyum7RqqJQbrIOAadIJJ0GjrrjlsyXeiIunWwR9U5gKPZQqP9z3BgB\nOstPQ4\/6HAXA5\/Nj5cHUkqhTDY62i0GSdpQnW8QRP7BlsOVJdTQRbjzeE\/H718PgBoamzA2QT2xq\nCmLXS6E+\/wcwdV0C520OSDUHIbEYLp4+oiCvFm4prc\/dTdxLT\/PsC4\/W9tzd7P\/ToQlWHuoIU+Ud\nq4BBbTbdnGxEfquGRQLFAHEdphKLAK\/oWByspegbM3WfHfr4202ntLX0TDQT\/TzZ3DdZT0sf\/S9X\nY1A769uFk2jvemVaoE00BgFR\/OvX4v8Pk0IoykrUZIoSTm4qaqvaKrOt0RDp+BM3C2F5so6kpIpE\n6gKNFGpq\/aaYyv7GTAqJFeq4KQP3nRLaMt7Q+\/xEm4PqnMRz6tyk6LfCPZtqsC2Y\/u3qD0bKaA9j\n7WG4PQ+MHXnwYJhEZLySAjbLfqa6Ct0Ymyvqq0v5Gy0KBEQfaM4GF6ngJ1aVf2lCnfIuxSnwmlV2\n2r3HKtakh4G7SaXNEY39fb8JZkfKaXViUaC2MGKrUVQF1pbQfoa\/t3C\/0Ku28JQNW9N2em1Mnzan\nxT9VtyElLIUobNeAHLqr0mCkVUwhsU2ErmEDH1OMbuq6DFcLfgKNOIkLx0AQdNRkaEj1vhEy1B+S\n6CJgqDNYNhWYY\/8jUeTCNU4F12rPa17NtQBrK29zBMOxhZrEgkIZ+J0NQV+0qsFlkGvCOfOFXO7J\nKy88za83A8jma2uxCGpyT5D7KtqSEHQ5IBms3HCfmGIzREeynjo0PiyezYKiK8VJvPTM0VH3QPHK\nuiqPDzekQHgoOumRVe3dTLpxwqCjHmskP\/Ixn3z0xT2eO4xg\/qn6eByX7+PsiYP7S3s\/x\/9XhQcn\nBH5bkMZ+PzBpyOnG93ms4OttHZu2YFGS89+lVOYna3B+8q1i\/rG5aoNGnfxqgx\/rygfjtUtQkp2o\nwxa2k989HwY2PIxHI9H3cVlj3VdMDBZTjCOSTSHD7zmvL4oSEFKwm1+SH2BRtanOtjDILk06b9MX\nlLYpfuU6y1IvBNbsuh0Y7swT4\/ku5tOo5L0CtcGWHNVCvk18bM8CRixiEdth+wfaEooyslD3MAAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_torn_manuscript_piece4-1348253790.swf",
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

log.info("artifact_torn_manuscript_piece4.js LOADED");

// generated ok 2012-10-12 17:13:55 by martlume
