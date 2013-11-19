var label = "OK 3x8 Cabinet";
var version = "1351897052";
var name_single = "OK 3x8 Cabinet";
var name_plural = "";
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
var parent_classes = ["bag_cabinet_ok_3_4", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "ok",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_3_4)
	"width"	: "3",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_3_4)
	"height"	: "8",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_3_4)
	"rows_display"	: "4"	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_3_4)
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

// global block from bag_cabinet_ok_3_4
var capacity = 24;

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
	"ok",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-89,"y":-227,"w":191,"h":227},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHC0lEQVR42rWY22\/URRTH+2Dik4mX\nJ0zYpfeCJhTbFTXlFqvQbbd767bbCxbQYKQQTVq5SS+0lHa37W53V3qlLeBW2gr6omApuorwQILh\nQV9UBDXqK\/4H4\/memfl1qfAgTDc5md9v5vx2PvM9c8\/IeMDvVrK68edkIJVut87WpH6dCaZ+g80G\nU3\/MBVN\/nqtN\/XW+\/j+GfJT\/Pif9b5Ph+1vTNdb\/\/ZIMRDMe9jewa93aqZZX7n50sERoSy6x6UPa\nNtzHZFny0L3f6P+abH5Z9O8ubMx4lB+UuNyxUXx+pER8cWQDpxdaF1NteL8ed4prfa\/d4wO7qJ6R\nzrdv5LL5zi3ip2TgZsaj\/gA4\/Ua+6HTaRI\/LLtq3reRUv4dcq6z38T3FYr7FYZV1ltnEsXKbCFfa\nRTelvZQX8WaK4xX07s8VN8Y9KWOAAMMft21dyRV1qPdQpQRspfyxd4osQPiwEVyYfODb517F1kbf\nGgO8NNPPgACAGrAQVdrllMr0e2SlgBpJA4QPwFEG0AHlByWPllEjGzeJ0707zQFCuZAKlVYEAADk\nfHrXgN3ldhH1yVAipD2UfliVxZDIQyN7GzebAZwfbWJArRgqsMIHQChUaWdIDaj7GtITgWwGGiTg\nqMrjxtUWiWSX11wfRCU6XCGX7HswqAKFAD+qAI+r0MIv5s9kxSOeTH5GHkegKs\/cIPm4MZ9DC1V0\nBWG3NK0KygB46X0H+wIGqgEU3QB+cX8WfwvVjY7iszvyOSzoR2E1ElGhHpVQEjAAvNjsYF89KACH\nMhjyAB6htNObYxYQKmlFBlSlUA0AYZU3tqdIXGguZkAoJX2l31gwh5+Hq7O5rKfKoIKzOwssQICg\nQqgJi\/mypFJuABaTgsU0jciRnu47WpPNz8PVWRzqYz6DgHMEiDDGGDCTp5ChQBYbQq0VxUryZUsx\nNyas1EM+VMNoxnPCLxt21GMwxHO7CliRoWr556hohCqFDWporwaU0wxURYMABsWGKJWKZ7IZVfAT\nAFKFUAKVoEKEDIYQI3QRBThPozikVo4TpDAacYK+GSPfybpcVj9OA8WogufeXM2KAK5fpacbcqnj\nS3VQIWAsQFJb52mlT9bmiKn6XFZ82QChYFz1oTPb88Q4jcyEX\/bFBFV6Mg0Q78iHchjBADylAFHW\n5V0GwJgv0wrvVJ2sdFgNFth9AUnlMeWPZ54TsT6bXEnOK8CIWg2g3KQCROUAGa2h9yYJGF4COEG+\np6hLjNRIQEzUvYE88woCEFAAnEgDRMgBM7XXwYAY1ZZ6ACQ\/WFwtf4Dvq85fHkB0+PFgtqUg+iVC\nz2FXgJhyOORUrgeIftaA4eUCBBBUO9OQx6CDaZP2ZBogDxrVgOGAVHG0ZhEwZDLEmAex39MjFhVx\nn1KjmqcTzHM6xG45zWBi52kmzT9RJaclo4MEKwn2g4m0uQ2TLuCgCPoglAIgVhIoCAMYfDn89RJQ\nryYdRpc6Wouxo0bL9YCYIECe\/6qy5PqqQgzAhILA\/BdTy6JcdeQsgM1rmzvb7G4GgLG0xR79C2rG\n1MoAxSaa5GYhoc4fgIoyaLa1J+QBQl2gtdIg4MyOAj6pyV2xhNTrMm9C1XkD+8GF\/Q4r9ENqa4WG\nRJV6cXUEMBpibFhxDgZExLOoBAwjm9+xISDAy\/tftDYEevVBQyJqW4Z3bCbaTQLiTIJBMuBZ3OrH\nlYqDqsI+UgUH9wUCxCkPvrC4agie9fa\/1zTgNAGGK+3WKU6fQZYeJbHUIcQdZfL2Iaw2uVBPd4Oo\nOie3uQ0BXpvtsI6dUKZfnebiqrPzsdMlD+PYbgGwTV2LaMUxhw6pORCHJvh3BNeLc\/0NBm8Wtq20\nzsa4OUCI9c4Zx8wu5yIg+mtIHeqxMUA5\/AdU10A0Ouo2mrlZ+HTkgHWzIC+LJFSPPh\/jtiHtdguA\n+m5GnwD13YxuEMraa9aLkdaAuZsF3M30qOuO7gqbuo+RKfqkBCyyAHv5+k1+gz7Hfc8lbyBQZnQe\nxMYAlUJFhFdC2q13bK9QjoM7JupOpzx2dnK5zbp66y5fvPXqMnFoup302W\/PBO9c\/dAlFgbK2C5H\nnGxfRZ3i62i5SA1K+yZWIa6PuMUPU35+huky+MEf3y0MOK3\/+vGU\/w7qeGjAv8\/X2W+e9H32bbxC\npNuVhDaX+A5GDbh6H0M+yq+wyW\/S\/4fK7qKOh+V77HBD0YobY55\/vh\/3inSbbS8VobdfmnaX2L3k\nV0K2mexVZaVkrysrLbA95Tq2yzE51rxJLP0fWGt9oYP8niF7guzx\/wW4P7ju2ekPtriPv1W882Dd\n2r3v+Z9v2etdc3Bz4Yp3qdylYGDbyCrI3GSA9qm0kqycbOtq25Pb93mfO9DkWXPoQO3afYfrC5va\nG1\/Yvb00ZyuVP436HgTyL\/7Z6iaO4+OSAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_ok_3_4-1304532968.swf",
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
	"ok",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_ok_3_4.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
