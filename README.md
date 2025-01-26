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