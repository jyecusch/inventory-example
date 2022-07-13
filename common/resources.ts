import { topic, faas, api, bucket, events, collection, Topic } from "@nitric/sdk";

// Collections
export const products = collection("products").for("writing", "reading");

// API
export const inventoryApi = api("inventory");

// Topics
export const inventoryPub = topic('inventory').for('publishing');

export const inventorySub = topic('inventory')

// Buckets
export const imageBucket = bucket('images').for('reading', 'writing');

