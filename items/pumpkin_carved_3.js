//#include include/takeable.js

var label = "Hello Pumpkin!";
var version = "1348102174";
var name_single = "Hello Pumpkin!";
var name_plural = "Hello Pumpkins";
var article = "a";
var description = "The only hollowed out vegetable so cute you'd happily put it in your pocket and carry it around all day. Or at least, you would if it didn't weigh 50lb and smell of decomposing food. Hello Pumpkin!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 41;
var input_for = [];
var parent_classes = ["pumpkin_carved_3", "carved_pumpkin_base", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAN5ElEQVR42uVYaVBU57b15cYpaqCZ\noen5nMYBHIIQE6OgUcQ44BBE4oCAI4PKPAoyCsgkoKIgjYiKIIqigiK24jwFJRqjRonJvZkTEsOv\n92e9\/X2nzb0mudG69V5Vql5X7WroPmfvtdfaw3e6T5\/\/D6+4MPNRGxPkxoIiZ+O2SvfDBSUjRv2l\nACZH2RrTkhQoKhmJnbXjUVw2ChnJytS\/DMDMjWpj3ForxETKUVjsjNwcPZKibRG71jLgLwEwJ1Mw\nrgi0RFqGHvEJGqSnC1iycAB8ffuY\/Z8FfXT8PcNj41I8OhvY+fh80J\/W1KYMnTFklQ02F7kgt9AF\n0dFyLFrQv\/Nl4jTmv606WjK180ylN27VTTQ8qte+OKnufYLHV0dF\/NA2FF+cmY3HZwN7ujsCff6t\nxKkq47owO5LXhdff6hUyLF4w4IU1WJ89waOp+N2eS9UT8W2LE3raRHzTLLy4dp80CKk\/0sW9N3zR\ne2UKvmodi0fEZve5oD+8eWO8Q2rUWjvkZIvIy3XCqmAzLPEd4PFnMfZljw9oKvJE1+6R+PY4xbr0\nDnpv+qOn\/SUBsmx6O5eh99osfN8i4lHDaDxsXYBPTi8xPmrzfU6GyjS7gNQ4B6QnKxC+2gLBSwbh\n8n5Xw8+nxXU\/tv1esr0ZbxuaNk\/AlVJnfFor4tsTIiei99Zy\/PwyAB\/uFQ1fN4t0sYie0yK+bBJx\nf7eIG6XD8GH9HNw+NBPfn3TCN8fEzk9rhZ57BhEp6y2RFGGNsBVmWOw3AA\/3iLhXLeKT3UJ3d52I\nfxwmo7I5VeqKxuzxaNs4FNeK9PikWvqOEfLzGRFfHxcNLwR4p1IwPt4v4u+HRHzRKOLTvSK6duhx\nabMeJ5P0aCucgOb8sTiW7oDPGgQGAhWp9kgIt0BI0BDewS05GtypkO590iCiJUuO\/SnD0JjujubY\noWhN1ONirh63y\/WcRRaHxXtcJxhfCPBasdj50U49GDMfV4ncydVCPYzpehyNFXBm00ic3zoctwxa\nfNcq4KtmAU8O63Bzj5rXE2P\/yyNSUNZsP54ScWe3CmeKdGjPdeE+jsU44cxGPa4UEMjteh6Hxeva\nIf45wM5KdcCFXBGXiS0mAbeS4bh\/YBq+vx6L3o838FrpveqN3vMueNIo4LN6Aaypekz2w0mprhg4\nxgorkV+MrBHepkbwQ+9HEeQrEXdqZ+JCnjNn8lmsS\/liz40dsj8eNRcK1QE3yzU4lUK1skGPzq2s\nPvTovewpOWbAbgVRd8\/nXfflEYHqUOC1+stZAtAxDL3nRDylWmKAv2MgicnPD9L4YJ16YYyU2IeL\n0Xt7JX\/\/5bI3nhxyxpV8Ee3EaBvF7ShWdbbl\/Abk8Ux71dnNGpzJUaMjl+qqRiD5dHjaLlDg4dIY\nYJ3GjJj4dL8eP7RKjcSY5ElcmyF9T0CeEmM\/EpPUSPg7NUH3AZFfz0Gya6968fenHW9QMqxMdOiq\n0uI0bSFjvgrN6Yrnm+VIqsLYkq5CR5EaD\/Zr8fkhHXWUjuQihk4LkkTnnDhDTw4KnBFWW5w5FpCx\n0hUiMcxYIjbZBGAsMomf1FMD7JPY5feQr6dGga7R0ZDW4YsmLR7UadC5S43TuSo0pSiwL8ZRmqW1\nUfaqQ4kKHE5W4maFGvf2aHClXMDhLDWqExxxPM8R7VsceX0xcB8bBN4MfFYyWRlzXWHofZCP3jsx\nUgkQUz8Ru9+1SA3DOpl19NfHJPl7Tgnc58lCJY4WDMPlqjG4Vz8aN3YSwDwlGgiPYb2DxKIh3MGw\nP5qAZChxsUyNknXO+MDTFsPtXv3V3DX9cKlcictFAp9bvwJkrDK5WH3eTZCAXvch2Ufhp98wyMbJ\nZweke5kvN\/L5rzFKE9\/Cxyf8qds12B\/riMpwB3CAO0Psu2vWO+JEJtGa5orSqDEYrXj+ZmbTRw\/E\npWIt70w2Sli3slrrvejGNw5vpOtzeb0yGRlTDAxLiAF7SAAfkcz392kx2+213\/l3VQ\/AwaKpuFo3\nA7VRcmxfTQDzg+1V7I\/qdXI054zAwXxPBHorfr1pnPAaRtC7i0NfjJT3xZY1trwrWXcydhiLvD6J\nMQ6UpGXgGHvft0qJsHnIBv+DGtos1QLKwmww2rEf98f8LpjkADftQB5v9ls2OFfjg8bMkSgJtkef\nvCVWHqUr7LErXI6W4jdxcsd0eI0ciOvb1bhdqcX5Uj2qU9+Ex7DBcFX2R9QcGWfjGYusxlizsHpj\nq4qvxzYJHOtgxh6Xd68E7l6VgOh5Fhir6o8pI81xumoWbtaMxdVtND2KlJjiPADHtnqhIWssCpbZ\noU+2v5VHUaAdykMc0FHlBUPGRGQHWOFisRrXt2lwu0KLk2Xj8cFke7ypGYBlk82oG2lz0HBm4+Pr\no5KM7EDBQDFjQ5qB\/0eTNAMZew9rJHB3dwkIJB\/jiLGlU+Vo2zEFV7dqcL5YhVM5SqT6WyIndCT2\nprkjZ7Et+myYa+WRs8QGpSvscK1uJnZleKCMZDy7WY2LWzQEUouOXZPgP8ke40nu4CkyOggIFFTa\nIEw+BuR8mRItmx0lo64\/t0XJO5dd97BWwH0DA0erbKfAfUzQD4KPuyWaC8cRODXa89Q4Rk1astoe\nEb5aVMSORqa\/DfrUr9SaZflbE522aC+fiMfnglAX74jWLBWMeRpiUoNrDXO5Q8+hgzCJpL5HwR4Q\nyEfEZPcBAZ8T0Owgu+cKfpqrBXWqkwSOpL1bKeD2DgE3twrwG2+NBe9ItjvFnfazik+QRjqu7Y5U\noDDMGYWrdNgw30rq4uT5VoezF9tg2xp7VEc44AABPJqqxEkCeSZXjU9OLcWdE4tw6+hC3Gj0RVeF\nDncNOjrF6PBwLwElay8QEbdQh8yVzqjJorPe\/pm4X+tERy4dl\/UZuKtbdMgOdkLe6uEExAWlEaNw\nIkOFQxtogsTK+WjZstwOmQutET\/bUgIYPcvcZ6OvFQoCbbEz1AE19HRWn6DAkRQlWjNVOFs4FJcq\nKajBE7f3eeLmNh1uk1R3dunoFEK1RUDv05Hr2nYRhlgNLpQNpwT0\/PuuCgG3aOjfKNPhSrEO5\/O1\nqE\/WoYZONHtidUSEihaEgs+9KpokW1fZIW+pLZLmWmG9t8U\/113CHItupnn2UkdkLbbGHgYyXoEm\n2i4n0lRoTFDhSLIKFwq1uLxFi+tlWnxIQG+VSyC6SMKPKnVc3rpEOU+AfXdjqw7XS3Q04HU4l6dF\n+yYN2jLVaE1XozmF\/CYp2UpjWwPbqP7i51lig78CMTMssWaS+T8fGyKnWxQlzbOiWhKp\/c1orLwG\nv7eGII2oPpSoRH2sikyJdjqInqNDxbEMHTYGCChcbsvBMiDMJjr1x54YOX2mw1UC1k6HD28aWxd3\nexEwDVrSqBlS1MSaCg3xSuyNckTy+9aY7z6YZu5AeL8hQ1aQgNCpsuefCkMnm6uiZ1qCS71ciYqo\n4ahIeAN54aNRGO5MjkiGaAXPuo129OEULWL9tHBV9cWpbOp42jBsy0wggGUhdrhQoOVyxs23xBja\nSh273uUKNCWqcZCAHYhRYE+EI0ojR2NbwjjsSR+HylgXbFqmZtIieOKQ3z\/0h061MMTOtkCKnwMi\nZ1kgfi7RTdmxMVS9zpFkZyCpgQhkc6oa+WuGYTKxzWT1GTuIg+Uri97nug3GPHdpuK\/31dH4eQMN\ncUquwr4oJfdXGSbHtlUOfCBv+sAW4dNkSPRTYIWnec9K1z84tK507WMWMd2iJz1Ah2Vecqz2USNi\noR7pq1yogFWoWivnVk+BmOy1cQKWz1RJK8pNhiBvSmKjG7JCRiFkng5utFsj39egPnscV2AfWW2E\nAlW0tXaGyFFIC6Is3h1Jwc48zvoFVDKhIxA303rdvz3yB70zaFTYVPOeOB8LktsamxbZ8BlZstye\nL29mFdTptSRPHckU\/YGe5uNA7I1R40CCDoeo6JvoZHwsawSi59qiINSZulXAbmKseq3E2nZije3Z\nzQG2fBizjo16zwKrJ5tjvZfli5\/qGMiI6bKeGJI5eb41svxtkUfOimgYlyyXbMcaB87EgQxX7Iwe\nhtpIiSHOUqSCJ1C+RoHiUCfOFp2YeHJs7zNJ2RrL8LNGIoGLIHBhU2VIn2dneOnfZpjca941P8wy\nS6RaTFtgjWyqk9ylNsgPsOEzs4yCbSU2ymnA76BdLgGRjP3PAJWttOegSkkBtvPZjGOspbwvDWLW\nEKzmAieYe\/xHPyKtmvj60nXTzI2MzcR5UpdnLLRBBq1HBraAgjJmi4N\/Y0HS50zGPLouZ5EELNXX\nhrPGEg99V9YTPOH1wuC3zVX\/6Y9cfyN7jUwWPtVybdQMi58Y0IQ5ljzIhvmMWSsqARrwi5439lkm\nJZJOMjL22V6Np\/sYsDAvbqd0sn7O5NuO+TfF+dvLAnvFdIMFmT2ZlmwYmev7Y4dsD5zw+t1YmvSR\n78kQNVOGZ+wmzbPmxv5OmGuBOB9LLiPbCqzOlk00+2qO65ArjuZ915Kvacyfya\/WFMfCFPeVFwH8\nL7KBpszYjRqyoWRjyKaQ+cnNX012duxfKdr1qxds+rV4DB14b+Vks\/8O9TLHOm8ZZo0Z\/I3Wuu8N\nrU3f83LZq0fonkJ2LiELYfeb\/Iwx+dWY4shMcV\/6xYD2J2ND05rM0ZStE5kLmRuZJ9kMsvlkC8kW\nky0xvS80fT7DdJ2b6T4nkx9Hk98hZH3\/N3+AZRL0M2U72BSAJWFuYuGZsf8Hma4bYKqxV0yJv9Tr\nfwBSbKlwzxMfdQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/pumpkin_carved_3-1319852478.swf",
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

log.info("pumpkin_carved_3.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
