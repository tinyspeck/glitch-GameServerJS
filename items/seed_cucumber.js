//#include include/takeable.js

var label = "Cucumber Seed";
var version = "1347677151";
var name_single = "Cucumber Seed";
var name_plural = "Cucumber Seeds";
var article = "a";
var description = "A packet of cucumber seeds. This can be planted to grow <a href=\"\/items\/151\/\" glitch=\"item|cucumber\">Cucumbers<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 25;
var input_for = [];
var parent_classes = ["seed_cucumber", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "cucumber",	// defined by seed_base (overridden by seed_cucumber)
	"produces_count"	: "17",	// defined by seed_base (overridden by seed_cucumber)
	"time_grow1"	: "1.5",	// defined by seed_base (overridden by seed_cucumber)
	"time_grow2"	: "1.5"	// defined by seed_base (overridden by seed_cucumber)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	return out;
}

var tags = [
	"seed",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-27,"w":23,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKm0lEQVR42rXYeUyb9xkH8Gxpk6bS\n2qrr\/tk0TVsrTdNarZmmTdu6RVXXNsrSLF0PRe2ytEubAxIIzUVJUtI2Y+vSjByEFppCwhkIl23u\n6wVzGwPG2MY2vo0vbHyAORpIvnve17HBAYz5Y0g\/JUH54\/M+v+d633XrIvzcnbIzi88dv4WZ95mY\n214DMzuuYWZdKmbaoWD8dhnjtw4yvtF+xmsSM15DNzOu62BcGiEzpm5hHMpGxq6oY6yyWsYirWRG\nJTzG1F\/GGMUljEF0k9F15zOiqkvx69b6g2k7Fp+7fivmJ8yY8xrwjVuLWZcaM2PDmHLI4LdJMWEZ\ngM8shtfYA7e+E+PaNjhHWjCmaoJjuB42eS2sQ1UYHeTDPFAOU18JDL1F0PcUoJOXyqwJJ5MVb7jr\nt+Auh3Nw567fjvlJC+Z8Jnzj0WN2XIsZpxpThPQ75JjkkBJC9sFjFBGyCy5tB5waIcbUDBzKJtgV\nDaBIwiINQE0DFTD2laKnMm1twDmPYsucaxgsksNN2XHHb6NDUaTfzU+OYo6NJmFv+4y47dXTYf+k\n6HoMmGUfwK3DDPsQLg2mXSOYZh\/GqaIHUlLUKfLcw9FxaSGuv7424LxreM+cS0HAUcJZCWbBHUKx\nVzw\/YSKYkbvq2x4dHS1duYYiOhK4dpeKIqvE9JiCnk3OpcCUfYhLA8pVTFKUJyz9mBjt41LCT0im\n+D8Da4vg+HDybad8BZwhEDHCsbkYhnPeh7Mv4CaXwflMvRTJEWSfextrAlaNvJNMB3zz\/tDhmd5H\nhXEvyg3volT\/Dkp0e3BLuxvFmrdRpHkLN0d2oUD9JvJVbyBP+Tpyh\/+KHMVO3JDvQLb8FWTL\/oys\noW24Jt2KrwZfRqbkRWQMvIA6XTIuf\/rS2oCl2h3JdHDL+jp3iq2v4ablVRSO\/gUF5leQZ9qOXOM2\n3DBsRbb+JWTpXsTX2hfwleZ5ZIxswZfqPyBd9XtcVf4WacO\/weXhX+Oi4ldIlf8SF2TP4vOhX+C8\n9Bn8e\/DnKNPHIf2LrTjV\/9iPogZafLmMZvoCdEjnjvbuVYzcuQLV\/CUMz6VCfvsChr45j8HZzzAw\nk4K+6XMQTX2CHv9ZdE5+hPaJ0xD6ktDiTUSz5zga3UdRP56AWlc8qp2HUTkWC77jIMpt+9HlTsfF\nlOeRFvu76IEa\/3lGM\/P\/B1bYYjjghYTncDnh+S1RA72uZsY3LsTkpJg7ExO98Pl64PV2w+Ppgtvd\nSacdLvo\/LlcrnE5qyM5mOMaaYHM0wmanfmevg8VWg1FrNcyWKphGBTCa+TCYeNAby6E3lNHfBdA6\nq\/HfQ88hPeHF6IHTtn7PjEO6TKUGqpSdIGylTt2rVL8tWKkSqtQBqtLwSvVS4\/bQhPEYurgp49Z1\nYFzXzjVzq1KIi3F\/RPrxNQH7MDsmD+DGWZw6hJtegqP+ZhsMx5kDOK9JxI0+j6E7HKdt50ahm34\/\n0stjrxcZH27dEz3QKsaMY4hwgf7G4nSaOvA6k1DSGQepOie8+Vol3Cxmcb7lcPr7cDT+XJpWAoqg\nIeDVo9QBkrYlR7ckuMWPTll6aT+QhiaDsP8yDhR8F4m1P0ZS3ZOI5z+ONOZlOE3t95rvQPiVLoNj\nr5SNmusejl0k3IYeaEQV+OIEtanT26MDzthEW\/yjIpoEstBkOFXyLD6s+wmS6p\/EkcrHEVO+CQfL\nHsInNU\/DYWxdkm9B3OJ8C+FGAjinuhluYy9EgkvISKR++tGONQDN3RTBoVAx7C94DKcansJhwSOI\n5W0KAQ+WbkRe2+5liiECTh3AsWuY2yiGqPIyMj\/chutnd5ZHBzSLtkyaujBF+RUshjNlm3Gy7oeI\n5T+8BHjg1kZ0SD6PWAzBK3XS2jV2D0eLLF1xL3qrrnDA3I9fj26jmTR3JU8YOzlgsFLTanfieO33\nVwTGlz4Onap8xWII4VQLOHaJ9ZglYPJP49qp7cg790aUQGNH8oShPWxNEopTucJYCbi\/eAPOCn62\nCBdeDCGccgFHrwHwmAbQdCMRWWd2oPBfu6IH+gxtYWuSz9yPRP5TEYH7ix7EDWbXMsXAcFEbY2HK\nhhDOJmeB\/WjOTaL8exVFn70V3UbjNQizfXrhoh0u0N+EfZ+vCtxX+CCEvSlLiiEQtQbYQ7ha7t9u\nUx8as48h55PXcOv87iiBuhbGp29ddjJktu5cFRhX9CjUQ4VhxcDhFEFcDWyyau79hK3iqrT3KP\/e\nROmFPVECtS2MV98Wwi2eDDZdEz6tezoicF\/BA0jhbw4rBhZmV9RyOCvh2Lc7G6HHqYprvtiPgpRd\nKE99Fw0Z+x5dHahhWjwEDOCWTga2Wj\/gP4FjLZtwlNmIQ\/ylwPfz16OsJXZRvoXj6P0YDiqacRp1\n9RkxXP7xLu1Ffebh1RcGj7YZHl1rxMkgll7F4eqHcLJzEz5oWgAeLGGR6zngoYJHoJeWBnCyIK6S\ncAJY6JXTThVt6OcTKpby728QpO1Dc1ZCFEANdXhty6qTgd91hIpmI133AvCDBspBQQD4Xu56XK16\nics3q6wqhGPfh0cHebCrGA5Y++VBLv+q0g9EB3SPUIfXMKtMBiHXQjKati+bg0HgeznfhlycFY6T\n8GCWVMChboVhgIf6r2K5\/Kv5MgatN45GXrnG5NWbx9X1BGyJuCYF+5tRwecaNAuM5T1I+bgUeEXw\np3s4HuEquM8e5oEy2KkNqdpz0fR1HJd\/dZmH0ZZ7IvLC4Bmp3zKuqiNIyxLcSpPBIK9AMv+nOFy5\nASeEDyGmNBy498a3MCTKDMOZ+ksxpumAsjULTHYCBFfeR8O1eHTkJ64OdClrqdE2R1iTgriFyTAs\nycHJsh8gpoyuunApMLPylcAHo\/4AzthXAicBVcLr7LWi6uoBNGUloKsoKTLQoRC86hyuhkvdFHFN\nWm4yDPSmUZN+jLviA8XrKScXgDE5D3Mw9ouWse8WjOJiLoKqlmtozzvO5R9z\/Si6i89kRwQ6h2uS\nnYpqOFWN9+GYCJOhNlCp1N8UfVm0mj2FQ7wHcIzZQNAA8B\/Z6yBqPx\/CsV+1HCPtkNVdRGdhIuXf\nIbTmnkBPSTKzKnBMUQUXQVZekxrCJkMQZ7lXqZr+QqRUbA67YhZYWr8PBsKx3wSNdNUOdRuGGy6j\np+gU5V8c2vITIS79eBWgXHDWIRcQqinimrTcZLBI+WGVmtewG\/E3n0BM\/ncQX\/A9VDTGEu4m9KJC\nuu5yAgqhbEpDT\/FpLv86C5PQV3EuMtAu4zMOGZ9QjcsWw8KVLsYFJsNiXLAY+rqugMfEoZo5BmX3\n1xyO\/aJqHhRwfVBR8xnaKAe5\/Cs6Awnvn55VgDzGPsSDQ165sMPdVwwrTQZzCBdeDOyVGkQ3Qzhd\ndx5Gh6o5oKruPPiX3qE2s5egJyDhp0TeaOzSCsY2VA6btIxDrVQMy02GYH+7H6dncSysJ5\/Dsb9j\nceyRVaWgIvXvqKOFQZhzzCMu\/zjyx3TbYJmBxVkHS+mUcaiViiGAC2++HE58K1QMYTg6bOTsSobD\n2ejBW64fQfXVfdSsj6SKi0+uvmrZpDxYpRWEK4dVUgaLpJyLVqRiCMcFq7SUq1T2A7mJ5q2FcjYI\nCx621dCyyjRdi13xs9v\/ALLBd82bhBXiAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353191-1344.swf",
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
	"seed",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("seed_cucumber.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
