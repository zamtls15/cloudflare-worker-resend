// src/index.js
import { Resend } from "resend";
export default {
async fetch(request, env, ctx) {
// Only allow POST to /send
const url = new URL(request.url);
if (url.pathname !== "/send" || request.method !== "POST") {
return new Response("Worker ready. POST to /send to send email.", {
status: 200,
});
}
try {
const { from, to, subject, html } = await request.json();
// Validate required fields
if (!from !to !subject || !html) {
return new Response(
JSON.stringify({ error: "Missing required fields: from, to, subject, html" }),
{ status: 400, headers: { "Content-Type": "application/json" } }
);
}
// ✅ Workers use env.RESEND_API_KEY — NOT Deno.env.get()
const resend = new Resend(env.RESEND_API_KEY);
const { data, error } = await resend.emails.send({
from, // e.g. "you@yourdomain.com"
to: Array.isArray(to) ? to : [to], // accepts string or array
subject,
html,
});
if (error) {
return new Response(JSON.stringify({ error }), {
status: 400,
headers: { "Content-Type": "application/json" },
});
}
return new Response(JSON.stringify({ success: true, data }), {
status: 200,
headers: { "Content-Type": "application/json" },
});
} catch (err) {
return new Response(JSON.stringify({ error: err.message }), {
status: 500,
headers: { "Content-Type": "application/json" },
});
}
},
};
