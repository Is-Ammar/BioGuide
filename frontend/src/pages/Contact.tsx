import React from 'react';

const Email: React.FC<{ address: string; label?: string }> = ({ address, label }) => (
  <a
    href={`mailto:${address}`}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-semantic-surface-2/60 hover:bg-semantic-surface-2/80 border border-semantic-border-muted hover:border-semantic-border-accent text-sm font-medium text-accent hover:text-accent-alt transition-colors shadow-sm"
  >
    <span className="font-mono tracking-tight">{label || address}</span>
  </a>
);

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-semantic-surface-0">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-semantic-text-primary">Contact</h1>
          <p className="text-semantic-text-secondary max-w-prose">
            Reach out to the BioGuide team. We welcome questions, feedback, collaboration ideas and contributions.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-semantic-text-primary">Team Emails</h2>
          <div className="flex flex-wrap gap-3">
            <Email address="eammarpro@gmail.com" />
            <Email address="elbouzidi@gmail.com" />
            <Email address="marouane@gmail.com" />
            <Email address="mohammed@gmail.com" />
            <Email address="adiri@gmail.com" />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-semantic-text-primary">Support</h2>
          <p className="text-semantic-text-secondary">For general support use the first email above. We'll respond as soon as possible.</p>
        </section>
      </div>
    </div>
  );
};

export default Contact;
