//#include include/takeable.js

var label = "Piece of Large Mysterious Cube";
var version = "1350087172";
var name_single = "Piece of Large Mysterious Cube";
var name_plural = "Pieces of Large Mysterious Cube";
var article = "a";
var description = "One of five small fragments that, never mind the laws of geometry, combine to make one large cube. Mysterious.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mysterious_cube_piece2", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "artifact_mysterious_cube"	// defined by takeable (overridden by artifact_mysterious_cube_piece2)
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1307\/\" glitch=\"item|artifact_mysterious_cube\">Large Mysterious Cube<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-26,"w":35,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKdElEQVR42u1YaVOb1xnlHzDtTBMv\n2Jgdg9mRkJDQApIACSEwmzGL2IxtzL7vMvtqEJvZLWM7sSHxUtt1Js0kpGnSmbaZ8KEz\/dbxT+BT\nP5+eewEnadomTaZup+N35s77vhewj845z3meKy+vN9eb6831+q6c1KCGnmuqXXePYXe207B7oyPJ\nM9Wuc020al2jTUn60Tq1fq4nyfHVi0L9V0\/z9K8VXLYlOKqhLBaDDYmY6dJhtFmDkaZEzPUZMd2p\nw\/qIGRujZsz16rHkMuD2uAnP1jJwfyYVC71Ju0su\/e6O2+L5yGN1fbiZ5vrdTvpP\/wDjHXHeiwNG\nh7vPMDvXa3y56EpGW2Ucbo1bCMiCd902bC\/YMd9rxMqgCU\/XHVgdTkHXJQVa+GF6rirQc1mB\/hol\n3l804zfv2rDjTsaTxWTcdKlRXxrm+lHAVsdN3hujFudYa9L+nRk73L0GsqbHeJsWo00aDDdr8WQl\nC7cmUrE1nY5lgpsnkzfI5GK\/AYt9Bsz36NF7RYnhOhW2xlNwo4OMNyRgrkeN9qpIVOSEoDw3dPff\nArZDYMuDZo\/4z5aup8AzacVgUxLWKN8wJR2ipOMtWky06TDVoYO7W48xvg\/Wq+GqVaGrWoHm8lg0\nOWMw2a6Bu0fHnyVg223BA3cKmsoioFec4DoJc+Ip5KYF7P5gxlaHTbPvzDn2Hyxkkxmr9JZgjtJi\nvt8IV50a\/QTRV5NAUBp0VCtxmwwONSZi4BCg65qKciagj8wNca+mMBKtFdG4aA8SYGDV+cJu9EVW\nih8uZgShJCvo+wH21CQ4NiasL7dmMvFgKQcPV\/Ol6SfbdfST+UC6boMEMsG95SELVriuE\/Bkqxas\nYky0JknprxNk56V4VOWeQ6bRD+lJvpKp4sxg5KcHwJHsx\/0zMCpPotAWiLz0f8HgL9dzHU\/W819+\n\/qQaH++U49P3K\/DJjpP3cvz2cQUeLGTh9pQVz27lvwIqimThUH4hsahiAVQwWF8SjRxLIMya07AQ\nlIX3NAJM0\/qitvgcbAZf7p+GgfLmWvwJ\/jSKMoP2vgXqL192eL\/YKnJuTaXt3hpPxaOVHHyy7cTW\nVDp2lrKwvSiMn4aH3N8YS5XPn75XKgEKqW8wXrYXMiH+9uFyliyQ+ws2VOaFI5WArLozyDD6SfbE\nyjD4yT3xs2SVj2Sv\/HwI309JgA2lEfDaGE72XR8wOSiLZ2XAtL9APy0PpuDurA1fPK3E7ntlZKwS\nv7p9Ac88BfjwXpEEJtj744tqgrDydzPwdCMX99x2CfbX9wrwaDUTU12JaCiLpKf8kWUKwHlzAO\/+\nlNJfArTpz0gmU1Sn4KDvsk1+0MWf4LsPqvPP4sqFMHh5RiwvN0WI8h9eZxysEtzKQApWh1KwNkm2\nbjlwf9mOTx8V4fNnZfjDB1X47HEZPnvkxJcfVONPuzX482e1+OJJGX7\/vIKMWTHapqI8wUhR+9Do\nIWQwTMp7BNBuOPCfAGc+lFsANKtPwcRlTDgp\/7b8fCi85nsNL+eYSSIS3MyyuR6DfBa5tk6p7syl\nY7KTmVWjRtdlFUZo+DHGyPaKFRvTZty\/mY6nnky4+1kEjQp0X43FBVsQ7DR8jiUA1RfCcakgTILL\n5F5S3AnEnXtLAhTyipVDz2UYzqAgLRAXrIFI1Z6WLBawULwoq2OVjK3Q2Mv9yViixIs0+r05BxYH\nTLjjtmKGoKc7kvBwIxNrY2ZsTlmYfxpMEPggC+HxRgYGmhSoyg9HgTUITRVRmOhQSVB1pZGs0hDp\nNyGpXukDTewJCfTIgxU5oZLFvNSDShZSO8k8qxiyOLYmMtr+XuLlgWQ83MzGXZp8tEkrWf3gnRzc\nnbcRrA6bkxa8QzldtWo8Ws9Ab20crhVHoO9anGSwJOus9J6DKzP54C7kFHcBRoAUhSH2LpApwZYA\nKNg8b\/aXTOak+uPr1jVkevxNgDcZGW7mm8gxIb3sCmxhA\/UaTLcn4Xo9I6RBg+XRFMywdbVURUk5\nBWtiZR\/ehcy5qYHSg1mmQJgYJdGhv2C8HNxFgQiA4kNdoRWyyJ4AqCPDqdpT385BSrsr5J0lsBuU\nb5JeG2oke4yQBVpgnqCX+AHuzKQxtK1YHjOROTW7hgJXi86hxBGK1spotFZFo42rpyYWNdzPSwuS\nAC8VREIZeUzKm8+9AmsIVHwvYicRvrPThza9r1ya2ONQRR\/79rDQXKGMul6noWxiiRaViCkCfW8t\nE56ZdMzQo+PtenSyWPi76LiUIFvXUIOK8h4ALLaHoCgjhBIFST82V0ZJJq06P3aLINlndXEnJUDh\nQRE5yQk+stXlpwm2\/ZEYfRzKiLfFh\/nuNNN1WbHLAZNdQEsZNXh+7zy6rqjZERI5cejkRCIkFr+z\nNmrCAqeT8dZENJZT4oJwZle4BFhAMLlk7XJhOAr5XpUXQfP7y+oWnhTPAmBWSgC09KMAFX\/ubcSF\nv8XnY9DHnxSZ+F2A+WnBTjFsipjxTKVi9noyOqtVMmamuNdZncA5LgHdVxLwfCsL77JQBsmgCOT+\n+ng0EejFjGCMtCjlszM7lCAjcbUw6lUOZjO0RVCLCtaR0VS2O8GsACXYFBFjZLX\/Q4CmOH\/vEsfZ\nfVEkL8ieGAA2x82SyTvz6bg9m8Zc1EmAbVUEURZPwErUOyMpT5AsiF5WckXOWQ6cESjnfaBRI\/cF\nQOFHAUyEtahm02E4F9lDXz2LoBY+\/Y4Hj67SzFBnQ2kMnt\/Npr8SmYXpGGrmREKw\/fTmIrvMbDeH\nT5dRSnxzwIguBnR7dQzqSiLozygOABFoJKsiB1urFK+CurY4RoayYEiEtZxoJKhTsh1qDzNSG3t8\nPzHmuO8\/nWYu2oI9DzdzWCQ6bLFqN6ct2GD2bZHBMU7O95cyZA4OMnqme0RgK2UODjcrCSwKAw0K\nXKYfu2sULJbgw1D2JeAY2HQH1WqknCK81fRcqP\/P5SQjql0dfXzPFPcz7++dBfvqVLvbyxkc043s\nInY88tgxxwBf5KFnbcKE7Zs2tkMTu0YSoyaWUiokwMrcMDjPn8W1ogjKnSCLQgC8epE+tAS8GhbE\nuCXCOjZMFMYJj918Rh8e\/FbUDx7x80z+3oyWvXv03jzDeJxV7GI1bxDUDKUVMTTSosMwK76pLEYC\nK2NRiALpr4vn+1kZPUfh3VgWJ4vkaFgVHhSs2QxnnD\/65PblRx3eS8PWPTeD+uZICpZ4KhMe7K1R\nyfPHmDhecpoWA6koAOEzwUx5bgRDOlpmn9jPtgTt6dk1tAofKKNPQB0rOoXvnlHt89OPl1993OLr\n7k\/db6lU8tBzsNovKWUVd\/DeznuJIwxp9Jhgqjw7DFZ66yLzz6b3\/2t1fqTzP34wf3a3OKq\/Vr0v\n46XyIF7qSuLpqzjmXCyl\/bqTFLIoREU6UgL3i7PDo17btwczXTqn6CRTbVp53himtOIgJNpdbVHU\nK4AOoz87R\/heS2Wi72v\/\/mW6M2n3qNV904ONjA8BkJW631ihmP2vfUE03ZPoO9GieTl6eEg\/Atha\nHrtXag9x\/M98k8X25uy+onT11xys8eo4b68315vr\/\/D6G5l07nJcW+LWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mysterious_cube_piece2-1348252084.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_mysterious_cube_piece2.js LOADED");

// generated ok 2012-10-12 17:12:52 by martlume
