import { redirect } from 'next/navigation';

// Eski (dikart nusxasi) katalog sahifalari endi ishlatilmaydi.
// Barcha mahsulotlar yangi karnizlar katalogida.
export default function OldCatalogRedirect() {
  redirect('/catalog/');
}
