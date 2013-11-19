//#include include/food.js, include/takeable.js

var label = "Common Crudites";
var version = "1354601578";
var name_single = "Common Crudites";
var name_plural = "Common Crudites";
var article = "a";
var description = "Everyday crudites served in an easy-to-carry cup.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 33;
var input_for = [];
var parent_classes = ["common_crudites", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
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
		'position': {"x":-17,"y":-47,"w":33,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAImklEQVR42s2Ye1BU9xXH\/aM1LyPT\n6oztTEdsmsmkSdEmqURtDIhPfNQmaiyggo+mQUlIFDE+N6AYBewaAioCAoIomLgsD5HXLgjyhmV3\nee\/jsssu3IVdFlmBQtRv77l2bZ3SdkxYpnfmzGUu87u\/D9\/zPef8uFOmTMLVM3JMwAVO33qL8Yl2\nEW6Jen3elP+nq3v4qEh3Lxi7L7+MLTFzQZCTtnnT8Rd9LXFzBCPprr72Zx+H\/8ItIHx2YKbMXcgp\n58sBShV9fjwchXe0y\/pJgWsOmy5oCnOCOW4OhtPnS+3POTjrnnBnZDeuAsFxwdxsX\/kYcFPsS06T\nAlh77Pn1FYefA3vB+QlA\/4g50t0Rc3Dh1kIekPwXX7ngUXpj5somLb2S\/T9yk+6fClXEjCcAixNc\nEpWX34A8eibaU+cy+o4dCM35NbbGuOB85jqpRXNcYFGHBDocUBn6wjwCbD\/90ycAR667CkYyXNF8\nYhoUJ6ajo3odVyC\/4gEVNQHo7RDAoglFl+Kg24TBvH\/4DWefyHd9N4UuSvSJWIwtZ96F16l3sP3U\nQoRFvInapDeZlpPT3AiaAIdSX0P5wWdBf0BDw2qEZM7HyatLOahgMA37UJq1xVpYuGlivLjjwpJ5\n2866Mdujl3BKrOTh\/pKwHH5R7vDlIuz8YhAQFUzTCSepHZDgKKiCq40+CEh4G6Vlu1B1azukYu+J\nS\/GelFWJBLbjnAe2Ct3gffodHnTvt2vx2fU12B3jDjuQJOjHjwEbQqah4czPeUCRci1fJKKbf4Ik\n04uZOPXOeQh3xS7FzvMePOBHiSt4BTeFLuSDlKQYuuKCioNTUXrgGR7QkvAKr2hb8muoNL6H5Bp3\nHjBbvHli1PswdpmTX4x74Cdpq62kVGD6avw5bhkPE5C6Cv5JK3gPbhAswM4LS0FFoQx9DnWCaTwg\n9UYC1EhWILvFE5EFj9qMNNOb916\/5oBTT8thKxULF4lPDchtKiLlCIrUswc9oyBQ+h2puvnk77l2\n8jZUp15EVsjPeEBTrDOqjz4PTc0GNLA7cOjGy9gft4AD9OLHnF6xP5EKRl23F42l\/rJ+zamnSzmv\n3rXVvFoERt5777ArNoYs5FUjKKpmguUKCLLkR4BRgpe4luMqYqJm857UtPihXOvPt5kvk9xRnOvt\n3N2yz5ngOqoDeUUl2Zuf\/vDAbcyQ3yjsaaWfKa3kPT+uosmLBEr3xpQFqD0yFVnBLwipJ2rPzOQV\nlHfs4it458VXEZ60RPZIvWAhAZblbIVE7P395vLHaZ5CArIr+K\/eI+U+OLGI9yU9J1XzY115QGnQ\nVAEBdn01i\/dgbvMG1LNe2BrtAmGKh4C8p5fvt8pLP3qc7u9XvTEeieQve2uhHmivWOp9BLX1r\/+s\n5juX5kMbPg10gCDAzrOzUPzlTGQq1oIOCtuif8OrZZAH+3bKgrhG7fPDWg1VccAVT4Z8SKpR77O3\nGwovLrX7ktdZv4j1kAWnreH7IKkmz\/CVDuS8z5B6GYKf8IBX6hfj09jfoaQ8cjmXWlHznT1cq\/Hy\n\/cGthgolSPwHviGT90i9T6+tsX6S5ImgxG1MTMVR5njuJuxLWQlD6m9BvqtKWKcauPmBgdKddsSJ\nB4wueQtH4heh3mYTkfcqCndbJ2yKkJIfJiwTcimlUbf+pgrPFLIKJur255aQ7I0gwM\/T16KEq2I6\nNJSefEU1KPY0yATPIuWLGTzgMfEvEZm6xtLaVXBJW78XdxqvWGqHIKN3OeQUU8CwKNabFZdlSaLw\nYh\/uKLUR8fELoYmcgTunX1VR0249OR0XImfzLSYwZQ7Of+Oj0rZH1SjL\/FHUWmcpYHqsDjtmSfV9\n2XW9d+VFut6BG21SXKq5hPisPdBe9URt+nZDd84W1MctR1LyHyFVC\/G19AQyqzMslR3lw6Xq1lFa\nm69lpQ4D5BRMZMeQOvwA8s6BXptIfgs5LUVoVBahrLVxtKpDMVqurERBUzUkjBzi5lrUaBttbYwE\nqrYsddvdkYJ8hhU6EjCwY3AklwDHHoIV5x3E1YoIDEkD0ZkTaBuqi2BVGX7IE++BbjAWF\/OCYNDl\n6g3tSdB21VY0mm0V9A4HAva50SbW+w8L7j98aJPmBI\/GF4Rg8HYQ2q\/5ggDpniUOADNwEZfzD8DU\nlcNqm+JgHDSLqnqsrfQOhwEWavqdyEfmMeSCu7qKBezd2wd55VrStsF+T8v9DPW6cGQUHYLZmGVR\nK5NtZI3SLjPr8P9HygyWKtqMALtLw2z9FWHsvcZzeu03frhXGjzKfLsD1\/L2\/gPw2KhFfxVtTVdZ\nWlPYybY7HLCok82nze4Dlt6ycPRXHLcMtKWre7J2wiYJRFfmLuSXH+EBc8ojLD3qy3yBMEPfibgC\nETkcsJAxCRhDjXpkuA\/9rWKYqk+jTxGL3pxdjwGV8q9QLBegvOYsqEAMnUWjjFnP0lqHA+YzJl+1\nvhq2uzpYLa3oVGXC0JoGU8khDJYEQZ\/lD6P6Gu40RaBBkYyezjz0m5VQGjUoZFjHf\/q4pTXNa+tu\nwZCNwXdjNg5Ui7tWFQfRDEufkgsFl3s5H2ZTA0zGSui1eajQtoLWTsqXhYYuNQfWzgMOWJq4aOFV\nMvfK0MfWwtRdCdZwG916CZfeQug0uZBodZi0Tx81eo1swFL\/PwE573Hq5aOj5QYcOuLGG3l2QNZY\n9R8B2zkwRpWLNm0ZaM2kAVI1GnsV+NtI37gKGnQlj1Pc2nQddR2VcOiIG2\/kMWwz50PNuIA9hnIY\ndRJ0MQVQt4lRq1XAoSNuvJEnN6o5MAX6++Rg1AX\/BtjF+Y8AqUhKtVrQmkn9\/kwHT\/OgCfcGdZyS\nnVxPbH7Cg8buBgz0d+DBgzFUGs3WKZN90diSmawYe\/AA\/+0y2oZRqOstn3RAShkZX6ozyWp7LBgv\nyg19siJ979EirWnW077\/7\/oYtc7v7weIAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/common_crudites-1334211436.swf",
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

log.info("common_crudites.js LOADED");

// generated ok 2012-12-03 22:12:58 by martlume
