//#include include/events.js

var label = "Rook Egg";
var version = "1296064574";
var name_single = "Rook Egg";
var name_plural = "Rook Eggs";
var article = "a";
var description = "It is unusual you get to see purveyors of chaos and destruction in a self contained ovoid form, but here one is. This would make an impressive omelette. A giant one that tasted of darkness, and smelled like woe.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["rook_egg"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.smash = { // defined by rook_egg
	"name"				: "smash",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Do it! Smash it open!",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Smash with a {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		return in_array(stack.class_tsid, ['pick', 'fancy_pick', 'hatchet']) && stack.isWorking();
	},
	"conditions"			: function(pc, drop_stack){

		if (this.state != 5) return {state:'disabled', reason: "It's been smashed already. Any more would be overkill, don't you think?"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target_itemstack_tsid){
			var tool = pc.getAllContents()[msg.target_itemstack_tsid];
		}
		else{
			var is_tool = function(stack){ return in_array(stack.class_tsid, ['pick', 'fancy_pick', 'hatchet']) && stack.isWorking(); };
			var tool = pc.findFirst(is_tool);
		}
			
		if (!tool){
			log.error('failed to find other stack - wtf');
			return false;
		}

		tool.use();

		// Which direction are we "facing"?
		if (this.x < pc.x){
			var state = '-tool_animation';
			var delta_x = 10;
			var endpoint = this.x+100;
			var face = 'left';
		}
		else{
			var state = 'tool_animation';
			var delta_x = -10;
			var endpoint = this.x-100;
			var face = 'right';
		}

		var delta_y = 20;

		if (tool.class_tsid == 'hatchet'){
			delta_x -= 50;
			delta_y += 20;

			var health_tick = 0.83;
		}
		else{
			delta_x -= 40;

			var health_tick = 1.2;
		}

		// Move the player
		var distance = Math.abs(pc.x-endpoint);
		pc.moveAvatar(endpoint, pc.y, face);
		//pc.playDoAnimation(duration);


		var duration = health_tick * 3 * 1000;
		// Start overlays
		var annc = {
			type: 'itemstack_overlay',
			duration: duration,
			locking: true,
			itemstack_tsid: this.tsid,
			delta_x: delta_x,
			delta_y: delta_y,
			item_class: tool.class_tsid,
			state: state,
			delay_ms: 0
		};

		if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

		pc.apiSendAnnouncement(annc);
		pc.announce_sound(tool.class_tsid.toUpperCase(), 999);

		var anncx = {
			type: 'pc_overlay',
			duration: duration,
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40,
			item_class: tool.class_tsid,
			state: state
		};

		pc.location.apiSendAnnouncementX(anncx, pc);

		this.events_add({callback: 'onTick'}, (health_tick) + (annc.delay_ms / 1000));
		this.events_add({callback: 'onTick'}, (health_tick*2) + (annc.delay_ms / 1000));
		this.events_add({callback: 'onTick'}, (health_tick*3) + (annc.delay_ms / 1000));

		this.events_add({callback: 'onSmashComplete', pc: pc, tool_class: tool.class_tsid}, (health_tick*4) + (annc.delay_ms / 1000));

		return true;
	}
};

function onCreate(){ // defined by rook_egg
	this.setAndBroadcastState(5);
}

function onSmashComplete(details){ // defined by rook_egg
	this.setAndBroadcastState(1);
	details.pc.announce_sound_stop(details.tool_class.toUpperCase());
	details.pc.quests_set_flag('rook_egg_smashed');
}

function onTick(){ // defined by rook_egg
	if (this.state-1 == 0) return;
	this.setAndBroadcastState(this.state-1);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-86,"y":-108,"w":171,"h":107},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGvUlEQVR42u2W609TdxjHTTanZheM\ncVkyZUXlWi6llCK30koptGgpFQRsBihDwAZpkUKlSkvHrVSgUEAqxZabKCpDFBYMSjN3ybaovDDZ\nshfL+Q\/W13v13fmdgWFOJEWX7EWf5Mn55Zzze57P77mds22bX\/ziF7\/45X8hf3qfc1TZXNZ\/Yjwz\nM5XzpjYe3nNSp3LjPVvavHTP6X7dc1WBfLax9oxwK1Ej1717dwtH+gxQSThen+F+fTJfmisXz270\nfHKklZWvlKLs8+MmX21\/t9DtuePWU3ZLHTUz1okicbTvEZwYqqOi2MH\/co4\/fg+4NthmyjiSTEkz\nBJBlpkGamUZ92VT9r3RzuRGseG7kilQigFx2xGM2VGvI\/qWZVqpFlwVzrQyuPj2URyIpnwFHB+sR\nGRFsexmuQVu+IhIkQCxKgiQ9BZniVEYl6clMOWTweAGpCVwOj77yeTHeuNhIxESHgR0RjNCQIMiz\nRd6vbzShpS4TF6qOoKW+BLLUMN8i2NMkE0459YgIPwT3lVabUi5hDByVitwpSXFIS4kHgUwXJjKg\nRMlaVXCUSkvmUSmJcUhM4IDPiwaXw0Z0ZChjKyQ4COWl+bjhqIbutAA1xcloqMpBVPAnsz4BKiXh\nwilHJRRH0xHFDgEnOhy82EhPQnwMkhJiQSAFNKQwlc+AEiVrco88I++Qd3ncSGYvsREeehDBhz5D\nV1s9WnWZyE9j41yxCBWFKaBd+lzHQnlaGFyDRuQeEzMR4HIiEB8XxThOpAGSE7kMTGoSj1GyJvcS\nX8BFMXvIXjYdvVA6eocOBKLfWocOvRQnJTHQVcrBi9xPAH2eBMLg\/Xsw0l2Ey80nSS0iJiqMcUin\nGefPFqOyrJCBSVpVsj7M\/zuta3BkD9kbHnqAiV4Qax\/UZQqcLxOgVB6H8iIR3tv+DgH0bVAncw+w\ndgfsQscFKSaHm1FdWcI4SuCxcdutQXlOPObHqzA10swArSmJcFwsG7Ex6+DCDtK1x8LBoP1gBX6K\ni7oyVBUehlqVCH50IIGjtjSkd+3cTqXyg2Dv1OLB3DW0NZXj6+l63Js4DQ1d3I\/unIXbfpoBIkqa\ngYBx6I4laSVwZ78ogkZ9Con8GKY5xq524YeHt1Asp8sjhkXgiLq3BPjRBztJ4UIqCsdQVw1GevIw\nMVCAaacK2lMpGOstpNNfyESKaHRU6CpYCDpMajz19OD+1Dnccl3E94uD9L5zdDba8WhhEsbaPHz4\n\/o41wC1\/LgNoJZ8guksPw9qUD2fXcYzaT+D6UBHK8nmYHu1DQ20FcrLTmUaIoNNZXZGPRrUY4\/Rh\nyKGcvRoMdqhgaTyG2xN23Lk+QKc78M2it040q4ZwkLUH7XRNDnUq0VgtQuuF4+gw5OLOWCPmph1w\n9regQVuKu+P0jKsQwGKQoseci57WSlzS5qHLdArtplp8vHfPGpzvzbGBkFOiIIdHd68EWcJQ6NVC\naM9I4bDSsOeOwWkrx7CtBletxzFkyUV\/mwLKDDbMumPobK6BPCOOboj968GI2rZMZK6XC78ab2dm\nk7VJKdRVy7zDPWUoyBW8cEDqLu3wARQXiHBo317kiCNg1IrRbTwK68VsZAlCEBXyCVj7dr8Mhl07\nd1BGfaVmU5Cm85n\/KFC9PiPA3qFyuwcq6QZQrdAppAY6izE6WIWxoRrvRx9+4H3Z2Zru2PEuoxs9\nX6crJ5SSzQfzmEOncNkrsHzfwbHoTwQQOHe\/xjs7aVhZmusztTXmeXpbT8LdX0nXWR08C92m1cYx\nrTXPemXRgz0nK\/q1cO9tf3eF2CgvUSo2\/51yGDS3Ri9RM+N11PL97le2uqu\/WrNwq8OzdPfyyu9P\nlgJe6nDb6pBlnAfSaW7Ry1GUy6dTuP0FdJGCh7ZL+TBfKMDibAuT1ooSZemGWa2VCbtaVX83zy\/P\nHrF+e7a46RxydKlfVy+c1aia7B0l3qt0rY4PqXGmROxNT+Pbbo4YZhdnOj1PH7ttxN9mfsYGtfh2\nsffVfzcX67JZxjqZZsBS7BnpK6euWIt9+ohPueqFN69pcfd6AxZnjHg41+xdmjMrtr0tIXV4w6kz\nLc\/bPD8uD3nXp3Wtoa5Yzwgvm\/MVroGKV6bpmwdXSpfnLd4fHlrx5HEvnn477H32\/SRr40aVuo21\nWW9+CNJM5Lpwu0fhHlB756cN+O6BxfNkycIcot2Q9yItz3+6yXn+84Tml2f3Ns2A8bwM3eZCOLrL\nOG8t0qRuf37sEhKAtSi\/qpanXebSyWEdFr9qx0a2rtlrvDPjevy45Hh7peAXv\/jFL5vLX99Trdjl\nBiYjAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294965767-5665.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"h"	: "smash"
};
itemDef.keys_in_pack = {};

log.info("rook_egg.js LOADED");

// generated ok 2011-01-26 09:56:14
