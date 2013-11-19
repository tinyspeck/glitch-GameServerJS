//#include include/food.js, include/takeable.js

var label = "Pumpkin Pie";
var version = "1348008137";
var name_single = "Pumpkin Pie";
var name_plural = "Pumpkin Pies";
var article = "a";
var description = "When people use the phrase 'as nice as pie', they are, in fact, talking about this pie. What goes into it? Fresh pumpkin, crispy pastry, spicy spices, and a big dollop of love. (That's an attitude rather than a hidden ingredient, before you start feeling nauseous).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 111;
var input_for = [];
var parent_classes = ["pumpkin_pie", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
};

var instancePropsDef = {};

var verbs = {};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.eat = { // defined by pumpkin_pie
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.getTooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		//log.info("Pie calling specialConditions");
		return this.specialConditions(pc, "eat", drop_stack);
	},
	"effects"			: function(pc){

		return this.parent_verb_food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		var num_pies_eaten = pc.achievements_get_daily_label_count('pies_eaten', 'pumpkin');
		var num_can_eat = 5 - num_pies_eaten;

		// Don't let the player eat more than the limit.
		if (msg.count > num_can_eat) {
			msg.count = num_can_eat;
			var item = this.apiSplit(num_can_eat);
		}
		else {
			var item = this;
		}

		if (item.parent_verb_food_eat(pc, msg)){

			pc.achievements_increment_daily('pies_eaten', 'pumpkin', msg.count);

			pc.buffs_apply('full_of_pie');	
		}
		else {
			failed = 1;
		}

		return failed ? false : true;
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

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
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

function getTooltip(pc){ // defined by pumpkin_pie
	return this.food_eat_tooltip(pc) + ". Grants 'Full of Pie'.";
}

function specialConditions(pc, verb_name, drop_stack){ // defined by pumpkin_pie
	var num_pies_eaten = pc.achievements_get_daily_label_count('pies_eaten', 'pumpkin');

	if (num_pies_eaten < 5) { 
		log.info("Pie calling food_eat_conditions");
		if (verb_name === "eat") {
			return this.food_eat_conditions(pc, drop_stack);
		}
		else if (verb_name === "eat_img") { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	}
	else {
		log.info("Pie can't eat pie verb name is "+verb_name);
		if (verb_name === "eat") { 
			var state = {state:'disabled', reason:"No more pie. You cannot possibly eat another slice."};
			log.info("Pie eat state is "+state);
			return state;
		}
		else {
			return {state:null};
		}
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "This item is seasonal. Some of its ingredients can only be grown during the appropriate holidays."]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Full of Pie buff (slow movement, but mood and energy bonus)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !(pc.skills_has("cheffery_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/69\/\" glitch=\"skill|cheffery_3\">Cheffery III<\/a>."]);
	return out;
}

var tags = [
	"zilloween",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-23,"w":48,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAINElEQVR42u2Y+1NTZxrH+Q\/6J\/Dj\nbnft4g11QYxI8dJOreNKrbCWug62QgGxULBcgtxCIFyLAREMd5NACBfFUCARUASsgiAi4AXkolAw\nIAhtqf3u+7yHxEQrdWe7OzuznJnvOJxzcs7n+T7P8z7v0cZm5Vg5Vo6V43\/3WBgv8cSzNjHm2lIW\nxjJs6dzcSJbd7Gi24tnjQi2enH7rvwaDhRu2mG\/1X5xpEM8OZ4pvNoUYui6HYmZEyfW4T4a734kx\nfEti1p32CGNfe6Rh4m6qYW401\/B8tlmxaCwX\/e5w5MrT4Szjs0cFmB3NwcA1Mc6ddsMZ2XtQyvei\nJP3DV1SY8gFSI0QozXbDrcsnYKj0xsPueAYuBQX4b7u7OKsXUfqMgxkdQ12x6Gz8Cldr\/FCa5Qbp\n8Q0I+fQPEHu9jajP\/oQkfztBxwSlBKxGZvA6yNg5mf9fIPFZBYnfaiSGOCBXtgtFmX\/DRfVhzDw8\nZfhhstxAmfmXAcf7ZQ8mBpJZ9CFQJL2PSG87xBz9MzKC1iInzB6FJzehiKk46q9cJdGvynSN7iuM\n3IQC8UZkBK5BMgsgP2En7rSGYaQngWUljylX\/MZwzRd8FdfqA1CWtQ\/hR1ZB6vsOckIFKBPMuRgH\nKGNJjlDFOUIdt1mQRPhXxeXIr9O9JdEOFrAbcTZ8A9KOr0bSCUfUa47gfmcs2vVBy9cndeLt1nAD\npSA+cCMk3qteAhOgOBADKY13QhmTRroFmoQtGLypwbyxhzVLLiqTt\/PzdL10CfoFrABawEDzIxho\n0DpU5rljqEuCX2avaNmqYPcrS4ZKTCmtVf8Dsf5rIf9qLU8JPcjkGIHRyzgUA9ImilAhE6FVG4xn\nT\/qBn6fx88IjLMwMYKy\/Go3FXvyecnavCZYCM4FS0JT6fPae3PCNqGN1Of+9DovT9bDqdjzR2M5P\nqI20TMQHrEdWyDorOHqg+hWwrahKdmZwgTCOXcXzHyc44C8\/TWFxfgRzkx3obc1Gk8oX59N38fvL\nE0QclIKkYM2QJwlyAxTMzUus258Oy6mBjGbA2bEc\/7FeGV8eTgWt4RG9gHPg6SE4coIcq0pyRnXK\nNvS3nOZQJhHkT8+GmIN3MD3WiJ52Bb4fqsPkYC30Cg9UJm3lwQmQTtaQS+kuSXDB1P00POpNQHdz\nsJDq8YEkbY3yU0j9VyOP3US1QT8yp9XCORNcQ64bd8sSkHS3txmX686gr6MUU8N6DjraX4WsODek\nBa41Q5ZJX6TbXJPMGEW4PcrP7kd9uRdavw0Qlp+pe2kd3U0nBPcYINUFAXL3JCb3hLRWs7ReSHVB\nXdZujN5WcYAfZ+\/ztBIwaeZxCz9PIkh9tQxRx7ZC8sU7vCy0LAsUMAVu6SIZQwbdawtHy0VfWi8N\nNrPDchFNh762RE5PtVD4cu2xaClqip7cu5DmgovfvIuiuG2sZmIw\/kBnBjKJzg31VqDyXBQSvt7D\nF3Z5yHoOKNTj6wFbKz7H1KACF5SHYTPaE6+dH1fh8Z1cKNgC\/KYOXkx\/F7UZriiJdUJmqAPOxH6A\ngtSDZlFK477chlAvO4Qd\/iOywzbifOq2JcDlHbx2PgBsimHgRjpsWnS+BlpeqHMKoxyWr8GlBjnP\nXKxZcpEg6+TbUZ+5AxXsWikLpFTKFC+CSrIFStYMFAwFVZ3ibNUor6vBAbZBGh\/IRdeVaKNNceZe\ncXXxJ7jJarBJ+Qm\/4XVLzMtdTKmuYS\/XLYFaSveNKw+AAiHnyPk36WItW5Ku1HyBOo0XdMpDH9qo\nT7u9pc336HjQGY3phwqoE7ebXVxuHaSXUboIlADIIQI2i\/1NTgtgS3X3OjjTOsjM6aw7hoqCv+OU\ndOeL2Uzrze2WEzzNwzcTWKodX4G0miRSwU3Tgk2wHJiBkCqTBLfomjBJRFaTRBX7MpyQ2i42\/2kf\nSaM24Mg6T6tR13MlhG84WdNg8PpJaFKWnGQ\/tp7FjtazWPpiFpdbSGMx3sgxSzBTzZnSqpI6Y6Qr\nCc+fNuFRnxxy6XvwcX\/b1gqwrT7As7HqKJqqvXFdfxzD3XG4qvVCUbQjf4g1qGk348hfat7NSCz0\n0m6GOxZtvfUqjtnMRqUXJu+m8OkxPpCJ\/vZwRAU5KX51N6Ov\/sxOmb3PSBZ3Xw7GkwfpmLqXh1sG\nCUplO8yOUur5fjBqaT8Y\/Yb7QXKM1Voe22oR2N32CA5ETUrvTI\/ZAcnXzkYf9zW2r91yGVQennqV\nB76r88P9GyfZ0M7ED5NaroedcfzB5akCLDlLLzRBW0ksiANFEJQ99AUH0N0QiKcjJXyTSnVPIzY1\nyhUh3hsQeGQ9Ag6t+e1vFoI0lB40dhqOg7qb1kkSfVOQq3NjCgZcj7HbhbheE8qhLdVW6YMbOjFu\nXZLwe2gIUAOSFibK2G917LkSDpcesx1hfpsQ7G1vDPKyf\/MPqgaNu61efdDQoT8GaqDWWj+oc\/bj\nqs6Pd9r0UAYHnRnO5n93N4dg8l4qh6DzfE\/HNDNSho7GcFyq8uZNSKLnXar8HMliF0QGOCDMd5Mh\n1GeZtP4WaIPKXUtpJ51naaorO8yB6UUkcoJqiJqLVgGCJ1DaMgkwR6FI243qQk\/kp+3B2eTdSAx1\nRnTQZm3Mlw62v8unp159QNSgdFcQZP05d1wsOmBWTeHHqM77CFV5+1nt+uPat35oZwG06XzZLvkQ\nchJ3IUuyAxnRrkiNdGFwWxUJJ5xE\/7GPeII1qNzFDUoPAwEzcNQWfYwL+R+hMncfNNl7oZLvQXH6\nbuSnvM8AdxpOS7aL5SddRSv\/H7NyrBz\/b8c\/Aev08XCPx3QhAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pumpkin_pie-1334341503.swf",
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
	"zilloween",
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

log.info("pumpkin_pie.js LOADED");

// generated ok 2012-09-18 15:42:17 by martlume
