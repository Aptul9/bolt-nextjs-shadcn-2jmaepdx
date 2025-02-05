# Important
Do not create any .env.local file, there will be no way to not include them in the build, always give different names

# Supabase

## Run Supabase locally

per runnare supabase localmente procedere come segue:
https://supabase.com/docs/guides/self-hosting/docker
Get the code
    git clone --depth 1 https://github.com/supabase/supabase
```
cd supabase/docker
cp .env.example .env
docker compose pull
docker compose up -d
```

Nota: serviranno tutti i file all'interno della suddetta cartella, non solo il docker compose e il .env, poichè vi sono dei file di configurazione già preimpsotati all'interno.

<span  style="color: red;">Bug</span>: normalmente il **pooler si riavvia** da solo, per evitare che ciò avvenga, dobbiamo andare all'interno della cartella /volumes/pooler e selezionare il file pooler.exs, successivamente in basso a destra su vscode, possiamo selezionare l'end of line sequence, che sarà CRLF, clickiamoci sopra e selezioniamo LS.

  

## Connect to services

Per connettersi al servizio useremo Kong. Procediamo quindi ad andare su localhost:8000, questo sarà lo stesso indirizzo che dovremo inserire all'interno del nostro .env file per node al fine di modificare la stringa di connessione al database.
Successivamente, le credenziali di accesso saranno quelle definite all'interno del nostro .env file, di conseguenza:
> DASHBOARD_USERNAME=supabase
> DASHBOARD_PASSWORD=this_password_is_insecure_and_should_be_updated

all'interno del file troviamo tutt le altre credenziali che ci serviranno per accedere ai vari servizi, compresa la anon key, ecc.

# Docker

## Docker Build

To run and build this application we will be using dockerfiles.
All the scripts that we can use to build and run can be found inside the `/scripts` folder.

## Supabase Docker
We are using supabase docker sample from the official script, just replacing the .env file with our personal one.
https://github.com/supabase/supabase/tree/master/docker
The repository has been cloned with a sparse checkout approach, all the commands can be found inside the `/scripts` folder.

# Emails
The email workflow is the following:
1) We moved the DNS of the custom domain to Cloudflare.
2) We added a Catch-All and a Custom address (team@domain.it) (do to this the domain needs to be verified first)
3) Added destination address: from team@domain.it > myemail@gmail.com
4) Generated and added the Resend key, then set it up on the DNS and on Custom sender on Gmail as well Guide: https://cleanclip.cc/developer/cloudflare-worker-gmail-resend-enterprise-email/#_3-2-fill-in-the-name-and-the-account-for-sending-emails

#### In conclusion:
If we receive an email, it gets forwarded to our custom email
If we want to send en email, it will be sent through Resend using our Custom Domain

# Icons
Icon used to generate: https://realfavicongenerator.net/favicon-generator/nextjs
To check we can run:
`npx realfavicon check 3000`
There are still some issues with dark icons and stuff, might need to resolve

# Robots
We have used the `next-sitemap` module. We can define paths in the `next-sitemap.config.js` file in the root directory.
We have added some paths to disallow or exclude from the scraper. Then a public/robots.txt and other sitemap files will be generated.
To avoid the footer from being scraped we have added `data-nosnippet`:
```
<footer
    className="border-t bg-background/60 backdrop-blur-md"
    data-nosnippet
>
```

# Swagger
To generate the swagger we have used https://www.npmjs.com/package/next-swagger-doc
And followed the documentation.
To add a swagger to an API we need to add something like this:
```
/**
 * @swagger
 * /api/healthcheck:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
 ```

 We can then visit the /api-doc/ page. This might need to be implemented for more APIs, as the time of writing it is used only for healthcheck.