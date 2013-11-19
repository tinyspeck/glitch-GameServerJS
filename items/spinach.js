//#include include/food.js, include/takeable.js

var label = "Spinach";
var version = "1354597897";
var name_single = "Spinach";
var name_plural = "Spinach";
var article = "a";
var description = "Hearty green spinach. It's strong to the finich.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 3;
var input_for = [7,10,16,89,103,329,337];
var parent_classes = ["spinach", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_spinach"	// defined by crop_base (overridden by spinach)
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

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

verbs.activate = { // defined by spinach
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Useful for reaching hard to get to places",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.isInstance('humbaba')) return {state:'disabled', reason: "The effects of the Rook hamper the power of the Spinach."};
		if (pc.location.isInstance('tower_quest_headspace')) return {state:'disabled', reason: "It's already crazy enough in here, don't you think?"};
		if (pc.buffs_has('pooped') || pc.buffs_has('super_pooped')) return {state:'disabled', reason: "You're too Pooped to even activate some Spinach."};

		if (pc.location.is_game) return {state:'disabled', reason: "Nice try, cheater!"};
		if (pc.location.is_race) return {state:'disabled', reason: "Nice try, cheater!"};
		if (pc.location.is_puzzle) return{state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};

		if (pc.location.isInstance('puzzle_level_light_perspective')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('puzzle_level_light_perspective_rem')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('mental_block')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('mental_block_rem')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('blue_and_white')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('blue_and_white_bonus')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('radiant_glare')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('radiant_glare_rem')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('color_unblocking')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('color_unblocking_rem')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('level_quest_winter_walk')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('level_quest_winter_haven')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('level_quest_winter_walk_part2')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('level_quest_winter_haven_part2')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('mental_block_2')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		if (pc.location.isInstance('picto_pattern')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/buff_apply
		self_msgs.push("You can jump so hiiiiiiiiiigh ...");
		// effect does nothing in dry run: item/destroy
		// effect does nothing in dry run: player/custom

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.buffs_apply("high_jumper");
		self_msgs.push("You can jump so hiiiiiiiiiigh ...");
		this.apiDelete();
		pc['!spinach_activated'] = true;

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "Activating this will give you the High Jumper buff (You can jump really, really high)."]);
	out.push([2, "You can grow this by planting <a href=\"\/items\/325\/\" glitch=\"item|seed_spinach\">Spinach Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-21,"w":31,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJl0lEQVR42s2YaVAUZxrH35nhGBgO\n8YjXJgYloqCAEOV2jKIoK6KcisggRg5RQOUSVERukUMERCQMh4IiAi4VglfGC7OeE5NN7W6ZLJt8\n8NNWTVU++e2\/z9vNOIOpxCMG01VPNXRPd\/\/e5\/g\/Tzdjf9A2O4LZOkSyfG4fRbE09mfbHCKY0jGG\nYUGyaM5JbMQ5kbm+ExjBWwTEjf+tP+b0qQFQD\/luvCWGEYJFMi2Hm51NgPFMawy4kFsiC3kXgLrn\ngGSOm5nGNZ318f0YOG5JTD3ugMZwczcyzItlIEA4bWdYvJth0S4D4IIkphkXqDlRLMQhimko76r1\nHuRwxoDLDzGsOyKad+ZbBqRcUgsAeotkfTzX7EPZLJd0lu8Yy0YErxGQUxyDD3lq4daxgEElDGE1\nImAwmdtOOr6Tad+KRBiHzdgIdoQerlu4czTftjAs22\/w1JI95KVEEZD\/H15r2Pvvo3CnCaFX20f9\nDsnhXuJh4zrmRvnjQeZKkuG6jW6uEh\/ObV6cCBlcNmrlDMoDhvMcLOQow8YGEXBNEd2PjrvQ4vj9\n30j5n4eWbuCcwLCywOAdva0pZfDMEquTQwfTg4MLxXP8uBt5yTVNDCsHi2sVQx3CczFbIkBShcM+\nms16rZx7MZwcgANyL2yoMgBuahQfxmEWJYvH1vKCKBU9xL3uQ6FeQcciCDC2mSG0SrwmvMpM\/A2l\ngcs2pnodLet7US54J\/DJHhsqvt\/SLD6Mh9V792gRkAfXFIuAHxNcYK4US7PE362na6IbxX1MnZmQ\nBvyaoOLXKBjjwtDLxdxNgvLjr6UGSA63vVN8MLcVB8TcWldsABTylq5bGE\/n88TfxTQxRNUxfHpK\nLlS34HVa4GtLyxhAMsdNopd4DvF80oeMP1APqcwVAdcVioBc78Z0lmhaJJ3ffJIht9daXCyZ797X\nBFy4m4VQYeh4aPW2gLqBM1Xu8n0GICGXCHhbOxWAmiEgXwgXQshW0t8uO8TFjclnqvj1VOV5vTbC\n9YGU216prwAozGxUtUL1bmFKkgetXiaMzS9Lgg0lUqwrE3OJe3JjPUPSOcqvBgk9UCJ4KeKIBMoc\nWhyF14nLUoJYSEtIWnzoPjnnRcAASo0lKUz7Uj3kq5u\/TfQW38+l8nenGy07yLCqULQAWq1yvxhq\nfwrLhlIpwo4SMIGGVVJenpRga7MUawjSj67bWGuC7S3m8KZr3UeFO\/Ag\/eaUFLk9VoipN0Eg5aHH\nzucT0K8PEKRHI8YjETd9URhLC89BXrX+1FNX5dGDzlrAh8K5guDX0\/GYeimS2snDVVJ4HaZc+5sd\nNtdaCq2Qd5tg8myCWoa0VjPsPmOB4EoJlqQbilI\/R\/4SMI6lvTizGVctB+Og0Y2G\/OPh8aKc9CQQ\nT\/rbk3JJSZISWSPDzg4TxDbJ4EOVndVpB79dpoIoL6BQR9P5iKMy7OuxQfpZK3hTNOZFi4C\/GWYC\n0xkDeu4d2zm4PHBp4Xmnhww7Rt4kCO4tzxwx4ZdTGJdSHqadMcfeTmsszZCg5PMpcE+UgMZ9eJPH\nIghy1WEZ2rV\/QWChDM6xAuBvT9rOyUw1ZqgcheSe29xkEFlVi2gcVPUZzz8JVpeLkF6kd14ZTMg7\nPwLfP2CH3G47rMyVoZggF6dKhRYYekwKf+oweX122NNtAzdSCadolv9yiaFRnM9qekAuFe4kuJ9Q\ncawtMXiOw8W3MaT0SBBLxbHlhBTh1RIByovy0YfMn7y4rFSCokuTEF+nQFi5BbLOToQL3deXiiiA\n8jG6QY4Td6bBL1MCl9hXAHzuTXrzItB8txRWTaORhs9w7lS9e7qskaSWY30FeeEo76kSbKqVIJ6q\nN7lDhuRWGYKosjmckha0olyCYApn41fTEV5uify+KcKeLzqwXIoQOld9\/T1kd9picSKrfqOxi6Qn\nxDV1tH2l88HBFPEnFUhuVqBsaCJKvpiIfd0KpLeZIbZehh2tpkIIl5eRLlZIEVxN4O0KtNx7HyFF\nclRdm0mCbwp\/mmg2nzDF3rPWaL3\/PmIrzEYiyn6lil+h\/WnnUxfgoKuLDYWjD3lMnQwHqX3F1cvh\nSy2Pw60iuLVVVLF1VNEnzVBxeTJqCC6SPHj44jT4pEkQfsQUqS1y1F6dMVL5xWRdZrtc+cbvvFxI\nKZl1xnBBlHNBozNgRI0U5ZcmIq3TBv5U0UGVJOQk1jGNZkhoNkPGGTnU5MXM05MRf9wGeeemYXGy\nBHldFigfmJDf8cgeVUMTft\/XB48EZuufzdSrC9kI1zwuK9x8SA\/9SLDX1pjgyLUpqL89DapGC0RT\nCBOpm+zpkGM1jV6lF23Q+mA24mpskNY8CbldM7A0XYqiPoWu\/eHs6uY7H+DwBcXb+fLgvYspudHA\nmTafXgu4uZPOKUlqElot0XJ\/JkqpgjO7LFHYp0BMhSkCqJeXD05F8\/CHUFUpcKB7JsHZI7LE9Fnh\nBcu+rsdO2qbbs7Rl3W+Yiy97aefdgIMuIl2LO26OhptTcfzLGSjosdUU9yt0UaUmWJEpQ9OwA45f\nm47tdVY4OjgXpf2OT1WVZj9XXZpSff5bV1QOTn27781zIpmK+q2GmyMZQWpc45gmu8NCV3PZDh2P\nPsSpr2aqyZO6lJPm1ckNk651f+NCIbfD7hZbqO944ECnw9MdJ8zReN1+5Pzjj3H4vE01+6O3sivM\ntrjfUlsxaEuQDlDftdcW91nr9p2xTC7un9N\/9pEb8s9ZIafDDv2PAxBfPfVpZqscnQ\/ccfquB7I7\nTP\/4L2FlAwpXXgQl\/VboeDgXpx866g71WOoyWs2Tm6673vrslhMy2uTPinpnoO\/rkJ9DC0z+l989\nAQP\/WIm2Yc\/x+URS2KtQkVFBWKNL64z2u\/NHDnVbofzi5PyB75ah\/soipDebo\/WWH0q6fZ+mnjJ\/\nVn5xFq4+iULD5UXKcYEs6JUrCy4odGU0I55\/7IHmW\/OQSzPh8SuzR4b+FQz1TSVOaXyg+Xcytte+\n91MqvVhd\/HoDhn\/YMX5fwoouyGcdPGepLe6fiN5vfNFwzRGZbXJUDNhD82QLhv+Tgrv\/zULDYCgy\nW6eOXP5uK+79mAM23ltep0V10YVJlGeBqPrcAWnkrUPnPsCNJyl49NMhNA1Fo\/dePO5\/n4O\/P0jR\nsXex8Qot6pmuHfpnGIUyFL0PwjH8fQautvuis8EDjW3LMHhsHi7XLdCwd7mVDdi73v4hRcNDOXxT\nhcGqj3Cjf73my0sxmhtqX823QzGu7M+waX8sUA1fisy\/0ez1i281\/wfPbSbFuKmCMwAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/spinach-1334341689.swf",
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
	"crop",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("spinach.js LOADED");

// generated ok 2012-12-03 21:11:37 by martlume
