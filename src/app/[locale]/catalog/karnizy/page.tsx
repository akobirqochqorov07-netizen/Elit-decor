import { redirect } from '@/navigation';

export default async function KarnizyRedirectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: '/catalog/', locale });
}
