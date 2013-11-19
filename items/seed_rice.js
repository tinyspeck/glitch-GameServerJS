//#include include/takeable.js

var label = "Rice Seed";
var version = "1347677151";
var name_single = "Rice Seed";
var name_plural = "Rice Seeds";
var article = "a";
var description = "A packet of rice seeds. This can be planted to grow <a href=\"\/items\/216\/\" glitch=\"item|rice\">Rice<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 19;
var input_for = [];
var parent_classes = ["seed_rice", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "rice",	// defined by seed_base (overridden by seed_rice)
	"produces_count"	: "12",	// defined by seed_base (overridden by seed_rice)
	"time_grow1"	: "0.75",	// defined by seed_base (overridden by seed_rice)
	"time_grow2"	: "0.5"	// defined by seed_base (overridden by seed_rice)
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
		'position': {"x":-11,"y":-27,"w":22,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKgUlEQVR42r3YWVBb5xUH8CRN06Zp\nykynnWlnMs1LH5uXNn3JZOJJM\/Fka5pMktZJE5PFcRKvIY4JxomJ461pGmOCjTdssPEGmH0XSFcI\nMEgIAUIgxCK0oX2X2CTg33M\/JIGwAZFmemfOcIGX3z3fOd937r3rrhWu+QkrtzTmguPcrM\/Ahbw6\nbto1wk07NdykfZALWlVc0NzL+UwKzmuQc15dB+fStnHOEQnnHBJztkEhZx0QcGZVPTeurOZMPRWc\nQVHK6eU3OZ28kNNKr3O3yo9n3rXeC5NWLI35oBmzfiPCXh1m3KOYdg5hyjGICVs\/ghYl\/OPd8Bnl\n8OqlcI\/dgmu0Bc7hZtg1ItjUjbD018PcV4Px3koYu8tg6LoJnbwIY7LruFWRya0P5x5Nmg+OY57h\nbCwoi5gNjCPsMyLEkFpQJjFJ0Am7GkFrPwIM2kNQBbyGTnh0UrjG2gnbBsewBPYhMSijsA4sgMdV\ndTApq9FRmb0+YNgzvCHs0hDKDEoTQe2Ym7BREDJooTAjHKDwjyPEwAYKPWZ4uEeHafcYhRZT9ABT\nzmF6CAoHPYhDQw\/DZ11N9\/yDaRB0DEMuyF8fcNapTg47BzAXMLGlpfpj9\/wSz\/oNlEUdgcYQ8mjZ\ncs+4Ryibw5Fl12CKMjppH6DE92PCqqIS6GNlEDD3IkAZ9psUFF2sJALWAdTmHeheXwZd6oyQo38Z\nzoBZn57V4O24IcJpWE1GcRNxOIKZewjXvYAzLuB8VAY8MO\/QG1gfULg5I9S0GfPN70diC2a59xAW\nvYsZ4duYakrGpGAzgg1vwl\/3T\/hqX4e3ZhPcVf+Aq\/I1OMpfha3sFVhLX4a55CWYiv8GY+Ffob\/x\nAnTXn4f22rMYufIMhgs2wsR9iQvpG9cJ7M3KoAAGL8RibuAcZvvPItx3GiHlKcz0ZmO6JwtTikxM\ndn2LCfk3CMr+jYD0GPwdR+G7dRjetq\/gbv0SLskBOJs\/h0OcDrsoDTZhKqxNn2Jc8AkciosoPfYs\nBv7z24cTBs74TNzslBdLr\/m5WczPhjAfnsZ8aAJzMwHMTXsxN+XG3KSTNRFroGg5UCnMekYRdg8j\n7BoEX9Nhhwphey9Ctm6ErHKELDL6\/xAKjryBk9sfSxwYCtr\/T8BOBsxK+Qu+S3lyQ8LAaXs\/N0Pb\nTDhgYdtJiG0nJtpGDIvbiGtxG5miLYNOFQp1pDkWujbIurYbgUhj+I2d8Buk8Ok74NPdokaRscY6\nvuNx5KwHOGlWeKZsysVOdcV36uRtnapcsVO9Bhk7XTy6Dop2dsq4tW20ebfSfTv0SgFO7HoCOXuf\nXgfQ0oVpu4ptITOR\/S0OZxu4PVOE80dwvjvhxuJxrhEJO2WGOyv45cXZ1GeS15FBOaZsfYubbwwX\n2XxtqmXLGMUt7m93whll+VBcfRcmRSGcI81w62QY6azEqT1P4Xz6cxkJnsPypInxTpoPlIsnw1Kc\ndREXOxnGFfE4\/SIumjVTZz4a9yXh1Ft3w6qqprNZTMAOqNtu4HTq07jw+QuJAacssg1Bk4wBVz4Z\nlPH1tgznYbjFJTXL8yHc\/0tc+igJisojcNDQ4BgSsSWWVmXhbNozyDvw4jqAxg4C9v0gzWCRX0JL\nxq9wLeUhDLXkEoyDqmQHRkTH4dbLIav+joDPIv\/Ll8oSAxplGwKGdkwQZqVmCCxpBq+xG05dJy0X\njVaGHjjHZDGcQ10PxfE\/oObQn2kWrIZekoXmgw\/hygf3oP7bjawGO2uycW7fcyg4+GpiE03A2J7h\n17dhgiArNUPAQkOqz4HJoA+hUAgzMzMs+Gs2HCKwgkIO1ZnH0XLqRdj6q6E89ySqdt+Hsk+S0JH7\nCgzSy7TEMjTmpyJ3\/wu4cvi1BIH6tgy\/rpWhVmoGv0OPtS6PxwNDXyPGqlMgOfBriA\/+DpqqNJh7\ny2jCFtDQ2gCPoRvCS2m4+MWLuH5sU2JAHwF9upZlM1yk3txWTE9Ps6ytdvHZ5IFutxumIRmMLSdo\nkm5io781guMnao+hC1xBOtXfyyj8OsGRy6uT5PnGmm9vBhu9h0xNrpm5ubk52Gy2uHvLiHQBNxDF\n1cGiqqUm6ULD+d24\/NUrKP7mrQSBWjHn0zbH4TwmWu6JiTVxfOZ8Ph9D8ffBYJBl0W63w6isJ1w9\nw5kJZ+lvgIu6uObkFqq\/v6Pk2+QEgaNizqttiR1bkvNvw2U1JJw5Huj3+2P3PJC\/71dI0FJ+guH4\ntztLvwAu6v660x\/g2tFNKMt8B41ntyYlAGzu9oxJYptvZ\/YTaPvXI9C3nEJo0nMbjK\/HaJYcDgfD\n8T95FB98zerVbRBd3ou8fY9B2ZCNcWUVLXE9AWUQnNvG6q8i6z2637n2wOAZEcFDSxw9GdQlOyH8\nLAmNqb9A\/acPQn5xE8baL8E2KmNL6HK52M\/oklqMozCqmqASZIHL24aCjx9GzuZ7cPLNu5HzzgMM\nZ6J3YwvVo05RiYYzH1H9vYmqk1shupiSAHBYSK\/F4sixJaVj6mocsHbPg6hK+Tkqdj+A0l0\/w80d\n96No+\/24\/tFPcfWDn+Dy1vuQv+XHuPDuvTj\/zr04m\/yjGLD82FMMZ+qpgEXdxID1BOTrrybnw8SA\n7uEmGoVEcZOINOvxHwSokZwnXDn7smChl3dddwUE57ez+qs7sw3Nl\/asPnJ5xkQbXEMCymBz3Jik\nbz39PwObcl6P4YzdpbAMCqFpLYDwwi5Wfw3ndqKlIDVjjeUVbHBpqP1HxIvDpbaVfWfR1Bz43sCq\nr5+K4QyKUooSWDViaJovUp2moCr7fTTm7kbb1bS1gc7BejiHRXE4J02\/\/IcgrTgbDft+kzAw78Nf\nQHTmDRhjuBL20UjfVQzroAialnx+WVFziuqPoO2F6asDnZqGZIe6Fs4h4cJYvgTHj0l2muF0bbkQ\nHn5kTWBR6u8x0HgigiuNw+nlRQTkMCjOReuVvaz+xJc+RUfRF3mrAh3qugzHQC0cmib2zsCP5fzk\ny3AaEYUwdqaOSs7QpPI8BEcfRcORR1F76E+o+eqPaDy+EYrS\/XH1FsPJi9knN11nIWzDrVA1nMCt\n62lUfzsgKUiF9GYGtybQPlAD+6DgdtxgFLd42EePLfbdT1lNQVtIb8UKuAWYrvMG+yZoG2qBuuk7\nSIv2U\/3tQuvVNMhLDq4OtA3UZtr6q2BXNyzDEWywMR6nWobrjcdFm0F\/B9wCUAKN8CTab6RDeDGF\nMpmOrvLDqwOtqkrOpqqEjQ51\/p2BX1L7HcYkfhIxq2rYlBw9GXiccSluSb0xnCyCk16jZb5JwGYM\n1H1NNZgKLn8POgq\/QE\/FEc8awArO2ke7PCGX1tvimBTB9S3D9VSs2AwxHMG00qvQdlxhD8ADNQ3f\n0Ca9GdXZW9By5TP0VB5dfaKxKss5i5J2eWUpy9girj42w7ElXY5bpRnGluH4v\/EdzAN7Kw6hPDMZ\ngrPbqEn2euRlB3evCjQryz2W3lIay0soSiONsN5mKI6vNx7XsYAz0gNFcfywILqwE7U5WyHO\/zhT\nXvTZ2qPWAu4mzD0U3cUYVxTT7xXfvxki9cZ\/KI\/ComHoLqcN+n1OmLt91c9u\/wVdkhBxO5VOiwAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353259-3760.swf",
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

log.info("seed_rice.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
