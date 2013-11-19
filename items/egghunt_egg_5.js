//#include include/food.js, include/takeable.js

var label = "Golden Egg";
var version = "1342483399";
var name_single = "Golden Egg";
var name_plural = "Golden Eggs";
var article = "a";
var description = "An 'oh-so-delicious' and delightfully decorated chocolate egg. Inarguably tasty, this treat is not affiliated with any known holiday or group, religious or otherwise.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 150;
var input_for = [];
var parent_classes = ["egghunt_egg_5", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.33"	// defined by food (overridden by egghunt_egg_5)
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

verbs.eat = { // defined by egghunt_egg_5
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Gives $energy energy. Grants 'Chocolate High' and 'Sugar Crash'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		if (pc.knowsAboutEnergy()){
			return {
				energy: Math.round(this.base_cost * floatval(this.classProps.energy_factor)),
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_eat(pc, msg)){
			pc.buffs_apply("chocolate_high");
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

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collect 5 different chocolate eggs to get the Egg Hunter Trophy!"]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Chocolate High buff (chocolate pops your mood, energy and imagination)."]);

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/egg-hunter-trophy\/\" glitch=\"external|\/achievements\/trophies\/egg-hunter-trophy\/\">Egg Hunter Trophy<\/a>"]);
	return out;
}

var tags = [
	"egghunt",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-27,"w":31,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMiUlEQVR42u2Y91fT5x7H\/Qfutdr2\nanttsWBRRAgbgkAIhL3DUARlOaoWrVhbtUqsrXUTQbZAwlIChLDCliFbljhAqIJbqq2oVTtOz3nf\nz\/fBUU69Xd7hD805n5OcfL\/5Pq\/n\/ZlPpkz56\/USvuqD3XkNy9wljeHeqpblPg1tK3zXvzRwLcvF\n0vZV\/ji5ehF61gaim6x1hS\/qwzwELwVg53uLGk5E+KBmqRvKFjmgUGyLHHdLpDuaSF4KQIWPTUiW\nGx+pIiPECfSwnz8Xn5toYrverP+Ngnke1l7ZLhYN6SLjhmRb3lNLsdWXpAr1BBWJfIHUS7tvi+4b\n+HDeP7BB+3Wse\/c1FMTrS7Mi9QR0r+rJb5JseX3JQh64d+73KSLNqS8M2BDq2Vcd7Ipycl8RuS\/P\n0wqKEEuod1ojN8wUR5wNkLnYGFv1Z2Gl5jREzH4FK+ZNQ3mSBWLd5yPvoAGUabw+RaJuyNFIQ0Eu\nqc09I9\/LGoXeAtULweX7i6bWhXiwwOeSgBICxQEiJPkZQB5igtwICxSsWojCICtkOZthj7k2M6lQ\nB5\/ZaiFy7kxsXDAL0cZa2GepgwQ7A1QEOqGentkU7s2e90KAG3Ve0dhhqIFD1rqQu5gzuM8t5mKH\n6Ry24GFbHmROZsh2tfi3FmOlOwmQPAJu0xVLnKHyt\/\/zgBe7RVPPd4mlMWHzsUpzOourjRRjH\/Pe\nfgqYSQDVQS6\/aUccTXFg4XyWRF+YakFi8DY2z5\/JPW\/0T8ENtPkIhnsCRi8PBOFCxxIod1kj2mE2\nVrwzDZHzZiBSZyY26P4TVcFu6H1\/yW9a1SYRdnpoYIvdm9gkeANR1jOw2eUNpOzQRubeeSF\/CG6w\nUyw5U+qHjs2+LO7aVvox16Y5mmCP2RyWqWvnvIpwSoYogkyw1f9Nq\/nYEQ0lAtQoLFGWZYaiNEMo\nEvWRG7sAmQfnIytG7\/eVpHMdYtlgmz\/qP3FBV5wPeqX+LJC71yxmQa30FSKJ4mg3gdbFhuCba3EY\n7tyMdXoz8B5l8Bqt6ZMsipRW0G8ublmFrj1i1BVaQ51tgeIMExQk8XDssB6yY3QJUm88P8X410vO\nmTaxaqhnES6fDcaNC6EY6QpCxQZHVD7OOuqvqKFy03FwNe6PFeK7B2X4\/tsi5EvEBDcdIW9PReCs\nvzFbYzIDl6qX4Ur0WlzathrnN4Wjj1zdeNABlUf5KJGZojDFCHnx+siJ4SBJzTgj2XPBumtFU081\ni1WDnf4YOR2Ea0MhUMcI8am5BjLIrQqqV5lUQo6FOuB6fyZ+eNiGHx51kbXjSmcapFbzsXXBm1hP\nScTF6NK3\/o7MaAtcHVqKYeUSnIsKxal1Qeikfk0DBSqTrFAqN4Uy1ZgAecg5NAF4LM6Y6qWlxi8A\nexq9+862+mK4ZzG5KxCxwTqI0n4NOyjTEinr9pI7q3cvxaP7NQTXhR+\/HyYbxXfjvej6YCnKFzuy\nErTPQhsf6VACvfsqPWcxbXQZLpyiAeILP7ST+k1UXqrJG6UrrQnQnACNoIg3QI5Uj4yHvMMmKEzm\nT56Cumq9paeaxBjoCMBA6yLsc9FGJMXOelpkC6myy1ILg8e34sG4Et\/dbyTAM\/jph5v46cc7GClL\nQzMNCV2USNz0wtW0Iw7GkIeZ4NalCKbghb5FON3ojbpgF1RSJyr2EaDAYyFUUvMJBQ+TglJy8yED\nKBLMoEyxetZZ2is8Q7rrfXC6xQ+nG\/wgFeliq+4sfECuitSahn1uczHc+iEe3E4hwEI8uncc3z\/o\nIdcOkQ2jcWsE1KTeufSPMJAUybpNY5gX+nP9MTYSjiuDwRjq9afne6FuhwhFFCoc3DGqnXmrTJmC\neYcNGODRWCPkU2ssSrFuYHCtaleN9kqv8Z7jYvTW+iLD3wy7jeciWl8Dm+bNxH6xNsaG1+Pe2C7c\n\/zoeD7\/JxsO7pQzy0f1mUrMJ6ihKqPZYPLiTidtDu1mH4ErS2Nlw3PgyBCNnAjF40g+nmj3QWugA\nBfXgXAqFLCdTyL2MUJBsRHFn8My9KZYoyRDiMaCnrLPaBz31vigIFyLByhgHzHTxmaEWYtx1cO1c\nGMavf4B7N6Nx76v9uH87iSCz8HA8n9QsYoreuZqBB9+k4dvbh+ieT9FxwB91Ea74iqm3FF\/2LsLZ\ndm\/0NLihrdIReUvMIaekS6exLIUmmrxYQ1KOR2bI3FuUao0yGbW+VrVYo03tjc4qH6gljsiws0SK\nwAyH+PpIFhthpHcZLbIC49fW4O6NDwlSQgB7cf\/WIVIzkYCSJuxWLH23l1SOpvs2UoaHoWajE66e\nX4aL\/aRepy\/6T3igs9YZzeUiKDdbIJVqaDIV7nibBcjaTqXlEI9lb0EyH8VpApTJCfBEqVjaWi5G\n\/RF3BvfEOBV7y\/1wbTAcNy8sx63RlQxy\/HoUAWwhEAnuju0k+4xsB+7e3I7xGx\/R9Uh8fXUVxi5G\noEPuQaUqEOdPcrHnja7jbmitoC5SbIeSGD4Di6OyJLWcB\/m2x7GXYP5UvXK5\/eiUE8Xefc1KHyoN\nCycB1u13xZfdSzF6OpRB3hgmSFLy68vv4c71NQyEc\/uEvU+2moHdGl1OGwrD1YFlGOlfgqEuf\/QT\nXHe9O9qrnNBUao+6AgFKKAliCOwAlaN9VLrStyyg2DOdiL10W5RnijhrmNKo8kTJVsdJcPlhQpxp\nXUxuCWKQI\/0huEJxeP18BFNz7OJy5nZO1VujKxj42EUuGcJwjVx66UwwhinmBjonlGNw1c44UeKA\n44VCVB0jhTL5rJd\/QceBz43fIUB9FCRyrrVh6qmzHKDOtJNMqct3hdx5snodRT441RTAIAfaAzHc\nHYSLfcGk5jJqfaG4OsiBhJNxn0NxZSAUl8+RYqeDKRnIpV0BONvmS8\/wQvdxD7RXToYrz7KEKs0c\nO41mswYQzXsLGdsMnrpWLSf1suxRli3kTSmLs58EV7TOHl21fuip80dfYwD6mwNwro3U7Agkdy1h\nsBd6HxtBc+8c1FA33XOSwNr96DdcRfDAyRrK2Apya4mIBgMOzobBFadbUBE2wzY6FnBtcTOdX+Tb\njVEqs6O4E5F6IkoQ4cRsqNxlNfpzwAa5Fzoq\/ejhfuiu80NvPQdKcXSCFG0hgFYCbif3kZ1r5+D9\nSWlyZbMYfU0cmCdtkFSrcqFsdUKjiuDybVGVS3CZCwmOTy3MDOlb9Vgr5Ma1jXNfR6bElMUdB6eW\nUxJl2EzMhYUHzNc\/gcvyskJLmRhtapr\/1L7oqBbjZLUvLehLrhLT4n7ooy7T1yh+bL60AQ6KMrTO\nE501NOVUuqGl3BlNxeTSAnua+YSoyCW3ZlpRfE3AKRJMEL9Wh7rUq1g3ZzrrVPmHrCfgMu1Rmi7o\ne3YQStGcKvewHOcA81bZoKHQHZTZaC33JVAO1odiyAcdFWSV3gRNVkUqV3kya69wJze6o0XtghOl\npFixI8WaCLUKO1QdtaVFaRiQUb\/l4FLMqYyYsTa2O0ALazVfYYBcO30CV5YhgDLZjDdpSJC5W0g4\nQMUGa1Tn0s4pcRqLPBloSxlZCVmpF332pHcPMnc0l7iRuZJSLmgocka90pHKhwg1efYMrCJbQPFE\ncBlWUKXyaVE+A1MmE2yqDT4xncXa6Mc6b2KP87t0rx3da0P91+L5I3+6naUsO9yCdmCDymxyzTFn\nAnUjRelISLBNVI6aijwI3J2AXMlcUF9I9xQ4oTbPge4XUZwJUZlDNUxOXUBmQy5dSJlpyToDTSas\nhJRSf83dycd2PQ1I9GfjUwNNyNZTgqTbcInz63+PyFwtJAUHzFCSZsUWqcxxQPVRRwJwRZ3CjQEf\nL3ADV5pqFc4E5cSuV+WKUJFDGZgppNmOijCBqI5Ys7LBQXFNnysfrIRQIsT789gwsteECvVCXSjj\n+VQDTaS\/6xyStUVPoDhsOKpKsWC7UsspyKkmVWRzChFMDgfkNPFOVpntSNdFEy6SCZlCXLl4AsT1\nU1Y6HmdocbwQUurzXK+Ps6QD\/2oTblD9Yye5lD2aU+mEtb4w3mhcRS7iQMtpcQ6CC2SuiE4Etehx\nxRex4vrUfv59luhpApTTZnNW89kwkiowR7qD+Xh2lCHvhf5NyI3V8ypMMFYpk82Z67lALpMJmLJP\ngJ9rcruJ63Ihu5\/FmPRZvU2346vShWa8\/9i\/Wvmk6tE4PYEywUhCtUxVlMJvKD5iOV6Sbs0W\/7lx\n33GboevgQkWZaDpekGAkk\/uZ9cnsLCVpds85DP23Xsp4Q438REPBLyzOUMBt6K8\/xP\/fr38BGDFJ\ncKiK+P8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-04\/egghunt_egg_5-1302028853.swf",
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
	"egghunt",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("egghunt_egg_5.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
