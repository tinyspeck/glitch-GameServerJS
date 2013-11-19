//#include include/takeable.js

var label = "Jack the Pumpkin";
var version = "1348102174";
var name_single = "Jack the Pumpkin";
var name_plural = "Pumpkins Jack";
var article = "a";
var description = "Part-vegetable, part-sprite, this is Jack. He makes you feel a little autumnal, a little festive, and a little like your soul might get dragged, screaming, from your sleeping body.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 41;
var input_for = [];
var parent_classes = ["pumpkin_carved_1", "carved_pumpkin_base", "takeable"];
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
		'position': {"x":-26,"y":-47,"w":48,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAM9UlEQVR42uVYaVBUVxolM3FfaPZm\naXp5r3EBJQS3RBDFqCgoKoK7KIgiIoiggKCsIqsoKCqojSuKKIoC7u2+G+OCGjei0cQlESNdNVXz\n58x372tNzGQqVmqmyqrpqlP9oO+799zznfPd121i8v\/wio+UuaYm2usLCl30Jet6VRcUObt+VAST\nY230aUkKFBZ1R+mWvli+0hUZyY4pHw3BzFSVPj7KEvPn2WPZchfkZDshKc4GC6Isgj8KgtmZoj5s\nmgXSMpyQkKhGerqIyeNaIzDQxPSjILg0Q9BHzLRGXmE35Czrhrg4e0wManX14ylxilIfHSmn8nbj\n\/gsPM8OkoNYfjwdTE+xSYqPkyM7SIjenE2aGmmJyYGuvj4bgujR5cEq8HdKTFZgTbo7Qye1wrsJd\n98sRbfSrw5r\/rQ\/\/ccZN2Xx5bLShIUlvaIiH4XIADKe6oemwFs\/3a6\/e3yI23dZpsXiuBZJirBAZ\nZopJY1vj3mYtbpdrcWej2Ni4XYun1Vq8rNPi9VEtDGf6oPnqlCbDrcWFb65H+f8lYmznPx8UU94c\nFxoN573xaL8Pms6OhuH8IDSf\/AyvjnTFi1otvtspMhIoS7FF4hxzRIR04Amuz1bjZpkW97dq8Win\nFj\/sJYL1nfD6WDcYTrvzeQyXA9F8YThen+xR\/bJO9eGWeLhd7fp4l9D4eLeAWzon3K7wRNPFUBhu\np8BwKwmGb6bDcMEHhpPOXJEf94l4VC3gymYVJ\/1sn0To+130WY0Wrw5p0awn5c5+yUkZbsTQXOk0\nz0w0n+lL1RDxbL+Axp2awj8ld3WdKvjOZgENG4jcRoHK6QrDxeEwXAuXJr216FeCVOpHu0R8Vyni\nFZW8yYifD2rxok4i92Q3kd3zG4JXxkoE72TReyzIPmg60RtP9wq4V6HBNzrV1ctrzf7Yt6eXqYKv\nrFHjzHINHuzQ0M5FNB93guFcf2liRuybEMmHZz1IJZF8KOIXUrH5OBE42QWGE1q8OablhJnnfiQl\nH1eRX0lZw2k3aWNfT6INz+DvzefIOnpXPK\/T4O42Da6UqnFyufLq4ezfkazNtFUez1PjWLYKN8o1\neFIj4OUBAW+OirRwV07IcP4rCaTE\/Qon\/HxAy8kxJfkmLvpKnxORN6TYq4M8SHhCAWncoeXjOUk2\n9sJg\/v7m5Oe0GZFsIuBBlRqXSlXQ5yuxL12he4\/g3hSFvj5diZOFKtwlqZn\/ntUKVC5S6IgolehE\nJ67QoyqRK8K9xZRjCzJVrkdICnN\/dkHTEUlFVuJHlVo83Capy++hud7oRRoj4EW9gO\/3kILb1bi6\nXoUjOUrsWazAtvkOUnC2xNoqdy9UoDrZEVfKVLi9WY3GSgFPyBfPa0XaucjJMH8xcrd0Ig8D+5uX\nlSl3PRKGu\/kw3JwvWYCUYgF6WS8FhiWZJfrZfqn8TYdEbqGXdQKe1vCAoIFCdpkUPJLriJ3ERzfX\nTlJRN8dOVxHngNoMR1xYrcL1DWrc3aqhFkI376GE7WOERG78c4Ui72nvCDJVWbmYPxsSJaKX\/Hm4\nXv9OwftbqC3tkO59UceSK\/JwPKoS8O02Na7p1DhfosTRfAUqFjhg3Rw7cIKlEbaN5XMV2JGkwo5k\nB1Sn26Fhowb3yLQsoU92i5zoLZ2Ar0tEnkzWSlhamdcMZ3pKSWdBujSK+5WVkSnFyLANMWL3iOAD\nKjOb6wfCk2qRk2Ppbdikxq5UO9QsFaAvdsa2eEesDieC+aG2SnZREqFEVmgnjPO0Qlf5p+jXuRUi\nfE2xOdGWDE4TEdFTOQJfgKWSpZOpw1Tk\/mTtiBGl0jJyTL2fDkgbYf3wYYUWdzfRyVIu4nElm4\/K\nukPAwVwF4gJkfD22buI0F5ytGI2qjO4oCrWFSe5kS6\/iMFusiVAgb1ZXhPsp+MC3qM1S4C71xftb\nBZzIpvctIlfjrYrMY8yfzG+\/HJNSzUgzcizBTD1e3q0SudsbRNqkiHtbRXxL8x4rVL63XlKIMw6s\n8cHmBC0KpsphkjXe0qtwmpwI2qEs4XMURLm+G9xD2QLXyjS4uYEa6BoBZ\/IFlCd2ReokS+gLHXn7\neFYjlfGneokUA\/MqI\/90j6Q2U+9wjiMSx1jgWLkfbm1y4na5sV6Dq9T33Gmdt2vmR7uhMscLayPt\nkT3JBiaLRll6ZU+2RnGYHNsWu2Bnrhd8e1rwwUO6t8GlEppkjQbnqHlfXCGgbnkf+PexpElbYZhb\nO9zZInAirOTs5GBgoWAKs+Q+rBAxdYApeqpa04Zb4WCJF66XibhWSn6meS+sUmMwrcPWc3NsBd2i\n3li\/oAuKiE\/meGuYVM7QmC4Zb0Vy2mBDjAPqSwajpngw3GlCdtPKCBtcKNZAn00kV2hxqXIEhriZ\noY+mDb4Q2mBnij331OMqI3ZKfmXhekDkjlLT9dC2xZc0lt2TH+FMJ4UTLq0UcL5Ig630mPZWvcSJ\nWhRFuWD1bDvkBdtgUYCllOLkAMvqrEnWKJlli91Zrri4cwx2Fw1GD3UbLn98gAXi\/C2QGtIZU4c6\ncmJs0X5O7XCNyvSA\/MSUegvmMebVu5tFsKOzf+f2fCy7Z6Bze4R8ZYMEWjyBSt5L3RLORC7Mx56H\ntChciRXTSb1xVkgYYSERjBsu808NtETBNBuUEvujJR64d2wqjmwcifEDHeCmaMnL01vTGl+KbeFJ\ni\/Xv3A55oTa4Raa\/TQ8V325kj12CBBYGauY31wu8nLnkce+u7TlRdm9fmoOp2VPVCn2J9NxRjpxc\n4UwNVs2UI3eKDZJGWWKuj\/mvx13iSPNGVnPGvizSDpVJAo6v7ouG\/YE4tmkk9q\/1Re1aP9SV+qF2\ntQ\/ql31OPVHg4WEkrq8TcWOdwHG9TCCPifyzy6sEXCoSUBqlQuJYFeLGSIgNUCI+SI3cGVqykQal\ncxxQEm6LPLJaapA15vtaYNYA2a\/PiPOGmhcmjbZEDiVnJbWdstn22ESe3LFAgf3pTvQA6or6HFec\nKXHDwSVKnF6mwfkVFJxiIrBSw4kwXCkxkiKPXSBiLFxs7IlcNfalKFFJX0u3x6uxZT4hTomtsQ7Q\nRTlgzSw7LKMKZlIeEkZaYPYgs\/e\/Fc72linj\/MhnVGomcfF0WxRNt0NhiB1yg+WIH2WFijgF9i1W\n4vASFY7SE\/MJevo5VaDmBNgj2lkj2PXpAg1O5Wv4uJo0DQ5lqrA3mR4CFqpQleCIVTNskcPWCXOg\na0ZOjiVUQWNpEdqvw79\/6Z89yFy3YIQ5MsZa8RRlh3VG2BA7bm7muSUT5WBndg2RrEtTQRcrIHa0\nEkHUdmKG2yB2hPwd5g2XY9wXlgjxlqMoQos9SfQAQMdX5QJHlEcp4NO9A7w6tePlzg1RYekEKbUx\nw8wR1l\/WNMP9Dx5aZ7ibmMYMNW+K95dIbkrthdKk3jyB3l3aExEZFgawnklHY7g9CiO7YsYQe0zo\na4XJntaY0s8awf1sONj1JA9r\/ln+bBfyth2WhzKlbBHqbY5BLh0wgEJTPL8HDwcjF0vkwr1liPez\niv6Pj\/whHu1cIwfJOMmSuZ1xvjIAmbNc8ZVzB9p1R\/i5yTCyhxnG9LbgCk30sOJkpvW3QcgAOS0u\ngV1P9ZKIMpJjaWxAL3P4u5vB9zMZhnTriEV0rB0uHcLL+pbc3MEWuj\/9XsJIxgw1a5o\/3BzbMnrh\n4YkQxE3ohOgAAfMCtcia9RlKk\/viqG4EHV3+OLt9DB\/DcLt+\/Ltr\/UZ\/\/vnWpf1JqV5ImOCEuHFO\nWDilC6qLfXC5KgBZwQpe1shBZkgfLdd98Dc7Vu5ZA2XVbGdZwfQIltcXNQUe2FfogdrlHtiT1xvb\nkp1RscgF5XEarKWzvDTC\/h3Y31sSOvExlWmuOFDkiboVnthP9++leTYlu\/FGzALBPDfNU\/bXfomY\n2a\/jlOghMj1Tc+FoKeUZ46yRQe0gZ4o1NXc5JV1O\/vodQqT\/s7Dl0rjsiTb8bE0JtMZCY0lnDzRr\nCvXsuCz0S5nyr\/6w8DdCG4JsziCLqFhf89eMaCL1KbbIIjoC04IseXvImvg+2P8yaSPpFLa0ICse\nAtbfGLHIwRyHNGYtu9HccoI5oR3h0w8l9omRmJlxAjWhM8EtqGfHVdM8OzYsoE4\/b5gZYv3M8Fbd\npNFWHOw6cZQ54un8ZmVkpwLz2dR+pj+OdO9wwV7WIobmGkboRehK0BDsCBZGon\/\/EJKtmXJGgipC\nJwL77dmbEGhv9ulCF4dWZU7yltu11i1rvbq0bZjhbfrP2YNliPYxw3C39s81Vi2uaKxbnKKxNXTP\nCgL7SW4OYTxhCMGd0OU3BJmSbY0CffCrJaEjwYpgb1STkXUxLuBlVGMUYRxhEmGy8Z0RCSD4GjfW\nm9DNWA2B4ECwNs7f8r\/5o9cnRn+2NCrN7GBqVFxmtIaZ8drUSKC9cVwL470f9PoXnPAqFwnQSCAA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/pumpkin_carved_1-1319852471.swf",
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

log.info("pumpkin_carved_1.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
