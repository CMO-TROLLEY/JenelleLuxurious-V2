import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  description: string;
  canonical: string;
  sections: LegalSection[];
}

export function LegalLayout({ title, effectiveDate, lastUpdated, description, canonical, sections }: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <Link to="/book" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Home
      </Link>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <FileText className="h-5 w-5 text-rose" aria-hidden="true" />
          </div>
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">Legal</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-plum sm:text-4xl">{title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>Effective Date: {effectiveDate}</span>
          <span>Last Updated: {lastUpdated}</span>
        </div>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </div>

      <nav className="mb-10 rounded-2xl border border-border/60 bg-secondary/30 p-6">
        <h2 className="mb-3 text-sm font-semibold text-plum">Contents</h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="font-serif text-xl font-semibold text-plum">{section.title}</h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">{section.body}</div>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-border/60 pt-6">
        <Link to="/book" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Home
        </Link>
      </div>
    </div>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalSubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 text-sm font-semibold text-plum">{children}</h3>;
}

export const LEGAL_CONTACT = (
  <div className="space-y-1">
    <p className="font-medium text-plum">Jenelle Luxurious</p>
    <p>Corner Plaza, Tea Road</p>
    <p>Ezulwini M200</p>
    <p>Eswatini</p>
    <p>
      Email:{' '}
      <a href="mailto:hello@jenelleluxurious.com" className="text-primary underline-offset-2 hover:underline">
        hello@jenelleluxurious.com
      </a>
    </p>
    <p>
      Telephone/WhatsApp:{' '}
      <a href="tel:+26876774779" className="text-primary underline-offset-2 hover:underline">
        +268 7677 4779
      </a>
    </p>
  </div>
);
