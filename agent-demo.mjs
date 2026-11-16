const scenarios = {
 recommend: [
  {speaker:'customer',text:'I’m looking for a round diamond, around 1 carat. My budget is $8,000.',state:'REQUEST_RECEIVED',label:'Understand the request',trace:'intent.classify → recommendation',detail:'The Sales Agent extracts the customer’s requirements. Prices and availability come from inventory, not model memory.'},
  {speaker:'tool',text:'Searching fictional inventory · Round · 1.0 ct · up to $8,000',state:'INVENTORY_CHECKED',label:'Ground the answer',trace:'inventory.search({ shape: "Round", carat: 1.0, budget: 8000 })',detail:'A read-only tool returns matching inventory. These illustrative products and prices are not real listings.'},
  {speaker:'agent',text:'Two illustrative options match: D-104 · 1.01 ct · G / VS2 · $6,800, and D-128 · 1.03 ct · F / VS1 · $7,600. Would you prefer value or higher clarity?',state:'RECOMMENDATION_READY',label:'Review, then respond',trace:'supervisor.review → approve',decision:'approve',detail:'The Supervisor checks the proposed reply against the tool result before the message is released.'}
 ],
 correction: [
  {speaker:'customer',text:'A round diamond, 1 carat, under $8,000 please.',state:'REQUEST_RECEIVED',label:'Capture the first request',trace:'context.update → carat: 1.0; budget: 8000',detail:'The original requirements become structured filters, rather than an unstructured chat history.'},
  {speaker:'customer',text:'Actually, make that 1.5 carats. I can go up to $12,000.',state:'CONTEXT_UPDATED',label:'Replace outdated requirements',trace:'context.patch → replace carat and budget',detail:'The new values replace the old values. “Round” is retained; the earlier carat and budget are no longer active.'},
  {speaker:'agent',text:'Updated: round, around 1.5 carats, up to $12,000. I’ll search again using only those requirements.',state:'RECOMMENDATION_READY',label:'Search with corrected context',trace:'inventory.search({ shape: "Round", carat: 1.5, budget: 12000 })',decision:'approve',filters:{shape:'Round',carat:1.5,budget:12000},detail:'This illustrates the project’s cross-turn correction approach. The trace exposes exactly which filters are used.'}
 ],
 payment: [
  {speaker:'customer',text:'I’ve sent the payment. Here’s my screenshot.',state:'PAYMENT_EVIDENCE_RECEIVED',label:'Receive evidence, not confirmation',trace:'payment.ocr → evidence extracted',detail:'A screenshot is a payment clue. OCR cannot prove that money has arrived. No actual image or payment is collected in this demo.'},
  {speaker:'tool',text:'Create one review record and reserve the selected item. Duplicate messages must not create a second order.',state:'ADMIN_REVIEW',label:'Move into the controlled workflow',trace:'order.touchpoint → deduplicate · admin.review → pending',detail:'The real design uses idempotent touchpoints, unique constraints, and separate Sales/Admin runtimes to control high-risk actions.'},
  {speaker:'agent',text:'Your payment evidence has been received. A team member needs to verify the funds before fulfillment can proceed.',state:'PENDING_HUMAN_REVIEW',label:'Wait for the final human check',trace:'supervisor.review → approve reply · fulfillment → blocked',decision:'approve',shippingAllowed:false,detail:'The reply may be approved while the transaction remains pending. Shipping stays blocked until final human payment confirmation.'}
 ],
 failure: [
  {speaker:'customer',text:'Please confirm my payment and ship it now.',state:'REVIEW_REQUIRED',label:'Inspect the proposed action',trace:'sales.request → high-risk transaction',detail:'The Sales Agent cannot confirm receipt of funds or execute high-risk fulfillment actions.'},
  {speaker:'tool',text:'Review found no trusted payment confirmation. The requested action cannot proceed.',state:'REVIEW_FAILED',label:'Catch the unsupported promise',trace:'supervisor.review → hold',decision:'hold',detail:'The reviewer checks trusted context and tool traces. Missing evidence is a reason to stop, not to invent a successful action.'},
  {speaker:'agent',text:'I can’t confirm the payment yet. I’m handing this to a team member for verification; shipping will remain on hold.',state:'HUMAN_HANDOFF',label:'Fail closed and hand off',trace:'handoff.create → human review · fulfillment → blocked',decision:'hold',shippingAllowed:false,detail:'The project allows at most one revision before escalation, preventing an endless generator/reviewer loop.'}
 ]
};
export function getScenario(id) { return structuredClone(scenarios[id] || scenarios.recommend); }
