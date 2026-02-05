import ScrollReveal from "./ScrollReveal";

export default function LandingFeatures() {
  return (
    <>
      {/* ================= WHO IS BOXARENA FOR ================= */}
      <section className="py-28 bg-gradient-to-b from-gray-900/95 via-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.03)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

          <span className="inline-block text-indigo-400/90 text-sm font-medium tracking-wider uppercase mb-4">
            Built for Everyone
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Who Is BoxArena For?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
            A complete sports ground booking platform designed for everyone involved.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Players",
                points: [
                  "Book game slots instantly",
                  "Discover nearby grounds",
                  "Manage & reschedule bookings",
                ],
                icon: "🏃‍♂️",
              },
              {
                title: "Ground Owners",
                points: [
                  "Manage grounds easily",
                  "Control pricing & slots",
                  "Track bookings in real-time",
                ],
                icon: "🏟️",
              },
              {
                title: "Admins",
                points: [
                  "Approve grounds & games",
                  "Monitor platform activity",
                  "Manage users & bookings",
                ],
                icon: "🛠️",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
              <div
                className="group bg-white/[0.04] backdrop-blur-xl border border-white/10 
                rounded-2xl p-8 text-left hover:border-indigo-500/40 
                transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-4 hover:shadow-2xl hover:shadow-indigo-500/5"
              >
                <div className="text-4xl mb-5 transition-transform duration-500 group-hover:scale-110">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="flex gap-2 group-hover:text-gray-300 transition-colors duration-500">
                      <span className="text-indigo-400 shrink-0">✔</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE BOXARENA ================= */}
      <section className="py-28 bg-gray-950 text-white relative">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <span className="inline-block text-indigo-400/90 text-sm font-medium tracking-wider uppercase mb-4">
            The Complete Solution
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 mb-3 tracking-tight">
            Why Choose BoxArena?
          </h2>
          <p className="text-gray-500 mb-16 text-lg max-w-xl mx-auto">
            Everything you need to book, play, and manage sports effortlessly
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
            {[
              {
                title: "Instant Booking",
                desc: "Book your slot in seconds. No calls, no waiting.",
                icon: "📅",
              },
              {
                title: "Team Management",
                desc: "Create teams, add players & manage squads.",
                icon: "👥",
              },
              {
                title: "Score Tracking",
                desc: "Track match scores and performance history.",
                icon: "🏆",
              },
              {
                title: "Verified Grounds",
                desc: "All grounds verified with accurate facility info.",
                icon: "✅",
              },
              {
                title: "Flexible Slots",
                desc: "Morning to night slots that fit your schedule.",
                icon: "⏰",
              },
              {
                title: "Easy Payments",
                desc: "Secure online payments with instant confirmation.",
                icon: "💳",
              },
            ].map((f, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 70}>
              <div
                className="bg-white rounded-2xl p-8 shadow-lg 
                hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] 
                hover:-translate-y-3 hover:scale-[1.02] border border-gray-100/50"
              >
                <div className="w-14 h-14 flex items-center justify-center 
                bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-xl mb-5 text-2xl transition-transform duration-500 group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
