// SmokingApp · envoi d'un rappel par mail (canal « email » des notifications).
// Partagé par push-send (test) et push-jitai (fan-out planifié).

export const sendReminderEmail = async (
  to: string,
  reminder: { title: string; body: string; url: string },
): Promise<boolean> => {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return false;
  const appUrl = `https://smokingapp.netlify.app${reminder.url}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "SmokingApp <nepasrepondre@frontguys.fr>",
      to,
      subject: reminder.title,
      html: `<p style="font-size:16px;color:#3c3c56">${reminder.body}</p>
<p><a href="${appUrl}" style="color:#004c61">Ouvrir SmokingApp</a></p>
<p style="font-size:12px;color:#62627f">Tu reçois ce rappel au rythme que tu as choisi. Tu peux le couper à tout moment dans Réglages → Notifications.</p>`,
    }),
  });
  return res.ok;
};
