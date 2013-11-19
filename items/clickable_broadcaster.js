var label = "Clickable Broadcaster";
var version = "1347899132";
var name_single = "Clickable Broadcaster";
var name_plural = "Clickable Broadcasters";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["clickable_broadcaster"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.scale = "1";	// defined by clickable_broadcaster
	this.instanceProps.event = "";	// defined by clickable_broadcaster
	this.instanceProps.single_use = "false";	// defined by clickable_broadcaster
	this.instanceProps.distance = "1000";	// defined by clickable_broadcaster
	this.instanceProps.destroy_after_use = "no";	// defined by clickable_broadcaster
}

var instancePropsDef = {
	scale : ["scale of hitbox"],
	event : ["Event to call on click"],
	single_use : ["Can only click one time"],
	distance : ["How far away can the player be"],
	destroy_after_use : ["Should this delete itself after being clicked?"],
};

var instancePropsChoices = {
	scale : [""],
	event : [""],
	single_use : [""],
	distance : [""],
	destroy_after_use : ["no","yes"],
};

var verbs = {};

verbs.click_broadcast = { // defined by clickable_broadcaster
	"name"				: "click_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"handler"			: function(pc, msg, suppress_activity){

		var val = this.getInstanceProp("event");
		var dis = this.getInstanceProp("distance");

		var xs = 0;
		var ys = 0;
		 
		xs = pc.x - this.x;
		xs = xs * xs;
		 
		ys = pc.y - this.y;
		ys = ys * ys;

		if(this.getInstanceProp("single_use") != 'true'){
			this.clickedOnce=false;
		}

		if(!this.clickedOnce)
		{
		if(Math.sqrt(xs+ys) <= dis || dis=='' || dis==null) // if within range, activate verb
		{
		  if (val){
			var events = val.split(',');
		        for (var i=0; i<events.length; i++){
				log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
		                this.container.events_broadcast(events[i]);

		                //if destroy_after_use is true, destroy object
		                if(this.getInstanceProp("destroy_after_use") == 'yes')
		                {
		                    this.apiSetTimer('apiDelete', 1*1000);
		                }                

		                if(this.getInstanceProp("single_use") == 'true')
		                {
		                    this.clickedOnce=true;
		                }
		           }
		     }
		}
		}

		return true;
	}
};

function onCreate(){ // defined by clickable_broadcaster
	this.initInstanceProps();
	this.clickedOnce = false;
}

function onInteractionStarting(pc, mouseInteraction){ // defined by clickable_broadcaster
	//this.container.events_broadcast('can');
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_click_sound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-60,"w":60,"h":60},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAAHElEQVR42u3BAQEAAACCIP+vbkhA\nAQAAAAAAfBoZKAABfmfvpAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/clickable_broadcaster-1345656200.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

itemDef.oneclick_verb	= { // defined by clickable_broadcaster
	"id"				: "click_broadcast",
	"label"				: "click_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
};

;
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
	"no_auction",
	"no_click_sound"
];
itemDef.keys_in_location = {
	"c"	: "click_broadcast"
};
itemDef.keys_in_pack = {};

log.info("clickable_broadcaster.js LOADED");

// generated ok 2012-09-17 09:25:32 by eric
