// import VideoThumb from "@/public/images/hero-image-01.jpg";
// import ModalVideo from "@/components/modal-video";

import Image from "next/image";
import BannerImage from "@/public/images/Rexie-BlackFriday.png";


export default function HeroHome() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-primary-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Automatize sua cidade. Simplifique sua gestão.
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-primary-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                A diferença entre um servidor comum e uma cidade profissional
                está na tecnologia que o comanda — e essa tecnologia é Rexie.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-4 w-full bg-linear-to-t from-primary-600 to-primary-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="/signup"
                  >
                    <span className="relative inline-flex items-center">
                      Comece agora!
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Imagem do banner (substituindo o vídeo) */}
          <div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl shadow-lg"
            data-aos="fade-up"
            data-aos-delay={500}
          >
            <Image
              src={BannerImage}
              alt="Banner Rexie"
              width={2502}
              height={950}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
