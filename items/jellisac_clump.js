//#include include/takeable.js

var label = "Clump of Jellisac";
var version = "1351116303";
var name_single = "Clump of Jellisac";
var name_plural = "Clumps of Jellisac";
var article = "a";
var description = "It's like your mother always said, just because it's slimy, doesn't mean it's not desirable. Even if she didn't say it, this stuff is certainly gloopy, and eminently usable. Where ooze is needed, jellisacs are your friend.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 9;
var input_for = [192,200,204,210,211,225];
var parent_classes = ["jellisac_clump", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be harvested from a Jellisac Growth."]);
	return out;
}

var tags = [
	"jellisac",
	"basic_resource",
	"firebogproduct"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-25,"w":47,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANSUlEQVR42s1YWXBbd732253hgT7B\nU2cuTWxLli1Zm7Xv0jnS0b4vlixb3rTY8r7EW2zHS5zErpNma+skpbRNQqBNCL0hnd40ZXpJKbeB\nDtNLgTzcJi0tBUKnwEChzHz8zgl9YWjdQks5M785tiVL3\/+3fN\/3OzU1H\/O6jdfvvo1bLN3j78db\nuLXz\/denVwbS8+uj6yPzxSOrRyYXt87ui97Ajf+o+Vdct37zcsfBU3sud00n3rZ1qeAstaBtIfra\n2edOHOOBHn5o5Vy4wL3nCJtgCxgQ7GIRKFl\/ufHYYuJTB\/c2XrMu3jv6jDftgKfdAl26CbpUE\/QZ\nKcwdCmyd3zidKgff82ddBE4PPaNCS6QBmngDva58e+x46YufGrjbuPH5n7zx4mp+OPjei+9tINnv\ngpq+nA9NrIFANsFfsb8b7eLgSdmgd6sgtzVAFRCDaTXC1+GAN2N7k4sZL9vcjd21tTWfXMn5\/vk1\nbgae\/t75Bw9e6AcPMF5yQmYTwxRVQhdrgjbZCH+fFZsnF7F3awq58QhMMRW8eQdi3T74KKuOiAlm\nrxZcyvGur2C9Hi8GrsZ7\/Fe7Blst\/zC4X+BVxbPXLz44vzV0qbSUeSU3GEbXVBgGTg2pSQSjV01f\n7sTYQglb39iPwkYY2WUvIhMEbNKJVH8AgZwLTMwCi18HDSOHOa6GJaWCr9UpZFthbwITNQY\/NriX\nXr6iufjUI7e7JlvhKZlg7VQiXvYi3OGBzq2AzCJGs7UB0QKH\/7r6GCpHMgK41BwLX9WE4Lge3pwT\nBjpEs6UBjfp6yD31UPjroY6K4YgZoHE1Q6KrQ5NZ9LbKteOujwXw2f+58P\/JniDcSRssabXQZ6ZW\nGWIlDqZAC5SMFKagBsEOFq1jYaTGqZT9JlgKUrj75HD2i6Hh5JDRIRoNdVC5mtDsrYPcRz+HxND7\nFBC17ICYQqKvgy2oTX8sgKfOHkKo4BEA6txKYRi0CQkMGRmseRWiA9y7q4+U8MT\/zQrlcsUt8OdZ\nRMccaDvAoXUvA2NIDbm9ES0uGVgqc7O\/DooAZTDcAKlFBJF6B6RGMbQuOZiQvviRwfHEu\/f4zI1E\nrx\/+HINmmwS9IzksPjyM4dM+ZB9QIrvbI4Djh4ZNWKnHtAj1O1G+P029GEFmDwe2xwQdp4Sf+tSb\ntkMZFEEVpuFKKhGkw3gzzjuHi5rhjhi7PxK453\/6rejRx1d\/2Lec\/2OqxDe5E6ubU3jk0n3oPhRF\nYlOK2IEmxPpYlJYiqKyG6ACU3YAMyQU3ujajyK8FhEjOuREfY5GsBKh33TClFVSFJhj9ajjDRjgo\nbEE9jJ4WeKKm3m3Bff\/7V\/5z7vjA75k+DezdasT7vGgfSOLStx9Dfl8QaQIQmVcjua5GZsmN2BqV\nelUB94Ac+pwEuf0+5Pf7UTyWQsd6CK1LHKI0zfFpBsVDsd9xndY\/qBkZPxTC0KjtMmgdBNqhhJnT\nPrctwCvf+fp5dkAnTKwxR72WVaO1L4wTlw+g90gMHfspE1NGVB7MoPxlP1KHZJRRytxBGTLHFIiu\n6NFzJI7N\/65g7kweiRkGgSEzotMWZPZZ4OyinnQ2oslYD7GmVhgeuf3OwLhjlje2BfjQhYPXnOUW\nGNuaBRnLVQncoxs4+8wx9B6NoXAggD0XOoW+2\/90DpG1RkT2ShBelSC23oTWoy10kDi+89s1HLjU\nBVdJBU+FyjdZB++sCMEFKbiMHSwNlCWkgcxTK4Scplsfkb24LcCrz1\/433iVgzVJJQ7r8dSzZ3Hv\nkzMYeCyBvhMplO5P4MEXhgWAfYcjCM83I7goRmiPGOEVCeIbUoTmtejZcCM8oRcohx2th3u8Dp5d\n9fAvNgjK4kkTQftFaObugFPQ8Bjz8vZtAb5y84WFbDlGU2XCsVP78L23TuLcj6eQ3tCi\/ZgVQ49m\nMfxwFrNfzSNCZXNWmpFetiG5rEdshYh8vwyB3Ro4+xSwdksRHqPpHK8H+z7AhQak+gI0LEqoSMeV\nIZrqoBi6TCOYLtUbbLf6xH33zX\/+Q6Vt6\/TmDW\/GgYe+tilk6qs\/2kU9ZEaEMtR5nEFlK4Wue0OI\nTJnJbsnhH9WjY82HzvUAitSn\/l0mMAMqBMYMaF1g6XepUGJuWgTfvBiuoVo4iMSZASW8g7xCyWGg\nAdNnJfAOGEnHA1sf6lpu\/OqlXbmp0Dtrj+7C1Ok29B4Mw0UZCUy0IL\/Oov9UBj30twBJmZNXjLKc\nOI9B98EQMtM+2HMaROasKKwH0bbiRXCuGdyMCH4C55n6azanREiuWARZ9PbryWyIoKHglSg4bEX3\nTFL3gW557dzME54hPWUpKjR8+z4\/XBUFXAQkteBE6WgcpWNxBGma3ZQppqoEN6pB594ogu0MtORu\nuKqRqCZBoCNI7zPRMMkQX9MisWKgMCG1RhVZ1IAZrgc3qBAA6tMScGUD\/FV6rWwr\/V2Av8Zr2faF\n4E9t3UpYyIQW1iPo3AgJIFwVuVAWvpTdW0TAe43wz5CbmVIhM8MhOxiBJasSNNs7qUdk1or0ohup\n3W6BbsJjdso0mYndrPB7jLiRG1GCrZCb6VTBQfLp7tXeAdhh83wAwFtltk\/\/J2ObTPB4lggB6LPB\n2aukUiph65EjOmtB50kLsof1SB3QIDCtoIxpERgguSs0gx1swfTpFJ57Zy\/ZLgO4fh38AyYKM4Jj\nNvgGjQiNWOCtULb6LAgX3ILsWcIa4l0V2A7dK36\/6nMfAPBmwEF7hqFVipaYhFyxBEoHuRgfqUfV\ni+rhKNpOqlE47kD5eIJKnUCBeo8dVMPWLYOj3AzvhA7nXpkQBoyhQ1m7GsHSPThGpd5lo88mq1VQ\nUrZ0Qra4NhvsIQM5mnrBwhn98uyHDMlNSetu\/6vWNiUMfioruWB30io44m9f+waWH+\/GlduLOPPj\nUWEI8jS97gE12CEqz5AaiSUnDZIPi08UsHK+gOiUCa6RnWAo+OHwU7ZtPRLYyzTJ1R3wjdN3ZA2Q\nmyWCs2nQEXGbxWc+lAu\/8uSxRLo\/QqcyEuNbBbfBJIx4+toZpI8qhMysP5NFeo8doQna3npkAt2w\ngypyMkkUj9JwHIqQDrPw8Bw4WiuEe7IeoWnqtYEdsPffI9yZsVooOTHqVfegjkJqoAxy6qvb7r0n\nvnn4bJg0NFR0UI94YA8acfnKWSye6UJoWQLfnAihGSpfp5SiSSivq6ISjEKOqKV4NInwEk030Yp7\nsk6gl+ACHWKsHs7BnQRuJ5xDO2HurqPdph5SvYgMgxwmjwaOoPGpbQDelMxebH0hfi+pAkmTN28D\nQ9o5PNOLk5dWEFwigKSr7hEJDcUdcIFhIuU9HoQnbfAM6KnsLeDG5PCOKYQITGgQWqBWGBeBnagH\nQ3drTyN0oWaoLFLoXNRSLO0qtFTZ\/Npd22VQ1\/9w4EZ4tVEQeHdVSmujDQGatNhuLfi\/8xn0VXVE\nqibEdjmQnHUhSwbV3qMW9mQdBWkrmKIGHp7bBs0wky6b8o3ECCqBcuKjHuHgWidthi4VrD4dwm3u\nn7sSrru2ddMr58avZ6iHfIN62EmK+A92dapp9zUje8CB7CpRw5CF6MKKJHFaep64bpKFOiQR9g01\nuWYNsYAhSzvMtFNQDKaoomWf3HSuSaCd4LANvYvJHwxO946GM8zIwFxX923c6uTVbFvTsHl+z\/HY\nFCOAiE06CKiBbJMeueEYcoMxJEe98NIe7CXAySnPX7NhQrO5AQpOBCU5Fd7ea+LUDqMG0m0TAiNa\nmPMSWrxIm4s6+n\/iw7LlzN\/u4Lwf+Eg7SXGz9fXELIMElS8x5YKz2AJXN+0dtMW5YmZIyRUTJdCi\n5IKXJt1JDkigCVqCGPrZEaXsJ+n943TIORtCU1rYKztg62iEo6OF3IsW3qJp6W+\/+03c+MJH2k34\nN\/YsR8ayy76rvfuTz9t71TBSycwJmt6QHg36WmFddMXN4J\/H2IMGYccVa2uFLdCdsAnabO1sFnou\nSpUIT5phq9wjZI\/p1f\/A1eu66xN6NvP63b4Ry+\/5B0Yq8nBKjwQNBERhpaaPkCbnCCDdm4y0a5Cd\n5+\/8EwdHewu01Heekg6BQYsAlBklBz6heypRcdd+og+Qqkfatwy0uKsiYnLBZDStUmHV5DczR0LH\nayhSIyzYoh5sF\/UXDYGzRwVNQgRzVipIm6dkIMlkOz+VJ1x8A3euJB7gTYQhJheowcCqqB9NsLep\nUJgL4YXrlzF3qkw9R2aAnIqzIoatWAdLu0TIJkM93D\/XIf1UnxOuPDCtHFopH8mPx19l8gYwhTtu\nJTlvRvmQX3DOvEF1knPm+81a+pIQvkEN\/GXL5Zp\/1fXDN68lKmttL3GVOy44OmP4s4fAOUjCuNkG\nUo16OEjWbP2kvdWdSM2bXz\/wxPwXaz6r6\/o73+oLrjQJWmulzLmqErBVGckeWf5hNQ4\/vne95rO8\n+ElferLnBDNG1FOlEpPy2MklczQYudngWz\/\/w6v31HzWFy9Tj790f3X94ux322cjP8tOBH9WXc5f\ne\/bliy01\/44XL1t8Zv+Zz\/gLRIAYIhxP1\/YAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/jellisac_clump-1334275710.swf",
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
	"jellisac",
	"basic_resource",
	"firebogproduct"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("jellisac_clump.js LOADED");

// generated ok 2012-10-24 15:05:03 by martlume
