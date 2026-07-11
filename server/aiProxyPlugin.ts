import { Plugin } from 'vite';
import { GoogleGenAI, Modality, GenerateVideosOperation } from '@google/genai';
import { execSync } from 'child_process';
function getAccessToken(): string {
    try {
        return execSync('gcloud auth print-access-token').toString().trim();
    } catch (e: any) {
        console.error("Failed to get gcloud access token:", e.message);
        throw new Error("GCLOUD_AUTH_ERROR: Could not get gcloud access token. Please run 'gcloud auth login' in terminal.");
    }
}

export function vertexAiProxyPlugin(): Plugin {
    return {
        name: 'vite-plugin-vertex-ai',
        configureServer(server) {
            server.middlewares.use('/api/vertex', async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end('Method Not Allowed');
                    return;
                }

                let bodyString = '';
                req.on('data', chunk => { bodyString += chunk.toString(); });
                req.on('end', async () => {
                    res.setHeader('Content-Type', 'application/json');
                    try {
                        const body = JSON.parse(bodyString || '{}');
                        const url = req.url || '';
                        const token = getAccessToken();
                        const ai = new GoogleGenAI({
                            vertexai: true,
                            project: 'mallareddy',
                            location: 'us-central1',
                            accessToken: token
                        });

                        if (url.includes('/edit-image')) {
                            const { base64ImageData, mimeType, prompt } = body;
                            console.log("[Vertex Proxy] Editing image with prompt:", prompt);
                            const response = await ai.models.generateContent({
                                model: 'gemini-2.5-flash-image',
                                contents: [
                                    {
                                        role: 'user',
                                        parts: [
                                            { inlineData: { data: base64ImageData, mimeType: mimeType } },
                                            { text: prompt },
                                        ],
                                    }
                                ],
                                config: {
                                    responseModalities: [Modality.IMAGE],
                                },
                            });
                            if (!response.candidates || response.candidates.length === 0) {
                                throw new Error("No candidates returned from AI.");
                            }
                            res.end(JSON.stringify({ success: true, parts: response.candidates[0].content.parts }));
                        } else if (url.includes('/generate-video')) {
                            const { prompt } = body;
                            console.log("[Vertex Proxy] Starting video gen with prompt:", prompt);
                            const operation = await ai.models.generateVideos({
                                model: 'veo-2.0-generate-001',
                                prompt: prompt,
                            });
                            res.end(JSON.stringify({ success: true, operation }));
                        } else if (url.includes('/video-status')) {
                            const { operation } = body;
                            console.log("[Vertex Proxy] Polling video status for:", operation?.name);
                            if (operation && !operation._fromAPIResponse) {
                                Object.setPrototypeOf(operation, GenerateVideosOperation.prototype);
                            }
                            const updatedOperation = await ai.operations.getVideosOperation({ operation });
                            res.end(JSON.stringify({ success: true, operation: updatedOperation }));
                        } else if (url.includes('/fetch-video')) {
                            const { uri } = body;
                            console.log("[Vertex Proxy] Fetching video from:", uri);
                            let fetchUrl = uri;
                            if (uri.startsWith('gs://')) {
                                const gsPath = uri.replace('gs://', '');
                                fetchUrl = `https://storage.googleapis.com/${gsPath}`;
                            }
                            const videoRes = await fetch(fetchUrl, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (!videoRes.ok) throw new Error(`Failed to fetch video: ${videoRes.statusText}`);
                            const arrayBuffer = await videoRes.arrayBuffer();
                            const base64 = Buffer.from(arrayBuffer).toString('base64');
                            res.end(JSON.stringify({ success: true, base64, mimeType: 'video/mp4' }));
                        } else {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
                        }
                    } catch (err: any) {
                        console.error("[Vertex Proxy Error]", err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ success: false, error: err.message || String(err) }));
                    }
                });
            });
        }
    };
}
