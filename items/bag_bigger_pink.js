//#include include/takeable.js

var label = "Bigger Pink Bag";
var version = "1352136668";
var name_single = "Bigger Pink Bag";
var name_plural = "Bigger Pink Bags";
var article = "a";
var description = "A big, big pink bag for putting things in. Bigger than 15 slots, but not as big as 17.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1999;
var input_for = [];
var parent_classes = ["bag_bigger_pink", "bag_bigger", "takeable"];
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
	"sort_on"			: 51,
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
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
	"sort_on"			: 54,
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
	"sort_on"			: 55,
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
	"sort_on"			: 56,
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
	"sort_on"			: 57,
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
	"sort_on"			: 58,
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
	"sort_on"			: 59,
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
	"sort_on"			: 60,
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
	"sort_on"			: 61,
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
	"sort_on"			: 62,
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
	"sort_on"			: 63,
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
	"sort_on"			: 64,
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
	"sort_on"			: 65,
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
	"sort_on"			: 66,
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
	"sort_on"			: 67,
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
	"sort_on"			: 68,
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
	"sort_on"			: 69,
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALg0lEQVR42u2YeUyb9xnHk25dVXVr\n1k7pNHX9o+2aqsfSI6vaLum6dCyEtDnUhAAGExwIp81922BOcxoM5j5tAwFMMAFsgzEGcwdykAQI\nEEKarerUaZ3aamsrTZO+e54XSNWm7Za1f2xSXunR7\/Xr17yf9\/ucPzZtunPcOf4PD5w7d\/fqhPOl\nmd7uJLOusd6qaxgZM3U6rwwP6pccjjfmjcYfALhLqVTeBaPxe6t2+xa+\/w9TUy6r4+NR18fHMxaH\nhg4vDw+7LI+NuVwbGXlkZWXlnu8M8JLN9tC8w5bVVVuNVFkYFGGhiA88gfKMdEx0mT5dGHI4Lttt\ngRf6+g7M2+2ZyyNDw3ODAx9OnTZhqO0k+vSNaC\/Too3M0liPSbp+dWz0zMro6NZvDdesfPl+fZHI\nZcxU1Xp5wIp+gw6VWRkoz0xHJVldjgoVBKpJTUGpMhXadCW0tFZmZkCfn4ea7CyUpaUiKTgI8tCQ\ntRej7y7Z+j9edjge\/lZw5opdDzSq34gsSdv\/p1ZtxicLDhvmBwcwdboL01YLpnp70KIpQkFiAtLC\nZVDKpAJEPn3WKlMIPI0AM5ETF4usqEhkREagoSAf412dOFVV+bG+qOi\/BxxW\/vb7bdo9bzWq3\/5L\njSoJ1oYSjJ8qg7WxGu2lxXCcbMa1yQmsTE3ATC6szctBlSoLhmI1TNVV5M5SGMu1gmt76uvgaG0h\n1fow3XMapyorkJ8Q\/152ZOTPbj8hNm3abDMU3Nffcny3qeboWE+dHOd6u3He0om+plToi8Sozk7E\nqLEN189M4t2LF\/DHi7NYnT6DhREnFhyDuDrqFL67Nj6KJYcdi6T6TPdpdDJYYjwpHYrMaGmaMjT0\nh7cNtzJq3XrRppc5O+JvdNUEYaS9BdfGRnF9ahJTPa2kTDQG2wqwOGLB0ogZS047Zq1mDLc0obu6\nEtOUANcmxrDKRoAMtzjswEhbK3QFKkoybySHuiMmaE9+\/PGdP7odvs0TJtNDC46e2Ole9SdmnQR2\ngxYL9gGsjI0IasyTOtM93ZhzdOGcNZ1iSYapbjVm+wywN5XDpq\/FZZsZK+N2ylIbFp0Wgu\/A8Mla\nTJk6UJ8fjUrVXiSE7MIJ7x044bFr239MZ6yu3jJjs4SfH9D93dbsT+UgDWMd7YK7VinOGHLZOYQl\nUoNh5wZ74WjPgsXgS673grFSBKexHJcHOuglCjHZnUklJpkUP4GqHB\/U5SrQWCiDKnEvpJIXEezj\ngjBfj2ixWHzfv4ejQjvd3\/nmZUfTDWdHBAW0nFSxCG5lGLaVkWFcJcBlArxK59cIeIk+T5ja6cFy\n5Cb40Etp6Xed6G8qQGeVHB0VyYLpChMom9NQlaVAUugbCPJ5BaE+7mSi94O8vF4lhLu+Pu6AzdMW\n07YZs2HM0S6Ds12BWUu3oBjHEcNdnxwXgFZITQblVfiOjM9nKDNP11Rh0nQKq3QvX1u023CFjFcn\nZXCHtoRqpQQyySuQHjsIqa83pGIfhHh7t4lEoge+qUvcd76vI226txAWXSRlrGnNreNjuD4xLqwr\nowRHGcoPvroOeJ3czuCs8jJduzJoF0KAAVnp+X4rLlPysI0wYFk+VPH7EB+8D8khAQj3O4bwY76Q\nkUl9fT2+UkXunRd6O5+7YGn5YOBkKIZb6z5Xbt1uTE\/ddK+g3rox4I2z0wIg\/4Zf4Bq9DGf80tCg\noBxDzlOo2HQNMBTFIj3GjcrLCaGoh3qLIPMVE5wYEX5+CzKJ5Na2N2k03jvd3aGcNGkoZk5Q1uop\nC\/tJJeeaaqOfu5mVWx4eElZBYVLqHYJf5WK9fi8ry6EwP9CPOQK7QutFcw\/93WqoUw4jI8YD2TER\nQkcJEXlRDHoT3DHBpD4+h25tZS0tD4x2NJ8bbE6EXh0Dc10tzlAbWqDaxe4SYNbV4+xlQCHuuOzQ\nyiqugTvWVCTbcO8Cq0c2YTyJJk0k8pLfRn6SjNpejNCPg7w8bwKymyMlkjwudV8AHDU2bCX71Kr3\nR7s2Vwhqzky2ZXITKzBP7WmOH0jKLvD37D7qDkI2k11ZT4YrXJDpOt\/PqrGCZ6lo99apUKQ8SAOC\nFJqURFIwGjH+xwUXM2AYGyVLXGBgy1cAlm51tKjRVSfGAE0p\/MYMIIBwi6J1rs+KSxYzFgiWA\/58\ndxfOksr88BlaOQHGaKRyUm9mG6QwsVNv5sztayyjHu2NQsURNBdnC1NOOrk3ghQLXQcL9vJCJKkY\nGxBwQfnlRLE2SLZ21gRSrYoSHs5vPd\/fJwDN0WchyNcV5JbF90xTKRlrb8MZWieokA826THUTJ2E\nXrCvoR49NdUw0qBwuqoUJ0tDkS93pblRRjUwDSUpCqRSgoT5+EBGcJwkfB4p8UNMgP9fOWlvwvXX\nuT7YrXszsEXrQTOdQoiZRQ5uBiNQXi+tu0qIKQK9bOnFLNW889T4+fPCeqwtrifFLI1f\/ALWump0\nVctRkXMQxUoxtGmJwriVFx+HTFrXYs5PyGCpWCwoya7eANxsNrg8ZTG4ZfXqDjQ3qqMX1MmJFMxt\nBLAGxW68QCAbqi6RehyPDDNLkw27duN7fplLBM73cUico9\/2NeZDV3QU2kwPgotFSaoCObExUJFl\nREVQkgQIySG4mLI5WCRCoKfHZ0oludhs2POsWedabNHtzTld\/\/buRo06rpSmYVNFOTX15psADHl+\nHWKJY5KMARlsilw7Q0qxshcJjqE4Mfjc2VqDZo0EmrQDNHlHoSg5AXkJ8Tz\/0SQjRfRxiZAk7N6Q\nm4nCoKJFIQa76vfWWfSuKYP63\/2E21xtefFT9Xm5y81FheikAZMDfbqzY82dBCsoyIDUKditrNZF\nus4rq3qJXuAM3c\/J0afTolUbgqLUfajMDqPxai0x8niijo5CYlAg1zuhxTEgq8dulq1ZsZDFFTmv\nf2Bp3PP7jVgsioq6t0ipDM5PSny\/tbiIgrsC5toa4YGcANwFhlua4WhuwoBeJ1znpOD5T8hcytZe\nSoxT1MpOloagJMMN2gwJWopzqL2Voj5XJYz\/3D3SImQCJBfpNUARnYtYSXuEr+92AUgR+dLfylS7\nunt0rs9sQLq7uj4Y4y+Jyo2Pu6Eld9fTRqiFRnd+AFtbqQattPdoL9HAVFmOLpqMT9Eob6QBgO1U\neQ6NVaEoV+1HRbaEtgR5wu\/4b1TTBqswKYFaXKQQg1yk2bWCemKfhUBPT22Qu\/urN2tgmOS5qviw\nF\/9ZlvUbS49hb7i1we1pvu536NCPZb6+XglBgZ2quNgPC2g0L6Md2sbGp5H2HHra8BgK8+k8Fzra\nsRkKM2nPkQCD5hgVY1fkJB5BVbacqkKW4FpNilyIv\/SIcEG5aIo9gnsnSCTqCvL0VEi9vd2C3d0f\n\/kKBFh1+7AmJx1O10UHP\/zlf8eq7tQWv29qrXFS9ejePrnq3PZrUQ4fVCt80VZxvU1a032xWtP9n\n6uQwgo2mehaB2lwpzXdS2psEoFHthbLsfchJckFq5CFkxYSQStFCt0iRhgk7PKpvH1GcnQ339TUE\ne3sl+h89uv+4h8ez7i4uW27pHBujvfv+Jx8VH9nmKZVs18SHvbCoiPzVRxlxL18pTP31TKFyp6Mg\nZedwnvy186rE3e9lJ7j8IzfJFfkKNxQoXEmpPdCk70GefDdNJ7uRJN2LuKDDBCJGFBfc45KPYwP8\nL1BvbYry80skpY54HziwM0h0+AmZt\/f9Xwd1y7Fjx6a73d\/6+cN+R7a9dsLnmcPBftvjIgKeq4wK\nfL4\/JviFufiwHbdYXOiLM3EhO7roPDczbl9ceUawvDwtVq5NU8hLUlPl6uRkuTJcKgo5evSVQA+P\nxwPd3bcov2lavp0Nk4vLY1s8Dz7+yDGvXzwTKH765TDJ9lss5Ngvdxz3fvLJgAOP\/rQ6N2HLfH\/\/\ng182q9V6z53\/Zt057hx3jv\/h419KKZERTlNkrwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_bigger_pink-1334252891.swf",
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

log.info("bag_bigger_pink.js LOADED");

// generated ok 2012-11-05 09:31:08 by mygrant
