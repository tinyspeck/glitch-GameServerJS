//#include include/takeable.js

var label = "Street Creator Wood Trophy";
var version = "1340228514";
var name_single = "Street Creator Wood Trophy";
var name_plural = "Street Creator Wood Trophies";
var article = "a";
var description = "The holder of this trophy hard-earned each of its five fragments through assiduous street-creation activity. Hopefully it won't give splinters.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_street_creator_wood", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by trophy_base
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
		'position': {"x":-35,"y":-68,"w":70,"h":68},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJP0lEQVR42s1YaWwT6RnOQUIgie34\nju3EHp\/xER9x4iSOncl9mBwkgRwQMBAIICAhhKOcw7VhT8IWtAub0kBhRdnuNuXocomGVou66lZ1\n1dJf\/WGpUldVVWlWrdS\/T99JSJdbbMuRkV7NeObzfM\/3fu\/zvO87CQkv8Hi30xlNmK3Hjhqj+FC7\nA21u2ewE2ZwvZxtdMnh06bw9O00\/6wDmadOizpx0OHLmx2elB7dUMp4d9UbeqUufnJUA9y2wRke7\nXPySgHrcN9u22KdLY4NmcbwxXwY6Tzi16Z5ZA67dJ9H3BNTRNq8iup7N4U8udcVP9rom32qzxXbU\nMa8fqMDYBmLvrgWW2MF2B7+v2YxGtxz95TrUO2StTT7l6wfpNWTwtU4pVpRpUGnPigtspjMGak2o\ntmdNvHJAuxpNE+8syuMekhmKw65CVXxVUBOnM9\/P5qKKQBqzEsSvHOCGitzRzdV6\/u2OPBxb6h3f\nEzFzA1W5XCcBKzBkxAJGEZ+vT58kTWx9bdtaZZeONuTLQcQAAUZ7gRIEDAt9SiwvzR58dHzELtH7\nX7U3BYKUmsWxUpM47smlLKKbj3oizOGFNnCttvhYX9Hkez3eyWWhnMl6hzT22rwZsafp62yieMCY\niSLy4soyLaJBDTr8KjSQNhJheCFGXwmYsFnCvrHQyj16P8Ske3ZHzDFr9jyUWSVwkjftmnkxu27e\n4CsV7iKDaJAIEj\/a444dbrePdgc0XItXzjW55VyXX8mvo5h0adMmbYq5g69HmMkjzR4F1pIQD1Qb\nsL5CjzVhHboL1Sim7V0R1IIEe\/xoV37rSJuZ3dloYOk52+aTvFwvNjklni7KCoKueXPTR0sp3goM\nmah1SOHXZwjgYnuaTPHt9QwfcUjH9zbnYecCC9aX56DDp+ArTZkvV3JMstTWCGWLtaw+NlBlGCXN\ni62m6+5ANnoDGv7dThd\/osdJDLZOsTVMgOrskolyi2ickaR4HpSbl1g1y\/hFpHPRkmxsJO3bUstg\ne70RuyMm7G40YqAyF7ubLKSD2tHhWsPgpkod21+mjS4vUXOdBUquySWbqLFJXp4nK6yZ0RqrmG8h\n6ej0K8lzaiwrzp4C3OqWxmttEn6ghkFXkYpAamiMCsKCGp0y1NopFAyZvE+X8eLkhohgWUkB\/mBF\nUmJIjwYNGVyVVTwRpjikbUSIyZgMaFM8YbMYIbMIDRQKQoXTTFVNHeVj6lPgJPkxyVL+21D1+\/0p\ntdTHLC5Ss8tK1exif9bzZ5kaY5b4\/P5o7ObxzTi6KozlQc09s3wOm69KfWh7hMrZT6yeSWFt5C2r\nai5symlzaeaBkaVOmUGaEmMkCVPxV+E2DAYMmdF6WsjxoTZc\/\/4gzgw3jz8T1KWhytb3Ftsn+2kl\nlAmix1cU49dvL8WJHhf6wzkoNohiHR75M\/uNbREzAowIBskc1iBN5YyyVJ6RpsYI3KBwb6ayoTiM\nF+ozeUp\/2FbH4KdDFfh0ax2GI4xeaFu31xknTvY6PQ\/0E6boQJUelRYx6vIk0VXlOS1biQAEGHsX\nmLGICoEah+zmqVWBmN\/45IQveH2owYRyyiLa+6wVPPZouSWowTv9DVwRI6FFZ2BNSIc3220Yabf9\nW3AOhcREE8X49xqMONzOTDO+xS0fDZtE6KKgXhvSxoWXdBVrYn2kYT1EgggJ85KAEqfXs38KMk9u\niGrzJOyGaiNq8rKgo3B4mpeN5E1iP9\/slX9N\/QsE0V8R0vF94ZwRItmgoJurSOzbvQosL9Z8G1Kk\nceNC6bSjwYCVYfnUBCc3hjwfbQqzbX5ttMImw9Ii9VO3uNKcwfaxeghE0UmfnuYEr0YcMhSTuO9d\nnM8K7z\/V75\/y8qqQktvfYpra9h6\/4vEvFN1+5fhaVj05XJX9mJeObWgRtpp\/Wk1XashgOwMa2rZM\n8mAq9zSAAtnKTWIM1xsfawVWlsrZzdW5fIVV8t0\/n\/xsZ1NspM2GiOPJQiu0niHKxT7qR3JkqU9l\npEWeMkptAa4c6n1xxcTXf\/v74FjUHT9CADcsrp+89cuvuCs37nIXJ25z5y7e4MbO\/ZxbvmTpuJ\/A\nWVVpcNly48fHPuOOj01wH45foefXuNMf3+De\/\/ACZ5Gn8n1UL57Zv2n8yi\/++P8VEADE3\/zzX+O\/\nj8WwmtjWS4RZ2lKDW3e+wuXrX4AAggBi7NxVbN6yCwVOEyy5SuQ7nejo7sObx87igx9exkc\/+hwE\nECdO\/ZjEOhX1JN4bIz5cuf0H\/uav\/vy\/ZZZPbv1W\/Je\/\/iN298vf4YNTZ3Dg4BEc2H8YY6c\/xrXb\nv8Gla3fxk0t3cOGz2zhLIE+f\/5yAXMXJM5dx6uwVjNE1eZaAXceZC7dozG18cukLvH\/8B9izdwTb\nd+zH7gPHcP7TO7g6ee+7x1y0ZWFs96bNeNT2Dgxh3+AQuM1bcGBoCw4ODePQ8DAObx3GyNatOLJt\nK0bI3qDrw3T\/0JbhqXHDa9ZhU3Q1NixfjfXLVmNdb99DVmmzPXcRkeiYm9Dgm5eIGfPPT0QgIxFB\nUSLCkkRUSJNQLU9CrTIJDaokRNRJWJCdjCZNMpq1ZJrpa+FeIz2ro3E1iiRUypJQnpWEMnEiSjIT\nUZj+7RzetITn+iqWsj5c7K5TZ92b+aPwEuFlofvAhInqVdOAWnXJaM9NRqchGT3GOeg1z8Eyy\/R5\niWkOupk5WKRPRlvONHABrLCoqvtAg+LphRfMn55rIOB+5lbP06ck+Prclm8iWhmacuToztOh06rF\nYks2FlnU6DCr0G5SoM0ox0JGhlZGilZDFloMEjIxWvT3zTBjEnpOxmShTp2OcFYqyqVzydLAyuaj\nQp6OKkUmqpUi1Kol6DBqUJ8tHX0SuDQyqVUhvehQZGHGXEoqldRSFBDgwhwFAnolSg1KlBlVlDHU\nYAl4pU2D6jwNauxaKv+1qHPopky4Fu5V0bNKqwblNDZkUiPIqFBC7ynKVcCvk8OrkcGtksL5wLx6\nuXwB4UmdAZdMlikSicwmhsGMWUwm2CwW2G02OO32Kenw5OfD6\/GgwOdDod+PQFERSoqLESwtRVlZ\nGUKhEMLhMMJ0DtHvYDCI0pISFAcCKCoshJ\/+4\/N64XG74Xa54HI44MjLQ57VCqvZDLPRODU3o9d\/\nSZhkZOkJs\/34D8Xb8GSbyD6WAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294352620-2517.swf",
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

log.info("trophy_street_creator_wood.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
