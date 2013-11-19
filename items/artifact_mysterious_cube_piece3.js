//#include include/takeable.js

var label = "Piece of Large Mysterious Cube";
var version = "1350087176";
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
var parent_classes = ["artifact_mysterious_cube_piece3", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "artifact_mysterious_cube"	// defined by takeable (overridden by artifact_mysterious_cube_piece3)
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
		'position': {"x":-16,"y":-27,"w":31,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHRUlEQVR42u2Y6VaaVxSGcwdeQjNr\noomiooAiMyiKOA9xII5xxhEFUVTEKeAYZyOJ1iFmMF1pm6RpF5fgJfRXf+cSdvc++BFArJg0iT9y\n1nqXIh\/re9h7v+85n5cu\/VgXcE30ymInzdLDKbNMcgHhpEaEgzGTBOgnwV4IMGe\/\/KeJPqnHYUqD\nutJYUKZchqaKeII8muhVRnxXsMk+qY2qZW0VQVlONBRmRjHADMlVsLaJAMHd33zGjlt5RBXreZAM\nlfkxDIwTAWYrb0CZPhroGvyM\/tuAYRupWrb2FGgo50GJ7lYAGKd0rF6W\/Dq+fxtqS2Kpin9\/1VYf\nO\/No0JhyolqnAVKLCbA0OxpMDQKax8OvAKaM4GaspyEZirKizoQjadKu+ADLc2OgqjAWhjtSgUbj\n\/3Slm8CGO1PZ8OdoboYFR1KLPwFW5t0BQ\/5dqL\/HY9HzRfnYWBlnwPnycGDVxXchS3GdKVy4vIxI\nBpgpu8YACY5TRw0fJszSj+fKRyo7Df9QR+pHAsOfrC1avAEHd17AAm0UczHNnz8gydwkDN8063al\nZ2ZAxkrfiMGqV90EuegyKDAm\/OHOA0ijUFMcdwx4+wQgBxlWiLsdKs\/mmApWRhQ4G1LorEvC9lzF\nIb8aAKdTfh6g\/wwGi5nmrBB\/tVrseexQwcaoClbtCpi2ymC0Jw1K8Jv7A2arboQNSNeW58T4AMvw\n91CA5Gx7t5gqaTgVcGch3zNrkcCMWQILVinM90thcUQNDoQk534OIFVblXrFB8ii5hRIcvZot3jm\nVMDt2VyPE7eihyYxTPV4NdFNeeWdS38XhxMz+WgQulZxvNVxgKR7aJiK3JPtbqlMAMrakPO45dK5\nl21yWESjUPWokgT7aFiDVZQyyOBKkksJpkAbeezYyID20nX3sX0U1v6A\/qK2+88mix\/m7KD4QRfb\n1kaUsIYmWRlWwPKQHJYIGLU2nsX2XIqdYEcHzydVV6++4fubVnqNHRj0+F5+eiQUZd4KCUoxxLWf\nxU9wRnoBT8ItDsrwtRKrKGOnkc7aJNY2FQYwOTwDAUiZ8sCspNf0PkUVAfqLwpvAqfWhoAmWzpAB\nkOt2uc0fbg0d\/WRKA27U5oQa1sew1SbvPBZl3WI3DpYSDcGJvkSmHAEy8OZZ0Uxl+hj2OlcTyXKW\nE5129Aibdwx7D49mpMbyeLyn5CPbt1eH5DYObnVUCYduPSxjLk71ScCFM+meTofteR1r9ZRFxqoW\nCtIfrDSbWhaLMRLnU00RD+pK4uHBvYQANZQlIFBigMxNIlYQFj\/brozDl2vZ8NtOAbxcz4aZQTls\njKvgzVYuvN7UwzSaZnYIDTTiraK1NeUEHEHnpUexalXm3Q0Aq0YRSDBEKDVXJILNmPoJjtb7\/ULY\nX9LBr1t58HROi9VTgtupgRfrepjFqh6s6sBuFGIV02Ea4enD9aW8ALBCLeXcnQAwElUsHDAOzt4l\n5ubv0+l7bykLnNi6hygbVmd3SQtzNhnmYBoMtgjhzdNc6LifBEvY\/s1pLUaBBMZ7JQyIwEjBVasp\n5oVs3WlqNfD94QJjZu9RJsYJbnWTahbSLgR9ga1+uYFt387FtuthsFkAj6dU2Go0kyOdVdE1oMLB\nDoSrRbBw28nJWJXEvvCpR7CDZR28WNGB57AYJnFfpKB2UfWaRTCAsjbiqQN3llcbOhjC474T33NZ\nva1ur07ywdWXxp8LLAAOA5oOyCG3Opo92kGG21J8gNN9CIFy4o7iMqfBznwGLNjlYHkggPHOFBhD\ncQ\/n1MovgaMj16lwtF5jrMxhKK9PqmCNNKFEo2Bwo7bmNLCGrR1D0JayRGg3eGU0JMBQOzuF4Kkb\n36vkf3Zb\/xOO1tvdfPjlSQ4sjOJ50CIFO96wr14A\/djafnwSs6AGGgXY6mR8nYxVTAIzqq+OD\/3N\nAl\/0hGsKv8qF96z85\/NCtteuTWrgCYbyCoLOWjH7+iVs9ia7Ur1t7UgBR7sIRlH2NiGMoIZahTDQ\n6g3VjpqkM1sdZIjwHuTf7+fDikMBu+jmeWz1Is7aq3UdvN\/Lg6VhOYNz9orhGcbP9owGQUUMbhjh\nbC0C6K3lgwkrGmwaihoC5irbUZPsm7lzPTD99bzoaH5EDptONbhn1Ng2IavgPEbKsFHEKreM0At4\njQv\/vjml9MHZsMWDTcnQVc2OSgzSWMU\/Edg99QJudzg8938XPhwURnx4VjCzt5R5RHvwOBpiGl3t\ntCjA3p7KZm52AA+06Oplhxz3aDH01CQwdVfFQxeqG3+34Jxys0WbPW17dSU8Nj7naulZ64\/dXMm7\nnRzj2+0c97ufCzy7C+mw\/0iHQa5CKD66OBCu3cCDtoo4aC2Pwx0nHiHTGORIp5ir2tGZTv3S9eFA\nGfH7lk6y7VLHDjQKJabaRJutRXhoqecfkZvN9Xzm6t7aRObwMZMXkp61v+v\/BrnVUs6L7a6K0xM4\nVtRjNMT\/4+gRuy\/9WBdg\/QvTGprf6vCkgwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mysterious_cube_piece3-1348252083.swf",
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

log.info("artifact_mysterious_cube_piece3.js LOADED");

// generated ok 2012-10-12 17:12:56 by martlume
