//#include include/takeable.js

var label = "Zille the Pumpkin";
var version = "1348102174";
var name_single = "Zille the Pumpkin";
var name_plural = "Pumpkins Zille";
var article = "a";
var description = "A traditional Zilloween decoration, this is a common-or-garden pumpkin carved into a representation of Zille, giant of mountains and mining. Already pretty magical, it will become more magical with the addition of fireflies.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 41;
var input_for = [];
var parent_classes = ["pumpkin_carved_4", "carved_pumpkin_base", "takeable"];
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
		'position': {"x":-24,"y":-47,"w":49,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAQUUlEQVR42tVZZ1RU59bmu+vGmGio\nCggDTDkzIAgIKhgslNhLUGIXxV5RRBgUBAYEKQJSpIiUAUGQOkpRpDgiWLCNXRNjMKbeNMx17u\/n\n2+85kGiSe7\/cb90\/d9Z61gxzzrv38+7y7PcMBgb\/Ta9LRyZ59+VNVN2t8FI9afbXfNwZpH3SuUb7\nuGPtwKP2QN3HbYGuv12zb4uJUbTSQpOW6qDNLZ6ozc4d7\/+vfDxsW+X\/6Hyg7lH7moEn7Wt4+0\/P\n+mse13ipdCUTVdfzJ3n\/blHHPqlRi1Kha49WoDdFgVs5CjwqleOzGgc8a\/bGvaaluNO0ArozDMuC\nXl8bG26pio0Yg\/R0RxSWv4+jhROQdFCqYcR\/6+eWZpn69unlvJ17zcvxvM0bXzc7oP+UHA9L5LhJ\nfnuSFGg7IFe\/sbAl3F7borQHI9iTPEiQFrCF3zYR2pxxq94fV2sCcLlq8UDPqcW\/RPJQnFgVuWc0\nQoMtkJHphLQ0B8RHiaDcafqGk96qxUGXqxfjyqkA6DSL8HOPBwY65PjmDAWimggWE8FsgeB54tES\nLs8UyIUpghg5BnbhEt1wg258UCTHpyfl+FIjx\/dn5fiuzRHXTs7EBfVCdKkXaIccJydIVeF7rRES\nYo39+8U4kuOCoJXvYNXyYb+kuqNwhlFXyYKBC+oF6D0xBz9fkONlp2D3iwbyUynH\/ePkN0uB7kNE\nMErB82kNk9gZMKZDBDvS30dXgR+0hb7oK5yoe1LGaZ\/XyPHVaTn+1kLvzfboOu6Hs\/mzCTO9hyK4\nawdFL8cVcQn2SCAHgcuHY+lSg19S3JI7K6g1bxa\/7rN6J\/ytlbLSTPZo809OjtP0Fk\/XdR\/35f1e\nSHPDuchBguH2\/gbN4YoB\/o8kT95AK6Eld+YA2zUz\/skJuZql+vM6OV4Quo95ovGIH+rTfTTsekK0\nSBUZYYP4eA5ZR12hDLdmBLWvp5fd25hBBPI9wTbM7DB7z6rkume1UiPmizYBtgnmvzVuPE+wWanQ\nGAxFT5M2HRpyzAw1ZPhkDhm\/XyJxfVImBxHlcTnfBVVJU1F1aCrY9RilpXdclA0iI0Q4nGKPvSEW\nCFw2XPU6wZOJwv09R53xuq1HpdwvHVuX5qNuIN9s85rUqQJBCh5P8EzkOJxKnobqpGm8ocqEKW90\n6p0CufZeoQIMN\/PsoY7xRGm0J3JDx\/t\/VimxY10cf8AGEaEW2Lh2JIqS5dpXWk71U6vErjRykndJ\ntAdKac3VLAfcLRDsEDSv+6iKf997aCOMR9O+sTxJSrF9v2afE8pUk6GOncwbKo0RtAg3pUb6m4uD\nvupcrWUFzNB3RIECpTvyw92RsVWM+hg75MdY4EDoaIQHm\/L115lty0eKari\/OdkBeWFuOKZ0w5U0\nYf2lVA47\/W20+gdhQbgplFLxAY+goY0wHmcixoJxM2gNV6iaiGmJcjw5dRvIDReE9oezsqCfuzid\n\/ooXvjo\/B0+qpvMSwLosb68LLhwdi+f1lCY1h5Z0SvEuU4RsMeQ7+HjkGNw7JsfTCrpOqWwl6Tke\n5gTtQepQFYelnkYojh2PVzf88bLXS\/dDp4zPWL7SzTtP6aYrV7oM1aDaoGSvk2tdmAMawhy0hVuk\nRqxon9fLtF+ekeGhWobHVZ74rmcV9I8O4GnbRrzoWIkfexdA3zuBl4sfz7Mu53CrQowXp2V8t3\/T\nJMjT16eF639n911wx+etM3C7djG+uREF\/b0QvLo6EwOdHL49K6PNSrR8w9DQYM3REGY\/wMvM66\/b\nxySuj8okAw\/LpLh7XIZX3Y7Q982C\/s4GnqD+8UEyvAN62jkj+E0zh6cnOfzULudFl+EnIvT9OUFG\nGMkvGwTNY\/frbyym9cGCHbL36vYaiuB0fNPC4dNTMtwvEw\/0EYc\/nJE9GRLX67nigas5UjxQS\/FD\nG4e\/azmwFPOGGck7m6C\/tRz6a374ttUe35Jh5vzVRSJwaSz03fa0RiD6wzlhCjEhZnqnv+TEr+PX\nMzu6dXjVtxAvL03C9+dl6K+T4k6JGL3ZdgNtKda\/J9mVIu6\/mC7GjQIJvtDI8B2F\/SWFX9+tgP7y\nZDI+Q8CVqfji9Fh83SSQY6T0V6dTpOcI0aZ7GeGfiOR3rYLIf14rjDR9j7NwL7Nz1ReviNxAF11r\nleJ5A2WtVILuI3Y4m2Db\/wY5DYltW6Itzh8S43GlhOpBRnXE4UeK4ssOjo+KvlsAi9qXjZxQW+x7\nFmEWFZb6u1sG0++Gn7uEKLJ6fFHPizJ+bB+Mdjd7J9tdHL5vk4HV+9NaKe6Vi3ExwxZN8baojrD6\nVUvr9tv0N0YR8yQJVIHWWOv7HiKWmiJrhzkenhRTjXF82r47y0FXwPGN8NOQM5Y2lrInSbhauw67\nAsQ4GT\/YGG1vEvyiUVg30M7xNr8\/x+FOOflNtYYm0Qotafa4UT4ZDdE2OBFqLUSxeKdlULXSBo3R\ntihWjsXSKaPgIRmOydJ38L7sHUzh3sXWucbQkrbdzOfQX8PxDcCa4RWLIEuZbi2enFuPzbOtMMPp\nPR6ZNJ9\/+A1BdihgaX9QKUapcgwCfQx5+17kh\/lbMs0SH3esRaOKrodYIXujZZDBsW1W6nI6idRG\nS8CE0t\/TjL+ZLZoqfxfTFCPgbT8CPg4jETDJiHfGip85Z2nU97jy9XendjZ2+dthtrMhZhH2LDLj\nTytMatjcZScjNt6aDokw3+093h6zy+wzP16cQLKvbgmaU8ejcIcVMtaZqw3yto7pLwm2QiOlpT7d\nF4EfWGGPvyn9LUL2HkcsmGACXzLm5ziSjwwreFb4LBKPa8aRaMsRG2iB\/uYJSN7miLmuRpjrYkQp\nEyFy+WjsXmiGykhbQbRLOKhWj+btMHu+Y0di8zxbHFpvichlZpjnNgLtx+dCk+yOo5vHIGW1Rb9B\nzsYxOLZ9DBpjbdBRNAcNhyejL08CXZEU10o9ELHaHh84CmmbNc6QDrEcLx0sdXerPFBz2AdBtCnV\nGnPcrHBHAGUgLGA01a8l5hHZrQts0XpkEj4u5+hQykEZMIq3w+zNHW+MioQpuF4gRk+WHcrpwFF7\n2BtVKmdkbbBE4kpzGGSss0QusT21zxqdWe642bAUvUcVuE4kb1VMQfJON8wkYyx1sbTgGQnz85pB\nkiQdL5qc8aDBF0UxHriUJ0X6bhd054ixzm80joVKcLt4LEWPw+MyDg9KZDhBJOa4GPL2VnlboDza\nHZezxeg6bIfqmLEo2j8BJVRyaUEWiF0yGgbJqyyQud4CJ8KsUH9AhIt57nQsGofeLAnu189Aa+F8\nZCs9kRU2gf\/ukwoZFTxHqeaoHjlehL8mol83OeDTWnt8UuNIzzJUc9VyPtqfVnJ89Fh67xVyuF\/E\nIWOTNXbMF2H7PBFydjnQIZU6mWSuIIRDSagNCij6jNd+qmODQyvNdalrzVFEdXiSDpuNMTZ0sx0u\npFLYj0hwNVuK3gwpLqaQTpHxRzSfPz7B8ZFkBHT03Ys6gSzD53VChJ9Vc7hbxKLG4QZ1\/73jHG7n\ny3CLcDNXho7DUjQnSnE6ToJzRO40ldhJpQjFu6yQuckCqqXmCJtrojGIWmQakrjCHDmbLai1rUkg\nRTgdY4tzCXboTBGjO12CjkNkJE5KDsgpOXpITukohdZkOaJWiqnATVEfJ6OHHw7d2YRMKdqJwMKJ\nRuhKo\/sS5fzaPrp2LUuGy3T9Etml6cX7YeSq94l4acndStFbbc5Hb8cMY3+DfTNMjFiuD1MUC6hZ\nyveIcGqI5EExOki8z8WL0RQtRl8O7T5PhruFNNiLZcgOtoc3deIU+dsImGyG9R8Y86QCvY2pWUzg\nbvs2di60Rged\/67T2t50IpYmhTaVNp0kxtmDRI4yxvyVhVrx\/vnaWzoae+ea\/Dru9n1oqo5fNgpp\nG2yQvMkB+1dIsdvfFgfXiimittDQlGmItON3fTVLiutHBaKl+xyxbOpoXtg9pb+KO3tnYN8lbHCg\nEpGhh8hdoM22UzbaaOMtKjs2LVAWOwnHor2gyZnNPy8fDx+H\/R9S9PyMfx11u2cb+0cuMsXhDRKm\n3iQ7ViijdFdEcIhbp0BlmA1qiei5eDtcTBVqkhE9FeuErfNt+GnAxHY6ie4QmAAzDS2KcOWj1nlI\nymeilabEmWg71O+3QanKi8abB+8vi\/wmrTJHaZQbds82wZYJBm8++IfOMelPWidm4shrUME2K6h3\nWaNc5QnVMgtUK23ReIAOFIlidCaLeaKaBCfErnPgp4IfpXpIL9k7w4pp5qiMGY8OWtNMjwZnWCb2\n26KGNptJ+st0l\/nJ3CB0bcxHo5AVPBabfYzVvztubfcxDooKELrnYKAtokhs2eKyCEcc3uqAE1Sb\nlWEiNJGjsxTJtgRKU6ICh3e6YOY4QSeZvrEpwsA+r\/Ebg\/p4ZzTH2lIG7PgsVFE2mK3jYY6oTZhA\nEkdTZNFonIifDOV8M0QuEWH9NGPvPzy07pljpg1fYIZCpStStjvzi3O3UgHHTkRxsDWaUtxwMd8L\nDVEkC5Sm03FyZO115yfGAjdqEHdjfOhuwoN93h0gQV28C6rDbYiYCOVKBU0LB5ISEfLDXJG3Q8xH\nLj3YBSVRE1ndIWSWmeaf\/vLE8r7dz0THIpm32wFJK2kxdVVe+HgiKMK9Ejc8blmE9qP0aEgnoNoo\nKRK3jIM\/1driSab4yIPBjEcA\/b17ERFMnAj1bhHUdFKqTfGis6YCFaEiJK6XgzSYT2tUgCWCZ5ph\ni4+Jjj2T\/Muf4BjJkFmmurB5pjiyTYayA25I2SRFBkXzcgaHT6qdcKVqITXIONTEuSJxszOWEKFl\nk0dhxfujsNJLAPscSDXYmjsTRbspvalETuOIT2iypNDhIm6VLUXNHakbZXzkoj40\/7\/Jvf7a5mOs\nCpljgn3+ZvxMPETRZN3GfuR5WOGEtjxfnM70RQhFaQURWk1ys4YIrZ0ugH1ePYXm8X4P1KVOxcMT\njvyZkGkeq3MmxAlr7RDub4l1U41D\/l8\/aG6cPnL6rpnG6rB5VLyLGNFRqKRZyX6eu3HUHjUJHoin\nLg7yscA6GvwbfC2x0U8A+3xglRy1SV7oPeKE27kKtNNoi1o8im+G4Fmm2DjdUP1PG+JPvP5CeIdg\nvMrT2DdivtkLRpRF9OByc5TttEF9OIl1qBMqDk7BmZyZaMqZhaajAmrpGFZ30BMNexU4EWyHVEor\nI8Y0bscHJo\/8xxvOI9tWhFGE9wjD\/h1ybzNiBAsCe3i2J7jOdx0ZE+hl2Bc61+wfe8nZ3vkmiPzI\nnI73HJ3\/fkXmdjqxbOOQQM83EQtHIZTqeZOv8ctlHu\/ddxYNSyFbCwlehHEEjiAaJDqS8Nc\/Q5Dt\nxpBgTrAhyAnOhGmERYbv\/mWni83b+fZjhp2UWww74y4efm39NKN\/7JxlzAY8gqYZDzhYDbsjNX+r\nhzN\/6zytySbEsaFFCCTMIXgQHAkygjXBjDBiMHN\/+vXXwV2xxWMGoykfNOw6GIUZhAWEjwjLCSsJ\nKwhL2WYILJU+g4TYJh0GSYkGA2A0GJD\/+U\/+Q4AZe2vQ8PDBTRj9AQwHr40YrOe3\/t0I\/S8\/qjDF\nojdh5wAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/pumpkin_carved_4-1319852484.swf",
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

log.info("pumpkin_carved_4.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
