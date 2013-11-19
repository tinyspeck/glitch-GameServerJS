//#include include/takeable.js

var label = "Elemental Pouch";
var version = "1352136683";
var name_single = "Elemental Pouch";
var name_plural = "Elemental Pouches";
var article = "an";
var description = "An essential elemental pouch. You need it for carrying alchemical elements. What, you thought you could carry them in your HANDS? Requires Element Handling skill.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["bag_elemental_pouch", "bag_generic", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"can_specialize"	: "false"	// defined by bag_generic (overridden by bag_elemental_pouch)
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

verbs.shake = { // defined by bag_elemental_pouch
	"name"				: "shake",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Shake up your Elements",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.imagination_has_upgrade('element_handling_bonus_1') || pc.imagination_has_upgrade('element_handling_bonus_2')){
			if (pc.stats_get_daily_counter('elemental_shake') >= 1){
				return {state:'disabled', reason: 'You already Shook your Elements today.'};
			}else if (!this.countContents()){
				return {state:'disabled', reason: 'There\'s nothing to shake.'};
			}else{
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var blue_count = this.doShake(pc, 'element_blue');
		var red_count = this.doShake(pc, 'element_red');
		var green_count = this.doShake(pc, 'element_green');
		var shiny_count = this.doShake(pc, 'element_shiny');

		var element_changes = [];
		if (blue_count == 1)	element_changes.push({'name': 'Blue Element', 'count': 1});
		if (blue_count > 1)	element_changes.push({'name': 'Blue Elements', 'count': blue_count});
		if (red_count == 1)	element_changes.push({'name': 'Red Element', 'count': 1});
		if (red_count > 1)	element_changes.push({'name': 'Red Elements', 'count': red_count});
		if (green_count == 1)	element_changes.push({'name': 'Green Element', 'count': 1});
		if (green_count > 1)	element_changes.push({'name': 'Green Elements', 'count': green_count});
		if (shiny_count == 1)	element_changes.push({'name': 'Shiny Element', 'count': 1});
		if (shiny_count > 1)	element_changes.push({'name': 'Shiny Elements', 'count': shiny_count});

		if (element_changes.length > 0){
			var element_text = '';
			for (var i = 0; i < element_changes.length; i++){
				if (i > 0){
					if (i < (element_changes.length-1)){
						element_text += ', ';
					}else{
						element_text += ' and ';
					}
				}
				element_text += element_changes[i].count+' '+element_changes[i].name;
			}

			pc.sendActivity('You shook your pouch and created an additional '+element_text+'.');
			pc.stats_set_daily_counter('elemental_shake', 1);
		}else{
			pc.sendActivity('You shook your pouch but it was too full to create any more elements.');
		}
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

function canContain(stack){ // defined by bag_elemental_pouch
	if (stack.getProp('is_element')){
		var remaining = stack.getProp('stackmax') - this.countItemClass(stack.class_tsid);
		if (remaining >= stack.getProp('count')) return stack.getProp('count');
		return remaining;
	}

	return 0;
}

function canPickup(pc, drop_stack){ // defined by bag_elemental_pouch
	if (!pc.skills_has('elementhandling_1')){
		return {ok: 0, error: "You need to know Element Handling to pick this up."}
	}

	return {ok: 1};
}

function doShake(pc, class_tsid){ // defined by bag_elemental_pouch
	var delta;

	if (pc.imagination_has_upgrade('element_handling_bonus_2')){
		delta = choose_one([0.08, 0.09, 0.10, 0.11, 0.12]);
	}else if (pc.imagination_has_upgrade('element_handling_bonus_1')){
		delta = choose_one([0.04, 0.05, 0.06]);
	}

	if (!delta) return 0;

	var count = this.countItemClass(class_tsid);
	var bonus = Math.round(count*delta);
	var stack = apiNewItemStackFromFamiliar(class_tsid, bonus);

	var remaining = this.addItemStack(stack);
	if (remaining){
		stack.apiDelete();
	}

	return bonus-remaining;
}

function getCustomBagCategories(){ // defined by bag_elemental_pouch
	return ['element'];
}

function onCreate(){ // defined by bag_elemental_pouch
	this.is_limited = true;
	this.is_pack = 0;
	this.capacity = 4;

	this.updateState();
}

function updateState(){ // defined by bag_elemental_pouch
	var state = 'closed';

	if (this.isOnGround()){
		this.state = '1_'+state;
	}
	else{
		this.state = 'iconic_'+state;
	}
}

function getLabel(){ // defined by bag_generic
	if (this.user_name){
		return this.user_name;
	}

	return this.label;
}

function onInputBoxResponse(pc, uid, value){ // defined by bag_generic
	value = value ? value.substr(0, 32).replace(/[^a-z0-9 ]/gi,'') : '';

	if (uid == 'name' && value){
		this.user_name = value;
	}
}

function parent_canContain(stack){ // defined by bag_generic
	return stack.getProp('is_bag') || stack.getProp('is_element') || stack.has_parent('furniture_base') || stack.hasTag('no_bag') ? 0  : stack.getProp('count');
}

function parent_onCreate(){ // defined by bag_generic
	this.is_pack = 0;
	this.capacity = 10;
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a>, an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a>, a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a> or a <a href=\"\/items\/1000009\/\" glitch=\"item|npc_streetspirit_mining\">Mining Vendor<\/a>."]);
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
		'position': {"x":-23,"y":-34,"w":46,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFy0lEQVR42u2Y2VIaWRjHU3Mxl5PK\nMi4RRbGJssgim8rSbIIIiIAG44bGOGjN1GilpqYyV85F7q2aF\/ARfAQfwUfwEXiEb77\/gdNpWoTE\nmMqNp+qrXs7pPr\/+f8s58OTJY3tsj+1+7feK19yoek6OKp6z46rn8qjqudLbccVzLvrKXrVR9rq\/\nO1DaZ3m6X5wptSe+YSj6WsNzbBcAb5Q9pQeDW14YL23n7M37QPW1iudaeIChIcBm0mb+Krjc\/LjK\ngJQPT9B66jVtLdlov+CkRtlN3wMY7z1cdV8drrhOGFj9EsArAHYzQJfjCr3NTNNOzi7AHxp4M2u7\nZIyf7gV4lxWjFqomrAK8nnfQwcrMveAOSy7xvqBjIPtNgFDyIO+i49KsZvu5GSpFJzvGlWKTGjjU\nBoARar\/opLWklXheCrteCXNaX9h6JUizH+DbtI3WE6877pVVhQ4LbgHf73mECawYsVDMM0LzM8Ok\nzpoo4RuloH2IGOPnXoB91QOIvK4vOTXlaqkp2sk6ej6\/NGembGiMMsExARdhxaJ8TAXGaIHP55zD\n1K\/E9P56Vmpr0S7OoSKuoegiT5gOjNJGykYJqMEGgF7mff0rBWyDlPSPagY1vxkQQDhCPUBCNQmN\nWNSP7wXqsDynOPfjwwqRSaplPbQcneoL2DMGETdwMYAABlAkDK7lufEZAHQDdFtfCtWy7Pb3tRT9\n9+mUGtt5hp24wkrWFdBu\/+U5f9Ul4kQ\/SW7+c+zsZBgs1lISiklgwBkVlBb33gYM2AY0wHdvknR6\nuEbH9RUhQiE8cX0nJL\/wDNIvO01U4OAFXEeiLExQLTktlIELMXkmaKZawkYldhXuS+vl4pBjSACm\neFw15aDfNjPU2MwKQGFhy0VXwLWkcoba9E\/YRgceC807hzh4hzheRkQW6rMZKsIQj1XVKlSWcCn\/\naM+EkYCwDD\/Hqn2Ga1s+PF7vCrjBBfavmI3+UKdpmxMh6TOJDPM6B8g\/OyherrJyWbWlKF7WL8GM\nsRi0d2awUJNNxnrLJpock+5bgEfqFL2PTxFAAQnFsDKUlidpMcvZycAhxyC5QgPkmx6gmckX5Pa6\nuY4N8WowzLXtFcUCVqG6VBQfKeEwBh9sBERNDDmHL1G2JCTisQNwPaGoH6N2sQTBTmM6wDVeBfKK\n1lfcVEQf1IwlVBFPMAD4YxlxdCsvxUdEIy5S4z5aCE6JI+K8GyCHkwrD6tLV1UZAuDrfjg8jYGGn\ndZ4JmalYXtHuw5Y3DsQRz+5txOmgvqT1HR+v0Zv87J2A4GBvnGGFaat406HivxGHAJMuri5YWiqW\nFQEpJ8rXvwzw3Xaatkp+rQ\/XOxvJnoBo7O6mjMkOFWsJaxOuBegntt1wy5WVjKKpBiXh4kpCuRNw\nNTdPS7xTuS8gr89n0tWFiOVSA6wmrRf6yTAgx18izjcUoVx+X6HVkiJisxcg+nbXI8L0Lt5aj90C\nDLtfdQCiWDN0Mys2GebrjjiEMporWT1MhPNqWmm5utzqxziUh5VSjspZf1fA9cVpahyu9o1B7Gj0\ngGj5+fHzFrhhI8FF9yTXLsqp9gv00HpDX672jnKbR5Td+yjgsrsfNEDpVmmnf7+nMuqrARAQRkDU\nQVHWOB5vFe1McMSd9JvOeTPZFBBtN3cDXOGtv7yGklB0Ne0SWzHcg4p\/ftgTcHA3xuvhUHawH5xz\nDN0YIdm9N5zVVz1+Jz97GveN1JO+0QvseBB3Uk2cYwIkgxFcQsjr7cocvc17tLDpiD9Xy41y4wqg\nuG+sXoyOq4uBsWsGr3\/xz9NEwKTyynAplZWG9VQPCOhu92EIfLVdrJG9gAo5hs+XFybM7LUzXnFu\ncB9juB5e3PuHfsI74o77TCdQVwIj7mB6eMDit4g+scLtLT\/iK+QcPDG+G\/F3ay1+iAZoEbt+07Ux\nEQCe5hUCyiDeAOazPHv6Q\/98aqnMMcyukxbhe49\/yz22x\/bA7X858upYBRcfvAAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_elemental_pouch-1334342693.swf",
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
	"h"	: "shake",
	"o"	: "sort_alchemy",
	"t"	: "sort_all",
	"j"	: "sort_cards",
	"k"	: "sort_crops",
	"n"	: "sort_drinks",
	"q"	: "sort_emblems",
	"u"	: "sort_food",
	"v"	: "sort_herbs",
	"y"	: "sort_keys",
	"x"	: "sort_manufacturing",
	"z"	: "sort_mining"
};

log.info("bag_elemental_pouch.js LOADED");

// generated ok 2012-11-05 09:31:23 by mygrant
