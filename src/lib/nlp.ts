import { pipeline, Pipeline } from '@xenova/transformers';

/**
 * A singleton class to ensure the NLP pipeline is initialized only once.
 * This is crucial for performance as model loading is a heavy operation.
 */
class NlpPipeline {
    private static instance: Pipeline | null = null;
    private static task: string = 'zero-shot-classification';
    private static model: string = 'Xenova/bart-large-mnli'; // Reverted to loading from the hub
    private static loadingPromise: Promise<Pipeline> | null = null;

    static getInstance(progress_callback?: (progress: any) => void): Promise<Pipeline> {
        if (this.instance) {
            return Promise.resolve(this.instance);
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = pipeline(this.task, this.model, {
            progress_callback,
        }).then(instance => {
            this.instance = instance;
            this.loadingPromise = null;
            return instance;
        }).catch(error => {
            this.loadingPromise = null; // Reset promise on failure
            throw error; // Re-throw to be caught by the caller
        });

        return this.loadingPromise;
    }
}

/**
 * Extracts a list of skills from a given text using a zero-shot classification model.
 * @param text The user's input text (e.g., "I love working with React and Node.js").
 * @param candidateSkills A list of potential skills to check for.
 * @returns A list of skills found in the text that meet a confidence threshold.
 */
export const extractSkills = async (text: string, candidateSkills: string[]): Promise<string[]> => {
    try {
        const classifier = await NlpPipeline.getInstance();
        const output = await classifier(text, candidateSkills, { multi_label: true });

        const threshold = 0.8;
        const skills = output.labels.filter((_, i) => output.scores[i] > threshold);

        return skills;
    } catch (error) {
        console.error("Skill extraction failed:", error);
        return [];
    }
};

/**
 * A dedicated function to pre-load the pipeline.
 * This can be called when a component mounts to start the download early.
 */
export const initializeNlpPipeline = (progress_callback?: (progress: any) => void) => {
    return NlpPipeline.getInstance(progress_callback);
};