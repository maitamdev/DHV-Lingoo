import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-cyan-950/20 px-4 py-8 sm:py-12">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 -left-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
            </div>
            <RegisterForm />
        </div>
    );
}
