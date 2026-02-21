import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!;
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;

if (typeof window !== 'undefined' && (!insforgeUrl || !insforgeAnonKey)) {
    console.error('Missing InsForge URL or Anon Key. Check your .env setup.');
}

// Create a singleton instance
export const insforge = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
});
