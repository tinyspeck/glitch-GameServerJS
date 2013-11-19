var label = "Lantern";
var version = "1328662425";
var name_single = "Lantern";
var name_plural = "Lanterns";
var article = "a";
var description = "A handy lantern for driving back the freeze on the mountain.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mountain_lantern"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.light_ms = "0";	// defined by mountain_lantern
	this.instanceProps.rung = "0";	// defined by mountain_lantern
	this.instanceProps.is_lit = "0";	// defined by mountain_lantern
}

var instancePropsDef = {
	light_ms : ["Number of ms the lantern will be lit"],
	rung : ["The rung this will affect"],
	is_lit : ["Is the lantern lit?"],
};

var instancePropsChoices = {
	light_ms : [""],
	rung : [""],
	is_lit : [""],
};

var verbs = {};

verbs.light = { // defined by mountain_lantern
	"name"				: "light",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Light the Lantern",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		return this.lightLantern(pc);
	}
};

function isLit(){ // defined by mountain_lantern
	return (this.getInstanceProp('is_lit') == 1);
}

function lightLantern(pc){ // defined by mountain_lantern
	if (this.isLit()) return;

	this.setInstanceProp('is_lit', 1);

	if (!pc) {
		log.error("Bad pc - something is very broken!");
	}
	else {
		this.setAndBroadcastState('lit_yellow');

		if (intval(this.getInstanceProp('light_ms')) > 0){
			this.apiSetTimer('onExtinguish', intval(this.getInstanceProp('light_ms')));
		}
		else {
			var rung = intval(this.getInstanceProp('light_ms'));

			var data = pc.location.getRungData(rung);

			if (data && data.light_ms) { 
				this.apiSetTimer('onExtinguish', data.light_ms);
				log.info("Setting lamp time to "+data.light_ms);
			}
		}

		if (typeof this.container.lanternLit == 'function'){
			this.container.lanternLit(this);
		}
	}
}

function onCreate(){ // defined by mountain_lantern
	this.initInstanceProps();
	this.setAndBroadcastState('off');
}

function onExtinguish(){ // defined by mountain_lantern
	if (this.isLit()){
		this.setInstanceProp('is_lit', 0);

		this.setAndBroadcastState('off');

		if (typeof this.container.updateLanternCounter == 'function'){
			this.container.updateLanternCounter();
		}
	}
}

function setPermanent(){ // defined by mountain_lantern
	if (!this.isLit()){
		this.lightLantern();
	}

	this.apiCancelTimer('onExtinguish');

	this.setAndBroadcastState('lit_blue');
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-41,"w":32,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH4ElEQVR42s2Ye1BU1x3HqSQ2aDWJ\nRm1RRJTwXoEVFkRhd3kt7C77fi\/swsLyFHBBEVFcEHxLNA0ajVFRFKMkIkaqRoSoVat2aofJtDP9\nh8mMnenY6ZBpmv777e\/cXizambQz3d30zHxnmb3n3vO539\/jnCUo6L8fs57cHVQ\/uTfonXjy+dBX\nvx4ZZ\/rtr4bHnz64MvSb+yPhQT\/UmHh8VfzozsXJu1\/048bwCXxx9WPcHjmNe7fO4fHdS5yuD5+Y\n2rzZuSrgcPfHzqsfjg08Gx05haFPPuDgxn7R95IejA3gs4HD2NlePUG3vBYwuEdjnyQ+vnNpavzG\nGVy52Iurg0f\/De5fOo3mxmIUW\/K9AQN8+OWFpyx8LJTMwVvXTuImhXga6s7Ns6R+3L89gEtne9Dt\nrUNrs3M8cOGlhadz7PvEwA\/sakJ9jaZrx1Y3AgJ34\/OTib8cPQ+mfzp1FqxIGPTD8Quc7t7qx6X+\n93Bw9ybs7myAxZhe2lCtvxwwBxnQg7ELuPbZhxg8f5jTuVP7cfbjvThxdCeO93ZwOntiD7p31KGx\nVn96rWiRMWCAN68cH5oOM6vUset9uEyVPA07rQt9B9C+xfWHpnrzzdio2RpPfYk4IIDDg73qG8Mf\ncXDT+TbTzU+ptYxcPoaBvn2odRcdIcCJFOFSj1kvQ22ladLT4FD7PxevfjQ0OnIS90bP4T6BXh08\nQlAf4mJ\/Dy6c2Y\/hSx+g73g3VIWCDTVuzaMCaeTv16bEYW3qajTW2aaa62z+3WHaWytP11dZcXmg\nhxw7hP6TewiyF+dO7saJI95vB88dxJHDW\/8kEi7oUORG\/zkzPey72KilF0XCeOqJcjQ3OJx+g6OH\nNypkmRDERmK7R4b3djm+3bXdhjPH2tDb04BtzZrRnW02uO1pz7UKAWSSSIgzov+iVqy\/npocD4Mm\nF6X2Iv\/0RZY\/ZSVqDo5pb7sO7ZsMqCuX\/M1tT\/rKoon70qIRPjeqk6FTJsGkSkBBTgKK5JlTImHM\nNwywrsqMimLtFf+411gypFFKXwBadZnY2iBDpT35uxKD4GuHQQiLOhFauYCurf273VIAV0kRdIr1\nSBFEwG6Wg6oZ6WsEXfz+\/COfh9ddpkeyIJoDZIt62ypR7dZDlpf6rLWpFB1t1aivMk257PJviqTx\nyF6zDFnCFXBaC7Bzey0U+ZlIiFmVQY8LIb3uU8iD3c3hezoap6hdIDtLhOT4SFRpEuFQJsMpj4da\nHI0KbSq02XEw5cXBTg5XFBeibXMF3t+3BSVmJVKS4r+mRy0gzSfN4SF9N1rqHM4DXU3cos2NDjTV\nGtHg1sBTpUWtS42NtWbu+5amMuzv8uBUbyc6t9RgXXoy4sn1uOiVZfSYJaSFPGSIz49jnhq7s6dr\nE7f40Z42\/Hz\/lhfavaMe+zo24mCnB3UuE1QFYiSvjuXg1qUlsUMD64FLZ0DOI73h83ysKTOKWzeW\nT5452o39nU3YtMEJl00NvTIHmkIJimRZUOSu56AYXCLlrU6Z8zu6NZK0grSMtJj0Nmmu3w61BDRZ\n6TCg2KhAmVWFYoOc2ksucliOro7h4JgyCFQjl96mW2JmQIaS3uFD7XsX2cjPEpXTwii1qNDZWoM2\nTzlqSg2w6wuhpIqddjBVmICstPjjdMtqUiyJ\/VYJ40P9Nl8wwb7mY28cos4TTTgJsL25Etub3Vzu\nlRjlXJjFGUIkxa\/CmthQrAydt4Xmp5IEpGhSBO8iy8Wf+Lyi+TeeE7PirRV6Wep9p06CUr0U2vw0\nFIqTkJuRgLWCUOSmhiElZjHClsz10Px1JCEpjneR5eIiPsw\/9jXga\/ybL4yLWCjSi1fBnhcFc3Yk\njNJI5BGYImPFC8Bli+duprkSUhrvYhRpOR\/mt\/yRh6\/zbYIl+jJ5evinVap4lBbEoE6bAINkFTSZ\nEcgXLecAQ2YHW2leLontJEl8mFmx\/JTPQ9YTZ\/kScDYfGhaiZaK4JbYKZRxqNAnYoBPAJY+FiZyc\nBqQ5OlIBKZMPcwyfhz\/jd5c5\/gRkFRnpLIx+5jElcoDMTRuFXJa2HEmRC9kWZyAVkrK+BzDYbw4y\nQJlo+V4GyFxkgCwfVesjkBy16PkP4eBLOciqcsH8kHQWWgflYbkiFqxwlFQoWcKVMKnzhmlOHl\/J\nAcnBF1Wc8G54bFTE0sRKh360TC36axlBlsiiuRzMTQkD9UpsqDAjLPQdC81P5xv2q1Uc4usqDubD\nMt\/jUqWoctKWuKzqa95NbpQbpXBo1nOfbY2laKkvhVmTT807A8aizD\/yfTByxp7slz44i38o99bb\n6o3jLqvsULVTj2M92\/H+7ha00CHCpitABv2qM6qkKDHkQF2Q8ZgvquUzdpJ5\/thJgl7NGatW4nQQ\nRIVdOemyFcGqyR+qsORONriUdPTPpEOs9KlNKyUXxePpa2KFr+zFfjnRvJQzbfWmoW0NJrhtsiGb\nLhv0t3NrvVFcZZOpi3XZXnbNppE0MlirVirmnfPfaeal38sbzIkMgIlBWdSSyZZaPdj37LpJleWt\ncSimLBrJJAM0GnPfnFFswUH+HuRYeGN5EXPQ6TDmcC4xQAbLrhPYOCsSJkNR1qGA\/2vYqpEcYvll\nUGaOuyz53pYa3aG2BpOXgVNYvUw0Z5w+p8xaaWJA4diCHAAVyX+aa1KJJ4P+X4c8OyNcJVv3P4X3\nH1tpIKf6p9B2AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-01\/mountain_lantern-1326505722.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by mountain_lantern
	"id"				: "light",
	"label"				: "light",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Light the Lantern",
	"is_drop_target"		: false,
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
	"no_trade"
];
itemDef.keys_in_location = {
	"g"	: "light"
};
itemDef.keys_in_pack = {};

log.info("mountain_lantern.js LOADED");

// generated ok 2012-02-07 16:53:45 by tim
