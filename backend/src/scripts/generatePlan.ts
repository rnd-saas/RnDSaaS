import 'dotenv/config';

import { generateWorkoutPlanForUser } from '../services/workoutPlanGenerator';

interface CliArgs {
    userId?: string;
    help?: boolean;
}

function parseArgs(): CliArgs {
    const args = process.argv.slice(2);
    const parsed: CliArgs = {};

    for (let i = 0; i < args.length; i += 1) {
        const token = args[i];
        if (token === '--help' || token === '-h') {
            parsed.help = true;
            continue;
        }
        if (token === '--user' || token === '-u') {
            parsed.userId = args[i + 1];
            i += 1;
            continue;
        }
        if (token.startsWith('--user=')) {
            parsed.userId = token.split('=')[1];
            continue;
        }
    }

    return parsed;
}

function printUsage(): void {
    console.log(`
Usage: npx ts-node src/scripts/generatePlan.ts --user <uuid>

Options:
  --user, -u   Supabase auth user_id to process (required)
  --help, -h   Show this help

Example:
  npm run generate:plan -- --user 123e4567-e89b-12d3-a456-426614174000
`);
}

async function main(): Promise<void> {
    const args = parseArgs();

    if (args.help) {
        printUsage();
        return;
    }

    const userId = args.userId?.trim();
    if (!userId) {
        console.error('[cli] Missing required --user argument.');
        printUsage();
        process.exit(1);
    }

    console.log(`[cli] Generating workout program for user ${userId} ...`);
    const start = Date.now();

    try {
        const result = await generateWorkoutPlanForUser(userId);
        const duration = Date.now() - start;

        if (!result) {
            console.warn('[cli] Generation skipped - ensure GEMINI_API_KEY and onboarding profile data are set.');
            return;
        }

        console.log('[cli] Workout program generated successfully:');
        console.log(`  Program ID   : ${result.programId}`);
        console.log(`  Plan count   : ${result.planCount}`);
        console.log(`  Exercise rows: ${result.exerciseCount}`);
        console.log(`  Duration     : ${duration}ms`);
    } catch (error: any) {
        console.error('[cli] Failed to generate workout plan:', error?.message || error);
        process.exit(1);
    }
}

main();
