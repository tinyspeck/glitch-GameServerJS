var artifact_map = {
	'butterfly_hair_clip':{
		'artifact': 'artifact_butterfly_hair_clip',
		'pieces': [
			'artifact_butterfly_hair_clip_piece1',
			'artifact_butterfly_hair_clip_piece2',
			'artifact_butterfly_hair_clip_piece3',
			'artifact_butterfly_hair_clip_piece4'
		]
	},
	'chicken_brick':{
		'artifact': 'artifact_chicken_brick',
		'pieces': [
			'artifact_chicken_brick_piece1',
			'artifact_chicken_brick_piece2',
			'artifact_chicken_brick_piece3',
			'artifact_chicken_brick_piece4',
			'artifact_chicken_brick_piece5'
		]
	},
	'glove_metal_finger':{
		'artifact': 'artifact_glove_metal_finger',
		'pieces': [
			'artifact_glove_metal_finger_piece1',
			'artifact_glove_metal_finger_piece2',
			'artifact_glove_metal_finger_piece3'
		]
	},
	'magical_pendant':{
		'artifact': 'artifact_magical_pendant',
		'pieces': [
			'artifact_magical_pendant_piece1',
			'artifact_magical_pendant_piece2',
			'artifact_magical_pendant_piece3'
		]
	},
	'mirror_with_scribbles':{
		'artifact': 'artifact_mirror_with_scribbles',
		'pieces': [
			'artifact_mirror_with_scribbles_piece1',
			'artifact_mirror_with_scribbles_piece2',
			'artifact_mirror_with_scribbles_piece3',
			'artifact_mirror_with_scribbles_piece4',
			'artifact_mirror_with_scribbles_piece5'
		]
	},
	'mysterious_cube':{
		'artifact': 'artifact_mysterious_cube',
		'pieces': [
			'artifact_mysterious_cube_piece1',
			'artifact_mysterious_cube_piece2',
			'artifact_mysterious_cube_piece3',
			'artifact_mysterious_cube_piece4',
			'artifact_mysterious_cube_piece5'
		]
	},
	'nose_of_china':{
		'artifact': 'artifact_nose_of_china',
		'pieces': [
			'artifact_nose_of_china_piece1',
			'artifact_nose_of_china_piece2'
		]
	},
	'platinumium_spork':{
		'artifact': 'artifact_platinumium_spork',
		'pieces': [
			'artifact_platinumium_spork_piece1',
			'artifact_platinumium_spork_piece2'
		]
	},
	'torn_manuscript':{
		'artifact': 'artifact_torn_manuscript',
		'pieces': [
			'artifact_torn_manuscript_piece1',
			'artifact_torn_manuscript_piece2',
			'artifact_torn_manuscript_piece3',
			'artifact_torn_manuscript_piece4'
		]
	},
	'wooden_apple':{
		'artifact': 'artifact_wooden_apple',
		'pieces': [
			'artifact_wooden_apple_piece1',
			'artifact_wooden_apple_piece2',
			'artifact_wooden_apple_piece3',
			'artifact_wooden_apple_piece4'
		]
	}
};

var artifact_necklaces = {
	'artifact_necklace_amazonite_piece': {
		required: 17,
		produces: 'artifact_necklace_amazonite'
	},
	'artifact_necklace_rhyolite_piece': {
		required: 17,
		produces: 'artifact_necklace_rhyolite'
	},
	'artifact_necklace_onyx_piece': {
		required: 19,
		produces: 'artifact_necklace_onyx'
	},
	'artifact_necklace_redtigereye_piece': {
		required: 19,
		produces: 'artifact_necklace_redtigereye'
	},
	'artifact_necklace_imperial_piece': {
		required: 23,
		produces: 'artifact_necklace_imperial'
	}
};

function artifactPieceAdded(stack){
	if (artifact_necklaces[stack.class_tsid]){
		if (this.items_has(stack.class_tsid, artifact_necklaces[stack.class_tsid].required)){
			this.apiSetTimerX('createArtifactNecklace', 1*1000, stack.class_tsid);
		}
	}
	else{
		var artifact_type = this.findArtifactForPiece(stack.class_tsid);
		if (artifact_map[artifact_type] && artifact_map[artifact_type].pieces){
			var has_all_pieces = true;
			for (var i in artifact_map[artifact_type].pieces){
				if (!this.items_has(artifact_map[artifact_type].pieces[i], 1)){
					has_all_pieces = false;
					break;
				}
			}
			
			if (has_all_pieces){
				this.apiSetTimerX('createArtifact', 1*1000, artifact_type);
			}
		}
	}
}

function findArtifactForPiece(class_tsid){
	var artifact;
	
	for (var i in artifact_map){
		for (var j in artifact_map[i].pieces){
			if (artifact_map[i].pieces[j] == class_tsid){
				artifact = i;
				break;
			}
		}
	}
	
	return artifact;
}


function createArtifact(artifact_type){
	var prot = apiFindItemPrototype(artifact_map[artifact_type].artifact);
	this.announce_vp_overlay({
			duration: 5000,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog">You\'ve combined all the artifact pieces to make a '+prot.label+'!</span></p>'
			],
		});
	
	var stack = null;
	for (var i in artifact_map[artifact_type].pieces){
		stack = this.removeItemStackClass(this.artifact_map[artifact_type].pieces[i], 1);
		if (!stack)	break;
		stack.apiDelete();
	}
		
	this.apiSetTimerX('createItemFromGround', 5000, artifact_map[artifact_type].artifact, 1);
	this.achievements_increment('artifacts_made', artifact_map[artifact_type].artifact, 1);
}


function createArtifactNecklace(piece_type){
	var prot = apiFindItemPrototype(artifact_necklaces[piece_type].produces);
	this.announce_vp_overlay({
			duration: 5000,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog">You\'ve combined '+artifact_necklaces[piece_type].required+' beads to make a '+prot.label+'!</span></p>'
			],
		});
	
	this.items_destroy(piece_type, artifact_necklaces[piece_type].required);
		
	this.apiSetTimerX('createItemFromGround', 5000, artifact_necklaces[piece_type].produces, 1);
	this.achievements_increment('necklaces_made', artifact_necklaces[piece_type].produces, 1);
}
