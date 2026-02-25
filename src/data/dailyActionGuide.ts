/**
 * Daily Action Guide content matrix by Personal Daily Number (1–9).
 * Based on Pythagorean daily number: Birth Month + Birth Day + Current Date, reduced to a single digit.
 * Tone: empowering, practical, real-world compass for personal growth and daily planning.
 */

export type DailyGuideEntry = {
    theme: string;
    careerWork: string;
    relationships: string;
    dailyAction: string;
};

export const dailyActionGuideByNumber: Record<number, DailyGuideEntry> = {
    1: {
        theme: 'New Beginnings & Leadership',
        careerWork: 'Step forward with confidence. Today favors initiating projects, voicing your ideas, and making decisions you\'ve been postponing. Avoid waiting for permission—take the lead in at least one meeting or task. If you\'ve been considering a new direction, this is the day to state it clearly.',
        relationships: 'Be direct but kind. Your natural authority can inspire others; avoid coming across as dismissive. Listen once before you respond, and give one genuine compliment to someone who rarely receives recognition.',
        dailyAction: 'Make one decision you\'ve been avoiding and take the first concrete step on it before the end of the day.',
    },
    2: {
        theme: 'Cooperation & Balance',
        careerWork: 'Collaboration over competition. Focus on partnerships, mediation, and behind-the-scenes support. Review contracts, align with a key colleague, or smooth over a misunderstanding. Avoid pushing a solo agenda—progress today comes through teamwork and tact.',
        relationships: 'Prioritize harmony without silencing yourself. Say what you need clearly; then invite the other person\'s view. One small gesture of consideration (a message, a thank-you, or offering to help) will strengthen a bond.',
        dailyAction: 'Have one honest, calm conversation that you\'ve been putting off—focus on understanding, not winning.',
    },
    3: {
        theme: 'Creativity & Expression',
        careerWork: 'Let ideas flow and share them. Favor brainstorming, writing, presenting, or any work that benefits from creativity and communication. Avoid getting stuck in spreadsheets or isolation—schedule at least one collaborative or expressive task.',
        relationships: 'Lighten the mood. Share something that made you laugh, or plan a small enjoyable moment with someone you care about. Your optimism is contagious; use it to lift one person\'s day.',
        dailyAction: 'Create or share one thing today—a post, a message, a sketch, or a clear idea—without over-editing yourself.',
    },
    4: {
        theme: 'Stability & Building',
        careerWork: 'Focus on structure, systems, and follow-through. Tackle paperwork, organize a process, or complete a task that requires patience and accuracy. Avoid starting new, flashy projects—solidify what you\'ve already begun.',
        relationships: 'Show up reliably. Keep a promise, be on time, or do something practical for someone (run an errand, fix something, send the link they need). Trust is built in small, consistent actions.',
        dailyAction: 'Complete one task that you\'ve left half-done—finish it fully and mark it done.',
    },
    5: {
        theme: 'Change & Adaptability',
        careerWork: 'Expect the unexpected and stay flexible. Use today to explore options, gather information, or adapt a plan that no longer fits. Avoid rigid routines—say yes to one reasonable opportunity or idea that shakes things up slightly.',
        relationships: 'Variety helps. Reach out to someone you haven’t spoken to in a while, or suggest a different way to spend time together. If a conversation gets tense, offer to change the setting or topic.',
        dailyAction: 'Do one thing differently today—a new route, a new tool, or one small “yes” to something you’d usually decline.',
    },
    6: {
        theme: 'Responsibility & Care',
        careerWork: 'Quality and integrity over speed. Focus on work that serves people—clients, colleagues, or your team. Fix a mistake, improve a process that affects others, or have a caring but clear conversation about expectations.',
        relationships: 'Nurture without smothering. Offer help or attention where it’s truly needed; also respect boundaries. One act of service or reassurance will mean more than many words.',
        dailyAction: 'Do one thing that directly helps or eases the load for someone else—without being asked.',
    },
    7: {
        theme: 'Reflection & Insight',
        careerWork: 'Prioritize analysis, research, or quiet focus. Block time for deep work, review data, or refine a strategy. Avoid back-to-back meetings—protect at least one hour for thinking or learning.',
        relationships: 'Listen more than you speak. Ask one thoughtful question and give the other person space to answer. If someone needs solitude, respect it; if you need it, communicate it kindly.',
        dailyAction: 'Spend 15–20 minutes in reflection: one thing you learned this week and one adjustment you’ll make because of it.',
    },
    8: {
        theme: 'Authority & Impact',
        careerWork: 'Focus on results, influence, and tangible outcomes. Push a key decision, close a loop, or assert your position on something that matters. Avoid getting lost in details—aim for one clear win or commitment.',
        relationships: 'Be clear about what you want and what you can offer. One direct, fair conversation about expectations or boundaries will improve a relationship more than vague hints.',
        dailyAction: 'Take one action that moves a professional or financial goal forward—even if it’s a small, decisive step.',
    },
    9: {
        theme: 'Completion & Letting Go',
        careerWork: 'Tie up loose ends and prepare for a new cycle. Finish a project, hand off responsibly, or close a chapter that’s been dragging. Avoid starting major new initiatives—today is for wrapping up and clearing the deck.',
        relationships: 'Offer closure or forgiveness where it’s due. A short, sincere message or conversation that releases an old grievance or thanks someone can bring peace to both of you.',
        dailyAction: 'Complete or consciously let go of one thing—a task, a grudge, or an old plan—so you can move forward with a lighter load.',
    },
};

/** Normalize daily number to 1–9 for guide lookup (handles 0, 11, 22, 33). */
export function dailyNumberForGuide(dailyNumber: number | string | undefined): number {
    const n = typeof dailyNumber === 'string' ? parseInt(dailyNumber, 10) : Number(dailyNumber);
    if (!Number.isFinite(n) || n < 1) return 1;
    if (n <= 9) return n;
    const reduced = String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    return reduced <= 9 ? reduced : dailyNumberForGuide(reduced);
}
