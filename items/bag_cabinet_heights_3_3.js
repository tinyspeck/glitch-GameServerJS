var label = "Ancient Wood Cabinet 3x6";
var version = "1351897052";
var name_single = "Ancient Wood Cabinet 3x6";
var name_plural = "Ancient Wood Cabinets 3x6";
var article = "an";
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
var parent_classes = ["bag_cabinet_heights_3_3", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "crap",	// defined by bag_cabinet_base
	"width"	: "3",	// defined by bag_cabinet_base (overridden by bag_cabinet_heights_3_3)
	"height"	: "6",	// defined by bag_cabinet_base (overridden by bag_cabinet_heights_3_3)
	"rows_display"	: "3"	// defined by bag_cabinet_base
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

// global block from bag_cabinet_heights_3_3
var capacity = 18;

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
	"groddle",
	"heights",
	"house",
	"cabinet",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-85,"y":-193,"w":173,"h":187},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKpklEQVR42pWYWU9j2RHH+zGKNOpE\nipSkl+kBmq2bYV9sFhsMNpjFZjFgY2MbzL5Ds0Nj6CXdrUlrJu+RIkWJoiiJOstIeeQLzEuS10j5\nKJX6lX1Rq9WT3LFUutfn1j31r38t59xz61bx9\/ro6PbV0wP\/84vD\/AeSYfxDefPyPP\/Fq4v8y8vj\nG93Tw6385em+3b\/ScXTen+vq4ij64Twvzp48uOXml52dfreykJHlXFq4LmSTkklOyVJuVtaX522c\n+1xmRuZm4za2upi169rSnGys5G5kd3NZn2VkPp3Q53OytbYgOxtLsr2+aFdkc3VB9rdXVX\/exve3\n12RxPiVri9ntjwIcDPXlo8MDMhYZlOmJqEyNR2R0JCyT4yMyMTok07GoJKbGJJWISTI+IbMzk+rA\ntIJNmHC\/ODdrspBN2X9nDvQZy6biJtznMklJxWMSGxtWR2bsvYnokNoa3v5WFnu62qLdHQ3S3lIj\n3uYa6fQ0iK+9SfwfkWCPVwK+VtVpNL0ub6MEulp1zKPile7ONpNgwC8DwYBJONRrgOOxUZWo3vfr\nuF9Gwr1mp7ur7cu+vqbb\/zPU8zOh\/8TH\/BLorBNvU5UM9DTJcLBVRkKtEh3wmERCbRLpb5Ohvmbp\n66qXUHeDhAPNplMYb9H3FHjrI3vOWDjQdDNX0N8gbQ2V0lxXLvOJoOl7m6ulqbT09v\/NxZOd+PXm\nYsSA+L01EvTV3wBEmAyAsZFOiY\/6ZGKoXUYBrSAA1d\/dqPotpjs26JVxfc5ck6o\/M94tU5FOGQt7\n7f22xko53YnLSnZQov1t166K5Xw3fn2wEZOpaJf0dNRKSL3t7ykYDXTW2qStDRV6LUhz3UOT+ppS\neVxxX+oel5jUVn9m13oVIuHzPJY+X4FtAI+GPeLR8eOtKdnIjcjYkNcdwBcnmeuL\/RlJaJhhZU5D\nMDPul1wyZIwl9J5nk8rExHCHMcMVJ0gNjMdsrF2SE92SivXI7GTA2ETnfUkoo+d7CdlbHZcRtwx+\nkc9d4xUgBjXH1uaHZXF2wK6Z6V6ThVS\/AcdwNtEnmXifpcHanFbkTOhmfF2Z2VqM2hUHw73NGuKu\nG4BpnevZcVqOtib1WZM7gF+9WLlmQgDCwtrckOytjFkoMLKl+ekYBCj5A8DxwXbZWR41Aei6OpQ\/\nSMoTZed4e0pWdR4cnp8JmjOABSDzbi9FNXcb3AH8xcuVPBPyMkwABiOXhylZSoctJNtLo3pfYHVz\nYURmpwIWakDhDAB39frsaNbYIWVwBIBcnY4wO9Vr8z5ZG3fPIABhIaXgCC0hwktCsbkQkZOdaaGI\nYJZq31sdsyQn5OTi7vKYvYPeyfa0nO3FDSjAhrTQuE5rAcZGOiQZC8jrp\/PmjLYs9wCPNict16Ae\nUFdq4NX5nKxmhyxcZ7txCyUAd5ajZgCAFM7TJzMG8GI\/KU+Vbf4DECdgjXcyxegktYBenmYsSq5D\n\/Oo8m3cmASB5hrGfnWWNtf31CQMJq4QGRmAUg1Qsz0gJGH9xkjbnXigInIbh9dyw5W96stecYnwl\nM+g+xADEsAMQdsiT\/bUJYwaDgAAA+UjVwmha85DcgzEA4hTMPT\/JGPu8A2NbOidpgS4A86pH3mpf\ndAfw5Wk6XzActL53qrmEURjcKyY+LAKQcaodMPRAjF4epCz8DkBjUhkEINWO88xJ6gCQOfbXY+4b\nNQzCEi9ndUKAMSGGqFKMYgQgjNF2uOLQcnrQWHVykHHYAwQAqXaWNiqbexo6+hSTrlTuAGpLyB9u\nTFro0toGnNyjp5HosAFAqhMQB+o9QMgrWMEgTKKP4BDO0BFg+6oYgVyy39oOOQgRrotkfyNmVUyv\nA6DTXsgligdQsAEr5CfGeEYxkadPVBZSA\/ae5asWE+\/sWp55bRwHKaio\/scWBeaaQWXsS3oYYaJt\n0AZgDiYxAkNHahQdgAIQhpa1EmETMOgDmudOuDfUSRhj\/ETHaewsBjiPjuscfP107trxeFqLhAlJ\neoACCla4Ej7AoUdOZab7bgDCtFO5h5uFMVYdtlowyLuwRhqhQw66Bqgv\/4oJaQfsQAC0qwBhkJZA\naE+1rQAA4BgAIDsXAKLP+CXrsIYSxhFYBZDTUwkxqUALI09dh5gqdhhkaSJH+A8gJ6\/4\/9KKZcLC\nfaBMOgCdHLN+qFfeR7inkJgHUESHBk2E6KOuARaWuinzlqR2AOE1RrknRICh\/VAcMIZxB6AtiVuF\n\/Dsorjy0F5r\/c11dSBEql8omKugN97W+cwXw+XE6z2Ssj2yJHI8phPlEyHYmgHhzkbNxcgsAy5nw\nDUB2PQAkCk4u6rwG0IBr+qCT1V6LLfI0EmrNu+6DjpFeX50xZ4mtnhIKZ3X4+eWCJXdny2NNfp+x\nBsBIyCMttRVyvpswhgEIIFLCAQiDOLagvfCkWEiuAbLUEca5eFB69BvkTA1dFddUkp17mNOdtxZR\nu1SW3DeBXVaS6rJP7X9upt9Sgo2Es7kAIKlDNGj+WbWB0zg3EGjMuy4SJl3UCgMgbFlYaS\/s73YL\nKwggyaH2pkfi99SaYZp7yN9oYzhYWGcLObij4WYlQQ8naTMUCqzzTRLqdgnwzcV8nnDgFV9gz4qM\nGRvFNgKrAD0uVjBrNBtQqho98o0ioHoBRy4S0rniBoQiS0322PaLd9BxDZClDo\/oUYP6DUyPK2wA\nIjfthiUNNrXibyo4qp+Rh8o8BkkH2HUAU6XMSe\/jOxk924EPddjc6LoGqEuSbfkpkqAySP\/KF1uL\nUzAw5gDkOQDY68Ew96ZXXHEoAieM08XPVgDyf0g\/nogIy6RrgHtr43k8Jwe79GOb8DCJIwC0FUSZ\ndQDScDHM+Jm2DXTeXi2aPpte0gE9AFJMRAVmAUjBFNLpOwAkJ8iPjtbqm00l8v4HE2Em3M4KwUoC\nM7CFUZ45yyFbs8J63auVHrbVh\/c4oyHf2Z65BqiN0wDibXN9uU3qAGOcZKcw2NbzUQQACgKAhJ0Q\nU1QYhkF2KzgHSByhtRxq8bACAZCVhdx0DZBGTWtI2AlXrX1wY4icZJNgH+EaErZPsMBz58QBgDyj\nmBBAscHlSsUnJwobBJxFfyTUZv30OxWJwyCMcNjD1gnGmMRpvOyGAbakY3jPN7R9E2u+wpjjBOxQ\nMIQXZq2tKPOwzkkXSykVv6Ef\/772GvdVDDOcbsEgm1bdq9k3RE7D4uyGabh2gKRtA7ZpHxi28xgt\nDMJO5Vub4fNVnSq0mEljf0UdcDYjzNXpeeQK4PdzqdBbqg4POR7joJGDSL\/3c+lu\/9wOJGGWA8ne\nrjrxeWvsOcd0seJJF0cbHFZyz8c6ZzGDyhbHef6iPkd42KBl8UXoba765lH5\/X3F8MNvA\/dJc21Z\nnI8XqgoGW7RIaqo++3v1w3u\/rnp47zdVZfd+W1V293eVZXd\/X1l69w8VpXf\/VFF6511FyZ0\/l5fc\n+Wt5yU+\/Lsidv6n8xZ6Zzt0\/Vpff+7ruUcm\/VP5Z\/7jkHw01Zf\/mhAsWKRZOWxtqSr9RHFUqHz9p\nHQw0PBjw1Y2XPfhxoOzTn6R\/9INPIjrsUelQ8XGMrdKnElIZUBlSGVYZUYl+IJHiODphlX6VoEpA\nxa\/S6amr+KWnoeJtfXXJQXtj5ZmOfe9DTP8FkZeyWQM+MIsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_heights_3_3-1304623173.swf",
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
	"groddle",
	"heights",
	"house",
	"cabinet",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_heights_3_3.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
