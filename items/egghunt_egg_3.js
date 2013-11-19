//#include include/food.js, include/takeable.js

var label = "Pysanka";
var version = "1342483399";
var name_single = "Pysanka";
var name_plural = "Pysanka";
var article = "a";
var description = "An 'oh-so-delicious' and delightfully decorated chocolate egg. Inarguably tasty, this treat is not affiliated with any known holiday or group, religious or otherwise.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 150;
var input_for = [];
var parent_classes = ["egghunt_egg_3", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.33"	// defined by food (overridden by egghunt_egg_3)
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

verbs.eat = { // defined by egghunt_egg_3
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Gives $energy energy. Grants 'Chocolate High' and 'Sugar Crash'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		if (pc.knowsAboutEnergy()){
			return {
				energy: Math.round(this.base_cost * floatval(this.classProps.energy_factor)),
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_eat(pc, msg)){
			pc.buffs_apply("chocolate_high");
			return true;
		}

		return false;
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

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collect 5 different chocolate eggs to get the Egg Hunter Trophy!"]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Chocolate High buff (chocolate pops your mood, energy and imagination)."]);

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/egg-hunter-trophy\/\" glitch=\"external|\/achievements\/trophies\/egg-hunter-trophy\/\">Egg Hunter Trophy<\/a>"]);
	return out;
}

var tags = [
	"egghunt",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-19,"w":24,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALCklEQVR42u2Y6VOUVxbG\/Q+s+Tg1\nkzEzyWQymSREjcYYDYu4IQIKqEEENQQXCIvsKDQIyL4LgsqiICLKjuzQyCqCLLIIKHQEZZOmgWYR\nUJ655zbdQiVOmcrkQ6q8Vaf67a5u+b3Pc85z7+uKFe\/Wu\/UHXjOieWVWAipx9XT61OM5IdXk41lh\ne+hTYb3bY+Fdlw5hb+GIUNwwKRypnzQuP9egnGJatPJ3Aer0GVLq9B0yfuwnTp9oeSGZEb3EsuqZ\nx0TLLJ7ESvDQexAPPPvQ4N6D1qhejDZNgUGit3gYWZZ3kHIiX3Tth6y4y0duGEfrp\/w24HbP\/lUd\nPoPCx\/6jEAWOYyBhSgb000u8YDX9aB6jBXMYTJxBb\/Ak\/w59l\/2GQ7ZF9EHSPMUh+0pGcNu6Amnm\nxUg+dhvxR1MRdShREnogRuCjH\/3rQVu8+gSdvsPoDpDgSbAUz0JnMHhhDuLrLyFJXoA4fgEjF4Dn\nEQsYOv8SA2GzeBoyjZ+CCFKMdu8BtAb2QVw\/KYNsnIT4vhQdqb2oDm9CimUuLholIfy7WPjpRkg8\ntIKM387OmKdK\/UVjouE7UoxUTGE4expDCbMYjniFkShAHAOMxrO6InsVxwIjF2WgA+Fz6AuZYkqO\nocvvOVq9nqIl5Al680YUVo\/US\/H83gSG7o6jp2AAl02T4a8XCU\/tIDhreAv+J1yta6dx97UhPM2U\nYLRuChPtLyDteIHJzllM1DE7ExcgSQIkN4ExVpIU8PcEO3IJ\/Cb6w17gSZB0UcV+NJ4Voda1A3ec\nmlEb0o6u9D4OOMwAh6rHUBxUjQD9CxzwjMY52Gxx\/WUlq53aldn0gVmLLmYt9dNg0jRrfhng5KM5\nSB\/MYSxrAeO3gfFcVtkMNE0GKY4Dt1ycPYfx2llIamYwUjmJ4fIJdKcMopwBFtndQ45VOZ7XMcBa\nBlgzjtLguwrA0wSo7ioxU7NZtQyuwqFBqdqlXdLA7pbumhqdmp76SpI1DykBds1iiiDvLEBaCkiF\nwESRDJIUJRXH8l5hunseLHL4DdGNSR++4E7c8+tYAihlgBMcsCS4RmGxDNAF5iq2y62+49TUyOxF\nk8cTPoE9bDCol4bOM1tzGGDHrELFyfY5TNUuYKqaQZaAq0l2j15l10WLgPQ9dkP0uwkGKGmcQo1n\nGwpta5HNomYpYKpzHvwY4FmtQDjv9MSpLadhpmLXqIArsa0TVDg\/QOXpVuSdqmKAQ+hhTU4TSdNJ\nvTVWtlxFUmiq\/SWkVa8wnskUvMGsZQMjyXi1CLeoHutfcd0kGgK7UebYiAKbu8iyKFsGmGSTCV\/d\n83Df7Q\/HHWdhpebMFLQDhytyqF9ZbFsnqXBuQYjBZRQzC5YDzmMkWqaOJH0BE\/fml0Ny0HlI0ljs\nLA7JaClTrJr6bwo9CcNo8OpG1Zk2lDrc5wJk\/Fi6DLD5RhdCD12CQNMPDtvdYanq+Bowx7rSuNiu\nDuEH42C7wxX3BI+4xZR9vAdZbPSzPqQoGb22OL0FryBtkFlIlnPFHs5hJBK8Z+l33QGjfEdp8vgJ\n1Do0IMW8\/yqQalaIpsQuBeBg1Rge5vYgyTUVtltd8aOK\/WvAbKty0bVj2TDfYgdHDXceCbIhEbPA\nnYCQ2VJ5plWWf7EyJQl0lE3teNW8rC+7ZPU8cZb3LalPKUBpcJ+lAqkndGhAvk0NMi2EbKvLw9Xv\n05DqmI8+4TD6K0bRmvMImUH5vP8Ijg2JZIX+ukPK1LCOGh44qWYDL90Q3Hfv5v9wCwvYmKMpuGCU\nwHON92KkLJDJSipJ\/jzvMRoEqoGr068D+twzUCKwAwPPv6JF9dLMinDNNAuxR1IQefAqok0S0ZTS\ngebMDqT534aFqsMioF36Ct21BpaRh67gyKYTOKZihXDDWGZxF1OtAb765+GpG4y7gk5uGW1zZB\/1\nJMFSiXNmeXzQlFL1xY5zuLZz8nDuBPV2iX09cq2ruHo3judy9aLZFhdGWxyb3qgTCbif2oows0ty\nODbFNsYrdNZ8l36cgRltNIXJt+aIMLwCsttupwDOml6IYPD0B6kfaX8lULJQXkOZUxhvm1EUDRdt\nbQ2LcJWnW\/hgkLU0uTdPFiDxh0xcPnwDEQevIHBfNM7tCUWGdz7yIkoVw0H2mqo7rFyh9YWeRO9L\nQxzccBSHvzkOlt68F623OcNeww2FzBayioaGQCm8CVZeQ8VSjLVMY7x1hlczy1BqEdrWSDkFHGuj\nWycLkXqqEJmni5FklYmQ\/ZfgszecR0t1wn0EH7ugUE8R0rs+34s9qw9g\/zpjGH5tgqObT3KrzbfY\n45xuKOqY3XSmoz9MypB1dEKh6aTXwdJxSB5MK+px8iCqz7TzniNb809Vc7gM6xK0pfTwqeX7L5vc\nK1a34MF2jkCjSNy72Qzrrc7L1aO14z9a2K2kB9aLOLD+MLf6+81mOK5ize2oYsFd4\/KQ9yVNI03i\nLfMi\/p5s7E4e4ieUpTVYOYZKrwe858jWdKvXcEOLcIPsgJBgmwrXXT5I88lDeWItrLY6ccCTqrba\nih1ky8c7RTs\/04H2F\/ugt\/YgvvvqCIekuLltXYlE00xEGSXCWy+MW+6i7cP3UYKuYUpRfLTFPuGq\n0DFKXs\/KxTyMb57IR11Mu0y1JXDl0fVw1fSF4\/azKE+oRUFMGWLdE+G01y192f6r8pF6+tZPdmHX\nZ3ugs3o\/qB\/lkGS3qbIlj58f1e3hpOmBDItSnou8mJqlzEYK3wrPJjwrE\/NznrzoxHzVJB3taSIO\nRseq3tJhZHgU8h2DtjTKPD+TMGRE5CLaJU6ksFa+vvlAxVj1X9ux7RPN15BcycO8J2lwaLppqiki\naJuivqKi61ymMilKVmZZl0GUP8DPed15zxB39BYuGV9H\/PGbKA6uRkFABUKMLsqUW4STD4WNxhmJ\ny\/6zSr94Btz0gYpkKSTZrcsgaXBouiluko\/n8OeIdPMSbh290nsKXepVyrbrx3JQHdnMz3ilATW4\nYJjAj\/IUJTStNBDUc2TrUjgaCnPVU0pvPEGve3+z8qYP1UCQZDf1pJaSPvS\/NEKYQSwSTDLAnsCQ\nZJrNIajomnYD+pxspIcf2hnq4tvQVzaCqMOJCN5\/kYcw5RxFCZ3z7Le5KU4qbwUnX+vf3yjY9KEq\nVD7aCvV\/a4CmmyLIcIMJQg5cxmXjZMQcTuEQVHRNYUuf045AalHwkrXpgkIO5r0njJ\/vSDWnHR78\nECAPYqc97gi0DHuzrW+ATN\/4D2V8+091qH28Q6bmp9rccqedHjhvEM8hqOg63CCOW0g3ELTvIuIt\nUyAq6eeKcTDWa3T4tNsmgPWW16o56AgQ5hD16+Borf3T2pVr\/7ZBtOHvmyFXUw5KilKgf7\/JDI47\nzzJ1QrlKdMj03hsGL50QZPsXoSnjIVx2eSvAqNfkRycqW80z8DcPbfzZ88bbrtV\/Wa+0+r11knWr\nNkLjUx1ofq4LbaV92PPFAeiuMYDJJnOYq7Kp2+oCd60AuO3240q5afuhOKYcdxJq4G0YwhVbCiYv\ney2X4N\/8XxwyyPUi5Q\/VYaHmyCOBeohUkRe9p8\/p9EtKOWt5IjUkB1mR+ew1G+4GvsvA6Pli2Q7x\nWxfZveav64LXvLceOkr7Ya5sx1WRF02ipZoTP7vJlbLf7Yo4z0Qk+Cbjis91+JuFyaaUbfw\/C+D\/\n11r959WrCJRZLtn+yW4c+frEz2xbWhbqDgh3jEK0W0xjgEW45e8G9ibrtT7XE5hsNBcwVYRLi1kY\nRxa+Vaa9W+\/WH2j9FyAzSh1jw5FAAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-04\/egghunt_egg_3-1302028823.swf",
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
	"egghunt",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("egghunt_egg_3.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
