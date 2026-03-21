// api/contact.js
// Fonction Vercel serverless — reçoit le formulaire et envoie l'email via Resend

export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Récupérer les données du formulaire
  const { name, email, phone, service, budget, message } = req.body;

  // Vérification basique
  if (!name || !email || !message || !service) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mahali Services <contact@mahali-services.com>',
        to: ['contact@mahali-services.com'],
        reply_to: email,
        subject: `Nouvelle demande — ${service}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#ede9e2;border-radius:12px;overflow:hidden;">
            <div style="background:#c8601e;padding:24px 32px;">
              <h1 style="margin:0;font-size:22px;color:#fff;">Nouvelle demande de contact</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,.7);font-size:14px;">mahali-services.com</p>
            </div>
            <div style="padding:32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#9a948a;font-size:13px;width:140px;">Nom</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;font-weight:600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#9a948a;font-size:13px;">Email</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;"><a href="mailto:${email}" style="color:#c8601e;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#9a948a;font-size:13px;">Téléphone</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;">${phone}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#9a948a;font-size:13px;">Service</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;"><span style="background:#c8601e;color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">${service}</span></td>
                </tr>
                ${budget ? `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #222;color:#9a948a;font-size:13px;">Budget</td>
                  <td style="padding:10px 0;border-bottom:1px solid #222;">${budget}</td>
                </tr>` : ''}
              </table>
              <div style="margin-top:24px;">
                <p style="color:#9a948a;font-size:13px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">Message</p>
                <div style="background:#1a1a1a;border-radius:8px;padding:20px;border-left:3px solid #c8601e;line-height:1.7;white-space:pre-wrap;">${message}</div>
              </div>
              <div style="margin-top:24px;padding:16px;background:#141414;border-radius:8px;text-align:center;">
                <a href="mailto:${email}?subject=Re: Votre demande - ${service}" style="display:inline-block;padding:12px 28px;background:#c8601e;color:#fff;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;">Répondre à ${name}</a>
              </div>
            </div>
            <div style="padding:16px 32px;border-top:1px solid #1a1a1a;text-align:center;color:#524e48;font-size:12px;">
              mahali-services.com · Reçu le ${new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
