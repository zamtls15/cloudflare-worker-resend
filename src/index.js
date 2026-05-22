export default {
  async fetch(request, env, ctx) {
    try {
      // Basic endpoint to send test email or handle requests
      const url = new URL(request.url);
      if (url.pathname === '/send' && request.method === 'POST') {
        const { to, subject, html } = await request.json();

        if (!to || !subject || !html) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const resend = new Resend(env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: 'onboarding@yourdomain.com', // Update with your verified domain
          to: [to],
          subject: subject,
          html: html,
        });

        if (error) {
          return new Response(JSON.stringify({ error }), { status: 400 });
        }

        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
      }

      // Default response
      return new Response(
        'Cloudflare Worker with Resend ready! POST to /send to send email.',
        { status: 200 }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  },
};
