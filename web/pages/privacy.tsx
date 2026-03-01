"use client";

import LegalLayout from "@/components/LegalLayout";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How Urlvy collects, uses, stores, and discloses information when you use the application."
      pageTitle="Privacy Policy - Urlvy"
      eyebrow="Legal"
      icon={<ShieldCheck className="h-6 w-6" />}
      effectiveDate="March 1, 2026"
    >
      <h2>Overview</h2>
      <p>
        This Privacy Policy describes how Urlvy handles information when you
        access the website, create an account, generate short links, view link
        analytics, or use AI-assisted features. Urlvy is currently a
        URL-shortening and analytics product with account login, redirect
        tracking, and AI-generated summaries.
      </p>

      <h2>Information We Collect</h2>
      <h3>Account Information</h3>
      <p>
        When you register, Urlvy stores your email address, a hashed version of
        your password, and account creation metadata.
      </p>

      <h3>Link Data</h3>
      <p>
        When you create or edit a link, Urlvy stores the short slug, the
        destination URL, the time the link was created, and any generated title
        or summary metadata associated with that destination.
      </p>

      <h3>Redirect and Analytics Data</h3>
      <p>
        When a short link is opened or its detail endpoint is requested, Urlvy
        records the visitor IP address, user-agent string, and timestamp for
        that interaction. This data powers the analytics surfaces in the app.
      </p>

      <h3>AI Processing Data</h3>
      <p>
        To generate summaries, Urlvy may fetch the content of the destination
        page and submit prompt content to Google Gemini through the configured
        AI service. Chat-style analytics questions submitted inside the app are
        also processed through that AI flow.
      </p>

      <h3>Browser-Side Storage</h3>
      <p>
        The web app currently stores an authentication token, theme preference,
        and chat history for the analytics assistant in browser local storage.
      </p>

      <h3>Usage Analytics</h3>
      <p>
        The frontend includes Vercel Analytics, which may collect standard usage
        and performance telemetry about visits to the site.
      </p>

      <h2>How We Use Information</h2>
      <p>Urlvy uses information to:</p>
      <ul>
        <li>create, maintain, and resolve short links;</li>
        <li>authenticate users and maintain session state;</li>
        <li>
          measure clicks, traffic timing, device patterns, and link usage;
        </li>
        <li>generate AI summaries and analytics assistance;</li>
        <li>improve reliability, debugging, abuse prevention, and security;</li>
        <li>comply with legal obligations and enforce platform rules.</li>
      </ul>

      <h2>Disclosures and Service Providers</h2>
      <p>
        Urlvy may disclose information to infrastructure and software providers
        used to operate the product, including hosting, database, analytics, and
        AI service providers. Based on the current implementation, those
        providers may include Render or equivalent hosting infrastructure,
        Vercel Analytics, and Google Gemini services used for AI generation.
      </p>

      <h2>Important Product Limitation</h2>
      <p>
        The current Urlvy implementation does not appear to provide tenant
        isolation for stored links. The authenticated workspace should not be
        treated as suitable for confidential, regulated, or secret data unless
        that architecture is changed and independently reviewed.
      </p>

      <h2>Data Retention</h2>
      <p>
        Urlvy retains account records, link records, summaries, and click logs
        for as long as needed to operate the service, preserve analytics,
        maintain security, resolve disputes, or comply with legal obligations.
        Some browser-side data remains on your device until you clear local
        storage or sign out.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>
          You may choose not to create an account, though some features will not
          be available.
        </li>
        <li>
          You may choose not to submit URLs that you do not want fetched for AI
          summary generation.
        </li>
        <li>
          You may clear browser local storage, which can remove saved theme,
          token, and assistant history data.
        </li>
        <li>
          You may contact the operator to request account-related assistance.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Urlvy uses reasonable administrative and technical measures to protect
        stored information, but no service can guarantee absolute security. You
        should avoid submitting sensitive, regulated, or highly confidential
        information through the current product unless a stronger security and
        access-control model has been implemented.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        Urlvy is not intended for children under 13, and the service is not
        knowingly directed to them.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        Urlvy may update this Privacy Policy from time to time. The most recent
        version posted on this page will govern use of the service as of its
        effective date.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions may be sent to{" "}
        <a href="mailto:hoangson091104@gmail.com">hoangson091104@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
