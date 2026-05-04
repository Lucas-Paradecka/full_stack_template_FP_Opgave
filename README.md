# Fairplan Frontend MVP.

Dette er en frontend-MVP lavet til hjemmeopgaven for Fairplan.

Løsningen er bygget med React og TypeScript og tager udgangspunkt i den udleverede full stack template. Fokus har været hurtig eksekvering, brugervenlighed, struktur, validering og de vigtigste domæneregler.

## Afgrænsning.

Opgaven er afgrænset til frontend-delen.

Backend, login og database er ikke implementeret i denne version, da backend fremgår som valgfrit i opgavebeskrivelsen, og løsningen er aftalt som en frontend-MVP.

Data håndteres som mock data i React state. Datastrukturen er dog opdelt i typer, initial data og valideringsfunktioner, så data-laget senere kan erstattes af et REST API.

## Implementeret funktionalitet.

- Venstremenu med de beskrevne sider.
- Tabelvisninger.
- CRUD for brugere.
- CRUD for afsnit.
- CRUD for personalegrupper.
- CRUD for vagtlag.
- CRUD for ansættelser.
- Read-only personalevisning baseret på ansættelser.
- Søgning, filtrering og sortering på personalesiden.
- Tydelige fejlbeskeder ved valideringsfejl.
- Reset-knap til demo-data.

## Domæneregler.

Følgende regler er implementeret:

- Navn er påkrævet for brugere, afsnit, personalegrupper og vagtlag.
- E-mail er påkrævet for brugere.
- E-mail skal være unik.
- En bruger kan have rollen Admin og/eller Personale.
- Ved sletning af en bruger slettes brugerens tilknyttede ansættelser.
- Afsnit kan ikke slettes, hvis det bruges i en ansættelse.
- Personalegrupper kan ikke slettes, hvis de bruges i en ansættelse.
- Vagtlag kan ikke slettes, hvis de bruges i en ansættelse.
- Ansættelser kan kun oprettes for brugere med rollen Personale.
- Timer pr. uge skal være et heltal mellem 0 og 37.
- Startdato og slutdato er påkrævet.
- Slutdato skal være efter startdato.
- Ansættelsesperioder må ikke overlappe for samme person.

## Struktur.

De vigtigste filer ligger i `frontend/app`:
app/
  components/
    Sidebar.tsx

  data/
    initialData.ts

  pages/
    UsersPage.tsx
    DepartmentsPage.tsx
    StaffGroupsPage.tsx
    ShiftLayersPage.tsx
    EmploymentsPage.tsx
    PersonnelPage.tsx
    PeriodsPage.tsx

  types/
    domain.ts

  utils/
    validation.ts

  routes/
    home.tsx