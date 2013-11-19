//#include include/food.js, include/takeable.js

var label = "Grain";
var version = "1345745320";
var name_single = "Grain";
var name_plural = "Grains";
var article = "a";
var description = "Some plain grain.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 1;
var input_for = [138,305];
var parent_classes = ["grain", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
};

var instancePropsDef = {};

var verbs = {};

verbs.bundle = { // defined by grain
	"name"				: "bundle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Bundle this grain into a nifty Bushel",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.countItemClass('grain') < 250) {
			return {state: null};
		} else if (pc.metabolics_get_energy() <= 20) {
			return {state: 'disabled', reason: "You're far too tired to bundle grain."};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if(pc.metabolics_get_energy() <= 20) {
			pc.sendActivity("You're too tired to bundle grain!");
			return false;
		}

		pc.metabolics_lose_energy(20);

		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: 20
		});

		// How many in this stack? If we're not full, pull the remaining amount from other stacks
		if(this.count != 250) {
			var grain_amt = this.count;
			do {
				var add_grain = pc.removeItemStackClass(function(it, args){return it.class_tsid == 'grain' && it.tsid != args.tsid;}, 250 - grain_amt, {tsid: this.tsid});
				log.info("Bundling extra grain "+add_grain);
				if(!add_grain) {
					log.info("ERROR: "+pc+" attempted to bundle grain using stack "+this+", but found only "+grain_amt+" grain.");
					return false;
				} 
				grain_amt += add_grain.count;
				add_grain.apiDelete();
			} while (grain_amt < 250);
		}

		var remaining = pc.createItemFromSource('grain_bushel', 1, this);
		if(!remaining) {
			self_effects.push({
				"type"	: "item_give",
				"which"	: "Bushel of Grain",
				"value"	: 1
			});
			this.apiDelete();
		}

		var pre_msg = this.buildVerbMessage(250, 'bundle', 'bundled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be found by squeezing <a href=\"\/items\/278\/\" glitch=\"item|npc_chicken\">Chickens<\/a>."]);
	out.push([2, "Grain, when sufficiently stacked, can be bundled into a <a href=\"\/items\/308\/\" glitch=\"item|grain_bushel\">Bushel of Grain<\/a>."]);
	out.push([2, "Using a <a href=\"\/items\/979\/\" glitch=\"item|still\">Still<\/a> and the <a href=\"\/skills\/123\/\" glitch=\"skill|distilling_1\">Distilling<\/a> skill, this can be turned into <a href=\"\/items\/180\/\" glitch=\"item|hooch\">Hooch<\/a>."]);
	return out;
}

var tags = [
	"food",
	"basic_resource",
	"animalproduct",
	"nobag_food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-16,"w":45,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGs0lEQVR42u1YW1MTSRj1H\/gT+An+\nBNASFVyNIrgIaFSuJkiAKAgqI1v7sG952VL3Uma9roA4AhtBBIZLggjIkAshgSQtohC5tQK6tU+9\nfdodKrjqri6OPOxUdWUuqenT53zf+b6eDRv+P1Yfv099G7duwMz6S+Jjr9nCdxtfjFfSdQFu2nMs\nfj5wUom99+rxOWV+9ARbFwCj7kIFgDRZcf6KSIzfJ182xiaqjVGPyTA7UsI4KAJZ+S99PVHN5vxW\nFnJly180AcDUWM9R+0KgjAHUi7EKgnMAHu06zGrPb47XHRhYEgAnq+PBWl9TKpnxFQuAXiWbdd7a\nw5xyCqu5kCAkXwjnbdQV4FK4UtIAApTzThqbHCzg7J1i4Ycm0n07TXE1fi3Pj56SZkeKJV3BPfcW\nbno5Xkk0JgFwcqiY1f+4hXXU7GZ0rFIwiQSZGymlU35znK7STg+b7Iuh00ypTZFrf9iKhLADUMOl\nRPZMPc4Qf7CWaXchxWJ0AwcmlkiVZXrYzABw2nuCJ0CCWndxswHj9k9bWe2FBDEQezcvbt6kxapO\nVaLUBrbGXUdFrIG1rvpUtfFSIh1ozhLXL0Nn2JTHSpHZL0OnlYWIVR95kYWzvmJMTB+1HIB8gkUO\n1N7v2E9hKbjG4PGpb+zRYLkNZey51yJY8nXmCAvpa0pjAMdlpoPN6cLzMBCjutkKWECxdzWkGrTY\nA8i6CwlSb8M+OjFYJGSNPCxkno6jdNpjtb9+fM5Gg2VGfRoAt0kCqNGePDvYgRnjmv+qYBHZCjsB\naAw8Q6zqAm5upMgwNWxWMOnc6CnWaN8mZMVw388kyNbh1gwGZjH4f2nUbbLolhRcWjsv9AoKPtgZ\nbjustN74Ska8PXOXEmRr0FWA+8zXlYNrmQZL9fE9MAFQ3fV7VbCzFD7DliOS8mQgn4BBZKomKyTG\n9XNfkU0\/Ux42yQAFhmIztOXaTgUlbbW0JvXtiqFZDL8v0cAJAxTBonnySMuR8k3\/0VbKjOjhtPap\noy6F3L2aTB807WfzgQpbvyOTyD8nqjwG7TXnE4yk\/1j84ni5AMFZNHI21RlvkSXqKaKcdfLb5W1G\nlD0seNpdYoQNIdnA+nzAavno2FsMn1V65H0WmPFypIotE4kGe7LZ5CPziqzawCQwaTpeKU8M5Ku4\nDjoLCDobJFfQma+239wlKg9i1t9ppFpMoxP6BFsxG8UkrgIJPR1khZyQFVLDrLF6jCm1kGmLcMqp\nqmbkg82ZTDvvbUznGZ+1YvDejoPi\/y\/GUYUqsEWwoyMHWIw\/nn7zYfk5IAkrRElrtG+33f91F2uv\n2SMaA9RbtFNIEtJvVmHU8EFMfu96MtPOm35JoljYYvgM7a5PkfEs0JPD7+9g3AUYr0wibMIPcgWz\nWnmc91vpKheAnNy7VmVe642keMiDeFkKnyU+5RCLeopXmTGezfrLmaftoHgxGgPOMMH1jLeUg9rD\n63M6621IFfKO9xYI9rrq9wrmwSDkRomESoN30wm2DO+s3djsvP2go3Y3DXQfEQBgxqgYAK1lrdgc\nccCOyzv45LnYGJFIXx6fJJvevZokY1KwBHMHY5AboKCCpy2LPH10TPSMaHqR1R9sKtAEIO5i7yEz\nm68mCwPGSt3th6UxZ47omiFfpC9fTOBTjLxJyFAdV3bYsQiwibqMbI96jq+Act3ZJ2ugIPurJ9Vv\nMv7fNLNvAJpW7RmWSZVt6F6GiKnYFgq\/nnajClbuXd+pInkA4qlaoiLOwBTkB3PD97MoQOEdCBUt\nCcT4p08h6HRrLyZY3gUQqwv15iE+RPwgISAdZMM5MnlutGzFwLXE4M0EHWw5IPOsVpFkb7adxRJC\nCHN8dPsFgNivihf8BRApPuuz0qZLiRZtz7sYqpT9XUfYSFc2i3pPyrz00RULaTpAh1oyKOQEUMQi\n3rcmpQws8liTAQ4xiL0Dl1BF7RVMkippYsDMLWaXwrsYAlBIjFCfWXncn2ef8VooEgEd9WfrnPnG\nhqDsQAI0mWDK35VrWQiWE7U1c4XJ+u+3xPmVQxa0Xvg4tEQq9PlSgDjDpAjcGZ+Vd8RHeGWwCNYA\nSiv6Ik4\/JY7WgEEFRRx+BJvg7k+Vmt020pdr4XsNlXuW0n17rwLAGOgF0SDoBlSpMwCcqJWOK0m0\n+Vqyil\/E5vs++GCj3nnLIH92kJgo6MwVBR+NQMyGm4DZ2KFZknY4Lm83rFm2vu\/wtWUaUbbgdZBN\ni7n3hgOvLtp5f2Pa38x9zY8hR0ocumN8svgY1rWOB0mzbr\/af+4vBn8CMlPIiE2gY\/gAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/grain-1334357537.swf",
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
	"food",
	"basic_resource",
	"animalproduct",
	"nobag_food"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"u"	: "bundle",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("grain.js LOADED");

// generated ok 2012-08-23 11:08:40 by martlume
