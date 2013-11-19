//#include include/takeable.js

var label = "Generic Green Bag";
var version = "1352136683";
var name_single = "Generic Green Bag";
var name_plural = "Generic Green Bags";
var article = "a";
var description = "An honest, unpretentious green burlap sack. You could probably put things in it, perhaps 10 things, and give it a name. Just a thought.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 925;
var input_for = [];
var parent_classes = ["bag_generic_green", "bag_generic", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"can_specialize"	: "true"	// defined by bag_generic
};

var instancePropsDef = {};

var verbs = {};

verbs.sort_all = { // defined by bag_generic
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

verbs.sort_keys = { // defined by bag_generic
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

verbs.sort_cards = { // defined by bag_generic
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

verbs.sort_alchemy = { // defined by bag_generic
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

verbs.sort_manufacturing = { // defined by bag_generic
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

verbs.sort_mining = { // defined by bag_generic
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

verbs.sort_herbs = { // defined by bag_generic
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

verbs.sort_crops = { // defined by bag_generic
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

verbs.sort_musicblocks = { // defined by bag_generic
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

verbs.sort_emblems = { // defined by bag_generic
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

verbs.sort_drinks = { // defined by bag_generic
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

verbs.sort_food = { // defined by bag_generic
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

verbs.sort_staples_ab = { // defined by bag_generic
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

verbs.sort_staples_b = { // defined by bag_generic
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

verbs.sort_staples_a = { // defined by bag_generic
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

verbs.magic_sort = { // defined by bag_generic
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

verbs.stack_up = { // defined by bag_generic
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

verbs.rename = { // defined by bag_generic
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

function canContain(stack){ // defined by bag_generic
	return stack.getProp('is_bag') || stack.getProp('is_element') || stack.has_parent('furniture_base') || stack.hasTag('no_bag') ? 0  : stack.getProp('count');
}

function getLabel(){ // defined by bag_generic
	if (this.user_name){
		return this.user_name;
	}

	return this.label;
}

function onCreate(){ // defined by bag_generic
	this.is_pack = 0;
	this.capacity = 10;
}

function onInputBoxResponse(pc, uid, value){ // defined by bag_generic
	value = value ? value.substr(0, 32).replace(/[^a-z0-9 ]/gi,'') : '';

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
		'position': {"x":-16,"y":-46,"w":33,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIL0lEQVR42sWY+0+UZxbHjckmm003\nbEzWHzZtiBorN0Euw2VgmAvXGZg7zAgjzCAXEWmpjTqi6CxVxNYiaqGIoBS0VbxABYRabWl6SRMx\n2nabdC8\/sP60bTYpaf+Bs+d7Zh6y++PKiCRP3oeHgffD95zzPed916yJ4lfNdau+9obVvuNGeahh\n2hUK3LKONM645xum3PPBy61ta57Xl2vYFFtzvXypYcpJvqsW8t+0Uc14Oe2arSCcNUy5ZFXfssQ+\nF0DP5eJQ3aSdArds5L9hlcXA8n3jtFsgd046qP5Dx\/yqwzkvGPVN067FHdfKqOlOBfn4Wv2BhdwX\nCwQKoICEsjX8s9rLjpFgMBizaoBVH5j19vMGqmUQKMcqkfdyKTmHC8gzWkyck\/x9CVWMFNFO\/ll5\nfz4ZTmpWNx\/L3s33Wwf0EtK6CTttv1JK1nf1kovVrFzlaBGf28jG\/0jRSS3lvppZveqhLunRjgU4\nrJ3TLmpnNfcxZJDhyvp0ZHlHR8Wntb\/qD2kuZtnSkp9Lofxl1rvp7h0XnRa4Emq7VEh7z+tpdspO\nxwbyv0qu2bR+1WD+\/aBO\/9NCIPTjQmDy71\/teHzpQxu1DBglrIGbVsk187k8qnyP845D\/+WEhRZu\nW+zPHOznR\/WxPz4IzP\/1XgV9M2N7PDTjmG+57ZScC3C+oYrhfX6G9IyW0J6PvRJi35kcmrtaGHrm\nqv1rIbD0z8+rF6EGq9QrQLyaZtwCJnBctbAcWEzzXKVUMpTN\/fO2x88M7qdHO1MA97f7nsWH9wpj\n+MYjzbOV4m8tdz2EPewFwLgCtOWuV67wQffFQip8O5vK+nUj0Q\/rw6YYDuviPz71LD2aLk9pnHLq\nFRA6hFIPZ0o1nNdz6AEPRaGic8gEFcnRXdQbVUCGa3vypY8AV3m9MIaBFqFUuMc6BTQM6xIFoSrg\nsHZ\/5JErFGy+yKE+nsF2k0N1x3z+6NnHnCP03axN\/uvmuYoQFFEKQi0AoA8rRQWQ9ziTkN8ODxDX\n33fS9zeq6PWBAio+lkeDg4PRaXcPb5f5H9yyLA4PD8e+dscvN0XHgGIAVTkIMJWDakDAHlMN2hyq\nOdhnpM+uuMneraHaoDc6toOi+OKSeWnwqnsRIQMQ+qsoNxFWDuewlP\/Oy9b72+Wz6MOwIRv7YWmv\nlvRHkslwNIUMhzKjZztfj5b6uyZdUgyAQDFARem9HEqoCdUiI5UAIvy4VrBZAxBwWBnBBMo8nESZ\nh5KiB7jnE1ds673topIqEIBJns24BVDBKkB8DmOXi6caDAklDFd4Kou2tm2WambAyagBNk6597Z9\n5pNcQ1gBi\/BBNaiqBlUAIrQAhoFXvW8mxwUj2Qd5imEfLD2TS+nBeMo\/nk5ZHUnRG14ZYAThE9WQ\nd5x\/KoRSLHOVy8WBs1fuV\/HeJcWB8AISCi6Me2j0gplKT2pIczDxSdQAeUqexwAg\/sZXqIc91FOV\nq6wH6uKfcfM0E56sC6XVmd7MpN39Rjp1xkSvn84n3RupFDVAHjyXYBdQR8w30s4ApywmXCgu8jGU\nZ6xYJhl0ECzLO3nS6gCZui+OtKEUWfGBjZtXDIfuAUVgLXjekFybsC37HHIOaqLnIqQIJ+C8YyXk\n4gEWV\/PZXOkgxT05KA4ydKVTNtuNrjNVv\/ICma3Uq0dHlWuqIADuu1omeYaQOi+YBBJ9F9VbdcUs\nIS7j2VCKBDZzMIFyjiYLqGZ\/XDQAnXooBEBlISr\/lCcCFiOWh9XCswkejJB39kGuYLYYhBdFgpW2\nP45yO1NJ055Irb1NK\/fCugmrHoopEFgK8q42MvfhwQhn0nOvlS0\/MCHUCDGuUA6QWLr2JKrs0YoX\nNp9qWDngjvHykMo\/gABUDaXV7HP4Gc5RRL7IGcKM0CLU2CP\/ALm330Tz3Iv39ugkB1t6ogBYPW4R\nQPgfwoy9APOEgjMspSJsRYaDS2E4hNg2YJDiQBd5e6iUdr2lpeyOrVLF27ucKzfr8EugcKdQ7UxV\ns\/TeyOyn9mqChr3gii6i2hxCnH8sjas4Q3LQ2xWFVyGsVi+KQdThm6OSkWeqitVEozoJ2hvUA5yE\nedhEhhMZZOARC0rqGFDL0wyKxRYqWVwxIMPMq\/cu9ZEnONgOQqlUVLmJz1XBcqAcVy9CDOUAVhIp\nlPQD8WGLYQUNHVnU19e3sjdezqECAcRSfRhqqrzEFX6HnMQCGPIOcBhSjdx3AYnnZBh2xsFEHhS2\nUtbhcB4ePnvg6cd\/y7ApFuYLf4NC8EAUxLKl8DAKWICJB7K9QFnkH7wQ1QvlsEe7w3KczKID54zk\nfDNLVLSGip967HqBx6Mn4mfcFTAZKwUBqcwZIVUtDqFFm0NXgWrIO4xYgISC2C+Me+mtM2zg3Zmi\nYk77NorZ+LsMvt8f\/i+6hPoX13GufFvE+QMFcHOAABYGHK5QY\/iRkuHwmfK+\/P+pWJV3GBLQ6rDy\nOrdR3O4N3O5SJBcR8s2ulwJ8y8SnUXFtfldaiCvvlwK+iYVVwEI7g2IVI+FiwNsrG4cX7wTRd4t7\nspdDKsoxqFQwj1jowwmtG0nfoflBF0p9kNee1s\/3wVTzx5XUytr4qg1Faa9uGdOfSKcc7gJQzMF2\n4mAVHUPhF0cywTAk9spWzGfzpBhyWTkO6S8pe14eW5+xroj\/5kZe63j9NtovG36v60xrzD6cfFx7\nJOV7+BpGeMDI4sKA7xm7MzicrNjBFDJ3mH5ICGzaxb\/7p0iurV21V3HJu7ds0exP8mYFE7s1+7b2\nprXG96e38Xot4Vz6njh\/RKXfPO3f\/w+vqLuuOVf3eAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_generic_green-1334253225.swf",
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

log.info("bag_generic_green.js LOADED");

// generated ok 2012-11-05 09:31:23 by mygrant
