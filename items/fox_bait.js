//#include include/takeable.js

var label = "Fox Bait";
var version = "1337965215";
var name_single = "Fox Bait";
var name_plural = "Fox Baits";
var article = "a";
var description = "A nugget of fox-pleasing goodness, filled with every fox's favourite flavours. Proof positive that you catch more foxes with Fox Bait than you do with vinegar (just in case anyone suggested the alternative, which on reflection seems unlikely).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 30;
var input_for = [];
var parent_classes = ["fox_bait", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

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

verbs.ignite = { // defined by fox_bait
	"name"				: "ignite",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Attract a Fox",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var ranger = pc.location.find_items('npc_fox_ranger')[0];
		if (!ranger){
			return {state:'disabled', reason: "Bait can only be ignited in Preserves"};
		}

		if (ranger.getInstanceProp('facing') == 'left' && pc.x < ranger.x+600){
			return {state:'disabled', reason: "Bait can only be ignited once a safe distance past the Ranger"};
		}
		else if (ranger.getInstanceProp('facing') == 'right' && pc.x > ranger.x-600){
			return {state:'disabled', reason: "Bait can only be ignited once a safe distance past the Ranger"};
		}

		function is_bait(it){ return it.class_tsid=='fox_bait' && it.is_placed; }
		var baits = pc.findAllCloseStacks(is_bait, 400);
		if (baits.length > 4){
			return {state:'disabled', reason: "There is already too much bait around here. It will confuse the foxes."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.is_placed = 1;
		this.not_selectable = true;

		pc.location.apiSetTimer('spawn_fox', 4000);

		var delta_x;
		if (intval(pc.s) < 0){
			delta_x = -60;
		}
		else{
			delta_x = 60;
		}

		var annc = {
			type: 'pc_overlay',
			duration: 4000,
			swf_url: overlay_key_to_url('fox_bait_ignite'),
			pc_tsid: pc.tsid,
			delta_x: delta_x,
			delta_y: -80,
			width: 150,
			height: 150,
			locking: true
		};
		pc.apiSendAnnouncement(annc);
		pc.announce_sound('FOX_BAIT');

		pc.location.apiSetTimerX('dropFoxBaits', 2000, pc);

		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'ignite', 'ignited', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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
	"sort_on"			: 54,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

function canDrop(pc, drop_stack){ // defined by fox_bait
	var ranger = pc.location.find_items('npc_fox_ranger');
	if (ranger.length){
		return {ok: 0, error: "No littering in the Preserve"};
	}

	return {ok: 1};
}

function canPickup(pc, drop_stack){ // defined by fox_bait
	if (this.is_placed) return {ok: 0, error: "This Bait has been placed, and cannot be picked up"};

	return {ok: 1};
}

function expire(){ // defined by fox_bait
	this.apiDelete();
}

function land(){ // defined by fox_bait
	if (this.state == 'bait1'){
		this.setAndBroadcastState('stink1');
	}
	else if (this.state == 'bait2'){
		this.setAndBroadcastState('stink2');
	}
	else if (this.state == 'bait3'){
		this.setAndBroadcastState('stink3');
	}

	this.container.announce_sound_to_all('FOX_BAIT_LAND');
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1159\/\" glitch=\"item|npc_fox_ranger\">Fox Ranger<\/a>."]);
	return out;
}

var tags = [
	"herdkeepingsupplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-38,"w":41,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKAElEQVR42s2YZ1CU2xnH\/ZzJBOxK\n9FJERU1GDRYEZAFXEIFFQNousLC7LL0vvSwdRAFpAiKsIAgiRVFAmquCgli4Xtu1hZQPmWRuQibt\nQ5KZf55zFOZ6Jx\/EcvWdeQaWYd\/ze\/\/nKf\/zLlr0BV2auhD1iYqgnkVf6lVRqigrzJNMf7GAVwfz\ntapY0cxnhXj1qk7nxZNGAYv7k+UuowNZ6sHLmWXXhvJm8rPFUCqE6s8G9+uHDVuvDRdqOtsTUZAj\nQWmxDEV5EtRWKREfK5qNiXL6vHCTY8dm05Pdka321oqcdqgd9m8XCIWmOl9EfnW2p\/QU5Ijh57NX\n8FkARgarpKNDFRqK2dGhSvT2FKO9JZvH2Wb17Mlq5WxqouuPW6HDw3U6o8OVagalHanBxM1W3J3q\nwtf3L83H0EA9okNECJILkZbsNXP1SsXWTw525cqZrQ11GWVD\/WWz17X1mJo4hz9\/9zv8\/W\/f8Xjx\n\/BaH679URwoW40JXJaIj3eF8YCeOFkhnOzqUny7v\/vLqro52tGNaFe3EFbt\/9yL+9MdXmLv+9c+\/\n4psHAxgd1KD0SNy8kn2XqpCRKoWPhw1qK+XaTwL3+5n7gpcvpmZvjl1Ew8kcTE1ewONHI\/jvf\/7N\n4Rgog7s90QnPQ1YYHW6aB7w1fgYtTWpSMx+pic5IT7A+8FHhfjszHf2bmWk8engD9TVhKC+2Qmr8\nBiTHW9HnxLfy7kJnBU6fyv3B3\/IRErAeZxpj4WxngPRkq\/aPBvf820kNg5uLgmwHRAUb4bCLHmyt\nliHQbzcaasNQUxWOmkoVRoc0b8GxaG1KgIfTT9HbrUZNhRgpKgE+ChwBaSYnevH0yQ1MTrXgynAh\nQhVGiAgyRDhFZuJG5KVvgsJfHx6H9CAVb8Fg\/8m34O7d6aGCKca51hQO2HYmgibIQbg6rxF86Laq\nmWKTt7pp0Vo0NIUiLc8MvjITxEcYcxWl4rU8fA7\/HKKDq+BycB2p+PaW37zRBNYbWdRVBSA33RaV\npW7wdDWQvjfc00fjUgb34tkE9bYLGBmsxxVSRilfh6BAQ+SkmsDP+zWcxHMNV2+fYBkszZYgQGL+\npjDaoB1twNXh6nnA823xXMGyYmccFC55v9l7ueeE6chQ2z\/mcu7B9ABVbBdVZSviowUIkxtCIdUn\nBfRwyHEV7GyX81x02K\/PAWV+lmhvLUJzQxIUvkbzcCwY3MnqAMRF7Hp\/wJHBJi1rJV9PX8X3IZma\nA32NXDGmHgMUWCyFt8c2RIbZIz3FC7lZUrQ2H8GxI1GQ+26H1Et\/Hu5idy7ys0QIlW+lhzSC2ENP\ns2C4np6KdT1dVRxq8EoLvl+9cxEZasEVY2rZ7F2Jxvo0jF9vQUtjEBVCHF69vEu9sA9XR9pRVR6P\n4gIZqsvDERthS2BbSD1jyKmoZAFGyC7a4bIgwJws\/\/yL3dV4\/mwSfb1VuHGt4y04Gm9IjF4Pme9X\nsLZcChfHjTQlaun\/ziAufB1UkcaoPaHigLdu9uLmWBf6L9dTC0pAhFIAudSUpwSrei8fI6gydkIe\nvkn\/neASoo21bs6rUVmuokUbcGvsLAYHGnH3ziCHa2rJgKenAQoyNyM1bgMc7Vdi756lON2QwacG\ng5P76eOAcAWmbvdyyJqqNJxuzEP3+QqMDDWj+XQuIkMoJagD7LdZNmturqv\/zurRzbXuotWQSnZB\ncyoNneeKMTHeTtXYg+vXunDmtJoDsKcPDjTAIadVfJtzs\/yoyhvh5WbIWw3Ly57OEjz6ZhT37w3h\nLBmGkzXpKC+LR3qqN1W+Ib+P5e7FCzvBqWIs1SIHPTjYGaK4UEZJXcpVfPbtOC00jNKjwbydMAim\n0lxbKcqXkWnoR1fHMcREHkRSvCtPD1b5bIuZcizOthSitloFpcycCmQNhNbLFlbF1KM0qigLqGId\ncbxEjooSH0ruMJoiY3yLWV4eK45GsMKOpsAvaCEbpCR60sL5fNKMkIMZv9HJVXv4YIgUHMGdqT4O\nd\/5cKTQNarpvJFW8kFqSHnvIhQF2dSRrT9UEksHcTkZgM1eL9bmaqjgOMFcoA\/3N6Giv5BAsBW7f\nOs+VZvH08RjPPRbsdwbHioTBscjJCkAAzW472xXwkazTvnOBzAG2NAcjMWUnlAEGENP4Yu0kPsaZ\n5mkfXr64PQ\/55JH2LbDvx\/S9Ply6UI3K4zFkyzIo\/5JRTSaCwfn67ITdvrWwojy1t9ObViqNdBa0\nxY31CgQFb0OozICPMRfKN2vL5Sg7Gk4L988DsqY9fr2V59oPAa+Nasj3laCtJYfyNoS2dD9ClUIo\nAq3hKtoEa+qdVCCzlrt0F2b\/OzuSoitKDsPX4\/VsZZOCTQzWt1gxFOYp8eTx2LyCDEY7oqEDUjlN\nilP0s4xDsWhtzkJBrj+OFslQXhqK6opYqOLcKH9tIfEynV29etFPFjxF+rrS9EsKaRQFGsPLfT2H\n2m+znLcNm72rSAU7jI91k3kYICd9ncONDJ4kK1VFvTCdtjQKTY3pFGmIokJIiNpA1swEhbliZKaJ\nkZTgQYcnW4icNr\/\/Ab2jLVbLICtKJXATGRPgagJcgUD\/PVSx3vMto7OjhFv4OcXmoig\/EKp4B5o0\nG+HrtYYOSivhLzHjcExBD\/df\/UEoNHr\/Q1Nvd4agvYWUaFBy55GeZA9\/n62Ii3agY6MHsjMDcLm3\njhcBA2SKMTDNqRRSMBxZWe6QhWxBcsx6PllcaTL5S\/YgLMQePp47IXLcIv1gF338qFtZVLAJTtUG\noLkxhEMqA3dRE7anrfIiT2jNlSo7puRRlC+lxv7687EjMlJ7A3nCr3gnYCki9bOAv68FmQPrD3tz\nVZRkpFOYuVlNdn7Wy02PrJE9nWtVCCcHInZbi0DJdsgDzBEXuYeS3QTJWbugUJryF0HpKe7U4J34\n2FNIN3A4tr0H9i2HTGoJX\/EOODubfJjFp2qdcaKbslHGjIAf5RDLo7QkJ5woVyBSuRMJMfv4WSRM\nYQh\/sT6EpJD7oV9SCoiQqHKH2Gsb\/46r02rueJJj1yOEDK6HhwEWZAz+38X60t49ugIWVMFqgcWS\nGVbBYco96GhLI0eSRZFNh+9N8\/PYZu9y+JHFDwnaz4tA4m3G1ctKNqEqNuYPKfVZyyeSve3yafqe\n2t9rrcuij3kdtNXVT4631tRUKjloZZkcgb6m1Mi3U25aUL7thp\/PbmrCW8jRGPACYeoxOGYo2DRi\nfdX3zWcr8yVY0AR510soXKyTmeTsEhthrfX33gIWvp6bcFi0HqIDBhA5rKKKX8vTg0Gwkx7LQ9ZP\nmbllwX5nwXbpk75AYqoe2Kcrtbb8mdrGUmeCbTlTx9FuBYdyoS1lk2jOkvEg\/8dSx8JMV2pquvjH\ne3HJFmOLWpgt0fAZ+wbIwmzxjKXZYi2DMt+t+1559z9MJ6ka8AWMwQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fox_bait-1335374495.swf",
	admin_props	: false,
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
	"herdkeepingsupplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "ignite"
};

log.info("fox_bait.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
