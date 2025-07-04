import type { Upgrade } from './types.js';

export const emojiUpgrades: Upgrade[] = [
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
	},
	{
		id: 'emoji-russian',
		name: 'Russian Special',
		description: 'if you know you know))',
		cost: 200,
		type: 'emoji',
		value: 'russian',
		purchased: false
	}
];

export const emojiPacks = {
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
	],
	russian: [
		{ emoji: ')', title: ')' },
		{ emoji: '))', title: '))' },
		{ emoji: '(', title: '(' },
		{ emoji: '((', title: '((' },
	]
}; 