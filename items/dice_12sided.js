//#include include/takeable.js

var label = "12-sided Die";
var version = "1353443789";
var name_single = "12-sided Die";
var name_plural = "12-sided Dice";
var article = "a";
var description = "This die has 12 sides. One for every Giant, plus a mystery guest.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1100;
var input_for = [];
var parent_classes = ["dice_12sided", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.rook_attack = { // defined by dice_12sided
	"name"				: "rook_attack",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 11,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god && config.is_dev) {
			return {state: 'enabled'};
		} else {
			return {state: null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		var rsp = {
			type: 'pc_overlay',
			uid: pc.tsid+'-12_sided_die',
			swf_url: overlay_key_to_url('twelve_sided_die'),
			state: 'spin',
			duration: 6000,
			locking: false,
			dismissible: false,
			bubble: false,
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -120,
			width: 56,
			height: 56
		};

		pc.location.apiSendAnnouncement(rsp);

		this.apiSetTimer('onDiceRollLand', 2000);
		this.apiSetTimer('onDiceRollComplete', 6000);

		this['!is_rolling'] = true;
		this['!admin_rook'] = true;
		return failed ? false : true;
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.roll = { // defined by dice_12sided
	"name"				: "roll",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "But there are only 11 gia...",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this['!is_rolling']) return {state:'disabled', reason: "Already rollin'"};

		if (pc.metabolics_get_mood() < 50) return {state:'disabled', reason: "You need more mood to do that"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		var rsp = {
			type: 'pc_overlay',
			uid: pc.tsid+'-12_sided_die',
			swf_url: overlay_key_to_url('twelve_sided_die'),
			state: 'spin',
			duration: 6000,
			locking: false,
			dismissible: false,
			bubble: false,
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -120,
			width: 56,
			height: 56
		};

		pc.location.apiSendAnnouncement(rsp);

		this.apiSetTimer('onDiceRollLand', 2000);
		this.apiSetTimer('onDiceRollComplete', 6000);

		this['!is_rolling'] = true;
		return failed ? false : true;
	}
};

function onDiceRollComplete(){ // defined by dice_12sided
	delete this['!is_rolling'];
}

function onDiceRollLand(){ // defined by dice_12sided
	var pc = this.getContainer();
	if (!pc) return;

	var choices = utils.copy_hash(config.giants);
	choices.push('rook');

	if(this['!admin_rook']) {
		var giant = 'rook';
	} else {
		var giant = choose_one(choices);
	}

	if (giant != 'rook'){
		pc.location.sendActivity('rolled "'+capitalize(giant)+'"', pc);
	}
	else{
		pc.feats_increment('tottlys_toys', 3);
		pc.achievements_increment_daily('rook', 'summoned');
		pc.location.sendActivity('rolled a Rook! RUNNNN!!!!!', pc);

		var mood = pc.metabolics_lose_mood(50);
		if (mood) pc.sendActivity("You lose "+mood+" mood for attracting the rook.");

		if ((is_chance(0.15) || this['!admin_rook']) && pc.location.isRookable() && !pc.location.isRooked()){
			log.info("Die "+this+" rooking location "+pc.location);
			pc.location.startRookAttack();
			pc.location.setRookedStatus({rooked: true, epicentre: false})
			pc.location.rookWingBeat();

			pc.location.apiSetTimer('rookClear', 60 * 1000);
		}
	}
	pc.location.apiSendMsg({type: 'overlay_state', uid: pc.tsid+'-12_sided_die', state: 'roll_'+giant});

	if (this['!admin_rook']) {
		delete this['!admin_rook'];
	}
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
		'position': {"x":-35,"y":-73,"w":70,"h":71},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKQ0lEQVR42s2YeVdTZx7H+w76EvoS\n\/GPOmS4zLdRRqgKyJiEESJAAYQkQEsIaQjYMCUkg7KiExQUVCSCIqKhUwY1VoGitYhfEjiO09sz8\n137neR4mNwkEtWp7Jud8z81zk\/vcT377zXvvveNXTu1KRKZtWZusmxSnmSfff+\/\/4ZXt\/HGHvOaJ\nQ16zsk6OyHF8i+SKKSZJxaQ7WTcd8adDpbWsvZ9du6rNrllZplC+Kj20wgF6QafWiVwpxukP\/mCo\nJ7nZNU\/cvkAZ1mWkGO5ya61rlQNLKruJ\/enHsUvk5PRpjOnKJ+Hl786qWfVPPvB1oa8SS8cRkWxD\nlMzFnSs7\/J3XeuUTcJ+fwr1vVjD71Xe4MXkPpwauIz6zFhEZJ2dorL4DuK1g1GoxmV0oN7cjVmpl\nlvF8Zuj8zs+9qto5JKlOIkZqh6FpFAWGo6iqd2N3nAkJxdeo+11v7tKalZnNcNSdexKscA9eRU5p\nC3hpdsTkuNlnirpVVB79fksM5tcsoNR+DoJ8N6IJKIXMr+iAQDmy8Z03saRYc8v9hbgZWdo+Lsbo\nUaJoxfziAyx8dR952k7IDt7h4K0966hoe7QFkCqzag4y0wTUVf3YI25Ac+cFLyCDnA56bbjdojqX\nOK8JNYfO4edf\/oOrE4tILRsCT1aPfz5bw7nRSWTr+lHQ8IiB5RHLtY78AtupFdT1PUWefSEgJFWu\nbQHR2aeRVdKGvcmHES13s2QiJWnmtWpnMN+qNda6UVR5goluRAF\/WH2OgQuT0NgHUdq8iIKmpwyu\nouMZDo2sQ1V3D5mW+8iyLsHU9RiGjkeQaCcDQmZU3sHNmWXcmf0G1c1nEZViY6AkHh0vhZM7V4Nk\nVQ\/AJ5byQFJLinMbYajpRf\/VByghdc5jNYf7Jxw8+hgZB+eRYV7iJKtcRJ5tHtbux8g0zwaEFCj6\n2L5XxhfQd\/42QoSV7PwB\/fSOl3SEjYxNr7yLeFU\/olKdqDk8jO7+CVjaJ6Hves7gilp\/RMvwz1A5\nF5BqmkP6wYWASjPNwNjxAOr6RWLNO36AacZZ5JjH8LcILRytQ8gsPuLpPjPbZeyWrlDu+hdKmhah\ndlzmLGfuXkNN7wqk+tsEYO6VkhqmobDPoOLIfQI17QdJY0\/feBXdfeMslHw6j9bfegHKyWZRlzYM\n\/gRlzRyxxm1y45nfJ\/0tlDXPk5Iz7x+P5jk42sbwOd\/id55ztfHoc8er4GgiON1PSZmYRIpue8Vm\ndENn7UFS8VUkFl1GprqDHT2fS8pvQm4hoC2LSNH7xKT2FulKX3JrseY6hKrhDVcTn18pqLsPXfsP\nxH3PSOC\/YK6lRZfKcuo5NK1LxB3jbKPNEpddR7amF2W14+CTgu1s7ke0xAlpbgsOZNdDmD+EeOUw\n931J+Q3SAr+Eum6aJNCGyw\/opkhiEbiyS4iUtWGnwMr0P8Aph39BnYe+41vUDzyDa\/QnpOpvEIgJ\nSDQ3tlWUtAPHT49h4tYiHjz8nh2pVn9cY+crbT0QqS74XROvHoXMeA0K221IivuwJ6mOA9sMqN2u\nqLacXyObXSfWCyyh6jwGRr\/GFKln3688w9r6C8QmOxGWUI+EdCc7ryo\/Bl52z9Zr1ZcgUo8wuM1g\nAQFp2xGqL\/u1n\/LDD0mzn0ViyZif+kfmcf7SDK7dWMKvv\/76Sv384t8QK0\/67SFQnofMMIbQ5MaX\nA9KJl8KEJh6Eo7Ebqfl1UFmuchlmOb6M+MLLEBVdYeLl9OEFaX+\/\/fYbp9Wna37nHjxcxcjoLGbn\nlzkpdb3cHnS\/2NyzkOlHt4XzBQyiYw8tmHR0amo7gwxSNOk5Cul0r0JSNkZi5tKGCkaQrj4KlaaT\nU0i0Ea0dlwnIYyZDtRvx+f0Q5pxAcs4hJOV1kcy+yO1BrRenHERiQQ8HQ8tMMM8cGDAy8xTkJc3M\nemHEkoryw9A7zjDAkuavSe2bRpxqhFORqQ\/xshbEZJ1GVPoxOJqGySDRDqH8GCLE9ZAXd3m\/n+GC\n6+QNv+tj8wYhKb2AfZIGBhIUW4mQOD0+izFhJ9+Iz8gP5gDpBEEreniSGaqKNvw9So+IlDpmUWnF\ndZL+s7CceAR+Pp3nzpHhsx+d3WMQ5vWydUnVEBRlx9l7qlhSaqzOAUSmdbE1L28A1fVD3JqvGCLz\nYz+k5SOcpQSyGuwT6fF5rG7jyK\/yAjIrEkvRqZiO4nTSVWjbiRtbmSvoZ5YTj0nBvQieYhCXrt2H\nUNbK3sfIe9F7lhTZ\/FNs7dEB5THYmy9y67jMdlLA+9j72NwB8Am0kFzjca1S40SWqgq8FCMixQbO\n1RwgbdCphlvYI7IgUV4Plb6LDZS0XlFAZe0iciw3EZ\/bDZO9j9S0AXKjfgiI+yigZ+3Rfmk7Go+M\nsB9A19EkFIoNJ4nVe9hYJVKfw14SChQiPKkSURIjQonl8kuqERxTwVxNwX0Br1AQ+gSms\/cQK93F\ncfd1DjBFPw29awkJhcNIKhwgN+llKiA1TqpwcWtfqSq6EZNxjFsL804jqaCPDKu9SFCf5dwbkdZC\njmZEpthRVG6DQGpi4bXJghvdhMbiTkEVBi9OsQmDFlNPTdS03iMZPIyorB5OYgLLk5\/2O+dRvLKP\nFOGhLecpLJ9kt2+2hic7oCTWOyA3IyHjIHExtaB13RuDJJM9INQFdPShE7Tj6JLPqD4HuXmc3YRm\n\/ZvpNCkvA6St1XNwIUILirV2hAh0zHq8zCaS3U4ECyy5fiOXb0\/eGWfD\/YdPcGn8IQdIpw9Ny13m\norcD9La2fQlmGM21DNBiq8MugQmCnE4afwGGVlJuSCwuezJ66u4j0FeaboKDLKybg6jg3FsBRpPn\naQpHMzUswcAShB7DUxpI4mwMDJ8LbIHHfo+rKeDYzSVMkxbl6vU+oWVVTSPDNMbCgFqSKorpzIay\nznCxFkkylwJtaAOQl9uLLxK9U0uC6gRJni4yTLR7Y5JnffmDE3W1SD3MsitS2oCQpEYOUOmYIe2p\nG3G5nRAQ8XM6SJK0IzbbRbpKG7EOUcYRRMkOIzL9ENmjFftTWxEubUFYSjM5HiLx1bRt76Wu3cUz\nv\/rRk9ZFFnc672NjtmWKtLVmfBxW\/FbaK2nEblFtYMDtXLv5RZ8HfOfCVOO7gfMoNOXIFrhgfvXv\n+\/vDMyfScTxBdWbLTfYnarGLV46gKA0iEiuYPgkv89PH4aXYG6fBZ5Elftd+sr8MIYkNrx93L3O1\nQHEmoBWCo7WsPdGqv1m0XYlklSjT2aDWVENnspNeaybXeUE\/jTbgH0I7mV4s7jf++y0q++yOj0KL\nXGTD9S2AsXp8kVBNrKHhFJZcSybkWlY6qNIVVay\/0h+yO96CPYnVfnuQsWr9tZLidV4fhRaLyabu\nwHFVgt38DYvSbkC7wp4kB6lt9Qg7UIcQkdX73dDimQ\/DCnP\/Gla44w\/7O3gzbFCMkYladJ+4FnsJ\nXHCsgX1GPLBMvfDhvsI\/\/8\/0v+wqfJ\/eeHMYfBRWdIVI+3F4cdDb7P9f3VUTMsUCh3YAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/dice_12sided-1353441941.swf",
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
	"o"	: "roll",
	"k"	: "rook_attack"
};

log.info("dice_12sided.js LOADED");

// generated ok 2012-11-20 12:36:29 by mygrant
