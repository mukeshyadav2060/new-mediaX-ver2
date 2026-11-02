import { Head, Html, Main, NextScript } from "next/document"

// Lives inline so content never stays hidden if the app bundle fails to load.
const reveal = `(function(){var d=document.documentElement;if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){window.__reveal=function(){};return}d.classList.add('js');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});window.__reveal=function(){document.querySelectorAll('[data-r]:not(.in)').forEach(function(el){io.observe(el)})};addEventListener('load',function(){setTimeout(window.__reveal,1500)})})()`

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/mark.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#ffffff" />
        <script dangerouslySetInnerHTML={{ __html: reveal }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
