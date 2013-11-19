//#include include/takeable.js

var label = "Luminous Moonstone";
var version = "1337965213";
var name_single = "Luminous Moonstone";
var name_plural = "Luminous Moonstones";
var article = "a";
var description = "A moonstone of eerie luminosity.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 3;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["gem_moonstone", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gems"	// defined by takeable (overridden by gem_moonstone)
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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/gem-collector\/\" glitch=\"external|\/achievements\/trophies\/gem-collector\/\">Gem Collector<\/a>"]);
	return out;
}

var tags = [
	"gem",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-22,"w":45,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMFklEQVR42t2YSWwj6XXHjRx8MILc\nEsNxcsglQeCccgsCGBgYyAY7CJDk4lySS445BB7PYBKMDcNjOxjbY3Tg7vZ0S2q1WluToihK1C5S\nlEhR3IrivlSx9n1j7QsXKd8ntTrBIIDVPW1MkAIeVFUqVP34\/7\/3vuVzn\/v\/dKii+DV7qG4ORfb7\njiR98f8MmOuqX7Z19WNLk5mR79mWxBGmyNYNhvrnzxzOHKr\/ZGlq3dZlxlFlbjoeh5ZAM45Asw5P\ncTZHPv5s7FTVL5u6umTpCgmVg3COIvIT3\/NsnuRdnhRcjhA9Dhd9Dj+8Uvk\/\/FUz\/RqGYb8lCMLX\ndV1\/z9DUqqmphKWrlKMpLIRzFVEMDG3oCpTsMqjsMaji0331JnpKwGLf+pXRoSi6oGlaC0R3qKko\nABwAOMLSFBqq56qi4CmC5EmMGijc8BqK6ugjqjMckW0D\/DVCqmv4dOfE47A\/feOAPM9Toii2bwEt\n02BcyxRu7fUAoCtxsi8y2kiX7IDu6gHZMkO8ZoeDuhMOam6IN5yAaNkA0vSY\/qb1pkANw\/g9CAiO\nrq5pHV3X+p7rSKHvmxDQ1YCCiiD6CgCUGG1i6V4IFcPrdohWvTFaDm6iEoTYhR\/gDdcjO7bLYobN\nEQmN4373UwH6vv8WBAQ52JNFEUL2QS3ol5eXU3uovVQQAoaGYk08OwyJNgR0RgBs0i2OJu3cZNrJ\nj8e90miEXQQB2XQ9umc7LGqaPE7oIv1Hrw14dXX1HZIkMZCHPYIg+qoq9zzHkcD9KwgZgt7nG5o2\nMnVjZA0dE0lT9sWxPFGYYIxVAGB+fNk6nV42Ty4n7bPJqF8eAfsDl+q4NoPalkAahki\/PuRkMpkH\ncF0Yg8EAJQgcMw2DvXpx+LapOorADvEOJiOnPa2SIozCHu9hVXtqKuMJioymQMHLVnY6BYBjADiS\nqbFLtnwA6Jo8YRkSbWgyr8ky\/5evA5iBFkNAaDNoNSyw3RM5pkZ0m8dkAzlhG+W80CxWxYt8R7k4\nwfVyih2eJ2Wvj7iX4\/ByIjMTkIPA4uI4xJBRyA9GHt0NbA5zDQ53dIkxNYUfyqqkypr2F69q8ZXn\neS7ofwqoYrFWqyFbmxsHO5uJ\/RZS2sObSIpuVbNcs1zh6sWWUM9jUvWUVitpQSvuqFb10PTxegBy\n4XKschNwHoYKNwYtKTQ4zBvypKOKjK0ooiFqks5rKiZo2lfuXMEvAB2WZYlIJLKxuLi4Homsbq5F\no3vJjfWjNlI8IFq1E6pdK1ItpA5Ae1zjnBAvcpxUPZbk8oGmlPYMtXIACsiajD1rOgm8qaPyI40j\nfADnSmAgEhXRFHR1yOuaymgaynre7\/xSQJqmf\/vo6Ci+sLAQ\/Z+xvLy8EX3+PBmPRfe3E\/FUt46k\n8V49T3TqVbJ70aY6CMa0yxTTOOeZek7mLk40pnpscLWs6Wri6PpH28ZYEhlfBE2AV0SHVSWb0TWD\nAVZR+lChdKOIatpv\/FLIZDL51U8CglgDkIm1aGR7IxY92N\/bznRa9dN+v1VC++36AG12sV6dwLo1\ndtBBBKxVVNBmUQdhdJsFUwRgk8n4kpN5n1Ukj1IVl9Q1m9R1kzCMIT40VNwwJcXz3rmT1Wtra3\/3\nSUhg9drKyspmNPJ8J74RT2fPsqcdtJ\/v9HtIG+22O4Me2sbaVBttc61+U2r0G2q939SraNOo9Fum\n7XtjK\/DHuKb6mKZ5qD500aFhY4ZloGAIQA1LNoLQuZOK8ABAb38S8tmzZ7FryHj8IJZMniKd9ukF\n2i\/V8UHtAh90a\/hggOB9uoKjfBHvy+eDvpbDB8MMgZknFGmPp9NLxnFG7aHptw3TaxuW0zYcs2Pa\nw45hK\/Z44vOuf7d5ZSKR+AKA+vB\/U3I5GttZ3UikdzInp8gAPyviBFIkqdY5RaF5kiJzNM1mKFpM\nUbR6QDPDbZq14gznnCi6PwHdvmF5QdV0\/JrlOiCshukOQahyMLJp16\/cueXMzs7+JoCa\/yTk06WV\nzYXY+v5KcjeTqjdOcwRVyJJU7YRmO2mGw444kdplBT7JiXKck\/TnnGw941V3TtT9vO2P5NFkem75\nQcn23ZLl24jtDy9sX2WDkcG6vt6z\/a\/dGRJBkH\/N5\/O5W7gDcBxnQf5hWL\/canW2svlCZkBnUxRT\nPqT5+i4j9JKsRKxzChsVNHERNLkn4tB8KFnuzyQn\/LHsjZrBZFLzx6OsHXpnVuAU7NAoA8CWHciC\nH1ot0314Z8B6vf5VOLK4rmvDAL1SoxmGzBaKhaVE8mg2sX0czZezuySbT9ICskGLLQCHroo6+Ywf\n8jOiodyX7eFPZdf5gRKE\/6aOph9oozE7mk6L3iTIWKGTs0dG3g7UkumLELCmmyTpXn3priPL58Fo\nkms2m1UAW06lUkeLoC\/Or65uzq6t7c1ubKUebe+dbPSJTJzgzqO0eLHCyJ0Ffog95nT6gWgLH8mu\n+iPZN7+jhu67yjh8Rx6F3wPn6Gg6yjhj+9gMjVPDVwumJ5GuP0RknekZ9g\/urGKn03n39PQ0s7S0\nFLvOQdAXny6vJp6AYpmLbx4+3trNzJ\/ks+sYnVvB+eICJddmGK3zkDfwe7zFfCh6wvflQH1fCs13\n1LH9tjp2vi2NzO9Jvo6F06DohNYtoOSHDqIMmbZmll9lfP58tVqduQW8KZSl+JPn0eRcLL7\/aCN5\n\/HFyL\/e80TtdxdnzRVKszFBy4z6rd3\/CGPiPOIv5ruCK74Fp7rcFX\/+WGOhvC772nugp3+UdPm+F\nhjye+iXDlUbTyzFh2kpd1gg6CP78zpDA4l+vVCrrLyFBT4Q2z13bvHn0aGv35NFBJhftkdcqzpPi\nxSNaaf0nq\/d\/wpn4DyEkZ\/Pvi57476InvQ8WDRDuA95mfsyaZEw0WdAHr4dF3Q+cBgDEhsbTV5rp\nAKt\/v1QqHby0emk5MR+Jbj+JbRzcqjh3mj+LDJizJVIoPwFWf8xoN5BAyQ95i4SgH\/AOC8F+yFo0\nhPuI0rB7A6H7oMc0ccvVQK+ctmWd6ohqXwmCP3hlSNB29q5VBDOdGxVjuzMvcvFhcv9sNlfM31gt\nVG4hod33WAP9iDUGUFEY8PwjSkV\/hvK9n6Nc++MeVZ\/r4oji+abienpHUlAwifiPV57UQkhQNFu3\nufgU5mI0tg8r+nFy9+TB9kF+Nlc+j4CqvlYS2D1DK42HtNp+QGvd+4ze+zmIe4TcvYdy3ft9FsDR\njZkOUX3axktbGIUE40kI4EhcVhrO1dWr7\/202+2\/yuVymduKnnth9czGVvoXWzun9wHk3DlyFgFK\nLuNc6SkuIPOUfDELiucxITUe9tkGtPQhAHvUJWtzXQKBcIttLP+82ctmcbo8mkwCVtUGnK6\/+1rr\nF7Bm+TqEvLZ6ZXUTtp0bSJCPABLavdbDT6IYDUC582VCKC0MuMoMgJnpkdXHQDEINt\/FywsAbhnA\nrTbR7Fq9k0nUWoc1ikHC8dhnZGX\/tVeBYOb9DTDJ3b\/Nx\/+G3ErDyl7OV47XGr0M\/PAKAAAKFRbb\ng8KzNl6EsdgZFKBqK83+WaTVPwVwxxsXraMtpL6XLCI7nKoOVMOgwSj2N68NCSbF\/1Aul9PPwKT2\nFhL2x5l4IrWwn0pBNWK1dhqCRgHEKrAQAOduopeF9+D\/4DPwWQi3Xaru7BbKW+kKsmVYFu963i8+\n1YIfQoJmnlmJRLag3TAnYeHAkSZRqOzCjyaqjUOgTipea6cgzG3Aawi2WW0cbFVqu9slZBvC7RWK\n8cOz8yhSq++Nx2PhU2+b2Lb9961WK7cWiyVh4cDqfgJaUGT\/YHunWElCVSDAZqW2t4k09l8GuL4B\nq+7A53aLpcR+obQO4Q5Ps6upTGYRrJdKb2RvR1GUtxqNxtnSyso6bEFQzfnI2tZevhCHH4bK7BYr\nWxAk+SKuoa7vlxJ7hdLGfr4QO8yeRVI3cEvpdHoBxhvbHSNJ8i2Qk+dgVv58b39\/5fD4ZCWdL6we\nF8uRdKmylipXYulKdT1drW40cDzbo+l1lGUfMKL8L4Ks\/qOi63\/NStKfkBz3x+BdL+ONbuGBF\/4t\nx3EFGDiOpzv9\/na10YiBiPcHeGpAM3MMx30TAH52G\/BwI0DTtD8DBfSN24DXAP5Lr\/O+\/wJ7DWbu\nMDWBngAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gem_moonstone-1334609735.swf",
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
	"gem",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("gem_moonstone.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
