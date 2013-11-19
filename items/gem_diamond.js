//#include include/takeable.js

var label = "Walloping Big Diamond";
var version = "1337965213";
var name_single = "Walloping Big Diamond";
var name_plural = "Walloping Big Diamonds";
var article = "a";
var description = "Yep, that's a walloping big diamond.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 3;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["gem_diamond", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gems"	// defined by takeable (overridden by gem_diamond)
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/gem-collector\/\" glitch=\"external|\/achievements\/trophies\/gem-collector\/\">Gem Collector<\/a>"]);
	return out;
}

var tags = [
	"gem",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-24,"w":23,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHqElEQVR42u2YyVIbWRaGeYGO2vfG\nj1Cbjqglm973I\/ACHeFH8COw64iOjm6quj2AcaEyNhibeUYDmtDAICE0z0qh1Jwp\/f2fmxJgwBSu\nwtUVHb7BCRGpzNSX\/z3\/PefmyMjX8XX8H4xoBd\/Y8xhbTmBiKdFfXUri8SKP\/WYAh0X84fqxTAuP\nIhoe+wr91d0MsJoElq8FQW1LKYx9abg\/Bkv4i\/yvGRgtNjGe0vuxSBU4KAHuAuDIATuEXE\/dhFSR\ngCbqriSs+zwsYBV\/8hd688W6qVXbQK4BJHXg9Bw41oBgGfAVgf08sJcFNtNU81OgV2CXM3j0IIDe\ngvnXQLGHSqOHeheoELLQBNJ1IF4DolTysAIEqKZnqCZBN9J3QCbV9x73r4XcitXGXek2cvW+iloH\nEBXP+VlqWWqmqGaMap5QzdBQTYLaCbrFaV\/7hJqSEs4cNHce3342WKiEP\/ty5qtwqYe03oPZ66PQ\n6OOMIAmqlqeCFQJqhGVOIlO3jouaRwM1vQR1ctp3B2quXAOU7yR\/fSVoB9pnQHpz3e\/siUaeAUey\nBUeqA63Vx06yjUOSdc0eZHT50TSgVC0TNj9Q82ygZpig\/oGJRM3toZqJHuaOm9jLmEptyWFJkUjt\nHm53p+rfOhJ6zB7XsXJyjilPCc\/2i\/AXTKydNvAmVMVcSMMRQUVV\/qFjQuXmUM2sqDkw0dEVE7my\nJhaPa5hy5fDMkcVb3msId1K10iRevwPSn22NetMNbeO0xos1THnLeOYu4aeABnfOwEq0rgBtgQqm\n+d1rynOQ1tExejCuqFkZqCkmEkWD+TZWSPrSmcUk4znhBPApw5c3ldqng9SRa\/J1jN+AC+e7Y45k\nEx\/4hG\/D53gdrGKGifHKX8YqwbYTLSxHdIKfK+BXvjJeeIr4j7OASWZ5KGuBippNqnne7vNYA+8D\nRUzvZ\/HSlb0V8F24+hGcmK7UVLMxcQHnSnf\/th1vYpVTuBSp4\/2xjvnDmlJr6UTHRqyBtSh\/jPBz\nCl7DjwScJOBTVwETjjx+YMYfEbKodxApNDDvz2PGncUrwt0F+G97Fkcl8wKuaMGpmeCM2Jjq34w4\n0h3PXqqtVFo\/a3IqG1gkmKi5w2Mb6lgdH05qmCfgrABS2Skv89NVxPcEfEPbhjM1uFJNBHK85rh0\nb8APrARDuMoArmFYuc1J8Yx488b4frYLe7qjnLoZb2GNqu3SwXuMTQKuDgEPCUhlZ\/wVBfh83wLc\njmoKcCXexU7KQDBdw6w3dzeg3QL8geUnXjUv4ZgibcINFgubMoe41EMjODNdiJoS+5kO7ATc4vSv\nndaxyBx8R0CZ+pmDCl4KoLuoIAXOk2lj6czAIsPLTmLzuHwvwO8JuHRUVYv\/EM6w4GRYrg6V+5qU\nM6oJUdOX6xK4A0e6hW1RVOWnjoUjC9B2YDn5BQEXWD7CzL\/NhIHVuIFlxkaC1yfOfxbwKUuJPOCU\np4JC3fwIrs1\/\/u6qWC3bYdm0qTWLleOgaCJQNAjYhZNlTqZ646yhXPyegNed7CWInw+zzandTBpY\nG4B6qOKH4E0XvyDcJGuhPOC0T2aiogC3Y3UF1+9bgM2OabtwMuHGBFAiXO4R0KSaBMxcAq5GdZWH\nV508r9Sr8zyDOWxgh7GVFAUNrBPSxbIyBJxmuzPDB7IRaobxI+Mq4CRDFwkvx2VrFqq0HgncYaWv\nAIO0vo+ArgHgplqGrhhl4GQXF7Agz3NnCTOA3GWImgLp5gwssJmc5bmzNNZrxl2Ae2f1IZx2c7Eu\n9zwCJxEioJ8\/vJ\/tKCdfGqWGd5KHQavkRUttBItyrqGqzT5BHQTdG6i5kzLhZP16y5y9D+ALt6Vi\no21M3Oxgyt3HoZLAWeGXH8xcA6SCCyoPq\/Ck6ohWDLXQhlTeiuoWpNRdB5sBe5qrAx9ygYrfF3CH\nuXiYa9zeebuT+mio0IkJ4IGowpvbU+Lk5kdOFrNEii1ECHhcMhCmqYIFgnFKJUTN4ZTvcbrXWXCn\n7lhmJnat+Cc73X9sZyd+fpdWbDwJ51sE5ALONVEqiizeQyc72O3EK12cEdBSsQtHoo6NaA1rEalA\nDbVcubKGMpCT95h2WQ7+FOBzZ97zr53s6L37wphmjEbyeizAor+XaGJ9CMgSeFpuI31uIFElXKEN\n51kNu4ztWA2b7IbWCblO1wvY0EDS0dwGOM2G0R6rjv+y\/S6LdaTUsZ3kdJVzkoc7dFpBNwjYQYit\ntJdO3ufmRCD3BJSQW4S8UDNuqSlV6Sqg9IW8PkbHjv7qjVNEM8cixaZ2lK2hwIJZYtcSLzYQLTCh\nWUVCGR1+Nn9OgjoGau4M1BRQUdNFNecCZbzcz8HLbWGja0yobuWhxik36lHN8GR1E6fcIAdoioNB\n+Bk+CRprjj3g24MC3vgL1qcvj5\/YOMz6clg55AakYWofLcIP\/prjHE9k0y574Nt2a3Jctp+yw5Nm\nVHo92QHqXdVC2R5UtU8aSMfoSbUfuw1yCCc7PGn5pc87b0Prml\/4FcitBmJjIxv1q4CyERKFkxdw\n\/VWq9mjkfzVku8geQBsCDuEKlnKPfxev38RAnFqPvDxSG\/sGPPXOL3hj8KUHlXxCuCdf35h+HZ8x\n\/gvZ1UKOpJrgrQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gem_diamond-1334609682.swf",
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
	"gem",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("gem_diamond.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
