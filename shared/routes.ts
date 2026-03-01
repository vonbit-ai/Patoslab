import { z } from 'zod';
import {
  generateResumeSchema,
  generateApprenticeResumeSchema,
  enhanceTextSchema,
  scoreResumeResponseSchema,
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  ai: {
    enhance: {
      method: 'POST' as const,
      path: '/api/ai/enhance' as const,
      input: enhanceTextSchema,
      responses: {
        200: z.object({ enhancedText: z.string() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    score: {
      method: 'POST' as const,
      path: '/api/ai/score' as const,
      // Input is FormData with a 'pdf' file
      responses: {
        200: scoreResumeResponseSchema,
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  resume: {
    professional: {
      method: 'POST' as const,
      path: '/api/resume/professional' as const,
      input: generateResumeSchema,
      responses: {
        200: z.any(), // Returns PDF blob
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    apprentice: {
      method: 'POST' as const,
      path: '/api/resume/apprentice' as const,
      input: generateApprenticeResumeSchema,
      responses: {
        200: z.any(), // Returns PDF blob
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
