var recipes = {};

function set_catalog_recipes_1(){
	this.recipes["1"] = {
		name : "Simple Slaw",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 18
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cabbage", 1],
			["corn", 1],
			["bean_plain", 5],
		],
		outputs : [
			["simple_slaw", 1],
		],
	};

	this.recipes["2"] = {
		name : "Divine Crepes",
		skill : null,
		skills : [],
		achievements : ["grease_monkey"],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 25, // 1/6 of input cost, 148
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["swing_batter", 1],
			["desssert_rub", 1],
			["cloudberry_jam", 1],
		],
		outputs : [
			["divine_crepes", 1],
		],
	};

	this.recipes["3"] = {
		name : "Fried Rice",
		skill : null,
		skills : [],
		achievements : ["saute_savant"],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 13, // 1/6 of input cost, 75
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["proper_rice", 1],
			["meat", 1],
			["death_to_veg", 1],
		],
		outputs : [
			["fried_rice", 1],
		],
	};

	this.recipes["4"] = {
		name : "Hearty Omelet",
		skill : null,
		skills : [],
		achievements : ["sizzler_supreme"],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 13, // 1/6 of input cost, 79
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 2],
			["cheese", 1],
			["mushroom", 2],
			["hot_n_fizzy_sauce", 1],
		],
		outputs : [
			["hearty_omelet", 1],
		],
	};

	this.recipes["5"] = {
		name : "Hash",
		skill : null,
		skills : [],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // 1/6 of input cost, 36
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["potato", 2],
			["corn", 2],
		],
		outputs : [
			["hash", 1],
		],
	};

	this.recipes["6"] = {
		name : "Spicy Quesadilla",
		skill : "cheffery_2",
		skills : ["cheffery_2"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 9, // 1/6 of input cost, 52
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["cheese", 1],
			["mustard", 1],
			["hot_pepper", 1],
			["tortilla", 1],
		],
		outputs : [
			["spicy_quesadilla", 1],
		],
	};

	this.recipes["7"] = {
		name : "Juicy Carpaccio",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // 1/6 of input cost, 46
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 2],
			["spinach", 2],
			["kings_of_condiments", 1],
		],
		outputs : [
			["juicy_carpaccio", 1],
		],
	};

	this.recipes["8"] = {
		name : "Hearty Groddle Sammich",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 11, // 1/6 of input cost, 67
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bun", 1],
			["meat", 1],
			["hot_n_fizzy_sauce", 1],
		],
		outputs : [
			["hearty_groddle_sammich", 1],
		],
	};

	this.recipes["9"] = {
		name : "Choice Crudites",
		skill : null,
		skills : [],
		achievements : ["silver_cleaver_award"],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // 1/6 of input cost, 28
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["tomato", 1],
			["parsnip", 1],
			["zucchini", 1],
			["mushroom", 4],
		],
		outputs : [
			["choice_crudites", 1],
		],
	};

	this.recipes["10"] = {
		name : "Scrumptious Frittata",
		skill : "cheffery_2",
		skills : ["cheffery_2"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // 1/6 of input cost, 48
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 2],
			["cheese", 1],
			["spinach", 1],
			["kings_of_condiments", 1],
		],
		outputs : [
			["scrumptious_frittata", 1],
		],
	};

	this.recipes["11"] = {
		name : "Deluxe Sammich",
		skill : null,
		skills : [],
		achievements : ["nice_dicer"],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 9, // 1/6 of input cost, 55
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bun", 1],
			["meat", 1],
			["cheese", 1],
			["pickle", 1],
		],
		outputs : [
			["deluxe_sammich", 1],
		],
	};

	this.recipes["12"] = {
		name : "Sammich",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 19
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bun", 1],
			["meat", 1],
		],
		outputs : [
			["sammich", 1],
		],
	};

	this.recipes["13"] = {
		name : "Fruit Salad",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 19
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["apple", 1],
			["bunch_of_grapes", 1],
			["banana", 1],
		],
		outputs : [
			["fruit_salad", 1],
		],
	};

	this.recipes["14"] = {
		name : "Cheese Plate",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // manual override
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cheese", 3],
		],
		outputs : [
			["cheese_plate", 1],
		],
	};

	this.recipes["15"] = {
		name : "Common Crudites",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 22
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["broccoli", 1],
			["potato", 1],
			["carrot", 1],
			["cucumber", 1],
		],
		outputs : [
			["common_crudites", 1],
		],
	};

	this.recipes["16"] = {
		name : "Big Salad",
		skill : null,
		skills : [],
		achievements : ["master_whacker"],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // 1/6 of input cost, 38
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["tomato", 1],
			["mushroom", 5],
			["oily_dressing", 1],
			["spinach", 5],
		],
		outputs : [
			["big_salad", 1],
		],
	};

	this.recipes["17"] = {
		name : "Fried Eggs",
		skill : "cheffery_1",
		skills : ["cheffery_1"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 1, // 1/6 of input cost, 7
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["pinch_of_salt", 1],
			["egg_plain", 1],
		],
		outputs : [
			["fried_egg", 1],
		],
	};

	this.recipes["18"] = {
		name : "Basic Omelet",
		skill : "cheffery_1",
		skills : ["cheffery_1"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // 1/6 of input cost, 30
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 3],
			["cheese", 1],
		],
		outputs : [
			["basic_omelet", 1],
		],
	};

	this.recipes["19"] = {
		name : "Best Bean Dip",
		skill : null,
		skills : [],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // 1/6 of input cost, 33
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cheese", 1],
			["cumin", 1],
			["bean_plain", 10],
		],
		outputs : [
			["best_bean_dip", 1],
		],
	};

	this.recipes["20"] = {
		name : "Gamma's Pancakes",
		skill : null,
		skills : [],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // 1/6 of input cost, 35
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["birch_syrup", 1],
			["swing_batter", 1],
		],
		outputs : [
			["gammas_pancakes", 1],
		],
	};

	this.recipes["21"] = {
		name : "Grilled Cheese",
		skill : "grilling_1",
		skills : ["grilling_1"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // 1/6 of input cost, 48
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bun", 2],
			["cheese", 2],
		],
		outputs : [
			["grilled_cheese", 1],
		],
	};

	this.recipes["22"] = {
		name : "Proper Rice",
		skill : "masterchef_1",
		skills : ["masterchef_1"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // 1/6 of input cost, 14
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["rice", 3],
			["pinch_of_salt", 1],
		],
		outputs : [
			["proper_rice", 1],
		],
	};

	this.recipes["23"] = {
		name : "Simple BBQ",
		skill : "grilling_1",
		skills : ["grilling_1"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 14, // 1/6 of input cost, 83
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 2],
			["sweet_n_sour_sauce", 1],
		],
		outputs : [
			["simple_bbq", 1],
		],
	};

	this.recipes["24"] = {
		name : "Waffles",
		skill : "grilling_1",
		skills : ["grilling_1"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 19, // 1/6 of input cost, 113
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["honey", 1],
			["swing_batter", 1],
			["desssert_rub", 1],
		],
		outputs : [
			["waffles", 1],
		],
	};

	this.recipes["25"] = {
		name : "Pineapple Upside Down Pizza",
		skill : null,
		skills : [],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 11, // 1/6 of input cost, 68
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cheese", 2],
			["pineapple", 1],
			["swing_batter", 1],
		],
		outputs : [
			["papl_upside_down_pizza", 1],
		],
	};

	this.recipes["26"] = {
		name : "Super Veggie Kebabs",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 28, // 1/6 of input cost, 169
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["mushroom", 2],
			["urfu", 1],
			["vegmageddon", 1],
		],
		outputs : [
			["super_veggie_kebabs", 1],
		],
	};

	this.recipes["27"] = {
		name : "Cedar Plank Salmon",
		skill : null,
		skills : [],
		achievements : ["brazier_apprentice"],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 7, // 1/6 of input cost, 40
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["plank", 2],
			["salmon", 1],
			["lemon", 2],
			["olive_oil", 1],
		],
		outputs : [
			["cedar_plank_salmon", 1],
		],
	};

	this.recipes["28"] = {
		name : "Obvious Panini",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 14, // 1/6 of input cost, 81
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bun", 1],
			["cheese", 1],
			["meat", 1],
			["secret_sauce", 1],
		],
		outputs : [
			["obvious_panini", 1],
		],
	};

	this.recipes["29"] = {
		name : "Expensive Grilled Cheese",
		skill : null,
		skills : [],
		achievements : ["broil_king"],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 22, // 1/6 of input cost, 132
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bun", 1],
			["cheese", 1],
			["creamy_catsup", 1],
			["cheese_very_stinky", 1],
		],
		outputs : [
			["expensive_grilled_cheese", 1],
		],
	};

	this.recipes["30"] = {
		name : "Tasty Pasta",
		skill : null,
		skills : [],
		achievements : ["1star_cuisinartist"],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 35, // 1/6 of input cost, 207
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["wicked_bolognese_sauce", 1],
			["fried_noodles", 1],
			["green", 1],
			["glitchepoix", 1],
		],
		outputs : [
			["tasty_pasta", 1],
		],
	};

	this.recipes["31"] = {
		name : "Yummy Gruel",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 26, // 1/6 of input cost, 156
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["desssert_rub", 1],
			["tiny_bubble", 3],
			["oats", 6],
		],
		outputs : [
			["yummy_gruel", 1],
		],
	};

	this.recipes["32"] = {
		name : "Ix-style Braised Meat",
		skill : null,
		skills : [],
		achievements : ["4star_cuisinartist"],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 26, // 1/6 of input cost, 154
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 5],
			["blue_bubble", 4],
			["naraka_flame_rub", 1],
		],
		outputs : [
			["ixstyle_braised_meat", 1],
		],
	};

	this.recipes["33"] = {
		name : "Fortifying Gruel",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 22, // 1/6 of input cost, 130
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["pinch_of_salt", 1],
			["hot_n_fizzy_sauce", 1],
			["oats", 10],
		],
		outputs : [
			["fortifying_gruel", 1],
		],
	};

	this.recipes["34"] = {
		name : "Abbasid Ribs",
		skill : null,
		skills : [],
		achievements : ["master_carbonifier"],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 21, // 1/6 of input cost, 123
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 2],
			["hototot_rub", 1],
			["mild_sauce", 1],
		],
		outputs : [
			["abbasid_ribs", 1],
		],
	};

	this.recipes["35"] = {
		name : "Meat Gumbo",
		skill : "masterchef_1",
		skills : ["masterchef_1"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 29, // 1/6 of input cost, 176
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 2],
			["stock_sauce", 1],
			["glitchepoix", 1],
			["hototot_rub", 1],
		],
		outputs : [
			["meat_gumbo", 1],
		],
	};

	this.recipes["36"] = {
		name : "Lemburger",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 19, // 1/6 of input cost, 115
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["bun", 1],
			["cheese", 1],
			["creamy_catsup", 1],
		],
		outputs : [
			["lemburger", 1],
		],
	};

	this.recipes["37"] = {
		name : "Meat Tetrazzini",
		skill : null,
		skills : [],
		achievements : ["3star_cuisinartist"],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 32, // 1/6 of input cost, 190
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 2],
			["plain_noodles", 1],
			["tangy_sauce", 1],
			["mushroom", 1],
		],
		outputs : [
			["meat_tetrazzini", 1],
		],
	};

	this.recipes["38"] = {
		name : "Rich Tagine",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 34, // 1/6 of input cost, 203
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 3],
			["trump_rub", 1],
			["glitchepoix", 1],
		],
		outputs : [
			["rich_tagine", 1],
		],
	};

	this.recipes["39"] = {
		name : "Chilly-Busting Chili",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 31, // 1/6 of input cost, 187
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 2],
			["death_to_veg", 1],
			["legumes_parisienne", 2],
			["naraka_flame_rub", 1],
		],
		outputs : [
			["chillybusting_chili", 1],
		],
	};

	this.recipes["40"] = {
		name : "Awesome Stew",
		skill : null,
		skills : [],
		achievements : ["golden_ladle_award"],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 24, // 1/6 of input cost, 144
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 2],
			["saffron", 1],
			["vegmageddon", 1],
			["legumes_parisienne", 1],
		],
		outputs : [
			["awesome_stew", 1],
		],
	};

	this.recipes["41"] = {
		name : "Mild Sauce",
		skill : "saucery_1",
		skills : ["saucery_1"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 16
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["all_spice", 1],
			["milk_butterfly", 1],
			["olive_oil", 1],
		],
		outputs : [
			["mild_sauce", 1],
		],
	};

	this.recipes["42"] = {
		name : "Cheezy Sauce",
		skill : "saucery_1",
		skills : ["saucery_1"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 7, // 1/6 of input cost, 39
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cheese", 1],
			["pinch_of_salt", 1],
			["roux", 1],
		],
		outputs : [
			["cheezy_sauce", 1],
		],
	};

	this.recipes["43"] = {
		name : "Whortleberry Jelly",
		skill : null,
		skills : [],
		achievements : ["a1_saucier"],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // manual override
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["honey", 1],
			["cardamom", 1],
			["whortleberry", 7],
		],
		outputs : [
			["whortleberry_jelly", 1],
		],
	};

	this.recipes["44"] = {
		name : "Wavy Gravy",
		skill : null,
		skills : [],
		achievements : ["super_saucier"],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 9, // 1/6 of input cost, 54
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["camphor", 1],
			["stock_sauce", 1],
		],
		outputs : [
			["wavy_gravy", 1],
		],
	};

	this.recipes["45"] = {
		name : "Creamy Catsup",
		skill : "saucery_2",
		skills : ["saucery_2"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 9, // 1/6 of input cost, 54
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["honey", 1],
			["red", 1],
			["kings_of_condiments", 1],
		],
		outputs : [
			["creamy_catsup", 1],
		],
	};

	this.recipes["46"] = {
		name : "Wicked Bolognese Sauce",
		skill : "saucery_2",
		skills : ["saucery_2"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // 1/6 of input cost, 49
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["olive_oil", 1],
			["hot_pepper", 1],
			["red", 1],
		],
		outputs : [
			["wicked_bolognese_sauce", 1],
		],
	};

	this.recipes["47"] = {
		name : "Onion Sauce",
		skill : null,
		skills : [],
		achievements : ["spice_examiner"],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 7, // 1/6 of input cost, 42
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["nutmeg", 1],
			["onion", 2],
			["roux", 1],
		],
		outputs : [
			["onion_sauce", 1],
		],
	};

	this.recipes["48"] = {
		name : "Hot 'n' Fizzy Sauce",
		skill : null,
		skills : [],
		achievements : ["gravy_maven"],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // 1/6 of input cost, 32
		xp_reward : 5,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hot_pepper", 1],
			["plain_bubble", 3],
			["roux", 1],
		],
		outputs : [
			["hot_n_fizzy_sauce", 1],
		],
	};

	this.recipes["49"] = {
		name : "Cloudberry Jam",
		skill : null,
		skills : [],
		achievements : ["roux_guru"],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // 1/6 of input cost, 26
		xp_reward : 5,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cloudberry", 11],
			["ginger", 1],
		],
		outputs : [
			["cloudberry_jam", 1],
		],
	};

	this.recipes["50"] = {
		name : "Sweet 'n' Sour Sauce",
		skill : "saucery_1",
		skills : ["saucery_1"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 7, // 1/6 of input cost, 39
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["honey", 1],
			["lemon", 1],
			["red", 1],
		],
		outputs : [
			["sweet_n_sour_sauce", 1],
		],
	};

	this.recipes["51"] = {
		name : "Secret Sauce",
		skill : null,
		skills : [],
		achievements : ["rolling_boiler"],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // manual override
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 1],
			["black_pepper", 1],
			["roux", 1],
		],
		outputs : [
			["secret_sauce", 1],
		],
	};

	this.recipes["52"] = {
		name : "Fruity Juice",
		skill : "blending_1",
		skills : ["blending_1"],
		achievements : [],
		tool : "blender",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 15
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cherry", 4],
			["plum", 2],
			["orange", 1],
		],
		outputs : [
			["fruity_juice", 1],
		],
	};

	this.recipes["53"] = {
		name : "Lemon Juice",
		skill : "blending_1",
		skills : ["blending_1"],
		achievements : [],
		tool : "blender",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 25
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["lemon", 5],
		],
		outputs : [
			["lemon_juice", 1],
		],
	};

	this.recipes["54"] = {
		name : "Orange Juice",
		skill : "blending_1",
		skills : ["blending_1"],
		achievements : [],
		tool : "blender",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 25
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["orange", 5],
		],
		outputs : [
			["orange_juice", 1],
		],
	};

	this.recipes["55"] = {
		name : "Mega Healthy Veggie Juice",
		skill : null,
		skills : [],
		achievements : ["pulse_frappe_mix_blend"],
		tool : "blender",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // 1/6 of input cost, 29
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["carrot", 1],
			["cabbage", 1],
			["parsnip", 1],
			["mangosteen", 1],
		],
		outputs : [
			["mega_healthy_veggie_juice", 1],
		],
	};

	this.recipes["56"] = {
		name : "Cloud 11 Smoothie",
		skill : null,
		skills : [],
		achievements : [],
		tool : "blender",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 7, // 1/6 of input cost, 44
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cloudberry", 11],
			["banana", 1],
			["honey", 1],
			["milk_butterfly", 1],
		],
		outputs : [
			["cloud_11_smoothie", 1],
		],
	};

	this.recipes["57"] = {
		name : "Exotic Juice",
		skill : null,
		skills : [],
		achievements : ["high_speed_commingler"],
		tool : "blender",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 8, // 1/6 of input cost, 47
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["pineapple", 1],
			["banana", 1],
			["mangosteen", 3],
		],
		outputs : [
			["exotic_juice", 1],
		],
	};

	this.recipes["58"] = {
		name : "Too-berry Shake",
		skill : "blending_2",
		skills : ["blending_2"],
		achievements : [],
		tool : "blender",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // 1/6 of input cost, 48
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["milk_butterfly", 1],
			["strawberry", 4],
			["whortleberry", 4],
			["birch_syrup", 1],
		],
		outputs : [
			["tooberry_shake", 1],
		],
	};

	this.recipes["59"] = {
		name : "Savory Smoothie",
		skill : null,
		skills : [],
		achievements : ["blendmaster"],
		tool : "blender",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 10, // 1/6 of input cost, 61
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["oily_dressing", 1],
			["hard_bubble", 3],
			["all_spice", 1],
		],
		outputs : [
			["savory_smoothie", 1],
		],
	};

	this.recipes["60"] = {
		name : "Earthshaker",
		skill : "blending_2",
		skills : ["blending_2"],
		achievements : [],
		tool : "blender",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 17, // 1/6 of input cost, 102
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 6],
			["banana", 1],
			["hot_n_fizzy_sauce", 1],
			["garlic", 1],
			["beer", 1],
		],
		outputs : [
			["earthshaker", 1],
		],
	};

	this.recipes["61"] = {
		name : "Bubble Tea",
		skill : "blending_2",
		skills : ["blending_2"],
		achievements : [],
		tool : "blender",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 18, // 1/6 of input cost, 109
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["blue_bubble", 5],
			["tiny_bubble", 4],
			["hard_bubble", 2],
			["plain_bubble", 7],
		],
		outputs : [
			["bubble_tea", 1],
		],
	};

	this.recipes["62"] = {
		name : "Mabbish Coffee",
		skill : "cocktailcrafting_1",
		skills : ["cocktailcrafting_1"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 7, // 1/6 of input cost, 40
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["coffee", 1],
			["hooch", 1],
			["milk_butterfly", 1],
			["cinnamon", 1],
			["plain_bubble", 2],
		],
		outputs : [
			["mabbish_coffee", 1],
		],
	};

	this.recipes["63"] = {
		name : "Spicy Grog",
		skill : "cocktailcrafting_1",
		skills : ["cocktailcrafting_1"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 6, // 1/6 of input cost, 34
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hooch", 1],
			["licorice", 1],
			["all_spice", 1],
			["hot_pepper", 1],
			["mustard", 1],
		],
		outputs : [
			["spicy_grog", 1],
		],
	};

	this.recipes["64"] = {
		name : "Creamy Martini",
		skill : "cocktailcrafting_1",
		skills : ["cocktailcrafting_1"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // 1/6 of input cost, 46
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hooch", 1],
			["milk_butterfly", 2],
			["ice", 1],
			["onion", 1],
			["lemon", 1],
		],
		outputs : [
			["creamy_martini", 1],
		],
	};

	this.recipes["65"] = {
		name : "Slow Gin Fizz",
		skill : null,
		skills : [],
		achievements : ["middling_mixologist"],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 8, // 1/6 of input cost, 49
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hooch", 1],
			["fruity_juice", 1],
			["blue_bubble", 2],
		],
		outputs : [
			["slow_gin_fizz", 1],
		],
	};

	this.recipes["66"] = {
		name : "Carrot Margarita",
		skill : null,
		skills : [],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 11, // 1/6 of input cost, 67
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["orange_juice", 1],
			["hooch", 1],
			["pinch_of_salt", 1],
			["lemon", 1],
			["ice", 1],
		],
		outputs : [
			["carrot_margarita", 1],
		],
	};

	this.recipes["67"] = {
		name : "Cloudberry Daiquiri",
		skill : null,
		skills : [],
		achievements : ["mediocre_mixologist"],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 17, // 1/6 of input cost, 102
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hooch", 1],
			["cloud_11_smoothie", 1],
			["ice", 1],
			["nutmeg", 1],
		],
		outputs : [
			["cloudberry_daiquiri", 1],
		],
	};

	this.recipes["68"] = {
		name : "Cosma-politan",
		skill : "cocktailcrafting_2",
		skills : ["cocktailcrafting_2"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 14, // 1/6 of input cost, 84
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hooch", 1],
			["fruity_juice", 1],
			["ice", 1],
			["lemon_juice", 1],
		],
		outputs : [
			["cosmapolitan", 1],
		],
	};

	this.recipes["69"] = {
		name : "Flaming Humbaba",
		skill : "cocktailcrafting_2",
		skills : ["cocktailcrafting_2"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 18, // 1/6 of input cost, 107
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hooch", 1],
			["laughing_gas", 1],
			["hot_n_fizzy_sauce", 1],
			["fruity_juice", 1],
		],
		outputs : [
			["flaming_humbaba", 1],
		],
	};

	this.recipes["70"] = {
		name : "Gurly Drink",
		skill : null,
		skills : [],
		achievements : ["superior_mixologist"],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 16, // 1/6 of input cost, 97
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["fruity_juice", 1],
			["hooch", 1],
			["honey", 1],
			["ginger", 1],
			["tiny_bubble", 5],
		],
		outputs : [
			["gurly_drink", 1],
		],
	};

	this.recipes["71"] = {
		name : "Pungent Sunrise",
		skill : "cocktailcrafting_2",
		skills : ["cocktailcrafting_2"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // 1/6 of input cost, 118
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hooch", 1],
			["fruit_salad", 1],
			["exotic_juice", 1],
			["camphor", 1],
		],
		outputs : [
			["pungent_sunrise", 1],
		],
	};

	this.recipes["72"] = {
		name : "Butterfly Egg",
		skill : "animalhusbandry_1",
		skills : ["animalhusbandry_1"],
		achievements : [],
		tool : "egg_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 30,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["blue_bubble", 8],
			["tiny_bubble", 10],
			["honey", 10],
			["egg_plain", 1],
		],
		outputs : [
			["butterfly_egg", 1],
		],
	};

	this.recipes["73"] = {
		name : "Chicken Egg",
		skill : "animalhusbandry_1",
		skills : ["animalhusbandry_1"],
		achievements : [],
		tool : "egg_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 15,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["garlic", 10],
			["white_gas", 1],
			["egg_plain", 1],
		],
		outputs : [
			["chicken_egg", 1],
		],
	};

	this.recipes["74"] = {
		name : "Piggy Egg",
		skill : "animalhusbandry_1",
		skills : ["animalhusbandry_1"],
		achievements : [],
		tool : "egg_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 22,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hard_bubble", 7],
			["potato", 2],
			["apple", 3],
			["egg_plain", 1],
		],
		outputs : [
			["piggy_egg", 1],
		],
	};

	this.recipes["75"] = {
		name : "Egg Plant Bean",
		skill : "botany_1",
		skills : ["botany_1"],
		achievements : [],
		tool : "bean_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["camphor", 1],
			["heavy_gas", 1],
			["pineapple", 2],
			["bean_plain", 1],
		],
		outputs : [
			["bean_egg", 1],
		],
	};

	this.recipes["76"] = {
		name : "Bean Tree Bean",
		skill : "botany_1",
		skills : ["botany_1"],
		achievements : [],
		tool : "bean_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["nutmeg", 3],
			["lemon", 3],
			["general_vapour", 3],
			["bean_plain", 1],
		],
		outputs : [
			["bean_bean", 1],
		],
	};

	this.recipes["77"] = {
		name : "Bubble Tree Bean",
		skill : "botany_1",
		skills : ["botany_1"],
		achievements : [],
		tool : "bean_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["turmeric", 3],
			["plum", 4],
			["helium", 1],
			["bean_plain", 1],
		],
		outputs : [
			["bean_bubble", 1],
		],
	};

	this.recipes["78"] = {
		name : "Fruit Tree Bean",
		skill : "botany_1",
		skills : ["botany_1"],
		achievements : [],
		tool : "bean_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cardamom", 3],
			["laughing_gas", 2],
			["bean_plain", 1],
		],
		outputs : [
			["bean_fruit", 1],
		],
	};

	this.recipes["79"] = {
		name : "Spice Plant Bean",
		skill : "botany_1",
		skills : ["botany_1"],
		achievements : [],
		tool : "bean_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["crying_gas", 1],
			["carrot", 4],
			["tiny_bubble", 3],
			["bean_plain", 1],
		],
		outputs : [
			["bean_spice", 1],
		],
	};

	this.recipes["80"] = {
		name : "Gas Plant Bean",
		skill : "botany_1",
		skills : ["botany_1"],
		achievements : [],
		tool : "bean_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["licorice", 4],
			["beer", 1],
			["hard_bubble", 2],
			["bean_plain", 1],
		],
		outputs : [
			["bean_gas", 1],
		],
	};

	this.recipes["81"] = {
		name : "Eggy Scramble",
		skill : "cheffery_2",
		skills : ["cheffery_2"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 20
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 2],
			["butterfly_butter", 1],
		],
		outputs : [
			["eggy_scramble", 1],
		],
	};

	this.recipes["82"] = {
		name : "Mexicali Eggs",
		skill : "cheffery_2",
		skills : ["cheffery_2"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // 1/6 of input cost, 47
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 2],
			["bean_plain", 3],
			["cheese", 1],
			["tortilla", 1],
		],
		outputs : [
			["mexicali_eggs", 1],
		],
	};

	this.recipes["83"] = {
		name : "Corny Fritter",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 25
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["corn", 3],
			["egg_plain", 1],
			["pinch_of_salt", 1],
		],
		outputs : [
			["corny_fritter", 1],
		],
	};

	this.recipes["84"] = {
		name : "Corn-off-the-Cob",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 6, // 1/6 of input cost, 34
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["corn", 4],
			["butterfly_butter", 1],
		],
		outputs : [
			["corn_off_the_cob", 1],
		],
	};

	this.recipes["85"] = {
		name : "Oaty Cake",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 22
		xp_reward : 5,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["oats", 1],
			["birch_syrup", 1],
			["egg_plain", 2],
		],
		outputs : [
			["oaty_cake", 1],
		],
	};

	this.recipes["86"] = {
		name : "Banana No-Names",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 24
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["banana", 1],
			["honey", 1],
			["butterfly_butter", 1],
		],
		outputs : [
			["banana_no_names", 1],
		],
	};

	this.recipes["87"] = {
		name : "Fried Noodles",
		skill : null,
		skills : [],
		achievements : ["pretty_good_griddler"],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // 1/6 of input cost, 23
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["plain_noodles", 1],
			["butterfly_butter", 1],
		],
		outputs : [
			["fried_noodles", 1],
		],
	};

	this.recipes["88"] = {
		name : "Messy Fry-Up",
		skill : "cheffery_2",
		skills : ["cheffery_2"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 6, // 1/6 of input cost, 37
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 2],
			["meat", 1],
			["potato", 1],
			["butterfly_butter", 1],
		],
		outputs : [
			["messy_fry_up", 1],
		],
	};

	this.recipes["89"] = {
		name : "Green Eggs",
		skill : null,
		skills : [],
		achievements : ["decent_hash_slinger"],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 1, // 1/6 of input cost, 8
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["spinach", 1],
			["egg_plain", 1],
		],
		outputs : [
			["green_eggs", 1],
		],
	};

	this.recipes["90"] = {
		name : "Applejack",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 16
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["apple", 1],
			["oats", 1],
			["all_spice", 1],
		],
		outputs : [
			["applejack", 1],
		],
	};

	this.recipes["91"] = {
		name : "Frog-in-a-Hole",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 24
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["egg_plain", 1],
			["bun", 1],
			["butterfly_butter", 1],
		],
		outputs : [
			["frog_in_a_hole", 1],
		],
	};

	this.recipes["92"] = {
		name : "Bubble and Squeak",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 6, // 1/6 of input cost, 38
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["carrot", 1],
			["hard_bubble", 1],
			["potato", 1],
		],
		outputs : [
			["bubble_and_squeak", 1],
		],
	};

	this.recipes["93"] = {
		name : "Flummery",
		skill : null,
		skills : [],
		achievements : ["2star_cuisinartist"],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 23, // 1/6 of input cost, 140
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["oats", 2],
			["milk_butterfly", 2],
			["whortleberry", 6],
			["desssert_rub", 1],
		],
		outputs : [
			["flummery", 1],
		],
	};

	this.recipes["94"] = {
		name : "Tangy Noodles",
		skill : "masterchef_1",
		skills : ["masterchef_1"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // 1/6 of input cost, 28
		xp_reward : 5,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["plain_noodles", 1],
			["lemon", 1],
			["butterfly_butter", 1],
		],
		outputs : [
			["tangy_noodles", 1],
		],
	};

	this.recipes["95"] = {
		name : "Potato Patty",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 21
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["potato", 1],
			["onion", 1],
			["butterfly_butter", 1],
		],
		outputs : [
			["potato_patty", 1],
		],
	};

	this.recipes["96"] = {
		name : "Greasy Frybread",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // 1/6 of input cost, 29
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bun", 1],
			["butterfly_butter", 2],
		],
		outputs : [
			["greasy_frybread", 1],
		],
	};

	this.recipes["97"] = {
		name : "Cheezy Sammich",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 24
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cheese", 1],
			["bun", 1],
		],
		outputs : [
			["cheezy_sammich", 1],
		],
	};

	this.recipes["98"] = {
		name : "Berry Bowl",
		skill : null,
		skills : [],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // 1/6 of input cost, 30
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["whortleberry", 4],
			["cloudberry", 3],
			["strawberry", 1],
		],
		outputs : [
			["berry_bowl", 1],
		],
	};

	this.recipes["99"] = {
		name : "Lazy Salad",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 25
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["tomato", 2],
			["cheese", 1],
		],
		outputs : [
			["lazy_salad", 1],
		],
	};

	this.recipes["100"] = {
		name : "Snack Pack",
		skill : null,
		skills : [],
		achievements : ["fine_mincer"],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 7, // 1/6 of input cost, 41
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cheese", 1],
			["apple", 1],
			["pickle", 1],
		],
		outputs : [
			["snack_pack", 1],
		],
	};

}
this.set_catalog_recipes_1();

function set_catalog_recipes_2(){
	this.recipes["101"] = {
		name : "Lotsa Lox",
		skill : null,
		skills : [],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // 1/6 of input cost, 24
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["salmon", 1],
			["onion", 1],
			["lemon", 1],
		],
		outputs : [
			["lotsa_lox", 1],
		],
	};

	this.recipes["102"] = {
		name : "Cold Taco",
		skill : null,
		skills : [],
		achievements : ["able_chopper"],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 7, // 1/6 of input cost, 44
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["cheese", 1],
			["tortilla", 1],
		],
		outputs : [
			["cold_taco", 1],
		],
	};

	this.recipes["103"] = {
		name : "Spinach Salad",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // 1/6 of input cost, 12
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["spinach", 1],
			["orange", 1],
			["onion", 1],
		],
		outputs : [
			["spinach_salad", 1],
		],
	};

	this.recipes["104"] = {
		name : "Exotic Fruit Salad",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 22
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["pineapple", 1],
			["orange", 1],
			["banana", 1],
		],
		outputs : [
			["exotic_fruit_salad", 1],
		],
	};

	this.recipes["105"] = {
		name : "Blue Bubble",
		skill : null,
		skills : [],
		achievements : [],
		tool : "bubble_tuner",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["plain_bubble", 1],
		],
		outputs : [
			["blue_bubble", 1],
		],
	};

	this.recipes["106"] = {
		name : "Tiny Bubble",
		skill : null,
		skills : [],
		achievements : [],
		tool : "bubble_tuner",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["plain_bubble", 3],
		],
		outputs : [
			["tiny_bubble", 1],
		],
	};

	this.recipes["107"] = {
		name : "Hard Bubble",
		skill : null,
		skills : [],
		achievements : [],
		tool : "bubble_tuner",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["plain_bubble", 5],
		],
		outputs : [
			["hard_bubble", 1],
		],
	};

	this.recipes["108"] = {
		name : "Plum",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 1],
		],
		outputs : [
			["plum", 1],
		],
	};

	this.recipes["109"] = {
		name : "Bunch of Grapes",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 2],
		],
		outputs : [
			["bunch_of_grapes", 1],
		],
	};

	this.recipes["111"] = {
		name : "Orange",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 3],
		],
		outputs : [
			["orange", 1],
		],
	};

	this.recipes["112"] = {
		name : "Apple",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 3],
		],
		outputs : [
			["apple", 1],
		],
	};

	this.recipes["113"] = {
		name : "Lemon",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 4],
		],
		outputs : [
			["lemon", 1],
		],
	};

	this.recipes["114"] = {
		name : "Pineapple",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 5],
		],
		outputs : [
			["pineapple", 1],
		],
	};

	this.recipes["115"] = {
		name : "Banana",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 6],
		],
		outputs : [
			["banana", 1],
		],
	};

	this.recipes["116"] = {
		name : "Pinch of Salt",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 1, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 100,
		inputs : [
			["all_spice", 1],
		],
		outputs : [
			["pinch_of_salt", 1],
		],
	};

	this.recipes["117"] = {
		name : "Curry",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 1],
		],
		outputs : [
			["curry", 1],
		],
	};

	this.recipes["118"] = {
		name : "Hot Pepper",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 1],
		],
		outputs : [
			["hot_pepper", 1],
		],
	};

	this.recipes["119"] = {
		name : "Garlic",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 1],
		],
		outputs : [
			["garlic", 1],
		],
	};

	this.recipes["120"] = {
		name : "Ginger",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 1],
		],
		outputs : [
			["ginger", 1],
		],
	};

	this.recipes["121"] = {
		name : "Black Pepper",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 1],
		],
		outputs : [
			["black_pepper", 1],
		],
	};

	this.recipes["122"] = {
		name : "Mustard",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 1],
		],
		outputs : [
			["mustard", 1],
		],
	};

	this.recipes["123"] = {
		name : "Cumin",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 2],
		],
		outputs : [
			["cumin", 1],
		],
	};

	this.recipes["124"] = {
		name : "Cinnamon",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 2],
		],
		outputs : [
			["cinnamon", 1],
		],
	};

	this.recipes["125"] = {
		name : "Licorice",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 3, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 2],
		],
		outputs : [
			["licorice", 1],
		],
	};

	this.recipes["126"] = {
		name : "Nutmeg",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 3],
		],
		outputs : [
			["nutmeg", 1],
		],
	};

	this.recipes["127"] = {
		name : "Saffron",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 3],
		],
		outputs : [
			["saffron", 1],
		],
	};

	this.recipes["128"] = {
		name : "Turmeric",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 3],
		],
		outputs : [
			["turmeric", 1],
		],
	};

	this.recipes["129"] = {
		name : "Cardamom",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 3],
		],
		outputs : [
			["cardamom", 1],
		],
	};

	this.recipes["130"] = {
		name : "Camphor",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 8, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 5],
		],
		outputs : [
			["camphor", 1],
		],
	};

	this.recipes["131"] = {
		name : "Old(er) Spice",
		skill : null,
		skills : [],
		achievements : [],
		tool : "spice_mill",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["all_spice", 5],
		],
		outputs : [
			["older_spice", 1],
		],
	};

	this.recipes["133"] = {
		name : "Heavy Gas",
		skill : null,
		skills : [],
		achievements : [],
		tool : "gassifier",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 15, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_vapour", 6],
		],
		outputs : [
			["heavy_gas", 1],
		],
	};

	this.recipes["134"] = {
		name : "Helium",
		skill : null,
		skills : [],
		achievements : [],
		tool : "gassifier",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 9, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_vapour", 5],
		],
		outputs : [
			["helium", 1],
		],
	};

	this.recipes["135"] = {
		name : "Laughing Gas",
		skill : null,
		skills : [],
		achievements : [],
		tool : "gassifier",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 6, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_vapour", 3],
		],
		outputs : [
			["laughing_gas", 1],
		],
	};

	this.recipes["136"] = {
		name : "White Gas",
		skill : null,
		skills : [],
		achievements : [],
		tool : "gassifier",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 15, // manual override
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_vapour", 8],
		],
		outputs : [
			["white_gas", 1],
		],
	};

	this.recipes["137"] = {
		name : "Crying Gas",
		skill : null,
		skills : [],
		achievements : [],
		tool : "gassifier",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_vapour", 4],
		],
		outputs : [
			["crying_gas", 1],
		],
	};

	this.recipes["138"] = {
		name : "Flour",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 1, // 1/6 of input cost, 5
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["grain", 5],
		],
		outputs : [
			["flour", 1],
		],
	};

	this.recipes["139"] = {
		name : "Bun",
		skill : "cheffery_1",
		skills : ["cheffery_1"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // 1/6 of input cost, 9
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["flour", 1],
			["pinch_of_salt", 1],
		],
		outputs : [
			["bun", 1],
		],
	};

	this.recipes["140"] = {
		name : "Tortilla",
		skill : "cheffery_1",
		skills : ["cheffery_1"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // 1/6 of input cost, 15
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["flour", 1],
			["corn", 1],
			["pinch_of_salt", 1],
		],
		outputs : [
			["tortilla", 1],
		],
	};

	this.recipes["141"] = {
		name : "Plain Noodles",
		skill : "cheffery_1",
		skills : ["cheffery_1"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // 1/6 of input cost, 11
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["flour", 1],
			["rice", 1],
		],
		outputs : [
			["plain_noodles", 1],
		],
	};

	this.recipes["142"] = {
		name : "Whortleberry",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 2],
		],
		outputs : [
			["whortleberry", 1],
		],
	};

	this.recipes["143"] = {
		name : "Pickle",
		skill : "masterchef_1",
		skills : ["masterchef_1"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // 1/6 of input cost, 11
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cucumber", 1],
			["pinch_of_salt", 1],
			["olive_oil", 1],
		],
		outputs : [
			["pickle", 1],
		],
	};

	this.recipes["144"] = {
		name : "Cloudberry",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 1],
		],
		outputs : [
			["cloudberry", 1],
		],
	};

	this.recipes["145"] = {
		name : "Tangy Sauce",
		skill : "saucery_2",
		skills : ["saucery_2"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 18, // 1/6 of input cost, 110
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["secret_sauce", 1],
			["sweet_n_sour_sauce", 1],
		],
		outputs : [
			["tangy_sauce", 1],
		],
	};

	this.recipes["146"] = {
		name : "Groddlene",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 6],
			["element_green", 3],
		],
		outputs : [
			["groddlene", 1],
		],
	};

	this.recipes["147"] = {
		name : "Friendly Acid",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 10],
			["element_blue", 5],
		],
		outputs : [
			["friendly_acid", 1],
		],
	};

	this.recipes["148"] = {
		name : "Abbasidose",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 4],
			["element_green", 2],
			["element_blue", 6],
		],
		outputs : [
			["abbasidose", 1],
			["diabolic_acid", 1],
		],
	};

	this.recipes["149"] = {
		name : "Spriggase",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 11],
			["element_green", 7],
			["element_blue", 5],
		],
		outputs : [
			["spriggase", 1],
		],
	};

	this.recipes["150"] = {
		name : "Potoxin",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 7],
			["element_green", 11],
			["element_blue", 4],
		],
		outputs : [
			["potoxin", 1],
		],
	};

	this.recipes["151"] = {
		name : "Alphose",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 3],
			["element_green", 5],
			["element_blue", 7],
		],
		outputs : [
			["alphose", 1],
		],
	};

	this.recipes["152"] = {
		name : "Rubemycin",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 5],
			["element_green", 3],
			["element_blue", 2],
			["element_shiny", 1],
		],
		outputs : [
			["rubemycin", 1],
		],
	};

	this.recipes["153"] = {
		name : "Tiite",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 2],
			["element_blue", 1],
		],
		outputs : [
			["tiite", 1],
		],
	};

	this.recipes["154"] = {
		name : "Ixite",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 2],
			["element_green", 3],
			["element_blue", 2],
			["element_shiny", 1],
		],
		outputs : [
			["ixite", 1],
		],
	};

	this.recipes["155"] = {
		name : "Humbabol",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_blue", 1],
			["element_shiny", 5],
		],
		outputs : [
			["humbabol", 1],
		],
	};

	this.recipes["156"] = {
		name : "Cosmox",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 12],
			["element_blue", 4],
			["element_shiny", 3],
		],
		outputs : [
			["cosmox", 1],
		],
	};

	this.recipes["157"] = {
		name : "Zillene",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_green", 5],
			["element_blue", 3],
			["element_shiny", 1],
		],
		outputs : [
			["zillene", 1],
		],
	};

	this.recipes["158"] = {
		name : "Lemene",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 4],
			["element_green", 3],
			["element_blue", 2],
			["element_shiny", 1],
		],
		outputs : [
			["lemene", 1],
		],
	};

	this.recipes["159"] = {
		name : "Grendalinunin",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 17],
			["element_green", 7],
			["element_blue", 4],
			["element_shiny", 2],
		],
		outputs : [
			["grendalinunin", 1],
		],
	};

	this.recipes["160"] = {
		name : "Mabon",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_green", 7],
			["element_blue", 7],
			["element_shiny", 7],
		],
		outputs : [
			["mabon", 1],
		],
	};

	this.recipes["161"] = {
		name : "Diabolic Acid",
		skill : null,
		skills : [],
		achievements : [],
		tool : "test_tube",
		tool_wear : 1,
		learnt : 0,
		energy_cost : 0, // manual override
		xp_reward : 0,
		wait_ms : 50,
		task_limit : 250,
		inputs : [
			["element_red", 1],
			["element_green", 1],
			["element_blue", 1],
		],
		outputs : [
			["diabolic_acid", 1],
		],
	};

	this.recipes["162"] = {
		name : "Fertilidust",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 20, // manual override
		xp_reward : 10,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["humbabol", 40],
			["potoxin", 20],
			["cosmox", 10],
		],
		outputs : [
			["fertilidust", 1],
		],
	};

	this.recipes["163"] = {
		name : "Extremely Hallowed Shrine Powder",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 60, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["zillene", 175],
			["humbabol", 160],
			["groddlene", 40],
		],
		outputs : [
			["extremely_hallowed_shrine_powder", 1],
		],
	};

	this.recipes["164"] = {
		name : "Powder of Mild Fecundity",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 20, // manual override
		xp_reward : 10,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["alphose", 40],
			["rubemycin", 45],
		],
		outputs : [
			["powder_of_mild_fecundity", 1],
		],
	};

	this.recipes["165"] = {
		name : "Fertilidust Lite",
		skill : "intermediateadmixing_1",
		skills : ["intermediateadmixing_1"],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 30, // 1/6 of input cost, 182.5
		xp_reward : 5,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["humbabol", 15],
			["potoxin", 10],
		],
		outputs : [
			["fertilidust_lite", 1],
		],
	};

	this.recipes["166"] = {
		name : "Powder of Startling Fecundity",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 50, // manual override
		xp_reward : 25,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["grendalinunin", 60],
			["rubemycin", 75],
			["cosmox", 50],
		],
		outputs : [
			["powder_of_startling_fecundity", 1],
		],
	};

	this.recipes["167"] = {
		name : "Fairly Hallowed Shrine Powder",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 30, // manual override
		xp_reward : 14,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["zillene", 65],
			["humbabol", 55],
			["mabon", 20],
		],
		outputs : [
			["fairly_hallowed_shrine_powder", 1],
		],
	};

	this.recipes["168"] = {
		name : "No-No Powder",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["lemene", 4],
			["cosmox", 11],
		],
		outputs : [
			["no_no_powder", 1],
		],
	};

	this.recipes["169"] = {
		name : "Sparkle Powder",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 15, // manual override
		xp_reward : 10,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["abbasidose", 30],
			["spriggase", 30],
		],
		outputs : [
			["sparkle_powder", 1],
		],
	};

	this.recipes["170"] = {
		name : "Juju Shoo-Shoo Powder",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 10, // manual override
		xp_reward : 5,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["tiite", 25],
			["groddlene", 75],
		],
		outputs : [
			["juju_shoo_shoo_powder", 1],
		],
	};

	this.recipes["171"] = {
		name : "Sneezing Powder",
		skill : null,
		skills : [],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 5, // manual override
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 1,
		inputs : [
			["ixite", 20],
			["tiite", 65],
		],
		outputs : [
			["sneezing_powder", 1],
		],
	};

	this.recipes["172"] = {
		name : "Strawberry",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 2, // manual override
		xp_reward : 1,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 3],
		],
		outputs : [
			["strawberry", 1],
		],
	};

	this.recipes["173"] = {
		name : "Mangosteen",
		skill : null,
		skills : [],
		achievements : [],
		tool : "fruit_changing_machine",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 4, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 50,
		inputs : [
			["cherry", 7],
		],
		outputs : [
			["mangosteen", 1],
		],
	};

	this.recipes["174"] = {
		name : "Tin",
		skill : "alchemy_2",
		skills : ["alchemy_2"],
		achievements : [],
		tool : "alchemical_tongs",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // manual override
		xp_reward : 3,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["plain_metal", 1],
			["element_red", 8],
			["element_blue", 8],
			["element_green", 8],
		],
		outputs : [
			["tin", 1],
		],
	};

	this.recipes["175"] = {
		name : "Copper",
		skill : "alchemy_2",
		skills : ["alchemy_2"],
		achievements : [],
		tool : "alchemical_tongs",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // manual override
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["plain_metal", 1],
			["element_red", 60],
			["element_green", 30],
		],
		outputs : [
			["copper", 1],
		],
	};

	this.recipes["176"] = {
		name : "Molybdenum",
		skill : "alchemy_2",
		skills : ["alchemy_2"],
		achievements : [],
		tool : "alchemical_tongs",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // manual override
		xp_reward : 5,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["plain_metal", 1],
			["element_blue", 5],
			["element_shiny", 50],
		],
		outputs : [
			["molybdenum", 1],
		],
	};

	this.recipes["177"] = {
		name : "Hoe",
		skill : "tinkering_4",
		skills : ["tinkering_4"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 10,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plank", 1],
			["plain_metal", 1],
		],
		outputs : [
			["hoe", 1],
		],
	};

	this.recipes["178"] = {
		name : "Hatchet",
		skill : "tinkering_4",
		skills : ["tinkering_4"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 10,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plank", 2],
			["plain_metal", 1],
			["barnacle_talc", 1],
			["plain_bubble", 5],
		],
		outputs : [
			["hatchet", 1],
		],
	};

	this.recipes["179"] = {
		name : "Knife & Board",
		skill : "tinkering_4",
		skills : ["tinkering_4"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 10, // manual override
		xp_reward : 10,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plank", 4],
			["plain_metal", 1],
		],
		outputs : [
			["knife_and_board", 1],
		],
	};

	this.recipes["180"] = {
		name : "Watering Can",
		skill : "tinkering_4",
		skills : ["tinkering_4"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 10, // manual override
		xp_reward : 10,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 1],
		],
		outputs : [
			["watering_can", 1],
		],
	};

	this.recipes["181"] = {
		name : "Frying Pan",
		skill : "tinkering_4",
		skills : ["tinkering_4"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 10,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plain_metal", 1],
			["tin", 1],
		],
		outputs : [
			["frying_pan", 1],
		],
	};

	this.recipes["182"] = {
		name : "Cocktail Shaker",
		skill : "tinkering_5",
		skills : ["tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 20,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 2],
		],
		outputs : [
			["cocktail_shaker", 1],
		],
	};

	this.recipes["183"] = {
		name : "Scraper",
		skill : "tinkering_5",
		skills : ["tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 25,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 1],
			["copper", 1],
			["molybdenum", 1],
		],
		outputs : [
			["scraper", 1],
		],
	};

	this.recipes["184"] = {
		name : "Saucepan",
		skill : "tinkering_5",
		skills : ["tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 20,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plain_metal", 1],
			["copper", 1],
			["tin", 1],
		],
		outputs : [
			["saucepan", 1],
		],
	};

	this.recipes["187"] = {
		name : "Awesome Pot",
		skill : "tinkering_5",
		skills : ["tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 25,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plain_metal", 1],
			["copper", 1],
			["molybdenum", 1],
		],
		outputs : [
			["awesome_pot", 1],
		],
	};

	this.recipes["190"] = {
		name : "Urth Block",
		skill : "blockmaking_1",
		skills : ["blockmaking_1"],
		achievements : [],
		tool : "blockmaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 5,
		wait_ms : 15000,
		task_limit : 10,
		inputs : [
			["earth", 5],
			["loam", 2],
			["heavy_gas", 1],
			["fuel_cell", 5],
		],
		outputs : [
			["grade_aa_earth_block", 1],
		],
	};

	this.recipes["192"] = {
		name : "Fuel Cell",
		skill : "fuelmaking_1",
		skills : ["fuelmaking_1"],
		achievements : [],
		tool : "fuelmaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 10,
		wait_ms : 20000,
		task_limit : 10,
		inputs : [
			["jellisac_clump", 12],
			["peat", 8],
			["fuel_cell", 1],
			["white_gas", 2],
		],
		outputs : [
			["fuel_cell", 1],
		],
	};

	this.recipes["195"] = {
		name : "Wood Tree Bean",
		skill : "botany_1",
		skills : ["botany_1"],
		achievements : [],
		tool : "bean_seasoner",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cinnamon", 5],
			["white_gas", 1],
			["mangosteen", 3],
			["bean_plain", 1],
		],
		outputs : [
			["bean_wood", 1],
		],
	};

	this.recipes["196"] = {
		name : "Tinkertool",
		skill : null,
		skills : [],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 40, // manual override
		xp_reward : 40,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 2],
			["copper", 3],
			["plain_metal", 2],
		],
		outputs : [
			["tinkertool", 1],
		],
	};

	this.recipes["197"] = {
		name : "Focusing Orb",
		skill : null,
		skills : [],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 50, // manual override
		xp_reward : 50,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plain_crystal", 3],
		],
		outputs : [
			["focusing_orb", 1],
		],
	};

	this.recipes["198"] = {
		name : "Beaker",
		skill : null,
		skills : [],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 25, // manual override
		xp_reward : 30,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plain_crystal", 1],
		],
		outputs : [
			["beaker", 1],
		],
	};

	this.recipes["199"] = {
		name : "Test Tube",
		skill : null,
		skills : [],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 15, // manual override
		xp_reward : 10,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["barnacle_talc", 3],
			["tiny_bubble", 2],
		],
		outputs : [
			["test_tube", 1],
		],
	};

	this.recipes["200"] = {
		name : "Bubble Tuner",
		skill : "tinkering_4",
		skills : ["tinkering_4","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 15,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["jellisac_clump", 6],
			["barnacle_talc", 3],
		],
		outputs : [
			["bubble_tuner", 1],
		],
	};

	this.recipes["201"] = {
		name : "Fruit Changing Machine",
		skill : "tinkering_4",
		skills : ["tinkering_4","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 20,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 1],
			["copper", 1],
		],
		outputs : [
			["fruit_changing_machine", 1],
		],
	};

	this.recipes["202"] = {
		name : "Gassifier",
		skill : "tinkering_4",
		skills : ["tinkering_4","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 15,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["copper", 1],
			["plain_metal", 1],
		],
		outputs : [
			["gassifier", 1],
		],
	};

	this.recipes["203"] = {
		name : "Spice Mill",
		skill : "tinkering_4",
		skills : ["tinkering_4","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 15,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 2],
		],
		outputs : [
			["spice_mill", 1],
		],
	};

	this.recipes["204"] = {
		name : "Blender",
		skill : "tinkering_4",
		skills : ["tinkering_4","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 25, // manual override
		xp_reward : 15,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["copper", 1],
			["jellisac_clump", 3],
		],
		outputs : [
			["blender", 1],
		],
	};

	this.recipes["205"] = {
		name : "Shovel",
		skill : "tinkering_4",
		skills : ["tinkering_4","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 25,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 3],
			["plain_metal", 2],
			["plank", 2],
		],
		outputs : [
			["shovel", 1],
		],
	};

	this.recipes["206"] = {
		name : "Pick",
		skill : "tinkering_4",
		skills : ["tinkering_4","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 30, // manual override
		xp_reward : 30,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["copper", 3],
			["plain_metal", 5],
			["plank", 2],
		],
		outputs : [
			["pick", 1],
		],
	};

	this.recipes["208"] = {
		name : "Alchemical Tongs",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 40,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plain_metal", 2],
			["molybdenum", 4],
		],
		outputs : [
			["alchemical_tongs", 1],
		],
	};

	this.recipes["209"] = {
		name : "Smelter",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 50, // manual override
		xp_reward : 50,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 2],
			["copper", 2],
			["molybdenum", 2],
			["barnacle_talc", 5],
		],
		outputs : [
			["smelter", 1],
		],
	};

	this.recipes["210"] = {
		name : "Bean Seasoner",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 15,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 2],
			["jellisac_clump", 2],
		],
		outputs : [
			["bean_seasoner", 1],
		],
	};

}
this.set_catalog_recipes_2();

function set_catalog_recipes_3(){
	this.recipes["211"] = {
		name : "Egg Seasoner",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 15,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 2],
			["jellisac_clump", 2],
		],
		outputs : [
			["egg_seasoner", 1],
		],
	};

	this.recipes["212"] = {
		name : "Famous Pugilist Grill",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 15,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["plain_metal", 1],
			["copper", 1],
		],
		outputs : [
			["mike_tyson_grill", 1],
		],
	};

	this.recipes["213"] = {
		name : "Fancy Pick",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 40,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["molybdenum", 6],
			["plain_metal", 6],
			["plank", 2],
		],
		outputs : [
			["fancy_pick", 1],
		],
	};

	this.recipes["214"] = {
		name : "Crystalmalizing Chamber",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 75,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["molybdenum", 20],
		],
		outputs : [
			["crystallizer", 1],
		],
	};

	this.recipes["215"] = {
		name : "Butterfly Milker",
		skill : "remoteherdkeeping_1",
		skills : ["remoteherdkeeping_1","tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 30, // manual override
		xp_reward : 30,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 4],
			["plain_metal", 3],
		],
		outputs : [
			["butterfly_milker", 1],
		],
	};

	this.recipes["216"] = {
		name : "Meat Collector",
		skill : "remoteherdkeeping_1",
		skills : ["remoteherdkeeping_1","tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 30, // manual override
		xp_reward : 30,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 5],
			["plain_metal", 4],
		],
		outputs : [
			["meat_collector", 1],
		],
	};

	this.recipes["217"] = {
		name : "Piggy Feeder",
		skill : "remoteherdkeeping_1",
		skills : ["remoteherdkeeping_1","tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 30, // manual override
		xp_reward : 20,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["tin", 2],
			["plain_metal", 1],
		],
		outputs : [
			["piggy_feeder", 1],
		],
	};

	this.recipes["218"] = {
		name : "Grinder",
		skill : "tinkering_5",
		skills : ["tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 30, // manual override
		xp_reward : 20,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["molybdenum", 1],
			["plain_metal", 1],
		],
		outputs : [
			["ore_grinder", 1],
		],
	};

	this.recipes["219"] = {
		name : "Grand Ol' Grinder",
		skill : "refining_2",
		skills : ["refining_2","tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 60,
		wait_ms : 20000,
		task_limit : 1,
		inputs : [
			["molybdenum", 11],
			["plain_metal", 17],
		],
		outputs : [
			["grand_ol_grinder", 1],
		],
	};

	this.recipes["220"] = {
		name : "High-Class Hoe",
		skill : "soil_appreciation_5",
		skills : ["soil_appreciation_5","tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 40,
		wait_ms : 20000,
		task_limit : 1,
		inputs : [
			["plank", 2],
			["plain_metal", 5],
			["molybdenum", 3],
		],
		outputs : [
			["high_class_hoe", 1],
		],
	};

	this.recipes["221"] = {
		name : "Irrigator 9000",
		skill : "light_green_thumb_3",
		skills : ["light_green_thumb_3","tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 50, // manual override
		xp_reward : 40,
		wait_ms : 20000,
		task_limit : 1,
		inputs : [
			["tin", 7],
			["molybdenum", 2],
		],
		outputs : [
			["irrigator_9000", 1],
		],
	};

	this.recipes["222"] = {
		name : "Super Scraper",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 60,
		wait_ms : 20000,
		task_limit : 1,
		inputs : [
			["tin", 7],
			["copper", 7],
			["molybdenum", 7],
		],
		outputs : [
			["super_scraper", 1],
		],
	};

	this.recipes["223"] = {
		name : "Birch Candy",
		skill : "saucery_1",
		skills : ["saucery_1"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // 1/6 of input cost, 11
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["birch_syrup", 1],
			["paper", 1],
			["pepitas", 1],
		],
		outputs : [
			["birch_candy", 1],
		],
	};

	this.recipes["224"] = {
		name : "Hi-Sucrose Corn Syrup Square",
		skill : "masterchef_1",
		skills : ["masterchef_1"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // 1/6 of input cost, 25
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["honey", 1],
			["tiny_bubble", 1],
			["corn", 1],
			["pepitas", 1],
		],
		outputs : [
			["corn_syrup_squares", 1],
		],
	};

	this.recipes["225"] = {
		name : "Raw Bio-Organic Carob-ish Treat",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 6, // 1/6 of input cost, 34
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["guano", 1],
			["jellisac_clump", 1],
			["pepitas", 1],
		],
		outputs : [
			["carobish_treats", 1],
		],
	};

	this.recipes["226"] = {
		name : "Pumpkin Ale",
		skill : "cocktailcrafting_1",
		skills : ["cocktailcrafting_1"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 10, // 1/6 of input cost, 59
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 5,
		inputs : [
			["pumpkin", 1],
			["beer", 1],
			["cinnamon", 1],
		],
		outputs : [
			["pumpkin_ale", 1],
		],
	};

	this.recipes["227"] = {
		name : "Pumpkin Pie",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 12, // 1/6 of input cost, 74
		xp_reward : 6,
		wait_ms : 5000,
		task_limit : 5,
		inputs : [
			["flour", 1],
			["honey", 1],
			["butterfly_butter", 1],
			["nutmeg", 1],
			["pumpkin", 1],
		],
		outputs : [
			["pumpkin_pie", 1],
		],
	};

	this.recipes["228"] = {
		name : "Essence of Gandlevery",
		skill : "tincturing_1",
		skills : ["tincturing_1"],
		achievements : [],
		tool : "tincturing_kit",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 11, // manual override
		xp_reward : 15,
		wait_ms : 5000,
		task_limit : 10,
		inputs : [
			["gandlevery", 3],
			["hooch", 1],
		],
		outputs : [
			["essence_of_gandlevery", 1],
		],
	};

	this.recipes["229"] = {
		name : "Essence of Hairball",
		skill : "tincturing_1",
		skills : ["tincturing_1"],
		achievements : [],
		tool : "tincturing_kit",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 17, // manual override
		xp_reward : 23,
		wait_ms : 5000,
		task_limit : 10,
		inputs : [
			["hairball_flower", 5],
			["hooch", 1],
		],
		outputs : [
			["essence_of_hairball", 1],
		],
	};

	this.recipes["230"] = {
		name : "Essence of Purple",
		skill : "tincturing_1",
		skills : ["tincturing_1"],
		achievements : [],
		tool : "tincturing_kit",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 18, // manual override
		xp_reward : 25,
		wait_ms : 5000,
		task_limit : 10,
		inputs : [
			["purple_flower", 23],
			["hooch", 2],
			["tangy_sauce", 1],
		],
		outputs : [
			["essence_of_purple", 1],
		],
	};

	this.recipes["231"] = {
		name : "Essence of Rookswort",
		skill : "tincturing_1",
		skills : ["tincturing_1"],
		achievements : [],
		tool : "tincturing_kit",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 19, // manual override
		xp_reward : 27,
		wait_ms : 5000,
		task_limit : 10,
		inputs : [
			["rookswort", 5],
			["hooch", 1],
		],
		outputs : [
			["essence_of_rookswort", 1],
		],
	};

	this.recipes["232"] = {
		name : "Essence of Rubeweed",
		skill : "tincturing_1",
		skills : ["tincturing_1"],
		achievements : [],
		tool : "tincturing_kit",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 21,
		wait_ms : 5000,
		task_limit : 10,
		inputs : [
			["rubeweed", 5],
			["hooch", 1],
		],
		outputs : [
			["essence_of_rubeweed", 1],
		],
	};

	this.recipes["233"] = {
		name : "Essence of Silvertongue",
		skill : "tincturing_1",
		skills : ["tincturing_1"],
		achievements : [],
		tool : "tincturing_kit",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 13, // manual override
		xp_reward : 18,
		wait_ms : 5000,
		task_limit : 10,
		inputs : [
			["silvertongue", 4],
			["hooch", 1],
		],
		outputs : [
			["essence_of_silvertongue", 1],
		],
	};

	this.recipes["234"] = {
		name : "Essence of Yellow Crumb",
		skill : "tincturing_1",
		skills : ["tincturing_1"],
		achievements : [],
		tool : "tincturing_kit",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 30,
		wait_ms : 5000,
		task_limit : 10,
		inputs : [
			["yellow_crumb_flower", 6],
			["hooch", 1],
		],
		outputs : [
			["essence_of_yellow_crumb", 1],
		],
	};

	this.recipes["235"] = {
		name : "Krazy Salts",
		skill : "intermediateadmixing_1",
		skills : ["intermediateadmixing_1"],
		achievements : [],
		tool : "beaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 11, // manual override
		xp_reward : 11,
		wait_ms : 2000,
		task_limit : 11,
		inputs : [
			["lemene", 11],
			["ixite", 11],
			["tiite", 11],
		],
		outputs : [
			["krazy_salts", 1],
		],
	};

	this.recipes["236"] = {
		name : "Tree Poison Antidote",
		skill : "potionmaking_1",
		skills : ["potionmaking_1"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 45,
		wait_ms : 8000,
		task_limit : 1,
		inputs : [
			["essence_of_gandlevery", 1],
			["spriggase", 5],
			["friendly_acid", 7],
			["guano", 1],
		],
		outputs : [
			["potion_tree_poison_antidote", 1],
		],
	};

	this.recipes["237"] = {
		name : "Tree Poison",
		skill : "botany_1",
		skills : ["botany_1","potionmaking_1"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 30, // manual override
		xp_reward : 90,
		wait_ms : 8000,
		task_limit : 1,
		inputs : [
			["essence_of_rookswort", 1],
			["diabolic_acid", 13],
			["krazy_salts", 1],
		],
		outputs : [
			["potion_tree_poison", 1],
		],
	};

	this.recipes["238"] = {
		name : "Charades Potion",
		skill : "potionmaking_1",
		skills : ["potionmaking_1"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 70,
		wait_ms : 4000,
		task_limit : 5,
		inputs : [
			["essence_of_silvertongue", 1],
			["laughing_gas", 1],
			["crying_gas", 1],
		],
		outputs : [
			["potion_charades", 1],
		],
	};

	this.recipes["239"] = {
		name : "Amorous Philtre",
		skill : "potionmaking_1",
		skills : ["potionmaking_1"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 45, // manual override
		xp_reward : 105,
		wait_ms : 8000,
		task_limit : 1,
		inputs : [
			["essence_of_purple", 1],
			["laughing_gas", 3],
		],
		outputs : [
			["potion_amorous_philtre", 1],
		],
	};

	this.recipes["240"] = {
		name : "Rainbow Juice",
		skill : "potionmaking_1",
		skills : ["potionmaking_1"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 35, // manual override
		xp_reward : 125,
		wait_ms : 4000,
		task_limit : 5,
		inputs : [
			["blue_bubble", 11],
			["green_eggs", 11],
			["strawberry", 13],
			["orange_juice", 3],
		],
		outputs : [
			["potion_rainbow_juice", 1],
		],
	};

	this.recipes["241"] = {
		name : "Elixir of Avarice",
		skill : null,
		skills : [],
		achievements : ["numismatizer_leprechaun_class"],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 2,
		energy_cost : 60, // manual override
		xp_reward : 200,
		wait_ms : 8000,
		task_limit : 1,
		inputs : [
			["essence_of_hairball", 1],
			["essence_of_silvertongue", 1],
			["helium", 3],
			["krazy_salts", 1],
		],
		outputs : [
			["potion_elixir_of_avarice", 1],
		],
	};

	this.recipes["242"] = {
		name : "Door Drink",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 110,
		wait_ms : 6000,
		task_limit : 3,
		inputs : [
			["essence_of_rubeweed", 1],
			["essence_of_gandlevery", 1],
		],
		outputs : [
			["potion_chris", 1],
		],
	};

	this.recipes["243"] = {
		name : "Rook Balm",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 45, // manual override
		xp_reward : 125,
		wait_ms : 8000,
		task_limit : 1,
		inputs : [
			["essence_of_rookswort", 1],
			["white_gas", 3],
			["krazy_salts", 1],
		],
		outputs : [
			["potion_rook_balm", 1],
		],
	};

	this.recipes["244"] = {
		name : "Keycutter Tonic",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 210,
		wait_ms : 8000,
		task_limit : 1,
		inputs : [
			["essence_of_rubeweed", 1],
			["tiny_bubble", 11],
			["krazy_salts", 3],
		],
		outputs : [
			["potion_keycutter_tonic", 1],
		],
	};

	this.recipes["245"] = {
		name : "Potion of Animal Youth",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 60, // manual override
		xp_reward : 235,
		wait_ms : 6000,
		task_limit : 1,
		inputs : [
			["essence_of_gandlevery", 3],
			["essence_of_purple", 1],
			["blue_bubble", 13],
			["guano", 3],
		],
		outputs : [
			["potion_animal_youth", 1],
		],
	};

	this.recipes["246"] = {
		name : "Ancestral Spirits",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 80, // manual override
		xp_reward : 250,
		wait_ms : 4000,
		task_limit : 1,
		inputs : [
			["essence_of_hairball", 2],
			["essence_of_silvertongue", 1],
			["essence_of_rubeweed", 1],
		],
		outputs : [
			["potion_ancestral_spirits", 1],
		],
	};

	this.recipes["247"] = {
		name : "Trantsformation Fluid",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 90, // manual override
		xp_reward : 275,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_rookswort", 2],
			["essence_of_yellow_crumb", 1],
			["essence_of_rubeweed", 1],
			["guano", 2],
		],
		outputs : [
			["potion_trantsformation_fluid", 1],
		],
	};

	this.recipes["248"] = {
		name : "Draught of Wisdom",
		skill : null,
		skills : [],
		achievements : [],
		tool : "cauldron",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 70, // manual override
		xp_reward : 350,
		wait_ms : 8000,
		task_limit : 1,
		inputs : [
			["essence_of_silvertongue", 3],
			["essence_of_gandlevery", 3],
			["essence_of_hairball", 1],
			["essence_of_purple", 1],
			["guano", 23],
		],
		outputs : [
			["potion_xp", 1],
		],
	};

	this.recipes["249"] = {
		name : "Rocky Regeneration Solution",
		skill : null,
		skills : [],
		achievements : [],
		tool : "cauldron",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 75, // manual override
		xp_reward : 375,
		wait_ms : 6000,
		task_limit : 3,
		inputs : [
			["essence_of_gandlevery", 7],
			["heavy_gas", 14],
			["hard_bubble", 14],
			["krazy_salts", 7],
		],
		outputs : [
			["potion_rocky_regeneration_solution", 1],
		],
	};

	this.recipes["250"] = {
		name : "Draught of Giant Amicability",
		skill : "potionmaking_3",
		skills : ["potionmaking_3"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 100, // manual override
		xp_reward : 400,
		wait_ms : 4000,
		task_limit : 1,
		inputs : [
			["essence_of_silvertongue", 2],
			["essence_of_yellow_crumb", 2],
			["essence_of_rubeweed", 1],
			["krazy_salts", 3],
		],
		outputs : [
			["potion_favor", 1],
		],
	};

	this.recipes["251"] = {
		name : "Spigot",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 60, // manual override
		xp_reward : 0,
		wait_ms : 3333,
		task_limit : 5,
		inputs : [
			["metal_rod", 1],
			["copper", 2],
		],
		outputs : [
			["spigot", 1],
		],
	};

	this.recipes["252"] = {
		name : "Chair",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 18,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["wood_post", 1],
			["board", 4],
			["snail", 4],
		],
		outputs : [
			["furniture_chair", 1],
		],
	};

	this.recipes["253"] = {
		name : "Board",
		skill : "woodworking_1",
		skills : ["woodworking_1"],
		achievements : [],
		tool : "woodworker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 1,
		wait_ms : 2500,
		task_limit : 40,
		inputs : [
			["plank", 4],
			["fuel_cell", 1],
		],
		outputs : [
			["board", 1],
		],
	};

	this.recipes["254"] = {
		name : "Still",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 200, // manual override
		xp_reward : 0,
		wait_ms : 5000,
		task_limit : 1,
		inputs : [
			["spigot", 1],
			["metal_rod", 5],
			["tin", 4],
			["board", 16],
		],
		outputs : [
			["still", 1],
		],
	};

	this.recipes["255"] = {
		name : "Storage Display Box",
		skill : "engineering_1",
		skills : ["engineering_1","furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 10,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["metal_rod", 2],
			["board", 4],
			["snail", 8],
		],
		outputs : [
			["bag_furniture_sdb", 1],
		],
	};

	this.recipes["256"] = {
		name : "Side Table",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 12,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["board", 4],
			["snail", 10],
		],
		outputs : [
			["furniture_sidetable", 1],
		],
	};

	this.recipes["257"] = {
		name : "Armchair",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 150, // manual override
		xp_reward : 40,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["general_fabric", 1],
			["wood_post", 1],
			["fiber", 70],
			["board", 4],
			["snail", 12],
		],
		outputs : [
			["furniture_armchair", 1],
		],
	};

	this.recipes["258"] = {
		name : "Bed",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 180, // manual override
		xp_reward : 64,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["general_fabric", 1],
			["fiber", 240],
			["wood_post", 3],
			["board", 8],
			["snail", 8],
		],
		outputs : [
			["furniture_bed", 1],
		],
	};

	this.recipes["259"] = {
		name : "Sofa",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 180, // manual override
		xp_reward : 60,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["general_fabric", 2],
			["fiber", 160],
			["wood_post", 2],
			["snail", 8],
			["plank", 8],
		],
		outputs : [
			["furniture_sofa", 1],
		],
	};

	this.recipes["260"] = {
		name : "Door",
		skill : "engineering_1",
		skills : ["engineering_1","furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 250, // manual override
		xp_reward : 100,
		wait_ms : 5000,
		task_limit : 5,
		inputs : [
			["wood_post", 8],
			["board", 16],
			["snail", 20],
		],
		outputs : [
			["furniture_door", 1],
		],
	};

	this.recipes["261"] = {
		name : "Wall Segment",
		skill : "engineering_1",
		skills : ["engineering_1","furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 150, // manual override
		xp_reward : 100,
		wait_ms : 5000,
		task_limit : 5,
		inputs : [
			["beam", 1],
			["wood_post", 4],
			["board", 12],
			["barnacle_talc", 15],
		],
		outputs : [
			["wall_segment", 1],
		],
	};

	this.recipes["262"] = {
		name : "Cabinet",
		skill : "engineering_1",
		skills : ["engineering_1","furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 200, // manual override
		xp_reward : 80,
		wait_ms : 5000,
		task_limit : 5,
		inputs : [
			["metal_post", 2],
			["wood_post", 2],
			["board", 12],
			["snail", 20],
		],
		outputs : [
			["bag_furniture_cabinet", 1],
		],
	};

	this.recipes["263"] = {
		name : "Bookcase",
		skill : null,
		skills : [],
		achievements : [],
		tool : "alchemical_tongs",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 180, // manual override
		xp_reward : 60,
		wait_ms : 5000,
		task_limit : 1,
		inputs : [
			["board", 20],
			["plank", 20],
			["snail", 40],
		],
		outputs : [
			["furniture_bookcase", 1],
		],
	};

	this.recipes["264"] = {
		name : "Wall Cabinet",
		skill : "engineering_1",
		skills : ["engineering_1","furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 180, // manual override
		xp_reward : 44,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["metal_post", 1],
			["metal_rod", 2],
			["board", 10],
			["snail", 12],
		],
		outputs : [
			["bag_furniture_wallcabinet", 1],
		],
	};

	this.recipes["265"] = {
		name : "Shelf",
		skill : "engineering_1",
		skills : ["engineering_1","furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 150, // manual override
		xp_reward : 30,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["metal_rod", 2],
			["board", 6],
			["snail", 12],
		],
		outputs : [
			["furniture_shelf", 1],
		],
	};

	this.recipes["266"] = {
		name : "Loveseat",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 180, // manual override
		xp_reward : 50,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["general_fabric", 1],
			["fiber", 80],
			["wood_post", 2],
			["board", 6],
			["snail", 8],
		],
		outputs : [
			["furniture_loveseat", 1],
		],
	};

	this.recipes["267"] = {
		name : "Table",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 180, // manual override
		xp_reward : 48,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["wood_post", 4],
			["board", 6],
			["snail", 8],
		],
		outputs : [
			["furniture_table", 1],
		],
	};

	this.recipes["268"] = {
		name : "Coffee Table",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 160, // manual override
		xp_reward : 44,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["wood_post", 2],
			["board", 12],
			["snail", 12],
		],
		outputs : [
			["furniture_coffeetable", 1],
		],
	};

	this.recipes["269"] = {
		name : "Desk",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 150, // manual override
		xp_reward : 42,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["metal_post", 1],
			["board", 8],
			["snail", 12],
		],
		outputs : [
			["furniture_desk", 1],
		],
	};

	this.recipes["270"] = {
		name : "Counter",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 125, // manual override
		xp_reward : 37,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["board", 18],
			["snail", 12],
		],
		outputs : [
			["furniture_counter", 1],
		],
	};

	this.recipes["271"] = {
		name : "Bench",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 150, // manual override
		xp_reward : 38,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["wood_post", 1],
			["board", 12],
			["snail", 16],
		],
		outputs : [
			["furniture_bench", 1],
		],
	};

	this.recipes["272"] = {
		name : "Room Decoration",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 125, // manual override
		xp_reward : 28,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["board", 12],
			["snail", 12],
		],
		outputs : [
			["furniture_roomdeco", 1],
		],
	};

	this.recipes["273"] = {
		name : "Hanging Decoration",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 100, // manual override
		xp_reward : 25,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["metal_rod", 2],
			["board", 6],
			["string", 1],
		],
		outputs : [
			["furniture_ceilingdeco", 1],
		],
	};

	this.recipes["274"] = {
		name : "Wall Decoration",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 60, // manual override
		xp_reward : 14,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["board", 4],
			["string", 1],
			["snail", 6],
		],
		outputs : [
			["furniture_walldeco", 1],
		],
	};

	this.recipes["275"] = {
		name : "Tabletop Decoration",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 30, // manual override
		xp_reward : 9,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["board", 4],
			["snail", 4],
		],
		outputs : [
			["furniture_tabledeco", 1],
		],
	};

	this.recipes["276"] = {
		name : "Stool",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 20, // manual override
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["board", 3],
			["snail", 2],
		],
		outputs : [
			["furniture_stool", 1],
		],
	};

	this.recipes["277"] = {
		name : "Wood Post",
		skill : "woodworking_1",
		skills : ["woodworking_1"],
		achievements : [],
		tool : "woodworker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 5,
		wait_ms : 10000,
		task_limit : 20,
		inputs : [
			["board", 4],
			["fuel_cell", 2],
		],
		outputs : [
			["wood_post", 1],
		],
	};

	this.recipes["278"] = {
		name : "Beam",
		skill : "woodworking_1",
		skills : ["woodworking_1"],
		achievements : [],
		tool : "woodworker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 30,
		wait_ms : 20000,
		task_limit : 10,
		inputs : [
			["wood_post", 4],
			["fuel_cell", 8],
		],
		outputs : [
			["beam", 1],
		],
	};

	this.recipes["279"] = {
		name : "Metal Rod",
		skill : "metalwork_1",
		skills : ["metalwork_1"],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 4,
		wait_ms : 10000,
		task_limit : 20,
		inputs : [
			["tin", 1],
			["plain_metal", 1],
			["fuel_cell", 1],
		],
		outputs : [
			["metal_rod", 1],
		],
	};

	this.recipes["280"] = {
		name : "Metal Bar",
		skill : "metalwork_1",
		skills : ["metalwork_1"],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 16,
		wait_ms : 20000,
		task_limit : 10,
		inputs : [
			["copper", 2],
			["tin", 3],
			["fuel_cell", 6],
		],
		outputs : [
			["metal_post", 1],
		],
	};

	this.recipes["281"] = {
		name : "Girder",
		skill : "metalwork_1",
		skills : ["metalwork_1"],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 0, // manual override
		xp_reward : 60,
		wait_ms : 30000,
		task_limit : 5,
		inputs : [
			["molybdenum", 8],
			["plain_metal", 12],
			["fuel_cell", 12],
		],
		outputs : [
			["girder", 1],
		],
	};

	this.recipes["282"] = {
		name : "Machine Stand",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 80, // manual override
		xp_reward : 0,
		wait_ms : 3333,
		task_limit : 1,
		inputs : [
			["metal_post", 1],
			["plain_metal", 1],
		],
		outputs : [
			["machine_stand", 1],
		],
	};

	this.recipes["283"] = {
		name : "Metalmaker Mechanism",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 120, // manual override
		xp_reward : 0,
		wait_ms : 3333,
		task_limit : 1,
		inputs : [
			["metal_post", 2],
			["molybdenum", 2],
		],
		outputs : [
			["metalmaker_mechanism", 1],
		],
	};

	this.recipes["284"] = {
		name : "Metalmaker Tooler",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 175, // manual override
		xp_reward : 0,
		wait_ms : 3333,
		task_limit : 1,
		inputs : [
			["metal_post", 2],
			["metal_rod", 2],
			["molybdenum", 2],
			["tin", 2],
		],
		outputs : [
			["metalmaker_tooler", 1],
		],
	};

	this.recipes["285"] = {
		name : "Blockmaker Chassis",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 100, // manual override
		xp_reward : 0,
		wait_ms : 3333,
		task_limit : 1,
		inputs : [
			["metal_post", 3],
		],
		outputs : [
			["blockmaker_chassis", 1],
		],
	};

	this.recipes["286"] = {
		name : "Blockmaker Plates",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 150, // manual override
		xp_reward : 0,
		wait_ms : 3333,
		task_limit : 1,
		inputs : [
			["metal_post", 2],
			["metal_rod", 1],
		],
		outputs : [
			["blockmaker_plates", 1],
		],
	};

	this.recipes["287"] = {
		name : "Cauldron",
		skill : null,
		skills : [],
		achievements : [],
		tool : "metalmaker",
		tool_wear : 0,
		learnt : 3,
		energy_cost : 250, // manual override
		xp_reward : 0,
		wait_ms : 3333,
		task_limit : 1,
		inputs : [
			["metal_post", 5],
			["molybdenum", 4],
			["metal_rod", 3],
		],
		outputs : [
			["cauldron", 1],
		],
	};

	this.recipes["288"] = {
		name : "Pi",
		skill : null,
		skills : [],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 2,
		energy_cost : 14, // manual override
		xp_reward : 6,
		wait_ms : 5000,
		task_limit : 5,
		inputs : [
			["flour", 14],
			["butterfly_butter", 7],
			["older_spice", 3],
			["tiite", 22],
		],
		outputs : [
			["pi", 1],
		],
	};

	this.recipes["289"] = {
		name : "Table Lamp",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 22,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_fabric", 1],
			["metal_rod", 1],
			["bulb", 1],
		],
		outputs : [
			["furniture_tablelamp", 1],
		],
	};

	this.recipes["290"] = {
		name : "Wall Lamp",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 24,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_fabric", 1],
			["metal_rod", 1],
			["bulb", 1],
			["snail", 4],
		],
		outputs : [
			["furniture_walllamp", 1],
		],
	};

	this.recipes["291"] = {
		name : "Ceiling Lamp",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 100, // manual override
		xp_reward : 27,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_fabric", 1],
			["metal_rod", 1],
			["bulb", 1],
			["snail", 8],
		],
		outputs : [
			["furniture_ceilinglamp", 1],
		],
	};

	this.recipes["292"] = {
		name : "Floor Lamp",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 150, // manual override
		xp_reward : 32,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["general_fabric", 1],
			["metal_rod", 2],
			["bulb", 1],
			["snail", 4],
		],
		outputs : [
			["furniture_floorlamp", 1],
		],
	};

	this.recipes["294"] = {
		name : "String",
		skill : "fiber_arts_2",
		skills : ["fiber_arts_2"],
		achievements : [],
		tool : "loomer",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // manual override
		xp_reward : 2,
		wait_ms : 2000,
		task_limit : 20,
		inputs : [
			["thread", 5],
		],
		outputs : [
			["string", 1],
		],
	};

	this.recipes["295"] = {
		name : "General Fabric",
		skill : "fiber_arts_2",
		skills : ["fiber_arts_2"],
		achievements : [],
		tool : "loomer",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 32, // manual override
		xp_reward : 10,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["thread", 21],
		],
		outputs : [
			["general_fabric", 1],
		],
	};

	this.recipes["296"] = {
		name : "Rug",
		skill : "fiber_arts_2",
		skills : ["fiber_arts_2"],
		achievements : [],
		tool : "loomer",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 125, // manual override
		xp_reward : 35,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["general_fabric", 2],
			["string", 2],
		],
		outputs : [
			["furniture_rug", 1],
		],
	};

	this.recipes["297"] = {
		name : "Small Cabinet",
		skill : "engineering_1",
		skills : ["engineering_1","furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 175, // manual override
		xp_reward : 54,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["metal_post", 1],
			["wood_post", 2],
			["board", 10],
			["snail", 12],
		],
		outputs : [
			["bag_furniture_smallcabinet", 1],
		],
	};

	this.recipes["298"] = {
		name : "Face Smelter",
		skill : "cocktailcrafting_2",
		skills : ["cocktailcrafting_2"],
		achievements : [],
		tool : "cocktail_shaker",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 16, // manual override
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["parsnip", 2],
			["onion_sauce", 1],
			["hooch", 1],
			["crying_gas", 1],
		],
		outputs : [
			["face_smelter", 1],
		],
	};

	this.recipes["299"] = {
		name : "Spindle",
		skill : "tinkering_4",
		skills : ["tinkering_4"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 20,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["wood_post", 1],
		],
		outputs : [
			["spindle", 1],
		],
	};

	this.recipes["300"] = {
		name : "Ace of Spades",
		skill : "soil_appreciation_5",
		skills : ["soil_appreciation_5","tinkering_5"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 100, // manual override
		xp_reward : 80,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["metal_post", 4],
			["molybdenum", 6],
			["wood_post", 1],
		],
		outputs : [
			["ace_of_spades", 1],
		],
	};

	this.recipes["301"] = {
		name : "Class Axe",
		skill : "tinkering_5",
		skills : ["tinkering_5","engineering_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 50, // manual override
		xp_reward : 40,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["metal_post", 1],
			["molybdenum", 3],
		],
		outputs : [
			["class_axe", 1],
		],
	};

	this.recipes["302"] = {
		name : "Splendid Spindle",
		skill : "tinkering_5",
		skills : ["tinkering_5","fiber_arts_1"],
		achievements : [],
		tool : "tinkertool",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 60,
		wait_ms : 10000,
		task_limit : 1,
		inputs : [
			["metal_post", 3],
			["molybdenum", 2],
			["tin", 4],
		],
		outputs : [
			["splendid_spindle", 1],
		],
	};

	this.recipes["303"] = {
		name : "Note Pole",
		skill : "furnituremaking_1",
		skills : ["furnituremaking_1"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 50, // manual override
		xp_reward : 24,
		wait_ms : 3000,
		task_limit : 20,
		inputs : [
			["wood_post", 1],
			["metal_rod", 2],
			["snail", 4],
			["plank", 2],
		],
		outputs : [
			["note_pole", 1],
		],
	};

	this.recipes["304"] = {
		name : "Plain Crystal",
		skill : null,
		skills : [],
		achievements : [],
		tool : "crystallizer",
		tool_wear : 25,
		learnt : 2,
		energy_cost : 134, // 1/6 of input cost, 805
		xp_reward : 0,
		wait_ms : 5000,
		task_limit : 1,
		inputs : [
			["barnacle_talc", 7],
			["firefly_jar", 7],
		],
		outputs : [
			["plain_crystal", 1],
		],
	};

	this.recipes["305"] = {
		name : "Batterfly Bounty Booster Bar",
		skill : null,
		skills : [],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 3,
		energy_cost : 33, // 1/6 of input cost, 196
		xp_reward : 5,
		wait_ms : 3000,
		task_limit : 1,
		inputs : [
			["grain", 20],
			["oats", 5],
			["hot_pepper", 7],
			["cumin", 5],
			["plum", 5],
			["hot_n_fizzy_sauce", 1],
			["olive_oil", 1],
		],
		outputs : [
			["batterfly_bar", 1],
		],
	};

	this.recipes["306"] = {
		name : "Embiggenifying Potion",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 150,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_purple", 1],
			["heavy_gas", 3],
			["laughing_gas", 7],
		],
		outputs : [
			["potion_avatar_large", 1],
		],
	};

	this.recipes["307"] = {
		name : "Phreaky Philter",
		skill : null,
		skills : [],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 3,
		energy_cost : 50, // manual override
		xp_reward : 350,
		wait_ms : 6000,
		task_limit : 1,
		inputs : [
			["essence_of_purple", 2],
			["essence_of_yellow_crumb", 2],
			["krazy_salts", 3],
			["laughing_gas", 7],
		],
		outputs : [
			["potion_avatar_mixup", 1],
		],
	};

	this.recipes["308"] = {
		name : "Soak-All Solution",
		skill : "potionmaking_3",
		skills : ["potionmaking_3"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 60, // manual override
		xp_reward : 300,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_gandlevery", 3],
			["essence_of_silvertongue", 2],
			["blue_bubble", 11],
			["crying_gas", 5],
		],
		outputs : [
			["potion_garden_water", 1],
		],
	};

	this.recipes["309"] = {
		name : "Seed-Dibber Libation",
		skill : "potionmaking_3",
		skills : ["potionmaking_3"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 70, // manual override
		xp_reward : 325,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_gandlevery", 2],
			["essence_of_yellow_crumb", 2],
			["tiny_bubble", 5],
			["heavy_gas", 1],
		],
		outputs : [
			["potion_garden_plant", 1],
		],
	};

	this.recipes["310"] = {
		name : "Manyharvest Cordial",
		skill : "potionmaking_3",
		skills : ["potionmaking_3"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 350,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_silvertongue", 2],
			["essence_of_rubeweed", 2],
			["helium", 5],
			["hard_bubble", 11],
		],
		outputs : [
			["potion_garden_harvest", 1],
		],
	};

	this.recipes["311"] = {
		name : "Liquid Super-Hoe",
		skill : "potionmaking_3",
		skills : ["potionmaking_3"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 60, // manual override
		xp_reward : 300,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_hairball", 1],
			["essence_of_rookswort", 1],
			["white_gas", 5],
			["hard_bubble", 5],
		],
		outputs : [
			["potion_garden_clear", 1],
		],
	};

}
this.set_catalog_recipes_3();

function set_catalog_recipes_4(){
	this.recipes["312"] = {
		name : "De-Embiggenifying Potion",
		skill : "potionmaking_2",
		skills : ["potionmaking_2"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 40, // manual override
		xp_reward : 150,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_purple", 1],
			["helium", 5],
			["tiny_bubble", 11],
		],
		outputs : [
			["potion_avatar_small", 1],
		],
	};

	this.recipes["313"] = {
		name : "Dung-Kicker Drops",
		skill : "potionmaking_3",
		skills : ["potionmaking_3"],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 80, // manual override
		xp_reward : 325,
		wait_ms : 4000,
		task_limit : 3,
		inputs : [
			["essence_of_hairball", 1],
			["essence_of_gandlevery", 1],
			["crying_gas", 5],
			["guano", 50],
		],
		outputs : [
			["potion_garden_fertilize", 1],
		],
	};

	this.recipes["314"] = {
		name : "Blue Sno Cone",
		skill : "blending_1",
		skills : ["blending_1"],
		achievements : [],
		tool : "blender",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 6, // manual override
		xp_reward : 10,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["ice", 2],
			["hooch", 1],
			["element_blue", 89],
			["paper", 2],
		],
		outputs : [
			["sno_cone_blue", 1],
		],
	};

	this.recipes["315"] = {
		name : "Green Sno Cone",
		skill : "blending_1",
		skills : ["blending_1"],
		achievements : [],
		tool : "blender",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 12, // manual override
		xp_reward : 13,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["ice", 2],
			["hooch", 2],
			["element_green", 277],
			["paper", 2],
		],
		outputs : [
			["sno_cone_green", 1],
		],
	};

	this.recipes["316"] = {
		name : "Orange Sno Cone",
		skill : "blending_1",
		skills : ["blending_1"],
		achievements : [],
		tool : "blender",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 23, // manual override
		xp_reward : 18,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["ice", 3],
			["hooch", 2],
			["element_red", 577],
			["element_green", 409],
			["paper", 2],
		],
		outputs : [
			["sno_cone_orange", 1],
		],
	};

	this.recipes["317"] = {
		name : "Red Sno Cone",
		skill : "blending_2",
		skills : ["blending_2"],
		achievements : [],
		tool : "blender",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 47, // manual override
		xp_reward : 25,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["ice", 4],
			["hooch", 2],
			["element_red", 997],
			["element_shiny", 499],
			["paper", 2],
		],
		outputs : [
			["sno_cone_red", 1],
		],
	};

	this.recipes["318"] = {
		name : "Purple Sno Cone",
		skill : "blending_2",
		skills : ["blending_2"],
		achievements : [],
		tool : "blender",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 85, // manual override
		xp_reward : 33,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["ice", 5],
			["hooch", 3],
			["element_red", 977],
			["element_blue", 977],
			["element_shiny", 409],
			["paper", 2],
		],
		outputs : [
			["sno_cone_purple", 1],
		],
	};

	this.recipes["319"] = {
		name : "Rainbo Sno Cone",
		skill : "blending_2",
		skills : ["blending_2"],
		achievements : [],
		tool : "blender",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 111, // manual override
		xp_reward : 50,
		wait_ms : 2000,
		task_limit : 10,
		inputs : [
			["sno_cone_blue", 1],
			["sno_cone_green", 1],
			["sno_cone_orange", 1],
			["sno_cone_red", 1],
			["sno_cone_purple", 1],
			["paper", 3],
		],
		outputs : [
			["sno_cone_rainbow", 1],
		],
	};

	this.recipes["320"] = {
		name : "Alphabet Sauce",
		skill : null,
		skills : [],
		achievements : [],
		tool : "cauldron",
		tool_wear : 2,
		learnt : 3,
		energy_cost : 30, // manual override
		xp_reward : 75,
		wait_ms : 2000,
		task_limit : 11,
		inputs : [
			["essence_of_silvertongue", 1],
			["helium", 2],
			["rubemycin", 6],
		],
		outputs : [
			["potion_alphabet_sauce", 1],
		],
	};

	this.recipes["321"] = {
		name : "Fireplace",
		skill : "furnituremaking_2",
		skills : ["furnituremaking_2"],
		achievements : [],
		tool : "construction_tool",
		tool_wear : 2,
		learnt : 1,
		energy_cost : 200, // manual override
		xp_reward : 75,
		wait_ms : 3000,
		task_limit : 10,
		inputs : [
			["board", 16],
			["firefly_jar", 7],
			["dullite", 120],
			["barnacle_talc", 16],
		],
		outputs : [
			["furniture_fireplace", 1],
		],
	};

	this.recipes["322"] = {
		name : "King of Condiments",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 2, // manual override
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["pinch_of_salt", 3],
			["black_pepper", 2],
		],
		outputs : [
			["kings_of_condiments", 1],
		],
	};

	this.recipes["323"] = {
		name : "Legumes Abbassidienne",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // manual override
		xp_reward : 4,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["bean_plain", 17],
		],
		outputs : [
			["legumes_parisienne", 1],
		],
	};

	this.recipes["324"] = {
		name : "Hototot Rub",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 7, // manual override
		xp_reward : 7,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cumin", 2],
			["saffron", 1],
			["turmeric", 1],
			["curry", 3],
		],
		outputs : [
			["hototot_rub", 1],
		],
	};

	this.recipes["325"] = {
		name : "Swing Batter",
		skill : "ezcooking_1",
		skills : ["ezcooking_1"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // manual override
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["flour", 1],
			["egg_plain", 1],
			["butterfly_butter", 1],
		],
		outputs : [
			["swing_batter", 1],
		],
	};

	this.recipes["326"] = {
		name : "Desssert Rub",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 9, // manual override
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["cinnamon", 3],
			["cardamom", 1],
			["nutmeg", 1],
			["licorice", 1],
		],
		outputs : [
			["desssert_rub", 1],
		],
	};

	this.recipes["327"] = {
		name : "Naraka Flame Rub",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 10, // manual override
		xp_reward : 10,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["ginger", 3],
			["hot_pepper", 8],
			["mustard", 2],
			["garlic", 2],
		],
		outputs : [
			["naraka_flame_rub", 1],
		],
	};

	this.recipes["328"] = {
		name : "Trump Rub",
		skill : "ezcooking_2",
		skills : ["ezcooking_2"],
		achievements : [],
		tool : "knife_and_board",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 15, // manual override
		xp_reward : 11,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["camphor", 1],
			["older_spice", 1],
			["turmeric", 1],
			["cardamom", 1],
			["nutmeg", 1],
			["saffron", 1],
		],
		outputs : [
			["trump_rub", 1],
		],
	};

	this.recipes["329"] = {
		name : "Death to Veg",
		skill : "cheffery_1",
		skills : ["cheffery_1"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // manual override
		xp_reward : 7,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["tomato", 2],
			["spinach", 3],
			["onion", 1],
			["zucchini", 1],
		],
		outputs : [
			["death_to_veg", 1],
		],
	};

	this.recipes["330"] = {
		name : "Glitchepoix",
		skill : "cheffery_1",
		skills : ["cheffery_1"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // manual override
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["onion", 2],
			["carrot", 2],
			["cabbage", 1],
			["zucchini", 1],
		],
		outputs : [
			["glitchepoix", 1],
		],
	};

	this.recipes["331"] = {
		name : "Urfu",
		skill : "cheffery_2",
		skills : ["cheffery_2"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 7, // manual override
		xp_reward : 10,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["legumes_parisienne", 1],
			["older_spice", 1],
		],
		outputs : [
			["urfu", 1],
		],
	};

	this.recipes["332"] = {
		name : "Salmon Jaella",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 22, // manual override
		xp_reward : 16,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["proper_rice", 1],
			["salmon", 3],
			["legumes_parisienne", 1],
			["glitchepoix", 1],
		],
		outputs : [
			["salmon_jaella", 1],
		],
	};

	this.recipes["333"] = {
		name : "Kind BreakfURst Burrito (TM)",
		skill : "cheffery_3",
		skills : ["cheffery_3"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 28, // manual override
		xp_reward : 17,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["tortilla", 1],
			["legumes_parisienne", 1],
			["green", 1],
			["hototot_rub", 1],
		],
		outputs : [
			["kind_breakfurst_burrito", 1],
		],
	};

	this.recipes["334"] = {
		name : "Roux",
		skill : "saucery_1",
		skills : ["saucery_1"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 3, // manual override
		xp_reward : 8,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["butterfly_butter", 1],
			["flour", 1],
		],
		outputs : [
			["roux", 1],
		],
	};

	this.recipes["335"] = {
		name : "Red",
		skill : "saucery_1",
		skills : ["saucery_1"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 4, // manual override
		xp_reward : 9,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["tomato", 2],
			["onion", 1],
			["milk_butterfly", 1],
		],
		outputs : [
			["red", 1],
		],
	};

	this.recipes["336"] = {
		name : "Stock sauce",
		skill : "saucery_1",
		skills : ["saucery_1"],
		achievements : [],
		tool : "saucepan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 5, // manual override
		xp_reward : 9,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["meat", 1],
			["flour", 1],
			["milk_butterfly", 1],
		],
		outputs : [
			["stock_sauce", 1],
		],
	};

	this.recipes["337"] = {
		name : "Green",
		skill : "grilling_1",
		skills : ["grilling_1"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 6, // manual override
		xp_reward : 14,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["broccoli", 2],
			["cucumber", 2],
			["spinach", 3],
			["cabbage", 1],
		],
		outputs : [
			["green", 1],
		],
	};

	this.recipes["338"] = {
		name : "Vegmageddon",
		skill : "grilling_1",
		skills : ["grilling_1"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 11, // manual override
		xp_reward : 16,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["corn", 3],
			["parsnip", 3],
			["carrot", 3],
			["broccoli", 2],
		],
		outputs : [
			["vegmageddon", 1],
		],
	};

	this.recipes["339"] = {
		name : "Pottine",
		skill : "grilling_1",
		skills : ["grilling_1"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 25, // manual override
		xp_reward : 20,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["potato", 4],
			["wavy_gravy", 1],
			["cheese_stinky", 1],
			["olive_oil", 1],
		],
		outputs : [
			["pottine", 1],
		],
	};

	this.recipes["340"] = {
		name : "Maburger Royale",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 25, // manual override
		xp_reward : 20,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["urfu", 1],
			["bun", 1],
			["cheese_very_stinky", 1],
			["death_to_veg", 1],
		],
		outputs : [
			["maburger_royale", 1],
		],
	};

	this.recipes["341"] = {
		name : "Hot Potatoes",
		skill : "masterchef_1",
		skills : ["masterchef_1"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 8, // manual override
		xp_reward : 19,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["potato", 6],
			["pinch_of_salt", 2],
		],
		outputs : [
			["hot_potatoes", 1],
		],
	};

	this.recipes["342"] = {
		name : "Potcorn",
		skill : "masterchef_1",
		skills : ["masterchef_1"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 11, // manual override
		xp_reward : 20,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["corn", 3],
			["olive_oil", 2],
			["potoxin", 3],
			["paper", 2],
		],
		outputs : [
			["potcorn", 1],
		],
	};

	this.recipes["343"] = {
		name : "Pad Tii",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 33, // manual override
		xp_reward : 30,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["plain_noodles", 2],
			["urfu", 1],
			["egg_plain", 2],
			["naraka_flame_rub", 1],
		],
		outputs : [
			["pad_tii", 1],
		],
	};

	this.recipes["344"] = {
		name : "Swank Zucchini Loaf",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 32, // manual override
		xp_reward : 22,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["zucchini", 4],
			["swing_batter", 1],
			["olive_oil", 2],
			["trump_rub", 1],
		],
		outputs : [
			["swank_zucchini_loaf", 1],
		],
	};

	this.recipes["345"] = {
		name : "Heston Mash",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 43, // manual override
		xp_reward : 32,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hot_potatoes", 2],
			["wavy_gravy", 1],
			["kings_of_condiments", 1],
			["garlic", 2],
		],
		outputs : [
			["heston_mash", 1],
		],
	};

	this.recipes["346"] = {
		name : "Luxury Tortellini",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 54, // manual override
		xp_reward : 34,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["plain_noodles", 2],
			["cheese_very_very_stinky", 2],
			["wicked_bolognese_sauce", 1],
			["green", 3],
		],
		outputs : [
			["luxury_tortellini", 1],
		],
	};

	this.recipes["347"] = {
		name : "Precious Potato Salad",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 61, // manual override
		xp_reward : 35,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["hot_potatoes", 2],
			["vegmageddon", 1],
			["trump_rub", 1],
			["stock_sauce", 2],
		],
		outputs : [
			["precious_potato_salad", 1],
		],
	};

	this.recipes["348"] = {
		name : "Hungry Nachos",
		skill : "grilling_2",
		skills : ["grilling_2"],
		achievements : [],
		tool : "mike_tyson_grill",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 36, // manual override
		xp_reward : 23,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["tortilla", 3],
			["cheezy_sauce", 1],
			["legumes_parisienne", 1],
			["death_to_veg", 1],
		],
		outputs : [
			["hungry_nachos", 1],
		],
	};

	this.recipes["349"] = {
		name : "Potian's Feast",
		skill : "masterchef_2",
		skills : ["masterchef_2"],
		achievements : [],
		tool : "awesome_pot",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 75, // manual override
		xp_reward : 44,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["ixstyle_braised_meat", 1],
			["vegmageddon", 1],
			["heston_mash", 1],
		],
		outputs : [
			["potians_feast", 1],
		],
	};

	this.recipes["350"] = {
		name : "Onion Rings",
		skill : "cheffery_2",
		skills : ["cheffery_2"],
		achievements : [],
		tool : "frying_pan",
		tool_wear : 1,
		learnt : 1,
		energy_cost : 6, // 1/6 of input cost, 35
		xp_reward : 6,
		wait_ms : 2000,
		task_limit : 40,
		inputs : [
			["onion", 1],
			["swing_batter", 1],
		],
		outputs : [
			["onion_rings", 1],
		],
	};

}
this.set_catalog_recipes_4();


// generated ok
