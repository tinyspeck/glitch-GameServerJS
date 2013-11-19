//#include include/takeable.js

var label = "Pair of Dice";
var version = "1353442824";
var name_single = "Pair of Dice";
var name_plural = "Pair of Dice";
var article = "a";
var description = "Roll up!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["dice", "takeable"];
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

verbs.roll = { // defined by dice
	"name"				: "roll",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Roll dem bones",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this['!is_rolling']) return {state:'disabled', reason: "Already rollin'"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		var rsp = {
			type: 'pc_overlay',
			uid: pc.tsid+'-dice-left',
			swf_url: overlay_key_to_url('dice_overlay'),
			state: 'spin',
			duration: 6000,
			locking: false,
			dismissible: false,
			bubble: false,
			pc_tsid: pc.tsid,
			delta_x: -20,
			delta_y: -120,
			width: 56,
			height: 56
		};

		pc.location.apiSendAnnouncement(rsp);

		rsp.uid = pc.tsid+'-dice-right';
		rsp.delta_x = 20;
		pc.location.apiSendAnnouncement(rsp);

		this.apiSetTimer('onDiceRollCompleteLeft', 1000);
		this.apiSetTimer('onDiceRollCompleteRight', 2000);
		this.apiSetTimer('onDiceRollComplete', 6000);

		this['!is_rolling'] = true;
		return failed ? false : true;
	}
};

function onDiceRollComplete(){ // defined by dice
	delete this['!is_rolling'];
}

function onDiceRollCompleteLeft(){ // defined by dice
	var pc = this.getContainer();
	if (!pc) return;

	var left = randInt(1, 6);
	this.left = left;

	pc.location.apiSendMsg({type: 'overlay_state', uid: pc.tsid+'-dice-left', state: 'roll'+left});
}

function onDiceRollCompleteRight(){ // defined by dice
	var pc = this.getContainer();
	if (!pc) return;

	var right = randInt(1, 6);
	var total = this.left + right;

	if (total >= 9) pc.feats_increment('tottlys_toys', 2);

	pc.location.sendActivity('rolled a '+total+' ('+this.left+' and a '+right+')', pc);
	pc.location.apiSendMsg({type: 'overlay_state', uid: pc.tsid+'-dice-right', state: 'roll'+right});
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"dice",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-20,"w":26,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJyklEQVR42u2Y6VeTZxrG\/Q\/8OGtr\nO92mrYqiyL6D7PuOsm8CCu5IReOGiMtYtbXaulQr1VEBURHFJYAiCIQsBAgJyZsAAp5Wo9XOGTsf\nrrmfJ+QVtZ4ZC50zH\/qec33I4bzw47mX63oyZcpvz\/\/p8+DgtqmD2zYWmraslQtFS2BYlS\/oVy6S\n6gvSd+vzkiW6zLgwXVqM+\/8ebFvR1MHyzZKBrRKzqXQ9jBvWQChZAQODXLEIBIj+vCTosuKgTYtE\n38JgaOL90BPlIe0Jd63uDpwn0YQ4hf06YGXrJaZSiZngwGTaUgKjpAim7Rvx45N\/PKehL\/eiLzUc\nmgWB0MT5ojfSAz2hTiBAaGJ8oM9KlOuzY6ZOCtzdPX8LG9y11WxavwpWOA64eS2M61dD+GQptHt3\nQHP8EDRHD6L38BfQZkSjLyUMmsQA9Mb6oCfCDb1RnuhPjYQuIw6yWH\/I4wMlE4Yb\/mzntIHSdWb9\n4lT0Z8RyGfKSIRRkwFhUAGH5IhhW5lrKW5iB\/vxk6HISoE2PQl9yCDQJ\/gToSz\/PgbAsm6CCcHW+\nPS55zsbNUHdh4oD7dhZqFgRDHe7G1RXuiq4wV6ijvKCO9kZvYhA0adG894SifJhKlmNwczGG923H\n6JH9uHfyKEYO7EF3eqwFzGs2aj1n4aKHDa77O2LCgINlGyTqCHdosmLx8HYTHis7oS1IhTLUheQM\nRYgz5CFOkAc7oTPYEZ1BjlCEu8OQn4KHzY2gCuB2uCeB2YpgF9xn4rzbDFzzs584IJ2IhJ3Y6I16\n\/PDoMZfw+Q4OxuGCLXAKKuNo1Uk8kndARcMhp3eMawqgp\/4cunEVT\/\/5E1S7ywhsJmoI7pzrdNTP\nnzcJgKsXS1T0x4YG74rSX6wWwayndk8hw0PzQy7dnjK0B9ijOyUCChoI3fV63Bu9B9m+HRys2uVj\nVDl\/hKYQt4kDCtmJElbO7muX0dPTw6Xatl4EkzEFOmDANCBKW3MWbf7z0BXnx\/uss6YKGk0fGjcU\noZrAKp0\/xFmnv6Ip1M08KYC8lLRwOzatQQftPFmklwUsyAEdgUz2UNB6UavVXLKSpbjjb4euWD\/e\nZ5dSInF1UzGqvW1RSWBnHT\/AGYf3Ue9nL50UwBeHgIENHjuIn57+C6N1NbycbQHz0CpZhRbJStzx\ns0Or31yoCJD1WRWd2Hiw0\/bv4e\/27+KKr93kAL5YTvXyLNz\/\/r4o9dpCfmJWMKaW+XMIcD5BzH0G\n5mABOzXvHZy0+wsu+8x9PUBDfuI0YUmSe3\/ughRtVlwhM3uypKMvlbMgDYJBEKXcsJKg7MbALHC3\nfedAGTMfdT5zXgL7du7bqJj7FprDPZ8HNGQQQEFGobAyTyIUF+wmB5AaihZLDctyzPrlORYnWJwC\nXe4C6LLjxuwqAt1x\/lBnxKB3dS7UeQt5OeV1F6BUKqGQXkcrTbkIxuFs0UxSxvjimr8Dgb1LYO\/g\nW4KrILjH331Ha+cpDKUlFsDvTx0LM0mKBNXpk2hpaRGloM9CcSF6yzdC+dV+KL\/8DIoDe6HasYkD\naghUvWYJ1KvzoF6VC+Pli3ig7+flbA11Q0t2PFpCXceBzeFgzT62uOUzG90LQtikimAn5ryFb2yn\nYXTkHpfp03LplCeGPpthspoBMvaBfTsxIu\/ESKcMw7IOmL7YzQENNGFGo0lU\/+e7OGAfnZZGIacV\noeHqpXc1mdFQxfujjco9vpxDZ07A3NmOvvJ1HO6m9yz0JoWhMcRVBDtu+yaOzX4D6o4OaHo1UCzN\nqp4yUFpc3U1RR7swlJu18ZPlPIEYJZRCyDc54Kp8vKrEejL5gdK1GCxbB2PJMvSnRUGfGQ9deoxY\nTlXxEpgfPORi\/ziDa\/KyADYEu4hgX8\/6M47a\/AkVgU44ReBsAKcYt6wRjV4d6QltcjhMZEGjJw7D\nRGvBUJgJw5J0Al9KEOsxtKuUEkoOTytqAlEsDENLpDduBDiiznuOuDI64wLREebGy6naWw4TLWgm\nvayd4GzQSOqhd6VBziLYkZl\/xOGZf+CfZQmBljyoW57J04eKywUq5gqUQvSLFnIzf9ylxOhBShur\n89GZm4SGQGfU+9jhorsNzrtbffNjnKNpvJAUjgv0R8+S6TNYNgSsnM0UQJWNUqi71GinRd7oaYMG\nz5kWQDqtIzYWsEMzfo+TNMm9qVFHxbCqXZYxljyepQ8u+jxCPTi0tYSnjTpKGyyj1XrMGgc3ncNV\nu3yEemqF9rZ2rmvbN\/F0ooz2tZSTiXqyiVqikcAYXIPHDAIMxY1ARxwmsEPTf4fLtBN5Wcc\/PfSS\nmDzGHMGqvuwEnmwZXF2AE5oOH0BraytuVp15Do6VVXbuLPdTJtXNJtRSj2kpB3YnBkMe7YO2YGfc\npGFhYA1U3lYqrXH1Emiohc44fYA70b5yQ06czUvLV50U+symxhzB6grd8QFoCHLhJ9e8Y7MYBpiu\n0N6zwrGe66o+g+G7I1zaW024SGW2ngbfr1kJ7kJ2Qgpb7PrsBMGQnQhT8VKYNhRJhcWpha90hy4C\nFJ2A7geyQKsjOBCgP+85VtaOPeUUpYZEXcuK53AsdZwhq6qjVG0eGcWTxz9CujSDB8+XyvVLnq7k\nMA7Tnh6JtrY2tJVv4ObOpCaHkFJpWc9doX66f\/cuHj36AUMUOsfDnSYffdGqWI9OCmA3nSCDkZeV\noJeWY3fzTZ7Vxuc1Fr9rKEheoalsoj14wW\/eK+GsjlDjPmNyANkpMWtS79yEoaG7MNy+JaYOltda\naccxuHMuzwbiP8ExV2Drh\/XcxEvMIAhGTs5gHh5G\/1f7RIvqor5qifB+bbjjs9\/k0Z0NxoQBFVHe\nAoMZb+gW0R6jKW6J8OJwlf8FXA05TP3+T1FBa4m9MymAsnAPqTX+WJOGNW0wJ7gd7vUcXC35cu2q\nvJfg6ooW83jF1HjkAKomC1AR6bWbwYjytiQNJgVNLoVGDldJF+rbNZWQyWRc5zPjnivr9XUUMgQj\nl07dhUqXDycHkC3RDro9iZbkNYubOZOCHKA9xo+f3CX2nYlWJ6qBgsP4njtNk\/3gvplLXnEE58hp\nftYZfhEk\/SI6LTNLGMwrrX4pjyKTTwzhkbwmxAVD\/f38\/sp0ncKDFe7YWBr5hk66Ni2Sm35btJ8w\nZTIfBtm9MJRDSskvmRR0Z1CSl1oHojYhAKZbjVB9fWAM7g0RjkWlCru3+ckpEoPNk1LeFx8WcXTp\nsdUd4R4cUJMcAd2iJJx2fP+lWM7CwlW607Lbf1v0fMpuCbvZ3mMt86t\/SypkJoYZcpPMppIVGNiy\nDtr0WMgTgrjUyRECwVQLWYmFv8opvTYsSyFj+u2b9595\/g1VWz07gsY+aAAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/dice-1314131611.swf",
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
	"dice",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"o"	: "roll"
};

log.info("dice.js LOADED");

// generated ok 2012-11-20 12:20:24 by mygrant
