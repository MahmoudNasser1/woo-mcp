import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// WooCommerce / WordPress credentials
const SITE_URL = process.env.WORDPRESS_SITE_URL || "https://fixzzone.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const WP_USER = process.env.WORDPRESS_USERNAME;
const WP_PASS = process.env.WORDPRESS_PASSWORD;

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.warn("⚠️ WooCommerce credentials missing in environment!");
}

// Helper for WooCommerce API (module-level, shared across all sessions)
const wooClient = axios.create({
    baseURL: `${SITE_URL}/wp-json/wc/v3`,
    params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
    },
    headers: { "Content-Type": "application/json" }
});

// Helper for WordPress API (Media/SEO)
const wpAuth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const wpClient = axios.create({
    baseURL: `${SITE_URL}/wp-json/wp/v2`,
    headers: {
        "Authorization": `Basic ${wpAuth}`,
        "Content-Type": "application/json"
    }
});

// Factory function: creates a fresh Server instance per SSE connection.
// This prevents the "Already connected to a transport" crash when multiple
// clients connect simultaneously.
function createServer() {
    const server = new Server(
        {
            name: "fz-woocommerce-mcp",
            version: "1.0.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: "get_products",
                    description: "List WooCommerce products with pagination and filters",
                    inputSchema: {
                        type: "object",
                        properties: {
                            per_page: { type: "number", default: 10 },
                            page: { type: "number", default: 1 },
                            status: { type: "string", enum: ["publish", "draft", "pending", "private"] },
                            category: { type: "string", description: "Category ID" }
                        }
                    }
                },
                {
                    name: "search_products",
                    description: "Search products by name, SKU, or part number",
                    inputSchema: {
                        type: "object",
                        properties: {
                            search: { type: "string", description: "Term to search for" },
                            sku: { type: "string", description: "Search by SKU" }
                        },
                        required: ["search"]
                    }
                },
                {
                    name: "get_product",
                    description: "Get full product details by ID",
                    inputSchema: {
                        type: "object",
                        properties: { id: { type: "number" } },
                        required: ["id"]
                    }
                },
                {
                    name: "create_product",
                    description: "Create a new WooCommerce product",
                    inputSchema: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            type: { type: "string", default: "simple" },
                            regular_price: { type: "string" },
                            description: { type: "string" },
                            categories: { type: "array", items: { type: "object", properties: { id: { type: "number" } } } },
                            images: { type: "array", items: { type: "object", properties: { src: { type: "string" } } } },
                            sku: { type: "string" },
                            meta_data: { type: "array" }
                        },
                        required: ["name", "regular_price"]
                    }
                },
                {
                    name: "update_product",
                    description: "Update an existing WooCommerce product",
                    inputSchema: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            data: { type: "object" }
                        },
                        required: ["id", "data"]
                    }
                },
                {
                    name: "check_duplicate",
                    description: "Check if product exists by Part Number (meta_data) or SKU",
                    inputSchema: {
                        type: "object",
                        properties: {
                            part_number: { type: "string" },
                            sku: { type: "string" }
                        }
                    }
                },
                {
                    name: "upload_media",
                    description: "Upload image to WordPress media library from URL",
                    inputSchema: {
                        type: "object",
                        properties: {
                            url: { type: "string" },
                            title: { type: "string" }
                        },
                        required: ["url"]
                    }
                },
                {
                    name: "update_rank_math_seo",
                    description: "Update Rank Math SEO fields for a product",
                    inputSchema: {
                        type: "object",
                        properties: {
                            productId: { type: "number" },
                            title: { type: "string" },
                            description: { type: "string" },
                            focusKeyword: { type: "string" }
                        },
                        required: ["productId"]
                    }
                }
            ]
        };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        try {
            switch (name) {
                case "get_products": {
                    const response = await wooClient.get("/products", { params: args });
                    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
                }
                case "search_products": {
                    const response = await wooClient.get("/products", { params: { search: args.search, sku: args.sku } });
                    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
                }
                case "get_product": {
                    const response = await wooClient.get(`/products/${args.id}`);
                    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
                }
                case "create_product": {
                    const response = await wooClient.post("/products", args);
                    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
                }
                case "update_product": {
                    const response = await wooClient.put(`/products/${args.id}`, args.data);
                    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
                }
                case "check_duplicate": {
                    let results = [];
                    if (args.sku) {
                        const res = await wooClient.get("/products", { params: { sku: args.sku } });
                        results = results.concat(res.data);
                    }
                    if (args.part_number && results.length === 0) {
                        const res = await wooClient.get("/products", {
                            params: {
                                search: args.part_number
                            }
                        });
                        results = results.concat(res.data);
                    }
                    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
                }
                case "upload_media": {
                    const imageRes = await fetch(args.url);
                    const buffer = await imageRes.arrayBuffer();
                    const form = new FormData();
                    form.append("file", Buffer.from(buffer), { filename: "image.jpg", contentType: "image/jpeg" });
                    if (args.title) form.append("title", args.title);

                    const response = await wpClient.post("/media", form, {
                        headers: { ...form.getHeaders() }
                    });
                    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
                }
                case "update_rank_math_seo": {
                    const meta = [];
                    if (args.title) meta.push({ key: "rank_math_title", value: args.title });
                    if (args.description) meta.push({ key: "rank_math_description", value: args.description });
                    if (args.focusKeyword) meta.push({ key: "rank_math_focus_keyword", value: args.focusKeyword });

                    const response = await wooClient.put(`/products/${args.productId}`, { meta_data: meta });
                    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
                }
                default:
                    throw new Error(`Tool not found: ${name}`);
            }
        } catch (error) {
            const msg = error.response ? JSON.stringify(error.response.data) : error.message;
            return {
                content: [{ type: "text", text: `Error: ${msg}` }],
                isError: true
            };
        }
    });

    return server;
}

// Session store: maps sessionId -> { transport, server }
const transports = new Map();

app.get("/sse", async (req, res) => {
    console.log("New SSE connection");
    // Create a fresh server instance for this connection — prevents the
    // 'Already connected to a transport' error on concurrent connections.
    const server = createServer();
    const transport = new SSEServerTransport("/mcp/sse", res);
    await server.connect(transport);

    const sessionId = transport.sessionId;
    transports.set(sessionId, { transport, server });

    res.on("close", () => {
        console.log(`SSE connection closed: ${sessionId}`);
        transports.delete(sessionId);
    });
});

app.post("/sse", async (req, res) => {
    const sessionId = req.query.sessionId;
    const entry = transports.get(sessionId);
    if (!entry) {
        console.log(`Session not found: ${sessionId}`);
        return res.status(404).send("Session not found");
    }
    await entry.transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`WooCommerce MCP server running on port ${PORT}`);
});
