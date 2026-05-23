import { defineStore } from 'pinia';
import { computed, nextTick, reactive, watch } from 'vue';
import { Client } from 'archipelago.js';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { useSaveStore } from './save';
import { useTrackerStore } from './tracker';
import { useLogicStore } from './logic';

export const useArchipelagoStore = defineStore('archipelago', () => {
	const save = useSaveStore();
	const tracker = useTrackerStore();
	const logic = useLogicStore();

	let debug = import.meta.env.DEV;

	const state = reactive({
		connected: false,
		server_version: {
			major: 0,
			minor: 0,
			build: 0
		},
		seed: '',
		checkedLocations: [],
		itemsReceived: [],
		hints: {
			points: 0,
			cost: 0,
			list: []
		},
		activity: [],
		itemNames: []
	});

	const ACTIVITY_MAX = 50;
	const ACTIVITY_STORAGE_KEY = 'ap.activity';
	const ACTIVITY_BUFFER_SIZE = 2;
	let activityGameKey = null;

	const pushActivity = (entry) => {
		state.activity.unshift({ ...entry, at: Date.now() });
		if (state.activity.length > ACTIVITY_MAX) {
			state.activity.length = ACTIVITY_MAX;
		}
	};

	const readActivityStorage = () => {
		try {
			const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
			if (!raw) return [];
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	};

	const writeActivityStorage = (games) => {
		try {
			localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(games));
		} catch {}
	};

	const loadActivityForGame = (gameKey) => {
		activityGameKey = gameKey;
		const games = readActivityStorage();
		const found = games.find((g) => g.gameKey === gameKey);
		if (found && Array.isArray(found.list)) {
			state.activity = [...found.list];
		} else {
			state.activity = [];
			games.push({ gameKey, list: [] });
			while (games.length > ACTIVITY_BUFFER_SIZE) games.shift();
			writeActivityStorage(games);
		}
	};

	const persistActivity = () => {
		if (!activityGameKey) return;
		const games = readActivityStorage();
		const existing = games.findIndex((g) => g.gameKey === activityGameKey);
		const entry = { gameKey: activityGameKey, list: state.activity };
		if (existing !== -1) {
			games[existing] = entry;
		} else {
			games.push(entry);
			while (games.length > ACTIVITY_BUFFER_SIZE) games.shift();
		}
		writeActivityStorage(games);
	};

	let syncingActivity = false;

	// Mirror state.activity -> save.data.ap_activity (so it goes into the exported save file)
	watch(
		() => state.activity,
		(val) => {
			persistActivity();
			if (syncingActivity) return;
			syncingActivity = true;
			save.data.ap_activity = [...val];
			syncingActivity = false;
		},
		{ deep: true, flush: 'sync' }
	);

	// Reverse: when save.data.ap_activity changes externally (e.g. via importSave), restore state.activity
	watch(
		() => save.data.ap_activity,
		(val) => {
			if (syncingActivity) return;
			if (!Array.isArray(val)) return;
			syncingActivity = true;
			state.activity = [...val];
			syncingActivity = false;
		},
		{ deep: true, flush: 'sync' }
	);

	const connectionInfos = reactive({
		hostname: localStorage.getItem('ap.hostname'), // Replace with the actual AP server hostname.
		port: parseInt(localStorage.getItem('ap.port')), // Replace with the actual AP server port.
		game: 'Paper Mario', // Replace with the game name for this player.
		name: localStorage.getItem('ap.name'), // Replace with the player slot name.
		version: {
			major: 0,
			minor: 6,
			build: 2
		},
		password: ''
	});

	watch(
		() => connectionInfos.hostname,
		(newValue, oldValue) => {
			//save to local storage
			localStorage.setItem('ap.hostname', newValue);
		}
	);

	watch(
		() => connectionInfos.port,
		(newValue, oldValue) => {
			//save to local storage
			localStorage.setItem('ap.port', newValue);
		}
	);

	watch(
		() => connectionInfos.name,
		(newValue, oldValue) => {
			//save to local storage
			localStorage.setItem('ap.name', newValue);
		}
	);

	const client = new Client();

	const connect = () => {
		client
			.login(`${connectionInfos.hostname}:${connectionInfos.port}`, connectionInfos.name, connectionInfos.game, {
				password: connectionInfos.password,
				version: connectionInfos.version,
				tags: ['Tracker']
			})
			.then((configs) => {
				console.info('AP configs', configs);
				toast.success('Connected successfully!', { duration: 5000 });

				state.connected = client.authenticated;
				state.server_version = client.room.serverVersion;

				state.seed = client.room.seedName;
				state.hints.points = client.room.hintPoints;
				state.hints.cost = client.room.hintCost;
				// Hint objects from archipelago.js use TypeScript private fields which break
				// when Vue wraps them in reactive Proxies (e.g. the `.found` getter throws).
				// Convert to plain snapshot objects so the UI can render them safely.
				const toPlainHint = (hint) => ({
					itemName: hint.item?.name ?? '',
					locationName: hint.item?.locationName ?? '',
					sendingPlayer: hint.item?.sender?.alias ?? '',
					receivingPlayer: hint.item?.receiver?.alias ?? '',
					found: hint.found === true
				});

				state.hints.list = (client.items.hints || []).map(toPlainHint);
				loadActivityForGame(`${state.seed}::${connectionInfos.name}`);

				try {
					const pkg = client.package.findPackage(client.game);
					state.itemNames = Object.keys(pkg?.itemTable || {}).sort();
				} catch {
					state.itemNames = [];
				}

				client.items.on('hintsInitialized', (hints) => {
					state.hints.list = hints.map(toPlainHint);
				});

				client.items.on('hintReceived', (hint) => {
					state.hints.list.push(toPlainHint(hint));
					// Re-sync points/cost from room — server doesn't always emit hintPointsUpdated for !hint
					state.hints.points = client.room.hintPoints;
					state.hints.cost = client.room.hintCost;
				});

				client.items.on('hintFound', (hint) => {
					const plain = toPlainHint(hint);
					const idx = state.hints.list.findIndex((h) => h.locationName === plain.locationName && h.sendingPlayer === plain.sendingPlayer);
					if (idx !== -1) {
						state.hints.list.splice(idx, 1, plain);
					}
				});

				save.resetSave(true, true, false);

				save.data.configs.randomizer.prologue_open = configs.open_prologue;
				save.data.configs.randomizer.mt_rugged_open = configs.open_mt_rugged;
				save.data.configs.randomizer.forever_forest_open = configs.open_forest;
				save.data.configs.randomizer.toybox_open = configs.open_toybox;
				save.data.configs.randomizer.whale_open = configs.open_whale;
				save.data.configs.randomizer.blue_house_open = configs.open_blue_house;
				save.data.configs.randomizer.chapter_7_bridge_open = configs.ch7_bridge_visible;

				switch (configs.gear_shuffle_mode) {
					case 0:
						save.data.configs.randomizer.gear_shuffle = 'vanilla';
						break;

					case 1:
						save.data.configs.randomizer.gear_shuffle = 'vgs';
						break;

					case 2:
						save.data.configs.randomizer.gear_shuffle = 'full_shuffle';
						break;
				}

				save.data.configs.randomizer.starting_location = configs.starting_map;
				save.data.configs.randomizer.shuffle_dungeon_entrances = configs.shuffle_dungeon_entrances;
				save.data.configs.randomizer.magical_seed_required = configs.magical_seeds;
				save.data.configs.randomizer.shuffle_star_beam = configs.shuffle_star_beam;
				// Bosses are not implemented in Archipelago yet — force off on connect
				save.data.configs.randomizer.shuffle_bosses = false;
				save.data.configs.randomizer.star_hunt_enabled = configs.power_star_hunt;
				save.data.configs.randomizer.star_hunt_star_count = configs.total_power_stars;

				// Logic settings
				save.data.configs.logic.fast_bowser_castle = configs.bowser_castle_mode !== 0;
				save.data.configs.logic.shopsanity = configs.include_shops;
				save.data.configs.logic.rowf_shop = configs.rowf_items > 0;
				save.data.configs.logic.merlow = configs.merlow_items > 0;

				switch (configs.merlow_rewards_pricing) {
					case 0:
						save.data.configs.logic.merlow_rewards_pricing = 'cheap';
						break;

					case 1:
						save.data.configs.logic.merlow_rewards_pricing = 'normal';
						break;
				}

				save.data.configs.logic.rip_cheato = configs.cheato_items;
				save.data.configs.logic.panels = configs.shuffle_hidden_panels;
				save.data.configs.logic.overworld_coins = configs.overworld_coins;
				save.data.configs.logic.coin_blocks = configs.coin_blocks;
				save.data.configs.logic.super_and_multicoin_blocks_randomized = configs.super_multi_blocks;
				save.data.configs.logic.foliage_coins = configs.foliage_coins;
				save.data.configs.logic.partners_always_usable = configs.partners_always_usable;

				save.data.configs.logic.letters_randomized = configs.letter_rewards === 2 || configs.letter_rewards === 3;
				save.data.configs.logic.koopa_koot = configs.koot_favors === 2;
				save.data.configs.logic.koopa_koot_coins = configs.koot_coins;
				save.data.configs.logic.dojo_randomized = configs.dojo > 0;
				save.data.configs.logic.trading_event_randomized = configs.trading_events > 0;
				save.data.configs.logic.limit_chapter_logic = configs.require_spirits;
				save.data.configs.logic.cook_without_frying_pan = configs.cook_without_frying_pan;

				let stars = {
					1: 'eldstar',
					2: 'mamar',
					3: 'skolar',
					4: 'muskular',
					5: 'misstar',
					6: 'klevar',
					7: 'kalmar'
				};

				if (configs.require_spirits && configs.required_spirits) {
					configs.required_spirits.forEach((star) => {
						if (stars[star]) {
							delete stars[star];
						}
					});

					for (const [id, star] of Object.entries(stars)) {
						save.data.items[star] = true;
						save.data.items[star + '_chapter_disabled'] = true;
					}
				}

				console.info('AP client package', client.package.findPackage(client.game));

				state.checkedLocations = client.room.checkedLocations;

				let itemsReceived = [];

				client.items.received.forEach((item) => {
					itemsReceived.push(item.id);
				});

				state.itemsReceived = itemsReceived;

				client.items.on('itemsReceived', (items) => {
					console.log('Items received:', items);
					items.forEach((item) => {
						state.itemsReceived.push(item.id);
						pushActivity({
							kind: 'item',
							name: item.name || client.package.lookupItemName(client.game, item.id) || `Item #${item.id}`,
							from: item.sender?.alias || item.sender?.name || null
						});
					});
				});

				client.room.on('hintCostUpdated', (cost) => {
					nextTick(() => {
						state.hints.cost = cost;
					});
				});

				client.room.on('hintPointsUpdated', (points) => {
					nextTick(() => {
						state.hints.points = points;
					});
				});

				client.room.on('locationsChecked', (locations) => {
					console.log('Locations checked:', locations);
					state.checkedLocations.push(locations[0]);
					locations.forEach((locationId) => {
						pushActivity({
							kind: 'location',
							name: client.package.lookupLocationName(client.game, locationId) || `Location #${locationId}`
						});
					});
				});
			})
			.catch((error) => {
				console.error('Failed to connect:', error);
				toast.error('Failed to connect to AP server.', { duration: 15000 });
			});
	};

	const disconnect = () => {
		client.socket.disconnect();
		state.connected = false;
		console.info('Disconnected from AP server');
		toast.success('Disconnected from AP server.', { duration: 5000 });
	};

	// Sorry for this garbo function, I've tried to make it better but did not have the time... At least it works lol
	const searchAPIdAndCheck = (type, obj, query, _previousKey1, _previousKey2, _previousKey3, _previousKey4, _previousKey5) => {
		// console.log('Searching for:', query, 'in', _previousKey1, _previousKey2, _previousKey3, _previousKey4, _previousKey5);
		let previousKey1 = _previousKey1;
		let previousKey2 = _previousKey2;
		let previousKey3 = _previousKey3;
		let previousKey4 = _previousKey4;
		let previousKey5 = _previousKey5;

		for (var key in obj) {
			var value = obj[key];

			if (key == 'ap') {
				if (value.includes(query)) {
					let occurences = 0;
					for (let i = 0; i < value.length; i++) {
						if (value[i] == query) {
							occurences++;
						}
					}
					// console.log('Found:', query, 'in', previousKey1, previousKey2, previousKey3, previousKey4, previousKey5, 'x', occurences);

					switch (type) {
						case 'item':
							for (let i = 0; i < occurences; i++) {
								if (save.data.items[previousKey1] !== undefined) {
									switch (typeof save.data.items[previousKey1]) {
										case 'boolean':
											save.data.items[previousKey1] = true;
											break;
										case 'number':
											save.data.items[previousKey1]++;
											break;
										default:
											save.data.items[previousKey1] = true;
											break;
									}
								}
								if (save.data.items['letters'][previousKey1] !== undefined) {
									switch (typeof save.data.items['letters'][previousKey1]) {
										case 'boolean':
											save.data.items['letters'][previousKey1] = true;
											break;
										case 'number':
											save.data.items['letters'][previousKey1]++;
											break;
										default:
											save.data.items['letters'][previousKey1] = true;
											break;
									}
								}
								if (save.data.items['koopa_koot_favors'][previousKey1] !== undefined) {
									switch (typeof save.data.items['koopa_koot_favors'][previousKey1]) {
										case 'boolean':
											save.data.items['koopa_koot_favors'][previousKey1] = true;
											break;
										case 'number':
											save.data.items['koopa_koot_favors'][previousKey1]++;
											break;
										default:
											save.data.items['koopa_koot_favors'][previousKey1] = true;
											break;
									}
								}
								if (save.data.items['trading_event_toad'][previousKey1] !== undefined) {
									switch (typeof save.data.items['trading_event_toad'][previousKey1]) {
										case 'boolean':
											save.data.items['trading_event_toad'][previousKey1] = true;
											break;
										case 'number':
											save.data.items['trading_event_toad'][previousKey1]++;
											break;
										default:
											save.data.items['trading_event_toad'][previousKey1] = true;
											break;
									}
								}
							}
							break;

						case 'location':
							if (save.data.checks[previousKey5] === undefined) save.data.checks[previousKey5] = {};
							if (save.data.checks[previousKey5][previousKey3] === undefined) save.data.checks[previousKey5][previousKey3] = [];
							if (!save.data.checks[previousKey5][previousKey3].includes(parseInt(previousKey1))) {
								save.data.checks[previousKey5][previousKey3].push(parseInt(previousKey1));
							}
							break;
					}
				}
			}

			if (key == 'ap_rank') {
				switch (type) {
					case 'item':
						if (value.includes(query)) {
							if (save.data.items[previousKey1] !== undefined) {
								switch (typeof save.data.items[previousKey1]) {
									case 'number':
										save.data.items[previousKey1 + '_rank']++;
										break;
								}
							}
						}
						break;
				}
			}
			switch (typeof value) {
				case 'object':
					searchAPIdAndCheck(type, value, query, key, previousKey1, previousKey2, previousKey3, previousKey4);
					break;
			}
		}
	};

	const refreshItemsReceived = (itemsReceived) => {
		save.resetSave(true, true, false);

		// console.log('refresh Items received:', itemsReceived);

		itemsReceived.forEach((itemAP) => {
			searchAPIdAndCheck('item', tracker.items, itemAP);
		});
	};

	watch(
		() => state.itemsReceived,
		(newValue, oldValue) => {
			refreshItemsReceived(newValue);
		},
		{ deep: true }
	);

	const refreshLocationsChecked = (checkedLocations) => {
		checkedLocations.forEach((locationAPId) => {
			searchAPIdAndCheck('location', logic.checks, locationAPId);
		});
	};

	watch(
		() => state.checkedLocations,
		(newValue, oldValue) => {
			refreshLocationsChecked(newValue);
		},
		{ deep: true }
	);

	const checkedLocationsCount = computed(() => {
		return state.checkedLocations.length;
	});

	const searchForAPInObjectAndReturnValue = (objType, query) => {
		let obj = {};
		switch (objType) {
			case 'item':
				obj = tracker.items;
				break;

			case 'location':
				obj = logic.checks;
				break;
		}

		let finalString = [];
		let lastString = [];
		let stringHierarachy = recHierarchy(obj, Object.keys(obj))[0];

		finalString.map((elem) => {
			if (elem.constructor === Array) {
				elem.forEach((subelem) => {
					lastString.push(subelem);
				});
			}
		});

		// console.log('Last String:', lastString);

		let stringIncludingAP = [];
		let realStringIncludingAP = [];
		let realKeys = [];
		switch (objType) {
			case 'item':
				lastString.forEach((elem) => {
					if (elem.match(/\.ap/g)) {
						stringIncludingAP.push(elem);
					}
				});

				// console.log('String including AP:', stringIncludingAP);

				stringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split(',');
					realStringIncludingAP.push(splitAP[splitAP.length - 1]);
				});

				realStringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split('.');

					// console.log(splitAP[0], splitAP[1], splitAP[2]);

					if (
						splitAP[0] == 'stars' ||
						splitAP[0] == 'partners' ||
						splitAP[0] == 'equipments' ||
						splitAP[0] == 'misc' ||
						splitAP[0] == 'koopa_koot_favors' ||
						splitAP[0] == 'trading_event_toad'
					) {
						if (
							tracker.items[splitAP[0]][splitAP[1]][splitAP[2]] &&
							Array.isArray(tracker.items[splitAP[0]][splitAP[1]][splitAP[2]]) &&
							tracker.items[splitAP[0]][splitAP[1]][splitAP[2]].includes(query)
						) {
							realKeys.push(splitAP[0]);
							realKeys.push(splitAP[1]);
							realKeys.push(splitAP[2]);
						}
					} else {
						if (
							tracker.items.items[splitAP[0]] &&
							tracker.items.items[splitAP[0]][splitAP[1]] &&
							tracker.items.items[splitAP[0]][splitAP[1]][splitAP[2]] &&
							Array.isArray(tracker.items.items[splitAP[0]][splitAP[1]][splitAP[2]]) &&
							tracker.items.items[splitAP[0]][splitAP[1]][splitAP[2]].includes(query)
						) {
							realKeys.push('items');
							realKeys.push(splitAP[0]);
							realKeys.push(splitAP[1]);
							realKeys.push(splitAP[2]);
						}

						if (
							tracker.items.letters[splitAP[0]] &&
							tracker.items.letters[splitAP[0]][splitAP[1]] &&
							tracker.items.letters[splitAP[0]][splitAP[1]][splitAP[2]] &&
							Array.isArray(tracker.items.letters[splitAP[0]][splitAP[1]][splitAP[2]]) &&
							tracker.items.letters[splitAP[0]][splitAP[1]][splitAP[2]].includes(query)
						) {
							realKeys.push('letters');
							realKeys.push(splitAP[0]);
							realKeys.push(splitAP[1]);
							realKeys.push(splitAP[2]);
						}
					}
				});
				break;
			case 'location':
				lastString.forEach((elem) => {
					if (elem.match(/\.checks/g)) {
						stringIncludingAP.push(elem);
					}
				});

				stringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split(',');
					realStringIncludingAP.push(splitAP[splitAP.length - 1]);
				});

				// console.log('String including Checks:', realStringIncludingAP);

				realStringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split('.');
					for (const [chapter, checksInChapter] of Object.entries(logic.checks)) {
						if (checksInChapter[splitAP[0]][splitAP[1]] && checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]] && checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]].length) {
							for (const [checkKey, check] of Object.entries(checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]])) {
								if (check.ap && check.ap.includes(query)) {
									realKeys = `${checksInChapter.name} - ${checksInChapter[splitAP[0]][splitAP[1]].name} - ${checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]][checkKey].name}`;
								}
							}
						}
					}
				});
				break;
		}

		return realKeys;

		function recHierarchy(obj, initial) {
			if (Object.keys(obj).length != 0) {
				return Object.keys(obj).map((elem) => {
					let basString = elem;
					switch (typeof obj[elem]) {
						case 'string': {
							return [`${elem.toString()}`];
						}
						default: {
							return [`${elem.toString()}`];
						}
						case 'object': {
							if (obj[elem].constructor === Array) {
								return [`${elem.toString()}`];
							}
							let returnedValue = recHierarchy(obj[elem]);
							let value = returnedValue.map((elem) => {
								if (elem.constructor === Array) {
									return elem.map((subelem) => {
										return `${basString}.${subelem.toString()}`;
									});
								}
								return `${basString}.${elem.toString()}`;
							});
							initial && initial.indexOf(elem) !== -1 ? (finalString = finalString.concat(value)) : null;
							return value;
						}
					}
				});
			} else {
				return [''];
			}
		}
	};

	const searchAPId = (obj, query) => {
		return searchForAPInObjectAndReturnValue(obj, query);
	};

	const apPartnerIsRankUp = (apId) => {
		let returnVal = false;

		for (const [partnerKey, partner] of Object.entries(tracker.items.partners)) {
			if (partner.ap_rank && partner.ap_rank.includes(apId)) {
				returnVal = true;
			}
		}

		return returnVal;
	};

	const apAskHint = (itemName) => {
		if (!state.connected || !itemName || !itemName.trim()) {
			return;
		}
		// Optimistic deduction so the UI reacts immediately (also re-synced on hintReceived)
		if (state.hints.points >= state.hints.cost) {
			state.hints.points = Math.max(0, state.hints.points - state.hints.cost);
		}
		client.messages.say(`!hint ${itemName.trim()}`);
	};

	return {
		connect,
		disconnect,
		connectionInfos,
		state,
		searchAPId,
		apPartnerIsRankUp,
		checkedLocationsCount,
		apAskHint
	};
});
