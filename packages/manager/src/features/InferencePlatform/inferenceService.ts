/**
 * Service layer for the Inference Platform API.
 *
 * Uses a separate API key from the standard Linode API.
 * These calls use native `fetch` rather than the axios-based `Request()`
 * helper in `@linode/api-v4` because of the different base URL.
 *
 * Set REACT_APP_INFERENCE_BASE_URL in your .env file, e.g.:
 *   REACT_APP_INFERENCE_BASE_URL=http://172-238-59-38.ip.linodeusercontent.com/v1
 */

// TODO: Replace with the real auth mechanism once the API key service is ready.
const INFERENCE_BASE_URL = import.meta.env.REACT_APP_INFERENCE_BASE_URL;
const INFERENCE_API_KEY = import.meta.env.REACT_APP_INFERENCE_API_KEY ?? '';

const inferenceHeaders = {
  Authorization: `Bearer ${INFERENCE_API_KEY}`,
  'Content-Type': 'application/json',
};

export interface InferenceChatMessage {
  content: string;
  role: 'assistant' | 'system' | 'user';
}

export interface InferenceModel {
  /** Unix timestamp (seconds) when the model was registered in vLLM. */
  created?: number;
  id: string;
  /** Maximum context window in tokens as configured in vLLM at deploy time. */
  max_model_len?: number;
  object: string;
  /** Always "vllm" on this backend. */
  owned_by?: string;
  /** Full HuggingFace repo path, e.g. "moonshotai/Kimi-K2.6". */
  root?: string;
}

export interface InferenceModelsResponse {
  data: InferenceModel[];
  object: string;
}

/**
 * Fetch the list of models available on the inference endpoint.
 */
export const fetchInferenceModels = (): Promise<Response> =>
  fetch(`${INFERENCE_BASE_URL}/models`, { headers: inferenceHeaders });

/**
 * Send a chat completion request to the inference endpoint.
 */
export const requestInferenceChatCompletion = (
  messages: InferenceChatMessage[],
  model: string
): Promise<Response> =>
  fetch(`${INFERENCE_BASE_URL}/chat/completions`, {
    body: JSON.stringify({ messages, model, stream: false }),
    headers: inferenceHeaders,
    method: 'POST',
  });
