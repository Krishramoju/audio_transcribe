import { createClient } from "@deepgram/sdk";
import { logger, task } from "@trigger.dev/sdk/v3";

// Initialize the Deepgram client, using your Deepgram API key (you can find this in your Deepgram account settings).
const deepgram = createClient(process.env.93715663edc2ad1f1ae61cad74ddd06e6ae6410a);

export const deepgramTranscription = task({
  id: "deepgram-transcribe-audio",
  run: async (payload: { audioUrl: string }) => {
    const { audioUrl } = payload;

    logger.log("Transcribing audio from URL", { audioUrl });

    // Transcribe the audio using Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      {
        url: audioUrl,
      },
      {
        model: "nova-2", // Use the Nova 2 model for the transcription
        smart_format: true, // Automatically format transcriptions to improve readability
        diarize: true, // Recognize speaker changes and assign a speaker to each word in the transcript
      }
    );

    if (error) {
      logger.error("Failed to transcribe audio", { error });
      throw error;
    }

    console.dir(result, { depth: null });

    // Extract the transcription from the result
    const transcription = result.results.channels[0].alternatives[0].paragraphs?.transcript;

    logger.log(`Generated transcription: ${transcription}`);

    return {
      result,
    };
  },
});
