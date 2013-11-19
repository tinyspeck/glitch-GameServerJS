//#include include/events.js, include/takeable.js

var label = "Firefly Jar";
var version = "1353110955";
var name_single = "Firefly Jar";
var name_plural = "Firefly Jars";
var article = "a";
var description = "This is no ordinary jar. Well, it IS, but once filled with fireflies (seven maximum: objects in space need room to fly) just looking at it gives you a great sense of serenity.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 100;
var input_for = [304,321];
var parent_classes = ["firefly_jar", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.num_flies = "0";	// defined by firefly_jar
}

var instancePropsDef = {
	num_flies : ["0-7"],
};

var instancePropsChoices = {
	num_flies : [""],
};

var verbs = {};

verbs.fill = { // defined by firefly_jar
	"name"				: "fill",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) {
			if (this.instanceProps.num_flies < 7) return {state:'enabled'};
			return {state:'disabled', reason: "It's already full!"};
		}
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.instanceProps.num_flies = 7;
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
	"sort_on"			: 51,
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
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.open = { // defined by firefly_jar
	"name"				: "open",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Your whistling will attract Fireflies. Warning: this can use up to 60 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.achievements_has('firefly_whistling')){	
			return {state:'disabled', reason: "You need the Firefly Whisperer achievement."};
		}
		else if (this.capturing){
			return {state:'disabled', reason: "It is already open."};
		}
		else if (this.getContainerType() == 'street'){
			return {state: null};
		}
		else if (pc.metabolics_get_energy() <= 20){
			return {state:'disabled', reason: "You don't have enough energy to do that."};
		}
		else{
			var fireflies = pc.findCloseStack('npc_firefly', 500);
			if (!fireflies){
				return {state:'disabled', reason: "There are no Fireflies nearby."};
			}
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var location = this.getLocation();
		if (!location){
			failed = 1;
		}
		else{
			this.capturing = true;
			pc['!is_firefly_whistlin'] = true;

			this.setAndBroadcastState('opening');

			// Start the overlays
			var annc = {
				type: 'location_overlay',
				uid: 'firefly_jar_'+pc.tsid,
				duration: 15*1000,
				locking: true,
				x: pc.x,
				y: pc.y-80,
				item_class: this.class_tsid,
				state: 'opening',
				width: "80",
				height: "80",
				scale_to_stage: true,
				config: this.make_config()
			};

			pc.apiSendAnnouncement(annc);
			delete annc['locking'];
			location.apiSendAnnouncementX(annc, pc);


			// Move the player
			pc.moveAvatar(pc.x-100, pc.y, 'right');
			pc.announce_sound('FIREFLY_WHISTLE_'+choose_one([1,2,3]), 0, 0, true);

			// Any fireflies inside? Let them out
			var fireflies_inside = this.getInstanceProp('num_flies');
			if (fireflies_inside > 0){
				for (var i=0; i<fireflies_inside; i++){
					this.events_add({callback: 'removeFirefly'}, i*0.3);
				}

				self_msgs.push(pluralize(fireflies_inside, 'Firefly', 'Fireflies')+' escaped!');
			}

			var energy = pc.metabolics_lose_energy(5);

			// Attract all fireflies in 500px radius
			function is_firefly(it){ return it.class_tsid == 'npc_firefly' && it.current_state == 'wandering'};
			
			do {
				var firefly = pc.findCloseStack(is_firefly, 500);
				if (firefly){
					firefly.attractTo(this);
				}
			} while (firefly);

			this.ticks = 0;
			this.apiSetTimer('onAttract', 1000);
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'open', 'opened', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function addFirefly(){ // defined by firefly_jar
	//log.info(this+' Adding firefly to jar');
	if (!this.capturing) return false;
	if (this.getInstanceProp('num_flies') >= 7) return false;
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return false;
	if (!pc['!is_firefly_whistlin']) return false;

	var num_flies = intval(this.getInstanceProp('num_flies')) + 1;
	this.setInstanceProp('num_flies', num_flies);

	var location = this.getLocation();
	location.apiSendMsg({
		type: "overlay_state",
		uid: 'firefly_jar_'+pc.tsid,
		state: 'open',
		config: this.make_config()
	});

	pc.announce_counter(num_flies, {delta_x: 85, delta_y: -125, duration: 500});
	pc.achievements_increment('firefly_jar', 'fireflies_caught');


	return true;
}

function canConsume(){ // defined by firefly_jar
	return this.getInstanceProp('num_flies');
}

function consume(count){ // defined by firefly_jar
	var has = intval(this.getInstanceProp('num_flies'));
	if (has >= count){
		this.setInstanceProp('num_flies', has - count);
		return 0;
	}
	else{
		this.setInstanceProp('num_flies', 0);
		return count-has;
	}
}

function endAttract(){ // defined by firefly_jar
	//log.info('Ending attract');
	this.capturing = false;

	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	this.setAndBroadcastState('closing');
	var location = this.getLocation();
	location.apiSendMsg({
		type: "overlay_state",
		uid: 'firefly_jar_'+pc.tsid,
		state: 'closing',
		config: this.make_config()
	});

	pc.announce_sound_stop('FIREFLY_WHISTLE_1', 1);
	pc.announce_sound_stop('FIREFLY_WHISTLE_2', 1);
	pc.announce_sound_stop('FIREFLY_WHISTLE_3', 1);
	this.apiSetTimer('onClose', 1000); // Close the jar

	var energy = this.ticks*5;
	if (energy) pc.sendActivity("Whew! Whistlin' is hard work. You lose "+energy+" energy.");
}

function getBaseCost(){ // defined by firefly_jar
	// Fireflies Jar = 100 BC
	// Jar with 1 Firefly = 110 BC
	// 2 Fireflies = 120 BC
	// 3 Fireflies = 130 BC
	// 4 Fireflies = 150 BC
	// 5 Fireflies = 175 BC
	// 6 Fireflies = 225 BC
	// 7 Fireflies = 300 BC

	var num_flies = intval(this.getInstanceProp('num_flies'));
	switch (num_flies){
		case 7:
			return 300;
		case 6:
			return 225;
		case 5:
			return 175;
		case 4:
			return 150;
		case 3:
			return 130;
		case 2:
			return 120;
		case 1:
			return 110;
		default:
			return 100;
	};
}

function getLabel(){ // defined by firefly_jar
	return this.label+' ('+this.getInstanceProp('num_flies')+'/7)';
}

function get_consumable_state(){ // defined by firefly_jar
	var num_flies = intval(this.getInstanceProp('num_flies'));
	if (num_flies < 0) num_flies = 0;
	if (num_flies > 7) num_flies = 7;

	return {
		'count': num_flies,
		'max': this.max_consumable
	};
}

function make_config(){ // defined by firefly_jar
	var num_flies = intval(this.getInstanceProp('num_flies'));
	if (num_flies < 0) num_flies = 0;
	if (num_flies > 7) num_flies = 7;

	return {
		num_flies: num_flies
	};
}

function onAttract(){ // defined by firefly_jar
	if (!this.capturing) return;

	if (this.ticks == 0){
		this.setAndBroadcastState('open');
	}

	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	if (pc.metabolics_get_energy() <= 10){
		//log.info('Not enough energy to continue');
		return this.endAttract();
	}

	if (this.getInstanceProp('num_flies') >= 7){
		//log.info('Jar is full');
		
		var pc = this.getContainer();
		if (pc && pc.is_player){
			pc.achievements_increment('firefly_jar', 'full');
			pc.location.cultivation_add_img_rewards(pc, 25.0);
		}
		return this.endAttract();
	}

	// Attract all fireflies in 500px radius
	function is_firefly(it){ return it && it.class_tsid == 'npc_firefly' && it.current_state == 'wandering'};
		
	do {
		var firefly = pc.findCloseStack(is_firefly, 500);
		if (firefly){
			firefly.attractTo(this);
		}
	} while (firefly);

	this.ticks++;
	if (this.ticks >= 2){
		pc.metabolics_lose_energy(5);
	}

	if (this.ticks >= 12){
		//log.info('12 seconds');
		return this.endAttract();
	}

	var fireflies = pc.findCloseStack('npc_firefly', 500);
	if (!fireflies){
		//log.info('No more fireflies');
		return this.endAttract();
	}

	this.apiSetTimer('onAttract', 1000);
}

function onClose(){ // defined by firefly_jar
	this.setAndBroadcastState('closed');

	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	delete pc['!is_firefly_whistlin'];

	var location = this.getLocation();
	location.apiSendMsg({type: 'overlay_cancel', uid: 'firefly_jar_'+pc.tsid});
}

function onCreate(){ // defined by firefly_jar
	this.initInstanceProps();
	this.onClose();
}

function onLoad(){ // defined by firefly_jar
	if (this.state == 'open' && !this.apiTimerExists('onAttract')){
		this.endAttract();
	}
}

function onPropsChanged(){ // defined by firefly_jar
	this.broadcastConfig();
}

function removeFirefly(){ // defined by firefly_jar
	//log.info('Removing firefly from jar');
	if (this.getInstanceProp('num_flies') <= 0) return;
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;
	if (!pc['!is_firefly_whistlin']) return;

	this.setInstanceProp('num_flies', intval(this.getInstanceProp('num_flies')) - 1);

	var location = this.getLocation();
	location.apiSendMsg({
		type: "overlay_state",
		uid: 'firefly_jar_'+pc.tsid,
		state: 'open',
		config: this.make_config()
	});

	var firefly = location.createItemStack('npc_firefly', 1, pc.x, pc.y-100);
	if (firefly){
		firefly.fsm_push_stack('escaping');
	}
}

// global block from firefly_jar
var is_consumable = true;
var max_consumable = 7;
var consumable_label_single = 'Firefly';
var consumable_label_plural = 'Fireflies';

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.achievements_has("firefly_whistling"))) out.push([1, "You won't be able to coax fireflies into this jar till you get the <b>Firefly Whistling<\/b> achievement."]);
	out.push([2, "Get yourself a <a href=\"\/items\/702\/\" glitch=\"item|crystallizer\">Crystalmalizing Chamber<\/a> and you can use captured Fireflies (along with some <a href=\"\/items\/641\/\" glitch=\"item|barnacle_talc\">Barnacle Talc<\/a>) to make <a href=\"\/items\/701\/\" glitch=\"item|plain_crystal\">Plain Crystals<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a>."]);
	return out;
}

var tags = [
	"firefly",
	"advanced_resource",
	"tool"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-54,"w":36,"h":54},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJhUlEQVR42r3Ye1BTVx4HcGdnZ7Y7\nnf1j\/9jO7HS31mm3o9va+nbUqijWN1alqIgK8hKIPJPwzJNAICQhITEBAkmAhMCFBEgggZAXIQnh\nEcIjJASCgFWeKmrVnXX2j7P3MuvsbmcfrQTOzHfOffyRz\/2dc27O3E2b1tju5ZzdzMcHHf1vOb5z\ny+ZNG90QFC8nSMzHBQHUtX0AHX4I5CUGAuT8xyElHAOFKd+YSAkBxA0D0pICw3k554Eo99K\/YVJu\nHABFaadWj0vxQYCOPrUKLEj5BqBC94ENA5Ljjx0lxR8D1KQToCTjLKDDKARcTriwCnt7zMScBhHf\n7gAxwbvBxePbhjYUmBn5Nbh4bCvAxRwFCDYn+ghIu3lwtYpI4kL2gKjLu0Dsd3vA7Ys7wcXAraYN\nnYfZMCjh6j6QAwOjL+0CERd2gKyow6u46Mu7QSSMSgzdv4q7GfQVko0DjkwtflCYHvwGGWKkeiEn\nPwfXz24HqTAOfeufVUQSCeOvnfkCoMJPQRuCk\/c4tnY4RtrRsWcXMOEHQeiZ7YBwJ2AVSoYXBNJn\nRh5erV4UjDt\/5DNw+cQ2EB9\/Y1rnGOasO9A4PpXEFEra0hKCl6jY74CQjQXU1HOrMCTEuAB4Lh6A\nh38vyIw7B9Ax50BM2AlwO\/KqO72QodfabB+sK7Ch296GpRSosehoV1b8eYBDXQCc3Bgg4ecAETsT\nlDPTQTkjHZQxsCDl9kmQDCfyagBIQd+1XE9I7NLYHWHrCpQZrJq4zBxdUnLkEOrWCZAeewbg7wYB\nAhw8KgikRZ0CmOjTID3mDLh78wSIDQ0AN4OPgPjkJOPJ0LChLq8vZF2Bw\/NP02iiaig4MtaYirlr\nSI67MpkSfX4l4UYgiL9xHNy5fmw10dcCQGz4uTlMapQ1EZ3S9m1ElLkYUohMQ66AdQU6Hi5eNwy7\nE1lSWR6Fy68OjUuQ3sGmS5OJZEE2tZCDp9FZOQUFJYRCOi0GjSmNTMWUc+sgEpkvwLHqGjO0fX1b\n1hXYP7sYqB8aQ9WqWosfPJqDepzO0F6X68uFN2\/+7Hv58nPP4soXD1+92u5bXt415PXuVRmNR6H2\n9tC0PGpKRUtb7rqvYoNndte\/Ao29vcEI8Mnr1x++zdzKyke+77\/\/ZBC+\/haYSMxNknbo0esO1I3d\n\/8jkGse8BcpUquM\/FQgZumI25GXd7ZnE\/xxgjVIZEo8jJSq6bec2BGj2+KIQ4PSDh5KfCozOwKFs\nY2M71g3F8fl+ZVta+sTgm75Q3tiS2tiqFnl9U8JGjebk\/wMK5c1XQuNQ2CJxTYRpzHu6xdz\/R\/9t\nDBYX37fMP9498uqvp+XWgeAYTAamQ2+scXu90Jh3onJxeRmanJm5MzE1daZvZOSwxeHYr7VY9ter\nVHulCsUhBp9\/JpOcF4KjUGNi0WgsMhdbHaNhbc6RC0qr9zdrwk08efKh+8Vfwnx\/A6cQXFxGVqa1\nt0826naL6hWK21yB4FRVXV1gg0p1tKld97W603hIbYQD9y0dHYfrmlsDKuH7JWWVp+H3YhCBxghP\nxRHQSXhipm7Yc9X57IdvbbOPDqwB+GKf++mzSK1n4iJDICB3WXtqhlxuQRUkDxXU1p5oUGmOthkM\nB809Pft6BgZ29jmdX\/UOur5EervDsctot+9HwMgDVEgk31CY7PMEKjUsjZiLIbE4GQ02e4RxcjZs\nTUDP8gqKVVOH6u7tr3dP+Bqco6N5epPpGlIho8W+H8HAc22bZ2rqT1NTU5++DXKOXO8fGtphhIdc\noVYfQR6KwmSeJxYxolNIFCK1sipdPz4T7heguXdAZnU4K32zs4onz54ZFh4\/Zjycn7+5vLJybg7+\n13j0+PFnCwsLH8\/Pz29G+tnFxS3IQkGgtqGxvVqz+Ti84oNZQnEEsYSLSS+g5xaKatJ1nvsJfgEa\ne+w1WrOtpLBMEFUtV4ZbHY54l88XPb\/05NaLV6\/CVl68uP705ctry8+fX11Yfnrl+\/mlS5Ozs8Fu\nny\/EPjx8pd3UfUPWoopmVorukNgcbCaNmVsgkmQYvNN0vwA7u21ijamb9RaoMZvD+l2uqw\/nly7D\nFb2EZOkfgdGX\/ieQcw+bwyim0GCgbnwa6xegxmgWtupNTH8Ac7m8dByDnV8klmb6bQ6q9MbyFp2+\nyB\/APBhIYHGojGqZ\/4DNHTq+vKOz0B\/A\/Hv8DFIJt4BZI8vyG7ChTcOFk+8XIL8sI7eE5z+gSKHC\nyJSt7DqlmvKuQK1ZHy5XQyiehJfMrODi8\/n8omJJXbZfgEKFEl2laGZIFErSuwAdY6bwbntjolon\nyKpupOP5EhqdXcni8yBxrl+AArkyTVAH0UQNTYSfC5yYsYePeppQ9gFhtq6LVQCpSHQxlFtaKqVX\niZrK6OZJZ9yagcj2ii+VUQWyRtyPgdOPFkJm5uZCvQ8e3BydnIxwer1RTrc3cnB0LGLQPXh7zNd5\n1zUuwQ4OcfPNPfm8Ni26WtZCkAohGiRp5XJ7Ji3JAGz6xZqAZY3NKSXi6lyetD4LAVZCTTH1Gs3d\nBnV7ZlNHJ7leqWRWQQ2lFbW1leWSWlFZlUTEr6qpFENVgpb2ikqtmSM0WQur7f0ZHUbLHZuyI81Y\nI6c2S9Wcst4pAwaAj997J+DMD68vIkB+vSKFWSEkciS1GRReWTKrQkxkC8UspqBCXFxeUU\/j8lQU\nZnEnsYhuJNLoJnwBDYmByi7Ul1cV6qRyiq5JjTeZLWlOoyV6UqPL6JM2FShr29gCy6SNBsAffv1O\nwPvPXwa6lp5iefXyZOq9MhxPUkvEszmE\/BI+O4\/DqcljlzSR6QwtsYBmziZT7BgCwYHBExzobLwj\nLRvnyMkj2Blckp0vwvdIIbxVocrsbdIkW+Uaqr5aTlfWtt4rtd23EeEh\/uW7f0lYeHxM2mXNIrG4\nWe3m7rK+4VFlo1pTS+Xeq6KyOY0UJktDKqSbcij5NiyR2I8g0Tg8kr50MtlKZZMtnApyl0hKNtRA\nRJ1EQVQpNLxWrpgiaTCKyHNPE9a+\/Vd4PL8XGrouVao0GKd7XDb76FGXa2JCp9JqIahF1SyGoNaS\nCqGGzuPrKCyWjlzE7CTTi9vzWCwVs5QrL60qbpCrRQptl7RRZ1PIVSYxq7Wr6BZ4+env3nmB\/Kdm\nmpl5zzL1YHef736qwzddPDgxwRsZn2COeL18y8CADN5BN+i6rQq92dLYabbUWQcHuRaHs9jpcSsd\nbgfD4TUlu7zFe8Dz7b8F4Mv3f8pv\/h0W8iDUrE0bYwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/firefly_jar-1334684756.swf",
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
	"firefly",
	"advanced_resource",
	"tool"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "fill",
	"g"	: "give",
	"o"	: "open"
};

log.info("firefly_jar.js LOADED");

// generated ok 2012-11-16 16:09:15 by martlume
