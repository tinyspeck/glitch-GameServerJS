//#include include/takeable.js

var label = "Faded Heart";
var version = "1345310398";
var name_single = "Faded Heart";
var name_plural = "Faded Hearts";
var article = "a";
var description = "This ghostly, Faded Heart is all that remains of a forgotten tragedy.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["faded_heart"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by faded_heart
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Ok, but just this once",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.houses_is_at_home()) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.takeable_pickup(pc, msg);
	}
};

verbs.remember = { // defined by faded_heart
	"name"				: "remember",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Dredge up memories of the past",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(this.showing) {
			return {state: 'disabled', reason: "You must wait a little while before remembering more."};
		}

		var spawners = pc.location.quests_get_spawners('phantom_glitch');

		if(spawners.length) {
			return {state: 'enabled'};
		} else {
			return {state: 'disabled', reason: "You can't remember anything in connection with this place."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var spawners = pc.location.quests_get_spawners('phantom_glitch');

		if(!spawners.length) {
			log.info("Failed to spawn phantom for player "+this.owner+" in location "+this.owner.location+". No spawn points exist.");
			return;
		}

		var spawn_point = choose_one(spawners);
		pc.apiSendAnnouncement({
			type: 'location_overlay',
			uid: 'phantom_glitch',
			swf_url: overlay_key_to_url('phantom_glitch'),
			x: spawn_point.x,
			y: spawn_point.y,
			under_decos: true,
			duration: 15000
		});

		this.showing = true;
		this.apiSetTimer('doneShowing', 15000);

		pc.sendActivity("You remembered the half-forgotten Glitch.");

		var quest_remember_ghosts_1 = pc.getQuestInstance('remember_ghosts_1');
		if (quest_remember_ghosts_1 && !quest_remember_ghosts_1.isDone() && quest_remember_ghosts_1. canRememberAt(pc.location.tsid)){
			pc.quests_inc_counter('faded_heart_remembered');
		}

		return true;
	}
};

function doneShowing(){ // defined by faded_heart
	this.showing = false;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_discovery_dialog",
	"no_auction",
	"no_mail",
	"no_trade",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-24,"w":30,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFCElEQVR42u2X30\/VZRzHuUyb3eRG\nXVRbttXausiti1ptbS27c60MRRaRhQiUKPHjCApxPAgCBxCSczxHj0LUofDgUQ+CCNkPHaVZrdTM\noh9rXdRFf0Pvz\/b6bs\/Ygu9hDdrk2V7je77f5zzn\/X1\/fjwPOTnLY3ncOuNZsVes+j+IeVI8I9by\nOVc0iVGRWWpxD4iNokBsFWtEhegQY+IX8cRSCrxbrBevizdFgNB2iS\/Ft+KepXZxFa5Vi0bRJgbF\nx+IO5mwXpeIl8ehiC7xX1CGuRRwQX4h1zhwLeTNzdi+muNtEJT\/ehrgPRHTWnH2igRSoXkyBz5Nv\nJuygeJ+82yBeFW8jvAlxO6h4d1gaPCzu+q\/FPSY+gk\/EN+I38Ts5GEO4hf0dUSXKKaaHqPh1ROCK\nOLZQISvEI7QTy59+cRJS4l3xnvhUfCUuiMtiQBSJMC3HXKzH6dfEJrGFvPyZF8xa2Is4YGE8Q2VO\niXMOk7hozz5DoLWaElyLICJMLpbxsvkI7BPfiR+zEXenCIkeFh5CxIQYR+wodCOkmmq2H8wTxSIo\n0hSIPX+D+0XkaBNRsHWT2Ti3h7wx5+K4Nkp11uPQUXGCENdRACGuX8GpEwgOcr+SHCzlN46zHUbZ\nlXyNRr7QgzvneMMDVOJbiDE3dokEDtfidi3PbN40a7RS0XU4ac8+FJsX0jYO89bdtI1JnPAW30E1\nbmOLK8HlOA05gHB70V8pqk5EBgl3hILbmI24lQiLU2k9iJvgOuCEaBuVaLn0MgeFQWimGNrFdXGV\nPOzinq11kTb0XDYCS+hFMfJvgMIYJ18sdDtxbyviCmgXmxA2hoBecYT2YfwgrtHEv6alWGo8no17\n8VkCpxyBFpoaJ7zFFEI+rWgDeZchHY7xPeuNf3Ds+gmh31NwXZwlfY088s0T2E8YUvxQYpaDnsDN\nnFDy+DxMP5ymt\/Xzkn\/DX\/RVLwef9iPudhZK8jfOoimS3hw5TXJ7OVhCky0kzAVcJ9hVbiA0wPcs\nl2\/SxJNEyKJyvx+B+YjxBJ7muNTLRm\/Vd4rCqeLsV4aLW8jFIq4TPKtwGncj+dmO+Kusud6ve9bD\nRjgmpQnNkLOLtBD2FGGu5ABahpPFUM5LbWdOLWEMskaYwruB6BV+BBaybaVx7hqhiTk7yX7EnmVr\nqkFABYVRDg3Mr2SO516INbpY0wQ+6EfcGoSNsVtcJ\/f6adYRdo8OGu0ULtThThVidkIf\/a+WOQ2O\nex2s1cfavkKbJnmn6U8ZwjzIPnvIcbGdk0rYObbvQkwNpLhX74jbRx577h0iT+cdlnN\/shVdIswn\n2byTjotR8mqIF2nhoNCEiD2I3c0aDey5ex1xnaRIhDUD84mzlvA57nmcxcERx8URQn+J7j+Ok638\neAiXggg5hbBm5rQ74rwt1CLz1FzicmcJcznjnJKHSebzhCSDgG7C3E7it+Kq94\/SfsSGCWsvzsVY\np5Nd619H9RwCJ9iC0oTzIme9ozg85RwiuhEQJvnHuO7kWQ85F3Gcs+v75gtveg6BXqhN6Aw7SNIJ\n9xWciBIyT8AFPvdy76Dj2mHEWTqs9lMckz64SS9MUzRD\/J1B6BFcieHqcURHqVJXWJCcW+n3UFA6\nh7DzVPUMBZFBZIrT72W2qQEOFV7oE4hOkJsBDr6rcxY4ctlBCmkXYfJmmCLp5V4bBdCMEyGcC9Gg\nX4C1\/J+7YEHL45YZ\/wCQ4M9Y\/qc9RwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/faded_heart-1334258241.swf",
	admin_props	: false,
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
	"no_discovery_dialog",
	"no_auction",
	"no_mail",
	"no_trade",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"e"	: "remember"
};

log.info("faded_heart.js LOADED");

// generated ok 2012-08-18 10:19:58 by mygrant
