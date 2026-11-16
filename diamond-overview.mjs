export function createDiamondOverview(){
 const overview=document.createElement('article');overview.className='diamond-overview wrap';
 overview.innerHTML=`<div class="overview-heading"><div><span class="eyebrow">OPENFDE / JUN — SEP 2026</span><h2>Flowan · Diamond Sales Agent</h2><p class="overview-role">Agent Development Lead · Internship</p></div><p class="overview-lead">A dual-agent sales system connecting customer conversations to controlled payment, inventory, and fulfillment workflows.</p></div>
 <div class="overview-grid">
 <section><span class="overview-number">01</span><h4>Agent architecture & safety</h4><p>Separated Sales/Admin runtimes and coordinated 12 sales skills plus 4 administrative skills. Supervisor review approves, revises once, or holds a reply; high-risk cases fail closed to a human.</p></section>
 <section><span class="overview-number">02</span><h4>Controller & tool routing</h4><p>Built a deterministic-rule + LLM Tool Router with JSON intent classification and relay validation. Parsed 9 diamond attributes with cross-turn correction; split recommendations from bulk Excel queries.</p></section>
 <section><span class="overview-number">03</span><h4>Transactions & human review</h4><p>Connected payment OCR, administrative and owner review, stock reservation, ERP locking, and fulfillment. Idempotent touchpoints and unique constraints reduce duplicate orders and overselling.</p></section>
 <section><span class="overview-number">04</span><h4>Context engineering & evaluation</h4><p>Layered context and regression checks cover parameter contamination, tool misuse, and payment exceptions. Deduplicated inventory snapshots from approximately 690 records to 230.</p></section>
 </div><div class="overview-links"><a class="text-link" href="assets/Diamond-Agent-Case-Study.pdf" target="_blank" rel="noopener">Read the technical case study ↗</a></div>`;
 return overview;
}
