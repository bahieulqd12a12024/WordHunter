/* eslint-disable @next/next/no-html-link-for-pages */
import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* <div
        className="
        bg-blue
        grotesk
        absolute
        top-0
        h-7
        w-full 
        text-center
        text-sm
        leading-6
        text-white
      "
      >
        Scelerisque egestas et euismod.
        <a href="/" className="pl-3 underline">
          Take me there
        </a>
      </div> */}
      <div className="grotesk mt-6 mb-16 flex items-center justify-between py-4 px-4 sm:mx-0 sm:mb-20 sm:px-0 md:px-6">
        <div className="mt-4 inline-block pb-4 pl-8">
          <a href="/" className="align-middle text-3xl font-bold text-black">
            VocabHunter
          </a>
          {/* <div className="hidden pl-14 align-middle xl:inline-block">
            <a href="/" className="pr-12 text-xl text-black">
              Cras.
            </a>
            <a href="/" className="pr-12 text-xl text-black">
              Cras.
            </a>
            <a href="/" className="pr-12 text-xl text-black">
              Fringilla.
            </a>
            <a href="/" className="text-xl text-black">
              Enim.
            </a>
          </div> */}
        </div>
        <div className="flex items-center">
          <div className="py-1 text-right inline-block">
            <Link className="mt-2 inline-flex items-center px-12 py-3 text-lg font-semibold tracking-tighter text-black " 
            href="/LoginPage"
            >
              Log in
            </Link>
            <Link
              className="bg-blue mt-2 inline-flex items-center px-8 py-3 text-lg font-semibold tracking-tighter text-white"
              href="/RegisterPage"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
