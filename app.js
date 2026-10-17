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
const copyButton = document.querySelector("#copy-button");
const downloadButton = document.querySelector("#download-button");

let generatedIdea = "";
const safeText = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const tabs = {
  overview: () => `<h3>${safeText(generatedIdea || "Your product")}<br /><span class="result-subtitle">A build-ready starting point.</span></h3><p>A focused first release that turns the core user need into a simple, testable workflow.</p><ul><li><strong>Audience:</strong> people who need a faster, more local way to get things done</li><li><strong>Core action:</strong> capture intent and move it to a clear next step</li><li><strong>First release:</strong> onboarding, the core action, status updates, and feedback</li></ul>`,
  architecture: () => `<h3>Simple by design.</h3><div class="code-card">[ User ] → [ Web App ] → [ API ]<br />                         ├─ Core Data<br />                         ├─ Notifications<br />                         └─ Analytics</div><p>Start as a responsive web app. Add a dedicated dashboard once usage proves the workflow.</p>`,
  schema: () => `<h3>Core API</h3><div class="code-card">POST /v1/requests<br />{<br />  "user_id": "string",<br />  "payload": "object",<br />  "status": "pending"<br />}</div>`,
  pitch: () => `<h3>Say this out loud.</h3><p>“${safeText(generatedIdea || "This idea")} becomes a simple product that removes friction from an everyday task. It gives people a clearer next step, while keeping the experience fast, familiar, and human.”</p>`
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

function renderTab(tab = "overview") { content.innerHTML = tabs[tab](); }
generateButton.addEventListener("click", () => {
  if (!input.value.trim() && !audioInput.files.length) {
    input.focus();
    input.placeholder = "Start with your messy idea — no polish needed...";
    return;
  }
  generatedIdea = input.value.trim() || "Your voice-note idea";
  generateButton.disabled = true;
  generateButton.querySelector("span").textContent = "Building your spec...";
  emptyState.hidden = true;
  results.hidden = false;
  content.innerHTML = `<div class="loading-copy">Listening, structuring, and sketching your idea</div>`;
  window.setTimeout(() => {
    badge.textContent = "Generated";
    badge.classList.add("live");
    generateButton.disabled = false;
    generateButton.querySelector("span").textContent = "Generate my spec";
    renderTab();
  }, 650);
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
  generatedIdea = "";
  generateButton.disabled = false;
  generateButton.querySelector("span").textContent = "Generate my spec";
});
copyButton.addEventListener("click", async () => {
  const text = `${generatedIdea}\n\n${content.innerText}`;
  await navigator.clipboard.writeText(text);
  copyButton.textContent = "Copied ✓";
  window.setTimeout(() => { copyButton.textContent = "Copy brief"; }, 1600);
});
downloadButton.addEventListener("click", () => {
  const blob = new Blob([`# ${generatedIdea}\n\n${content.innerText}`], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "vaanispec-brief.md";
  link.click();
  URL.revokeObjectURL(link.href);
});