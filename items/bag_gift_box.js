//#include include/takeable.js

var label = "Wrappable Gift Box";
var version = "1352136683";
var name_single = "Wrappable Gift Box";
var name_plural = "Wrappable Gift Boxes";
var article = "a";
var description = "An empty box, filled with promise. Not really, it's filled with nothing, but once someone (the gifter) fills it with something (the gift), wraps it, and gives it to another (the giftee) it will be filled with joy. Each box can take three stacks of joy (or three stacks of anything, in fact).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["bag_gift_box", "bag_generic", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"can_specialize"	: "false"	// defined by bag_generic (overridden by bag_gift_box)
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

verbs.recycle = { // defined by bag_gift_box
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

		if (this.countContents() > 0) return {state: 'disabled', reason: 'You can only recycle empty boxes'};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

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
	}
};

verbs.wrap = { // defined by bag_gift_box
	"name"				: "wrap",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Wrap this Gift Box",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

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

function canContain(stack){ // defined by bag_gift_box
	if (this.parent_canContain(stack) && stack.class_tsid != 'gift_box' && !stack.is_bag){
		return stack.getProp('count');
	}

	return 0;
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_discovery_dialog",
	"glitchmas",
	"toys",
	"bag"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-28,"y":-49,"w":56,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKgUlEQVR42u2YeVdT1xqH\/QZ+hH6B\nrmXV2jq05aqoqJVBZgUBAVHmQWZICAoiGCDMASRIIEBkUGSQAAZEsFosMosgYYaIYbJaqe393b13\nhhIhtrd3\/KNnrWedYZ91zvO++5y933O2bPlr+S8v54SLWz3yZsz6Z9+nPBlfk4cWz8id0serHQQK\nrkO6guuSMeHkkjVl5J47Z6RYeM8YU65t+48JBZYtbQsoUfn5Fy2IvAuVCi\/RPC7kzyK6XInIsnkI\nGl7BQzgBR8EYHNPG2HbMzXkUti3h+dwahmffoWf8LZp7X6Oue6U7r2VZHlWxKA+TLosiKl9zo6rf\ncDm33\/rxat4bxdcTZO+NPioUWffTJ5FVPzpF3FwVhUiXl4LLlhBYokJoqQqF7a8xtQQdk4t\/x62u\nVXDL53SCThnjOJs1CbecKWTLXkHUuogA8Tx8b7yEf\/ErBEkWQa8ZJl0BEURi\/SrqnqiQWjuPs9e+\nwxFvMTZIiR9hm2zwV7+257\/ICx68Q1TVj4ioWGUXoRfjVS\/hWv0ykmqX0DGyhtruNwgunmMSLkSG\nSlE5Kkm385oXGPktryDtVEHc9goRZURQTARJsPSaoeTa\/HoSuPAxrIIl+Mo5A185pWPfGYG+IFf6\nsru0YwVtQ2\/R2PcO0q41pDa9JYKvdYJBEhW7OM2Ct0iJUIkSvqJZuAmnWbaolFu2AhElUxDKlGgf\nWMbTsRXUdqmQ16SWTax5ibAyFWKqV+Gf9wz2nDoilEGE0rDPUYC9DinYezoZe05fwx77xN+62UEw\n3u2QqsDplFGc4j+H\/bVncM8chVvmC\/gXTiFcMg9eFcnCw3co6vwJLYNrEN5bId2m1Ak6swwq4EAz\nmD6OYPEUOGUzOJc7A78bSiKmREDeEFyuNOOAu1Ajlcqk9pzmY8+pJOy2T8RuuwR8aXsFu6zj9QTl\nasEXOkG7xAHYXu2DzZUeWMf9AKvLXbCMfYSTvIc4ldAF19QenE\/vQ2DBCM4K+uCeMYywUpLdgln4\nFc7hYslLxN1ZRbDoGU7F1Om6bi+TSl4ndRVfMql4fGEThy+sYhW7LHl+O60TtuoEHdPGU8gQYVgw\nXiv4mAlacDtgzrkPs6hWmEbew4nwJnwb1ojjIQ2w4rQgvGgU4YWDm3bd7lOJGqkrGqnLJFuXsJcc\n+zb0rtwhfYJLOSOYNHNMmzKibGEHtYLJIxrBwXWC3WrBS78veCy4FvaxrfBO69y061iWrImUVSx2\nmEdgh4kfdh8Lwt+seDAhGTbzLYdZ4G2Y+JThoGcxC2YLtd0gmGRI8DtYxFDB9nWCzXqCR4Nq4JXa\nrtd1NEu7iMTnljHYfjwIn37jhB373WFEzjEj55tHNMOSZP8bVyGTWs8WazIz0FTaJysIo052\/GGu\nXdIQ1zNnlLxtwxrBJ\/+U4PnkB0QqViPFxc6THHx2LADbD3nhKyJl4lOOE2EyGHuXsueTitgFCXHS\nN2ujoKFleP4XUILFs+QNnWDQl4k+pzS7VNoiphOBWV1EUKYRrGOCdtwGIhWNnRZR+NolE0d8pYzD\nfhUwcsvdIEEJSpAwnMLyccg15fcFJ1S\/Qst3Iz\/BPXtSJ6qFQ6Y62u6WNc4eC8tL37PsmoY34BB5\njmyv9rPz9nuIWIY2Ezt+Pg3hfCmEpTIUVt5DfM6tP5ZBxcIvoAzO\/Izgolk9sbhKJbTtlKpHKxvO\nWY9pQAk4aZUGBXOInIjIUYzXZe+jgmMv34NS0r606U0riZT2HMrA9BqRnNn0XI\/4GmRLGuEVK0bo\ntfINkraBQhRUtDCo8B8SLL6\/hIy7C3jw7M2mN3UjXT6q\/JnRP\/UOFzeRiyqdY+0Vsi5cv9nCsAnI\nUb\/h63CNEuFq3h1ECyp07dq1QUE67FCKWlVwzSTTWOoYe0nokERmHwTdmGblFOXx6FuD3ZvXrMJN\nIphP5EKSyjfIUS7winDUQ8C2v3ZMYusoIku3DQra84fZG0txSRthYySvfIqtTyePIlY6jfIOFTyF\n42gbWIVn7oQmCP1AXLMmUNPaizxpCyJTK9iA\/SFHzwn09g+68JFR3IiE3BrDgnS6ozMKfTsp9klD\nkPct43y2ejB3FgyTNYEEEnBdAV7ZpDqg5BEdNBBe+TTuPhyGb1wxeJlVbPDW4hCSq7evPZZefBe5\n0maGQUHrKz3dNgm9OMPvRwgpCjglLzA49Qbx0nE2fKgD0PJbIP55owwaBEXUPI\/Y\/FY2oxxwTlJP\ndwQT9xQEXSUD9ekEveN0O018F8LyZsRkVBkWJAOxnFYyDklP8WBwCf2TPzLodr5sGj45Q2wqtEmg\n9MKW0YfrTTPgV0+wICgemc9wxL+CFQbr8bksRk5ZM8PUM02vzYNbqGszKGh56ZGcTm8Ur4xe9I6\/\n1vH4+TK8svpJKfaElWOU9DvjuJj\/DPf7FyFtnyfyTzX04DCZRWiRQDFxS0bi9Tpkk5tTAhNKdW1a\nOOlVML2QBivfTMOC5jEd8pNkKqMVDOX2wzn0KFYZnulPWX3I0ASRdntM105p61ORYwpYkSDorMIK\nBg0BZErLKm1iWPpm6LVR7INydNuGBaPb5LSsolMXpfvFCuQ9C2x9PvUJKxroXEzRBlLdOcvaKQ+H\nFnWBGHuVsBJLyz77OGRKmhju0QV6bR9iUNA0okVhFiknVYscZxI6kFwxxCqYgrsvEC8ZAAmAcB\/q\nINSBZNWM4IfRJUZYfg+rHWkgBz3FrLLRYumTzgblffaXYR+Ypdf2IQYFSQmlsOKqC1JaUp0gNZsp\nowXBOV2k1Gph5ZYadSAV7ZNo7p5H18gi+DQgFkQbDpy\/wWpBLWdChNhrd2nDsfX7lMNnPzJQO8e1\nyhNLe0kp3kDLcQ2NrPZTI2M13YlwmSaIJlwS97BALmZ\/D3HTGAuGBrLfo4DVhVr22MXq7VOCk0ph\n4S2AkWO83nGDghmV\/fJy+Qscu1irJriW1XvHtYTUM84mtLJa8MNAXBPv6wI5eEGMz09yDbLHNhbX\nCuqRVixDRMpNvTaDgp0DL+UPBxfgdLkJJoG3cJR8KzCCbrOiVEtpCw3izoZAjq0LhL7Fu215rLL+\nEHOvVCRdr4dALGMcO8fXte2wiFYYFOzoV8qJJChVbaS7Qm6RAbeSYeJfBZOAKviltrF2s9AaFoQ6\nkFsbAqEfQB7cAlJhR2\/A2DmBjHuVSBU3MnbbxJAPqijFTotIp4\/+o3nQOy9\/0KdEc9c0HGJqSRbK\ncViDD78FtE1LZiWZEnkNOEJKem0QukAIVmGViKYFqw0XZp4p7FNgPfRYSlEjw8o3nfuH\/mq19ym3\ntffNca8UPeo+RD5uPiT9Zjfu987pkH0\/BQfuHb1A6AxCceLVIJncnLKZ4DlOAZzDckXbT0Z+8qd+\nwRmfk2495CMxIl9hXILc2Fuy9G2gFG09s4zGx5Nw4NRsCMItrp6113Y8B\/9GI0L45XpiO8wjuz+z\niDTbaR269d\/+39Alvt7oRsMAV949I6rtHJNvlmVK7PVO1LSrBd05BWo586jqP52tf2XZ71227aCX\nxMnYS5JyyEvCHg2aaa1gnLBGvt0ietuW\/5eFPhoXM+6ZlTb2cWlX\/vUD\/X+x\/AOnh7GDudCgCQAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_gift_box-1334253385.swf",
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
	"no_discovery_dialog",
	"glitchmas",
	"toys",
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

log.info("bag_gift_box.js LOADED");

// generated ok 2012-11-05 09:31:23 by mygrant
