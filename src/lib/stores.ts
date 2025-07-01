import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Upgrade {
	id: string;
	name: string;
	description: string;
	cost: number;
	type: 'font' | 'sound' | 'theme' | 'emoji';
	value: string;
	purchased: boolean;
}

// Local storage helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue;
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch {
		return defaultValue;
	}
}

function saveToStorage<T>(key: string, value: T): void {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error('Failed to save to localStorage:', e);
	}
}

// Default upgrades template
const defaultUpgrades: Upgrade[] = [
	{
		id: 'font-mono',
		name: 'Monospace Font',
		description: 'Classic coding font for your notes',
		cost: 100,
		type: 'font',
		value: 'monospace',
		purchased: false
	},
	{
		id: 'font-serif',
		name: 'Serif Font',
		description: 'Elegant serif font for sophisticated writing',
		cost: 150,
		type: 'font',
		value: 'serif',
		purchased: false
	},
	{
		id: 'font-system-ui',
		name: 'System UI Font',
		description: 'Clean system font optimized for readability',
		cost: 90,
		type: 'font',
		value: 'system-ui',
		purchased: false
	},
	{
		id: 'font-georgia',
		name: 'Georgia Font',
		description: 'Professional serif font perfect for articles',
		cost: 140,
		type: 'font',
		value: 'Georgia, serif',
		purchased: false
	},
	{
		id: 'font-helvetica',
		name: 'Helvetica Font',
		description: 'Classic Swiss sans-serif design',
		cost: 160,
		type: 'font',
		value: 'Helvetica, Arial, sans-serif',
		purchased: false
	},
	{
		id: 'font-times',
		name: 'Times New Roman',
		description: 'Traditional newspaper and book font',
		cost: 110,
		type: 'font',
		value: '"Times New Roman", Times, serif',
		purchased: false
	},
	{
		id: 'font-courier',
		name: 'Courier New',
		description: 'Typewriter-style monospace font',
		cost: 130,
		type: 'font',
		value: '"Courier New", Courier, monospace',
		purchased: false
	},
	{
		id: 'font-comic',
		name: 'Comic Sans',
		description: 'Fun, casual font for creative writing',
		cost: 80,
		type: 'font',
		value: '"Comic Sans MS", cursive',
		purchased: false
	},
	{
		id: 'font-impact',
		name: 'Impact Font',
		description: 'Bold, attention-grabbing display font',
		cost: 170,
		type: 'font',
		value: 'Impact, Arial Black, sans-serif',
		purchased: false
	},
	{
		id: 'theme-dark',
		name: 'Dark Theme',
		description: 'Easy on the eyes dark theme',
		cost: 200,
		type: 'theme',
		value: 'dark',
		purchased: false
	},
	{
		id: 'theme-purple',
		name: 'Purple Theme',
		description: 'Stylish purple color scheme',
		cost: 250,
		type: 'theme',
		value: 'purple',
		purchased: false
	},
	{
		id: 'sound-typewriter',
		name: 'Typewriter Sounds',
		description: 'Classic typewriter clicking sounds',
		cost: 300,
		type: 'sound',
		value: 'typewriter',
		purchased: false
	},
	{
		id: 'emoji-classic',
		name: 'Classic Emotions',
		description: 'Basic happy, sad, and surprised faces :) :( :D',
		cost: 80,
		type: 'emoji',
		value: 'classic',
		purchased: false
	},
	{
		id: 'emoji-advanced',
		name: 'Advanced Emotions',
		description: 'More expressive faces ;-) :-P :-| :-O',
		cost: 120,
		type: 'emoji',
		value: 'advanced',
		purchased: false
	},
	{
		id: 'emoji-love',
		name: 'Love & Hearts',
		description: 'Romantic expressions <3 </3 xoxo',
		cost: 100,
		type: 'emoji',
		value: 'love',
		purchased: false
	},
	{
		id: 'emoji-celebration',
		name: 'Celebration Pack',
		description: 'Party and celebration emojis \\o/ \\m/ ★',
		cost: 150,
		type: 'emoji',
		value: 'celebration',
		purchased: false
	},
	{
		id: 'emoji-memes',
		name: 'Internet Classics',
		description: 'Famous internet memes ¯\\_(ツ)_/¯ (╯°□°）╯︵ ┻━┻',
		cost: 200,
		type: 'emoji',
		value: 'memes',
		purchased: false
	}
];

// Initialize data
const initialNotes: Note[] = loadFromStorage('notes', []);
const initialChars: number = loadFromStorage('chars', 0);

// Load upgrades from storage, but merge with defaults to ensure all upgrades exist
function loadUpgrades(): Upgrade[] {
	const stored = loadFromStorage('upgrades', []);
	
	// If no stored upgrades, use defaults
	if (!stored || stored.length === 0) {
		return [...defaultUpgrades];
	}
	
	// Merge stored upgrades with defaults to ensure all upgrades exist
	const mergedUpgrades = [...defaultUpgrades];
	
	// Update purchased status from stored data
	stored.forEach((storedUpgrade: Upgrade) => {
		const index = mergedUpgrades.findIndex(upgrade => upgrade.id === storedUpgrade.id);
		if (index !== -1) {
			mergedUpgrades[index].purchased = storedUpgrade.purchased;
		}
	});
	
	return mergedUpgrades;
}

const initialUpgrades: Upgrade[] = loadUpgrades();

// Create stores
export const notes = writable<Note[]>(initialNotes);
export const chars = writable<number>(initialChars);
export const upgrades = writable<Upgrade[]>(initialUpgrades);
export const activeNoteId = writable<string | null>(null);
export const currentTheme = writable<string>(loadFromStorage('currentTheme', 'default'));
export const currentFont = writable<string>(loadFromStorage('currentFont', 'sans-serif'));
export const currentSound = writable<string>(loadFromStorage('currentSound', 'none'));

// Subscribe to changes and save to localStorage
notes.subscribe(value => saveToStorage('notes', value));
chars.subscribe(value => saveToStorage('chars', value));
upgrades.subscribe(value => saveToStorage('upgrades', value));
currentTheme.subscribe(value => saveToStorage('currentTheme', value));
currentFont.subscribe(value => saveToStorage('currentFont', value));
currentSound.subscribe(value => saveToStorage('currentSound', value));

// Helper functions
export function createNote(): Note {
	return {
		id: crypto.randomUUID(),
		title: 'New Note',
		content: '',
		createdAt: new Date(),
		updatedAt: new Date()
	};
}

export function addChars(amount: number): void {
	chars.update(current => current + amount);
}

export function purchaseUpgrade(upgradeId: string): boolean {
	let canPurchase = false;
	
	upgrades.update(allUpgrades => {
		const upgrade = allUpgrades.find(u => u.id === upgradeId);
		if (!upgrade || upgrade.purchased) return allUpgrades;
		
		chars.update(currentChars => {
			if (currentChars >= upgrade.cost) {
				canPurchase = true;
				return currentChars - upgrade.cost;
			}
			return currentChars;
		});
		
		if (canPurchase) {
			upgrade.purchased = true;
		}
		
		return allUpgrades;
	});
	
	return canPurchase;
}

// Helper functions to get available options
export function getAvailableFonts(upgradesArray: Upgrade[]): Array<{id: string, name: string, value: string}> {
	const fonts = [
		{ id: 'default', name: 'Default Font', value: 'sans-serif' }
	];
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'font' && upgrade.purchased)
		.forEach(upgrade => {
			fonts.push({
				id: upgrade.id,
				name: upgrade.name,
				value: upgrade.value
			});
		});
	
	return fonts;
}

export function getAvailableThemes(upgradesArray: Upgrade[]): Array<{id: string, name: string, value: string}> {
	const themes = [
		{ id: 'default', name: 'Default Theme', value: 'default' }
	];
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'theme' && upgrade.purchased)
		.forEach(upgrade => {
			themes.push({
				id: upgrade.id,
				name: upgrade.name,
				value: upgrade.value
			});
		});
	
	return themes;
}

export function getAvailableSounds(upgradesArray: Upgrade[]): Array<{id: string, name: string, value: string}> {
	const sounds = [
		{ id: 'none', name: 'No Sound', value: 'none' }
	];
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'sound' && upgrade.purchased)
		.forEach(upgrade => {
			sounds.push({
				id: upgrade.id,
				name: upgrade.name,
				value: upgrade.value
			});
		});
	
	return sounds;
}

export function getAvailableEmojis(upgradesArray: Upgrade[]): Array<{emoji: string, title: string, pack: string}> {
	const emojis: Array<{emoji: string, title: string, pack: string}> = [];
	
	const emojiPacks = {
		classic: [
			{ emoji: ':-)', title: 'Happy' },
			{ emoji: ':-(', title: 'Sad' },
			{ emoji: ':-D', title: 'Grin' }
		],
		advanced: [
			{ emoji: ';-)', title: 'Wink' },
			{ emoji: ':-P', title: 'Tongue' },
			{ emoji: ':-|', title: 'Neutral' },
			{ emoji: ':-O', title: 'Surprised' }
		],
		love: [
			{ emoji: '<3', title: 'Heart' },
			{ emoji: '</3', title: 'Broken Heart' },
			{ emoji: 'xoxo', title: 'Hugs and Kisses' },
			{ emoji: ':-*', title: 'Kiss' }
		],
		celebration: [
			{ emoji: '\\o/', title: 'Celebrate' },
			{ emoji: '\\m/', title: 'Rock On' },
			{ emoji: '★', title: 'Star' },
			{ emoji: '♪', title: 'Music' },
			{ emoji: '\\o_O/', title: 'Party' }
		],
		memes: [
			{ emoji: '¯\\_(ツ)_/¯', title: 'Shrug' },
			{ emoji: '(╯°□°）╯︵ ┻━┻', title: 'Table Flip' },
			{ emoji: '┬─┬ ノ( ゜-゜ノ)', title: 'Table Unflip' },
			{ emoji: '( ͡° ͜ʖ ͡°)', title: 'Lenny Face' },
			{ emoji: 'ಠ_ಠ', title: 'Disapproval' }
		]
	};
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'emoji' && upgrade.purchased)
		.forEach(upgrade => {
			const packEmojis = emojiPacks[upgrade.value as keyof typeof emojiPacks];
			if (packEmojis) {
				packEmojis.forEach(emojiData => {
					emojis.push({
						...emojiData,
						pack: upgrade.name
					});
				});
			}
		});
	
	return emojis;
} 