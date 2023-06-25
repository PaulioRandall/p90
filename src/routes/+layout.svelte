<div class="page">
	<slot />
</div>

<style>
	.page {
		width: 100vw;
		min-height: 100vh;
	}

	/* prettier-ignore */
	$renderColorSchemes

	:global(*),
	:global(::before),
	:global(::after) {
		box-sizing: border-box;
		border: 0 solid transparent;
	}

	:global(body) {
		background-color: $theme.primary;

		padding: 0;
		margin: 0;

		color: $theme.text;
		font-size: $font.size.md;
		text-size-adjust: 100%;
		tab-size: 2;
	}

	:global(main) {
		padding: 0 1rem;
	}

	:global(a:link),
	:global(a:hover),
	:global(a:active),
	:global(a:visited) {
		color: $theme.link;
		text-decoration: none;
	}

	:global(a:hover) {
		cursor: pointer;
		text-decoration: underline;
	}
</style>
