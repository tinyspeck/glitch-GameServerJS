//#include include/food.js, include/takeable.js

var label = "Obvious Panini";
var version = "1354589020";
var name_single = "Obvious Panini";
var name_plural = "Obvious Paninis";
var article = "an";
var description = "A panini, obviously.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 132;
var input_for = [];
var parent_classes = ["obvious_panini", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !(pc.skills_has("grilling_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/41\/\" glitch=\"skill|grilling_2\">Grilling II<\/a>."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-27,"w":32,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKVElEQVR42u1YC1jOZx\/+zz4qRS9p\nvkROGbKJ+LC+EaPYaA4jIytKBznkOHNaDhuFjhJFKlQ6O\/S2TisKFeVF55S3k95OitnYHHZ\/z+\/J\nW5lsDt++a9f17bmu3\/X+36v\/8zz387vv3\/173gTh7\/H\/PDK2C7qXtgkGGVsFh\/Stgh+L5BcFvUNB\n7\/\/5wLYJ5mxTaea3Cig8pI0i\/+EoCTNCZcwc1J2zbDPo7xRX9w9Gxu4eOOsgSo5eIbiG2wn2u6cJ\neqs+EJTeGFj8OsGeLSgNsVPC6Y1aiN4xElFfD3vtiNj0PkLWaSNopRYCbLrCe4HCdeeZwrpdU4V+\nrwQs01FQZfRILu7ojArxZzwj+WGzUBZjyp9\/ylwGFKx7Lh7lrMYvV+3x8PpKPMpehcfs+5PcNfg1\nb+0z79F8WudOmi1+TDNHScAQXHPpImF7uqZvE6bT\/r9PKQOX7abOJ7cF5EXReN4a1QnmqDtricYL\nNrh3yQ4PJCs4WPr7D+lL8PPVFfg1f23zgW6nWKGevX\/noi0azs6D7NQE5Hn1AmFoEzDpjbT2c5b1\n74IpPmmCVM8JqEp49hAPrqxgmzFwGXa4n7WMg5MDks8hNuTvU5bpveqkRag926JhWeICFAUZcP0m\nb+qA7zYoSyK29NWl7DlQ9n5Lh\/xTTjdFlt\/HfMPXjZfVdIrHeITv1MeRDcMNhNSNgoP4S9ErLRK5\nRRehXw1B6Poh\/DNsw3uI2Kz7zDtxTmNeCJQOKj9067ge+CkyfCZBevpznHQa2wLwtP3byA6c2uYk\novS3llJ6Zh5yg2fwz4ZUa04vFQYVlZxSXjiMTtLh7XOLcTdtCdennP7W8SRvDddzVZwZLvlORMnJ\nOS0AK4IHkcHivFN\/nj3agLQjp5k2qU2yQM33i9gmtnicu\/qli+hnVuE0hw5Az3JwBJ72oINQYcni\nzVEYPgvFUXM4SIos3xlRvEjuJY63z\/VQoypCZbg+X0CuO7IF+YIk7rZO\/7JBa7XWdF7oTF79BCb9\n0ATE7R2BKwFGKI82RWmgKWpOGkoeXNDoLfwY+6FuQ\/QY5Lp15SCpczy6vvwPNyTQ8g1JBm0VEumw\nLQ3HOo7BjYjZHFwFk0VB2EzcPDUXMrE5iv0+R3noeDzOGoIH6X0aeRYbxWMbG8VjUOrXl4PMdOyM\na0eNnhN3ksuHLV1i81BeJMFrB+HEOh2ErNdBKCsWKiB5gaT7GHLQcsnUJFvwZzmNraNGbIXS4+a4\nFTkOTyQDcTdFA1UxnSDcT3W0r4+cj4Yzo3D71EjIQnQgcVREtL2AyDXqSHb94DmgZ90NIGZ6jWOZ\nyPA2RNrBSUjcq4909pwX2iINuVwoq1RApGUCQ1VKmisXm6Iq1gzVEYtQGToNd5OHofFsd1ScUULt\nuWG4FaOeLJT4zWuUhVigPsoY9Sf1UBepi9rw91Hi0wOXtrcDmTi5vXwzygDR+\/D6Kl6VJPL7V5Yz\nozVni1q22RqpkltnK+PwRMQ7j0TOcWO212I0fGcEXBuMukQ1pHiqwGdlFyR5qiZXRiuaC9WxqqiP\n\/Reqwo0hC52A2oihqAkdguqQwag83h\/5Hl05UDLzhsQZfEPS3G87RFu9t+GCNbcPyljsnuHNAMlG\nioPnoCbMkrG2DA\/TxuCHVE2c2qUIq0kdYTmRXVbcpiBkh76D8EO2BQjko6wB+Cl1BGQnpjFwOpAF\nD0RV4ABUHuuHsiNayHcXQbKrAwdaGDwJ5zzGcWNtXRiti+LU1uG4dmwqtw4qhHLx\/CaAjNLa09a4\nE7OWR8MZVmzi0Ti4WgHbrAdB7DsXWaHzkOI9Bb5f6RFASylxTkEpvpfEfC+M+VHQYNxiGaw42gfl\n\/loMZE+UHtJA0f6uuPytImJWt0P8ZnVc9Rn1jImT\/h4wym9EfsazJnbUbaE3xhwVwWaQhdmgIX4L\nj+oIO+yzGYwYv\/mouboNVfELecaTvAybAAZv7OewxVQJxzaqoDhcCfdTdqIu3IqBXAhZ0DhU+Pdv\nAne4B6Q+3XHzoDpKvNRww1OEfFdlXHfqgMvb3+KZLQ0ageq4JvvICTbG+QNjmd4+4t\/LIkwhDZ7I\nC6E8ijESqAkv235wNOuDL000IEtZxrNNnSTNxwBxbuNxeP0we0EWpG3gt2E4rCYrYrupCNXx63jq\nq4IXIt9nNm76zULl0VGQHvonbnozcAfUULy\/C4r2dUahuwoKXJWQv1cBObvfxnmP93AtZNZTnZkg\n94QxpMzfak5aMPM1xi+X+3M5SfyVsfXzbtg4Sx3Whsrw3zCEA6PMUdyKNWssjDQx5x5Ydbxv77LA\nodhjq40VUzshwoEVyunVKDgyHpXRyqiP12HfJ6Ps6GxUBnyIYq93cGOf6lNwHZHvrIi8Pe2R49QO\n6R6DcIX16NaU1kYs5jTWxQ7l6yW4dOLAvpyuxgtivUl3nmnqIjSnNHq+tCZ2ge4zF9bKY\/2lSbs0\nOcBtc3sgcI0eEpwGcl3SomSaZJ73zunhdowhpEf0UeDRC\/kuDNzeDshl2ctxfAsZ7tpIC5jGN6qN\nteVMkFxu+s9HxWlVBLBbE4Gzm9wJZuMVsNWsJzKPGqPyuwUsa1+weV9ENSTMef52fetYP4dsdqtd\nPk0Jq42bFqEgPyJdElBy9R8v9GoGWug3Gdf2GSLbRRvZju2bAWYGGaHoKOsW4UsYtStw6wQrnqil\nkAZaIO6bjzilBM5psSayg6a1ZDvWzP53r\/3lAX0kl116wO4TBdgwPS7\/RKUJ7GwRgjZ1Rm5Qx2eA\nkrG2jrvxPVEdrY2HWTq8j95L1Ud55GhcdB+KTI\/pqDtlzz3Pw1YHh9a8i5T9\/2Z6m0t6e57StkbV\ncY3eZf5ajRd2a2Dr3E6wN1ZiwYAad4bNFCVOv7e9iPVXFQ6UxM6BFkx5Lh7lz0Zdqh7X29cmaljL\n9JZzYCbzWSeURpkhL2Q6iiJmEa3JbVL6olHpq6lb6qspzfbQQJZLd6TuVEecQ3ccWN4H6+dqYvmn\nIlgZKSDBTRFy76ximaO+KY\/qRC1+iF1marA1UoH5BAVO6TdmvVFwYnYzpbI4M4fX+m3c4N1FtfSw\nRjLZCvc973dQcrAb+zHzDsQOvRC6\/QP4bhyJ+rSPcTt9Ei4eUsG3FopwtxXB064rB0b6JXAEzNGq\nH6KdRjZfRslCZPFfvNl\/Hwik1FvdlcBxYybv8+rK\/Y8btJcmpKFaHGCCZ384LtXDUmNVrl2byR15\n1iwnKeHw2gG4euxj7m1PK\/XVKP2jcfOgSLfYSy2KOoccHHlgkUcnFO5TRolfR6Ts7IJze95FPLsr\nfmM5AMsYUMpavKs+ktxHc4BvROnLDKmXyKDIU5TcBK6pgxS6KXOjLnBhncRZgfvhpX3vNvtglr8R\nM9\/J7KZs8uaUvuwo9FDWLXRTcS1wU25sAddk1tRNJC7dkOLblDG6vZRFz\/vvUvqyo8RbUC10UTTP\nc1GQUB8mcLm7\/wGJczd8723051P6Sll1bq\/LWp1fzu52jVec1ZDobSj5n1H6quOKi+ivCezv8Vce\n\/wEnr85vF9mA7QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/obvious_panini-1334341072.swf",
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
	"foodbonus"
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

log.info("obvious_panini.js LOADED");

// generated ok 2012-12-03 18:43:40 by martlume
