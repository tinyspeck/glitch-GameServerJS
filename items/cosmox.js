//#include include/takeable.js

var label = "Cosmox";
var version = "1338857565";
var name_single = "Cosmox";
var name_plural = "Cosmox";
var article = "a";
var description = "A compound made out of red, blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 8.2;
var input_for = [162,166,168];
var parent_classes = ["cosmox", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-20,"w":22,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIcElEQVR42t1Y\/VNTZxa+Wrt1drvF\nTmt3bXGhYAVJyCckIdrJL9vpdH\/JH9Du5CfbnW017rrbbq3b23Z1\/cDdbF1bW0FjW9CCQJAqKkqv\nFJFvbkL4CoFcMAECJlwIqHzYOfueGy4SqChV2Nl9Z85M7s37vnnec87znPOGov6Xh2+TRu59Mc3g\n3aSj3foUeuZ3n8fFRdVolYxoro2pzDlVIo3vxTneTVrztU06RrQOfYrtoQCr16isDp0aqjQKYFJk\nUKdVQXOaClr0G2JmzjsuXccWqzZAjjwB2vRqYNQS07HkWEOmNM6cIYmzZErjmWzZC4CG+zTqFMxD\nAYg\/YpXGk00l8GXyOmjQqcCuk09v7tRI5OK8S+okaElTQ7VGxuG7QbU6ihzG1qkOe5Lsw+E+TnLA\nipQk40MLL3rApkiAGo0MXPoUqEqVmvF9r14f07kxFRxamTlzw\/Mx1uR4\/mqqFIoUCYLHvlXLuEbi\n\/Tqt3Eae0Zh8xXq+SiPlhGeypoUcYHY0FjxwY2KAHqrTygDDeVTyvLxjo5YpT5VDU5qSJ+8YzLli\nZaIB15QqN8RcVEuFkDdolXBGmcDie1yHgDKSYo0YaiEi5AD3DebaizqrmMhIiGa92pqvSOBxY+JJ\n9rJaYsWTF6sk7FlVEmDetabN\/RG3XkOfIPlWTjx6gcw5q0zkZn6P3sfDZZE5uL5Rm2y833BaMZFt\nikTIJ9a5UYsJbRVOL42jESh+rtQoWMzNHPn6aZvJ2vOKJCPOR5JgforrxIHexwPgAdFED987nMQ7\nmG\/VmmTAEzbrVTyGBBP9lGy9NWKuJN6EoUcAC02bBo1SjutEm32Ae3oRASIhKlIlVjH0dp1ijrxk\nvPoqs+SiLHqRyAl3PDneelKewJCcI\/qnnpNrGReqLQW1bcbLLV22tt6gpcHTL18akEQGRK1itWob\n5lilRhBYKCMyc+SVlwx5ZazpdG0bX1TnAnu3H3qGRsA3GAJugLcuOkDUPlFs0XtIHJEM+DnjlZfg\n69JaOMd2COa41g+j4xMwcft7uHadh6UAyM4GjITA8IvvTte66OIGN3zr9ECTbwC6gkMCSLunZ3EA\nIhGQ\/vU6Fdeu16AAC9rlIY1CIdFCDPvM+SfLHfQFRwdUuLzQ2hsALjAkgGQ7e9hFy7u8qTCiwpOy\nxaAEIGgClmjj+ogu5tilOlNRTSuU2N1Q1uwBJwlza891KG\/teqAcjM6epGNyb7OxBWCKy4WoiLbp\nK9k6DiXGQcjwtfwFpkiJQiqBGq0CGTzHM5mlDTHZl1lrYVUT5+oJMDnldtuR81XW\/GqX\/Eydi+kc\n4MHlDzBuf9BS2uKZv+buHYxadSDIPH1wGH7x2Sg8e+wWRH81wf\/80Khpeg4KJpIAJQaf2\/QarkiZ\nKJQstPvpQk5eabQU1rQJ5BkYuQEjY+MwNnkbrrRwlvnWPbLVw6\/c4YPHP\/RD1J7rELU\/AI\/RfqD+\nFojUWgR5lhR7ZDAp6DQKt0AQkgIzy9ndBhIHwZU4OqGjfxCGb40J7K52dc8v6pvbGWq7F5bt7IMV\nxJZt8QD1bi9Qe4f4e1YWLGv3m0OFNa18MUvysqUb2qbIg55s7OqblzzL3+y0Utu6gfooAFT6EFDm\nLqDe7wfqnyNAZUI4PZAIM\/UOG4ZTsgTLQpI872qzDdl9FdndE4B2fxDYrj4oJe\/utua1fJ\/8mb1+\nntrCAUUPAPXxDaD+5MXwAvXvGwwlksWhk5mchCDlqckEXALpkFMXXGu\/KK2n8yqckH81bMhuUl3g\nSmu3EAWnr1\/OBYfp1r4g7e7n6RPVLtN7RU7u10c5mvo98eLOPl7w2nt9GN65iuAgbLUTmcFuBtum\nBcsVYXbG+SojsjvrMsui7JCaTR85V8me+M5uOdPg5jHsWBqRQOXNHBwoZiNTKD1kFOyHRmNasgE7\nGazBmH9teoVRvHs8yPjiUp25oLpVIBCS5+bEpEAePz8CR0pqFtaytaQpDcjiXNIDYtPqmHFR+rHj\nm\/p2q1i7azt7BfL4+BDwN8cgt9weEcrYPDATob539Dr0GhsSBT2Knn0QgAVVbUYEd97eAZXtXkAR\nR5BlJMSFlU38+2ed9G9yeujVn4TYX2bcgGePj8Ha7En+V7nfW1dl3or5gdqsNWIlwasiq5VHXDd\/\n7DhV0cRddHig2u2DJm8\/MM5OaCIkOlzSwLyW3c49uasPntg1AKv2B+EpCw+rD4Vg5e7rhCy8ec5m\nJWqpeepGJ9oD\/xtw9GItXVzfDheJF09XtwgAc8ocYYK83mGitnLwyDs+WPmuD366sxeW\/7E7rIXp\nocXvMXH8tsBr2EcYi6RA++s3jXdue2945NSbpHrsJOVtPxHqPxBwpLIIwv2v0aW5WqzNvh2R+C\/n\n+hl1TuiOxPyuI1zeEOBHJLR\/Ib3lnkGgPrnJLzq4NVkQMxtgdNYEszZrkn9SrBSb21nqbV8YFIJE\nb6aTWvzZ+OLcdZ7LB3msjUhGLhiisyfY6BOT00qwYls3\/dTBYX71pyFYc3zsTgi3k4qDHcw\/SDX5\nYIClPoeoRQH39MERwzOHR\/g1R2+Svm4cCEB4\/NNbhmlCkHA+9rYXntg9ILD1uS\/HI2v+ISItpEdc\nFHCEhaaf0X3Cj6NkoGELRe3j6elQYudCGgJkbNTeAJDDwOwUWLyxud1KEYlYvqMXHsVE3zLFzgMh\nG7XZbaBed4cJsG8Ilm3rgke3d8MKMvcne4LWpQJoFjyE7dKuQFgyPiSs\/HiUE+Rk61RbhUTAFuud\nnjBr79YgPPSBIN7yhEEQLwnM\/Dth5uGxsIf+7DULzx+Q73eQ0O8KAmUJcUv7H8obbgu1w88JvR2C\nSB+OuBVS+0m4sUrsHuQFIc6cMP93\/oGfr7f7fxr\/AcHtsZed86A3AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cosmox-1334267072.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("cosmox.js LOADED");

// generated ok 2012-06-04 17:52:45 by kristi
