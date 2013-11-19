//#include include/takeable.js

var label = "Bigger Blue Bag";
var version = "1352136668";
var name_single = "Bigger Blue Bag";
var name_plural = "Bigger Blue Bags";
var article = "a";
var description = "A big, big blue bag for putting things in. Bigger than 15 slots, but not as big as 17.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1999;
var input_for = [];
var parent_classes = ["bag_bigger_blue", "bag_bigger", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"can_specialize"	: "true"	// defined by bag_bigger
};

var instancePropsDef = {};

var verbs = {};

verbs.sort_all = { // defined by bag_bigger
	"name"				: "Sort: All",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Remove specialization from this bag",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.removeSpecialize(pc);
	}
};

verbs.sort_keys = { // defined by bag_bigger
	"name"				: "Sort: Keys",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Specialize this bag for keys",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'key') return {state:'disabled', reason:'This bag is currently sorted by keys'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Keys', 'key');
	}
};

verbs.sort_cards = { // defined by bag_bigger
	"name"				: "Sort: Cards",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Specialize this bag for upgrade cards",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'upgrade_card') return {state:'disabled', reason:'This bag is currently sorted by cards'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Cards', 'upgrade_card');
	}
};

verbs.sort_alchemy = { // defined by bag_bigger
	"name"				: "Sort: Alchemy",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Specialize this bag for compounds and powders",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'compound,powder') return {state:'disabled', reason:'This bag is currently sorted by alchemy goods'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Alchemy', 'compound,powder');
	}
};

verbs.sort_manufacturing = { // defined by bag_bigger
	"name"				: "Sort: Manufacturing",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Specialize this bag for ingredients and products of earth, cloth, fuel, wood and metal",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'earth,firebogproduct,advanced_resource,fiberarts,woodproduct') return {state:'disabled', reason:'This bag is currently sorted by manufacturing goods'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Manufacturing', 'earth,firebogproduct,advanced_resource,fiberarts,woodproduct');
	}
};

verbs.sort_mining = { // defined by bag_bigger
	"name"				: "Sort: Mining, etc.",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Specialize this bag for ore chunks, rock chunks and metal ingots",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'rock,metal,gem') return {state:'disabled', reason:'This bag is currently sorted by mining goods'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Mining, etc.', 'rock,metal,gem');
	}
};

verbs.sort_herbs = { // defined by bag_bigger
	"name"				: "Sort: Herbs, etc.",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Specialize this bag for herbs, herb seeds and tinctures",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'herb,herb_seed,tincture') return {state:'disabled', reason:'This bag is currently sorted by herbs'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Herbs, etc.', 'herb,herb_seed,tincture');
	}
};

verbs.sort_crops = { // defined by bag_bigger
	"name"				: "Sort: Crops, etc.",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Specialize this bag for crops and crop seeds",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'crop,seed') return {state:'disabled', reason:'This bag is currently sorted by crops'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Crops, etc.', 'crop,seed');
	}
};

verbs.sort_musicblocks = { // defined by bag_bigger
	"name"				: "Sort: Musicblocks",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Specialize this bag for musicblocks",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'musicblock') return {state:'disabled', reason:'This bag is currently sorted by musicblocks'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Musicblocks', 'musicblock');
	}
};

verbs.sort_emblems = { // defined by bag_bigger
	"name"				: "Sort: Emblems",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Specialize this bag for emblems",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'emblem') return {state:'disabled', reason:'This bag is currently sorted by emblems'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Emblems', 'emblem');
	}
};

verbs.sort_drinks = { // defined by bag_bigger
	"name"				: "Sort: Drinks",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Specialize this bag for drinks",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'drink') return {state:'disabled', reason:'This bag is currently sorted by drinks'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Drinks', 'drink');
	}
};

verbs.sort_food = { // defined by bag_bigger
	"name"				: "Sort: Food",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Specialize this bag for food",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'foodbonus') return {state:'disabled', reason:'This bag is currently sorted by food'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Food', 'foodbonus');
	}
};

verbs.sort_staples_ab = { // defined by bag_bigger
	"name"				: "Sort: Staples A+B",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 62,
	"tooltip"			: "Specialize this bag for Staples A and B",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'animalproduct,trantproduct') return {state:'disabled', reason:'This bag is currently sorted by both sets of staples'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Staples A+B', 'animalproduct,trantproduct');
	}
};

verbs.sort_staples_b = { // defined by bag_bigger
	"name"				: "Sort: Staples B",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 63,
	"tooltip"			: "Specialize this bag for Allspice, Plain Beans, Plain Bubbles, Cherries, Eggs, and General Vapour",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'trantproduct') return {state:'disabled', reason:'This bag is currently sorted by this set of staples'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Sort: Staples B', 'trantproduct');
	}
};

verbs.sort_staples_a = { // defined by bag_bigger
	"name"				: "Sort: Staples A",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 64,
	"tooltip"			: "Specialize this bag for Meat, Grain and Milk",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_specialize') == 'true' && pc.imagination_has_upgrade('pack_internal_sortitude')){
			if (this.bag_category_tags == 'animalproduct') return {state:'disabled', reason:'This bag is currently sorted by this set of staples'};
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doSpecialize(pc, 'Sort: Staples A', 'animalproduct');
	}
};

verbs.magic_sort = { // defined by bag_bigger
	"name"				: "magic sort",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 65,
	"tooltip"			: "Magically sort your items based on bag specialization",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if ((this.getClassProp('can_specialize') == 'true' || this.getCustomBagCategories) && pc.imagination_has_upgrade('pack_magic_sort')){
			if (this.getCustomBagCategories || (this.bag_categories && this.bag_categories.__length > 0)){
				return {state:'enabled'};
			}else{
				return {state:'disabled', reason:'This bag needs to be specialized before it can be magically sorted.'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity('You have sorted your bag quite magically!');
		pc.apiInventoryMagicSort(this);

		return true;
	}
};

verbs.stack_up = { // defined by bag_bigger
	"name"				: "stack up",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 66,
	"tooltip"			: "Finds all partial stacks in all your bags and cleans them up",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.imagination_has_upgrade('pack_stack_up_bags')) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity('Your inventory has been stacked up!');
		pc.apiInventoryStackUp();

		return true;
	}
};

verbs.rename = { // defined by bag_bigger
	"name"				: "rename",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 67,
	"tooltip"			: "Give me a new name",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOnGround()) return {state:'enabled'};

		if (this.dropper && this.dropper != pc.tsid){
			var dropper = this.container.activePlayers[this.dropper];
			if (dropper && this.distanceFromPlayer(dropper) < 100){
				return {state:'disabled', reason: "You are not allowed to rename this."};
			}
			else{
				delete this.dropper;
				delete this.dropped_on;
			}
		}
			
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true,
			input_max_chars: 32,
			input_restrict: 'A-Z a-z 0-9',

			itemstack_tsid: this.tsid,
		        follow:true
		};

		if (this.user_name) args.input_value = this.user_name;
		delete this.specialization_name;

		this.askPlayer(pc, 'name', 'Name Me!', args);
		return true;
	}
};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 68,
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
	"sort_on"			: 69,
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
	"sort_on"			: 70,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

function canContain(stack){ // defined by bag_bigger
	return stack.getProp('is_bag') || stack.getProp('is_element') || stack.has_parent('furniture_base') || stack.hasTag('no_bag') ? 0  : stack.getProp('count');
}

function getLabel(){ // defined by bag_bigger
	if (this.user_name){
		return this.user_name;
	}

	return this.label;
}

function onCreate(){ // defined by bag_bigger
	this.is_pack = 0;
	this.capacity = 16;
}

function onInputBoxResponse(pc, uid, value){ // defined by bag_bigger
	value = value.substr(0, 32).replace(/[^a-z0-9 ]/gi,'');

	if (uid == 'name' && value){
		this.user_name = value;
	}
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"bag",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-28,"y":-40,"w":54,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAL3klEQVR42u2YeUyj+XnHZza3Vu10\nm0wUNRtVXVVNk80mOzsHczAzDDAM9zFgLoMPDMbY+MTYBoMvbGNj4xuMuS8D9gADOwMDAwzMMDuz\njbKtkqqJqqrSVlWjVF0pTdTNVlWlb5\/fy27aaLJtc\/zRSvNKj94T3s\/veb7f5\/d7fezY8+359v9w\n8\/lmX+wa3byqGVyKyF2jByL7xMM2X+qgI7E1Y5rcy7am05+2WvGC1Wp9gZdOf0Ka2DkhH9o92zOz\nn+tKPdb2zBw4Oid2Kq10bk3u55onH34lsvk3n\/mtAbrTj072Tu44RdYEMqvluFQpo2hFSZsN7YOp\nn\/VO7+05Zh9IrYl7pV3jO336sfv7HSObP1aFl9HqnYekbwpi2yjEljhU\/iQU\/kU4Fw7fdqf\/\/ORv\nDPedxLFPjY7KX\/dPTix2j29C3DeNUkUf8sRG5Df3oEjmQFGrDXkiI64LO1HY0oN8ihvNvbS3oJDu\n50utuFytwGVeG67UtONavRrGxN2fmGf2vvwbwR0mi166NVGkcTkqf9hqcb5vmrgPeWgdYuccDLHb\nMA7dRo0hjJxGPS5WSJFJmc0kiFyhAQUyG0pU\/Shud9OxA9kCPXIbtCijwcm8SQh7Yj\/lmQO\/PuC+\nNeuTqzMlxZFg3T\/VarrRZBmEdSgGuXsIlfoAWvrn4Us\/Rmj1KeT9U6hUuVDR3oda\/SCYFET2cQit\noxBYEqg1RSFxzcA1vw9t5Db43TFk16vfv8CT\/VqAx32zvhdXUvJr02PCQ6PHhrbAKjThRfjjZoQG\n6yDRd0AxmIJj4THiG+9gZve7iK69jYGFA9hm92Gbf8TdcyQPoR+9D2VsA83eJdQQaE6jDjkNavDa\njMn6NtNLvzKce3LzZHRpXjmz2PNuLKGFLrZKLztE9\/Q+TENJWL06DMT74Zy9g4HFTbgX99E5votm\n3y3U26agi29wgM6Ft2CfP4R2ZBvqkfuQDCyjXOUGr7kJPFEdZLK8sFKZ8bu\/Epw+vvpFT\/JN\/exy\n7P3UfDNMoRi6p\/bgXnqLy0jn2H1oo7fRm0hiesGKxaQSkZkgHBPzUAwkyECjMCQ24E89gHdhG46Z\nu+iML9MgU2jyLKBRrYHfWYgOVTa6tNcgbLnxKnvv\/4rOmEic8M6uqSLzY\/+ylpLBP2JFiy8F3cg9\nWCkjvbMPuSzak5QdArZMUgbjTpAMsDTFRzjAR5fPCev4LcSTwxifcyI21gPXgAzGXiF4KjMUJgXU\n6mJY9FfBFxXiUmGV96uXSn\/nf4SzWtOf9kyvF8VTyXfTKT3iM3Z0jtyBde4hLATG9t3TB1xY5x7B\ntfgW+tNPYJ5+QKJfhqy3D6J2MXS+GHom1tEdCKLT1QuNvQtqmxECrQZl7TbcVDlgNPLQqc1DVnk1\nzhbW\/+hUTt0FQnjh4+mA4+6ZjT8JzM8fLi7oMDxtR8\/UFvoWH3NZs8w94jTopHPf8tsUT+EhuP7U\nE7gpbKQzfeIemhwT0ERWuXM2CNXwFpoH1yANrkHoXkC9dQodtk7YuwtQLa7DxTIhATbgTEHD0muZ\n9R9vFv3s9ouumdu2yVQA0YQOesocg3MtPSGQp5TBR5zoWdY8t55woLbkUckZOAvr3AEZ4oAG8xB9\npFUnPasb24Msugnt6A4ZJE3tJgL\/AB9aPQ83BCqcKxHhTFEjzhDk2QJBzS\/PIs2dupGVb9knFt5b\nSraj3TNMRtjhXuJJPeX2LCM2aheeW0\/hSh2ZhWmSlZ5BdpEuj0CPrtvpWfZ3HQQoH9rmotExi65+\nIwbcPFS1tuEaX4OMUjHeuFF7BFjY8Fenrtf+wTN8vED6c+3BlNU1GsTEWAsa7NPQDG+ijwGlj0rJ\nXsbaBetpLubm5OOfZ4krJ0FxLqf7dtb\/WO+jQariBBe9B3lkAy3OYQT8AqgNQtxoVOFqrYrA+Did\nX8eBslKfvVHd8oyj2\/qTL3WEk98Zme6FO6iFiKYw9fA9aq7bMM8coOfDMtpIU6y0DIYFA2VlZ8HK\naibzsOfZsXFiF22Ru5CG7qIl+CakviU4AiZ4B8SokqmQQ1PehYoWgqvngpX5LMX5wtqVZwCVkfRJ\n0\/DCz9JJKQw+DzXUbRio6bLmqk3cpzLtUhPeg2FiD11TD6CJb0E1tAFt\/B53rKNndIkdqClbGnZM\nemsL3+HAmgdvkzmW0OEdQCTQCJ3diAKJEdkNHThfJuGgyCA4lVfDHV8oqnvnGR12RSZPWoYiuDUv\nRMvAHKcXVhoNAeoJjr2QgbaR2FvDd9HkW4HIswSxJwWJfwUSmj1E\/Uto8qapEVMz9qYgIscKnPPg\nk2ubrIMIBJrQ7xVD0O3F9aZuXCPAc8VCziRsz7LIAKnE7z0DODmpPDkcl8E+oODKohvdhTy2RXEP\nyuFtii0oh+5BRvdaSUvS0B2CWuamrWb\/KsQE1OCYQUPfHPi2aTRQ8K2TqO4aRp0pAKdfjXioGnJz\nJ8qUTuTSkiybVj4sgxkEmFEi5uDOFQtwjjRJrv1PwP2Nwi\/tLlcIpxMCVKu6qKz3oR9nztviMsZC\nTuVqpVAQJINmbaOVIFuphOy+ggbQ9uF1KWVYTgNRRO6QlmfQ7bNifKgOZqsYFXITB8ayl1WvPTLG\nh9o7e+RiDvIjwOMPVyu+9ni9PPpgpTLR7dYdsIWllEqmGN7+BcC2EGkpsEbHG1zp2TUpwXGABCNn\ngyBZyCJHz7OMq2Kb3Bw+PiKCzy9GjbKTMwYDyxEYqMXojkpbwOfiDNesaZ9f\/wEHuL9S8DLBhQ7X\nygIbSzevlKlc9cW0iLypD0PgmqeXbXDZaqeXyQiwJbiOdoLWjOxwQC0EzK630XOttFewTNLzDJCV\nX+EdRjjWhmiQVizmbhQ0dyOLoC5Xt+NKrRKXaUV9lrLFWsy5EuHPM0ha\/AGnwYPlksCT9ZLeP9vN\n+TzLZr2p\/5UK7cD3yrWDqDIOkaZmOROwDMm4Eh9lSk2ADISVmA1CQVpl05ma3KygDDOzNPdF0D+o\nxEi4GgangRaqAVpN2znAizdbufZyjnTHmYQLwZEGSY+vX68Jcm1mfbrwvcfrpdc\/0mKWSPRZSr0w\nX9Lzo8rOMKoMUdT1jpPopyCkvshMwB27khATRKODDEENnXOvZ5ELAZlEYovAPajGeKwavX2taDT7\nwTMNgw38uqQHV+vUVGYNMqvacIlgGSCXPdpnFAt3vpFT+U0OaCaU93e3pwvWH7xZ8upHkK+czj1x\nqUyszRWb3mUfOaWqAVToAqjQhzhgFjzTEGrMCfDIoTzKdE13gjuvpHsSqw+ekIaDc3hkEJjcqOqM\n0P8IokjuovbShVxxF+di9jXIHHy0UKj\/2zOFwtipfG5Fc9SkA5bMvoQ3+9\/Xxgs2DlfLVI\/Wyr7O\nrr+eVf57F8qb6zJ57StXapQ\/zqYPH2aeglY79+HDolQ9gDKNnwbgRYnSA76hn5ZVXQiGWzAerUKP\nTYBaTQ99ydm50rKvuTyJmSvxFdLgpSoZm+J+SHpbo+g5k19b+sdZN1\/+hRnErDj1h07D+bGw48o\/\nzkfz\/n5tqnB7N1XsfrxWVnN\/sTzPbKqubJLX2\/itwrnqVulfVEhaPuDJFKht10LYoYPCrEaHRQmL\nswWhoACTQ1UYDpSjw1iPm1I1ZclwBESGYHGpouWDi+WS758vES1nFDU4Tt2ornwtl\/faK7m5Jz5u\nNX1c3\/zNP7KqztT6LRdD0b6rPxjz5\/zzXDTv++lEwbeXxwr20on8\/blY0Ttxf8k\/BPvL\/i3gqUBo\noArRwSqMhm9iIlqBiXAxot4imIzl4EvrkceXct++9Pn5r+dLxH9Nwl\/JKBU53sir4Z\/Jb8jKKOB\/\n\/VxOxef\/+8Xpf9mkp499Siv71pcd2nOXBy2XK0OWy51Bx5V4zJW1Fe+\/9pejvtxfEjnfHvPl3Bn1\nZUcH+3nmbqfGLNYbzCVyi7lI7jTny2zmzFpV4xs3qi6fzqv809NZxV84lpX1yd\/GrxvHjbxXTpjl\n3\/iKw3j2VV9vZkbIce2ZCDsyTwd7rnzNa8h4WaKV\/L4ksPVMFCg3P\/P816zn2\/Pt+fZ\/ePsPTs1j\nHmn6e20AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_bigger_blue-1334339651.swf",
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
	"bag",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "rename"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"c"	: "magic_sort",
	"e"	: "rename",
	"o"	: "sort_alchemy",
	"t"	: "sort_all",
	"h"	: "sort_cards",
	"j"	: "sort_crops",
	"n"	: "sort_drinks",
	"k"	: "sort_emblems",
	"q"	: "sort_food",
	"u"	: "sort_herbs",
	"y"	: "sort_keys",
	"v"	: "sort_manufacturing",
	"x"	: "sort_mining",
	"z"	: "sort_musicblocks"
};

log.info("bag_bigger_blue.js LOADED");

// generated ok 2012-11-05 09:31:08 by mygrant
