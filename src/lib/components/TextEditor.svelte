<script lang="ts">
	import { notes, chars, addChars, currentFont, currentSound, upgrades, getAvailableEmojis, type Note } from '../stores.js';
	import { onMount } from 'svelte';

	let { note = $bindable() }: { note?: Note | null } = $props();
	let textArea: HTMLTextAreaElement;
	let lastContentLength = 0;
	let isEmojiToolbarCollapsed = $state(false);

	// Get available emojis from purchased packs
	let availableEmojis = $derived(getAvailableEmojis($upgrades));
	let hasAnyEmojiPack = $derived(availableEmojis.length > 0);

	onMount(() => {
		if (note) {
			lastContentLength = note.content.length;
		}
	});

	function handleInput(event: Event) {
		if (!note) return;
		
		const target = event.target as HTMLTextAreaElement;
		const newContent = target.value;
		const newLength = newContent.length;
		
		// Award chars for new characters typed
		if (newLength > lastContentLength) {
			const newChars = newLength - lastContentLength;
			addChars(newChars);
			
			// Play typing sound if enabled
			playTypingSound();
		}
		
		lastContentLength = newLength;
		
		note.content = newContent;
		note.updatedAt = new Date();
		
		// Update the notes store
		notes.update(allNotes => {
			const index = allNotes.findIndex(n => n.id === note.id);
			if (index !== -1) {
				allNotes[index] = { ...note };
			}
			return allNotes;
		});
	}

	function handleTitleChange(event: Event) {
		if (!note) return;
		
		const target = event.target as HTMLInputElement;
		note.title = target.value;
		note.updatedAt = new Date();
		
		notes.update(allNotes => {
			const index = allNotes.findIndex(n => n.id === note.id);
			if (index !== -1) {
				allNotes[index] = { ...note };
			}
			return allNotes;
		});
	}

	function playTypingSound() {
		// Simple typing sound implementation
		// In a real app, you'd load actual sound files
		if ($currentSound === 'typewriter') {
			// Create a simple beep sound
			const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
			gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
			
			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.1);
		}
	}

	function insertEmoji(emoji: string) {
		if (!note || !textArea) return;
		
		const start = textArea.selectionStart;
		const end = textArea.selectionEnd;
		const newContent = note.content.substring(0, start) + emoji + note.content.substring(end);
		
		note.content = newContent;
		note.updatedAt = new Date();
		
		// Update cursor position
		setTimeout(() => {
			textArea.selectionStart = textArea.selectionEnd = start + emoji.length;
			textArea.focus();
		}, 0);
		
		notes.update(allNotes => {
			const index = allNotes.findIndex(n => n.id === note.id);
			if (index !== -1) {
				allNotes[index] = { ...note };
			}
			return allNotes;
		});
	}

	// Group emojis by pack for better organization
	function groupEmojisByPack(emojis: Array<{emoji: string, title: string, pack: string}>) {
		const grouped: Record<string, Array<{emoji: string, title: string}>> = {};
		emojis.forEach(item => {
			if (!grouped[item.pack]) {
				grouped[item.pack] = [];
			}
			grouped[item.pack].push({ emoji: item.emoji, title: item.title });
		});
		return grouped;
	}

	let groupedEmojis = $derived(groupEmojisByPack(availableEmojis));
</script>

<div class="editor-container">
	{#if note}
		<div class="editor-header">
			<input
				type="text"
				bind:value={note.title}
				on:input={handleTitleChange}
				class="title-input"
				placeholder="Note title..."
			/>
			
			<!-- Emoji Toolbar -->
			{#if hasAnyEmojiPack}
				<div class="emoji-section">
					<div class="emoji-header">
						<span class="emoji-label">ASCII Emojis</span>
						<button 
							class="emoji-toggle"
							on:click={() => isEmojiToolbarCollapsed = !isEmojiToolbarCollapsed}
							title={isEmojiToolbarCollapsed ? 'Show Emojis' : 'Hide Emojis'}
						>
							{isEmojiToolbarCollapsed ? '▼' : '▲'}
						</button>
					</div>
					
					{#if !isEmojiToolbarCollapsed}
						<div class="emoji-toolbar">
							{#each Object.entries(groupedEmojis) as [packName, emojis]}
								<div class="emoji-pack">
									<div class="pack-label">{packName}</div>
									<div class="pack-emojis">
										{#each emojis as emojiData}
											<button 
												class="emoji-btn" 
												on:click={() => insertEmoji(emojiData.emoji)} 
												title={emojiData.title}
											>
												{emojiData.emoji}
											</button>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
		
		<textarea
			bind:this={textArea}
			bind:value={note.content}
			on:input={handleInput}
			class="text-editor"
			style="font-family: {$currentFont}"
			placeholder="Start typing to earn chars... Every character gives you 1 char!"
		></textarea>
		
		<div class="editor-footer">
			<span class="char-count">{note.content.length} characters</span>
			<span class="last-updated">
				Last updated: {new Date(note.updatedAt).toLocaleDateString(navigator.language, { 
					year: 'numeric', 
					month: 'short', 
					day: 'numeric' 
				})} at {new Date(note.updatedAt).toLocaleTimeString(navigator.language, { 
					hour: '2-digit', 
					minute: '2-digit' 
				})}
			</span>
		</div>
	{:else}
		<div class="no-note">
			<p>Select a note to start writing and earning chars!</p>
		</div>
	{/if}
</div>

<style>
	.editor-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--editor-bg, #ffffff);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.editor-header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		background: var(--header-bg, #f8f9fa);
	}

	.title-input {
		width: 100%;
		font-size: 1.5rem;
		font-weight: bold;
		border: none;
		background: transparent;
		color: var(--text-color, #333);
		margin-bottom: 0.5rem;
	}

	.title-input:focus {
		outline: none;
		border-bottom: 2px solid var(--accent-color, #007acc);
	}

	.emoji-section {
		margin-top: 0.5rem;
	}

	.emoji-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.emoji-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-color, #333);
	}

	.emoji-toggle {
		background: var(--accent-color, #007acc);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-size: 0.8rem;
		transition: all 0.2s;
	}

	.emoji-toggle:hover {
		background: var(--accent-hover-color, #005a9e);
	}

	.emoji-toolbar {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-height: 200px;
		overflow-y: auto;
		padding: 0.5rem;
		background: var(--card-bg, #fff);
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 6px;
	}

	.emoji-pack {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.pack-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--muted-color, #666);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.pack-emojis {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	.emoji-btn {
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--border-color, #ddd);
		background: var(--button-bg, #fff);
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
		font-family: monospace;
	}

	.emoji-btn:hover {
		background: var(--button-hover-bg, #f0f0f0);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.text-editor {
		flex: 1;
		padding: 1rem;
		border: none;
		resize: none;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-color, #333);
		background: var(--editor-bg, #ffffff);
		font-family: inherit;
	}

	.text-editor:focus {
		outline: none;
	}

	.editor-footer {
		padding: 0.5rem 1rem;
		border-top: 1px solid var(--border-color, #e5e5e5);
		background: var(--footer-bg, #f8f9fa);
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--muted-color, #666);
	}

	.no-note {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--muted-color, #666);
		font-size: 1.1rem;
	}
</style> 