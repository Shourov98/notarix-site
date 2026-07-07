export default function TrustCTA() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#4169e1] rounded-[40px] py-20 px-8 md:px-16 text-center text-white shadow-2xl shadow-blue-200">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Experience Secure Notarization?
          </h2>
          <p className="text-blue-50 text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join the businesses and individuals who trust Notarix for their most important legal documents.
          </p>
          <a
            href="/request-access"
            className="inline-block bg-white text-[#1a4fdb] px-8 md:px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Secure Notary Process Today
          </a>
        </div>
      </div>
    </section>
  );
}
