<script>
	import { page } from '$app/stores'

	import Title from './Title.svelte'
	import Paragraph from './Paragraph.svelte'
</script>

<svelte:head>
	<title>Error: {$page.error.message}</title>
</svelte:head>

<main>
	<Title>{$page.status}</Title>
	<Paragraph center>
		{$page.error.message}
	</Paragraph>
</main>
