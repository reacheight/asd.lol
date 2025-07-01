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
					<button 
						class="emoji-section-header"
						on:click={() => isEmojiToolbarCollapsed = !isEmojiToolbarCollapsed}
						title={isEmojiToolbarCollapsed ? 'Show ASCII Emojis' : 'Hide ASCII Emojis'}
					>
						<div class="emoji-header-content">
							<span class="emoji-label">ASCII Emojis</span>
							<span class="emoji-count">({availableEmojis.length} available)</span>
						</div>
						<div class="emoji-chevron" class:collapsed={isEmojiToolbarCollapsed}>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
					</button>
					
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
		margin-top: 0.75rem;
	}

	.emoji-section-header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, 
			rgba(248, 249, 250, 0.8), 
			rgba(255, 255, 255, 0.9)
		);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		margin-bottom: 0.5rem;
	}

	.emoji-section-header:hover {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.95), 
			rgba(240, 248, 255, 0.9)
		);
		border-color: rgba(79, 195, 247, 0.3);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-1px);
	}

	.emoji-header-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.emoji-label {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-color, #333);
	}

	.emoji-count {
		font-size: 0.8rem;
		color: var(--muted-color, #666);
		font-weight: 500;
	}

	.emoji-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 6px;
		background: rgba(79, 195, 247, 0.1);
		color: #4fc3f7;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.emoji-chevron.collapsed {
		transform: rotate(-90deg);
	}

	.emoji-section-header:hover .emoji-chevron {
		background: rgba(79, 195, 247, 0.2);
		color: #29b6f6;
	}

	.emoji-toolbar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 200px;
		overflow-y: auto;
		padding: 1rem;
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.9), 
			rgba(248, 249, 250, 0.8)
		);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.emoji-pack {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.pack-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--muted-color, #666);
		text-transform: uppercase;
		letter-spacing: 1px;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}

	.pack-emojis {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.emoji-btn {
		padding: 0.375rem 0.625rem;
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.9), 
			rgba(248, 249, 250, 0.8)
		);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: monospace;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		position: relative;
		overflow: hidden;
	}

	.emoji-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.emoji-btn:hover {
		background: linear-gradient(135deg, #f0f8ff, #e3f2fd);
		border-color: rgba(79, 195, 247, 0.3);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.emoji-btn:hover::before {
		opacity: 0.1;
	}

	.emoji-btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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