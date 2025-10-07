import { pipeline, Pipeline } from '@xenova/transformers';

/**
 * A singleton class to ensure the NLP pipeline is initialized only once.
 * This is crucial for performance as model loading is a heavy operation.
 */
class NlpPipeline {
    private static instance: Pipeline | null = null;
    private static task: string = 'zero-shot-classification';
    // IMPORTANT: Changed model path to load from the local 'public' directory.
    private static model: string = '/models/bart-large-mnli/';
    private static loadingPromise: Promise<Pipeline> | null = null;

    static getInstance(progress_callback?: (progress: any) => void): Promise<Pipeline> {
        if (this.instance) {
            return Promise.resolve(this.instance);
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        // The `pipeline` function will now load the model from the local path.
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

        // Filter skills with a confidence score above a certain threshold.
        const threshold = 0.8;
        // The output structure might be slightly different for some models, ensure it's handled correctly.
        const results = Array.isArray(output) ? output : [output];
        const skills: string[] = [];

        for (const result of results) {
            if (result.scores) {
                result.labels.forEach((label, i) => {
                    if (result.scores[i] > threshold) {
                        skills.push(label);
                    }
                });
            }
        }

        return Array.from(new Set(skills)); // Return unique skills
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