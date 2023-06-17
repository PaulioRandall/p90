<script>
	export let center = false
</script>

<p class="paragraph" class:center>
	<slot />
</p>

<style>
	.paragraph {
		margin: 0;
		padding: 0;

		margin-bottom: 1rem;
	}

	.center {
		text-align: center;
	}
</style>
