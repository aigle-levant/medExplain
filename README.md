# MedExplain

MedExplain is a local web app for explaining PDF medical reports in English and Tamil. It uses a Node/Express API, a React/Vite interface, and Groq, OpenRouter, Google AI Studio, or local Ollama. The explanations are educational and are not diagnoses or validated medical triage.

## Run locally

Prerequisites: Node.js 20 or newer and npm.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and configure the providers you want to use. Keep `.env` private; it is excluded from Git. Use `AI_PROVIDER` to select the default. The upload screen also lets you choose a provider per report.
3. Start both services with `npm run dev`.
4. Open `http://localhost:5173`.

The API starts on port 3000 by default. `GET /health` returns basic process health. `POST /api/v1/reports/explain` accepts multipart fields `report` (PDF) and optional `language` (`en`, `ta`, or `both`), and optional `provider`. It responds with `{ success, report_type, language, provider, data, disclaimer }`. The response data includes a bilingual summary, test results, abnormal findings, medical terms, possible significance, follow-up suggestions, doctor questions, urgency note, and limitations.

Interactive Swagger UI is available at `http://localhost:3000/api-docs` and the OpenAPI JSON document at `http://localhost:3000/api-docs.json`. In Swagger UI, expand `POST /api/v1/reports/explain`, choose **Try it out**, attach a PDF to `report`, choose a language, then select **Execute**. The UI is served by the backend and does not need a separate credential; the server uses the selected provider key from `.env`.

Example:

```sh
curl -F "report=@synthetic-report.pdf" -F "language=both" http://localhost:3000/api/v1/reports/explain
```

## Configuration

### AI provider options

| Provider | Server configuration | PDF handling |
| --- | --- | --- |
| OpenRouter | `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_API_URL` | Sends the PDF to OpenRouter. |
| Ollama | `OLLAMA_BASE_URL`, `OLLAMA_MODEL` | Extracts text locally and sends it to your Ollama instance. Scanned/image-only PDFs need a cloud provider. |
| Google AI Studio | `GOOGLE_AI_STUDIO_API_KEY`, `GOOGLE_AI_STUDIO_MODEL` | Sends the PDF inline to the Gemini API. |
| Groq | `GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_API_URL` | Extracts text from text-based PDFs and sends it to Groq. |

Example: choose the default with `AI_PROVIDER=openrouter`, `AI_PROVIDER=ollama`, or `AI_PROVIDER=google-ai-studio`, or `AI_PROVIDER=groq`. The browser selection is sent only to the server; it never receives provider credentials. Groq requires a `GROQ_API_KEY` and processes text-based PDFs; scanned PDFs need OpenRouter or Google AI Studio. Ollama requires its local service to be running and the selected model to be installed (for example, `ollama pull llama3.2`).

See `.env.example` for all provider settings, API port, allowed frontend origin, maximum PDF size and page count, and rate limits. The defaults are 10 MB, 30 pages, and 10 requests per minute. API keys are only read by the server. Uploaded files are held in memory for the request and are not written to disk or retained by the app.

## Checks

- `npm test` runs the backend API tests using synthetic PDF files and a mocked analysis provider; it does not call a live AI provider.
- `npm run build` builds the frontend for production.

## Safety and privacy limits

The app does not create user accounts or store report history. OpenRouter and Google AI Studio transmit the PDF to their cloud services. Ollama text extraction runs locally and sends the extracted text to the configured local Ollama service. Review provider data processing, retention, training, regional processing, and contractual terms before using identifiable health information. This project does not claim regulatory compliance. Use synthetic reports during development.

The AI may make mistakes or miss context. Out-of-range results do not establish a disease, and normal results do not rule one out. Do not use this app to make treatment decisions or for emergencies. Contact a qualified clinician about your results; seek local emergency help for urgent symptoms.

## Production checklist

- Set a strong server-side API key and review provider terms for the intended health data.
- Set `FRONTEND_ORIGIN` to the exact deployed frontend origin and serve behind HTTPS.
- Configure deployment-level request timeouts, monitoring without medical content, and access controls appropriate to your organization.
- Review local privacy, clinical safety, accessibility, and regulatory obligations with qualified professionals.

