import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useTrackerStore = defineStore('tracker', () => {
	const startingLocations = {
		random: 4294967295,
		goomba_village: 257,
		toad_town: 65796,
		dry_dry_outpost: 590080,
		yoshi_village: 1114882
	};

	const items = reactive({
		stars: {
			eldstar: {
				name: 'Eldstar',
				enabled: true,
				max: 1
			},
			mamar: {
				name: 'Mamar',
				enabled: true,
				max: 1
			},
			skolar: {
				name: 'Skolar',
				enabled: true,
				max: 1
			},
			muskular: {
				name: 'Muskular',
				enabled: true,
				max: 1
			},
			misstar: {
				name: 'Misstar',
				enabled: true,
				max: 1
			},
			klevar: {
				name: 'Klevar',
				enabled: true,
				max: 1
			},
			kalmar: {
				name: 'Kalmar',
				enabled: true,
				max: 1
			},
			starrod: {
				name: 'Star Rod',
				enabled: true,
				max: 1
			},
			power_stars: {
				name: 'Power Stars',
				enabled: false,
				max: 120
			}
		},
		partners: {
			goombario: {
				name: 'Goombario',
				enabled: true,
				max: 1
			},
			kooper: {
				name: 'Kooper',
				enabled: true,
				max: 1
			},
			bombette: {
				name: 'Bombette',
				enabled: true,
				max: 1
			},
			parakarry: {
				name: 'Parakarry',
				enabled: true,
				max: 1
			},
			bow: {
				name: 'Bow',
				enabled: true,
				max: 1
			},
			watt: {
				name: 'Watt',
				enabled: true,
				max: 1
			},
			sushie: {
				name: 'Sushie',
				enabled: true,
				max: 1
			},
			lakilester: {
				name: 'Lakilester',
				enabled: true,
				max: 1
			},
			ultra_stone: {
				name: 'Ultra Stone',
				enabled: true,
				max: 1
			}
		},
		equipments: {
			boots: {
				name: ['Jumpless', 'Boots', 'Super Boots', 'Ultra Boots'],
				enabled: true,
				max: 3
			},
			hammer: {
				name: ['Hammerless', 'Hammer', 'Super Hammer', 'Ultra Hammer'],
				enabled: true,
				max: 3
			}
		},
		items: {
			prologue: {
				dolly: {
					name: 'Dolly',
					enabled: true,
					max: 1,
					required: false
				}
			},
			chapter1: {
				fortress_key: {
					name: 'Fortress Key',
					enabled: true,
					max: 4,
					required: true
				},
				kooper_shell: {
					name: 'Kooper Shell',
					enabled: true,
					max: 1,
					required: false
				}
			},
			chapter2: {
				parakarry_letters: {
					name: "Parakarry's Letters",
					enabled: true,
					max: 3,
					required: false
				},
				pulse_stone: {
					name: 'Pulse Stone',
					enabled: true,
					max: 1,
					required: true
				},
				pyramid_stone: {
					name: 'Pyramid Stone',
					enabled: true,
					max: 1,
					required: true
				},
				diamond_stone: {
					name: 'Diamond Stone',
					enabled: true,
					max: 1,
					required: true
				},
				lunar_stone: {
					name: 'Lunar Stone',
					enabled: true,
					max: 1,
					required: true
				},
				ruins_key: {
					name: 'Ruins Key',
					enabled: true,
					max: 4,
					required: true
				},
				artifact: {
					name: 'Artifact',
					enabled: true,
					max: 1,
					required: false
				}
			},
			chapter3: {
				forest_pass: {
					name: 'Forest Pass',
					enabled: true,
					max: 1,
					required: false
				},
				record: {
					name: 'Record',
					enabled: true,
					max: 1,
					required: false
				},
				weight: {
					name: 'Weight',
					enabled: true,
					max: 1,
					required: false
				},
				boo_portrait: {
					name: "Boo's Portrait",
					enabled: true,
					max: 1,
					required: true
				},
				tubba_castle_key: {
					name: 'Tubba Castle Key',
					enabled: true,
					max: 3,
					required: true
				}
			},
			chapter4: {
				toy_train: {
					name: 'Toy Train',
					enabled: true,
					max: 1,
					required: true
				},
				calculator: {
					name: 'Calculator',
					enabled: true,
					max: 1,
					required: false
				},
				frying_pan: {
					name: 'Frying Pan',
					enabled: true,
					max: 1,
					required: false
				},
				mailbag: {
					name: 'Mailbag',
					enabled: true,
					max: 1,
					required: false
				},
				dictionary: {
					name: 'Dictionary',
					enabled: true,
					max: 1,
					required: true
				},
				cake: {
					name: 'Cake (Cook a Cake Mix)',
					enabled: true,
					max: 1,
					required: true
				},
				cookbook: {
					name: 'Cookbook',
					enabled: true,
					max: 1,
					required: false
				},
				mystery_note: {
					name: 'Mystery Note',
					enabled: true,
					max: 1,
					required: true
				},
				anti_guy: {
					name: 'Anti Guy (Cake Mix + Lemon for Lemon Candy available)',
					enabled: true,
					max: 1,
					required: true
				}
			},
			chapter5: {
				jade_raven: {
					name: 'Jade Raven',
					enabled: true,
					max: 1,
					required: true
				},
				volcano_vase: {
					name: 'Volcano Vase',
					enabled: true,
					max: 1,
					required: true
				}
			},
			chapter6: {
				pink_magical_seed: {
					name: 'Red Magical Seed',
					enabled: true,
					max: 1,
					required: true
				},
				purple_magical_seed: {
					name: 'Purple Magical Seed',
					enabled: true,
					max: 1,
					required: true
				},
				green_magical_seed: {
					name: 'Blue Magical Seed',
					enabled: true,
					max: 1,
					required: true
				},
				yellow_magical_seed: {
					name: 'Yellow Magical Seed',
					enabled: true,
					max: 1,
					required: true
				},
				red_berry: {
					name: 'Red Berry',
					enabled: true,
					max: 1,
					required: false,
					initial: 'R'
				},
				yellow_berry: {
					name: 'Yellow Berry',
					enabled: true,
					max: 1,
					required: false,
					initial: 'Y'
				},
				blue_berry: {
					name: 'Blue Berry',
					enabled: true,
					max: 2,
					required: false,
					initial: 'B'
				},
				bubble_berry: {
					name: 'Bubble Berry',
					enabled: true,
					max: 1,
					required: false
				},
				crystal_berry: {
					name: 'Crystal Berry',
					enabled: true,
					max: 1,
					required: false
				},
				water_stone: {
					name: 'Water Stone',
					enabled: true,
					max: 1,
					required: false
				},
				magical_bean: {
					name: 'Magical Bean',
					enabled: true,
					max: 1,
					required: true
				},
				fertile_soil: {
					name: 'Fertile Soil',
					enabled: true,
					max: 1,
					required: true
				},
				miracle_water: {
					name: 'Miracle Water',
					enabled: true,
					max: 1,
					required: true
				}
			},
			chapter7: {
				warehouse_key: {
					name: 'Warehouse Key',
					enabled: true,
					max: 1,
					required: true,
					initial: 'W'
				},
				scarf: {
					name: 'Scarf',
					enabled: true,
					max: 1,
					required: true
				},
				bucket: {
					name: 'Bucket',
					enabled: true,
					max: 1,
					required: true
				},
				star_stone: {
					name: 'Star Stone',
					enabled: true,
					max: 1,
					required: true
				},
				red_key: {
					name: 'Red Key',
					enabled: true,
					max: 1,
					required: true,
					initial: 'R'
				},
				blue_key: {
					name: 'Blue Key',
					enabled: true,
					max: 1,
					required: false,
					initial: 'B'
				},
				palace_key: {
					name: 'Palace Key',
					enabled: true,
					max: 1,
					required: true
				}
			},
			chapter8: {
				prison_key: {
					name: 'Prison Key',
					enabled: true,
					max: 2,
					required: true
				},
				castle_key: {
					name: "Bowser's Castle Key",
					enabled: true,
					max: 5,
					required: true
				}
			},
			other: {
				lyrics: {
					name: 'Lyrics',
					enabled: true,
					max: 1,
					required: false,
					initial: 'L'
				},
				melody: {
					name: 'Melody',
					enabled: true,
					max: 1,
					required: false,
					initial: 'M'
				},
				odd_key: {
					name: 'Odd Key',
					enabled: true,
					max: 1,
					required: false,
					initial: 'O'
				},
				storeroom_key: {
					name: 'Storeroom Key',
					enabled: true,
					max: 1,
					required: false,
					initial: 'S'
				}
			}
		},
		letters: {
			prologue: {
				goompa: {
					name: 'Goompa',
					enabled: true,
					max: 1,
					required: false
				},
				goompapa: {
					name: 'Goompapa',
					enabled: true,
					max: 2,
					required: false
				}
			},
			toad_town: {
				merlon: {
					name: 'Merlon',
					enabled: true,
					max: 1,
					required: false
				},
				merlow: {
					name: 'Merlow',
					enabled: true,
					max: 1,
					required: false
				},
				muss_t: {
					name: 'Muss T.',
					enabled: true,
					max: 1,
					required: false
				},
				fice_t: {
					name: 'Fice T.',
					enabled: true,
					max: 1,
					required: false
				},
				russ_t: {
					name: 'Russ T.',
					enabled: true,
					max: 1,
					required: false
				},
				minh_t: {
					name: 'Minh T.',
					enabled: true,
					max: 1,
					required: false
				},
				miss_t: {
					name: 'Miss T.',
					enabled: true,
					max: 1,
					required: false
				},
				fishmael: {
					name: 'Fishmael',
					enabled: true,
					max: 1,
					required: false
				},
				dane_t: {
					name: 'Dane T.',
					enabled: true,
					max: 2,
					required: false
				}
			},
			chapter1: {
				kolorado: {
					name: 'Kolorado',
					enabled: true,
					max: 1,
					required: false
				},
				mort_t: {
					name: 'Mort T.',
					enabled: true,
					max: 1,
					required: false
				},
				koover: {
					name: 'Koover',
					enabled: true,
					max: 2,
					required: false
				}
			},
			chapter2: {
				nomadimouse: {
					name: 'Nomadimouse',
					enabled: true,
					max: 1,
					required: false
				},
				little_mouser: {
					name: 'Little Mouser (Dry Dry Shop)',
					enabled: true,
					max: 1,
					required: false
				},
				mr_e: {
					name: 'Mr. E',
					enabled: true,
					max: 1,
					required: false
				}
			},
			chapter3: {
				igor: {
					name: 'Igor',
					enabled: true,
					max: 1,
					required: false
				},
				franky: {
					name: 'Franky',
					enabled: true,
					max: 1,
					required: false
				}
			},
			chapter6: {
				red_yoshi_kid: {
					name: 'Red Yoshi Kid',
					enabled: true,
					max: 1,
					required: false
				}
			},
			chapter7: {
				mayor_penguin: {
					name: 'Mayor Penguin',
					enabled: true,
					max: 1,
					required: false
				},
				frost_t: {
					name: 'Frost T.',
					enabled: true,
					max: 1,
					required: false
				}
			}
		},
		misc: {
			chuck_quizmo: {
				name: 'Chuck Quizmo',
				enabled: true,
				max: 16,
				required: true
			},
			star_pieces: {
				name: 'Star Pieces',
				enabled: true,
				max: 96,
				required: true
			},
			rip_cheato: {
				name: 'Rip Cheato',
				enabled: true,
				max: 11,
				required: false
			}
		},
		koopa_koot_favors: {
			koopa_legends: {
				name: 'Koopa Legends',
				enabled: true,
				max: 1,
				required: false
			},
			sleepy_sheep: {
				name: 'Sleepy Sheep (Red/Yellow/Blue Berry + Strange Leaf)',
				enabled: true,
				max: 1,
				required: false
			},
			tape: {
				name: 'Tape',
				enabled: true,
				max: 1,
				required: false
			},
			koopa_tea: {
				name: 'Koopa Tea (Koopa Leaf)',
				enabled: true,
				max: 1,
				required: false
			},
			luigi_autograph: {
				name: "Luigi's Autograph",
				enabled: true,
				max: 1,
				required: false
			},
			empty_wallet: {
				name: 'Empty Wallet',
				enabled: true,
				max: 1,
				required: false
			},
			tasty_tonic: {
				name: 'Tasty Tonic (Red/Yellow/Blue Berry + Honey Syrup)',
				enabled: true,
				max: 1,
				required: false
			},
			crystal_ball: {
				name: 'Crystal Ball',
				enabled: true,
				max: 1,
				required: false
			},
			merluvlee_autograph: {
				name: "Merluvlee's Autograph",
				enabled: true,
				max: 1,
				required: false
			},
			life_shroom: {
				name: 'Life Shroom (Super Shroom or better + Koopa Leaf/Goomnut/Strange Leaf)',
				enabled: true,
				max: 1,
				required: false
			},
			nutty_cake: {
				name: 'Nutty Cake (Goomnut)',
				enabled: true,
				max: 1,
				required: false
			},
			old_photo: {
				name: 'Old Photo',
				enabled: true,
				max: 1,
				required: false
			},
			koopasta: {
				name: 'Koopasta (Dried Pasta + Koopa Leaf)',
				enabled: true,
				max: 1,
				required: false
			},
			glasses: {
				name: 'Glasses',
				enabled: true,
				max: 1,
				required: false
			},
			lime: {
				name: 'Lime',
				enabled: true,
				max: 1,
				required: false
			},
			kooky_cookie: {
				name: 'Kooky Cookie (Cake Mix + Koopa Leaf/Stinky Herb/Maple Syrup)',
				enabled: true,
				max: 1,
				required: false
			},
			package: {
				name: 'Package',
				enabled: true,
				max: 1,
				required: false
			},
			coconut: {
				name: 'Coconut',
				enabled: true,
				max: 1,
				required: false
			},
			red_jar: {
				name: 'Red Jar',
				enabled: true,
				max: 1,
				required: false
			}
		},
		trading_event_toad: {
			koopa_leaf: {
				name: 'Koopa Leaf',
				enabled: true,
				max: 1,
				required: false
			},
			coconut: {
				name: 'Coconut',
				enabled: true,
				max: 1,
				required: false
			},
			nutty_cake: {
				name: 'Nutty Cake (Goomnut)',
				enabled: true,
				max: 1,
				required: false
			}
		}
	});

	//Types = switch, select, number
	const configs = reactive({
		randomizer: {
			starting_location: {
				enabled: true,
				type: 'select',
				options: [
					{
						value: startingLocations.random,
						text: 'Select a location for logic'
					},
					{
						value: startingLocations.goomba_village,
						text: 'Goomba Village'
					},
					{
						value: startingLocations.toad_town,
						text: 'Toad Town'
					},
					{
						value: startingLocations.dry_dry_outpost,
						text: 'Dry Dry Outpost'
					},
					{
						value: startingLocations.yoshi_village,
						text: 'Yoshi Village'
					}
				]
			},
			// required_star_spirits: {
			// 	enabled: true,
			// 	type: 'number',
			// 	min: 0,
			// 	max: 7
			// },
			prologue_open: {
				enabled: true,
				type: 'switch'
			},
			mt_rugged_open: {
				enabled: true,
				type: 'switch'
			},
			forever_forest_open: {
				enabled: true,
				type: 'switch'
			},
			toybox_open: {
				enabled: true,
				type: 'switch'
			},
			whale_open: {
				enabled: true,
				type: 'switch'
			},
			blue_house_open: {
				enabled: true,
				type: 'switch'
			},
			chapter_7_bridge_open: {
				enabled: true,
				type: 'switch'
			},
			gear_shuffle: {
				enabled: true,
				type: 'select',
				options: [
					{
						value: 'vanilla',
						text: 'Vanilla'
					},
					{
						value: 'vgs',
						text: 'Gear Location Shuffle'
					},
					{
						value: 'full_shuffle',
						text: 'Full Shuffle'
					}
				]
			},
			shuffle_dungeon_entrances: {
				enabled: true,
				type: 'switch'
			},
			magical_seed_required: {
				enabled: true,
				type: 'number',
				min: 1,
				max: 4
			},
			star_hunt_enabled: {
				enabled: true,
				type: 'switch'
			},
			star_hunt_star_count: {
				enabled: false,
				type: 'number',
				min: 1,
				max: 120
			},
			star_hunt_ends_game: {
				enabled: false,
				type: 'switch'
			}
		},
		logic: {
			fast_bowser_castle: {
				enabled: true,
				type: 'switch'
			},
			shopsanity: {
				enabled: true,
				type: 'switch'
			},
			rowf_shop: {
				enabled: false,
				type: 'switch'
			},
			merlow: {
				enabled: false,
				type: 'switch'
			},
			merlow_rewards_pricing: {
				enabled: false,
				type: 'select',
				options: [
					{
						value: 'normal',
						text: 'Normal'
					},
					{
						value: 'cheap',
						text: 'Cheap'
					}
				]
			},
			// merlow_reward_cost_1: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_2: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_3: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_4: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_5: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_6: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			rip_cheato: {
				enabled: true,
				type: 'number',
				min: 0,
				max: 11
			},
			panels: {
				enabled: true,
				type: 'switch'
			},
			overworld_coins: {
				enabled: true,
				type: 'switch'
			},
			coin_blocks: {
				enabled: true,
				type: 'switch'
			},
			super_and_multicoin_blocks_randomized: {
				enabled: true,
				type: 'switch'
			},
			foliage_coins: {
				enabled: true,
				type: 'switch'
			},
			partners_always_usable: {
				enabled: true,
				type: 'switch'
			},
			letters_randomized: {
				enabled: true,
				type: 'switch'
			},
			koopa_koot: {
				enabled: true,
				type: 'switch'
			},
			koopa_koot_coins: {
				enabled: true,
				type: 'switch'
			},
			dojo_randomized: {
				enabled: true,
				type: 'switch'
			},
			trading_event_randomized: {
				enabled: true,
				type: 'switch'
			},
			limit_chapter_logic: {
				enabled: true,
				type: 'switch'
			},
			cook_without_frying_pan: {
				enabled: true,
				type: 'switch'
			}
		},
		tracker: {
			deactivate_layout_system: {
				tooltip: 'Deactivate the layout system completely.',
				enabled: true,
				type: 'switch'
			},
			no_layout_width: {
				tooltip: 'Changes the width of the tracker. Only works if the layout system is deactivated.',
				enabled: true,
				type: 'number'
			},
			map: {
				tooltip: 'Shows the map tracker.',
				enabled: true,
				type: 'switch'
			},
			map_text_size: {
				tooltip: 'Changes the size of the text on the map tracker only.',
				enabled: true,
				type: 'select',
				options: [
					{
						value: 'base',
						text: 'Default'
					},
					{
						value: 'sm',
						text: 'Smaller'
					},
					{
						value: 'xs',
						text: 'Way too small lol'
					}
				]
			},
			item_icon_size: {
				tooltip: 'Changes the size of the items icons.',
				enabled: true,
				type: 'select',
				options: [
					{
						value: 'sm',
						text: 'Smaller'
					},
					{
						value: 'md',
						text: 'Medium'
					},
					{
						value: 'lg',
						text: 'Large'
					},
					{
						value: 'xl',
						text: 'Extra large'
					},
					{
						value: '2xl',
						text: 'Mega large'
					}
				]
			},
			item_gap: {
				tooltip: 'Changes the gap between the items.',
				enabled: true,
				type: 'select',
				options: [
					{
						value: 0.5,
						text: 'Smallest'
					},
					{
						value: 1,
						text: 'Smaller'
					},
					{
						value: 1.5,
						text: 'Small'
					},
					{
						value: 2,
						text: 'Medium'
					},
					{
						value: 2.5,
						text: 'Large'
					},
					{
						value: 3,
						text: 'Larger'
					},
					{
						value: 3.5,
						text: 'Largest'
					}
				]
			},
			always_show_super_blocks: {
				tooltip: 'Always show super blocks, even if they are not in logic. It will count them as checks.',
				enabled: true,
				type: 'switch'
			},
			star_menu_enabled: {
				tooltip: 'Allows to choose the stars difficulty and dungeon shuffle progression in a popover menu instead of cycling through them.',
				enabled: true,
				type: 'switch'
			},
			compact_items: {
				tooltip: 'Shows all the items in the same widget. Cannot be enabled in the same time of the "Compact item per chapters" widget.',
				enabled: true,
				type: 'switch'
			},
			compact_item_background_hex_color: {
				tooltip: 'Changes the background color of the compact items widget.',
				enabled: true,
				type: 'text'
			},
			compact_item_show_letters: {
				tooltip: 'Show the letters in the compact items widget.',
				enabled: true,
				type: 'switch'
			},
			compact_item_show_favors: {
				tooltip: 'Show the Koopa Koot favors items in the compact items widget.',
				enabled: true,
				type: 'switch'
			},
			compact_item_show_trading_events: {
				tooltip: 'Show the Trading Event Toad items in the compact items widget.',
				enabled: true,
				type: 'switch'
			},
			compact_items_per_chapters: {
				tooltip: 'Shows the items in the same widget, but per chapters. Cannot be enabled in the same time of the "Compact items" widget.',
				enabled: true,
				type: 'switch'
			},
			competitive_mode: {
				tooltip: `Changes the tracker to be used only with the mouse.<br/>
				Left click cycles in the items with a max value (keys, letters, etc.);<br/>
				Right click adds a check mark to the items, ranks to the partners and difficulty progression to the stars;<br/>
				While maintaining the left click, right click on the stars to add the dungeon shuffle progression.`,
				enabled: true,
				type: 'switch'
			},
			missing_items_in_grayscale: {
				tooltip: 'Shows the unobtained items in grayscale instead of in opacity 50%.',
				enabled: true,
				type: 'switch'
			},
			deactivate_items_tooltips: {
				tooltip: 'Deactivates the tooltips of the items.',
				enabled: true,
				type: 'switch'
			},
			notes: {
				tooltip: 'Shows a widget to take notes.',
				enabled: true,
				type: 'switch'
			}
		}
	});

	return { startingLocations, items, configs };
});
