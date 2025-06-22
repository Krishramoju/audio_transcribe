
import { createClient } from "@deepgram/sdk";
import { logger, task } from "@trigger.dev/sdk/v3";
import "dotenv/config";

const deepgram = createClient(process.env.DEEPGRAM_SECRET_KEY!);

export const deepgramTranscription = task({
  id: "deepgram-transcribe-audio",
  run: async (payload: { audioUrl: string }) => {
    const { audioUrl } = payload;

    logger.log("Transcribing audio from URL", { audioUrl });

    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: audioUrl },
      {
        model: "nova-2",
        smart_format: true,
        diarize: true,
      }
    );

    if (error) {
      logger.error("Failed to transcribe audio", { error });
      throw error;
    }

    const transcription = result.results.channels[0].alternatives[0].paragraphs?.transcript;

    logger.log(`Generated transcription: ${transcription}`);

    return {
      result,
    };
  },
});
