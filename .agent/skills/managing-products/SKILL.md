---
name: managing-products
description: Comprehensive workflow for researching, creating, and optimizing WooCommerce products for Fix Zone. Handles market research, content writing, SEO, and publishing.
---

# Managing Products

This skill unifies the workflow for adding and managing products on Fix Zone's WooCommerce store.

## When to Use
- "Add a new product" / "ضيف منتج جديد"
- "Check price for X" / "شوف سعر البطارية"
- "Update SEO for product Y"
- "Research market for Z"

## 🗣️ Tone of Voice & Style
- **Professional & Trustworthy**: Use formal but accessible Arabic (e.g., "متوفر الآن" instead of "موجود").
- **Clear & Concise**: Avoid fluff. Focus on specs and compatibility.
- **Brand Aligned**: Always mention "Fix Zone" in the title and intro.
- **Persuasive**: Use strong Call-to-Actions (e.g., "اطلب الآن لتصلك غداً").

## 🛠️ Advanced Search Strategy
If the exact Part Number yields no results:
1.  **Partial Search**: Remove the last 2-3 characters of the part number.
2.  **Model Search**: Search for the Laptop Model only (e.g., "Dell E5470") and look for visually similar parts.
3.  **Cross-Reference**: Check `parts-people.com` to find alternative Part Numbers for the same model.


## 🔄 Core Workflow

### Phase 1: Market Research & Duplicate Check
**GOAL:** Ensure competitive pricing and avoid duplicates.

1.  **Check Duplicates**:
    - Use `check_duplicate` with Part Number or Name.
    - ❌ If exists: Stop and ask user (Update or New?).
    - ✅ If new: Proceed.

2.  **Market Search**:
    - Search sources: `trust-eg.com`, `lap-pop.com`, `uaebattery.ae`, `Amazon.eg`, `Noon`, `Jumia`.
    - **Collect**: Price, Condition (Original/High Copy), Warranty, Compatible Models.
    - **Analyze**: Determine "Real Market Price" (exclude outliers).
    - **Recommend**: Competitive Price (low edge) & Best-Margin Price.

### Phase 2: Content Creation
**GOAL:** Create high-quality, Arabic content.

1.  **Title**:
    - Format: `[Type AR] [Brand] [Part Number] - [English Keywords]`
    - Example: `بطارية لابتوب Dell 6MT4T – Replacement Battery`

2.  **Description**:
    - Use HTML Templates from `resources/description-template.html`.
    - ⚠️ **Important**: Use **Inline CSS** only. Do NOT use `<style>` blocks as they may break in WooCommerce.
    - **Introduction**: General text only. No specific models.
    - **Introduction**: General text only. No specific models.
    - **Layout**: Use **Constrained Flexbox** (Tile System). Items must have `max-width` to prevent stretching. (See template).
    - **Specs**: Volts, Amps, Color, Backlight (for Keyboards).
    - **Specs**: Volts, Amps, Color, Backlight (for Keyboards).
    - **Warranty**:
        - 🔋 **Battery**: 3 Months.
        - ⌨️ **Keyboard**: Original (3 Months), High Copy (1 Month).
        - 🖥️ **Screen**: 3 Months.
        - 🔌 **Charger**: 3 Months.
        - 💻 **Housing**: 

3.  **Images**:
    - Min 3 images (1000x1000px).
    - White background.
    - **Alt Text**: `[Type] [Brand] [Model] - Fix Zone`.

### Phase 3: SEO Optimization (Rank Math)
**GOAL:** Maximize visibility.

1.  **Focus Keyword**: `[Brand] [Model] [Type]` (e.g., `dell e5470 battery`).
2.  **SEO Title**: 50-60 chars. Must include Focus Keyword & "Fix Zone".
3.  **Meta Description**: 150-160 chars. Include Call-to-Action.
4.  **Robots**: `index,follow`.
5.  **Primary Category**: Set correctly (e.g., Batteries = 15).

### Phase 4: Quality Check & Publishing
**GOAL:** 100/100 Quality Score.

1.  **Review**: Check against `resources/quality-checklist.md`.
    - 🔴 Score < 70: **DO NOT PUBLISH**. Fix issues.
    - 🟢 Score > 90: Ready to publish.

2.  **Publish**:
    - Use `create_product` tool.
    - **Set Attributes** (Crucial for filtering):
        - `Brand`: Select from list (Dell, HP, Lenovo, etc.).
        - `Warranty`: "3 Months" (Standard), "1 Month" (High Copy Keyboards).
        - `Condition`: "Original New" or "High Copy".
        - `Backlight`: "Yes" or "No" (for Keyboards).
    - **Set Prices**: Based on Phase 1 research.

3.  **Post-Publish SEO**:
    - Use `update_rank_math_seo` with `productId` from previous step.
    - Apply Title, Desc, Focus Keyword.

## Tools (MCP) Reference
- 📦 `create_product` / `update_product`
- 🔍 `check_duplicate`
- 🎯 `update_rank_math_seo`
- 📷 `upload_media`

## Error Handling
- **Missing Info**: If Part Number is missing, ask user.
- **Conflicting Info**: Default to `trust-eg.com` data or ask user.
- **Image Not Found**: Use `generate_image` to create a placeholder or ask user for assets.

## 🔎 Troubleshooting
- **Duplicate Found?** -> Offer to update stock or price instead of creating new.
- **Low Quality Score?** -> Review `quality-checklist.md` and fix missing tags or short description.
- **SEO Not Updating?** -> Ensure `productId` is correct and `update_rank_math_seo` is called *after* creation.

