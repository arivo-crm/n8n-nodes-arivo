# n8n-nodes-arivo

This is an n8n community node for Arivo CRM.

_Arivo CRM_ is a online CRM built for small to medium companies to keep track of contacts and deals.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history)  <!-- delete if not using this section -->  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Action Node

- Contact
  - Create
  - Get
  - Get All
  - Update
- Deal
  - Create
  - Get
  - Get All
  - Update
- Organization
  - Create
  - Get
  - Get All
  - Update

### Trigger Node

- Contact Created
- Contact Updated
- Contact Deleted
- Deal Created
- Deal Updated
- Deal Deleted

## Credentials

_If users need to authenticate with the app/service, provide details here. You should include prerequisites (such as signing up with the service), available authentication methods, and how to set them up._

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Arivo API Documentation](https://arivo.docs.apiary.io)

## Version history

### 0.1.0

- Initial release
- Basic CRUD operations for contacts, deals, and organizations
- Webhook triggers for contact and deal events 