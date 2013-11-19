//#include include/takeable.js

var label = "Piece of Large Mysterious Cube";
var version = "1350087190";
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
var parent_classes = ["artifact_mysterious_cube_piece5", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "artifact_mysterious_cube"	// defined by takeable (overridden by artifact_mysterious_cube_piece5)
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
		'position': {"x":-18,"y":-30,"w":35,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHgklEQVR42u2Y60+b5xnG82Wfs35o\nkg4IZ\/ABjM\/4iLE5GNtgg40JxmBzBgPGEIgdxwmHQAiHZiQtjdLSlq5TOyltR6WpH9pFZdPUVuq0\nedr2PX8Cf8K1+3kce4aEkTRpkkl5pFv2+74W7++9rvu+HpsTJ16tV+vZr3dXHMGb8407kT7V3ksF\ndmvO6lqYMu0F3BKEuhXo81ahzyMJvnCw91ZspnabMDk9UJ0B89qFKUBW7ZWuFwa2Fq\/bG\/XLORB7\nZcWg+juqMNQp4++DHsn9P971nnwuUN76opPDPmlwLWZJnh+s\/q9KD2qsR5F5z66PB5TobqtAR7No\n\/rkoNhZQJt1NAkz2qjDYKX0IcC5ixHCXLHMccFdyNXvo1W0X5v8sYHdW7a6NeP3e7LAmdVNPJbcv\nbWd2sR68NK7PHHe1isEeqMslZiommQPPBOr9ZXu+1yHaIZv2L08YEOlTH1Cst13C7XuUigySXe90\ninCuJVUBj4S\/PhXk5x9Ni9+9bp9\/Z9mWZFYNnpNyi9h0HgZMVzioeuhcD7dVSjDCDCCr1saynw75\nt29Xon\/\/NoZPt7yIj+k5ULrhR7rk\/PhRlg7QQ0yQkofP+1rEsJtLDkC6m8rhaiiD1yGExy7YeWy4\nv95biX6wasetRC0+u9OJrSVbRrVhnyxj21EqXhjWPhKy2VLKgbIhrTVFdL6En\/dYyyPHwv37h83o\nvc9GsTprwLVpPbavO\/D17wawPFvLgVixKaQs4z33qOllU7s8a8ZUv\/rAeX9rBZpMxRlrWbVZy+Gs\nL0Uv\/T2qnWPh\/vT7EH77axe2rpjxdsKE2wsN+P6rSXx4w81B0jBsclk\/zg5pOORhtTocIlyPWhA+\ndM1tE6C5rpSDeeh9l1MMv6sCzoay4+FYz33yVjvenm\/E6owe6xeMVAY658F3f5h46Gas+ZnlzNLs\nQM7AWAU0vQ8ehooFNFPNWV+GdtppLoZ0pGgR9Krc5JE7C4Bf\/Ou79dtMuTtXG7C9bMXHG834aL0Z\nd5as2ExYsDippV704fNtP4+LbIggHdO+S4DKTH9ml40sdVCPMcXSNdmn4vbX6Qs4nELx2tFw\/\/zL\n1S93t314Z97Cbd26XIu3aDiGz1XyHrxxsQZvRo1Yo55kn1uNNz4EyfZde20JAcp5f2ZnYwdNqEVb\nAFttcWZ\/ZiFt1uYfD\/fjvbkv2bRmw92I1dBXogrMhQ0I98gzcGszBlw\/r+eQE2S1j27CKrWvCtFo\nKEJbY\/nBaKHrfBAoTjqbRbzf7OZimDRnH0+5D9adWKGbMqVYz63Q64BXgvc3WnEzYcYGwU50SzNw\n16Z0WI+Z8MV214HAZYBMwTpS6pxDxPstPaEe2tb8BNpOA1FvKIBRnQeDKg9GVa7pfyr38aY7A8du\nnBilIO6W4y712tKUHlfGqpEIqREf1SBMkHN0zGu8Gh+uNePWou0AIIsKs6YgU001xQQrpIAWocFY\nyC1lYHplblIty6k6clr\/8ef5b\/a+CPEQ3oybuIWJ0WpSSo6dN124GtFitFOCtoYS9HvEiA+r+LVI\ngKZ1QEGwMoQo535DDxjuVfOoYLnGgpaBNRgKuXJ+spPDpVVT5u1XS984Poi\/\/yqSZNOa7rmVaR0G\n2isJzskHYp4UctQWwqrPR6PuLKlsIGj2mQoOGxtSwt8igK9ZgLu3vXybaqFcq9MV8mKwIzTN2XD1\n+oKkTHyq6rG2seUZXf7ylH5\/iZSaG0\/VSGcVFsIaLJPV0UElelqE6HKUo4lukBjT4irFzEJYi0Fv\nBaaDctSqcmBU5qCbeusa7RhMObuphO8yi9MmvscyOGapSnJmR1H02pN9EaB8i6T6T4cr4xosRgyY\npKCNDpFCBDhAU+xzUOKbi7AWNSNK1s72KzBG1gacArTVU7aZCmGpzqMH1CA2qsV6vI7v1yzbGqnn\ntPIcSAWv\/\/QfSDfjpl3Wg+mcW5mpwSQNA1N2PqzDGOXVQqSG7NVzuFCXlKbagmCrEJ22crRaiuCk\nyJjtp9AlVZnVzE6V5A1IRafvy8oe09Kj1mpMcXIjatzPzrnYkBoXCGaJem4jVkuW63FpRIUgZd3y\nlAEXqQfZoHRT\/zUZ8qkntQj5JBQxRVBLf8XAIBWe2n1iS49aW3P1ruwQZnEz4ZfxyFmY0KRgnEIC\n1nM4NiDM7ksjamqPGgJUo8VSDEXFGYI7tf9Ulh5p9aXa3TQcU25xUofhDgkiPVJMBlJqZsPN9Mkx\n3SvHuL+KpjY\/pZroVPKpLT1qxYYVJymU718OVXPlWJREyerEmI5P7gU+IHLM9MowFSBoAme2GpS5\nDyx9ffNn\/\/kY8slMbN9lIXy+Twk3hXQrTSqLFQYUJrXGCIoFuJ+m2FR9NmWp6PTz+w8B9dw828YG\nKZDrNXkwUdZ106+wbFtZWCsqzzzbQXiSRXtvst8tRou5EDZjASzqXFwOaTjcNCmrleU8X9UOr\/P9\nsqohb+V+OucCtFNM9yrox0zpi1Pt8IqH1MFJ6sUh+tq1REHdbi3dlwpPR068TIv6bjdBX7N6WsV7\nMuEv80+8bItFT0+bwPTqf8P\/j+s\/gy2NX3n09hYAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mysterious_cube_piece5-1348252079.swf",
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

log.info("artifact_mysterious_cube_piece5.js LOADED");

// generated ok 2012-10-12 17:13:10 by martlume
