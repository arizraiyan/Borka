import React from 'react';
import { X } from 'lucide-react';

const SIZE_ROWS = [
  { size: '50', heightCm: '150 – 155 cm', heightFt: "4'11\" – 5'1\"", lengthIn: '50"', chestIn: '42"' },
  { size: '52', heightCm: '156 – 160 cm', heightFt: "5'2\" – 5'3\"", lengthIn: '52"', chestIn: '44"' },
  { size: '54', heightCm: '161 – 165 cm', heightFt: "5'4\" – 5'5\"", lengthIn: '54"', chestIn: '46"' },
  { size: '56', heightCm: '166 – 170 cm', heightFt: "5'6\" – 5'7\"", lengthIn: '56"', chestIn: '48"' },
  { size: '58', heightCm: '171 – 175 cm', heightFt: "5'8\" – 5'9\"", lengthIn: '58"', chestIn: '50"' },
  { size: '60', heightCm: '176 – 182 cm', heightFt: "5'10\" – 6'0\"", lengthIn: '60"', chestIn: '52"' },
];

export function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Abaya Size Guide"
    >
      <div className="fixed inset-0 bg-black/45" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white border border-[#EAEAEA] p-6 sm:p-8">
        <div className="flex items-start justify-between border-b border-[#EAEAEA] pb-4">
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-[#A88C70]">
              Atelier Measurements
            </p>
            <h2 className="mt-1 font-serif text-2xl text-[#242424]">
              Abaya &amp; Burqa Size Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="flex h-9 w-9 items-center justify-center text-[#777777] hover:text-[#242424]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-[#777777]">
          Traditional Gulf abaya sizing corresponds to garment length in inches measured from the
          shoulder to the hem. If you wear heels regularly, consider selecting one size up.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm tabular-nums">
            <thead>
              <tr className="border-b border-[#EAEAEA] bg-[#FFFFFF] text-[11px] uppercase tracking-wider text-[#777777]">
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Height (cm)</th>
                <th className="px-4 py-3 font-medium">Height (ft/in)</th>
                <th className="px-4 py-3 font-medium">Garment Length</th>
                <th className="px-4 py-3 font-medium">Chest Sweep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {SIZE_ROWS.map((row) => (
                <tr key={row.size} className="hover:bg-[#FFFFFF]/60">
                  <td className="px-4 py-3 font-semibold text-[#242424]">{row.size}</td>
                  <td className="px-4 py-3 text-[#242424]">{row.heightCm}</td>
                  <td className="px-4 py-3 text-[#777777]">{row.heightFt}</td>
                  <td className="px-4 py-3 text-[#242424]">{row.lengthIn}</td>
                  <td className="px-4 py-3 text-[#777777]">{row.chestIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
