# Changelog

## [1.0.1] - 2025-11-21

### Fixed
- 🐛 **Complete MCP Protocol Implementation**: Migrated from custom JSON-RPC to official `@modelcontextprotocol/sdk`
- 🔧 **Proper Tool Registration**: Implemented standard `tools/list` and `tools/call` handlers
- 🤝 **MCP Handshake**: Added proper `initialize` protocol support
- ✅ **Claude Desktop Compatibility**: Now fully compatible with Claude Desktop and other MCP clients

### Added
- 📦 Added `@modelcontextprotocol/sdk` dependency
- 📚 Added Arabic setup guide (SETUP_GUIDE_AR.md)
- 📝 Added example configuration file (claude_desktop_config.example.json)
- 🔧 Added `bin` field to package.json for easier installation

### Changed
- 🔄 Refactored main server implementation to use MCP SDK
- 📖 Updated README with new usage instructions
- 🏗️ Improved error handling and response formatting
- 🎯 Simplified tool definitions with proper input schemas

### Technical Details
The previous implementation used a custom JSON-RPC handler that directly parsed stdin and didn't follow the MCP protocol specification. This caused compatibility issues with MCP clients like Claude Desktop.

The new implementation:
- Uses `StdioServerTransport` for proper stdio communication
- Implements `ListToolsRequestSchema` for tool discovery
- Implements `CallToolRequestSchema` for tool execution
- Returns responses in MCP-compliant format with `content` arrays
- Properly handles MCP initialization handshake

### Migration Guide
If you were using the old version:
1. Update to the latest version: `npm install`
2. Rebuild: `npm run build`
3. Update your MCP configuration to use the new path
4. Restart your MCP client (e.g., Claude Desktop)

## [1.0.0] - Previous Version

### Features
- WordPress post management (create, read, update)
- WooCommerce products management (CRUD operations)
- WooCommerce orders management
- Product categories and variations
- Custom metadata operations
- Multiple authentication methods

### Known Issues (Fixed in 1.0.1)
- ❌ Custom JSON-RPC implementation not compatible with MCP standard
- ❌ Missing MCP handshake protocol
- ❌ Non-standard tool registration
- ❌ Incompatible with Claude Desktop and other MCP clients

