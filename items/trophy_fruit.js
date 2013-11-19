//#include include/takeable.js

var label = "Fruit Trophy";
var version = "1340228514";
var name_single = "Fruit Trophy";
var name_plural = "Fruit Trophy";
var article = "a";
var description = "This cup is awarded for superior efforts in the fruit collecting sciences.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_fruit", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_fruits"	// defined by trophy_base (overridden by trophy_fruit)
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

verbs.drop = { // defined by trophy_base
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

		var result = this.takeable_drop(pc, msg, true);

		if (result) { 
			var trophies_outside = pc.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
			var trophies_inside = pc.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

			if (trophies_outside.length + trophies_inside.length >= 11) { 
				pc.achievements_set("trophy", "placed_eleven", 1);
			}
		}
	}
};

verbs.examine = { // defined by trophy_base
	"name"				: "examine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Have a look at the trophies",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
			'type'		: 'get_trophy_info',
			'itemstack_tsid'	: this.tsid
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'examine', 'examined', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	var loc = this.getLocation();
	if (loc.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function canGive(pc, drop_stack){ // defined by trophy_base
	return {ok: false};
}

function canPickup(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	if (this.getContainerType() != 'street') return {ok: false};
	if (this.container.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function getAdminStatus(){ // defined by trophy_base
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc.is_player){
		var location = this.getLocation();
		pc = location.pols_get_owner();
		if (!pc || !pc.is_player) return;
	}

	var ago = this.ts;
	if (this.ago) ago = this.ago;
	return pc.label+' got this trophy '+utils.ago(ago/1000);
}

function onPickup(pc, msg){ // defined by trophy_base
	pc.furniture_migrate_trophies();
}

// global block from trophy_base
this.is_trophy = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trophy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-50,"w":50,"h":50},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALS0lEQVR42s2XeVBUVxbGFY1LZJcd\nuqGbXqAXuhGwAZFFkKXZmlUakB0EgvsuKuJWqAgKGlFxixBFJQYpdw0xxpkxKmicqCmNqNEkZjIy\nqZjJVlPfnPtsLMbJHyJTY7rqq359t\/N755x77u1Bgwb4uVydkN1ZkxA06I\/06axOdL60Xld7bWNS\nz5UaHf4wgAzscrWu4+bbk3B\/VzbuNmbi8npd9x8DjrxEMD03t6Th65a38M2BMnxalwwW4tcOxyAI\nDje26PH40DQO7gZ5kbUxr75ez61PUDHPXatPxYPmYg7wq\/2luL45DZeqdV2v3XsE0d1Zm8CFlYHd\no9z7vCGN8x7Lx9cKd2bpxOkM5Bbl3TcHp+Lb1hn4qqUM994pAIO+sl5X8drgtqYIzY4uDO7pBfxi\nRxbuv5P\/fPey8sK8+9oA6zOl0z9YFs6FksEwyC\/3FuBhUyEe7MnFne0ZvWE+fLkqxez\/DrgpQ9rF\nAZDubEvHo+YiLge\/2lfMAd6mtq4NiVw\/e5GDMzTdewsUFTV6UVCtTljRpBd1txYocWKmLw7lKXB2\nXgBacmRo0rv+b8pSIy16rjIMf92Ugns7Jv+HmCfv787Bjc2p3IZhoH9ZE8ON31fogUP5SlxcrcVl\namN912qfvUjb1khcWReH7YXqge\/+rdnu+GBJMLcZWM6xosw8ycBYHjJQ9ptBsv4vKOQXVkaifaoP\nzi4MQq\/3T88OwOkp\/jhVoMHqajWa1oxD29KJ+Kw+9fCAAHfmyXGmPJAzwiAYzIueZGB9f+8q1XAv\ncnurHkfKUtAUG4Z2pQhnFe4476HAe2FyzFgkw8mSAPJwzMBOoS1Z7jg2eyy3QehS8F+AfeFuN+ix\nJVeFKr3iWSjnTESyqSMaBQKcIbjOqCjcLijCVU8vAvVAm7sYh90EOJ3v3\/PKJ9GmTLeOtmlqfEI5\nwyB7QRkYyyt2YWBwH1XGo6lgHHZk+6KrJonyLQV5fAFKLHhodxfhnFKOLs8xeJCehdvefuik5w+p\n7Yi7K5rETmhNVb9aLW0qUtbuK1bi9MKA5\/nEnb2Uk71hZ4DFbkosU0dgqpUYleM9MNtHhlTy3nxr\nPgfRoZThitoTt7w0uEm6TM+srY369oodsUHt9Gqn0dI4YcV2KgsszCwX2S5l3rywKvI54PEF0Qg3\ntsMkAppsxoPO1AEbAtORZ8ZH0WgHtFIYT8ml+NhDiUtqigaJ5eJJamt1c8EukT3qNM5g9lLmC\/tX\nS0tCnIIaKA8PllLOUKjfm+qNxgw1dpGaCgNRH69BnU6DNL4U+S5jkCvwQIIlDzkEmk1KNbPHuxIe\n3ncX4gQBsY3CdEIuofwTolnihDoXa6zQy1D3XkJQ5hK5qt9eXJHg2s12c0uJB1ZHSTBHFoxF8hA0\nxpShUhHKea2A4OYKx2KKuTO3MeKM7ZFi44oUEwfUu9hxIAckzmiVCrBN6IytQj6Xe9uENih3tUTd\niSTuRq6f6344ZaZ0er8Ap4XxazemS8F29CRXJ+jIaJyJPZLoO5fCmG7qhCgTO6TRt54UY0Gi\/gx6\nLuF5YJ5qIuqC9JhtL4DO3AalYl\/Uh+ZgPk+KxY6mmDbFE227E3GiJjaeeTC\/UtmRs1Tx8kV8Soij\nanGsAOWhQpSrwjFfqEEWeY1BxRGk3kWOEGMbLsTL\/RKQbStFNAGmmzlhorEt4mlMPr1IASncMIe9\nGGvLt7BHfrIa83ZHoqwh5Hl4p230ymZ6acjSEF58uqsjUih8bOFMMh5FGyPXgYcDcwPR2VaGK+2z\ncLU1Fxe2BKIiXAAtQTLwCIJiYWdzI+k5ytwJmU5SJJs5olQyDnOUYagITEJVyKR\/LFKHV5xZOi77\n1OKA6dUrPV+uNuqdPIPqwvK6U23FnAG2SzPIaxkiR9w7n49ff+nEb\/+6i9+eHsfPj2vx9MEC\/P16\nEpbEuHBQ4eRFnaMYKdZixCvSkBm7BnMK96AoYjHyxX5YG56J9oXVaM6YjargeFT6hvbvZAk2tjmc\nbPBcIoVnvlc0Vo9Pw6mNY\/HTk\/349Z8f49eeHfjtu7X4+etlBDgH39+k87ldhUyBIyY5uiHWRogY\nRx\/ERm5AccFJLF96D8vL72C2bALWBE9CU\/58NOpKsMY3EeXqyP7VxHGjrLNZ7uhtJCiTBVBO2WOm\n2AVPPsvF03uL8OOjSgJbjl++WYGfHi7A07vF6Lkeiy8\/VKOjQYYCWz5KzV0QY+uB6Ij1yJt8FIlx\njcjLOo4yyXgsVEWgKmgSVvrEYdmYaMxThPb\/AjHe2CpoisALy6issAK8jeri02+b8MOD1fjh\/mL8\n+HAJwU7j4L6\/lY5vL47FoYVe2FGkRhaPx+10FuporyIk63YgLGQ19B5pyHJSYypBzpZPILAw7vst\nybjs69dnqc525NT2x4u1XOmgzZErcMbnZ\/T47noBSY+em3n4\/kY6gWXhybUI\/O2iF6pSpOSRWMyw\nUyLXvwSFoTORqClCgnQ88lzUqKRjsYRqJsvRHL43ioS+KBb5ozw2GIfbknuOtKftamgIf\/mi7T\/C\n3Hm8sXVHhLFdR2GQX8elI6U9d05p8OicGl9\/7InHf\/bC4z+NwaOPxqD7rJrCaYckMp7hEogli65h\nzapHmDezC0kTlnO7mp3T7GWTLPhIspEhzd4D6Q6qrhQL4cD+Njz54rTZg8\/e77p79RAuHyvHJ\/tV\nuHlUyenWcSU+PaLAxRY5lmQoEEohTfDMQV72MSyYcxuzpl1DSsJORNo6U320Q7wNlSILfne4qUtF\nlLlwethA4T4\/36C6d7Wl+27nftz+pBkXjtZj\/+ZSHKqdiIM147F\/nT+2LfPDnHx\/RIR4IzTAE5He\n\/tCGr0GSbjcKck4iO60Kc5NjuNNG70gnSUxUz93ze1UDvvpP0Wri96wq7GleW4J315ViX\/VUtNTO\nwMENs9BaNw\/vb16I9oYKHNu+Aqd2VuHsnhqca67H2XdqsK9mFTaWL8HWysXcmLa3F2PDzCysLEjC\n7hXFaKoq7ckMkA8M0nvw4G5vo8Hold+woYi0NEVUH2lJ0b8jrUF9x7K5fdfzMTLa9cpw6kGDfPyN\njNBXAaRAUjAphBRKCiNNNCjcoN7frG+CYWyQYW5A3zUHD+4hU4P7yzaUZBZlYnLsRbBeKGY8YogR\nokjRpFhSHCneoDhDW7RhTEQf2OAXQKMtLBaRveEvA8beZBTJem+EtiXHwREJ5haIMzNDrIkpYkYZ\nI+bNNxE9YiS0w4dDO2wYtG+8Ae3QoQQxBFoC0RoZxP0egijWR2Oi3hjGzYkaMQLakbTGqFF0NTNB\nrKkZprqKsNZvXCXZtTA453c\/Q5jXSLbBI0ceTLWyRpLlaA5wsqM9FVUHTHaigu1gS7XLBql2Vki2\nGY1Ea0skWFkgfrQ5yQxxls\/EnnXUxvrYGDY21daK5lpT3bOlW40dsnkOSLS0pLuiBWcrePjIQ2Tf\njjTy9+BMGRzfyqowWCQCUwhpAimUFEYKF4sRQYqUSKCVShAtlSKGFOsmRRwpnqQzKN7QxvrYmGjp\nszlsLluDrRVmWDvEYE\/j4ACyP4U4HEjGL4bVisRzdXa+IaL\/s0xioRBSWsidDMjd3aGUy6FSKuGp\nUsHL0xPeXl4Y6+MDX40Gfr6+8Pfzg7+\/\/zPRM2vTjB3LjWFjx9AcNpetwdZia7K1pQTHbDGbZP8h\ncQiYswxcg4xIb7L4m5iYSAR8\/loBj1ftwuPV0PNGmlAvEgo3i11dGyQi0TapRNLoJpXudHdz2yNz\nd98rl8maFQrFPqVS2eLh4XFArVYfJB1QqVQt1Laf9K5CJmsimD0yN7ddBLSD1thOL94gFoneprU3\nubq4bBTy+bVkcz3ZXkccbgaHDf83aQwTbf46NHgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112371-3099.swf",
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
	"trophy",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine"
};
itemDef.keys_in_pack = {
	"r"	: "drop"
};

log.info("trophy_fruit.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
