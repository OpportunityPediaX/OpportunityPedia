import type { ContactFormValues } from '@/marketing/types/contact';

export type ContactSubmissionResult = { ok: true; reference: string } | { ok: false; error: string };

/**
 * Single integration seam for the contact form.
 *
 * There is no backend attached yet and no mail is sent from the browser.
 * Replace the body with a `fetch` to the real endpoint; the call signature and
 * result shape are what the form component depends on.
 */
export async function submitContactForm(
  values: ContactFormValues,
): Promise<ContactSubmissionResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (import.meta.env.DEV) {
    console.debug('[contact] mock submission', values);
  }

  const reference = `OP-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return { ok: true, reference };
}
