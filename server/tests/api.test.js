import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { PDFDocument } from 'pdf-lib';
import { createApp } from '../src/app.js';

const validData = { report_summary:{en:'A fictional example.',ta:'கற்பனை எடுத்துக்காட்டு.'},test_results:[],abnormal_findings:[],medical_terms:[],possible_significance:[],recommended_follow_up:[],doctor_questions:[],urgency:{level:'undetermined',reason:{en:'No findings.',ta:'முடிவுகள் இல்லை.'}},limitations:{en:'Synthetic fixture.',ta:'கற்பனை மாதிரி.'} };
async function pdf() { const d=await PDFDocument.create(); const page=d.addPage(); page.drawText('FICTIONAL SAMPLE LAB REPORT'); page.drawText('Glucose fasting 108 mg/dL; range 70 - 99 mg/dL.',{x:40,y:700,size:10}); return Buffer.from(await d.save()); }
async function withApp(fn, options={}) { const server=createServer(createApp({env:{FRONTEND_ORIGIN:'http://localhost:5173',...options.env},...options})); await new Promise(r=>server.listen(0,r)); try { return await fn(`http://127.0.0.1:${server.address().port}`); } finally { await new Promise(r=>server.close(r)); } }
test('health endpoint returns only basic health',()=>withApp(async base=>{const r=await fetch(base+'/health'); assert.equal(r.status,200); assert.deepEqual(await r.json(),{status:'ok'});}));
test('provider config lists choices without credentials',()=>withApp(async base=>{const r=await fetch(base+'/api/v1/config');const j=await r.json();assert.equal(j.defaultProvider,'ollama');assert.deepEqual(j.providers.map(p=>p.id),['openrouter','ollama','google-ai-studio']);assert.equal(JSON.stringify(j).includes('API_KEY'),false);},{env:{AI_PROVIDER:'ollama'}}));
test('Swagger UI and OpenAPI spec are available',()=>withApp(async base=>{const ui=await fetch(base+'/api-docs/');assert.equal(ui.status,200);assert.match(ui.headers.get('content-type'),/text\/html/);const r=await fetch(base+'/api-docs.json');const spec=await r.json();assert.equal(spec.openapi,'3.0.3');assert.ok(spec.paths['/api/v1/reports/explain'].post.requestBody.content['multipart/form-data'].schema.properties.provider);}));
test('missing PDF is rejected',()=>withApp(async base=>{const r=await fetch(base+'/api/v1/reports/explain',{method:'POST'});assert.equal(r.status,400);}));
test('invalid PDF and language are rejected',()=>withApp(async base=>{const f=new FormData();f.append('report',new Blob(['not pdf'],{type:'application/pdf'}),'fake.pdf');let r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});assert.equal(r.status,400);const g=new FormData();g.append('report',new Blob([await pdf()],{type:'application/pdf'}),'x.pdf');g.append('language','fr');r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:g});assert.equal(r.status,400);}));
test('unsupported provider is rejected',()=>withApp(async base=>{const f=new FormData();f.append('report',new Blob([await pdf()],{type:'application/pdf'}),'sample.pdf');f.append('provider','unknown');const r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});assert.equal(r.status,400);assert.equal((await r.json()).error.code,'INVALID_PROVIDER');}));
test('oversized PDF is rejected',()=>withApp(async base=>{const f=new FormData();f.append('report',new Blob([Buffer.concat([await pdf(),Buffer.alloc(1024*1024)])],{type:'application/pdf'}),'x.pdf');f.append('language','both');const r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});const j=await r.json();assert.equal(r.status,413,JSON.stringify(j));},{analyzePdf:async()=>validData,env:{MAX_PDF_SIZE_MB:'1'}}));
test('valid bilingual response passes server schema',()=>withApp(async base=>{const f=new FormData();f.append('report',new Blob([await pdf()],{type:'application/pdf'}),'synthetic.pdf');f.append('language','both');const r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});const j=await r.json();assert.equal(j.success,true);assert.equal(j.data.report_summary.ta,validData.report_summary.ta);},{analyzePdf:async()=>validData}));
test('OpenRouter receives a base64 PDF and returns validated structured data',()=>{
  let captured;
  return withApp(async base=>{
    const f=new FormData();
    f.append('report',new Blob([await pdf()],{type:'application/pdf'}),'synthetic.pdf');
    f.append('language','both');
    const r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});
    const j=await r.json();
    assert.equal(r.status,200,JSON.stringify(j));
    assert.equal(j.success,true);
    assert.equal(captured.url,'https://openrouter.ai/api/v1/chat/completions');
    assert.equal(captured.options.headers.Authorization,'Bearer test-key');
    const body=JSON.parse(captured.options.body);
    assert.equal(body.model,'openai/gpt-4o-mini');
    assert.equal(body.messages[1].content[1].type,'file');
    assert.ok(body.messages[1].content[1].file.file_data.startsWith('data:application/pdf;base64,'));
    assert.equal(body.response_format.json_schema.schema.type,'object');
    assert.equal(body.response_format.json_schema.schema.additionalProperties,false);
  },{env:{OPENROUTER_API_KEY:'test-key'},fetchImpl:async(url,options)=>{
    captured={url,options};
    return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(validData)}}]}),{status:200,headers:{'content-type':'application/json'}});
  }});
});
test('Ollama receives locally extracted PDF text and a JSON schema',()=>{
  let captured;
  return withApp(async base=>{
    const f=new FormData();f.append('report',new Blob([await pdf()],{type:'application/pdf'}),'synthetic.pdf');f.append('provider','ollama');
    const r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});const j=await r.json();
    assert.equal(r.status,200,JSON.stringify(j));assert.equal(j.provider,'ollama');assert.equal(captured.url,'http://localhost:11434/api/chat');
    const body=JSON.parse(captured.options.body);assert.equal(body.model,'llama3.2');assert.equal(body.stream,false);assert.equal(body.format.type,'object');assert.match(body.messages[1].content,/Glucose fasting 108 mg\/dL/);
  },{fetchImpl:async(url,options)=>{captured={url,options};return new Response(JSON.stringify({message:{content:JSON.stringify(validData)}}),{status:200,headers:{'content-type':'application/json'}})}});
});
test('Google AI Studio receives the PDF and validates its structured result',()=>{
  let captured;
  return withApp(async base=>{
    const f=new FormData();f.append('report',new Blob([await pdf()],{type:'application/pdf'}),'synthetic.pdf');f.append('provider','google-ai-studio');
    const r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});const j=await r.json();
    assert.equal(r.status,200,JSON.stringify(j));assert.equal(j.provider,'google-ai-studio');assert.equal(captured.apiKey,'test-google-key');
    assert.equal(captured.options.model,'gemini-3.8-flash');assert.equal(captured.options.config.responseMimeType,'application/json');
    assert.ok(captured.options.contents[0].parts[1].inlineData.data.length>0);
  },{env:{GOOGLE_AI_STUDIO_API_KEY:'test-google-key'},genAiClientFactory:apiKey=>({models:{generateContent:async options=>{captured={apiKey,options};return {text:JSON.stringify(validData)}}}})});
});
test('malformed provider data is rejected without details',()=>withApp(async base=>{const f=new FormData();f.append('report',new Blob([await pdf()],{type:'application/pdf'}),'synthetic.pdf');const r=await fetch(base+'/api/v1/reports/explain',{method:'POST',body:f});assert.equal(r.status,502);assert.equal((await r.json()).error.code,'INVALID_AI_RESPONSE');},{analyzePdf:async()=>({report_summary:{en:'x'}})}));
