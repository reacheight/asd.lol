import { fontUpgrades } from './upgrades/fonts.js';
import { themeUpgrades } from './upgrades/themes.js';
import { soundUpgrades } from './upgrades/sounds.js';
import { emojiUpgrades, emojiPacks } from './upgrades/emojis.js';
import { utilityUpgrades } from './upgrades/utilities.js';
import { nothingUpgrades } from './upgrades/nothing.js';
import type { Upgrade } from './upgrades/types.js';

export type { Upgrade };

export const defaultUpgrades: Upgrade[] = [
	...fontUpgrades,
	...themeUpgrades,
	...soundUpgrades,
	...emojiUpgrades,
	...utilityUpgrades,
	...nothingUpgrades
];

export { emojiPacks }; 