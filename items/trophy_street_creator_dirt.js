//#include include/takeable.js

var label = "Street Creator Dirt Trophy";
var version = "1340228514";
var name_single = "Street Creator Dirt Trophy";
var name_plural = "Street Creator Dirt Trophies";
var article = "a";
var description = "This Trophy, artfully depicting a master of dirt, marks a street-building career so great that the holder collected… well, all five parts of this trophy.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_street_creator_dirt", "trophy_base", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAITUlEQVR42s1YaU+b2RX2Ahl22xgD\nxvuKzeKFxWG32YxtFkMgGAjBgIctMZCwOUCMAwyETFhSjWaaWSqkaVM1H6ZoFKn90EpWP7RqpaqW\nqn6t+An0Hzy99zVkkkwmmTbSxK\/0yO+93OXhOefcc+7LYiXYszesMm\/7NdFWC3+elYjP\/oQ2Ou0W\nw9+ci\/UhsSKhyB1O6v27o2rcaI8TrC\/NsCcMuc8n1bxPg8bT1X4ZNgbl6LBlnyaUej+fMx7tjWsQ\nGVJgvqsANn26P2HIPZ4r8h5M6hjl7vrkcJcLThInKAIqxcOA9izYUYA7fVK0VwrOytUsXsL43Y5f\nFaNBMe3OR3uF4IyY1pww6pGIPaHkKJot\/LOE8rujaf1xqE+GybZ8NJp4iaXcBTmqXH1xVmKR27qm\nPN4aVuKWV4IWCz9mVaUkTrbYHlZGtq+rsEzUc1r5sYSJVvp8MWuw3ydp7CO\/Bu4yQWKRi+dZXWyl\nV4qBBtHpeyW3t7fHe\/jwILK7u2s\/b5sPtmaP1we16KkWolL7nguAg4Oj443IJsIb93Bvcxsf7dzH\n8sod3Az0o8mUdfR+09b+vmLvwUPcWV3H4tIybgRnEbm3iVu3FxAYu4737ndUvci9LayEVnF7YZGQ\nXEHozhqmpmcwOTWNtbW7sXB46\/2decScZ3fD9xiCS8srWFvfYJT0j40zKtL31bUwHjx4GPnJyT3Y\n3\/dTv6MEl5ZDWL8bIQTDuHEziNm5eYYcNT39+4eBSUxMTPy0wbKzez9GN6eqUWL0fWFxCfNEOaom\nVZWSDoXW4GrzvHu1HHZX2t3SDHs56+2OfXBwYN7a3mFIXYASfVU5qrDX24P6+sbn6llTWIqZaq2d\n7rfusb497Q1bJebtvurT+wN18JcK4TOK5i2XWN43Ru\/h4Xx4Y\/MFcmEmQC5MTfvo0TM6GoDD0cyU\nVNZklpnCLkqJTtdocDDqRKil8O2V9IA27XTdIcOC6RJGdB+gS5mGOh47Vspn\/aDPEKc\/Wl4JMUpR\ncpQYbVMVL5RbWFxGa7Pz+GKOOZMddcvSTxvzUuCVJmOqKBW7TjkmLZmHbyTYTwiOaZMwWZiMqzIu\nGoVJuKLOOOmUJB29IXqj1JTx6A09N+mL5FxOz\/GLc9rkvFOnLPPYmsqGK5eD6+okTBmSMVnGf32E\ntwhYvB4py+7ITYkMFfHOfPoMdKvT0a7mnQ0UC6ItYm70e37qk5jXffLThYkextcogrNzDKHVtbuE\nYARTUzPwNle8FBRGPkthF6fG\/JV5cKuy4JKloU+bjpESXswh5Po7clkvn5VO0kEUO50yJqM1nxt9\nHKwzr3QYIgsufaQynR1rlaShnM99qRx\/HNSb98bUpx8HtNgYKcb8cAPGvWVYHDAh2GdGt6sBS4Mm\nBDw6OEqz0GXLfkmZ8izOcVNBGjzKzBO6186QZb5Fmem1C6maXOJiyd9ZrCGHc9Qh5Z40iLjfuxPs\njXbNu\/K5qH2BIP1+8mhGf0aviURBpvgMD8gx21nAXB1pm1Yuk658XG\/MRXdVNtrK+Ai05j3\/3mJJ\nY594JMkY02aIXlW3KZcT6VEkRZ2vKvm65x\/PvjEHSz9Aj4QTe05wTBOlVTEtPlf75ZjrIs7tkuDD\nNiludlDIEHBKMNMuIe9yjLaI6XUSngoBhpr4Cnq02AUchFqLYu98HgZULMUtSyoTMF8+enT0zdef\nHdFL9o5fjTVCbouQpCqu9cuIglJGSdpe7pVj6Qoh7pYS4hJ02rJhL8nC1RZD1OdoOmkiphw3przb\ngQ2AtxPoi\/bLk9BBzPH0V0\/whz\/+CRtz\/Rh3KYlKYow7C0gJr8D2iAozngJiWhmoulTJ0RZi4qZ8\nxsTUD7udVSSIFnDN2YzaLDa6JVwsdjj+v89sv3n2N\/Pf\/\/nv0ydPfoul2yEM+67BN+DH5Mwifvn0\nd\/j293\/B51\/9Gj87PMTB5gI2bo8iFBxB+PY4Vuf8DG5NDWN1MYhNUnI92P8MX379DE+\/\/TM++eQX\nCE7PYrB\/EIMDo4jsfHr8PxN0m0rOrjfZ8SpGmu1EGTvGWu1EPQdR0YGJNgJXI\/HDRky546DvEy4H\nMW98DB1P5\/mb42u8um6bUf2jlWSXXGL56AF6gYp0Ni5nslHLY6OBOHcj8Z8WEQdteRx48jnoKOCi\nk5jLK\/0OXaTdSfrbxVy4yBgnOYybczhwZHNQx2ejmpjYlsFGWVp8D0sq60cFTPJM\/WVTgzD9Xxfk\nyDnILEYXpYtTYq68OKluQqRXwYVPxcWQJomkxiT49XEMk2w0SLLDVSUXPbI4YY84TrSJEKX\/aA0v\nTrL8nORIseaNnz5SFcksa8Ck+49HIkSHLAcDBin69RL06cTkpM9HrzYPVzQikmFy0K0SwqvKhlcp\nIPmajy4Fj0Hn+S8D2k9AxzBjyRw6t0ctIuvkkvXymbXpHh6pEL3qArSJs1+bUlMIsss1yqd1hRpQ\n1Bs0sBu1aCzWorlEh1aTDm1mPdxWPdrLCtFZYYC30oAemwG9VUZcrTaiv6YIPgL6e5Wgj\/RfuWxk\nxnjJeLdZi1p1HqqVubDJRaiQiWAtEMKcn42SXAGKRHEocnLaCZ9LF+Q4BJlZWVlajUqFC+g0GhTq\ndDAWFqLYaERpcTHMJhOsFgvKy8pQWVEBm82Gqqoq1NTUoK6ujtR59WhoaGBQT9q1tbWorq5G1eXL\nsFVWoqK8HGVWKyxmM0ylpSgpKkKRwQCDXg+9VgutWs3srVIo\/ko4CQnSnwfGOWOqZBolzIoXqgKC\nHIJcAjGBhEBGoCRQE2gJCmmGIigmKKWVFIGJoISgiMBAoCPQnM+TE0jP18sjoKku6Yf87r9bAiAW\nM\/MrwQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294352451-7916.swf",
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

log.info("trophy_street_creator_dirt.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
