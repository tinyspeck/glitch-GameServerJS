//#include include/takeable.js

var label = "Rubemycin";
var version = "1352323063";
var name_single = "Rubemycin";
var name_plural = "Rubemycin";
var article = "a";
var description = "A compound made out of red, green, blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 4.9;
var input_for = [164,166,320];
var parent_classes = ["rubemycin", "compound_base", "takeable"];
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
		'position': {"x":-10,"y":-20,"w":20,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJJElEQVR42q2Ye1BU9xXHr7WdNjEN\nyz5YdhdYQEFxYe\/y3F0WBmvjZEyT2WTSxvaPyvSvTtvMbCdppWk6uUmbh8bASoRUngsKFWPIaiIi\nanqTWowP9OJKkPdVQAEjXEWKGmNOf+fuXrI8AsvjN3OGBde7nz2\/8\/2e8\/tRlP8qBT1VQGKJV2n8\nSjcJNtBoTKXZkeTkoMlPKQOayhsVqNL7QG27yVFb+p1LAmdYmU0+FAKNioRV0GMzQ2+Ghf32KZWQ\nTRV\/hWBAlRDA3FGg\/joA1G976MUC1ifFcYeT4mCu2E3AEPBUmgn6Mq3Qm2lx+QF+w1Pv3QXqjWGg\ndowB9e7\/gGKuA\/UHPnuxgBfMRkezhYbZ4nRaggi3j17tg7MKk7d4N7hEqFevw\/f+1Eeyd82bQcdl\n11Jsc7OZ5hDkosUE7ekp0JqexF2wGBkp9tGxIuAFS7II2JdhYSY\/oRzsy8i2PvL6dXjktUF4+G\/X\n4Ec5ffD9F3vdSwF4Mc1AI+AFElcyLGKGrqWni2Isi49mEK7WtMabvQwLP\/0JRRCkKBpj1UVjoCoY\nBYVTgEe3DTupt29iXbJk21kqf4wjdUpK4X7WgraaZAohL1mTfFmyukvjovSSODrS07x\/z7TO\/nxd\nDdChu30Q+QSshIgH63P7LaCKyOvCOwRaYOYL2J0cHUQAeYTssXlhDiWu5RHuWHL8BHTgT9wNWSRA\nVDcKBwVU9jVQBQTwLQGol65y1PPzU7nHmpAl1SICYdaqjDFeW\/Hb9sAWWk\/5AwI07rUfVHXlN97f\n3xwB6i9ESL\/nA85ka3qcnsCxknJRLBLkzMKYa+0Bhtp1z+uJ\/7jhBaoggDvHvdnMuYqA9oCtxkwL\nCOgxJ9jxNQrmcoZ5QhjTO8dcq+w+Q+UT63lrBJa9PADLX7gCyxAM7eh18nMLAfwdP62gyxMiszBQ\nncR8nXuMq\/hqso1Ya2yKURQBEUw2ZvELn2B6M832+cuucJxdnntLWLF1GB594zqseGUAfrilD5bn\n9AP1GtnuLf3TOk2ZIYr2b1su0XxjAQGlFiaptNlidKE\/dtlS2QV5l6z8rl1bcUdQ7xoDRf5NkG27\nAT\/++xA89PJV+MGLV4B6oRem\/p9jKWvtJ1Ljxc7g3yncptWiUqd6nE\/Z7IINNqoW9GFV91hN2Tio\nCkdBnidA0JtfwgpmAB566dqMwwRmBuur25YKXba07KLo6CDJ5\/ptluzp76cB63JRnSCi5oFDR7IZ\nUnTbrXz3dtbDrwzanyrtEc7xAwx\/YzS7ewSCpvodGjJaR1VCjPNwkkHsIK3WxKwZMggoGlT5ksx2\nH57pzHKfbuPrzneCp28I+Bs3MQR++Bazh+UcdX\/OcYu9l3xoB7ES7K+YvW5bGnc2zchJIsJoSIpz\nniQlIUFiS1wU3MdNHQ4ScOhcBxxp7gL+y5sgjN+F23fvwVdfP4D6pkvcVFPmfVaCJryfjuUCmQc7\n09OYBQHWc91MPdcFGMc9PdAxOAy37twV4TDOdvYxU\/uvb0AQhfDvFAOLIpLCfx78wDfRNJlJaWRY\nuQUB7mu86Ea4BpK9xvZeERC3GLOIgCUNp5lAWp2HtLoWa+KEypvMRtGKPkqMC2xgmGkVHWsKqjje\nxCHgZ61X4EzXVWgfuCHVIAyNjs0J6FMt6\/H1YknVJYZoF24t1ioR1vyPGjm1ZXRx\/edC8ZFTUHuy\nBQ41tUFjWy90Do6Ap3cQLvYOiVHNckygA0MnsSH0RenMciKVnn\/Liy5KDtpYvtnx\/L7tbF7dEXvx\n0TNZNf9pdiHkgdOt4P68BfpHRsFzZVB4\/4THVfrJ+YCsAr1SyiJakDSs9mekfbeK4+o0+nWNOuGZ\n9gj4Ba+HnzRq+bAdesgsecI+03ZXsk2O6k\/Ps5g1\/H3O1k7aIPZnNG7fZCNmEbdVnGjmmmZMB0PZ\nx07rYNNlPWweioQnL4ZDbHUIQy3RakyNF7A3k3rjpmYxINXGf6CGzE+18ERzODzVEg4\/PaWD5DrN\nkp5J0JQRci8dw0kHKczirFs7UW8VKqAPhILlmAbSP9FCymENrKlRLdGpzujE0cpjNQnHk9eKfocD\nBAIG3OKUeXJnZJkKtxVW\/ysEoiuUgjxPzslyZfTiAWkOM8WTDoEtTYKsoWPmN8ms2CqjlU45o8hT\niP4k2y6zK50KYd0JretxLkx4us0rIAzyWtjYrHM+1hQcFMCoL07P+xNW292mWAY7hzTEos0s6tub\nDqr59aQeUTQI9msioM3XI+E58vpJsVa17rnGfTwkYQuTbg+wY+B0jdcc5yxJ\/ILhjAfVDutxDfgD\nbvYDlMRE3uOYrXO0pSdLLUw6g7BoK1+kJwktVtPCL6mMtWre3KCBdf\/VwUYuDKQtRjj0y43NYcQv\ndWBuCJ0xC7mbokT1tttSnNjW\/NWKfojDA9bjXmOMC6\/d0IKw5XXZzIHV5tr31cRqQsHGasVMISRu\nK2YO4fBvGcSaUuo0YKgNmSSm9ec1+rgatdu2QzMNnoDw\/iMW3mzh2cXlO1hNvnqbZcVWhYDxQzWk\n1mtESNJpRCgMzBzCpR7RgNEdCpGVCrHjJJKOtP6U1mW\/FAG\/7NXDz7sj4PFzOqf\/uQVFwqYYxJFr\n6g2Xd2AI8JQXWaYU0HIQEjNpPur1SAx8jZlDuDV7Q4Con1PlyR3kywgbzoTBs10R8JvhKPhVnx5+\n5gmHjM++rVPJpLE2W63JLA4QVQmrWOzLM18efcfSFipckeVebzSQ7UZQEzFz0hZFMMN+tfhvxD\/F\nh0aUqVz4RTC7WArPkuw9TWp1w9kwsBwN5UPylcxzfwxjDmyIc0rnYjy3nEox2Seu3zLMjsCPnu\/I\n9OqdCiGiWAnRLhXE7AkRgTDwNXafiBIVhBZ4fTPSpWQSatViN0JIBJPqNPHjUCCAYHlVA3mbYsD\/\nCgTPy2g90y8uA4Ek5q3aIec0BUrQ\/VMJ4UXe0O1SgqZQST5UPjFQIOjKyhBASNx+dACsUcx4bLVq\n0kBwMjMhS7p9lW67FjSsimtrcJBsq9wV\/E6woMhVAIZ8u9wle1uWNfV96gIlJ5YFERjWptQ2dbtm\nbpkIKd3TzO92a6GLQJIv4A7dqQDte0ogP\/ngotnbIUK2WEwztrz\/A66ZvcCFSZFyAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/rubemycin-1334267337.swf",
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

log.info("rubemycin.js LOADED");

// generated ok 2012-11-07 13:17:43 by martlume
