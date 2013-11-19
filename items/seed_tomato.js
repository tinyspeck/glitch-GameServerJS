//#include include/takeable.js

var label = "Tomato Seed";
var version = "1347677150";
var name_single = "Tomato Seed";
var name_plural = "Tomato Seeds";
var article = "a";
var description = "A packet of heirloom-quality tomato seeds. This can be planted to grow <a href=\"\/items\/237\/\" glitch=\"item|tomato\">Tomatoes<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 20;
var input_for = [];
var parent_classes = ["seed_tomato", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "tomato",	// defined by seed_base (overridden by seed_tomato)
	"produces_count"	: "14",	// defined by seed_base (overridden by seed_tomato)
	"time_grow1"	: "2.5",	// defined by seed_base (overridden by seed_tomato)
	"time_grow2"	: "2.5"	// defined by seed_base (overridden by seed_tomato)
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
		'position': {"x":-10,"y":-27,"w":22,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKkklEQVR42r3YeVSU5R4H8P6+mymV\npqVpLnlLy\/V0re5cM6+a7WJ5LS+Zpaa31DQTN7S0rgu5JKCC7MiwDyCLjPAO+zAMM8Owzr4PzMAs\nGCCY+r3P+84wMgTjUOdcznkO2wE+\/J7f73m+8z700Ahv93raqcHrbreJutOlp247tVSfTUn1dcqo\nXksz1d3eSHWb66kuo4hy6oWUU8unbOpKqlNZRlnlPMrSeoNqb75OmRsLKZP0GmWUZFN6USalE6ZT\nWgGbUvOTqCpO6JmHRvuG3nYMXve6zbhz04BfnFr021Xo65TjlrUFPZZGdLdJcdMkRpdBCKeuBnZN\nFWyqcnQoeLDKimFpKUJbUyHMDXkw1ufAIM6Cvi4d2toUaGquopITSo0KZ1dxx9y2K3C32zgMUId+\nhxr9NiX6OmToZZBNDPJnkwQ3jXVw6mvh0PI90E5FKaxyCqSaaG8m2MaCQVgOqrLPjg7oUBSx7K1F\nINsJ9Nlw71YH7vZacbfHgjvd9Gonqw13fjbjl5smsoy43WVAf5ce\/U49+sg\/0efQos+uJj+uxi2b\niiwlejsV6O1QoMcqRw\/5Wk+nErccetTdSBwlsCU\/yN6ST6okx70eM6mkCXd\/NjIVvHNTj1+6tASv\nwW26kmS7++2kmjaFa9tJVW91tJLKNqOXVLanvZGsBleFzfWuKptETKXplqCx3Kvfi0cJLAixNecx\n23ofp8edLt0IODnBuWB0X9K4Hjeuu43GEZhZQnBiAiM4gwvXRVqhmwBjj2\/AqIC5NYEhufxA5Bi2\neBZH\/xk4uk3I0m5EhuZjpKuDkKbagFTlh0hRrgdbsQ5X5e8jSbYWia2BSGh5D\/HN7yCu6S3ENL2J\nmMbViG54HVHSlYisX4HLkuW4JF6GQvVhhB1bPTpgaej8EN7pBSgPe9m1LryM0p+WgHf+RZScXYwb\nZxaCG7oARafnofDUXOSfnIO8\/z6L3B9mI+f7WeAcm4nM76Yj4+g0pB15Cqkhk8E+\/ASSD05E0oEJ\nSAgej\/h9jyL2mwAUx21A+LnlCBY8wvpGOHaMX0D9nncp7dr5sL3xErM6Vy+BddWLsKxcjLZ\/LoTp\ntfkwvDoP+qXPQ8t6DupXnoXypdmQ\/20WZC\/OQMvip9G0cCoa5k9B\/QtPQvL8JIjmPA7hs+MhmP0o\n+LMCUD1zLCqnj0HT1vWIWD8PF7YvmeJ3BbWB8yj9mgX\/F2Drni04vW0Jzu9ayvIbaJVyKIf8xgiT\n6msYpN7DYLw\/DE6dAA5yiDu01cz5aFdXwqauQE+HEhc2LUb4ruX+AzvqOQ67jHsfZ\/Oe1N5f4aQj\nTqpTL2BuF\/rg9sKpKphD3CSrwNkdLIR\/vXw0FcwCfVDTVet3n29eOMsAzlW1brMLd9ON6xoOpxmC\nU5aRClZCJcqntxeXglcG+Q+sz4Rdzr1\/+HYOOXwtjd44cvhadeXeWzoMjt5S5uojuE5lKfm8igGG\n7VmGyP2vh\/h5D6eOsdRnwKkuH9XNEF8RhI0\/zkBs9pdMvw3gBvebB0fuZjpI0BVU1OYgYu8\/ceXg\nG\/4BO6SZrHZJOpyqslENw\/68Z3CY\/RKuZG9zD4MPnJxHVgls2hoI8sJwad9KxBx+y19gKqtdnAYH\n2QJ\/h0GuSMPunMlQt+aMOAz0ltJV6yCpxkpwdAyzaQWozQ8nwFWIPfJOln9AEQGKUmFX8gYNQ6PX\nMNA4aUs8JE2xEDfEQNoag8u8NSMOgxdO5sLR0cum4aOuIAKX97+OhO8C\/Us0FnFaSJuIjS5t1bDD\n0CBPwMlzT+B46CQcOfE4tl2diN1pM3AqbzlOpa9GSCILB2P\/jm\/jVkBUG\/trXKsLR4dYh16MksRD\niDr4JhKPrfUP2CZOCWmrI0Ad32sYHHWFkH2xHsKZj0BMVsz2CQiOnMgAN8dNwCdRj2HTjwEIXTcB\n1xY+Derfb0Aa8S3a6gvduGKCI7BWLoMjLwNg14tQknAA0YffRvIP6\/wE1qWEmIXJcJI+GsDZStMh\nXfAUml+YDPnsx1AQOAFfZU\/G8ZOPo2hRAAM8sTkAIdvGYf25AOzdNAbsyX9G0tSxyH2bBXVJkrtq\nXLS7cfRLALqCvMSDpP\/eRcqJD\/1LNKba5BhTbRIBVrkOX1k5WhdNhWLpXFi2roFy0TQ0PfMoJLMe\nQe3MAFTNGMcAk\/4xDgVTH0b4sodxdK0LmPDknxD3dAByAl8jOFfcd+EKSOzPR5e5EdyYPYj\/dg3S\nTvmZCY2CRIoG0kcHPQxtOz+CbMlM2L5cB+sXH0D96txfAaPfC8CNaWMZYM5TY5Ax5S8eYPQTf0T8\n81MgiTlJcIUMzkxw9GsSJwHmhX1G+u99ZPwYNAqgINFzbRn+tRzGQBYDNK1hMVs8FFg6faxP4JVp\n48Dd9bEXztSQD6epAYURW3H1+3XIOvsJuJc2PzgPEpzYKIj3XFuqpXNg2bCCAWpJjPotwMuT\/oCC\nLR+4cddgkuaijWy3wyRF0eVtpP\/WI\/v8p+TjLx4cGIw18TDWxHnuVBXJcDSw8\/NAqP86\/vcB3Tj6\n5aaZ9KJeWojrFz9n+i\/3wmaURO\/yA8iPg6kuxZ3haqD5YBnMZIutG1b+ZmAkeU8DB3BGSTbayNAY\nCLCQADNCg5AXvtU\/oIEGilI8l70x+FNoVsz\/XcCYWeNRdeprN47DPFmwyCgGyI38D7LObCTQ7SiN\n2+07chkE8Sw9P4ZUkO25tjr5HLTMmYj2dct+MzBx4XTICqI8OIM4E+2tJVBUs1F8ZQeyz22i+w\/l\nSXt9BwZDVTRLXx0No5DtlUR0+z6BYtViqOdOGjWQPgeLd27w4PSiTLIyYFFUQF6RACpmF9N\/Nwi0\nMnnfg4G6qmiyxWleMamjvgCtqxahyX2T+AtMnvkYCj9aDU11ihuXwTw00tWlwaokWbAyEaXxu139\nR6DVKft9A3XVUUG6yihyf3IGxaSBDEdBFXYIknlT\/AJmzZsGaksgwbGZLR2M0wlTXRUsi0VF4l4U\nXNwGXtwe8FMPxfgGVl4J0VVEwizJGjEmmYXZkB3egsb3XkEduZ8HA4uemwTeu69AGn4IOgaW5Y0T\npkFLcPRjt051DZq5P6E6ORjXSf+VJeyFIP0I9QBgZIiWAE3iDJ8xaeCy97oZpPQZR6a0PttrGO7j\nXDBtLRsaQTIJq0K0FIehJvUAuFE7UJEUDGHGUd9AbcWlM5ryS6QH04fgvGMSg2scjMuFqd4bNzAM\numFw9EPLTk0t5CUR4LP3ozh6F6rYByDiHPMNVJddpDRlF2Ekv7TDHcutw8QkOomYG\/O8bgYaZ\/Dg\nvPuNwQnu43R1GQywueAEGY6d5KjZSfcfJDnHHb6BpRcpdWkE6Z9YTyxncM1DcA1DcJIBXOawOA2N\nIzB1TRLU\/EQYpXkMUFZ0GpwzQbh24VPSg1+jPvcH34lGxYsgwHCoS8OY\/nLhrntiUpsniQzB+RiG\noTgt+R6No5eA9F\/22Y\/JIb0d5Ql7HcKsozt8V5AX5iALKt4FaMovM6DfOwwMju\/CmRoK0KHiMziL\nvJzcvV+iIHwLeLFfnRGmfvPgqDWAU1E\/QVlyHkryuZ78IS\/cKIdBV5cJU+N1D2xgGRsKkXNuI1Uc\ntd3nY7f\/AdcttgKhB+SxAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263970919-8379.swf",
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

log.info("seed_tomato.js LOADED");

// generated ok 2012-09-14 19:45:50 by martlume
