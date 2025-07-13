# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

- `npm run build` - Compiles TypeScript and copies icons to dist/
- `npm run dev` - Watches TypeScript files for changes and recompiles
- `npm run lint` - Runs ESLint on nodes, credentials, and package.json
- `npm run lintfix` - Runs ESLint with automatic fixes
- `npm run format` - Formats code using Prettier
- `npm run prepublishOnly` - Full build and lint check (used before publishing)

## Architecture Overview

This is an n8n community node package for Arivo CRM integration, structured as follows:

### Core Components

**Main Action Node (`nodes/Arivo/Arivo.node.ts`)**
- Implements `INodeType` for n8n workflow actions
- Currently supports Contact operations (create, get, getMany, update, delete)
- Deal operations are planned but not yet implemented (marked with TODOs)
- Uses modular approach with separate files for operations and descriptions

**Trigger Node (`nodes/Arivo/ArivoTrigger.node.ts`)**
- Webhook-based trigger for Arivo CRM events
- Supports contact and deal events (created, updated, deleted)
- Handles webhook registration/deregistration automatically
- Uses POST webhooks with JSON payload

**API Credentials (`credentials/ArivoApi.credentials.ts`)**
- Token-based authentication using API key
- Base URL configurable via `ARIVO_BASE_URL` environment variable
- Defaults to `https://arivo.com.br/api/v2/`
- Includes credential test endpoint

### Modular Structure

**Generic Functions (`nodes/Arivo/GenericFunctions.ts`)**
- `arivoApiRequest()` - Core API request wrapper with authentication
- `arivoApiRequestAllItems()` - Handles pagination using X-Next-Page headers
- Comprehensive logging and error handling
- Supports both Bearer token and Token authentication patterns

**Contact Operations (`nodes/Arivo/ContactOperations.ts`)**
- Implements CRUD operations for contacts
- Handles complex field transformations (emails, phones, addresses, custom fields)
- Uses helper function `buildCommonContactBody()` for data normalization

**Contact Descriptions (`nodes/Arivo/ContactDescription.ts`)**
- Defines n8n UI parameters for contact operations
- Separates operation definitions from field definitions

**Load Options (`nodes/Arivo/loadOptions.ts`)**
- Dynamic option loading for n8n dropdowns
- Currently implements custom field loading

### API Integration Patterns

- Uses link-based pagination (X-Next-Page header) rather than offset/limit
- Supports both returnAll and limited result sets
- Comprehensive error handling with NodeApiError
- Extensive debug logging for API troubleshooting
- Environment variable support for different API base URLs
- API documentation can be found at @../crm/doc/arivo.md
- Follow latest n8n API standards. There are example official base nodes from n8n Github repository that can be found at @../n8n/packages/nodes-base/nodes/ . Some that can be usefull to implement the Arivo CRM integration are Pipedrive and FreshworksCrm.

### Development Notes

- TypeScript with strict compilation settings
- Uses Gulp for icon copying during build
- ESLint with n8n-specific rules
- Node.js >=20.15 required
- Package exports only the compiled `dist/` directory