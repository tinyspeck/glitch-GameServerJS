function tests_bag_contents_empty(){
	this.emptyBag();
	var contents = this.getContents();

	var ret = tests_assert_equals('Bag capacity', this.capacity, contents.length);
	if (!ret.ok){
		return ret;
	}

	var ret = tests_assert_equals('Bag size', 0, this.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_apple(){
	this.addItemStack(apiNewItemStack('apple', 2));

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', 1, this.size);
	if (!ret.ok){
		return ret;
	}

	var stack = contents[0];
	var ret = tests_assert_equals('Stack size', 2, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'apple', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_apple_stackable(){
	this.addItemStack(apiNewItemStack('apple', 2));

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', 1, this.size);
	if (!ret.ok){
		return ret;
	}

	var stack = contents[0];
	var ret = tests_assert_equals('Stack size', 4, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'apple', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_apple_overflow(){
	this.addItemStack(apiNewItemStack('apple', 100));

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', 2, this.size);
	if (!ret.ok){
		return ret;
	}

	var stack = contents[0];
	var ret = tests_assert_equals('Stack size 1', 100, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type 1', 'apple', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	var stack = contents[1];
	var ret = tests_assert_equals('Stack size 2', 4, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type 2', 'apple', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_apple_slot(){
	this.addItemStack(apiNewItemStack('apple', 5), 10);

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', 3, this.size);
	if (!ret.ok){
		return ret;
	}

	var stack = contents[10];
	var ret = tests_assert_equals('Stack size', 5, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'apple', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_remove_item_slot(){
	var stack = this.removeItemStackSlot(10);
	stack.apiDelete();

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', 2, this.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_remove_partial_item(){
	var stack = this.removeItemStackSlot(0, 1);
	stack.apiDelete();

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', 2, this.size);
	if (!ret.ok){
		return ret;
	}

	var stack = contents[0];
	var ret = tests_assert_equals('Stack size', 99, stack.count);
	if (!ret.ok){
		return ret;
	}
	
	var ret = tests_assert_equals('Stack type', 'apple', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_fill(){
	for (var i=this.size; i<=this.capacity; i++){
		this.addItemStack(apiNewItemStack('apple', 5), i-1);	
	}

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', this.capacity, this.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_item_fail(){
	var remaining = this.addItemStack(apiNewItemStack('banana', 1));
	var ret = tests_assert_equals('Returned stack count', 1, remaining);
	if (!ret.ok){
		return ret;
	}

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', this.capacity, this.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_subbag(){
	var stack = this.removeItemStackSlot(0);
	stack.apiDelete();

	var remaining = this.addItemStack(apiNewItemStack('bag_generic', 1));
	var ret = tests_assert_equals('Returned stack count', 0, remaining);
	if (!ret.ok){
		return ret;
	}

	var contents = this.getContents();
	var stack = contents[0];
	var ret = tests_assert_equals('Stack size', 1, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'bag_generic', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_banana_subbag(){
	var remaining = this.addItemStack(apiNewItemStack('banana', 1));
	var ret = tests_assert_equals('Returned stack count', 0, remaining);
	if (!ret.ok){
		return ret;
	}

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', this.capacity, this.size);
	if (!ret.ok){
		return ret;
	}

	var subbag = contents[0];
	var subbag_contents = subbag.getContents();
	var ret = tests_assert_equals('Subbag size', 1, subbag.size);
	if (!ret.ok){
		return ret;
	}

	var stack = subbag_contents[0];
	var ret = tests_assert_equals('Stack size', 1, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'banana', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_remove_banana_subbag(){
	log.info('Starting test: tests_bag_remove_banana_subbag');
	var contents = this.getContents();
	var subbag = contents[0];

	var stack = subbag.removeItemStackSlot(0);
	stack.apiDelete();

	var ret = tests_assert_equals('Subbag size', 0, subbag.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_serguei(){
	log.info('Adding subbag');
	var remaining = this.addItemStack(apiNewItemStack('bag_generic', 1), this.capacity-1);

	var contents = this.getContents();
	var subbag = contents[this.capacity-1];

	log.info('Subbag created');
	log.info('Subbag size is: '+subbag.size);
	subbag.addItemStack(apiNewItemStack('banana', 1));
	log.info('Banana added');
	log.info('Subbag size is: '+subbag.size);
	var stack = subbag.removeItemStackSlot(0);
	stack.apiDelete();	
	log.info('Banana removed');
	log.info('Subbag size is: '+subbag.size);

	var contents = subbag.getContents();
	log.info('contents: '+contents);
}

function tests_bag_add_banana_subbag_slot(){
	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', this.capacity, this.size);
	if (!ret.ok){
		return ret;
	}

	var subbag = contents[0];
	var ret = tests_assert_equals('Subbag size', 1, subbag.size);
	if (!ret.ok){
		return ret;
	}

	var remaining = subbag.addItemStack(apiNewItemStack('banana', 1), 5);
	var ret = tests_assert_equals('Returned stack count', 0, remaining);
	if (!ret.ok){
		return ret;
	}

	var subbag_contents = subbag.getContents();
	var stack = subbag_contents[5];
	var ret = tests_assert_equals('Stack size', 1, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'banana', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_delete_subbag(){
	var stack = this.removeItemStackSlot(0);
	stack.apiDelete();

	var ret = tests_assert_equals('Bag size', this.capacity-1, this.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_spicerack(){
	var remaining = this.addItemStack(apiNewItemStack('bag_spicerack', 1));
	var ret = tests_assert_equals('Returned stack count', 0, remaining);
	if (!ret.ok){
		return ret;
	}

	var contents = this.getContents();
	var stack = contents[0];
	var ret = tests_assert_equals('Stack size', 1, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'bag_spicerack', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_banana_spicerack_auto_fail(){
	var remaining = this.addItemStack(apiNewItemStack('banana', 1));
	var ret = tests_assert_equals('Returned stack count', 1, remaining);
	if (!ret.ok){
		return ret;
	}

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', this.capacity, this.size);
	if (!ret.ok){
		return ret;
	}

	var subbag = contents[0];
	var subbag_contents = subbag.getContents();
	var ret = tests_assert_equals('Subbag size', 0, subbag.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_banana_spicerack_direct_fail(){
	var contents = this.getContents();
	var subbag = contents[0];
	var ret = tests_assert_equals('Subbag size', 0, subbag.size);
	if (!ret.ok){
		return ret;
	}
	
	var remaining = subbag.addItemStack(apiNewItemStack('banana', 1));
	var ret = tests_assert_equals('Returned stack count', 1, remaining);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_add_cumin_spicerack_auto(){
	var remaining = this.addItemStack(apiNewItemStack('cumin', 1));
	var ret = tests_assert_equals('Returned stack count', 0, remaining);
	if (!ret.ok){
		return ret;
	}

	var contents = this.getContents();
	var ret = tests_assert_equals('Bag size', this.capacity, this.size);
	if (!ret.ok){
		return ret;
	}

	var subbag = contents[0];
	var subbag_contents = subbag.getContents();
	var ret = tests_assert_equals('Subbag size', 1, subbag.size);
	if (!ret.ok){
		return ret;
	}

	var stack = subbag_contents[0];
	var ret = tests_assert_equals('Stack size', 1, stack.count);
	if (!ret.ok){
		return ret;
	}
	var ret = tests_assert_equals('Stack type', 'cumin', stack.class_tsid);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_bag_remove_spicerack_item(){
	var contents = this.getContents();
	var subbag = contents[0];
	var ret = tests_assert_equals('Subbag size', 1, subbag.size);
	if (!ret.ok){
		return ret;
	}
	
	var subbag_contents = subbag.getContents();
	var item = subbag_contents[0];
	
	var stack = subbag.removeItemStack(item.path);
	stack.apiDelete();

	var ret = tests_assert_equals('Subbag size', 0, subbag.size);
	if (!ret.ok){
		return ret;
	}

	return tests_ok();
}

function tests_assert_equals(name, expects, actual){
	if (expects != actual){
		return tests_fail(name+' was '+actual+', expecting '+expects);
	}
	else{
		return tests_ok();
	}
}

function tests_ok(){
	return { 'ok' : 1 };
}

function tests_fail(msg){
	return {
		'ok' : 0,
		'error' : msg
	};
}

function tests_instance_my_location() {
	this.instances_create('test_instance', this.location.tsid);
	this.instances_enter('test_instance', this.x, this.y);
}

function tests_leave_test_instance() {
	this.instances_exit('test_instance');
}

function tests_increment_grapes_squished(){
	if (!this.grapes_squished) this.grapes_squished = 0;

	this.grapes_squished += 1;

	if (isNaN(this.grapes_squished)){
		log.error('-------------------');
		log.error(this+" grapes squished is not a number!!!");
		log.error('-------------------');
	}
	else{
		this.apiSetTimer('tests_increment_grapes_squished', 1000);
	}
}