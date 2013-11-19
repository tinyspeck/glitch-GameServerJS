var data_skills = {};

function skills_get_alchemy_1(){
	return {
		id: 51,
		name: "Alchemy",
		level: 1,
		description: "Ah, the transformational power of transformation. Alchemy puts that Element Handling to good use and teaches you how to use a Test Tube to craft loose elements into marginally more valuable compounds. Further down this path, compounds can become powders and soon enough you are making potions and recycling even the most complex items down to their components.",
		learned: "Well, you done learned that Alchemy good, but the question is: what kind of alchemical shenanigans can you get up to now? For starters, get yourself a Test Tube from the Tool Vendor. With it, you can experiment with combining various elements and seeing what kinds of compounds you can come up with. Eventually you'll be able to compound the compounds, but let's not get ahead of ourselves.",
		point_cost: 5400,
		category_id: 6,
		requires_level: 0,
		quest_id: "alchemy_make_compounds",
		req_skills: ["elementhandling_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["intermediateadmixing_1","alchemy_2","crystalography_1","fuelmaking_1"],
		giants: {
			"alph": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/alchemy_1_29740.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/alchemy_1_29740.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/alchemy_1_29740.png"
		},
	};
};
data_skills.alchemy_1 = this.skills_get_alchemy_1();


function skills_get_alchemy_2(){
	return {
		id: 81,
		name: "Alchemy",
		level: 2,
		description: "With Alchemy II, you can harness your love of shiny things and use Alchemical Tongs to transform everyday Plain Metal into fancy metals such as Copper, Tin, and Molybdenum. ",
		learned: "Now that you've learned Alchemy II, it's time to get serious. And there's nothing more serious than a pair of Alchemical Tongs. Not only do they look super hardcore, they also let you use elements to convert Plain Metal to fancy metals such as Copper, Tin and Molybdenum. So... Alchemical Tongs. Get some!",
		point_cost: 36000,
		category_id: 6,
		requires_level: 0,
		quest_id: "alchemy_make_metal_ingots",
		req_skills: ["alchemy_1","smelting_1"],
		req_achievements: [],
		req_quests: ["smelting_smelt_metal_rock_to_plain_metal"],
		req_upgrades: [],
		post_skills: ["metalwork_1"],
		giants: {
			"alph": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/alchemy_2_29740.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/alchemy_2_29740.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/alchemy_2_29740.png"
		},
	};
};
data_skills.alchemy_2 = this.skills_get_alchemy_2();


function skills_get_animalhusbandry_1(){
	return {
		id: 30,
		name: "Animal Husbandry",
		level: 0,
		description: "Only the imagination of a Giant can create a new life. But, also, you can too: Animal Husbandry allows the use of an Egg Seasoner to create seasoned eggs and unlocks the Incubate command on chickens which will get those eggs hatched. Voila: you have a brand new baby animal.",
		learned: "You have embarked on the noble and exciting field of Animal Husbandering. But everyone knows you can't husband an animal without some Eggs and an Egg Seasoner. Those, plus your newly discovered ability to use the Incubate command on Chickens, are all you need to create fubsy new life. ",
		point_cost: 14400,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalhusbandry_make_three_eggs",
		req_skills: ["animalkinship_4"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"pot": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalhusbandry_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalhusbandry_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalhusbandry_1_28144.png"
		},
	};
};
data_skills.animalhusbandry_1 = this.skills_get_animalhusbandry_1();


function skills_get_animalkinship_1(){
	return {
		id: 23,
		name: "Animal Kinship",
		level: 1,
		description: "Animals can seem skittish until you learn the basics of Animal Kinship.With it, you'll no longer fail at basic animal interactions; petting, nibbling, massaging will happen faster; chickens will consent to be squeezed more than once a day, and you'll lose much less energy to boot. ",
		learned: "Now that you've taken your first steps down the rewarding road of Animal Kinship, get out there and apply squeezes, massages, pettings and nibbles to the appropriate critters of Ur. They'll thank you (in their own special way).",
		point_cost: 600,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalkinship_pet_piggies",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["animalkinship_2"],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalkinship_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalkinship_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalkinship_1_28144.png"
		},
	};
};
data_skills.animalkinship_1 = this.skills_get_animalkinship_1();


function skills_get_animalkinship_2(){
	return {
		id: 24,
		name: "Animal Kinship",
		level: 2,
		description: "Advancing on the path of Animal Kinship introduces some additional rewards for the basic animal interactions, such as increasing the amount of meat piggies give when nibbled and the amount of milk butterflies give when milked.",
		learned: "Well done. Your decision to continue to develop your Animal Kinship abilities will reward you even more richly in meat, milk and grain. Let the nibbling and massaging re-commence!",
		point_cost: 1200,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalkinship_massage_butterflies",
		req_skills: ["animalkinship_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["herdkeeping_1","animalkinship_3","foxbrushing_1"],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalkinship_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalkinship_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalkinship_2_28144.png"
		},
	};
};
data_skills.animalkinship_2 = this.skills_get_animalkinship_2();


function skills_get_animalkinship_3(){
	return {
		id: 25,
		name: "Animal Kinship",
		level: 3,
		description: "The third level of animal kinship grants a further increase in imagination rewards for animal interactions and gives a chance for large meat, milk and grain bonuses.",
		learned: "Way-ta-go. Continued development of your Animal Kinship abilities bodes well for your interactions of the fuzzy\/feathery kind. You will literally be swimming in milk, meat and grain, in a way that is not at all disgusting. ",
		point_cost: 4800,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalkinship_nibble_meat",
		req_skills: ["animalkinship_2"],
		req_achievements: [],
		req_quests: ["animalkinship_pet_piggies"],
		req_upgrades: [],
		post_skills: ["animalkinship_4"],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalkinship_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalkinship_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalkinship_3_28144.png"
		},
	};
};
data_skills.animalkinship_3 = this.skills_get_animalkinship_3();


function skills_get_animalkinship_4(){
	return {
		id: 26,
		name: "Animal Kinship",
		level: 4,
		description: "The fourth level of Animal Kinship increases the basic milk and meat rewards, gives a chance of a serious mood bonus when massaging butterflies and is necessary to learn Animal Husbandry.",
		learned: "Now it's for serious. Your bond with the critters of Ur becomes tighter by the day. With Animal Kinship IV, your milking and meat-nibbling skills continue to improve. It is no wonder that the animals call you Dr Dooloads. Oh they don't? Well, not to your face, I guess.",
		point_cost: 18000,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalkinship_milk_butterflies",
		req_skills: ["animalkinship_3"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["animalkinship_5","animalhusbandry_1"],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalkinship_4_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalkinship_4_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalkinship_4_28144.png"
		},
	};
};
data_skills.animalkinship_4 = this.skills_get_animalkinship_4();


function skills_get_animalkinship_5(){
	return {
		id: 27,
		name: "Animal Kinship",
		level: 5,
		description: "At the fifth level of Animal Kinship, practitioners experience substantial lifts in the imagination rewards, more mood bonus in some interactions and an increase in the chance for bonus meat and milk. Massaging a Butterfly no longer requires a lotion. Tantalizingly, it also confers the power to name your animal friends.",
		learned: "A Piggy is just a Piggy is just a Piggy. That is, until you call it Ralph or Sally, or maybe even Gus. That's right. With Animal Kinship V, you now have the ability to name your little meat- and milk-giving friends. Once you give them names, the giving only gets givinger.",
		point_cost: 36000,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalkinship_name_animals",
		req_skills: ["animalkinship_4"],
		req_achievements: [],
		req_quests: ["animalkinship_massage_butterflies"],
		req_upgrades: [],
		post_skills: ["animalkinship_6"],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalkinship_5_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalkinship_5_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalkinship_5_28144.png"
		},
	};
};
data_skills.animalkinship_5 = this.skills_get_animalkinship_5();


function skills_get_animalkinship_6(){
	return {
		id: 28,
		name: "Animal Kinship",
		level: 6,
		description: "A rarefied skill offering kinship so close that pigs no longer require petting before a nibble, nor butterflies expect a massage before they'll consent to a milking - and not once, but twice a day. Same number of critters - TWICE the meat and milk action! Rewards and bonuses are all notched up as well.",
		learned: "You've reached the penultimate level of Animal Kinship. Remember all that hand-fatiguing petting and massaging you used to do? No more! Not only that, now you can nibble and milk the same animal not once, but twice, every game day. Go ahead and try.",
		point_cost: 72000,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalkinship_squeeze_chicken_for_drop",
		req_skills: ["animalkinship_5"],
		req_achievements: ["emblem_skill_unlock_humbaba_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["remoteherdkeeping_1","animalkinship_7"],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalkinship_6_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalkinship_6_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalkinship_6_28144.png"
		},
	};
};
data_skills.animalkinship_6 = this.skills_get_animalkinship_6();


function skills_get_animalkinship_7(){
	return {
		id: 29,
		name: "Animal Kinship",
		level: 7,
		description: "The ultimate in Animal Kinship. Almost every interaction now grants significant imagination, rewards and bonus chances are gigantic and the animals themselves ... well, they love you best.",
		learned: "You did it! The highest level of Animal Kinship! If you were any closer to the animals, it would be illegal. Or, at the very least, weird. Now, almost every time you milk, nibble or squeeze, you'll get mondo imagination, rewards and bonus thingummies.",
		point_cost: 144000,
		category_id: 14,
		requires_level: 0,
		quest_id: "animalkinship_max_nibble_milk_squeeze",
		req_skills: ["remoteherdkeeping_1","animalkinship_6"],
		req_achievements: [],
		req_quests: ["animalkinship_squeeze_chicken_for_drop"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/animalkinship_7_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/animalkinship_7_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/animalkinship_7_28144.png"
		},
	};
};
data_skills.animalkinship_7 = this.skills_get_animalkinship_7();


function skills_get_blending_1(){
	return {
		id: 43,
		name: "Blending",
		level: 1,
		description: "The first step on a successful career in drink making is understanding the basic operation of a Blender. The first level of Blending allows some basic recipes and the possibility of learning more through use.",
		learned: "Rejoice, for the tantalizing craft of Blendering is now yours. A Blender is your key to a new dimension of flavor. Get one, practice your beginner recipes, and lo! Your mixological odyssey begins.",
		point_cost: 1800,
		category_id: 8,
		requires_level: 0,
		quest_id: "blending_make_level1_recipes",
		req_skills: ["ezcooking_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["cocktailcrafting_1","masterchef_1","blending_2"],
		giants: {
			"friendly": {
				primary: 1
			},
			"grendaline": {
				primary: 0
			},
			"pot": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/blending_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/blending_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/blending_1_28144.png"
		},
	};
};
data_skills.blending_1 = this.skills_get_blending_1();


function skills_get_blending_2(){
	return {
		id: 67,
		name: "Blending",
		level: 2,
		description: "Taking Blending to the next level not only teaches you a handy parcel of otherwise unlearnable recipes, it makes operating a Blender much less taxing.",
		learned: "Now that you've taken Blending to the next level, you could almost refer to yourself as a trans-blendologist with a straight face. Almost. Or you could simply explore strange new recipes with an ease you once could only dream of. ",
		point_cost: 7200,
		category_id: 8,
		requires_level: 0,
		quest_id: "blending_make_level2_recipes",
		req_skills: ["blending_1"],
		req_achievements: ["pulse_frappe_mix_blend"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"friendly": {
				primary: 1
			},
			"grendaline": {
				primary: 0
			},
			"pot": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/blending_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/blending_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/blending_2_28144.png"
		},
	};
};
data_skills.blending_2 = this.skills_get_blending_2();


function skills_get_blockmaking_1(){
	return {
		id: 93,
		name: "Blockmaking",
		level: 0,
		description: "Sometimes having the right machine for a job just isn't enough. Learn Blockmaking and you'll be able to actually use the machine too, and make Urth Blocks.",
		learned: "Anyone can simply stack blocks, but you ... you have successfully learned the delicate art of Blockmaking.  Build those blocks young blockmaker, and leave the stacking for the rest.",
		point_cost: 86400,
		category_id: 11,
		requires_level: 0,
		quest_id: "block_party",
		req_skills: ["engineering_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/blockmaking_1_37979.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/blockmaking_1_37979.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/blockmaking_1_37979.png"
		},
	};
};
data_skills.blockmaking_1 = this.skills_get_blockmaking_1();


function skills_get_bogspecialization_1(){
	return {
		id: 85,
		name: "Bog Specialization",
		level: 0,
		description: "Peat is sweet, and the deeper you dive, the more you get. You can certainly dig for peat with a shovel alone, but become a bog specialist, and your peat excavation is much more efficient and rewarding.",
		learned: "You leapt wholeheartedly into the world of bog specialization, and now each dig will be a little deeper. To the tune of one or two extra blocks of peat. SWEET!",
		point_cost: 7200,
		category_id: 16,
		requires_level: 2,
		quest_id: "bogspecialization_harvest_full_peat_bog_in_time_period",
		req_skills: ["soil_appreciation_3"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["fuelmaking_1"],
		giants: {
			"grendaline": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/bogspecialization_1_30557.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/bogspecialization_1_30557.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/bogspecialization_1_30557.png"
		},
	};
};
data_skills.bogspecialization_1 = this.skills_get_bogspecialization_1();


function skills_get_botany_1(){
	return {
		id: 15,
		name: "Botany",
		level: 0,
		description: "The Botanist has certain knowledge of the mystical life-giving and life-granting interactions between a bean and its seasoning. Botany confers the ability to operate a Bean Seasoner, and do it \"just so\", allowing the production of all manner of plantable beans.",
		learned: "Your mad Botany skills confer upon you the ability to use a Bean Seasoner and Spices to season up all manner of plantable Beans. Go plant a patch or three.",
		point_cost: 7200,
		category_id: 17,
		requires_level: 0,
		quest_id: "botany_make_tree_beans",
		req_skills: ["gardening_2","intermediateadmixing_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"humbaba": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/botany_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/botany_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/botany_1_28144.png"
		},
	};
};
data_skills.botany_1 = this.skills_get_botany_1();


function skills_get_bubbletuning_1(){
	return {
		id: 18,
		name: "Bubble Tuning",
		level: 0,
		description: "Though one may use a Bubble Tuner without the Bubble Tuning skill, it is slow, taxing to one's energy and STILL has the possibility of failing. Well, learn Bubble Tuning and your bubble transmogrifications will come sweet 'n' easy.",
		learned: "Hubba hubba, toil and bubbles! If there were such a thing as a Bubble Whisperer, then you would now be able to whisper with the best of them. With a Bubble Tuner in hand, you are now an expert extraordinaire in the art of bubble transmogrification. ",
		point_cost: 1800,
		category_id: 16,
		requires_level: 3,
		quest_id: "bubbletuning_transform_bubbles",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/bubbletuning_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/bubbletuning_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/bubbletuning_1_28144.png"
		},
	};
};
data_skills.bubbletuning_1 = this.skills_get_bubbletuning_1();


function skills_get_bureaucraticarts_1(){
	return {
		id: 83,
		name: "Bureaucratic Arts",
		level: 1,
		description: "The first step in Bureaucratic Arts earns one enough respect with bureaucrats that one might obtain Papers, whether for oneself or for others. It is, of course, also a prerequisite for advancing to the more advanced Bureaucratic Arts.",
		learned: "Well done: you'll be obtaining papers with only the requisite amount of hassle and annoyance.",
		point_cost: 600,
		category_id: 19,
		requires_level: 0,
		quest_id: "",
		req_skills: [],
		req_achievements: ["card_carrying_qualification"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["bureaucraticarts_2"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/bureaucraticarts_1_29741.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/bureaucraticarts_1_29741.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/bureaucraticarts_1_29741.png"
		},
	};
};
data_skills.bureaucraticarts_1 = this.skills_get_bureaucraticarts_1();


function skills_get_bureaucraticarts_2(){
	return {
		id: 84,
		name: "Bureaucratic Arts",
		level: 2,
		description: "With the second level of Bureaucratic Arts, the ability to wrangle permits from the Bureaucrats becomes yours.",
		learned: "This may be a good time to visit a Bureaucratic Hall and see what the little lizards have on offer.",
		point_cost: 14400,
		category_id: 19,
		requires_level: 0,
		quest_id: "",
		req_skills: ["bureaucraticarts_1"],
		req_achievements: ["you_have_papers"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["bureaucraticarts_3"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/bureaucraticarts_2_29741.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/bureaucraticarts_2_29741.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/bureaucraticarts_2_29741.png"
		},
	};
};
data_skills.bureaucraticarts_2 = this.skills_get_bureaucraticarts_2();


function skills_get_bureaucraticarts_3(){
	return {
		id: 87,
		name: "Bureaucratic Arts",
		level: 3,
		description: "The third stage of the ancient and arcane Bureaucratic Arts is where the serious fun begins: you get access to an oxymoronic tiny cornucopia of special licenses, permits and certificates.",
		learned: "Congrats!",
		point_cost: 518400,
		category_id: 19,
		requires_level: 0,
		quest_id: "",
		req_skills: ["bureaucraticarts_2"],
		req_achievements: ["impossible_achievement"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/bureaucraticarts_3_34604.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/bureaucraticarts_3_34604.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/bureaucraticarts_3_34604.png"
		},
	};
};
data_skills.bureaucraticarts_3 = this.skills_get_bureaucraticarts_3();


function skills_get_cheffery_1(){
	return {
		id: 36,
		name: "Cheffery",
		level: 1,
		description: "Any proper chef is close friends with a frying pan. Cheffery befriends you to frying pans too, giving you some basic recipes and the opportunity to learn more through use of your new friend.",
		learned: "Now that you have learned basic Cheffery, get yourself a Frying Pan from the Tool Vendor and try out some basic recipes. They say a Frying Pan is a chef's best friend, but really, it's more like a rivalry that produces delicious results. ",
		point_cost: 1800,
		category_id: 8,
		requires_level: 0,
		quest_id: "cheffery_make_level1_recipes",
		req_skills: ["ezcooking_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["cheffery_2","saucery_1","grilling_1"],
		giants: {
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/cheffery_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/cheffery_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/cheffery_1_28144.png"
		},
	};
};
data_skills.cheffery_1 = this.skills_get_cheffery_1();


function skills_get_cheffery_2(){
	return {
		id: 37,
		name: "Cheffery",
		level: 2,
		description: "Cheffery II takes that friendship with the Frying Pan to a new level, allowing several new recipes and just plain making you more efficient with your tool.",
		learned: "Cheffery II! Twice as exciting as Cheffery I? You bet your last Gameshow Ticket. Now you'll be learning more recipes and becoming more efficient with your Frying Pan as you continue to stroll down a path of yumminary delights.",
		point_cost: 7200,
		category_id: 8,
		requires_level: 0,
		quest_id: "cheffery_make_level2_recipes",
		req_skills: ["cheffery_1"],
		req_achievements: ["decent_hash_slinger"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["cheffery_3"],
		giants: {
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/cheffery_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/cheffery_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/cheffery_2_28144.png"
		},
	};
};
data_skills.cheffery_2 = this.skills_get_cheffery_2();


function skills_get_cheffery_3(){
	return {
		id: 69,
		name: "Cheffery",
		level: 3,
		description: "The ultimate in Frying Pan friendship - BFFs, if you will - the third level of Cheffery bestows some very advanced recipes indeed.",
		learned: "With Cheffery III, you are now officially cooking with gas. Grease up your Frying Pan and try your hand at recipes that would make a brain surgeon rocket scientist throw in the towel. (What do those guys know about cooking, anyway?)",
		point_cost: 3600,
		category_id: 8,
		requires_level: 0,
		quest_id: "cheffery_make_level3_recipes",
		req_skills: ["cheffery_2"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["masterchef_1"],
		giants: {
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/cheffery_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/cheffery_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/cheffery_3_28144.png"
		},
	};
};
data_skills.cheffery_3 = this.skills_get_cheffery_3();


function skills_get_cocktailcrafting_1(){
	return {
		id: 44,
		name: "Cocktail Crafting",
		level: 1,
		description: "The operators of the Cocktail Shaker often look down upon their Blender-wielding brethren, but the wise drink maker knows that both tools have their uses. Cocktail Crafting lets you use that Shaker to start making drinks impossible with a Blender alone.",
		learned: "Well done, fledgling Cocktail Crafter. Now that you know a think or two about drinkery, time to put it into practice. Get a Cocktail Shaker, natch, and be sure to follow any cocktail quests that come your way. That's how you'll learn new recipes, and everyone knows a good mixologizer is only as good as his repertoire.",
		point_cost: 5400,
		category_id: 8,
		requires_level: 0,
		quest_id: "cocktailcrafting_make_level1_recipes",
		req_skills: ["blending_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["cocktailcrafting_2"],
		giants: {
			"friendly": {
				primary: 1
			},
			"grendaline": {
				primary: 0
			},
			"pot": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/cocktailcrafting_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/cocktailcrafting_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/cocktailcrafting_1_28144.png"
		},
	};
};
data_skills.cocktailcrafting_1 = this.skills_get_cocktailcrafting_1();


function skills_get_cocktailcrafting_2(){
	return {
		id: 45,
		name: "Cocktail Crafting",
		level: 2,
		description: "Advanced drinks have some very special qualities, imbuing the imbiber with highly desirable magic. Advancing to the second level of Cocktail Crafting grants you some new recipes which will make you pretty desirable yourself.",
		learned: "Welcome to a brand-new level of Cocktail Crafting. What's new at this level, you wisely ask yourself? How about the ability to make special drinks with special qualities? Yes, we thought you'd like that.",
		point_cost: 18000,
		category_id: 8,
		requires_level: 0,
		quest_id: "cocktailcrafting_make_level2_recipes",
		req_skills: ["cocktailcrafting_1"],
		req_achievements: ["mediocre_mixologist","emblem_skill_unlock_friendly_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"friendly": {
				primary: 1
			},
			"grendaline": {
				primary: 0
			},
			"pot": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/cocktailcrafting_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/cocktailcrafting_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/cocktailcrafting_2_28144.png"
		},
	};
};
data_skills.cocktailcrafting_2 = this.skills_get_cocktailcrafting_2();


function skills_get_croppery_1(){
	return {
		id: 14,
		name: "Croppery",
		level: 1,
		description: "Anyone who possesses a Crop Garden in their back yard would be wise to learn Croppery because anyone who knows Croppery will yield twice as much crop product from a plot (along with benefits to mood and imagination).",
		learned: "Welcome to the stimulating world of Croppery, a must-have for any gardener who wants to maximize their reapage. Not only will you increase your harvests, you'll find that gardening now has a better effect on your mood and imagination. Sweet, huh?",
		point_cost: 3600,
		category_id: 17,
		requires_level: 0,
		quest_id: "croppery_plant_and_harvest",
		req_skills: ["soil_appreciation_2","light_green_thumb_1"],
		req_achievements: [],
		req_quests: ["lightgreenthumb_water_trees"],
		req_upgrades: [],
		post_skills: ["croppery_2"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/croppery_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/croppery_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/croppery_1_28144.png"
		},
	};
};
data_skills.croppery_1 = this.skills_get_croppery_1();


function skills_get_croppery_2(){
	return {
		id: 33,
		name: "Croppery",
		level: 2,
		description: "Advancing your Croppery skill to the second level means you'll use less energy planting, watering and harvesting your crops. And every so often, the land will give you a little super fun happy bonus present.",
		learned: "Bum-da-da-DA! You've taken Croppery to the next level, which means that planting, watering and harvesting your crops won't leave you so goldarned tired at the end of the day. And every so often you'll come across a surprise bonus item, hidden in the dirt.",
		point_cost: 10800,
		category_id: 17,
		requires_level: 0,
		quest_id: "croppery_harvest_and_sell_at_auction",
		req_skills: ["croppery_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["croppery_3"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/croppery_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/croppery_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/croppery_2_28144.png"
		},
	};
};
data_skills.croppery_2 = this.skills_get_croppery_2();


function skills_get_croppery_3(){
	return {
		id: 34,
		name: "Croppery",
		level: 3,
		description: "Croppery III makes you a veritable master of the garden, giving you more mood and imagination for tending your crops through their lifecycle, and yielding a higher chance of surprise bonuses (or bonus surprises). Above all of that, every so often you will have a 'super harvest', which yields double the amount of crops from a plot.",
		learned: "Croppery III bestows upon you thrice the awesomeness of basic Croppery. Watch your toes while harvesting. Those are the most likely times you'll find a super fun happy bonus gift, or a 'super harvest', which yields twice the amount of crops from a plot. Just the land giving a little something back.",
		point_cost: 43200,
		category_id: 17,
		requires_level: 0,
		quest_id: "croppery_harvest_all_crops",
		req_skills: ["croppery_2"],
		req_achievements: [],
		req_quests: ["croppery_plant_and_harvest"],
		req_upgrades: [],
		post_skills: ["mastergardener_1"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/croppery_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/croppery_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/croppery_3_28144.png"
		},
	};
};
data_skills.croppery_3 = this.skills_get_croppery_3();


function skills_get_crystalography_1(){
	return {
		id: 88,
		name: "Crystallography",
		level: 1,
		description: "Any alchemist with a Crystalmalizing Chamber can create Plain Crystals, but learn Crystallography and you'll save your chamber from some of the usual chafe. The Giants sometimes favor those with this skill.",
		learned: "Congratulations, you are now an official Crystallographer! Or, is it Crystalmalizer?  Crystalogist?  Well, whatever … all you need is a Crystalmalizing Chamber, and you can make crystals!",
		point_cost: 14400,
		category_id: 6,
		requires_level: 0,
		quest_id: "",
		req_skills: ["alchemy_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"cosma": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/crystalography_1_37979.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/crystalography_1_37979.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/crystalography_1_37979.png"
		},
	};
};
data_skills.crystalography_1 = this.skills_get_crystalography_1();


function skills_get_distilling_1(){
	return {
		id: 123,
		name: "Distilling",
		level: 0,
		description: "The clandestine art of distillation enables the amateur moonshiner to create home-brewed hooch from grain or potatoes in mere minutes, using only a Still and the desire to extract booze from the most innocent of ingredients.",
		learned: "It could be the glint in your eye, the smell on your breath, or the large 'Distilling' badge on your skills page, but word is out you're the newest moonshiner around. Grab a Still, find somewhere safe to put it (you don't want it exploding in your bag), and get booze-brewing, hoochie-pie.",
		point_cost: 14400,
		category_id: 6,
		requires_level: 5,
		quest_id: "distilling_make_and_distribute_hooch",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["tincturing_1"],
		giants: {
			"friendly": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"pot": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/distilling_1_73379.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/distilling_1_73379.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/distilling_1_73379.png"
		},
	};
};
data_skills.distilling_1 = this.skills_get_distilling_1();


function skills_get_elementhandling_1(){
	return {
		id: 50,
		name: "Element Handling",
		level: 0,
		description: "The basic elements, Red, Green, Blue and Shiny, are tricky things. Not just anyone can handle them. Learning Element Handling gives you the ability to carry an Elemental Pouch and thereby handle all the elements you want. It is also the prerequisite for learning Alchemy and Refining.",
		learned: "Congratulations! Element Handling I is the first step of your exciting journey into... well, handling elements. To get started, you'll need an Elemental Pouch. It's a handy way to store the elements you'll obtain from refining Chunks of Ore. Unless you'd rather carry them in your hands.",
		point_cost: 1200,
		category_id: 6,
		requires_level: 3,
		quest_id: "elementhandling_buy_elemental_pouch",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["alchemy_1","refining_1"],
		giants: {
			"alph": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/elementhandling_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/elementhandling_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/elementhandling_1_28144.png"
		},
	};
};
data_skills.elementhandling_1 = this.skills_get_elementhandling_1();


function skills_get_engineering_1(){
	return {
		id: 92,
		name: "Engineering",
		level: 1,
		description: "Someone very clever once said, \"Necessity is the mother of invention\". Learn Engineering and you'll join the ranks of glitches able to assemble & install awe-inspiring machines. You can also craft better tools, if you know Tinkering IV or V. How inventive! Your mother (\"Necessity\", apparently) would be very proud.",
		learned: "Tools are great, and machines are exponentially more efficient than regular ol' tools. Now that you've learned Engineering I, you've not only mastered the machines, but combined with Tinkering V, your tool-crafting ability is completely off the chart.",
		point_cost: 28800,
		category_id: 11,
		requires_level: 0,
		quest_id: "",
		req_skills: ["tinkering_3"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["blockmaking_1","woodworking_1","metalwork_1"],
		giants: {
			"alph": {
				primary: 1
			},
			"lem": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/engineering_1_37979.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/engineering_1_37979.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/engineering_1_37979.png"
		},
	};
};
data_skills.engineering_1 = this.skills_get_engineering_1();


function skills_get_eyeballery_1(){
	return {
		id: 115,
		name: "Eyeballery",
		level: 0,
		description: "Eyeballery allows you to set your brain to roving Camera Mode, seeing around corners, up ladders and through walls, using only the letter \"C\" and the arrow keys. A perfect complement to the Snapshottery upgrade, it is the skill that every artistic and 'energy-efficient' glitch has been waiting for!",
		learned: "'I am a camera', says the Glitch with Eyeballery, 'with its shutter open, quite passive...' Yup: while wishing you were a little bit taller never worked, wishing you were an eyeballer sure did: you're now a certified master of Eyeballery. Use \"C\" on your keyboard to enter Camera Mode and get as close as you get to having eyes in the back of your head without complex and painful surgery. Get the Snapshottery upgrade to capture these images.",
		point_cost: 14400,
		category_id: 19,
		requires_level: 0,
		quest_id: "eyeballery_identify_object",
		req_skills: ["meditativearts_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["nudgery_1"],
		giants: {
			"cosma": {
				primary: 0
			},
			"friendly": {
				primary: 1
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/eyeballery_1_65997.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/eyeballery_1_65997.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/eyeballery_1_65997.png"
		},
	};
};
data_skills.eyeballery_1 = this.skills_get_eyeballery_1();


function skills_get_ezcooking_1(){
	return {
		id: 35,
		name: "EZ Cooking",
		level: 1,
		description: "Whosoever desires to cook starts here: with a Knife & Board and the handful of basic recipes which one masters in order to advance through the cooking tree. Some additional recipes can be learned through use, but more will come with more advanced cooking skills.",
		learned: "Huzzah! With your newly acquired Knife & Board and EZ Cooking ability, go ahead and start practicing. You can now whip up a mean cheezy sammich, but you still have much to learn.",
		point_cost: 600,
		category_id: 8,
		requires_level: 0,
		quest_id: "ezcooking_make_level1_recipes",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["cheffery_1","blending_1","ezcooking_2"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/ezcooking_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/ezcooking_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/ezcooking_1_28144.png"
		},
	};
};
data_skills.ezcooking_1 = this.skills_get_ezcooking_1();


function skills_get_ezcooking_2(){
	return {
		id: 66,
		name: "EZ Cooking",
		level: 2,
		description: "The second level of EZ Cooking grants several new recipes with the Knife & Board and makes one's chopping, slicing, mincing and dicing more efficient.",
		learned: "Welcome to EZ Cooking II! Faster than a kitchen ninja, now you can use your Knife & Board to slice and dice with the best of them. Try your new recipes. Love your new recipes. Live your new recipes.",
		point_cost: 3600,
		category_id: 8,
		requires_level: 0,
		quest_id: "ezcooking_make_level2_recipes",
		req_skills: ["ezcooking_1"],
		req_achievements: ["able_chopper"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/ezcooking_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/ezcooking_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/ezcooking_2_28144.png"
		},
	};
};
data_skills.ezcooking_2 = this.skills_get_ezcooking_2();


function skills_get_fiber_arts_1(){
	return {
		id: 135,
		name: "Fiber Arts",
		level: 1,
		description: "The ancient art of taking Fiber - still fresh and flexible from the tail of a Fox - and spinning it into Thread using a spindle. The first step in the creation of more complex fabrics, rugs, and other textilular items.",
		learned: "Only the Fiber Arts I artisan knows the feeling of Fox Tail Fibers, strong and supple, running between their fingers and being spun into Ur's most flexible and useful thread. Of course, only someone with a higher level of Fiber Artisanship can then turn the thread into something even more useful, but we all have to start somewhere. ",
		point_cost: 10800,
		category_id: 11,
		requires_level: 5,
		quest_id: "",
		req_skills: ["foxbrushing_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["fiber_arts_2"],
		giants: {
			"alph": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/fiber_arts_1_87006.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/fiber_arts_1_86491.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/fiber_arts_1_86491.png"
		},
	};
};
data_skills.fiber_arts_1 = this.skills_get_fiber_arts_1();


function skills_get_fiber_arts_2(){
	return {
		id: 136,
		name: "Fiber Arts",
		level: 2,
		description: "With Fiber Arts II comes an understanding of how to manipulate thick, musty fox-fiber thread into pliant String or Fabric, or even a charming Rug, using a Loomer.",
		learned: "The Fiber Arts II artisan understands the power of a single corse fox hair. From the fox hair comes the thread, and from the thread comes string, fabric and rugs. Sure it may be scratchy and smell a little like the underside of a woodland creature, but isn't it a miracle of Loomery?",
		point_cost: 25200,
		category_id: 11,
		requires_level: 7,
		quest_id: "",
		req_skills: ["fiber_arts_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/fiber_arts_2_87006.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/fiber_arts_2_86491.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/fiber_arts_2_86491.png"
		},
	};
};
data_skills.fiber_arts_2 = this.skills_get_fiber_arts_2();


function skills_get_focused_meditation_1(){
	return {
		id: 61,
		name: "Focused Meditation",
		level: 0,
		description: "A more advanced form of meditation, Focused Meditation allows the meditater to focus purely on Mood or Energy and apply the benefits of mindfulness solely to one or the other, rather than distributing them evenly.",
		learned: "You wanted more focus, and now you have it, thanks to Focused Mediation. Question is, what are you going to focus on first: your Mood or your Energy. Here's an idea: get your Focusing Orb and try your hand at each! Yea, that's a pretty good idea.",
		point_cost: 14400,
		category_id: 19,
		requires_level: 0,
		quest_id: "focusedmeditation_get_mood_or_energy",
		req_skills: ["meditativearts_1"],
		req_achievements: [],
		req_quests: ["meditativearts_meditate_for_time_period"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/focused_meditation_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/focused_meditation_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/focused_meditation_1_28144.png"
		},
	};
};
data_skills.focused_meditation_1 = this.skills_get_focused_meditation_1();


function skills_get_foxbrushing_1(){
	return {
		id: 134,
		name: "Fox Brushing",
		level: 0,
		description: "A fiber-hunter with the skill of Fox Brushing can expect to rub foxes up the right way (rather than the wrong one), reaping a handful more fibers with every brush.",
		learned: "Your newfound knowledge of the complex workings of the Brush (which end is the handle, etc) will enable you to pull more precious fibers from the bushy bits of a fox with each grooming.",
		point_cost: 7200,
		category_id: 14,
		requires_level: 4,
		quest_id: "",
		req_skills: ["animalkinship_2"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["fiber_arts_1"],
		giants: {
			"friendly": {
				primary: 0
			},
			"humbaba": {
				primary: 1
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/foxbrushing_1_87008.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/foxbrushing_1_86491.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/foxbrushing_1_86491.png"
		},
	};
};
data_skills.foxbrushing_1 = this.skills_get_foxbrushing_1();


function skills_get_fruitchanging_1(){
	return {
		id: 17,
		name: "Fruit Changing",
		level: 0,
		description: "To change cherries to the other fruit, it is wise to select the Fruit Changing skill: though operating a Fruit Changing Machine without it is possible, learning this skill first will make it much more economical to do so, and faster as well!",
		learned: "Welcome to the powerfully transformative world of Fruit Changery. As a full-fledged Fruit Change-a-mifier, you can now reassign Cherries new fruit identities as you see fit. But first, you'll need to get a Fruit Changing Machine. ",
		point_cost: 1800,
		category_id: 16,
		requires_level: 3,
		quest_id: "fruitchanging_transform_fruit",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"mab": {
				primary: 0
			},
			"pot": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/fruitchanging_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/fruitchanging_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/fruitchanging_1_28144.png"
		},
	};
};
data_skills.fruitchanging_1 = this.skills_get_fruitchanging_1();


function skills_get_fuelmaking_1(){
	return {
		id: 91,
		name: "Fuelmaking",
		level: 0,
		description: "The Law of Conservation of Energy states that energy cannot be created or destroyed, only converted from one form to another. Learn Fuelmaking and you can harness the power of a Fuelmaker to transform energy into ultra-powerful, compact Fuel Cells.",
		learned: "Phew! How fortunate for you my fastidious fuelmaker. Forget fossil fuels, you can now formulate the formula to form the fuel to fuel the Fuelmaker. Fantastic!",
		point_cost: 86400,
		category_id: 11,
		requires_level: 0,
		quest_id: "fuelmaking_refuel_robot",
		req_skills: ["alchemy_1","bogspecialization_1","jellisac_hands_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/fuelmaking_1_37979.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/fuelmaking_1_37979.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/fuelmaking_1_37979.png"
		},
	};
};
data_skills.fuelmaking_1 = this.skills_get_fuelmaking_1();


function skills_get_furnituremaking_1(){
	return {
		id: 99,
		name: "Furnituremaking",
		level: 1,
		description: "The first step toward a more comfortable home. Teaching the correct end of a Construction Tool and just where a Snail should be hit (or turned, depending), Furnituremaking I is essential for the proud homeowner and requirer of basic furniture.",
		learned: "Now you know which end of a side table is up (the square, flat end) and how tightly to turn your snail, the world of basic furniture construction is suddenly laid before you. Go frolic in it.",
		point_cost: 43200,
		category_id: 11,
		requires_level: 7,
		quest_id: "",
		req_skills: ["tinkering_2"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["furnituremaking_2"],
		giants: {
			"alph": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/furnituremaking_1_87006.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/furnituremaking_1_86491.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/furnituremaking_1_86491.png"
		},
	};
};
data_skills.furnituremaking_1 = this.skills_get_furnituremaking_1();


function skills_get_furnituremaking_2(){
	return {
		id: 100,
		name: "Furnituremaking",
		level: 2,
		description: "For those who long for the sophisticated indoor decor only a wider range of furniture items can provide, Furnituremaking II enables the creation of armchairs, beds, and many other complex\/comfortable (complorxable?) homewares. When used in conjunction with Engineering, the full range of domestic furnishings (including doors, wall segments, etc) become craftable.",
		learned: "With Furnituremaking II, you're well on your way to gracing the pages of Ur's Bestest Homes and Gardens, or at least you wil  be, as soon as that magazine exists again. And if you're clever enough to have Engineering as a skill as well, even more complex acts of furnishing (like  doors and bookcases) are well within your grasp.",
		point_cost: 172800,
		category_id: 11,
		requires_level: 10,
		quest_id: "",
		req_skills: ["furnituremaking_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/furnituremaking_2_87006.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/furnituremaking_2_86491.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/furnituremaking_2_86491.png"
		},
	};
};
data_skills.furnituremaking_2 = this.skills_get_furnituremaking_2();


function skills_get_gardening_1(){
	return {
		id: 9,
		name: "Arborology",
		level: 1,
		description: "The Arborology skill bestows upon you a certain facility with trees such that your deft and graceful harvesting hands return twice more product with each harvest. Your increased skill in stuff-gathering also reduces the time each harvest takes.",
		learned: "Congratulations! Your newfound affinity with trees has given you an increased ability to harvest the fruits (and spices, eggs, bubbles, and gasses) of their labor. You'll harvest more, and harvest faster. And isn't that what every efficient Arborologist wants?",
		point_cost: 1800,
		category_id: 16,
		requires_level: 0,
		quest_id: "gardening_harvest_trees",
		req_skills: ["soil_appreciation_2","light_green_thumb_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["gardening_2"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/gardening_1_94576.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/gardening_1_94576.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/gardening_1_94576.png"
		},
	};
};
data_skills.gardening_1 = this.skills_get_gardening_1();


function skills_get_gardening_2(){
	return {
		id: 10,
		name: "Arborology",
		level: 2,
		description: "A higher level of Arborology skill means an increased awareness of how the great garden of Ur grows: and how best to exploit it. Hurrah! With Arborology II you can not only harvest more often, but get a little imagination every time you harvest.",
		learned: "Now that you've climbed the muddy slope to Arborology II, you're able to harvest twice as often, and get a little boost of organic tree imagination every time you do. And as everyone knows, that's the best kind of imagination there is.",
		point_cost: 5400,
		category_id: 16,
		requires_level: 0,
		quest_id: "gardening_harvest_all_trees_in_time_period",
		req_skills: ["gardening_1"],
		req_achievements: [],
		req_quests: ["gardening_harvest_trees"],
		req_upgrades: [],
		post_skills: ["gardening_3","botany_1"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/gardening_2_94576.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/gardening_2_94576.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/gardening_2_94576.png"
		},
	};
};
data_skills.gardening_2 = this.skills_get_gardening_2();


function skills_get_gardening_3(){
	return {
		id: 11,
		name: "Arborology",
		level: 3,
		description: "Acquire the third level of the Arborology skill, and see your harvests improve dramatically. As the energy it takes to gather tree-based goods decreases, you'll develop the ability to occasionally coax a bonus reward from your harvestings. Life is win\/win for the Level III Arborologist.",
		learned: "Up to 12 items from one harvest? Who knew so much could be reaped at once? Arborology III glitches, that's who. They also knew about bonus rewards, the sneaky sods. But now you know too, go forth and enjoy the extra garnerings Arborology III brings!",
		point_cost: 21600,
		category_id: 16,
		requires_level: 0,
		quest_id: "gardening_harvest_last_egg_plant",
		req_skills: ["gardening_2"],
		req_achievements: ["emblem_skill_unlock_spriggan_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["gardening_4"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/gardening_3_94576.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/gardening_3_94576.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/gardening_3_94576.png"
		},
	};
};
data_skills.gardening_3 = this.skills_get_gardening_3();


function skills_get_gardening_4(){
	return {
		id: 12,
		name: "Arborology",
		level: 4,
		description: "Arborology IV is notable for increasing your chance of a bonus gift during harvesting, and increasing the imagination you get every time you do harvest. Which all serves to increase your reason for learning it.",
		learned: "Almost at the top of the muddy slide of arborology greatness, harvesting trees now grants double the imagination, and considerably more chance of getting a bonus reward. It's good to be green fingered.",
		point_cost: 57600,
		category_id: 16,
		requires_level: 0,
		quest_id: "gardening_plant_beans_make_sure_become_trees",
		req_skills: ["gardening_3"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["gardening_5"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/gardening_4_94576.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/gardening_4_94576.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/gardening_4_94576.png"
		},
	};
};
data_skills.gardening_4 = this.skills_get_gardening_4();


function skills_get_gardening_5(){
	return {
		id: 13,
		name: "Arborology",
		level: 5,
		description: "The ultimate level of Arborology skill offers an altogether better class of bonus reward, and provides the foundation necessary to upgrade to even more productive methods of harvesting.",
		learned: "Just when you thought harvesting trees couldn't get much awesomer, it did.The highest level Arborology skill has gotten you all prepared for the Super Harvest upgrades, and it also gives you the greatest bonus gifts an arborologist could wish for. Gratz!",
		point_cost: 259200,
		category_id: 16,
		requires_level: 0,
		quest_id: "gardening_max_harvest_from_all_trees",
		req_skills: ["gardening_4"],
		req_achievements: [],
		req_quests: ["gardening_plant_beans_make_sure_become_trees"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/gardening_5_94576.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/gardening_5_94576.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/gardening_5_94576.png"
		},
	};
};
data_skills.gardening_5 = this.skills_get_gardening_5();


function skills_get_gasmogrification_1(){
	return {
		id: 20,
		name: "Gasmogrification",
		level: 0,
		description: "General Vapor, as everyone knows, is the Ur-source of all other gases. But perhaps there are some that do not know this: learning Gasmogrification increases one's facility with a Gassifier such that some profit can be had through the operation of same. Plus, it happens faster.",
		learned: "You did it! With Gasmogrification, you finally have the ability to profit from all the gas you produce. Get your mitts on a Gassifier and some General Vapor and see what kind of gassy magic you can perform.",
		point_cost: 1800,
		category_id: 16,
		requires_level: 3,
		quest_id: "gasmogrification_transform_gasses",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/gasmogrification_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/gasmogrification_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/gasmogrification_1_28144.png"
		},
	};
};
data_skills.gasmogrification_1 = this.skills_get_gasmogrification_1();


function skills_get_grilling_1(){
	return {
		id: 40,
		name: "Grilling",
		level: 1,
		description: "The sizzle, the char, the melty-ness ... when Grilling, one gets it all. And with the first Grilling skill, you will finally be able to use that Famous Pugilist Grill you've been eyeing AND learn several recipes to boot. As a bonus, additional recipes can be learned through use.",
		learned: "Ah, Grilling. Is it an art or a science? What's the secret to perfect sear marks? Is carbonified food really that bad for you? These are just some of the mysteries you can ponder now that you have mastered Grilling I. Mouths will water, but to learn more recipes, you will have to buy a practically patented Famous Pugilist Grill and exercise your craft.",
		point_cost: 5400,
		category_id: 8,
		requires_level: 0,
		quest_id: "grilling_make_level1_recipes",
		req_skills: ["cheffery_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["grilling_2","masterchef_1"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/grilling_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/grilling_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/grilling_1_28144.png"
		},
	};
};
data_skills.grilling_1 = this.skills_get_grilling_1();


function skills_get_grilling_2(){
	return {
		id: 41,
		name: "Grilling",
		level: 2,
		description: "Expand your knowledge and ability with the Famous Pugilist Grill with the second Grilling skill and unlock several new recipes while simultaneously becoming a better grill operator. Worth it? Probably.",
		learned: "You have completed Grilling II! Insert 'Along with the Famous Pugilist Grill, your new grilling skills are a knock-out!' joke here. But let's be serious for a minute. Your Grilling kung fu has made you worthy of the recipes you may now try. Go forth with flavor. ",
		point_cost: 10800,
		category_id: 8,
		requires_level: 0,
		quest_id: "grilling_make_level2_recipes",
		req_skills: ["grilling_1"],
		req_achievements: ["brazier_apprentice"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/grilling_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/grilling_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/grilling_2_28144.png"
		},
	};
};
data_skills.grilling_2 = this.skills_get_grilling_2();


function skills_get_herbalism_1(){
	return {
		id: 107,
		name: "Herbalism",
		level: 1,
		description: "For those who like to partake of the herb gardening, Herbalism I ensures more gifts from planting, watering and clearing, and increases the chances of a double yield when shucking your herbs.",
		learned: "Congratulations: the herbs are your friends. Now you're a qualified Herbalist, they'll be more willing to deliver gifts while harvesting, and surrender super seediness to your deftly shucking digits. Which you should say out loud, because it is fun.",
		point_cost: 7200,
		category_id: 17,
		requires_level: 0,
		quest_id: "herbalism_harvest_shuck_and_plant_herbs",
		req_skills: ["soil_appreciation_3"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["herbalism_2","tincturing_1"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/herbalism_1_53939.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/herbalism_1_53939.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/herbalism_1_53939.png"
		},
	};
};
data_skills.herbalism_1 = this.skills_get_herbalism_1();


function skills_get_herbalism_2(){
	return {
		id: 108,
		name: "Herbalism",
		level: 2,
		description: "Dedicated herbologists will appreciate Herbalism II, which further increases the likelihood of receiving little extras when harvesting, gives a chance of a double-harvest, and significantly increases the likelihood of shucking a double amount of seeds.",
		learned: "You're not just a herbologist, you're a dedicated master of the herbology arts, with high ratio of double-herbation and some well-honed double-shucking seed-shiller-skills. Try saying THAT after one two many hooches. You can't. So stick with the herbs.",
		point_cost: 21600,
		category_id: 17,
		requires_level: 0,
		quest_id: "herbalism_get_super_harvest",
		req_skills: ["herbalism_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["herbalism_3"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/herbalism_2_53939.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/herbalism_2_53939.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/herbalism_2_53939.png"
		},
	};
};
data_skills.herbalism_2 = this.skills_get_herbalism_2();


function skills_get_herbalism_3(){
	return {
		id: 133,
		name: "Herbalism",
		level: 3,
		description: "No fan of Herbalism should be without Herbalism III, offering, as it does, more skill in sniffing out little extra gifts while herb-gardening, increased chance of a double harvest, and optimal shucking abilities for the home or community herb gardener. ",
		learned: "With Herbalism III, you are so one with the herbs you are practically a herb yourself. A herb that is very good at growing other herbs - a herb that can shuck harder, double-harvest readier, and discover more little gifts while herb-gardening than anyone else. Man, it's good to be a herb.",
		point_cost: 43200,
		category_id: 17,
		requires_level: 0,
		quest_id: "herbalism_plant_seeds_in_someones_garden",
		req_skills: ["herbalism_2"],
		req_achievements: [],
		req_quests: ["herbalism_get_super_harvest"],
		req_upgrades: [],
		post_skills: ["mastergardener_1"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/herbalism_3_53939.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/herbalism_3_53939.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/herbalism_3_53939.png"
		},
	};
};
data_skills.herbalism_3 = this.skills_get_herbalism_3();


function skills_get_herdkeeping_1(){
	return {
		id: 21,
		name: "Herdkeeping",
		level: 0,
		description: "Putting kinship with animals together with appreciation for soil and adding a bit more learning one comes to learn Herdkeeping. And when one comes to learn that, one suddenly becomes able to capture Piggies and dramatically reduce the chances of their escapage while hogtied, and also to set animals free when the back-yard is feeling overpopulated.",
		learned: "You've mastered Herdkeeping, and now you feel different, right? Of course you do. You're a new you. A you that is now capable of capturing wild animals and keeping them in your house, or setting them free if you'd like. (Hint: If you haven't yet, you should get a house.)",
		point_cost: 14400,
		category_id: 14,
		requires_level: 0,
		quest_id: "herdkeeping_capture_piggies",
		req_skills: ["soil_appreciation_2","animalkinship_2"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["remoteherdkeeping_1"],
		giants: {
			"humbaba": {
				primary: 1
			},
			"pot": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/herdkeeping_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/herdkeeping_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/herdkeeping_1_28144.png"
		},
	};
};
data_skills.herdkeeping_1 = this.skills_get_herdkeeping_1();


function skills_get_intermediateadmixing_1(){
	return {
		id: 16,
		name: "Intermediate Admixing",
		level: 0,
		description: "Compounds are nice and all, but, really, they have very little use until you can start putting them together. Intermediate Admixing teaches you to use a beaker to make all manner of valuable powders which can do everything from causing sneezing fits to temporarily enchanting a shrine.",
		learned: "Felicitations, Intermediate Admixer. You want to make funny-smelling powders with weird properties? You picked the right skill. Get a Beaker and start experimenting with various compounds. Remember: the only thing you have to fear is fear itself. And explosions.",
		point_cost: 28800,
		category_id: 6,
		requires_level: 0,
		quest_id: "intermediateadmixing_make_powder",
		req_skills: ["alchemy_1"],
		req_achievements: ["emblem_skill_unlock_ti_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["botany_1"],
		giants: {
			"alph": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/intermediateadmixing_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/intermediateadmixing_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/intermediateadmixing_1_28144.png"
		},
	};
};
data_skills.intermediateadmixing_1 = this.skills_get_intermediateadmixing_1();


function skills_get_jellisac_hands_1(){
	return {
		id: 90,
		name: "Jellisac Hands",
		level: 0,
		description: "Jellisac scooping requires a special kind of touch.  Learn Jellisac Hands and you'll be scooping those slippery suckers faster, and with less effort. You may even get more jellisacs per scoop! ",
		learned: "Gone are the days of unskillfully scooping jellisacs.  Now that you've got Jellisac Hands you're able to scoop those sacs like a pro!  Scoop with ease, and toil away no longer.",
		point_cost: 7200,
		category_id: 16,
		requires_level: 0,
		quest_id: "jellisachands_donate_jellisacs",
		req_skills: ["soil_appreciation_2"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["fuelmaking_1"],
		giants: {
			"grendaline": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/jellisac_hands_1_37979.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/jellisac_hands_1_37979.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/jellisac_hands_1_37979.png"
		},
	};
};
data_skills.jellisac_hands_1 = this.skills_get_jellisac_hands_1();


function skills_get_levitation_1(){
	return {
		id: 79,
		name: "Levitation",
		level: 0,
		description: "Allows you to use the Focusing Orb to get brief moments of levitation by means of yogic-jumping.",
		learned: "Now you can levitate in short bursts! To try it, get a Focusing Orb, \"imagine levitation\" and be prepared to hit the space bar a lot ...",
		point_cost: 18000,
		category_id: 19,
		requires_level: 5,
		quest_id: "",
		req_skills: ["meditativearts_3"],
		req_achievements: ["rambler_first_class"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/levitation_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/levitation_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/levitation_1_28144.png"
		},
	};
};
data_skills.levitation_1 = this.skills_get_levitation_1();


function skills_get_light_green_thumb_1(){
	return {
		id: 6,
		name: "Light Green Thumb",
		level: 1,
		description: "This is the first step towards a better relationship with plant life of all kinds. It ensures success when watering and petting trees and plants, halves the time required to water and gives some modest imagination rewards.",
		learned: "With Light Green Thumb, you've just taken a step into a bigger world. A world where you grok plants, and they grok you right back. Armed with your trusty Watering Can, you will now enjoy some modest rewards now that you know how to water and pet the veg properly, and at twice the speed to boot.",
		point_cost: 600,
		category_id: 17,
		requires_level: 0,
		quest_id: "lightgreenthumb_water_trees",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["light_green_thumb_2","gardening_1","croppery_1"],
		giants: {
			"grendaline": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/light_green_thumb_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/light_green_thumb_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/light_green_thumb_1_28144.png"
		},
	};
};
data_skills.light_green_thumb_1 = this.skills_get_light_green_thumb_1();


function skills_get_light_green_thumb_2(){
	return {
		id: 7,
		name: "Light Green Thumb",
		level: 2,
		description: "The second level of Light Green Thumb reduces the energy required to water, gives a neat little imagination reward for same, and unlocks the upgrades that enable occasional bonus rewards from tree-caring!",
		learned: "Watering your friends in the tree kingdom now uses less energy, and is even more personally rewarding, believe it or not. Keep on grokking!",
		point_cost: 1800,
		category_id: 17,
		requires_level: 0,
		quest_id: "lightgreenthumb_get_tree_to_level10",
		req_skills: ["light_green_thumb_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["light_green_thumb_3"],
		giants: {
			"grendaline": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/light_green_thumb_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/light_green_thumb_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/light_green_thumb_2_28144.png"
		},
	};
};
data_skills.light_green_thumb_2 = this.skills_get_light_green_thumb_2();


function skills_get_light_green_thumb_3(){
	return {
		id: 8,
		name: "Light Green Thumb",
		level: 3,
		description: "A plant or tree giving you its fruit without even harvesting?! That's possible (though rare) when you have Light Green Thumb III, but you can count on a doubled imagination reward for watering and a nice mood boost.",
		learned: "A plant or tree giving you its fruit without you even having to harvest it? Unpossible, you say? Okay, yes, it's mostly unpossible. But it does happen from time to time. More importantly, though, you now get twice the rewards for watering, plus a nice little kick in the old mood box. Which is a good thing. ",
		point_cost: 21600,
		category_id: 17,
		requires_level: 0,
		quest_id: "lightgreenthumb_break_watering_can",
		req_skills: ["light_green_thumb_2"],
		req_achievements: ["emblem_skill_unlock_grendaline_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 1
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/light_green_thumb_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/light_green_thumb_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/light_green_thumb_3_28144.png"
		},
	};
};
data_skills.light_green_thumb_3 = this.skills_get_light_green_thumb_3();


function skills_get_martial_imagination_1(){
	return {
		id: 114,
		name: "Martial Imagination",
		level: 0,
		description: "With Martial Imagination, you can channel the daydreams and musings of nearby Glitches into a powerful stun attack by means of your Focusing Orb. Use it only in self-defense, in cases of extreme danger: imagination is not a toy!",
		learned: "Have I mentioned lately that your imagination is looking positively stunning? Your mastery of Martial Imagination grants you imaginative powers formerly reserved for the Giants themselves, allowing you to launch a stun attack against the dark, winged enemies of creativity. Yes, you know the ones. Get out there and give those aerial antagonists a piece of your mind!",
		point_cost: 86400,
		category_id: 19,
		requires_level: 12,
		quest_id: "rook_hall_start",
		req_skills: ["transcendental_radiation_1"],
		req_achievements: [],
		req_quests: ["rook_hall_start"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/martial_imagination_1_57098.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/martial_imagination_1_57098.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/martial_imagination_1_57098.png"
		},
	};
};
data_skills.martial_imagination_1 = this.skills_get_martial_imagination_1();


function skills_get_masterchef_1(){
	return {
		id: 47,
		name: "Master Chef",
		level: 1,
		description: "Feel like one of the best cooking tools has eluded you so far, despite your prodigious learning in the cooking skills? You're right! Learn Master Chef and you will be whipping up some recipes with the Awesome Pot forthwith.",
		learned: "Welcome to the moderately hallowed halls of Master Cheffery. In your hands, the Awesome Pot will become a crucible and you the metal, in which you will forge a demi-god of cookery, whipping up recipes that would make a Butterfly weep for joy.",
		point_cost: 21600,
		category_id: 8,
		requires_level: 0,
		quest_id: "masterchef_make_level1_recipes",
		req_skills: ["saucery_1","grilling_1","blending_1","cheffery_3"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["masterchef_2"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/masterchef_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/masterchef_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/masterchef_1_28144.png"
		},
	};
};
data_skills.masterchef_1 = this.skills_get_masterchef_1();


function skills_get_masterchef_2(){
	return {
		id: 48,
		name: "Master Chef",
		level: 2,
		description: "The second level of Master Chef unlocks additional recipes for the Awesome Pot and increases your efficiency in using it to make lower-level recipes.",
		learned: "With Master Chef II, you're flying mighty close to the big shiny oven in the sky. Make sure it doesn't go to that big head of yours now that you can whip up advanced recipes in a jiffity-split",
		point_cost: 57600,
		category_id: 8,
		requires_level: 0,
		quest_id: "",
		req_skills: ["masterchef_1"],
		req_achievements: ["1star_cuisinartist","emblem_skill_unlock_pot_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"humbaba": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/masterchef_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/masterchef_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/masterchef_2_28144.png"
		},
	};
};
data_skills.masterchef_2 = this.skills_get_masterchef_2();


function skills_get_mastergardener_1(){
	return {
		id: 138,
		name: "Master Gardener",
		level: 0,
		description: "Truly blessed is the gardener who masters Garden Mastery to become a true Garden Master, for they gain access to the five mystical potions of horticultural power. None but the Master Gardener can pour the potions that allow you to water, plant, fertilize, harvest and clear a whole garden at once.",
		learned: "Hush, oh hallowed Master Gardener, and you may hear the wind through the fronds of ripened crops seem to whisper your name as you pass. Why? Because you, master of all gardens (master in its most non-gender-specific sense) can use the five potions of gardening power. And that is the most awesome thing crops can think of.",
		point_cost: 129600,
		category_id: 17,
		requires_level: 15,
		quest_id: "",
		req_skills: ["croppery_3","herbalism_3"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: ["croppery_herbalism_watering_time","croppery_herbalism_clearing_time"],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/mastergardener_1_112781.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/mastergardener_1_112781.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/mastergardener_1_112781.png"
		},
	};
};
data_skills.mastergardener_1 = this.skills_get_mastergardener_1();


function skills_get_meditativearts_1(){
	return {
		id: 55,
		name: "Meditative Arts",
		level: 1,
		description: "So much going on. Always so busy. Need to step back from samsara and learn to experience yourself directly, in an unmediated way? Well, Meditation is the skill for you. It allows the use of the Focusing Orb to enter a Mood and Energy-giving meditative state.",
		learned: "Say goodbye to Swirly Brain Syndrome. Now that you've completed Meditative Arts I, get yourself a Focusing Orb and start finding your center. It's in there somewhere. ",
		point_cost: 2400,
		category_id: 19,
		requires_level: 4,
		quest_id: "meditativearts_meditate_for_time_period",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["focused_meditation_1","meditativearts_2","teleportation_1","eyeballery_1"],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/meditativearts_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/meditativearts_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/meditativearts_1_28144.png"
		},
	};
};
data_skills.meditativearts_1 = this.skills_get_meditativearts_1();


function skills_get_meditativearts_2(){
	return {
		id: 63,
		name: "Meditative Arts",
		level: 2,
		description: "A direct step up from the first level, Meditative Arts II doubles the length of time you can stay in the zone, and at the same time bumps up the Imagination rewards from meditation.",
		learned: "With Meditative Arts II, you are your own best guru. If you don't have one already, add a Focusing Orb to your spiritual arsenal and get meditating. All that bliss isn't going to find itself, you know.",
		point_cost: 14400,
		category_id: 19,
		requires_level: 0,
		quest_id: "meditativearts_maintain_energy_in_wintry_place",
		req_skills: ["meditativearts_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["transcendental_radiation_1","meditativearts_3"],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/meditativearts_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/meditativearts_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/meditativearts_2_28144.png"
		},
	};
};
data_skills.meditativearts_2 = this.skills_get_meditativearts_2();


function skills_get_meditativearts_3(){
	return {
		id: 64,
		name: "Meditative Arts",
		level: 3,
		description: "Meditative Arts III doubles the amount of time you can stay in the zone yet again, gives more iMG reward each time you meditate, and doubles the amount of energy and mood you get for every second spent meditating.",
		learned: "Om my goodness, you've just completed Meditative Arts III, the highest level of Meditative Arts. In the zone? Friend, you'll be the in-the-zoniest. If that's a phrase. Whatever: it is now.",
		point_cost: 57600,
		category_id: 19,
		requires_level: 0,
		quest_id: "meditativearts_get_max_relax",
		req_skills: ["meditativearts_2"],
		req_achievements: ["emblem_skill_unlock_cosma_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["levitation_1","piety_1"],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/meditativearts_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/meditativearts_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/meditativearts_3_28144.png"
		},
	};
};
data_skills.meditativearts_3 = this.skills_get_meditativearts_3();


function skills_get_metalwork_1(){
	return {
		id: 126,
		name: "Metalworking",
		level: 0,
		description: "Occasionally, the melodious clang of expert metalworker at work metalworking metal can be heard echoing off the mountains of Ur. When it can, you know impressive things like Metal Rods, Bars and Girders are being made. By whom? By someone with the skill and a Metal Machine, of course.",
		learned: "The rules of Metalwork have been drilled into your brain like mental screws into a particularly well-worked piece of metal. The strongest material known to Ur now feels as malleable under your deft touch as butterfly butter (but better for building stuff with).",
		point_cost: 86400,
		category_id: 11,
		requires_level: 5,
		quest_id: "",
		req_skills: ["alchemy_2","engineering_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/metalwork_1_87006.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/metalwork_1_86491.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/metalwork_1_86491.png"
		},
	};
};
data_skills.metalwork_1 = this.skills_get_metalwork_1();


function skills_get_mining_1(){
	return {
		id: 52,
		name: "Mining",
		level: 1,
		description: "Mining is the gateway to some pretty valuable resource extraction procedures: you'll be using a Pick to produce Chunks of Ore from special rocks scattered around the world. Though mining is hard work, the rewards are worth it.",
		learned: "Welcome to gritty but rewarding field of Mining! Some think of mining as an aggressive act, but most Rocks really dig it. Now that you've got some basic skills, grab a Pick, get out there, and show those Rocks some tough love. ",
		point_cost: 2400,
		category_id: 11,
		requires_level: 3,
		quest_id: "mining_mine_rocks",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["mining_2","refining_1"],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/mining_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/mining_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/mining_1_28144.png"
		},
	};
};
data_skills.mining_1 = this.skills_get_mining_1();


function skills_get_mining_2(){
	return {
		id: 53,
		name: "Mining",
		level: 2,
		description: "Mining II reduces the time it takes to mine and reduces the amount of energy you use to extract ore. Sweet.",
		learned: "Those little arms of yours aren't much to look at, but thanks to Mining II, you are now speedier with your swings - and a bit more efficient, too, resulting in less energy loss while mining. Swing away!",
		point_cost: 14400,
		category_id: 11,
		requires_level: 0,
		quest_id: "mining_mine_in_time_period",
		req_skills: ["mining_1"],
		req_achievements: [],
		req_quests: ["mining_mine_rocks"],
		req_upgrades: [],
		post_skills: ["mining_3"],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/mining_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/mining_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/mining_2_28144.png"
		},
	};
};
data_skills.mining_2 = this.skills_get_mining_2();


function skills_get_mining_3(){
	return {
		id: 70,
		name: "Mining",
		level: 3,
		description: "Mining III reduces the time and energy it takes to mine, reduces wear on your preferred mining instrument, and rewards more imagination.",
		learned: "You take 16 tons and what do you get? Most would get a little bit older and deeper in debt, but not you. With Mining III, you're like some sort of automatic mining-majig, what with the way you now can cut through rock and put less wear on your pick.",
		point_cost: 86400,
		category_id: 11,
		requires_level: 0,
		quest_id: "mining_deplete_rocks_in_time_period",
		req_skills: ["mining_2"],
		req_achievements: ["emblem_skill_unlock_zille_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["mining_4"],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/mining_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/mining_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/mining_3_28144.png"
		},
	};
};
data_skills.mining_3 = this.skills_get_mining_3();


function skills_get_mining_4(){
	return {
		id: 71,
		name: "Mining",
		level: 4,
		description: "Mining IV further improves your efficiency, reducing the time and energy it takes to mine by even more, and doubling the imagination you get by mining.",
		learned: "Hearty congratulations! With Mining IV, now you can go through rock like a hot Pick through warm Butterfly Butter. No rock will find quarrel with your quarry, as each sweet swing will take less energy and net you double the imagination.",
		point_cost: 432000,
		category_id: 11,
		requires_level: 0,
		quest_id: "mining_break_fancy_pick",
		req_skills: ["mining_3"],
		req_achievements: [],
		req_quests: ["mining_deplete_rocks_in_time_period"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/mining_4_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/mining_4_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/mining_4_28144.png"
		},
	};
};
data_skills.mining_4 = this.skills_get_mining_4();


function skills_get_nudgery_1(){
	return {
		id: 131,
		name: "Nudgery",
		level: 1,
		description: "When the flow of your yard or street doesn't feel quite right, learn Nudgery. With Nudgery, cultivated items can be moved around to accommodate more stuff, or simply balance the ch'i.",
		learned: "",
		point_cost: 28800,
		category_id: 17,
		requires_level: 8,
		quest_id: "",
		req_skills: ["soil_appreciation_3","eyeballery_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
			"mab": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/nudgery_1_97203.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/nudgery_1_97203.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/nudgery_1_97203.png"
		},
	};
};
data_skills.nudgery_1 = this.skills_get_nudgery_1();


function skills_get_penmanship_1(){
	return {
		id: 82,
		name: "Penpersonship",
		level: 1,
		description: "The pen is mightier than the sword. This is good, because we don't have any swords. With Penpersonship, you can use a Quill and Paper to write down all your important thoughts and feelings.",
		learned: "Congratulations! Now that you've learned Penpersonship, you can write down all your thoughts, feelings, and bad poetry and share them with your friends, no matter how unwilling they might be to read them.",
		point_cost: 10800,
		category_id: 19,
		requires_level: 7,
		quest_id: "",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/penmanship_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/penmanship_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/penmanship_1_28144.png"
		},
	};
};
data_skills.penmanship_1 = this.skills_get_penmanship_1();


function skills_get_piety_1(){
	return {
		id: 110,
		name: "Piety",
		level: 1,
		description: "It pays to have friends in high places. Impress the Giants with your extraordinary Piety, and you'll have the tallest friends around. In addition to potentially helping you retrieve objects from hard-to-reach shelves, Piety inspires the Giants to grant you the singular ability to smite their enemies by Priming any shrine as a conduit to holy vengeance.",
		learned: "Congratulations! You're now moderately more pious than your peers, and well on your way to becoming a sultan of servility, lieutenant general of genuflection or other illustrious practitioner of the supplicatory arts. The Giants have taken a shine to you. Be sure not to let them down.",
		point_cost: 86400,
		category_id: 19,
		requires_level: 12,
		quest_id: "rook_hall_start",
		req_skills: ["meditativearts_3"],
		req_achievements: [],
		req_quests: ["rook_hall_start"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/piety_1_57098.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/piety_1_57098.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/piety_1_57098.png"
		},
	};
};
data_skills.piety_1 = this.skills_get_piety_1();


function skills_get_potionmaking_1(){
	return {
		id: 127,
		name: "Potionmaking",
		level: 1,
		description: "In conjunction with a Cauldron, Potionmaking I opens the door to a world of bubbling unctions, shimmering fumes and acrid aromas. With this introduction to beginners wizardry, a number of potions become boilable.",
		learned: "The cork of unknowing has been removed, and the power of potions poured directly into your brain. Now get yourself a Cauldron, and you can bottle fame, brew glory and even put a stopper in death… Well, not quite. You can, however, make potions and stuff.",
		point_cost: 43200,
		category_id: 6,
		requires_level: 0,
		quest_id: "potionmaking_make_potions",
		req_skills: ["tincturing_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["potionmaking_2"],
		giants: {
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/potionmaking_1_73379.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/potionmaking_1_73379.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/potionmaking_1_73379.png"
		},
	};
};
data_skills.potionmaking_1 = this.skills_get_potionmaking_1();


function skills_get_potionmaking_2(){
	return {
		id: 128,
		name: "Potionmaking",
		level: 2,
		description: "Far above the level of basic potions, more advanced potions exist. And the more complex the potion, the more startling the effect. And what is the secret ingredient in making these advanced potions? Yes: Potion-making II. Which is more a 'skill' than an ingredient, but the point remains the same, metaphorically speaking.",
		learned: "It may be the smell of acrid potion smoke that clings to your clothes, or the thick potion residue that drips from your hair after a particularly heavy session over a hot Cauldron, but crowds sometimes now part as you walk through a room. You like to think it is because they are in awe of you. Yes, that's it. It's the awe. Not that other stuff.",
		point_cost: 172800,
		category_id: 6,
		requires_level: 0,
		quest_id: "potionmaking_make_different_potions_in_a_time_period",
		req_skills: ["potionmaking_1"],
		req_achievements: [],
		req_quests: ["potionmaking_make_potions"],
		req_upgrades: [],
		post_skills: ["potionmaking_3"],
		giants: {
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/potionmaking_2_73379.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/potionmaking_2_73379.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/potionmaking_2_73379.png"
		},
	};
};
data_skills.potionmaking_2 = this.skills_get_potionmaking_2();


function skills_get_potionmaking_3(){
	return {
		id: 129,
		name: "Potionmaking",
		level: 3,
		description: "The venerable art of Potionmaking III, once lost to the mists of time, has been found to contain knowledge of a particularly potent set of potions: those that give Garden Masters sole dominion over speedy gardening,  and one potent enough to please the giants by the power of drinking it alone.",
		learned: "Congratumultiultralations. With Potion Making III, you have gained access to the five most powerful potions known to gardening, and a potion which, when drunk, releases an odour so pleasant that it causes the giants imaginations to tingle simultaneously and release a small shower of favor upon the drinker. Which is a lot less messy than it sounds.",
		point_cost: 259200,
		category_id: 6,
		requires_level: 0,
		quest_id: "",
		req_skills: ["potionmaking_2"],
		req_achievements: [],
		req_quests: ["potionmaking_make_different_potions_in_a_time_period"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/potionmaking_3_73379.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/potionmaking_3_73379.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/potionmaking_3_73379.png"
		},
	};
};
data_skills.potionmaking_3 = this.skills_get_potionmaking_3();


function skills_get_refining_1(){
	return {
		id: 54,
		name: "Refining",
		level: 1,
		description: "Refining is the logical next step after mining: take all those chunks of ore and grind them all the way down to elementary particles. Those elements will come in handy. (You'll need a Grinder.)",
		learned: "Hey there, Refiner 49er. So you've committed to the dusty yet gratifying field of Refining, have you? First step: get yourself a Grinder and start, you know, grinding some ore.",
		point_cost: 7200,
		category_id: 11,
		requires_level: 0,
		quest_id: "refining_grind_ore_to_elements",
		req_skills: ["elementhandling_1","mining_1"],
		req_achievements: [],
		req_quests: ["elementhandling_buy_elemental_pouch"],
		req_upgrades: [],
		post_skills: ["refining_2","smelting_1"],
		giants: {
			"alph": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/refining_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/refining_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/refining_1_28144.png"
		},
	};
};
data_skills.refining_1 = this.skills_get_refining_1();


function skills_get_refining_2(){
	return {
		id: 65,
		name: "Refining",
		level: 2,
		description: "Upgrade your own self with Refining II and you immediately notice a 25% reduction in the amount of energy and a decrease in time it takes to grind down a chunk. Not bad at all.",
		learned: "Well, indeedy. You've done gone and learned Refining II. With it, you are now a virtual sensei of the refining arts, reducing ore to its component elements in the blink of a Chicken's eye.",
		point_cost: 57600,
		category_id: 11,
		requires_level: 0,
		quest_id: "refining_refine_ore_in_time_period",
		req_skills: ["refining_1"],
		req_achievements: [],
		req_quests: ["refining_grind_ore_to_elements"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/refining_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/refining_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/refining_2_28144.png"
		},
	};
};
data_skills.refining_2 = this.skills_get_refining_2();


function skills_get_remoteherdkeeping_1(){
	return {
		id: 22,
		name: "Remote Herdkeeping",
		level: 0,
		description: "Have a lot of animals at home but on the road a lot? Frustrated by all that uncollected meat, milk and so forth? Well, learn Remote Herdkeeping, get yourself a Meat Collector and a fully automated Butterfly Milker and you'll thank yourself: suddenly it's just a matter of stopping by your backyard from time to time to collect the bounty!",
		learned: "Well done! You've mastered Remote Herdkeeping, the preferred herdkeeping method of lazy farmers everywhere. Get yourself a Meat Collector and a Butterfly Milker from the Tool Vendor, set them up with your livestock in your yard, and let the bounty-hoarding commence.",
		point_cost: 57600,
		category_id: 14,
		requires_level: 0,
		quest_id: "remoteherdkeeping_fill_up_meat_collector_and_milker",
		req_skills: ["herdkeeping_1","animalkinship_6"],
		req_achievements: [],
		req_quests: ["herdkeeping_capture_piggies"],
		req_upgrades: [],
		post_skills: ["animalkinship_7"],
		giants: {
			"humbaba": {
				primary: 1
			},
			"pot": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/remoteherdkeeping_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/remoteherdkeeping_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/remoteherdkeeping_1_28144.png"
		},
	};
};
data_skills.remoteherdkeeping_1 = this.skills_get_remoteherdkeeping_1();


function skills_get_saucery_1(){
	return {
		id: 39,
		name: "Saucery",
		level: 1,
		description: "The most astute gourmands all know the secret to the best-prepared dishes is always in the sauce. Learn Saucery, obtain a Saucepan and you find you already know how to make several things – and even more recipes ideas will come to you as you use it. Plus, Saucery is a requirement if you ever want to become a Master Chef.",
		learned: "Well played, young saucier. With Saucery I, you have leapt upon a log on the river of sauce-learning. Trusty Saucepan in hand, you will discover exciting new recipes that will make tastebuds everywhere toss their underpants at you. Figuratively speaking.",
		point_cost: 7200,
		category_id: 8,
		requires_level: 0,
		quest_id: "saucery_make_level1_recipes",
		req_skills: ["cheffery_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["masterchef_1","saucery_2"],
		giants: {
			"grendaline": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/saucery_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/saucery_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/saucery_1_28144.png"
		},
	};
};
data_skills.saucery_1 = this.skills_get_saucery_1();


function skills_get_saucery_2(){
	return {
		id: 68,
		name: "Saucery",
		level: 2,
		description: "Upgrading to Saucery II will unlock several new recipes for your trusty Saucepan whilst making your use of the tool more efficient at the very same time.",
		learned: "You did it: Saucery II. Like some sort of crazy culinary rocket, you grow faster while your skills grow nummier. Remember: The more recipes you try with your Saucepan, the more imagination you gain. And with this imagination comes even more recipes. It's an endless cycle. An endless tasty cycle.",
		point_cost: 14400,
		category_id: 8,
		requires_level: 0,
		quest_id: "saucery_make_level2_recipes",
		req_skills: ["saucery_1"],
		req_achievements: ["rolling_boiler"],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"grendaline": {
				primary: 0
			},
			"pot": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/saucery_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/saucery_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/saucery_2_28144.png"
		},
	};
};
data_skills.saucery_2 = this.skills_get_saucery_2();


function skills_get_smelting_1(){
	return {
		id: 80,
		name: "Smelting",
		level: 0,
		description: "With Smelting, you can use an industrial-strength Smelter to extract Plain Metal from the Chunks of Metal Rocks. This is much preferable to using your bare hands.",
		learned: "Well done, apprentice Smelterer. With this skill, you can use a Smelter to extract Plain Metal from the Chunks of Metal Rocks. It also lets you say \"smelter\" a lot, which is a surprisingly pleasing thing to do.",
		point_cost: 14400,
		category_id: 11,
		requires_level: 2,
		quest_id: "smelting_smelt_metal_rock_to_plain_metal",
		req_skills: ["refining_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["alchemy_2"],
		giants: {
			"alph": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
			"zille": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/smelting_1_29740.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/smelting_1_29740.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/smelting_1_29740.png"
		},
	};
};
data_skills.smelting_1 = this.skills_get_smelting_1();


function skills_get_soil_appreciation_1(){
	return {
		id: 1,
		name: "Soil Appreciation",
		level: 1,
		description: "Sure you CAN tend or dig a Patch or dig a Dirt Pile without the Soil Appreciation skill, but when simply learning this skill will mean you'll tend faster, dig deeper and sometimes get Loam instead of Earth, why would you do that? You wouldn't! You ain't no fool.",
		learned: "Bravo, little doozer! With the Soil Appreciation feather in your dandy cap, you'll notice how the dirt seems to sigh a little deeper when it feels the sweet caress of your Hoe. What hoe, you ask? Your hoe. The hoe you stow. So hoe! Hoe! HOE! What ho, indeed.",
		point_cost: 600,
		category_id: 17,
		requires_level: 2,
		quest_id: "soilappreciation_dig_earth",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["soil_appreciation_2"],
		giants: {
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/soil_appreciation_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/soil_appreciation_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/soil_appreciation_1_28144.png"
		},
	};
};
data_skills.soil_appreciation_1 = this.skills_get_soil_appreciation_1();


function skills_get_soil_appreciation_2(){
	return {
		id: 2,
		name: "Soil Appreciation",
		level: 2,
		description: "With Soil Appreciation II, tending a Patch takes half as much time AND gives more imagination, plus more chance of extracting Loam from delicious Dirt Piles. What's more: this skill is also a must-have for several other handy skills. Go soil!",
		learned: "Look at you, level 2 Soil Appreciator! Look at you: tending Patches twice as fast, shoveling out the good stuff from Dirt Piles more frequently than before; your Shovel and your Hoe are your best friends now. I know that seems weird, but it's true.",
		point_cost: 2400,
		category_id: 17,
		requires_level: 0,
		quest_id: "soilappreciation_help_digging",
		req_skills: ["soil_appreciation_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["soil_appreciation_3","gardening_1","croppery_1","herdkeeping_1","jellisac_hands_1"],
		giants: {
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/soil_appreciation_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/soil_appreciation_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/soil_appreciation_2_28144.png"
		},
	};
};
data_skills.soil_appreciation_2 = this.skills_get_soil_appreciation_2();


function skills_get_soil_appreciation_3(){
	return {
		id: 3,
		name: "Soil Appreciation",
		level: 3,
		description: "Soil Appreciation III gives you a mood boost when tending, wears the Hoe only half as much with each use, possible bonus items each time you tend a Patch, and even more chance of getting Loam from a Patch or a Dirt Pile.",
		learned: "Good. With Soil Appreciation III, you can now look forward to the tending of Patches as opportunities for little mood boosts. Wicked, no? It should also be mentioned that your Hoe will last longer AND you've increased your chances of coming across bonuses and Loam more often. So go nuts! Soil yourself silly.",
		point_cost: 7200,
		category_id: 17,
		requires_level: 0,
		quest_id: "soilappreciation_collect_loam",
		req_skills: ["soil_appreciation_2"],
		req_achievements: [],
		req_quests: ["soilappreciation_dig_earth"],
		req_upgrades: [],
		post_skills: ["soil_appreciation_4","bogspecialization_1","herbalism_1","nudgery_1"],
		giants: {
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/soil_appreciation_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/soil_appreciation_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/soil_appreciation_3_28144.png"
		},
	};
};
data_skills.soil_appreciation_3 = this.skills_get_soil_appreciation_3();


function skills_get_soil_appreciation_4(){
	return {
		id: 4,
		name: "Soil Appreciation",
		level: 4,
		description: "The fourth level of Soil Appreciation further reduces the time needed to do all manner of soily things, while doubling the iMG bonus you get. It is also the prerequisite for other valuable skills. Basically: a whole fourth level of soil-scented awesome.",
		learned: "Soil Appreciation IV, already?! So soon? Well, now you are experienced in the soilationary appreciation arts, you'll get more than double the rewards for even less effort. How great is that? Very. Very great. Man, I love the smell of soil in the morning.",
		point_cost: 28800,
		category_id: 17,
		requires_level: 0,
		quest_id: "soilappreciation_plant_beans_in_hubs",
		req_skills: ["soil_appreciation_3"],
		req_achievements: ["emblem_skill_unlock_mab_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["soil_appreciation_5"],
		giants: {
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/soil_appreciation_4_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/soil_appreciation_4_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/soil_appreciation_4_28144.png"
		},
	};
};
data_skills.soil_appreciation_4 = this.skills_get_soil_appreciation_4();


function skills_get_soil_appreciation_5(){
	return {
		id: 5,
		name: "Soil Appreciation",
		level: 5,
		description: "With Soil Appreciation V you become about as good as anyone could ever expect to be at tending Patches, and digging dirt. Indeed, you have a significantly better chance of many more bonus items, Earth and Loam when you tend, and tending requires almost no energy at all.",
		learned: "Right now you probably couldn't get any better at tending and digging if you had a magical better-o-tend-n-diggy ring, which doesn't actually exist by the way, so don't go getting any ideas. Just be happy with the fact that you reap very big profits for very little energy. Soilpower!",
		point_cost: 72000,
		category_id: 17,
		requires_level: 0,
		quest_id: "soilappreciation_get_all_back_yard_trees_to_level10",
		req_skills: ["soil_appreciation_4"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"mab": {
				primary: 1
			},
			"spriggan": {
				primary: 0
			},
			"zille": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/soil_appreciation_5_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/soil_appreciation_5_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/soil_appreciation_5_28144.png"
		},
	};
};
data_skills.soil_appreciation_5 = this.skills_get_soil_appreciation_5();


function skills_get_spicemilling_1(){
	return {
		id: 19,
		name: "Spice Milling",
		level: 0,
		description: "The great thing about spices is their variety. The sucky thing about not having the Spice Milling skill is that you can sometimes fail when using your Spice Mill, plus it takes a long time and uses a lot of energy. Once you learn this, prepare for success every time you mill and faster, cheaper milling experience.",
		learned: "If there were some sort of award for Spice Milling, you might now be worthy to polish the winner's Spice Mill. And who knows where this could lead? Get yourself a mill and get practicing. At the very least you'll use less energy, and crank out more spice! ",
		point_cost: 1800,
		category_id: 16,
		requires_level: 3,
		quest_id: "spicemilling_transform_spices",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"pot": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/spicemilling_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/spicemilling_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/spicemilling_1_28144.png"
		},
	};
};
data_skills.spicemilling_1 = this.skills_get_spicemilling_1();


function skills_get_teleportation_1(){
	return {
		id: 77,
		name: "Teleportation",
		level: 1,
		description: "With the first Teleportation skill, you will be able to set a landing point (almost) anywhere in the world and then teleport back to it from (almost) anywhere else. Warning: teleporting is pretty draining, energy wise.",
		learned: "So, it's Teleporting you want to do, hm? The first step is figuring out where you want to go to. Go there. Establish your landing point. Then go back to your first location. Then teleport back to your landing point. What? Nobody said this was going to be easy.",
		point_cost: 7200,
		category_id: 19,
		requires_level: 0,
		quest_id: "teleportation_teleport_to_region",
		req_skills: ["meditativearts_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["teleportation_2"],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/teleportation_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/teleportation_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/teleportation_1_28144.png"
		},
	};
};
data_skills.teleportation_1 = this.skills_get_teleportation_1();


function skills_get_teleportation_2(){
	return {
		id: 95,
		name: "Teleportation",
		level: 2,
		description: "One teleportation point is miraculous enough, but two is where the magic really begins. With Teleportation II the budding teleportologist can pick two places to beam down, and reduce the energy it takes to do so.",
		learned: "Congratulations! Now you can beam from point A to point B… and (after five minutes cooldown) back again, if you want. Or even from A to B to C, then walk back! The possibilities are endless. Or at least, 'two'. But 'the possibilities are two' doesn't sound as good.",
		point_cost: 21600,
		category_id: 19,
		requires_level: 0,
		quest_id: "teleportation_teleport_in_time_period",
		req_skills: ["teleportation_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["teleportation_3"],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/teleportation_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/teleportation_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/teleportation_2_28144.png"
		},
	};
};
data_skills.teleportation_2 = this.skills_get_teleportation_2();


function skills_get_teleportation_3(){
	return {
		id: 96,
		name: "Teleportation",
		level: 3,
		description: "For the dedicated teleportologist, Teleportation III not only bestows the ability to save three separate teleportation points, but reduces the energy it takes to use them.",
		learned: "If two teleportation points are company, then three are... a corporation? Yes. a multi-hubbinal corporation of dematerialising goodness. And you are the high-flying CEO.",
		point_cost: 43200,
		category_id: 19,
		requires_level: 0,
		quest_id: "teleportation_teleport_with_followers",
		req_skills: ["teleportation_2"],
		req_achievements: ["emblem_skill_unlock_lem_1"],
		req_quests: ["teleportation_teleport_to_region"],
		req_upgrades: [],
		post_skills: ["teleportation_4"],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/teleportation_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/teleportation_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/teleportation_3_28144.png"
		},
	};
};
data_skills.teleportation_3 = this.skills_get_teleportation_3();


function skills_get_teleportation_4(){
	return {
		id: 97,
		name: "Teleportation",
		level: 4,
		description: "If knowing you can only teleport to fixed points ails you, Teleportation IV may be the cure. The ability to choose teleport locations from the map can be yours too, as well as the ability to write teleportation scripts for other people (if you're handy enough with your Penpersonship skill) and an even further reduced cost to teleport.",
		learned: "They don't call you Dr Spaceman for nothing: your potential to write scripts for other people to teleport on makes you the envy of the Meadow, as well as your effortless teleporting by map alone. And all this for less energy and a shorter cooldown? Woah.",
		point_cost: 172800,
		category_id: 19,
		requires_level: 0,
		quest_id: "teleportation_rescue_pig",
		req_skills: ["teleportation_3"],
		req_achievements: [],
		req_quests: ["teleportation_teleport_in_time_period"],
		req_upgrades: [],
		post_skills: ["teleportation_5"],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/teleportation_4_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/teleportation_4_49176.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/teleportation_4_28144.png"
		},
	};
};
data_skills.teleportation_4 = this.skills_get_teleportation_4();


function skills_get_teleportation_5(){
	return {
		id: 98,
		name: "Teleportation",
		level: 5,
		description: "Why move to Monty, when you can make Monty move to you? With Teleportation V, you can summon another player (say, your friend Monty) twice a day, or more with teleportation tokens. With more map teleports, shorter cooldown and even less energy expended, there'll be no stopping you.",
		learned: "They seek you here, they seek you there, but with your powers of teleportation, you could be frankly anywhere. Congratulations, you have reached the top of the teleportation tre... wait... where did you go? Oh, you Master Teleportologists are all the same.",
		point_cost: 345600,
		category_id: 19,
		requires_level: 0,
		quest_id: "teleportation_make_and_hand_out_tp_scripts",
		req_skills: ["teleportation_4"],
		req_achievements: [],
		req_quests: ["teleportation_rescue_pig"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"cosma": {
				primary: 0
			},
			"lem": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/teleportation_5_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/teleportation_5_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/teleportation_5_28144.png"
		},
	};
};
data_skills.teleportation_5 = this.skills_get_teleportation_5();


function skills_get_tincturing_1(){
	return {
		id: 132,
		name: "Tincturing",
		level: 0,
		description: "Tincturing: the ancient art of combining natural materials of herbs and Hooch to create tinctures: pastes containing extraordinary effects and providing the base for powerful potions. The perfect skill for the dormant apothecarist within. ",
		learned: "Be jubilant: the ancient art of Tincturing is now yours to enjoy. You'll need herbs, and jars of hooch to make the most of your new skill - but once you do? The world is your oyster (if oysters were full of Tinctures).",
		point_cost: 28800,
		category_id: 6,
		requires_level: 0,
		quest_id: "tincturing_make_tinctures",
		req_skills: ["herbalism_1","distilling_1"],
		req_achievements: [],
		req_quests: ["herbalism_harvest_shuck_and_plant_herbs"],
		req_upgrades: [],
		post_skills: ["potionmaking_1"],
		giants: {
			"friendly": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"ti": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/tincturing_1_73379.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/tincturing_1_73379.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/tincturing_1_73379.png"
		},
	};
};
data_skills.tincturing_1 = this.skills_get_tincturing_1();


function skills_get_tinkering_1(){
	return {
		id: 72,
		name: "Tinkering",
		level: 1,
		description: "The first level of Tinkering allows the repair of any broken or worn down tool, but, you know, you're not going to be especially fast at it right off the bat! Note: requires a Tinkertool.",
		learned: "With Tinkering, no longer will you be slowed down by shoddy workmanship and the pernicious breakiness of Hoes, Watering Cans, Picks and suchlike. Your first task: getting a Tinkertool. ",
		point_cost: 1800,
		category_id: 11,
		requires_level: 3,
		quest_id: "tinkering_repair_for_time_period",
		req_skills: [],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["tinkering_2"],
		giants: {
			"alph": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/tinkering_1_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/tinkering_1_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/tinkering_1_28144.png"
		},
	};
};
data_skills.tinkering_1 = this.skills_get_tinkering_1();


function skills_get_tinkering_2(){
	return {
		id: 73,
		name: "Tinkering",
		level: 2,
		description: "Upgrade to Tinkering II and double the speed at which you repair tools and simultaneously reduce the amount of energy required to operate the Tinkertool!",
		learned: "Yes! With Tinkering II, tool repairing just got easier. Not a lot easier, mind you. Baby steps, little Glitch. Baby steps.",
		point_cost: 7200,
		category_id: 11,
		requires_level: 0,
		quest_id: "tinkering_repair_tools",
		req_skills: ["tinkering_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["tinkering_3","furnituremaking_1"],
		giants: {
			"alph": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/tinkering_2_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/tinkering_2_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/tinkering_2_28144.png"
		},
	};
};
data_skills.tinkering_2 = this.skills_get_tinkering_2();


function skills_get_tinkering_3(){
	return {
		id: 74,
		name: "Tinkering",
		level: 3,
		description: "With Tinkering III, the speed of tool repair doubles yet again. Getting speedy! But also, you can use a Tinkertool to repair itself. Talk about snakes swallowing tails ...",
		learned: "Excellent. Tinkering III doesn't just make your tinkerizing faster and easier. Now you can also repair your broken Tinkertool with... your broken Tinkertool? Don't ask questions.",
		point_cost: 28800,
		category_id: 11,
		requires_level: 0,
		quest_id: "tinkering_repair_tinkertool",
		req_skills: ["tinkering_2"],
		req_achievements: [],
		req_quests: ["tinkering_repair_for_time_period"],
		req_upgrades: [],
		post_skills: ["tinkering_4","engineering_1"],
		giants: {
			"alph": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/tinkering_3_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/tinkering_3_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/tinkering_3_28144.png"
		},
	};
};
data_skills.tinkering_3 = this.skills_get_tinkering_3();


function skills_get_tinkering_4(){
	return {
		id: 75,
		name: "Tinkering",
		level: 4,
		description: "Just when you thought Tinkering couldn't get much better, along comes Tinkering IV. In addition to doubling your repair speed, a slew of new tools are yours to craft. And when combined with skill of Engineering, that slew expands to a truckload. Powerful stuff.",
		learned: "Just when Tinkering seemed like it had reached its pinnacle, along came Tinkering IV. Not the highest peak of Tinkering, but close: build a tiny mountain from all the tools you can now craft with Tinkering IV, and from the top you'll clearly see the glory of Tinkering V up ahead.",
		point_cost: 86400,
		category_id: 11,
		requires_level: 0,
		quest_id: "tinkering_craft_simple_tools",
		req_skills: ["tinkering_3"],
		req_achievements: ["emblem_skill_unlock_alph_1"],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["tinkering_5"],
		giants: {
			"alph": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/tinkering_4_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/tinkering_4_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/tinkering_4_28144.png"
		},
	};
};
data_skills.tinkering_4 = this.skills_get_tinkering_4();


function skills_get_tinkering_5(){
	return {
		id: 76,
		name: "Tinkering",
		level: 5,
		description: "Learn Tinkering V, and consider yourself a mastertink. Repair speed is nigh instantaneous and Tinkertool operation barely taxes your energy, but that's just the beginning. With this AND Engineering, you can practically create any tool imaginable. As long as your imagination is restricted to tools that already exist, of course.",
		learned: "Remember how draining tinkering used to be? With Tinkering V, it's practically refreshing! You know what? You should go fix some other players' tools. Maybe make them some fancy tools, too? That would be a nice thing to do, wouldn't it? Yes. Yes it would.",
		point_cost: 259200,
		category_id: 11,
		requires_level: 0,
		quest_id: "tinkering_craft_medium_tools",
		req_skills: ["tinkering_4"],
		req_achievements: [],
		req_quests: ["tinkering_repair_tinkertool"],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"ti": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/tinkering_5_28144.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/tinkering_5_28144.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/tinkering_5_28144.png"
		},
	};
};
data_skills.tinkering_5 = this.skills_get_tinkering_5();


function skills_get_transcendental_radiation_1(){
	return {
		id: 62,
		name: "Transcendental Radiation",
		level: 1,
		description: "The noblest among us act for the benefit of us. Or, it is good to do nice things for others? Whatever: if you learn Transcendental Radiation you will have mystical knowledge of a special form of Meditation which directs the benefits outwards, to those around you, rather than keeping them all to yourself.",
		learned: "Now that you've achieved Transcendental Radiation, you are an egoless particle of the universal no-soul. Why not share the non-wealth with others by using your Focusing Orb to radiate transcendence to other players? ",
		point_cost: 28800,
		category_id: 19,
		requires_level: 0,
		quest_id: "transcendentalradiation_radiate_to_five_people",
		req_skills: ["meditativearts_2"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: ["martial_imagination_1","transcendental_radiation_2"],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/transcendental_radiation_1_93673.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/transcendental_radiation_1_93673.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/transcendental_radiation_1_93673.png"
		},
	};
};
data_skills.transcendental_radiation_1 = this.skills_get_transcendental_radiation_1();


function skills_get_transcendental_radiation_2(){
	return {
		id: 137,
		name: "Transcendental Radiation",
		level: 2,
		description: "In the quest to understand our place in the universe, it is often possible to forget those around us. Transcendental Radiation II increases your ability to apply the arcane yet universal arts of Meditation, and spread uplifting vibrations to those near you. Your Radiation will last longer, be more beneficial to your radiatees, and give more iMG to you, the radiator. Cosmic.",
		learned: "Opening the door to Transcendental Radiation II brings you that much closer to the one shining nothingness that is all and none of us. Take a moment to spread good vibes by using your Focusing Orb to shower transcendence on your fellow players.",
		point_cost: 57600,
		category_id: 19,
		requires_level: 15,
		quest_id: "",
		req_skills: ["transcendental_radiation_1"],
		req_achievements: [],
		req_quests: ["transcendentalradiation_radiate_to_five_people"],
		req_upgrades: [],
		post_skills: ["transcendental_radiation_3"],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/transcendental_radiation_2_93673.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/transcendental_radiation_2_93673.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/transcendental_radiation_2_93673.png"
		},
	};
};
data_skills.transcendental_radiation_2 = this.skills_get_transcendental_radiation_2();


function skills_get_transcendental_radiation_3(){
	return {
		id: 139,
		name: "Transcendental Radiation",
		level: 3,
		description: "Not only as close as one can get to being one with everything, Transcendental Radiation III maximizes everyone else's oneness with you. Radiation has the potential to last longer than ever before, provide the most mental benefit to your radiatees, and, in turn, reflect most iMG back on on the meditator. Out of this world.",
		learned: "To expand your mind to Transcendental Radiation III is to be as close as you can get to the oneness without breaking into a million billion particles and disappearing completely into the bark of the nearest eggplant. The universe (and Cosma) has bestowed Transcendental Radiation upon you. Go forth and spread energy like warm butter.",
		point_cost: 129600,
		category_id: 19,
		requires_level: 21,
		quest_id: "",
		req_skills: ["transcendental_radiation_2"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: ["transcendental_radius_2"],
		post_skills: [],
		giants: {
			"cosma": {
				primary: 1
			},
			"friendly": {
				primary: 0
			},
			"lem": {
				primary: 0
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/transcendental_radiation_3_118176.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/transcendental_radiation_3_118176.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/transcendental_radiation_3_118176.png"
		},
	};
};
data_skills.transcendental_radiation_3 = this.skills_get_transcendental_radiation_3();


function skills_get_woodworking_1(){
	return {
		id: 118,
		name: "Woodworking",
		level: 0,
		description: "The skill of woodworking wood would enable one wielding a Woodworker to work wood into wondrous forms, turning the humble plank into useful things, like Boards, Posts and Beams. The possibilities are limitless, begging only the question: How much wood would a woodworker work if a woodworker could work wood?",
		learned: "Look around you: wood is everywhere - raw, trembling wood, vulnerable in its naked form, waiting for your now confident hands to work it into something special. Like a Beam. Or a Pole. Or… well, why not assemble a Woodworker and find out?",
		point_cost: 86400,
		category_id: 11,
		requires_level: 5,
		quest_id: "",
		req_skills: ["engineering_1"],
		req_achievements: [],
		req_quests: [],
		req_upgrades: [],
		post_skills: [],
		giants: {
			"alph": {
				primary: 0
			},
			"mab": {
				primary: 0
			},
			"spriggan": {
				primary: 1
			},
		},
		icons: {
			icon_44: "http:\/\/c1.glitch.bz\/img\/skills\/woodworking_1_87006.png",
			icon_100: "http:\/\/c1.glitch.bz\/img\/skills-100\/woodworking_1_86563.png",
			icon_460: "http:\/\/c1.glitch.bz\/img\/skills-460\/woodworking_1_86563.png"
		},
	};
};
data_skills.woodworking_1 = this.skills_get_woodworking_1();


function skills_get_quest_map(){
	return {
		"soil_appreciation_1"		: "soilappreciation_dig_earth",
		"soil_appreciation_2"		: "soilappreciation_help_digging",
		"soil_appreciation_3"		: "soilappreciation_collect_loam",
		"soil_appreciation_4"		: "soilappreciation_plant_beans_in_hubs",
		"soil_appreciation_5"		: "soilappreciation_get_all_back_yard_trees_to_level10",
		"light_green_thumb_1"		: "lightgreenthumb_water_trees",
		"light_green_thumb_2"		: "lightgreenthumb_get_tree_to_level10",
		"light_green_thumb_3"		: "lightgreenthumb_break_watering_can",
		"gardening_1"			: "gardening_harvest_trees",
		"gardening_2"			: "gardening_harvest_all_trees_in_time_period",
		"gardening_3"			: "gardening_harvest_last_egg_plant",
		"gardening_4"			: "gardening_plant_beans_make_sure_become_trees",
		"gardening_5"			: "gardening_max_harvest_from_all_trees",
		"croppery_1"			: "croppery_plant_and_harvest",
		"botany_1"			: "botany_make_tree_beans",
		"intermediateadmixing_1"	: "intermediateadmixing_make_powder",
		"fruitchanging_1"		: "fruitchanging_transform_fruit",
		"bubbletuning_1"		: "bubbletuning_transform_bubbles",
		"spicemilling_1"		: "spicemilling_transform_spices",
		"gasmogrification_1"		: "gasmogrification_transform_gasses",
		"herdkeeping_1"			: "herdkeeping_capture_piggies",
		"remoteherdkeeping_1"		: "remoteherdkeeping_fill_up_meat_collector_and_milker",
		"animalkinship_1"		: "animalkinship_pet_piggies",
		"animalkinship_2"		: "animalkinship_massage_butterflies",
		"animalkinship_3"		: "animalkinship_nibble_meat",
		"animalkinship_4"		: "animalkinship_milk_butterflies",
		"animalkinship_5"		: "animalkinship_name_animals",
		"animalkinship_6"		: "animalkinship_squeeze_chicken_for_drop",
		"animalkinship_7"		: "animalkinship_max_nibble_milk_squeeze",
		"animalhusbandry_1"		: "animalhusbandry_make_three_eggs",
		"croppery_2"			: "croppery_harvest_and_sell_at_auction",
		"croppery_3"			: "croppery_harvest_all_crops",
		"ezcooking_1"			: "ezcooking_make_level1_recipes",
		"cheffery_1"			: "cheffery_make_level1_recipes",
		"cheffery_2"			: "cheffery_make_level2_recipes",
		"saucery_1"			: "saucery_make_level1_recipes",
		"grilling_1"			: "grilling_make_level1_recipes",
		"grilling_2"			: "grilling_make_level2_recipes",
		"blending_1"			: "blending_make_level1_recipes",
		"cocktailcrafting_1"		: "cocktailcrafting_make_level1_recipes",
		"cocktailcrafting_2"		: "cocktailcrafting_make_level2_recipes",
		"masterchef_1"			: "masterchef_make_level1_recipes",
		"elementhandling_1"		: "elementhandling_buy_elemental_pouch",
		"alchemy_1"			: "alchemy_make_compounds",
		"mining_1"			: "mining_mine_rocks",
		"mining_2"			: "mining_mine_in_time_period",
		"refining_1"			: "refining_grind_ore_to_elements",
		"meditativearts_1"		: "meditativearts_meditate_for_time_period",
		"betterlearning_1"		: "betterlearning_get_favor_at_shrines",
		"betterlearning_3"		: "betterlearning_spend_favor_with_primary_giant",
		"betterlearning_5"		: "betterlearning_spend_huge_favor",
		"focused_meditation_1"		: "focusedmeditation_get_mood_or_energy",
		"transcendental_radiation_1"	: "transcendentalradiation_radiate_to_five_people",
		"meditativearts_2"		: "meditativearts_maintain_energy_in_wintry_place",
		"meditativearts_3"		: "meditativearts_get_max_relax",
		"refining_2"			: "refining_refine_ore_in_time_period",
		"ezcooking_2"			: "ezcooking_make_level2_recipes",
		"blending_2"			: "blending_make_level2_recipes",
		"saucery_2"			: "saucery_make_level2_recipes",
		"cheffery_3"			: "cheffery_make_level3_recipes",
		"mining_3"			: "mining_deplete_rocks_in_time_period",
		"mining_4"			: "mining_break_fancy_pick",
		"tinkering_1"			: "tinkering_repair_for_time_period",
		"tinkering_2"			: "tinkering_repair_tools",
		"tinkering_3"			: "tinkering_repair_tinkertool",
		"tinkering_4"			: "tinkering_craft_simple_tools",
		"tinkering_5"			: "tinkering_craft_medium_tools",
		"teleportation_1"		: "teleportation_teleport_to_region",
		"smelting_1"			: "smelting_smelt_metal_rock_to_plain_metal",
		"alchemy_2"			: "alchemy_make_metal_ingots",
		"bogspecialization_1"		: "bogspecialization_harvest_full_peat_bog_in_time_period",
		"jellisac_hands_1"		: "jellisachands_donate_jellisacs",
		"fuelmaking_1"			: "fuelmaking_refuel_robot",
		"blockmaking_1"			: "block_party",
		"teleportation_2"		: "teleportation_teleport_in_time_period",
		"teleportation_3"		: "teleportation_teleport_with_followers",
		"teleportation_4"		: "teleportation_rescue_pig",
		"teleportation_5"		: "teleportation_make_and_hand_out_tp_scripts",
		"herbalism_1"			: "herbalism_harvest_shuck_and_plant_herbs",
		"herbalism_2"			: "herbalism_get_super_harvest",
		"piety_1"			: "rook_hall_start",
		"martial_imagination_1"		: "rook_hall_start",
		"eyeballery_1"			: "eyeballery_identify_object",
		"distilling_1"			: "distilling_make_and_distribute_hooch",
		"potionmaking_1"		: "potionmaking_make_potions",
		"potionmaking_2"		: "potionmaking_make_different_potions_in_a_time_period",
		"tincturing_1"			: "tincturing_make_tinctures",
		"herbalism_3"			: "herbalism_plant_seeds_in_someones_garden"
	};
}
