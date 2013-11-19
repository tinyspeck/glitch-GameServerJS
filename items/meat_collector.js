//#include include/takeable.js

var label = "Meat Collector";
var version = "1347677170";
var name_single = "Meat Collector";
var name_plural = "Meat Collectors";
var article = "a";
var description = "A farm-grade meat collector. It works around the clock to collect meat from your piggies when you can't.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["meat_collector", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

verbs.drop = { // defined by meat_collector
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Place this Meat Collector here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){ return {state:'disabled', reason: "You're dead!"}; }
		if (this.isQuestItem()) return {state:'disabled', reason: "This item is needed for a quest and can't be dropped."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_takeable_drop(pc, msg)){
			if (pc.location.pols_is_pol()){
				//
				// Is there already one here?
				//

				var collectors = num_keys(this.container.find_items(this.class_tsid));

				if (collectors >= 10){
					pc.sendActivity("WARNING: You have so many collectors now that you are freaking the animals out a bit. You shouldn't add any more, for sure!");
				}
				else if (collectors >= 5){
					pc.sendActivity("Warning: Too many collectors can confuse the animals and make collection less efficient.");
				}
			}
			else{
				pc.prompts_add_simple("This Meat Collector is inoperable. You can use only a Meat Collector in a back yard.");
			}

			return true;
		}

		return false;
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
	"sort_on"			: 53,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.collect = { // defined by meat_collector
	"name"				: "collect",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Retrieve any meat inside",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOnGround()) return {state:null};
		if (this.container && this.container.pols_is_pol() && !this.container.pols_is_owner(pc) && !this.container.acl_keys_player_has_key(pc)){
			return  {state:null};
		}
		if (!pc.skills_has('remoteherdkeeping_1')) return {state:'disabled', reason: "You don't know how to use this contraption."};
		//if (!this.isLeftMost()) return {state:'disabled', reason: "Only one Meat Collector can operate in a location. See the Meat Collector at the left end of the yard for your meat."};
		if (this.meats_inside){ return {state:'enabled'}; }

		return {state:'disabled', reason: "It's empty!"};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.meats_inside) return false;
		if (!pc.skills_has('remoteherdkeeping_1')) return false;

		//
		// You get all of it, I assume
		//

		var remaining = pc.createItemFromSource('meat', this.meats_inside, this);
		pc.quests_inc_counter('meat_collected', this.meats_inside-remaining);

		pc.sendActivity('You collected '+(this.meats_inside-remaining)+' meat.');
		this.meats_inside = remaining;
		this.updateLabel();

		if (!this.isFull() && this.isLeftMost()) this.apiSetInterval("onInterval", 24);

		return true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canPickup(pc, drop_stack){ // defined by meat_collector
	if (this.dropper && this.dropper == pc.tsid) return {ok: 1};

	if (pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc)){
		return {ok:0};
	}

	return {ok: 1};
}

function findCollectors(){ // defined by meat_collector
	this.collectors = {};

	for (var tsid in this.container.items){
		var item = this.container.items[tsid];
		if (item.class_tsid == this.class_tsid){
			this.collectors[item.tsid] = item;
		}
	}
}

function findPiggies(){ // defined by meat_collector
	this.piggies = {};

	for (var tsid in this.container.items){
		var item = this.container.items[tsid];
		if (item.class_tsid == 'npc_piggy'){
			this.piggies[item.tsid] = item;
		}
	}
}

function getContentCount(){ // defined by meat_collector
	return this.meats_inside;
}

function getMeatCount(){ // defined by meat_collector
	return this.meats_inside;
}

function isFull(){ // defined by meat_collector
	return this.meats_inside >= this.capacity ? true : false;
}

function isLeftMost(){ // defined by meat_collector
	if (this.isFull()) return false;

	if (!this.collectors) this.findCollectors();

	if (num_keys(this.collectors) == 1) return true;

	for (var i in this.collectors){
		var c = this.collectors[i];
		if (c.x <= this.x && c.tsid != this.tsid && !c.isFull()) return false;
	}

	return true;
}

function onChangeInterval(){ // defined by meat_collector
	this.apiClearInterval('onInterval');

	var owner = this.container.pols_get_owner();

	if (owner && owner.imagination_has_upgrade("remoteherdkeeping_production_2")) {
		//log.info("IMG setting interval to 20");
		this.apiSetInterval("onInterval", 20);
	}
	else if (owner && owner.imagination_has_upgrade("remoteherdkeeping_production_1")) {
		//log.info("IMG setting interval to 22");
		this.apiSetInterval("onInterval", 22);
	}
	else {
		//log.info("IMG setting interval to 24");
		this.apiSetInterval("onInterval", 24);
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by meat_collector
	if (!newContainer.pols_is_pol || !newContainer.pols_is_pol()) return;

	this.findPiggies();
	this.findCollectors();

	//if (this.isFull()) return;

	//if (!this.isLeftMost()) return;

	//var collector_count = num_keys(this.collectors);
	//if (collector_count >= 23) return;

	var owner = this.container.pols_get_owner();

	if (owner.imagination_has_upgrade("remoteherdkeeping_production_2")) {
		this.apiSetInterval("onInterval", 20);
	}
	else if (owner.imagination_has_upgrade("remoteherdkeeping_production_1")) {
		this.apiSetInterval("onInterval", 22);
	}
	else {
		this.apiSetInterval("onInterval", 24);
	}
}

function onContainerItemAdded(item, oldContainer){ // defined by meat_collector
	if (item.class_tsid == this.class_tsid){
		if (!this.container.pols_is_pol || !this.container.pols_is_pol()) return;

		if (!this.collectors) this.findCollectors();
		this.collectors[item.tsid] = item;
		
		// This doesn't seem to work correctly, possibly due to when various events get fired
		//if (item.isLeftMost() && !item.isFull()) this.apiClearInterval('onInterval');
	}
	else if (item.class_tsid == 'npc_piggy'){
		if (!this.piggies) this.findPiggies();
		this.piggies[item.tsid] = item;
	}
}

function onContainerItemRemoved(item, newContainer){ // defined by meat_collector
	if (item.class_tsid == 'meat_collector'){
		if (!this.container.pols_is_pol || !this.container.pols_is_pol()) return;

		if (!this.collectors) this.findCollectors();
		delete this.collectors[item.tsid];

		//if (this.isLeftMost() && !this.isFull()) this.apiSetInterval("onInterval", 24);
	}
	else if (item.class_tsid == 'npc_piggy'){
		if (!this.piggies) this.findPiggies();
		delete this.piggies[item.tsid];
	}
}

function onCreate(){ // defined by meat_collector
	this.meats_inside = 0;
	//this.apiSetInterval("onInterval", 24);

	this.updateLabel();
}

function onInterval(){ // defined by meat_collector
	/*
	//
	// Have to be in a POL
	//

	if (!this.container.pols_is_pol()){
		//log.info(this+' is not in a pol');
		this.apiClearInterval('onInterval');
		return;
	}


	//
	// Are we full?
	//

	if (this.isFull()){
		this.apiClearInterval('onInterval');
		return;
	}
	*/

	//
	// Are we enabled/leftmost?
	//

	if (!this.isLeftMost()){
		//log.info(this+' is not leftmost');
		//this.apiClearInterval('onInterval');
		return;
	}

	//
	// Too many collectors?
	//

	if (!this.collectors) this.findCollectors();
	var collector_count = num_keys(this.collectors);
	if (collector_count >= 23 || (collector_count > 3 && is_chance((collector_count-3)*0.05))){
		//log.info(this+' collection fail');
		return;
	}


	//
	// Scan for piggies
	//

	if (!this.piggies) this.findPiggies();

	for (var tsid in this.piggies){
		var item = this.piggies[tsid];
		if (!item){
			delete this.piggies[tsid];
			continue;
		}

		if (item.instanceProps.hunger == 0 && !item.isSad()){
			//log.info(this+' took meat from '+item);
			this.meats_inside++;

			this.updateLabel();
			this.broadcastStatus();

			if (this.isFull()){
	/*
				// Cancel our timer, look for another one to activate
				this.apiClearInterval('onInterval');

				for (var i in this.collectors){
					var c = this.collectors[i];
					if (c.x <= this.x && c.tsid != this.tsid && !c.isFull() && c.isLeftMost()){
						c.apiSetInterval("onInterval", 24);
						break;
					}
				}
	*/

				var location = this.getLocation();
				var owner = location.pols_get_owner();
				if (location.pols_get_owner_type() == 1 && owner){
					owner.quests_set_flag('meat_collector_full');

					owner.prompts_add({
						txt		: 'Your Meat Collector is full! Come back to your house to collect from it.',
						icon_buttons	: false,
						timeout		: 10,
						choices		: [
							{ value : 'ok', label : 'OK' },
						]
					});
				}
			
				return;
			}
		}
	}
}

function onLoad(){ // defined by meat_collector
	this.onPrototypeChanged();
}

function onPickup(pc, msg){ // defined by meat_collector
	this.apiClearInterval('onInterval');
}

function onPrototypeChanged(){ // defined by meat_collector
	if (this.timers_fixed_again) return;
	delete this.collector_count;
	delete this.timers_fixed_again

	this.apiClearInterval('onInterval');

	if (this.container && this.container.pols_is_pol && this.container.pols_is_pol()){

		this.findCollectors();
		this.findPiggies();

		//if (!this.isFull() && this.isLeftMost()){
			this.apiSetInterval("onInterval", 24);
			this.onInterval();
		//}
	}

	this.timers_fixed_again = 1;
}

function takeMeat(count){ // defined by meat_collector
	if (this.meats_inside >= count){
		this.meats_inside -= count;
		return 0;
	}else{
		var diff = count - this.meats_inside;
		this.meats_inside = 0;
		return diff;
	}
}

function updateLabel(){ // defined by meat_collector
	if (this.meats_inside > this.capacity) this.meats_inside = this.capacity;
	this.label = this.name_single + ' (' + this.meats_inside + '/' + this.capacity + ')';
}

// global block from meat_collector
this.capacity = 60;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("remoteherdkeeping_1"))) out.push([1, "You need the skill <a href=\"\/skills\/22\/\" glitch=\"skill|remoteherdkeeping_1\">Remote Herdkeeping<\/a> to use this."]);
	out.push([2, "This tool only works in your yard or on your home street."]);
	out.push([2, "Too many Meat Collectors in a yard may confuse the Piggies and result in the Meat Collectors filling up more slowly."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from an <a href=\"\/items\/1000002\/\" glitch=\"item|npc_streetspirit_animal_goods\">Animal Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("remoteherdkeeping_1") && pc.skills_has("tinkering_5"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/22\/\" glitch=\"skill|remoteherdkeeping_1\">Remote Herdkeeping<\/a> and <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a>."]);
	return out;
}

var tags = [
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-54,"w":70,"h":54},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGNklEQVR42u2Y+09TZxjH+Q\/8E\/wT\n+BMaFdGNaL1sWTJNMDFbwg+mROOySBTnphnRiLgtUxeoQTOXbVLwAniBw00upbS00DvtoRd6bw+3\n2hYYz77PiTUFAYvVbVl4k2\/angvv532+z\/O851BUtDW2xtb45wcRbYPUmUxGiMVisnw+XzV+V+O4\nElJA2\/8tuO0LCwsGs9lMHR0dr\/X8+XNZ3d3dZDAYaHx8nABNgJd4AcvLywLurX6lD7MA\/sNzc3OS\nIAjU1NREzc3N1N7eTm1tbdTa2kqPHj2ihw8f0oMHD6ilpUU+z598zbNnz2R4vV5PNpuNeCSTSeF9\nwpXH43Hq6uqi+\/fvy+LJOWo8+dOnT1fAPn78eE1glsfjoXQ6zVE2vC84dSAQkEGycCyemIE5op2d\nnbLVWdgnT568Aczfo9EozczMkH54mCxareJ9FINhYmJCniQXjsUgfX191NvbSz09PbKFubC50e3v\n76eXL19SJBKhkcFBsmu15NLpthWUb4uLi9LY2Ji8+tVwnIMDAwM0iMn4kwFevHixAjYbXYvFQigs\nEkWR9LjeieixCoFTcRJzNXLurIbTaDQy1MjICOl0OhrGZFpEZGhoaAUsR9fv9xMWSuzCGM5n4Rxa\n7bvln8vl2sar5cG5wqtncfUxCE\/O4BxZo9FIo6Oj8m8+nwVmWP7k+xnOhOvGc+BYEzpd+TtH0OFw\nqLxerxgKhYgrlyfi\/GFlx9LSEs3Pz8vnwuEw8bWsYDAo\/+bB5w0AtwI4Fw7REzdKeoVosSgcRqNK\ntFqr7SZTrWloSGBNjI9LI8ihSbNZdFmtBiOiwAntsFrJ43aTDc3XMzlJBq5AfGf7uLp5ESz0yNcL\nYVDdq2LIhYMkt15fnAtVC0le5IAbE7EYgtWNPtWBvpSrLhxzwrb1JGIH8TudFEIv8+LTjaYbBKgR\n9nL+sbXdKI5OVL0ZebgqcoYVcDywxdAS8mAhk6EMK5WiNFaY4pXCAtZ0LEZBr1eGdyHfQvjOELli\noDiiklUU29g0rJRgaxjVGcA1CUSTv7c1N6v\/aGhQtty5U20QhGrAsZRr2sq5kkHXTgMslUzKQMnZ\nWZpH7sxNT9NsIkEzsEdCA02gR8UxaYwBMFl0aoqwkcrg05g44XJRDCARu52CODaFaPpQLB4UgYhC\ncSGKcrQ204C5IjeCm14HLgLbwogSKyVJJCEHY0iTiMNBIdgaQKT9yEOvyUSTsB7WkRP2cs5taodg\nW9eCm8kDLghbAyiKWa5mwEUBF+acA9wUP63kwKFtcI6RDYVh6e\/PHzD9Ktc2hAPAenBTsFaC1flY\na0evs6JQNgW4WbjQKjg\/8k7C8XysNaEzDGP\/NW0GsFA4H6yNcy4CzgOgXjzBrGdtLx6t2u\/eJVNP\nT\/6AhcJ5EbkgtxlYq8dTyg\/nz69r7TCeXHgBm6riQuE8yDt\/jrV2NN\/c6LG1VkTPjD3aBlARx7Hn\nqUiSFJRIvP2xfjqRkAqBmwScjwuDtzZYG8RnCLBxnJ9B60miqWfwt7DXyVrGPH9hnkXMwcpgjozP\np1kXcFaSlKLTKb0rHMuP3xEcn8M9KdyfhpbQljKo7hT+xjzun+FiwnUJ3BfHPTEsKoqFRHhnMpuV\nG0bx9s2btVcuXaIvjx\/nzV+NNqLB1iblA7eWuMX4kYc+WO1FLnpg6yTyUYTcsP1GTQ01XL1KjsFB\nMa98vFpTU3v54kX6qLSUvquqep0XYb+\/OCCKKoBp8DAh5QPnRg+0IA\/H8TBad+EC\/XL5Mhnx9DyK\nB4QBvIP8BLizlZXqhro6Zd6F8tXJk5qme\/fos8OHaffu3euuyG+3F3tsNhVA1DZE5w042DWMSu7H\ny8+f9fXilbNnBfW1a7X9ra2KX+vrDd+eO0elu3bR54cObe6d90RFhUJVUSEcO3pUKCkpyetF5fat\nWwZe1PeI0s91dZJrbKy6r7W1HK2meK3rz585Q6crK2WXdu7c+eH\/q4C8FW5cv04f79lDZXv3vvUF\n++SJE5qvT50iZVkZle7YUfzBAb+pqpJ+RKKXHzlCe0pKNG+7\/lM483tjoyJfhwoeVadP02+NjfTF\nsWMMKBT918bB\/fvLD+7bJ3xy4IAAQGXR1tga\/9PxN138CIsdG+T\/AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/meat_collector-1334271548.swf",
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
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "collect"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "collect",
	"g"	: "give"
};

log.info("meat_collector.js LOADED");

// generated ok 2012-09-14 19:46:10 by martlume
