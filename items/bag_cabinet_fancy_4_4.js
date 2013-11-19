var label = "Fancy 4x8 Cabinet";
var version = "1351897052";
var name_single = "Fancy 4x8 Cabinet";
var name_plural = "";
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
var parent_classes = ["bag_cabinet_fancy_4_4", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "fancy",	// defined by bag_cabinet_base (overridden by bag_cabinet_fancy_4_4)
	"width"	: "4",	// defined by bag_cabinet_base (overridden by bag_cabinet_fancy_4_4)
	"height"	: "8",	// defined by bag_cabinet_base (overridden by bag_cabinet_fancy_4_4)
	"rows_display"	: "4"	// defined by bag_cabinet_base (overridden by bag_cabinet_fancy_4_4)
};

var instancePropsDef = {};

var verbs = {};

verbs.open = { // defined by bag_cabinet_base
	"name"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Inspect your storage",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOwner(pc)) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.isOwner(pc)){
			log.error(this+" not owner and has no key. Bailing.");
			return false;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Deleting.");
			delete this.capacity;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Bailing.");
			return false;
		}

		pc.apiSendMsgAsIs({
			type: "cabinet_start",
			itemstack_tsid: this.tsid, // the tsid of the cabinet that was opened
			cols: intval(this.classProps.width),
			rows: intval(this.classProps.height),
			rows_display: intval(this.classProps.rows_display),
			itemstacks: make_bag(this),
		});

		return true;
	}
};

// global block from bag_cabinet_fancy_4_4
var capacity = 32;

function canContain(stack){ // defined by bag_cabinet_base
	if (stack.class_id == 'contraband') return 0;
	if (stack.getProp('is_element')) return 0;
	if (stack.getProp('is_trophy')) return 0;
	if (!stack.is_takeable || !stack.is_takeable()) return 0;
	if (stack.hasTag('no_bag')) return 0;
	return stack.getProp('count');
}

function isOwner(pc){ // defined by bag_cabinet_base
	if (!this.container.owner) return true;

	var is_owner = this.container.owner.tsid == pc.tsid ? true : false;

	if (is_owner) return true;

	return this.container.acl_keys_player_has_key(pc);
}

function onCreate(){ // defined by bag_cabinet_base
	this.capacity = intval(this.classProps.width) * intval(this.classProps.height);
	this.is_pack = false;
	this.is_cabinet = true;
}

function onLoad(){ // defined by bag_cabinet_base
	if (this.label != this.name_single) this.label = this.name_single;
}

function onPrototypeChanged(){ // defined by bag_cabinet_base
	this.onLoad();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"cabinet",
	"fancy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-115,"y":-265,"w":234,"h":265},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD4ElEQVR42t2Yy27TQBSGiwQSqCUZ\nx7Ed27kXtU3a3G9Nm8S9Axu6AhYgIRawYNNHyCPwCH0E2LIyO5Z5hDxCH2H4jzORUAWSz7RcRKRP\n8djzH\/+e+8zKyi38KuJ+oeuJadVOTDetxEUb11u4ruB65V\/4HRTtaS8jgpYtGlUrcbVlPQy3cd3z\njFnLFYW\/ZqxsrCQ37NVG2xUfqfTarjHfthMzMlhzkmHTEeeDbOqinhFvfquRcTYdTPL29DpdLyX7\nfmo2AEdF+3KcS3\/a9c057s8neevjMJsOh1nzCnnmlO9nMW7FIF4+PSk58kfOyhn5bCMb\/f94\/6Bg\ny+t5fwU+Qt6KwcOiPTtbd2UcyGDcvGMYnOTNm1X\/OGeen6KU4hLAYNy8h0VH7uXMeccwklrmSHhU\ncuZn66jGcjwmVMXl+Pn3cmm5n7MutQyO8tbFY1TFMQLFhaqNkx8FIHezpl5bRAe4pAAcqA1yNQMY\nHPmiwTZ4XHJC7stQ6myDw5wpMSQFGr3XCQ8RgMMoZ0mupu9rGjwoWiGmMclhH42eq+n5KRgUegYD\nBOBABrkaMkhzOdtgULDCCQJwoGGDq+nC4FZ6jW9wDINAcsDcK7majmf8xwZHCMCBBl2uRtvgKJcO\n9\/OYihjQoMvVYB2pZxA9MtxDAA5YoEqupnUTg0ME4NCHQa6meSODNA3FgMYy7D9ohR2ld+xkVJpx\ntE3otAwOYXAXAeLQRkNvZETU4KkUa46I7sXRahuEOBwgAAcadLmaBgw+0jKYNcM+AnCINlJMDXZ9\n+gZ7qC4OVMVcTT2T1DM4+EMGa7oGezDYRQAO1DG4Gn2DvhF2fENyoEGXq9lxNA12YbCNABzIIFez\nfRODLXopAxrTuJptJyEfCQ2DKP6w6QnJgQZrrqZq\/68G0UlmNMpziKrY42nIYNMR\/MPOk3JmGh1P\nYMVBcyatPCi93OhQerm37alFwgQLUHq+XNnQM9IM1VIsUEcj+2olQ+vH6BiklAn5nSS76MX0lTS+\ntbxFo6Z0B4YW\/4uOQWlq7B01tlHVLXtopPcX42MVqxwa95Y9mKY5SpNO6+DyoOhcHJecK7r+HeAD\nr+gUdqyzcT8quYXTdfczqukdkgJYwAV5OgEGG3SGDnZAHTQVLfVfV8+qKu86oDNrT8USKNH3dVd8\nrTDPsu+C1Q2x2uh7qS8Ve+0D0pugRjVPa1k6GQFPwDl4Dl6Bt+Cdgq5fgxcqz1P6ZtrqUP9T5jcr\nVvIl2ve3rdTqGdJr4F5ck3fIJEgDX5FRJUdG26CvzAbq5SfgVHGi7gUqz0BpaqoGXFWKFN8EBnhw\n3cR3Y+0ZhTJnA9kAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-09\/bag_cabinet_fancy_4_4-1317071025.swf",
	admin_props	: false,
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
	"cabinet",
	"fancy",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_fancy_4_4.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
