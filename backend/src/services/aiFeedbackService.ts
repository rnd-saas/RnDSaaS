import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../db/supabase';

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiClient = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'; // Or use a standard model like gemini-1.5-flash

export const aiFeedbackService = {
  async generateFeedback(workoutId: string) {
    if (!geminiClient) {
      console.warn('GEMINI_API_KEY missing; cannot generate feedback.');
      return "Great job on completing your workout! (AI feedback unavailable)";
    }

    // 1. Fetch Completed Workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercise:exercises(*),
          exercise_sets (*)
        )
      `)
      .eq('id', workoutId)
      .single();

    if (workoutError || !workout) {
      throw new Error('Failed to fetch workout details');
    }

    // 2. Fetch Planned Workout (if exists)
    let plan = null;
    if (workout.plan_id) {
      const { data: planData, error: planError } = await supabase
        .from('workout_plans')
        .select(`
          *,
          plan_exercises (
            *,
            exercise:exercises(*)
          )
        `)
        .eq('id', workout.plan_id)
        .single();
      
      if (!planError) {
        plan = planData;
      }
    }

    // 3. Construct Prompt
    const prompt = buildFeedbackPrompt(workout, plan);

    // 4. Call Gemini
    try {
      const model = geminiClient.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return "You crushed it! Keep up the good work.";
    }
  }
};

function buildFeedbackPrompt(workout: any, plan: any): string {
  let prompt = `You are an encouraging and observant fitness coach. 
  Analyze the user's completed workout and provide a short, motivating feedback summary (max 3-4 sentences).
  Compare what they did vs what was planned (if a plan exists).
  Mention specific achievements or deviations if notable.
  
  Completed Workout:
  Duration: ${workout.duration_s ? Math.round(workout.duration_s / 60) + ' mins' : 'Unknown'}
  Notes: ${workout.notes || 'None'}
  
  Exercises Performed:
  ${workout.workout_exercises.map((we: any) => {
    const setsSummary = we.exercise_sets.map((s: any) => {
      let summary = `Set ${s.set_no}: `;
      if (s.metric1) summary += `${s.value1} ${s.metric1}`;
      if (s.metric2) summary += `, ${s.value2} ${s.metric2}`;
      if (s.completed) summary += ' (Done)';
      return summary;
    }).join(' | ');
    return `- ${we.exercise.name}: ${setsSummary}. Note: ${we.note || ''}`;
  }).join('\n')}
  `;

  if (plan) {
    prompt += `
    
    Planned Workout:
    ${plan.plan_exercises.map((pe: any) => {
      return `- ${pe.exercise.name}: ${pe.target_sets} sets, Target: ${pe.target_value} ${pe.metric}`;
    }).join('\n')}
    `;
  } else {
    prompt += `\n(No specific plan was linked to this workout)`;
  }

  prompt += `\n\nProvide a concise, friendly, and specific feedback paragraph directly to the user.`;
  
  return prompt;
}
