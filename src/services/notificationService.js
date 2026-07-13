export async function sendAlertNotification(briefing) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  const toEmail = import.meta.env.VITE_EMAILJS_TO_EMAIL || 'destinatario@correo.com'

  // If EmailJS is not fully configured, fall back to opening the mailto client
  if (!serviceId || !templateId || !publicKey || serviceId.trim() === '' || serviceId.includes('your_')) {
    console.warn("EmailJS is not fully configured in .env. Opening default mail client as fallback.")
    
    const subject = encodeURIComponent(`🚨 ALERTA DE MERCADO ESCALADA: ${briefing.targetAsset}`)
    const body = encodeURIComponent(`🚨 ALERTA DE MERCADO ESCALADA - ScaleAgents

Hola, se ha escalado la siguiente señal de mercado para su revisión:

• Activo Foco: ${briefing.targetAsset}
• Lista de Seguimiento: ${briefing.watchlist || 'General'}
• Noticia: ${briefing.newsHeadline}
• Movimiento Proyectado: ${briefing.associatedMovement || 'N/A'}
• Acción Sugerida: ${briefing.suggestedAction || 'N/A'}
• Estado de Revisión: ${briefing.status}

Justificación del Analista:
${briefing.justification || 'Sin justificación provista.'}

Generado el: ${new Date().toLocaleString('es-ES')}
`)
    
    // Open standard mailto link (works natively in all browsers without CORS)
    window.open(`mailto:${toEmail}?subject=${subject}&body=${body}`, '_blank')
    return
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: toEmail,
      subject: `🚨 ALERTA DE MERCADO ESCALADA: ${briefing.targetAsset}`,
      headline: briefing.newsHeadline,
      asset: briefing.targetAsset,
      watchlist: briefing.watchlist || 'General',
      movement: briefing.associatedMovement || 'N/A',
      suggested_action: briefing.suggestedAction || 'N/A',
      justification: briefing.justification || 'Sin justificación provista.',
      status: briefing.status
    }
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (response.ok) {
      console.log("Email sent successfully via EmailJS!")
    } else {
      const errText = await response.text()
      console.error("EmailJS sending failed:", response.status, errText)
    }
  } catch (e) {
    console.error("Failed to send email notification via EmailJS:", e)
  }
}
