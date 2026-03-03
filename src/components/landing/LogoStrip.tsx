// LogoStrip section - technology partner logos
import Image from "next/image";

const logos = [
    { src: "/images/logo-1.svg", name: "EduCorp" },
    { src: "/images/logo-2.svg", name: "LangTech" },
    { src: "/images/logo-3.svg", name: "SkillUp" },
    { src: "/images/logo-4.svg", name: "LearnBox" },
    { src: "/images/logo-5.svg", name: "WordFlow" },
];

export default function LogoStrip() {
    return (
        <section className="py-8 sm:py-12 border-y bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground mb-6 sm:mb-8 tracking-wide uppercase">
                    Được tin dùng bởi giảng viên & học viên tại
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 sm:gap-8 md:gap-16 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((logo, i) => (
                        <div
                            key={logo.name}
                            className={`flex items-center hover:opacity-100 transition-opacity ${i >= 3 ? 'hidden sm:flex' : ''}`}
                        >
                            <Image
                                src={logo.src}
                                alt={logo.name}
                                width={140}
                                height={40}
                                className="h-6 sm:h-8 w-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
