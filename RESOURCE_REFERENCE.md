RESOURCE_REFERENCE.md

Purpose: This document serves as a reference for AI coding assistants to understand and utilize key technologies such as OpenAI APIs, Supabase, and Chrome Extension guidelines effectively. This will help maintain accuracy and consistency during the development process, especially when the AI does not have web access to consult the latest documentation.

Key Resources

1. OpenAI API

Usage Overview: OpenAI APIs are used for generating conversational responses, code, and other AI-driven functionalities.

Documentation Summary: The OpenAI API documentation provides detailed explanations on authentication, rate limits, models, and usage guidelines.

Important Details to Keep in Mind:

Authentication: Ensure API keys are securely stored and never hard-coded.

Rate Limits: Be aware of the rate limits for different models to avoid reaching capacity unexpectedly.

Error Handling: Always include error handling for network failures, API errors, and unexpected responses.

Reference Links:

API Overview: https://beta.openai.com/docs

Authentication & Security: https://beta.openai.com/docs/authentication

2. Supabase

Usage Overview: Supabase is used for backend services like database management, authentication, and real-time syncing in our Chrome Extension. The integration between Supabase and Chrome Extensions enables features like user data storage, authentication, and accessing third-party services like OpenAI or Stripe.

Documentation Summary: Supabase provides APIs and client libraries for managing a PostgreSQL database and offers a Firebase-like experience, which can be integrated into Chrome Extensions effectively.

Important Details to Keep in Mind:

Database Operations:

Ensure that any changes to data are executed using safe queries, keeping security and data integrity in mind.

Supabase allows executing queries through its REST API, making it easier to use in environments like Chrome Extensions where direct database access might be limited.

Authentication in Chrome Extensions:

Supabase provides built-in authentication using OAuth, email/password, or third-party providers. For Chrome Extensions, handle tokens and sensitive information with care to prevent exposure.

Store authentication tokens securely, such as in Chrome's chrome.storage.local or chrome.storage.sync to allow consistent user experiences across multiple devices.

Use background scripts to handle sensitive operations. For instance, API keys should not be exposed in content scripts as they interact directly with web pages.

Data Storage for Users:

Use Supabase's real-time database to store and retrieve user-specific data such as settings, preferences, or other dynamic information relevant to the extension.

Supabase supports Row-Level Security (RLS). Make sure RLS policies are applied to ensure only authorized users can access or modify specific data.

Integrating Stripe for Payments:

If your extension includes paid services, you can integrate Stripe with Supabase to manage payments.

Stripe's customer and subscription information can be linked to user records in Supabase for a streamlined experience. Webhooks can be used to update Supabase data in real time when a user makes a purchase or modifies their subscription.

Be mindful of PCI compliance requirements and ensure payment data is not directly handled by the Chrome Extension itself.

Accessing OpenAI Keys for Services in Chrome Extension:

Store API keys for OpenAI securely. Do not hard-code keys into the Chrome Extension, as extensions are relatively easy to decompile.

Use Supabase as a secure proxy service. The extension can make a request to Supabase, which can then interact with OpenAI's API on behalf of the user, ensuring keys remain secure.

Tokens and API keys should be stored in Supabase securely and should be provided on a per-user basis if required for different service levels.

Reference Links:

Supabase Docs: https://supabase.com/docs

Authentication: https://supabase.com/docs/guides/auth

Row-Level Security: https://supabase.com/docs/guides/auth/row-level-security

Stripe Integration: https://supabase.com/docs/guides/integrations/stripe

Setup and Integration Guidance

AI Assistant Requirement to Guide User Setup

Supabase Setup Instructions: AI coding assistants must guide the user through setting up Supabase, including:

Creating a Supabase account and setting up the initial database.

Configuring authentication providers (OAuth, email/password).

Establishing Row-Level Security policies and setting up the API keys.

Ensuring all necessary environment variables are properly configured.

Stripe Integration Guidance:

AI assistants should provide step-by-step instructions to help the user create a Stripe account.

Assist in configuring Stripe keys and setting up webhooks in Supabase to manage customer subscriptions and payment events.

Guide on securely storing API keys and testing Stripe integration before proceeding with development.

OpenAI Setup Instructions:

Guide the user in creating an OpenAI account and generating API keys.

Explain how to securely store these keys and configure them for use in the Chrome Extension via Supabase as a proxy.

Verify test communication with OpenAI’s API before starting advanced features.

The primary goal is to ensure that all services (Supabase, Stripe, OpenAI) are set up and properly communicating with each other before extensive code development proceeds. This alignment will minimize errors and ensure a stable foundation.

Testing Communication Between Components

AI assistants should always prompt the user to perform communication tests between the components (e.g., Chrome Extension communicating with Supabase, Supabase with Stripe and OpenAI).

Ensure that sample requests to each integrated service are successful before additional development is undertaken.

Assist the user in verifying that API keys, tokens, and other sensitive information are being used correctly and securely.

