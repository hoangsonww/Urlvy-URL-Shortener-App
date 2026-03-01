"use client";

import LegalLayout from "@/components/LegalLayout";
import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      description="The rules that govern access to and use of the Urlvy application and related services."
      pageTitle="Terms and Conditions - Urlvy"
      eyebrow="Legal"
      icon={<Scale className="h-6 w-6" />}
      effectiveDate="March 1, 2026"
    >
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using Urlvy, you agree to these Terms and Conditions. If
        you do not agree, do not use the service.
      </p>

      <h2>The Service</h2>
      <p>
        Urlvy provides URL-shortening, redirect handling, analytics, and
        AI-assisted summary and chat features. Features may change, be added, or
        be removed over time without permanent availability guarantees.
      </p>

      <h2>Eligibility and Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for activity conducted using your account. You must
        provide accurate registration information and keep your login details
        secure.
      </p>

      <h2>Acceptable Use</h2>
      <p>You may not use Urlvy to:</p>
      <ul>
        <li>violate law or regulation;</li>
        <li>
          distribute malware, phishing links, spam, or deceptive redirects;
        </li>
        <li>infringe intellectual property or privacy rights;</li>
        <li>probe, overload, disrupt, or reverse engineer the service;</li>
        <li>submit content you do not have the right to process or share;</li>
        <li>
          use the platform in a way that creates security, abuse, or fraud risk.
        </li>
      </ul>

      <h2>Your Content and URLs</h2>
      <p>
        You remain responsible for destination URLs, custom slugs, and any
        content or metadata you submit through Urlvy. You represent that you
        have the necessary rights to use, shorten, share, and process those
        URLs.
      </p>

      <h2>AI Features</h2>
      <p>
        Urlvy may fetch the target page of a submitted URL and process related
        content through third-party AI services to produce summaries or respond
        to analytics questions. AI output may be incomplete, inaccurate, or
        unsuitable for important decisions. You are responsible for reviewing
        output before relying on it.
      </p>

      <h2>Analytics and Redirect Logging</h2>
      <p>
        Urlvy logs redirect and detail-request activity, including IP address,
        user-agent, and timestamp, in order to provide analytics and operate the
        service. By using the platform, you authorize that logging as part of
        normal service operation.
      </p>

      <h2>Current Product Scope</h2>
      <p>
        The current implementation does not appear to provide tenant-isolated
        storage for links. Until the architecture changes, Urlvy should not be
        used for confidential, regulated, or highly sensitive workloads that
        require strict workspace isolation.
      </p>

      <h2>Availability and Changes</h2>
      <p>
        Urlvy is provided on an as-available basis. We may modify, suspend, or
        discontinue features, impose limits, or perform maintenance at any time.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate access to Urlvy if we reasonably believe you
        have violated these terms, created security or abuse risk, or used the
        service unlawfully.
      </p>

      <h2>Disclaimers</h2>
      <p>
        Urlvy is provided “as is” and “as available,” without warranties of any
        kind to the fullest extent permitted by law. We do not guarantee
        uninterrupted availability, error-free operation, permanent retention,
        or accuracy of analytics or AI-generated output.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Urlvy and its operator will not
        be liable for indirect, incidental, special, consequential, exemplary,
        or punitive damages, or for loss of profits, data, goodwill, business
        opportunity, or service availability arising from or related to use of
        the platform.
      </p>

      <h2>Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless Urlvy and its operator from
        claims, losses, liabilities, and expenses arising out of your URLs, your
        use of the service, or your violation of these Terms and Conditions.
      </p>

      <h2>Governing Terms Updates</h2>
      <p>
        We may revise these Terms and Conditions from time to time. Continued
        use of Urlvy after revised terms become effective constitutes acceptance
        of the updated version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms may be sent to{" "}
        <a href="mailto:hoangson091104@gmail.com">hoangson091104@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
