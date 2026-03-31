#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { WooMetaData } from "./types.js";
import * as fs from "fs";
import * as path from "path";
import FormData from "form-data";

// Get WordPress credentials from environment variables
const DEFAULT_SITE_URL = process.env.WORDPRESS_SITE_URL || "";
const DEFAULT_USERNAME = process.env.WORDPRESS_USERNAME || "";
const DEFAULT_PASSWORD = process.env.WORDPRESS_PASSWORD || "";
const DEFAULT_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const DEFAULT_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

interface AxiosError {
  response?: {
    data?: {
      message: string;
      code?: string;
    };
  };
  message: string;
}

const isAxiosError = (error: unknown): error is AxiosError => {
  return (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    (error as any).response !== undefined
  );
};

// Helper function to get MIME type from file extension
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// Create MCP Server
const server = new Server(
  {
    name: "woocommerce-mcp-server",
    version: "1.0.2",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define all available tools
const tools: Tool[] = [
  // WordPress Posts
  {
    name: "create_post",
    description: "Create a new WordPress post",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string", description: "WordPress site URL (optional if env set)" },
        username: { type: "string", description: "WordPress username (optional if env set)" },
        password: { type: "string", description: "WordPress password (optional if env set)" },
        title: { type: "string", description: "Post title" },
        content: { type: "string", description: "Post content" },
        status: { type: "string", description: "Post status (publish, draft, etc.)", default: "draft" },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "get_posts",
    description: "Retrieve WordPress posts",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        perPage: { type: "number", default: 10 },
        page: { type: "number", default: 1 },
      },
    },
  },
  {
    name: "update_post",
    description: "Update an existing WordPress post",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        postId: { type: "number", description: "Post ID to update" },
        title: { type: "string" },
        content: { type: "string" },
        status: { type: "string" },
      },
      required: ["postId"],
    },
  },
  // WordPress Media
  {
    name: "upload_media",
    description: "Upload an image or media file to WordPress Media Library from local file path or URL",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string", description: "WordPress site URL (optional if env set)" },
        username: { type: "string", description: "WordPress username (optional if env set)" },
        password: { type: "string", description: "WordPress password (optional if env set)" },
        filePath: { type: "string", description: "Local file path to upload (e.g., /path/to/image.jpg)" },
        imageUrl: { type: "string", description: "URL of image to download and upload (e.g., https://example.com/image.jpg)" },
        title: { type: "string", description: "Media title (optional)" },
        alt_text: { type: "string", description: "Alternative text for accessibility (optional)" },
        caption: { type: "string", description: "Media caption (optional)" },
        description: { type: "string", description: "Media description (optional)" },
      },
      required: [],
    },
  },
  // WooCommerce Products
  {
    name: "get_products",
    description: "Retrieve WooCommerce products",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        perPage: { type: "number", default: 10 },
        page: { type: "number", default: 1 },
        filters: { type: "object" },
      },
    },
  },
  {
    name: "get_product",
    description: "Get a single WooCommerce product by ID",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID" },
      },
      required: ["productId"],
    },
  },
  {
    name: "create_product",
    description: "Create a new WooCommerce product",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productData: {
          type: "object",
          description: "Product data (name, type, regular_price, description, short_description, categories, images, etc.)"
        },
      },
      required: ["productData"],
    },
  },
  {
    name: "update_product",
    description: "Update an existing WooCommerce product",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID to update" },
        productData: { type: "object", description: "Product data to update" },
      },
      required: ["productId", "productData"],
    },
  },
  {
    name: "delete_product",
    description: "Delete a WooCommerce product",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID to delete" },
        force: { type: "boolean", default: false, description: "Permanently delete (true) or move to trash (false)" },
      },
      required: ["productId"],
    },
  },
  // WooCommerce Product Categories
  {
    name: "get_product_categories",
    description: "Retrieve WooCommerce product categories",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        perPage: { type: "number", default: 10 },
        page: { type: "number", default: 1 },
        filters: { type: "object" },
      },
    },
  },
  {
    name: "get_product_category",
    description: "Get a single product category by ID",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        categoryId: { type: "number", description: "Category ID" },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "create_product_category",
    description: "Create a new product category",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        categoryData: { type: "object", description: "Category data (name, slug, parent, description, etc.)" },
      },
      required: ["categoryData"],
    },
  },
  {
    name: "update_product_category",
    description: "Update an existing product category",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        categoryId: { type: "number", description: "Category ID to update" },
        categoryData: { type: "object", description: "Category data to update" },
      },
      required: ["categoryId", "categoryData"],
    },
  },
  // WooCommerce Product Variations
  {
    name: "get_product_variations",
    description: "Retrieve product variations",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID" },
        perPage: { type: "number", default: 10 },
        page: { type: "number", default: 1 },
      },
      required: ["productId"],
    },
  },
  {
    name: "create_product_variation",
    description: "Create a new product variation",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID" },
        variationData: { type: "object", description: "Variation data (regular_price, attributes, etc.)" },
      },
      required: ["productId", "variationData"],
    },
  },
  {
    name: "update_product_variation",
    description: "Update an existing product variation",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID" },
        variationId: { type: "number", description: "Variation ID" },
        variationData: { type: "object", description: "Variation data to update" },
      },
      required: ["productId", "variationId", "variationData"],
    },
  },
  // WooCommerce Orders
  {
    name: "get_orders",
    description: "Retrieve WooCommerce orders",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        perPage: { type: "number", default: 10 },
        page: { type: "number", default: 1 },
        filters: { type: "object" },
      },
    },
  },
  {
    name: "get_order",
    description: "Get a single order by ID",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "create_order",
    description: "Create a new order",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        orderData: { type: "object", description: "Order data" },
      },
      required: ["orderData"],
    },
  },
  {
    name: "update_order",
    description: "Update an existing order",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        orderId: { type: "number", description: "Order ID" },
        orderData: { type: "object", description: "Order data to update" },
      },
      required: ["orderId", "orderData"],
    },
  },
  // Rank Math SEO Tools
  {
    name: "get_rank_math_seo",
    description: "Get Rank Math SEO data for a product",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID" },
      },
      required: ["productId"],
    },
  },
  {
    name: "update_rank_math_seo",
    description: "Update Rank Math SEO data for a product (title, description, focus keyword, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        productId: { type: "number", description: "Product ID" },
        title: { type: "string", description: "SEO Title (rank_math_title)" },
        description: { type: "string", description: "SEO Meta Description (rank_math_description)" },
        focusKeyword: { type: "string", description: "Focus Keyword (rank_math_focus_keyword)" },
        robots: { type: "string", description: "Robots meta (index, noindex, follow, nofollow)" },
        canonicalUrl: { type: "string", description: "Canonical URL (rank_math_canonical_url)" },
        facebookTitle: { type: "string", description: "Facebook Title (rank_math_facebook_title)" },
        facebookDescription: { type: "string", description: "Facebook Description (rank_math_facebook_description)" },
        facebookImage: { type: "string", description: "Facebook Image URL (rank_math_facebook_image)" },
        twitterTitle: { type: "string", description: "Twitter Title (rank_math_twitter_title)" },
        twitterDescription: { type: "string", description: "Twitter Description (rank_math_twitter_description)" },
        twitterImage: { type: "string", description: "Twitter Image URL (rank_math_twitter_image)" },
        primaryCategory: { type: "number", description: "Primary Product Category ID (rank_math_primary_product_cat)" },
        primaryBrand: { type: "number", description: "Primary Product Brand ID (rank_math_primary_product_brand)" },
      },
      required: ["productId"],
    },
  },
  // NEW: Search Products
  {
    name: "search_products",
    description: "Search for products by name, SKU, or Part Number. Use this BEFORE creating a new product to check for duplicates.",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        search: { type: "string", description: "Search query (product name, SKU, or Part Number)" },
        perPage: { type: "number", default: 20, description: "Number of results to return" },
        page: { type: "number", default: 1 },
      },
      required: ["search"],
    },
  },
  // NEW: Check Duplicate
  {
    name: "check_duplicate",
    description: "Check if a product already exists by Part Number, SKU, or name. Returns existing product if found.",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        partNumber: { type: "string", description: "Part Number to check (e.g., 6MT4T, 0DY26D)" },
        sku: { type: "string", description: "SKU to check" },
        productName: { type: "string", description: "Product name to search" },
      },
    },
  },
  // NEW: Get Product Tags
  {
    name: "get_product_tags",
    description: "Retrieve all WooCommerce product tags",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        perPage: { type: "number", default: 100, description: "Number of tags to return" },
        page: { type: "number", default: 1 },
        search: { type: "string", description: "Search for specific tag" },
      },
    },
  },
  // NEW: Create Product Tag
  {
    name: "create_product_tag",
    description: "Create a new product tag",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        consumerKey: { type: "string" },
        consumerSecret: { type: "string" },
        name: { type: "string", description: "Tag name" },
        slug: { type: "string", description: "Tag slug (optional, auto-generated if not provided)" },
        description: { type: "string", description: "Tag description (optional)" },
      },
      required: ["name"],
    },
  },
  // NEW: Get Media
  {
    name: "get_media",
    description: "Get media files from WordPress Media Library",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        perPage: { type: "number", default: 20 },
        page: { type: "number", default: 1 },
        mediaType: { type: "string", description: "Filter by media type (image, video, audio, application)" },
        search: { type: "string", description: "Search media by title" },
      },
    },
  },
  // NEW: Delete Media
  {
    name: "delete_media",
    description: "Delete a media file from WordPress Media Library",
    inputSchema: {
      type: "object",
      properties: {
        siteUrl: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        mediaId: { type: "number", description: "Media ID to delete" },
        force: { type: "boolean", default: true, description: "Force delete (bypass trash)" },
      },
      required: ["mediaId"],
    },
  },
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleWooCommerceRequest(name, args || {});

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

async function handleWooCommerceRequest(
  method: string,
  params: any
): Promise<any> {
  try {
    const siteUrl = params.siteUrl || DEFAULT_SITE_URL;
    const username = params.username || DEFAULT_USERNAME;
    const password = params.password || DEFAULT_PASSWORD;
    const consumerKey = params.consumerKey || DEFAULT_CONSUMER_KEY;
    const consumerSecret = params.consumerSecret || DEFAULT_CONSUMER_SECRET;

    if (!siteUrl) {
      throw new Error(
        "WordPress site URL not provided in environment variables or request parameters"
      );
    }

    // For standard WordPress API endpoints
    const wpMethods = [
      "create_post",
      "get_posts",
      "update_post",
      "get_post_meta",
      "update_post_meta",
      "create_post_meta",
      "delete_post_meta",
      "upload_media",
      "get_media",
      "delete_media",
    ];

    // For WooCommerce API endpoints
    const wooMethods = [
      "get_products",
      "get_product",
      "create_product",
      "update_product",
      "delete_product",
      "search_products",
      "check_duplicate",
      "get_orders",
      "get_order",
      "create_order",
      "update_order",
      "delete_order",
      "get_customers",
      "get_customer",
      "create_customer",
      "update_customer",
      "delete_customer",
      "get_sales_report",
      "get_products_report",
      "get_orders_report",
      "get_categories_report",
      "get_customers_report",
      "get_stock_report",
      "get_coupons_report",
      "get_taxes_report",
      // Shipping methods
      "get_shipping_zones",
      "get_shipping_zone",
      "create_shipping_zone",
      "update_shipping_zone",
      "delete_shipping_zone",
      "get_shipping_methods",
      "get_shipping_zone_methods",
      "create_shipping_zone_method",
      "update_shipping_zone_method",
      "delete_shipping_zone_method",
      "get_shipping_zone_locations",
      "update_shipping_zone_locations",
      // Tax settings
      "get_tax_classes",
      "create_tax_class",
      "delete_tax_class",
      "get_tax_rates",
      "get_tax_rate",
      "create_tax_rate",
      "update_tax_rate",
      "delete_tax_rate",
      // Discount/Coupon settings
      "get_coupons",
      "get_coupon",
      "create_coupon",
      "update_coupon",
      "delete_coupon",
      // Order notes
      "get_order_notes",
      "get_order_note",
      "create_order_note",
      "delete_order_note",
      // Order refunds
      "get_order_refunds",
      "get_order_refund",
      "create_order_refund",
      "delete_order_refund",
      // Product variations
      "get_product_variations",
      "get_product_variation",
      "create_product_variation",
      "update_product_variation",
      "delete_product_variation",
      // Product attributes
      "get_product_attributes",
      "get_product_attribute",
      "create_product_attribute",
      "update_product_attribute",
      "delete_product_attribute",
      // Product attribute terms
      "get_attribute_terms",
      "get_attribute_term",
      "create_attribute_term",
      "update_attribute_term",
      "delete_attribute_term",
      // Product categories
      "get_product_categories",
      "get_product_category",
      "create_product_category",
      "update_product_category",
      "delete_product_category",
      // Product tags
      "get_product_tags",
      "get_product_tag",
      "create_product_tag",
      "update_product_tag",
      "delete_product_tag",
      // Product reviews
      "get_product_reviews",
      "get_product_review",
      "create_product_review",
      "update_product_review",
      "delete_product_review",
      // Payment gateways
      "get_payment_gateways",
      "get_payment_gateway",
      "update_payment_gateway",
      // Settings
      "get_settings",
      "get_setting_options",
      "update_setting_option",
      // System status
      "get_system_status",
      "get_system_status_tools",
      "run_system_status_tool",
      // Data
      "get_data",
      "get_continents",
      "get_countries",
      "get_currencies",
      "get_current_currency",
      // Meta data operations for products
      "get_product_meta",
      "update_product_meta",
      "create_product_meta",
      "delete_product_meta",
      // Meta data operations for orders
      "get_order_meta",
      "update_order_meta",
      "create_order_meta",
      "delete_order_meta",
      // Meta data operations for customers
      "get_customer_meta",
      "update_customer_meta",
      "create_customer_meta",
      "delete_customer_meta",
      // Rank Math SEO operations
      "get_rank_math_seo",
      "update_rank_math_seo",
    ];

    // Create WordPress REST API client
    let client;

    if (wpMethods.includes(method)) {
      if (!username || !password) {
        throw new Error(
          "WordPress credentials not provided in environment variables or request parameters"
        );
      }

      const auth = Buffer.from(`${username}:${password}`).toString("base64");
      client = axios.create({
        baseURL: `${siteUrl}/wp-json/wp/v2`,
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      });
    } else if (wooMethods.includes(method)) {
      // For WooCommerce API requests
      if (!consumerKey || !consumerSecret) {
        throw new Error(
          "WooCommerce API credentials not provided in environment variables or request parameters"
        );
      }

      client = axios.create({
        baseURL: `${siteUrl}/wp-json/wc/v3`,
        params: {
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      throw new Error(`Unknown method: ${method}`);
    }

    // Handle WordPress API methods
    switch (method) {
      case "create_post":
        if (!params.title || !params.content) {
          throw new Error("Title and content are required for creating a post");
        }
        const createResponse = await client.post("/posts", {
          title: params.title,
          content: params.content,
          status: params.status || "draft",
        });
        return createResponse.data;

      case "get_posts":
        const getResponse = await client.get("/posts", {
          params: {
            per_page: params.perPage || 10,
            page: params.page || 1,
          },
        });
        return getResponse.data;

      case "update_post":
        if (!params.postId) {
          throw new Error("Post ID is required for updating a post");
        }
        const updateData: Record<string, any> = {};
        if (params.title) updateData.title = params.title;
        if (params.content) updateData.content = params.content;
        if (params.status) updateData.status = params.status;

        const updateResponse = await client.post(
          `/posts/${params.postId}`,
          updateData
        );
        return updateResponse.data;

      case "upload_media":
        if (!params.filePath && !params.imageUrl) {
          throw new Error("Either filePath or imageUrl is required for uploading media");
        }

        let fileBuffer: Buffer;
        let fileName: string;
        let mimeType: string;

        if (params.imageUrl) {
          // Download image from URL
          try {
            const imageResponse = await axios.get(params.imageUrl, {
              responseType: "arraybuffer",
            });
            fileBuffer = Buffer.from(imageResponse.data);

            // Extract filename from URL or use default
            const urlPath = new URL(params.imageUrl).pathname;
            fileName = path.basename(urlPath) || "image.jpg";

            // Try to get MIME type from response headers
            mimeType = imageResponse.headers["content-type"] || getMimeType(fileName);
          } catch (error) {
            throw new Error(`Failed to download image from URL: ${params.imageUrl}. Error: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else if (params.filePath) {
          // Check if file exists
          if (!fs.existsSync(params.filePath)) {
            throw new Error(`File not found: ${params.filePath}`);
          }

          // Read file
          fileBuffer = fs.readFileSync(params.filePath);
          fileName = path.basename(params.filePath);
          mimeType = getMimeType(fileName);
        } else {
          throw new Error("Either filePath or imageUrl must be provided");
        }

        // Create form data
        const formData = new FormData();
        formData.append("file", fileBuffer, {
          filename: fileName,
          contentType: mimeType,
        });

        // Add optional metadata
        if (params.title) formData.append("title", params.title);
        if (params.alt_text) formData.append("alt_text", params.alt_text);
        if (params.caption) formData.append("caption", params.caption);
        if (params.description) formData.append("description", params.description);

        // Upload to WordPress
        const uploadResponse = await axios.post(
          `${siteUrl}/wp-json/wp/v2/media`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
            },
          }
        );

        return {
          id: uploadResponse.data.id,
          source_url: uploadResponse.data.source_url,
          title: uploadResponse.data.title?.rendered,
          alt_text: uploadResponse.data.alt_text,
          mime_type: uploadResponse.data.mime_type,
          media_details: uploadResponse.data.media_details,
        };

      // NEW: Get Media
      case "get_media":
        const mediaParams: Record<string, any> = {
          per_page: params.perPage || 20,
          page: params.page || 1,
        };
        if (params.mediaType) mediaParams.media_type = params.mediaType;
        if (params.search) mediaParams.search = params.search;

        const getMediaResponse = await client.get("/media", { params: mediaParams });
        return {
          totalMedia: getMediaResponse.data.length,
          media: getMediaResponse.data.map((m: any) => ({
            id: m.id,
            title: m.title?.rendered,
            source_url: m.source_url,
            alt_text: m.alt_text,
            mime_type: m.mime_type,
            date: m.date,
          })),
        };

      // NEW: Delete Media
      case "delete_media":
        if (!params.mediaId) {
          throw new Error("Media ID is required");
        }
        const deleteMediaResponse = await client.delete(`/media/${params.mediaId}`, {
          params: { force: params.force !== false },
        });
        return {
          message: `✅ تم حذف الملف رقم ${params.mediaId} بنجاح!`,
          deleted: true,
        };

      // Handle WooCommerce API methods
      // Products
      case "get_products":
        const productsResponse = await client.get("/products", {
          params: {
            per_page: params.perPage || 10,
            page: params.page || 1,
            ...params.filters,
          },
        });
        return productsResponse.data;

      case "get_product":
        if (!params.productId) {
          throw new Error("Product ID is required");
        }
        const productResponse = await client.get(
          `/products/${params.productId}`
        );
        return productResponse.data;

      case "create_product":
        if (!params.productData) {
          throw new Error("Product data is required for creating a product");
        }
        const createProductResponse = await client.post(
          "/products",
          params.productData
        );
        return createProductResponse.data;

      case "update_product":
        if (!params.productId) {
          throw new Error("Product ID is required for updating a product");
        }
        if (!params.productData) {
          throw new Error("Product data is required for updating a product");
        }
        const updateProductResponse = await client.put(
          `/products/${params.productId}`,
          params.productData
        );
        return updateProductResponse.data;

      case "delete_product":
        if (!params.productId) {
          throw new Error("Product ID is required for deleting a product");
        }
        const deleteProductResponse = await client.delete(
          `/products/${params.productId}`,
          {
            params: {
              force: params.force || false,
            },
          }
        );
        return deleteProductResponse.data;

      // NEW: Search Products
      case "search_products":
        if (!params.search) {
          throw new Error("Search query is required");
        }
        const searchProductsResponse = await client.get("/products", {
          params: {
            search: params.search,
            per_page: params.perPage || 20,
            page: params.page || 1,
          },
        });
        return {
          searchQuery: params.search,
          totalResults: searchProductsResponse.data.length,
          products: searchProductsResponse.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            permalink: p.permalink,
            price: p.price,
            status: p.status,
            type: p.type,
          })),
        };

      // NEW: Check Duplicate
      case "check_duplicate":
        const searchQueries: string[] = [];
        if (params.partNumber) searchQueries.push(params.partNumber);
        if (params.sku) searchQueries.push(params.sku);
        if (params.productName) searchQueries.push(params.productName);

        if (searchQueries.length === 0) {
          throw new Error("At least one of partNumber, sku, or productName is required");
        }

        const duplicateResults: any[] = [];
        for (const query of searchQueries) {
          const searchResponse = await client.get("/products", {
            params: {
              search: query,
              per_page: 10,
            },
          });
          if (searchResponse.data.length > 0) {
            duplicateResults.push(...searchResponse.data);
          }
        }

        // Remove duplicates by ID
        const uniqueProducts = duplicateResults.filter(
          (product, index, self) => index === self.findIndex((p) => p.id === product.id)
        );

        if (uniqueProducts.length > 0) {
          return {
            isDuplicate: true,
            message: `⚠️ تم العثور على ${uniqueProducts.length} منتج/منتجات مشابهة!`,
            products: uniqueProducts.map((p: any) => ({
              id: p.id,
              name: p.name,
              sku: p.sku,
              permalink: p.permalink,
              status: p.status,
            })),
            suggestion: "يرجى مراجعة المنتجات الموجودة قبل إنشاء منتج جديد.",
          };
        } else {
          return {
            isDuplicate: false,
            message: "✅ لم يتم العثور على منتجات مكررة. يمكنك المتابعة.",
            searchedFor: searchQueries,
          };
        }

      // Orders
      case "get_orders":
        const ordersResponse = await client.get("/orders", {
          params: {
            per_page: params.perPage || 10,
            page: params.page || 1,
            ...params.filters,
          },
        });
        return ordersResponse.data;

      case "get_order":
        if (!params.orderId) {
          throw new Error("Order ID is required");
        }
        const orderResponse = await client.get(`/orders/${params.orderId}`);
        return orderResponse.data;

      case "create_order":
        if (!params.orderData) {
          throw new Error("Order data is required for creating an order");
        }
        const createOrderResponse = await client.post(
          "/orders",
          params.orderData
        );
        return createOrderResponse.data;

      case "update_order":
        if (!params.orderId) {
          throw new Error("Order ID is required for updating an order");
        }
        if (!params.orderData) {
          throw new Error("Order data is required for updating an order");
        }
        const updateOrderResponse = await client.put(
          `/orders/${params.orderId}`,
          params.orderData
        );
        return updateOrderResponse.data;

      // Product Categories
      case "get_product_categories":
        const categoriesResponse = await client.get("/products/categories", {
          params: {
            per_page: params.perPage || 10,
            page: params.page || 1,
            ...params.filters,
          },
        });
        return categoriesResponse.data;

      case "get_product_category":
        if (!params.categoryId) {
          throw new Error("Category ID is required");
        }
        const categoryResponse = await client.get(
          `/products/categories/${params.categoryId}`
        );
        return categoryResponse.data;

      case "create_product_category":
        if (!params.categoryData) {
          throw new Error("Category data is required");
        }
        const createCategoryResponse = await client.post(
          "/products/categories",
          params.categoryData
        );
        return createCategoryResponse.data;

      case "update_product_category":
        if (!params.categoryId) {
          throw new Error("Category ID is required");
        }
        if (!params.categoryData) {
          throw new Error("Category data is required");
        }
        const updateCategoryResponse = await client.put(
          `/products/categories/${params.categoryId}`,
          params.categoryData
        );
        return updateCategoryResponse.data;

      // NEW: Product Tags
      case "get_product_tags":
        const tagsResponse = await client.get("/products/tags", {
          params: {
            per_page: params.perPage || 100,
            page: params.page || 1,
            search: params.search || undefined,
          },
        });
        return {
          totalTags: tagsResponse.data.length,
          tags: tagsResponse.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            count: t.count,
          })),
        };

      case "create_product_tag":
        if (!params.name) {
          throw new Error("Tag name is required");
        }
        const createTagResponse = await client.post("/products/tags", {
          name: params.name,
          slug: params.slug || undefined,
          description: params.description || undefined,
        });
        return {
          message: `✅ تم إنشاء Tag "${params.name}" بنجاح!`,
          tag: {
            id: createTagResponse.data.id,
            name: createTagResponse.data.name,
            slug: createTagResponse.data.slug,
          },
        };

      // Product Variations
      case "get_product_variations":
        if (!params.productId) {
          throw new Error("Product ID is required");
        }
        const variationsResponse = await client.get(
          `/products/${params.productId}/variations`,
          {
            params: {
              per_page: params.perPage || 10,
              page: params.page || 1,
              ...params.filters,
            },
          }
        );
        return variationsResponse.data;

      case "create_product_variation":
        if (!params.productId) {
          throw new Error("Product ID is required");
        }
        if (!params.variationData) {
          throw new Error("Variation data is required");
        }
        const createVariationResponse = await client.post(
          `/products/${params.productId}/variations`,
          params.variationData
        );
        return createVariationResponse.data;

      case "update_product_variation":
        if (!params.productId) {
          throw new Error("Product ID is required");
        }
        if (!params.variationId) {
          throw new Error("Variation ID is required");
        }
        if (!params.variationData) {
          throw new Error("Variation data is required");
        }
        const updateVariationResponse = await client.put(
          `/products/${params.productId}/variations/${params.variationId}`,
          params.variationData
        );
        return updateVariationResponse.data;

      // Rank Math SEO
      case "get_rank_math_seo":
        if (!params.productId) {
          throw new Error("Product ID is required");
        }
        // Get product to access meta_data
        const productForSEO = await client.get(`/products/${params.productId}`);
        const metaData = productForSEO.data.meta_data || [];

        // Extract Rank Math fields
        const rankMathFields: Record<string, any> = {};
        const rankMathKeys = [
          "rank_math_title",
          "rank_math_description",
          "rank_math_focus_keyword",
          "rank_math_robots",
          "rank_math_canonical_url",
          "rank_math_facebook_title",
          "rank_math_facebook_description",
          "rank_math_facebook_image",
          "rank_math_twitter_title",
          "rank_math_twitter_description",
          "rank_math_twitter_image",
          "rank_math_primary_product_cat",
          "rank_math_primary_product_brand",
          "rank_math_seo_score",
          "rank_math_internal_links_processed",
        ];

        rankMathKeys.forEach((key) => {
          const metaItem = metaData.find((meta: WooMetaData) => meta.key === key);
          if (metaItem) {
            rankMathFields[key] = metaItem.value;
          }
        });

        return {
          productId: params.productId,
          productName: productForSEO.data.name,
          rankMath: rankMathFields,
        };

      case "update_rank_math_seo":
        if (!params.productId) {
          throw new Error("Product ID is required");
        }

        // Get current product meta
        const currentProduct = await client.get(`/products/${params.productId}`);
        let currentMeta: WooMetaData[] = currentProduct.data.meta_data || [];

        // Rank Math meta keys mapping
        const rankMathUpdates: Record<string, any> = {};
        if (params.title !== undefined) rankMathUpdates["rank_math_title"] = params.title;
        if (params.description !== undefined) rankMathUpdates["rank_math_description"] = params.description;
        if (params.focusKeyword !== undefined) rankMathUpdates["rank_math_focus_keyword"] = params.focusKeyword;
        if (params.robots !== undefined) rankMathUpdates["rank_math_robots"] = params.robots;
        if (params.canonicalUrl !== undefined) rankMathUpdates["rank_math_canonical_url"] = params.canonicalUrl;
        if (params.facebookTitle !== undefined) rankMathUpdates["rank_math_facebook_title"] = params.facebookTitle;
        if (params.facebookDescription !== undefined) rankMathUpdates["rank_math_facebook_description"] = params.facebookDescription;
        if (params.facebookImage !== undefined) rankMathUpdates["rank_math_facebook_image"] = params.facebookImage;
        if (params.twitterTitle !== undefined) rankMathUpdates["rank_math_twitter_title"] = params.twitterTitle;
        if (params.twitterDescription !== undefined) rankMathUpdates["rank_math_twitter_description"] = params.twitterDescription;
        if (params.twitterImage !== undefined) rankMathUpdates["rank_math_twitter_image"] = params.twitterImage;
        if (params.primaryCategory !== undefined) rankMathUpdates["rank_math_primary_product_cat"] = params.primaryCategory;
        if (params.primaryBrand !== undefined) rankMathUpdates["rank_math_primary_product_brand"] = params.primaryBrand;

        // Update or create meta entries
        Object.keys(rankMathUpdates).forEach((key) => {
          const existingIndex = currentMeta.findIndex((meta: WooMetaData) => meta.key === key);
          if (existingIndex >= 0) {
            // Update existing
            currentMeta[existingIndex].value = rankMathUpdates[key];
          } else {
            // Create new
            currentMeta.push({
              key: key,
              value: rankMathUpdates[key],
            });
          }
        });

        // Update product with new meta
        const updateSEOResponse = await client.put(`/products/${params.productId}`, {
          meta_data: currentMeta,
        });

        // Return updated Rank Math fields
        const updatedMeta = updateSEOResponse.data.meta_data || [];
        const updatedRankMath: Record<string, any> = {};
        Object.keys(rankMathUpdates).forEach((key) => {
          const metaItem = updatedMeta.find((meta: WooMetaData) => meta.key === key);
          if (metaItem) {
            updatedRankMath[key] = metaItem.value;
          }
        });

        return {
          productId: params.productId,
          updated: updatedRankMath,
          message: "Rank Math SEO data updated successfully",
        };

      default:
        throw new Error(`Method not implemented: ${method}`);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        `API error: ${error.response?.data?.message || error.message}`
      );
    }
    throw error;
  }
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WooCommerce MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
