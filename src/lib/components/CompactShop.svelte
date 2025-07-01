<script lang="ts">
	import { upgrades, chars, purchaseUpgrade, type Upgrade } from '../stores.js';

	let selectedCategory: string = 'all';
	let isCollapsed = false;
	
	const categories = [
		{ id: 'all', name: 'All', icon: 'text', label: 'All' },
		{ id: 'font', name: 'Fonts', icon: '/font-icon.png', label: 'Font' },
		{ id: 'theme', name: 'Themes', icon: '/theme-icon.png', label: 'Theme' },
		{ id: 'sound', name: 'Sounds', icon: '/sound-icon.png', label: 'Sound' },
		{ id: 'emoji', name: 'Emojis', icon: 'text', label: ':)' }
	];

	$: filteredUpgrades = $upgrades.filter(upgrade => 
		selectedCategory === 'all' || upgrade.type === selectedCategory
	);

	$: availableUpgrades = filteredUpgrades
		.filter(upgrade => !upgrade.purchased)
		.sort((a, b) => a.cost - b.cost);
	$: purchasedUpgrades = filteredUpgrades
		.filter(upgrade => upgrade.purchased)
		.sort((a, b) => a.cost - b.cost);

	function handlePurchase(upgradeId: string) {
		const success = purchaseUpgrade(upgradeId);
		if (success) {
			console.log('Upgrade purchased successfully!');
		} else {
			console.log('Not enough chars!');
		}
	}

	function getUpgradeIcon(type: string): { type: 'image' | 'text', value: string } {
		switch (type) {
			case 'font': return { type: 'image', value: '/font-icon.png' };
			case 'theme': return { type: 'image', value: '/theme-icon.png' };
			case 'sound': return { type: 'image', value: '/sound-icon.png' };
			case 'emoji': return { type: 'text', value: ':)' };
			default: return { type: 'text', value: 'Item' };
		}
	}
</script>

<div class="compact-shop" class:collapsed={isCollapsed}>
	<div class="shop-header">
		<button 
			class="collapse-btn"
			on:click={() => isCollapsed = !isCollapsed}
			title={isCollapsed ? 'Expand Shop' : 'Collapse Shop'}
		>
			{isCollapsed ? '◀' : '▶'}
		</button>
		{#if !isCollapsed}
			<h3>Shop</h3>
		{/if}
	</div>

	{#if !isCollapsed}
		<div class="category-filter">
			{#each categories as category}
				<button
					class="category-btn"
					class:active={selectedCategory === category.id}
					on:click={() => selectedCategory = category.id}
					title={category.name}
				>
					{#if category.icon === 'text'}
						<span class="category-text">{category.label}</span>
					{:else}
						<img src={category.icon} alt={category.name} class="category-icon" />
					{/if}
				</button>
			{/each}
		</div>

		<div class="shop-content">
			{#if availableUpgrades.length > 0}
				<div class="upgrades-section">
					<h4>Available</h4>
					{#each availableUpgrades as upgrade (upgrade.id)}
						<div class="upgrade-card compact">
							<div class="upgrade-header">
								{#if getUpgradeIcon(upgrade.type).type === 'image'}
									<img src={getUpgradeIcon(upgrade.type).value} alt={upgrade.type} class="upgrade-icon" />
								{:else}
									<span class="upgrade-text-icon">{getUpgradeIcon(upgrade.type).value}</span>
								{/if}
								<div class="upgrade-info">
									<h5>{upgrade.name}</h5>
									<p>{upgrade.description}</p>
								</div>
							</div>
							
							<div class="upgrade-footer">
								<div class="upgrade-cost">
									{upgrade.cost} chars
								</div>
								<button
									class="purchase-btn compact"
									class:disabled={$chars < upgrade.cost}
									disabled={$chars < upgrade.cost}
									on:click={() => handlePurchase(upgrade.id)}
								>
									{$chars >= upgrade.cost ? 'Buy' : 'Need More'}
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if purchasedUpgrades.length > 0}
				<div class="upgrades-section">
					<h4>Owned</h4>
					{#each purchasedUpgrades as upgrade (upgrade.id)}
						<div class="upgrade-card compact purchased">
							<div class="upgrade-header">
								{#if getUpgradeIcon(upgrade.type).type === 'image'}
									<img src={getUpgradeIcon(upgrade.type).value} alt={upgrade.type} class="upgrade-icon" />
								{:else}
									<span class="upgrade-text-icon">{getUpgradeIcon(upgrade.type).value}</span>
								{/if}
								<div class="upgrade-info">
									<h5>{upgrade.name}</h5>
								</div>
							</div>
							<div class="owned-badge">Owned</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if filteredUpgrades.length === 0}
				<div class="empty-category">
					<p>No items in this category</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.compact-shop {
		width: 280px;
		height: 100%;
		background: var(--sidebar-bg, #f8f9fa);
		border-right: 2px solid var(--border-color, #e5e5e5);
		display: flex;
		flex-direction: column;
		transition: width 0.3s ease;
		overflow: hidden;
	}

	.compact-shop.collapsed {
		width: 50px;
	}

	.shop-header {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		background: var(--header-bg, #fff);
		gap: 0.5rem;
	}

	.collapse-btn {
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(79, 195, 247, 0.3);
		position: relative;
		overflow: hidden;
	}

	.collapse-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255, 255, 255, 0.2), 
			transparent
		);
		transition: left 0.5s ease;
	}

	.collapse-btn:hover::before {
		left: 100%;
	}

	.collapse-btn:hover {
		background: linear-gradient(135deg, #29b6f6, #1e88e5);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
	}

	.collapse-btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(79, 195, 247, 0.3);
	}

	.shop-header h3 {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-color, #333);
		font-weight: 600;
	}

	.category-filter {
		display: flex;
		padding: 0.5rem;
		gap: 0.25rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		background: var(--header-bg, #fff);
		flex-wrap: wrap;
	}

	.category-btn {
		padding: 0.5rem 0.75rem;
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.9), 
			rgba(248, 249, 250, 0.8)
		);
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		flex: 1;
		min-width: 45px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		position: relative;
		overflow: hidden;
	}

	.category-btn::before {
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

	.category-btn:hover {
		border-color: rgba(79, 195, 247, 0.3);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.category-btn:hover::before {
		opacity: 0.1;
	}

	.category-btn.active {
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		color: white;
		border-color: #29b6f6;
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
	}

	.category-icon {
		width: 16px;
		height: 16px;
		object-fit: contain;
		transition: all 0.3s ease;
	}

	.category-text {
		font-size: 0.8rem;
		font-weight: 500;
	}

	.shop-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.upgrades-section {
		margin-bottom: 1rem;
	}

	.upgrades-section h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: var(--muted-color, #666);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 0 0.5rem;
	}

	.upgrade-card.compact {
		background: var(--card-bg, #fff);
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 8px;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		transition: all 0.2s;
	}

	.upgrade-card.compact:hover {
		border-color: var(--accent-color, #007acc);
		box-shadow: 0 2px 6px rgba(0, 122, 204, 0.1);
	}

	.upgrade-card.compact.purchased {
		border-color: var(--success-color, #28a745);
		background: var(--success-bg, #f8fff9);
	}

	.upgrade-header {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		align-items: flex-start;
	}

	.upgrade-icon {
		width: 20px;
		height: 20px;
		object-fit: contain;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
		flex-shrink: 0;
	}

	.upgrade-text-icon {
		background: var(--accent-color, #007acc);
		color: white;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 500;
		flex-shrink: 0;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
	}

	.upgrade-info {
		flex: 1;
		min-width: 0;
	}

	.upgrade-info h5 {
		margin: 0 0 0.25rem 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-color, #333);
		line-height: 1.2;
	}

	.upgrade-info p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--muted-color, #666);
		line-height: 1.3;
	}

	.upgrade-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.upgrade-cost {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--accent-color, #007acc);
	}

	.purchase-btn.compact {
		padding: 0.4rem 0.8rem;
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		white-space: nowrap;
		box-shadow: 0 2px 8px rgba(79, 195, 247, 0.3);
		position: relative;
		overflow: hidden;
	}

	.purchase-btn.compact::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255, 255, 255, 0.2), 
			transparent
		);
		transition: left 0.5s ease;
	}

	.purchase-btn.compact:hover:not(.disabled)::before {
		left: 100%;
	}

	.purchase-btn.compact:hover:not(.disabled) {
		background: linear-gradient(135deg, #29b6f6, #1e88e5);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
	}

	.purchase-btn.compact:active:not(.disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(79, 195, 247, 0.3);
	}

	.purchase-btn.compact.disabled {
		background: linear-gradient(135deg, #e0e0e0, #bdbdbd);
		cursor: not-allowed;
		opacity: 0.6;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.purchase-btn.compact.disabled::before {
		display: none;
	}

	.owned-badge {
		background: var(--success-color, #28a745);
		color: white;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	.empty-category {
		text-align: center;
		padding: 1rem;
		color: var(--muted-color, #666);
		font-size: 0.8rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.compact-shop {
			width: 100%;
			height: auto;
			border-right: none;
			border-bottom: 2px solid var(--border-color, #e5e5e5);
		}

		.compact-shop.collapsed {
			width: 100%;
		}

		.shop-content {
			max-height: 200px;
		}
	}
</style> 