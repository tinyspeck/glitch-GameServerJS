var label = "Wall Switch";
var version = "1347576691";
var name_single = "Wall Switch";
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
var parent_classes = ["wall_switch"];
var has_instance_props = true;

var classProps = {
	"state_down"	: "down",	// defined by wall_switch
	"state_up"	: "up",	// defined by wall_switch
	"state_down_static"	: "lockDown",	// defined by wall_switch
	"state_up_static"	: "lockUp"	// defined by wall_switch
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.switch_mode = "toggle";	// defined by wall_switch
	this.instanceProps.reset_timer = "1000";	// defined by wall_switch
	this.instanceProps.on_press_down = "";	// defined by wall_switch
	this.instanceProps.on_press_up = "";	// defined by wall_switch
	this.instanceProps.on_reset = "";	// defined by wall_switch
	this.instanceProps.distance = "1000";	// defined by wall_switch
}

var instancePropsDef = {
	switch_mode : ["Whether the switch is toggled by the player, or automatically resets itself"],
	reset_timer : ["Time after switch switch automatically flips back (in ms)"],
	on_press_down : ["Event(s) to fire when switch is pressed down"],
	on_press_up : ["Event(s) to fire when switch is pressed up (toggle mode only)"],
	on_reset : ["Event(s) to fire when switch resets"],
	distance : ["If outside of range then won't fire"],
};

var instancePropsChoices = {
	switch_mode : ["toggle","resetting","custom"],
	reset_timer : [""],
	on_press_down : [""],
	on_press_up : [""],
	on_reset : [""],
	distance : [""],
};

var verbs = {};

verbs.press = { // defined by wall_switch
	"name"				: "press",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.class_tsid != "esquibeth_button") {
			return "Press";
		}

		return "";
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"handler"			: function(pc, msg, suppress_activity){

		var mode = this.getInstanceProp('switch_mode');
		var is_pressed = !!this.is_pressed;

		//added for distance check
		var dis = this.getInstanceProp("distance");
		var xs = 0;
		var ys = 0;
		xs = pc.x - this.x;
		xs = xs * xs;
		ys = pc.y - this.y;
		ys = ys * ys;

		if((Math.sqrt(xs+ys) <= dis) || dis == "null" || dis == "" || dis == "none" || dis == null) // if within range, activate verb
		{
		     if (mode == 'toggle'){
			   if (is_pressed){
				this.setState(false);
				this.onEvent('on_press_up', pc);
			   }else{
				this.setState(true);
				this.onEvent('on_press_down', pc);
			   }
		     }

		     if (mode == 'resetting'){
			 this.setState(true);
			 this.onEvent('on_press_down', pc);
			 this.apiCancelTimer('onTimer');
			 this.apiSetTimer('onTimer', intval(this.getInstanceProp('reset_timer')), pc);
		     }

		     if (mode == 'custom')
		     {
			 this.onEvent('on_press_down', pc);
		     }
		}

		return true;
	}
};

function onCreate(){ // defined by wall_switch
	this.initInstanceProps();
	this.is_pressed = true;
	this.setState(true);
}

function onEvent(event, pc){ // defined by wall_switch
	var val = this.getInstanceProp(event);
	if (val){
		var events = val.split(',');
	        for (var i=0; i<events.length; i++){
			this.broadcastLocationEvents(events[i], {target_pc: pc});
		}
	}
}

function onTimer(pc){ // defined by wall_switch
	this.setState(false);
	this.onEvent('on_reset', pc);
}

function setState(new_state){ // defined by wall_switch
	var old_state = !!this.is_pressed;
	this.is_pressed = !!new_state;

	if (old_state == new_state) return;

	// animate the switch thing!
	this.setAndBroadcastState(this.getClassProp(new_state ? 'state_down' : 'state_up'));
	this.apiCancelTimer('setAndBroadcastState');
	this.apiSetTimer('setAndBroadcastState', 500, this.getClassProp(new_state ? 'state_down_static' : 'state_up_static'));
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-40,"w":31,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHYklEQVR42s1YR2xcVRS1jHvDSdwy\ndnCfGXvGnnEvM+Puce+9jxMb20mIQ5ATbIUYghNFIEWAnAI4jQCiZWFRsgiyFwgWYcECCbGIxIIF\niwRFWcD2cs\/Le6NJEZlxS5509OeXd9\/555Z3\/3h5rWEQkQ8jUKGurs5\/dnZ2B9De3h6XlZUV6fU0\nhiSmYWglInFN3vN3Ja2uy3veruebRc5fkgOpcCyYmJgYr9VqR1JTU1cZd\/k3PQy+\/gsf51lZy6aR\nlMqFuV7DoiCVnp5OJpOJcnNzKT8\/\/xEUFhZSTk4OpaWlgewlnmeSJjaMbODIyIhhfn5+O06gGlTR\n6\/WUnZ3tJFFbW0usEnV2dtKBAwcEWltbqaGhgWw2m3gmLy8PJO+azeaxhISEcDangf31kINq2uXl\n5VCpmgkLGAwGsRgWra+vp+HhYYG2tjYaHBqmEcco7Rkbp86uLuc9ELdYLFRWVkZMkPr7+7v45XbA\nrFzH4+HNSGbAiFdSUtLzUA7koFpxcTH19PTQ4OCgEyBRXlFBE1N7qaunlzr43PV+X18f2e12MZ9d\nfm9mZqaxuroaKqavRUkQi1MnSATEEZSDEr29vTQwMPBYQMn\/u49QwAvyy\/55\/fr1zNDQUD0vYfI0\nLqGev0oInU4nEqGgoICam5uFGq4YHx8nh8PxAMbGxmhiYkKQevh5kIQtjs\/Lq6urEKJEecvd2HvB\nxbUIbGGwvLxcuFZhaGhIAKri\/sMoLS2l0dFRAdd5QEdHBxmNRjpz5kx5REREjicEERfh0rWXkLFY\nDEkB93Vx8ANYBOe4\/iTgWSip5iogaaAiV4lMTwhqVdCye\/9Q6lVWVoq3VoAbi4qK3Mbk5KQg5Wqj\nqalJxCJ2Jll63CeIsoLdQNU6GEPsAHBZSUmJcC0AAqw2xcXFOcE105lUAGesiFVlQwEeWllZycEW\n6QlBuHcak0EOBFB4FbiOkdVqdQI7CkjFxsYKaDQaAVZFkFPPIWlc7QDw0NTU1KAnBJNV9mJhEMRu\ngOwF8NaIPVwDUDIUOZDauXPnA8jIyBAk8SziEPVS2QJcCLpdsOMeR7CxsVEAcYQtDBkKIARcycXE\nxAhER0eLI7yAl4AN1EfMV7YA7OWSoNtJEulKEO6FcZACoAAMIwMBJJAih6Miq0iihuIloWJ3d7eY\nr2wBWOPo0aPNnhAUUicnJ7fAuCLIjakAkgWxU8HbGoBkASmlFp7FHMwFQW5gxUtARdRMkFK2sPUh\nEWV\/6baLseV4y37PuffW1NQ4gd0AZQeAilCBi7qIqX379okkwr2UlBTRbqlsRj2sqqpy2kHi8A51\n49atW0b0nB53DGgQEMRQBIZRKgC4CQrgGghicah5+PBhWlpaooWFBVEnoR7aMmyTCAuQRtwqO0gg\nvj7DLtatqd9Cx6yCHIaVagDchT5QEexsaaGLb52ir86fpdNzr9LMbofIUJCE2zEHrlZtF46ySAer\nrXVNA51MZmamWETFHQD14MoW7gmny210obaMLteXC1yoK6Pz9hJaKCuixuL7VUApiYSBa9G6IXvn\n5uaieZnoNRNUjSoWgIoqewEkyPHqUrpSX0GfNVXRtRY7XWu10+fN1fRRQwV9UFNK71Sw+82ZhJdU\nXTjIcePx3u3bt7EpJK73E8DblSRIKbxUbhWKfcGEvumooxvdDQLf8u8vmewVvne22kZHCjkWjQYR\nc0g8JvvdnTt39PypqldlbT0D2RWsvkfQIiEm7VaLcOPHjZW03FZLK\/0tdPPYEbr5+iytjnTR1+21\n9Cnfg4onSvKpyaDD1vcPx+VFJlbK4REvY897Iz6e4IYd6A9ZhUW07H2FeWJxkIB6P+x10K9L5+i3\nqxfpx+kXhYpw+4e19wk6jGJfP8F1sC0oKCib7RlVU7wRI1w2ESKYDx48aJ4uLf4JCn6iFBxsEwr+\nfHzuEQXnLTm0O0MQnAwMDGxnEzZP+j93P6I0kiQM+5+0FbyxWO1eDL6cm0GODB35+fkdY7Ty\/LSN\nJuj8TpYqhr2SlzFwuqKY3mcVkcXIXGSwyuKrMovftObRuCmNOnVJfwUEBPQzSjaToHN0cTy+VpQt\nysg5Jvm4OniSY2+vOV2oV5ca\/z3cywThXv2mE8TYnamfP5SbSadKC+jdSgstVlkF3i4rpJl8M02Y\n0mmUyfXqU\/6N2vb8FCdHk4+PT\/F6Ptg9Hv1pKYtIALhxktUC8HsPXxs26qhLn\/S3LibqeHBwcB8T\nrPP19c2XTXHwlv0116NP3j9k0N4bNmgJ4N80kJ5KLdqE3yO3he0PCwsbZPe2sXsrmGAWT0EN9NvK\nvw8DkOW2XbGOfE3M\/mxNzEx6VMShkJCQHkY3Ys\/f378G7uUsNsiK4O21xQO1MpEVMrNSViZUzS6t\nZzTwbzuyl+9lS\/dufxp\/wsJlUYwUkGQUImNBjBW08HmOLC9xG7mDeDoQ+DFQiV1plESzGSZZWuK3\npLw8YYTKYh4v3Zkqj7tk5+Lr9QyMYBln0VLRaHke4PUMDTShQYwQeXzOUwP\/AU0+FJNpJlcLAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/wall_switch-1335897436.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by wall_switch
	"id"				: "press",
	"label"				: "press",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.class_tsid != "esquibeth_button") {
			return "Press";
		}

		return "";
	},
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
	"no_auction"
];
itemDef.keys_in_location = {
	"e"	: "press"
};
itemDef.keys_in_pack = {};

log.info("wall_switch.js LOADED");

// generated ok 2012-09-13 15:51:31 by lizg
