//#include include/takeable.js

var label = "Steve the Pumpkin";
var version = "1348102174";
var name_single = "Steve the Pumpkin";
var name_plural = "Pumpkins Steve";
var article = "a";
var description = "A widely-grinning pumpkin, ready to party (with the addition of fireflies). Could be accessorised with a pile of pepitas to make a puking pumpkin, but that's a matter of taste. Or lack of taste. Whatever.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 41;
var input_for = [];
var parent_classes = ["pumpkin_carved_2", "carved_pumpkin_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by carved_pumpkin_base
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
	"conditions"			: function(pc, drop_stack){

		if (!this.owner){
			this.owner = pc.tsid;
		}
		else if (this.owner != pc.tsid){
			log.info('pumpkin_owner: '+pc.tsid);
			return {state:null};
		}

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
	"sort_on"			: 52,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by carved_pumpkin_base
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// If we have it, then it is ours
		if (this.owner != pc.tsid){
			this.owner = pc.tsid;
		}

		if ((pc.location.pols_is_pol() && pc.location.pols_is_owner(pc))||
			pc.location.is_party_space){
			return this.takeable_drop_conditions(pc, drop_stack);
		}

		var entrances = pc.houses_get_entrances();
		var near_entrance = false;
		for (var i in entrances){
			if (pc.location.tsid == entrances[i].tsid){
				if (pc.distanceFromPlayerXY(entrances[i].x, entrances[i].y) <= 300){
					near_entrance = true;
				}
			}
		}

		if (near_entrance){
			return this.takeable_drop_conditions(pc, drop_stack);
		}
		else{
			return {state:'disabled', reason: "A carved pumpkin can only be placed inside or near the entrance to your house, or in party spaces."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var result = this.takeable_drop(pc, msg, true);

		if (result) {
			if (isZilloween()) {
				if (isLit()) {
					pc.achievements_increment('pumpkins_placed', 'lit');
				}
				else {
					pc.achievements_increment('pumpkins_placed', 'carved');
				}
			}
		}

		return result;
	}
};

verbs.smash = { // defined by carved_pumpkin_base
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Smash it",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.apiDelete();

		pc.createItemFromGround('pepitas', 5, false);
		pc.sendActivity('"PUNKIN-SMASH! Oh! You got pepitas!"');
	}
};

verbs.light = { // defined by carved_pumpkin_base
	"name"				: "light",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Light this pumpkin",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Use all 7 fireflies to light pumpkin",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'firefly_jar' && stack.getInstanceProp('num_flies') == 7;
	},
	"conditions"			: function(pc, drop_stack){

		function is_firefly_jar(it){ return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }

		if (pc.findFirst(is_firefly_jar)) {
			return {state:'enabled'};
		}

		return {state:'disabled', reason:'You need a full Firefly Jar to light a Pumpkin'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.class_id == 'pumpkin_carved_1') var lit_class_id = 'pumpkin_lit_1';
		else if (this.class_id == 'pumpkin_carved_2') var lit_class_id = 'pumpkin_lit_2';
		else if (this.class_id == 'pumpkin_carved_3') var lit_class_id = 'pumpkin_lit_3';
		else if (this.class_id == 'pumpkin_carved_4') var lit_class_id = 'pumpkin_lit_4';
		else if (this.class_id == 'pumpkin_carved_5') var lit_class_id = 'pumpkin_lit_5';

		this.apiDelete();

		pc.createItemFromGround(lit_class_id, 1, false);

		function is_firefly_jar(it){ return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }
		var firefly_jar = pc.findFirst(is_firefly_jar)
		if (firefly_jar) {
			firefly_jar.setInstanceProp('num_flies', 0);
		}

		pc.metabolics_lose_energy(5);
		pc.metabolics_add_mood(20);
		pc.stats_add_xp(5, true);

		return true;




		var remaining = this.former_container.addItemStack(this, this.former_slot);
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function checkRot(){ // defined by carved_pumpkin_base
	//
	// If it is not Zilloween, rot the pumpkin.
	//

	if (!isZilloween()){
		this.rotPumpkin();
	}else{
		//
		// Set timer to check next game day.
		//
		this.apiSetTimer('checkRot', seconds_until_next_game_day() * 1000);
	}
}

function isLit(){ // defined by carved_pumpkin_base
	return false;
}

function onCreate(){ // defined by carved_pumpkin_base
	this.checkRot();
}

function rotPumpkin(){ // defined by carved_pumpkin_base
	var container = this.container;
	if (!container) return;

	if (container.is_player || container.is_bag){
		var pc = container.findPack();
		if (pc.is_player) {

			var auction_tsid = pc.auctions_get_uid_for_item(this.tsid);
			if (auction_tsid){

				// the pumpkin is in auction		
				var ret = pc.auctions_cancel(pc.auctions_get_uid_for_item(this.tsid), true);
				pc.createItemFromFamiliar('pepitas', 5);
				pc.sendActivity('"Gadzooks! The fancy carved pumpkin you had at auction has rotted away! I guess some things really are seasonal after all. What was left has been returned to you."');
			}else{
				if (container.class_tsid == 'bag_private'){
					var s = apiNewItemStack('pepitas', 5);
					container.addItemStack(s);
					pc.mail_replace_mail_item(this.tsid, s);
				}else{
					pc.createItemFromGround('pepitas', 5, false);
					pc.sendActivity('"Gadzooks! All the fancy carved zilloween pumpkins rotted away! I guess some things really are seasonal after all. Still, you might want to check if there\'s anything left of them…"');
				}
			}
		}else{
			container.createItemInBag('pepitas', 5);

			if (container.onPumpkinRot) {
				container.onPumpkinRot(this.tsid, 'pepitas', 5);
			}
		}

		this.apiDelete();
	}else{
		container.createItemStackFromSource('pepitas', 5, this.x, this.y, this);
		this.apiDelete();
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"zilloween"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-47,"w":48,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMGUlEQVR42uWYZ1SUZxbH2TUqiMrQ\nywBT3hkQLNhFoohgQaxB0FUpKkKUagSlWBCliQoqiIoCgkiRKGKLYAFD7DWWIGpEjdFks0qUyaf9\n8N973xmTuElWzdk9x3N2zrlnOMzz3Pt7\/rc874ye3v\/DKzFCEpyaLG\/YkOfSsHn7oOLMTKXRewW4\nbJEF0lIUyN3SH9tK3bA+u2fbinibye8N4Orl9oiNMkfycgWyc3ohI1VAfJQplsZay94LwDWZjpjh\n1xXpmU5YleaIJbHWmDWt89X3RsHMdDXC51tiRYoDthQNQViIEWb5d855bwC5\/hZGWyNnYx9syHVB\nwHR9BPrrj3hvAFcm2jbELbTGmgwHZK1xFAHfqy7OWWpVvDJRilXULOGhEoQGdcNPp12T2+qE4P95\ncM35YS4\/fTk3uf2rlFbNjRhoznujvVGN53VqfFeramgpUePMZgWSYkzB42ZekCGWRRjhTqkat4vV\naClVtT7Yo8aTWjX+cVSNlw1qaM55ov3a\/NafWlYna67MdflTYM8PK2Rt9UJx+ynntram0Xh42Aea\nS1OhOTsCL0654Hm9E74\/pMbdMhXu7lIjdZEZEqNMEBpoiJCALriS54DmIjXul6vxaC8d5qAaz+qc\n8KLBBZozbtBcGE\/+\/PHy7Li2Hxt7F3O8t4ZrrRKCH+9Xtt2tENBc4oR7+0ZBVK95FTS34qG5EkCg\nHtCcUqPtOKtDkNVK3KxQ4PvDWphva9R4vE8tHoLX8FpxD+9lH+zr8nS0f94Pz+oFPN6vaLtXJX9z\nSVwvVBbfKVPiWoESD6oFaE4P1irHgLdTtc6vBolp4qD3KlR4XKNC2zG1aM\/JnlEq\/06gTymtjz7V\nQoqAvIf3sg\/2dT0S7ecn4tlxFzzcp0TLbgUub5cX\/yHc6U3y4stb5TiTo8S3tQLaThBgUx+quzHa\nk38ZRgFmQ3NxMtoaBohgDPTypA7gcyexPl+c0NYoQz7Zr8ZDgnxWT5+fHiTuFX2wr8sz8PLMSDw\/\n0RNPDgq4tUuJi9vkaFxv\/1vIunR58Ofr5TiRqcDdSiWe0oZndSq8OKmC5ot+2vQwKKnAcPerVCKE\nWPT8+blR2rridU29RUhuCk73N1SDrZUEflIHyUqSr\/Yz7lTPffBDHaW4Vok7lQqcyyeGLBlqU6S\/\npHtPvLHRwZWytpplchQtVuFeJdeEQAqoUJjQAymzTfDksJJUchSVul+pwg9HdLVFqnFna67NpZSF\n\/1yfYqeTalyTj6keW6u06RYPRD5O5duhaEUvPDwyGE8PC3iwT0BLdW\/c3DcaR9PssXeZXRtziYDl\nsdLgmqV22BHrhP3pjrhdxvWnpLpQoWTlUDhbfYC4aRKxxm4UqigQAX6mxo8ndOpxjd5cDM2ddWJd\niUoSOK\/nNHPDPCDAe2Xa1DdTM\/W26YhIXyUulbnimxol7lYpcLNEgRu1E9GY1x9V8bbYEW2lVXHn\nQmlr5WI7lCX3R06kQAtpQ4USV8rdkTTbGS62neDd14DqUoXzG1RiXbGCP7KCTS7aumKwW4mk5Dxt\nKZDa\/w7I44g7+3i2LQbYd8YQpT6Klg3Ezd2OaC5ToCnXHueqpqCp0ANlsVJsXWDdqpcXYi0rirJF\n2SJb1OR4wmeQKfw+NMLqjx0RPd0B\/cnRIDk5U+jjbA6lf7dKDMiBuUE4lZozwwjyI3FsaC5MFOuM\nU\/msTluDDMU1yMP7IQ1tPqir0gCDyedQwQCh4ywROckcA+Udkb90KI5t9UBxtBR5odbQ2zjHKrgg\nXIryeCVOFE3AJFdzUf5+dp0wUKYFcyMn2fS0cipTwP0KbdF\/d0DbBKyiCMmp5gYgRdsbtCOHVX41\nar6mgX17J6uowsNqFULHGuNDVRcRkEFZ0b6UqaipStSsHYrCKCly5lhBb22QRfKWj21Qnkgtvtcf\nqRF9SbVOpJr2dMPUXRDgboQbOwRKryAqKKpQo51vDMkw3LXcpVyXrCzX6Cv1xPSW8dWnQstOykK5\ngEPpdvDo0RXuDoYiKCvKgmRF9EHZChcURNggK8gSehkzLZI3hVihkB6XTuQNwsWa6RjX30RUbTht\nnjVcgov5CnE2XtsiiAq0Uhc\/qtZCMkROhDXWzjcTYf9BYMsDLbAn1UHsXj4Mq3enVIWvdpAVqdBM\nkLeKBRQusoGXczcCNRSF+Ju7BflyxrYYKTaHWSFjJgGu9DNLzgq2xJb51qhYIsWRDDVObh6MXYkC\ndsdL0ZQjx9WtAhozlaSiitJECtD9y6OGU3Wl2BnT3C0R5NkNTw9oUzpnVHckzemJr6ucCU4lHqqZ\n1Lu5XYXrBWpcp\/drBQIubaF0JtujdLEU+ZF2KE+QoYJiFsbYIGeuJVKmmUMvO8hmcjqR5s6zws5P\nbFCdaIuDK+1xLEOGxnVynN6gwIVcJY6mkILbKMgOGhM7ScndXI+k5h4VDmQ6oGa1rTh+2MqTpGig\nbhfhSrWK3aTDfblVhcv5KlzaLOBCnhJnNipwii6HY5lyHEyxQ3WSLUpibZC\/wAqZAZZI+shM+1yZ\n7GfWlhVsIeZ9V6wtPk2yEyHr0+VoWCPHF9kKHFimwBfrCZLU5GDNlKKWUkFUk0EY9pV9TXXKTzkt\nnFZax8pfI7iLuVTHGwWc3aBEE\/lsyJKLQhxKEQczyuJssY3KJTvEEsn+FljsY6L9XhM\/xSRn1XRz\nbCIVd0TZiAsZ8gDJX5dKV0+GHDVJ\/K7ARTr5lS2cKlKlUBBr6nYJwZTwu6C1nbqU0lDndPL6i3kq\nnM4W0LROiVNrFXSlylGXJheF2EuxdsdJsZ1ibwql2guwQMIUU0SMkWgHdayPRLbU11z8IC\/MmhrG\nhjYQZKIdalfIcJBsb6IMR1bJ6RpSIs7XCr5DDDF1SFdMdTWEn2tX+A01\/MVc+f9ktMaX1nw02BCJ\n02xQlSTgeLoS9XToz8hXLT2BVydolSvkuUeNsSbQEsunmmGhj3Fb2ADjX34AiJtgcnWFnxnWUcMw\nJCu5I9IG4WMlWD3THHvi7UXIvEg5fAYYi9ffuxjv2ZXghCMrFTi4XIYiEiF2kokYp5Bs88c0CSh2\nCmVyyUQzLPCUvP6tkOVcQhtSZ1hg\/WwrZNOQnOYmEZ179+lCitqhcrE99qe5YNxAk3cG5D3VaUOo\nVGSkmj3meUnEW8qjhwHWUyyGW01wnNrIMSYIcZP89gk7aqxxKy9gyOxQOUK8pT8HiJtsil2fUIdn\nDcRkN4t3BuQ99ZtH0iFlVEqWGCDrLF4GPP84Fsfkrl3oTXDDjRp+\/0egiWYjYryNkUSQG8IdkB3t\n8loQf6qngJFm7wzHNkTogsBR1ggZKaFLQF+83vj2CKb\/caxXcAs8jbF8gsUff5EK8+gWHE335KpZ\nUlRluiMxqMefAvq18d3OT0R8hfJ19uohIdDLBqUpbsicqxDhwgh+6STzN38vYchF40yQNU+J2o2e\nWBPVD\/1l+n8Krpf1B3CRvv7w4eHcFckhPcm3FzLmyES46NEmWDND+vbfo+cOM3SJHC25muhrgYo0\nVxwt8MEML+lrwYc7dfuPcD2tObUG8Opt9LNys0i12twxqCSfSb6WYkPMdTe6+rtN8UYlB+gZzR\/Z\nPZrqsjV9tgx1W8egrnACNsQPQVqIEp+u90DgWLs\/BPQfYY3GkkkoiHNGzDQ1Ktd5oX7bGGSSr098\nTBA+0uj+7GHdY16bd+\/46kjWlcx04TizgiXjTZG30BnHt4\/F1kU9xZFwsng89uV6\/9byvHF1vz\/y\nIgSkzrIR9+TTXgaLGWuKOcMkG8mvLZkFGQPqk\/31bcE+0IGZkUnJBLKeFkZ6owPcJPvDPCUP4gh2\nkY8xYicYg+dnkq8p+DZi478TJpuIB0iYZIrFtJbrLOBDo\/tjexkekuh34FrzJONudSSTk1mSSXSg\nb3x1IDNk5X4F6Ew2mMybLEBt1SnLSdppJ73vVVl2rB\/f1\/ARDXu+PxHuJfnnSOcuD5XmHS8I5h0b\nTbp2qODfOckSyELJppLxz3N9yBzI7HWArGTnd0kxS25AZqxzYKeDddI5H0rmRTaBzI9sBsOTBZLN\nJJtONkV3KHey\/pwJHRSrZqPLUhdd1v5rrw66kxroSqG77vQS3WGMdX8b6YIb6NZ30B36L28b6F+P\neMKM797lIwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/pumpkin_carved_2-1319852474.swf",
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
	"no_rube",
	"zilloween"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "light",
	"c"	: "smash"
};

log.info("pumpkin_carved_2.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
