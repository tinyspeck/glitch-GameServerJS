//#include include/takeable.js

var label = "Piece of A Mirror with Scribbles On It";
var version = "1350087141";
var name_single = "Piece of A Mirror with Scribbles On It";
var name_plural = "Pieces of A Mirror with Scribbles On It";
var article = "a";
var description = "One fifth of a shattered mirror. Combining all of them will undoubtedly bring good luck at the expense of whomever broke it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mirror_with_scribbles_piece1", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1309\/\" glitch=\"item|artifact_mirror_with_scribbles\">A Mirror with Scribbles On It<\/a> artifact."]);
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
		'position': {"x":-16,"y":-17,"w":32,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGmElEQVR42u2Wa0+b5x3G8w3QNGlb\ntDUkISVpSEIOBBijCcROIQZjg22Mjc\/2Y8BnY3zGNsYnbAzGxkdODhCSVG2Tdmn7Ypvm9sXeTeIj\n8BH4CNfu+6kydeo6TU0aTZMv6ZL8yC+e33Pd1\/2\/7zNnmmqqqaaa+v\/W3\/9sbPn2S6P6m1fGl18\/\nVzc+rkkau7mxSDHOa\/2fgPr2lRHUz2sSbGVGUUoMY2m+DzbNDSiEFyPvFOxvX+lbv\/kjUyc+\/dMn\nWny8NcnCfXGogN\/SA424HbKxC1COt0Ep6oBKcqf+TsFep\/XqiRI7q3zEPfdh0XRiavQ8C6WRfAC9\nvAezWg6cJh4Si1PYzGhRzWrstRVuy88CR4AiNLHXcNSkYzApr2FaeBFywSWIRzog4t+BQfUA2lke\nLP5J2MI67JbCeLZXwKeHe3icjaHg1qLkYV4W\/Mz9t9IzAnZMgf7yQo\/NOA8v6nIUU8PQTbZjWvA+\nBEMdGB+5A6NqAD7PBEwBBVwxByJrSSTyORTKm3i6U0E55MRWzI+jap6F\/fRJnXhP\/UaAr+Gov3qq\nwm52DJ65LignaGJXwXvYCaW0H8s+ETaSamzlF1Eu5VEpF5DNr8OdXoE7k0Y1HkRl2Yv9QgY76SWs\ne82o1MooVEvIVYonm7VK49nBbv3l0X7kxdG+4LPnh53\/BZwx99fPDXhSFOGQeD8\/Dp\/pLrTiKxDz\nb0E91Q\/HzBASATHKWTd2i2uoVwp4XN3EPvFBrYjwahr+zAoOyHMtuUhAA0iHPfCtJBBaz2KDpLtR\nKSJPnNjMI1sussl+Rpzb3T5NHRzUvbVay7\/dEDS1T7al2M7wsbsmQDrwACpRO+Y0H8Jq4MKsugeL\npAdLNhVq+TWS3irWvBasOhkk56YRn5WT\/wyIEucDdjwu51Ek6XoJcGpjDUe7VRzsVLG1VcY2cYmk\nGSQflEouY9HjgnlGjxm9BoxW+8Ou0vlG4WrpUWRDHBbQyZCeKftgNnDAiLvh0g0hPD+HmH8BuXQc\nm4kwlpkpZGMh7BRz2C5ksZyKw5dKwJGIw5lMYJ7Ym07hYKuEw+0ygtEwzDYLXA4rC\/N9O+YkrP3W\nRz8E\/OJAcUL7thbmYDM2xAK6TYNQiHthIYAB5xiWfA6EXDa4NFLEQn6EFr0I2I0IMnI4dDK4\/W6E\nGBmiVgOb8F5pA5n1DJzRJQQCHtjmjCyI2SiHyyRCwi9EwHIf2UAfwrZueGdvY8nRjaizp\/EvcC\/r\n8shRWYInJVL85Y\/InLvHAsa8wxjhXodU0AX7rARhnwshjxNuRoUoeWGYeEqvg85qhspuhY6kEiLg\nhdUk8gRsMRyEjaRFoeYMSsQ8PKyHuIi7ehGlp476GiTDF8BIL0M0dB5CbiuUZHwxk+3HLNhOdqK1\nviZs1NeF2CN+Whazpptkm6RZTPAwo+xlR4pUNAa7yYjAgh0h7zwYjQJGjRJelx3DYhE0jB5WlxVW\nArngsMDE6Fgox8wYgjYOTQWz8msshF7SzoJoRe+zzyZVx4lSeKUu5JyzTzw4+91Zng4MRKLzf4Df\nfBc27Q0YZR9gxTeAPZIcBS4lH6EQG2bHTNAxBL1iAmIhn\/W0VExersWMVgWlTALplAQyqQgGAkyh\nwm4ZllxDsKo7Iee3sQnRpCgMtUp46dikuhExya8LfvSkWfFyW1YCA3WfqSsSW+iPVDP8ejXFO6GA\nj3PjLOAS+YBifBg7BJI67uOT7oyRTTMFEQGVSUTQqabZJQy5FSjExchFBuHUdUI1fomFkY1ePDZI\nLzckj87nxrnvCSTcX\/y0o49+yfYqv04Bn1Uk7DLTWwpNsLIyiipxyv8AYUc\/OdqELNSCVYXc8iSB\neohFy10oBG2n4uHzDSH3XGR88Ledb3Ri0ARXFwdP6K5Neu8h7u5HgCw3HTGxhQ\/J0neTOTj4HWBq\nBF5TL5TCdrY\/RhWP1KKLTWp6rA3SkQvHNJ23ehnwGu+0BC3dpy7mFknl9whae0B\/z8ivQkduJzbt\nTTICupEJcjDQcxacvrMsHO0TNS052XmNN07qP2lGellgUnSQMl9nTS+bswRQymsjSXIxz9xF3+1f\nsZ74qJUt\/PhDtujH45xz6ndy5yMFFhgm20\/Nyg7M62\/CZbhFErzKFpx3\/3csXH\/Xr1\/vwJ83sR+T\nfuJCq8t4ux519Z\/Sy4F0pA3qiSsYGXjvnwkO9v6m8ZN34NuSUXKxxaS6KrBobkQMk1cidDcSuEjf\nzV8KzjTVVFNNNdXU9\/UPhXtk+Ti+oJ8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mirror_with_scribbles_piece1-1348251336.swf",
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

log.info("artifact_mirror_with_scribbles_piece1.js LOADED");

// generated ok 2012-10-12 17:12:21 by martlume
