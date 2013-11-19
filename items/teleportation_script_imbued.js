//#include include/takeable.js

var label = "Imbued Teleportation Script";
var version = "1352162718";
var name_single = "Imbued Teleportation Script";
var name_plural = "Imbued Teleportation Scripts";
var article = "an";
var description = "Free ride! A pre-imbued teleportation script (well, a magical location-incantation scribbled on some Paper with a Quill), this will zip you on a one way ticket somewhere specific… For free! Because someone already paid for your ride.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 210;
var input_for = [];
var parent_classes = ["teleportation_script_imbued", "teleportation_script", "note", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.initial_text = "";	// defined by note
	this.instanceProps.initial_title = "";	// defined by note
}

var instancePropsDef = {
	initial_text : ["Initial text to show on this note, from no author"],
	initial_title : ["Initial title to show on this note, from no author"],
};

var instancePropsChoices = {
	initial_text : [""],
	initial_title : [""],
};

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

verbs.give = { // defined by takeable
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
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.imbue = { // defined by teleportation_script
	"name"				: "imbue",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Spend a Teleportation Token to make travel with this Script free",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid != 'teleportation_script') {
			return {state: null};
		}
		if (!pc.skills_has('teleportation_4')) return {state:null};
		if (this.is_imbued) return {state:null};
		if (!pc.teleportation_get_token_balance()) return {state:'disabled', reason: "Buy more Teleportation Tokens!"};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.prompts_add({
			txt			: 'Are you sure you want to spend one Teleportation Token to imbue this script to '+this.destination.name+', '+this.destination.mote_name+'?',
			is_modal		: true,
			icon_buttons	: false,
			choices		: [
				{ value : 'yes', label : 'Yes, please' },
				{ value : 'no', label : 'No, thank you' }
			],
			callback	: 'teleportation_imbue_script_prompt',
			tsid		: this.tsid
		});

		return true;
	}
};

verbs.read = { // defined by teleportation_script
	"name"				: "read",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Where does it go?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.readScript(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.write_on = { // defined by note
	"name"				: "write on",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Change what it says",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'teleportation_script' || 
				this.class_tsid == 'teleportation_script_imbued' || 
				this.class_tsid == 'note_hint') {
			return {state:null};
		}

		if (this.last_editor && this.last_editor != pc.tsid) return {state: null};

		var disabled_reason = null;
		if (pc.skills_has('penmanship_1')){
			function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
			if (!pc.items_has(is_quill, 1)){
				disabled_reason = "You need a working quill.";
			}
		}
		else{
			disabled_reason = "You need to know Penpersonship.";
		}

		if (disabled_reason){
			return {state:'disabled', reason: disabled_reason};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var rsp = {
		    type: "note_view",
		    title: this.title ? this.title : "A note!",
		    body: this.contents,
		    start_in_edit_mode: true,
		    itemstack_tsid: this.tsid,
		    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
		    updated: intval(this.last_edited),
		    max_chars: 1000
		};

		pc.apiSendMsg(rsp);

		return true;
	}
};

function parent_verb_note_read(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	this.readNote(pc);

	var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
};

function parent_verb_note_read_effects(pc){
	// no effects code in this parent
};

function setTarget(target){ // defined by teleportation_script_imbued
	this.parent_setTarget(target);
	this.is_imbued = true;
}

function getLabel(){ // defined by teleportation_script
	if (!this.destination) return this.name_single;
	return this.name_single+' to '+this.destination.name+', '+this.destination.mote_name;
}

function imbue(pc){ // defined by teleportation_script
	this.is_imbued = true;
	pc.teleportation_spend_token("Imbueing a Teleportation Script to "+this.destination.name+".");

	this.last_editor = pc.tsid;
	this.last_edited = time();

	this.history.push({editor: pc.tsid});
	if (this.history.length > 10){
		array_remove(this.history, 0, this.history.length-10);
	}

	this.state = this.buildState();
}

function onContainerChanged(old_container, new_container){ // defined by teleportation_script
	this.state = this.buildState();
}

function onGive(pc, msg){ // defined by teleportation_script
	var target_pc_tsid = msg.object_pc_tsid;

	if (!pc.teleportation_scripts_given) pc.teleportation_scripts_given = {};

	if (!pc.teleportation_scripts_given[target_pc_tsid]){
		pc.teleportation_scripts_given[target_pc_tsid] = target_pc_tsid;
		pc.quests_inc_counter('give_teleportation_script', 1);
	}
}

function readScript(pc){ // defined by teleportation_script
	var rsp = {
	    type: "teleportation_script_view",
	    title: this.getLabel(),
	    body: utils.filter_chat(this.contents),
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000,
	    destination: this.destination.tsid,
	    is_imbued: this.is_imbued ? true : false
	};

	pc.apiSendMsg(rsp);
}

function use(pc, use_token){ // defined by teleportation_script
	if (!this.is_imbued && !pc.skills_has('teleportation_1')) return {ok: 0, error: "You need to know Teleportation I to use this."};

	var dest = apiFindObject(this.destination.tsid);
	if (!dest || dest.getProp('is_deleted')){
		pc.stats_add_imagination(100);
		var msg = "Your destination is no longer available! As a small compromise, here's 100 iMG";
		if (this.is_imbued){
			msg += " and a refunded Teleportation Token";
			pc.teleportation_give_tokens(1,"Teleportation Script refund");
		}
		pc.sendActivity(msg+'.');
		this.apiDelete();
		return {ok: 1};
	}

	var ret = pc.teleportation_can_teleport(null, true, this.destination);
	if (!ret.ok) return ret;

	if (!this.is_imbued){
		var energy_cost = 0;
		if (!use_token){
			energy_cost = pc.teleportation_get_energy_cost();

			if (pc.metabolics_get_energy() <= energy_cost){
				return {
					ok: 0,
					error: "You don't have enough energy."
				};
			}

			pc.metabolics_lose_energy(energy_cost);
		}
		else{
			if (!pc.teleportation_get_token_balance()) return {ok: 0, error: "Buy more teleportation tokens."};
			pc.teleportation_spend_token("Teleportation Script to "+this.destination.name+".");
		}
	}

	ret = pc.teleportation_teleport(null, true, this.destination, true);
	if (ret.ok){
		if (energy_cost) pc.buffs_apply('teleportation_cooldown', {duration: pc.teleportation_get_cooldown_time()});
		this.apiDelete();
	}
	else if (!this.is_imbued){
		log.info(this+' '+ret);
		if (use_token) pc.teleportation_give_tokens(1,"Teleportation Script refund");
		if (energy_cost) pc.metabolics_add_energy(energy_cost);
	}

	return ret;
}

function canPickup(pc){ // defined by note
	var c_type = this.getContainerType();
	if (c_type == 'street' && this.container.isGreetingLocation()){
		return {ok: 0};
	}

	return {ok: 1};
}

function note_getLabel(){ // defined by note
	if (this.class_tsid == 'note'){
		var container = this.container;
		if (container && container.is_bag){
			return this.title ? '[Note] '+this.title : this.label;
		}
	}

	return this.title ? this.title : this.label;
}

function onCreate(){ // defined by note
	this.initInstanceProps();
	this.contents = '';
	this.title = '';
	this.last_editor = null;
	this.last_edited = 0;
	this.history = [];
}

function onInputBoxResponse(pc, uid, body, title, msg){ // defined by note
	if (this.last_editor && this.last_editor != pc.tsid) return;

	function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
	var quill = pc.findFirst(is_quill);
	if (!quill){
		pc.sendActivity("You don't have a working quill anymore!");
		return;
	}
	quill.use();

	this.setInstanceProp('initial_text', '');
	this.setInstanceProp('initial_title', '');

	body = str(body);
	title = str(title);
	if (uid != 'teleportation_script_create' && this.contents == body && this.title == title) return;
	title = title.substr(0, 150);
	body = body.substr(0, 1000);

	this.contents = body;
	this.title = title;
	this.last_editor = pc.tsid;
	this.last_edited = time();

	this.history.push({title: title, body: body, editor: pc.tsid});
	if (this.history.length > 10){
		array_remove(this.history, 0, this.history.length-10);
	}

	if (uid == 'teleportation_script_create'){
		var loc_info = pc.location.get_info();
		this.destination = {
			tsid: pc.location.tsid,
			x: pc.x,
			y: pc.y,
			name: loc_info.name,
			mote_name: loc_info.mote_name
		};

		if (msg.is_imbued && pc.teleportation_get_token_balance()){
			this.is_imbued = true;
			pc.teleportation_spend_token("Imbueing a Teleportation Script to "+pc.location.label+".");
		}

		pc.prompts_add({
			txt		: "You've created a Teleportation Script! You can give it to anybody you like.",
			icon_buttons	: false,
			timeout		: 15,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
}

function readNote(pc){ // defined by note
	var disabled_reason ='';
	if (pc.skills_has('penmanship_1')){
		function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
		if (!pc.items_has(is_quill, 1)){
			disabled_reason = "You need a working quill.";
		}
	}
	else{
		disabled_reason = "You need to know Penpersonship.";
	}

	if (this.last_editor != pc.tsid) disabled_reason = 'This is not your note.';

	if (this.disabled_reason) {
		disabled_reason = this.disabled_reason;
	}

	if (this.getInstanceProp('initial_text')){
		this.contents = this.getInstanceProp('initial_text').replace(/\\n/g, "\n").replace(/&quot;/g, "\"");
	}

	if (this.getInstanceProp('initial_title')){
		this.title = this.getInstanceProp('initial_title');
	}

	var rsp = {
	    type: "note_view",
	    title: this.title? this.title : "A note!",
	    body: this.contents,
	    disabled_reason: disabled_reason,
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);
}

function parent_setTarget(target){ // defined by teleportation_script
	this.setInstanceProp('initial_text', '');
	this.setInstanceProp('initial_title', '');

	this.contents ='';
	this.title = '';
	this.last_editor = '';
	this.last_edited = time();

	this.destination = target;
	this.is_imbued = false;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"teleportation_script",
	"no_rube",
	"bureaucracy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-32,"y":-16,"w":59,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKMUlEQVR42s2YC09b5xnH8w3yDRZp\nUtWqUpUuNFu2NqWT2m1du1FpUtd2lbJNartpatOqkdJl0rxcSi5NxjUlQIgBGzCOjY25GDD4GIPB\nYLAxvmGMMVdDuNgJSZqknfbf87zHNpAmJFBp6pH+Osc2POf3Ptf3nF27HuO4kwjuub08qry1Mird\nTQaBryL47+3xGElKC3ciioy+Gj9M5+wtdXss55sbIcW9ZEhxe9UnNGCpUDSrTx5qUZ\/as+txj6UZ\nh3J5th83l7y4veITupsM4Ju1MfznZljo6xuhjO4kAhndux7MfM\/XXyX8uLnsJVsjGVuspak+WI35\nKPr8Xfz7+JtQFvwNjVXHcx4JFxtrO7w024flOSdW5gextsHwreVRWXyd+o4XwVojJRc9m5RYcNPZ\nTedhrMZdwhZracqBJvUpAZd\/8i0U5v4BRaT60qOxRwLORroM02ELZsY7sTDVi9WFIdwgo6zrBHFj\n2Ye1FfLKahC3EiH63b2lktc8GUBeMC\/c1lSEi2cOCbCSL\/6Esrz3UJ73PqovHsaWcJNu\/Z4Jf7Nn\nicK7MjeAVTKYIED2wnW60Q32FHttNUBwQQH7WICLDDgkAOciEurLjiL\/1Nu4dP7PuFL0V6hKDkN1\n6WOoSz7ZGvDalD2P8g+PBxgSnkwsjnwLKsEhvuYVHr8fMOhqQE3Jp1LR6XcV5DVFdcnHefXKzyRt\n5d8lzeWj0paAi1N26doGQDbIIU4QYCwsIeLvXA8xefBWMoTbyTCBjKa8xSngF7\/foFzNAG4Isaen\nBk2qk4pdOzmioQ7PzIQEhuRcmYnY4OhSY7BHi0ZtIeZjDnHjlfgwFmcGZUjyJIPymT+vkXfZyzLg\nyKYiWZkf+G6A44E2ZSTQBtZUuAvxqR4CHcDsRA9s7VUUZrlQhhx6LEw7BQyHW8AKMP8GuHR43SJN\nBCDZCrr0Me57OwIksJw04EZZzRWIk\/fmor0EbkN3RzXB96PfpkFnSwXsFlUKbB2OczbtvWvTfQgO\nGTDq1EqOtlJpx4DRqGV3yGvyBD1G4cH5STuW5vpFmP3DTfA4DRj3daBPqhUhHxlshJfEHg16zPR9\nHVy9OuG5ZMpzSSqO6wubZa4769m104MKxXBtuhfpapYb9oAIkSgY8gjfnEPOICLsKclg62F9EBxr\n2FaNbY22jcdCzJ4dj9ogQ9JEuR+SlEiBcvtgWOEtoWH5ewHneiAca27cClP1ibwdAcYnHXsIEotU\nIGnIBN1sxNmAyGgblqb7xU0SAnYo5VX5LD6nFsE99GGALIvufGzHYY7HbJ7FFOQqVx7lX2N9gTDc\n2VS+CZJ7G6uX8lS+HhDVKrxOuh8sER8UNj12NXZcLPGolLcQswnvcagYjj3YZ61Ba8OXQgzKn8e9\nZoyNtMKoycdwn46qvQejg0a0m0oR8bUJyARPJE4Rul6YtIHsY3qsAy11p3fmxfmopIhPSsLYQqyb\njHViwFaHyaCFQkceInAW\/847n6CnWVR90N0soCI+M2qv5KJfqkFguBG0ARF20nDzE1ZSJ5yW8sfb\nYn27UKzZ81GrbCxlkFcccGnh6r6CAWs53L1VmKUdD+fpg8TpQR1BBqNoxDfAzRHcXMQCv1PDxaLc\nNuBssDV7KtiKtCJeI8z6fPRZSgXciEOFWKBF3Hw2YhVKA7G3\/EONCHtbEA2Y18Gi7LUuAutE1NdE\njVtLjbuW8vBU7DsDsswNBWhryEeboYiATZSDpXD11KFZV0hARgHLkNNjVjRqCsi7NvR0VCEWNJO3\nq8XCNsplq4C3r4arefs9cTbSmj09Zt4E2NFIxWH+AA2GP1KRFENV9R7c\/Rr4aPvU11WNqVAnPH16\nLNJItJjKEB4xw2ZWUt71YibcAZ+zToAN2yvpWoMwTStWX3sphfl49rYBZ8bayHA7qQ2O3mOoNbwM\nS9+vILlyIPX\/DlrTz2AwfCrCxlqZ5SodFFAsR6caE\/52GpPVVCgN4AWnodIaH2mkQinb2e7G268+\nNObWobPzI7TZ3oBz9FU4vb+QRdc212tobj6CkLdaJDwrTnkm+ieJp9HseEdmkbxgjgTnH8NNjJoo\njykXB+ulbXtwwms4HPEaKGwt6LZ9hm7XL5FXtm+Tupy\/hq7lRVwsfwlxqsp5ApwVMO2boGbIc+y9\n6VCrsDcVpFbkNcTCHr2CNyc76oO0MgWvrsd2Anrzz9HcdRDFyn04lvu00LmLe2Fsf4EgX0eL6RTl\nmxGD3Sq4HXUyTAooramgDMY2WZN+E6kR4x590utQS02qE3u3t+0aNUpsgA112t+GtumA0Of5zwhp\nTQeEupy\/waXLr1NRlCAwpBOg7CWXXQVrC1U5QY9Ti5LBTBmwqM+I6KiBwtyAIali+zlIIY5FfQbY\nrbnQN7+OyvosoeKKZ3Gm8BlUarKE2ntfgyL3eQHG6rdWZby0ESo8oqcFaDeAGRB2X4XD\/GXS3lKc\ns602M+nT753w6jHhbRCGJOsRVOuex4fHnsjoyL+eREXtc1DWv4CCCx9RTyyhqr2C7rZydDWXUB+8\nAL36nLgekCrFmYHYY2w3QvYjIzrSVdibCmLbAox4rir4H4UBMnShIBs1hmycL356kzTGbJw89xSK\nLv5e9swGBVwaAdRtLpWhBJh+E9i4R0vPJ7XoariwvT7oG6w57B+oiYXon8eG62kKKFGtegeX1Qdw\n4twTQgVlz6Jc\/TyuqLJh0H22DkEaoenQfDUfQ\/YqARUa1iA0VCcUGKDNw4CaWksN2abv6R7t9Wcf\n\/LB+72ZUQcLXt6Kee7eiebgTO3Q3Gchho2zE71TBP6ikHUoJ9JpPcDw3C4VlWThf9CP84+RTeO\/D\nH0Bn\/C08vZX0t2oE6KZ8Q9lDspfC7nrZzhaizULywa\/X1iYOkXC\/7t6cAIPfWQsgGHsHw0GCGHsD\nvok3hfStr0Cr\/xjtHccx7LxEQ19HE8GQqlATuLg4fKzMQh8iF40+k+rkw98mJBfcycyDj3gxNCoe\nH8UrjeV22F2voKvvJRjM2dRWZBWXvYrJsGPzotbkRT1IQ7aqhwL2d5Rs3WLmY9Yc2g4l5Z3I+nMI\nv1nwB3LRYj2IVpZ0EE2Wg2hopclR8hb97pQflu5b3Pqbr0Dm7Vd\/x+WHAkrGPDyySfO4ifpMSgqP\nNBVoZiW5+zvsp6HSHaBx9lPoWa2yysreRyzUJvZ48dSOezG2eXH8qJB+ZPX1a6nfXfwWnKdHuXV4\nH3UUlu3PLiz9CUHuhzqlKu1+6OuPeQKDdRK3k\/S0EU2ZRhmPNDHeaNSld0O8YZCMBSKc93tvR9v9\n9FFamrWbAb+8koVLlftQfHk\/+PMHR57cZDToVu8JDtZmj7lqckLDdYowaWxIY6A2IlEVk7QSV7XX\nUQ0rQVl0Xwjt+Ll445Ff8mOczc\/CFwXP4XyhrL8ceUqx6\/twXNK8sDf\/8gH888yzOE2Auef3CX1v\nAN8\/+sPdLL7WWl7eXWl8UVmhf\/H\/Avg\/JEnaraqs0K8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/teleportation_script_imbued-1334877948.swf",
	admin_props	: true,
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
	"teleportation_script",
	"no_rube",
	"bureaucracy"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"t"	: "write_on"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "imbue",
	"e"	: "read",
	"t"	: "write_on"
};

log.info("teleportation_script_imbued.js LOADED");

// generated ok 2012-11-05 16:45:18 by lizg
