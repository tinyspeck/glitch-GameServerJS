//#include include/takeable.js

var label = "Consideration";
var version = "1337965214";
var name_single = "Consideration";
var name_plural = "Considerations";
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
var parent_classes = ["mental_consideration", "mental_item_base", "takeable"];
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
		'position': {"x":-19,"y":-47,"w":38,"h":48},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAINUlEQVR42s2Y61JaWR7F8wY+go+Q\nNxg\/zKeeqq7UfJrpqamyu2fKzKRnvEaNGoMoGuMF0okxmhtR8RrRGCOKKEcNIAJyABEU0KNyU0EO\nimKi1b1m72OcTs\/UZLx0x5yqVWAd9j6\/vfb\/vzZ46dInvios9qzbtlWmbWmXaVpM9FfPBS5f+lyu\nqhlG5ovHEXt7AMNGHHfn\/JDMLnDVFkvKhcPla1vT7s0yYDfDmAoG0LrggcTCQmwy4db0ZPqpJ6xz\nxVLrXUlZ3fwuU+1YZypZX9Z5APPGG1KLJtpRph+ESD+CUr0GpYYx3CTvi6deyk9XJ+xiunQuCPvW\nPlZ3D8BGE6i0LqDMZGbPA5mreSDKH3+GQqYdNya6iXpwg+lEAdMiOvEkYpMhrd42Dze\/g9XEPqbC\nW2iY86LcbEWZUY9SnVp2VsAMTXVK9nAdmzd6H3maRqKHyB19wBZqmk9eg6X6ca7X64F1MwJrJArF\nokeoE5HxjbAtJW9eoUSvSD3zVo\/m9+eobyBTVS7LHJJcOfUEJW8G8cxpwciKFw\/tFoiNk6RWxnFT\nN0xrhWxLF\/K1z9LOClisy+ELJ\/POXs83JjoZkW4A1caRI7eIiqf6UTTZQ2pHgfzxp8gduXei7Kqd\n37lS796X1zq3mRbfFnPXaWPF1nzuXHFA6yF\/TM4ValsFoEJtGwq0LQLYdU0TctV3+\/\/fHBLrcqrM\nGWQH\/dtY3nkH\/94BnLE96NZjUHg4VmK1pp4bMne0gRUKefQBaFETMOSoK4iK0j8OZ02tYd3s9AaP\nyP4BwskDLO0kSRJsY2QthMfzCyg3GvjHDvMVSyx2voDOVFWlZw7fFmUP3+JzRopJ1xWQrsv\/aGaV\nGY1yJhgiKbAN73YCi\/EE7NE49OEIRlb9aLDbSDBPkDwcRafJwvX8EqdIrrbwMgFjKWA+c51170TT\nF3ejjG8vxnBv4\/IQ9lP9h9sibWiZqTbr8dzlhDYQwCQBbfd4ofQtQb26ij6fB0+cVogMaqG2Gwxa\ndEyb2XNDLu\/HUhcTQZHUWotSYw7MUR+4\/Tg2f9zH+g9JEEisECmX7MLJQLu+a3EeVSa9EE9NDivu\nmHVCTB2lwYDQdBWTfeg0WtBtZkVnA3u3e5lCHGtxdwP3XFV45K0DcRGexBa8ezEsJXlB48EFoeNp\nVN3UqYhGBGAKdVM3JLhWNKkUooo2oZjpEgCVVgdzJkC9Pyha2I7Bs8PDm+Bhi26QrbNC6stG23wn\nHg5roNDPHD1k1iYsQjT1QjjGiiZ7BZif9OIIjCRDwbgc18ceoULbLoyt7ek7PaA+FEp9s+bnDQFy\nJkc34diKwBQOQevzQc5240H4GqQzlajuVqJvloU5HMDSXhxDKzYBoIDGFImoI7W+j6pnAhhNh1z1\n92i16PB4bALilnZe3NpxuvCfWFllCKDg2ur+DmyRDVg2wnhpmxMmfey+C2WyEhq\/jtwLwxWPCpqP\nR4i7EyjSPiG52fxeTcK5mzfaIIDljNTjuUOFyRU\/emftaFaPo7y1g4Ke7OjTLMVSGG4NkyQWdP4A\nqIvGUAjToSBeOZwY83phWQ+RGoxhORmHe3sLq2934N3lMRejbm+CWV1E8VgjgZG+Vx2yh2uQpbqN\nB6Y+zPNRUAMGHC5hm98DnuyUGeX8ad0mqzBQ41kSIFni4AyBdMW3EDjYxYfN4yRQdgI1EwpgwD6H\nPqtdGNtobiNdn4uSqRLIprrwxKDB7EYAa28TgnuDc260G0xCHVNAqhM6uJTSxzp4+pDXTjdxbAl6\nAjkdDCJ4+BNc6HCPOBERwKYDfmERbGRdcFBNvjFLXykh82ZDonxEIIwY8y1jJbkD326cvOfQY2bR\nSBrtGO7EgPRSkCOrc2ZW9FQ7JbhBt4NC0q52ku0xr4dhIqKvtHHoZ4ZdbsFd6hC9N0jKgY5\/PqFD\n18wshubdGCQLfmlzCn\/TMfT+8faWt3Wd\/gcUTfmWKQM\/7PYITg67F6EjsNRNWpd02yc4ToDoZx3g\nkttCJNF7w64FAeJjOgYsb22Xn\/kkud35QkQ793jSXpJ5KnLoq1xH6iHftiWKLmEbKbiBaIQs6Ngl\nKrqA48z8UPXKgWMHmXMdd3QLaBzQSVvfTKNhSP1vVXX0CA+RvXwt1BVdwDEA\/eyxU3QR916p\/mvc\ne\/WfC5DWB52ErvR\/iKMPqn3R\/zN4CkVfP3CK\/8+xdN7qnp5f97dxcywjpcF8k6tV3ftZV0oUitSK\ntk4RBftFnDrP1bR89XKj+6+4PfE1rtX8iT9TV\/6aV+NiRrpk7Cs0ea7iqvS3WZc+t6vRnsFea\/gd\nX2tIx\/dzGaLPCu6R6+9posE\/okX3T76X+RsGPFl8tSUj5bOA2zGXXOl2ZXE1z3+Pw20TDqKT8Nry\nobLl8PxYSfqFwvHa0rSQsQhS7dcY7EvHj+8i+CEZRHK5D1pbAZZcSuw5hq5cGGDC0cutcNX4x\/0v\nsDpzB4dxLw5jbgKoBqcpxpPpTKz1l3EXArehLL+8pa5Fx8x3KKn7Aom5DrwLmpD0qbFtkSP6+ha6\npnLQ9yIP6y3iT+9ipEOcttlThjLlV+h\/+i0S9pfYWxhFVCVGZECETWUZxroKcGfwO4QfV3z6ro41\nV6eEW8R89sMv4em+BX5CjrihC9EhGTa6xNhQiME9L8O1lm8RvF95MbETbq5IL77zJTi5CBvdtVhX\nVJLtLEdYTvSkAqGHEpTU\/wHSxsyL6+ZvxL9Jb6v7BqFmyZGaJAg2SqhrCMgqUVnzZ+7Cs1Bc81Wa\nU1omC8gkTEBaBX99FdZqKnmVJItRSP5y5v9m\/QtB5\/49hR6zjQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_consideration-1312586023.swf",
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

log.info("mental_consideration.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
