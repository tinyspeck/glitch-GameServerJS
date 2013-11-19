//#include include/takeable.js

var label = "Theory";
var version = "1337965215";
var name_single = "Theory";
var name_plural = "Theories";
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
var parent_classes = ["mental_theory", "mental_item_base", "takeable"];
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
		'position': {"x":-20,"y":-40,"w":40,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOw0lEQVR42r1YaXNTZ5rlH\/RPSNX8\nAarmc1elm3Q1JAFs2bIl25K1S5Zs7fti7bZlSZYsLO+L8MZiwAYCYTUOJBAgJE5CQkKnA0lPdfdM\nTdX409R8PHPeV4F0V8\/0Qk+Pqp660tW9r857nvOc57nat+8VX4+w8ZN3vxuvvvv9+M5VxoVnYztn\nf12SsSHi6ejOqSeFrbNfF92Xn5Vf2\/f\/9RLAtv9tMnXq6+Le1KM0Jj9OYeZxDvNPhrD4dBhL3xSw\n8PUwZnlu6pM0jj0YRO1eAiu7ucbGt4Wf\/EPBnfumaF79YnivuJNA4kIYya0QJt\/PYPZhGlP3U5h+\nkMLy1yNYIlhxbPBYe5DE+L04SrcjmHmY3Nt4XHD\/n4K6+x8Lr61+nn++8ngIsx9nMHI9Af+yD+E1\nJ+buZ1B7mJQxQSYndzOY\/iyL6c+zmGFMfZpB4\/M8Zu4lMXI5gNw7AXjXA7ulG\/mWT7D296f92u\/r\nusZneVTJQPXDhIyhG1EYqnZENwKYeJTCsY8EsLQEdezjJKr3I6g+iGH8fgyTnyZl+qcIfP6TDHJb\nAfiOe8j6IDeXxOy95Jeb35RaXgnc2a9GddMEEN+0YmTbhzr1JACVbkdhmfGh+L5gLS3PT3+Wk8y5\njqvRv6BkdMC72oXgaR1y1wYwdjciQY5zg56VIFIXAhi5EcTQVT+KPC7v5v62tN\/696nXpz5KIvvu\nAEIndZjij89+MUSWcijeCqN\/KYA6010nK5OfMp38boEFEjlrRP+iEs6lTvhPaBHl58F3bIhvWWTU\nHiRkwZSuhFHYDlEuAQxf86PAWPowqfurAS7sZndHbwXgXu5C5W4YjV+PYvFXBcx9NYTUOTds80Gp\nt8ndrAQ\/99UwFli9jedFjD+Ko3Dbh7F7IZTvBpG\/6UT26gCSF20YveWTMll4lEHxZgjFnTDPheBZ\n0iB73rm3+mBw\/18EN3wpqavciZI9J0p3AlgiuOXvymh8W8QEWXXN2GBdiqJ8jxYjCoIaEwAXvyni\n+HclrP5LBeu\/q+Lkv9aw\/tsKVr4vYelXI5j9Mi8ZH78\/iPKdCGq34yi\/H8UYf2v4ug+uhW5UbgR3\n\/7yNPK2momeCBBaR\/jXDlApPEyDnCSK54YKp7oSNAF0r3iZAXjMrARZw\/HkJK7+pYO23IqpY\/c2Y\nPLcoAH6Rl3ptAoxi\/P0Y5cKCuhtH5YMYYmcsDCsq14P\/sx5rd+I7Qg+Jc36UdiIUdJwmnGEV5mm6\neWS3PDBVLbAshBHZTGP4SgbHP8njxLMy1p6VsPwtgTwrSkDL35cJtCzfi82JTYrNiiIThSIAlt6L\nIHHKJT\/XCFo4RXDVgNxF197sjfAfG\/rYNd9w7l0PCjcCSJ72ULhhjHGHwmTFrvMXfbCOWzB4PoHV\np0X5Y1Os3KnPmyHY2fh+jGIPwDFtRmi9H9lLXuQvC80NSpbmef3cbk6+FwDTF3wwFA3SHwXI6gdx\nFg1TPd+N8mX\/jyzWt\/2vuea7\/nPomhdl7iqy7ETfnBdx7i635UP8hBNmMpe+EMUcwdRZHAKc8Dfp\ncQQngyxP0ZRHrg9CPWqHaqQPXQUb3A0PFumlcywowZQAUyHIKW6+cjOKAi1nlFYjfnvkhp+bMyGz\nNfD8D4rCVQ2u6eWNpeu0kEkbzFMe9FYc6C3b0TtmR+hUhLaS+sHzmrYy92RYFsec6Ls8Tn85RJBN\nRn0bCVgbMbhPxKT\/idS+iPpDmvvDZkrHqPUiq3h8O4LCdVb8FS+JcCJ+2o7Cpqtp4CPX\/c9FqYtq\nSp72QjNqhokALdNeWGb9sM4F2OJy0pQFcyKdomCqD2MovOfDCGNeWhB19qQJMredgnVRSESAS8t7\nRbeZ2hVFEsfojh8jNxk3fNJqhPaFxtMXXRg814\/oCRsG1\/saEmBqa4CO7sPQxQBCy\/3wr7sRPxuC\nfd7HjsEbLw\/KHU+SPZHSAq3HvaKGd62bfbVHxvQXrPanTZDT3MAxgnKvxyWwY4I1KQsyzwic6IV9\nqh39Mx1wLqgRWNUTaAD5Sx4MUk7xUw6EVq3wLxp2JMDEGQcy5z0YvUyK3\/XSkwLS5cs347KlTXwo\nUpJspoq91r3SxS6hYRvrRWhDL9tZnT13UVgRJxiR\/il2F9dasJnWH4YIcU4UV\/ycWQJ0LqjgOd4D\n37KWhNiQeccNR90AW9UIz6wF1glTk0HLpLXhnO7jpOFB7rJX9sfCzSBqd2IIrvkp6BgmyKCYTNJX\nHPCtaySo6DkjYlsmRDeNZCfd9Eq2uzmhRTKlrQzIChYgJ2nQ0wLg4yy1HoNrUQ3nvAreRg\/8K718\n34Us0xtctaEjpUVnspeFaWsWSndOV3HO2ylOF1LnByTdQpNifht+JyQBCtMWLETPmiR7kTMGJM5b\nkLpk41xoxeyTXNPvmGbRMcRmjJNeeCkZwf7Eo2YGxHkx9dSZidRFB4LregLUEaiGv830brD60zqY\nSnr45g2YuRXev0+d1+\/4V\/r4pQ199Xam2I8ywQkfLN0Iy+Kp3U9IDQbWtdSoBuEzeiTY\/JOX+mQc\np0GLXi2KR+hUXG9dCEJfc2Jg3sH1orJN1oUeRdHwfY2uMcZWV6DF5C57kNwcQPRkH1rDatirWrZU\nHcKrFvc+dUa\/E1ixcwjVw3asnVoYQIU3Vu8KgCHpT8IS6lzUzXHKu9KD4MleyWJ004SRWx455jf1\nl5daK2zHZPVbZwOI0KLSnB3T9NTCdrhpylxbWMzodlAWaFqy5+AQbMVhtwK+OSPcc71wTHSn9pHS\nncCyjYOkDn2TSkRPW+QCwvFL281pQ3YVmmz4lAGuJTV8qxqy2SuBTjxKkDlO26xkAU74ZZyPAqnz\nlMVdjmlioKUW6x8kaCU+uGdIxopDjloCnNDe4NmmtTimjTjqUyC8bCK4LjgmCVCZ0uw4pi0sdxNT\nrCRQrWRMNPAKm7lYqLQTkp9Lt8PwNLrhXFSRzS7kr7vkw5FsfdSYSGGNel36OC87hWhpQiJCMsLv\nRPGVyZprwYnuYTOsdRvskyZYakZmzwRVqgvatBpBArRUOghQQ4AJTcpUMSJBgVpr7byhgzvzyGZe\nuhlG7pJPFk7pvbAEKXQzsu2XOquLiVp0GKZfeKXQ1dxHaXnv2A\/gxPXN4aAJULhE6rwb5gk7QZpg\nKJmQOOHA0DknFGElrGUtAgRorXbCVuw4tK892etWZ7WyvSQ2+vhFGwY37XJwkMMDB1Thj4JJkW4x\ny1U\/iEoJjN9rPqdU7yVktQvtFimL0k5YamyIzT+wpmM\/7uFQ2kN9uyRA4XmBVTvaIl0Is0CDy2b4\nlox4c+Co1J9nQQ\/LWAdZVe3fpxg07m+P95A5+hpBJtlZMhfcyNIXs5fcFGs\/5zTnH3hkQIpbpEwA\nEWyVyU6WU0n0rE+yJDfCtPbPkYV6G41ZyWDKGNlLLmlpiTP9UCVUiKyTlPF2eJdMOOw6Aj+PNsFe\nVf1fLwcGRUK715nWwN+g8Z60yXQL4Q6y9MMrLuirPMcUZF+Y+RW2RvZPYUm5K34+LLlgqA0gsemV\n5wrcQPycjdpqlbrun+7EwIxayid+pu+l5ynjHSwIKy1FA32hG6pYO9\/3QjfUCku58+pLgK2D+oYi\n2gXNEPNPkMFVC3dmRfykHeaKBT0FC4cIKyIn3EgTRGbTxzYlPG4AhnEHdJVmRDlxy3ZJ8OETJpjH\nCXCiXQJ0znWhf0qFGP128KyDa9nQk9NAnRHRg0NMryGvQl+tC\/ohBUzlzh8fohTZgf1tUTVC82bk\nTjk5E1q5mB66oh7qvAHGshXDFzwYYuqHqZ8RMlm+GoR3wYXeUt\/L8Db6kbnolsabvjDA+47CUlUQ\npJJ9tlP6bGjdjNipPvhIhJCWIKYlpMIvLG9Cn+uEudgBw0g7rIWOP56qVUO6rf4JDVzTOiTZE9Pr\nHFTLRiiTWtjrZrnjGJ0+forFRAaE8xeY7hKHDA+ZFCwbKlae70dqy0mgLrjmulmlR2Eaa4F5rJWA\nWyW40IoFxpKWVUtwQRWO+JX4hekQtBklDMPtZLCt8SfPJG\/FTa85jvUI95Y68C8ZkGGKXQRnKvfK\nSgsx9cJQhX7E3JYiyNR5F1nlYwLTbqsJFm2yK4gpSejY39BTf90YmOriOK9FkOBEG1NEOtCd6YZl\ntBfGYQ3aaTFvuVrQk25r\/Al7L166vKJmH6cRT2uZPgP1aEScdqAb6oJv0SitILRi\/rGQCFIwKSpf\nHIfob5GVfrkR0baEjkWEOd+9sBLPnB6OCrU+w65U12BgvAt9JRVspU4Ycqrnf\/axUyDX5Vv22oMH\nmDa9XDB83IK+ikGy6p1jO6yp6JVKuBd6m97JdAuggjFhU6nTLBZ6m48blJvi0Utf88xyrJrqRWrF\nBv+sDo5j3bSSLlgIzDTa1J1+uH3rLz64h884WlTRg9Bmj8ArQDLCC30wl7qYJg00mbegjPwcHbE3\nYCy2IkyGBJtCW+E1i2QqsmyBrcICS3ahc1CNtqgS3fFOJJbM6CcwAc4umGPYKmphKQQp9Kd4\/a\/6\n6yN80troTr1NMEeoSfrjrEHqRCxmG1dBEfo5NXMA6sQvaRVv0fl11JYZ\/uMmKQ2hsQDnuR5q7G1v\nO1rcLXAzndYxNaxcQwBzTPRAP6KgWR\/i5jtgHlVW\/6Y\/kKxVdUoYprncASvT4GWnaQspJEhzUUmA\nb0DJkCDTb7I1KQlMi4FJLUSx9fE6V60Xv7QfgS7dLlMoLMRaUUm2Wnw\/QxulJMBZxzqqr\/QXnLmk\nbDEVlXtGLmgtqtHiJxuBVqkZsXBn7CCEXpWhN+RRmznc3AA3ZCwoYSSot12tUMePSvuQ9xFki\/d1\ntAUOsMWp9mwVVcvf9SemKBxtVhFpDxx+fLC\/BSIOe1pZ2Upqp8mGflghgwUmwYlzApwu3yavV8UV\nEqAEze\/Eddaqaut\/tZNXfR0wHPjng\/YjV18A7Yi1SVZEJQpggp0X4LpTbXjb07xOHDVZ5Z65pNox\njLbrjAXF\/n\/on+k\/7f7pPx10HHUfdLZtHXQq9g4TwBFf68sQhivOH3Iqdg56O9yiCbzqb\/03uvPg\nzHoo0rwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_theory-1312587221.swf",
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

log.info("mental_theory.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
