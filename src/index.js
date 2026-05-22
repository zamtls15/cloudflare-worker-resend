import { Resend } from "resend";

export default {
  async fetch(request, env) {
    const resend = new Resend(env.RESEND_API_KEY);

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
      });
    }

    const body = await request.json();

    const { from, to, subject, html } = body;

    // Validate required fields
    if (!from || !to || !subject || !html) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    try {
      const data = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};
