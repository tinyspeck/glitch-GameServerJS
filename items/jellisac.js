var label = "Jellisac Growth";
var version = "1351302267";
var name_single = "Jellisac Growth";
var name_plural = "Jellisac Growths";
var article = "a";
var description = "It's not something you particularly want to stick your hand into, but the Jellisac Clumps that result from a successful \"sac-delving\" are worth it. Even if they do make reaching in your bag an unpleasant experience.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["jellisac"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.blister = "1";	// defined by jellisac
	this.instanceProps.scoop_state = "5";	// defined by jellisac
}

var instancePropsDef = {
	blister : ["Which blister? 1-4"],
	scoop_state : ["1-5, 5 is when it can be harvested"],
};

var instancePropsChoices = {
	blister : [""],
	scoop_state : [""],
};

var verbs = {};

verbs.scoop = { // defined by jellisac
	"name"				: "scoop",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Scoop a clump of Jellisacs",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isUseable()){
			return {state: 'disabled', reason: "This Jellisac is not ready yet!"};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('jellisac_scooping');
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc['!jellisac_scooping'] = this.tsid;

		var success = pc.runSkillPackage('jellisac_scooping', this, {word_progress: config.word_progress_map['scoop'], overlay_id: 'jellisac_scoop', callback: 'onScoopingComplete', msg: msg});

		if (!success['ok']){
			delete pc['!jellisac_scooping'];
			return false;
		}

		return true;
	}
};

function buildState(){ // defined by jellisac
	var state = '';
	switch (intval(this.getInstanceProp('scoop_state'))){
		case 0:
			state = 'empty';
			break;
		case 1:
			state = 'empty';
			break;
		case 2:
			state = 'small';
			break;
		case 3:
			state = 'big';
			break;
		case 4:
			state = 'bigger';
			break;
		case 5:
			state = 'ready';
			break;
		default:
			state = 'empty';
			log.error(this+' has bad scoop state: '+this.getInstanceProp('scoop_state'));
	}

	return state;
}

function isUseable(){ // defined by jellisac
	return this.getInstanceProp('scoop_state') == 5 ? true : false;
}

function make_config(){ // defined by jellisac
	var blister = this.getInstanceProp('blister');
	if (!blister) blister = '1';

	return {
		blister: 'jellySack'+blister
	};
}

function onCreate(){ // defined by jellisac
	this.initInstanceProps();
	this.state = 1;
}

function onGrow(){ // defined by jellisac
	var scoop_state = intval(this.getInstanceProp('scoop_state'));
	if (scoop_state == 5) return;

	this.setInstanceProp('scoop_state', scoop_state+1);
	//this.broadcastState();
	if (scoop_state < 4) this.apiSetTimer('onGrow', 5 * 60 * 1000);
}

function onLoad(){ // defined by jellisac
	if (this.getContainerType() == 'street' && this.container.pols_is_pol() && this.container.getProp('is_home') && !this.mound){
		this.apiDelete();
	}
}

function onPropsChanged(){ // defined by jellisac
	this.broadcastConfig();
	this.broadcastState();
}

function onPrototypeChanged(){ // defined by jellisac
	this.onLoad();
}

function onScoopingComplete(pc, ret){ // defined by jellisac
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];
	var harvest_effects = [];

	var slugs = ret.slugs;
	self_effects.push({
		"type"	: "metabolic_dec",
		"which"	: "energy",
		"value"	: ret.values['energy_cost'] ? ret.values['energy_cost'] : 0
	});

	if (ret.values['mood_bonus']){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: ret.values['mood_bonus']
		});
	}

	if (ret.values['xp_bonus']){
		self_effects.push({
			"type"	: "xp_give",
			"value"	: ret.values['xp_bonus']
		});
	}

	var to_get = ret.details['bonus_amount'];

	var proto = apiFindItemPrototype('jellisac_clump');

	// bonus multiplier! Testing delayed create functionality: 
	if (ret.details['bonus_multiplier'] && ((is_chance(ret.details['bonus_chance']) && !ret.details['got_drop']) || pc.buffs_has('max_luck'))) {
		
		var bonus_items = to_get * (ret.details['bonus_multiplier'] - 1);
		
		harvest_effects.push({
			"type"	: "item_give",
			"which"	: (bonus_items > 1) ? proto.name_plural : proto.name_single,
			"value"	: bonus_items
		});

		var harvest_msg = "Super Harvest! " + this.buildSimpleVerbMessage(null, harvest_effects, they_effects);
		
		pc.createItemFromOffsetDelayed('jellisac_clump', bonus_items, {x: 0, y:-75}, false, 4000, harvest_msg, pc);
		pc.show_rainbow('rainbow_superharvest', 1000);

		pc.quests_inc_counter('super_harvest_jellisac', 1);
	}


	var remaining = pc.createItemFromSource('jellisac_clump', to_get, this);
	if (remaining != to_get){
		var got = to_get - remaining;

		self_effects.push({
			"type"	: "item_give",
			"which"	: (got > 1) ? proto.name_plural : proto.name_single,
			"value"	: got
		});
		
		if (!slugs.items) slugs.items = [];
		slugs.items.push({
			class_tsid	: 'jellisac_clump',
			label		: proto.label,
			count		: got
		});

		pc.announce_sound('SCOOPED_JELLISAC');
	}

	//this.sendResponse('scoop', pc, slugs);

	var pre_msg = this.buildVerbMessage(this.count, 'scoop', 'scooped', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	this.setInstanceProp('scoop_state', 1);
	//this.broadcastState();

	this.apiSetTimer('onGrow', 1000 * 60 * 5);

	if (this.mound){
		//log.info("Adding wear to mound "+this.mound);
		this.container.cultivation_add_img_rewards(pc, 2.0);
		if (!this.mound.addWear()){
			//log.info("Mound depleted "+this.mound);
			this.mound.onDepleted();
		}
	}

	delete pc['!jellisac_scooping'];
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Scooping this yields <a href=\"\/items\/700\/\" glitch=\"item|jellisac_clump\">Clumps of Jellisacs<\/a>."]);
	out.push([2, "Harvesting this is easier with <a href=\"\/skills\/90\/\" glitch=\"skill|jellisac_hands_1\">Jellisac Hands<\/a>."]);
	return out;
}

var tags = [
	"no_trade",
	"natural-resources"
];

var responses = {
	"scoop": [
		"Forsooth. I am slain.",
		"Verily, you have scooped my innards.",
		"And thusly I perish. Floop. Floop.",
		"Flobalobalob.",
		"Fie upon you. My innards are now outards.",
		"Begone, thou lily-livered jellisacker.",
		"Floop.",
		"Thou paunchy jelliscooping hedge-pig!",
		"Hark, the sound of scooping. Erk.",
		"Alas, I am scooped. The rest is silence.",
		"Hoist my precious jelly, will you? Eh?!? Oh you did.",
	],
	"scoop_drop": [
		"Verily! A thing!",
		"Forsooth, thou has dislodged this... whatever it is.",
		"Behold, young rapscallion! A gift!",
		"In sooth! Gifts beyond your wildest dreams!",
		"Methinks you scooped more than you bargained for.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-31,"w":15,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGd0lEQVR42t2Yu2\/bVhTGHUuiSYmS\nKIkiRVIPkqLeT8t2HKdBU6QI0sFF+gAaZGmA7EWWDtk0dC1goOjUJUCAzsnewWPHAN0Dr9485A+4\nPd8lqVCKktiyowIVcCCSujr3d7\/zuCQ3Nv6PH9fNZYcN48nQM0+222W216+ym9sOu7XjsoOxfTxo\nWMd9z5xi3NrhBnXzPsAmnQr7bOJDLRqAR02LEeTJwCvdXh+cZx0NGxabdCtLwZaBAnItcKTaFHDD\npm\/nAYSNWmU2aJjPPmm4e3XrEYeLAO6QipRvHAKhvjGyl9qYA1qM1D\/rU95ePZxjjRbhYKMPWSsY\nF\/xvEDGEvO9eIWi\/Yb5aBARERVdYShJYVpZYx9HnACfdMjeM3e74xzu9Cv8OIFmvXnp0JaEdNN4q\nEQVsVotsc\/Mai8U22ZYQZ65VmAGG45pVjXlVle0NqjMbU1sCYNctPbu8emgTAdxuz3ceAippicVj\nMSYk4ty2hASzNGUG2KAFiFsJJqckZpLaISAU5Qq6xtmlcw9wXdfgTlEMKAxMXq+oLB6PBWA+nLgl\nMEkUWD4rs55nsDaFPSWJLJNOMYWuwQcW+DbEBuva+v1L5J7xBM6SNGmvYfCdIgwzroWqQSUfbosl\nJZjIctkUB\/AqGjO0HB2b0SJ5C+jory4T3ikcNmoa+tisKuvl4hwcVAvBUkmRhxRWUrPvVPCg4RcQ\nLZ4gDdZxS6xl66tVNIXpaNE5JtQLmffA+WBpOckNobX0\/DuAoXqo6m5dZ21bP1lRQQObPlbIaqbK\nmjWdT4DiAGAIB9WicACLWodyeA6OlOsSIHplzytRrmqs6WijFVqMcQaHJuWQkpFZRk6RsxJX8G3O\nhXDJpXAwLM42C\/O5Vy\/x8KKQWgTo2ertVQC5wxxVYBaTEaBRVJhjqXPqvU+5bGBY4Fzl1v3c67g6\nV69lk4K2Or0wIFYJhwBKk0pJUsyranwytA+o9zE4mFbIzsF1Z3C+ek27SA19FUByFEJ26LtFDvEN\nQEvPvVe9GRylBQyFsgzOV6\/IAT0fsJZIbJw\/FzuO9qoTQDbISb2mcusFIQLEx+CQu25Z9cNKUKaW\npf9IFJVCENoitTGV6fn0Y1EUTmRZenFuQPQnrLZJfRAtxS7nOSDC0qOQYeKlgBE4GNSqlHKUwyKv\n\/vA\/tpUn3yoHzGWk3xAN\/P\/cgI6j1OAc2xoqNptJMTWfplVrXMURbVuTofNBQDRrqK2k\/SqHn0ww\nJoSrV\/JvaLp9AjzLppMX64mUI8c1M8cLInRc4y3DYLdvttnh3TEr5NJLAfNKmlWNPF9QXvF\/1wpp\nGi\/T9RyH86oFVsgnf6GpMhetkSnlxBT9yS0XSDmZqQQCRaDq9W26i95vskHL5LlUUNJzOViiwnj4\n7QH1Nz93q7RIq6TwYy9QDnAVI\/sXzXW4ykYykuXUEQ4atnrsJzNVHBlyEHDb9EDkV6POK3zUq7EW\n3RQAsE9PfA+\/O6BzfVZcoXkLcJubmz\/z3SglrbYnO5YywoqbQUuAAZCDkXp0x83Pv\/y8x3784Raz\nK0W2Rwrf\/aLPxrSIOUACg1UN5Z9Auce0K70OUuRMFMXaKow1t1L4vRGEBsm9P3FnsG2qdADCAHV9\npz47h\/Xb5hygW8nT7iQ+DQAPJVE8DfNbkeWLb3nx2LXjRCL+a5VCgtAAcjKkcLoaC6Fv7M5Dwb66\nM+SFdJ0Ww5WjcYCLqAc7SArCfaiXycjTlUKciMePqT28EYT4U0vPvMRkI7qn6zVKPJdg\/ZY5A\/v+\ncI+H+sE3+1xRKOhGAIt5ntuAu4f1X\/q5RNyKH6OJIgxyUnqJCdqU\/EOCxIShjen+DmrtR0KMc4wN\nxzjl\/BshFnsQABau5LFTFIRp2P2pQk\/h3ChmjnYozFFAAO+OHdoWVX7caxocskNKh2OCnge45pU+\nvJNyL9LpZPiA8zwWiz0e9St\/1yzldTg5Qgn1FlUFNFQ0tcyfAdydT\/2aBnccX4971ZeYECG3LeUU\nEFAsChgqi+uRwiiv411SuVouPKXn3Z\/CidE6AIIqhaGgoBop\/frGnnd6pYVxzs+dTtv8I6LM4d7E\njbaQ2bUWPYAF5911vsssB2F2gonvLcLBoJ4kCWHlSusEjEMZu1zYj1zTgyKYAwyb8tpfB9Md8l26\ndbq1CB65fcpEwt7c+A8++scm3h05z9dZvRtL1PrgjrCz417q1e+\/f4zeG2jAh2UAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1296147206-6335.swf",
	admin_props	: true,
	obey_physics	: false,
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
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"c"	: "scoop"
};
itemDef.keys_in_pack = {};

log.info("jellisac.js LOADED");

// generated ok 2012-10-26 18:44:27 by lizg
