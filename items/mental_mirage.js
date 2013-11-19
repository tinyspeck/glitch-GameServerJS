//#include include/takeable.js

var label = "Mirage";
var version = "1337965215";
var name_single = "Mirage";
var name_plural = "Mirages";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_mirage", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-37,"w":38,"h":38},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALQklEQVR42s1Y6VIb2RX2G\/gR\/Ah+\nBB6BR+ARqJmJzWQ8MzhOZrFnUmSSTGpcwRZmEbKQkNCGBEjNvhhjgVi1dWtf0NJCrLbLOTnflRoL\nJMCVmh9R1SnRreber8\/yne\/cW7cufd7k6e6rLLW1slu\/w+d1mW5jLa9y2O2NHeqm40eSL3YkLabe\n9uC3K\/\/xVY46p+SqYgvt01goT\/ZwnsYjRfIqVZqJH9N88oyW0u+FeZUDP9+TFpJnutUsdeN\/sSle\n7jpgs4lTnStaorXcKQX2jyhRPaVQ5ZgWsmUaDWVoNnFmafnPWHgueaq+3EnwQwVayai0lq3Qer5K\nm\/uwQ9pgm0uUGWiFvys0FSuQN14gt5ynCaVETn4Zj6zSTOKE5hNnEkBf3sMVKZN+W6FX+xVaKxzQ\nYlblNUrsjBwZd5Pk4DVeZ6mj6c3mEjVwvvg+RasnlDg8pfTxGWVP3grLHL+l5NEZKXw\/fHBMO+oR\nbZSq9Jo3WcqrNMsemEoXyRbNkmEnTv0BmV6weaIHyoW9eHOPXCFEycFR8kSLNMEetYVyZNiOk2k3\nTas5ar8AcCn9TjfMP1qCadosH9Iubw63Rw5OKFo3gApWasACpUN6UzwQXvAoBbIGs2TeS5NxJ0lY\nZ3BTYXBRGuDvxfT7liEDCKTGbOLYMsupMs2GnGyZIuNRVdVvxWgmVRQe8RerwjsBYYfie50NoPD7\nSr5C8\/AYp4KLwzvK4EZ2U\/RyO0FYZ2BTFh7kArD8HkV1yxUt0xAvbItkaI43XsipImya+RJFcoX3\naTpVIonD6OHcQ0iswUwdXPICOGswz\/lZ9Rt3Ezp7MH\/BI28ydEfz3mVDzrb0IANUsTA2QJiQR27O\nRS+DGY\/lRQgdkZwwgLLsZURITew1I+ctwjq0pXDl73OBHCsaHU1Gy7enYxWdK1JUUDSOcFEZ2U3Q\nlJJnJijRPEfMHs6QNZQiczBBtnCWLKEsXlC5QGko\/VrOyMKT2NDAHsHmIwwYHkIIxTdf4z5+x3PD\n2zHijWkueWa5nNwoiAml4kdBjHN0guUjUXApFFudXrY555FSyOeZTIlcsRzpAhHGEVfPQcLtePu+\njQhpQJHoAKu\/ZLiH38zsxQm5oiIsl8kV185IyYIieckVvc6bA5BcrRVcqKHYQDVSklNIzokUG9iS\n6flGmHrXQ6Ar9XzR+dS7DiOX+LP1sHhAx2D7AjXAmvWxIfm5qOhV9oMOL9aKjJnI\/f2bUc7dvACx\nVa4ZGALFB4+h2JZRbLmyKDSkjKHOANgXAMGZF0KNBLWFitLwdlI8oNlzBot75r0suUJF+od3hbpH\nXfTAYFXuD4x0dz01nntwNfMfi5X5bSySFgUGECt1W+brRS5AgEI4fZzj7ti+KLjROk0hSnAGHIR1\nWrZXeMa9V2x\/PDZFsJ8d0\/S3iQX65+wa\/WslQN87vfRn2wR9a3LQH\/Wj9LlOr3723NCOF+R85iKo\n0vBOTBQZzFf\/BpFPpgrkSTI9JfbJWTdHnF+ICwT5PcwA+zdrYQbRX9n\/v3hu6PxCN0wwgOg2O+kH\nl49+e7VFTyZm6TsGCS9+NWyhP\/QZ8JxobfAyPI78G2UvOi8BccY\/Xnti7EG5wEWWF+yAIkThaQCx\n1jUA9R3nABkEwABU35sg\/Tw1L7z48AJAvQUAkcd9nH9WOUt2BmRTmJoioJKsaG0uZZ\/Dyt5UmOjl\nMrkjBXEf1HXZg4jEdeLjFrzS6MG\/2Cepf22PfpqcE3\/jHn7DMyLEnBoSqx7k7SALAsNe\/JxbkWPI\nNRC+G6KCezC+neHWOfiM1+BiU2\/sMti4a8jk\/2bETo+sbvpt7g09ZfsT\/\/3AOObvGhjRffZc33ZZ\nDAAkqh5VCc4EqcNLAOPkkAIYvnGN+\/gdz2lVjEg0qZpP+UwohTZWH7prBSkvbGfyRpj6zzvUR5Bj\n3Jk008BBSenr4UX+TirVnv+pb4+Gs23WvcyNrke4TbvZDuNOSmITuQUQKAQzAzLv1lql6OM7H\/v4\nYEDpccrlOy0XhfwG92BB6LJxFhFS\/IiW0++V1cyHHhTBWDDfUV\/s7qe+FBKd1+lwhgs6bnvSWDAn\nMSlLQ5sxFSEdCMjSi4DSboxGb1\/7xnbmojUmU4XbUeH0HcnckhTWgauseiVQAgP2xQ5FdSEE184P\nn\/B5thm8KxpBQLl51oGHHNG0EKXomQlu6FDQiYbG7kffTBRFcnu43bHIVK9qeU2M0Dt453PdcPf9\nAZOFO5D0tdEmceEpv0gr9HdpWXdvwNiJZ64emDIfJDRr9MlN7p9QGdv1Hor+iaa+xG1KYk2IruDg\n\/mmpkyvmEOi5q5lA38bglPv9RvrKYBUdCCzwaMwjbPB1sEZXfcMq+Ld1dcoHkpWZH4J1LlOmcdZs\nkyxMIV6nWbthsPHGyjQplzg3C+RkgDbWh6M8JkCsIvxNs0SdpjTC7xo0EegK4ED633NnAp+a1qP0\nxOkjvECNU\/XNIZ9igKZwSvRIczBVI9ZgjVgx1PgUBho7IC97CyQLHgNNoBpRhRCsEArNZK+3NLZM\neA+gHntmBOH\/MC7Rvxc2aJhBPrZ5Re9\/YvM1A5xOnPSAwbERPAIqEEo6hNm4IEDCewCHa3uo1j9r\nBBsX+hB5\/Ck9HQDRz\/\/qW6Qf3dP0lAGCMWz80obtpFBO9nBB8clHdy9UMZQvuAgNW2tP8JJdsP\/+\nOfvjmmU8V\/MBW8XCFd1+XYFw\/ukA8Mshs\/AglNCP7Dl4EWE2smMWWOEEChUhbidiWdGJIP0uLATR\nioEH3KSBNNfZHx6bZECzPJRzQfnRLRppBtc8dEu+eJntQJqSq5I7onY2epLbosLVSw8t48KL3zmm\nqGdqkda5ADHi7jFTQODilAHDPdRME5XVzmA+6DCn4rwEJvH4eH600YJSUMEL6YqYNzDsQzk7WM0M\nbMaUy89ymNu+Nto7H5pdPayGpJfrMs1zUWImgcDFkIYo6sT4IbcsvI+heWa4i4q6129s6zIaryRl\nMICThx0xkspFkavw+gvepHcj1Hldz3aFawLWnazpRaMouI+KBgdKTf8ICa9JLQ6L4K5vjGPqt2Zn\nd5dxsgkoDnygXKDnXJGanEL+8r2e3o1gB1d5jyOS5wlPbbOFC236naSwWR5Rx5XCuZi1hmpFh\/Qa\nqGtCvHyLpNb7Ae4eiJUFqUasSG5Irm6TQ3pgGGtvHJRYB3ZzJUsmFgcjOyk\/PNC7I19Ih6moakGB\nYYTFAZNPqQjxKhR2VKOtmuzSwozBqSmsjcSKpAY4KGhQAqoO7A\/C\/XLQJDUOTI0f3Ua0W78Vb+oK\n7qiqQz+fZqtxK1ctpwU8D94Fr2q6EAAh25rakgbwkXmcfplYpF+lVRaqfupd3qJfZ16LCmwYmPxX\n5Zib1UtjvuHUwc186mIeRRpA8sMaiV\/j1ZoHw80A67ylDC7tEpQxC1QWBTjzU\/nhfe4sJbJupuiR\nxX0u96\/qnwxCGmdxaw3mFGzqimTJyzOJl1uoU0j\/gjB0K3tdWY\/sXBycWgI0rIbboQstoSTFxDnh\nW9oCP\/E8O7qHA6Mcje8WRApo80jr09QTZZArcolnYNBP\/uSdOPaAYlrmHo9DKEdd9qMrmevKGt1M\n5DBXcUuA4Du0G+SAhfsyFpE4oREKVCfyY2wzTfdevCRIqKvUEdbAfCExhUwwDa0wz80z2LFwRhgm\nPUv9hEw7iNKUta5+\/NHUTbQPd5Seoa24cDdyA\/0XQLEQdwz1JrGKboO3hwexEV62v344Zah3qZEd\n7TAqKQpDA4czIvwPiJoprP1GuX75pP9TlLR2kq+d\/YGGnNFStzdWlbjn+7mahY6E4W\/INQgGZ6SE\na9XDPf5GcP8vn\/8CwInEGoFAqkAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_mirage-1312586776.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_mirage.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
