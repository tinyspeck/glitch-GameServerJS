//#include include/takeable.js

var label = "Wooden Apple";
var version = "1348259964";
var name_single = "Wooden Apple";
var name_plural = "Wooden Apples";
var article = "a";
var description = "Carved of hardest spice tree wood, once adorning the mantlepiece of Gaia, mother of Helen and Harris, this apple was once painted a startlingly shiny gold. This was made by mixing a secret combination of elements, grinding them down with powdered chunks of sparkly and turning them to liquid paint with the careful addition of happy butterfly tears. So desperate were others for the secret recipe that the Apple was stolen almost daily, a little of the patina scraped off each time.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_wooden_apple", "takeable"];
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
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-37,"w":33,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMlElEQVR42s1YWVSTZxr2ErKH7CGs\nYV8FBEXUsCmyLyFhJwHCviMge0BAVEAQWRTbBq1aNwo61p6ZdoptZ7pNz+FyLr2aa256\/8z7fcyc\nmTPFbmN7mnP+A8kJH8\/\/vs\/yvv+hQ7\/y6+xJxd0TcVLER0n2EqIkrphQN59Dv6dXcoJsLzJI6EqP\nk0sP\/d5eaYnKiaRYKcKDhLbfHbjcFNVKWqIHDkcIO9\/44ZEBbqaMJOV39nzP3YwTip3sFPUHJZne\nS9Zs78p6i8HUWq77QR4VZWhXM04qkBAl\/nUqdyJBFp2WKEd1ngGtJb4oy9Qh\/bgcZ054oPC0Bn12\nFe5Meew+X1V8D8Boh7G\/8LQKSXES16\/Ln2Meruxk5U5Ztnan1+6\/21bui+pCA6oLPDHRLMP6qBTP\nlpV4vKh51V7la2J\/szkl8xlu0iHlmAzHY34jtRamqWxlOVo4LF7othtRazag3qJGnVmJ9go1Jtq0\nGGrQ71XkaW3bq4YFe5EOZCtbvxnZi06rXNYsDVVPh9piPYH0QofNDw2lXjCfVaE0SwF7kRpFZ+R7\n9y7LX3VVq3EqQeb8TRVZnuv5ZXmuFlUFOrRVatBQokNzuQEd1V6oL\/FEXpoSOSky3J\/3QKdNjQyT\n+u\/nHYr8qlytqTxL99u02m72Pe+wMg7qUJWvhSWTVU0FK\/3MT1eikH4fo3a3VbFKy1BnkYIJLZX4\naM70e5WV7DtzcVBreuPAGixy6dXzqoX1CRWWxzRYHNZjbkCLiS4VGktVHFjBaSWIg2D8a6HKWjM9\ncPaUB1d9Gqk\/lYCaEmQozRajzaag7wtdRyLF+W8E4NK41nVvUYlnb2vw\/JYKD5dUuNClxWCzjlqs\nQyUBK8vVUPu1MGcoUZqjQS61PDdFgWyTggNNT5Iji35nQE8ckeI4pcvRaAld4lfpxwW\/HOjLTS\/X\np9sGLDh90GX3RnsVKbnGG\/31vsQ1L5Rkq2DJUqODPrebddR29l6FYmo7o0FtsY5TwZyh4oBbymWo\nt8rIUz0IpAQJBDI3VUgc\/gVR+OKuce3phhf66r32gRFAZ7sRK1NRGO8MJHBqlOWo0VPrjZFmP\/qO\nAbYiLcY7\/NFebUAdgWM3U2\/V0+WJfocGa2Ny2Ao8OC9PxTOvZJUUETUEyEr5GZW82B1uuzntw1Xa\nWmngFVu\/FIMnbyXh1mwcqgq1qMgnNZfqcaU\/EPMDgeh1eGN2IAirE6GY7jGSyj1xrs6bg6whbjaW\nenKbKjqjpqopcZrafipeisxTEvpcQOIT7FnSD\/34xDPZEWLrrTNyYM1lnhhq8cfthXg8unkci+NR\nxDUNKVTHr5m+IDx1JcJ1KYoD3bpxFFuriXjrYiSv6lCzL4kpkKyJqks3xUBWUutLsjUcZDoNE\/VF\nUpyvEjGA6KxT\/XA8jraHmHpqjfygRvK33jof3JyJxd3rR3Hnajyaysj7bAbOv4EGH2zfTsTOfRPe\nnY2AazYKOw9MeEFVZiCvO0PhbPPH2sVofk6tWc8r2EDnMj91UBp1Vcow0SjBaC2pu0SImmIx5qb8\nXu+bPbXBXzSWeaHGrOPtnRsKx43pWGpbDOYHI8iU9ZjsMmKy0x9T9PPzZyn468NkPLwWiYcrsfj8\nSQo+un2S1J6EO7OHMTdIFab3Iy1+1A0DP3duKBK9tWoMNyox1yPHbMc+wN4KEVVXgMZK2cHj2bDD\nmH+u1h+tFXo0kZeNtgViYSSafC8as\/1h3N9megMx0OhDnwVjdTwc3zxPx9ebqXh6IxpPbsThq+1U\nfHL3FD585wTeXzmGtckwbLmSsDAahh7ioo3i8vp4NPHSDxWUTNX5aqycl2KiXoyhajEpXwB7sXjn\nQIBDDUbXw6taIree0oAU2xGM4ZZADDb581jrc\/hgqjuQV5ABfLR8BN88S8O322n487vx2F6PxWeP\nTXh5z4QnywnYXD6GpdEQ4m8sViaiKGX8OMDxzmASjz+vJsv4qRYZLjbvA3SQmsty3XEgwJVR71e3\nJjU8W3sdRqoUu3xJDPu8cbb7E7BwLFDbGMD3b8bz9v5tKxV\/2jiCu3MR+OqD\/Qpe6Q+m74Ti6mAI\nrk9EEj1CCaA\/B3hzSk83ygYNNVi+1xYqMd+5D7DNIuQAQ\/0OGNVuX9Tico8GDvKswaZgaokP+ht8\nMUggB+gnU+T6VDRuTrJ\/HEQtjcenJJAvHiUT5+Jwbz6CUuYwPr5zErcuRWOJKDDZbaRYDMPVoTAO\nkFVtolOPR\/MKikE5RZ+GYk+FxW4Jhm1idJJQSnPcydzdvp\/Z70xpMNmmIm8zkOoCuEh6qa3DRPCJ\nTiM36ZuTkVgZD8Hs+UBsriXgxduJvGKPr0fj\/mIo2UsY59\/iSCiuDAbzJFm+EIWF4Qh+Dsvq9ipP\nbF9TkMlL+JCRT7HIAE7Wi9BhJYDZ7kiJPwDgWAu10sq8isWZkdLAi1LCh6rpy9s73ROEZWcEro0E\nY+ZcAD7bJoWux1D1EnF7Nhx\/fGAk4YTgwWIc8TSQe2grJdA1ZySpOZyfwyahJvr8\/mUlRaeIR6D5\njAKLXRLMNInQTi0uIYBsJzpgnPIimZPjl\/mg005qrvTi+dtX78O5eJmUPEecmqO0GCfAH78Xis+2\nAnB3PoZX7pNNH2zMBuLWdARuzURhY5F4uXwUSwTwUl8Yp0sVB2jArXEV3bwI0+1ydJRKsdApgbNm\nH2DhmddwsLLAc5eRts5ioOr584P+XcV+Ajk\/GMl5ONMbQO3yxyeP\/PH5lh+1PRzLVLnnG3qsXgjA\n0tj+TSyOhWKWbugC5fZMbzg\/x2HZz+V3JhRk9iKsDUowRh440yzCCL1vKBRQwrjvHahia5baxUhr\nK6LWVPpzNbdUsNSgKlISjLUHc6CMjxNd3vjymQ5fv\/CmllP2dgfg8Zqat\/5yXyDRIYCAGenyw0ir\nEVM94fwcliTjrRo8vuJBXBRhuV+CEbsYI1TNvjIR6vLdkWlyP3ifKUjXWq2ZGi791kojP4xFHmt1\nT60vtSiAt5yR\/eqIhjxPi6\/+4IkvtrR4+USDh8sKPslc6DL+i7M+RAuahhx+9HkYeasXt5m5cyo8\nmJHTzQtxpYPsxbYfc70lIpSTgpMT3F4\/ehWdVb9i81sD7cL2Ij36arU8WTpsPnS4fr\/dxKW2Sk9s\nrujwl009Xj7Q8Mt1WU4U8CNwZEfTnrhxwZN\/v9PuSzcVwm+WLV5rwwrcn5IThYQYJKH0EtAaNigQ\n\/wrS3eHv\/wMTTU6qPpftGWz3ZYK5Ny1HW4Vu32Bp5J\/r12G01UDBr+PicbYHkfF6kvepcWNSRp7p\nTZONFh\/S5P1ine0olEqVPvTdIOI2DQl05nt05r0JtrMI0UP522imeKOIs6QJERch+PF1NS9ddb\/4\nrIZ2DKocbXCskg1WFT6kf8j8iy3rjSUazqnBpgA+7z1bU2HFKcP1UR2WhnV4vqrk35vrY8lkQFdN\nID+nnNaD+W45NkYlZNoCnCsXUh7TgEDiOBIuPNhe\/veVni6X5qWqdi3Ex1Ja2NkydM6uxNMlJZ7M\neWBjUsmHzgZqGWs949Zbk2oaKKR4el0JZ6sON8ZUeP+qgrxQTdX3pCz34x1h2TteL8W1bjG1W4Bu\n4l4Z8a4yQ4CIQOHOT56oS3LU0YWnVXvFlJekbtSZSQRXFHhI5J5oVSOPhs0q7pkGrvbzDoqwdgmB\n8sC6U8nzu6NKC\/b37KlEVb6eL1PWswos90hwoVHEeWcn1VaQMVvOuiM+0u3nraRZJ5RBeenqf7Cl\nPD9dRcOlCs4mJbVKS2SmdfO0mm90dhpEa8zsiYMYDy7J+E0wMbCKmTPUtERpeOXYUDBAA8FKj5hu\nWMAz15rljrJMdxSkuf2yB02skrTj7lnOeCArWQFmQ5U0w9kL1XyNzDzFMlXDwfTXSrBBPLxPYmmj\n1rKKsYmFDQMltOn1VonRT4odocSwZu6DK6bKmTPcf9ou8to1oFEWPWwT7Z4rF2O2TYa1PineHpLC\nYVag+IwMTRY55rtkcDaKsT4gxZ0xKdaIjwxcTirbj5UEQkpcFsBJtpKSIERijADJRwVIihUgzCj4\n\/xf4bz9Kl441eCxcocFymQi+3POfi6XASI2E+CXGMLXZReDZ1VHG1ks5Uo7KeLVsxLfmQlJqkBAR\ndIUHCr4LDRA43uhjkIvtWlN3ifjVpEMEBnaKRqTqPOZfYn7FhIvQXynBXIuYG6+V1MkEYMl03y3N\nEjnLczycycdktpgQ0Zt\/RvPfr\/pckakq182Unexmy0t1c8aEC3diw0W7bBk\/eliCrJMiEpGQgt\/N\nVZT1\/z3I\/CfkOli1M82iHAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_wooden_apple-1348197622.swf",
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
	"collectible",
	"artifact",
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

log.info("artifact_wooden_apple.js LOADED");

// generated ok 2012-09-21 13:39:24 by martlume
