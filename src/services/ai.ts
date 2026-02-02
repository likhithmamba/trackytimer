import OpenAI from 'openai';

const LOCAL_STORAGE_KEY = 'noir_ai_key';

// 1. Secure Local Storage Management
export const getAiKey = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LOCAL_STORAGE_KEY);
};

export const setAiKey = (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
};

export const removeAiKey = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

// 2. Fallback "Numeric System Output" Generator
// These are the deterministic explanations used when AI is disabled or fails.
export const SystemFallbacks = {
    regret: (data: any) => `
If you skip tomorrow:
• Outcome ceiling: ${data.current_outcome}% → ${data.projected_outcome}%
• Topics dropped: +${data.topics_dropped}
• Daily load increase: +${data.daily_load_increase} min
    `.trim(),

    autopsy: (data: any) => `
Failure reason:
• ${data.failure_type}
• Actual: ${data.actual_minutes} min
• Allowed: ${data.allowed_minutes} min
    `.trim(),

    syllabus: (data: any) => `
Dropped because:
• Weight: ${data.topic_weight}/5
• Time remaining: ${data.remaining_days} days
    `.trim(),

    profile: (data: any) => `
• Avg session: ${data.avg_session} min
• High risk window: ${data.failure_window}
    `.trim()
};

// 3. AI Service
export const AiService = {
    async generateExplanation(category: 'REGRET' | 'AUTOPSY' | 'SYLLABUS' | 'PROFILE', data: any): Promise<string> {
        const key = getAiKey();

        // 🛑 RULE: No Key -> System Numeric Output (Immediate Fallback)
        if (!key) {
            switch (category) {
                case 'REGRET': return SystemFallbacks.regret(data);
                case 'AUTOPSY': return SystemFallbacks.autopsy(data);
                case 'SYLLABUS': return SystemFallbacks.syllabus(data);
                case 'PROFILE': return SystemFallbacks.profile(data);
                default: return "System data unavailable.";
            }
        }

        try {
            const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true }); // Client-side use allowed for BYO Key

            let systemPrompt = "";
            let userPrompt = `Data:\n${JSON.stringify(data, null, 2)}`;

            switch (category) {
                case 'REGRET':
                    systemPrompt = `You are explaining consequences, not giving advice. Given the data, explain what will happen if the user skips. Do NOT suggest actions. Do NOT motivate. Do NOT soften language.`;
                    break;
                case 'AUTOPSY':
                    systemPrompt = `Explain why the session failed using only the data provided. Do not suggest improvements. Do not use emotional language.`;
                    break;
                case 'SYLLABUS':
                    systemPrompt = `Explain why this topic was dropped using neutral language. No advice. No alternatives.`;
                    break;
                case 'PROFILE':
                    systemPrompt = `Describe the observed execution pattern. Do not suggest changes. Do not encourage.`;
                    break;
            }

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: "gpt-3.5-turbo",
                max_tokens: 100, // Strict conciseness
                temperature: 0, // Deterministic
            });

            return completion.choices[0].message.content || "Analysis failed.";

        } catch (error) {
            console.error("AI Generation Failed (Fallback Triggered):", error);
            // 🛑 RULE: On Error -> System Numeric Output
            switch (category) {
                case 'REGRET': return SystemFallbacks.regret(data);
                case 'AUTOPSY': return SystemFallbacks.autopsy(data);
                case 'SYLLABUS': return SystemFallbacks.syllabus(data);
                case 'PROFILE': return SystemFallbacks.profile(data);
                default: return "System data unavailable.";
            }
        }
    }
};
