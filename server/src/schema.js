import { z } from 'zod';

const bilingual = z.object({ en: z.string(), ta: z.string() });
export const reportSchema = z.object({
  report_summary: bilingual,
  test_results: z.array(z.object({ test_name: z.string(), value: z.string(), unit: z.string(), reference_range: z.string(), status: z.enum(['normal','low','high','critical','not_provided','uncertain']), explanation: bilingual })),
  abnormal_findings: z.array(z.object({ finding: z.string(), status: z.enum(['low','high','critical','uncertain']), explanation: bilingual })),
  medical_terms: z.array(z.object({ term: z.string(), meaning: bilingual })),
  possible_significance: z.array(bilingual),
  recommended_follow_up: z.array(bilingual),
  doctor_questions: z.array(bilingual),
  urgency: z.object({ level: z.enum(['routine','prompt_medical_review','urgent','undetermined']), reason: bilingual }),
  limitations: bilingual
});

export const responseJsonSchema = {
  type: 'OBJECT', properties: {
    report_summary: { type: 'OBJECT', properties: { en: {type:'STRING'}, ta: {type:'STRING'} }, required: ['en','ta'] },
    test_results: { type: 'ARRAY', items: { type:'OBJECT', properties: { test_name:{type:'STRING'}, value:{type:'STRING'}, unit:{type:'STRING'}, reference_range:{type:'STRING'}, status:{type:'STRING',enum:['normal','low','high','critical','not_provided','uncertain']}, explanation:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']} }, required:['test_name','value','unit','reference_range','status','explanation'] } },
    abnormal_findings: { type:'ARRAY', items:{type:'OBJECT',properties:{finding:{type:'STRING'},status:{type:'STRING',enum:['low','high','critical','uncertain']},explanation:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']}},required:['finding','status','explanation']}},
    medical_terms: {type:'ARRAY',items:{type:'OBJECT',properties:{term:{type:'STRING'},meaning:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']}},required:['term','meaning']}},
    possible_significance:{type:'ARRAY',items:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']}},
    recommended_follow_up:{type:'ARRAY',items:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']}},
    doctor_questions:{type:'ARRAY',items:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']}},
    urgency:{type:'OBJECT',properties:{level:{type:'STRING',enum:['routine','prompt_medical_review','urgent','undetermined']},reason:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']}},required:['level','reason']},
    limitations:{type:'OBJECT',properties:{en:{type:'STRING'},ta:{type:'STRING'}},required:['en','ta']}
  }, required:['report_summary','test_results','abnormal_findings','medical_terms','possible_significance','recommended_follow_up','doctor_questions','urgency','limitations']
};
