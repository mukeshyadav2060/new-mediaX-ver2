# MediaX web (public site)

The whole MediaX site in the new design, with no accounts and no dashboard. Every page is static, at the same address it had on the old site.

Run these from inside this folder. Needs Node 20.9 or newer.

    npm install
    npm run dev        # http://localhost:8082

`npm run build` writes the finished site to `out/`, which any static host can serve.

## Publishing new content

Blogs, newsroom articles and every other CMS page are copied into this project, so the live site doesn't call the CMS to show them. After publishing in the CMS:

    npm run snapshot   # reads the CMS, only downloads what is new
    npm run build      # then deploy out/

Nothing new appears on the site until you do this. The address comes from `NEXT_PUBLIC_STRAPI_API_URL` in the `.env` of the folder above.

The snapshot rewrites `lib/cms.json`, `content/`, `public/media/`, `public/sitemap.xml`, `public/robots.txt`, `public/_redirects` and `redirects.json`, so don't edit those by hand.

## Forms

**All forms are off until you set the CMS address when building**, so a local preview can't send anything real. They show a message with the contact email instead.

    NEXT_PUBLIC_STRAPI_API_URL=https://your-cms-address

| Page | Sends to |
|---|---|
| Submit press release | CMS `/api/orders/custom-create`, then the checkout address it returns |
| Payment success, payment cancel, order tracking | CMS `/api/orders/<id>` |
| Contact, Best crypto PR agency | CMS `/api/contacts` |
| Verify team | CMS `/api/team/verify` |
| Crypto press release, Drop press release | EmailJS, on the old site's account |
| Payment | Fixed NOWPayments links, listed in `pages/payment.js` |

The site's address must be allowed by the CMS's CORS settings for these to work.

## What the host must do

`out/` is plain files, so three things are the host's job. Netlify and Cloudflare Pages read `_redirects` and do all of this. On any other host, set them up by hand:

1. **Clean addresses:** serve `/pricing` from `pricing.html`.
2. **Redirects:** apply the 301s in `redirects.json`. They keep the old site's redirects and old article addresses working.
3. **Order tracking:** serve `order.html` for every `/order/<id>` address. In `npm run dev`, use `/order?id=<id>` instead.

The old site also set security headers (CSP, HSTS and others) in its Next config. A static site can't set these itself, so add them at the host.

Google Tag Manager only loads on mediax.agency.

## Where things are

- `pages/`: one file per page or page type
- `components/Site.js`: header, footer and SEO tags. `Sections.js`: the shared page sections. `Posts.js`: lists and articles. `Forms.js`: the shared forms
- `lib/data.js`: small content every page can use. `lib/content.js`: articles and pages, for build time only
- `styles/`: `globals.css` for tokens, `site.module.css` for everything else
