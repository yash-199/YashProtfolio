import React from 'react';

const slideText = [
  "Responsive", "Dynamic", "Scalable", "Interactive",
  "Secure", "Reliable", "Engaging", "Accessible", "UI/UX",
  "Responsive", "Dynamic", "Scalable", "Interactive",
  "Secure", "Reliable", "Engaging", "Accessible", "UI/UX"
];

const CrossText = () => {
  return (
    <div className="relative -top-24 text-white py-20 overflow-hidden">
      {/* Slanted background strip */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-6 bg-gradient-to-r from-[#6799fe] to-[#0a255b] py-6 opacity-60 md:rotate-3 lg:py-10" />

      {/* Foreground text strip */}
      <div className="relative flex flex-wrap justify-between gap-4 bg-gradient-to-r from-[#6799fe] to-[#0255fb] -rotate-2 px-8 py-6">
        <div className="group bg-transparent flex overflow-hidden p-2 [--duration:50s] [--gap:1rem] [gap:var(--gap)] flex-row [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex bg-transparent shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row">
            {slideText.map((item, index) => (
              <div key={index} className='bg-transparent inline-flex items-center gap-2.5'>
                <span

                  className="text-nowrap font-instrument-serif font-semibold text-gray-50 text-sm uppercase leading-6 tracking-wider md:text-lg lg:text-xl bg-transparent"
                >
                  {item}
                </span>
                <svg className='bg-transparent' fill="#fffff5" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>Star</title><path d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z" fill="#fffff5"></path></svg>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossText;
