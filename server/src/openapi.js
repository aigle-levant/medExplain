export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MedExplain API',
    version: '1.0.0',
    description: 'API for service health and explaining a medical report PDF. Explanations are educational and are not medical diagnoses.'
  },
  paths: {
    '/health': {
      get: {
        summary: 'Check API health',
        operationId: 'getHealth',
        responses: {
          '200': { description: 'Service is running', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } }, required: ['status'] } } } }
        }
      }
    },
    '/api/v1/config': {
      get: {
        summary: 'List selectable AI providers',
        operationId: 'getProviderConfig',
        responses: { '200': { description: 'Provider choices and the configured default, without credentials', content: { 'application/json': { schema: { type:'object', properties:{ defaultProvider:{type:'string',enum:['openrouter','ollama','google-ai-studio','groq']}, providers:{type:'array',items:{type:'object',properties:{id:{type:'string'},label:{type:'string'}},required:['id','label']}} },required:['defaultProvider','providers'] } } } } }
      }
    },
    '/api/v1/reports/explain': {
      post: {
        summary: 'Explain a medical report PDF',
        description: 'Uploads a PDF to the configured AI provider for this request. Reports are not stored by the app. Use synthetic reports for testing.',
        operationId: 'explainReport',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['report'],
                properties: {
                  report: { type: 'string', format: 'binary', description: 'PDF file; maximum size is configured by the server (10 MB by default).' },
                  language: { type: 'string', enum: ['en', 'ta', 'both'], default: 'both', description: 'Explanation language.' },
                  provider: { type: 'string', enum: ['openrouter', 'ollama', 'google-ai-studio', 'groq'], description: 'AI provider. Defaults to AI_PROVIDER from server configuration.' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Report explanation generated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ExplainSuccess' } } } },
          '400': { description: 'Missing, invalid, unreadable PDF, or invalid language', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '422': { description: 'Ollama could not extract text from an image-only PDF', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '413': { description: 'PDF exceeds the configured upload limit', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '502': { description: 'AI provider failed or returned invalid data', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '503': { description: 'AI provider is not configured or is rate limited', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  },
  components: {
    schemas: {
      BilingualText: { type: 'object', required: ['en','ta'], properties: { en: { type:'string' }, ta: { type:'string' } } },
      TestResult: { type:'object', required:['test_name','value','unit','reference_range','status','explanation'], properties:{ test_name:{type:'string'}, value:{type:'string'}, unit:{type:'string'}, reference_range:{type:'string'}, status:{type:'string',enum:['normal','low','high','critical','not_provided','uncertain']}, explanation:{$ref:'#/components/schemas/BilingualText'} } },
      ReportData: { type:'object', required:['report_summary','test_results','abnormal_findings','medical_terms','possible_significance','recommended_follow_up','doctor_questions','urgency','limitations'], properties:{ report_summary:{$ref:'#/components/schemas/BilingualText'}, test_results:{type:'array',items:{$ref:'#/components/schemas/TestResult'}}, abnormal_findings:{type:'array',items:{type:'object'}}, medical_terms:{type:'array',items:{type:'object'}}, possible_significance:{type:'array',items:{$ref:'#/components/schemas/BilingualText'}}, recommended_follow_up:{type:'array',items:{$ref:'#/components/schemas/BilingualText'}}, doctor_questions:{type:'array',items:{$ref:'#/components/schemas/BilingualText'}}, urgency:{type:'object',properties:{level:{type:'string',enum:['routine','prompt_medical_review','urgent','undetermined']},reason:{$ref:'#/components/schemas/BilingualText'}},required:['level','reason']}, limitations:{$ref:'#/components/schemas/BilingualText'} } },
      ExplainSuccess: { type:'object', required:['success','report_type','language','provider','data','disclaimer'], properties:{success:{type:'boolean',example:true},report_type:{type:'string',example:'medical_report'},language:{type:'string',enum:['en','ta','both']},provider:{type:'string',enum:['openrouter','ollama','google-ai-studio','groq']},data:{$ref:'#/components/schemas/ReportData'},disclaimer:{type:'string'} } },
      ErrorResponse: { type:'object', required:['success','error'], properties:{success:{type:'boolean',example:false},error:{type:'object',required:['code','message'],properties:{code:{type:'string'},message:{type:'string'}}}} }
    }
  }
};
