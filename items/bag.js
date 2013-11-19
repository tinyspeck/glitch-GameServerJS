var capacity = 16; // The number of slots in the bag
var is_bag = true;
var is_pack = true;
var is_limited = false; // Is this bag limited in the type of items it can store?

// List bag contents: This should return a hash of item stacks in the bag. Hash keys are the slot numbers, starting from 0.
function getContents(){
	return this.apiGetSlots(this.capacity);
}

// Gets the full contents of the bag and subbags, with tsids as keys
function getAllContents(evaluator){
	var itemstacks = {};
	var contents = this.getContents();
	
	for (var slot in contents){
		var it = contents[slot];
		
		if (it){
			if(!evaluator || typeof(evaluator) != 'function' || evaluator(it)) {
				itemstacks[it.tsid] = it;
			}
			if (it.is_bag && !it.isHidden){
				var more = it.getAllContents();
				for (var tsid in more){
					if(!evaluator || typeof(evaluator) != 'function' || evaluator(more[tsid])) {
						itemstacks[tsid] = more[tsid];
					}
				}
			}
		}
	}
	
	return itemstacks;
}

// Find the first empty slot in this bag.
function firstEmptySlot() {
	var contents = this.getContents();
	if(!contents) {
		return null;
	}
	
	for(var i = 0; i < this.capacity; i++) {
		if(!contents[i]) {
			return i;
		}
	}
	
	return null;
}

// Gets the full contents of the just the bag
function getFlatContents(){
	var itemstacks = {};
	var contents = this.getContents();
	
	for (var slot in contents){
		var it = contents[slot];
		
		if (it){
			itemstacks[it.tsid] = it;
		}
	}
	
	return itemstacks;
}

// Count how many slots have items in them
function countContents(){
	var i = 0;
	var contents = this.getContents();
	for (var slot in contents){
		if (contents[slot]){
			i++;
		}
	}
	
	return i;
}

// Add an item stack: The bag is told the item stack and optional slot. If the slot is taken, this fails UNLESS the slot contains 
// an item stack of the same type. In that case, as many items as can be stacked are placed in the bag at that slot, and the player 
// is left holding the remainder (if any). For example, if a slot contains 5 meats and a player drags a stack of 10 meats from the 
// ground into that slot, 5 more meats are added to the slot and 5 are left on the ground. If the slot is not specified, the item 
// stack is stored in the first available slot, with preference given to item-specific bag types and existing item stacks.
//
// Returns a count of the items it could not store
function addItemStack(stack, slot, pc){
	if (!stack) return 0;
	
	var pack = this.findPack();
	if (!pc && pack.is_player) pc = pack;
	if (!pc) pc = null;
	
	//
	// Special cases
	//
	
	if (stack.getProp('is_trophy') && !this.is_trophycontainer && !this.is_trophycase && !this.is_furniture && pc){
		return pc.trophies_add_hidden(stack);
	}

	if (stack.has_parent('furniture_base') && !this.is_furniture && pc && pc.trading_get_escrow_bag().tsid != this.tsid){
		return pc.furniture_add_hidden(stack);
	}

	if (this.isBagFull(stack)) return stack.getProp('count');

	//
	// Store in any slot
	//
	
	if (!hasIntVal(slot)){

		//log.info('Storing item '+stack.class_tsid+' in best available slot');
		// Find all bags within this bag that accept items of this type
		var items = {};
		if (this.canContain(stack)){
			items[this.path] = this; // Don't forget us!
		}
		
		var contents = this.apiGetAllItems();
		for (var i in contents){
			items[i] = contents[i];
		}
		
		var candidates = [];

		if (pc && pc.imagination_has_upgrade('pack_internal_sortitude')){
			// Find bag candidates who's categories match the stack
			for (var path in items){
				var it = items[path];
				if (it.is_bag && it.canContain(stack) && (!it.isHidden || this.tsid == it.tsid) && it.stackMatchesBagCategory(stack)){
					candidates.push(path);
				}
			}

			// Find bag candidates which dont have categories (give bag priority to uncategorized bags)
			for (var path in items){
				var it = items[path];
				if (it.is_bag && it.canContain(stack) && (!it.isHidden || this.tsid == it.tsid) && !it.isBagCategorized() && !in_array(path, candidates)){
					candidates.push(path);
				}
			}
		}
		
		for (var path in items){
			var it = items[path];
			if (it.is_bag && it.canContain(stack) && (!it.isHidden || this.tsid == it.tsid) && !in_array(path, candidates)){
				candidates.push(path);
			}
		}
		
		var remaining = stack.getProp('count');
		//log.info('Items to store: '+remaining);
		
		//log.info('Looking for restricted bags');
		// Walk the candidates, looking for limited bag types that might want this stack first, like a spice rack
		for (var i in candidates){
			var path = candidates[i];
			//log.info('Checking path: '+path);
			var bag = items[path];
			
			if (bag.is_limited){
				//log.info('Attempting storage in matching bag ',bag);
				var can_store = bag.canContain(stack);
				//log.info('Can store: '+can_store);
				if (can_store){
					var stack_count = stack.getProp('count');
					var num = pack.apiAddStackAnywhere(stack, bag.capacity-1, path, can_store, pc);
					remaining = stack_count - can_store + num;
				}
				else{
					remaining = stack.getProp('count');
				}
			}
			
			//log.info('bag capacity was '+can_store+' remaining is '+remaining+' stack size is '+stack.getProp('count') + ' num is '+num);
			//log.info('After storing, remaining is '+remaining);
			// Are we done?
			if (!remaining){
			
				//log.info('Done storing, returning 0');
				if (pack.is_player){
					pack.items_added(stack);
				}
				
				return 0;
			}
		}
		
		// Look for existing stacks
		for (var i in candidates){
			var path = candidates[i];
			var bag = items[path];
			
			for (var it in bag.items){
				var tmp = bag.items[it];
				if (tmp.class_id == stack.class_id && tmp.stackmax != tmp.count && tmp.tsid != stack.tsid){
					remaining = bag.addItemStack(stack, tmp.slot, pc);

					// Are we done?
					if (!remaining){
						return 0;
					}
				}
			}
		}
		
		//log.info('Storing what we can');
		// Alright, we've exhausted our priorities. Store what we can
		for (var i in candidates){
			var path = candidates[i];
			var bag = items[path];
			//log.info('Storing what we can bag=',bag);
			var can_store = bag.canContain(stack);
			//log.info('Can store: '+can_store);
			if (can_store){
				var stack_count = stack.getProp('count');
				remaining = stack_count - can_store + pack.apiAddStackAnywhere(stack, bag.capacity-1, path, can_store, pc);
			}
			else{
				remaining = stack.getProp('count');
			}
			
			// Are we done?
			if (!remaining){
				//log.info('Done storing in '+path);
				if (pack.is_player){
					pack.items_added(stack);
				}
				return 0;
			}
		}
		
		//log.info('Items remaining: '+remaining);
		return remaining; // Return what we couldn't store
		
	}
	else{
		//log.info('Storing in slot '+slot+' in '+this.path);
		var can_store = this.canContain(stack);
		//log.info('Can store: '+can_store);
		if (can_store && slot < this.capacity){
			var stack_count = stack.getProp('count');
			var remaining = stack_count - can_store + pack.apiAddStack(stack, slot, this.path, can_store, pc);
			
			if (pack.is_player){
				pack.items_added(stack);
			}
			
			return remaining;
		}
		else{
			//log.info('Bag cannot contain this item type');
			return stack.getProp('count');
		}
	}
}

// Remove an item stack: The bag is told the slot and an optional count. The current item stack is removed from that slot, or just 
// the number of items from the stack if specified.
function removeItemStackSlot(slot, count){
	var pack = this.findPack();
	var contents = this.getContents();
	var it = contents[slot];
	if (!it) return null;

	var stack = pack.apiLockStack(it.path);

	if (stack == null){
		log.info('Could not acquire lock, or slot is empty');
		return null;
	}

	if (pack.is_player){
		pack.items_removed(stack);
	}
	
	if (count && count < stack.count){
		if (config.is_dev) log.info(this+" splitting "+stack+" ("+stack.count+") into "+count);
		return stack.apiSplit(count);
	}
	else{
		return stack;
	}
}

// Remove an item stack: The bag is told the item path and an optional count. The current item stack is removed from its slot, or just 
// the number of items from the stack if specified.
function removeItemStack(path, count){
	var pack = this.findPack();
	var contents = this.getContents();

	var stack = pack.apiLockStack(path);

	if (stack == null){
		log.info('Could not acquire lock, or path does not exist: '+path, pack);
		return null;
	}

	if (pack.is_player){
		pack.items_removed(stack);
	}
	
	if (count && count < stack.count){
		return stack.apiSplit(count);
	}
	else{
		return stack;
	}
}

// Removes up to count of items of type class_tsid from the bag, using the first slot that matches
function removeItemStackClass(class_tsid, count, args){
	var items = this.getContents();
	
	var is_function = (typeof class_tsid == 'function');

	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		
		if ((is_function && it && class_tsid(it, args)) ||
		    (!is_function && it && it.class_tsid == class_tsid)) {
			return this.removeItemStackSlot(slot, count);
		} else if (it && it.is_bag && !it.isHidden){
			var item = it.removeItemStackClass(class_tsid, count, args);
			if (item) return item;
		}
	}
}

// Removes exactly count items of type class_tsid from the bag, assuming the bag actually contains that
// many. If the items are split among several stacks, the stacks are combined.
function removeItemStackClassExact(class_tsid, count, args){
	var items = this.getContents();
		
	var stack = null;
	
	var is_function = (typeof class_tsid == 'function');

	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		
		//if (config.is_dev) log.info("REMOVEXACT: Slot "+slot+" contains "+it);
		
		var item = null;
		if ((is_function && it && class_tsid(it, args)) || (!is_function && it && it.class_tsid == class_tsid)){
			item = this.removeItemStackSlot(slot, count);
			if (config.is_dev) log.info("REMOVEXACT: Got item "+item);
		}
		else if (it && it.is_bag && !it.isHidden){
			if (config.is_dev) log.info("REMOVEXACT: Recursing with count "+count);
			item = it.removeItemStackClassExact(class_tsid, count, args);
			if (config.is_dev) log.info("REMOVEXACT: Got item "+item);
		}
		
		if (item) {
			count -= item.count;
			
			if (!stack){
				if (config.is_dev) log.info("REMOVEXACT: initializing stack "+item);
				stack = item;
			}
			else{
				if (config.is_dev) log.info("REMOVEXACT: merging stacks "+stack +" with "+item);
				stack.apiMerge(item, item.count);
				if (item){
					var pack = this.findPack();
					if (pack.is_player){
						if (config.is_dev) log.info("REMOVEXACT: putting back "+item+" in "+pack);
						pack.items_put_back(item);
					}
					else if (item.container){
						if (config.is_dev) log.info("REMOVEXACT: putting back "+item+" in "+item.container);
						item.apiPutBack();
					}
					else{
						if (config.is_dev) log.info("REMOVEXACT: putting back "+item+" in "+this);
						this.addItemStack(item);
					}
				}
			}
		}
		
		// Done?
		if (count <= 0){
			if (config.is_dev) log.info("REMOVEXACT: done, returning "+stack);
			return stack;
		}
		
		// If we can't merge the stacks together, then just go ahead and return it.
		if (stack && stack.count == stack.stackmax){
			if (config.is_dev) log.info("REMOVEXACT: can't merge, returning "+stack + " count "+stack.count+" max "+stack.stackmax);
			return stack;
		}
	}
	
	if (config.is_dev) log.info("REMOVEXACT: ran out of items, returning "+stack);
	return stack;	// shouldn't happen unless there weren't any appropriate item stacks, in which case this is null.
}

function removeItemStackTsid(tsid, count){
	var items = this.getContents();
	
	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		
		if (it && it.tsid == tsid){
			return this.removeItemStackSlot(slot, count);
		}
		else if (it && it.is_bag && !it.isHidden){
			var item = it.removeItemStackTsid(tsid, count);
			if (item) return item;
		}
	}

	// Also check furn bag
	if (this.is_player){
		var bag = this.furniture_get_bag();
		if (bag) return bag.removeItemStackTsid(tsid, count);
	}
}

// Test stack storage: Returns whether or not it's possible for an item stack to be stored in the bag. This does not test capacity
// -- it tests type. Your main pack will always return true, but a spice rack will only return true for item stacks of spices.
//
// Now modified so it returns the amount of the stack that it's *possible* to store. Intended for the element pouch, where you can only have
// up to 1 stack of stackmax for each element.
function canContain(stack){
	// A spice rack would override this to return false unless stack.is_spice
	if (stack.getProp('is_element')) return 0;
	if (stack.getProp('is_trophy')) return 0;
	if (stack.has_parent('furniture_base')) return 0;
	return stack.getProp('count');
}

// Is this bag full? Optional stack argument will also test that the bag can contain that stack
function isBagFull(stack){
	apiResetThreadCPUClock();
	//if (stack && !this.canContain(stack)) return true;
	var items = this.getContents();

	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		var it_exists = (it !== undefined && it !== null);

		if (it_exists && it.class_tsid == 'bag_furniture_sdb') continue; // Do not include sub-sdb's that are in bags

		if (!it_exists && (!stack || this.canContain(stack))) return false; // Found a free slot, not full
		if (it_exists && it.is_bag && !it.isHidden && !it.isBagFull(stack)) return false; // Found a subbag that's not full
		if (it_exists && stack && it.class_tsid == stack.class_tsid && it.count < it.stackmax) return false; // Found a stackable item slot
	}
	apiResetThreadCPUClock("isBagFull");
	
	return true;
}

function countEmptySlots(){
	var num = 0;
	
	var contents = this.getContents();
	for (var slot in contents){
		if (contents[slot] && contents[slot].is_bag && !contents[slot].isHidden){
			num += contents[slot].countEmptySlots();
		} else if (!contents[slot]) {
			num++;
		}
	}
	
	return num;
}

function isBagEmpty(){
	var contents = this.getContents();
	if(!contents) {
		return true;
	}
	
	for(var i = 0; i < contents.length; i++) {
		if(contents[i]) {
			return false;
		}
	}
	
	return true;
}

function canFitEntireStack(stack) {
	var items = this.getContents();

	// Izzit Furniture? Then it doesn't go here, it goes there, and we'll be smart enough to pass it through... won't we, Myles?
	if (stack.has_parent('furniture_base')) return true;

	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		
		if (!it && this.canContain(stack)) return true; // Found a free slot, can hold this stack
		if (it && it.is_bag && !it.isHidden && it.canFitEntireStack(stack)) return true; // Found a subbag that can fit this entire stack
		if (it && stack && it.class_tsid == stack.class_tsid && (it.count + stack.count) < it.stackmax) return true; // Found a stackable item slot with room for the stack
		
	}
	
	return false;
}

// Find out how much of an item type will fit in a bag.
// Takes class name, and the maximum number we are interested in.
// DOES NOT CHECK WHETHER THE ITEM IS ALLOWED IN THE BAG
function canFitHowMany(class_id, count) {
	var items = this.getContents();

	var proto = apiFindItemPrototype(class_id);

	//log.info("MG called canFitHowMany with "+class_id+" and "+count+" and proto is "+proto);
	
	// Izzit Furniture? Then it doesn't go here, it goes there, and we'll be smart enough to pass it through... won't we, Myles?
	if (proto.has_parent('furniture_base')) return stack.count;

	var num = 0;
	
	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		
		//log.info("MG it is "+it+" and canContain is "+this.canContain(proto));
		if (!it) return count; // Found a free slot, can hold this stack
		if (it && it.is_bag && !it.isHidden) num += it.canFitHowMany(class_id, count); // Found a subbag 
		
		if (it && it.class_tsid == class_id && (it.count < it.stackmax)) {
			num += (it.stackmax - it.count); // Found a stackable item slot with room 
		}
		
		if (num >= count) break;
	}
	
	if (num > count) return count;
	
	return num;
}

// Find an item slot that can take some or all of this item
// DOES NOT CHECK WHETHER THE ITEM IS ALLOWED IN THE BAG
function canFitWhere(class_id) {
	var items = this.getContents();

	var proto = apiFindItemPrototype(class_id);
	
	// Don't use this for furniture!
	if (proto.has_parent('furniture_base')) return null;

	var num = 0;
	
	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];

		if (it === undefined || it === null) return slot; // Found a free slot, can hold this stack

		if (it.is_bag && !it.isHidden) {
			if (it.canFitHowMany(class_id, 1) > 0) { // Found a subbag
				return slot;
			}
		}
		
		if (it.class_tsid == class_id && (it.count < it.stackmax)) {
			return slot; // Found a stackable item slot with room
		}
		
	}
	
	return null;
}

// From this bag, go up the tree until we find the root
function findPack(){
	if (this.is_player) return this;
	
	var pack = this.apiGetLocatableContainerOrSelf();
	if (pack.is_player){
		return pack;
	}
	else if (pack.container){
		return pack.container;
	}
	else if (pack){
		return pack;
	}
	else{
		return this;
	}
}

// Remove everything in this pack
function emptyBag(){
	var pack = this.findPack();

	var contents = this.getContents();
	for (var slot in contents){
		var stack = contents[slot];
		if (stack){
			if (pack.is_player) pack.items_removed(stack);
			stack.apiDelete();
		}
	}
}

// Counts how much of the item class exists in this bag and its subbags
function countItemClass(class_tsid, args){
	var items = this.getContents();
	
	var is_function = (typeof class_tsid == 'function');

	var count = 0;
	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		
		if (it){
			var ok = 0;
			if (is_function) ok = class_tsid(it, args);
			if (!is_function) ok = (it.class_tsid == class_tsid) ? true : false;
	
			if (ok) count += it.count;
			
			if (it.is_bag && !it.isHidden){
				count += it.countItemClass(class_tsid, args);
			}
		}
	}
	
	return count;
}

function findItemClass(class_tsid, args){
	var contents = this.getContents();
	
	var is_function = (typeof class_tsid == 'function');

	var items = [];	
	// Walk the contents of this bag
	for (var slot=0; slot < contents.length; slot++){
		var it = contents[slot];
		
		if (it){
			var ok = 0;
			if (is_function) ok = class_tsid(it, args);
			if (!is_function) ok = (it.class_tsid == class_tsid) ? true : false;
	
			if (ok){
				items.push(it);	
			} 

			if (it.is_bag && !it.isHidden){
				var tmp = items.concat(it.findItemClass(class_tsid, args));
				items = tmp;
			}
		}
	}
	
	return items;
}


// Finds the first stack in the bag and subbags and returns a reference to it
function findFirst(class_tsid, args){
	var items = this.getContents();
	
	var is_function = (typeof class_tsid == 'function');
	
	// Walk the contents of this bag
	for (var slot=0; slot < items.length; slot++){
		var it = items[slot];
		
		if (it){
			var ok = 0;
			if (is_function) ok = class_tsid(it, args);
			if (!is_function) ok = (it.class_tsid == class_tsid) ? true : false;
	
			if (ok) return items[slot];
			
			if (it.is_bag && !it.isHidden){
				var stack = it.findFirst(class_tsid, args);
				if (stack) return stack;
			}
		}
	}
}

function createItemInBag(class_id, num){
	var s = apiNewItemStack(class_id, num);
	if (!s) return num;
	
	return this.addItemStack(s);
}

function get_item_counts(recurse_bags){
	var items = {};
	var contents = this.getContents();

	for (var i in contents){
		var it = contents[i];
		if (!it) continue;

		if (!items[it.class_tsid]) items[it.class_tsid] = 0;
		items[it.class_tsid] += it.count;

		if (recurse_bags && it.is_bag){
			var sub_items = it.get_item_counts(recurse_bags);
			for (var j in sub_items){
				if (!items[j]) items[j] = 0;
				items[j] += sub_items[j];
			}
		}
	}
	
	return items;

}

function getBagCategories(){
	var categories = [];
	if (this.getCustomBagCategories) categories = this.getCustomBagCategories();
	
	if (this.bag_categories){
		for (var i in this.bag_categories){
			categories.push(i);
		}
	}
	
	return categories;
}

function isBagCategorized(){
	if (!this.bag_categories) return false;
	if (this.hasCustomBagCategory || this.bag_categories.__length > 0) return true;
	
	return false;
}

function hasBagCategory(category){
	if (!category) return false;
	if (this.hasCustomBagCategory && this.hasCustomBagCategory(category)) return true;
	
	if (!this.bag_categories) return false;
	return (this.bag_categories[category] != undefined);
}

function hasCustomBagCategory(category){
	if (!this.getCustomBagCategories) return false;
	return in_array(category, this.getCustomBagCategories());
}

function addBagCategory(category){
	if (!category) return;
	if (!this.bag_categories) this.bag_categories = {};
	this.bag_categories[category] = true;
}

function removeBagCategory(category){
	if (!category) return false;
	if (!this.bag_categories) return;
	if (!this.bag_categories[category]) return;

	delete this.bag_categories[category];
}

function removeSpecialize(pc){
	delete this.bag_category_tags;
	delete this.bag_categories;
	if (this.user_name && this.specialization_name){
		delete this.user_name;
		delete this.specialization_name;
	}
}

function doSpecialize(pc, name, categories){
	delete this.bag_categories;
	if (this.user_name && this.specialization_name){
		delete this.user_name;
		delete this.specialization_name;
	}

	this.bag_category_tags = categories;

	var parts = categories.split(',');
	for (var i in parts){
		this.addBagCategory(parts[i]);
	}
	
	if (!this.user_name){
		this.user_name = name;
		this.specialization_name = name;
	}
}

function stackMatchesBagCategory(stack){
	for (var i in this.bag_categories){
		if (stack.hasTag(i) && !stack.hasTag('nobag_'+i)) return true;
	}
	return false;
}

