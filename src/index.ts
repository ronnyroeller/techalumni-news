import { classifyArticles } from "./lib/classify-articles";
import { fetchArticles, loadFeeds } from "./lib/load-feeds";
import { saveAsCsv } from "./lib/save-report";

const NR_MOST_RECENT_DAYS = 7;

function daysAgo(days: number) {
	const now = new Date();
	const daysAgoDate = new Date();
	daysAgoDate.setDate(now.getDate() - days);
	return daysAgoDate.toISOString();
}

async function main() {
	const feeds = await loadFeeds();
	const articles = await fetchArticles(feeds);
	console.log(`Fetched ${articles.length} articles from ${feeds.length} feeds`);

	const recentCutoff = daysAgo(NR_MOST_RECENT_DAYS);
	const recentArticles = articles.filter(article => article.published >= recentCutoff);

	console.log(`Classifying ${recentArticles.length} recent articles...`);
	const classifiedArticles = await classifyArticles(recentArticles);

	await saveAsCsv(classifiedArticles);
}

main().catch(e => console.error(e));
