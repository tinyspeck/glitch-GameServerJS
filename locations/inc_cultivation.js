// class_id to level requirement mapping
var cultivation_classes = {
	'proto_jellisac_mound': 7,
	'proto_barnacle_pod': 7,
	'proto_firefly_hive': 10,
	'proto_crop_garden_small': 5,
	'proto_crop_garden_medium': 7,
	'proto_crop_garden_large': 10,
	'proto_herb_garden_small': 5,
	'proto_herb_garden_medium': 7,
	'proto_herb_garden_large': 10,
	'proto_patch': 0,
	'proto_dullite_rock': 5,
	'proto_beryl_rock': 5,
	'proto_sparkly_rock': 10,
	'proto_metal_rock': 10,
	'proto_dirt_pile': 5,
	'proto_peat': 7,
	'proto_furniture_tower_chassis': 18
};

function cultivation_get_available(pc){
	var ret = {};

	if (!this.cultivation_can_cultivate(pc)) return ret;

	for (var class_id in this.cultivation_classes){
		var min_level = this.cultivation_classes[class_id];
		var proto = apiFindItemPrototype(class_id);
		if (!proto) continue;

		var imagination_cost = this.cultivation_get_img_cost(class_id, pc);
		if (!imagination_cost) continue;

		var placement_warning;
		var can_place = true;
		if (class_id == 'proto_furniture_tower_chassis') {
			if (!this.is_public) continue;
			
			if (this.cultivation_count_items(class_id) > 0 || pc.getTower()) continue;
			placement_warning = "Building a tower is an expensive job: after imagining this plan, you'll still need 4 girders, 16 wall segments, 20 urth blocks, 200 snails and a general building permit to actually build your tower! Are you sure you want to get into this?";
		}
		
		ret[class_id] = {
			class_id: class_id,
			label: proto.label,
			imagination_cost: imagination_cost,
			min_level: min_level,
			can_place: can_place
		};
		
		if (placement_warning) ret[class_id].placement_warning = placement_warning;
	}

	return ret;
}

function cultivation_get_img_cost(class_id, pc){
	// How many are here?
	var existing = this.cultivation_count_items(class_id);
	var all = this.cultivation_count_all_items();

	// Turn existing count into cost
	var base = 0.15;
	var additional = 0.5;
	var cost = 1.0;
	
	if (class_id != 'proto_furniture_tower_chassis'){
		for (var i=0; i<all; i++){
			cost *= (1+base);
		}

		cost += (existing * additional);
	}

	var proto = apiFindItemPrototype(class_id);
	if (proto && proto.base_cost) cost *= proto.base_cost;

	return Math.round(cost);
}

function cultivation_count_items(class_id){
	var existing = 0;
	var items = this.getItems();
	for (var i in items){
		var it = items[i];
		if (it.class_id == class_id || it.proto_class == class_id) existing++;
	}

	return existing;
}

function cultivation_count_all_items(){
	var existing = 0;
	var items = this.getItems();
	for (var i in items){
		var it = items[i];
		if (this.cultivation_classes[it.class_id] || it.proto_class) existing++;
	}

	return existing;
}

function cultivation_start(pc){
	return {
		choices: this.cultivation_get_available(pc),
		ok: 1,
		can_nudge_cultivations: pc.skills_has('nudgery_1') == 1,
		can_nudge_others: pc.skills_has('nudgery_2') == 1
	};
}

function cultivation_purchase(pc, class_id, x, y){
	var choices = this.cultivation_get_available(pc);
	var choice = choices[class_id];
	if (!choice) return {ok: 0, error: 'Invalid choice.'};

	if (!choice.can_place) return {ok: 0, error: 'You can\'t place any more of those.'};

	if (pc.level < choice.min_level) return {ok: 0, error: 'You\'re not high enough level. Need '+choice.min_level};

	if (choice.imagination_cost && !pc.stats_try_remove_imagination(choice.imagination_cost, {'cultivation': class_id})) return {ok: 0, error: 'You don\'t have enough imagination.'};

	// Create an instance of the end item
	var stack;
	if (class_id == 'proto_furniture_tower_chassis'){
		stack = apiNewItemStack(class_id, 1);
	}
	else{
		var proto = apiFindItemPrototype(class_id);
		if (!proto) return {ok: 0, error: 'Oops! Something happened!'};
		
		stack = apiNewItemStack(utils.trim(choose_one(proto.getEndItems())), 1);
	}
	
	if (stack) {
		stack.proto_class = class_id;
		if (stack.initWear) stack.initWear();
		if (stack.onCultivated) stack.onCultivated(pc);

		this.apiPutItemIntoPosition(stack, x, y);

		this.apiSendMsg({
			type: 'poof_in',
			itemstack_tsid: stack.tsid,
			swf_url: overlay_key_to_url('proto_puff')
		});

		apiLogAction('CULTIVATION_PURCHASE', 'pc='+pc.tsid, 'class_id='+class_id, 'tsid='+stack.tsid, 'cost='+intval(choice.imagination_cost));
		
		if (this == pc.home.exterior) {
			pc.achievements_set("cultivation_items", "has", this.cultivation_count_all_items());
		}

		if (class_id == 'proto_furniture_tower_chassis') pc.quests_set_flag('cultivate_tower');
	}

	return {
		ok: 1
	};
}

function cultivation_can_cultivate(pc){
	return this.pols_is_pol() && this.getProp('is_home') && this.pols_is_owner(pc);
}

// Add to the img rewards for today
function cultivation_add_img_rewards(pc, amount){
	if (!this.is_home) return false;
	if (!this.is_public) return false;
	if (!config.is_dev && this.pols_is_owner(pc)) return false;

	var today = current_day_key();
	if (!this.img_rewards) this.img_rewards = {};
	if (!this.img_rewards[today]) this.img_rewards[today] = 0;

	this.img_rewards[today] += amount;
}

var cultivation_rewards_cap = [
	50,
	75,
	100,
	125,
	150,
	175,
	200,
	225,
	250,
	275,
	325,
	375,
	425,
	475,
	525,
	585,
	645,
	705,
	765,
	825,
	900,
	975,
	1050,
	1125,
	1200,
	1275,
	1350,
	1425,
	1500,
	1575,
	1675,
	1775,
	1875,
	1975,
	2075,
	2175,
	2275,
	2375,
	2475,
	2575,
	2675,
	2775,
	2875,
	2975,
	3075,
	3175,
	3275,
	3375,
	3475,
	3575,
	3675,
	3775,
	3875,
	3975,
	4075,
	4175,
	4275,
	4375,
	4475,
	4575
];

// Get the best amount of img to reward
function cultivation_get_img_rewards(pc){
	if (pc.stats_get_daily_counter('cultivation_img_rewards')) return 0; // Have we already cashed in today?
	if (!this.img_rewards) this.img_rewards = {};

	var today = current_day_key();
	var best_amount = 0;
	var best_key;
	for (var i in this.img_rewards){
		if (i == today) continue;
		
		var amt = this.img_rewards[i];
		if (amt > best_amount){
			best_amount = amt;
			best_key = i;
		}
	}

	if (best_key){
		for (var i in this.img_rewards){
			if (i != best_key && i != today) delete this.img_rewards[i];
		}
	}

	// Enforce cap
	var cap = this.cultivation_get_rewards_cap(pc);
	best_amount = Math.min(best_amount, cap);

	// Add in our stipend
	if (pc.stats_get_level() >= 2){
		best_amount += Math.round(cap * 0.20);
	}

	return best_amount;
}

function cultivation_get_rewards_cap(pc){
	return this.cultivation_rewards_cap[pc.stats_get_level()-1];
}

// Start over on the rewards (like after they cash out)
function cultivation_reset_img_rewards(pc){
	if (!this.img_rewards) return;
	pc.stats_set_daily_counter('cultivation_img_rewards', 1); // No more cashing in today

	var today = current_day_key();
	for (var i in this.img_rewards){
		if (i != today) delete this.img_rewards[i];
	}
}

function nudgery_can_do(pc, itemstack_tsid){
	if (!this.cultivation_can_cultivate(pc)) return {ok: 0, error: "You cannot nudge here."};
	if (!pc.skills_has('nudgery_1')) return {ok: 0, error: "You don't know how to nudge."};

	var it = this.apiLockStack(itemstack_tsid);
	if (!it) return {ok: 0, error: "Invalid item."};
	if (!it.proto_class && !it.has_parent('proto') && it.class_tsid != 'furniture_tower_chassis') return {ok: 0, error: "That item cannot be nudged."};

	return {ok: 1, item: it};
}

function nudgery_start(pc, itemstack_tsid){
	var ret = this.nudgery_can_do(pc, itemstack_tsid);
	if (!ret.ok) return ret;

	var linked_itemstacks = this.nudgery_get_linked_items(ret.item);
	if (linked_itemstacks.length){
		return {ok: 1, linked_itemstacks: linked_itemstacks};
	}
	else{
		return {ok: 1};
	}
}

function nudgery_do(pc, itemstack_tsid, x, y){
	var ret = this.nudgery_can_do(pc, itemstack_tsid);
	if (!ret.ok) return ret;

	var it = ret.item;
	var delta_x = it.x - x;
	var delta_y = it.y - y;

	this.apiPutItemIntoPosition(it, x, y);

	var linked_itemstacks = this.nudgery_get_linked_items(it);
	if (it.class_id == 'firefly_hive'){
		var spawn_at = it.getInstanceProp('spawn_at').split(',');
		spawn_at[0] -= delta_x;
		spawn_at[1] -= delta_y;

		var box_center = spawn_at.join();
		it.setInstanceProp('spawn_at', box_center);

		for (var i in linked_itemstacks){
			var it2 = this.apiLockStack(linked_itemstacks[i]);
			if (!it2) continue;

			this.apiPutItemIntoPosition(it2, it2.x-delta_x, it2.y-delta_y);
			it2.setInstanceProp('box_center', box_center);
			it2.startFlying(spawn_at);
		}
	}
	else{
		for (var i in linked_itemstacks){
			var it2 = this.apiLockStack(linked_itemstacks[i]);
			if (!it2) continue;

			this.apiPutItemIntoPosition(it2, it2.x-delta_x, it2.y-delta_y);
		}
	}

	if (it.class_id == 'furniture_tower_chassis' && pc.home.tower){
		this.homes_position_tower(pc.home.tower, x, y);
	}

	return {ok: 1};
}

function nudgery_get_linked_items(it){
	var linked_itemstacks = [];
	if (it.class_id == 'jellisac_mound'){
		linked_itemstacks.push(it.j1.tsid);
		linked_itemstacks.push(it.j2.tsid);
		linked_itemstacks.push(it.j3.tsid);
	}
	else if (it.class_id == 'barnacle_pod'){
		linked_itemstacks.push(it.b1.tsid);
		linked_itemstacks.push(it.b2.tsid);
		linked_itemstacks.push(it.b3.tsid);
	}
	else if (it.class_id == 'firefly_hive'){
		var is_firefly = function(item, center_pos){ return item.class_tsid == 'npc_firefly' && item.getInstanceProp('box_center') == center_pos; };
		var fireflies = this.find_items(is_firefly, it.getInstanceProp('spawn_at'));
		for (var i in fireflies){
			linked_itemstacks.push(fireflies[i].tsid);
		}
	}

	return linked_itemstacks;
}

function adminRecultivateItems(args){
	this.items.apiIterate(function(it){
		if (it.proto_class) return;
		if (!it.initWear) return;

		if (it.is_trant || it.class_tsid == 'patch'){
			it.proto_class = 'proto_patch';
			it.initWear();
		}

		// TODO: Other classes
	});
}

function adminUncultivateItems(args){
	if (this.pols_is_pol()) return;

	this.items.apiIterate(function(it){
		if (it.is_trant || it.class_tsid == 'patch'){
			delete it.proto_class;
		}

		// TODO: Other classes
	});
}