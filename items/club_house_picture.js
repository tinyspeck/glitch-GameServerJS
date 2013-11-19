var label = "Curious Painting";
var version = "1349301315";
var name_single = "Curious Painting";
var name_plural = "Curious Painting";
var article = "a";
var description = "A curious painting found in the club house. There's something special about the feel of it.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["club_house_picture"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.event = "";	// defined by club_house_picture
}

var instancePropsDef = {
	event : ["Event to call when verb is clicked"],
};

var instancePropsChoices = {
	event : [""],
};

var verbs = {};

verbs.jump_in = { // defined by club_house_picture
	"name"				: "jump in",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Looks inviting",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var xs = 0;
		var ys = 0;
		 
		xs = pc.x - this.x;
		xs = xs * xs;
		 
		ys = pc.y - this.y;
		ys = ys * ys;

		if(Math.sqrt(xs+ys) > 175) return {state:'disabled', reason: "Try getting closer."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var val = this.getInstanceProp("event");

		if (val){
			var events = val.split(',');
		        for (var i=0; i<events.length; i++){
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
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-108,"y":-152,"w":216,"h":152},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALWElEQVR42u1YSY8kRxXOrqw1K7Ny\nq8ysyqx937r2vaq7urt6ene7e6ZnPNNjj8fL2LKxZVsIYcssNxCyOZiDxQgEAuQ7SFw48SuQfGEa\nIRnBBS7cP15m9XT3YBBXI01In6IiMjLjixfvffGiGOZpeVqelv\/zAoZZuskwfIZhREaSpAswV3C1\nP\/VfcHXMGqG5gMQcSakLLAZcfDN1Pu7qu9Ka1LG5aDd5orfEMJrGL0d9n08LCppRNyY5Eb1EAGOL\nwTR+juQlZtReS1zCbq\/GFs\/G8QV61N+3a+pvUD0pcFgpBjEuLqGVZhys0fdnscW73bj\/Av1UEOvZ\nALqW53MiSCQzHbEVWXq0mvKgEOEQDTIOBD18iaiOoBF2oEUMRGPWOWIwTBNhwwAf0S7GyLICSZQg\nCSIMPogIweJ5RIIi\/ZZgCBJU1f5WBLKuIa16kJBcDnJ6AKOcjHIs9IixLcmQUctR39k4xyNv+JB0\nuRF3eRFnXfDFE2AKNTCZAphsBq5cmn43wKQrYHItMMk6lhJ1sPE6mBSNyS1DkvKQg\/4LhAMEvw9a\nYNGWOB+CHhdkToA3HkeT9SAdDCIrhmByfhi6C2vEpap7zxibnU2woLNno2wQ1bAPFQ+Hqi+EESOj\n6hGwzIgIVadgRodghjfgGmyBm+zAPdoBMyWMt+Fa3QdfHiAvGkjpHFKyjLSiOEioBEVGUl20c5qG\ndjaLcK6Oa7yJWdjCTsDAVkDHeiCMZkrGJOlDMXKFYMX0nw3SATQMDsueIJZ9Igo+BWMmgJrbB9WI\nwz2Yg+3bJLfBEElmvAt2sANvfxdMc46ipCKrWkjIGvKyipykOEiG1QuCdtt+lhVlZBJtIqVizkWw\nyRtY4zRMORXtpIyRxaKWFM4JMvYWe8666SDqJo9SiEfNxxF4NH0CamwA8VAKplkF156BHa0RwUN4\n+nMwk12HrJIZICuT9aQgmvkEiuSzmTBZUZVgUp0if8yoKuLhMPKSAT2XRM5MYcqrGPgDOG30MRN0\nrHJhdBICenEPuukrBCum96yT4hyCZVFAm5x42S+g4V2QbPACOpyE640pGpIFV60Kd2cTTG9Gllwl\njBGNpzGuVolAGEk55JCz6yjVNsGkJMGSZAzrLQxjeayLGjaUCPpBBUMvKQdHLuUNohULop\/wokZG\nuyBYi\/sdgg2LLKZIjgVbvHxBsOf349tvvoZ\/\/uPv+NUPP0LWrzjb6m+tkvW6iMRrUNN5TGstFEIL\n66UUkaJScAhOKlWUolGs9\/r46xd\/we9\/9AtsUKSv+iVcc2sYeUS0\/OT3ZhwNkyQuw6FiuC59sBbn\nzvopP0ombW1YRD3Ao0WWGHhC6BGaviDePjjEn\/\/4B3z\/G28h4dPBVdpIWSby0QiSmoysol7ADgY7\nUGzYW1zRI05w9A0Tv\/vsl\/ju\/fuYkdzMFQ0zn4SxV0JfoO1WwqhHBAyJS8PkLgnmNJcTxcvRIPIx\nBfWUhTy\/2OIGWbDKeDArF1Fivc5KS6yfiGhIhRcBkVVlxII80pJ8QbBiWSiQPhq0zfYY2wcnuoVN\nN1nNI2Gm6dhKJLAu0zaTJW1DbKsmKuEABhTFlasyk1WXHB2sql6889Z9fPGnz9FJJhbk\/DxFn4C6\nJ4CqLKEkkPPzXtpG8jNasR29BYrSe88copFIIiMv5MT2ORu2BR8TtLd+i9cpasOY0wLmJPRrmok6\nyzkRvGlHcUz+N4J0QKZ0Ipjm0JYYXBt38MmHH6JM1rA1scOSFVkRqWgIRSGEMhtEQhSdiSMCf2Gx\nH3\/8EXamE8eSNpkCyU2FAsFxAZKYFMlNlBY19MuYkg8fLKcxz4axTpFd8fgwooXOKGA6RhDtTIB8\n9grBNDnkNMsjlZMweuMErfvHaN3ag9WpQU5aUGUiqPOO4z8WYVvbepUycnRk2YRsEo4Y08LSWtiR\nFJPq5FWhpu\/YJC2Jx8CMYafXRrSURXJYReZoiuTJCho5imo6k8uG55JgJsKereQEZJIUTa9cR\/eN\nF9B8+x6Gb9xD67kjlIZNZHUBcU2iCeQLIpYk\/keCtrUMTYUSUZ8gOCkWEKKdkDQeJhHLbfSQv7GL\n2Tdfxfa7L2P\/lbuo5GWsJm1N9j8ZxUMK7ULED6VRQLxaRKRXh7k1QHFzBcVC0vG5JJGJ2YJLvhhX\nQk5wFMmitg9WiGySxkQoudB1HSHDrqPQyAXiAp0i5HdaIuYgXM0hW0yj+ewGql+7h+6rx+i+dAPl\n02fpeRAreRJ8w\/\/kWWwfdTnd6xDkTZIRLQNZSYI3ck5br2eh9ZqIrvQRm5H2jRqQemXyRYO2ziDf\nSUGnBYRiJoJxAxxZz23pqO7OMHnzFCsfvobBe\/cwfv0Oynf3Ue4vw8zG4aFFRCgpGXUysNrLaKsh\nzEmTc6bvywRtHbQJBgyVshYLXtI3tkgTVwoo7K+i9epd1F65g+l7DzB99yV03roHbyULXznrkA3S\nIoROHVIpBSFmwJONwZq2kLo2hLXZhzVqQopFwekUrTROozkE8uNyf4DVUQJKr4JyUsUo6aXd9F6e\nJFXL55wky9EAQuM6QnELS90KRLvuU7rVLEArROEa1eGtJiDX81iaUMo17SE47VCmQ\/2rdYj9MpT1\nFoLtkkOOmVYh0MkkkxZavRqUwTIUEmxfwkB\/tYaPf\/YTPPrbIyy1y1ibU4bT66GWFuko9KGVDF0S\nLFGQ2ASrlA9qfcrvJnTWzjpwj6tw9apgNjoQG3Gw+2P4tgfwbo3A7EzgJ8tE9kYQd\/twTbvw7tDv\njT64g1UEtyZg59Q\/qoHtFcF0S5DXOvCSvDBFC7WVEp3h5Ov1JMx8GPurZUSIqE1wYHnRTAhftmDD\nCsJoEaHNujP50l4XgXGLyNUQj6oINipgacsC8xV4r63AvdHEyrvPQyeJ4DYpadgZQ1gbUD2Fa3sF\nvi3qowWwuyOHbIgW6l9dRvJwhnY3B2alAjMXRb8Zx41ZAxb1VZICRiQzJf1KstC0KB+ku0CWSFqU\nNSsn18CfPIvIvUMkX9iH9PIubh9+C1+\/+WssXd9A\/HgDvTduw3pwHfzBFN7DCQLHa\/DfuAZ5a4rM\nyyfIPLgF994E3t0xyvMHyO2\/CGvYhXm8Cf14Dplq151teE\/3IR\/14T6aIdEdo0BRbOvg5Vls54Pa\n0tkwzaMTEyBTPqesDSEezPDOz7+Dj37zA7z0vQeIntyAdyOHxmwX4ubEmST0\/B7UWzsQ7+5Be+EA\n4RePoe+vwzw9gHZ7F2Ga3HrxDj65\/VscP\/MBIqtjRI63INNY7fQIyt3rUE5vQD15Bh\/c\/ile3\/4M\n6ZgfAzrVGqmrPqgyZ6OMgIJjRbLg9U2oR3Oy5BzGzTm4O+vI3DyAcriC7OltBGgC+c4utJMDqLs0\n9voetXfA3dx2CMpEPvzcDtQ7e2jukPVmr8OzskHvbyN4sgv51gH452bQTzZogRvkr2MU14+QGu0j\nSzy6lM1kIo+3mO6iJY096yY4dEmoe3HKVlIhdE0vehadkaTqw9QSRmmXgzFtQS\/qddCJepwxfVr1\nMEZZiPVkbaMVpdzS9GOacdPVlMOE3GiSCTr1KOF3ME0JmMRJoAltzUNzupGLMAuCssyIpYTyKG+J\nKCl0jzX8WNb8qJosypGlBeiu8hjLphst+qiNRsLnjLNRi7JoxLwXqFsep+7rEgYRCW0rhDal8i3S\nuKtoxN2oRlyUB7K0EA9dvNykhXSr1L2La6f9r4KfYd73uJhP6Zr80AbHUO3yPGRY3zlc1GYWYDwP\nXS6fA+eZPY7Asv6LfufZ+TiGYxy46F0XQ9+x4XJRm6V3PA48Hu4hS2NZxp7T\/5DxMJ+KjPD+4uLu\n\/L3g\/BDPnfKrAPGc09Ljv2jYc7i\/InjM52l5Wp6W\/1X+BY8Xav+YJ5K5AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/club_house_picture-1348873840.swf",
	admin_props	: true,
	obey_physics	: false,
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"j"	: "jump_in"
};
itemDef.keys_in_pack = {};

log.info("club_house_picture.js LOADED");

// generated ok 2012-10-03 14:55:15 by ryan
