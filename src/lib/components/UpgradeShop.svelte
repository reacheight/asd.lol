<script lang="ts">
	import { upgrades, coins, purchaseUpgrade, type Upgrade } from '../stores.js';

	let selectedCategory: string = 'all';
	
	const categories = [
		{ id: 'all', name: 'All', icon: '🛍️' },
		{ id: 'font', name: 'Fonts', icon: '🔤' },
		{ id: 'theme', name: 'Themes', icon: '🎨' },
		{ id: 'sound', name: 'Sounds', icon: '🔊' },
		{ id: 'emoji', name: 'Emojis', icon: '😊' }
	];

	$: filteredUpgrades = $upgrades.filter(upgrade => 
		selectedCategory === 'all' || upgrade.type === selectedCategory
	);

	function handlePurchase(upgradeId: string) {
		const success = purchaseUpgrade(upgradeId);
		if (success) {
			// Could add success animation or sound here
			console.log('Upgrade purchased successfully!');
		} else {
			// Could add error feedback here
			console.log('Not enough coins!');
		}
	}

	function getUpgradeIcon(type: string): string {
		switch (type) {
			case 'font': return '🔤';
			case 'theme': return '🎨';
			case 'sound': return '🔊';
			case 'emoji': return '😊';
			default: return '🛍️';
		}
	}
</script>

<div class="upgrade-shop">
	<div class="shop-header">
		<h2>Upgrade Shop</h2>
		<p class="shop-description">
			Enhance your writing experience with awesome upgrades!
		</p>
	</div>

	<div class="category-tabs">
		{#each categories as category}
			<button
				class="category-tab"
				class:active={selectedCategory === category.id}
				on:click={() => selectedCategory = category.id}
			>
				<span class="category-icon">{category.icon}</span>
				{category.name}
			</button>
		{/each}
	</div>

	<div class="upgrades-grid">
		{#each filteredUpgrades as upgrade (upgrade.id)}
			<div class="upgrade-card" class:purchased={upgrade.purchased}>
				<div class="upgrade-header">
					<div class="upgrade-icon">{getUpgradeIcon(upgrade.type)}</div>
					<div class="upgrade-info">
						<h3 class="upgrade-name">{upgrade.name}</h3>
						<p class="upgrade-description">{upgrade.description}</p>
					</div>
				</div>
				
				<div class="upgrade-footer">
					<div class="upgrade-cost">
						<span class="coin-icon">🪙</span>
						{upgrade.cost}
					</div>
					
					{#if upgrade.purchased}
						<div class="purchased-badge">
							✓ Owned
						</div>
					{:else}
						<button
							class="purchase-btn"
							class:disabled={$coins < upgrade.cost}
							disabled={$coins < upgrade.cost}
							on:click={() => handlePurchase(upgrade.id)}
						>
							{$coins >= upgrade.cost ? 'Buy Now' : 'Not Enough Coins'}
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if filteredUpgrades.length === 0}
		<div class="empty-category">
			<p>No upgrades in this category yet!</p>
			<p>More upgrades coming soon...</p>
		</div>
	{/if}
</div>

<style>
	.upgrade-shop {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--shop-bg, #f8f9fa);
		padding: 1rem;
		overflow-y: auto;
	}

	.shop-header {
		margin-bottom: 1.5rem;
	}

	.shop-header h2 {
		margin: 0 0 0.5rem 0;
		color: var(--text-color, #333);
		font-size: 1.5rem;
	}

	.shop-description {
		margin: 0;
		color: var(--muted-color, #666);
		font-size: 0.95rem;
	}

	.category-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.category-tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 2px solid var(--border-color, #ddd);
		background: var(--tab-bg, #fff);
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.category-tab:hover {
		border-color: var(--accent-color, #007acc);
		background: var(--tab-hover-bg, #f0f8ff);
	}

	.category-tab.active {
		background: var(--accent-color, #007acc);
		color: white;
		border-color: var(--accent-color, #007acc);
	}

	.category-icon {
		font-size: 1.1rem;
	}

	.upgrades-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		flex: 1;
	}

	.upgrade-card {
		background: var(--card-bg, #fff);
		border: 2px solid var(--border-color, #e5e5e5);
		border-radius: 12px;
		padding: 1rem;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 140px;
	}

	.upgrade-card:hover {
		border-color: var(--accent-color, #007acc);
		box-shadow: 0 4px 12px rgba(0, 122, 204, 0.1);
		transform: translateY(-2px);
	}

	.upgrade-card.purchased {
		border-color: var(--success-color, #28a745);
		background: var(--success-bg, #f8fff9);
	}

	.upgrade-header {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.upgrade-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.upgrade-info {
		flex: 1;
	}

	.upgrade-name {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-color, #333);
	}

	.upgrade-description {
		margin: 0;
		font-size: 0.9rem;
		color: var(--muted-color, #666);
		line-height: 1.4;
	}

	.upgrade-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.upgrade-cost {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: 600;
		color: var(--accent-color, #007acc);
		font-size: 1.1rem;
	}

	.coin-icon {
		font-size: 1rem;
	}

	.purchase-btn {
		padding: 0.5rem 1rem;
		background: var(--accent-color, #007acc);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.purchase-btn:hover:not(.disabled) {
		background: var(--accent-hover-color, #005a9e);
		transform: translateY(-1px);
	}

	.purchase-btn.disabled {
		background: var(--disabled-color, #ccc);
		cursor: not-allowed;
		opacity: 0.6;
	}

	.purchased-badge {
		background: var(--success-color, #28a745);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-weight: 500;
		font-size: 0.9rem;
	}

	.empty-category {
		text-align: center;
		padding: 2rem;
		color: var(--muted-color, #666);
	}

	.empty-category p {
		margin: 0.5rem 0;
	}
</style> 