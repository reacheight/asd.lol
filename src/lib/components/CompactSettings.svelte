<script lang="ts">
	import { upgrades, currentTheme, currentFont, currentSound, getAvailableFonts, getAvailableThemes, getAvailableSounds } from '../stores.js';

	$: availableFonts = getAvailableFonts($upgrades);
	$: availableThemes = getAvailableThemes($upgrades);
	$: availableSounds = getAvailableSounds($upgrades);
</script>

<div class="compact-settings">
	<div class="settings-group">
		<label for="font-select-compact">
			<img src="/font-icon.png" alt="Font" class="setting-icon" />
		</label>
		<select 
			id="font-select-compact"
			bind:value={$currentFont}
			class="compact-select"
			title="Font Style"
		>
			{#each availableFonts as font}
				<option value={font.value}>{font.name}</option>
			{/each}
		</select>
	</div>

	<div class="settings-group">
		<label for="theme-select-compact">
			<img src="/theme-icon.png" alt="Theme" class="setting-icon" />
		</label>
		<select 
			id="theme-select-compact"
			bind:value={$currentTheme}
			class="compact-select"
			title="Theme"
		>
			{#each availableThemes as theme}
				<option value={theme.value}>{theme.name}</option>
			{/each}
		</select>
	</div>

	<div class="settings-group">
		<label for="sound-select-compact">
			<img src="/sound-icon.png" alt="Sound" class="setting-icon" />
		</label>
		<select 
			id="sound-select-compact"
			bind:value={$currentSound}
			class="compact-select"
			title="Typing Sounds"
		>
			{#each availableSounds as sound}
				<option value={sound.value}>{sound.name}</option>
			{/each}
		</select>
	</div>
</div>

<style>
	.compact-settings {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.75rem 1rem;
		background: var(--header-bg, #f8f9fa);
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		flex-wrap: wrap;
	}

	.settings-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.settings-group label {
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.setting-icon {
		width: 20px;
		height: 20px;
		object-fit: contain;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
		transition: all 0.2s;
	}

	.setting-icon:hover {
		transform: scale(1.1);
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.compact-select {
		padding: 0.4rem 0.6rem;
		font-size: 0.9rem;
		border: 1px solid var(--border-color, #ddd);
		border-radius: 6px;
		background: var(--button-bg, #fff);
		color: var(--text-color, #333);
		cursor: pointer;
		transition: all 0.2s;
		min-width: 120px;
	}

	.compact-select:focus {
		outline: none;
		border-color: var(--accent-color, #007acc);
		box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.1);
	}

	.compact-select:hover {
		border-color: var(--accent-color, #007acc);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.compact-settings {
			flex-direction: column;
			gap: 0.5rem;
			align-items: stretch;
		}

		.settings-group {
			justify-content: space-between;
		}

		.compact-select {
			flex: 1;
			min-width: unset;
		}
	}
</style> 