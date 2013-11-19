//#include include/takeable.js

var label = "Gift Box";
var version = "1353445795";
var name_single = "Gift Box";
var name_plural = "Gift Boxes";
var article = "a";
var description = "One mystery surprise gift box, filled with… well, filled with gifts. But what gifts? There's only one way to find out… No, not asking the person who gave it to you. The OTHER, non-spoilerific way. Open it!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bag_gift_box_wrapped", "bag_gift_box", "bag_generic", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"can_specialize"	: "false"	// defined by bag_generic
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

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
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

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
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

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.recycle = { // defined by bag_gift_box_wrapped
	"name"				: "recycle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Recycle this Gift Box into Paper",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


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


		var pre_msg = this.buildVerbMessage(msg.count, 'recycle', 'recycled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

verbs.wrap = { // defined by bag_gift_box_wrapped
	"name"				: "wrap",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Wrap this Gift Box",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


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


		var pre_msg = this.buildVerbMessage(msg.count, 'wrap', 'wrapped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

verbs.unwrap = { // defined by bag_gift_box_wrapped
	"name"				: "unwrap",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Unwrap this Gift Box",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var items = [];
		var contents = this.hiddenItems;
		var content_count = num_keys(contents);

		var escrow = apiNewItemStack('bag_escrow', 1);
		pc.apiAddHiddenStack(escrow);

		var growl = 'You open your wonderfully wrapped Gift Box and receive ';

		if (content_count > 0){
			var i = 0;
			var item = null;
			for (var slot in contents){
				item = contents[slot];
				if (item){
					if (i != 0 && i == (content_count - 1)){
						growl += " and ";
					}else if (i != 0){
						growl += ', ';
					}

					if (item.count == 1){
						growl += item.article+' '+item.name_single;
					}else{
						growl += item.count+' '+item.name_plural;
					}

					i++;
					escrow.addItemStack(item);
					items.push(item);
				}
			}
		}else{
			growl += 'nothing. Oh... that was mean!';
		}

		var unwrapped_box = this.replaceWith('bag_gift_box');

		var item = null;
		for (var i = 0; i < items.length; i++){
			item = items[i];
			if (!item) continue;

			var remaining = unwrapped_box.addItemStack(item);
			if (remaining) remaining = pc.addItemStack(item);
			if (remaining) pc.location.apiPutItemIntoPosition(item, pc.x, pc.y);
		}

		escrow.apiDelete();

		pc.sendActivity(growl);
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

function parent_verb_bag_gift_box_recycle(pc, msg, suppress_activity){
	pc.prompts_add({
		is_modal : true,
		txt		: 'Are you sure you want to recycle this '+this.label+'?',
		choices		: [
			{ value : 'yes', label : 'Yes' },
			{ value : 'no', label : 'No' },
		],
		escape_value: 'no',
		callback	: 'prompts_itemstack_modal_callback',
		itemstack_tsid: this.tsid
	});
};

function parent_verb_bag_gift_box_recycle_effects(pc){
	// no effects code in this parent
};

function parent_verb_bag_gift_box_wrap(pc, msg, suppress_activity){
	var items = [];
	var contents = this.getContents();
		
	var escrow = apiNewItemStack('bag_escrow', 1);
	pc.apiAddHiddenStack(escrow);

	var item = null;
	for (var slot in contents){
		item = contents[slot];
		
		if (item){
			escrow.addItemStack(item);
			items.push(item.tsid);
		}
	}

	var wrapped_box = this.replaceWith('bag_gift_box_wrapped');

	item = null;
	for (var i = 0; i < items.length; i++){
		item = escrow.removeItemStackTsid(items[i]);
		if (!item) continue;

		wrapped_box.apiAddHiddenStack(item);
	}

	escrow.apiDelete();

	pc.sendActivity('With the speed and vigor of the Glitchmas Yeti, you wrap the Gift Box into a nice little package.');
};

function parent_verb_bag_gift_box_wrap_effects(pc){
	// no effects code in this parent
};

function canContain(stack){ // defined by bag_gift_box_wrapped
	return false;
}

function getAllContents(evaluator){ // defined by bag_gift_box_wrapped
	return {};
}

function getContents(){ // defined by bag_gift_box_wrapped
	return {};
}

function getFlatContents(){ // defined by bag_gift_box_wrapped
	return {};
}

function onGive(pc, msg){ // defined by bag_gift_box_wrapped
	if (!this.feats_tracker && !this.feats_tracker[pc.tsid] && !this.feats_tracker[msg.object_pc_tsid]){
		if (pc.feats_increment('tottlys_toys', 1)){
			if (!this.feats_tracker) this.feats_tracker = {};
			this.feats_tracker[pc.tsid] = time();
			this.feats_tracker[msg.object_pc_tsid] = time();
		}
	}
}

function modal_callback(pc, value, details){ // defined by bag_gift_box
	if (value === "yes") { 
		var paper = this.replaceWith('paper');
		var s = apiNewItemStack('paper', 3);	// add 3 more paper
		pc.addItemStack(s, paper.slot);

		pc.sendActivity('You recycled a Wrappable Gift Box into 4 Sheets of Paper.');
	}
}

function onCreate(){ // defined by bag_gift_box
	this.is_limited = false;
	this.is_pack = 0;
	this.capacity = 3;

	this.updateState();
}

function updateState(){ // defined by bag_gift_box
	var state = 'closed';

	if (this.isOnGround()){
		this.state = '1_'+state;
	}
	else{
		this.state = 'iconic_'+state;
	}
}

function bag_generic_canContain(stack){ // defined by bag_generic
	return stack.getProp('is_bag') || stack.getProp('is_element') || stack.has_parent('furniture_base') || stack.hasTag('no_bag') ? 0  : stack.getProp('count');
}

function getLabel(){ // defined by bag_generic
	if (this.user_name){
		return this.user_name;
	}

	return this.label;
}

function bag_generic_onCreate(){ // defined by bag_generic
	this.is_pack = 0;
	this.capacity = 10;
}

function onInputBoxResponse(pc, uid, value){ // defined by bag_generic
	value = value ? value.substr(0, 32).replace(/[^a-z0-9 ]/gi,'') : '';

	if (uid == 'name' && value){
		this.user_name = value;
	}
}

function parent_canContain(stack){ // defined by bag_gift_box
	if (this.parent_canContain(stack) && stack.class_tsid != 'gift_box' && !stack.is_bag){
		return stack.getProp('count');
	}

	return 0;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"not_openable",
	"glitchmas",
	"toys",
	"no_discovery_dialog",
	"bag"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-26,"y":-49,"w":52,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALbklEQVR42uWZaVBUVxqG\/Tc\/nama\nUZNKNIkmOjMaVCJRQdEoroiAiCCLiKioINDNKkuz77tszS7IvjWNIJs0uyBgs+\/QgoAiEVRMZSaT\nmnfOPQ0N15BMqlKppGaoeupe+h5uP9\/5zvLdy6pV\/w8\/c6POcpNtBiKGiYeaIb87ueF7n2FI+AmG\nixg24nclKEhWSxLnb8fzegU8b\/iS8pvJzI7YrZ5s0eE9bVCVER94QJTk8ze86T6GN11H8apDRfxj\nbcdqVCxmRx03\/GqC4w1HTzMpHLm3iTIqOoWB1jAURm5HR\/YmDBRuQm324QKJmMNryjsoacxWErcL\nlUW9JUriIeHHNP2jZXL4VSTfDujLzXWqJc0+Pog58VcYq9uH\/EgFPEjehaqELahNWE\/G4UYMlsij\nq2gPEt3WI9pxPbL8PkRl9AeYrFXAbNsBMH\/\/dCCONzDxVu4XCTnmfbvhTlnNhcam2wXz\/YZzbwcM\nMT9ghNHSzzEg2AhB2Eb4W65Diud6dOV+ivHKrYRtGH\/wOZ4yVMkh1nU9isI3oDX9EwwKyUS6txlt\nAmWECLrgXzQLr8I52GS+Ejlkvym4lTfPcyn4hucm\/FbZTfgv5R8I+VZgdUX\/96cF7d8leRR9I3HM\nm4dDzhvYZb2CU\/YkwoXNKKguQ2FlKuwsDsHNSg5JvpvRU6GC151H6PijkLE4z9BzHJmhW2B48g8s\njIPbYZk6A07aS1hnzMGW3J\/5Hub7Qsve4GHvC8SXjsI0UISjZnexKrvptah+8Dtx5+S\/UT\/8PRLr\n\/wHngm+wXJC5kXvOEO7cL8GjRl\/MdF\/E2z5twhnMPFLBgPBT9Bd8gr78j9GX9xEep32ITJ+\/gHf1\nT0j2\/AAJrmtRGLwOFRFr0HLnPdxLUEZOrCoyolSRGHsVoXeS4JryGA5xLdCwycQ+oygoGUVC6UIE\nVhmEj0E\/VIJLUWOwSJqE9d1peApfE+YRUSpBSVkQxtvNwKSY0m9AOE84RwS1CBooyr2MC5bWMLTg\nwuAmB4Y3ubjinY2aZhFEDx8gKTcJeenXUZJ6CvXJn6Eubh0eRK7FHa9NyA78DFVxZLh46xCh21A0\nDIeiQRj2GoRir34IVumHPREzgnohIzgfNAjdwH7oBPTinF83bMPuoj\/vA8qQcBMkpVsxRSbHVK0i\n+po5uFshgn0aCS56HEaRYzC8LYF+2CgMwyUwingCY\/K5CX8CV+ImcS3hGeyzXsJDMAtnfonsvov4\neZ0lQsHYoxdECMSe8wHYretPBUU\/R\/BdIiItoOVaR8ZUGyzj+mGZMAxeznO4FbyCbfoLWNx5BqvU\nabgJXsM6aQiX\/Ktxyiqd9FAYdp\/1JPf4kMV17lUi5IfdOr748pwPwRsK2p6SnxS0C0\/DoOCjFYmM\ntsJpp2qoOT7AKYcKqNqX4aTtfZy+VQZD3wbwa\/8JLfs8Vrr2LvSOwhlXDBV+zOKCuRkjhF3k2o4T\nVtimbCSis9cg\/EnIjwum08WVQhbm5UTxuSsKnrApxnGuEH7CF9J0nV9KF+0dHR8onPXASPGnLAyu\nXoTcV5ex\/bAp5E\/ZMG2lgvq3x3g\/Jqjt2wnJ\/c3L2CIjOtbmJwW5CX1EZnm6vIgY6aGz7til5YYn\nZX9lYcLxINfdpWmWplrEWgcj83tFgWlicG83QY1TAE3nGmg4iTBW8fcV2IqYeLv\/Ksj01C4tqdAX\nJHVfaPIgr+mMHarWdEGXLeoEz2jBktxKghn1s6KI0hkMT38Hs\/gJ6Pr3Qtujhe4IDBPvEMO3+klB\nA586IuQCeQ1nghN2nnbA9mPm2LbPgKZxsmYni6i0MmmPE7StYpgjW1AvZFikFzqKlOqXcEyboGsj\nQ2vpGUzVyEupXaK88BZOXE2CyoVwHL0ch2PX7+K4Zb5MUMe9iooxvfX5VybYpqSHHccs6ERgJGh5\ntgw9bqhM0C+u6IeCuoEDImYMMlglPsH54CFKa6WxrM5bZJow1hMNbvI4DULbvRkaTA8SSRWylqmQ\nBXc\/ma1Mbx1Qu4aTRu4LY3GJF017KTNNihQTrjX9\/NDFIMRlP4CVTxpbUCegR8RMDt2APilksphG\nD2FKfF16k2Y2zY0RcMt6KgtEL3iYTDQpOmRymfuXwysiE7HZlXCLzKcTZZGzllF4dO84XrYqyzCx\ntiZygbQt8zeEOZYgmbFJ5\/y6IKWbEiwYx7MOM9aNFknNCYBRaD8NhMEyfkR6HjRAsjCA+22z4EUK\noaTvi6uuyVA45yXDNSIfNYVn8Kr9kAwTG2tw\/TPAz6qk3ArJZlfmWj5i3llvMbR92pEmmkJxywza\nhl\/jebcF5sgNlsPcMDU3QBbIzdhBJFZMQce\/Z4Fe8NIl2H+JL11elqFlEUUFxFUGpPKRVj8Ml21s\n6HVvfiG9zgTBFvRq4Wl5toLhRmQ3WoZeoWtsHlP9Pkul1DLu5gXQYBjiyyZQ0f41WTc76Np5jtKF\n\/cbRdFIwKOn54Lw1HwEJxYjJrMTgw0u0TFuESTHTLiylFOaeqfTIEtR0beZpujfhDBnwDP7Zg+iU\nvMH4QIIsyuWCqTl+KG+boW0WCcgdgVlUN5hMMOy7GEUWZg+KLjcG0RkVMnprDEiptl+GMccKiue9\nwfFNp+2Zc5aguksDT4PXAIprA3yz+tE++hqjPXy8bDvIpvUAkjM8YRz0GE39s7TdIszvNyI6SSZa\nSE0XId05FtDlRiOKyDF0VurgWd2XpDpSoFy0tMDBC35EzEvWniWo5lTDUye7h7pzLdRdapEhGoOo\n4wUqy\/0w\/XAvnjeycY3g00BcU3ogHnklwzW1F5puTRSmvpPuJFIUdb0QmV4BjygBHpdoYqxSTobR\nTXNWWwaW4CmHygI1xyosEpzTR9a3WvATHTBRLU95KlrCOiiRBuOd0UMm0xyl+NEUyUC9DCVSfDLb\n3CKqpiGwDcyk58L4\/Rgu3iLD0Ow6qy0DS\/CkXVmIiX8d2bbK6dYlpZJULdaQlG1lQwpXjj+fBnK3\nUoLKx8\/psXVwlm5\/FJINRVJm0T14AQ2zcCgb+NDz\/Ojd0keEhccE\/WumrLYqxv5swRO293kp5cN0\nP2VQtSul3CaF6SB55ngXS58IGkRAVje0eFU0mLjiQZiHNUPt1gPKXoNg8mU8GXt03GXn2eHy6Mx4\nX4ae6WUi781qzxK05zfzmvu\/xgnrIsI9KTb3EBp6Hb25Gyg9OetlmHuELgSyFIyqXRmpnGtp4aBq\nX06WmRhawawEz+YwWlPek5GcGoZLjvGsNizBxt6Zgoe9M+AlNOMYR4DjnEKKk7c9OtLfZ9Ge9j5u\nuAayAmGKhJOL2JZQlE1iSXnlsiKOnENoTFgnIzzan3V9p4azhCXY0D0taux5gUVsI+tw1DIPpk6+\n9FHxXUyd\/RcCWQiGW0irmEVOcItwmpMK9RuhtAZ8F3uzfaiOWSvDweYE\/ZyIze3UdOL94MG9oWea\nV989DYbc6hEcMc\/CkZvZuOLgxYp0EZcgUmZZ5NIgpOTjGIMVQwHFiJdLFt40Wnbt1\/Ogx0Vsrimi\n\/PYaGUHksVNe3alA\/qzd6hVfddR2zijXdT4vIECVkwMVswyKiZ0HavhrWTAR19YVgWlrHV5NA1ki\nB0cscqg8J7gEwSllcArPg5FDLEuQa6qI+2FrKMlem0WZMao\/\/12Ninm68mGzDB5BZGzrTt8IvEtV\neQyyqoZkgSwntrALKff7kCRsRdCdMvjEF2O3No8l6MnZgZLQv4iKI\/74y990lYT\/WZncLIQgXoy6\nQuBCejp7RcEbAeWobp9CeqmYCl52SZSJ7VR3lMhrOF6Ql7+y+ld7T1gavkauXOhMe1nlRkaSyo10\n8buSYVltyCrvoIKWzDhUdxJt13A8\/Zu+Dj5olimnYpZpwQyNGEEHhHWDZM8WSIJTypX\/Z\/+D8B92\n3\/fAELbnwgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_gift_box_wrapped-1334253435.swf",
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
	"no_rube",
	"no_trade",
	"not_openable",
	"glitchmas",
	"toys",
	"no_discovery_dialog",
	"bag"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"n"	: "rename"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"c"	: "magic_sort",
	"e"	: "recycle",
	"n"	: "rename",
	"o"	: "sort_alchemy",
	"t"	: "sort_all",
	"h"	: "sort_cards",
	"j"	: "sort_crops",
	"k"	: "sort_drinks",
	"q"	: "sort_emblems",
	"u"	: "sort_food",
	"v"	: "sort_herbs",
	"y"	: "sort_keys",
	"x"	: "sort_manufacturing",
	"z"	: "sort_mining"
};

log.info("bag_gift_box_wrapped.js LOADED");

// generated ok 2012-11-20 13:09:55 by mygrant
