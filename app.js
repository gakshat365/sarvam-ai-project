const input = document.querySelector("#idea-input");
const charCount = document.querySelector("#char-count");
const audioInput = document.querySelector("#audio-input");
const uploadButton = document.querySelector("#upload-button");
const dropzone = document.querySelector("#dropzone");
const dropTitle = document.querySelector("#drop-title");
const dropSubtitle = document.querySelector("#drop-subtitle");
const generateButton = document.querySelector("#generate-button");
const emptyState = document.querySelector("#empty-state");
const results = document.querySelector("#results");
const content = document.querySelector("#result-content");
const badge = document.querySelector("#generated-badge");

const tabs = {
  overview: `<h3>LocalCart, for every kirana.</h3><p>A lightweight ordering layer that helps neighborhood stores accept WhatsApp-like orders without learning a new dashboard.</p><ul><li><strong>Audience:</strong> independent kirana owners and their regular customers</li><li><strong>Core action:</strong> turn a voice or text order into a confirmed cart</li><li><strong>First release:</strong> catalog, order capture, UPI payment, delivery status</li></ul>`,
  architecture: `<h3>Simple by design.</h3><div class="code-card">[ Customer ] → [ Web App ] → [ API ]<br />                         ├─ Orders DB<br />                         ├─ Payment Gateway<br />                         └─ WhatsApp Notify</div><p>Start as a responsive web app. Add a store dashboard once order volume proves the workflow.</p>`,
  schema: `<h3>Order API</h3><div class="code-card">POST /v1/orders<br />{<br />  "store_id": "string",<br />  "items": [{ "sku": "string", "qty": 1 }],<br />  "payment": "upi"<br />}</div>`,
  pitch: `<h3>Say this out loud.</h3><p>“LocalCart helps your neighborhood kirana store take digital orders as naturally as a phone call. Customers get a simple cart, owners get fewer missed orders, and the store stays exactly where it belongs — at the heart of the community.”</p>`
};

input.addEventListener("input", () => { charCount.textContent = `${input.value.length} / 800`; });
uploadButton.addEventListener("click", () => audioInput.click());
audioInput.addEventListener("change", () => {
  if (!audioInput.files[0]) return;
  dropTitle.textContent = audioInput.files[0].name;
  dropSubtitle.textContent = "Audio attached · ready to generate";
});
["dragenter", "dragover"].forEach((event) => dropzone.addEventListener(event, (e) => { e.preventDefault(); dropzone.classList.add("dragging"); }));
["dragleave", "drop"].forEach((event) => dropzone.addEventListener(event, (e) => { e.preventDefault(); dropzone.classList.remove("dragging"); }));
dropzone.addEventListener("drop", (e) => { audioInput.files = e.dataTransfer.files; audioInput.dispatchEvent(new Event("change")); });

function renderTab(tab = "overview") { content.innerHTML = tabs[tab]; }
generateButton.addEventListener("click", () => {
  if (!input.value.trim() && !audioInput.files.length) {
    input.focus();
    input.placeholder = "Start with your messy idea — no polish needed...";
    return;
  }
  emptyState.hidden = true;
  results.hidden = false;
  badge.textContent = "Generated";
  badge.classList.add("live");
  renderTab();
});
document.querySelectorAll(".result-tab").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll(".result-tab").forEach((item) => item.classList.remove("active"));
  tab.classList.add("active");
  renderTab(tab.dataset.tab);
}));
document.querySelector("#reset-button").addEventListener("click", () => {
  emptyState.hidden = false;
  results.hidden = true;
  badge.textContent = "Ready";
  badge.classList.remove("live");
  input.value = "";
  charCount.textContent = "0 / 800";
});