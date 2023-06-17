<script>
	import Title from './Title.svelte'
	import Paragraph from './Paragraph.svelte'

	const title = 'Minimalist CSS pre-processor for Svelte'
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main>
	<Title>{title}</Title>
	<Paragraph>A paragraph...</Paragraph>
</main>
