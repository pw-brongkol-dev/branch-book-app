import logoUnnes from '@/app/images/unnes.png';
import logoKemendikbud from '@/app/images/Logo_Kampus_Merdeka_Kemendikbud.png';
import logoSTT from '@/app/images/063044.png';
import logoKabSemarang from '@/app/images/806px-LOGO_KABUPATEN_SEMARANG_slogan-1024x924.png';
import logoProvinsiJateng from '@/app/images/640px-Coat_of_arms_of_Central_Java.svg.png';
import logoTutWuriHandayani from '@/app/images/2048px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png';

import Image from 'next/image';

const LogoRow = () => {
  return (
    <div className="flex flex-row justify-center items-center flex-wrap space-x-4">
      <Image src={logoKemendikbud} alt="Logo Kemendikbud" width={110} height={110} />
      <Image src={logoTutWuriHandayani} alt="Logo Tut Wuri Handayani" width={110} height={110} />
      <Image src={logoUnnes} alt="Logo Unnes" width={110} height={110} />
      <Image src={logoSTT} alt="Logo STT" width={110} height={110} />
      <Image src={logoProvinsiJateng} alt="Logo Prov. Jateng" width={110} height={110} />
      <Image src={logoKabSemarang} alt="Logo Kab. Semarang" width={110} height={110} />
    </div>
  );
};

export default LogoRow;
