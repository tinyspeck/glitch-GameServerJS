//#include include/takeable.js

var label = "Potato Seed";
var version = "1347677151";
var name_single = "Potato Seed";
var name_plural = "Potato Seeds";
var article = "a";
var description = "A packet of tiny potatoes. This can be planted to grow <a href=\"\/items\/213\/\" glitch=\"item|potato\">Potatoes<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 40;
var input_for = [];
var parent_classes = ["seed_potato", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "potato",	// defined by seed_base (overridden by seed_potato)
	"produces_count"	: "18",	// defined by seed_base (overridden by seed_potato)
	"time_grow1"	: "6",	// defined by seed_base (overridden by seed_potato)
	"time_grow2"	: "5.5"	// defined by seed_base (overridden by seed_potato)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	return out;
}

var tags = [
	"seed",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-27,"w":23,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALMUlEQVR42r3ZeVDU5xkH8Pzfdmyn\naaft9G6TppNpzaVpNCnxjMY6mjTRmMQQo8YYTAkmES9YiFqqgiCIiAgIisi5XMsNP06BZS+WhYUF\nll0Wlr1gucEjfvv83mVX1siVztSZdxYcnfns8z7X\/vaxx+b4c3\/cxM0834z1cfeGe7g7QzpuaqCT\nm7K1cxPmVm7MpOLGjApuuFfKDfVIuCFdPTegreVsnVWcRVPBmdtKOVNrEWdUFXJ9yjyuV5HN9cgy\nOb0kndOJb3La+iTuVlZI6GOL\/YMJE2ae+2NG3Bsx4O6QDrcHuzBl02DSosa4WYWx\/iaM9MkwbJBg\nSN+Awe5bGOiqhrWjApb2MpjVxehvKYSxWYTephwY5EL0SNOha0xBd8MN1GaFcIvDDXYtuT9qwP1x\n4yOAety2a3F7oBNT1nZMzECO9ikw0ivFUE8j7Lp6F9TGQzUcKJowtRJWVTADmwVxYdTigHftHR53\nB9odwEkr7k9Y8M24mY4J98b66Rhxd5TOSB\/uDBtwZ6iHDsH56Np1mBrspqPFJL2JSVsHJqz80WCc\n3tC4pY3eEL0p9jsdWye9dgkWBbxnU3vetbXim+koUv7Rz70sgvdGenB3WEegbtzhI0nXfXuQojnQ\n4bh2QvBXP2FpxYS5BeMmPrrNdJQYNTqjLGOR5lNizKJBY2Fs\/OIiOKAW3LG2sGt9gOvBvWE9y0E3\nHH\/VAxrCEczaxq6cx4274QhmVBBO7sAZHLhhSoUxcxtSwrwWd8WjTQGCUUUAJtVnMKE+zc6YKgjD\nylMYlJ+ATRoIi1iA\/no\/9NYeQ0\/NEXRX+qKL+wodpV9AXeyDlkJvNIs+gyLXC7LsTyER7kN9+l7c\nSt2DmuRdqEzyBJe4E\/KSs4gPfGNxQGnMWoHk8jpIr7zOjuTKRogvv4b6S+tx6+JaVEesRuX5V8GF\neqAs5BUUn12JwtMvIT\/oReSdWo7sEy9AGPgcMgTPIM1vKVKO\/QXJR57Gdd8\/I\/Grp3D14BOI+\/yP\nEJ5eh\/qsr5F0dtfigKXBW7nkA08iyespdq5\/+idc2\/8kEj95Agn7\/oD4vb9H3J7fIXb3b3Hlo1\/j\n8oe\/QrTnL3Hpg18gaufPEfnez3Dh3Z8iYsdPEP7O4wjb9mOEvv0jnHvrhwj55xKcfeMHOLP1+zi9\n5XvIDNqBYK+VWBTw5oEn\/i\/AkG2PfzfglEnGTVmUj6jUB8UwuchiGNKLWW+06+pYf2wpvgg1Fwe9\nPB\/Be59ZHHDCKLNPmpsWUanKWXFDPWI2XRiu24Eb1NZSA6+h1zoYVGUI8\/bAhS9W\/2bhwH4pJk1N\nLGq3nf1tJs7cyqbHuMnR38ac\/W0aN8zj+KjNgaNZjUFdAzoasxHuswqXj2z0WEQEJZg0Nz9ovi7c\ndPN9JO5B83VeqRuOh2lrHKOPcLaOSgKK0dmYg8gv1y4ciEHJkvG+Rhq\/ygeTYSbO9AA3OgfOPo1z\nRe0hnFVTQcB6tNelM2Cc\/+YtCwJO9os9xnobMNGv+O7FwHB1c+IsmnIM6hvRkBuOqEPrEe+\/VbBw\noKEe4wScWQz2zkqYlZmwNWfA1iLEgDp\/wcUwwMPo\/\/Prl5W2Gkt7OVvDBvUSiPPCEX14IxIC3lwg\n0CD2GO2pI6Byuhha0NcQC0X8NujT30N32rtoT9iMlrjX0ZHt891wbWVs9eJzsFEUgZijm3DtxFsL\nA44a6gQj+lqM0xXyxTCgTEHjhbUwFX0BMyeAsdQf3TkHGLApZgOak3bCKE12w7ld6SNxJWyJtRsU\nKEs8itjjm5F0aptwYUB9rWBEV0PVKWfFoE7bj9bEt2GtCIC5nAf6wVB8DC2xBLy8AdKodWi4sAaS\n+B1QiwKhb0j8Vr5ZNY4rtVDUzOoSmAhHHwNg75ET8AjiBVuRHPTOwubxMAGHddVUADJWqZLIddCk\nfMSApnJ\/9BFQX3AYKgIqaIGQELA+Yg1qwl5FZcjfUXbmZRT9+yVURe+ALOMoNFUxjrXfiWt14Ppb\neKAU3LWjSAh8Eymn31sYcEhXFT\/cXemq1PrwNdALd8PiBJb4QSvcT8CNDuBFHriaASsIWErAQgLm\nnXgR2QHLkOH3HLJPrYFCdGYaV0i4AoYd1EtRGOPN5x\/Szr4vXxhQW8ENaysZjp8MKtrbWhPeoOv1\nQ3+ZP3oJ2H5jO5ppBVNE88C1qHMCgwl4eqULmCV4AenHn8PNI89AGLQBDRkChjOq8glaggGqYuE5\nTz7\/kHnuw4XN46GuCo7O9NiSQlsUCDntgYa07egVeUOXtQ\/q+E0MKI9ej0YeGL4a1aG0Hwa\/ghIC\nFpwi4NfuwJvHX4To\/LsMx39g6ueBukZkh+2i\/NuBrLCPFgjsrJDbu8pdk8GqykFd2GrokrdCe2ML\nNImb0ToTGOkEergBc79eDiEB0wiYfHgpA+aGbidcHvqUuZST5bB21SE3Yg+ff8iJ2LswoL2zHHaK\n4MzJ0Jy8F0qqWG3SFmovm1B3YR2U1GJkFFkxAW+Fr2JA0cmXcM33eWT4L3MA\/Ql4bBrotwK557Yx\nHP9x00TtRifLQX7kx5R\/O5EXuQ\/lsQeXzg\/soA5PwJnNl58gNSGvsquVXdqA0rOr3IHnV6HqnAfl\n3kpa8ZchK2A5cgKXI5OAqceexQ3fpcg89RoqE30YrleRTUCOAQsv7UcG5WF+1H6UJ\/rMvzAMdpRS\n9y\/\/1mTQV0WyPGtP+IerSUsJyPfA2mlg+dmXURy0Avkn\/0bAZSz\/Ir2eRtLh5yEK2w5FfjDhstiT\nBbOmEjp5DkpiDkBI+VcY7YWqxK885olesceAphgDFMVvj61qdJaHUdtZ7QDOaNKVhCsK4nNvBb2u\noKumFhPIt5jnkXL0WeSc2YSii54unEGeCRM18LaqBJTFeSMnfA+KY\/6FmuuHPOcHthfBpimddRPR\nNyZDlbzbrUmLTq5E4iGqWL\/lDJhL13vF56\/06e4ViII3g4vdD3VFtOOZjCyTPZexdNagvTIORdGf\nIu\/CxyiN\/Ry1yYcF8wJtbYUELJt1TXKOrX5VHjQFARBHbURd5EZUh28AF7YepSHrUBq6CdzFHeCi\nP0Bjhh+6xcksaj2yDIbTS9Ng7axFe\/VVuuLPkH+R8i\/+IOpSjs8NtLXne1ppjeKBbBOZxrmG\/TTu\n4bGlq7+KrqpL6Ki4CA0XibbyC65iMLBrdcfpJKkUwVr60HQZZbHeLP8qEr9EQ5r\/3ECrukBgbc2H\ntb101h3OgXPAnGPL2Xz7WI8jWFO2W765cBIHTk+\/mzuq0VJ0HhVXD1L+fYaq674Qpwdw8wItrXm0\ndRTPusM5cfzzPjeccnacnuFS2fNAXeNNAmZSFVdDXRqBqmtfsvyruXEEkswTcwPNrXmh5pZcWNRF\nM3DTa9L0DufCqZw4x2Toa3LgDNM4VgwMl+aG4\/NRL6UIaqrQRsCaJF9H\/t08BlnWybmBJlUOZ6bR\nZqarsz6cb244gqlELlyvG84931w4sQOnbUiCgf493wdbC06Di\/+cWo0PGlL9oMgJ6p4HmMWZmrMI\nkTvLDlfgwDU\/hJujGNhjXh7XcIPhtPXX0UvpwANb8v+DzJD3IYrci+prh6DM+8\/c89ikzOL6lUL0\n02ibvxhy5y0G55XOxPFgfszxwLrkw8g5v4tNk5rrvnZ59gnvOYHGJqG9vykTxqYMGJVZ\/3MxuHD1\nSQzIR86J4zfq0hgvFER9wldyqCTVd8m8c9ioSOf6nEeWSodem3K4PpXI8RUC\/cx\/jUAwroc\/\/NcJ\n0gw66RxFjE4K+2qB\/l6mlwlVemmmSi\/PVvWpilSEUlm6brmOoSlXmxexmyu74jXrM5n\/AmsNVvGP\nZ0Q5AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353247-7800.swf",
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
	"seed",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("seed_potato.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
