import { pipeline, Pipeline } from '@xenova/transformers';

// A global variable to hold the pipeline instance.
// This is a simpler approach than a singleton class for our purpose.
let pipelineInstance: Pipeline | null = null;
let isLoading = false;

/**
 * Initializes the NLP pipeline. It will only attempt to load the model once.
 * If loading fails, it will not re-attempt, preventing repeated network errors.
 * @param progress_callback A function to report download progress.
 * @returns The pipeline instance if successful, otherwise null.
 */
export const initializeNlpPipeline = async (progress_callback?: (progress: any) => void): Promise<Pipeline | null> => {
    if (pipelineInstance) {
        return pipelineInstance;
    }
    if (isLoading) {
        // Avoids multiple concurrent loading attempts
        return null;
    }

    isLoading = true;
    try {
        pipelineInstance = await pipeline('zero-shot-classification', 'Xenova/bart-large-mnli', {
            progress_callback,
        });
        return pipelineInstance;
    } catch (error) {
        console.error("AI model download failed. The application will continue without AI features.", error);
        // In case of an error, we leave the instance as null.
        return null;
    } finally {
        isLoading = false;
    }
};

/**
 * Extracts skills from a given text if the NLP pipeline is available.
 * If the model failed to load, it returns an empty array.
 * @param text The user's input text.
 * @param candidateSkills A list of potential skills to check for.
 * @returns A list of skills found in the text.
 */
export const extractSkills = async (text: string, candidateSkills: string[]): Promise<string[]> => {
    if (!pipelineInstance) {
        console.warn("Skill extraction skipped: AI model is not available.");
        return [];
    }

    try {
        const output = await pipelineInstance(text, candidateSkills, { multi_label: true });
        const threshold = 0.8;
        const skills = output.labels.filter((_, i) => output.scores[i] > threshold);
        return skills;
    } catch (error) {
        console.error("An error occurred during skill extraction:", error);
        return [];
    }
};