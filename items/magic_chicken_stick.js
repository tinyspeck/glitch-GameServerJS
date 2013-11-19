//#include include/npc_conversation.js, include/takeable.js

var label = "Chicken Stick";
var version = "1348106634";
var name_single = "Chicken Stick";
var name_plural = "Chicken Sticks";
var article = "a";
var description = "A stick for summoning and containing poultry in a happy feathery cabal. When placed in a house or on your land, chickens within walking, flapping or climbing range will feel an irresistible physical draw to this chick magnet.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["magic_chicken_stick", "magic_animal_stick", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.distance = "250";	// defined by magic_animal_stick
}

var instancePropsDef = {
	distance : ["How far away from the stick animals can go"],
};

var instancePropsChoices = {
	distance : [""],
};

var verbs = {};

verbs.place = { // defined by magic_chicken_stick
	"name"				: "place",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Stick it in the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.is_placed) { 
			return {state:null};
		}

		if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) {
			//log.info("PS placing in pol");
			
			var polType = pc.location.template;	

			if (	polType == 'LIFE3C0NLA32547' 
			|| 	polType == 'LIFE42L6PA32MUJ'
			||	polType == 'LIFCH1JF8K42GUU'
			||	polType == 'LIF1737DK0526F5'
			   )
			{
				return {state:'disabled', reason: "You can't place a stick in a location with an animal pen."};
			} 

			if (!pc.skills_has('herdkeeping_1')) {
				return {state:'disabled', reason: "You need to know "+pc.skills_get_name('herdkeeping_1')+" to use this."};
			}

			var items = pc.location.find_items(this.class_tsid);

			if (items) { 
				log.info("PS found other chicken sticks");
				for (var i in items) { 
					if (items[i].is_placed) {
						return {state:'disabled', reason:'You already have a Chicken Stick here.'};
					}
				}
			}
			
			return {state:'enabled'};
		}
		else {
			return {state:'disabled', reason:'You can only place this in a location you own.'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.parent_verb_magic_animal_stick_place(pc, msg, suppress_activity)) return false;

		this.updateChickens();
	}
};

verbs.change_radius = { // defined by magic_chicken_stick
	"name"				: "change radius",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Set how close Chickens stick to the Chicken Stick!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade("herdkeeping_chicken_stick")) { 
			return {state:null};
		}

		if (this.is_placed && !pc.location.pols_is_owner(pc)) {
			return {state:null};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var conversation = [ { txt: "How wide should I let the animals roam?", choices: [{txt:"Very wide", value:"300"}, {txt:"Kinda wide", value:"200"}, {txt:"Medium", value:"150"}, {txt:"Tight", value:100}, {txt:"Very Tight", value:"50"}] }];

		this.convo_step = 0;

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, null, true);

		this.updateState();
	}
};

verbs.pickup = { // defined by magic_chicken_stick
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) { 
			return {state:'enabled'};
		}
		else if (this.is_placed) { 
			return {state:'disabled', reason:"This Chicken Stick belongs to somebody else. Get your own!"};
		}

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.parent_verb_magic_animal_stick_pickup(pc, msg, suppress_activity)) { return false; }

		if (this.is_placed) {

			log.info("PS Clearing movement limits on all chickens");
			// Get all chickens on the level and clear their movement limits.
			var items = pc.location.items;
			for (var i in items){
				var it = items[i];
				if (it.class_id == "npc_chicken"){
					log.info("PS Clearing movement limits on chicken"+it);
					it.clearMovementLimits();
				}
			}
		}
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

function parent_verb_magic_animal_stick_place(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (pc.is_dead) { 
		failed = 1;
	}
	else { 
		var dest = pc.location.apiGetPointOnTheClosestPlatformLineBelow(pc.x, pc.y);


		if (dest) {
			pc.location.apiPutItemIntoPosition(this, dest.x, dest.y);

			pc.announce_sound('ANIMAL_STICK');

			log.info("PS placed stick at "+dest);

			this.is_placed = true;

			this.updateState();
		}
		else {

			// There's a problem - attempt to fix it.
			pc.location.apiGeometryUpdated();

			dest = pc.location.apiGetPointOnTheClosestPlatformLineBelow(pc.x, pc.y);
			
			if (!dest) {
				pc.sendActivity("An invisible gremlin is standing here, preventing you from placing the stick.");
				log.error("apiGetPointOnTheClosestPlatformLineBelow() failed for level "+pc.location);
				failed = 1;
			}
			else {
				pc.location.apiPutItemIntoPosition(this, dest.x, dest.y);

				pc.announce_sound('ANIMAL_STICK');

				log.info("PS placed stick at "+dest);

				this.is_placed = true;

				this.updateState();
			}
		}

	}

	var pre_msg = this.buildVerbMessage(msg.count, 'place', 'placed', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
};

function parent_verb_magic_animal_stick_place_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function parent_verb_magic_animal_stick_pickup(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_pickup(pc, msg, suppress_activity);
};

function parent_verb_magic_animal_stick_pickup_effects(pc){
	return this.parent_verb_takeable_pickup_effects(pc);
};

function onModify(){ // defined by magic_chicken_stick
	if (this.is_placed) {
		this.updateChickens();
	}
}

function onPropsChanged(){ // defined by magic_chicken_stick
	//log.info("PS onPropsChanged");

	if (this.is_placed) {
		this.updateChickens();
	}
}

function updateChickens(){ // defined by magic_chicken_stick
	// Get all chickens on the level and set their movement limits.
	var items = this.container.items;
	for (var i in items){
		var it = items[i];
		if (it.class_id == "npc_chicken"){
			var dist = parseInt(this.getInstanceProp('distance'));

			//log.info("PS Setting movement limits "+dist+" on chicken"+it);
			it.setMovementLimits(this.x, this.y, dist);
		}
	}
}

function onConversation(pc, msg){ // defined by magic_animal_stick
	if (msg && msg.choice) {

	this.setInstanceProp("distance", parseInt(msg.choice));

	this.conversation_end(pc, msg);

	this.updateState();

	}
}

function onDrop(pc, msg){ // defined by magic_animal_stick
	this.updateState();
}

function onGive(pc, msg){ // defined by magic_animal_stick
	this.updateState();
}

function onPickup(pc, msg){ // defined by magic_animal_stick
	this.is_placed = false;

	this.updateState();
}

function updateState(){ // defined by magic_animal_stick
	if (this.isOnGround()){
		if (!this.is_placed){
			this.setAndBroadcastState('1');
		}
		else{
			this.setAndBroadcastState('placed');
		}
	}
	else{
		this.setAndBroadcastState('iconic');
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("herdkeeping_1"))) out.push([1, "You need the skill <a href=\"\/skills\/21\/\" glitch=\"skill|herdkeeping_1\">Herdkeeping<\/a> to use this."]);
	out.push([2, "This tool only works in your yard or on your home street."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from an <a href=\"\/items\/1000002\/\" glitch=\"item|npc_streetspirit_animal_goods\">Animal Goods Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_shelf",
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-60,"y":-49,"w":119,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIlklEQVR42s2YaVBTWRbH\/Tgfpgqt\nmpYIaFjcGlvTNKKAKIJJMAEFZAlLQiBsEgJBlsR14j4oDXGHUSBtA4ossstOQFGbViauPWN12Uz3\nTE3P1FSZqeqpmZpP\/7nn0qSmq8svgDKv6tR7IY93f\/d\/zvnf+7Jo0Ts4So2+ThVF\/uoDqeusmRHL\nrSqxwBEamUubNsrddGLvx6aKogD9ovd9KEOWivTxXlMZcjeky11xLGcjrhyVOOKgZgN0MV5IkQiQ\nFuYCffzKNprQe4FL2SFQp4id7do9Hqg5LcODTi0e3cnjcb89G6NNqY7ovZ6McsPWadCdLlP7FF6R\n7xZOLDDRYKUFm\/FFVy4Hopjsy8fT4SIeD9nfJ7q0eNCehTEGOdigRO\/nKWBlwNXMj19teidwKonA\nQum8fjaMAekx0Z3LIHPwZY8Ov+vX41FPLiZ7dRyuvVqB5it7MNaSwb\/rrlU4IFMky1CQuM48v8pJ\nnPWk3M1zuxlQLu7dzkDntWgGqeWwlM4v2TV9pmuCfzK4DyO30hhcPB735qO\/LplBx\/F0a2Ru2L3N\nVT1PaXWOpIfWnA5jacvmIEMsbXdbNHg6VMQ\/z6T3hbUEL0dLGFwBHnbu5XVJZ9tgISuFLA5eui+A\nQ6aGuyMiyFU0J7g48RInaojjWl+u2vDNFD7Y4zs69jmLK\/OIgjeJjsPSNX1HEyBF6f6HnTmwDRRw\nda1NGRwwa9cKxO5YYZ9b3YmdzVQ3QzfU6LYkwNqSyWuOoAiSBuW1yFS6y+ptnE2CoLstifxv02nP\n5ZBcxbZM\/plsiCAzo1dj11ZB8GybIpgeQr42UJ+Mlqo4rsTQzTT01am4UtQk40ytl\/dO4g8Py\/Bk\nxIQeSzxX88lQIVdw4kdVJ\/sLcPd2Np+kIWUdByxUrkfUNjfTbNVro4eMNqejtTIK9zsIJpOneuSW\nBjcvRmO8LQcTPcV4PnaCx1BjFj\/fa03ntUdwpDhNjCD76lUcMjfGkwOm7\/bCntAVptk2h51SQXVT\nXy7DSGMq97xhdqYaG23OQN35GDReTkbDxSScKgzC8Tx\/9NTlorOGNVFzGrMZjaMG6bq1Mhr9DHIG\nMCduLUvxMvMsrUXAa2WMDdRVHY+MKA9cOBKKqpM7UWYIwpmiAKjkzNfCVyBy6wdIDHNFRrQn9Mlr\nkc2WuUNZPmipVHDAmjPhOLLXF5YyGbpqExyASrkHZFsE1jkB3mcppdnfvqpErmI1m\/VK5CWugSbS\nHam7hDzidgg4GH1PZ7qHIOm+uooYdNam4dnwfgw0qFFvjkB2pBBsMwGFxB2hG51nq6CzjRb8FyOF\nvO7utWbgQUc+jun8cTzfH4eZIqSaQuLCwQpV3g5Igi8t3ob+hkzWuVm8TIZZ3Q7dTEVpkT9X74B6\nHaKC3ZgXusy6Scz0oLGmdAzfUPJByEYI9rnVgPZrKpw1BMN8MJRH+f7tHKrpciK7R4eez5IxcCMV\nA3WJrJF0zAVi2Lqswq+zfTjgviRvbPNZBr+1i+dmMzWnpGzlSOYdTOvqYH0S70jyuwm2MXg+XIyv\nRo14NX6Q+V8S79re64ncN2nFoXsH6pWsyVL4JLXRHtMdHLUaybKVCPRZJpzL7mWKHkiAZLI0+GRf\nHiv8fcy8VXxAUqjvugJ3amOZqnH4rDwcTZWxDkui+r3bko4RtgqZjUEcjkonddcqyANd2ua+92MP\nrDoawgchu6B008D9dUq2mmgxyADv307HOKtRUrDxUjS3pC\/Yrobuo4lRdFYncDiKgkRv1lhC5O75\nUDgfe8ApWu4azFHoqlHgdlUU97PumhjuizPLGAXtbGhDcedzFT+TemTYpGZe7LS15LMODw9yg3ST\nwDIvu5k0mVswmTZB1p6WoPlSBGpKpawJkniqCWzkx03ETJDSA6z+aD2m2jOqP+Rw9IqgZeYcHuRq\n9\/VdMj+vAJ2ZfpbK4gBHeo7nfMzUi+OAdRXhvBmoFimNVJ\/P2LZrulbz0cFqsjBpleN\/C1nnygJd\n7dJNS0XzAtd+QWyuTliH+tj1KM\/0YQq4TncgO5\/O34iOq3Gsk3P4JpZqjoKsaLhRA9qiTe+gp1+c\nipXekG9xsSulHvMD1xm3NvjWmWCcy\/kEh3euQq7fcuREi6CULrfPKDLTkftTP\/qJUv8btGJodq9E\niK+zPcRnnpRrajI6taQHTlWnrEfDfn+cUW\/AuUI\/HMv2sRelb7L4rl6slvn9yro74AMkhTr\/DIoU\nS2drtDrci6nmBvFmgVUeuEw4L3ATIzWi7molrhxMwCWm3KGIVbho2IwShbf9pD7A3lghd7w6eiz+\nhdB96S9NPl5OUyJPJ\/itWYKtoqWI2u5u3+4rsG7\/RGAK8ZvlhvRtx++fjdu6fssM94IORckhMIZ9\nBDVLb9mBqKmuaxr0VUlFixbqeP36sdPrV49sQx0XUH92J4r3SnHCENO2I9DbUlWaiTuWbOuihTzO\nlkhsVadVeDzejr6OWjRdLbCHbxNCkyBFb9N5jLReEC0knKXMIMXVU7E4pA21Xb9WZkpL2IFNG4To\na7mEZ\/ebLAsGV2aQmAnusikC+zMDLfJAD6EsyNMm2bIGPc2VmBxrtn\/z1bBwQeA+NUjVBHfxSDiO\n5oW2tVYVtGUpAqYixR9hfLAZXz8dwfdTk6aFSmswwZ0\/LMdx\/XaeQrGvp1NOihR\/++4F\/v6nF7B\/\n\/8r25s1rp\/cOV26UispKJHbzQRl+UyR2dKc2TR753deT+Nc\/\/ox\/vvmj\/d9vvnn\/qS01ip0IruLA\nTnxqlNqy4jwdCv1l6pn5Pz\/8Fd++HLUBb5wWBI7shIHh\/CE5g\/vpL5+1V06odenRePGw1bwwdWeQ\ntlHdXTka8TM4OqRBHqKwIE\/9D\/Zv9e89vTNed5nBGbPe\/psxQS5Ex+q5nZgi7MbsoIVbEd5qxiUS\n6\/kjcvsR3f8f3H8BgmdSzrh7thwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/magic_chicken_stick-1330729651.swf",
	admin_props	: true,
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
	"no_shelf",
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "change_radius",
	"e"	: "place"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "change_radius",
	"g"	: "give",
	"e"	: "place"
};

log.info("magic_chicken_stick.js LOADED");

// generated ok 2012-09-19 19:03:54 by lizg
