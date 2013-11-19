var label = "Esquibeth Note 4";
var version = "1347665033";
var name_single = "Esquibeth Note 4";
var name_plural = "Esquibeth Note 4";
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
var parent_classes = ["esquibeth_note_4"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.event = "";	// defined by esquibeth_note_4
}

var instancePropsDef = {
	event : [""],
};

var instancePropsChoices = {
	event : [""],
};

var verbs = {};

verbs.note_broadcast = { // defined by esquibeth_note_4
	"name"				: "note_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var val = this.getInstanceProp("event");

		if (val)
		{
		   var events = val.split(',');
		   for (var i=0; i<events.length; i++)
		   {
		       log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
		       this.container.events_broadcast(events[i]);
		   }
		}
		return true;
	}
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_click_sound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-29,"w":18,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJIElEQVR42rWYbWyVZxnHT1tKCxQY\niDDYWDYnyXRbZWOLy5I5jdsH52KiWSaETBdR\/LAsWVzMolE0OuJMlhhBt2XJvqgsmrgtFgptgVPK\nO7SlBVre2tK3w3tLS1t62tI+j7\/\/k+s6Pu1atpV6kn+ec85zP\/f1u6+3+z4nkfiEVxiGWSgXzUS3\noYXoPvQCWofeQm\/HpM+\/Rg+juWgGyklM9cvAphnYfLQUrQ2CoIhrPdd21IF6TX2mXvu+hHHfRZ9H\ns2yurKmEm45mo0XoWZREKZQOP91L4yrRS+hOh5wquDw0Dy27cePGu1xb0FD42V96pgn9Fi2xcGdP\nFdzDAwMD5UNDQz0jIyOBWyR04eDgYEbc\/yTIYZ6p5braIpJzK4AK623pdPqJ\/v7+EgDSAAR4MQQy\n7OvrCy9fvhxevHhxlC5duhTpypUr4dWrV8Oenp5ofOx1HW2wIsuZLJySeI7C2tvbWwkgDhwI5KXr\n16+HFy5cCFOpVKTz58+PK43p6uqKPCtPx17d6I8GOG0ycDmWxLfjpT8D2AtUAGTkkdbW1rClpSVs\na2sL29vbw3Pnzn0MTp7UQuS5MXDKgWL0GCqYlAd5KB99jtCs6e7uvgBfgELeh01NTZEEKFBByosO\nKa8ppEqDMWCes8q\/5zW\/5XfWZLw3l9Wv6OzsrAVq+Nq1a1GoGhsbw4aGhuja3NycgZQXBcn4qEgE\nNgHcSS4vWi8cVcFmN8\/67ExzUu7HqlwPAreYBH+PAuiVUYX17Nmz4alTp8LTp0+HZ86ciSD1nYda\ni7BCCCaQWtPPDG6mG47tTAXm1SW2CSy2zwV2P8sB55B3T5FDjV6JCtvJkycjOaQ8qVDLe8o1hXR4\neFiQXczxDtqI\/oRetx1kie1Ao7Y6M652U0i3+AN53qrugGr4\/CK627bIvGhRWiFAb5FT3QJTG5G3\n6uvrwxMnTmQg5UUBKvRUd6YHombmWI7uVZGZx+aZJ\/LGCauK8R6efxO4HsEp3xUR0quf6wbmXG4V\nPz3BwPvIp3pvH6pGwR0\/fnwUpAC9UlXdrNRBz6IHbUvMt3aVPU6uZ3s68dwrzNEyBi5afEdHR5oU\ne5dxDxHN2QmgfkBOpbw6dRXc0aNHR0Eq91StFo446CX0E\/Nc7k2KUaGdz2K+z7PVAtN8cTjlv1KM\nKPbz\/ufawxNU5Ruoy6tT1VpbWxvJIQXIyqLJNKkmj4GmMaoTzhcn2sqsMGYwrpDxf3O4OJjmF5zq\nQKmGPuT+owny6n2qc0BgglSl1tTUhEeOHMlA6jtVtibTpHFQg71I2F4G4i7LsZxxwjubsat4ri7u\nNUHJtiLncOqx6ASe\/FaC3EoCGagANFAFUl1dHUmQAlToWWGArjFph4SRTowNGewIOkXIdYj9gm2Z\nebHWouKYh\/fWAtYmMC1YntPcipAK0XcpXQFOA7gyQQtJ0kICbyO6VlVVhZWVlRHksWPHQqvugIk3\nAfQ7PLEOvQ5UBQZTSKBq8A148zVAH7OiKbADiGAXMP6nQLV5SOUx2fOU8jbmWytFuSYBeRIvBqpS\n3zUEePjw4QhSK9OqgAwAeNmO+3daY10mo4BXoG7zjKowyQJWAvsgXltiBbRUYwFrVCsTnECU43KE\n29J3iqTSCrvrElRpkhtBvCErBw8dOhQ95PnB4ICJN1jXn2MNWNeF9K0VwP1dLUKeQcN4qRHQv\/D9\nj1nYM8A+zftXyLkqtSstWjYFJ2fInmB975ej8OL6BCEsBXLE+50g1Vr0gMLrezCuD2hJZX4yjiV\/\nPp5ZgPFvsIBStQh5yL3EtQ+oWlTM53Ii0SY4eUj5LbiDBw+GBw4ciBzjkdQVu79MEPtNkKe95\/nO\noZUJVquxPTjAk3vjgGNO4QvIxacB2gXEsLWKzHHMKjPTa2VLcALbv39\/uG\/fvii13Em6Eu4XEnV1\ndW\/gqS55a+zu4SG3g0LAA1ttO8sfb5dAdwC4BohmP9xKSnyrzCjH5B3BONjevXvD3bt3R9+5bTh6\nGPt8gg\/P4eomPBl4YwZ6lDcFCuQgBn5lB4DcCbayAnKtEE+9zeQ3BOMVKSldFBHZEdiePXsisIqK\ninDXrl1Rzsu2BOhBnvlmgkS+C+9tpOddIQcClbt700GBHALwP3jnIWsd2Tf5wbWIfFsFTKtSw+XJ\nLw8p5+Jg5eXlkeRB2ZR9bP6VYnpAExeQK\/cD9CaALYAOK1m1Sg3kgUE8+BFGH7Fj0PQxUNm2z+bZ\nVrdYBQPgR37g9aRXRAQhMAElk8lw586d4Y4dOzKAsontbp5dSzRu9018jjwJ5C\/w4D5Uw6Ba4Grw\n4L8I7aN+\/PGDpIFNN4\/qyPZlFrGCeb7G+x\/irQ+UGp7wMqyiEFwcbPv27WFZWVn0vQDNOWUs8Ekt\neNQJFwOLWe13WO0qtJrJV5Lche65GFwUTrUX7j\/J2NcY+x7XTejfqAKodoVTIVNHUL7FoRyspKQk\nuqpgbIu9ilNelcMyxWgG\/TfCLAvVXPPOjFFH8P8dneaRI19lsiIgOj25Xcph7eUyLI85UGlpaSSB\nbdu2Ldy6dWt0X30XuCGi9wHF8bhtAjkT\/buQHVPWeL+fCfsDwL3DhIN+6nEpTCoE5ZXDxIGk4uLi\nSLqvNmNbax1zrmabXDjZX4ACnslhYCkeWq9w+KnHJTDlk7wVB5G2bNkSafPmzdFVcKpmNWs8mOL5\ndaTMsviPrM8KmKu8I4RrWW3KDxSSQqSWIaMOEVdRUVFGuq+QC04pwKIaWeh62lGhpdW0Sf93o+QF\nbJtWLW+51HhVBJ74HtI4rIdUOaei0TMApljgehr6\/ZZ3ubfy51IePe5uJq1W3siAGcnsDGN3B+93\nkt7rno\/jmQYW+3s89xUrzNxb+pNTHlQrwnsbZcjlBl2CH\/udjxU4137G7CasL1GxX5oSuHgF0+Me\nx8CH8oi85JLxuOL33Jtc2\/C4qv9Z9uyl1tZyp+Tv4dhfw\/Op4q\/jiX\/QeNNqvsq\/m2iAEDfhyffJ\ntx\/RyJfboSN\/yv9gt1aTxyl5Phv6I4T7VQAq0GnTGX8PVBWL+CdjfkM4v6fx7K+LYl7LTvw\/XrF9\neDbH+ztozk\/QnJ9R2CTef1uf2X+fEhQ7zj22l8+y5z412H8BXM+eJvs2Ia8AAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/esquibeth_note_4-1347042812.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

itemDef.oneclick_verb	= { // defined by esquibeth_note_4
	"id"				: "note_broadcast",
	"label"				: "note_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
};

;
if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_click_sound"
];
itemDef.keys_in_location = {
	"n"	: "note_broadcast"
};
itemDef.keys_in_pack = {};

log.info("esquibeth_note_4.js LOADED");

// generated ok 2012-09-14 16:23:53 by ryan
