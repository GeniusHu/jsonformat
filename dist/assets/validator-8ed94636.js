import"./modulepreload-polyfill-3cfb730f.js";/* empty css               */function f(e,t={}){return CodeMirror(document.getElementById(e),{theme:"default",...t})}function u(e){return typeof e=="string"&&(e=JSON.parse(e)),JSON.stringify(e,null,2)}async function v(e){try{return await navigator.clipboard.writeText(e),!0}catch(t){return console.error("Failed to copy:",t),!1}}function b(e){const t=document.createElement("input");t.type="file",t.accept=".json,.txt",t.onchange=n=>{const c=n.target.files[0];if(!c)return;const p=new FileReader;p.onload=y=>{e(y.target.result)},p.readAsText(c)},t.click()}function s(e,t="info"){const n=document.createElement("div");n.className=`notification notification-${t}`,n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.classList.add("show")},10),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>{n.remove()},300)},3e3)}const h=document.createElement("style");h.textContent=`
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 6px;
    background: #ffffff;
    color: #2c3e50;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
}

.notification.show {
    opacity: 1;
    transform: translateY(0);
}

.notification-success {
    background: #2ecc71;
    color: #ffffff;
}

.notification-warning {
    background: #f1c40f;
    color: #ffffff;
}

.notification-error {
    background: #e74c3c;
    color: #ffffff;
}
`;document.head.appendChild(h);let o,a,m;const E=document.getElementById("validate"),k=document.getElementById("clear"),C=document.getElementById("format"),N=document.getElementById("paste"),x=document.getElementById("upload"),B=document.getElementById("copy"),l=document.getElementById("real-time-validation"),g=document.getElementById("line-numbers"),d=document.getElementById("schema-validation"),S=document.getElementById("schema-editor"),I=document.getElementById("status-icon"),O=document.getElementById("status-text");document.addEventListener("DOMContentLoaded",()=>{o=f("json-input",{mode:"application/json",lint:!0,gutters:["CodeMirror-lint-markers","CodeMirror-linenumbers","CodeMirror-foldgutter"],lineNumbers:!0,foldGutter:!0,matchBrackets:!0,autoCloseBrackets:!0,tabSize:2,extraKeys:{"Ctrl-Space":"autocomplete","Ctrl-Q":function(e){e.foldCode(e.getCursor())}}}),a=f("validation-output",{mode:"application/json",readOnly:!0,lineNumbers:!0,foldGutter:!0,gutters:["CodeMirror-linenumbers","CodeMirror-foldgutter"],matchBrackets:!0,tabSize:2}),m=f("schema-input",{mode:"application/json",lint:!0,gutters:["CodeMirror-lint-markers","CodeMirror-linenumbers","CodeMirror-foldgutter"],lineNumbers:!0,foldGutter:!0,matchBrackets:!0,autoCloseBrackets:!0,tabSize:2}),r("pending","Waiting for input..."),L()});function L(){E.addEventListener("click",i),k.addEventListener("click",()=>{o.setValue(""),a.setValue(""),r("pending","Waiting for input...")}),C.addEventListener("click",()=>{try{const e=o.getValue();if(!e.trim()){s("Please enter JSON first","warning");return}const t=u(e);o.setValue(t),i()}catch{s("Invalid JSON format","error")}}),N.addEventListener("click",async()=>{try{const e=await navigator.clipboard.readText();o.setValue(e),i()}catch{s("Failed to read clipboard","error")}}),x.addEventListener("click",()=>{b(e=>{o.setValue(e),i()})}),B.addEventListener("click",()=>{const e=o.getValue();if(!e.trim()){s("Nothing to copy","warning");return}v(e),s("Copied to clipboard","success")}),l.addEventListener("change",()=>{l.checked&&i()}),g.addEventListener("change",()=>{const e=g.checked;o.setOption("lineNumbers",e),a.setOption("lineNumbers",e),m.setOption("lineNumbers",e)}),d.addEventListener("change",()=>{S.classList.toggle("hidden",!d.checked),d.checked&&i()}),o.on("change",()=>{l.checked&&i()}),m.on("change",()=>{l.checked&&d.checked&&i()})}function i(){const e=o.getValue().trim();if(!e){r("pending","Waiting for input..."),a.setValue("");return}try{const t=JSON.parse(e);if(d.checked){const n=m.getValue().trim();if(n)try{const c=JSON.parse(n);r("valid","JSON is valid (Schema validation not implemented yet)")}catch(c){r("invalid","Invalid JSON Schema format"),a.setValue(u({error:"Invalid JSON Schema format",message:c.message}));return}}a.setValue(u(t)),r("valid","JSON is valid")}catch(t){r("invalid","Invalid JSON format"),a.setValue(u({error:"Invalid JSON format",message:t.message,position:V(t.message)}))}}function r(e,t){I.className=`status-icon status-${e}`,O.textContent=t}function V(e){const t=e.match(/position (\d+)/);return t?parseInt(t[1]):null}
