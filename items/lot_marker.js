//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Lot marker";
var version = "1345131574";
var name_single = "Lot marker";
var name_plural = "Lot markers";
var article = "a";
var description = "Used to mark lots in the game; will be used to offer jobs in the future";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["lot_marker", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pol_chassis = "";	// defined by lot_marker
	this.instanceProps.house_number = "50";	// defined by lot_marker
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pol_chassis : ["Which POL this lot can be developed into"],
	house_number : ["Between 1 and 99"],
};

var instancePropsChoices = {
	ai_debug : [""],
	pol_chassis : [""],
	house_number : [""],
};

var verbs = {};

verbs.debug = { // defined by npc
	"name"				: "debug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.debugging === undefined || this.debugging == false) {
			return "ADMIN ONLY: Turn on debug displays for this NPC.";
		}
		else {
			return "ADMIN ONLY: Turn off debug displays for this NPC.";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) { return {state:'enabled'} };

		// Do not show this for non-devs:
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		 
		if (this.debugging === undefined) {
			this.debugging = true;
		}
		else {
			this.debugging = !(this.debugging);
		}

		this.target_pc = pc;

		if (this.debugging) {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'are debugging', failed, self_msgs, self_effects, they_effects);	
		}
		else {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'stopped debugging', failed, self_msgs, self_effects, they_effects);	
		}

		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give_cubimal = { // defined by npc
	"name"				: "Give a cubimal to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return 'Give '+this.label+' a cubimal likeness';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var cubimal = this.hasCubimal();

		if (!cubimal) return {state: null};

		if (pc.getQuestStatus('mini_me_mini_you') != 'todo') return {state: null};

		if (pc.counters_get_label_count('npcs_given_cubimals', cubimal)) return {state:'disabled', reason: "You already gave away a "+this.label+" cubimal"}

		if (!pc.findFirst(cubimal)) return {state:'disabled', reason: "You don't have a cubimal of "+this.label};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var cubimal = this.hasCubimal();
		var stack = null;

		if (!cubimal){
			failed = 1;
		} else {
			stack = pc.findFirst(cubimal);
		}

		var responses = [
		'Pour moi? How kind of you! I feel all fluttery inside!',
		'Oh yes, this is very handsome. Thank you so much!',
		'A passable likeness. Always nice to know that someone is thinking of little old me!',
		'Well what have we here? It\'s a bit... square. But it captures the essence, doesn\'t it?',
		'Cubimals are my favorite! And this one is my favoritest favorite!',
		'I shall carry it with me always, and cherish the memory of your kindness'
		];


		if (stack){
			var item = pc.removeItemStack(stack.path);
			item.apiDelete();
			this.sendBubble(choose_one(responses), 10000, pc);
			pc.counters_increment('npcs_given_cubimals', cubimal);
			pc.quests_inc_counter('npcs_given_cubimals', 1);
		} else {
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'Give a cubimal to', 'Gave a cubimal to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function get_pol_info(){ // defined by lot_marker
	return {
		x: this.x,
		y: this.y,
		chassis: this.instanceProps.pol_chassis,
		num: this.instanceProps.house_number,
	};
}

function make_config(){ // defined by lot_marker
	var door_uid = this.instanceProps.pol_chassis;
	var door_info = utils.get_pol_config(door_uid);

	if (!door_info || !door_info.asset_name) return {};

	var out = {};
	out.preview_deco = true;
	out.pol_chassis = door_uid;
	out.deco = door_info.asset_name;
	out.deco_w = door_info.asset_w;
	out.deco_h = door_info.asset_h;
	return out;
}

function onContainerChanged(oldContainer, newContainer){ // defined by lot_marker
	// we only set the number based on the position when
	// we're first placed. our container never changes because
	// we're not takeable.

	// when we copy a marker to an instance of a template,
	// the house_number will get reset. however, we'll then
	// immediately wipe back over it with setAllInstanceProps()
	// so it will maintain the correct (manual) numbering
	// used in the template street.

	if (newContainer.geo){
		var l = newContainer.geo.l;
		var r = newContainer.geo.r;
		var pos = (this.x-l) / (r-l);
		var per = Math.round(100 * pos);
		if (per < 1) per = 1;
		if (per > 99) per = 99;

		this.setInstanceProp('house_number', per);
	}
}

function onCreate(){ // defined by lot_marker
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);
}

function onLoad(){ // defined by lot_marker
	this.apiSetPlayersCollisions(false);
}

function onPropsChanged(){ // defined by lot_marker
	this.broadcastConfig();
}

function onPrototypeChanged(){ // defined by lot_marker
	this.apiSetPlayersCollisions(false);
}

function checkWaiting(){ // defined by npc
	if (!this.isWaiting) return;
	if (!this.container) this.apiSetTimer('checkWaiting', 1000);

	//
	// remove any keys we can, because user has logged off, or is far away
	//

	if (this.waitingFor.__iterator__ == null) delete this.waitingFor.__iterator__;
	for (var i in this.waitingFor){
		if (!this.container.activePlayers) continue;

		var pc = this.container.activePlayers[i];
		if (pc){
			if (this.distanceFromPlayer(pc) > config.verb_radius){
				delete this.waitingFor[i];
			}
		}else{
			delete this.waitingFor[i];
		}
	}


	//
	// done waiting?
	//

	if (!num_keys(this.waitingFor)){
		this.isWaiting = 0;
		if (this.onWaitEnd) this.onWaitEnd();
	}else{
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function clearMovementLimits(){ // defined by npc
	delete this.move_limits;
}

function fullStop(){ // defined by npc
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
}

function hasCubimal(){ // defined by npc
	var cubimal_map = {
		hell_bartender:					'npc_cubimal_hellbartender',
		npc_batterfly:					'npc_cubimal_batterfly',
		npc_bureaucrat:				'npc_cubimal_bureaucrat',
		npc_butterfly:					'npc_cubimal_butterfly',
		npc_cactus:					'npc_cubimal_cactus',
		npc_cooking_vendor:			'npc_cubimal_mealvendor',
		npc_crab:						'npc_cubimal_crab',
		npc_crafty_bot:					'npc_cubimal_craftybot',
		npc_deimaginator:				'npc_cubimal_deimaginator',
		npc_firefly:					'npc_cubimal_firefly',
		npc_fox:						'npc_cubimal_fox',
		npc_fox_ranger:				'npc_cubimal_foxranger',
		npc_garden_gnome:				'npc_cubimal_gnome',
		npc_gardening_vendor:			'npc_cubimal_gardeningtoolsvendor',
		npc_gwendolyn:				'npc_cubimal_gwendolyn',
		npc_jabba2:					'npc_cubimal_helga',
		npc_jabba1:					'npc_cubimal_unclefriendly',
		npc_juju_black:					'npc_cubimal_juju',
		npc_juju_green:				'npc_cubimal_juju',
		npc_juju_red:					'npc_cubimal_juju',
		npc_juju_yellow:				'npc_cubimal_juju',
		npc_maintenance_bot:			'npc_cubimal_maintenancebot',
		npc_newxp_dustbunny:			'npc_cubimal_dustbunny',
		npc_piggy:					'npc_cubimal_piggy',
		npc_piggy_explorer:				'npc_cubimal_ilmenskiejones',
		npc_quest_giver_widget: 			'npc_cubimal_greeterbot',
		npc_rube:						'npc_cubimal_rube',
		npc_sloth:						'npc_cubimal_sloth',
		npc_smuggler:					'npc_cubimal_smuggler',
		npc_sno_cone_vending_machine:	'npc_cubimal_snoconevendor',
		npc_squid:					'npc_cubimal_squid',
		npc_tool_vendor:				'npc_cubimal_toolvendor',
		npc_yoga_frog:					'npc_cubimal_frog',
		phantom_glitch:				'npc_cubimal_phantom',
		street_spirit_firebog:				'npc_cubimal_firebogstreetspirit',
		street_spirit_groddle:			'npc_cubimal_groddlestreetspirit',
		street_spirit_zutto:				'npc_cubimal_uraliastreetspirit'
	};

	return cubimal_map[this.class_id];
}

function onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
}

function onInteractionInterval(pc, interval){ // defined by npc
	this.onInteractionStarting(pc);
	this.events_add({callback: 'onInteractionIntervalEnd', pc: pc}, interval);
}

function onInteractionIntervalEnd(details){ // defined by npc
	if (details.pc) {
		this.onInteractionEnding(details.pc);
	}
}

function onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"adminonly",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-50,"y":-77,"w":100,"h":77},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALWklEQVR42u1Ye2yV5Rlvplkiicuy\naeJczNx0iS66ZcmYl2yIl01RQQQBFasCbREs116h9AKFtlDa0kLb0+s57bnfv3PO9517zzltTy\/Q\nFlpuIkUFDFalCE4gXOz57XlehS1LlrSJyfYHX\/Lm\/d7vvf3e5\/k9v+c9Jynp1nPrufX88A+AezV2\nZYbOZDXZnC4YLTY4XB7oLVZYnBJMdgdsLjfaDMYJq9sTbjKY1tKc238wALIsP6w1Gh16i6WF24X1\n9fcHIxG7yWq96nC5oDdZrrbrjVwLcFaHNGGy2hOBSBRWyQWtyXyZwF1pN5q+rW9uuWCw2kD9cMne\nBM0\/6QmFFm1orbk7eGz\/vXbFY9aYDNKUAEqSdHZPfT1t7OCSsEvSdaPFkqBCG1nhdMsTdskNt+Kb\nIHAw2xz8DqeswO3zg4ESqITd7RFtf0cEvmAYHq8fNqeTai9a2zQJjbYdexpUokwV4JhGq6VFg1iS\nkiIWlX0+soAsanYnA5Q8ys2aQMMbIhD+gKglxQsG6PDI4lsgHBFjA+Ew1O3tWLkqHQ3NTUQFCc0E\ndkoAfT7f+ZfmzMHuujpk5uSgTacjEB4C4RZWZd6RuwQwBsuFreMLdwgrMjgGxTxkC8qBoBjPINl6\nWoMBtap67KyqRHFZqQA5JYCBQOASn7S7txfzFixAvK9PgCNXC6AMTPEHhVv5nTeXfQEBjK3HQJVg\nSBQGyN+5n6lQWV2NUCSCF2e\/jFh3F40NQWc2XZ8SwHCo85rdKSMS6xGWCUVi\/wbOAwoicLDwxmwx\nfyiEEBW2DtOBAUS7ugRF+GCCd2RRLjyeaz4Ez6eA4sCaoou9YSi+MBhksCN6k9wWux3tej2c33OS\nNxKW8vvFN+7n7wyKaw4o7mPAOrNFWJMLc5MLg2Rp4sifEsBIRzcckiIAshvZPcxD3jArNxdWqtdl\nZoJkRGyYsnw51Gq1+JZfVITyyko0q9UT23fuxLayMhjMZgEkr2gzGtUaVO2pFYfjAOLCHJ0yQKfL\nK4rgFvGMrcNRzGXZsmVEchWC0RhcXl8ir6AAJSUleH\/1agYzsT4rK7Fq7doJt6IkGDBJ1qV3UlJJ\nThqFS9nNbDUOIpYk5u2UACpyEB4lKKzI8kEuvs5WWpaWBtocdRTdXH+fORJl5eXo6OjA2owMMWZF\nejq2lpaKw1TV1EDV1AQSbLy9LIXnJJh7DJAzzg2wGQ0Nd00KXDSK290uHyw2F7lY+QdZ7zzLit5s\n\/oaC4bLeZJqwkGBzkPDizEERDMRBliAGxW1WAbPNJgKIA4tdqdEbhDtZxKl9kawvvrMlG5zOByYF\ncO\/e\/X+wmJ2wOSgLyIEJBmexOxPMLwqUqwQg4SAgzEfa6FpZRaXgmKIo13jM64sXCzowWAqWi1R\/\nS+0JthZZb1zkZ8l1jQ73JVlynHM3H1Tt890\/KYA6ne41L8mFJEvk5jCBcgguzp47D\/MXLkRjcxuB\ns1yTPO5EZk42du2uSQQ7KOr9PhQWFiEtbTm2bCmGhdxfX69CXt4mpKevEhZnBWBesmVZtoS22iVR\nduyomD8pgB6P55cuWswX8sFql8XGZquE9DXrBK90BqvIAgES2OUrVyCvIJ8uDUYxLicnFz6K6uzs\nHNJKBbm5G6BSNaC4eKsIIHZ7U2ur0MsbUiRJlIU8xEmr471JAaRofIz4lLC77BQkxEU73VbsbpFH\nmV8cPL4gR7abOGYVtT\/EqcwDm40infikcB4ml0pE\/iBxdP36jJv6yO5na5IlBTUYoMtF\/NRoV0wK\n4KxZs35yw8V2p5cWk5iLdPv47vIguVmALfAG\/AIou9fpdolxRtJFBsUAGdSbby4m68hITU3D0tRU\nwVu+EbGLueacbDJZBUidzuCeFMB4PL7QZrMltEbtlRsWNJodSH1vpbiFrF6bJcB5vAp2VOwkcc6A\nzmgg2ckkLSxFQUEhHA4nVq1aTZEtoba2TribLceF17iRNrm22ZzsXhrrkicFUKvVhk0mExxuilSL\n6xrx6yJzsLFFLW437O6KXVW0uFNYbkX6+5RJ0kTbT9khyuJNbubAYDc3k\/5xzcLOHmCQbDm2os5o\npGCyEzg3HaTePymAfj9zyQirxXrRYXckvOQuqq83NzXDRjfj\/E35MFM2cBOI+rr6m+9ZmVmwUL4t\n31EOmdzK4\/0UMDQXTY1N0FCKMxEFsrOykUvBxPNcRAePm7ioN2F3TV2cfhb86L8C6++PlFy+\/DXG\nxk5j\/\/696O\/rm4iRalONzlhswu\/zXfURN0NkhTCJbzBAl1C+CFCbv3soALxEfIUCyU1BYCO+WYln\nesrhWnKrRELuJG3kdpuGwRoJtBp1RAEudIixaUnTfnFH0h33zUya+a\/fL4cPV\/7s448\/vP7555\/i\n+PEjGB8fE\/XpU6eufPnFF4lPT5\/G52Nj3Mapkyfx2ZkzoO84Nz6O8bNnRd9X587d\/Mb9XH994QIu\nfvON6OP2hfPnxTvXly9dEu9c8zx+5\/EnRkdxcGQEwwcOkDFxmwB46FB\/5qlTJ3D06AhGRgYxPDyA\nwcE+YUWzWYfR0aM4duyQ6D94cEiUkydHRZsOhgMH9iESCeDEiQ\/oTugV8z\/55LiYs3dvHB99dAxn\nzpwU\/WfPfibmch\/v9cEHB2n9YzTmOOLxTmofpn0HMDS0Dzqt+pIAyAsODPRi374eMSkaDVLi92Nw\nqAcDg3H09kURDHnQ2RXEsQ8J5KEBdMfD8PqciPd04NDhQXhkGwJBNzoiXuw\/0Cfeh0f2in5u8zrc\nPnxkSLT7+mNiXW739naKwl6TZSeOHBlGICBj965yVJbkJifdsJSiSJSaatDSoqLI0mNH+WYsWPgy\nfn7XNDz6+wexb6CTNurC5i25+PNjj+K1BS\/hlbl\/x1vJ81FXX0GbDeDI0UE6WDeG9sfpUC46lB8b\n89bh6WceF+0ZT01H3qb1dCCLGH98dEQctGz7ZtgdhpsHODDcD5fNgBee\/SuShob6YTC0oa2tmfTL\nLNzV3R2BrFhQUJiJjMwVWJ\/xHp597gnkF2TAYtXA5TbCaGrBruoSbNi4Bi\/MmgGtrgGatjrxze0x\nkfXoyiab4Q84yGId6OkN0cY9BCBOgArE+kuWLsLCRbPR1q4i68viQD6\/A2aLBlvyMvD4Hx9GUnes\nC22tahwYGkBPdxSRcBBRuoqrVOV0S66BXq9CV5dCelaF9vZaUn0tWUOC4rUKIG2aOmzftglGbSPx\nso\/cRT87FStFPsuTljgaI152orJyM7TaOoTDrJdWJCfPFW2X2yT4brWaKOo18LjUaGoohV7TiDUr\nU5AUDEjoCHuImDH09ZGQmtVob1ORLOgp\/MtJNixiYktzjQBjMrYgSrdg1jnWtnhnN8LeAKrLK8Uh\neNPNRdl46cWnUVSYherqrdi2LZdI34A3Xp+Dea8+j+S35on1\/D478ZVuNU4LHawbI8O9+MuTD2HN\nqsWo3F6MRa++OEq\/gVspMzUjO2cp7ro7Cb+6\/05Mn\/4gXpnzN\/zm1\/fg0UceQGrKYgLWSrrnhNHQ\nQpx6kri3ACmpyajdU4GRoT68Ovt5LH5zLgFpREF+NkpLClGyrQBVldtQVpqPtWvSqC4gA2gQi3pp\nXjn1b0K9qpLysBqLFr2GZ4mrBZtWoroqH4UFG7\/7GRCLaTbIshbz5s\/E++lv0ImL0NS0gwS1BStX\nLMXO8uIruTnpErd3VZXhtw\/el5h2ZxKWpMw5ZzDXorGpDM\/MfOQsu6Wudicd7Dn5oQfueWddetqS\nJ\/70u6Vbi\/O+emrGdLydvJAPPNzaUodIh5eAtpN37DCQR5YvX0pXtAxUVhRDr62GuqUc77779uX\/\n6T9kC5KSfkzltv\/8vjE3eWvtrox1n5w\/\/9Nb\/yPeev4fnn8C4R0joKJ8QasAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/lot_marker-1345131574.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"adminonly",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("lot_marker.js LOADED");

// generated ok 2012-08-16 08:39:34
