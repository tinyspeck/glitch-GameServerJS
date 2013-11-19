//#include include/takeable.js

var label = "Pig Bait";
var version = "1347677170";
var name_single = "Pig Bait";
var name_plural = "Pig Baits";
var article = "a";
var description = "A sack of tempting pig bait. It can be used to try to capture wild piggies.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 25;
var input_for = [];
var parent_classes = ["pig_bait", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by pig_bait
	if (pc.location.is_race) return {ok: 0, error: "You can't do that here."};

	return {ok: 1};
}

function onContainerChanged(oldContainer, newContainer){ // defined by pig_bait
	if (!oldContainer && newContainer.race_type == 'piggy_race'){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(10, 10);
		this.not_selectable = true;
	}
}

function onCreate(){ // defined by pig_bait
	if (this.container && this.container.race_type == 'piggy_race'){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(50, 50);
		this.not_selectable = true;
	}
}

function onPlayerCollision(pc){ // defined by pig_bait
	if (this.container && 	   
			this.container.game_type == 'hogtie_piggy' && 
			!pc.announce_has_indicator('has_hogtied_piggy') && 
			!pc.announce_has_indicator('has_pig_bait')) {
		pc.games_hogtie_piggy_pickup_bait();
		this.apiDelete();
	}
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from an <a href=\"\/items\/1000002\/\" glitch=\"item|npc_streetspirit_animal_goods\">Animal Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-35,"w":29,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKHklEQVR42r2Y2U+UaRbG\/Q9M5m7m\nppO5meAOqCD7JvvmUhSLCILadrugAgKCIIjsUN1QbLIUIDsoCArFvsnqQku7pWOPncwkY+ampjNO\nz4xJ58zzvFCdnpvpaVFI3nxVH1\/V9\/uec55zzlubNr3n31JV2LHFytCMuTJN3Eiex2aemyk9sHO+\nPCRjrCDAMJTtPTF8zdtgzPLcuWkj\/ybyA6Pm9NrXC5WhMlEYKKO5fjLz5SEZvu4js18elMd1EfKw\nJlymdQfV\/4azfWQo20e3YYBzeo1uquSAjBcFya2M\/dKU4CDG\/AAF9aw5Wp7ejFJrtuyw8CHmy7UK\ndkGvDd0QQIZzNMfvTW+6h3RccZdOHHszPWWhQivPW47JE8MRWSzXKOUa4vdJ4yUHGabKXxyUxUqt\nbqo4OGM4x8d5LNv3k4+nYqnGeU4fIrevekp7qpu0JjnJeJ6\/UvBFWwxU04gxx1cMa4CDCP+DKq1M\nAvJ+6WEoesC0VBXq\/VGVRNgMA1CpGXAdae5C4JftsUrF2TKNjOsOKMCGBDuZQm6OFAXKrXRcVx7S\n87Bas\/mjh5ohYn51IcRtl11lvDhYvm48Ko9rw2UMag4hrA2J9lJ3wVYG8vykGa+Hr\/mYNtjRATrm\nX2uKiwwBSuVgw1HlaoaY6jUlOeIBXGS2PESZ5lFNhO2GATJUAzl+JpqFTp7XHxaYQIX7bra3CjEB\nR\/k\/qD2r1yxs2ui\/MbiSgPeu+yowAhqhZnOKkwLkUuWmQvtyqS789\/zMSqNv0EKtu2m6wklGSmx0\nH73swCjP+3N8ZOVmqExX+MtwsbsMFrrK7SxH6c5wkSdN2n991xeh+7ZXo3veEfz6qyaf10v1+52n\nKxydx4rsPvnoKr4Ziu0xTZ2UvwxHyeu+UHnRGSzLTT7yxzta+X7mlPx1LEa+6w+Tb7oPyZNmP5mv\ncdPNlDrs3JCiPZ7nG\/RNe6RppVkrLzsiZa4iUKZKUffq\/eUf86flaZtG\/jxwRF71aJZfdARnAFwH\nQNNkmYNprMjyk48Cxd46muf3Go6U+2hp\/Zn7ZQiuXUQ36bzsKJ2pTjKY76UAb6bYy51cd3l1WyMr\nrQG66pPWm+dvuC1P6tFhSvY4f\/jSUhDQM4duMFkcJPeyvWQwx1umSoLRa0ME3UG6rjhLS+I+aU6w\nlb9Nn5LZqgCpOb9XZip95OvWAJjCzWQscjUR8IMr+PBGeNwSHDlwzUv6rnooyMe1R2QagKNQkKsb\ngF1pTur4uOGQvBk+Bkc7SE3cHlmo8UboPWEee+nLtTd8ULjxggDnOU4oKLjzaGVUbBITzSLeP8Yk\n8wDqEb4DISbczXgbhNtB3gxFy1JtoNQn7JO2NHsFyPLSmmb\/6oMCThYGTUyjxj2ujQCkRmagGqcW\nTi8vWmMU5Hi+v7Ql2akwE\/JOprs8qA1WJlmo8Rcjyo8ZsCl5t9RfsAv6MKGtCf+Mqj26ESYPKkNk\nBe3sSf0R1Xt57isMqcvowQ+rQ9VY1QHlCNmKXOxNd5HlxmBlEuYgAY3F9lL6maXUXLAzfhBAhO41\noajYUkWIPG3iUBr903vCvmiJkUcAvI8phtP1CAYEOnyyJEhuo1iP6zxlqMhNFe+6eFu5ccFODIlO\nUhu\/zkK9WBEWxfKBViW9mP\/6s33VMLDSEKmUUxMMwsvXBCTwMtMAOcrP9V31koqTu0R\/cofUnLWW\naqy2y85iSHCUyrO2UnXGJm5dgDBFD106gTF\/pDBI2pJdkWcubPxqemHI6WYMobJUHSaLMAuNpCbq\nc\/uk8OhOyQ3bimUh3akuCL0b5kIPaUf\/rrmAceyiQ966ANn8Z6mYIRI310o7ADtS3aU9xQ255o7l\npl53pnlgrZ6v\/HSP5IZuUavgyHapPr1PqcnvuXvNW7oxuHISb7jkDGe7d61XQYRNq\/JtHuEjiFlF\nHjuveChg9Z4LgITionrm1yzuVJV7mbZklKFER7lx3k7qEhwn1meQCq1pBuFbRo5xjCLMJMsNywrC\n3g4Ffw5Yf95BiqMtpS3RWW6l4AGgUkHENrl3zVcpaISBOlJdpQWQ1XH7YBKH9QGO5fovL9dHqnJC\nAIZ4BiWHm5\/bUI\/nVKgBSXV10buUYq2XXACFPXFugJSd2C0lgObOj\/uVHvTu7gwPuNlh\/YD3sadd\nRGi5K2tPWc0\/rr4sb2UMgtPJq4bRyj24dvA69iAALIjcsWqQtXxsS3BS6hOwHdsEurjyjO36ALHv\nEAwI8gAhpVJUrAsJzlr4iGHGDdlZWGKW647IRPEBGSsIlDFsmnrSPSUvfJuCywNoyxpgH7YDd3N9\npV7VwXUquIC9hHlSoUMJOAXlnqFQc5\/L96OFgaoFshfrYqxEH2ulDDGCfGN4aRauVuQlN1PMwc40\nNxpEGpKcJ9Y1+z3Cjbkp56TSi\/CxlMyUHlKuHkN9pIuNuf7qGkIxrFWn9gr79iIervpzGynEOa5W\nKPhzFzPEdfGOK+8NyJ8oeKMZuHV6bbdWiRs2XnDALi2EP2WozZIR3cWsWEMcBtQsH1X3jKh55vzL\nC98q01+gDuKa21f348HclUm4nnbG\/ub9FMz2CqIynPlYIviaN6mLc5D8iO2iP24lHQixuQhzoJjC\nCEa1Z+HysuPWuG4bXL0DqeAq93FNT5anysF2hJllpuoc293e99ufQDUd8483Z8FmyKgkQYZy\/KQW\najKERVG7pPasnZQDqCzWUuVgMXKu+JillGC1xDv+V5FmDrZhUT0W6+pztlHvZxC9ZoKKUCFM0z\/l\nGR3K9zxP4P70\/XI301vVSBqhk25HmWHOTZUcVCkykOml4MyrETlYv2oSuZXl1fG+m3KZh4IMGeHU\nFA3H8ngfoSYg847QLEfcRD2oClPX85w5L+n6PmwT2INZA3syPaUBgOYQ47j8q+GaEh2du1AKepEz\nXQjHHYSHY9YcQj26pqQZln2Wi2As7EwJgo3g\/QCOzLnetdzjJMOf69SohWmn9uKqUbrT94f933Dt\nSa5B9fGOJsNFe\/XFfGoFCmDVptLdVR71w6VGjPmDCHk3ijcfhMcBgA3ivBmIXYNh5ZGfb01drYEM\nMVUkbM15O9Ot616\/\/UW4kpPWUdV4MtUn8XQ3k9E5UBb4OyBv0gmIuwDgzfma5wh8ByFk+eDR\/BDm\nh1PDwSUnVfua8X3sIATkPQioP2Mj5YDMibWa08f+wlY0KXTLnYzIHcb8E1Z\/0n1u867guPW\/y07j\nCwBdiVW\/9sVNSG4Dj7hpC5RpRwHv4PAAdXjOEG+v\/t8ImEZcSzMQit9VdMJacmMsJfvYLrkKt6ej\niHOlRmz7\/rJ269FflYtnAv\/wu0shFrbJYVvDkrUWiUkhFjeStVvuZR7d+e31GMt\/4qnf5cVa\/ZAX\nY\/kWN32bf9zqbfGpPT9g\/Vj06e4fC05Yv7sWvevtlYjtfwfAs7SIbUNJIVsMiRqLuMRQC21K2Pb\/\n+evCfwCVUlkjwK1cUgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pig_bait-1334276204.swf",
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
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("pig_bait.js LOADED");

// generated ok 2012-09-14 19:46:10 by martlume
