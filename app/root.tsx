import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json,
  type LoaderFunctionArgs,
  type LinksFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next/react";
import { Toaster } from "@/components/ui/toaster";
import styles from "./tailwind.css";
import i18next from "./i18next.server";
import { useTranslation } from "react-i18next";

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      href: "/locales/es-ES/translation.json",
      as: "fetch",
      type: "application/json",
      crossOrigin: "anonymous" as const,
    },
    {
      rel: "preload",
      href: "/locales/en-US/translation.json",
      as: "fetch",
      type: "application/json",
      crossOrigin: "anonymous" as const,
    },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: "https://fonts.cdnfonts.com/css/lexend-deca" },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let locale = await i18next.getLocale(request);

  return json({
    locale,
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
      STRAPI_HOST: process.env.STRAPI_HOST,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    },
  });
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "translation",
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const { locale } = data;
  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script src="/vendors/pdf.min.mjs" type="module" />
        <script
          async
          src={`https://www.googletagmanager.com/gtm.js?id=${data.ENV.GA_TRACKING_ID}`}
        />
        <script
          async
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${data.ENV.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
      </head>
      <body>
        <Outlet />
        <Toaster />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
      </div>
    );
  }
  if (error instanceof Error) {
    return (
      <main>
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      </main>
    );
  }
  return <h2 className="text-center">Oops! Something went really bad!</h2>;
}
