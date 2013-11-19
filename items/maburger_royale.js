//#include include/food.js, include/takeable.js

var label = "Maburger Royale";
var version = "1354649291";
var name_single = "Maburger Royale";
var name_plural = "Maburgers Royale";
var article = "a";
var description = "It's not just seasoned beans in a bun smothered in stinky cheese - it's so much more than that. Oh no wait. It's just that.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 350;
var input_for = [];
var parent_classes = ["maburger_royale", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !(pc.skills_has("grilling_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/41\/\" glitch=\"skill|grilling_2\">Grilling II<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-20,"w":31,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIK0lEQVR42u2YeVBUVxbG\/WuqEjUu\nUTCCCy4sTS80u9CsCoILGFQWQdmaHdM2ItCiAwIijewaI8gWFCbGpUeIQMxEBAEFxM6ACwhCMI41\npqZGpxKnaqqm\/Obch+24BIM6Tk3VcKq+6tfv3Xvf751z73f79aRJEzEREzER\/1vx1+IV0wbyVnje\nznVOGcxZrrqdu6KJaSjfhdP3TAWjx+z8YA53PaVf6Rj4Q5GLwzuB6k2TiNTpEllPhsPw9UxH3Mxy\nQp\/SCf3ZziAAEACG81wwRCJAfF\/gyh2z87f2L6e2zrhG\/f6Ybo\/v0u0fqNPsVFf32Hm+NdjdIldR\nW5J1ReduW1xJlXA3+PGYHI++ysa98rA3AmTjXN5lg4uKZWhJWjbct9\/pzUBbkqylLYlWaKOBngUc\nLPTCyCE\/DBasHRPwfkUo\/lL9CYYL3J8C3quMQX\/+uucAz++wQlOCFbrT7CrY1BkX2EbepN8clwpT\nzm0zx5WM1S8BjqfEj+r24ufavU8BBws8cJ8yP3jA5znAznQaP8UNZ2JNcTxcGDguuM+DjM\/UxojB\nAAc\/C+cAe7M98OB0Gn6qU+Lnumz8UBL4xnPwWcCrWV4YKI7hAL+MEKFebvlqyMpAXubRYD40gM0J\noyW+VeQPXDzK6Z9NpVyJXwdw5LNNuKF0fQmQlbiR7qMBrJYK8e12mwVjApYE8B5V\/QLg65b4RcB7\n5eEY+tT3VwGrQgSo3WqaPybgAV9D1IQK\/uOAY5X4RcDyID6qw0RNYwIW+hi0vQ7g\/apYrux\/KvF\/\na8CqED6KKEGnYs1UYwLu89JXHAsZf4lvF3rgbrE\/t1rfFLBuK8FRUg4H8FBIgP2ttcMARL8I6G3z\nUcBBP0OcpHSfpY7vqsTNidZokFvgVLSYlRQVwQJ8uskICSsXQt3SSHx48BJkFhnllhDxAz8nXWR4\nLkEFzYdT0aao+8QM57Zb4kKSNdp32UKdRpD7HF8bUE1wbck2aIyzRJ3MHKpYM5yIEqOSFkaetyHC\nJLrwX62H+m+LGCAeP37MMvlv896d6qUKj+ZDGmkMn41LEOW5GHvW6SOXOpcFC1EVZoLjUab4ip68\nnm5yPonKtEuCzlTaXzMc0ZvphB7StX2kLGfu+Gq6Ay7\/1g7NO22p\/TL8YYc1TsaYoZzGy\/UxxM5V\nixHhpoeoAAOSAJtc9KGI98LffvoznoSMg7tx48aCbxprEf+xLWSOQkRECCFLMIVcYQ7ZNhPIw\/iI\n3mSIHTQ\/5d4GSCbojPWGyPHl4cBmPkpDTVBGKpWaoJwpTMwdl4aKUBIsQqE\/H1kfG2PHCn3EefGQ\nKDdF4m5L7CDFJ1ogwcMM8aZibFg0H372VngmRhdMT0+Pw7XOZiic9LB5qR68lyzEFiMDhBjzIOXz\nESEQIFIoRIxIhGgTE8StsMBOXxtkp7giZ48bspJdsCtCwikz3BHZPk44vNkdFe5uqF7jjhpObji2\naiUq3VxwyNkRSokEKVZWSLYwxy4nK2Rudob9rCkwmf4e\/vHjoKbMTU8Bb7SoIJPowF17Kvznz0Dk\nollIXWuC8xVSdNfJ0a6SofnEVrSqtuG7c4m41rQTI13peNiXg7\/fLkBLTSySNyyDYqUF9vnYI8nZ\nDLFCI0QLjBDFN0QE3wDhPH2E8pYi2HAxAg0WIc5VDPkayqavJRRrRfCbNwMr9aZjpPsbPHz4kDGO\nbn29vb0iBpi3gQYQa8Nq5ntYrjUFmxfMRKjeLORusUF9cRAaioNxrkyKC1WR+PpIKErkbsjfaAmZ\ngTbShLrIFM2DgjcXCaQMkS6U4nnIMZ2P\/eL5yDKZh310Ll2gA4XRHMj0tSClJPgQlDPdSzJrMtbo\nzcBudz10NVSjra0Nra2tD54uku7u7uFS2SqUbTFGOXlSvP18OMyZClfS2rnTsIrkNucDeOhMh5fu\nDEgXz0bEEi1Ekthn7FJtKIznIpmJr4NE3kcIozZ+Cz7EFnrIEILZSDBsHA5o9mRYfzgZljPfx+pF\nM5DsuhCH\/I1QFGrLwTG1t7c7TLpy5co0Is1nJ85+WYU8Xz4qyWJUZAENMjMUrDdAhPlcBInmwFVn\nGuxpcAetqZwctUfl9IycmehBNN\/ZddaW9bObzcCmwJay5S\/QQjqtYhV5oYo2hrJAYyjXL8XJYqUm\ne6PlJUoZS6WG+nTlQRT4CfA7MlBVjCnn9pfIvzRG3Si3xEFvHvZ7GkDhvJCDj+SkwynKgmSp++T7\nXISTkpwWQumhj6ogIb4gu3pxJ\/mcvFDppY9jmbHPw2niSRYD6aKKNWhqOIOjqVKUBQk4VZJdHA03\nwemtZmhW2LD3CvTsdSDvc3ylUQ\/kLOd8sWevI7pS7TijbyawxjgLnKRNoJx2ECVVaK+fOWqL07g5\nx5X1VcFgCdKTlb3p61r1F\/k7UZ4cgKJAUxT5G+Mg+V4JGW0NmfbZ7fSTXWGLdjLjyyn2uETqIOO+\nkCxBfbw1fr\/NEidizVFJvngkREj9+cjzo+x7G6EkkI+qOHc0HElHR2szB3fx4kXRa7+bDA0NiciG\n8rs6LqlbTpfiVGEialICUJmwDsUEWkxGzIy6JsoM1dFmnFGXSsUooXMlISIcDhJx12riluN0ijfO\nHFCg5cRhXD5fD7VajZs3b6Krq0tNSVnw9m95d++KRkZGZMPDw6r+\/v6m69evczfp6Oh4uvI06uzs\nBFWDE2tDVsaJ9bl16xbu3LmDvr4+tlLVrGrv\/IVeMzVIKVSupifziQNkYCxTGjAmdszm\/H8FbjzB\nSsgWANPAwACnif9pJmIi\/h\/iX4Sq\/uOif178AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/maburger_royale-1353117539.swf",
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
	"newfood",
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

log.info("maburger_royale.js LOADED");

// generated ok 2012-12-04 11:28:11 by martlume
