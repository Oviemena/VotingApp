"use client";

import { useFormStatus } from "react-dom";
import { FaPaperPlane } from "react-icons/fa";

export function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <button
      aria-disabled={pending}
      type="submit"
      className=" group flex h-[3rem] w-full bg-gray-900 text-white rounded-full outline-none transition-all items-center justify-center gap-2  hover:bg-gray-950  "
    >
      {pending ? (
        <div className="animate-spin h-5 w-5 border-b-2 rounded-full border-white"></div>
      ) : (
        <>
          Register{" "}
          <FaPaperPlane className="text-xs opacity-70 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 " />{""}
        </>
      )}
    </button>
  );
}
