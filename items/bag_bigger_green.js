//#include include/takeable.js

var label = "Bigger Green Bag";
var version = "1352136668";
var name_single = "Bigger Green Bag";
var name_plural = "Bigger Green Bags";
var article = "a";
var description = "A big, big green bag for putting things in. Bigger than 15 slots, but not as big as 17.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1999;
var input_for = [];
var parent_classes = ["bag_bigger_green", "bag_bigger", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAL7ElEQVR42u2YeUzb5xnHSdeuq7op\n67pMm9r+sarbeiwHhARIApgABhtsIMTchwHbhBsngDE2mJsANsYGc9iY21wJd7jPAOFq0kqr2mqa\nplWaWnVbp67S2k7TpO+e30tSdUq6rccfm5Sf9Mjmx8+8H3+f7\/M874uT08Pr4fV\/eNX35j1pXszy\n1o9mmmv6starhmU3a8dl6y1rOT29e7rzuhHdt3XQPaLT6R4ZGZF8q\/224rDllvyUfSfXr3uvSNmz\nry3v3tWEW3fy\/Mybcj\/LzaTnzL\/JevwbA+zcUB+xrl2uVHdEQ3zpFELTT0OU6gppiS\/qJy590rFR\nuGLfLFLYV7TitpvKiu5tzZptveBD00w26sZSUXNNjuKuOBS0RaByIBn6qVR03Src7XxNfeRrw91u\nd3rM4ZCccCwqB62r+SjujUZaXRAStD6Qlp6HrMoPyeV+SNL5IaWMj+RSf\/rZFylVvlBc9UdqHR+J\nOh5CM90QluWG8Gx3yMoDYFlWftS6rXzma8FtOoKeumbn59bX8d7TWkI+tm\/lwbqRC\/0NOVrmVGhb\nVEPVLkFUwTmEkKoXstwRmnEa0SpPBpdpFCDLJERqLZ+e8SS4M7hUEwT9eDoKbZKPlK3BXx1wTcd7\ndKpHGNxu8f9TZrUvynouwjaTDMN4InQDkWiczsX0GxYM7FairDeJFg5mkXY1CFeawwkgAtruaGi6\no6DpikLVSDIo7TDNZiPHKCZVfd6NK\/L8yVeCaxhRPjE6HOPT2ynarO8MRcO8Ak0LMtiGL8Jk8oPK\nIIRxNh2OV0sx96YVS293YexOIzpWtLBvFKH\/VR169zTo3FWhYzsflvUMVI7G43JLCOK13kgs9ib\/\n8kolOt53vxwZnA41L2c87ZjLS7k2JX+nZzAUpgUFuneL0LVdCMNYIq62BMEyHIOB7SIM0f2OLSVa\nNzJRORGLov5w6GflsO+oGFzbVjbMa6loWE5C\/VwSUintisIzkF1xhzLPo66g4Oz3vgzeod4F3Y8c\n25q8kcXMjydGL8A8Fg3bZj4G71SC2gWaVzKhn06FbTET0wspuDEVg57pBLTOxaN66CLKKPXt65fh\n2NVgaK8Yvbfy0bZyCQ0zUpRdi0ROBQ8NNd7Iz3NHmeocVEqfV7h1\/yu6qyOqw72rxdnXN6\/8dfpG\nNDqvX0TVaAIVxWUM36nGyOs1lK4r6N4pwsDtCjhuaTEwqcDoUBgmhsSwtQfCPBgF61IaBudTMXIj\nCf1jcTDbgqGq9Iai3Ac1zXyoCj1QVngWGTluiE73qT2b\/Iv\/rOIINdq+1ZKgsa28d2ZmYzF0Iwqt\n5JuuHTVFIflJy\/zmIG\/1vVqCHvJX734xOreKYJrOQGnLBeRovVDXHw\/bciaMAzGo7QjFVZsYFS1C\nFBr5yDQEQGkWooxA1aozuCA\/iWCZy\/uByc4ehPDIF9uOfNezqfv54Gr+5txsAoZnotG6lo5OAuPS\n2rPHmb6EAfXua9GzT+Ynj9l3ChjowJ1yWG\/mo7QvHk2zuaxAbLcuo3UzE+Z1Oeoo\/ZUTMSiwh6Lc\nLECVzhspSncEpTgjWHESgpQTQ0ExR5\/6QsDehbwnu9bySkeX5Oi\/Ho6W1Qy2cB\/BcEbngPr2S9C\/\nT+oxyGJ07OQxkKE7VXcrllTd0TCVuWfsO1S5G+kw35TDtCZHFRVQoVUMizkAalI6Ius0BEnOEKa4\nIEhGkEnHIx+ook7n9IhhOvm4dUH+weREBOqvRaN392ChzyvGRdeemhRVH9xjKdbeBday+1xwag\/d\nqYCdisO4kgLjahLMqwrohqKgt4vQYgqgKvaEROlBYC4QJLswyEDpiTc9JS8ceUC\/kzxhnEnWORal\nGBoQodgRATv1Lc5zHGDXbiGFmgFx6e7eK7wbRQeqUuo7KdWcop27BQyW+2zzWgbqFxKhX5KiejoO\nReRFi0WAkiofJBSeQ0TeGZrprvCPP44g8iIHyZceDb0PsMYR81TjtOz28BS1hx4xqieoZWxkE2QB\n8yDnpY7tPOqDatYLe2jxA+jCu4ppWDoPooC9tmxkwbQiR+MqTZ2VJNRMxsLUKYK5WQC5xgtR+WfZ\naAxWuLI0C5gXXSGUudTe13KqRyRHDBOJn8xM0IQYkqB9K+cujJoVQtNaGi2YSfeVDJx730oA3HOc\naq2b2WheT0PbZhZ5LoPSmQrDYjIL1pznpTAMhcPaKkCNNZg2CefZJBGy9DqzFAdKncFPOI6QNFfH\nAwFr+8MwPx4Gw3Q8M3YLRfutXFo8C43LcugXuVQlwEALclWpJzvUUrUbqFFXjsdCNxLBiqByPIbe\nS6AbjkLxgATFgxJUDV6EvSsYTdRqNFYRUip8EUsqcnDkO\/ApxQH0yqVapHB97b5C6ewUHGm3i9E3\nHMY807gmQ+N6Cr3Snm2JxtqNONTOxLH3DZQuw1ISrtLP1dOx9LsEBqPpuwitQwJN\/0Woe8ORT+2E\nCxVXtT0i2NsEKLUIka4PYHCxRZ4stffAuBRzKganuv7ZSfc5wLUZ4Y+Xr4sTB7pFyDfwUTcfTypJ\nCSSZgeoXpBTJuDobx+DqFxJYcPe59BmW6EvMJ7FqNSxys1ZK8DTypuJQOhIJQ28Ium1C6Kk4choC\nEUeplVw5gxi1J1MwIPE4UzFAyr0\/wQrlHuChm2NhL21Nhjatj4utJptwJ4E2lKXXIsjUiSyVTTcv\nsYVNawoGbVw9UJSlm2C46qylBlxPsHVziZTyeAZtpucblmSoG5agq5tSawnEZZog3OY1suAsq95o\nmsEhaaeYghyUf9xx5kWB9C7g2qjgWYJr3JwIaVgcEXnnGoVSWaU\/VF2hqLkRS5BStnDtLKV1OZmU\nTfgMkClIkAx8MYXBcF7k0m7gvsAcPT8WA2uviBWGuoEPWaUvpGU+iCIwyWUP2tieQhjtrjlATsF7\ngFTJv2OA69dFDduTouK9Zd+nOTXTai48n6YX\/op2t2Tsi6gYj6bRFI2aqVi2ReIAGkjNxtUDbzau\npbDpYKTJY1pORdN6KvNv5WQMSmi7ZeoWo8sWhKpmIZTNQVDU0hGg4jwiKL0cHHeWESS5MP9xcFwE\nJJxAaNYpI6viyW7hB1uTYv97XpTqeN9RVPMTE4rPv3+FGmq+PYTMfoGMT+Yn45cOR7Mi4AqiZCiC\nvVf3hNNrBE2IyLvFcQFq+lxD50FRcL5T0RfOo0LJNAmYgpEEGJ7jzuJgehwUB6voxBNL4jS3Ywyo\np9H\/j+PdgsnVKdEr9yBP+j1\/WCQ\/rYwv9n4niXpVGlVcRmMgrrSLD8J6EMo2EdKNgfQ7AXJbgpHf\nEUL3RShqDYKpI+gAzhwIlSUIefRlc0jBVFKQtvdMwfBcDzZ7uTHnT70vIMnlt9QTmwMTjnp81gON\nZd7m9trz\/5joEMxsjoVkb0yEvMzd50lPfJ\/kj76Q7T4aq\/b6ML7EGzI6i6TV85kKWbRVyiC4NDJ9\nJu1KcglC2yGGgVJqswvR2RKAGr0\/smnXzH1GXu1Hpz4fBkd\/j53mODh+3LH3\/OOOTfjFHNX6xx4T\nC2JfePZfGrQ22+1nlQXuNlO51x\/6m\/i\/n+gSLiwPB1dvTYRELl4L5tfU8cILKnilueWefRmlXq+n\nFnt+mlHqjcwKH2RV+iC\/zg81lgBYu4LQR5XabxPAauazOaugs0ZiCY+d6rhj5sFJz+PTsAz3t6gR\nXxckOJf7RR8L95IcPcpl7Yt204fyZMd+qst2jdKXnGlsqvB+26b3\/UtfE\/+tkXbB\/nWbYGWkPXDN\n0RJ4p6OJ\/25zg+\/fmxv8YDH6w9Loj3aC6SG1HK0BaNP7QlfiCXmuGyR03BRTAZBKfxMmu\/w6IMF5\nlKJckOgSGyxz5fnGOr\/sG\/bi0\/92c\/r5S3HS6THlpePPlCtPexpKPMMbSzzzjeVerc1VvPnWGp83\nrPV+DwjffVu977S1\/nxTk9FPU2sJ1BQY\/DTycp4mqZSnSSz10oRkuMb7Rh3z5EUfffFk8M9\/6MRz\nevSb+O\/GIZXk+cOa9F8+V6469Up98Tm3xnKf+8JUfu6kUev1Um2B27NKnccPGuYl90XWrODxh\/\/N\neng9vB5e\/8PXPwFtW1jjE6GnwgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_bigger_green-1334252843.swf",
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

log.info("bag_bigger_green.js LOADED");

// generated ok 2012-11-05 09:31:08 by mygrant
