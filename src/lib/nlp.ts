import { pipeline, Pipeline } from '@xenova/transformers';

/**
 * A singleton class to ensure the NLP pipeline is initialized only once.
 * This is crucial for performance as model loading is a heavy operation.
 */
class NlpPipeline {
    private static instance: Pipeline | null = null;
    private static task: string = 'zero-shot-classification';
    private static model: string = 'Xenova/bart-large-mnli';

    static async getInstance(progress_callback?: (progress: any) => void): Promise<Pipeline> {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                progress_callback,
            });
        }
        return this.instance;
    }
}

/**
 * Extracts a list of skills from a given text using a zero-shot classification model.
 * @param text The user's input text (e.g., "I love working with React and Node.js").
 * @param candidateSkills A list of potential skills to check for.
 * @returns A list of skills found in the text that meet a confidence threshold.
 */
export const extractSkills = async (text: string, candidateSkills: string[]): Promise<string[]> => {
    const classifier = await NlpPipeline.getInstance();
    if (!classifier) return [];

    const output = await classifier(text, candidateSkills, { multi_label: true });

    // Filter skills with a confidence score above a certain threshold.
    const threshold = 0.8;
    const skills = output.labels.filter((_, i) => output.scores[i] > threshold);

    return skills;
};