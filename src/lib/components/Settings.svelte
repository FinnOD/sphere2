<script lang="ts">
	import { renderInfo, playerPosition, settings, type Settings } from '$lib/state';
	import { useFrame, useThrelte } from '@threlte/core';
	import { Spherical } from 'three';

    // const { renderer } = useThrelte();
    // let info;


	function updateSetting<K extends keyof Settings['debug']>(key: K, value: Settings['debug'][K]) {
		settings.update((settings) => {
			settings.debug[key] = value;
			return settings;
		});
	}

    $: spherePos = new Spherical().setFromVector3($playerPosition);

    // useFrame(() => {
    //     info = renderer?.info;
    // })

    function formatNumber(number: number): string {
        const maxLength = 8;
        const formattedNumber = Number(number).toFixed(2);
        const paddingLength = Math.max(0, maxLength - formattedNumber.length);
        const paddedNumber = ' '.repeat(paddingLength) + formattedNumber;
        return paddedNumber;
    }
</script>

<div class="wrapper">
   
    <ul style="font-family:monospace;">
        <li>r = {((spherePos.radius).toFixed(2)).padStart(7,  " ")}</li>
        <li>h = {((3000-spherePos.radius).toFixed(2)).padStart(7, " ")}</li>
        <li>x = {$playerPosition.x}</li>
        <li>y = {$playerPosition.y}</li>
        <li>z = {$playerPosition.z}</li>
        {#each Object.entries($renderInfo) as [key, value]}
            <li>{key}: {value}</li>
        {/each}
    </ul>
        
    
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
