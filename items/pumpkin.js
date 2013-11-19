//#include include/food.js, include/takeable.js

var label = "Pumpkin";
var version = "1352770358";
var name_single = "Pumpkin";
var name_plural = "Pumpkins";
var article = "a";
var description = "One plump and thick-skinned pumpkin. Perfect for carving, mulching, munching, and, in times of need, for using as a carriage drawn by tamed gerbils.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 11;
var base_cost = 41;
var input_for = [226,227];
var parent_classes = ["pumpkin", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_pumpkin"	// defined by crop_base (overridden by pumpkin)
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
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

verbs.give = { // defined by pumpkin
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.carving) return {state:'disabled', reason:'You cannot give while carving!'};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_give(pc, msg, suppress_activity);
	}
};

verbs.drop = { // defined by pumpkin
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

		if (this.carving) return {state:'disabled', reason:'You cannot drop while carving!'};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_drop(pc, msg);
	}
};

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.carve = { // defined by pumpkin
	"name"				: "carve",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Carve a pumpkin",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!isZilloween()) return {state:'disabled', reason:'You can only carve a pumpkin during Zilloween!'}
		if (this.carving) return {state:'disabled', reason:'You are already carving!'};
		var pick = pc.items_find_working_tool('pick');
		if (!pick) pick = pc.items_find_working_tool('fancy_pick');
		if (!pick || !pc.items_find_working_tool('knife_and_board')){
			return {state:'disabled', reason:'You need a Pick (or Fancy Pick) and a Knife & Board to carve'};
		}

		if (pc.metabolics_get_energy() <= 15) { 
			return {state:'disabled', reason:"You don't have enough energy to carve a pumpkin!"};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.apiSetTimer('onCarveStep1Complete', 2 * 1000);

		var pick = pc.items_find_working_tool('pick');
		if (!pick) pick = pc.items_find_working_tool('fancy_pick');

		var annc = {
			type: 'pc_overlay',
			state:'tool_animation',
			uid: 'pick_'+pc.tsid,
			item_class: pick.class_tsid,
			duration: 2000,
			pc_tsid: pc.tsid,
			delta_y: -120,
			dismissible: true,
			dismiss_payload: {item_tsids: [this.tsid]}
		};

		pc.announce_sound('PICK', 50);
		annc.locking = true;
		pc.apiSendAnnouncement(annc);

		this.carving = true;

		return true;
	}
};

verbs.eat = { // defined by pumpkin
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.carving) return {state:'disabled', reason:'You cannot eat while carving!'};

		return this.food_eat_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_food_eat(pc, msg);
	}
};

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function parent_verb_takeable_give(pc, msg, suppress_activity){
	return this.takeable_give(pc, msg);
};

function parent_verb_takeable_give_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_food_give(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_give(pc, msg, suppress_activity);
};

function parent_verb_food_give_effects(pc){
	return this.parent_verb_takeable_give_effects(pc);
};

function parent_verb_crop_base_give(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_give(pc, msg, suppress_activity);
};

function parent_verb_crop_base_give_effects(pc){
	return this.parent_verb_takeable_give_effects(pc);
};

function parent_verb_food_drop(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
};

function parent_verb_food_drop_effects(pc){
	return this.parent_verb_takeable_drop_effects(pc);
};

function parent_verb_crop_base_drop(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
};

function parent_verb_crop_base_drop_effects(pc){
	return this.parent_verb_takeable_drop_effects(pc);
};

function parent_verb_crop_base_eat(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_food_eat(pc, msg, suppress_activity);
};

function parent_verb_crop_base_eat_effects(pc){
	return this.parent_verb_food_eat_effects(pc);
};

function onCarveComplete(){ // defined by pumpkin
	var pc = this.getContainer();
	if (!pc) return;

	pc.announce_sound_stop('KNIFE_AND_BOARD');

	this.apiConsume(1);

	var face_type = (Math.floor(5 * Math.random()) + 1);

	pc.createItem('pumpkin_carved_'+face_type, 1, false);
	pc.createItem('pepitas', 5, false);
	pc.createItem('jellisac_clump', 1, false);

	if (isZilloween()) { 
		pc.achievements_increment('pumpkins_carved', 'number_'+face_type);
	}

	var growls = [	'Carved, the pumpkin is something special. Something with personality. Something that will sit, staring, waiting until you fall asleep. Hm. Maybe you can put it outside.',
				'You hacked and sliced and created life from the hard shell of a gourdy vegetable.',
				'A moment ago it was just a pumpkin. Now it\'s kind of terrifying.',
				'You created life from dead matter. You\'re the Frankenstein of vegetables. Now reanimate it with fireflies!',
				'You made a little pumpkin friend. At least this one won\'t talk back. Or WILL it?',
				'The pumpkin, freshly carved, stares at its creator with something halfway between love and hunger.',
				'The carved pumpkin is now filled with personality. Good personality? Or evil? Who can tell?',
				'This used to be just a vegetable. Now, you could have sworn it just winked at you.',
				'It\'s still just a pumpkin, but now carved, you could have sworn it whispered at you. Something about fireflies?'];

	pc.sendActivity(choose_one(growls));

	pc.metabolics_lose_energy(15);
	pc.metabolics_add_mood(10);
	pc.stats_add_xp(5, true);

	this.carving = false
}

function onCarveStep1Complete(){ // defined by pumpkin
	var pc = this.getContainer();
	if (!pc) return;

	this.apiSetTimer('onCarveComplete', 1 * 2000);
	pc.announce_sound_stop('PICK');

	// Start overlays
	var annc = {
		type: 'pc_overlay',
		state:'tool_animation',
		uid: 'pick_'+pc.tsid,
		item_class: 'knife_and_board',
		duration: 2000,
		pc_tsid: pc.tsid,
		delta_y: -120,
		dismissible: true,
		dismiss_payload: {item_tsids: [this.tsid]}
	};

	pc.announce_sound('KNIFE_AND_BOARD', 50);
	pc.apiSendAnnouncement(annc);

	return true;
}

function onOverlayDismissed(pc, payload){ // defined by pumpkin
	this.apiCancelTimer('onCarveStep1Complete');
	this.apiCancelTimer('onCarveComplete');
	pc.announce_sound_stop('PICK');
	pc.announce_sound_stop('KNIFE_AND_BOARD');
	this.carving = false;
}

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/927\/\" glitch=\"item|seed_pumpkin\">Pumpkin Seeds<\/a> in a Crop or Herb Garden."]);
	out.push([2, "This item is seasonal. It can only be grown during the appropriate holidays."]);
	return out;
}

var tags = [
	"no_rube",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-37,"w":39,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALdklEQVR42u1YaVBUZxbl11SmKhUb\nkK3pvV\/rONaMk8pk1kSdRI0xRkwcNTFGNMZ9QVF2ERBBFFRQFHChQRFRUXABN6QF3DViXNC4pNUk\nxqgRDf3\/zLnfA806mUlNaqyp6apb0K+\/d+\/5zjn3fq\/bz+9\/\/RU33r\/TnFnBVdkLf+XJX\/17T17+\n7yKeKIBzZ4emzI0JRU5ONxSV\/hn5Rc8hM91RJcCfCIAZqbaUhBlBmDk1BIuXdkd2djekJZkQMyXA\n\/UQAXJDuSJkdHY6oqHDEx9uwZFkPRL79S4wY\/ouIJ4bBaZPJ3rLfIjW9K9Izu2Dk8KcwdKjfkyFx\n+hxTSkKsGWlpGnKX90DM7HAB6HlimiQ5JrRXaqIZCbEmLMrqiuioEIwc9lTKEwPw4zK7dW5sGBvD\njNiZIRg76mmsXtDV0+bRUu7X2K0\/a3GccnTynRoU2XYuxu27mALf6ZHwHX4eDw648EWN5r2+SfNe\nLHZh5ZwQJM0MwuypAcp\/dXkWXCpxocWtea+Vu\/DJVq7f5ULrfhd8Tb+B79RQtF2Id\/vOz4rEqaE\/\nzav3ap2RDw9ozb4jf8Fne\/vjzsHB8J14jQWeRWt9d9zd3QW3trtwsUTDrhxKPC0AUeOfUR28KiEM\nZwtduLzeheubXPis2oW7tV1wv6472hqfhe\/YSwQ5BG0n38DDQ39tvlfnjPyXgV3b7Oh0vdLp+XS7\nExfcTlws\/yPuNI2A70ICFItnJ8N3MgK+Q8\/hYb0LX+4lgCoNH6y34Wa1UzH1+Q4XPq1y4Va1\/rms\nk\/XqPrlf5YlC27FX0Cpq1DpxfavdI7X\/KbjThfYeLSX21gslDny4yom2hl\/Dd7wffGfeg68liYnn\nfQPg7Z0armzQcH+fLp\/EfQK6u9vFzwQ4gVLeB3XfBjhP5WtrfhcPDvXC57s0XNvkwLkSW+txYvhe\ncE2L7T1O5Ntajy5z4LzbgXt7NHzl0SAS+yiFAnnmffg+GK4kul3TTQGU4m0eAmjsBl9DV95DoLx2\nT0Du0P0nQH2N3XVp5X7Jc2YM2o4PxIOGP+DuXie8Wxw4s9aGw8ttrXuywr8L8kCWzXswx4aTBXZ8\nUuXEHdL+oI4AG7qwMf7E5H30ONqTn3fDrR06OAHlO\/ICme6vs821bQfJJNm8U6P778Zmyr69vUF4\nv57nZfrxeSXx7RoHJaZqbjsal1pRm2HxfgNcFYftnvkW7M2w4WKZHfQgfaThS7LYekBTrPgadDC3\nKcen2zTlLXVdGGZXKuk+HN8u\/7N4yML39uh+vFnpgnTzl7SCgJc8bQ3cIHMLe+L3q5vtOFdqQ8MS\nK3akWbAx1vh4lm6JN3u3JVpxNN+KC6V2XK1wKBZv73Qqqe\/v05S\/7tRqaC7QVCPc7ygmsolklzLp\nq2R9FBH0V9JAe3SZOwB+sk2\/r1XyMe7u1nCLNa5XOnCp3I5mStyYZ8W2OWasiw7XWVwzJTRyY4yZ\nFy04usKmfPBRmQMfb3IqkJ8zAWeekuvUSg3eTZpqAGkG5T2RrHkUuzwOvnMzdY9xVkrnfpvBq2W6\n7LLRL2qcyiY3KK0QIuydLLTBs8SCSj4NFUcZkTc2NNKvcKLRXconkeq5JjTlWnGqyMZusuPyBu5s\nixM3tzIRx8hNyt6UraliUlSKi4y+ph66\/wQYZ5tilA0j\/rxb61Kz8sYWgtvAubhOH0m3qmkTbv4G\ncwu4lvUONK9hg1DBukVmbE40oWiyEYtHB7v9VkwI866dakR1ign12VYcWW7F6VV2yKi5QpDXKgQo\n59xKJ85y9IjhxfjChMglUqoOJWtqlNBfAlw8KlaQeSjD+gqHdksxGduihyhxZSOlXcfmKLbjONXz\nLLaiZr4J5XEmrBhvRNY7IV6\/ZWPDUDgpDNvmmrEn04LGJTYuph9W6+Pmo\/XcJWdd40InTwYmrtDU\n6BAWhSGRWtgSSSVkxAg42YAM6g55PyrVcGGNhqvlThWXy3gIlBLcWgdOFNiUevsWWhRRZbFG5L4X\nioy3g+G3eHQo8seFoSIuHDtTzdifZeViG04IyFX0xlom4olSn8GkLHKNYHkG6yC3y5msD2aRXEJA\nC3Md4LwVwp7GHBrOM9cl5mgpceJ8sRMfkgTx3eE8Gw4ssmJXusgbjuIZRmRHhiBlKAEuGBGCpWNC\nsG6WEZXsnpp0C+oX2XAo106QDpwucKK50IHGRU4l0WUyeq2cMm0WP2pqCIvPhFEJASay6uD0DQl7\nLWs1nC3ScG61pk6p5iKnyn+IZHhyOPs45rbOMWHdbCMKJodCcCW+0Rl+pLF54ahgrKYPy2PCsS3Z\nzMVW1C8k7UvsOJrHJEscOJjlwFkmb3HrUkthAaCAbtHB3mz3lzB8bSPlLCO4dZSWGzu7SsNp+li8\nfCrfiWPLHYoEIWM3wVXTYuWx4Vgznd07LgRpw4IQMyCwyi9xcEDU\/LeCsYwXi9nNG2nQ6mQLdqez\no7I4l3Ic2J9hx+5UsrlSds+CZOMSn2Iul+me+phgOkLYFWDCtKy50M6c3HsiT8OxXCcOL6UiOXYc\nIAlSZ3uKBZviTSiZEY78CaHIGqmzN7mPIcIvro9\/p7l\/D8IisljAZimdYUJFbDvIeTbszyS4NBt2\nzGHzLOPuV9A7lOfcGqeS7SL9JBJeKnWquCghwOgxkfMMwX3Ae+TeQzlOtWHPQjvz2lA7z8o6Zmwi\nKaUzjap+Du2WOiwY0a\/6Pz7u4gYFuNOGdcZSdk7RJGM7SDOqkiyoSbWhiqfM1gQ2D5MfzWXXLdel\nOlPoVIyeZXcK4I6Qa2cK9dEka4U1ubeem61j7E23oYabruLhUBFnJjh97i19LwTz3wpC\/KBAshfw\n+Kib\/oohImFwADLZ1pzeHDtGlIjcPGG2JliwOc6CLbFkNM2Kgwt1TyqgZOVkvkMxJMwqf63QPSaM\nHcujnFzbmO0gMIdSoibFhu3JVlTGm1X+kiiTqpfLupkjgpFEaWf0D8D45771rTD61QDvnCGdZTiq\nGVQw0Qj3tHBsiDar2BhjUYzunW9D3QKbAspHNAX2cK4eR9r\/yrWmxQ40ZNvhyRIP27CToLYn6Ups\n5mbLonmcTWsHx3pSN5n1Zw0IwLjehu9+6Z\/U2xA5e2Cgmj1i0g6QkqRkOtufspfNMmEHC9WSSZFJ\nfCRg6+kpz9eiPotSEtQ+bkZY2zmXKsTqwMpn8UFghhlrp5pQMOExOOmDmNco7UsGjHnR0Ot7H1pn\n9A\/0PALZzuRKJhF\/rCGbxdMp+2wTtiZyLBDorhTxkgC2qYbqCHlfk2pVUlaRNZGynJsroxKy2dVT\njCrv0jE6OKkX+3pnTOnD7zX9OFp+6CW6T+7j3ywgk4cE0ZMhyOFEF3+sYEKRQ47F9TR1BYuKNyvp\nUQG8TSJJ\/yu+rYy36FJyrZugxGuKNaqynCeXnGAyjIW5DnDje\/s374\/7ke8lAjKqX0CzeCGJnpg3\nPAgL3g3GYu5WGmjZ+2R1YhjWcLDLU5CSnsxIiHwd\/4uMwriwtYpRNClcPQCIKotGsVvf1htCZBVw\niYOCfxzc118TextSovr7I35woNplBtnMIlBhNDsyWJ3fwqrMLrHAqsnhj0Ley3X5XDYkjImccr4K\nayKp5J1JEibSc6NfMET9pO\/GY3s+3XNaX4NbJE9QQHVG548gqyMJdnSImp3CitjgUfC9XM9WmwlR\nTSdPJnJ8dbA2tV8AxvZ8xv2DDfFv\/f4yMLhH\/MBArwCNiwhUx1DykEDIcJdjMoOAM98JfhQCRq7L\nZgSUKJDYDkxm3PS+\/s2S8z\/\/c++AwIipfQxVsQMDW6NZLPo1f8S87o+EN+jXN4NUJL4ZqCI+IkDJ\nKA0gUk7p5++d8JKhasyLT\/f62X8wGs\/zm9L3Gvc3Q69JEi8bIqf0M3gZkIgb2Nkzta9h0KS++ud+\n\/3\/9F1\/\/AG5+iBXLDUH6AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pumpkin-1334213407.swf",
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
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "carve",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("pumpkin.js LOADED");

// generated ok 2012-11-12 17:32:38 by mygrant
