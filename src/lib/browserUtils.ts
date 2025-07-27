/**
 * Browser utilities for Dobby browser automation system
 * 
 * Centralizes Browserbase and Stagehand initialization to avoid code duplication.
 * Provides common setup patterns for session creation and authentication.
 */

import { Browserbase } from '@browserbasehq/sdk';
import { Stagehand } from '@browserbasehq/stagehand';

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Create a configured Browserbase client instance
 * @returns Browserbase client
 */
export function createBrowserbaseClient(): Browserbase {
  if (!BROWSERBASE_API_KEY) {
    throw new Error('BROWSERBASE_API_KEY environment variable is required');
  }
  
  return new Browserbase({ apiKey: BROWSERBASE_API_KEY });
}

/**
 * Create a new Browserbase context
 * From ./docs/browserbase/features/contexts.md
 * 
 * @returns Created context with ID
 */
export async function createContext() {
  if (!BROWSERBASE_PROJECT_ID) {
    throw new Error('BROWSERBASE_PROJECT_ID environment variable is required');
  }

  const bb = createBrowserbaseClient();
  const context = await bb.contexts.create({
    projectId: BROWSERBASE_PROJECT_ID,
  });
  return context;
}

/**
 * Create a Browserbase session with context
 * From ./docs/browserbase/features/contexts.md
 * 
 * @param contextId - The context ID to use for the session
 * @param options - Additional session options
 * @returns Created session
 */
export async function createSessionWithContext(
  contextId: string, 
  options: {
    persist?: boolean;
    keepAlive?: boolean;
  } = {}
) {
  if (!BROWSERBASE_PROJECT_ID) {
    throw new Error('BROWSERBASE_PROJECT_ID environment variable is required');
  }

  const bb = createBrowserbaseClient();
  
  return await bb.sessions.create({
    projectId: BROWSERBASE_PROJECT_ID,
    keepAlive: options.keepAlive ?? false,
    browserSettings: {
      context: {
        id: contextId,
        persist: options.persist ?? true,
      },
      blockAds: true,
      viewport: {
        width: 1920,
        height: 1080
      }
    }
  });
}

/**
 * Get Live View URL for a session
 * From ./docs/browserbase/features/session-live-view.md
 * 
 * @param sessionId - The session ID to get Live View for
 * @returns Live View URL
 */
export async function getLiveViewUrl(sessionId: string): Promise<string> {
  const bb = createBrowserbaseClient();
  const liveViewLinks = await bb.sessions.debug(sessionId);
  return liveViewLinks.debuggerFullscreenUrl;
}

/**
 * Create a configured Stagehand instance with context
 * From ./docs/stagehand/reference/initialization_config.md
 * 
 * @param contextId - The context ID to use
 * @param options - Additional Stagehand options
 * @returns Configured Stagehand instance (not initialized)
 */
export function createStagehandWithContext(
  contextId: string,
  options: {
    persist?: boolean;
    verbose?: 0 | 1 | 2;
  } = {}
): Stagehand {
  if (!BROWSERBASE_API_KEY || !BROWSERBASE_PROJECT_ID) {
    throw new Error('BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID environment variables are required');
  }

  if (!GOOGLE_API_KEY && !OPENAI_API_KEY) {
    throw new Error('GOOGLE_API_KEY or OPENAI_API_KEY environment variable is required');
  }

  return new Stagehand({
    env: 'BROWSERBASE',
    apiKey: BROWSERBASE_API_KEY,
    projectId: BROWSERBASE_PROJECT_ID,
    // Use Gemini 2.5 Pro for better performance and advanced reasoning capabilities
    // From ./docs/stagehand/examples/custom_llms.md
    modelName: GOOGLE_API_KEY ? 'google/gemini-2.5-pro' : 'gpt-4o',
    modelClientOptions: {
      apiKey: GOOGLE_API_KEY || OPENAI_API_KEY,
    },
    // From ./docs/stagehand/reference/initialization_config.md
    browserbaseSessionCreateParams: {
      projectId: BROWSERBASE_PROJECT_ID,
      browserSettings: {
        context: {
          id: contextId,
          persist: options.persist ?? true,
        },
        blockAds: true,
        viewport: {
          width: 1920,
          height: 1080
        }
      }
    },
    verbose: options.verbose ?? 1
  });
}

/**
 * Initialize and return a ready-to-use Stagehand instance
 * 
 * @param contextId - The context ID to use
 * @param options - Additional options
 * @returns Initialized Stagehand instance
 */
export async function initializeStagehand(
  contextId: string,
  options: {
    persist?: boolean;
    verbose?: 0 | 1 | 2;
  } = {}
): Promise<Stagehand> {
  const stagehand = createStagehandWithContext(contextId, options);
  await stagehand.init();
  return stagehand;
}