export default function LandingFeatures() {
  return (
    <>
      {/* ================= WHO IS BOXARENA FOR ================= */}
      <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-extrabold text-white mb-4">
            Who Is BoxArena For?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-14">
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
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 
                rounded-2xl p-8 text-left hover:border-indigo-500/50 
                transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-indigo-400">✔</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE BOXARENA ================= */}
      <section className="py-24 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-extrabold text-gray-100 mb-3">
            Why Choose BoxArena?
          </h2>
          <p className="text-gray-600 mb-16">
            Everything you need to book, play, and manage sports effortlessly
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
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
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm 
                hover:shadow-xl transition-all duration-300 
                hover:-translate-y-2 border"
              >
                <div className="w-12 h-12 flex items-center justify-center 
                bg-indigo-100 text-indigo-600 rounded-xl mb-4 text-xl">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
