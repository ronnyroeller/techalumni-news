import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import { Article, FeedConfig } from "../types";

const parser = new Parser({
	requestOptions: {
		headers: {
			Connection: "close"
		}
	}
});

export async function loadFeeds(): Promise<FeedConfig[]> {
	const configPath = path.resolve("config", "feeds.json");
	const rawData = fs.readFileSync(configPath, "utf-8");
	return JSON.parse(rawData);
}

export async function fetchArticles(feeds: FeedConfig[]): Promise<Article[]> {
	const all: Article[] = [];

	for (const { name, url } of feeds) {
		try {
			const feed = await parser.parseURL(url);
			for (const item of feed.items) {
				all.push({
					title: item.title ?? "",
					summary: item.contentSnippet ?? "",
					link: item.link ?? "",
					published: item.isoDate ?? "",
					source: name,
				});
			}
		} catch (err) {
			console.error(`⚠️ Failed to fetch from ${name}:`, err);
		}
	}

	return all;
}
