# COMMENTS

Na některé věci použit ChatGPT a RepoPrompt, jelikož je mnohem rychlejší některé věci nechat vygenerovat, než to psát.
Na některých věcech jsem propálil více času, abych si na tom dal záležet, než abych to stihl za co nejrychlejší dobu.
Podle konkretního zádaní a dalších okolností bych řešil rozložení času individuálně.

## Login

Vyřešeno pouze přes state, jelikož nemáme žadný token nebo session. Řešil bych jinak.

## Add to Calendar

Otestová pouze GC - proto přídán pouze on. Jinak bych přidal i další. Nechtěl jsem pálit další čas testovaním ics/outlook.

## Types

Zaleží na typu projektu, někde bych dělal samostané d.ts soubory, ale jsem zvyklý na global types, jelikož je nemusím importovat.
Rozepisování types by šlo udělat lépe tím, že by se vytvořil nový type, než to drillovat.

## Fetch

Podle toho jaká data by bylo potřeba tahat z API, tak bych zvolil třeba TanStack Query, ale spíš jsem ji nikdy moc nepoužval.
Hodilo by se taky to projet přes zod nebo podobnou knihovnu a vyřešit error handling při res.statu trošku jinak.

## Aria

Nepřídával jsem skoro žádné attributes, v produkční aplikaci by měli 100% být.
Asi bych také možná volil jinou knihovnu, než shad/cn, pokud by byl velký důraz na accessibility.

## Store

Zbytečně překombinovný store na toto demo i celkově na tento typ view/stránky, ale chtěl jsem ukázat, jak pracuju se state managementem.
Normálně by každý slice měl mnohem víc values/actions. Dříve jsem používal Recoil, ale ten je deprecated, takže jedu Zustand.
Zoov celkem pomáhá na komplexní state managment, ale přijde mi, že tam není aktivní development.

## Aside

Asi bych volil jiný elemnt, jelikož to na menším screenu není vlastně aside. Zjistěno teď při finalizaci UI.

## useDidMountEffect

Používám, abych neměl při `StrictMode` dvoje data.
Zárovň se to hodí v situaci, když chcem měnit např. state, až poté, co se opravdu změní a ne při mountu.
Nakonec jsem vyměnil za klasicky useEffect, jelikož to nějak blbne v kombinaci Cloudflare Worker + Vite.

## Lang

Data z API jsem nepřekádal.

## Forms

Neřešil jsem pořádně validaci a například v "Checkout now" to není ani form. Validaci bych řešil třeba přes RHF.

## Deploy

Cloudlfare Workers <3 jelikož používám většinou buď Astro nebo Hono.