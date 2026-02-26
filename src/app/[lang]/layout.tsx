import NewsTicker from '@/components/NewsTicker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ne' }]
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <>
      <Navbar lang={lang} />
      <NewsTicker lang={lang} />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
      <Footer lang={lang} />
    </>
  );
}
