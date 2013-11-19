//#include include/takeable.js

var label = "Cornucopia of Herbs";
var version = "1337965215";
var name_single = "Cornucopia of Herbs";
var name_plural = "Cornucopias of Herbs";
var article = "a";
var description = "The crux of every herb in Ur, gathered together into richly scented cornucopicone. On its own, as useless as a large pot of savoury pot pourri, but with the help of someone with enough Piety and influence with Mab, it can be transformed into a much more magical Blessed Cornucopia of Herbs.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["cornucopia_herbs", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-49,"y":-88,"w":99,"h":89},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKzklEQVR42u2Ya1TT5x3HfdltZ6Pd\nOluqp8hFUUCIIIKABhCR+x1CgBAgQLjkRriTwD9ck3BJgCSQGCGgoIBiFO+XGmm1znYaXV3ttC62\np9Z23Vn6Yt1efvf80+k5e1Fru27lRZ9zficknIQP3+\/z+z6\/J6tW\/bT+B0vGi\/BQSmMpizrbdmAo\nx3nCXOq4NMcPWhFwzeVh2j5pDA4Ns3BYX4B9fZlYMBRZVwScSRXn1i2Jdo62J0PdEAeLKtt581S9\nx4qA0\/ckeRi7052z2jwc31tCl4O2esXsO4Vwp2WgOR5jnanQU8k4ZeFZVlRjdNREEfXYsB2qwTFT\niWPBlOu2orpW07oHZ6crYDUW48BQHlaUerS9tLU02NnpSpy2lOPNBSHzu3zG4igr6MoREffdEw0U\nXddPSH+YWOKztgR1iphQ1se5AOkGoZWkHyfVmdxvet8cAaps9nLIBhn20d49zkPDeTiiZ7vKOl6E\nt\/ZX4o651Hl1lG2l0+F7A+bu8RVz0vwx2JqACzPVOD3Jw7yuEHOjBZgeyMGMJg9T\/dkwdqbazL0Z\n1MxQrm2sK80pr9mBtrZtkGkCMTS1HePKFGjbEqGVJeLKYAGuKFhYUrJxQ1mIYz259u8NmZ+0kWqu\njMTiGIdUEa4uSlw2W00lODXBc3W1riMZ8wSYDu4lcymOjhfjrcMinLHw0NoeDOMiE7K+YKREe4Ob\nuBHXG+IhzNoCQ3Eo+krCcVyWCoMizQU5nR3IPZDp\/\/z288gbxrvSiFK5WNAV4Iih0KXYk2a5MFOF\n8wf4ruc08Dli3fK8ABfJ67SdDbwI1Hf74eQ7aeBUrENqtA8GSiIw0RyGzkYGliRxkOQFob9ptwty\nWZJEXZKk2N5qzBDbREnUQtxLz1ZWWBTiMHalE6XSME5K05YAYiP2KTNx6WANUYuDk\/tKXY1Dg5rV\n6RjUxKJbHY5haSjaUxmIj10D01EmKho8kRzjheJyH0h7\/aCaCIXZGoM2YRQuNKbh5EAeDg9laZ\/8\n7YU4L7c3BAnUMwHzEnzRxAtzAdJw5t50jMgTXSqSYQFkUMDB4XyX9VP9OeiQhaOq1QfN6gA8flCM\nx7dIbtZFY2SICbFiA1hpvijgrUM9Aew1bcXwTATUikDI87bCJGTioJaFmcEsj78tmNzOV+xgXmvL\nezZgZtx6p7QkFOrG3RiWJ7msGJZ9DTipyiY25xLlqlydradSoBDtQK3YD+q9YXDcL8bfHxXjq0c9\nMLeHobbdG7MqMmgIQ6ARbUCHIBI9xhD0qBioLPOAsGM9KonKfJGPS8XrbfmUlcUQPxMwJdqLKskM\nAA1JA8iqomDqToeqfhfMZJIZJ\/a\/fbQOsxoW5kbYBDoLFm0seEWvYcq0De9fDSWQZbi6nAIJ5Y3p\nqV3IiPdBdsY65PNfRaOSWK0OAyd\/LboMIdAtREHQ7vPdDoLSrEA7VbsDSjLBtBFA2u6WinCMku6d\nICpenK0m8ZGAK8RmOuOK2euRnOCOY4uxuH2ZgVtvpsBxcycu307G9LEYcIv8kJngDTbbGyNzkRBK\nAlBArK9t8YXJyoTKEG4rEqwVz11KsB2+mmi\/8OBbjtXynCAnJdiBlsoItPIjMNiyB23kcT\/JwCtL\nubhxvhaz+gy894YIy0fKMWaMQ+dQMM6e341rp9fj8vEtePBOOM69EYmF5QSXrU1qf7QPB0FKBUAs\n84dAHIAaQQA69Vug1e90VjR6QrN\/u\/PUzSSPAp67B7viVWaJ5HVtmdQziN\/qo62WeXM10xHpLsCi\nNH9nNXsL6svCQYYGdIuj0UVqWpOJz+\/V4K\/30\/HJnUR89kEGPrgWi4e3M3F0MQyTM9tx7zoTtuOR\nBJCJy8s7MH85C+0jgWgZINumZxOE1AbSMBvR1r+ZvB4EuTYQowd2omOYYVeaQy0D09sohY5hoUYZ\nlrbBzc66ro2ONm0gVd\/nz73w+3+HexxpdxKytup8Alm6DY28cJeStKp6RSL+9LtcfHw7Dm8uBWD5\nuC9OzqzB2Xk\/7NetBa\/gZzg564+PbwbA2umP\/vEPIOouQOuQH\/qntiGt8GXkla1GUYk7Mop\/CzZ\/\nDWplPsjirkY652Ubq\/IV7e7MF5l0sfirvznAk6O9uYWpfqAheTmBEHG2ugDp6FGShlmaKcA\/v2iF\n8yEXn91NhcO+G7eXw2Cd2oTZsTW49\/YWjFX7oLb7ChTGWIh6DqK6R4fhcwJUNK4Di+MOaiAY06fj\niMoJ2LsYg4nFOBgOMp2NnZuZ3ZpQ8eRSzLMHlOz4DY5ckotpsd6oJOlPNwoNpyLNIygMhq5rFx7c\nzMb9d1Pxl\/sl+PRuAdkCObh1eQdmDWswP+aPhpZQSPu8SE7Oo3\/gD6iWnEFLowHjxnhotEz0quIh\n6cxH\/0Qp9k0m4uBcBuYXMu0jI9Hcb+3m1Jh1TNpqEj0OTro\/sTsUDWVhLhXFnBAIi4LJ83AMkY3\/\nztnNeH95M26d88Xti364dTEAPX2vorT+dfCaPKHfdw\/i0Xto7b4BQeUcpMIxiAw3IFXdQFnXTUj6\nbpF\/xA5lXy+GR2JgNMc7TabnHChou7PiN0BSvJVAhaCdNA79M62oWRiD8tSN4FS7k5NjDeRdXpDI\nXkO9\/BXyuBpc6W\/AbylDR8+7UKrtRMX3QLUdxrEjSkwfOg6hcA5i8RI4A3dRpT5Lfh+HUT05OrvD\n0NTkr30uwK+bxstRTFRkJ29ywT0BtFJpoOq8USV7HTVErRy2OwRN45AvfoqqroMoaipDIzmr63oZ\nqBIJUFMxi7FBcnWdrceHDybIHjyF5gtfoMfwEfQmCn3K7dAMM6FQBKO7IwQDfaH254JMifEMSo32\nstCWkxgCn8Vw2UyPWg1Nm8AtXw1ehi\/qqkNQuMsPrbkStLScR0PDDFo7pyAYP4Ph\/RehNz9Es4SD\na5f5uHtHhMPHlzE0+TkMlg8hEATZlaoISASemBreBqNqKw7oIr77dYO2PC3G21matRlTZIAw6PZA\np0hCSQbJOiEDwrwAzKQxMJqTRXLvPEyHvsTY7JfQWR7DOOvEzNGvIKoZRE1pHHIzOiCoMTgomcSy\n1xxvoRWc1IZhSruNHAZRUCoY1PcabGnbkyLcrXIew2HoiHHNgkYyRyrIdaG1LhSqvEhQg0fQrPsz\nmbAfo8v8CdonH6Fy5D4B\/AdaZGfBYenQ1XUdGvNHds1IaTrZc9xy3lpbL8WwGQcY6YM9W\/67e7gq\n9yU3XZ27eJKcDhLWr1FbuBXSUnL6NIeis3cerer3UdF9B5Kjn0KifwDdvk+gMX4E9eBtCCsXUFdj\nRb3kBDr670C199EPf+8WJf+SOyH3tl6ZjsAQ28M5m7o5nb6y9nZGOco5ClsFt9NWUdpkr+YNWpuk\nZ6jyEguVn5NpE1YLUMI2ol50AnXytyFX3oJg4iGI0+IfFDA3ZJVbM+vFoFPyAMqSH2xpbmJYO+Rb\n7fsmE56GbFbWC09tysj4FUVKrFJF2vhl0qASllEs4M\/bRXIbxMo7oIxkjy58ZVk4DeaqH3OpVBFW\ntTryP06KUvYY80n9XyBodQtifp4uyfsVpdrtbXv6dV5ziFtv73bxj6pQVsQLHvz4XwR18lY7\/ngy\nBSqWJ+pEvunt7aHM\/v6oHxeOXj0FL3rQpSh7maIbaKLMzzHREmUbHY1ZGd\/KPrV5+wuu\/aSP9fQY\ni9\/IXfXTWgHrX7bDsiWQ06WZAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/cornucopia_herbs-1321586256.swf",
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("cornucopia_herbs.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
