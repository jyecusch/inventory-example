import { topic, faas, api, bucket, events, collection, Topic } from "@nitric/sdk";

// Collections
export const products = collection("products").for("writing", "reading");

// API
export const inventoryApi = api("inv");

// Topics
export const inventorySub = topic('updates')

export const inventoryPub = inventorySub.for('publishing');


// Buckets
export const imageBucket = bucket('images').for('reading', 'writing');

