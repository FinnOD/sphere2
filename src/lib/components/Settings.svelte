<script lang="ts">
	import { settings, type Settings } from '$lib/state';

	function updateSetting<K extends keyof Settings['debug']>(key: K, value: Settings['debug'][K]) {
		settings.update((settings) => {
			settings.debug[key] = value;
			return settings;
		});
	}
</script>

<div class="wrapper">
	{#each Object.entries($settings.debug) as [key, value]}
        <label>
            {#if typeof value === 'boolean'}
                <input
                    type="checkbox"
                    bind:checked={$settings['debug'][key]}
                />
                {key}
            {/if}
            {#if typeof value === 'number'}
                <input
                    type="number"
                    bind:value={$settings['debug'][key]}
                />
                {key}
            {/if}
		</label>
        <br />
	{/each}
</div>

<style>
	.wrapper {
		position: absolute;
	}
</style>
