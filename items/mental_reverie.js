//#include include/takeable.js

var label = "Reverie";
var version = "1337965215";
var name_single = "Reverie";
var name_plural = "Reveries";
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
var parent_classes = ["mental_reverie", "mental_item_base", "takeable"];
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
		'position': {"x":-20,"y":-42,"w":39,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMM0lEQVR42s1Y91eU1xbNf+B6v2XF\nZPGe8Rk1Uap0GEB6b0OPg1FBYxlRI2rUsRDESjSQiA0RGzZiiYmiDEU6zFCGXoaqiMLYkrzf9jvn\nDhAJYPBlZeWx1l1888039+579j77nPu9886f\/Gv7NkCmPRaY3nkySNl5OljZlRGseOf\/5a\/9O39F\n9\/lIPK9LxK+9R\/FL5zcYyFmF7rMh2odnAw3+VnAdKZ4GHWkB0JVuEcD+8+gEfulOxavmfXj8Uyx6\nLobqejNDDf8WcEURxgZN+zzTuzJC8aoxCb9oj+DXvjQCmoJXTfvwvGorHmVHCZBDl6TT\/noq452n\n1ax3kFWttU+vWGGjLVtqhdavfdD\/Qyxe1n+Fn9sOiSj+3P41XjXswQv1Njy9\/zkeXo3AX6rJ1n0e\nkoZEj+z6nW6o2+qM6i8coZLbQ7XWHkzv0zw5Xtbuoqjtxc+tBwW9L+t243nll9AVxVEUI1mPaNjj\njqb9XkraVHJbiq+s42jAn6NeeyxA0pbqr2494ovmg95o3OOB+p2uqN2yEOr1DqhPcNNR5uJZ6Rci\nWgzqZUMiXmoS8KJagWfl8dAVrEH\/9Sj0XQmH9mQQaC5tx7EAdKYHo+uMFJ2ng7Tak4FvH92ezGAF\n0QKyDbQf9Ve2f+OraD3kIWlPch7VUmuKn7Y7M1RE6XnFJgK5HS9qdhC47RS9LXhWvB6DyhXovxGF\nhwSw53woujOC\/TizSZfyvsth2r7LdP9cCK0TqO044v3HEWUx910KV\/MPey+G8Y8VQ2njBd5xwNOg\nLdUPfRcjMJS\/Cs9K1uN5+SYCtlmAfVayAbrCNXh6d+loBBkgRUzX\/tp8j29FynqvhOu6KZpEOZoP\necneCPDh1fBs3jGPR9ciJ3245ZC3vC3Fj5\/BYO5yQaWuaJ0AqiteR+DkGKLoDdyW4dH3kRiNFFHb\nnuafPHbNCIOuTKmO9dyS7APSu2TCRR9dCpf0\/xCNwfItGLgbrX7TRloOeKnbvvEF73yAf0Mgh\/JW\nUjRXi4gO5a7AIEeP6aUs7s0KQ3cmATwVJCKlPeIzBkTnmeDkjqP+oI2jfpfrxGv3Xg5PflqxFc+b\nDmDwfvSkwm1I8DRoPuDFggdVEWhPBFJ0QvH4pox+F4vBezFE7RI8vb2IMjgcJBlBb1eGVDzLv2k5\n7Kt9Xc+cKK3f+qH+oKtIxLp4x\/F67M0KVevqk6hkJeDx7U+zJwPY+JW7ggxa0ME61GdlEEVIip4L\noegnSgduReHJjXBKjjB9ctB3nZR0PVmL0HU2Eq2HfdG012OU6tZU3\/QWmkuzz0VYmXqdw\/gAsVfp\nNEnQ1ewWtEwGULPLTduY5ImejCAM\/BiDZzV7MFgYx2asB0la62Wg18LQez5E3Os6HYy+rCg8fbAZ\n2lNhaCGDZxY4KdoO+8r4uuVUIOp2OKNmoxOq1tiPB8j6eFK+DUNVO8UiPZkh4x6q3eYi0ewgCra7\noDreiXdKk9nRZ1cCEaT3N6KStcmDr\/keU\/vwchQBIj9N9EBzsi\/ajtJ3FxdDmxWNtrPh0BxwRw3N\nqVorgSrWdjzFbd\/5a\/tukbjVu9D3\/TJojwu9JLen+iqaD\/kkNyV5KDU73bQMrkbhDFW8BBVrbFAi\ns8CDUDOUx9iI37Ah82Z58DXf48ToPhOMWqKPKdQoXKDZ7YbG\/T6oJzbY\/EcqVPlyG+XEJY1KUPvR\nQPQXfIEB6k56rsei6\/Jn6DwvQ0dGBO0yAq3nwtCcGQjNd+6oTiKAcTYojjRHYbAJ8gOMRQIwGLYM\nMeia77ElUXkD1XER9eoNjgIQD65KHLXKlXYoX2atUy2xnrhF46wi8WubSfzdBK4vV46uGzHovLwY\nrafD0JTiD81+T9RsXYjKNWIylCyyQFGYGQoInNJzPtQ7nfRgUocHX5MdtR72QQuVSxWBq4i1QcUK\nW1R+rh8Vy20o+tYoW2ylLosyf3M1qdvlalif4K5t+ModDUQBNwhMR+2XevEKza22ExOWLrZEUcQC\nFAaZIM\/HEDmuc5G73ER0OAxIDLpmb+Mk4Myv2iRBYYSZkEVptCVK6f\/9MEP8JP0Y5bE22im3VbVf\nLkyv2bJQy9pg4VZveI2GYXDFkQROaop8PyPkus\/DDdeZuBUxB837vfQZymO\/HhhnfUOiO+pp03dl\n83Hbf44YV71nIMvLQAz9vBZ+b9U0qNY5GqpW20kqYq2zmYrKlUTLKju2AahJR9f9\/o1rnjNwzUO\/\n0K3wOaLraUwaHnTNwBoSCNwuZsNVJElB7ALckH40Cu6q7wxwf1m8aEHy\/9R6lURb6FhzrB0BjoVO\nAi9ba4trAR+OLnSHosNAOFJi7BqWybA1Cals1mesOk6C4lhLFCwmypfQ\/ygz3A02VL41OBZu1TJ7\nNGy1RtWwsAVIWoCzkSVQtNICuUuMUb3ZCRoCImyEB13XbdNXh9\/kogfHc\/BcIkE+s8I5lxk4Zjdd\nN5QzxeNBe5rztPrdrora7fa68uWWQm9Fi8xRQlSMgFTRQmwTHBFevJaiw0DGjM3DwEYs5XVwlNFl\nS6yQE2LE4MTo\/yFK\/ofgei+GGnadD1Z3XqACvnehoLYo3Aw5XvOIyo+g+tyBIipBAwFgc1WPAKXo\nMKVNB6m3Sw5G414yYookf8fP8LPsAq+D40y+4PrhbwCvR745m4dyYqY9uR+tG6pYxrVS0MPZy5ZC\nLo\/a7c5ikbKl1mIB\/o4\/V4lzigRth8msTy4ikAQw0Rs1m5zEdwIYPcubFbQOg2PbGQHHg\/uAR+el\nkkkB9l0NVw6VL8WTB9HUcXgKinhSpqabSmHXjaUiIhwFYTck8BHj5UrBQCiphIlzYnHWc\/aXEiiO\nGt9jzTG44ihz3PCeMwou3dlAx40G1fH0iQ\/idNLqzAxA349StB\/3FXQJesgHe67F4mmlAu0ZUQI0\nR4sjkSM1QslnluJaTQCLo\/T+WLnagjLXRh81qjw3g+bhis9ssSkGzyWyIMQEJ+zfHwV4znumeuQs\nNCFAagjkzSkupB0PYQ3VGx1FdDpOSPGq4wj6c+KEt3FmMnD+7o7UEPfCjEVUmLaCACMUBJqQpVij\n5ww1FXJbob07i0xw3MEAeWGmKCa5cInMInN\/nd5jdu9K+B0P12+qRONNuybeQT5iB+x1DICOl+on\neXF40XhA1Fc6246CLyVNZpLAb\/p9jJJP9bTm+xJAf2Oo1lii\/xKZ9W4HQTNvKMPtQxSEmuBBiClu\nes4ZA+647XuiveMzM5fJ5oNe4027MsZ0GhVznSg7RBvvlGvy47y16L8nF50JlzA24Kr1Epx1nymi\n8j3pqCh8gXj+vt98AZJp7j3jgu5TLkSzjUiUwmV6u7rmNmsMuDTb6aMG3XrIR8LlkQ76E5t2UaCx\nQaHUJD3f30iZ6zVPSc2m7iG\/rTofgfZv\/UV95Shf8JolwPG44ztPLMyRyZeaQOk9X3Q4NRut0HXK\nEZqd+iRi3WZ5\/J7W6bo003+MmnNjortMlEY6m0zJsHsvhWk7r8pE48mtkybBDScdP8A5x3\/hrNMM\nXHadJRoGppVBFQQai88iitQn1m23pEOSFVQbLPXNxipbnHT4YIzuxnRUCtds1jg1LFMD2HGaOuuT\n1HiS\/vgVSPEaK3ma3fRknvyU\/Qe4snAmbrtRd+I+F7c95uJHGtkE+qbrbOQTaI5qpdwMtQlGqFhl\nLiJZuMyCN6k8ajt9TP\/Hpzn2TW7tuIOaEsCWVB8ROfF+hs4TI\/eZljSb6bJjdu+lM02\/o00MBs5R\nZZAlMjOULjEXPqjvjERXpKiMNxX0qtY7GajjHNSi4nBrt9p+av2h6OnIsFkX3JFM9tw9xznKu7az\ncdf2I91F63\/6MXVn7N6X5HkbKkdAchJxprMljQAVJr\/S7rfBXTbdq4ixntpLJc0OFyV3JaMHm1Xj\nT1xK108Ud+0YHA272ePKVL7XfBklnU40HFTTuYKIrppMm71TlM3RYSXaf3aUKQGs2eggEx01hZ79\nrCzGasyhXun+iSLHYa6I3B2b2ZO+z8n1\/tgwz88om02co8lGzREVYD81Fz5aHGWhpUokf+uesHy5\nrXKkb+PJHoSYqYUNuc\/X3nPSg\/vJdtaUXkgWec4xoAyXF\/obKQoDTRSU6QqKrLww1PjPvdDknRWF\nmmbzIYkthM8h9xwJnM3s9BzTGX\/pO+j\/AmDyR7fKmANjAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_reverie-1312586957.swf",
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

log.info("mental_reverie.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
