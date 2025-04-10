import { createObjectCsvWriter } from "csv-writer";
import { Article } from "../types";

export async function saveAsCsv(articles: Article[], output = "cybersecurity_report.csv") {
	const writer = createObjectCsvWriter({
		path: output,
		header: [
			{ id: "title", title: "Title" },
			{ id: "summary", title: "Summary" },
			{ id: "link", title: "Link" },
			{ id: "published", title: "Published" },
			{ id: "source", title: "Source" },
			{ id: "category", title: "Category" },
			{ id: "severity", title: "Severity" },
		],
	});

	await writer.writeRecords(articles);
	console.log(`✅ Saved ${articles.length} articles to ${output}`);
}
