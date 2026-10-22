import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'siteSettings.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const settings = JSON.parse(data);
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        siteName: 'جلال أحمد',
        siteTitle: 'استشارات وبناء الإنسان والأسرة',
        phone: '+20 101 487 6666',
        whatsapp: '201014876666',
        email: 'info@galalahmad.com',
        individualFee: 'تبدأ من 250 ر.س',
        maritalFee: 'تبدأ من 350 ر.س',
        parentingFee: 'تبدأ من 250 ر.س',
        emergencyFee: '500 ر.س',
        instapayUrl: 'https://ipn.eg/S/insan/instapay/94JPHf',
        instapayHandle: 'insan@instapay',
        vodafoneCashUrl: 'http://vf.eg/vfcash?id=mt&qrId=iLnA7Q',
        vodafoneCashNumber: '01014876666',
        internationalIban: '0873011024083701019',
        bankName: 'البنك الأهلي المصري',
        accountHolder: 'Galal Ahmed Abdelmoti Ahmed',
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}
