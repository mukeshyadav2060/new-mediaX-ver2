# MediaX web (public site)

The MediaX marketing site with no accounts and no dashboard, working the way the old site did: anyone can pick a package, fill in the order form and go to checkout.

Run these from inside this folder. Needs Node 20.9 or newer.

    npm install
    npm run dev        # http://localhost:8082

`npm run build` writes a static site to `out/`, which any static host can serve.

## How ordering works

1. A plan button opens `/submit-press-release/?package=<id>` with that package selected.
2. The form posts to `/api/orders/custom-create` on the CMS, as the old site did.
3. The visitor goes to the `checkoutUrl` it returns.
4. Checkout sends them back to `/payment-success/?orderId=<id>` or `/payment-cancel/?orderId=<id>`, which read the order from the CMS.

**Orders are off until you set the CMS address**, so a local preview can't create real orders:

    NEXT_PUBLIC_STRAPI_API_URL=https://your-cms-address

The value is built into the site, so set it before `npm run build`.

## Where things are

- `pages/`: one file per page
- `lib/cms.json` and `public/media/`: a snapshot of the old site's CMS content and images, made by `scripts/snapshot-cms.cjs`
- `lib/data.js`: reads that snapshot
- `lib/orders.js`: the calls to the CMS for orders
- `styles/`: `globals.css` for tokens, `site.module.css` for everything else

## Before launch

- Blog cards link to the old site's post pages, so bring those pages over or keep the old URLs live
- Step 4's text in `lib/cms.json` was changed by hand to remove a mention of a dashboard. Running the snapshot script again brings the old text back
