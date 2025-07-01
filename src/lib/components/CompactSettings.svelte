<script lang="ts">
	import { upgrades, currentTheme, currentFont, currentSound, getAvailableFonts, getAvailableThemes, getAvailableSounds } from '../stores.js';

	$: availableFonts = getAvailableFonts($upgrades);
	$: availableThemes = getAvailableThemes($upgrades);
	$: availableSounds = getAvailableSounds($upgrades);
</script>

<div class="compact-settings">
	<div class="settings-group">
		<div class="setting-item">
			<div class="setting-icon-wrapper">
				<img src="/font-icon.png" alt="Font" class="setting-icon" />
			</div>
			<select 
				bind:value={$currentFont}
				class="modern-select"
				title="Font Style"
			>
				{#each availableFonts as font}
					<option value={font.value}>{font.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="settings-group">
		<div class="setting-item">
			<div class="setting-icon-wrapper">
				<img src="/theme-icon.png" alt="Theme" class="setting-icon" />
			</div>
			<select 
				bind:value={$currentTheme}
				class="modern-select"
				title="Theme"
			>
				{#each availableThemes as theme}
					<option value={theme.value}>{theme.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="settings-group">
		<div class="setting-item">
			<div class="setting-icon-wrapper">
				<img src="/sound-icon.png" alt="Sound" class="setting-icon" />
			</div>
			<select 
				bind:value={$currentSound}
				class="modern-select"
				title="Typing Sounds"
			>
				{#each availableSounds as sound}
					<option value={sound.value}>{sound.name}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style>
	.compact-settings {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, 
			rgba(248, 249, 250, 0.95), 
			rgba(255, 255, 255, 0.9)
		);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		position: relative;
	}

	.compact-settings::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(79, 195, 247, 0.3), 
			transparent
		);
	}

	.settings-group {
		display: flex;
		align-items: center;
	}

	.setting-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.setting-item:hover {
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(79, 195, 247, 0.3);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-1px);
	}

	.setting-icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: linear-gradient(135deg, #f8f9fa, #e9ecef);
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
	}

	.setting-item:hover .setting-icon-wrapper {
		background: linear-gradient(135deg, #ffffff, #f0f8ff);
		border-color: rgba(79, 195, 247, 0.4);
		transform: scale(1.05);
		box-shadow: 0 2px 8px rgba(79, 195, 247, 0.2);
	}

	.setting-icon {
		width: 18px;
		height: 18px;
		object-fit: contain;
		transition: all 0.3s ease;
		opacity: 0.7;
	}

	.setting-item:hover .setting-icon {
		opacity: 1;
	}

	.modern-select {
		appearance: none;
		background: transparent;
		border: none;
		padding: 0.5rem 1rem 0.5rem 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-color, #333);
		cursor: pointer;
		outline: none;
		min-width: 140px;
		position: relative;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1rem;
	}

	.modern-select:focus {
		color: #1565c0;
	}

	.modern-select option {
		background: white;
		color: #333;
		padding: 0.5rem;
		border-radius: 4px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.compact-settings {
			flex-wrap: wrap;
			gap: 1rem;
			padding: 1rem;
		}

		.setting-item {
			flex: 1;
			min-width: 0;
		}

		.modern-select {
			min-width: 100px;
			font-size: 0.8rem;
		}
	}

	@media (max-width: 480px) {
		.compact-settings {
			flex-direction: column;
			gap: 0.75rem;
		}

		.setting-item {
			width: 100%;
			justify-content: space-between;
		}

		.modern-select {
			text-align: right;
		}
	}
</style> 