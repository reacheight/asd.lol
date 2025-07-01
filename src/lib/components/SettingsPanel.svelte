<script lang="ts">
	import { upgrades, currentTheme, currentFont, currentSound, getAvailableFonts, getAvailableThemes, getAvailableSounds } from '../stores.js';

	$: availableFonts = getAvailableFonts($upgrades);
	$: availableThemes = getAvailableThemes($upgrades);
	$: availableSounds = getAvailableSounds($upgrades);
</script>

<div class="settings-panel">
	<div class="settings-header">
		<h2>⚙️ Settings</h2>
		<p>Customize your writing experience</p>
	</div>

	<div class="settings-content">
		<!-- Font Selection -->
		<div class="setting-group">
			<label for="font-select" class="setting-label">
				🔤 Font Style
			</label>
			<select 
				id="font-select"
				bind:value={$currentFont}
				class="setting-select"
			>
				{#each availableFonts as font}
					<option value={font.value}>{font.name}</option>
				{/each}
			</select>
			<p class="setting-description">
				Choose your preferred font for writing. Purchase more fonts in the shop!
			</p>
		</div>

		<!-- Theme Selection -->
		<div class="setting-group">
			<label for="theme-select" class="setting-label">
				🎨 Theme
			</label>
			<select 
				id="theme-select"
				bind:value={$currentTheme}
				class="setting-select"
			>
				{#each availableThemes as theme}
					<option value={theme.value}>{theme.name}</option>
				{/each}
			</select>
			<p class="setting-description">
				Change the app's appearance. Unlock more themes in the shop!
			</p>
		</div>

		<!-- Sound Selection -->
		<div class="setting-group">
			<label for="sound-select" class="setting-label">
				🔊 Typing Sounds
			</label>
			<select 
				id="sound-select"
				bind:value={$currentSound}
				class="setting-select"
			>
				{#each availableSounds as sound}
					<option value={sound.value}>{sound.name}</option>
				{/each}
			</select>
			<p class="setting-description">
				Add sound effects to your typing. Get more sound packs from the shop!
			</p>
		</div>

		<!-- Preview Section -->
		<div class="setting-group">
			<label class="setting-label">
				👀 Preview
			</label>
			<div class="preview-box">
				<p style="font-family: {$currentFont}">
					This is how your text will look with the current font: {availableFonts.find(f => f.value === $currentFont)?.name || 'Default'}
				</p>
				<p class="preview-theme">
					Current theme: {availableThemes.find(t => t.value === $currentTheme)?.name || 'Default'}
				</p>
				<p class="preview-sound">
					Typing sound: {availableSounds.find(s => s.value === $currentSound)?.name || 'None'}
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.settings-panel {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--shop-bg, #f8f9fa);
		padding: 1.5rem;
		overflow-y: auto;
	}

	.settings-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.settings-header h2 {
		margin: 0 0 0.5rem 0;
		color: var(--text-color, #333);
		font-size: 1.8rem;
	}

	.settings-header p {
		margin: 0;
		color: var(--muted-color, #666);
		font-size: 1rem;
	}

	.settings-content {
		flex: 1;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}

	.setting-group {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--card-bg, #fff);
		border: 2px solid var(--border-color, #e5e5e5);
		border-radius: 12px;
		transition: all 0.2s;
	}

	.setting-group:hover {
		border-color: var(--accent-color, #007acc);
		box-shadow: 0 4px 12px rgba(0, 122, 204, 0.1);
	}

	.setting-label {
		display: block;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-color, #333);
		margin-bottom: 0.75rem;
	}

	.setting-select {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 2px solid var(--border-color, #ddd);
		border-radius: 8px;
		background: var(--button-bg, #fff);
		color: var(--text-color, #333);
		cursor: pointer;
		transition: all 0.2s;
	}

	.setting-select:focus {
		outline: none;
		border-color: var(--accent-color, #007acc);
		box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
	}

	.setting-select:hover {
		border-color: var(--accent-color, #007acc);
	}

	.setting-description {
		margin: 0.75rem 0 0 0;
		font-size: 0.9rem;
		color: var(--muted-color, #666);
		line-height: 1.4;
	}

	.preview-box {
		padding: 1rem;
		background: var(--editor-bg, #fff);
		border: 2px solid var(--border-color, #e5e5e5);
		border-radius: 8px;
		margin-top: 0.75rem;
	}

	.preview-box p {
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.preview-theme {
		font-size: 0.9rem;
		color: var(--accent-color, #007acc);
		font-weight: 500;
	}

	.preview-sound {
		font-size: 0.9rem;
		color: var(--muted-color, #666);
		font-style: italic;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.settings-panel {
			padding: 1rem;
		}

		.setting-group {
			padding: 1rem;
		}

		.settings-header h2 {
			font-size: 1.5rem;
		}
	}
</style> 