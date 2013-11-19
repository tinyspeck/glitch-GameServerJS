//#include include/takeable.js

var label = "Cabbage Seed";
var version = "1347677151";
var name_single = "Cabbage Seed";
var name_plural = "Cabbage Seeds";
var article = "a";
var description = "A packet of cabbage seeds. This can be planted to grow <a href=\"\/items\/129\/\" glitch=\"item|cabbage\">Cabbages<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 26;
var input_for = [];
var parent_classes = ["seed_cabbage", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "cabbage",	// defined by seed_base (overridden by seed_cabbage)
	"produces_count"	: "14",	// defined by seed_base (overridden by seed_cabbage)
	"time_grow1"	: "4.5",	// defined by seed_base (overridden by seed_cabbage)
	"time_grow2"	: "4.5"	// defined by seed_base (overridden by seed_cabbage)
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
		'position': {"x":-13,"y":-28,"w":23,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALTklEQVR42rXYeVCU9xkH8MxkptNO\nmtqmYzRKNIlJTOIRa6u5PCaTSZvYJs1pTYxFm4hGowYvFA2owRhNvC8U5JBDbnaXQxZYXpBrd1nY\ng2UPWGAP9uJaTu\/47fO+CwsryNGZMvMM1z+f9\/k9z+953n3ooQd83et1MIPjlx4rc7fTzNzuMDI3\n2wzMzVY9c92pYXocaqbHpmQ6m6qYDrOM6TCKmbaGUqbVcI1pri1knLp8xqERMjZ1DmNVZTJNCj5j\nrkpjTLIUxihNYBrEcUwZ7+jxh8b7hesODI57PTbc7bLgTocRt9rrcbO1Fjeateh1qtFjV6HLKken\nRYYOkwTtjWVoqy9GS10hmvUiOLW5sNfkwFadhSalABZ5OsyVKTBWJKJREo9S\/lFmfLj2+gn3eqy4\nx+GcXFAWcbfbijudFtzmkA2ENOB6qx69BO1x1KCbgyoIWoUOcwXajRK0cdgSwl4DZRQOnQgOTR4H\ntlZno0mViTLB6fEB77g0S++0asEi+3G\/9NgpbBzybncT7rDZ7DRz2NsdjRQm3GLhLiNuuhpxkx7g\nRpsBN1rr6CEoWmrR28I+jI6yTplnf2\/Wo6elDrLcqPEB77Zqfe+0avBLt4VwNoJZ6ecm7ojvdpkJ\n1odyNXDHfavdgJttde5jJwR79NebNfRsNeh1qCmquTLotinRTRnuslahq6mSK4luhwbZkUHy8WWw\nTRt8u6WGq7sBnBl3O00PwNUSjmAtOg+utw\/XY2dxBLMpCCcn2ACuk8qABUaGrMS4gFl1q4MpILCs\n8wTPvBY805dIN65BauNqpDT4Irl+FZIMK5Fo+BwJdSsQX7sccfpPEav7BDHaj3BZ8wGia95HZM17\niFT\/HRHVyxCuegdhyr\/houJtXJC\/BWF9EE4d+Ov4gCdUC46fVS3EidrX++I1HNO9iqPahfhZ8xcc\nqfkzDqvn40fVPPygnIuDyjkIkc\/CgaqXsL\/yBQTLZiJI+hy+k8zAHvEzCBQ\/jV1l0xFQ+iR2lEzF\n9uIp2Fb0BPwLJyGyeg1+3rd0fMA94tlMoGQ2tsnncrG1ag78ZbPxbcVsbJbMwqbyl7Cx9EVsKH4B\n64tmYh3zPPxEz+GrvGfxpXAG1lx9BquznoZvxlNYJZiOL3jT8Hnak\/gsxQf\/SpqK5QlT8Gn8E\/g4\ndjKOFP4Hu7fPxZmNr08fF3C39P8PXB7nwwEPbXoFp\/zfXDpmoM4Yx+jMidDZBVxobXxorTxomtJQ\nY0mF2pwCtTEZ1cYkKBsToaxPgMJwhSIe8tpYVOljUKm7jEptNGSaKFTUREKqjoCk+hIkqnCIlWEo\nV1xECUWBOhzHvlmEc\/5vjx143VbluuFUDnRqm3enXh\/SqaqhnWpxd2qHWcpNF5dRTFHOTZn2hlLu\n8m5vLIdJlYsTm5fg3I7xAO2VuOFQclfIrb77zQvn7Me577cemxvX1YfrHA7X6I1rM1yjKVOOugo+\ne7y4sPsd33FkUIYbzuqBy9eD67t8nWpvnLUfN3C\/DYdrayjhZjQtEhRFNAqlMFQIcHbbWwgLXBY8\nxjksm9BrraD9QDUwGQbjRpkMHM40gPNkbTCurohbJNrp\/9rSBJzf+TYu7f3H2IA37NKlPU1SXLcr\nRpgMqgdOBhbnGg1HS0NLbQF3xJKMk7iw6x1EBr0\/DqBFjF4CjtYMdnMuDA3xqKuPhb7uMnT6qGGb\noR\/HZq2llqGtpoBbw9pNMkgzTxHwXUTt+yB9bECLdGm3uZyAqkHNoPZqBqclH6K6dYhWL8AlxXxc\nks\/DOfEsnCp5AccKn0Vi2Scw6XmeZmDrzYPTu3G0yHI1WJF1GhcDlyFm\/ydj22i6LeXBXaZS9BLE\nas6HShOLam0MEss3YFPqFOylizhO9xoXLPCKfiGiVfO9gD\/lP42juTPhd34iPgp5DP6XXkRA1Hwc\nSXgXzTo3jl1i2xqlyIvaifC97yE25NMxAk2lwV3GEjQ15mB36nP4QTINB8XTEJg\/Fd\/yfGgJeI0W\nhUXIsCzmgOmNr3uAYbI5OF06kwMeynkS+\/hPYOXJ32H5yV\/hw6MP48OfH0aF9AKHo9cAuMxyiKJ3\nISLon7hyaMXYgZ3GYiiro7A7eyp+lE3ngEFFU3G6Yh6SG5bQ9rII2bYlyGxajBz7Etpy3kBi7UKE\nV73syeCPwmn4PnMK\/CJ\/6wF+RtiqyigOx27ULnMlmJhAqr8PkXj487EtDB3Ga5GdjUVwUASlzfFk\ncF+xD8Kr59PatZQDskcssCxCrpN+r30F52m56D\/is2Uv4hgzA3vTJ2Hl+V9zwICYhUjM20449v3k\nKuzqbGqSSgjDtuDygY+R\/NOqMQIbCpnOhiKuGVobJUjI34QgkQ8HDCl+igOmmxZzwITaVyEk4OAm\nCZXOQpRyPkKyfbA28lEOuOLUb5BxbT\/hcjicjXD2GiHaqIuzznxF9bccqUd9xwisL2QoPGMrr\/yg\nB7hXNAVHyp7nUCn1b1D9vQGhww2MUMxDnGYBFyE507A+ZgJ8wx7hgKupWQSFQR4c+3Znr6EmMVbg\n6vl1iP9hBdKPr0HeBb8JowMNhXJXfYHn8pUrI7yAATmTEZA1mTbjuRC1vMkBs61LIDAvQrLhVQRd\n9cH6uN\/jq6hHPcC1YT7gF+z14KyqDDriHAJKkXtxA1d\/\/JNf0s+bRl8YXIYCuOoZz2QwaPhDgNsE\nj2NL6kRs501GJG3VWdbFiNHMx3bBJGxKemwIcGvMyygoPky4TA7HvhvbqRaNVQIIQ7+m+vsCGWf8\nUBDhPwZgHd3wdMTuseUeWQey5gwL3JDwR\/hd\/gOOlcykjqcVPn3iEOCq0EcQnPIWdJVxHlyTgg+7\nNp8D5hCQrb+sc+vHBmyvy6fbv8BrE7mS9zWCCqc+ELiNMrczc9KwwO3xcxGa5TsIx+M+WbDTy7tR\nzkdu2Eau\/nJCN6IoepvvKNnLXdpWS8VLWRy8JlnpbwGpM4YFfkMRKJwyLHB99BQcFrwHfVU84fge\nnEWeBjtNFH1JDESXNvfXH4pjdgaPDtQL0VqbP2QTUcmjEZz8J+zImuQF3Jr++LDAjfRCdC7nM1TL\nor1w5qo0ilQ49IXQF0WAifRHxum1yL+0BaVxu0YHtupy3MBh1iS7VoRc0UGEFizDzvTpHDAgc7IX\ncEvyROwTLEBG6R40KFI5nMWDS+U+NDJVJsOhK4C+OIo9VmSdpfojaHli4MjAVn22b4s2m4AirzXJ\nvcMNrEnuYZ8HnSIOIsle8Mq\/RlqJH4rEIVDIL8KoSvc0gxuX5oUzyZIIyEBXGI6S2B24GroBhdHb\nIU76LnJEYIv2anCLJhst+vwR1yQWx87T\/slg77\/fBl0jg+vNg5Mlw0g49mM3Z10J1MITKLuyC8KL\n3+BazE5IUoKZUYHNmixaiXKH4gatSf3DfvBksKpYnGBIMwzg3DBjRQIapVfgrC2GNv8UJEl7kBe+\nGSVxuyBL3T8y0KnJPO6syUCzVngfjmC6PG+c+j6cUjBsM5iGwbmB16AXnUF5QiBEEf6UyUBU8kJG\nBjrUAsapFsBJR9fSV2\/N\/UfqhSOYOstrMng3Q5pXvXE4aR9OEk\/HnELAImiuHqYa3AkmahvEid9B\nITjoGgXIZxzVPALw76u3+3DV9+FGaAbuY14WR7AGSRwaxLHcA7BAvfAnuqT\/jUzaaIpjA6DMODTy\nRuNQ8Rg7daBdlcZlbGzNwB+xGe7HsX9jO5gFKvnfg3fcly7pjdQkO1yy9P1bRgTalOkuuzINNmUq\nRVpfI4y3GZK9643Fid04Cz1QP45dFgpoimSf80Nh1NbjsqSA0Vctu4oPG2WQoLAp0mBV0HcC\/c\/N\n0Fdv7Afl\/bD+MMt5dEGvZUThG0f82O2\/p5oPDvkoVFAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353158-4277.swf",
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

log.info("seed_cabbage.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
